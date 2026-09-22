/** Presentation only: edit values remain ISO datetime-local strings. */
export function deadlineLabel(value:string) {
  if(!value)return '정보 확인 필요';
  const date=new Date(value);
  if(!Number.isFinite(date.getTime()))return '정보 확인 필요';
  return `${date.getMonth()+1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}까지`;
}
export function editorDateLabel(value:string) {
  if(!value)return '미정';
  const date=new Date(value);
  if(!Number.isFinite(date.getTime()))return '정보 확인 필요';
  return `${date.getFullYear()}. ${String(date.getMonth()+1).padStart(2,'0')}. ${String(date.getDate()).padStart(2,'0')}. ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}
