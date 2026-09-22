import {test,expect} from '@playwright/test';
test('교수 기본 탭은 내 지도 학생이며 명시적 알림 탭은 유지',async({page})=>{
 await page.goto('/professor');const tabs=page.getByRole('tablist',{name:'교수 업무'});
 await expect(tabs.getByRole('tab').first()).toHaveText('내 지도 학생');await expect(tabs.getByRole('tab',{name:'내 지도 학생'})).toHaveAttribute('aria-selected','true');
 await expect(page.getByText('현재 지도 중인 학생이 없습니다.',{exact:false})).toBeVisible();
 await page.getByLabel('데모 사용자').selectOption('prof-mech');await expect(page.getByText('박도윤',{exact:true})).toBeVisible();
 await page.goto('/professor?tab=applications');await expect(tabs.getByRole('tab',{name:'지도 신청',exact:true})).toHaveAttribute('aria-selected','true');
 await page.goto('/professor?tab=invalid');await expect(tabs.getByRole('tab',{name:'내 지도 학생'})).toHaveAttribute('aria-selected','true');
});
