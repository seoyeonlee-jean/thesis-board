"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSeed, demoStudentId } from "@/data/seed";
import { departments } from "@/data/departments";
import { canSetCapacity, transition, type BoardCommand } from "./rules";
import type { ApplicationStatus, BoardState, ReviewStatus, Role } from "./types";

type Store = BoardState & {
  activeStudentId: string;
  chooseStudent: (id:string) => void;
  selectMajors: (majors: { departmentId: string; role: Role }[]) => void;
  recordContact: (departmentId:string,professorId:string) => boolean;
  requestApproval: (departmentId:string,professorId:string,topic?:string,plan?:string) => boolean;
  decideApplication: (id:string,status:ApplicationStatus,feedback?:string) => boolean;
  reviewApplication: (id:string,status:ReviewStatus,feedback?:string) => boolean;
  assignCourseAdvisor: (studentId:string,departmentId:string,professorId:string) => boolean;
  submitStage: (departmentId:string,stageId:string) => boolean;
  setCapacity: (professorId:string,capacity:number) => boolean;
  reset: () => void;
};
const history = (actor:string,detail:string) => ({id:crypto.randomUUID(),actor,detail,at:new Date().toISOString()});
export const useBoardStore = create<Store>()(persist((set,get) => {
  const dispatch = (command:BoardCommand) => {
    const before=get(), after=transition(before,departments,command,new Date().toISOString(),crypto.randomUUID());
    if(after===before)return false; set(after); return true;
  };
  return {...createSeed(),activeStudentId:demoStudentId,
    chooseStudent: id => {if(get().students.some(s=>s.id===id))set({activeStudentId:id});},
    selectMajors: majors => {
      if(majors.filter(m=>m.role==='primary').length!==1 || new Set(majors.map(m=>m.departmentId)).size!==majors.length || majors.some(m=>!departments.some(d=>d.id===m.departmentId)))return;
      set(state=>({students:state.students.map(s=>s.id===state.activeStudentId?{...s,majors,selectedMajors:majors}:s),histories:[...state.histories,history(state.students.find(s=>s.id===state.activeStudentId)!.name,'전공별 로드맵 생성')]}));
    },
    recordContact:(departmentId,professorId)=>dispatch({type:'contact',studentId:get().activeStudentId,departmentId,professorId}),
    requestApproval:(departmentId,professorId,topic='학습 과정에서의 기억 형성',plan='가상 연구계획 요약입니다.')=>dispatch({type:'request',studentId:get().activeStudentId,departmentId,professorId,topic,plan}),
    decideApplication:(id,status,feedback)=>dispatch({type:'decide',id,status,feedback}),
    reviewApplication:(id,status,feedback)=>dispatch({type:'review',id,status,feedback}),
    assignCourseAdvisor:(studentId,departmentId,professorId)=>dispatch({type:'assign',studentId,departmentId,professorId}),
    submitStage:(departmentId,stageId)=>dispatch({type:'submit',studentId:get().activeStudentId,departmentId,stageId}),
    setCapacity:(professorId,capacity)=>{
      const p=get().professors.find(p=>p.id===professorId);
      if(!p || !departments.find(d=>d.id===p.departmentId)?.usesCapacity || !canSetCapacity(p,capacity) || p.capacity===capacity)return false;
      set(s=>({professors:s.professors.map(p=>p.id===professorId?{...p,capacity}:p),histories:[...s.histories,history(p.name,'지도 정원 '+capacity+'명으로 변경')]})); return true;
    },
    reset:()=>set({...createSeed(),activeStudentId:demoStudentId})
  };
}, {name:'graduation-thesis-board'}));
