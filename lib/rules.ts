import type { Actor, Application, Attachment, BoardState, Department, Draft, Feedback, Notice, Professor, Stage, Student, Submission } from './types';

export const FILE_LIMIT = 512 * 1024;
export const validFile = (f?: Attachment) => !f || (f.size > 0 && f.size <= FILE_LIMIT && /\.(pdf|docx)$/i.test(f.name) && /^data:application\/(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document);base64,[A-Za-z0-9+/=]+$/.test(f.data));
export const majorRole = (s: Student, departmentId: string) => s.majors.find(m => m.departmentId === departmentId)?.role;
export const stagesFor = (s: Student, d: Department) => {
  const role = majorRole(s,d.id);
  return role && d.requirements?.[role] === '필수' ? d.stages.filter(step => (step.target === 'all' || step.target === role) && (d.method !== 'course' || !['application','approval'].includes(step.kind))) : [];
};
export const applicationFor = (s: BoardState, studentId: string, departmentId: string) => [...s.applications].reverse().find(a => a.studentId === studentId && a.departmentId === departmentId);
export function advisorFor(s: BoardState, student: Student, d: Department) {
  const id = d.method === 'course'
    ? [...student.enrollmentIds].reverse().map(id => s.sections.find(c => c.id === id && c.departmentId === d.id)).find(Boolean)?.professorId
    : s.applications.find(a => a.studentId === student.id && a.departmentId === d.id && a.status === '승인')?.professorId;
  return s.professors.find(p => p.id === id);
}
export const approvedCount = (s: BoardState, p: Professor) => p.baselineAssigned + s.applications.filter(a => a.professorId === p.id && a.status === '승인').length
  + s.students.filter(st => st.enrollmentIds.some(id => s.sections.some(c => c.id === id && c.professorId === p.id))).length;
export const canApply = (s: BoardState, p: Professor) => p.available && approvedCount(s,p) < p.capacity;
export const latestSubmission = (s: BoardState, studentId: string, departmentId: string, stageId: string) => [...s.submissions].reverse().find(v => v.studentId === studentId && v.departmentId === departmentId && v.stageId === stageId);
export function stageDone(s: BoardState, student: Student, d: Department, step: Stage) {
  if(step.stepType==='MEETING') return s.meetings.some(m=>m.studentId===student.id && m.departmentId===d.id && m.stageId===step.id && m.status==='완료');
  const a = applicationFor(s, student.id, d.id);
  if(step.kind === 'application') return !!a && a.status !== '반려' && (d.stages.some(v => v.kind === 'approval') || a.status === '승인');
  if(step.kind === 'approval') return a?.status === '승인';
  if(step.kind === 'course') return student.enrollmentIds.some(id => s.sections.some(c => c.id === id && c.departmentId === d.id && c.courseId === step.courseId));
  if(step.kind === 'plan' || step.kind === 'final') return ['승인','접수됨'].includes(latestSubmission(s,student.id,d.id,step.id)?.status??'');
  return s.completions.some(v => v.studentId === student.id && v.departmentId === d.id && v.stageId === step.id);
}
export function progress(s: BoardState, student: Student, d: Department) {
  const steps = stagesFor(student,d);
  const index = steps.findIndex(step => !stageDone(s,student,d,step));
  return {steps,index:index < 0 ? steps.length : index, current:index < 0 ? undefined : steps[index], completed:steps.filter(step => stageDone(s,student,d,step)).length};
}
export const dday = (date: string, now: string) => {
  if(!date)return '정보 확인 필요';
  const due=new Date(date),today=new Date(now);
  if(!Number.isFinite(due.getTime())||!Number.isFinite(today.getTime()))return '정보 확인 필요';
  const days=Math.round((Date.UTC(due.getFullYear(),due.getMonth(),due.getDate())-Date.UTC(today.getFullYear(),today.getMonth(),today.getDate()))/86400000);
  return days<0?'마감 '+Math.abs(days)+'일 지남':due.getTime()<today.getTime()?'마감 시간 지남':days===0?'오늘 마감':'마감까지 '+days+'일';
};
export function stageStatus(s: BoardState, student: Student, d: Department, step: Stage, now: string) {
  if(stageDone(s,student,d,step)) return '완료';
  const current = progress(s,student,d).current;
  if(current?.id !== step.id) return '예정';
  const app = applicationFor(s,student.id,d.id);
  const sub = latestSubmission(s,student.id,d.id,step.id);
  if((['application','approval'].includes(step.kind) && app?.status === '수정 요청') || sub?.status === '수정 요청') return '보완 필요';
  const due=deadlinesFor(s,student.id,d,step).map(v=>v.deadline).sort()[0];
  return due && new Date(due).getTime() < new Date(now).getTime() ? '마감 지남' : '진행 중';
}
export const noticeMatches = (n: Notice, s: Student, d: Department) => !!n.publishedAt && n.departmentId === d.id && n.semester === d.semester && (!n.graduationSemester || n.graduationSemester === s.graduationSemester) && (n.target === 'all' || n.target === majorRole(s,d.id));
export const draftKey = (studentId: string, departmentId: string, stageId: string) => [studentId,departmentId,stageId].join(':');
export const emptyDraft = (studentId: string, departmentId: string, stageId: string): Draft => ({id:draftKey(studentId,departmentId,stageId),studentId,departmentId,stageId,professorId:'',title:'',summary:'',body:'',meetingWanted:false,savedAt:''});
export function deadlinesFor(s:BoardState,studentId:string,d:Department,step:Stage) {
  if(!step.conditionalDeadlines?.length) return step.dueDate ? [{condition:'',deadline:step.dueDate}] : [];
  const result=[...s.reviewOutcomes].reverse().find(r=>r.studentId===studentId&&r.departmentId===d.id);
  return result ? step.conditionalDeadlines.filter(v=>v.condition===result.condition) : step.conditionalDeadlines;
}
export const duplicateSubmission = (s:BoardState, draft:Draft) => !!draft.file && s.submissions.some(v=>v.studentId===draft.studentId && v.departmentId!==draft.departmentId && v.kind==='final' && v.file?.data===draft.file!.data);
export function validateProcedure(d: Department): string | undefined {
  if(!d.semester.trim() || !d.graduationSemester.trim()) return '적용 학기와 졸업예정 학기를 입력해 주세요.';
  if(!['application','course'].includes(d.method)) return '지도교수 결정 방식을 확인해 주세요.';
  if(!d.stages.length || new Set(d.stages.map(s => s.id)).size !== d.stages.length) return '서로 다른 단계가 하나 이상 필요합니다.';
  for(const s of d.stages) {
    if(!s.name.trim() || !s.description.trim() || !s.documents.trim() || !s.submissionMethod.trim()) return '단계명·설명·제출물·제출처를 모두 입력해 주세요.';
    if((s.startDate && !Number.isFinite(Date.parse(s.startDate))) || (s.dueDate && !Number.isFinite(Date.parse(s.dueDate))) || (s.startDate && s.dueDate && s.startDate>s.dueDate)) return '마감은 시작 이후여야 합니다.';
    if(s.dateStatus==='CONFIRMED' && !s.dueDate && !s.conditionalDeadlines?.length) return '확인된 일정에는 마감일 또는 조건부 마감이 필요합니다.';
    if(s.approver && !['ADVISOR','NONE','EXTERNAL'].includes(s.approver)) return '완료 판정 주체를 확인해 주세요.';
    if(s.conditionalDeadlines?.some(v=>!v.condition.trim()||!Number.isFinite(Date.parse(v.deadline))) || new Set(s.conditionalDeadlines?.map(v=>v.condition)).size!==(s.conditionalDeadlines?.length??0)) return '조건부 마감의 조건과 날짜는 서로 다르게 입력해 주세요.';
    if(s.stepType && !['APPLICATION','ADVISOR_REQUEST','COURSE_ENROLLMENT','PLAN_SUBMISSION','MEETING','CHECKPOINT','PRESENTATION','FINAL_SUBMISSION','EXTERNAL_SUBMISSION'].includes(s.stepType)) return '단계 유형을 확인해 주세요.';
    if(s.stepType==='CHECKPOINT' && s.approver!=='ADVISOR') return '중간점검은 교수 확인이 필요합니다.';
    if(s.stepType==='MEETING' && s.approver!=='ADVISOR') return '면담 완료는 교수가 확인합니다.';
    if(s.submitTo && !['IN_SERVICE','DEPT_OFFICE','EMAIL','OTHER'].includes(s.submitTo))return '제출처 구분을 확인해 주세요.';
    if(s.dateStatus && !['CONFIRMED','PLACEHOLDER'].includes(s.dateStatus))return '날짜 근거를 확인해 주세요.';
    if(s.stepType) {
      const kinds:Record<string,string>={APPLICATION:'plan',ADVISOR_REQUEST:'approval',COURSE_ENROLLMENT:'course',PLAN_SUBMISSION:'plan',MEETING:'task',CHECKPOINT:s.collectsReviewOutcome?'task':'plan',PRESENTATION:s.submitTo==='IN_SERVICE'?'plan':'task',FINAL_SUBMISSION:'final',EXTERNAL_SUBMISSION:'task'};
      if(s.kind!==kinds[s.stepType])return '단계 유형과 진행 방식이 일치해야 합니다.';
      if(['ADVISOR_REQUEST','FINAL_SUBMISSION'].includes(s.stepType)&&s.approver!=='ADVISOR')return '이 단계는 지도교수 승인이 필요합니다.';
      if(['APPLICATION','EXTERNAL_SUBMISSION'].includes(s.stepType)&&s.approver!=='NONE')return '이 단계는 서비스 기록 또는 학생 자가 체크입니다.';
      if(s.collectsReviewOutcome && !d.stages.some(v=>v.conditionalDeadlines?.length))return '심사 결과에 연결할 조건부 마감이 필요합니다.';
    }
    if(!['all','primary','secondary'].includes(s.target) || !['application','approval','plan','final','task','course'].includes(s.kind) || !validFile(s.file)) return '단계 유형·대상 또는 첨부 형식을 확인해 주세요.';
    if(s.kind === 'course' && !s.courseId) return '수업 단계에는 수업 코드를 입력해 주세요.';
  }
}
export type Command =
  | {type:'proposeMeeting'; studentId:string; departmentId:string; slots:string[]; location:string}
  | {type:'recordOutcome'; studentId:string; departmentId:string; condition:string}
  | {type:'saveDraft' | 'sendApplication' | 'sendSubmission'; draft:Draft}
  | {type:'decide'; id:string; status:Application['status']; feedback:string; slots?:string[]; location?:string}
  | {type:'editFeedback'; target:'application' | 'submission'; id:string; text:string}
  | {type:'selectSlot'; id:string; slot:string}
  | {type:'completeMeeting'; id:string}
  | {type:'review'; id:string; status:'승인' | '수정 요청'; feedback:string}
  | {type:'capacity'; capacity:number; available:boolean; year:number}
  | {type:'saveProcedure' | 'publishProcedure'; department:Department}
  | {type:'saveNotice' | 'publishNotice'; notice:Notice}
  | {type:'completeStep'; departmentId:string; stageId:string}
  | {type:'enroll'; sectionId:string}
  | {type:'readNotification'; id:string};
export interface Result { state: BoardState; error?: string; }
export function keepsStageOrder(before:Stage[],after:Stage[]) {
  const retained=before.filter(s=>after.some(v=>v.id===s.id)).map(s=>s.id);
  return retained.every((id,i)=>after[i]?.id===id);
}
export function transition(state: BoardState, actor: Actor, command: Command, at: string, id: string): Result {
  const student = actor.role === 'student' ? state.students.find(s => s.id === actor.id) : undefined;
  const professor = actor.role === 'professor' ? state.professors.find(p => p.id === actor.id) : undefined;
  const assistant = actor.role === 'assistant' ? state.assistants.find(a => a.id === actor.id) : undefined;
  const reject = (error = '이 작업을 처리할 권한이 없거나 현재 상태에서 실행할 수 없습니다.'): Result => ({state,error});
  if(!student && !professor && !assistant) return reject();
  const name = student?.name ?? professor?.name ?? assistant!.name;
  const notes: {recipientId:string;text:string;href:string}[] = [];
  const studentLink = (dept:string) => '/student?department='+dept;
  const notify = (recipientId:string,text:string,href:string) => notes.push({recipientId,text,href});
  const finish = (patch:Partial<BoardState>, detail:string): Result => ({state:{...state,...patch,
    histories:[...state.histories,{id,actor:name,at,detail}],
    notifications:[...state.notifications,...notes.map((n,i)=>({...n,id:id+'-'+i,at,read:false}))],
  }});
  const feedback = (text:string, old?:Feedback): Feedback => ({text:text.trim(),at:old?.at ?? at,editedAt:old ? at : undefined,history:old ? [...old.history,{text:old.text,at:old.editedAt ?? old.at}] : []});
  if(command.type === 'readNotification') {
    const n=state.notifications.find(n=>n.id===command.id && n.recipientId===actor.id);
    return n ? {state:{...state,notifications:state.notifications.map(v=>v.id===n.id?{...v,read:true}:v)}} : reject();
  }
  if(command.type === 'capacity') {
    if(!professor) return reject();
    if(!Number.isInteger(command.capacity) || command.capacity < approvedCount(state,professor)) return reject('정원은 현재 승인 인원보다 작을 수 없습니다.');
    const max=state.departments.find(d=>d.id===professor.departmentId)?.maxStudentsPerAdvisor;
    if(max!==undefined && command.capacity>max)return reject('학과의 교수 1인당 상한을 초과할 수 없습니다.');
    if(!Number.isInteger(command.year) || command.year < 2026 || command.year > 2100) return reject('학년도를 확인해 주세요.');
    return finish({professors:state.professors.map(p=>p.id===professor.id?{...p,capacity:command.capacity,available:command.available,year:command.year}:p)},'학년도 지도 정원·모집 상태 변경');
  }
  if(command.type === 'saveProcedure' || command.type === 'publishProcedure') {
    const incoming=command.department;
    if(!assistant || assistant.departmentId!==incoming.id) return reject();
    const old=state.departments.find(d=>d.id===incoming.id); if(!old)return reject();
    if(!keepsStageOrder((state.procedureDrafts[old.id]??old).stages,incoming.stages))return reject('단계 순서는 고정입니다. 새 단계는 목록 마지막에 추가해 주세요.');
    // Only procedure fields are writable. In particular, enrollment/advisor/professor records are not.
    const d:Department={...old,semester:incoming.semester,graduationSemester:incoming.graduationSemester,method:incoming.method,stages:structuredClone(incoming.stages)};
    if(d.stages.some(s=>!validFile(s.file)))return reject('서식은 512KB 이하 PDF/DOCX만 가능합니다.');
    if(command.type==='saveProcedure') return finish({procedureDrafts:{...state.procedureDrafts,[d.id]:d},procedureSavedAt:{...state.procedureSavedAt,[d.id]:at}},'절차 임시저장');
    if(d.method==='course')d.stages=d.stages.filter(s=>!['application','approval'].includes(s.kind));
    const error=validateProcedure(d);if(error)return reject(error);
    d.stages=d.stages.map(step=>{const before=old.stages.find(s=>s.id===step.id);return {...step,isPlaceholder:step.dateStatus==='PLACEHOLDER',changedAt:before && (before.dueDate!==step.dueDate || before.startDate!==step.startDate || JSON.stringify(before.conditionalDeadlines)!==JSON.stringify(step.conditionalDeadlines))?at:before?.changedAt};});
    d.publishedAt=at;
    state.students.filter(s=>s.majors.some(m=>m.departmentId===d.id)).forEach(s=>notify(s.id,d.name+' 절차가 변경되었습니다.',studentLink(d.id)));
    return finish({departments:state.departments.map(v=>v.id===d.id?d:v),procedureDrafts:{...state.procedureDrafts,[d.id]:d},procedureSavedAt:{...state.procedureSavedAt,[d.id]:at}},d.name+' 절차 게시');
  }
  if(command.type==='saveNotice' || command.type==='publishNotice') {
    const n=command.notice;
    if(!assistant || assistant.departmentId!==n.departmentId || !validFile(n.file))return reject();
    const d=state.departments.find(d=>d.id===n.departmentId)!;
    if(command.type==='saveNotice')return finish({noticeDrafts:{...state.noticeDrafts,[assistant.id]:{...n,savedAt:at}}},'공지 임시저장');
    if(!n.title.trim() || !n.body.trim() || !n.semester || (n.stageId && !d.stages.some(s=>s.id===n.stageId)) || (n.eventAt && !Number.isFinite(Date.parse(n.eventAt))))return reject('공지 제목·본문·학기와 연결 단계를 확인해 주세요.');
    const published={...n,id:n.id || id,publishedAt:at,savedAt:at};
    state.students.filter(s=>noticeMatches(published,s,d)).forEach(s=>notify(s.id,'새 공지: '+n.title,studentLink(d.id)+'#notices'));
    return finish({notices:[...state.notices.filter(v=>v.id!==published.id),published],noticeDrafts:{...state.noticeDrafts,[assistant.id]:published}},'공지 게시');
  }
  if(command.type==='saveDraft' || command.type==='sendApplication' || command.type==='sendSubmission') {
    const draft=command.draft,d=state.departments.find(d=>d.id===draft.departmentId);
    if(!student || draft.studentId!==student.id || !d || !majorRole(student,d.id) || !validFile(draft.file))return reject('학생·전공 또는 파일 형식을 확인해 주세요.');
    const isApplication=draft.stageId==='application', app=applicationFor(state,student.id,d.id);
    const sub=latestSubmission(state,student.id,d.id,draft.stageId);
    if(isApplication && (d.method!=='application' || app && !['수정 요청','반려'].includes(app.status)))return reject('제출 후에는 읽기 전용입니다. 수정 요청 때 다시 편집할 수 있습니다.');
    if(!isApplication && sub && sub.status!=='수정 요청')return reject('검토 중이거나 승인된 제출물은 편집할 수 없습니다.');
    if(command.type==='saveDraft') {
      const saved={...draft,id:draftKey(student.id,d.id,draft.stageId),savedAt:at};
      return finish({drafts:[...state.drafts.filter(v=>v.id!==saved.id),saved]},'작성 내용 임시저장');
    }
    if(!draft.title.trim() || (!draft.body.trim() && !draft.file))return reject('제목과 본문 또는 PDF/DOCX 파일을 입력해 주세요.');
    const current=progress(state,student,d).current;
    if(command.type==='sendApplication') {
      const p=state.professors.find(p=>p.id===draft.professorId && p.departmentId===d.id);
      if(!isApplication || !p || !canApply(state,p))return reject('모집이 마감되었거나 정원이 가득 찼습니다.');
      if(!draft.summary.trim())return reject('연구 방향 요약을 입력해 주세요.');
      if(!current || !['application','approval'].includes(current.kind))return reject('앞선 절차를 먼저 완료해 주세요.');
      if(app?.status==='수정 요청' && app.professorId!==p.id)return reject('수정 요청은 기존 교수에게 재제출해 주세요.');
      const a:Application={...draft,id:app?.status==='수정 요청'?app.id:id,status:'제출됨',requestedAt:at,feedback:app?.status==='수정 요청'?app.feedback:undefined};
      notify(p.id,student.name+' 지도 신청이 제출되었습니다.','/professor?tab=applications');
      return finish({applications:[...state.applications.filter(v=>v.id!==a.id),a],drafts:state.drafts.filter(v=>v.id!==draftKey(student.id,d.id,'application'))},'지도 신청 제출');
    }
    const advisor=advisorFor(state,student,d);
    if(!current || current.id!==draft.stageId || !['plan','final'].includes(current.kind) || (current.approver!=='NONE' && !advisor))return reject('지도교수 확정 후 현재 단계에서 제출해 주세요.');
    if(current.kind==='final' && !draft.file)return reject('최종논문 PDF/DOCX 파일이 필요합니다.');
    if(current.requiresVideo && !/^https:\/\/[^\s]+$/.test(draft.videoUrl??''))return reject('영상의 HTTPS 링크를 입력해 주세요. 데모는 영상 파일을 업로드하지 않습니다.');
    if(current.kind==='final' && duplicateSubmission(state,draft) && !draft.duplicateAcknowledged)return reject('다른 전공에 동일한 파일을 제출한 기록이 있습니다. 이중 제출 규정을 확인해 주세요.');
    const submission:Submission={id,studentId:student.id,departmentId:d.id,stageId:current.id,professorId:current.approver==='NONE'?'':advisor!.id,kind:current.kind as 'plan'|'final',title:draft.title,body:draft.body,file:draft.file,videoUrl:draft.videoUrl,version:(sub?.version??0)+1,status:current.approver==='NONE'?'접수됨':'제출됨',submittedAt:at};
    if(submission.professorId)notify(submission.professorId,student.name+' '+current.name+' 제출','/professor?tab='+current.kind);
    return finish({submissions:[...state.submissions,submission],drafts:state.drafts.filter(v=>v.id!==draftKey(student.id,d.id,current.id))},current.name+' v'+submission.version+' 제출');
  }
  if(command.type==='decide') {
    const a=state.applications.find(a=>a.id===command.id);
    if(!professor || !a || a.professorId!==professor.id || ['승인','반려'].includes(a.status) || command.status==='제출됨')return reject();
    if(['수정 요청','반려','면담 요청'].includes(command.status) && !command.feedback.trim())return reject('학생에게 전달할 피드백을 입력해 주세요.');
    if(command.status==='승인' && approvedCount(state,professor)>=professor.capacity)return reject('정원 마감: 승인할 수 없습니다.');
    let meetings=state.meetings;
    if(command.status==='면담 요청') {
      const slots=[...new Set(command.slots??[])].sort();
      if(!slots.length || slots.some(t=>!/^\d{4}-\d{2}-\d{2}T\d{2}:(00|30)$/.test(t) || !Number.isFinite(Date.parse(t)) || Date.parse(t)<=Date.parse(at)))return reject('미래의 30분 단위 가능 시간을 하나 이상 선택해 주세요.');
      meetings=[...meetings.filter(m=>m.applicationId!==a.id),{id,applicationId:a.id,studentId:a.studentId,professorId:professor.id,departmentId:a.departmentId,slots,status:'시간 제안됨',location:command.location??''}];
    }
    notify(a.studentId,'지도 신청 '+command.status,studentLink(a.departmentId)+'#advisor');
    return finish({applications:state.applications.map(v=>v.id===a.id?{...v,status:command.status,feedback:command.feedback.trim()?feedback(command.feedback,a.feedback):a.feedback}:v),meetings},'지도 신청 '+command.status);
  }
  if(command.type==='editFeedback') {
    const target=command.target==='application'?state.applications:state.submissions;
    const item=target.find(v=>v.id===command.id);
    if(!professor || !item || item.professorId!==professor.id || !item.feedback || !command.text.trim())return reject('수정할 피드백을 입력해 주세요.');
    notify(item.studentId,'교수 피드백이 수정되었습니다.',studentLink(item.departmentId)+(command.target==='application'?'#advisor':'#documents'));
    const patch=command.target==='application'?{applications:state.applications.map(a=>a.id===item.id?{...a,feedback:feedback(command.text,a.feedback)}:a)}:{submissions:state.submissions.map(s=>s.id===item.id?{...s,feedback:feedback(command.text,s.feedback)}:s)};
    return finish(patch,'피드백 수정 (이전 내용 보관)');
  }
  if(command.type==='recordOutcome' || command.type==='proposeMeeting') {
    const st=state.students.find(v=>v.id===command.studentId),d=state.departments.find(v=>v.id===command.departmentId);
    if(!professor || !st || !d || advisorFor(state,st,d)?.id!==professor.id)return reject();
    const current=progress(state,st,d).current;
    if(command.type==='recordOutcome') {
      const allowed=d.stages.flatMap(v=>v.conditionalDeadlines??[]).map(v=>v.condition);
      if(!current?.collectsReviewOutcome || !allowed.includes(command.condition))return reject('현재 심사 단계와 결과를 확인해 주세요.');
      notify(st.id,'심사 결과: '+command.condition,studentLink(d.id)+'#roadmap');
      return finish({reviewOutcomes:[...state.reviewOutcomes,{studentId:st.id,departmentId:d.id,stageId:current.id,condition:command.condition,at}],completions:[...state.completions,{studentId:st.id,departmentId:d.id,stageId:current.id,at}]},'심사 결과 기록: '+command.condition);
    }
    if(current?.stepType!=='MEETING' || state.meetings.some(m=>m.studentId===st.id&&m.departmentId===d.id&&m.stageId===current.id&&m.status!=='완료'))return reject('현재 면담 단계에만 시간을 제안할 수 있습니다.');
    const slots=[...new Set(command.slots)].sort();
    if(!slots.length || slots.some(t=>!/^\d{4}-\d{2}-\d{2}T\d{2}:(00|30)$/.test(t) || !Number.isFinite(Date.parse(t)) || Date.parse(t)<=Date.parse(at)))return reject('미래의 30분 단위 시간을 선택해 주세요.');
    notify(st.id,'지도 면담 시간이 제안되었습니다.',studentLink(d.id)+'#meetings');
    return finish({meetings:[...state.meetings,{id,applicationId:'',stageId:current.id,studentId:st.id,departmentId:d.id,professorId:professor.id,slots,status:'시간 제안됨',location:command.location}]},'지도 면담 시간 제안');
  }
  if(command.type==='selectSlot' || command.type==='completeMeeting') {
    const m=state.meetings.find(m=>m.id===command.id);if(!m)return reject();
    if(command.type==='selectSlot') {
      if(!student || student.id!==m.studentId || m.status!=='시간 제안됨' || !m.slots.includes(command.slot) || Date.parse(command.slot)<=Date.parse(at))return reject('제안된 미래 시간 중 하나를 선택해 주세요.');
      if(state.meetings.some(v=>v.id!==m.id && v.status==='확정' && v.selected===command.slot && (v.professorId===m.professorId || v.studentId===student.id)))return reject('이미 확정된 면담과 겹칩니다. 다른 시간을 선택해 주세요.');
      notify(m.professorId,student.name+' 면담 시간이 확정되었습니다.','/professor?tab=meetings');
      notify(student.id,'면담 시간이 확정되었습니다.',studentLink(m.departmentId)+'#meetings');
      return finish({meetings:state.meetings.map(v=>v.id===m.id?{...v,selected:command.slot,status:'확정'}:v)},'면담 시간 선택·확정');
    }
    if(!professor || professor.id!==m.professorId || m.status!=='확정')return reject();
    notify(m.studentId,'면담 완료가 기록되었습니다.',studentLink(m.departmentId)+'#meetings');
    return finish({meetings:state.meetings.map(v=>v.id===m.id?{...v,status:'완료'}:v)},'면담 완료');
  }
  if(command.type==='review') {
    const sub=state.submissions.find(s=>s.id===command.id);
    if(!professor || !sub || sub.professorId!==professor.id || sub.status!=='제출됨')return reject();
    if(command.status==='수정 요청' && !command.feedback.trim())return reject('수정 요청 피드백을 입력해 주세요.');
    notify(sub.studentId,(sub.kind==='final'?'최종논문':'연구계획서')+' '+command.status,studentLink(sub.departmentId)+'#documents');
    return finish({submissions:state.submissions.map(s=>s.id===sub.id?{...s,status:command.status,feedback:command.feedback.trim()?feedback(command.feedback):undefined}:s)},'제출물 '+command.status);
  }
  if(command.type==='completeStep') {
    const d=state.departments.find(d=>d.id===command.departmentId);
    if(!student || !d)return reject();
    const current=progress(state,student,d).current;
    if(current?.id!==command.stageId || current.kind!=='task' || current.approver==='ADVISOR' || current.stepType==='MEETING')return reject('교수 확인이 필요한 단계는 학생이 완료할 수 없습니다.');
    return finish({completions:[...state.completions,{studentId:student.id,departmentId:d.id,stageId:current.id,at}]},current.name+' 완료 기록');
  }
  if(command.type==='enroll') {
    const section=state.sections.find(c=>c.id===command.sectionId),d=state.departments.find(d=>d.id===section?.departmentId);
    if(!student || !section || !d || d.method!=='course' || d.stages.some(s=>s.stepType==='COURSE_ENROLLMENT'))return reject('수강 분반은 외부 수강 데이터로 확인합니다. 서비스에서 배정하지 않습니다.');
    const current=progress(state,student,d).current;
    if(!majorRole(student,d.id) || current?.kind!=='course' || current.courseId!==section.courseId || student.enrollmentIds.includes(section.id))return reject();
    return finish({students:state.students.map(s=>s.id===student.id?{...s,enrollmentIds:[...s.enrollmentIds,section.id]}:s)},'학생 수강 분반 선택');
  }
  return reject();
}
