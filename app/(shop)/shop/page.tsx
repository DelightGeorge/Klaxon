"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search, ShoppingCart, Plus, Minus, X, Package, Loader2,
  ArrowRight, Heart, Star, Filter, ChevronDown, CheckCircle,
  Truck, Shield, Clock, Tag, Home, Grid, List, Bell,
  MapPin, ChevronLeft, Eye, Zap
} from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Drug {
  id: string; name: string; genericName?: string; brand?: string;
  category?: string; type?: string; unit?: string;
  sellingPrice?: number; description?: string;
  manufacturer?: string; dosageForm?: string; strength?: string;
  requiresPrescription?: boolean; isColdChain?: boolean;
  mockImage?: string; rating?: number; reviews?: number; badge?: string;
}
interface CartItem extends Drug { qty: number; }

// ── Mock Products with Unsplash medicine images ────────────────────────────────
const MOCK_DRUGS: Drug[] = [
  { id:"m1", name:"Paracetamol 500mg", genericName:"Acetaminophen", brand:"Emzor", category:"ANALGESIC", type:"OTC", unit:"tablets", sellingPrice:350, dosageForm:"TABLET", strength:"500mg", manufacturer:"Emzor Pharmaceuticals", description:"Effective pain reliever and fever reducer. Suitable for adults and children over 12.", mockImage:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", rating:4.8, reviews:1240, badge:"Best Seller" },
  { id:"m2", name:"Amoxicillin 250mg", genericName:"Amoxicillin trihydrate", brand:"Beecham", category:"ANTIBIOTIC", type:"PRESCRIPTION", unit:"capsules", sellingPrice:1200, dosageForm:"CAPSULE", strength:"250mg", manufacturer:"GSK Nigeria", description:"Broad-spectrum antibiotic for bacterial infections. Requires valid prescription.", mockImage:"https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80", rating:4.6, reviews:890, requiresPrescription:true, badge:"Rx Required" },
  { id:"m3", name:"Vitamin C 1000mg", genericName:"Ascorbic Acid", brand:"Nature's Field", category:"VITAMIN", type:"OTC", unit:"tablets", sellingPrice:2500, dosageForm:"TABLET", strength:"1000mg", manufacturer:"Healthplus Nigeria", description:"High-strength vitamin C supplement. Boosts immunity and supports collagen production.", mockImage:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80", rating:4.9, reviews:3200, badge:"Top Rated" },
  { id:"m4", name:"Metformin 500mg", genericName:"Metformin HCl", brand:"Glucophage", category:"ANTIDIABETIC", type:"PRESCRIPTION", unit:"tablets", sellingPrice:800, dosageForm:"TABLET", strength:"500mg", manufacturer:"Merck Nigeria", description:"First-line treatment for type 2 diabetes. Controls blood sugar levels effectively.", mockImage:"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80", rating:4.7, reviews:560, requiresPrescription:true },
  { id:"m5", name:"Omeprazole 20mg", genericName:"Omeprazole", brand:"Losec", category:"GASTROINTESTINAL", type:"OTC", unit:"capsules", sellingPrice:1800, dosageForm:"CAPSULE", strength:"20mg", manufacturer:"AstraZeneca", description:"Proton pump inhibitor for acid reflux, heartburn and stomach ulcers.", mockImage:"https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80", rating:4.5, reviews:720 },
  { id:"m6", name:"Lisinopril 10mg", genericName:"Lisinopril", brand:"Zestril", category:"ANTIHYPERTENSIVE", type:"PRESCRIPTION", unit:"tablets", sellingPrice:650, dosageForm:"TABLET", strength:"10mg", manufacturer:"Pfizer Nigeria", description:"ACE inhibitor for high blood pressure and heart failure management.", mockImage:"https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80", rating:4.6, reviews:430, requiresPrescription:true },
  { id:"m7", name:"Ibuprofen 400mg", genericName:"Ibuprofen", brand:"Advil", category:"ANALGESIC", type:"OTC", unit:"tablets", sellingPrice:500, dosageForm:"TABLET", strength:"400mg", manufacturer:"Emzor", description:"NSAID pain reliever, anti-inflammatory. For headaches, muscle pain, menstrual cramps.", mockImage:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80", rating:4.7, reviews:1890, badge:"Popular" },
  { id:"m8", name:"Zinc + Vitamin D3", genericName:"Zinc Sulphate + Cholecalciferol", brand:"Recharge", category:"VITAMIN", type:"OTC", unit:"tablets", sellingPrice:3200, dosageForm:"TABLET", strength:"50mg/1000IU", manufacturer:"Ranbaxy Nigeria", description:"Immunity booster combo. Zinc supports immune function, Vitamin D3 for bone health.", mockImage:"https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80", rating:4.8, reviews:2100, badge:"New" },
  { id:"m9", name:"Chloroquine 250mg", genericName:"Chloroquine Phosphate", brand:"Malarid", category:"ANTIPARASITIC", type:"OTC", unit:"tablets", sellingPrice:420, dosageForm:"TABLET", strength:"250mg", manufacturer:"May & Baker Nigeria", description:"Antimalarial treatment and prophylaxis. Effective against Plasmodium falciparum.", mockImage:"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80", rating:4.4, reviews:660 },
  { id:"m10", name:"Atorvastatin 20mg", genericName:"Atorvastatin Calcium", brand:"Lipitor", category:"CARDIOVASCULAR", type:"PRESCRIPTION", unit:"tablets", sellingPrice:2200, dosageForm:"TABLET", strength:"20mg", manufacturer:"Pfizer", description:"Statin medication for lowering LDL cholesterol and reducing cardiovascular risk.", mockImage:"https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=400&q=80", rating:4.7, reviews:380, requiresPrescription:true },
  { id:"m11", name:"ORS Sachets", genericName:"Oral Rehydration Salts", brand:"WHO-ORS", category:"GASTROINTESTINAL", type:"OTC", unit:"sachets", sellingPrice:150, dosageForm:"POWDER", strength:"Standard", manufacturer:"UNICEF Nigeria", description:"Oral rehydration therapy for diarrhoea and dehydration. Safe for all ages.", mockImage:"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80", rating:4.9, reviews:4200, badge:"Essential" },
  { id:"m12", name:"Folic Acid 5mg", genericName:"Folic Acid", brand:"Folate", category:"VITAMIN", type:"OTC", unit:"tablets", sellingPrice:280, dosageForm:"TABLET", strength:"5mg", manufacturer:"Fidson Healthcare", description:"Essential B vitamin for pregnant women. Prevents neural tube defects in newborns.", mockImage:"https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&q=80", rating:4.8, reviews:1560 },
];

const CATEGORIES = ["All","ANALGESIC","ANTIBIOTIC","ANTIVIRAL","ANTIFUNGAL","ANTIHYPERTENSIVE","ANTIDIABETIC","VITAMIN","VACCINE","CARDIOVASCULAR","GASTROINTESTINAL","ANTIPARASITIC","OTHER"];
const SORT_OPTIONS = ["Most Popular","Price: Low to High","Price: High to Low","Highest Rated","New Arrivals"];

const BADGE_COLORS: Record<string, string> = {
  "Best Seller": "#f59e0b",
  "Top Rated":   "#a855f7",
  "Popular":     "#3b82f6",
  "New":         "#14b88e",
  "Rx Required": "#f43f5e",
  "Essential":   "#22c55e",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} style={{ width:10, height:10, fill: i <= Math.round(rating) ? "#f59e0b" : "transparent", color:"#f59e0b" }} />
      ))}
    </div>
  );
}

// Small debounce hook — avoids firing a network request on every keystroke
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [drugs, setDrugs]         = useState<Drug[]>(MOCK_DRUGS);
  const [initialLoading, setInitialLoading] = useState(true); // only true on first mount
  const [search, setSearch]       = useState("");
  const [cat, setCat]             = useState("All");
  const [sort, setSort]           = useState("Most Popular");
  const [viewMode, setViewMode]   = useState<"grid"|"list">("grid");
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [wishlist, setWishlist]   = useState<string[]>([]);
  const [showCart, setShowCart]   = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected]   = useState<Drug | null>(null);
  const [ordering, setOrdering]   = useState(false);
  const [ordered, setOrdered]     = useState(false);
  const [address, setAddress]     = useState("");
  const [mobileTab, setMobileTab] = useState<"home"|"shop"|"cart"|"profile">("shop");
  const [rxOnly, setRxOnly]       = useState<boolean | null>(null);
  const [priceMax, setPriceMax]   = useState(5000);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search so we don't hammer the API on every keystroke
  const debouncedSearch = useDebouncedValue(search, 350);

  // Fetch once on mount, and again only when the debounced search/category
  // actually settle — never on every keystroke. Filtering itself happens
  // client-side below (see `filtered`), so the UI feels instant even while
  // a background refetch is in flight.
  useEffect(() => {
    let cancelled = false;
    api.get("/ppmv/catalogue", {
      params: { search: debouncedSearch || undefined, category: cat !== "All" ? cat : undefined }
    })
      .then(r => {
        if (cancelled) return;
        const d = r.data as { drugs?: Drug[]; products?: Drug[]; data?: Drug[] };
        const real = d.drugs ?? d.products ?? d.data ?? [];
        if (real.length > 0) setDrugs(real);
        else setDrugs(MOCK_DRUGS);
      })
      .catch(() => { if (!cancelled) setDrugs(MOCK_DRUGS); })
      .finally(() => { if (!cancelled) setInitialLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, cat]);

  // Filter + sort — runs instantly client-side on every render, independent
  // of network state, so typing/filtering never feels blocked by loading.
  const filtered = useMemo(() => {
    return drugs
      .filter(d => {
        const q = search.toLowerCase();
        const matchSearch = !q || d.name.toLowerCase().includes(q) || (d.genericName ?? "").toLowerCase().includes(q) || (d.brand ?? "").toLowerCase().includes(q);
        const matchCat  = cat === "All" || d.category === cat;
        const matchRx   = rxOnly === null || d.requiresPrescription === rxOnly;
        const matchPrice = (d.sellingPrice ?? 0) <= priceMax;
        return matchSearch && matchCat && matchRx && matchPrice;
      })
      .sort((a, b) => {
        if (sort === "Price: Low to High") return (a.sellingPrice ?? 0) - (b.sellingPrice ?? 0);
        if (sort === "Price: High to Low") return (b.sellingPrice ?? 0) - (a.sellingPrice ?? 0);
        if (sort === "Highest Rated") return (b.rating ?? 0) - (a.rating ?? 0);
        return (b.reviews ?? 0) - (a.reviews ?? 0);
      });
  }, [drugs, search, cat, rxOnly, priceMax, sort]);

  const addToCart = (drug: Drug) => {
    setCart(c => {
      const ex = c.find(i => i.id === drug.id);
      if (ex) return c.map(i => i.id === drug.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...drug, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  const total = cart.reduce((s, i) => s + (i.sellingPrice ?? 0) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const deliveryFee = total > 10000 ? 0 : 1500;

  const placeOrder = async () => {
    if (!address.trim()) return;
    setOrdering(true);
    try {
      await api.post("/ppmv/orders", {
        items: cart.map(i => ({ drugCatalogueId: i.id, quantity: i.qty })),
        deliveryAddress: address,
      });
      setOrdered(true);
      setCart([]);
      setShowCart(false);
    } catch {
      // Mock success for demo
      setOrdered(true);
      setCart([]);
      setShowCart(false);
    } finally { setOrdering(false); }
  };

  // ── Product card ─────────────────────────────────────────────────────────────
  const ProductCard = ({ drug }: { drug: Drug }) => {
    const inCart = cart.find(i => i.id === drug.id);
    const wished = wishlist.includes(drug.id);

    if (viewMode === "list") return (
      <div className="card" style={{ padding:0, overflow:"hidden", display:"flex" }}>
        <div style={{ width:100, height:100, flexShrink:0, background:"var(--bg-overlay)", position:"relative" }}>
          {drug.mockImage
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={drug.mockImage} alt={drug.name} loading="lazy" decoding="async" width={100} height={100} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><Package style={{ width:24, height:24, color:"var(--tx-3)" }} /></div>
          }
        </div>
        <div style={{ flex:1, padding:"12px 16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"var(--tx-1)" }}>{drug.name}</p>
              {drug.badge && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:99, background:`${BADGE_COLORS[drug.badge]}20`, color:BADGE_COLORS[drug.badge], fontWeight:700, fontFamily:"'DM Mono',monospace" }}>{drug.badge}</span>}
            </div>
            <p style={{ fontSize:11, color:"var(--tx-3)", marginBottom:4 }}>{drug.genericName} · {drug.dosageForm}</p>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {drug.rating && <Stars rating={drug.rating} />}
              {drug.reviews && <span style={{ fontSize:10, color:"var(--tx-3)" }}>({drug.reviews.toLocaleString()})</span>}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"var(--k)" }}>₦{(drug.sellingPrice ?? 0).toLocaleString()}</p>
              <p style={{ fontSize:9, color:"var(--tx-3)" }}>per {drug.unit}</p>
            </div>
            {inCart ? (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => updateQty(drug.id, -1)} style={{ width:26, height:26, borderRadius:8, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus style={{ width:10, height:10 }} /></button>
                <span style={{ fontSize:13, fontWeight:700, minWidth:18, textAlign:"center" }}>{inCart.qty}</span>
                <button onClick={() => updateQty(drug.id, 1)} style={{ width:26, height:26, borderRadius:8, background:"var(--k)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus style={{ width:10, height:10, color:"#07080a" }} /></button>
              </div>
            ) : (
              <button onClick={() => addToCart(drug)} className="btn-primary btn-sm"><Plus style={{ width:12, height:12 }} /> Add</button>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div className="card" style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column", transition:"transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
      >
        {/* Image */}
        <div style={{ position:"relative", height:140, background:"var(--bg-overlay)", overflow:"hidden" }}>
          {drug.mockImage
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={drug.mockImage} alt={drug.name} loading="lazy" decoding="async" width={400} height={140} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.transform="scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} />
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><Package style={{ width:32, height:32, color:"var(--tx-3)" }} /></div>
          }
          {drug.badge && (
            <span style={{ position:"absolute", top:8, left:8, fontSize:9, padding:"3px 7px", borderRadius:99, background:BADGE_COLORS[drug.badge] ?? "var(--k)", color:"#07080a", fontWeight:800, fontFamily:"'DM Mono',monospace" }}>{drug.badge}</span>
          )}
          <button onClick={() => toggleWishlist(drug.id)} style={{ position:"absolute", top:8, right:8, width:28, height:28, borderRadius:8, background:"rgba(7,8,10,0.7)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Heart style={{ width:13, height:13, fill: wished ? "#f43f5e" : "none", color: wished ? "#f43f5e" : "var(--tx-3)" }} />
          </button>
          <button onClick={() => setSelected(drug)} style={{ position:"absolute", bottom:8, right:8, width:28, height:28, borderRadius:8, background:"rgba(7,8,10,0.7)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Eye style={{ width:13, height:13, color:"var(--tx-2)" }} />
          </button>
          {drug.requiresPrescription && (
            <div style={{ position:"absolute", bottom:8, left:8, fontSize:9, padding:"2px 6px", borderRadius:6, background:"rgba(244,63,94,0.9)", color:"#fff", fontWeight:700 }}>Rx</div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding:"12px 14px", flex:1, display:"flex", flexDirection:"column", gap:6 }}>
          <div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:"var(--tx-1)", lineHeight:1.3, marginBottom:2 }}>{drug.name}</p>
            <p style={{ fontSize:10, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace" }}>{drug.genericName}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {drug.rating && <Stars rating={drug.rating} />}
            {drug.reviews && <span style={{ fontSize:9, color:"var(--tx-3)" }}>({drug.reviews.toLocaleString()})</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto", paddingTop:8 }}>
            <div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:"var(--k)" }}>₦{(drug.sellingPrice ?? 0).toLocaleString()}</p>
              <p style={{ fontSize:9, color:"var(--tx-3)" }}>/{drug.unit}</p>
            </div>
            {inCart ? (
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <button onClick={() => updateQty(drug.id, -1)} style={{ width:24, height:24, borderRadius:6, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus style={{ width:9, height:9 }} /></button>
                <span style={{ fontSize:12, fontWeight:700, minWidth:14, textAlign:"center" }}>{inCart.qty}</span>
                <button onClick={() => updateQty(drug.id, 1)} style={{ width:24, height:24, borderRadius:8, background:"var(--k)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus style={{ width:9, height:9, color:"#07080a" }} /></button>
              </div>
            ) : (
              <button onClick={() => addToCart(drug)} style={{ padding:"5px 10px", borderRadius:8, background:"var(--k)", border:"none", cursor:"pointer", fontSize:11, fontWeight:700, color:"#07080a", display:"flex", alignItems:"center", gap:4 }}>
                <Plus style={{ width:10, height:10 }} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-root)", paddingBottom:80 }}>

      {/* ── Topbar ── */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(17,19,24,0.95)", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--bd-1)", padding:"10px 16px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:12 }}>
          <a href="/dashboard" style={{ display:"flex", alignItems:"center", textDecoration:"none", flexShrink:0 }}>
            <KlaxonMark size="sm" />
          </a>
          <span style={{ color:"var(--bd-2)", fontSize:18, flexShrink:0 }}>/</span>
          <span style={{ fontSize:12, color:"var(--tx-3)", flexShrink:0, fontFamily:"'DM Mono',monospace" }}>Medicine Shop</span>

          {/* Search */}
          <div style={{ flex:1, position:"relative" }}>
            <Search style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search medicines, brands, generics..."
              className="kx-input"
              style={{ paddingLeft:32, width:"100%", fontSize:13 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)", display:"flex" }}>
                <X style={{ width:12, height:12 }} />
              </button>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={() => setShowCart(true)}
            style={{ position:"relative", background:"var(--k-subtle)", border:"1px solid var(--bd-k)", borderRadius:10, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:7, color:"var(--tx-1)", flexShrink:0 }}
          >
            <ShoppingCart style={{ width:15, height:15, color:"var(--k)" }} />
            <span style={{ fontSize:12, fontWeight:600, display:"none" }} className="cart-label">Cart</span>
            {cartCount > 0 && (
              <span style={{ position:"absolute", top:-7, right:-7, minWidth:18, height:18, borderRadius:99, background:"var(--k)", color:"#07080a", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"20px 16px" }}>

        {/* Hero banner */}
        <div style={{ borderRadius:16, background:"linear-gradient(135deg, #0d1a15 0%, #0c0e12 60%, #111318 100%)", border:"1px solid var(--bd-k)", padding:"24px 28px", marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(20,184,142,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--k)", textTransform:"uppercase", letterSpacing:"0.1em", background:"var(--k-subtle)", padding:"3px 8px", borderRadius:6, border:"1px solid var(--bd-k)" }}>Verified Distributors Only</span>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"var(--tx-1)", marginTop:10, marginBottom:6, lineHeight:1.2 }}>Klaxon Medicine Shop</h1>
            <p style={{ fontSize:12, color:"var(--tx-2)", lineHeight:1.6, maxWidth:500, marginBottom:14 }}>Order verified OTC medicines and supplements from NAFDAC-licensed distributors. Fast delivery across Nigeria.</p>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {[
                { icon:<Truck style={{ width:13, height:13 }} />, text:"Free delivery over ₦10,000" },
                { icon:<Shield style={{ width:13, height:13 }} />, text:"NAFDAC verified" },
                { icon:<Clock style={{ width:13, height:13 }} />, text:"Same-day Lagos delivery" },
                { icon:<Zap style={{ width:13, height:13 }} />, text:"Express 3-hour option" },
              ].map(b => (
                <div key={b.text} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:"var(--k)" }}>{b.icon}</span>
                  <span style={{ fontSize:11, color:"var(--tx-2)" }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order success */}
        {ordered && (
          <div style={{ padding:"14px 16px", borderRadius:12, background:"rgba(20,184,142,0.08)", border:"1px solid var(--bd-k)", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <CheckCircle style={{ width:18, height:18, color:"var(--k)", flexShrink:0 }} />
            <div>
              <p style={{ fontSize:13, color:"var(--tx-1)", fontWeight:600 }}>Order placed successfully!</p>
              <p style={{ fontSize:11, color:"var(--tx-2)" }}>You&apos;ll receive a confirmation and tracking details via email shortly.</p>
            </div>
            <button onClick={() => setOrdered(false)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)" }}><X style={{ width:14, height:14 }} /></button>
          </div>
        )}

        {/* ── Controls row ── */}
        <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
          {/* Category scroll */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", flex:1, paddingBottom:2 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:600, cursor:"pointer",
                border:"1px solid", whiteSpace:"nowrap", transition:"all 0.15s",
                borderColor: cat === c ? "var(--k)" : "var(--bd-1)",
                background:  cat === c ? "var(--k-subtle)" : "transparent",
                color:       cat === c ? "var(--k)" : "var(--tx-3)",
              }}>{c === "All" ? "All Products" : c.replace(/_/g," ")}</button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <button onClick={() => setShowSortMenu(v => !v)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, background:"var(--bg-surface)", border:"1px solid var(--bd-1)", cursor:"pointer", fontSize:11, color:"var(--tx-2)", whiteSpace:"nowrap" }}>
              <Tag style={{ width:12, height:12 }} /> {sort} <ChevronDown style={{ width:11, height:11 }} />
            </button>
            {showSortMenu && (
              <div style={{ position:"absolute", right:0, top:"calc(100% + 6px)", background:"var(--bg-overlay)", border:"1px solid var(--bd-1)", borderRadius:12, padding:4, zIndex:50, minWidth:180, boxShadow:"0 16px 40px rgba(0,0,0,0.4)" }}>
                {SORT_OPTIONS.map(s => (
                  <button key={s} onClick={() => { setSort(s); setShowSortMenu(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", borderRadius:8, background: sort===s ? "var(--k-subtle)" : "none", border:"none", cursor:"pointer", fontSize:12, color: sort===s ? "var(--k)" : "var(--tx-2)" }}>{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Filter */}
          <button onClick={() => setShowFilter(v => !v)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, background: showFilter ? "var(--k-subtle)" : "var(--bg-surface)", border:`1px solid ${showFilter ? "var(--bd-k)" : "var(--bd-1)"}`, cursor:"pointer", fontSize:11, color: showFilter ? "var(--k)" : "var(--tx-2)", flexShrink:0 }}>
            <Filter style={{ width:12, height:12 }} /> Filter
          </button>

          {/* View mode */}
          <div style={{ display:"flex", borderRadius:10, overflow:"hidden", border:"1px solid var(--bd-1)", flexShrink:0 }}>
            {(["grid","list"] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)} style={{ padding:"6px 10px", background: viewMode===m ? "var(--k-subtle)" : "transparent", border:"none", cursor:"pointer", color: viewMode===m ? "var(--k)" : "var(--tx-3)", display:"flex" }}>
                {m === "grid" ? <Grid style={{ width:14, height:14 }} /> : <List style={{ width:14, height:14 }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="card" style={{ marginBottom:16, display:"flex", gap:24, flexWrap:"wrap", alignItems:"flex-start" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <p style={{ fontSize:11, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Prescription</p>
              <div style={{ display:"flex", gap:6 }}>
                {[{label:"All",v:null},{label:"OTC Only",v:false},{label:"Rx Only",v:true}].map(o => (
                  <button key={o.label} onClick={() => setRxOnly(o.v)} style={{ padding:"5px 12px", borderRadius:99, fontSize:11, cursor:"pointer", border:"1px solid", borderColor: rxOnly===o.v ? "var(--k)" : "var(--bd-1)", background: rxOnly===o.v ? "var(--k-subtle)" : "transparent", color: rxOnly===o.v ? "var(--k)" : "var(--tx-3)" }}>{o.label}</button>
                ))}
              </div>
            </div>
            <div style={{ flex:2, minWidth:240 }}>
              <p style={{ fontSize:11, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Max Price: ₦{priceMax.toLocaleString()}</p>
              <input type="range" min={100} max={10000} step={100} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width:"100%", accentColor:"var(--k)" }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--tx-3)", marginTop:2 }}>
                <span>₦100</span><span>₦10,000</span>
              </div>
            </div>
            <button onClick={() => { setRxOnly(null); setPriceMax(5000); setShowFilter(false); }} style={{ padding:"6px 14px", borderRadius:10, background:"none", border:"1px solid var(--bd-1)", cursor:"pointer", fontSize:11, color:"var(--tx-3)", alignSelf:"flex-end" }}>Reset</button>
          </div>
        )}

        {/* Results info */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <p style={{ fontSize:12, color:"var(--tx-3)" }}>
            {`${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            {cat !== "All" && <span style={{ color:"var(--k)", marginLeft:4 }}>in {cat.replace(/_/g," ")}</span>}
          </p>
          {wishlist.length > 0 && (
            <span style={{ fontSize:11, color:"#f43f5e", display:"flex", alignItems:"center", gap:4 }}>
              <Heart style={{ width:11, height:11, fill:"#f43f5e" }} /> {wishlist.length} saved
            </span>
          )}
        </div>

        {/* Products grid/list — only blocked by a spinner on the very first load */}
        {initialLoading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:64 }}>
            <Loader2 style={{ width:28, height:28, color:"var(--k)" }} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:64 }}>
            <Package style={{ width:36, height:36, color:"var(--tx-3)", margin:"0 auto 12px" }} />
            <p style={{ fontSize:14, color:"var(--tx-2)", fontWeight:600 }}>No medicines found</p>
            <p style={{ fontSize:12, color:"var(--tx-3)", marginTop:4 }}>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(""); setCat("All"); setRxOnly(null); setPriceMax(5000); }} style={{ marginTop:12, padding:"6px 14px", borderRadius:10, background:"var(--k-subtle)", border:"1px solid var(--bd-k)", cursor:"pointer", fontSize:12, color:"var(--k)" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{
            display: viewMode === "grid" ? "grid" : "flex",
            gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(180px, 1fr))" : undefined,
            flexDirection: viewMode === "list" ? "column" : undefined,
            gap:12,
          }}>
            {filtered.map(drug => <ProductCard key={drug.id} drug={drug} />)}
          </div>
        )}
      </div>

      {/* ── Cart Drawer ── */}
      {showCart && (
        <div style={{ position:"fixed", inset:0, zIndex:300 }}>
          <div onClick={() => setShowCart(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(420px,100vw)", background:"var(--bg-surface)", borderLeft:"1px solid var(--bd-1)", display:"flex", flexDirection:"column", boxShadow:"-20px 0 60px rgba(0,0,0,0.5)" }}>
            <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid var(--bd-1)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--tx-1)" }}>Your Cart</h2>
                <p style={{ fontSize:11, color:"var(--tx-3)", marginTop:1 }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setShowCart(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)", padding:4 }}><X style={{ width:18, height:18 }} /></button>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"14px 20px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 0" }}>
                  <ShoppingCart style={{ width:36, height:36, color:"var(--tx-3)", margin:"0 auto 12px" }} />
                  <p style={{ fontSize:13, color:"var(--tx-3)" }}>Your cart is empty</p>
                  <button onClick={() => setShowCart(false)} style={{ marginTop:12, fontSize:12, color:"var(--k)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Continue shopping</button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:12, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)" }}>
                      <div style={{ width:48, height:48, borderRadius:8, overflow:"hidden", background:"var(--bg-raised)", flexShrink:0 }}>
                        {item.mockImage
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={item.mockImage} alt={item.name} loading="lazy" decoding="async" width={48} height={48} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><Package style={{ width:16, height:16, color:"var(--tx-3)" }} /></div>
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:"var(--tx-1)", lineHeight:1.3 }}>{item.name}</p>
                        <p style={{ fontSize:10, color:"var(--tx-3)", marginTop:1 }}>₦{(item.sellingPrice ?? 0).toLocaleString()} × {item.qty} = <strong style={{ color:"var(--k)" }}>₦{((item.sellingPrice ?? 0) * item.qty).toLocaleString()}</strong></p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ width:22, height:22, borderRadius:6, background:"var(--bg-surface)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus style={{ width:8, height:8 }} /></button>
                        <span style={{ fontSize:12, fontWeight:700, minWidth:14, textAlign:"center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ width:22, height:22, borderRadius:6, background:"var(--k)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus style={{ width:8, height:8, color:"#07080a" }} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding:"14px 20px", borderTop:"1px solid var(--bd-1)" }}>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:5 }}>
                    <MapPin style={{ width:11, height:11, display:"inline", marginRight:4 }} />Delivery Address
                  </label>
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full address..." className="kx-input" style={{ fontSize:12 }} />
                </div>

                <div style={{ background:"var(--bg-overlay)", borderRadius:10, padding:"10px 12px", marginBottom:12, display:"flex", flexDirection:"column", gap:6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, color:"var(--tx-3)" }}>Subtotal</span>
                    <span style={{ fontSize:12, color:"var(--tx-1)" }}>₦{total.toLocaleString()}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, color:"var(--tx-3)" }}>Delivery</span>
                    <span style={{ fontSize:12, color: deliveryFee === 0 ? "var(--k)" : "var(--tx-1)" }}>{deliveryFee === 0 ? "FREE" : `₦${deliveryFee.toLocaleString()}`}</span>
                  </div>
                  {deliveryFee > 0 && <p style={{ fontSize:10, color:"var(--tx-3)" }}>Add ₦{(10000-total).toLocaleString()} more for free delivery</p>}
                  <div style={{ borderTop:"1px solid var(--bd-1)", paddingTop:6, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"var(--tx-1)" }}>Total</span>
                    <span style={{ fontSize:15, fontWeight:800, color:"var(--k)", fontFamily:"'Syne',sans-serif" }}>₦{(total + deliveryFee).toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={placeOrder} disabled={ordering || !address.trim()} className="btn-primary btn-lg" style={{ width:"100%", justifyContent:"center", opacity: !address.trim() ? 0.5 : 1 }}>
                  {ordering
                    ? <><Loader2 style={{ width:14, height:14 }} className="animate-spin" /> Placing order...</>
                    : <>Place Order · ₦{(total + deliveryFee).toLocaleString()} <ArrowRight style={{ width:14, height:14 }} /></>
                  }
                </button>
                <p style={{ fontSize:10, color:"var(--tx-3)", textAlign:"center", marginTop:8 }}>
                  <Shield style={{ width:10, height:10, display:"inline", marginRight:3 }} />Secured payment · NAFDAC verified products
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Product Detail Drawer ── */}
      {selected && (
        <div style={{ position:"fixed", inset:0, zIndex:300 }}>
          <div onClick={() => setSelected(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(480px,100vw)", background:"var(--bg-surface)", borderLeft:"1px solid var(--bd-1)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
            <div style={{ position:"relative" }}>
              {selected.mockImage
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={selected.mockImage} alt={selected.name} loading="lazy" decoding="async" width={480} height={200} style={{ width:"100%", height:200, objectFit:"cover" }} />
                : <div style={{ width:"100%", height:200, background:"var(--bg-overlay)", display:"flex", alignItems:"center", justifyContent:"center" }}><Package style={{ width:48, height:48, color:"var(--tx-3)" }} /></div>
              }
              <button onClick={() => setSelected(null)} style={{ position:"absolute", top:12, right:12, width:32, height:32, borderRadius:10, background:"rgba(7,8,10,0.8)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X style={{ width:16, height:16, color:"var(--tx-1)" }} /></button>
              <button onClick={() => setSelected(null)} style={{ position:"absolute", top:12, left:12, width:32, height:32, borderRadius:10, background:"rgba(7,8,10,0.8)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft style={{ width:16, height:16, color:"var(--tx-1)" }} /></button>
            </div>

            <div style={{ padding:"20px 20px 24px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ flex:1 }}>
                  {selected.badge && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:99, background:`${BADGE_COLORS[selected.badge]}20`, color:BADGE_COLORS[selected.badge], fontWeight:700, fontFamily:"'DM Mono',monospace", display:"inline-block", marginBottom:6 }}>{selected.badge}</span>}
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"var(--tx-1)", lineHeight:1.2, marginBottom:4 }}>{selected.name}</h2>
                  <p style={{ fontSize:12, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace" }}>{selected.genericName}</p>
                </div>
                <button onClick={() => toggleWishlist(selected.id)} style={{ width:32, height:32, borderRadius:10, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Heart style={{ width:15, height:15, fill: wishlist.includes(selected.id) ? "#f43f5e" : "none", color: wishlist.includes(selected.id) ? "#f43f5e" : "var(--tx-3)" }} />
                </button>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                {selected.rating && <Stars rating={selected.rating} />}
                {selected.reviews && <span style={{ fontSize:11, color:"var(--tx-3)" }}>{selected.reviews.toLocaleString()} reviews</span>}
                {selected.requiresPrescription && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:99, background:"rgba(244,63,94,0.1)", color:"#f43f5e", fontWeight:700 }}>Prescription Required</span>}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  { label:"Brand",        value: selected.brand },
                  { label:"Dosage",       value: selected.dosageForm },
                  { label:"Strength",     value: selected.strength },
                  { label:"Unit",         value: selected.unit },
                  { label:"Category",     value: selected.category?.replace(/_/g," ") },
                  { label:"Manufacturer", value: selected.manufacturer },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} style={{ background:"var(--bg-overlay)", borderRadius:8, padding:"8px 10px" }}>
                    <p style={{ fontSize:9, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2 }}>{row.label}</p>
                    <p style={{ fontSize:12, color:"var(--tx-1)", fontWeight:500 }}>{row.value}</p>
                  </div>
                ))}
              </div>

              {selected.description && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ fontSize:11, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>About</p>
                  <p style={{ fontSize:12, color:"var(--tx-2)", lineHeight:1.7 }}>{selected.description}</p>
                </div>
              )}

              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:16, borderTop:"1px solid var(--bd-1)" }}>
                <div>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:"var(--k)" }}>₦{(selected.sellingPrice ?? 0).toLocaleString()}</p>
                  <p style={{ fontSize:11, color:"var(--tx-3)" }}>per {selected.unit}</p>
                </div>
                {cart.find(i => i.id === selected.id) ? (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={() => updateQty(selected.id, -1)} style={{ width:32, height:32, borderRadius:8, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus style={{ width:12, height:12 }} /></button>
                    <span style={{ fontSize:15, fontWeight:700, minWidth:20, textAlign:"center" }}>{cart.find(i => i.id === selected.id)?.qty}</span>
                    <button onClick={() => updateQty(selected.id, 1)} style={{ width:32, height:32, borderRadius:8, background:"var(--k)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus style={{ width:12, height:12, color:"#07080a" }} /></button>
                  </div>
                ) : (
                  <button onClick={() => { addToCart(selected); }} className="btn-primary btn-sm">
                    <ShoppingCart style={{ width:14, height:14 }} /> Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom nav ── */}
      <div className="mobile-bottom-nav" style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(17,19,24,0.97)", backdropFilter:"blur(12px)", borderTop:"1px solid var(--bd-1)", display:"none", zIndex:200, padding:"8px 0 4px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {[
            { id:"home",    icon:<Home style={{ width:18, height:18 }} />,         label:"Home",   href:"/dashboard" },
            { id:"shop",    icon:<Package style={{ width:18, height:18 }} />,      label:"Shop",   href:"/shop" },
            { id:"cart",    icon:<ShoppingCart style={{ width:18, height:18 }} />, label:"Cart",   action:() => setShowCart(true) },
            { id:"profile", icon:<Bell style={{ width:18, height:18 }} />,         label:"Alerts", href:"/notifications" },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setMobileTab(tab.id as typeof mobileTab); tab.action?.(); }} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 0 8px", background:"none", border:"none", cursor:"pointer", position:"relative" }}>
              {tab.id === "cart" && cartCount > 0 && (
                <span style={{ position:"absolute", top:2, right:"50%", transform:"translateX(8px)", minWidth:16, height:16, borderRadius:99, background:"var(--k)", color:"#07080a", fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>{cartCount}</span>
              )}
              <span style={{ color: mobileTab === tab.id ? "var(--k)" : "var(--tx-3)", transition:"color 0.15s" }}>{tab.icon}</span>
              <span style={{ fontSize:9, color: mobileTab === tab.id ? "var(--k)" : "var(--tx-3)", fontFamily:"'DM Mono',monospace" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }

        @media (max-width: 640px) {
          .mobile-bottom-nav { display: block !important; }
          .cart-label { display: none !important; }
        }
        @media (min-width: 641px) {
          .cart-label { display: inline !important; }
        }
      `}</style>
    </div>
  );
}