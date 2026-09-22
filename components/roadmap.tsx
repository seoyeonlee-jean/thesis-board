"use client";
import {useEffect,useRef} from 'react';
import type {BoardState,Department,Student} from '@/lib/types';
import {noticeMatches,progress,stageStatus} from '@/lib/rules';
import {Badge,colorFor,dateLabel,FileView} from './ui';
export function Roadmap({state,student,department,preview=false}:{state:BoardState;student:Student;department:Department;preview?:boolean}){
 const {steps,current}=progress(state,student,department),ref=useRef<HTMLLIElement>(null),now=new Date().toISOString();
 useEffect(()=>{if(!preview)ref.current?.scrollIntoView({block:'nearest',behavior:'smooth'});},[current?.id,department.id,preview]);
 return <ol className="roadmap" aria-label={preview?'로드맵 미리보기':'전공 로드맵'}>{steps.map(step=>{
  const status=stageStatus(state,student,department,step,now),changed=step.changedAt&&Date.now()-Date.parse(step.changedAt)<7*86400000;
  return <li key={step.id} ref={step.id===current?.id?ref:undefined} id={preview?undefined:'step-'+step.id} className={'roadmap-step '+(status==='예정'?'opacity-65':'')} data-status={status}>
   <span className={'roadmap-node '+(status==='완료'?'bg-emerald-600 text-white':status==='진행 중'?colorFor(department):status==='마감 지남'?'bg-red-100 text-red-800':'bg-slate-200')}>{status==='완료'?'✓':'●'}</span>
   <details className={'rounded-xl border p-4 '+(step.id===current?.id?'border-snu-300 bg-snu-50/30':'bg-white')} open={step.id===current?.id}>
    <summary className="cursor-pointer"><b>{step.name}</b><span className="mt-2 flex flex-wrap gap-2"><Badge>{dateLabel(step.dueDate)}</Badge><Badge className={status==='마감 지남'?'bg-red-50 text-red-700':status==='보완 필요'?'bg-orange-50 text-orange-800':colorFor(department)}>{status}</Badge>{changed&&<Badge className="bg-amber-50 text-amber-800">일정 변경</Badge>}{step.required&&<Badge>필수</Badge>}</span></summary>
    <div className="mt-3 space-y-2 text-sm text-slate-600"><p>{step.description}</p><p>제출물: {step.documents||'정보 확인 필요'}</p><p>제출처: {step.submissionMethod||'정보 확인 필요'}</p><p>유의사항: {step.notes||'없음'}</p><p>문의: {step.contact||'정보 확인 필요'}</p><FileView file={step.file}/>{state.notices.filter(n=>noticeMatches(n,student,department)&&n.stageId===step.id).map(n=><div className="rounded bg-amber-50 p-3" key={n.id}><b>{n.title}</b><p>{n.body}</p><FileView file={n.file}/></div>)}</div>
   </details>
  </li>;
 })}</ol>;
}
