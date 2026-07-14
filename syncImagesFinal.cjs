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

// The source folder where the user accidentally placed the images
const sourceImagesDir = path.join(__dirname, '..', 'samarth enterprise 1', 'public', 'images');
const destImagesDir = path.join(__dirname, 'public', 'images');

const imageMapping = {
  "ORG Inline Sediment Welded Gold": "org-inline-sediment-welded-gold.jpg",
  "ORG Inline GAC Welded": "org-inline-gac-welded.jpg",
  "ORG Inline Sediment Openable Bottom Gold": "org-inline-sediment-openable-bottom-gold.jpg",
  "ORG Inline GAC Openable Bottom": "org-inline-gac-openable-bottom.jpg",
  "ORG Inline H2 AAA Openable Bottom": "org-inline-h2-aaa-openable-bottom.jpg",
  "ORG Inline H2 AAA + Copper Openable Bottom": "org-inline-h2-aaa-copper-openable-bottom.jpg",
  "ORG Inline H2 AAA + Zinc + Copper Openable Bottom": "org-inline-h2-aaa-zinc-copper-openable-bottom.jpg",
  "ORG Mini Inline H2 AAA Openable": "org-mini-inline-h2-aaa-openable.jpg",
  "ORG Mini Inline H2 AAA+Copper Openable": "org-mini-inline-h2-aaa-copper-openable.jpg",
  "Automatic Water Level Controller with Ceramic Ball Valve": "automatic-water-level-controller-ceramic-ball-valve.jpg",
  "ORG ScaleFree Antiscalant Bag": "org-scalefree-antiscalant-bag.jpg",
  "ORG RO ScaleFree": "org-ro-scalefree.jpg",
  "ORG COM-RO ScaleFree": "org-com-ro-scalefree.jpg",
  "ORG ScaleFree Appliances": "org-scalefree-appliances.jpg",
  "Shower Scalefree": "shower-scalefree.jpg",
  "ORG ScaleFree Tank": "org-scalefree-tank.jpg",
  "ORG Manual Filter Valve": "org-manual-filter-valve.jpg",
  "ORG Manual Softener Valve": "org-manual-softener-valve.jpg",
  "F Series Automatic Filter Valve For Ro System": "f-series-automatic-filter-valve.jpg",
  "R Series Automatic Filter Valve For Ro System": "r-series-automatic-filter-valve.jpg",
  "Q Series Automatic Filter Valve For Iron Removal & Media Filter": "q-series-automatic-filter-valve.jpg"
};

const targetCategories = [
  "Inline Filters",
  "Automatic Water Level Controller",
  "ScaleFree Range",
  "Multiport Valve"
];

async function syncAndFix() {
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
      const targetFileName = imageMapping[data.name];
      
      if (targetFileName) {
        // 1. Copy file from the other directory to the current workspace
        const sourceFile = path.join(sourceImagesDir, targetFileName);
        const destFile = path.join(destImagesDir, targetFileName);
        
        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, destFile);
          console.log(`Copied ${targetFileName} to current project.`);
        } else {
          console.log(`Warning: Source file not found: ${sourceFile}`);
        }
        
        // 2. Update Firestore document directly
        const expectedPath = `/images/${targetFileName}`;
        batch.update(doc.ref, {
          image: expectedPath
        });
        updateCount++;
      }
    });

    await batch.commit();
    console.log(`Successfully synced files and updated paths for ${updateCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Operation failed:", error);
    process.exit(1);
  }
}

syncAndFix();
