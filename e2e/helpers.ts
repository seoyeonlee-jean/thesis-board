import {expect,type Page} from '@playwright/test';
export const pdfFile={name:'research.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF')};
export async function studentApplication(page:Page){
 await page.goto('/student');await page.getByRole('button',{name:'서진우 교수 선택'}).click();
 await page.getByLabel('연구 제목',{exact:true}).fill('기억과 학습');
 await page.getByLabel('연구 방향 요약').fill('기억 형성에 관한 연구');
 await page.getByLabel('연구계획 본문').fill('학습의 효과를 조사합니다.');
}
export async function sendApplication(page:Page){await studentApplication(page);await page.getByRole('button',{name:'지도 신청 제출'}).click();await expect(page.getByText('제출됨',{exact:true})).toBeVisible();}
export async function noOverflow(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
