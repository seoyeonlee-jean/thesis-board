import {test,expect} from '@playwright/test';
import {studentTab} from './helpers';

test('브랜드 심볼·파비콘과 로드맵 기본 접힘',async({page,request})=>{
 await page.goto('/');await expect(page.getByTestId('brand-symbol')).toBeVisible();
 const icon=page.locator('link[rel="icon"]').first();await expect(icon).toHaveAttribute('href',/icon\.png/);
 const response=await request.get((await icon.getAttribute('href'))!);expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('image/png');
 await page.goto('/student');const brand=page.getByRole('banner').getByRole('link',{name:'샤논',exact:true});await expect(brand.getByTestId('brand-symbol')).toBeVisible();
 expect(await brand.getByTestId('brand-symbol').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 await studentTab(page,'로드맵');const roadmap=page.getByLabel('전공 로드맵');await expect(roadmap.locator('details[open]')).toHaveCount(0);
 await roadmap.locator('summary').first().click();await expect(roadmap.locator('details[open]')).toHaveCount(1);
 await page.reload();await expect(roadmap.locator('details[open]')).toHaveCount(0);
 await studentTab(page,'캘린더');await studentTab(page,'로드맵');await expect(roadmap.locator('details[open]')).toHaveCount(0);
});
