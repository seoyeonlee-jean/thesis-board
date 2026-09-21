import { test, expect } from "@playwright/test";
test("대표 흐름: 교수 승인 후 행정실 확정 검토", async ({ page }) => {
  await page.goto("/"); await page.getByRole("link", { name: "학생 화면 시작" }).click();
  await page.getByLabel("주전공").selectOption("psychology"); await page.getByLabel("복수전공").selectOption("mechanical"); await page.getByRole("button", { name: "전공별 로드맵 생성" }).click();
  await page.getByRole("button", { name: "승인 요청" }).first().click(); await page.getByRole("link", { name: "교수" }).click();
  await page.getByRole("button", { name: "승인", exact: true }).click(); await page.getByRole("link", { name: "행정실" }).click();
  await page.getByRole("button", { name: "검토 완료" }).click(); await page.getByRole("link", { name: "학생" }).click();
  await expect(page.getByText("행정실 검토: 검토 완료")).toBeVisible(); await expect(page.getByText("논문 작성진행 필요")).toBeVisible();
});
test("사회학과 정원 마감 교수는 신청과 승인이 불가", async ({ page }) => { await page.goto("/student"); await page.getByRole("button", { name: "데모 초기화" }).click(); await page.getByLabel("주전공").selectOption("sociology"); await page.getByLabel("복수전공").selectOption("psychology"); await page.getByRole("button", { name: "전공별 로드맵 생성" }).click(); await expect(page.getByRole("button", { name: "정원 마감" })).toBeDisabled(); });
test("수정 요청 피드백은 즉시 학생 화면에 표시된다", async ({ page }) => { await page.goto("/student"); await page.getByRole("button", { name: "데모 초기화" }).click(); await page.getByLabel("주전공").selectOption("psychology"); await page.getByLabel("복수전공").selectOption("mechanical"); await page.getByRole("button", { name: "전공별 로드맵 생성" }).click(); await page.getByRole("button", { name: "승인 요청" }).first().click(); await page.getByRole("link", { name: "교수" }).click(); await page.getByLabel("학생 피드백").fill("연구 범위를 좁혀 주세요."); await page.getByRole("button", { name: "수정 요청" }).click(); await page.getByRole("link", { name: "학생" }).click(); await expect(page.getByText("피드백: 연구 범위를 좁혀 주세요.")).toBeVisible(); });
test("모바일 폭에서도 학생 보드가 표시된다", async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/student"); await expect(page.getByText("전공별 논문 로드맵을 만들어요")).toBeVisible(); });
