import {test,expect} from '@playwright/test';
test('단일 전공 생성과 컨택 기록·새로고침 유지',async({page})=>{
 await page.goto('/student');await page.getByLabel('주전공',{exact:true}).selectOption('psychology');
 await page.getByRole('button',{name:'전공별 로드맵 생성'}).click();
 await expect(page.locator('article')).toHaveCount(1);
 await expect(page.getByRole('button',{name:'승인 요청',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'교수 컨택 완료',exact:true}).click();await page.reload();
 await expect(page.getByRole('button',{name:'컨택 완료 기록됨'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'승인 요청',exact:true})).toBeEnabled();
});
test('면제 전공 표시와 로드맵 미생성',async({page})=>{
 await page.goto('/student');await page.getByLabel('주전공',{exact:true}).selectOption('psychology');await page.getByLabel('복수전공',{exact:true}).selectOption('sociology');
 await page.getByRole('button',{name:'전공별 로드맵 생성'}).click();
 await expect(page.getByText('사회학과 · 복수전공 논문 면제')).toBeVisible();
 await expect(page.locator('article')).toHaveCount(1);
});
test('전공별 탭·캘린더 색·문의처',async({page})=>{
 await page.goto('/student');await page.getByLabel('주전공',{exact:true}).selectOption('psychology');await page.getByLabel('복수전공',{exact:true}).selectOption('mechanical');await page.getByRole('button',{name:'전공별 로드맵 생성'}).click();
 const a=await page.locator('[data-department="psychology"]').first().evaluate(e=>getComputedStyle(e).backgroundColor);
 const b=await page.locator('[data-department="mechanical"]').first().evaluate(e=>getComputedStyle(e).backgroundColor);expect(a).not.toBe(b);
 await page.getByRole('tab',{name:'기계공학과',exact:true}).click();
 await expect(page.locator('article')).toHaveCount(1);await expect(page.locator('article').getByRole('heading',{name:'기계공학과'})).toBeVisible();
 await page.locator('summary').first().click();await expect(page.locator('details[open]').getByText('문의처: 기계공학과 행정실 (가상)')).toBeVisible();
});
test('행정실 필터·미신청자·수업 배정과 학생 결과',async({page})=>{
 await page.goto('/admin');await expect(page.getByTestId('metric-대상 학생')).toContainText('8');
 await page.getByLabel('학과 필터').selectOption('sociology');await expect(page.getByTestId('metric-대상 학생')).toContainText('3');
 await expect(page.getByRole('heading',{name:'미신청 (2)'})).toBeVisible();
 await page.getByLabel('학과 필터').selectOption('mechanical');await page.getByRole('button',{name:'지도교수 배정'}).first().click();
 await expect(page.getByTestId('metric-미확정 전공')).toContainText('2');
 await expect(page.locator('time').first()).toHaveAttribute('datetime',/T/);
 await page.getByRole('link',{name:'학생',exact:true}).click();
 await page.getByLabel('주전공',{exact:true}).selectOption('psychology');await page.getByLabel('복수전공',{exact:true}).selectOption('mechanical');await page.getByRole('button',{name:'전공별 로드맵 생성'}).click();
 await expect(page.getByText('배정 완료 · 신도현 교수')).toBeVisible();await expect(page.getByText('중간발표진행 필요')).toBeVisible();
});
test('제출 상태 변경이 학생·행정실 및 새로고침에 반영',async({page})=>{
 await page.goto('/student');await page.getByLabel('주전공',{exact:true}).selectOption('psychology');await page.getByRole('button',{name:'전공별 로드맵 생성'}).click();
 await page.getByRole('button',{name:'교수 컨택 완료',exact:true}).click();await page.getByRole('button',{name:'승인 요청'}).click();
 await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('button',{name:'승인',exact:true}).click();
 await page.getByRole('link',{name:'행정실',exact:true}).click();await page.getByRole('button',{name:'검토 완료',exact:true}).click();
 await page.getByRole('link',{name:'학생',exact:true}).click();await page.locator('summary').filter({hasText:'논문 작성'}).click();
 await page.getByRole('button',{name:'제출 완료 기록',exact:true}).filter({visible:true}).click();
 await page.reload();await expect(page.locator('summary').filter({hasText:'논문 작성 · 제출 완료'})).toBeVisible();
 await page.getByRole('link',{name:'행정실',exact:true}).click();await expect(page.getByText('현재 단계: 심사 제출')).toBeVisible();await expect(page.getByText(/논문 작성 제출 완료 ·/)).toBeVisible();
});
