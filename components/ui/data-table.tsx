"use client";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface Col<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Col<T>[];
  data: T[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  loading?: boolean;
  emptyMsg?: string;
  onRowClick?: (row: T) => void;
}

function Skeleton({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({length:6}).map((_,i) => (
        <tr key={i}>
          {Array.from({length:cols}).map((_,j) => (
            <td key={j} style={{padding:"12px 16px"}}>
              <div className="skeleton" style={{height:14,width:`${50+Math.random()*40}%`}} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DataTable<T extends object>({
  columns, data, searchable = true, searchKeys, pageSize = 10, loading, emptyMsg = "No data found", onRowClick,
}: DataTableProps<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = q && searchable
    ? data.filter(row =>
        (searchKeys ?? Object.keys(row) as (keyof T)[]).some(k =>
          String(row[k]).toLowerCase().includes(q.toLowerCase())
        )
      )
    : data;

  const pages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const sliced = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="card" style={{padding:0,overflow:"hidden"}}>
      {searchable && (
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bd-1)"}}>
          <div style={{position:"relative",maxWidth:300}}>
            <Search style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:13,height:13,color:"var(--tx-3)"}} />
            <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
              placeholder="Search..." className="kx-input" style={{paddingLeft:30,height:32,fontSize:12}} />
          </div>
        </div>
      )}
      <div style={{overflowX:"auto"}}>
        <table className="kx-table">
          <thead>
            <tr>
              {columns.map(c => (
                <th key={String(c.key)} style={c.width ? {width:c.width} : {}}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <Skeleton cols={columns.length} /> :
             sliced.length === 0 ? (
               <tr><td colSpan={columns.length} style={{textAlign:"center",padding:"40px 0",color:"var(--tx-3)"}}>{emptyMsg}</td></tr>
             ) :
             sliced.map((row, i) => (
               <tr key={i} onClick={() => onRowClick?.(row)} style={onRowClick ? {cursor:"pointer"} : {}}>
                 {columns.map(c => (
                   <td key={String(c.key)}>
                     {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "—")}
                   </td>
                 ))}
               </tr>
             ))
            }
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderTop:"1px solid var(--bd-1)"}}>
          <span style={{fontSize:12,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>
            {(page-1)*pageSize+1}–{Math.min(page*pageSize,filtered.length)} of {filtered.length}
          </span>
          <div style={{display:"flex",gap:4}}>
            <button className="btn-ghost btn-sm" disabled={page===1} onClick={() => setPage(p => p-1)}><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="btn-ghost btn-sm" disabled={page===pages} onClick={() => setPage(p => p+1)}><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}