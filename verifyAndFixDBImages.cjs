const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

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

async function verifyAndFixDBImages() {
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
      const expectedPath = `/images/${slugify(data.name)}.jpg`;
      
      // We force update everything to be absolutely certain no spaces or weird characters exist.
      if (data.image !== expectedPath) {
        console.log(`Mismatch found! Updating: ${data.image} -> ${expectedPath}`);
        batch.update(doc.ref, {
          image: expectedPath
        });
        updateCount++;
      }
    });

    if (updateCount > 0) {
      await batch.commit();
      console.log(`Successfully hard-normalized database paths for ${updateCount} products.`);
    } else {
      console.log("All targeted products already have perfectly normalized paths!");
    }
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verifyAndFixDBImages();
