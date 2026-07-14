const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const imagesDir = path.join(__dirname, 'public', 'images');

const targetCategories = [
  "Inline Filters",
  "Automatic Water Level Controller",
  "ScaleFree Range",
  "Multiport Valve"
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

async function normalizePaths() {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.where('category', 'in', targetCategories).get();
    
    if (snapshot.empty) {
      console.log('No matching documents found.');
      process.exit(0);
    }

    const batch = db.batch();
    let updateCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Calculate original filename from the current database state (or the product name)
      // The user mentioned the current state is e.g. "/images/ORG Inline GAC Welded.jpg"
      const productName = data.name;
      
      // Attempt to find files that match the name ignoring case/extension first,
      // or just assume the files are exactly named as they were requested.
      // Let's read all files and find one that matches the product name
      const allFiles = fs.readdirSync(imagesDir);
      
      let matchedFile = null;
      for (const file of allFiles) {
        // basic match removing extension
        const baseName = path.parse(file).name;
        if (baseName.toLowerCase() === productName.toLowerCase() || 
            slugify(baseName) === slugify(productName) ||
            baseName.toLowerCase().replace(/[^a-z0-9]/g, '') === productName.toLowerCase().replace(/[^a-z0-9]/g, '')) {
          matchedFile = file;
          break;
        }
      }

      if (matchedFile) {
        const oldPath = path.join(imagesDir, matchedFile);
        const newFileName = slugify(productName) + '.jpg';
        const newPath = path.join(imagesDir, newFileName);
        
        if (oldPath !== newPath) {
          try {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${matchedFile} -> ${newFileName}`);
          } catch (e) {
            console.error(`Error renaming ${matchedFile}:`, e.message);
          }
        }
        
        batch.update(doc.ref, {
          image: `/images/${newFileName}`
        });
        updateCount++;
      } else {
        // Even if file not found locally (maybe already renamed or missing), update DB to expected slug
        const expectedName = slugify(productName) + '.jpg';
        batch.update(doc.ref, {
          image: `/images/${expectedName}`
        });
        console.log(`File not found for ${productName}, but updated DB to /images/${expectedName}`);
        updateCount++;
      }
    });

    await batch.commit();
    console.log(`Successfully normalized filesystem and updated database for ${updateCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Normalization failed:", error);
    process.exit(1);
  }
}

normalizePaths();
