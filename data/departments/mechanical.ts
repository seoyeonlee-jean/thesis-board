import {fromReference} from './reference';
export const mechanical = fromReference('mechanical','기계공학부','공과대학','sky','course',[
  {
    "order": 1,
    "name": "수강신청·희망 연구실 설문",
    "stepType": "COURSE_ENROLLMENT",
    "deadline": "2026-07-28T17:00",
    "dateStatus": "CONFIRMED",
    "approver": "EXTERNAL",
    "submitTo": "OTHER",
    "appliesTo": "ALL",
    "constraints": [
      "수강신청하지 않으면 설문에 참여해도 과목 참여 불가",
      "사전 컨택·참여 연구실은 반드시 지망에 기재"
    ]
  },
  {
    "order": 2,
    "name": "기계시스템설계1 수행",
    "stepType": "COURSE_ENROLLMENT",
    "deadline": "2026-12-18T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "OTHER",
    "appliesTo": "ALL"
  },
  {
    "order": 3,
    "name": "중간점검",
    "stepType": "CHECKPOINT",
    "deadline": "2026-10-23T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL",
    "requiresAdvisorSignature": true,
    "consequence": "교수 확인 없이 제출하면 처벌될 수 있습니다."
  },
  {
    "order": 4,
    "name": "기계시스템설계2 수행",
    "stepType": "COURSE_ENROLLMENT",
    "deadline": "2027-06-18T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "OTHER",
    "appliesTo": "ALL"
  },
  {
    "order": 5,
    "name": "포스터 발표회",
    "stepType": "PRESENTATION",
    "deadline": "2027-06-11T09:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "EXTERNAL",
    "submitTo": "OTHER",
    "appliesTo": "ALL",
    "attendanceRequired": true,
    "consequence": "설계2 성적의 10% 반영. 사유서 없이 불참하면 성적 1단계 하향."
  },
  {
    "order": 6,
    "name": "최종논문 제출·승인",
    "stepType": "FINAL_SUBMISSION",
    "deadline": "2027-06-18T18:00",
    "dateStatus": "PLACEHOLDER",
    "approver": "ADVISOR",
    "submitTo": "IN_SERVICE",
    "appliesTo": "ALL"
  }
],["registration","course1","midterm","course2","poster","final"]);
mechanical.officialLink='https://me.snu.ac.kr/학부-공지사항/?mod=document&uid=22117';
mechanical.graduationSemester='2027년 8월';
mechanical.courseNames=['기계시스템설계1','기계시스템설계2'];
mechanical.sourceDescription += ' 두 학기 과정으로 2027년 일정까지 표시합니다. 설계1·2 모두 분반을 미리 받은 시연용 수강 데이터이며, 수강 확인은 성적·교과목 이수 판정을 대신하지 않습니다.';
mechanical.stages[0].courseId='design1'; mechanical.stages[0].startDate='2026-07-21T09:00'; mechanical.stages[0].dateNote='7/28 17:00 마감은 제공 자료 기준. 7/21 시작 시각은 데모 가정.';
mechanical.stages[1].courseId='design1'; mechanical.stages[3].courseId='design2';
mechanical.stages[4].constraints!.push('우수논문은 성적 1단계 상향. 불참 시 지도교수 서명과 근거자료 필요.');
mechanical.stages[5].notes='정보 확인 필요: 실제 최종논문 제출 형식·제출처 미확인. 서비스 PDF/DOCX 제출은 데모 가정입니다.';
