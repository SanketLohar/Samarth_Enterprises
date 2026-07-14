const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const newProducts = [
  {
    "name": "ORG Inline Sediment Welded Gold",
    "category": "Inline Filters",
    "price": 599,
    "description": "High Quality Melt-blown Filter with integrated secure O-ring protection to completely isolate water mixing phases. Standard 1/4\" Quick Connection setup.",
    "features": ["High Quality Melt-blown Filter ID-19mm, OD-42mm, L-210mm", "O-ring protection from mixing of water", "1/4\" QC Connection"],
    "inStock": true,
    "image": "/images/org-inline-sediment-welded-gold.jpg"
  },
  {
    "name": "ORG Inline GAC Welded",
    "category": "Inline Filters",
    "price": 599,
    "description": "High-efficiency coconut shell activated carbon inline filter with O-ring mixing seals for advanced purification filtration pipelines.",
    "features": ["High Quality Melt-blown ID-19mm, OD-42mm, L-210mm", "O-ring protection from mixing of water", "1/4\" QC Connection", "1100 IV Coconut Shell Activated Carbon"],
    "inStock": true,
    "image": "/images/org-inline-gac-welded.jpg"
  },
  {
    "name": "ORG Inline Sediment Openable Bottom Gold",
    "category": "Inline Filters",
    "price": 599,
    "description": "11\" Openable, refillable, and highly reusable dynamic filter housing with structural melt-blown high-grade elements.",
    "features": ["11\" Openable, Refillable & Reusable Filter", "High Quality Melt-Blown Filter ID-19mm, OD-42mm, L-254mm"],
    "inStock": true,
    "image": "/images/org-inline-sediment-openable-bottom-gold.jpg"
  },
  {
    "name": "ORG Inline GAC Openable Bottom",
    "category": "Inline Filters",
    "price": 599,
    "description": "Premium 1100 IV Coconut Shell Activated Carbon filter featuring a dynamic openable design for ongoing media servicing adjustments.",
    "features": ["1100 IV Coconut Shell Activated Carbon", "Openable Bottom Housing", "Premium Adsorption Matrix"],
    "inStock": true,
    "image": "/images/org-inline-gac-openable-bottom.jpg"
  },
  {
    "name": "ORG Inline H2 AAA Openable Bottom",
    "category": "Inline Filters",
    "price": 1499,
    "description": "Advanced H2 AAA structured element chamber. 11\" Openable, refillable, and reusable setup featuring functional 1/4\" base inputs and outputs.",
    "features": ["11\" Openable, Refillable & Reusable", "1/4\" in-out Connection at bottom", "Alkaline Antibacterial Antioxidant Enrichment"],
    "inStock": true,
    "image": "/images/org-inline-h2-aaa-openable-bottom.jpg"
  },
  {
    "name": "ORG Inline H2 AAA + Copper Openable Bottom",
    "category": "Inline Filters",
    "price": 1999,
    "description": "Dynamic multi-stage H2 AAA filtration housing fortified with Active Copper delivery media for comprehensive mineral dosing profiles.",
    "features": ["11\" Openable, Refillable & Reusable", "1/4\" in-out Connection at Bottom", "Active Copper Bio-available Infusion"],
    "inStock": true,
    "image": "/images/org-inline-h2-aaa-copper-openable-bottom.jpg"
  },
  {
    "name": "ORG Inline H2 AAA + Zinc + Copper Openable Bottom",
    "category": "Inline Filters",
    "price": 2199,
    "description": "The ultimate active mineral formulation inline unit, integrating complete Hydrogen, Copper, and Zinc protection grids into an 11\" openable shell.",
    "features": ["11\" Openable, Refillable & Reusable", "1/4\" In-Out Connection at Bottom", "Triple Element Active System (H2, Zn, Cu)"],
    "inStock": true,
    "image": "/images/org-inline-h2-aaa-zinc-copper-openable-bottom.jpg"
  },
  {
    "name": "ORG Mini Inline H2 AAA Openable",
    "category": "Inline Filters",
    "price": 799,
    "description": "Compact 4\" configuration of our H2 AAA active mineral framework. Features rapid push-fit structural connection lines.",
    "features": ["4\" Openable, Refillable & Reusable", "1/4\" In-Out Push fit Connection"],
    "inStock": true,
    "image": "/images/org-mini-inline-h2-aaa-openable.jpg"
  },
  {
    "name": "ORG Mini Inline H2 AAA+Copper Openable",
    "category": "Inline Filters",
    "price": 889,
    "description": "Space-saving 4\" high-performance mineral inline block charging your purification pipeline with Active Copper enhancement media.",
    "features": ["4\" Openable, Refillable & Reusable", "1/4\" In-Out Push Fit Connection", "Active Copper Enrichment"],
    "inStock": true,
    "image": "/images/org-mini-inline-h2-aaacopper-openable.jpg"
  },
  {
    "name": "Automatic Water Level Controller with Ceramic Ball Valve",
    "category": "Automatic Water Level Controller",
    "price": 6699,
    "description": "A high-integrity problem-solving product designed for water storage tanks tied to active pressure pumps. Consists of a Motorised Ceramic Ball Valve (IP65 Rain-proof, 24V DC), a dynamic Wall-Mounted ABS Level Controller (230V AC Input), and a robust Floaty Switch setup.",
    "features": ["Motorised Ceramic Ball Valve (24V DC, IP65 Design)", "Wall/Pipe Mount ABS Controller Module", "Floaty Switch (NO, C, NC Configs)", "Available sizing profiles: 1\", 1.5\", 2\""],
    "inStock": true,
    "image": "/images/automatic-water-level-controller-with-ceramic-ball-valve.jpg"
  },
  {
    "name": "ORG ScaleFree Antiscalant Bag",
    "category": "ScaleFree Range",
    "price": 25,
    "description": "High-grade slow-dissolving polyphosphate anti-scaling media bags. Available in modular incremental industrial dosing profiles.",
    "features": ["Premium Polyphosphate Material", "Media Bag Packaging Configurations", "Available sizes: 10g, 100g, 200g, 500g, 1000g"],
    "inStock": true,
    "image": "/images/org-scalefree-antiscalant-bag.jpg"
  },
  {
    "name": "ORG RO ScaleFree",
    "category": "ScaleFree Range",
    "price": 299,
    "description": "Specially designed transparent ABS antiscalant housing to defend residential RO booster pumps, membranes, and flow restrictors against harsh water scaling. Refillable and clear for rapid capacity checks.",
    "features": ["Max. Flow: 60 LPH | Max. Pressure: 4 kg/cm2", "Polyphosphate Media: 21 grams", "Openable, Refillable & Reusable Transparent ABS Housing", "Inlet Size: 1/4\" Quick Fit"],
    "inStock": true,
    "image": "/images/org-ro-scalefree.jpg"
  },
  {
    "name": "ORG COM-RO ScaleFree",
    "category": "ScaleFree Range",
    "price": 1299,
    "description": "Heavy-duty polyphosphate scale prevention unit explicitly optimized for commercial-scale reverse osmosis pre-filtration processing pipelines.",
    "features": ["Max. Flow: 200 LPH | Max. Pressure: 3 kg/cm2", "Polyphosphate Volume: 130 grams", "Sturdy 3/8\" Direct Fluid Connection Terminals", "Transparent MOC ABS Structure"],
    "inStock": true,
    "image": "/images/org-com-ro-scalefree.jpg"
  },
  {
    "name": "ORG ScaleFree Appliances",
    "category": "ScaleFree Range",
    "price": 2499,
    "description": "Targeted anti-scale appliance adapter system. Perfect for extending the lifespan of domestic washing machines, automatic dishwashers, and toilet flush systems.",
    "features": ["Max. Flow: 500 LPH | Max. Pressure: 4 kg/cm2", "Polyphosphate Load: 175 grams", "1/2\" & 3/4\" Universal Union Connector Adapters", "Visible Transparent Level Design"],
    "inStock": true,
    "image": "/images/org-scalefree-appliances.jpg"
  },
  {
    "name": "Shower Scalefree",
    "category": "ScaleFree Range",
    "price": 2499,
    "description": "Compact high-flow showerhead adapter module designed to inhibit scaling deposition and maintain dynamic spray pressure properties.",
    "features": ["Direct Inline Shower Mount Threads", "Maintains Optimal Fluid Dispensing Holes", "Protects Skin and Hair from Scale Stains"],
    "inStock": true,
    "image": "/images/shower-scalefree.jpg"
  },
  {
    "name": "ORG ScaleFree Tank",
    "category": "ScaleFree Range",
    "price": 3499,
    "description": "Innovative floating antiscalant device relying on stable Archimedes buoyancy principles. The upper air chamber keeps it floating while the base slowly disperses polyphosphate media across your primary storage reservoir.",
    "features": ["Buoyancy Floating Design (Air/Media Split Matrix)", "Polyphosphate Capacity: 310 grams", "Top-up Cycle Duration: ~6 Months", "Constantly moves with water turbulence for distribution"],
    "inStock": true,
    "image": "/images/org-scalefree-tank.jpg"
  },
  {
    "name": "ORG Manual Filter Valve",
    "category": "Multiport Valve",
    "price": 4500,
    "description": "High-strength manual multiport valve employing an abrasive-resistant hermetic head layout. Seamlessly controls Service, Backwash, and Fast Rinse routines under absolute pipeline fluid pressure.",
    "features": ["Corrosion Resistant Pottery Disk Seal", "Three-Stage Workflow (Service, Backwash, Fast Rinse)", "Compatible across dynamic residential pre-treatment systems"],
    "inStock": true,
    "image": "/images/org-manual-filter-valve.jpg"
  },
  {
    "name": "ORG Manual Softener Valve",
    "category": "Multiport Valve",
    "price": 5200,
    "description": "Hermetic dual-mount multiport softener valve integrating accurate settings for Service, Backwash, Brine & Slow Rinse, Brine Refill, and Fast Rinse operations.",
    "features": ["Hermetic Pottery Head Face Gaskets", "5-Step Ion-Exchange Lifecycle Management", "Top or Side Mount Structural Flexibility Options"],
    "inStock": true,
    "image": "/images/org-manual-softener-valve.jpg"
  },
  {
    "name": "F Series Automatic Filter Valve For Ro System",
    "category": "Multiport Valve",
    "price": 8500,
    "description": "Smart automated multiport system featuring an integrated Pump-On auxiliary signal output terminal. Includes smart interactive LED tracking panels and strict one-minute input command locks.",
    "features": ["Auxiliary Pump-On Operational Signal Output", "Dynamic LED Status Display Arrays", "3-Day Internal Power Outage Back-up Clocks"],
    "inStock": true,
    "image": "/images/f-series-automatic-filter-valve.jpg"
  },
  {
    "name": "R Series Automatic Filter Valve For Ro System",
    "category": "Multiport Valve",
    "price": 9500,
    "description": "Fully programmatic time-clock or hourly tracking automated multiport valve. Easily integrates directly into master enterprise PLC networks for remote trigger cycles.",
    "features": ["Hourly/Daily/PLC Trigger Mode Selectors", "Remote Input Handlers for Central System Links", "Programmatic Multi-Rinsing Cleaning Adjustments"],
    "inStock": true,
    "image": "/images/r-series-automatic-filter-valve.jpg"
  },
  {
    "name": "Q Series Automatic Filter Valve For Iron Removal & Media Filter",
    "category": "Multiport Valve",
    "price": 11500,
    "description": "Heavy-duty volume/meter-type automated system built with durable internal ceramic discs to easily process high-abrasion media filtration layers like Iron Removal and Sand Sandbeds.",
    "features": ["High-Accuracy Meter (Volume-Based) Regeneration Cycles", "Corrosion-Proof Heavy Ceramic Disc Seals", "Supports 5-Stage Workflows with automatic button lockouts"],
    "inStock": true,
    "image": "/images/q-series-automatic-filter-valve-for-iron-removal-media-filter.jpg"
  }
];

async function fixDocIds() {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    const batch = db.batch();
    let deleteCount = 0;
    
    // 1. Delete Randomly Named Product Documents (length > 6)
    snapshot.forEach(doc => {
      // e.g. "rpLUh2M7CcudZY3Fbr3l" has length 20
      if (doc.id.length > 6) {
        batch.delete(doc.ref);
        deleteCount++;
      }
    });

    console.log(`Found ${deleteCount} auto-generated documents to purge. Injecting with custom keys...`);

    // 2. Re-Inject with Explicit Custom Document References
    let ifCount = 1;
    let awcCount = 1;
    let sfCount = 1;
    let mvCount = 1;

    newProducts.forEach(product => {
      let customId = "";
      if (product.category === "Inline Filters") {
        customId = `if-${String(ifCount).padStart(3, '0')}`;
        ifCount++;
      } else if (product.category === "Automatic Water Level Controller") {
        customId = `awc-${String(awcCount).padStart(3, '0')}`;
        awcCount++;
      } else if (product.category === "ScaleFree Range") {
        customId = `sf-${String(sfCount).padStart(3, '0')}`;
        sfCount++;
      } else if (product.category === "Multiport Valve") {
        customId = `mv-${String(mvCount).padStart(3, '0')}`;
        mvCount++;
      }

      // We use batch.set on the specific doc ref
      const newDocRef = productsRef.doc(customId);
      batch.set(newDocRef, {
        id: customId,
        ...product,
        createdAt: FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    console.log("Database ID normalization completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Operation failed:", error);
    process.exit(1);
  }
}

fixDocIds();
