import {test,expect} from '@playwright/test';
import {sendApplication,studentApplication,pdfFile,noOverflow} from './helpers';
test('공지 대상·연결 단계·캘린더·읽음',async({page})=>{
 await page.goto('/admin');await page.getByRole('tab',{name:'공지 작성'}).click();await page.getByLabel('공지 제목',{exact:true}).fill('변경된 일정 안내');await page.getByLabel('공지 본문').fill('새 양식을 확인해 주세요.');await page.getByLabel('졸업예정 학기 필터').fill('2027년 2월');await page.getByLabel('연결 단계').selectOption('apply');await page.getByLabel('공지 일정 (선택)').fill('2026-10-03T10:00');await page.getByRole('button',{name:'공지 게시',exact:true}).click();
 await page.getByRole('link',{name:'학생',exact:true}).click();await expect(page.locator('#notices').getByText('변경된 일정 안내')).toBeVisible();await expect(page.locator('#step-apply').getByText('변경된 일정 안내')).toBeVisible();await expect(page.getByLabel('월간 일정').getByRole('button',{name:'변경된 일정 안내',exact:true})).toBeVisible();
 await page.getByLabel('알림',{exact:true}).click();await page.getByLabel('알림 목록').getByRole('link').first().click();await expect(page.getByLabel('알림',{exact:true})).toContainText('0');
 await page.getByLabel('데모 사용자').selectOption('student-3');await expect(page.locator('#notices').getByText('변경된 일정 안내')).toHaveCount(0);
});
test('정원·모집 검증과 신청 수정 재제출',async({page})=>{
 await studentApplication(page);await expect(page.getByRole('button',{name:'문예린 교수 선택'})).toBeDisabled();
 await page.getByRole('button',{name:'지도 신청 제출'}).click();await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('button',{name:'정원·모집 수정'}).click();await page.getByLabel('지도 정원',{exact:true}).fill('1');await expect(page.getByRole('button',{name:'정원 저장'})).toBeDisabled();await page.getByLabel('지도 정원',{exact:true}).fill('5');await page.getByRole('button',{name:'정원 저장'}).click();
 await page.getByLabel('처리 피드백').fill('연구 범위를 좁혀 주세요.');await page.getByRole('button',{name:'수정 요청',exact:true}).click();await page.getByRole('link',{name:'학생',exact:true}).click();await page.getByLabel('연구계획 본문').fill('좁힌 범위');await page.getByRole('button',{name:'재제출',exact:true}).click();await expect(page.getByText('제출됨',{exact:true})).toBeVisible();
});
test('절차 추가·순서 변경·삭제·수업형 게시',async({page})=>{
 await page.goto('/admin');await page.getByRole('button',{name:'단계 추가',exact:true}).click();await page.getByRole('button',{name:'새 단계 위로',exact:true}).click();
 await page.getByRole('button',{name:'새 단계 삭제',exact:true}).click();await expect(page.getByRole('button',{name:'새 단계 삭제',exact:true})).toHaveCount(0);
 await page.getByLabel('지도교수 결정 방식').selectOption('course');await expect(page.getByLabel('지도교수 결정 방식').locator('option')).toHaveCount(2);await page.getByRole('button',{name:'절차 게시',exact:true}).click();await page.getByRole('link',{name:'학생',exact:true}).click();await expect(page.getByLabel('전공 로드맵').getByText('지도교수 신청',{exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'지도 신청 제출'})).toHaveCount(0);
});
test('전공 탭·요약 이동·색상·달력 필터',async({page})=>{
 await page.goto('/student');await page.getByRole('tab',{name:'중어중문학과',exact:true}).click();await expect(page.getByLabel('다음 할 일')).toContainText('논문제출신청·개요 제출');await page.getByLabel('내 전공 요약').getByRole('button',{name:/심리학과/}).click();await expect(page.getByRole('tab',{name:'심리학과',exact:true})).toHaveAttribute('aria-selected','true');
 const calendar=page.getByLabel('통합 캘린더');const a=await calendar.getByRole('button',{name:'지도교수 신청',exact:true}).evaluate(e=>getComputedStyle(e).backgroundColor);const b=await calendar.getByRole('button',{name:'지도교수 신청·승인',exact:true}).evaluate(e=>getComputedStyle(e).backgroundColor);expect(a).not.toBe(b);
 await calendar.getByRole('checkbox',{name:'중어중문학과'}).uncheck();await expect(calendar.getByRole('button',{name:'지도교수 신청·승인',exact:true})).toHaveCount(0);
});
test('DOCX 제출과 잘못된 첨부 형식 거부',async({page})=>{
 await studentApplication(page);await page.getByLabel('연구계획 파일',{exact:true}).setInputFiles({name:'bad.txt',mimeType:'text/plain',buffer:Buffer.from('bad')});await expect(page.getByRole('alert').filter({hasText:'PDF'})).toContainText('PDF');
 await page.getByLabel('연구계획 파일',{exact:true}).setInputFiles({name:'plan.docx',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',buffer:Buffer.from('PK demo')});await expect(page.getByText('plan.docx',{exact:true})).toBeVisible();await page.getByLabel('연구계획 본문').fill('');await page.getByRole('button',{name:'지도 신청 제출'}).click();await page.getByText('제출한 신청서 (읽기 전용)',{exact:true}).click();await expect(page.getByRole('link',{name:'다운로드'})).toHaveAttribute('download','plan.docx');
});
test('375px 절차 편집기·교수 시간 그리드 레이아웃',async({page})=>{
 await page.setViewportSize({width:375,height:900});await page.goto('/admin');await noOverflow(page);await sendApplication(page);await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('button',{name:'면담 요청',exact:true}).click();await noOverflow(page);
});
test('교수 면담 그리드 드래그로 연속 시간 선택',async({page})=>{
 await sendApplication(page);await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByRole('button',{name:'면담 요청',exact:true}).click();
 await page.getByLabel('면담 시작 날짜').fill('2026-10-02');
 const start=page.getByRole('button',{name:'2026-10-02T14:00',exact:true}),end=page.getByRole('button',{name:'2026-10-02T14:30',exact:true});
 await start.scrollIntoViewIfNeeded();const a=await start.boundingBox(),b=await end.boundingBox();expect(a).toBeTruthy();expect(b).toBeTruthy();
 await page.mouse.move(a!.x+a!.width/2,a!.y+a!.height/2);await page.mouse.down();await page.mouse.move(b!.x+b!.width/2,b!.y+b!.height/2,{steps:8});await page.mouse.up();
 await expect(start).toHaveAttribute('aria-pressed','true');await expect(end).toHaveAttribute('aria-pressed','true');
});
test('요건 누락은 면제가 아닌 정보 확인 필요로 표시',async({page})=>{
 await page.goto('/student');await expect(page.getByLabel('다음 할 일')).toBeVisible();
 await page.getByLabel('데모 사용자').selectOption('student-3');await page.getByLabel('데모 사용자').selectOption('student-1');
 await page.evaluate(()=>{const key='thesis-board-v2',saved=JSON.parse(localStorage.getItem(key)!);delete saved.state.departments[0].requirements.primary;localStorage.setItem(key,JSON.stringify(saved));});
 await page.reload();await expect(page.getByRole('alert',{name:''}).filter({hasText:'논문 요건 정보 확인 필요'})).toBeVisible();await expect(page.getByText('심리학과 논문 면제',{exact:true})).toHaveCount(0);
});
test('알림이 다른 전공 탭의 상세로 이동',async({page})=>{
 await page.goto('/student');await page.getByRole('tab',{name:'중어중문학과',exact:true}).click();await page.getByRole('button',{name:'단계 완료 기록'}).click();
 await page.getByRole('button',{name:'차현우 교수 선택'}).click();await page.getByLabel('연구 제목',{exact:true}).fill('고전 연구');await page.getByLabel('연구 방향 요약').fill('서사 비교');await page.getByLabel('연구계획 본문').fill('중국 고전 문학 연구');await page.getByRole('button',{name:'지도 신청 제출'}).click();
 await page.getByRole('link',{name:'교수',exact:true}).click();await page.getByLabel('데모 사용자').selectOption('prof-chinese');await page.getByRole('button',{name:'신청 승인'}).click();
 await page.getByRole('link',{name:'학생',exact:true}).click();await expect(page.getByRole('tab',{name:'심리학과',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByLabel('알림',{exact:true}).click();await page.getByLabel('알림 목록').getByRole('link',{name:/지도 신청 승인/}).click();await expect(page.getByRole('tab',{name:'중어중문학과',exact:true})).toHaveAttribute('aria-selected','true');await expect(page.getByLabel('다음 할 일')).toContainText('면담 및 작성');
});
test('절차 드래그 순서 변경과 미리보기 동기화',async({page})=>{
 await page.goto('/admin');
 const items=page.getByLabel('절차 단계 편집').locator(':scope > li');
 await items.first().getByText('단계 설정',{exact:true}).click();
 await items.nth(0).dragTo(items.nth(1));
 await expect(items.first()).toContainText('지도교수 승인');
 await expect(page.getByLabel('로드맵 미리보기').locator(':scope > li').first()).toContainText('지도교수 승인');
});
test('조교의 이름·학번·졸업예정 학기·진행·지연 필터',async({page})=>{
 await page.goto('/admin');await page.getByRole('tab',{name:'학과 학생 검색'}).click();
 await expect(page.getByText('검색 결과 2명 / 소속 학생 2명')).toBeVisible();
 await page.getByLabel('졸업예정 학기',{exact:true}).selectOption('2027년 8월');await expect(page.getByRole('button',{name:'이준호',exact:false})).toBeVisible();await expect(page.getByRole('button',{name:'김서연',exact:false})).toHaveCount(0);
 await page.getByLabel('이름·학번 검색').fill('2021-10003');await page.getByLabel('현재 진행 단계').selectOption('apply');await expect(page.getByText('검색 결과 1명 / 소속 학생 2명')).toBeVisible();
 await page.getByLabel('이름·학번 검색').fill('김서연');await expect(page.getByText('검색 결과 0명 / 소속 학생 2명')).toBeVisible();
 await page.getByLabel('이름·학번 검색').fill('');await page.getByLabel('지연 학생만').check();await expect(page.getByText('검색 결과 0명 / 소속 학생 2명')).toBeVisible();
});
