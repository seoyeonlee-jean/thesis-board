import type { Application, BoardState, Professor, Student } from "@/lib/types";

export const demoStudentId = "student-1";
export const seedStudents: Student[] = [
  { id: demoStudentId, name: "김하늘", studentNo: "20231234", graduationSemester: "2027년 2월", majors: [{ departmentId: "psychology", role: "primary" }, { departmentId: "mechanical", role: "secondary" }], selectedMajors: [] },
  { id: "student-2", name: "이도윤", studentNo: "20221221", graduationSemester: "2027년 2월", majors: [{ departmentId: "sociology", role: "primary" }, { departmentId: "psychology", role: "secondary" }], selectedMajors: [{ departmentId: "sociology", role: "primary" }, { departmentId: "psychology", role: "secondary" }] },
  { id: "student-3", name: "박서윤", studentNo: "20221222", graduationSemester: "2027년 8월", majors: [{ departmentId: "sociology", role: "primary" }], selectedMajors: [{ departmentId: "sociology", role: "primary" }] },
  { id: "student-4", name: "최민준", studentNo: "20221223", graduationSemester: "2027년 2월", majors: [{ departmentId: "mechanical", role: "primary" }], selectedMajors: [{ departmentId: "mechanical", role: "primary" }] },
  { id: "student-5", name: "정유진", studentNo: "20221224", graduationSemester: "2027년 2월", majors: [{ departmentId: "psychology", role: "primary" }], selectedMajors: [{ departmentId: "psychology", role: "primary" }] },
  { id: "student-6", name: "강지후", studentNo: "20221225", graduationSemester: "2027년 8월", majors: [{ departmentId: "sociology", role: "primary" }], selectedMajors: [{ departmentId: "sociology", role: "primary" }] },
  { id: "student-7", name: "윤채원", studentNo: "20221226", graduationSemester: "2027년 2월", majors: [{ departmentId: "mechanical", role: "primary" }], selectedMajors: [{ departmentId: "mechanical", role: "primary" }] },
  { id: "student-8", name: "한시우", studentNo: "20221227", graduationSemester: "2027년 8월", majors: [{ departmentId: "psychology", role: "primary" }], selectedMajors: [{ departmentId: "psychology", role: "primary" }] }
];
export const seedProfessors: Professor[] = [
  { id: "prof-psych", name: "서진우 교수", departmentId: "psychology", keywords: ["인지", "학습"], topics: "학습과 기억", capacity: null, assigned: 3, available: true },
  { id: "prof-soc-open", name: "문예린 교수", departmentId: "sociology", keywords: ["도시", "불평등"], topics: "도시사회학", capacity: 3, assigned: 1, available: true },
  { id: "prof-soc-full", name: "차현우 교수", departmentId: "sociology", keywords: ["문화", "청년"], topics: "문화사회학", capacity: 2, assigned: 2, available: true },
  { id: "prof-mech", name: "신도현 교수", departmentId: "mechanical", keywords: ["설계", "제조"], topics: "기계 설계", capacity: null, assigned: 4, available: true }
];
export const seedApplications: Application[] = [
  { id: "app-soc-full", studentId: "student-3", departmentId: "sociology", professorId: "prof-soc-full", topic: "청년 문화", plan: "가상 연구계획", status: "대기", requestedAt: "2026-09-20", adminReview: "미검토", stageIndex: 0 }
];
export const createSeed = (): BoardState => ({ students: structuredClone(seedStudents), professors: structuredClone(seedProfessors), applications: structuredClone(seedApplications), histories: [{ id: "history-seed", actor: "시스템", at: "2026-09-21T09:00:00", detail: "가상 데모 데이터를 준비했습니다." }] });
