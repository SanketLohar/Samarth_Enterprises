const admin = require('firebase-admin');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

const newAccessories = [
  {
    name: "Brine Tank 25L",
    description: "High-capacity brine tank for water softeners.",
    category: "accessories",
    price: 1500,
    stock: 20,
    image: "brine-tank-25l.svg",
    hidden: false,
    featured: false
  },
  {
    name: "Digital Chemical Dosing Tank",
    description: "Precision chemical dosing tank for industrial water treatment.",
    category: "accessories",
    price: 3500,
    stock: 15,
    image: "digital-dosing-tank.svg",
    hidden: false,
    featured: false
  },
  {
    name: "Float Switch Assembly",
    description: "Reliable float switch for automatic water level control.",
    category: "accessories",
    price: 450,
    stock: 50,
    image: "float-switch-assembly.svg",
    hidden: false,
    featured: false
  },
  {
    name: "Flow Restrictor & TDS Kit",
    description: "Flow restrictor and TDS adjustment kit for RO systems.",
    category: "accessories",
    price: 250,
    stock: 100,
    image: "flow-resistor-tds.svg",
    hidden: false,
    featured: false
  }
];

async function addAccessories() {
  try {
    const productsRef = db.collection('products');
    let added = 0;
    for (const item of newAccessories) {
      // Create a clean ID
      const customId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const docRef = productsRef.doc(customId);
      
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        await docRef.set({
          id: customId,
          ...item,
          createdAt: FieldValue.serverTimestamp()
        });
        console.log(`Added: ${item.name}`);
        added++;
      } else {
        console.log(`Already exists: ${item.name}`);
      }
    }
    console.log(`Finished adding ${added} accessories.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to add accessories:", error);
    process.exit(1);
  }
}

addAccessories();
