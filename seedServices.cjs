const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const professionalServices = [
  {
    name: "Installation Service",
    description: "Professional setup and calibration for all domestic and commercial water purifiers, softeners, and treatment plants.",
    price: 500,
    hidden: false
  },
  {
    name: "Filter Replacement",
    description: "Genuine OEM filter and RO membrane replacements to restore peak purification performance.",
    price: 350,
    hidden: false
  },
  {
    name: "Annual Maintenance Contract (AMC)",
    description: "Comprehensive year-round coverage including periodic servicing, free filter changes, and priority support.",
    price: 2500,
    hidden: false
  },
  {
    name: "Repair & Maintenance",
    description: "On-demand troubleshooting and diagnostics for low pressure, leaks, or electrical failures in any water treatment system.",
    price: 400,
    hidden: false
  }
];

async function seedServices() {
  try {
    const servicesRef = db.collection('services');
    
    // Wipe out the existing services to enforce the strict matrix
    const snapshot = await servicesRef.get();
    const batchDelete = db.batch();
    snapshot.forEach(doc => {
      batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();
    console.log(`Purged ${snapshot.size} legacy services.`);

    // Inject new exact service profiles
    const batchSet = db.batch();
    professionalServices.forEach((service, index) => {
      const docRef = servicesRef.doc(`service_${index + 1}`);
      batchSet.set(docRef, {
        id: docRef.id,
        ...service,
        createdAt: FieldValue.serverTimestamp()
      });
    });
    
    await batchSet.commit();
    console.log("Live Service Matrix successfully realigned!");
    process.exit(0);
  } catch (error) {
    console.error("Operation failed:", error);
    process.exit(1);
  }
}

seedServices();
