"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSeed, demoStudentId } from "@/data/seed";
import { getDepartment } from "@/data/departments";
import { canApprove, canSetCapacity, validFeedback } from "./rules";
import type { ApplicationStatus, BoardState, ReviewStatus, Role } from "./types";

type Store = BoardState & {
  selectMajors: (majors: { departmentId: string; role: Role }[]) => void;
  requestApproval: (departmentId: string, professorId: string) => void;
  decideApplication: (applicationId: string, status: ApplicationStatus, feedback?: string) => boolean;
  reviewApplication: (applicationId: string, status: ReviewStatus, feedback?: string) => boolean;
  setCapacity: (professorId: string, capacity: number) => boolean;
  reset: () => void;
};
const history = (actor: string, detail: string) => ({ id: crypto.randomUUID(), actor, detail, at: new Date().toISOString() });
export const useBoardStore = create<Store>()(persist((set, get) => ({ ...createSeed(),
  selectMajors: (majors) => set((state) => ({ students: state.students.map((student) => student.id === demoStudentId ? { ...student, selectedMajors: majors } : student), histories: [...state.histories, history("학생", "전공별 로드맵을 생성했습니다.")] })),
  requestApproval: (departmentId, professorId) => set((state) => {
    if (state.applications.some((item) => item.studentId === demoStudentId && item.departmentId === departmentId)) return state;
    return { applications: [...state.applications, { id: crypto.randomUUID(), studentId: demoStudentId, departmentId, professorId, topic: "학습 과정에서의 기억 형성", plan: "가상 연구계획 요약입니다.", status: "대기", requestedAt: new Date().toISOString().slice(0, 10), adminReview: "미검토", stageIndex: 0 }], histories: [...state.histories, history("학생", "지도교수 승인 요청을 제출했습니다.")] };
  }),
  decideApplication: (applicationId, status, feedback) => {
    const state = get(); const app = state.applications.find((item) => item.id === applicationId); if (!app || !validFeedback(status, feedback)) return false;
    const department = getDepartment(app.departmentId); const professor = state.professors.find((item) => item.id === app.professorId); if (!department || !professor || (status === "승인" && !canApprove(department, professor))) return false;
    set({ applications: state.applications.map((item) => item.id === applicationId ? { ...item, status, feedback: feedback?.trim() } : item), professors: status === "승인" && department.usesCapacity ? state.professors.map((item) => item.id === professor.id ? { ...item, assigned: item.assigned + 1 } : item) : state.professors, histories: [...state.histories, history("교수", `신청을 ${status} 처리했습니다.`)] }); return true;
  },
  reviewApplication: (applicationId, status, feedback) => {
    if (!validFeedback(status, feedback)) return false;
    set((state) => ({ applications: state.applications.map((item) => item.id === applicationId ? { ...item, adminReview: status, feedback: feedback?.trim() || item.feedback } : item), histories: [...state.histories, history("행정실", `확정 검토를 ${status} 처리했습니다.`)] })); return true;
  },
  setCapacity: (professorId, capacity) => { const professor = get().professors.find((item) => item.id === professorId); if (!professor || !canSetCapacity(professor, capacity)) return false; set((state) => ({ professors: state.professors.map((item) => item.id === professorId ? { ...item, capacity } : item), histories: [...state.histories, history("교수", "지도 정원을 변경했습니다.")] })); return true; },
  reset: () => set(createSeed())
}), { name: "graduation-thesis-board" }));
