"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useSuppliers, useCreateSupplier, type Supplier } from "@/lib/hooks/use-procurement";
import { Plus, Search, Loader2, Building2, X, Star } from "lucide-react";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"",contactPerson:"",email:"",phone:"",address:"",state:"",city:"",licenseNumber:"",paymentTerms:"Net 30",notes:"" });
  const { data, loading, refetch } = useSuppliers(search || undefined);
  const suppliers = Array.isArray(data) ? data : [];
  const create = useCreateSupplier();

  const set_ = (k:keyof typeof form) => (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(v=>({...v,[k]:e.target.value}));

  const handleCreate = async (e:React.FormEvent) => {
    e.preventDefault();
    await create.mutate(form);
    setShowAdd(false);
    setForm({name:"",contactPerson:"",email:"",phone:"",address:"",state:"",city:"",licenseNumber:"",paymentTerms:"Net 30",notes:""});
    refetch();
  };

  return (
    <div>
      <PageHeader badge="LIVE" badgeVariant="live" title="Suppliers" subtitle={`${suppliers.length} registered suppliers`}
        action={<button onClick={()=>setShowAdd(true)} className="btn-primary btn-sm"><Plus style={{width:13,height:13}}/> Add Supplier</button>}/>

      <div style={{position:"relative",marginBottom:16,maxWidth:360}}>
        <Search style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:13,height:13,color:"var(--tx-3)"}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search suppliers..." className="kx-input" style={{paddingLeft:30}}/>
      </div>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:64}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {suppliers.map((s:Supplier)=>(
            <div key={s.id} className="card" style={{padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Building2 style={{width:16,height:16,color:"var(--k)"}}/>
                </div>
                <div>
                  <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"var(--tx-1)"}}>{s.name}</p>
                  <p style={{fontSize:11,color:"var(--tx-3)"}}>{s.contactPerson}</p>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {[
                  {label:"Email",value:s.email},
                  {label:"Phone",value:s.phone},
                  {label:"Location",value:[s.city,s.state].filter(Boolean).join(", ")||"—"},
                  {label:"Payment",value:s.paymentTerms??"—"},
                  {label:"POs",value:`${s._count?.purchaseOrders??0} orders`},
                ].map(r=>(
                  <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.label}</span>
                    <span style={{fontSize:11,color:"var(--tx-2)"}}>{r.value}</span>
                  </div>
                ))}
                {s.rating && (
                  <div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}>
                    <Star style={{width:11,height:11,color:"#f59e0b",fill:"#f59e0b"}}/>
                    <span style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>{s.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"var(--tx-1)"}}>Add Supplier</h2>
              <button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--tx-3)"}}><X style={{width:18,height:18}}/></button>
            </div>
            <form onSubmit={handleCreate} style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {([
                  {label:"Company Name",key:"name",required:true},
                  {label:"Contact Person",key:"contactPerson"},
                  {label:"Email",key:"email"},
                  {label:"Phone",key:"phone"},
                  {label:"State",key:"state"},
                  {label:"City",key:"city"},
                  {label:"License Number",key:"licenseNumber"},
                  {label:"Payment Terms",key:"paymentTerms"},
                ] as {label:string;key:keyof typeof form;required?:boolean}[]).map(f=>(
                  <div key={f.key} style={{display:"flex",flexDirection:"column",gap:4}}>
                    <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
                    <input value={form[f.key]} onChange={set_(f.key)} className="kx-input" required={f.required}/>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Address</label>
                <input value={form.address} onChange={set_("address")} className="kx-input" placeholder="Full address"/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Notes</label>
                <textarea value={form.notes} onChange={set_("notes")} className="kx-input" style={{minHeight:60,resize:"vertical"}}/>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
                <button type="button" onClick={()=>setShowAdd(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={create.loading} className="btn-primary btn-sm">
                  {create.loading?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:<Plus style={{width:13,height:13}}/>} Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}