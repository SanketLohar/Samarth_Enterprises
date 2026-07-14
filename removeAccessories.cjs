const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

async function removeAccessories() {
  try {
    const productsRef = db.collection('products');
    // Fetch all products where category is 'accessories' or 'Accessories'
    const snapshot1 = await productsRef.where('category', '==', 'accessories').get();
    const snapshot2 = await productsRef.where('category', '==', 'Accessories').get();

    const batch = db.batch();
    let count = 0;

    snapshot1.docs.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });

    snapshot2.docs.forEach((doc) => {
      // Avoid duplicate deletes if any
      if (!snapshot1.docs.some(d => d.id === doc.id)) {
        batch.delete(doc.ref);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`Deleted ${count} accessories from Firestore.`);
    } else {
      console.log("No accessories found to delete.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to delete accessories:", error);
    process.exit(1);
  }
}

removeAccessories();
