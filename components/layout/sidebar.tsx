"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, QrCode, ShoppingCart, Truck,
  BarChart3, Video, Store, ShieldCheck, FileText,
  Code2, Settings, Users, ChevronDown, ChevronRight,
  Zap, Bell, PanelLeftClose, PanelLeft,
} from "lucide-react";

const NAV = [
  { label:"Dashboard",      href:"/dashboard",           icon:LayoutDashboard },
  { label:"Inventory",      href:"/inventory",            icon:Package,
    children:[
      {label:"Products",      href:"/inventory/products"},
      {label:"Warehouses",    href:"/inventory/warehouses"},
      {label:"Batches",       href:"/inventory/batches"},
      {label:"Transfers",     href:"/inventory/transfers"},
      {label:"Reconciliation",href:"/inventory/reconciliation"},
    ]
  },
  { label:"GTIN & Barcode", href:"/gtin",                icon:QrCode,
    children:[
      {label:"GTIN Manager",  href:"/gtin/manager"},
      {label:"Generator",     href:"/gtin/generator"},
      {label:"Scanner",       href:"/gtin/scanner"},
      {label:"Labels",        href:"/gtin/labels"},
    ]
  },
  { label:"Procurement",    href:"/procurement",          icon:ShoppingCart,
    children:[
      {label:"Dashboard",     href:"/procurement/dashboard"},
      {label:"Suppliers",     href:"/procurement/suppliers"},
      {label:"RFQ",           href:"/procurement/rfq"},
      {label:"Purchase Orders",href:"/procurement/orders"},
      {label:"Approvals",     href:"/procurement/approvals"},
    ]
  },
  { label:"Fulfillment",    href:"/fulfillment",          icon:Truck,
    children:[
      {label:"Dashboard",     href:"/fulfillment/dashboard"},
      {label:"Orders",        href:"/fulfillment/orders"},
      {label:"Tracking",      href:"/fulfillment/tracking"},
      {label:"Dispatch",      href:"/fulfillment/dispatch"},
    ]
  },
  { label:"Sales Intel",    href:"/sales",                icon:BarChart3,
    children:[
      {label:"Dashboard",     href:"/sales/dashboard"},
      {label:"Products",      href:"/sales/products"},
      {label:"Regional",      href:"/sales/regional"},
      {label:"Pharmacies",    href:"/sales/pharmacy"},
      {label:"PPMVs",         href:"/sales/ppmv"},
    ]
  },
  { label:"Telehealth",     href:"/telehealth",           icon:Video,
    children:[
      {label:"Dashboard",     href:"/telehealth/dashboard"},
      {label:"Prescriptions", href:"/telehealth/prescriptions"},
      {label:"Availability",  href:"/telehealth/availability"},
    ]
  },
  { label:"PPMV Portal",    href:"/ppmv",                 icon:Store,
    children:[
      {label:"Dashboard",     href:"/ppmv/dashboard"},
      {label:"Inventory",     href:"/ppmv/inventory"},
      {label:"Orders",        href:"/ppmv/orders"},
    ]
  },
  { label:"Compliance",     href:"/compliance",           icon:ShieldCheck,
    children:[
      {label:"Dashboard",     href:"/compliance/dashboard"},
      {label:"Audit Logs",    href:"/compliance/audit"},
      {label:"Recalls",       href:"/compliance/recalls"},
      {label:"Traceability",  href:"/compliance/traceability"},
    ]
  },
  { label:"Reports",        href:"/reports",              icon:FileText },
  { label:"API & Integrations",href:"/api",               icon:Code2,
    children:[
      {label:"Dashboard",     href:"/api/dashboard"},
      {label:"API Keys",      href:"/api/keys"},
      {label:"Webhooks",      href:"/api/webhooks"},
    ]
  },
  { label:"Admin",          href:"/admin",                icon:Users,
    children:[
      {label:"Users",         href:"/admin/users"},
      {label:"Roles",         href:"/admin/roles"},
      {label:"Organizations", href:"/admin/organizations"},
      {label:"Billing",       href:"/admin/billing"},
    ]
  },
  { label:"Settings",       href:"/settings",             icon:Settings },
];

interface NavItemProps {
  item: typeof NAV[0];
  collapsed: boolean;
}

function NavItem({ item, collapsed }: NavItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() =>
    item.children?.some(c => pathname.startsWith(c.href)) ?? false
  );
  const isActive = pathname === item.href ||
    (!item.children && pathname.startsWith(item.href + "/"));
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          className={`nav-item w-full ${open ? "text-[var(--tx-1)]" : ""}`}
        >
          <item.icon className="nav-icon flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
        </button>
        {open && (
          <div className="ml-4 pl-3 mt-0.5 flex flex-col gap-0.5" style={{borderLeft:"1px solid var(--bd-1)"}}>
            {item.children!.map(c => (
              <Link key={c.href} href={c.href}
                className={`nav-item text-xs py-1.5 ${pathname === c.href ? "active" : ""}`}>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href} title={collapsed ? item.label : undefined}
      className={`nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center" : ""} relative group`}>
      <item.icon className="nav-icon flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{background:"var(--bg-overlay)",border:"1px solid var(--bd-2)",color:"var(--tx-1)"}}>
          {item.label}
        </div>
      )}
    </Link>
  );
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside style={{
      width: collapsed ? "64px" : "var(--sidebar)",
      background: "var(--bg-base)",
      borderRight: "1px solid var(--bd-1)",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      position: "fixed", left: 0, top: 0, bottom: 0,
      display: "flex", flexDirection: "column", zIndex: 40, overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{padding:"0 16px", height:"var(--topbar)", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid var(--bd-1)", flexShrink:0}}>
        <div style={{width:28,height:28,borderRadius:8,background:"var(--k)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 0 16px var(--k-glow)"}}>
          <Zap className="w-4 h-4" style={{color:"#07080a"}} />
        </div>
        {!collapsed && (
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,letterSpacing:"-0.03em",color:"var(--tx-1)"}}>
            KLAXON
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{flex:1, overflowY:"auto", padding:"12px 8px", display:"flex", flexDirection:"column", gap:2}}>
        {NAV.map(item => <NavItem key={item.href} item={item} collapsed={collapsed} />)}
      </nav>

      {/* Bottom */}
      <div style={{padding:"10px 8px", borderTop:"1px solid var(--bd-1)", display:"flex", flexDirection:"column", gap:4}}>
        <button onClick={onToggle} className="nav-item justify-center">
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <><PanelLeftClose className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}