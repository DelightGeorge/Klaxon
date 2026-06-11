export const MOCK_USER = {
  name: "Delight George", email: "delight@klaxon.health",
  role: "Super Admin", org: "Klaxon Health", avatar: "DG",
};

export const MOCK_KPI = {
  inventoryValue: "₦2.8B", inventoryChange: 12.4,
  activeOrders: 1284, ordersChange: 8.2,
  pharmacies: 3420, pharmaciesChange: 5.1,
  ppMVs: 12830, ppMVsChange: 19.3,
  expiring: 48, expiringChange: -3.2,
  delivered: 98210, deliveredChange: 22.1,
  lowStock: 17, revenue: "₦184.2M", revenueChange: 14.6,
};

export const MOCK_SALES = [
  { month:"Jan", revenue:12.4, orders:820 },{ month:"Feb", revenue:15.2, orders:940 },
  { month:"Mar", revenue:13.8, orders:870 },{ month:"Apr", revenue:18.9, orders:1100 },
  { month:"May", revenue:16.7, orders:1030 },{ month:"Jun", revenue:21.2, orders:1280 },
  { month:"Jul", revenue:19.8, orders:1190 },{ month:"Aug", revenue:24.5, orders:1420 },
  { month:"Sep", revenue:22.1, orders:1340 },{ month:"Oct", revenue:27.8, orders:1580 },
  { month:"Nov", revenue:25.4, orders:1490 },{ month:"Dec", revenue:31.2, orders:1820 },
];

export const MOCK_INVENTORY_PIE = [
  { name:"Analgesics",value:28 },{ name:"Antibiotics",value:22 },
  { name:"Antidiabetics",value:18 },{ name:"Antimalarials",value:15 },
  { name:"Vitamins",value:10 },{ name:"Others",value:7 },
];

const drugNames = ["Paracetamol 500mg","Amoxicillin 250mg","Metformin 500mg","Lisinopril 10mg",
  "Atorvastatin 20mg","Omeprazole 20mg","Amlodipine 5mg","Losartan 50mg",
  "Ciprofloxacin 500mg","Azithromycin 250mg","Ibuprofen 400mg","Diclofenac 50mg",
  "Artemether/Lumefantrine","Cotrimoxazole 480mg","Fluconazole 150mg",
  "Metronidazole 200mg","Vitamin C 1000mg","Folic Acid 5mg","Ferrous Sulphate 200mg","Calcium 600mg"];

export const MOCK_PRODUCTS = Array.from({length:30},(_,i)=>({
  id:`PRD-${String(i+1).padStart(4,"0")}`,
  name: drugNames[i%20],
  gtin:`061234${String(567890+i)}`,
  sku:`SKU-${String(10000+i)}`,
  batch:`BCH-2024-${String(100+i).padStart(3,"0")}`,
  expiry: new Date(2025+(i%3),(i*3)%12,1).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),
  quantity: Math.floor(Math.random()*10000)+100,
  warehouse:["Lagos Central","Abuja Hub","PHC Depot","Kano Store"][i%4],
  supplier:["PharmaCorp NG","MediVen Ltd","HealthSup","BioLink"][i%4],
  category:["Analgesic","Antibiotic","Antidiabetic","Antihypertensive","Antimalarial"][i%5],
  status: i%7===0?"Low Stock":i%11===0?"Expiring Soon":"In Stock",
  price:`₦${(Math.random()*5000+200).toFixed(0)}`,
}));

export const MOCK_ORDERS = Array.from({length:25},(_,i)=>({
  id:`ORD-${String(50000+i)}`,
  customer:["Lagos Gen Hospital","Kano Pharma","PHC Clinic","MediPlus","HealthFirst","Abuja Med"][i%6],
  type:["Pharmacy","Hospital","Clinic","PPMV","Distributor"][i%5],
  qty: Math.floor(Math.random()*500)+10,
  value:`₦${(Math.random()*2000000+50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`,
  status:["Pending","Processing","Dispatched","Delivered","Cancelled"][i%5],
  eta: new Date(Date.now()+(i+1)*86400000).toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
  logistics:["GIG Logistics","Sendbox","DHL","Kwik"][i%4],
  date: new Date(Date.now()-i*86400000).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),
}));

export const MOCK_SUPPLIERS = Array.from({length:12},(_,i)=>({
  id:`SUP-${String(i+1).padStart(3,"0")}`,
  name:["PharmaCorp Nigeria","MediVen Ltd","HealthSup Ltd","BioLink Pharma","CureMed","AfriHealth","PharmaGiant","MedSource","LifeCure","HealthBridge","MedGlobal","CarePharm"][i],
  country:["Nigeria","Ghana","South Africa","Kenya","Nigeria","Nigeria","Nigeria","Ghana","Nigeria","Nigeria","South Africa","Nigeria"][i],
  category:["Generics","Branded","OTC","Vaccines","Biologics","Generics"][i%6],
  status: i%5===0?"Inactive":"Active",
  orders: Math.floor(Math.random()*500)+50,
  rating:(Math.random()*2+3).toFixed(1),
  lastOrder: new Date(Date.now()-i*3*86400000).toLocaleDateString("en-GB"),
}));

export const MOCK_WAREHOUSES = [
  {id:"WH-001",name:"Lagos Central Warehouse",location:"Ikeja, Lagos",capacity:85,items:4820,manager:"Emeka Obi",status:"Operational"},
  {id:"WH-002",name:"Abuja Distribution Hub",location:"Wuse II, Abuja",capacity:62,items:2940,manager:"Fatima Bello",status:"Operational"},
  {id:"WH-003",name:"PHC Regional Depot",location:"Port Harcourt",capacity:78,items:3210,manager:"Chukwu Eze",status:"Operational"},
  {id:"WH-004",name:"Kano Dry Store",location:"Sabon Gari, Kano",capacity:45,items:1840,manager:"Aliyu Musa",status:"Maintenance"},
];

export const MOCK_PRESCRIPTIONS = Array.from({length:15},(_,i)=>({
  id:`RX-${String(2000+i).padStart(4,"0")}`,
  patient:["Fatima Bello","Chukwu Eze","Ada Okafor","Seun Adeyemi","Ngozi Onwuka","Emeka Obi"][i%6],
  doctor:["Dr. James Adeke","Dr. Amaka Nweke","Dr. Tunde Leke"][i%3],
  medications:["Amoxicillin 500mg × 21","Paracetamol 500mg × 30","Metformin 500mg × 60"][i%3],
  pharmacy:["CityPharm Lagos","HealthFirst Abuja","MedPlus PHC"][i%3],
  status:["Pending","Routed","Dispensed","Expired"][i%4],
  date: new Date(Date.now()-i*86400000).toLocaleDateString("en-GB"),
}));

export const MOCK_AUDIT = Array.from({length:20},(_,i)=>({
  id:`LOG-${String(i+1).padStart(4,"0")}`,
  action:["Stock Added","Order Placed","Product Updated","User Login","Stock Transferred","Batch Expired","RFQ Created","PO Approved","User Created","API Key Generated"][i%10],
  user:["Delight George","Emeka Obi","Fatima Bello","Aliyu Musa"][i%4],
  resource:["Inventory","Orders","Products","Users","Procurement"][i%5],
  time: new Date(Date.now()-i*3600000).toLocaleString("en-GB"),
  severity:["info","warning","critical","info","info"][i%5] as "info"|"warning"|"critical",
}));

export const MOCK_API_KEYS = [
  {id:"key_001",name:"Production API",key:"klx_live_sk_••••••••••••••••a1b2c3",created:"1 Jan 2026",lastUsed:"Today",status:"Active",perms:["read","write"]},
  {id:"key_002",name:"Staging API",key:"klx_test_sk_••••••••••••••••d4e5f6",created:"5 Feb 2026",lastUsed:"2 days ago",status:"Active",perms:["read"]},
  {id:"key_003",name:"Legacy Key",key:"klx_live_sk_••••••••••••••••g7h8i9",created:"1 Jun 2025",lastUsed:"3 months ago",status:"Revoked",perms:["read"]},
];

export const MOCK_USERS = Array.from({length:18},(_,i)=>({
  id:`USR-${String(i+1).padStart(3,"0")}`,
  name:["Delight George","Emeka Obi","Fatima Bello","Aliyu Musa","Ada Okafor","Seun Adeyemi","Ngozi Onwuka","Tunde Leke","Amaka Nweke","James Adeke","Mary Abubakar","Bola Soyinka","Yemi Adams","Chidi Okonkwo","Grace Adeyemi","Musa Ibrahim","Rita Nwosu","Kemi Olatunji"][i],
  email:`user${i+1}@klaxon.health`,
  role:["Super Admin","Manufacturer","Distributor","Warehouse Manager","Pharmacy Admin","PPMV Operator","Auditor","Logistics Coordinator"][i%8],
  org:["Klaxon Health","PharmaCorp NG","MediVen Ltd","BioLink Pharma"][i%4],
  status: i%6===0?"Inactive":"Active",
  lastLogin: new Date(Date.now()-i*86400000).toLocaleDateString("en-GB"),
}));

export const MOCK_PPMV = Array.from({length:15},(_,i)=>({
  id:`PPMV-${String(i+1).padStart(3,"0")}`,
  name:["Mama Chidi Chemist","Alhaji Drugs","Grace Pharmacy","Victory Chemist","Faith Meds","Hope Drugs","Blessing Pharmacy","Light Chemist","Star Drugs","New Life Meds","Kingdom Pharmacy","Divine Chemist","Glory Drugs","Mercy Pharmacy","Peace Meds"][i],
  location:["Mushin, Lagos","Kano Central","Onitsha Main","Ibadan","Aba","Enugu","Benin City","Ilorin","Maiduguri","Jos","Calabar","Owerri","Warri","Sokoto","Zaria"][i],
  stock: Math.floor(Math.random()*200)+20,
  lastOrder: new Date(Date.now()-i*2*86400000).toLocaleDateString("en-GB"),
  status: i%5===0?"Low Stock":"Active",
  revenue:`₦${(Math.random()*500000+50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`,
}));

export const MOCK_RFQ = Array.from({length:10},(_,i)=>({
  id:`RFQ-${String(2026001+i)}`,
  product: drugNames[i%20],
  quantity: Math.floor(Math.random()*5000)+100,
  supplier:["PharmaCorp NG","MediVen Ltd","HealthSup","BioLink"][i%4],
  status:["Draft","Sent","Responded","Approved","Rejected"][i%5],
  date: new Date(Date.now()-i*2*86400000).toLocaleDateString("en-GB"),
  deadline: new Date(Date.now()+(7-i)*86400000).toLocaleDateString("en-GB"),
}));