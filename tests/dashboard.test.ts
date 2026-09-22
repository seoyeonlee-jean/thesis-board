import {it,expect} from 'vitest';
import {deadlineLabel,editorDateLabel} from '@/lib/dates';
import {createSeed} from '@/data/seed';
import {keepsStageOrder} from '@/lib/rules';
import {apply,assistant} from './fixtures';
it('학생 마감·조교 요약은 오후 대신 24시간으로 일관되게 표현',()=>{
 expect(deadlineLabel('2026-10-02T18:00')).toBe('10월 2일 18:00까지');
 expect(editorDateLabel('2026-10-02T18:00')).toBe('2026. 10. 02. 18:00');
 expect(deadlineLabel('2026-10-02T09:05')).toBe('10월 2일 09:05까지');
 expect(deadlineLabel('')).toBe('정보 확인 필요');expect(deadlineLabel('invalid')).toBe('정보 확인 필요');
});
it('고정 순서는 삭제·마지막 추가만 허용하고 정렬·앞 삽입을 거부',()=>{
 const s=createSeed(),d=s.departments[0],newStage={...d.stages[0],id:'new'};
 expect(keepsStageOrder(d.stages,[...d.stages.slice(1),newStage])).toBe(true);
 expect(keepsStageOrder(d.stages,[newStage,...d.stages])).toBe(false);
 for(const type of ['saveProcedure','publishProcedure'] as const){
  expect(apply(s,assistant,{type,department:{...d,stages:[...d.stages].reverse()}}).error).toContain('순서는 고정');
  expect(apply(s,assistant,{type,department:{...d,stages:[newStage,...d.stages]}}).error).toBeTruthy();
 }
});
