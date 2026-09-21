import type { Application, ApplicationStatus, Department, Professor, ReviewStatus, Student } from "./types";

export const requiredRoadmaps = (student: Student, departments: Department[]) => student.selectedMajors.flatMap((major) => {
  const department = departments.find((item) => item.id === major.departmentId);
  return department && department.requirements?.[major.role] === "필수" ? [{ department, role: major.role }] : [];
});

export const missingRequirementMajors = (student: Student, departments: Department[]) => student.selectedMajors.filter(major => {
  const requirement = departments.find(d => d.id === major.departmentId)?.requirements?.[major.role];
  return requirement !== "필수" && requirement !== "면제";
});

export const reviewNotice = (application: Pick<Application, "status" | "adminReview"> | undefined) => {
  if (application?.status !== "승인" || application.adminReview === "검토 완료") return undefined;
  return application.adminReview === "보완 요청" ? "행정실 보완 요청 확인" : "행정실 확정 검토 중";
};

export const canApply = (department: Department, professor: Professor) => !department.usesCapacity || (professor.available && (professor.capacity ?? 0) > professor.assigned);
export const canApprove = (department: Department, professor: Professor) => !department.usesCapacity || (professor.capacity ?? 0) > professor.assigned;
export const canSetCapacity = (professor: Professor, capacity: number) => Number.isInteger(capacity) && capacity >= professor.assigned;
export const requiresFeedback = (status: ApplicationStatus | ReviewStatus) => ["수정 요청", "면담 요청", "반려", "보완 요청"].includes(status);
export const validFeedback = (status: ApplicationStatus | ReviewStatus, feedback?: string) => !requiresFeedback(status) || Boolean(feedback?.trim());

export const stageForApplication = (application: Application | undefined, review?: ReviewStatus) => {
  if (!application) return 0;
  if (application.status !== "승인") return 0;
  return (review ?? application.adminReview) === "검토 완료" ? 1 : 0;
};

export const nextTask = (student: Student, departments: Department[], applications: Application[]) => {
  const candidates = requiredRoadmaps(student, departments).map(({ department }) => {
    const application = applications.find((item) => item.studentId === student.id && item.departmentId === department.id);
    const stageIndex = stageForApplication(application);
    const notice = reviewNotice(application);
    const original = department.stages[stageIndex];
    const stage = notice ? { ...original, name: notice, description: application?.adminReview === "보완 요청"
      ? "행정실 피드백을 확인하고 요청된 내용을 보완해 주세요."
      : "교수 승인이 완료되었습니다. 행정실 확정 검토 결과를 기다려 주세요." } : original;
    return { department, stage, stageIndex };
  });
  return candidates.sort((a, b) => a.stage.dueDate.localeCompare(b.stage.dueDate))[0];
};

export const hasSameWeekConflict = (student: Student, departments: Department[], applications: Application[]) => {
  const tasks = requiredRoadmaps(student, departments).map(({ department }) => {
    const application = applications.find((item) => item.studentId === student.id && item.departmentId === department.id);
    return { departmentId: department.id, dueDate: department.stages[stageForApplication(application)].dueDate };
  });
  return tasks.some((task, index) => tasks.slice(index + 1).some((other) => Math.abs(new Date(task.dueDate).getTime() - new Date(other.dueDate).getTime()) < 7 * 86400000));
};
