const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

const newSofteners = [
  {
    name: "ORG Water Softener 10A",
    category: "autosoft",
    price: 35000,
    stock: 10,
    image: "org-water-softener-10a.jpg",
    hidden: false,
    featured: true,
    description: "Easy to install and ready to use. Elegant designed, cabinet type water softener. Fully automatic microprocessor-controlling operation. Display - current time, remaining soft water & current flow. Inbuilt brine tank, brine valve and float assembly. Can be use for bathroom, washing machine and dish washer.",
    specifications: [
      { key: "Model", value: "ORG Water Softener 10A" },
      { key: "Max. Flow Rate", value: "1000 LPH" },
      { key: "OBSA (Basis on 200 ppm)", value: "6000 Ltr" },
      { key: "OBR (Basis on 200 ppm)", value: "1500 Ltr" },
      { key: "Resin Tank Volume", value: "8 Ltr" },
      { key: "Resin Quantity", value: "6 Ltr" },
      { key: "Salt Tank Volume", value: "12 Ltr" },
      { key: "Salt Required / Regeneration", value: "1.2 kg" },
      { key: "Salt Qty.(OBSA) / No's of Regeneration", value: "4.5 kg / 5" },
      { key: "Working Pressure", value: "0.15 - 0.6 MPA" },
      { key: "Inlet-Outlet Size", value: "3/4\"" },
      { key: "Dimensions (mm)", value: "L230 X W380 X H600" }
    ]
  },
  {
    name: "ORG Water Softener Mini Pro / Nano Pro",
    category: "autosoft",
    price: 10299,
    stock: 25,
    image: "org-water-softener-mini-pro.jpg",
    hidden: false,
    featured: true,
    description: "Can be easily Install on wall and ready to use. Inbuilt brine tank with salt perforated bottom plate. No need to fill water manually in salt tank. Electricity not required. Incorporated multiport valve make easy backwash and regeneration. Can be use for bathroom, washing machine and dish washer. Upgraded Design: The new model features a sleek, modern design for enhanced aesthetics.",
    specifications: [
      { key: "Model", value: "ORG Softener Mini Pro / Nano Pro" },
      { key: "Max. Flow Rate", value: "600 LPH / 500 LPH" },
      { key: "OBSA (Basis on 200 ppm)", value: "6000 Ltr / 6250 Ltr" },
      { key: "OBR (Basis on 200 ppm)", value: "1500 Ltr / 625 Ltr" },
      { key: "Resin Tank Volume", value: "8 Ltr / 8 Ltr" },
      { key: "Resin Quantity", value: "6 Ltr / 2.5 Ltr" },
      { key: "Salt Tank Volume", value: "8 Ltr / 8 Ltr" },
      { key: "Salt Required / Regeneration", value: "0.9 kg / 0.375 Kg" },
      { key: "Salt Qty.(OBSA) / No's of Regeneration", value: "3.6 kg / 4 (Mini), 3.7 kg / 10 (Nano)" },
      { key: "Working Pressure", value: "0.15 - 0.6 MPA" },
      { key: "Inlet-Outlet Size", value: "1/2\"" },
      { key: "Dimensions (mm)", value: "L230 X W250 X H1050 / L230 X W250 X H760" }
    ]
  },
  {
    name: "ORG Bathroom Softener",
    category: "autosoft",
    price: 41499,
    stock: 5,
    image: "org-bathroom-softener.jpg",
    hidden: false,
    featured: true,
    description: "Elegant designed, cabinet type water softener. Fully automatic microprocessor-controlling operation. Can be easily install on wall and ready to use. Automatic OBR calculation & settings. Alarm - time to add salt. Leakage protection indicator. Display - current time, remaining soft water & current flow. Inbuilt brine tank, brine valve and float assembly. Can be use for bathroom, washing machine and dish washer.",
    specifications: [
      { key: "Model", value: "ORG Bathroom Softener" },
      { key: "Max. Flow Rate", value: "600 LPH" },
      { key: "OBSA (Basis on 200 ppm)", value: "8400 Ltr" },
      { key: "OBR (Basis on 200 ppm)", value: "1200 Ltr" },
      { key: "Resin Tank Volume", value: "6 Ltr" },
      { key: "Resin Quantity", value: "4.8 Ltr" },
      { key: "Salt Tank Volume", value: "8 Ltr" },
      { key: "Salt Required / Regeneration", value: "0.36 kg" },
      { key: "Salt Qty.(OBSA) / No's of Regeneration", value: "2.5 kg / 7" },
      { key: "Working Pressure", value: "0.15 - 0.5 MPA" },
      { key: "Inlet-Outlet Size", value: "1/2\"" },
      { key: "Dimensions (mm)", value: "L350 X W200 X H530" }
    ]
  }
];

async function run() {
  try {
    const productsRef = db.collection('products');
    
    // 1. Delete Kent Bathroom Water Softener
    const oldQuery = await productsRef.where('name', '==', 'Kent Bathroom Water Softener').get();
    let deletedCount = 0;
    for (const doc of oldQuery.docs) {
      await doc.ref.delete();
      deletedCount++;
    }
    console.log(`Deleted ${deletedCount} old Kent Bathroom Water Softener(s).`);

    // 2. Add the 3 new softeners
    let addedCount = 0;
    for (const item of newSofteners) {
      const customId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const docRef = productsRef.doc(customId);
      
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        await docRef.set({
          id: customId,
          ...item,
          createdAt: FieldValue.serverTimestamp()
        });
        console.log(`Added: ${item.name}`);
        addedCount++;
      } else {
        await docRef.set({
          id: customId,
          ...item,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`Updated: ${item.name}`);
      }
    }
    
    console.log("Database update complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error during DB update:", error);
    process.exit(1);
  }
}

run();
