"use client";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNotifications, useUnreadCount, useMarkAllRead } from "@/lib/hooks/use-notifications";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const { data, loading, refetch } = useNotifications();
  const { data: countData }        = useUnreadCount();
  const { mutate: markAll, loading: marking } = useMarkAllRead();

  const notifications = data?.notifications ?? data?.data ?? [];
  const unread = countData?.count ?? 0;

  const handleMarkAll = async () => {
    await markAll();
    refetch();
  };

  const handleMarkOne = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    refetch();
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? "s" : ""}`}
        action={
          <button className="btn-secondary btn-sm" onClick={handleMarkAll} disabled={marking}>
            {marking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
            Mark all read
          </button>
        }
      />

      <div className="card" style={{padding:0}}>
        {loading ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:48}}>
            <Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:64,gap:12}}>
            <Bell style={{width:32,height:32,color:"var(--tx-3)"}} />
            <p style={{fontSize:13,color:"var(--tx-3)"}}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n: {id:string;title?:string;message?:string;read?:boolean;createdAt?:string;type?:string}, i: number) => (
            <div
              key={n.id}
              onClick={() => !n.read && handleMarkOne(n.id)}
              style={{
                display:"flex",alignItems:"flex-start",gap:12,
                padding:"14px 16px",
                borderBottom: i < notifications.length-1 ? "1px solid var(--bd-1)" : "none",
                background: n.read ? "transparent" : "rgba(20,184,142,0.04)",
                cursor: n.read ? "default" : "pointer",
                transition:"background 0.15s",
              }}
            >
              <div style={{
                width:8,height:8,borderRadius:"50%",marginTop:5,flexShrink:0,
                background: n.read ? "var(--tx-3)" : "var(--k)",
                boxShadow: n.read ? "none" : "0 0 6px var(--k)",
              }} />
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:n.read?400:600,color:"var(--tx-1)"}}>{n.title ?? "Notification"}</p>
                <p style={{fontSize:12,color:"var(--tx-2)",marginTop:2}}>{n.message}</p>
                <p style={{fontSize:10,color:"var(--tx-3)",marginTop:4,fontFamily:"'DM Mono',monospace"}}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString("en-GB") : ""}
                </p>
              </div>
              {n.type && <StatusBadge status={n.type} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}