import {fromReference} from './reference';
export const chinese = fromReference('chinese','중어중문학과','인문대학','amber','application',[
  {
    "order": 1,
    "name": "논문제출신청·개요 제출",
    "stepType": "APPLICATION",
    "deadline": "2026-09-07T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "NONE",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL",
    "constraints": [
      "졸업신청과 별도로 해야 함",
      "기존 졸업논문과 제목·내용 중복 불가"
    ]
  },
  {
    "order": 2,
    "name": "지도교수 신청·승인",
    "stepType": "ADVISOR_REQUEST",
    "deadline": "2026-09-14T18:00",
    "dateStatus": "CONFIRMED",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 3,
    "name": "지도교수 면담·작성",
    "stepType": "MEETING",
    "deadline": null,
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL",
    "constraints": [
      "지도교수 면담 필수",
      "200자 원고지 80매 전후",
      "주제: 중국어·중국문학·중국문화·중국학술 관련"
    ]
  },
  {
    "order": 4,
    "name": "질의자·최종 제목 제출",
    "stepType": "APPLICATION",
    "deadline": "2026-12-01T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "NONE",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  },
  {
    "order": 5,
    "name": "졸업논문 발표회",
    "stepType": "PRESENTATION",
    "deadline": "2026-12-11T09:00",
    "dateStatus": "CONFIRMED",
    "approver": "EXTERNAL",
    "submitTo": "OTHER",
    "appliesTo": "ALL",
    "attendanceRequired": true,
    "consequence": "불참 시 졸업할 수 없습니다(취업 등 사유 불인정)."
  },
  {
    "order": 6,
    "name": "최종논문 제출·심사",
    "stepType": "FINAL_SUBMISSION",
    "deadline": "2026-12-18T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL",
    "constraints": [
      "한 편을 복수전공·부전공 양쪽에 제출하면 미제출로 보고 불합격"
    ]
  }
],["outline","advisor","writing","title","presentation","final"]);
chinese.officialLink='https://snucll.snu.ac.kr/학부졸업논문/';
chinese.sourceDescription += ' 실제로는 학과 배정이나 이 데모에서는 학생 신청·교수 승인으로 변형했습니다. 9/14는 배정 공지일을 옮긴 값으로 실제 신청 마감이 아닙니다. 12/11 발표는 예정 일정입니다.';
chinese.stages[1].dateNote='9/14 배정 공지일을 데모 신청 마감으로 사용. 18:00은 가정입니다.';
chinese.stages[4].dateNote='12/11 발표 예정일. 09:00은 데모 가정으로 실제 시각 확인 필요.';
