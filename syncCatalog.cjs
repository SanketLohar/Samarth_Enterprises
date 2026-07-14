const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const legacyPurgeList = [
  "SteriBeam UV Module 11W",
  "Inline Carbon Filter 10",
  "Digital Chemical Dosing Tank",
  "Float Switch Assembly",
  "Brine Tank 25L",
  "Flow Restrictor & TDS Kit",
  "Non-Return Valve (NRV) 1/4",
  "Auto Multiport Control Valve",
  "Manual Multiport Valve",
  "TDS Controller Blending Valve",
  "Inline Carbon Filter 10\"",
  "Inline Sediment Filter 5 Micron",
  "Inline Alkaline Post-Filter"
];

const newProducts = [
  {
    "name": "ORG Inline Sediment Welded Gold",
    "category": "Inline Filters",
    "price": 599,
    "description": "High Quality Melt-blown Filter with integrated secure O-ring protection to completely isolate water mixing phases. Standard 1/4\" Quick Connection setup.",
    "image": "/images/org-inline-sediment-welded-gold.png",
    "features": ["High Quality Melt-blown Filter ID-19mm, OD-42mm, L-210mm", "O-ring protection from mixing of water", "1/4\" QC Connection"],
    "inStock": true
  },
  {
    "name": "ORG Inline GAC Welded",
    "category": "Inline Filters",
    "price": 599,
    "description": "High-efficiency coconut shell activated carbon inline filter with O-ring mixing seals for advanced purification filtration pipelines.",
    "image": "/images/org-inline-gac-welded.png",
    "features": ["High Quality Melt-blown ID-19mm, OD-42mm, L-210mm", "O-ring protection from mixing of water", "1/4\" QC Connection", "1100 IV Coconut Shell Activated Carbon"],
    "inStock": true
  },
  {
    "name": "ORG Inline Sediment Openable Bottom Gold",
    "category": "Inline Filters",
    "price": 599,
    "description": "11\" Openable, refillable, and highly reusable dynamic filter housing with structural melt-blown high-grade elements.",
    "image": "/images/org-inline-sediment-openable-bottom-gold.png",
    "features": ["11\" Openable, Refillable & Reusable Filter", "High Quality Melt-Blown Filter ID-19mm, OD-42mm, L-254mm"],
    "inStock": true
  },
  {
    "name": "ORG Inline GAC Openable Bottom",
    "category": "Inline Filters",
    "price": 599,
    "description": "Premium 1100 IV Coconut Shell Activated Carbon filter featuring a dynamic openable design for ongoing media servicing adjustments.",
    "image": "/images/org-inline-gac-openable-bottom.png",
    "features": ["1100 IV Coconut Shell Activated Carbon", "Openable Bottom Housing", "Premium Adsorption Matrix"],
    "inStock": true
  },
  {
    "name": "ORG Inline H2 AAA Openable Bottom",
    "category": "Inline Filters",
    "price": 1499,
    "description": "Advanced H2 AAA structured element chamber. 11\" Openable, refillable, and reusable setup featuring functional 1/4\" base inputs and outputs.",
    "image": "/images/org-inline-h2-aaa-openable-bottom.png",
    "features": ["11\" Openable, Refillable & Reusable", "1/4\" in-out Connection at bottom", "Alkaline Antibacterial Antioxidant Enrichment"],
    "inStock": true
  },
  {
    "name": "ORG Inline H2 AAA + Copper Openable Bottom",
    "category": "Inline Filters",
    "price": 1999,
    "description": "Dynamic multi-stage H2 AAA filtration housing fortified with Active Copper delivery media for comprehensive mineral dosing profiles.",
    "image": "/images/org-inline-h2-aaa-copper-openable-bottom.png",
    "features": ["11\" Openable, Refillable & Reusable", "1/4\" in-out Connection at Bottom", "Active Copper Bio-available Infusion"],
    "inStock": true
  },
  {
    "name": "ORG Inline H2 AAA + Zinc + Copper Openable Bottom",
    "category": "Inline Filters",
    "price": 2199,
    "description": "The ultimate active mineral formulation inline unit, integrating complete Hydrogen, Copper, and Zinc protection grids into an 11\" openable shell.",
    "image": "/images/org-inline-h2-aaa-zinc-copper-openable-bottom.png",
    "features": ["11\" Openable, Refillable & Reusable", "1/4\" In-Out Connection at Bottom", "Triple Element Active System (H2, Zn, Cu)"],
    "inStock": true
  },
  {
    "name": "ORG Mini Inline H2 AAA Openable",
    "category": "Inline Filters",
    "price": 799,
    "description": "Compact 4\" configuration of our H2 AAA active mineral framework. Features rapid push-fit structural connection lines.",
    "image": "/images/org-mini-inline-h2-aaa-openable.png",
    "features": ["4\" Openable, Refillable & Reusable", "1/4\" In-Out Push fit Connection"],
    "inStock": true
  },
  {
    "name": "ORG Mini Inline H2 AAA+Copper Openable",
    "category": "Inline Filters",
    "price": 889,
    "description": "Space-saving 4\" high-performance mineral inline block charging your purification pipeline with Active Copper enhancement media.",
    "image": "/images/org-mini-inline-h2-aaa-copper-openable.png",
    "features": ["4\" Openable, Refillable & Reusable", "1/4\" In-Out Push Fit Connection", "Active Copper Enrichment"],
    "inStock": true
  },
  {
    "name": "Automatic Water Level Controller with Ceramic Ball Valve",
    "category": "Automatic Water Level Controller",
    "price": 6699,
    "description": "A high-integrity problem-solving product designed for water storage tanks tied to active pressure pumps. Consists of a Motorised Ceramic Ball Valve (IP65 Rain-proof, 24V DC), a dynamic Wall-Mounted ABS Level Controller (230V AC Input), and a robust Floaty Switch setup.",
    "image": "/images/automatic-water-level-controller-ceramic-ball-valve.png",
    "features": ["Motorised Ceramic Ball Valve (24V DC, IP65 Design)", "Wall/Pipe Mount ABS Controller Module", "Floaty Switch (NO, C, NC Configs)", "Available sizing profiles: 1\", 1.5\", 2\""],
    "inStock": true
  },
  {
    "name": "ORG ScaleFree Antiscalant Bag",
    "category": "ScaleFree Range",
    "price": 25,
    "description": "High-grade slow-dissolving polyphosphate anti-scaling media bags. Available in modular incremental industrial dosing profiles.",
    "image": "/images/org-scalefree-antiscalant-bag.png",
    "features": ["Premium Polyphosphate Material", "Media Bag Packaging Configurations", "Available sizes: 10g, 100g, 200g, 500g, 1000g"],
    "inStock": true
  },
  {
    "name": "ORG RO ScaleFree",
    "category": "ScaleFree Range",
    "price": 299,
    "description": "Specially designed transparent ABS antiscalant housing to defend residential RO booster pumps, membranes, and flow restrictors against harsh water scaling. Refillable and clear for rapid capacity checks.",
    "image": "/images/org-ro-scalefree.png",
    "features": ["Max. Flow: 60 LPH | Max. Pressure: 4 kg/cm2", "Polyphosphate Media: 21 grams", "Openable, Refillable & Reusable Transparent ABS Housing", "Inlet Size: 1/4\" Quick Fit"],
    "inStock": true
  },
  {
    "name": "ORG COM-RO ScaleFree",
    "category": "ScaleFree Range",
    "price": 1299,
    "description": "Heavy-duty polyphosphate scale prevention unit explicitly optimized for commercial-scale reverse osmosis pre-filtration processing pipelines.",
    "image": "/images/org-com-ro-scalefree.png",
    "features": ["Max. Flow: 200 LPH | Max. Pressure: 3 kg/cm2", "Polyphosphate Volume: 130 grams", "Sturdy 3/8\" Direct Fluid Connection Terminals", "Transparent MOC ABS Structure"],
    "inStock": true
  },
  {
    "name": "ORG ScaleFree Appliances",
    "category": "ScaleFree Range",
    "price": 2499,
    "description": "Targeted anti-scale appliance adapter system. Perfect for extending the lifespan of domestic washing machines, automatic dishwashers, and toilet flush systems.",
    "image": "/images/org-scalefree-appliances.png",
    "features": ["Max. Flow: 500 LPH | Max. Pressure: 4 kg/cm2", "Polyphosphate Load: 175 grams", "1/2\" & 3/4\" Universal Union Connector Adapters", "Visible Transparent Level Design"],
    "inStock": true
  },
  {
    "name": "Shower Scalefree",
    "category": "ScaleFree Range",
    "price": 2499,
    "description": "Compact high-flow showerhead adapter module designed to inhibit scaling deposition and maintain dynamic spray pressure properties.",
    "image": "/images/shower-scalefree.png",
    "features": ["Direct Inline Shower Mount Threads", "Maintains Optimal Fluid Dispensing Holes", "Protects Skin and Hair from Scale Stains"],
    "inStock": true
  },
  {
    "name": "ORG ScaleFree Tank",
    "category": "ScaleFree Range",
    "price": 3499,
    "description": "Innovative floating antiscalant device relying on stable Archimedes buoyancy principles. The upper air chamber keeps it floating while the base slowly disperses polyphosphate media across your primary storage reservoir.",
    "image": "/images/org-scalefree-tank.png",
    "features": ["Buoyancy Floating Design (Air/Media Split Matrix)", "Polyphosphate Capacity: 310 grams", "Top-up Cycle Duration: ~6 Months", "Constantly moves with water turbulence for distribution"],
    "inStock": true
  },
  {
    "name": "ORG Manual Filter Valve",
    "category": "Multiport Valve",
    "price": 4500,
    "description": "High-strength manual multiport valve employing an abrasive-resistant hermetic head layout. Seamlessly controls Service, Backwash, and Fast Rinse routines under absolute pipeline fluid pressure.",
    "image": "/images/org-manual-filter-valve.png",
    "features": ["Corrosion Resistant Pottery Disk Seal", "Three-Stage Workflow (Service, Backwash, Fast Rinse)", "Compatible across dynamic residential pre-treatment systems"],
    "inStock": true
  },
  {
    "name": "ORG Manual Softener Valve",
    "category": "Multiport Valve",
    "price": 5200,
    "description": "Hermetic dual-mount multiport softener valve integrating accurate settings for Service, Backwash, Brine & Slow Rinse, Brine Refill, and Fast Rinse operations.",
    "image": "/images/org-manual-softener-valve.png",
    "features": ["Hermetic Pottery Head Face Gaskets", "5-Step Ion-Exchange Lifecycle Management", "Top or Side Mount Structural Flexibility Options"],
    "inStock": true
  },
  {
    "name": "F Series Automatic Filter Valve For Ro System",
    "category": "Multiport Valve",
    "price": 8500,
    "description": "Smart automated multiport system featuring an integrated Pump-On auxiliary signal output terminal. Includes smart interactive LED tracking panels and strict one-minute input command locks.",
    "image": "/images/f-series-automatic-filter-valve.png",
    "features": ["Auxiliary Pump-On Operational Signal Output", "Dynamic LED Status Display Arrays", "3-Day Internal Power Outage Back-up Clocks"],
    "inStock": true
  },
  {
    "name": "R Series Automatic Filter Valve For Ro System",
    "category": "Multiport Valve",
    "price": 9500,
    "description": "Fully programmatic time-clock or hourly tracking automated multiport valve. Easily integrates directly into master enterprise PLC networks for remote trigger cycles.",
    "image": "/images/r-series-automatic-filter-valve.png",
    "features": ["Hourly/Daily/PLC Trigger Mode Selectors", "Remote Input Handlers for Central System Links", "Programmatic Multi-Rinsing Cleaning Adjustments"],
    "inStock": true
  },
  {
    "name": "Q Series Automatic Filter Valve For Iron Removal & Media Filter",
    "category": "Multiport Valve",
    "price": 11500,
    "description": "Heavy-duty volume/meter-type automated system built with durable internal ceramic discs to easily process high-abrasion media filtration layers like Iron Removal and Sand Sandbeds.",
    "image": "/images/q-series-automatic-filter-valve.png",
    "features": ["High-Accuracy Meter (Volume-Based) Regeneration Cycles", "Corrosion-Proof Heavy Ceramic Disc Seals", "Supports 5-Stage Workflows with automatic button lockouts"],
    "inStock": true
  }
];

async function syncProducts() {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    const batch = db.batch();
    let deleteCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (legacyPurgeList.includes(data.name)) {
        batch.delete(doc.ref);
        deleteCount++;
      }
    });

    console.log(`Found ${deleteCount} legacy items to purge. Adding ${newProducts.length} new items.`);

    newProducts.forEach(product => {
      // The user wants 'addDoc' style behavior, so we generate new IDs
      const newDocRef = productsRef.doc();
      batch.set(newDocRef, {
        ...product,
        createdAt: FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    console.log("Data sync operation completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Data sync operation failed:", error);
    process.exit(1);
  }
}

syncProducts();
