import {it,expect} from 'vitest';
import {createSeed} from '@/data/seed';
import {deadlinesFor,emptyDraft,progress,validateProcedure} from '@/lib/rules';
import {apply,ok,pdf,professor,student,approved,draft,assistant} from './fixtures';
const ieStudent={role:'student' as const,id:'student-4'},ieProf={role:'professor' as const,id:'prof-industrial'};
const ieDraft=(id:string)=>({...emptyDraft('student-4','industrial',id),title:'테스트',body:'내용',summary:'연구 요약',professorId:'prof-industrial'});
function ieApproved(){
 let s=createSeed();
 s=ok(s,ieStudent,{type:'sendSubmission',draft:ieDraft('draft-plan')});
 expect(s.submissions[0].status).toBe('접수됨');expect(s.submissions[0].professorId).toBe('');
 s=ok(s,ieStudent,{type:'sendSubmission',draft:{...ieDraft('video'),videoUrl:'https://example.invalid/video'}});
 s=ok(s,ieStudent,{type:'sendApplication',draft:ieDraft('application')});
 return ok(s,ieProf,{type:'decide',id:s.applications[0].id,status:'승인',feedback:''});
}
function ieReview(){
 let s=ieApproved();s=ok(s,ieStudent,{type:'completeStep',departmentId:'industrial',stageId:'signed-plan'});
 s=ok(s,ieStudent,{type:'sendSubmission',draft:{...ieDraft('final'),file:pdf,videoUrl:'https://example.invalid/review'}});
 return ok(s,ieProf,{type:'review',id:s.submissions.at(-1)!.id,status:'승인',feedback:''});
}
it('산공은 교수 확정 전에 계획서·영상 접수, 신청 건너뛰기는 거부',()=>{
 const s=createSeed();expect(apply(s,ieStudent,{type:'sendApplication',draft:ieDraft('application')}).error).toBeTruthy();
 const sent=ok(s,ieStudent,{type:'sendSubmission',draft:ieDraft('draft-plan')});
 expect(apply(sent,ieStudent,{type:'sendSubmission',draft:ieDraft('video')}).error).toContain('영상');
 expect(progress(ieApproved(),s.students[3],s.departments[3]).current?.id).toBe('signed-plan');
});
it.each(['합격','수정 후 합격'])('산공 %s 결과는 해당 학생·전공 마감만 선택',condition=>{
 let s=ieReview();const d=s.departments[3],step=d.stages.at(-1)!;
 expect(deadlinesFor(s,'student-4',d,step)).toHaveLength(2);
 expect(apply(s,assistant,{type:'recordOutcome',studentId:'student-4',departmentId:d.id,condition}).error).toBeTruthy();
 expect(apply(s,professor,{type:'recordOutcome',studentId:'student-4',departmentId:d.id,condition}).error).toBeTruthy();
 s=ok(s,ieProf,{type:'recordOutcome',studentId:'student-4',departmentId:d.id,condition});
 expect(deadlinesFor(s,'student-4',d,step)).toEqual([{condition,deadline:condition==='합격'?'2026-12-15T18:00':'2026-12-22T18:00'}]);
 expect(deadlinesFor(s,'student-1',d,step)).toHaveLength(2);
 expect(progress(s,s.students[0],s.departments[0]).index).toBe(0);
 expect(s.notifications.at(-1)?.text).toContain(condition);
 s=ok(s,ieStudent,{type:'completeStep',departmentId:d.id,stageId:'office'});
 expect(progress(s,s.students[3],d).current).toBeUndefined();expect(s.completions.at(-1)?.at).toBeTruthy();
});
it('심사 단계 이전 또는 임의 결과는 기록 불가',()=>{
 expect(apply(ieApproved(),ieProf,{type:'recordOutcome',studentId:'student-4',departmentId:'industrial',condition:'합격'}).error).toBeTruthy();
 expect(apply(ieReview(),ieProf,{type:'recordOutcome',studentId:'student-4',departmentId:'industrial',condition:'임의'}).error).toBeTruthy();
});
it('면담 단계는 해당 단계의 교수 완료만 인정',()=>{
 let s=approved();s=ok(s,student,{type:'sendSubmission',draft:draft('plan')});s=ok(s,professor,{type:'review',id:s.submissions[0].id,status:'승인',feedback:''});
 expect(apply(s,student,{type:'completeStep',departmentId:'psychology',stageId:'writing'}).error).toBeTruthy();
 s=ok(s,professor,{type:'proposeMeeting',studentId:'student-1',departmentId:'psychology',slots:['2026-10-02T14:00'],location:'가상 면담실'});
 expect(apply(s,assistant,{type:'completeMeeting',id:s.meetings[0].id}).error).toBeTruthy();
 s=ok(s,student,{type:'selectSlot',id:s.meetings[0].id,slot:'2026-10-02T14:00'});s=ok(s,professor,{type:'completeMeeting',id:s.meetings[0].id});
 expect(progress(s,s.students[0],s.departments[0]).current?.id).toBe('final');
});
it('수업형은 외부 분반이 없으면 확인 대기하며 모든 역할의 수강 입력 거부',()=>{
 const s=createSeed();s.students[1].enrollmentIds=[];
 for(const actor of [{role:'student' as const,id:'student-2'},assistant,{role:'professor' as const,id:'prof-mech'}])expect(apply(s,actor,{type:'enroll',sectionId:'section-mech-1'}).state).toBe(s);
 expect(progress(s,s.students[1],s.departments[2]).current?.id).toBe('registration');
});
it('중문 신청·개요는 실제 내용이 접수되어야 완료',()=>{
 let s=createSeed();expect(apply(s,student,{type:'completeStep',departmentId:'chinese',stageId:'outline'}).error).toBeTruthy();
 s=ok(s,student,{type:'sendSubmission',draft:{...draft('outline'),departmentId:'chinese'}});
 expect(s.submissions[0].status).toBe('접수됨');expect(progress(s,s.students[0],s.departments[1]).current?.id).toBe('advisor');
});
it('다른 전공 동일 파일 경고는 이름이 아닌 파일 내용으로 판별',()=>{
 let s=ieReview();
 s.submissions=s.submissions.filter(v=>v.stageId!=='final');s.submissions.push({id:'other',studentId:'student-4',departmentId:'chinese',stageId:'final',professorId:'prof-chinese',kind:'final',title:'타전공',body:'',file:pdf,version:1,status:'승인',submittedAt:'2026-09-22'});
 const value={...ieDraft('final'),file:{...pdf,name:'renamed.pdf'},videoUrl:'https://example.invalid/video'};
 expect(apply(s,ieStudent,{type:'sendSubmission',draft:value}).error).toContain('동일한 파일');
 expect(apply(s,ieStudent,{type:'sendSubmission',draft:{...value,duplicateAcknowledged:true}}).error).toBeUndefined();
});
it('조교 신규 필드 게시·조건 검증·학과 상한',()=>{
 const s=createSeed(),d=structuredClone(s.departments[0]);d.stages[0].attendanceRequired=true;d.stages[0].conditionalDeadlines=[{condition:'합격',deadline:'2026-12-15T18:00'}];
 const updated=ok(s,assistant,{type:'publishProcedure',department:d});expect(updated.departments[0].stages[0].attendanceRequired).toBe(true);
 d.stages[0].approver='DEPARTMENT_STAFF' as never;expect(validateProcedure(d)).toBeTruthy();
 d.stages[0].approver='ADVISOR';d.stages[0].conditionalDeadlines[0].deadline='invalid';expect(validateProcedure(d)).toBeTruthy();
 s.departments[0].maxStudentsPerAdvisor=5;expect(apply(s,professor,{type:'capacity',capacity:6,available:true,year:2026}).error).toContain('상한');
});
