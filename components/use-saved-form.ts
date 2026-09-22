"use client";
import {useState} from 'react';
// Local UI drafts are separate from submitted domain records.
export function useSavedForm<T>(key:string,initial:T){
 const storageKey='thesis-form-'+key;
 const [value,setValue]=useState<T>(()=>{try{return JSON.parse(localStorage.getItem(storageKey)??'null')??initial;}catch{return initial;}});
 const [savedAt,setSavedAt]=useState('');
 const save=(next:T)=>{setValue(next);try{localStorage.setItem(storageKey,JSON.stringify(next));setSavedAt(new Date().toISOString());}catch{setSavedAt('저장 실패');}};
 return {value,save,savedAt};
}
