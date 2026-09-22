"use client";
export const studentAreas = [
 ['roadmap','로드맵'], ['advisor','지도교수'], ['meetings','면담 일정'],
 ['documents','연구계획·논문'], ['calendar','캘린더'], ['notices','공지'],
] as const;
export type StudentArea = typeof studentAreas[number][0];
export const areaForTarget = (target:string):StudentArea =>
 studentAreas.some(([id])=>id===target)?target as StudentArea:'roadmap';

export function StudentTabs({value,onChange}:{value:StudentArea;onChange:(id:StudentArea)=>void}){
 return <div role="tablist" aria-label="학생 업무" className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">
  {studentAreas.map(([id,label],index)=><button key={id} type="button" role="tab" id={'student-tab-'+id}
   aria-selected={value===id} aria-controls={'student-panel-'+id} tabIndex={value===id?0:-1}
   className={'shrink-0 whitespace-nowrap '+(value===id?'btn':'btn-alt border-transparent')}
   onClick={()=>onChange(id)} onKeyDown={e=>{
    let next=index;
    if(e.key==='ArrowRight')next=(index+1)%studentAreas.length;
    else if(e.key==='ArrowLeft')next=(index+studentAreas.length-1)%studentAreas.length;
    else if(e.key==='Home')next=0;
    else if(e.key==='End')next=studentAreas.length-1;
    else return;
    e.preventDefault();onChange(studentAreas[next][0]);document.getElementById('student-tab-'+studentAreas[next][0])?.focus();
   }}>{label}</button>)}
 </div>;
}
export function StudentPanel({id,active,children}:{id:StudentArea;active:StudentArea;children:React.ReactNode}){
 return <div role="tabpanel" id={'student-panel-'+id} aria-labelledby={'student-tab-'+id} hidden={id!==active} tabIndex={0} className="space-y-5">{children}</div>;
}
