import type { BoardState, Professor, Student } from '@/lib/types';
import { departments } from './departments';
export const seedStudents: Student[] = [
  {id:'student-1', name:'김서연', studentNo:'2023-10001', graduationSemester:'2027년 2월', registeredSemesters:8, majors:[{departmentId:'psychology',role:'primary'},{departmentId:'chinese',role:'secondary'}], enrollmentIds:[]},
  {id:'student-2', name:'박도윤', studentNo:'2023-10002', graduationSemester:'2027년 8월', registeredSemesters:8, majors:[{departmentId:'mechanical',role:'primary'}], enrollmentIds:['section-mech-1','section-mech-2']},
  {id:'student-3', name:'이준호', studentNo:'2021-10003', graduationSemester:'2027년 8월', registeredSemesters:10, majors:[{departmentId:'psychology',role:'primary'}], enrollmentIds:[]},
  {id:'student-4',name:'최민재',studentNo:'2023-10004',graduationSemester:'2027년 2월',registeredSemesters:8,majors:[{departmentId:'industrial',role:'primary'}],enrollmentIds:[]},
];
export const seedProfessors: Professor[] = [
  {id:'prof-psych',name:'서진우',departmentId:'psychology',field:'인지심리',keywords:['학습','기억'],topics:'학습과 기억 형성',labLink:'예시 링크(가상)',contact:'psych@example.invalid',year:2026,capacity:5,baselineAssigned:2,available:true},
  {id:'prof-full',name:'문예린',departmentId:'psychology',field:'사회심리',keywords:['관계','집단'],topics:'청년의 관계',labLink:'예시 링크(가상)',contact:'social@example.invalid',year:2026,capacity:2,baselineAssigned:2,available:true},
  {id:'prof-chinese',name:'차현우',departmentId:'chinese',field:'중국문학',keywords:['고전','문학'],topics:'고전 서사',labLink:'예시 링크(가상)',contact:'literature@example.invalid',year:2026,capacity:4,baselineAssigned:1,available:true},
  {id:'prof-mech',name:'신도현',departmentId:'mechanical',field:'기계설계',keywords:['설계','제조'],topics:'기계시스템 설계',labLink:'예시 링크(가상)',contact:'design@example.invalid',year:2026,capacity:8,baselineAssigned:0,available:true},
  {id:'prof-industrial',name:'한지안',departmentId:'industrial',field:'시스템 최적화',keywords:['최적화','분석'],topics:'시스템 분석',labLink:'예시 링크(가상)',contact:'industrial@example.invalid',year:2026,capacity:5,baselineAssigned:0,available:true},
];
export const createSeed = (): BoardState => ({
  departments:structuredClone(departments), students:structuredClone(seedStudents), professors:structuredClone(seedProfessors),
  assistants:[{id:'assistant-psych',name:'정유진 조교',departmentId:'psychology'},...['chinese','mechanical','industrial'].map((departmentId,i)=>({id:'assistant-'+departmentId,name:['가람 조교','나래 조교','다온 조교'][i],departmentId}))],
  sections:[{id:'section-mech-1',departmentId:'mechanical',courseId:'design1',name:'기계시스템설계1 · 01분반',professorId:'prof-mech'},{id:'section-mech-2',departmentId:'mechanical',courseId:'design2',name:'기계시스템설계2 · 01분반',professorId:'prof-mech'}],
  reviewOutcomes:[],procedureDrafts:{},procedureSavedAt:{},drafts:[],applications:[],submissions:[],meetings:[],notices:[],noticeDrafts:{},notifications:[],completions:[],
  histories:[{id:'seed',actor:'시스템',at:'2026-09-22T00:00:00Z',detail:'사용자 제공 학과 절차와 가정값이 혼재된 데모 시드를 준비했습니다.'}],
});
