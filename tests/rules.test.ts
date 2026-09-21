import { describe, expect, it } from "vitest";
import { departments, getDepartment } from "@/data/departments";
import { seedProfessors, seedStudents } from "@/data/seed";
import { canApply, canApprove, canSetCapacity, hasSameWeekConflict, nextTask, requiredRoadmaps, stageForApplication, validFeedback } from "@/lib/rules";
import type { Application } from "@/lib/types";

const demo = structuredClone(seedStudents[0]);
const psych = getDepartment("psychology")!;
const mech = getDepartment("mechanical")!;
const soc = getDepartment("sociology")!;
describe("학과별 졸업논문 규칙", () => {
  it("선택한 필수 전공의 로드맵만 생성한다", () => { demo.selectedMajors = [{ departmentId: "psychology", role: "primary" }, { departmentId: "mechanical", role: "secondary" }]; expect(requiredRoadmaps(demo, departments).map((item) => item.department.id)).toEqual(["psychology", "mechanical"]); });
  it("복수전공 면제 전공은 로드맵을 만들지 않는다", () => { demo.selectedMajors = [{ departmentId: "sociology", role: "secondary" }]; expect(requiredRoadmaps(demo, departments)).toHaveLength(0); });
  it("전공 통틀어 가장 이른 마감을 다음 할 일로 선택한다", () => { demo.selectedMajors = [{ departmentId: "psychology", role: "primary" }, { departmentId: "mechanical", role: "secondary" }]; expect(nextTask(demo, departments, [])?.department.id).toBe("psychology"); expect(hasSameWeekConflict(demo, departments, [])).toBe(true); });
  it("정원이 찬 교수에게 신청·승인할 수 없다", () => { const full = seedProfessors.find((item) => item.id === "prof-soc-full")!; expect(canApply(soc, full)).toBe(false); expect(canApprove(soc, full)).toBe(false); });
  it("정원을 배정 인원보다 작게 정할 수 없다", () => { const professor = seedProfessors.find((item) => item.id === "prof-soc-open")!; expect(canSetCapacity(professor, 0)).toBe(false); expect(canSetCapacity(professor, 2)).toBe(true); });
  it("승인 후 행정실 검토 완료일 때만 해당 전공의 다음 단계로 이동한다", () => { const application: Application = { id: "a", studentId: demo.id, departmentId: psych.id, professorId: "prof-psych", topic: "t", plan: "p", status: "승인", requestedAt: "2026-01-01", adminReview: "검토 완료", stageIndex: 0 }; expect(stageForApplication(application)).toBe(1); expect(stageForApplication({ ...application, adminReview: "미검토" })).toBe(0); expect(mech.stages[stageForApplication(undefined)].name).toBe("졸업논문 수업 수강"); });
  it("피드백이 필요한 상태는 빈 입력을 거부한다", () => { expect(validFeedback("수정 요청", "")).toBe(false); expect(validFeedback("반려", "사유")).toBe(true); expect(validFeedback("보완 요청", undefined)).toBe(false); });
});
