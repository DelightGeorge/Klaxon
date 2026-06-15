"use client";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Package, Loader2, ArrowRight } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";

interface Drug {
  id: string; name: string; genericName?: string; brand?: string;
  category?: string; type?: string; unit?: string;
  sellingPrice?: number; description?: string;
  manufacturer?: string; dosageForm?: string;
}

interface CartItem extends Drug { qty: number; }

const CATEGORIES = ["All","ANALGESIC","ANTIBIOTIC","ANTIVIRAL","ANTIFUNGAL","ANTIHYPERTENSIVE","ANTIDIABETIC","VITAMIN","VACCINE","CARDIOVASCULAR","GASTROINTESTINAL","OTHER"];

export default function ShopPage() {
  const [drugs, setDrugs]     = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("All");
  const [cart, setCart]       = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered]   = useState(false);
  const [address, setAddress]   = useState("");

  useEffect(() => {
    api.get("/ppmv/catalogue", { params: { search: search || undefined, category: cat !== "All" ? cat : undefined } })
      .then(r => {
        const d = (r.data as { drugs?: Drug[]; products?: Drug[]; data?: Drug[] });
        setDrugs(d.drugs ?? d.products ?? d.data ?? []);
      })
      .catch(() => setDrugs([]))
      .finally(() => setLoading(false));
  }, [search, cat]);

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

  const total = cart.reduce((s, i) => s + (i.sellingPrice ?? 0) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

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
    } catch { /* handle */ }
    finally { setOrdering(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-root)" }}>
      {/* Topbar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"var(--bg-surface)", borderBottom:"1px solid var(--bd-1)", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <KlaxonMark size="sm" />
        <div style={{ flex:1, maxWidth:400, margin:"0 20px", position:"relative" }}>
          <Search style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..." className="kx-input" style={{ paddingLeft:32, width:"100%" }} />
        </div>
        <button onClick={() => setShowCart(true)} style={{ position:"relative", background:"var(--k-subtle)", border:"1px solid var(--bd-k)", borderRadius:10, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:"var(--tx-1)" }}>
          <ShoppingCart style={{ width:16, height:16, color:"var(--k)" }} />
          <span style={{ fontSize:12, fontWeight:600 }}>Cart</span>
          {cartCount > 0 && (
            <span style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:"var(--k)", color:"#07080a", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>
          )}
        </button>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"24px 20px" }}>
        {/* Hero */}
        <div style={{ marginBottom:28, padding:"28px 28px", borderRadius:16, background:"linear-gradient(135deg, #0d1a15 0%, var(--bg-surface) 100%)", border:"1px solid var(--bd-1)" }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"var(--tx-1)", marginBottom:8 }}>Klaxon Medicine Shop</h1>
          <p style={{ fontSize:13, color:"var(--tx-2)", lineHeight:1.6 }}>Order verified OTC medicines from licensed distributors. Fast delivery to your location.</p>
        </div>

        {ordered && (
          <div style={{ padding:"14px 16px", borderRadius:12, background:"rgba(20,184,142,0.08)", border:"1px solid var(--bd-k)", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:"var(--k)", fontSize:18 }}>✓</span>
            <span style={{ fontSize:13, color:"var(--tx-1)", fontWeight:500 }}>Order placed successfully! You will receive a confirmation shortly.</span>
          </div>
        )}

        {/* Category pills */}
        <div style={{ display:"flex", gap:6, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding:"5px 14px", borderRadius:99, fontSize:11, fontWeight:600, cursor:"pointer",
              border:"1px solid", whiteSpace:"nowrap", transition:"all 0.15s",
              borderColor: cat === c ? "var(--k)" : "var(--bd-1)",
              background:  cat === c ? "var(--k-subtle)" : "transparent",
              color:       cat === c ? "var(--k)" : "var(--tx-3)",
            }}>{c}</button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:64 }}>
            <Loader2 style={{ width:28, height:28, color:"var(--k)" }} className="animate-spin" />
          </div>
        ) : drugs.length === 0 ? (
          <div style={{ textAlign:"center", padding:64 }}>
            <Package style={{ width:36, height:36, color:"var(--tx-3)", margin:"0 auto 12px" }} />
            <p style={{ fontSize:13, color:"var(--tx-3)" }}>No medicines found</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:14 }}>
            {drugs.map(drug => {
              const inCart = cart.find(i => i.id === drug.id);
              return (
                <div key={drug.id} className="card" style={{ padding:16, display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ width:"100%", height:80, borderRadius:10, background:"linear-gradient(135deg, rgba(20,184,142,0.08), rgba(20,184,142,0.03))", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Package style={{ width:28, height:28, color:"var(--k)", opacity:0.6 }} />
                  </div>
                  <div>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"var(--tx-1)", lineHeight:1.3 }}>{drug.name}</p>
                    {drug.genericName && <p style={{ fontSize:11, color:"var(--tx-3)", marginTop:2 }}>{drug.genericName}</p>}
                    {drug.brand && <p style={{ fontSize:10, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace" }}>{drug.brand}</p>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto" }}>
                    <div>
                      <p style={{ fontSize:14, fontWeight:800, color:"var(--k)", fontFamily:"'Syne',sans-serif" }}>
                        {drug.sellingPrice ? `₦${drug.sellingPrice.toLocaleString()}` : "—"}
                      </p>
                      <p style={{ fontSize:9, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace" }}>per {drug.unit ?? "unit"}</p>
                    </div>
                    {inCart ? (
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <button onClick={() => updateQty(drug.id, -1)} style={{ width:24, height:24, borderRadius:6, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Minus style={{ width:10, height:10, color:"var(--tx-1)" }} />
                        </button>
                        <span style={{ fontSize:12, fontWeight:700, color:"var(--tx-1)", minWidth:16, textAlign:"center" }}>{inCart.qty}</span>
                        <button onClick={() => updateQty(drug.id, 1)} style={{ width:24, height:24, borderRadius:6, background:"var(--k)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Plus style={{ width:10, height:10, color:"#07080a" }} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(drug)} style={{ padding:"5px 10px", borderRadius:8, background:"var(--k)", border:"none", cursor:"pointer", fontSize:11, fontWeight:700, color:"#07080a", display:"flex", alignItems:"center", gap:4 }}>
                        <Plus style={{ width:11, height:11 }} /> Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      {showCart && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div onClick={() => setShowCart(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)" }} />
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(400px, 100vw)", background:"var(--bg-surface)", borderLeft:"1px solid var(--bd-1)", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid var(--bd-1)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--tx-1)" }}>Your Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)" }}><X style={{ width:18, height:18 }} /></button>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0" }}>
                  <ShoppingCart style={{ width:32, height:32, color:"var(--tx-3)", margin:"0 auto 10px" }} />
                  <p style={{ fontSize:13, color:"var(--tx-3)" }}>Your cart is empty</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:"var(--bg-overlay)", border:"1px solid var(--bd-1)" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:"var(--tx-1)" }}>{item.name}</p>
                        <p style={{ fontSize:11, color:"var(--tx-3)", marginTop:1 }}>₦{(item.sellingPrice ?? 0).toLocaleString()} × {item.qty}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ width:22, height:22, borderRadius:6, background:"var(--bg-surface)", border:"1px solid var(--bd-1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Minus style={{ width:9, height:9 }} />
                        </button>
                        <span style={{ fontSize:12, fontWeight:700, minWidth:14, textAlign:"center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ width:22, height:22, borderRadius:6, background:"var(--k)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Plus style={{ width:9, height:9, color:"#07080a" }} />
                        </button>
                      </div>
                      <p style={{ fontSize:12, fontWeight:700, color:"var(--k)", minWidth:60, textAlign:"right" }}>₦{((item.sellingPrice ?? 0) * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding:"16px 20px", borderTop:"1px solid var(--bd-1)" }}>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:5 }}>Delivery Address</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter delivery address" className="kx-input" />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:13, color:"var(--tx-2)" }}>Total</span>
                  <span style={{ fontSize:15, fontWeight:800, color:"var(--k)", fontFamily:"'Syne',sans-serif" }}>₦{total.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} disabled={ordering || !address.trim()} className="btn-primary btn-lg" style={{ width:"100%", justifyContent:"center" }}>
                  {ordering ? <><Loader2 style={{ width:14, height:14 }} className="animate-spin" /> Placing order...</> : <>Place Order <ArrowRight style={{ width:14, height:14 }} /></>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}