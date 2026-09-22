import type {BoardState, Department, Stage} from '@/lib/types';
import {deadlinesFor} from '@/lib/rules';
import {deadlineLabel} from '@/lib/dates';
import {Badge} from './ui';
export function StageBadges({step,assistant=false}:{step?:Stage;assistant?:boolean}) {
 if(!step)return null;
 return <>{step.attendanceRequired&&<Badge className="bg-red-50 text-red-800">필참</Badge>}{step.requiresAdvisorSignature&&<Badge>지도교수 서명 필요</Badge>}{step.submitTo&&<Badge>{{IN_SERVICE:'서비스 제출',DEPT_OFFICE:'학과사무실',EMAIL:'이메일',OTHER:'외부 절차'}[step.submitTo]}</Badge>}{assistant&&step.dateStatus==='PLACEHOLDER'&&<Badge className="bg-amber-50">예정값</Badge>}</>;
}
export function StageDeadlines({state,studentId,department,step}:{state:BoardState;studentId:string;department:Department;step:Stage}) {
 const dates=deadlinesFor(state,studentId,department,step);
 return <>{dates.length?dates.map(v=><Badge key={v.condition+v.deadline}>{v.condition&&v.condition+' · '}{deadlineLabel(v.deadline)}</Badge>):<Badge>정보 확인 필요</Badge>}</>;
}
