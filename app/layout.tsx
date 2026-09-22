import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "샤논 | 졸업논문 진행 관리", description: "가상 졸업논문 진행 관리 데모" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
