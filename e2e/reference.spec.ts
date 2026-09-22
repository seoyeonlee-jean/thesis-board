import {test,expect} from '@playwright/test';
import {studentTab,pdfFile,noOverflow} from './helpers';

test('네 학과 자료·필참·출처와 외부 분반 표시',async({page},info)=>{
 await page.goto('/student');await studentTab(page,'로드맵');await expect(page.getByText('데모 안내 · 일부 일정 가정',{exact:true})).toHaveCount(0);
 await expect(page.getByLabel('전공 로드맵').locator(':scope > li')).toHaveCount(5);
 await expect(page.getByText('예정값',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'중어중문학과 전공 선택',exact:true}).click();
 await expect(page.getByLabel('전공 로드맵').locator(':scope > li')).toHaveCount(6);
 const presentation=page.locator('#step-presentation');await expect(presentation.getByText('필참',{exact:true})).toBeVisible();await expect(presentation).toContainText('불참 시 졸업할 수 없습니다');
 await page.getByLabel('데모 사용자').selectOption('student-2');await studentTab(page,'로드맵');await expect(page.getByText('2027년 8월 졸업예정',{exact:true})).toBeVisible();
 await expect(page.locator('#step-poster').getByText('필참',{exact:true})).toBeVisible();await expect(page.locator('#step-poster')).toContainText('성적의 10%');
 await studentTab(page,'지도교수');await expect(page.getByText('수강 분반 교수',{exact:true})).toBeVisible();await expect(page.getByText('신도현 교수',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:/수강신청|지도 신청 제출/})).toHaveCount(0);
 await page.getByLabel('데모 사용자').selectOption('student-4');await studentTab(page,'로드맵');await expect(page.getByLabel('전공 로드맵').locator(':scope > li')).toHaveCount(7);await expect(page.getByLabel('현재 단계')).toContainText('논문계획서 초안 제출');
 await expect(page.locator('#step-office')).toContainText('합격 · 12월 15일');await expect(page.locator('#step-office')).toContainText('수정 후 합격 · 12월 22일');
 await page.setViewportSize({width:375,height:900});await noOverflow(page);await page.screenshot({path:info.outputPath('industrial-roadmap.png'),fullPage:true});
});

test('산공 계획서부터 수정 후 합격 마감·외부 제출 기록까지',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/student');await page.getByLabel('데모 사용자').selectOption('student-4');await studentTab(page,'로드맵');await studentTab(page,'연구계획서·논문');
 await page.getByLabel('제출물 제목').fill('계획서 초안');await page.getByLabel('제출물 본문').fill('시스템 최적화 연구');await page.getByRole('button',{name:'제출물 제출',exact:true}).click();
 await expect(page.getByText('접수됨',{exact:true})).toBeVisible();await expect(page.getByLabel('현재 단계')).toContainText('계획서 발표 동영상 제출');
 await page.getByLabel('제출물 제목').fill('계획 발표 영상');await page.getByLabel('제출물 본문').fill('영상 설명');await page.getByLabel('영상 제출 링크').fill('https://example.invalid/plan-video');await page.getByRole('button',{name:'제출물 제출',exact:true}).click();
 await studentTab(page,'지도교수');await page.getByRole('button',{name:'한지안 교수 선택'}).click();await page.getByLabel('연구 제목',{exact:true}).fill('최적화 연구');await page.getByLabel('연구 방향 요약').fill('연구 계획 요약');await page.getByLabel('연구계획 본문').fill('선행 제출한 자료 기반');await page.getByRole('button',{name:'지도 신청 제출'}).click();
 await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('tab',{name:'지도 신청',exact:true}).click();await page.getByLabel('데모 사용자').selectOption('prof-industrial');await page.getByRole('button',{name:'신청 승인'}).click();
 await page.getByRole('link',{name:'학생',exact:true}).click();await studentTab(page,'로드맵');await expect(page.getByLabel('현재 단계')).toContainText('계획서 최종본 제출');await expect(page.locator('#step-signed-plan')).toContainText('지도교수 서명 필요');await page.getByRole('button',{name:'제출 완료 체크'}).click();
 await studentTab(page,'연구계획서·논문');await page.getByLabel('제출물 제목').fill('논문과 심사 영상');await page.getByLabel('제출물 본문').fill('심사 요청');await page.getByLabel('영상 제출 링크').fill('https://example.invalid/review-video');await page.getByLabel('제출 파일',{exact:true}).setInputFiles(pdfFile);await page.getByRole('button',{name:'제출물 제출',exact:true}).click();
 await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('tab',{name:'지도 신청',exact:true}).click();await page.getByRole('tab',{name:'최종논문 검토',exact:true}).click();await page.getByRole('button',{name:'제출물 승인'}).click();await page.getByRole('tab',{name:'내 지도 학생',exact:true}).click();await page.getByRole('combobox',{name:'심사 결과',exact:true}).selectOption('수정 후 합격');await page.getByRole('button',{name:'심사 결과 저장'}).click();
 await page.getByRole('link',{name:'학생',exact:true}).click();await studentTab(page,'로드맵');const office=page.locator('#step-office');await expect(office).toContainText('12월 22일');await expect(office).not.toContainText('12월 15일');
 await studentTab(page,'캘린더');await page.getByLabel('캘린더 월').fill('2026-12');await expect(page.getByRole('button',{name:'최종본·심사의견서 제출 · 수정 후 합격',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'최종본·심사의견서 제출 · 합격',exact:true})).toHaveCount(0);
 await studentTab(page,'로드맵');await page.getByRole('button',{name:'제출 완료 체크'}).click();await expect(page.getByLabel('현재 단계')).toContainText('모든 단계 완료');await office.locator('summary').click();await expect(office.getByText('완료 기록:',{exact:false})).toBeVisible();await page.reload();await expect(page.getByLabel('현재 단계')).toContainText('모든 단계 완료');
});

test('조교 단계 유형·필참·서명·조건부 마감 편집 게시',async({page},info)=>{
 await page.goto('/admin');await expect(page.getByLabel('로드맵 미리보기').getByText('예정값',{exact:true}).first()).toBeVisible();
 await expect(page.getByLabel('완료 판정 주체').first().locator('option')).toHaveText(['지도교수','서비스 기록·자가 체크','외부 절차']);
 await page.getByLabel('데모 사용자').selectOption('assistant-industrial');const rows=page.getByLabel('절차 단계 편집').locator(':scope > li');const last=rows.last();await last.getByText('단계 설정',{exact:true}).click();
 await expect(last.getByLabel('단계 유형 (stepType)')).toHaveValue('EXTERNAL_SUBMISSION');await last.getByLabel('필참 여부').check();await last.getByLabel('지도교수 서명 필요',{exact:true}).check();await last.getByLabel('미이행 영향').fill('기한 내 제출 필요');await last.getByLabel('제출처 구분').selectOption('EMAIL');await last.getByLabel('조건 마감 2',{exact:true}).fill('2026-12-23T18:00');
 await page.getByRole('button',{name:'절차 게시',exact:true}).click();await expect(page.getByRole('status')).toContainText('게시 완료');await page.reload();await last.getByText('단계 설정',{exact:true}).click();await expect(last.getByLabel('조건 마감 2',{exact:true})).toHaveValue('2026-12-23T18:00');
 await page.setViewportSize({width:375,height:900});await noOverflow(page);await page.screenshot({path:info.outputPath('reference-editor.png'),fullPage:true});
 await page.getByRole('link',{name:'학생',exact:true}).click();await page.getByLabel('데모 사용자').selectOption('student-4');await studentTab(page,'로드맵');const card=page.locator('#step-office');await expect(card.getByText('필참',{exact:true})).toBeVisible();await expect(card.getByText('이메일',{exact:true})).toBeVisible();await expect(card).toContainText('12월 23일');await expect(page.getByText('예정값',{exact:true})).toHaveCount(0);
});
