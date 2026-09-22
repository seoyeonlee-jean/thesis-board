import { department, step } from './shared';
export const chinese = department('chinese', '중어중문학과', '인문대학', 'amber', 'application', [
  step('outline', '논문제출신청·개요 제출', 'task', '2026-10-01T18:00', '논문 개요를 준비해 제출하세요.', '논문 개요', '학과사무실'),
  step('advisor', '지도교수 신청·승인', 'approval', '2026-10-09T18:00', '교수를 선택해 지도 신청을 보내세요.', '지도 신청서'),
  step('writing', '면담 및 작성', 'task', '2026-11-13T18:00', '지도교수와 논의하며 논문을 작성하세요.', '논문 초안'),
  {...step('presentation', '졸업논문 발표회', 'task', '2026-11-27T18:00', '발표회에 반드시 참석하세요.', '발표 자료', '수업'), notes: '필수 참석'},
  step('final', '최종본 제출', 'final', '2026-12-04T18:00', '최종 논문 파일을 제출하세요.', '최종논문 PDF / DOCX'),
]);
