import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {departments} from '@/data/departments';
import {createSeed} from '@/data/seed';
import {validateProcedure,stagesFor} from '@/lib/rules';
describe('제공 학과 자료 데이터 완결성',()=>{
 it.each(departments)('$name 게시 데이터 필드·날짜·방식',d=>{expect(validateProcedure(d)).toBeUndefined();expect(['application','course']).toContain(d.method);expect(d.sourceType).toBe('일부 가정');expect(d.sourceDescription).toBeTruthy();for(const s of d.stages){expect(s.stepType).toBeTruthy();expect(['ADVISOR','NONE','EXTERNAL']).toContain(s.approver);expect(s.isPlaceholder).toBe(s.dateStatus==='PLACEHOLDER');}});
 it('원문 4개 템플릿의 단계 순서·날짜·조건·규정을 보존',()=>{
  const text=readFileSync('docs/departments/snu-thesis-procedures.md','utf8');
  const spec=JSON.parse(text.match(/```json\n([\s\S]*?)\n```/)![1]);
  expect(departments).toHaveLength(4);
  spec.procedureTemplates.forEach((template:{steps:Record<string,unknown>[]},i:number)=>{
   expect(departments[i].stages).toHaveLength(template.steps.length);
   template.steps.forEach((step,j)=>{const actual=departments[i].stages[j];expect(actual.name).toBe(step.name);expect(actual.stepType).toBe(step.stepType);expect(actual.dueDate).toBe(step.deadline??'');expect(actual.dateStatus).toBe(step.dateStatus);expect(actual.approver).toBe(step.approver);expect(actual.submitTo).toBe(step.submitTo);expect(actual.conditionalDeadlines).toEqual(step.conditionalDeadlines??[]);for(const c of (step.constraints??[]) as string[])expect(actual.constraints).toContain(c);});
  });
 });
 it('네 학생·모든 학과 로드맵·초과학기·분반 교수 참조',()=>{const s=createSeed();expect(s.students).toHaveLength(4);expect(s.students[0].majors).toHaveLength(2);expect(s.students[2].registeredSemesters).toBeGreaterThan(8);expect(s.students[1].graduationSemester).toBe('2027년 8월');for(const d of s.departments){expect(s.students.some(st=>stagesFor(st,d).length===d.stages.length)).toBe(true);expect(s.assistants.some(a=>a.departmentId===d.id)).toBe(true);}for(const c of s.sections)expect(s.professors.some(p=>p.id===c.professorId)).toBe(true);});
 it('공식 링크는 제공된 주소만 사용하고 심리 상세 링크는 미확인',()=>{expect(departments.map(d=>d.officialLink)).toEqual(['','https://snucll.snu.ac.kr/학부졸업논문/','https://me.snu.ac.kr/학부-공지사항/?mod=document&uid=22117','https://ie.snu.ac.kr/notice/?mod=document&uid=6384']);});
});
