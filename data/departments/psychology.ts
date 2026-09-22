import { department, step } from './shared';
export const psychology = department('psychology', '심리학과', '사회과학대학', 'violet', 'application', [
  step('apply', '지도교수 신청', 'application', '2026-10-02T18:00', '관심 교수에게 연구 방향을 소개해 주세요.', '지도 신청서'),
  step('advisor', '지도교수 승인', 'approval', '2026-10-08T18:00', '교수의 검토와 면담 안내를 확인하세요.', '지도 신청서'),
  step('plan', '연구계획서 제출', 'plan', '2026-10-23T18:00', '지도교수와 논의한 연구계획을 제출하세요.', '연구계획서 PDF / DOCX 또는 본문'),
  step('writing', '논문 작성', 'task', '2026-11-13T18:00', '초안을 작성하고 진행 상황을 확인하세요.', '논문 초안'),
  step('final', '최종논문 제출·승인', 'final', '2026-12-04T18:00', '최종 파일을 제출하고 교수의 승인을 받으세요.', '최종논문 PDF / DOCX'),
  step('office', '학과 제출', 'task', '2026-12-18T18:00', '승인된 논문을 학과에 제출한 뒤 완료를 기록하세요.', '승인된 최종논문', '학과사무실'),
]);
