import type { Department, Method, Stage, StepKind } from '@/lib/types';
export const step = (id: string, name: string, kind: StepKind, dueDate: string, description: string, documents: string, submissionMethod = '서비스 내 제출'): Stage => ({
  id, name, kind, dueDate, description, documents, submissionMethod, startDate: '2026-09-01T09:00', target: 'all', notes: '가상 시연 일정입니다.', required: true, contact: '학과사무실 · demo@example.invalid',
});
export const department = (id: string, name: string, college: string, color: string, method: Method, stages: Stage[]): Department => ({
  id, name, college, color, method, stages, semester: '2026-2', graduationSemester: '2027년 2월', requirements: {primary: '필수', secondary: '필수'}, sourceType: '가상', sourceDescription: '사용자가 제공한 2차 명세를 단순화한 가상 데이터. 공식 학과 정보로 검증하지 않았습니다.', officialLink: '예시 링크(가상)', checkedAt: '2026-09-22', publishedAt: '2026-09-22T00:00:00Z',
});
