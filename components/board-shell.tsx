"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
import {useBoardStore} from '@/lib/store';
import type {Actor} from '@/lib/types';
import {dateLabel} from './ui';
const links=[['학생','/student'],['교수','/professor'],['학과 조교','/admin']];
export function BoardShell({children}:{children:React.ReactNode}){
 const path=usePathname(),state=useBoardStore(),[ready,setReady]=useState(false),[open,setOpen]=useState(false);
 useEffect(()=>setReady(true),[]);
 const role:Actor['role']=path==='/professor'?'professor':path==='/admin'?'assistant':'student';
 const id=role==='student'?state.studentId:role==='professor'?state.professorId:state.assistantId;
 const people=role==='student'?state.students:role==='professor'?state.professors:state.assistants;
 const notifications=state.notifications.filter(n=>n.recipientId===id).slice().reverse();
 return <><header className="border-b bg-white"><div className="mx-auto max-w-7xl px-4 py-2"><div className="flex flex-wrap items-center justify-between gap-2"><Link href="/" className="text-xl font-extrabold text-snu">샤논</Link><div className="flex items-center gap-2">{ready&&<select aria-label="데모 사용자" value={id} onChange={e=>{state.choose(role,e.target.value);setOpen(false);}} className="max-w-36 rounded-lg border p-1.5 text-sm">{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>}<button className="rounded-lg border px-2 py-1.5 text-xs" aria-label="알림" aria-expanded={open} onClick={()=>setOpen(!open)}>알림 {ready?notifications.filter(n=>!n.read).length:0}</button></div></div><div className="mt-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-[11px] text-slate-500"><nav aria-label="데모 역할 전환" className="flex flex-wrap items-center gap-2"><span className="mr-2">데모 역할 전환</span>{links.map(([label,href])=><Link key={href} href={href} aria-current={path===href?'page':undefined} className={'rounded-full border px-3 py-1.5 text-xs font-bold '+(path===href?'border-snu bg-snu text-white':'border-slate-200 bg-slate-50 text-slate-600 hover:border-snu hover:text-snu')}>{label}</Link>)}</nav></div></div></header>
 {ready&&open&&<aside aria-label="알림 목록" className="mx-auto max-w-7xl p-4"><div className="card max-h-80 overflow-y-auto"><h2 className="font-bold">내 알림</h2>{notifications.length?notifications.map(n=><a className={'mt-2 block rounded-xl p-3 text-sm '+(n.read?'bg-slate-50':'bg-snu-50 font-bold')} key={n.id} href={n.href} onClick={()=>{state.act({role,id},{type:'readNotification',id:n.id});setOpen(false);}}>{!n.read&&'● '}{n.text}<time className="block text-xs font-normal text-slate-500">{dateLabel(n.at)}</time></a>):<p className="mt-3 text-sm text-slate-500">새 알림이 없습니다.</p>}</div></aside>}
 <main className="mx-auto max-w-7xl px-4 py-4">{ready?<>{state.error&&<div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{state.error}<button onClick={state.clearError}>닫기</button></div>}{children}</>:<p>저장된 데모를 불러오는 중…</p>}</main><footer className="px-4 pb-8 text-center text-xs text-slate-500">샤논 · 졸업논문 진행 관리</footer></>;
}
