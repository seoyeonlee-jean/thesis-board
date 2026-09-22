import Link from "next/link";
import {Brand} from "@/components/brand";
const roles = [["학생", "/student", "전공별 절차와 다음 할 일을 한눈에 확인합니다."], ["교수", "/professor", "신청·면담·제출물을 검토하고 피드백을 전합니다."], ["학과 조교", "/admin", "졸업논문 절차·공지를 게시하고 학생 진행을 조회합니다."]];
export default function Home() {
 return <main className="landing">
  <p className="landing-brand"><Brand/></p>
  <div className="landing-hero">
   <h1>전공마다 다른 논문 절차,<br/>다음 할 일을 놓치지 않게</h1>
   <p className="landing-description">학생·교수·학과 조교가 같은 진행 상태를 확인하는 가상 시연 보드입니다. 다전공 학생의 전공별 마감과 지도교수 승인 흐름을 확인해 보세요.</p>
  </div>
  <section className="landing-roles">{roles.map(([title,href,detail])=><Link key={title} href={href} className="landing-role"><p className="label">역할 선택</p><h2>{title}</h2><p>{detail}</p><span>{title} 화면 시작 →</span></Link>)}</section>
  <p className="landing-note">제공된 학과 공지 요약과 가정 일정을 함께 사용하는 비공식 데모입니다. 인물·연락처·정원은 가상이며 실제 학사 처리가 아닙니다.</p>
 </main>;
}
