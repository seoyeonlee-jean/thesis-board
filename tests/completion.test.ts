import {describe,it,expect} from 'vitest';
import {createSeed} from '@/data/seed';
import {departments} from '@/data/departments';
import {transition,weekStart,deadlineConflicts,adminRows,progressIndex,nextTask} from '@/lib/rules';
import type {BoardCommand,} from '@/lib/rules';
import type {BoardState} from '@/lib/types';
const at='2026-09-21T10:00:00Z';
let serial=0;
const run=(s:BoardState,c:BoardCommand)=>transition(s,departments,c,at,'test-'+(++serial));
const request=(s:BoardState)=>run(s,{type:'request',studentId:'student-2',departmentId:'sociology',professorId:'prof-soc-open',topic:'주제',plan:'계획'});
describe('완료 범위 회귀',()=>{
 it('상태 함수에서도 정원 마감 신청 차단',()=>{
  const s=createSeed();expect(run(s,{type:'request',studentId:'student-2',departmentId:'sociology',professorId:'prof-soc-full',topic:'주제',plan:'계획'})).toBe(s);
 });
 it('중복 승인 시 인원 및 이력 중복 증가 방지',()=>{
  let s=request(createSeed());const app=s.applications.find(a=>a.studentId==='student-2')!;
  s=run(s,{type:'decide',id:app.id,status:'승인'});
  expect(s.professors.find(p=>p.id==='prof-soc-open')!.assigned).toBe(2);
  expect(run(s,{type:'decide',id:app.id,status:'승인'})).toBe(s);
  expect(run(s,{type:'decide',id:app.id,status:'반려',feedback:'사유'})).toBe(s);
 });
 it('정원이 마지막 한 자리일 때 두 번째 승인 차단',()=>{
  let s=createSeed();s.professors.find(p=>p.id==='prof-soc-open')!.capacity=2;
  s=request(s);s=run(s,{type:'request',studentId:'student-6',departmentId:'sociology',professorId:'prof-soc-open',topic:'주제',plan:'계획'});
  const apps=s.applications.filter(a=>a.professorId==='prof-soc-open');
  s=run(s,{type:'decide',id:apps[0].id,status:'승인'});
  expect(run(s,{type:'decide',id:apps[1].id,status:'승인'})).toBe(s);
 });
 it('컨택 기록 전 요청 차단 및 기록 후 허용',()=>{
  let s=createSeed();const command:BoardCommand={type:'request',studentId:'student-1',departmentId:'psychology',professorId:'prof-psych',topic:'주제',plan:'계획'};
  expect(run(s,command)).toBe(s);
  s=run(s,{type:'contact',studentId:'student-1',departmentId:'psychology',professorId:'prof-psych'});
  expect(s.contacts[0].at).toBe(at);expect(run(s,command).applications).toHaveLength(2);
 });
 it('미신청 학생 포함 학과별 집계 및 전공 분리',()=>{
  const s=createSeed(), all=adminRows(s,departments), soc=adminRows(s,departments,'sociology');
  expect(new Set(all.map(r=>r.student.id)).size).toBe(8);expect(all).toHaveLength(10);
  expect(soc).toHaveLength(3);expect(soc.filter(r=>r.reason==='미신청')).toHaveLength(2);
  expect(soc.find(r=>r.student.id==='student-3')?.reason).toBe('정원 마감');
 });
 it('승인과 확정 검토 상태가 집계에 반영',()=>{
  let s=request(createSeed());const app=s.applications.find(a=>a.studentId==='student-2')!;
  s=run(s,{type:'decide',id:app.id,status:'승인'});
  expect(adminRows(s,departments).find(r=>r.app?.id===app.id)?.reason).toBe('확정 검토 대기');
  s=run(s,{type:'review',id:app.id,status:'검토 완료'});
  expect(adminRows(s,departments).find(r=>r.app?.id===app.id)?.reason).toBe('확정');
 });
 it('모든 단계에서 같은 달력 주 충돌 검사',()=>{
  const ds=structuredClone(departments.slice(0,2));ds[0].stages=ds[0].stages.slice(0,2);ds[1].stages=ds[1].stages.slice(0,2);
  ds[0].stages[0].dueDate='2026-10-01';ds[1].stages[0].dueDate='2026-10-12';
  ds[0].stages[1].dueDate='2026-11-02';ds[1].stages[1].dueDate='2026-11-08';
  const s=createSeed().students[0];s.selectedMajors=s.majors;
  expect(deadlineConflicts(s,ds).map(c=>c.week)).toEqual(['2026-11-02']);
  expect(weekStart('2026-11-08')).not.toBe(weekStart('2026-11-09'));
 });
 it('배정은 수업 학과만 허용하고 해당 전공만 변경',()=>{
  const s=createSeed();expect(run(s,{type:'assign',studentId:'student-1',departmentId:'psychology',professorId:'prof-psych'})).toBe(s);
  const assigned=run(s,{type:'assign',studentId:'student-1',departmentId:'mechanical',professorId:'prof-mech'});
  expect(progressIndex('student-1',departments[1],assigned.applications)).toBe(2);
  expect(progressIndex('student-1',departments[0],assigned.applications)).toBe(0);
  expect(assigned.applications.find(a=>a.studentId==='student-1')!.professorId).toBe('prof-mech');
 });
 it('순서대로 제출 기록하고 관리자 진행 상태 및 이력 반영',()=>{
  let s=request(createSeed());const app=s.applications.find(a=>a.studentId==='student-2')!;
  expect(run(s,{type:'submit',studentId:'student-2',departmentId:'sociology',stageId:'plan'})).toBe(s);
  s=run(s,{type:'decide',id:app.id,status:'승인'});s=run(s,{type:'review',id:app.id,status:'검토 완료'});
  s=run(s,{type:'submit',studentId:'student-2',departmentId:'sociology',stageId:'plan'});
  expect(s.submissions[0].at).toBe(at);
  expect(adminRows(s,departments).find(r=>r.app?.id===app.id)?.index).toBe(2);
  expect(run(s,{type:'submit',studentId:'student-2',departmentId:'sociology',stageId:'plan'})).toBe(s);
  expect(s.histories.at(-1)).toMatchObject({actor:'이도윤',at});
 });
 it('모든 단계 제출 후 완료 전공은 다음 할 일에서 제외',()=>{
  let s=request(createSeed());const app=s.applications.find(a=>a.studentId==='student-2')!;
  s=run(s,{type:'decide',id:app.id,status:'승인'});s=run(s,{type:'review',id:app.id,status:'검토 완료'});
  for(const stage of departments[2].stages.slice(1))s=run(s,{type:'submit',studentId:'student-2',departmentId:'sociology',stageId:stage.id});
  expect(progressIndex('student-2',departments[2],s.applications,s.submissions)).toBe(5);
  expect(nextTask(s.students[1],departments,s.applications,s.submissions)?.department.id).toBe('psychology');
 });
 it.each(['수정 요청','면담 요청','반려'] as const)('%s 후 피드백 보존 및 재신청',status=>{
  let s=request(createSeed());const app=s.applications.find(a=>a.studentId==='student-2')!;
  s=run(s,{type:'decide',id:app.id,status,feedback:'수정 필요'});
  expect(s.applications.find(a=>a.id===app.id)?.feedback).toBe('수정 필요');
  s=request(s);expect(s.applications.filter(a=>a.studentId==='student-2')).toHaveLength(1);
  expect(s.applications.find(a=>a.id===app.id)?.status).toBe('대기');
 });
});
