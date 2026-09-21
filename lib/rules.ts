import type { Application, ApplicationStatus, Department, Professor, ReviewStatus, Student, Submission, BoardState } from "./types";

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

export const progressIndex = (studentId: string, department: Department, applications: Application[], submissions: Submission[] = []) => {
  const application = applications.find(a => a.studentId === studentId && a.departmentId === department.id);
  const advisor = department.stages.findIndex(s => s.id === 'advisor');
  let index = application?.status === '승인' && application.adminReview === '검토 완료' ? advisor + 1 : 0;
  while (index < department.stages.length && index !== advisor && submissions.some(s => s.studentId === studentId && s.departmentId === department.id && s.stageId === department.stages[index].id)) index++;
  return index;
};

export const nextTask = (student: Student, departments: Department[], applications: Application[], submissions: Submission[] = []) => {
  const candidates = requiredRoadmaps(student, departments).flatMap(({ department }) => {
    const application = applications.find((item) => item.studentId === student.id && item.departmentId === department.id);
    const stageIndex = progressIndex(student.id, department, applications, submissions);
    if (stageIndex >= department.stages.length) return [];
    const notice = reviewNotice(application);
    const original = department.stages[stageIndex];
    const stage = notice ? { ...original, name: notice, description: application?.adminReview === "보완 요청"
      ? "행정실 피드백을 확인하고 요청된 내용을 보완해 주세요."
      : "교수 승인이 완료되었습니다. 행정실 확정 검토 결과를 기다려 주세요." } : original;
    return [{ department, stage, stageIndex }];
  });
  return candidates.sort((a, b) => a.stage.dueDate.localeCompare(b.stage.dueDate))[0];
};

export const weekStart = (date: string) => {
  const d = new Date(date + 'T00:00:00Z');
  if (!Number.isFinite(d.getTime())) return '';
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0,10);
};
export const deadlineConflicts = (student: Student, departments: Department[]) => {
  const weeks = new Map<string, Set<string>>();
  for (const {department} of requiredRoadmaps(student, departments)) for (const stage of department.stages) {
    const week = weekStart(stage.dueDate); if (!week) continue;
    const ids = weeks.get(week) ?? new Set<string>(); ids.add(department.id); weeks.set(week,ids);
  }
  return [...weeks].filter(([,ids]) => ids.size > 1).map(([week,ids]) => ({week,departmentIds:[...ids]}));
};
export const hasSameWeekConflict = (student: Student, departments: Department[], _applications: Application[]) => deadlineConflicts(student,departments).length > 0;

export const effectiveStudent = (student: Student) => ({...student, selectedMajors: student.selectedMajors.length ? student.selectedMajors : student.majors});
export const adminRows = (state: BoardState, departments: Department[], filter = 'all') => state.students.flatMap(student => requiredRoadmaps(effectiveStudent(student), departments).filter(({department}) => filter === 'all' || department.id === filter).map(({department,role}) => {
  const app = state.applications.find(a => a.studentId === student.id && a.departmentId === department.id);
  const professor = state.professors.find(p => p.id === app?.professorId);
  const index = progressIndex(student.id,department,state.applications,state.submissions);
  const reason = !app ? (department.method === 'course_assigned' ? '수업 배정 대기' : '미신청') : app.adminReview === '검토 완료' ? '확정' : app.adminReview === '보완 요청' ? '보완 요청' : app.status === '승인' ? '확정 검토 대기' : app.status === '대기' && professor && !canApprove(department,professor) ? '정원 마감' : app.status;
  return {student,department,role,app,professor,index,reason};
}));

export type BoardCommand =
 | {type:'contact'; studentId:string; departmentId:string; professorId:string}
 | {type:'request'; studentId:string; departmentId:string; professorId:string; topic:string; plan:string}
 | {type:'decide'; id:string; status:ApplicationStatus; feedback?:string}
 | {type:'review'; id:string; status:ReviewStatus; feedback?:string}
 | {type:'assign'; studentId:string; departmentId:string; professorId:string}
 | {type:'submit'; studentId:string; departmentId:string; stageId:string};

// Pure transition: caller supplies time/ID; rejected commands preserve state.
export function transition(state: BoardState, departments: Department[], command: BoardCommand, at:string, id:string): BoardState {
  const record = (patch:Partial<BoardState>, actor:string, detail:string) => ({...state,...patch,histories:[...state.histories,{id,at,actor,detail}]});
  if (command.type === 'decide' || command.type === 'review') {
    const app = state.applications.find(a=>a.id===command.id); if (!app) return state;
    const d=departments.find(d=>d.id===app.departmentId), p=state.professors.find(p=>p.id===app.professorId);
    if(!d || !p || !validFeedback(command.status,command.feedback)) return state;
    if(command.type==='decide') {
      if(app.status==='승인' || command.status==='대기' || (command.status==='승인' && !canApprove(d,p))) return state;
      return record({applications:state.applications.map(a=>a.id===app.id?{...a,status:command.status,feedback:command.feedback?.trim(),adminReview:'미검토'}:a),professors:state.professors.map(item=>item.id===p.id && command.status==='승인' && d.usesCapacity?{...item,assigned:item.assigned+1}:item)},p.name,app.studentId+' · '+d.name+' 신청 '+command.status);
    }
    if(app.status!=='승인' || app.adminReview==='검토 완료' || command.status==='미검토') return state;
    return record({applications:state.applications.map(a=>a.id===app.id?{...a,adminReview:command.status,feedback:command.feedback?.trim() || a.feedback}:a)},'행정실',app.studentId+' · '+d.name+' '+command.status);
  }
  const student=state.students.find(s=>s.id===command.studentId), department=departments.find(d=>d.id===command.departmentId);
  if(!student || !department || !requiredRoadmaps(effectiveStudent(student),departments).some(r=>r.department.id===department.id)) return state;
  if(command.type==='submit') {
    const index=progressIndex(student.id,department,state.applications,state.submissions);
    const stage=department.stages[index];
    if(!stage || stage.id!==command.stageId || stage.id==='advisor') return state;
    return record({submissions:[...state.submissions,{studentId:student.id,departmentId:department.id,stageId:stage.id,at}]},student.name,department.name+' · '+stage.name+' 제출 상태 기록');
  }
  const professor=state.professors.find(p=>p.id===command.professorId && p.departmentId===department.id); if(!professor)return state;
  const app=state.applications.find(a=>a.studentId===student.id && a.departmentId===department.id);
  if(command.type==='contact') {
    if(department.method!=='contact_approval' || state.contacts.some(c=>c.studentId===student.id && c.professorId===professor.id))return state;
    return record({contacts:[...state.contacts,{studentId:student.id,departmentId:department.id,professorId:professor.id,at}]},student.name,department.name+' · '+professor.name+' 컨택 완료');
  }
  if(command.type==='assign') {
    if(department.method!=='course_assigned' || app)return state;
  } else {
    if(department.method==='course_assigned' || !canApply(department,professor) || !command.topic.trim() || !command.plan.trim() || app && !['수정 요청','면담 요청','반려'].includes(app.status))return state;
    if(department.method==='contact_approval' && !state.contacts.some(c=>c.studentId===student.id && c.professorId===professor.id))return state;
  }
  const assigned=command.type==='assign';
  const application:Application={id:app?.id ?? id,studentId:student.id,departmentId:department.id,professorId:professor.id,topic:command.type==='request'?command.topic.trim():'수업 배정',plan:command.type==='request'?command.plan.trim():'수업에서 배정',status:assigned?'승인':'대기',adminReview:assigned?'검토 완료':'미검토',requestedAt:at,stageIndex:0};
  return record({applications:[...state.applications.filter(a=>a.id!==app?.id),application]},assigned?'행정실':student.name,department.name+' · '+professor.name+' '+(assigned?'배정 완료':'승인 요청'));
}
