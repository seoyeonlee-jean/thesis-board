"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBoardStore } from "@/lib/store";
const links = [["학생", "/student"], ["교수", "/professor"], ["행정실", "/admin"]];
export function BoardShell({ children }: { children: React.ReactNode }) { const path = usePathname(); const reset = useBoardStore((state) => state.reset); return <><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3"><Link href="/" className="font-extrabold">논문 보드 <span className="hidden text-slate-400 sm:inline">/ 2026-2</span></Link><nav className="flex rounded-xl bg-slate-100 p-1">{links.map(([label, href]) => <Link key={href} href={href} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${path === href ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}>{label}</Link>)}</nav><button className="btn-alt px-3 py-1.5" onClick={reset}>데모 초기화</button></div></header><main className="mx-auto max-w-7xl px-4 py-7">{children}</main></>; }
