import {test,expect} from '@playwright/test';
import {sendApplication,noOverflow} from './helpers';
test('역할 배지·정리된 상단·진행 단계 강조 이동과 완료일',async({page},info)=>{
 await page.goto('/student');const nav=page.getByRole('navigation',{name:'데모 역할 전환'});
 await expect(nav.getByRole('link',{name:'학생',exact:true})).toHaveCSS('background-color','rgb(15, 15, 112)');
 await expect(nav.getByRole('link',{name:'학생',exact:true})).toHaveCSS('border-radius','9999px');
 await expect(page.getByRole('button',{name:'데모 초기화'})).toHaveCount(0);await expect(page.getByText('데모 안내 · 일부 일정 가정',{exact:true})).toHaveCount(0);
 await expect(page.getByText('신청·승인형',{exact:true})).toHaveCount(0);await expect(page.locator('main :text-is("링크 정보 확인 필요"):visible')).toHaveCount(0);await expect(page.getByRole('link',{name:'공식 안내 ↗'})).toHaveCount(0);
 const current=page.locator('#step-apply');await expect(current.locator('details')).toHaveAttribute('open','');await expect(current.locator('details')).toHaveCSS('border-width','2px');await expect(current.locator('details')).toHaveCSS('border-color','rgb(15, 15, 112)');await expect(current.getByText('진행 중',{exact:true})).toBeVisible();await expect(current.getByRole('button',{name:'지도교수 찾아 신청하기'})).toBeVisible();
 await sendApplication(page);await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('tab',{name:'지도 신청',exact:true}).click();await page.getByRole('button',{name:'신청 승인'}).click();await page.getByRole('link',{name:'학생',exact:true}).click();
 await expect(current).toHaveCSS('opacity','0.6');await expect(current.locator('details')).not.toHaveAttribute('open','');await expect(current.locator('summary b')).toContainText('✓');await expect(current.getByText('완료',{exact:true})).toBeVisible();await expect(current.getByText('완료일 ·',{exact:false})).toBeVisible();
 const next=page.locator('#step-plan');await expect(next.locator('details')).toHaveAttribute('open','');await expect(next).toHaveCSS('opacity','1');await expect(next.locator('details')).toHaveCSS('border-width','2px');await expect(next.getByText('진행 중',{exact:true})).toBeVisible();
 await expect(page.locator('#step-writing').getByText('예정',{exact:true})).toBeVisible();await expect(page.getByLabel('전공 로드맵').locator('details[open]')).toHaveCount(1);
 await page.reload();await expect(current.getByText('완료일 ·',{exact:false})).toBeVisible();await page.setViewportSize({width:375,height:900});await noOverflow(page);await page.screenshot({path:info.outputPath('roadmap-status.png'),fullPage:true});
});
