import {fromReference} from './reference';
export const psychology = fromReference('psychology','심리학과','사회과학대학','violet','application',[
  {
    "order": 1,
    "name": "지도교수 신청·승인",
    "stepType": "ADVISOR_REQUEST",
    "deadline": "2026-10-14T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL",
    "consequence": "기한 내 승인받지 못하면 이번 학기 졸업논문 진행이 어렵습니다."
  },
  {
    "order": 2,
    "name": "연구계획서 제출",
    "stepType": "PLAN_SUBMISSION",
    "deadline": "2026-10-28T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 3,
    "name": "논문 작성·지도 면담",
    "stepType": "MEETING",
    "deadline": null,
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 4,
    "name": "최종논문 제출·지도교수 승인",
    "stepType": "FINAL_SUBMISSION",
    "deadline": "2026-12-05T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "requiresAdvisorSignature": true,
    "appliesTo": "ALL"
  },
  {
    "order": 5,
    "name": "학과 조교실 제출",
    "stepType": "EXTERNAL_SUBMISSION",
    "deadline": "2026-12-12T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "NONE",
    "submitTo": "DEPT_OFFICE",
    "appliesTo": "ALL"
  }
],["apply","plan","writing","final","office"]);
psychology.sourceDescription += ' 심리학과는 2020~2022년 공지 요약을 참고했으며, 최신 매뉴얼과 공식 상세 링크는 정보 확인 필요입니다.';
psychology.stages[3].constraints!.push('최종 승인: 표지 서명 또는 통과 승인 메일. 서비스 승인은 실제 증빙을 대신하지 않습니다.');
