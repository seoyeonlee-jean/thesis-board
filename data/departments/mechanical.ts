import { department, step } from './shared';
export const mechanical = department('mechanical', '기계공학부', '공과대학', 'sky', 'course', [
  {...step('course1', '기계시스템설계1 수강', 'course', '2026-09-30T18:00', '수강 분반의 교수가 지도교수로 표시됩니다.', '수강 내역', '수강신청'), courseId: 'design1'},
  step('midterm', '중간점검', 'plan', '2026-10-23T18:00', '중간점검 자료를 제출하고 담당 교수의 확인을 받으세요.', '중간점검 자료', '수업'),
  {...step('course2', '기계시스템설계2 수강', 'course', '2026-11-02T18:00', '다음 수업의 분반을 선택하세요.', '수강 내역', '수강신청'), courseId: 'design2'},
  {...step('poster', '포스터 발표회', 'task', '2026-11-20T18:00', '발표회에 반드시 참석하세요.', '발표 포스터', '수업'), notes: '필수 참석'},
  step('final', '최종논문 제출·승인', 'final', '2026-12-11T18:00', '수강 분반 지도교수에게 최종논문을 제출하세요.', '최종논문 PDF / DOCX'),
]);
