"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, getDashboard } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getDashboard());
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, getDashboard, router]);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-root)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid var(--bd-2)", borderTopColor:"var(--k)", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}