"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useScanLogs,
  useVerifyBarcode,
  type ScanResult,
} from "@/lib/hooks/use-gtin";
import {
  ScanLine,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Clock,
} from "lucide-react";

export default function ScannerPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [searching, setSearching] = useState(false);
  const { mutate: verify } = useVerifyBarcode();
  const { data: logs, loading: logsLoading } = useScanLogs();
  const scanLogs = Array.isArray(logs) ? logs : [];

  const handleLookup = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResult(null);
    const res = await verify({ barcodeValue: query.trim() });
    if (res) setResult(res);
    setSearching(false);
  };

  return (
    <div>
      <PageHeader
        title="Barcode Scanner"
        subtitle="Scan or look up product barcodes instantly"
        badge="LIVE"
        badgeVariant="green"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Manual lookup */}
        <div className="card">
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Manual Lookup
          </p>
          <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 16 }}>
            Enter a GTIN, barcode, or scan with a handheld scanner
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              className="kx-input"
              placeholder="Enter GTIN or barcode value..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleLookup}
              disabled={searching || !query}
              className="btn-primary"
              style={{ flexShrink: 0 }}
            >
              {searching ? (
                <Loader2
                  style={{ width: 14, height: 14 }}
                  className="animate-spin"
                />
              ) : (
                <Search style={{ width: 14, height: 14 }} />
              )}
            </button>
          </div>

          {result && (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: result.valid
                  ? "rgba(20,184,142,0.08)"
                  : "rgba(244,63,94,0.08)",
                border: `1px solid ${result.valid ? "rgba(20,184,142,0.25)" : "rgba(244,63,94,0.25)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: result.product ? 14 : 0,
                }}
              >
                {result.valid ? (
                  <CheckCircle
                    style={{ width: 20, height: 20, color: "var(--k)" }}
                  />
                ) : (
                  <XCircle
                    style={{ width: 20, height: 20, color: "#f43f5e" }}
                  />
                )}
                <p
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: result.valid ? "var(--k)" : "#f43f5e",
                  }}
                >
                  {result.valid ? "Valid Product" : "Not Found"}
                </p>
              </div>
              {result.product && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--tx-1)",
                    }}
                  >
                    {result.product.name}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--tx-3)" }}>
                    {result.product.genericName}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status={result.product.type ?? "OTC"} />
                    {result.product.requiresPrescription && (
                      <span className="badge badge-amber">Rx Required</span>
                    )}
                    {result.isExpired && (
                      <span className="badge badge-red">EXPIRED</span>
                    )}
                  </div>
                  {result.batchNumber && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--tx-3)",
                        fontFamily: "'DM Mono',monospace",
                      }}
                    >
                      Batch: {result.batchNumber} · Expiry:{" "}
                      {result.expiryDate
                        ? new Date(result.expiryDate).toLocaleDateString(
                            "en-GB",
                          )
                        : "—"}
                    </div>
                  )}
                </div>
              )}
              {result.message && (
                <p style={{ fontSize: 11, color: "var(--tx-3)", marginTop: 8 }}>
                  {result.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Camera scanner placeholder */}
        <div
          className="card"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--k-subtle)",
              border: "1px solid var(--bd-k)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <ScanLine style={{ width: 28, height: 28, color: "var(--k)" }} />
          </div>
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 8,
            }}
          >
            Camera Scanner
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--tx-3)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Use a webcam or barcode scanner device. Connect a USB scanner and it
            will type directly into the Manual Lookup field.
          </p>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "var(--bg-raised)",
              border: "1px solid var(--bd-1)",
              fontSize: 11,
              color: "var(--tx-3)",
            }}
          >
            Tip: Most USB barcode scanners work as keyboard input — click the
            lookup field and scan directly.
          </div>
        </div>
      </div>

      {/* Scan history */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Clock style={{ width: 14, height: 14, color: "var(--tx-3)" }} />
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Scan History
          </p>
        </div>
        {logsLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 32 }}
          >
            <Loader2
              style={{ width: 20, height: 20, color: "var(--k)" }}
              className="animate-spin"
            />
          </div>
        ) : scanLogs.length === 0 ? (
          <p
            style={{
              fontSize: 12,
              color: "var(--tx-3)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No scans recorded yet
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scanLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--bg-raised)",
                  border: "1px solid var(--bd-1)",
                }}
              >
                {log.isValid ? (
                  <CheckCircle
                    style={{
                      width: 14,
                      height: 14,
                      color: "var(--k)",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <XCircle
                    style={{
                      width: 14,
                      height: 14,
                      color: "#f43f5e",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    {log.barcodeValue}
                  </p>
                  {log.product && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--tx-3)",
                        marginTop: 1,
                      }}
                    >
                      {log.product.name}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 10, color: "var(--tx-3)" }}>
                  {new Date(log.scannedAt).toLocaleString("en-GB")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
