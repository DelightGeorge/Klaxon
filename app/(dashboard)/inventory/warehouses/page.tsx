"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useWarehouses,
  useCreateWarehouse,
  type Warehouse,
} from "@/lib/hooks/use-inventory";
import {
  Warehouse as WarehouseIcon,
  MapPin,
  Package,
  Thermometer,
  Loader2,
  Plus,
  X,
} from "lucide-react";

function AddWarehouseModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    type: "STANDARD",
    address: "",
    state: "",
    city: "",
    contactPerson: "",
    phone: "",
    hasColdStorage: false,
  });
  const { mutate, loading, error } = useCreateWarehouse();

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async () => {
    const result = await mutate(form);
    if (result) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 480,
          border: "1px solid var(--bd-1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Add Warehouse
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--tx-3)",
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Warehouse Name", key: "name" },
            { label: "Address", key: "address" },
            { label: "State", key: "state" },
            { label: "City", key: "city" },
            { label: "Contact Person", key: "contactPerson" },
            { label: "Phone", key: "phone" },
          ].map((f) => (
            <div
              key={f.key}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Mono',monospace",
                  color: "var(--tx-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {f.label}
              </label>
              <input
                value={form[f.key as "name" | "address" | "state" | "city" | "contactPerson" | "phone"]}
                onChange={update(f.key)}
                className="kx-input"
              />
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono',monospace",
                color: "var(--tx-3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Type
            </label>
            <select
              value={form.type}
              onChange={update("type")}
              className="kx-input"
            >
              {[
                "STANDARD",
                "COLD_STORAGE",
                "DISTRIBUTION_CENTER",
                "RETAIL",
              ].map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid var(--bd-1)",
              background: "var(--bg-raised)",
            }}
          >
            <input
              type="checkbox"
              checked={form.hasColdStorage}
              onChange={(e) =>
                setForm((v) => ({ ...v, hasColdStorage: e.target.checked }))
              }
            />
            <div>
              <p
                style={{ fontSize: 12, fontWeight: 600, color: "var(--tx-1)" }}
              >
                Has Cold Storage
              </p>
              <p style={{ fontSize: 11, color: "var(--tx-3)" }}>
                Cold chain capability for temperature-sensitive drugs
              </p>
            </div>
          </label>
        </div>
        {error && (
          <p style={{ fontSize: 12, color: "#f43f5e", marginTop: 12 }}>
            {error}
          </p>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <button onClick={onClose} className="btn-secondary btn-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name}
            className="btn-primary btn-sm"
          >
            {loading ? (
              <Loader2
                style={{ width: 13, height: 13 }}
                className="animate-spin"
              />
            ) : (
              <Plus style={{ width: 13, height: 13 }} />
            )}
            Add Warehouse
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WarehousesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { data, loading, refetch } = useWarehouses();
  const warehouses: Warehouse[] = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Warehouses"
        subtitle="Storage facilities and capacity management"
        badge="LIVE"
        badgeVariant="green"
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary btn-sm"
          >
            <Plus style={{ width: 13, height: 13 }} /> Add Warehouse
          </button>
        }
      />

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 16,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{
                height: 160,
                background: "var(--bg-overlay)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : warehouses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <WarehouseIcon
            style={{
              width: 32,
              height: 32,
              color: "var(--tx-3)",
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            No warehouses yet
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--tx-3)",
              marginTop: 4,
              marginBottom: 16,
            }}
          >
            Add your first storage facility.
          </p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            Add Warehouse
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 16,
          }}
        >
          {warehouses.map((w) => (
            <div
              key={w.id}
              className="card"
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--bd-k)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--bd-1)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "var(--k-subtle)",
                      border: "1px solid var(--bd-k)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WarehouseIcon
                      style={{ width: 18, height: 18, color: "var(--k)" }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--tx-1)",
                      }}
                    >
                      {w.name}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        color: "var(--tx-3)",
                        marginTop: 2,
                      }}
                    >
                      <MapPin style={{ width: 10, height: 10 }} />
                      {w.city}
                      {w.state ? `, ${w.state}` : ""}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={w.isActive !== false ? "Active" : "Inactive"}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    icon: Package,
                    label: "Stock Items",
                    value: w._count?.stock ?? "—",
                  },
                  {
                    icon: Thermometer,
                    label: "Cold Storage",
                    value: w.hasColdStorage ? "Yes" : "No",
                  },
                  {
                    icon: WarehouseIcon,
                    label: "Type",
                    value: (w.type ?? "STANDARD").replace(/_/g, " "),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "var(--bg-raised)",
                      border: "1px solid var(--bd-1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginBottom: 3,
                      }}
                    >
                      <item.icon
                        style={{ width: 10, height: 10, color: "var(--tx-3)" }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--tx-3)",
                          fontFamily: "'DM Mono',monospace",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--tx-1)",
                      }}
                    >
                      {String(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddWarehouseModal
          onClose={() => setShowAdd(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
