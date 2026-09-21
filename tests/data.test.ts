import { describe, expect, it } from "vitest";
import { departments } from "@/data/departments";
describe("학과 데이터 완결성", () => { it("모든 학과의 요건·공식 링크·단계 마감일이 있다", () => { for (const department of departments) { expect(department.requirements.primary).toBeTruthy(); expect(department.requirements.secondary).toBeTruthy(); expect(department.officialLink).toBeTruthy(); expect(department.stages.length).toBeGreaterThan(0); for (const stage of department.stages) expect(stage.dueDate).toMatch(/^2026-\d{2}-\d{2}$/); } }); });
