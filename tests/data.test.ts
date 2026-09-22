import {describe,it,expect} from 'vitest';
import {departments} from '@/data/departments';
import {createSeed} from '@/data/seed';
import {validateProcedure} from '@/lib/rules';
describe('2차 명세 데이터 완결성',()=>{
 it.each(departments)('$name 게시 데이터 필드·날짜·방식',d=>{expect(validateProcedure(d)).toBeUndefined();expect(['application','course']).toContain(d.method);expect(d.requirements.primary).toBeTruthy();expect(d.requirements.secondary).toBeTruthy();expect(d.officialLink).toBe('예시 링크(가상)');expect(d.sourceType).toBe('가상');for(const s of d.stages)expect(s.dueDate).toMatch(/^2026-/);});
 it('세 학생·다전공·초과학기·분반 교수 참조',()=>{const s=createSeed();expect(s.students).toHaveLength(3);expect(s.students[0].majors).toHaveLength(2);expect(s.students[2].registeredSemesters).toBeGreaterThan(8);for(const c of s.sections)expect(s.professors.some(p=>p.id===c.professorId)).toBe(true);});
});
