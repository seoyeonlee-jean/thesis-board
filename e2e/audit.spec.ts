import { test, expect } from '@playwright/test';
for (const width of [1440, 390]) {
  test(`감사: ${width}px 대표 흐름 레이아웃과 빈 피드백`, async ({ page }, info) => {
    await page.setViewportSize({width, height: 900});
    const check = async (name: string) => {
      await page.screenshot({path: info.outputPath(`${name}.png`), fullPage: true});
      expect.soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} 가로 넘침`).toBe(true);
    };
    await page.goto('/student'); await page.getByRole('button', {name:'데모 초기화'}).click();
    await page.goto('/'); await page.getByRole('link', {name:'학생 화면 시작'}).click();
    await page.getByLabel('주전공').selectOption('psychology');
    await page.getByLabel('복수전공').selectOption('mechanical');
    await page.getByRole('button', {name:'전공별 로드맵 생성'}).click();
    await expect(page.getByText('예시 데이터', {exact:true})).toHaveCount(2);
    await check('student');
    await page.getByRole('button', {name:'승인 요청'}).click();
    await page.getByRole('link', {name:'교수',exact:true}).click();
    const messages: string[] = [];
    page.on('dialog', async dialog => { messages.push(dialog.message()); await dialog.accept(); });
    for (const name of ['수정 요청','면담 요청','반려']) {
      await page.getByRole('button',{name,exact:true}).click();
      await expect.poll(() => messages.length).toBe(['수정 요청','면담 요청','반려'].indexOf(name)+1);
    }
    await check('professor');
    await page.getByRole('button',{name:'승인',exact:true}).click();
    await page.getByRole('link',{name:'학생',exact:true}).click();
    const psych = page.locator('article').filter({has:page.getByRole('heading',{name:'심리학과',exact:true})});
    const mech = page.locator('article').filter({has:page.getByRole('heading',{name:'기계공학과',exact:true})});
    await expect(mech.getByText('졸업논문 수업 수강진행 필요')).toBeVisible();
    await expect(psych.getByText('신청 상태: 승인')).toBeVisible();
    await expect(psych.getByText('행정실 확정 검토 중', {exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'행정실 확정 검토 중',exact:true})).toBeVisible();
    await expect(psych.getByText('지도교수 확정진행 필요')).toBeVisible();
    await expect(psych.getByText('논문 작성예정')).toBeVisible();
    await check('approved');
    await page.getByRole('link',{name:'행정실',exact:true}).click();
    await page.getByRole('button',{name:'보완 요청',exact:true}).click();
    await expect.poll(() => messages.length).toBe(4);
    await check('admin');
    await page.getByRole('button',{name:'검토 완료',exact:true}).click();
    await page.getByRole('link',{name:'학생',exact:true}).click();
    await expect(page.getByText('행정실 검토: 검토 완료')).toBeVisible();
    await expect(psych.getByText('논문 작성진행 필요')).toBeVisible();
    await expect(psych.getByText('지도교수 확정완료')).toBeVisible();
    await expect(psych.getByText('행정실 확정 검토 중',{exact:true})).toHaveCount(0);
    await expect(mech.getByText('졸업논문 수업 수강진행 필요')).toBeVisible();
    await check('confirmed');
  });
}
