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

async function fixImagePaths() {
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
      const newImagePath = `/images/${data.name}.jpg`;
      
      batch.update(doc.ref, {
        image: newImagePath
      });
      updateCount++;
    });

    await batch.commit();
    console.log(`Successfully updated image paths for ${updateCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Path correction failed:", error);
    process.exit(1);
  }
}

fixImagePaths();
