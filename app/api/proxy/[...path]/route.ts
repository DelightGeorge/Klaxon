import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://klaxon-healthcare.onrender.com/api/v1";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params.path); }
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params.path); }
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params.path); }
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params.path); }
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy(req, params.path); }

async function proxy(req: NextRequest, pathParts: string[]) {
  const path = pathParts.join("/");
  const url = API_BASE + "/" + path;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const auth = req.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try { body = JSON.stringify(await req.json()); } catch { body = undefined; }
  }
  const res = await fetch(url, { method: req.method, headers, body });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}