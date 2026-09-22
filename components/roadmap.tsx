"use client";
import type {BoardState,Department,Student} from '@/lib/types';
import {noticeMatches,progress,stageStatus} from '@/lib/rules';
import {Badge,colorFor,dateLabel,FileView} from './ui';
import {StageBadges,StageDeadlines} from './stage-metadata';
export function Roadmap({state,student,department,preview=false,actionLabel,onCurrentAction}:{state:BoardState;student:Student;department:Department;preview?:boolean;actionLabel?:string;onCurrentAction?:()=>void}){
 const {steps,current}=progress(state,student,department),now=new Date().toISOString();
 return <ol className="roadmap" aria-label={preview?'로드맵 미리보기':'전공 로드맵'}>{steps.map(step=>{
  const status=stageStatus(state,student,department,step,now),changed=step.changedAt&&Date.now()-Date.parse(step.changedAt)<7*86400000;
  const active=step.id===current?.id,done=status==='완료';
  const completion=state.completions.find(v=>v.studentId===student.id&&v.departmentId===department.id&&v.stageId===step.id);
  return <li key={step.id+'-'+(active?'current':done?'done':'upcoming')} id={preview?undefined:'step-'+step.id} className={'roadmap-step '+(done?'opacity-60':'')} data-current={active&&!preview} data-status={status}>
   <span className={'roadmap-node '+(status==='완료'?'bg-emerald-600 text-white':active?'bg-snu text-white':status==='마감 지남'?'bg-red-100 text-red-800':'bg-slate-200')}>{status==='완료'?'✓':'●'}</span>
   <details open={!preview&&active} className={'rounded-xl p-4 '+(active&&!preview?'border-2 border-snu bg-snu-50':'border border-slate-200 bg-white text-slate-500')}>
    <summary className="cursor-pointer"><b>{done&&<span aria-hidden="true">✓ </span>}{step.name}</b><span className="mt-2 flex flex-wrap gap-2"><StageDeadlines state={state} studentId={student.id} department={department} step={step}/><StageBadges step={step} assistant={preview}/>{active&&<Badge className="border-snu bg-snu text-white">진행 중</Badge>}{(!active||status!=='진행 중')&&<Badge className={status==='마감 지남'?'bg-red-50 text-red-700':status==='보완 필요'?'bg-orange-50 text-orange-800':colorFor(department)}>{status}</Badge>}{done&&<Badge>{completion?'완료일 · '+dateLabel(completion.at):'완료일 확인 필요'}</Badge>}{changed&&<Badge className="bg-amber-50 text-amber-800">일정 변경</Badge>}{step.required&&<Badge>필수</Badge>}</span>{step.consequence&&<span className="mt-2 block text-sm text-red-800">{step.consequence}</span>}</summary>
    <div className="mt-3 space-y-2 text-sm text-slate-600"><p>{step.description}</p>{preview&&step.dateNote&&<p className="text-xs">일정 근거: {step.dateNote}</p>}{step.constraints?.map(c=><p key={c} className="text-amber-900">• {c}</p>)}{state.completions.filter(v=>v.studentId===student.id&&v.departmentId===department.id&&v.stageId===step.id).map(v=><p key={v.at}>완료 기록: {dateLabel(v.at)} (서비스 내 기록)</p>)}<p>제출물: {step.documents||'정보 확인 필요'}</p><p>제출처: {step.submissionMethod||'정보 확인 필요'}</p>{(preview||!step.notes.includes('데모')&&!step.notes.includes('사용자 제공'))&&<p>유의사항: {step.notes||'없음'}</p>}<p>문의: {step.contact||'정보 확인 필요'}</p><FileView file={step.file}/>{active&&!preview&&onCurrentAction&&<button className="btn mt-3" onClick={onCurrentAction}>{actionLabel??'진행 내용 확인'}</button>}{state.notices.filter(n=>noticeMatches(n,student,department)&&n.stageId===step.id).map(n=><div className="rounded bg-amber-50 p-3" key={n.id}><b>{n.title}</b><p>{n.body}</p><FileView file={n.file}/></div>)}</div>
   </details>
  </li>;
 })}</ol>;
}
