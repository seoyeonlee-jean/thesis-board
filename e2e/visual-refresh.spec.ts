import {test,expect} from '@playwright/test';
import {noOverflow} from './helpers';
for(const width of [1440,375])test('디자인 개편: 기존 역할·탭 유지와 반응형 '+width,async({page},info)=>{
 await page.setViewportSize({width,height:900});await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('전공마다 다른 논문 절차');
 await expect(page.locator('.landing-roles a')).toHaveCount(3);
 await expect(page.getByTestId('brand-symbol')).toHaveCSS('mix-blend-mode','multiply');
 for(const [name,url] of [['학생','/student'],['교수','/professor'],['학과 조교','/admin']])await expect(page.locator('.landing-roles').getByRole('link',{name:new RegExp(name+' 화면 시작')})).toHaveAttribute('href',url);
 await noOverflow(page);await page.screenshot({path:info.outputPath('home.png'),fullPage:true});
 for(const url of ['/student','/professor','/admin']){
  await page.goto(url);await expect(page.getByRole('navigation',{name:'데모 역할 전환'})).toBeVisible();await expect(page.getByTestId('brand-symbol')).toHaveCSS('mix-blend-mode','multiply');
  if(url==='/student')await expect(page.getByRole('tab',{name:'캘린더',exact:true})).toHaveAttribute('aria-selected','true');
  await noOverflow(page);await page.screenshot({path:info.outputPath(url.slice(1)+'.png'),fullPage:true});
 }
});
