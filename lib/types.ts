export type Role = "primary" | "secondary";
export type Requirement = "필수" | "면제";
export type Method = "contact_approval" | "application" | "course_assigned";
export type ApplicationStatus = "대기" | "수정 요청" | "면담 요청" | "승인" | "반려";
export type ReviewStatus = "미검토" | "검토 완료" | "보완 요청";

export interface Stage { id: string; name: string; description: string; dueDate: string; documents: string; submissionMethod: string; evidence: string; notes: string; contact: string; }
export interface Department { id: string; name: string; semester: string; sourceType: "실제 공지" | "일부 가정" | "가상"; sourceDescription: string; checkedAt: string; officialLink: string; requirements: Record<Role, Requirement>; method: Method; usesCapacity: boolean; color: string; stages: Stage[]; }
export interface Student { id: string; name: string; studentNo: string; graduationSemester: string; majors: { departmentId: string; role: Role }[]; selectedMajors: { departmentId: string; role: Role }[]; }
export interface Professor { id: string; name: string; departmentId: string; keywords: string[]; topics: string; capacity: number | null; assigned: number; available: boolean; }
export interface Application { id: string; studentId: string; departmentId: string; professorId: string; topic: string; plan: string; status: ApplicationStatus; feedback?: string; requestedAt: string; adminReview: ReviewStatus; stageIndex: number; }
export interface History { id: string; actor: string; at: string; detail: string; }
export interface BoardState { students: Student[]; professors: Professor[]; applications: Application[]; histories: History[]; }
