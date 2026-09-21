import { beforeEach, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { departments } from '@/data/departments';
import { createSeed } from '@/data/seed';
import { useBoardStore } from '@/lib/store';
import { stageForApplication, validFeedback } from '@/lib/rules';
import { StudentBoard } from '@/components/student-board';

// Render the selected test snapshot; Zustand SSR otherwise uses its initial seed.
vi.mock('@/lib/store', async importOriginal => {
  const actual = await importOriginal<typeof import('@/lib/store')>();
  return { ...actual, useBoardStore: Object.assign(() => actual.useBoardStore.getState(), actual.useBoardStore) };
});

beforeEach(() => useBoardStore.setState(createSeed()));
it.each(['수정 요청', '면담 요청', '반려', '보완 요청'] as const)('감사: %s 빈 피드백 거부', status => {
  expect(validFeedback(status, '   ')).toBe(false);
  expect(validFeedback(status, '구체적인 사유')).toBe(true);
});
it('감사: 정원 사용 학과만 승인 시 배정 인원 증가', () => {
  const s = useBoardStore.getState();
  s.requestApproval('psychology', 'prof-psych');
  s.requestApproval('sociology', 'prof-soc-open');
  const before = structuredClone(useBoardStore.getState().professors);
  for (const a of useBoardStore.getState().applications.filter(a => a.studentId === 'student-1')) {
    expect(s.decideApplication(a.id, '승인')).toBe(true);
  }
  for (const p of useBoardStore.getState().professors) {
    expect(p.assigned).toBe(before.find(b => b.id === p.id)!.assigned + (p.id === 'prof-soc-open' ? 1 : 0));
  }
});
it('감사: 교수 승인 직후 해당 전공만 다음 단계 이동', () => {
  const s = useBoardStore.getState(); s.requestApproval('psychology', 'prof-psych');
  const a = useBoardStore.getState().applications.find(a => a.studentId === 'student-1')!;
  s.decideApplication(a.id, '승인');
  expect(stageForApplication(useBoardStore.getState().applications.find(i => i.id === a.id))).toBe(1);
  expect(stageForApplication(undefined)).toBe(0);
});
it('감사: 행정실 검토 완료 후 해당 전공 확정', () => {
  const s = useBoardStore.getState(); s.requestApproval('psychology', 'prof-psych');
  const a = useBoardStore.getState().applications.find(a => a.studentId === 'student-1')!;
  s.decideApplication(a.id, '승인'); s.reviewApplication(a.id, '검토 완료');
  expect(stageForApplication(useBoardStore.getState().applications.find(i => i.id === a.id))).toBe(1);
});
it.each(['officialLink', 'dueDate', 'requirement'])('감사: %s 누락 정보 확인 필요 렌더링', field => {
  const d = departments[0]; const original = structuredClone(d);
  useBoardStore.getState().selectMajors([{ departmentId: d.id, role: 'primary' }]);
  try {
    if (field === 'officialLink') d.officialLink = '';
    if (field === 'dueDate') d.stages[0].dueDate = '';
    if (field === 'requirement') d.requirements.primary = '' as never;
    expect(renderToStaticMarkup(createElement(StudentBoard))).toContain('정보 확인 필요');
  } finally { Object.assign(d, original); }
});
