import type { Department } from "@/lib/types";
export const sociology: Department = { id: "sociology", name: "사회학과", semester: "2026-2", sourceType: "가상", sourceDescription: "해커톤 시연용 가상 절차", checkedAt: "2026-09-21", officialLink: "예시 링크(가상)", requirements: { primary: "필수", secondary: "면제" }, method: "application", usesCapacity: true, color: "amber", stages: [
  { id: "advisor", name: "지도교수 신청", description: "시스템에서 지도교수를 신청합니다.", dueDate: "2026-10-06", documents: "지도교수 신청서", submissionMethod: "시스템", evidence: "신청 접수", notes: "정원이 찬 교수에게는 신청할 수 없습니다.", contact: "사회학과 행정실 (가상)" },
  { id: "plan", name: "연구계획서 제출", description: "승인 뒤 연구계획서를 제출합니다.", dueDate: "2026-10-27", documents: "연구계획서 PDF", submissionMethod: "시스템", evidence: "접수 확인", notes: "지도교수와 내용을 확인하세요.", contact: "사회학과 행정실 (가상)" },
  { id: "midterm", name: "중간발표", description: "중간발표를 합니다.", dueDate: "2026-11-17", documents: "발표 자료", submissionMethod: "수업", evidence: "발표 확인", notes: "발표 시간은 추후 안내됩니다.", contact: "사회학과 행정실 (가상)" },
  { id: "final", name: "최종논문 제출", description: "최종논문을 제출합니다.", dueDate: "2026-12-05", documents: "최종논문 PDF", submissionMethod: "시스템", evidence: "접수 확인", notes: "새 표지 양식을 사용하세요.", contact: "사회학과 행정실 (가상)" },
  { id: "done", name: "심사 완료", description: "심사 결과를 확인합니다.", dueDate: "2026-12-19", documents: "수정본", submissionMethod: "시스템", evidence: "결과 확인", notes: "수정 지시를 확인하세요.", contact: "사회학과 행정실 (가상)" }
] };
