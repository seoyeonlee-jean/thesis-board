import {fromReference} from './reference';
export const industrial = fromReference('industrial','산업공학과','공과대학','emerald','application',[
  {
    "order": 1,
    "name": "논문계획서 초안 제출",
    "stepType": "PLAN_SUBMISSION",
    "deadline": "2026-09-10T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "NONE",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL",
    "requiresAdvisorSignature": false
  },
  {
    "order": 2,
    "name": "계획서 발표 동영상 제출",
    "stepType": "PRESENTATION",
    "deadline": "2026-09-17T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "NONE",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 3,
    "name": "지도교수 신청·승인",
    "stepType": "ADVISOR_REQUEST",
    "deadline": "2026-09-29T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 4,
    "name": "계획서 최종본 제출",
    "stepType": "EXTERNAL_SUBMISSION",
    "deadline": "2026-10-07T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "NONE",
    "submitTo": "DEPT_OFFICE",
    "appliesTo": "ALL",
    "requiresAdvisorSignature": true
  },
  {
    "order": 5,
    "name": "논문·심사영상 제출",
    "stepType": "FINAL_SUBMISSION",
    "deadline": "2026-11-30T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 6,
    "name": "심사의견 확인",
    "stepType": "CHECKPOINT",
    "deadline": "2026-12-08T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 7,
    "name": "최종본·심사의견서 제출",
    "stepType": "EXTERNAL_SUBMISSION",
    "deadline": null,
    "conditionalDeadlines": [
      {
        "condition": "합격",
        "deadline": "2026-12-15T18:00"
      },
      {
        "condition": "수정 후 합격",
        "deadline": "2026-12-22T18:00"
      }
    ],
    "dateStatus": "CONFIRMED",
    "approver": "NONE",
    "submitTo": "DEPT_OFFICE",
    "appliesTo": "ALL"
  }
],["draft-plan","video","advisor","signed-plan","final","review","office"]);
industrial.officialLink='https://ie.snu.ac.kr/notice/?mod=document&uid=6384';
industrial.sourceDescription += ' 실제로는 심사 후 학과 선임이나 데모에서는 신청·교수 승인으로 변형했습니다. 주·복수전공 필수 여부는 자료에 없어 모두 필수로 가정했으며 실제 요건은 정보 확인 필요입니다. 시각 없는 일정은 18:00으로 가정했습니다.';
industrial.stages[0].notes='실제 초안은 이메일 제출(날인 불필요). 데모에서는 서비스에 제출 사실과 내용을 기록합니다.';
industrial.stages[1].kind='plan'; industrial.stages[1].requiresVideo=true;
industrial.stages[4].requiresVideo=true;
industrial.stages[5].kind='task'; industrial.stages[5].collectsReviewOutcome=true;
industrial.stages[5].description='지도교수가 내 지도 학생 화면에서 심사 결과를 입력합니다. 실제 심사의견 이메일 회신을 대신하지 않습니다.';
