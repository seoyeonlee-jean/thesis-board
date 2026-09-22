import type {Department, Stage, StepType} from '@/lib/types';
import {department, step} from './shared';

export const stepKinds: Record<StepType, Stage['kind']> = {
  APPLICATION:'plan', ADVISOR_REQUEST:'approval', COURSE_ENROLLMENT:'course',
  PLAN_SUBMISSION:'plan', MEETING:'task', CHECKPOINT:'plan', PRESENTATION:'task',
  FINAL_SUBMISSION:'final', EXTERNAL_SUBMISSION:'task',
};
export type ReferenceStep = Pick<Stage,'stepType'|'approver'|'submitTo'|'attendanceRequired'|'consequence'|'requiresAdvisorSignature'|'conditionalDeadlines'|'constraints'|'dateStatus'> & {order:number;name:string;deadline:string|null;appliesTo:string};
export function fromReference(id:string,name:string,college:string,color:string,method:Department['method'],rows:ReferenceStep[],ids:string[]):Department {
  const stages=rows.map((row,i):Stage=>({
    ...step(ids[i],row.name,stepKinds[row.stepType!],row.deadline??'',({APPLICATION:'신청 내용과 개요를 서비스에 기록하세요. 별도의 조교 승인 절차는 없습니다.',ADVISOR_REQUEST:'교수에게 연구 방향을 소개하고 지도 승인을 요청하세요.',COURSE_ENROLLMENT:'외부 수강 분반 정보로 담당 교수를 확인합니다. 실제 교과목 이수·성적 판정은 별도입니다.',PLAN_SUBMISSION:'계획서를 작성해 제출하세요. 완료 판정 주체에 따라 접수 또는 교수 검토로 진행됩니다.',MEETING:'교수가 제안한 시간을 선택하고 지도 면담을 진행하세요. 교수가 완료를 기록합니다.',CHECKPOINT:'중간 결과를 제출하고 지도교수의 확인을 받으세요.',PRESENTATION:'발표 일정·필참 여부와 미이행 영향을 확인하세요.',FINAL_SUBMISSION:'최종논문을 제출하고 지도교수의 검토를 받으세요.',EXTERNAL_SUBMISSION:'안내된 외부 제출을 마친 뒤 제출 완료를 기록하세요. 실제 접수 확인을 대신하지 않습니다.'})[row.stepType!],({APPLICATION:'신청서·개요 또는 최종 제목·질의자 정보',ADVISOR_REQUEST:'지도 신청서·연구 방향 요약',COURSE_ENROLLMENT:'외부 수강·분반 내역',PLAN_SUBMISSION:'연구계획서 본문 또는 PDF/DOCX',MEETING:'면담 자료·논문 초안',CHECKPOINT:'중간점검 자료·교수 확인',PRESENTATION:'발표 자료 또는 발표영상 링크',FINAL_SUBMISSION:'논문 PDF/DOCX (데모 형식)',EXTERNAL_SUBMISSION:'학과 안내에 따른 제출 원본·증빙'})[row.stepType!]),
    stepType:row.stepType, approver:row.approver, submitTo:row.submitTo, dateStatus:row.dateStatus,
    target:row.appliesTo==='MAJOR'?'primary':row.appliesTo==='DOUBLE_MAJOR'?'secondary':'all',
    startDate:'', isPlaceholder:row.dateStatus==='PLACEHOLDER',
    submissionMethod:({IN_SERVICE:'서비스 내 제출',DEPT_OFFICE:'학과사무실',EMAIL:'이메일',OTHER:'외부 절차'})[row.submitTo!],
    notes:'사용자 제공 조사 자료를 서비스 절차로 구성했습니다. 실제 운영 전 학과의 최신 공지를 확인하세요.',
    dateNote:row.dateStatus==='CONFIRMED'?'제공 자료의 날짜 기준. 별도 확인되지 않은 시각은 데모 가정입니다.':'최신 공지로 확인되지 않은 데모 일정입니다.',
    attendanceRequired:row.attendanceRequired??false, requiresAdvisorSignature:row.requiresAdvisorSignature??false,
    consequence:row.consequence??'',constraints:row.constraints??[],conditionalDeadlines:row.conditionalDeadlines??[],
  }));
  return {...department(id,name,college,color,method,stages),sourceType:'일부 가정',officialLink:'',sourceDescription:'사용자 제공 조사 자료 기반 · 실제 공지와 가정 일정이 혼재합니다. 인명·연락처·정원은 모두 가상입니다.'};
}
