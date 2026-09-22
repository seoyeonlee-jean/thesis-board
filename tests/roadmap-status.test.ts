import {it,expect} from 'vitest';
import {createSeed} from '@/data/seed';
import {transition,progress} from '@/lib/rules';
import {requested,professor,student,draft} from './fixtures';
it('승인 완료일은 신청 시각이 아닌 상태 변경 시각이며 중복 기록하지 않는다',()=>{
 const before=requested(),at='2026-10-01T09:00:00Z';
 const result=transition(before,professor,{type:'decide',id:before.applications[0].id,status:'승인',feedback:''},at,'approval');
 expect(result.error).toBeUndefined();const s=result.state;
 expect(s.completions.find(v=>v.stageId==='apply')?.at).toBe(at);
 expect(before.completions).toHaveLength(0);expect(progress(s,s.students[0],s.departments[0]).current?.id).toBe('plan');
 const res=transition(s,professor,{type:'decide',id:s.applications[0].id,status:'승인',feedback:''},'2026-10-02T09:00:00Z','again');
 expect(res.state.completions).toEqual(s.completions);
});
it('검토 없는 접수 단계는 접수 시각에 완료되고 기존 수강 완료일은 만들지 않는다',()=>{
 const at='2026-10-01T09:00:00Z';const result=transition(createSeed(),student,{type:'sendSubmission',draft:{...draft('outline'),departmentId:'chinese'}},at,'outline');
 expect(result.error).toBeUndefined();expect(result.state.completions).toEqual([{studentId:'student-1',departmentId:'chinese',stageId:'outline',at}]);
});
it('신청·승인이 분리된 템플릿은 제출 직후 승인 단계로 강조 대상을 이동한다',()=>{
 const seed=createSeed(),d=seed.departments[0],original=d.stages[0];
 d.stages=[{...original,kind:'application',stepType:undefined},{...original,id:'approval',name:'지도교수 승인'},...d.stages.slice(1)];
 const at='2026-10-01T09:00:00Z';const result=transition(seed,student,{type:'sendApplication',draft:draft()},at,'request');
 expect(result.error).toBeUndefined();expect(progress(result.state,seed.students[0],d).current?.id).toBe('approval');
 expect(result.state.completions.find(v=>v.stageId==='apply')?.at).toBe(at);
});
