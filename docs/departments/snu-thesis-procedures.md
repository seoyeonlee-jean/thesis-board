# 서울대 학부 졸업논문 절차 — 서비스 반영용 정리 (for Codex)

## 0. 이 문서의 용도

- `codex_revision_spec.md`(2차 수정 지시서)와 **함께** 쓰는 참고 문서다. 역할 정의, 화면 구성, 금지사항은 지시서를 따르고, 이 문서는 **학과별 절차 데이터와 그 데이터를 담기 위한 모델 보완**만 다룬다.
- 조사 대상: 심리학과, 중어중문학과, 기계공학부, 산업공학과 + 발표회 참고 학과(서어서문학과, 불어불문학과).
- 날짜는 **확인된 값**과 **데모용 가정값**을 구분한다. 가정값은 시드 데이터에 `isPlaceholder: true`로 표시하고, 실제 운영에서는 학과 조교가 절차 편집기에서 채우는 값이다.

### 지시서와 충돌하지 않도록 지켜야 할 규칙
- **지도교수는 절대 학과 조교가 배정하지 않는다.** 실제로 학과가 배정하는 학과(중어중문학과, 산업공학과)도 서비스 안에서는 `신청·승인형`으로 모델링한다(3장 참고).
- 지도교수 결정 방식은 `신청·승인형(A)`과 `수업형(B)` 두 가지뿐이다.
- 학과 절차는 코드에 하드코딩하지 않고, 이 문서의 시드 데이터를 **절차 템플릿 데이터로 적재**한다.

---

## 1. 학과별 실제 절차 요약

### 1.1 심리학과
| 항목 | 내용 |
|---|---|
| 대상 | 주전공·복수전공 모두 졸업논문 제출 필수 |
| 형태 | 개별 논문, 별도 교과목 없음 |
| 지도교수 결정 | 학생이 교수에게 직접 요청해 승인받음 → **서비스 방식 A와 일치** |
| 절차 | ① 지도교수 승인서 제출(승인 메일을 PDF로 저장해 졸업신청서와 함께 제출) → ② 논문 작성 → ③ 지도교수 최종 승인(표지 서명 또는 통과 승인 메일) → ④ 학과 조교실 제출 |
| 발표회 | 확인되지 않음 |
| 확인된 기한 예시 | 2022년 8월 졸업자: 지도교수 승인서 4/15 17:00, 졸업논문 6/17 18:00 |
| 한계 | 확인한 공지는 2020~2022년 자료. 최신 매뉴얼은 첨부파일이라 본문 미확인 |

### 1.2 중어중문학과
| 항목 | 내용 |
|---|---|
| 대상 | 주전공·다전공 모두 졸업논문심사 합격 필수 |
| 형태 | 개별 논문, 200자 원고지 80매 전후 |
| 지도교수 결정 | **실제로는 학생이 낸 개요를 보고 학과가 배정** → 서비스에서는 A로 조정(3장) |
| 절차 | ① 논문제출신청(졸업신청과 별도, 졸업신청을 하지 않은 학생도 가능) + 논문 개요 제출 → ② 지도교수 결정(2026-2학기 배정 공지 9/14) → ③ 지도교수 면담(필수)·작성 → ④ 질의자·최종 제목 수합 → ⑤ 졸업논문 발표회 → ⑥ 논문 제출·심사 |
| 발표회 | 공개 발표회, 전 순서 참석 필수, 질의자 지정. 2026-1학기 6/5, 2026-2학기 12/11 예정 |
| 제약 | 주제는 중국어·중국문학·중국문화·중국학술 관련. 기존 논문과 제목·내용 중복 불가(학과 논문집 목차 확인). 한 편을 복수전공·부전공 양쪽에 내면 미제출로 보고 불합격. 미제출·발표회 불참 시 졸업 불가(취업 등 사유 불인정) |

### 1.3 기계공학부
| 항목 | 내용 |
|---|---|
| 대상 | 기계공학부 주전공·복수전공, 자유전공 진입생 |
| 형태 | **전공필수 교과목** 「기계시스템설계1」→「기계시스템설계2」, 한 학기씩 1년 |
| 지도교수 결정 | 수강신청 + 희망 연구실 10지망 설문 → 학부가 사전 참여 연구실·누적평점·지망순위로 결정. 설계2는 설계1 교수가 이어짐 → **서비스 방식 B** |
| 절차 | ① 수강신청 + 연구실 지망 설문(2026-2학기: 7/21~7/28 17:00) → ② 지도교수(분반) 확정 → ③ 설계1 수행, 중간점검(교수 확인 필수) → ④ 설계2 수행 → ⑤ 포스터 발표회 → ⑥ 성적 확정 |
| 발표회 | 포스터 발표. 교수들이 돌며 평가·질의. 설계2 성적에 10% 반영. 우수논문은 성적 1단계 상향, 사유서 없는 불참은 1단계 하향. 불참하려면 지도교수 서명과 근거자료 필요. 2026-1학기 6/12 오전 |
| 제약 | 수강신청을 하지 않으면 설문에 참여해도 과목 참여 불가. 중간점검에서 교수 확인 생략·임의 제출 시 처벌 가능 |
| 한계 | 최종 논문의 제출 형식·제출처는 미확인 |

### 1.4 산업공학과
| 항목 | 내용 |
|---|---|
| 형태 | 개별 논문 |
| 지도교수 결정 | **실제로는 계획서 발표 심사 후 학과가 선임**(학과장이 심사위원단 구성) → 서비스에서는 A로 조정(3장) |
| 규정상 순서 | 계획서 제출 → 계획서 심사·지도교수 선임 → 작성 → 지도교수 합격판정 → 학과장 결격여부 판정 |
| 2026-2학기 일정(확인됨) | 9/10 계획서 초안 이메일 제출(지도교수 날인 불필요) → 9/17 계획서 발표 동영상 제출 → 9/29 지도교수 선정·공지 → 10/7 계획서 최종본 제출(지도교수 날인, 학과사무실) → 11/30 논문 + 심사영상 제출(비대면 심사) → 12/8 지도교수가 심사의견 이메일 회신 → 최종본: 합격 시 12/15, 수정 후 합격 시 12/22(심사의견서 + 최종본) |
| 특징 | 심사 결과에 따라 **마감일이 갈라짐**(합격 / 수정 후 합격) |

### 1.5 발표회 참고 학과
- **서어서문학과**: 3월·9월 셋째 주 금요일까지 심사신청서 제출 및 지도교수 결정. 연구년 교수 제외, 교수 1인당 최대 5명 지도. 발표회 전주 금요일까지 지도교수 승인받은 1차 논문 PDF 제출(미승인 시 발표 불가). 발표 15분 + 코멘트·심사 10분. 불참 시 졸업 취소 가능. 코멘트 반영 후 지도교수 서명 원본 제출.
- **불어불문학과**: 20학번부터 졸업 예정자 전원 발표·제출 원칙.

---

## 2. 학과 절차에서 뽑아낸 공통 단계 유형

네 학과의 단계는 아래 유형으로 모두 표현할 수 있다. 조교 절차 편집기에서 단계를 만들 때 유형을 고르게 하고, 유형에 따라 학생 화면의 행동 버튼과 표시가 정해진다.

| stepType | 의미 | 학생 화면 행동 버튼 | 처리 주체 | 예시 |
|---|---|---|---|---|
| `APPLICATION` | 논문 제출 신청·개요 제출 | 신청서 작성 | 서비스 내 기록(조교 확인 불필요) | 중문 논문제출신청 |
| `ADVISOR_REQUEST` | 지도교수 신청·승인 (A형 전용) | 교수 찾기 | 교수 | 심리·중문·산공 |
| `COURSE_ENROLLMENT` | 교과목 수강·분반 확정 (B형 전용) | 없음(분반 교수 표시) | 서비스 밖(수강신청) | 기계 설계1·2 |
| `PLAN_SUBMISSION` | 연구계획서 제출·검토 | 연구계획 작성 | 교수 | 산공 계획서, 심리 연구계획 |
| `MEETING` | 지도교수 면담 | 면담 시간 고르기 | 교수 제안 → 학생 선택 | 중문 필수 면담 |
| `CHECKPOINT` | 중간점검(교수 확인) | 중간 결과 제출 | 교수 | 기계 중간점검 |
| `PRESENTATION` | 발표회·발표영상 제출 | 발표 정보 확인 / 영상 제출 | 외부 행사(서비스는 일정·필참 안내) | 중문·기계 발표회, 산공 영상 |
| `FINAL_SUBMISSION` | 최종논문 제출·승인 | 최종논문 제출 | 교수 | 전 학과 |
| `EXTERNAL_SUBMISSION` | 서비스 밖 제출(학과사무실 원본 등) | 제출 완료 체크 | 학생 자가 체크 | 심리 조교실 제출, 산공 날인본 |

---

## 3. 서비스 모델에 반영할 사항

### 3.1 지도교수 결정 방식 매핑
| 학과 | 실제 방식 | 서비스 방식 | 서비스 안에서의 처리 |
|---|---|---|---|
| 심리학과 | 학생이 교수에게 승인 요청 | **A 신청·승인형** | 그대로 구현 |
| 중어중문학과 | 개요 제출 후 학과 배정 | **A 신청·승인형** | 학생이 개요를 담아 교수에게 신청, 교수가 승인. 조교는 배정하지 않음 |
| 산업공학과 | 계획서 발표 심사 후 학과 선임 | **A 신청·승인형** | 계획서 초안·발표영상 단계(`PLAN_SUBMISSION`, `PRESENTATION`) 다음에 `ADVISOR_REQUEST`를 두고 교수가 승인. 조교는 배정하지 않음 |
| 기계공학부 | 수강신청 + 지망 설문으로 분반 확정 | **B 수업형** | 서비스는 분반 데이터로 받은 교수를 지도교수로 **표시만** 함. 배정은 서비스 밖에서 이미 끝난 상태 |

> 중문·산공은 실제 운영 방식과 서비스 방식이 다르다. 데모에서는 서비스 설계 원칙(조교 배정 없음)을 우선하며, 이 차이를 코드 주석이나 README에 한 줄로 남긴다.

### 3.2 `ProcedureStep` 필드 보완
지시서 6.1의 `ProcedureStep`에 아래 필드를 추가한다. 조교 절차 편집기(지시서 5.1)의 입력 필드도 같이 늘린다.

| 필드 | 타입 | 설명 | 근거 |
|---|---|---|---|
| `stepType` | enum (2장 표) | 단계 유형 | 전 학과 |
| `attendanceRequired` | boolean | 필참 여부. true면 로드맵에 `필참` 배지 | 중문·기계 발표회 |
| `consequence` | string | 미이행 시 영향 한 줄(예: "불참 시 졸업 불가") | 중문, 서어서문, 기계 |
| `approver` | enum `ADVISOR` / `NONE` / `EXTERNAL` | 누가 완료를 판정하는지. `DEPARTMENT_STAFF`는 두지 않는다 | 조교 배정·승인 금지 원칙 |
| `submitTo` | enum `IN_SERVICE` / `DEPT_OFFICE` / `EMAIL` / `OTHER` | 제출처 | 심리 조교실, 산공 이메일·사무실 |
| `requiresAdvisorSignature` | boolean | 지도교수 날인·서명 필요 여부 | 산공 계획서 최종본, 심리 표지 서명 |
| `conditionalDeadlines` | `[{condition, deadline}]` | 결과에 따라 달라지는 마감 | 산공 합격 12/15 / 수정 후 합격 12/22 |
| `appliesTo` | enum `MAJOR` / `DOUBLE_MAJOR` / `ALL` | 적용 대상 | 심리·중문 주/복수 모두 필수 |
| `constraints` | string[] | 분량·주제·중복 금지 등 규정 | 중문 80매, 주제 범위, 이중 제출 금지 |
| `dateStatus` | enum `CONFIRMED` / `PLACEHOLDER` | 날짜가 공지로 확인된 값인지 | 데모 시드 구분 |

### 3.3 `Department` 필드 보완
| 필드 | 설명 | 근거 |
|---|---|---|
| `advisorMode` | `APPLY_APPROVE`(A) / `COURSE`(B) | 3.1 |
| `courseNames` | B형일 때 교과목명 목록 | 기계 설계1·2 |
| `maxStudentsPerAdvisor` | 학과 차원의 교수 1인당 상한(선택). 교수 개인 정원 입력 시 이 값을 넘지 못하게 검증 | 서어서문 최대 5명 |

### 3.4 화면 반영
- **로드맵 카드**: `필참` 배지, `지도교수 서명 필요` 배지, 제출처 배지(`서비스 제출` / `학과사무실` / `이메일`), 날짜 옆 `예정값` 배지(`PLACEHOLDER`일 때, 조교 화면에서만 표시).
- **조건부 마감**: 카드에 두 줄로 표시(`합격 12/15 · 수정 후 합격 12/22`). 교수가 심사 결과를 입력하면 해당하는 마감만 남긴다.
- **B형 학생 로드맵**: `ADVISOR_REQUEST` 단계가 없고, 지도교수 영역에 `수강 분반 교수` 라벨과 교수 이름만 표시.
- **복수전공 제약**: 중문처럼 이중 제출 금지 규정이 있으면 최종논문 제출 화면에 한 줄 경고. 다른 전공 탭에 이미 같은 파일이 제출되어 있으면 제출 전에 알림.
- **`EXTERNAL_SUBMISSION` 단계**: 학생이 "제출 완료" 체크를 할 수 있고, 체크 시각이 기록된다. 조교 승인 절차는 두지 않는다.

---

## 4. 데모 시드 데이터

적용 학기: `2026-2` (2027년 2월 졸업예정자 기준, 기계공학부만 예외). 날짜 형식 `YYYY-MM-DDTHH:mm`, 시간이 없는 것은 18:00으로 둔다.

```json
{
  "departments": [
    { "id": "psych", "name": "심리학과", "color": "#3B82F6", "advisorMode": "APPLY_APPROVE" },
    { "id": "chinese", "name": "중어중문학과", "color": "#EF4444", "advisorMode": "APPLY_APPROVE" },
    { "id": "me", "name": "기계공학부", "color": "#10B981", "advisorMode": "COURSE",
      "courseNames": ["기계시스템설계1", "기계시스템설계2"] },
    { "id": "ie", "name": "산업공학과", "color": "#F59E0B", "advisorMode": "APPLY_APPROVE" }
  ],
  "procedureTemplates": [
    {
      "departmentId": "psych", "term": "2026-2", "status": "PUBLISHED",
      "steps": [
        { "order": 1, "name": "지도교수 신청·승인", "stepType": "ADVISOR_REQUEST", "deadline": "2026-10-14T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL",
          "consequence": "기한 내 승인받지 못하면 이번 학기 졸업논문 진행이 어렵습니다." },
        { "order": 2, "name": "연구계획서 제출", "stepType": "PLAN_SUBMISSION", "deadline": "2026-10-28T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 3, "name": "논문 작성·지도 면담", "stepType": "MEETING", "deadline": null,
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 4, "name": "최종논문 제출·지도교수 승인", "stepType": "FINAL_SUBMISSION", "deadline": "2026-12-05T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE",
          "requiresAdvisorSignature": true, "appliesTo": "ALL" },
        { "order": 5, "name": "학과 조교실 제출", "stepType": "EXTERNAL_SUBMISSION", "deadline": "2026-12-12T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "NONE", "submitTo": "DEPT_OFFICE", "appliesTo": "ALL" }
      ]
    },
    {
      "departmentId": "chinese", "term": "2026-2", "status": "PUBLISHED",
      "steps": [
        { "order": 1, "name": "논문제출신청·개요 제출", "stepType": "APPLICATION", "deadline": "2026-09-07T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "NONE", "submitTo": "IN_SERVICE", "appliesTo": "ALL",
          "constraints": ["졸업신청과 별도로 해야 함", "기존 졸업논문과 제목·내용 중복 불가"] },
        { "order": 2, "name": "지도교수 신청·승인", "stepType": "ADVISOR_REQUEST", "deadline": "2026-09-14T18:00",
          "dateStatus": "CONFIRMED", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 3, "name": "지도교수 면담·작성", "stepType": "MEETING", "deadline": null,
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL",
          "constraints": ["지도교수 면담 필수", "200자 원고지 80매 전후",
                          "주제: 중국어·중국문학·중국문화·중국학술 관련"] },
        { "order": 4, "name": "질의자·최종 제목 제출", "stepType": "APPLICATION", "deadline": "2026-12-01T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "NONE", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 5, "name": "졸업논문 발표회", "stepType": "PRESENTATION", "deadline": "2026-12-11T09:00",
          "dateStatus": "CONFIRMED", "approver": "EXTERNAL", "submitTo": "OTHER", "appliesTo": "ALL",
          "attendanceRequired": true, "consequence": "불참 시 졸업할 수 없습니다(취업 등 사유 불인정)." },
        { "order": 6, "name": "최종논문 제출·심사", "stepType": "FINAL_SUBMISSION", "deadline": "2026-12-18T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL",
          "constraints": ["한 편을 복수전공·부전공 양쪽에 제출하면 미제출로 보고 불합격"] }
      ]
    },
    {
      "departmentId": "me", "term": "2026-2", "status": "PUBLISHED",
      "steps": [
        { "order": 1, "name": "수강신청·희망 연구실 설문", "stepType": "COURSE_ENROLLMENT", "deadline": "2026-07-28T17:00",
          "dateStatus": "CONFIRMED", "approver": "EXTERNAL", "submitTo": "OTHER", "appliesTo": "ALL",
          "constraints": ["수강신청하지 않으면 설문에 참여해도 과목 참여 불가", "사전 컨택·참여 연구실은 반드시 지망에 기재"] },
        { "order": 2, "name": "기계시스템설계1 수행", "stepType": "COURSE_ENROLLMENT", "deadline": "2026-12-18T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "OTHER", "appliesTo": "ALL" },
        { "order": 3, "name": "중간점검", "stepType": "CHECKPOINT", "deadline": "2026-10-23T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL",
          "requiresAdvisorSignature": true, "consequence": "교수 확인 없이 제출하면 처벌될 수 있습니다." },
        { "order": 4, "name": "기계시스템설계2 수행", "stepType": "COURSE_ENROLLMENT", "deadline": "2027-06-18T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "OTHER", "appliesTo": "ALL" },
        { "order": 5, "name": "포스터 발표회", "stepType": "PRESENTATION", "deadline": "2027-06-11T09:00",
          "dateStatus": "PLACEHOLDER", "approver": "EXTERNAL", "submitTo": "OTHER", "appliesTo": "ALL",
          "attendanceRequired": true,
          "consequence": "설계2 성적의 10% 반영. 사유서 없이 불참하면 성적 1단계 하향." },
        { "order": 6, "name": "최종논문 제출·승인", "stepType": "FINAL_SUBMISSION", "deadline": "2027-06-18T18:00",
          "dateStatus": "PLACEHOLDER", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" }
      ]
    },
    {
      "departmentId": "ie", "term": "2026-2", "status": "PUBLISHED",
      "steps": [
        { "order": 1, "name": "논문계획서 초안 제출", "stepType": "PLAN_SUBMISSION", "deadline": "2026-09-10T18:00",
          "dateStatus": "CONFIRMED", "approver": "NONE", "submitTo": "IN_SERVICE", "appliesTo": "ALL",
          "requiresAdvisorSignature": false },
        { "order": 2, "name": "계획서 발표 동영상 제출", "stepType": "PRESENTATION", "deadline": "2026-09-17T18:00",
          "dateStatus": "CONFIRMED", "approver": "NONE", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 3, "name": "지도교수 신청·승인", "stepType": "ADVISOR_REQUEST", "deadline": "2026-09-29T18:00",
          "dateStatus": "CONFIRMED", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 4, "name": "계획서 최종본 제출", "stepType": "EXTERNAL_SUBMISSION", "deadline": "2026-10-07T18:00",
          "dateStatus": "CONFIRMED", "approver": "NONE", "submitTo": "DEPT_OFFICE", "appliesTo": "ALL",
          "requiresAdvisorSignature": true },
        { "order": 5, "name": "논문·심사영상 제출", "stepType": "FINAL_SUBMISSION", "deadline": "2026-11-30T18:00",
          "dateStatus": "CONFIRMED", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 6, "name": "심사의견 확인", "stepType": "CHECKPOINT", "deadline": "2026-12-08T18:00",
          "dateStatus": "CONFIRMED", "approver": "ADVISOR", "submitTo": "IN_SERVICE", "appliesTo": "ALL" },
        { "order": 7, "name": "최종본·심사의견서 제출", "stepType": "EXTERNAL_SUBMISSION", "deadline": null,
          "conditionalDeadlines": [
            { "condition": "합격", "deadline": "2026-12-15T18:00" },
            { "condition": "수정 후 합격", "deadline": "2026-12-22T18:00" }
          ],
          "dateStatus": "CONFIRMED", "approver": "NONE", "submitTo": "DEPT_OFFICE", "appliesTo": "ALL" }
      ]
    }
  ]
}
```

### 4.1 데모 사용자와 학과 연결
지시서 7장의 데모 사용자를 아래처럼 연결한다.

| 사용자 | 전공 | 시연 포인트 |
|---|---|---|
| 김서연 | 심리학과(주) + 중어중문학과(복수), 2027년 2월 졸업예정 | 다전공 탭, 캘린더 겹침, 중문 발표회 `필참`, 이중 제출 경고 |
| 박도윤 | 기계공학부(주), B형, 2027년 8월 졸업예정 | 지도교수 신청 단계 없는 로드맵, 중간점검, 포스터 발표회 |
| 이준호 | 심리학과(주), 초과학기 | 조교 화면 초과학기 필터 |
| 최민재 (추가) | 산업공학과(주), 2027년 2월 졸업예정 | 계획서 먼저 → 지도교수 승인 순서, 조건부 마감(합격/수정 후 합격) |

---

## 5. 완료 기준 추가 항목

지시서 8장 체크리스트에 아래를 추가한다.

- [ ] 4장의 시드 데이터가 절차 템플릿으로 적재되고, 네 학과 학생의 로드맵이 모두 그 데이터로 생성된다.
- [ ] 산업공학과 로드맵에서 계획서 단계가 지도교수 신청보다 먼저 나온다.
- [ ] 교수가 산업공학과 학생에게 `수정 후 합격`을 입력하면 최종본 마감이 12/22만 남는다.
- [ ] 중어중문학과 발표회와 기계공학부 발표회 카드에 `필참` 배지와 미이행 영향 문구가 보인다.
- [ ] 조교 절차 편집기에서 `stepType`, 필참 여부, 제출처, 지도교수 서명 필요 여부, 조건부 마감을 입력할 수 있다.
- [ ] `approver`에 학과 조교를 선택할 수 있는 옵션이 없다.
- [ ] `PLACEHOLDER` 날짜는 조교 화면에서 `예정값` 배지로 구분된다.

---

## 6. 출처 (조사 시점 기준)

- 중어중문학과 학부 졸업논문 안내·공지: https://snucll.snu.ac.kr/학부졸업논문/ , https://snucll.snu.ac.kr/36838/ , https://snucll.snu.ac.kr/36494/
- 서어서문학과 졸업논문 및 발표회: https://spanish.snu.ac.kr/thesis-and-presentation/
- 기계공학부 기계시스템설계 공지: https://me.snu.ac.kr/학부-공지사항/?mod=document&uid=22117
- 산업공학과 학사논문 일정 공지: https://ie.snu.ac.kr/notice/?mod=document&uid=6384
- 심리학과 졸업사정 안내: psych.snu.ac.kr 공지사항(2020~2022년 졸업사정 안내)

실제 운영 전에는 각 학과 행정실에서 최신 일정표를 받아 `PLACEHOLDER` 값을 교체해야 한다.
