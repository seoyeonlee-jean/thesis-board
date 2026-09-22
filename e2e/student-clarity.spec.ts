import {test,expect} from '@playwright/test';
import {noOverflow,studentTab} from './helpers';
for(const width of [1440,375])test('샤논 학생 화면 선택 축소·접힘·진행률·첫 화면 '+width,async({page},info)=>{
 await page.clock.setFixedTime(new Date('2026-09-22T09:00:00+09:00'));await page.setViewportSize({width,height:900});await page.goto('/student');
 await expect(page.getByRole('banner').getByRole('link',{name:'샤논',exact:true})).toBeVisible();await expect(page).toHaveTitle(/샤논/);
 await expect(page.getByRole('navigation',{name:'데모 역할 전환'})).toBeVisible();
 await expect(page.getByRole('tablist',{name:'전공 선택'})).toHaveCount(0);
 const majors=page.getByLabel('내 전공 요약');await expect(majors.getByRole('button')).toHaveCount(2);await expect(majors).toContainText('진행률 0% · 5단계 중 0단계 완료');await expect(majors).toContainText('마감까지 22일');
 await expect(page.getByLabel('전공 로드맵').locator('details[open]')).toHaveCount(0);
 await expect(page.getByTestId('major-progress-track').first()).toHaveCSS('background-color','rgb(226, 232, 240)');
 await expect(page.getByRole('button',{name:'심리학과 전공 선택'})).toHaveAccessibleDescription('진행률 0% · 5단계 중 0단계 완료');
 await expect(page.getByRole('tablist',{name:'학생 업무'}).getByRole('tab')).toHaveText(['로드맵','지도교수','연구계획서·논문','면담 일정','캘린더','공지']);
 await expect(page.getByLabel('다음 할 일').getByRole('button')).toHaveText('지도교수 찾아 신청하기');
 await expect(page.getByRole('main')).not.toContainText('예시 데이터');await expect(page.getByRole('main')).not.toContainText('예시 링크(가상)');
 const next=await page.getByLabel('다음 할 일').boundingBox(),roadmap=await page.locator('#roadmap').boundingBox();expect(next!.height).toBeLessThan(200);expect(roadmap!.y).toBeLessThan(780);
 await page.getByRole('button',{name:'중어중문학과 전공 선택'}).click();await expect(page.getByRole('button',{name:'중어중문학과 전공 선택'})).toHaveAttribute('aria-pressed','true');await expect(page.getByLabel('다음 할 일')).toContainText('논문제출신청·개요 제출');await expect(page.getByLabel('전공 로드맵').locator('details[open]')).toHaveCount(0);
 await page.getByRole('button',{name:'심리학과 전공 선택'}).click();await noOverflow(page);await page.screenshot({path:info.outputPath('shannon-student.png'),fullPage:true});
 await studentTab(page,'지도교수');await expect(page.getByRole('main')).not.toContainText('예시 링크(가상)');
 await page.goto('/student#roadmap');await expect(page.getByLabel('전공 로드맵').locator('details[open]')).toHaveCount(0);
});
test('조교 요약에 파란 진행 방식 반복을 표시하지 않음',async({page})=>{
 await page.goto('/admin');const first=page.getByLabel('절차 단계 편집').locator(':scope > li').first();
 await expect(first.getByRole('heading',{name:'1. 지도교수 신청·승인',exact:true})).toBeVisible();await expect(first.locator('p.text-snu')).toHaveCount(0);
 await expect(first.locator('details[open]')).toHaveCount(0);await expect(first.getByRole('button',{name:'지도교수 신청·승인 삭제'})).toBeVisible();
});
