const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

async function migrateTechIds() {
  try {
    const techSnap = await db.collection('technicians').get();
    
    let migratedCount = 0;
    
    for (const techDoc of techSnap.docs) {
      const tech = techDoc.data();
      const newId = techDoc.id;
      const oldUid = tech.uid;
      
      if (oldUid && oldUid !== newId) {
        console.log(`Migrating tech ${tech.name}: ${oldUid} -> ${newId}`);
        
        // 1. Update Enquiries
        const enqSnap = await db.collection('enquiries').where('assignedToId', '==', oldUid).get();
        for (const enqDoc of enqSnap.docs) {
          await enqDoc.ref.update({ assignedToId: newId });
        }
        console.log(`  Updated ${enqSnap.docs.length} enquiries.`);

        const enqSnap2 = await db.collection('enquiries').where('technicianId', '==', oldUid).get();
        for (const enqDoc of enqSnap2.docs) {
          await enqDoc.ref.update({ technicianId: newId });
        }
        
        // 2. Update Services
        const servSnap = await db.collection('services').where('assignedTechnicianId', '==', oldUid).get();
        for (const servDoc of servSnap.docs) {
          await servDoc.ref.update({ assignedTechnicianId: newId });
        }
        console.log(`  Updated ${servSnap.docs.length} services.`);
        
        // 3. Remove UID from tech doc
        await techDoc.ref.update({ uid: FieldValue.delete() });
        migratedCount++;
      }
    }
    
    console.log(`Migration complete. Updated ${migratedCount} technicians.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateTechIds();
