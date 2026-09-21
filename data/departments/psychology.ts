import type { Department } from "@/lib/types";
export const psychology: Department = { id: "psychology", name: "심리학과", semester: "2026-2", sourceType: "가상", sourceDescription: "해커톤 시연용 가상 절차", checkedAt: "2026-09-21", officialLink: "예시 링크(가상)", requirements: { primary: "필수", secondary: "필수" }, method: "contact_approval", usesCapacity: false, color: "violet", stages: [
  { id: "advisor", name: "지도교수 확정", description: "교수 컨택 후 승인 요청을 받습니다.", dueDate: "2026-10-08", documents: "컨택 기록", submissionMethod: "이메일", evidence: "교수 승인", notes: "교수 승인 뒤 행정실 검토가 필요합니다.", contact: "심리학과 행정실 (가상)" },
  { id: "writing", name: "논문 작성", description: "지도교수와 초안을 작성합니다.", dueDate: "2026-11-10", documents: "논문 초안", submissionMethod: "이메일", evidence: "제출 기록", notes: "면담 일정을 확인하세요.", contact: "심리학과 행정실 (가상)" },
  { id: "review", review: true, name: "심사 제출", description: "심사용 논문을 제출합니다.", dueDate: "2026-11-28", documents: "심사용 논문 PDF", submissionMethod: "시스템", evidence: "접수 확인", notes: "표지 양식을 확인하세요.", contact: "심리학과 행정실 (가상)" },
  { id: "result", name: "심사 결과 전달", description: "심사 결과와 보완 사항을 확인합니다.", dueDate: "2026-12-12", documents: "수정본", submissionMethod: "시스템", evidence: "결과 확인", notes: "보완 요청은 기한 내 처리하세요.", contact: "심리학과 행정실 (가상)" }
] };
