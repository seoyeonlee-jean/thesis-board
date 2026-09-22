export type MajorRole = 'primary' | 'secondary';
export type Target = MajorRole | 'all';
export type Method = 'application' | 'course';
export type StepKind = 'application' | 'approval' | 'plan' | 'final' | 'task' | 'course';
export type ApplicationStatus = '제출됨' | '수정 요청' | '면담 요청' | '승인' | '반려';
export type ReviewStatus = '제출됨' | '승인' | '수정 요청';
export interface Attachment { name: string; type: string; size: number; data: string; }
export interface Stage {
  id: string; name: string; kind: StepKind; startDate: string; dueDate: string;
  target: Target; documents: string; submissionMethod: string; description: string;
  notes: string; required: boolean; contact: string; file?: Attachment; changedAt?: string; courseId?: string;
}
export interface Department {
  id: string; name: string; college: string; color: string; semester: string; graduationSemester: string;
  method: Method; requirements: Record<MajorRole, '필수' | '면제'>;
  sourceType: '가상' | '일부 가정' | '실제 공지'; sourceDescription: string; officialLink: string; checkedAt: string;
  stages: Stage[]; publishedAt: string;
}
export interface Major { departmentId: string; role: MajorRole; }
export interface Student { id: string; name: string; studentNo: string; graduationSemester: string; registeredSemesters: number; majors: Major[]; enrollmentIds: string[]; }
export interface Professor { id: string; name: string; departmentId: string; field: string; keywords: string[]; topics: string; labLink: string; contact: string; year: number; capacity: number; baselineAssigned: number; available: boolean; }
export interface Assistant { id: string; name: string; departmentId: string; }
export interface CourseSection { id: string; departmentId: string; courseId: string; name: string; professorId: string; }
export interface Feedback { text: string; at: string; editedAt?: string; history: {text: string; at: string}[]; }
export interface Draft { id: string; studentId: string; departmentId: string; stageId: string; professorId: string; title: string; summary: string; body: string; file?: Attachment; meetingWanted: boolean; savedAt: string; }
export interface Application extends Omit<Draft, 'savedAt'> { status: ApplicationStatus; requestedAt: string; feedback?: Feedback; }
export interface Submission { id: string; studentId: string; departmentId: string; stageId: string; professorId: string; kind: 'plan' | 'final'; title: string; body: string; file?: Attachment; version: number; status: ReviewStatus; submittedAt: string; feedback?: Feedback; }
export interface Meeting { id: string; applicationId: string; studentId: string; professorId: string; departmentId: string; slots: string[]; selected?: string; status: '시간 제안됨' | '확정' | '완료'; location: string; }
export interface Notice { id: string; departmentId: string; title: string; body: string; semester: string; graduationSemester: string; target: Target; stageId: string; eventAt: string; file?: Attachment; publishedAt?: string; savedAt: string; }
export interface Notification { id: string; recipientId: string; text: string; href: string; at: string; read: boolean; }
export interface History { id: string; actor: string; at: string; detail: string; }
export interface Completion { studentId: string; departmentId: string; stageId: string; at: string; }
export type Actor = { role: 'student' | 'professor' | 'assistant'; id: string; };
export interface BoardState {
  departments: Department[]; procedureDrafts: Record<string, Department>; procedureSavedAt: Record<string, string>;
  students: Student[]; professors: Professor[]; assistants: Assistant[]; sections: CourseSection[];
  drafts: Draft[]; applications: Application[]; submissions: Submission[]; meetings: Meeting[];
  notices: Notice[]; noticeDrafts: Record<string, Notice>; notifications: Notification[]; histories: History[]; completions: Completion[];
}
