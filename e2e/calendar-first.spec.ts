import {test,expect} from '@playwright/test';
import {studentTab,noOverflow} from './helpers';

for(const width of [1440,375])test('캘린더 첫 진입·탭별 카드 분리·신청 마감 강조 '+width,async({page},info)=>{
 await page.setViewportSize({width,height:900});await page.goto('/student');
 const tabs=page.getByRole('tablist',{name:'학생 업무'});
 await expect(tabs.getByRole('tab')).toHaveText(['캘린더','로드맵','지도교수','면담 일정','연구계획서·논문','공지']);
 await expect(tabs.getByRole('tab',{name:'캘린더',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(page.getByLabel('현재 단계')).toContainText('지도교수 신청·승인');
 await expect(page.getByLabel('다음 할 일')).toHaveCount(0);
 await expect(page.getByLabel('지도교수 신청 안내')).not.toBeVisible();
 await expect(page.getByLabel('캘린더 월')).toHaveValue('2026-10');
 const event=page.getByLabel('월간 일정').getByRole('button',{name:'지도교수 신청·승인',exact:true});
 await expect(event).toHaveAttribute('data-highlighted','true');await expect(event).toHaveCSS('font-weight','700');
 const calendar=await page.getByLabel('통합 캘린더').boundingBox(),tabBox=await tabs.boundingBox();expect(calendar!.y-(tabBox!.y+tabBox!.height)).toBeLessThan(30);
 await noOverflow(page);await page.screenshot({path:info.outputPath('calendar-first.png'),fullPage:true});
 await page.getByRole('button',{name:'타임라인 보기'}).click();await expect(page.getByLabel('간트 일정').getByRole('button',{name:'지도교수 신청·승인',exact:true})).toHaveAttribute('data-highlighted','true');
 for(const tab of ['로드맵','면담 일정','연구계획서·논문','공지']){await studentTab(page,tab);await expect(page.getByLabel('지도교수 신청 안내')).not.toBeVisible();await expect(page.getByLabel('현재 단계')).toBeVisible();}
 await studentTab(page,'지도교수');await expect(page.getByLabel('지도교수 신청 안내')).toBeVisible();await page.getByLabel('지도교수 신청 안내').getByRole('button',{name:'지도교수 찾아 신청하기'}).click();await expect(page.locator('#advisor-application')).toBeFocused();
 await page.getByLabel('데모 사용자').selectOption('student-2');await expect(tabs.getByRole('tab',{name:'캘린더',exact:true})).toHaveAttribute('aria-selected','true');
});
