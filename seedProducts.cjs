const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// 1. Initialize Firebase Admin securely
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// 2. Optimized Parser matching the Agent's Expected Schema
function parseProductsFile() {
  const filePath = path.join(__dirname, 'src', 'data', 'info.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  try {
    return JSON.parse(fileContent);
  } catch (e) {
    console.log("info.txt is in text block format. Running enterprise block parser...");
  }

  const products = [];
  const blocks = fileContent.split('---');

  blocks.forEach(block => {
    if (!block.trim()) return;

    const lines = block.split('\n');
    const rawProduct = {};

    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const cleanKey = key.trim().toLowerCase();
        const cleanValue = valueParts.join(':').trim();
        rawProduct[cleanKey] = cleanValue;
      }
    });

    if (rawProduct.name) {
      const generatedId = rawProduct.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');

      let specsArray = [];
      if (rawProduct.specifications) {
        specsArray = rawProduct.specifications.split(',').map(s => s.trim());
      } else if (rawProduct.specs) {
        specsArray = rawProduct.specs.split(',').map(s => s.trim());
      }

      const formattedProduct = {
        id: rawProduct.id || generatedId,
        name: rawProduct.name,
        category: rawProduct.category || "Ro purifiers",
        image: rawProduct.image || "",
        description: rawProduct.description || rawProduct.info || "",
        specifications: specsArray,
        featured: rawProduct.featured === 'true' || rawProduct.featured === true,
        hidden: rawProduct.hidden === 'true' || rawProduct.hidden === true,
        tag: rawProduct.tag || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      products.push(formattedProduct);
    }
  });

  return products;
}

// 3. Clean and Batch Seed Data
async function seedDatabase() {
  try {
    const products = parseProductsFile();
    console.log(`Parsed ${products.length} products from info.txt. Connecting to Firestore...`);

    const batch = db.batch();
    const collectionRef = db.collection('products');

    // Clean out legacy placeholders safely
    batch.delete(collectionRef.doc('p1'));
    batch.delete(collectionRef.doc('p2'));

    products.forEach((product) => {
      const docRef = collectionRef.doc(product.id);
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log('Successfully cleared dummy entries and seeded real products into Firebase!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed: ', error);
    process.exit(1);
  }
}

seedDatabase();