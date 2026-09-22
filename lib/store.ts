"use client";
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createSeed} from '@/data/seed';
import {transition, type Command} from './rules';
import type {Actor, BoardState} from './types';
type Store = BoardState & {
  studentId:string; professorId:string; assistantId:string; error:string;
  choose:(role:Actor['role'],id:string)=>void;
  act:(actor:Actor,command:Command)=>boolean;
  clearError:()=>void; reset:()=>void;
};
const selection={studentId:'student-1',professorId:'prof-psych',assistantId:'assistant-psych'};
export const useBoardStore=create<Store>()(persist((set,get)=>({
  ...createSeed(),...selection,error:'',
  choose:(role,id)=>set(role==='student'?{studentId:id}:role==='professor'?{professorId:id}:{assistantId:id}),
  clearError:()=>set({error:''}),
  act:(actor,command)=>{
    const result=transition(get(),actor,command,new Date().toISOString(),crypto.randomUUID());
    if(result.error){set({error:result.error});return false;}
    const serialized=JSON.stringify({state:{...result.state,error:''},version:2});
    if(serialized.length>3_000_000){set({error:'브라우저 데모 저장 한도를 초과했습니다. 첨부 크기를 줄여 주세요.'});return false;}
    try {
      if(typeof window!=='undefined')window.localStorage.setItem('thesis-board-v2',serialized);
      set({...result.state,error:''});return true;
    } catch {set({error:'브라우저 저장 공간이 부족하거나 저장이 차단되었습니다. 파일을 줄이거나 저장 설정을 확인해 주세요.'});return false;}
  },
  reset:()=>{
    if(typeof window!=='undefined')Object.keys(localStorage).filter(key=>key.startsWith('thesis-form-')).forEach(key=>localStorage.removeItem(key));
    set({...createSeed(),...selection,error:''});
  },
}),{name:'thesis-board-v2',version:2,partialize:({error:_,...state})=>state}));
