"use client";
import {useState} from 'react';
import type {Attachment, Department, Feedback} from '@/lib/types';
import {FILE_LIMIT} from '@/lib/rules';
export const colors:Record<string,string>={violet:'bg-violet-100 text-violet-900 border-violet-300',amber:'bg-amber-100 text-amber-900 border-amber-300',sky:'bg-sky-100 text-sky-900 border-sky-300'};
export const colorFor=(d:Department)=>colors[d.color]??'bg-slate-100 text-slate-900 border-slate-300';
export const dateLabel=(value:string)=>value?new Date(value).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'정보 확인 필요';
export function Badge({children,className=''}:{children:React.ReactNode;className?:string}){return <span className={'badge border '+className}>{children}</span>;}
export function Avatar({name}:{name:string}){return <span aria-label={name+' 아바타'} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{name.slice(0,1)}</span>;}
export function FeedbackView({value}:{value?:Feedback}){return value?<div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm"><b>교수 피드백</b>{value.editedAt&&<Badge className="ml-2">수정됨 · {dateLabel(value.editedAt)}</Badge>}<p className="mt-2 whitespace-pre-wrap">{value.text}</p></div>:null;}
export function FileInput({value,onChange,label='파일 첨부',disabled=false}:{value?:Attachment;onChange:(f?:Attachment)=>void;label?:string;disabled?:boolean}){
 const [error,setError]=useState('');
 return <div><label className="field-label">{label}<input type="file" accept=".pdf,.docx" disabled={disabled} className="mt-1 block w-full text-sm" onChange={async e=>{
  const f=e.target.files?.[0];if(!f)return;
  if(!/\.(pdf|docx)$/i.test(f.name)||f.size>FILE_LIMIT||!f.size){setError('512KB 이하의 PDF 또는 DOCX 파일을 선택해 주세요.');e.target.value='';return;}
  const data=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(f);}).catch(()=>null);
  if(!data){setError('파일을 읽을 수 없습니다.');return;}
  const type=f.name.toLowerCase().endsWith('.pdf')?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  setError('');onChange({name:f.name,size:f.size,type,data:'data:'+type+';base64,'+data.split(',')[1]});
 }}/></label><p className="mt-1 text-xs text-slate-500">PDF / DOCX · 파일당 512KB · 이 브라우저에만 저장</p>{value&&<div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-sm">{value.name}</span><button type="button" className="btn-alt" disabled={disabled} onClick={()=>onChange(undefined)}>첨부 제거</button></div>}{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}</div>;
}
export function FileView({file}:{file?:Attachment}){
 const [open,setOpen]=useState(false);
 if(!file)return null;
 return <div className="my-2"><div className="flex flex-wrap gap-2"><button type="button" className="btn-alt" onClick={()=>setOpen(!open)}>{file.name} 열기</button><a className="btn-alt" href={file.data} download={file.name}>다운로드</a></div>{open&&<div className="mt-2 rounded-xl border p-3">{file.type==='application/pdf'?<iframe title={file.name+' 미리보기'} src={file.data} className="h-72 w-full"/>:<p className="text-sm">DOCX는 다운로드 후 문서 편집기에서 열 수 있습니다.</p>}</div>}</div>;
}
export function OfficialLink({value}:{value:string}){return /^https?:\/\//.test(value)?<a className="text-sm underline" href={value} target="_blank" rel="noreferrer">공식 안내 ↗</a>:<span className="text-xs text-slate-500">{value||'정보 확인 필요'}</span>;}
