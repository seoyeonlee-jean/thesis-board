import type { Department } from "@/lib/types";
export const mechanical: Department = { id: "mechanical", name: "기계공학과", semester: "2026-2", sourceType: "가상", sourceDescription: "해커톤 시연용 가상 절차", checkedAt: "2026-09-21", officialLink: "예시 링크(가상)", requirements: { primary: "필수", secondary: "필수" }, method: "course_assigned", usesCapacity: false, color: "sky", stages: [
  { id: "course", name: "졸업논문 수업 수강", description: "지정 수업을 수강합니다.", dueDate: "2026-10-10", documents: "수강 확인", submissionMethod: "수업", evidence: "수강 명단", notes: "학생 신청은 필요 없습니다.", contact: "기계공학과 행정실 (가상)" },
  { id: "advisor", name: "지도교수 배정 확인", description: "행정실이 배정한 지도교수를 확인합니다.", dueDate: "2026-10-24", documents: "배정 확인", submissionMethod: "시스템", evidence: "배정 결과", notes: "배정 문의는 행정실로 하세요.", contact: "기계공학과 행정실 (가상)" },
  { id: "midterm", name: "중간발표", description: "중간발표를 진행합니다.", dueDate: "2026-11-14", documents: "발표 자료", submissionMethod: "수업", evidence: "발표 확인", notes: "수업 공지를 따르세요.", contact: "기계공학과 행정실 (가상)" },
  { id: "final", name: "최종논문 제출", description: "최종 논문을 제출합니다.", dueDate: "2026-12-04", documents: "최종논문 PDF", submissionMethod: "시스템", evidence: "접수 확인", notes: "기한 뒤 제출은 불가합니다.", contact: "기계공학과 행정실 (가상)" },
  { id: "grade", name: "성적 반영", description: "성적 반영 여부를 확인합니다.", dueDate: "2026-12-18", documents: "없음", submissionMethod: "시스템", evidence: "성적 확인", notes: "이의 신청 기한을 확인하세요.", contact: "기계공학과 행정실 (가상)" }
] };
