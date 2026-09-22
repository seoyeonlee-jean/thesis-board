import {it,expect} from 'vitest';
import {dday} from '@/lib/rules';
it('마감 안내는 날짜 기준 남은 일수·오늘·지연·미정을 풀어 쓴다',()=>{
 const now='2026-09-21T09:00';
 expect(dday('2026-10-02T18:00',now)).toBe('마감까지 11일');
 expect(dday('2026-09-21T18:00',now)).toBe('오늘 마감');
 expect(dday('2026-09-21T08:00',now)).toBe('마감 시간 지남');
 expect(dday('2026-09-19T18:00',now)).toBe('마감 2일 지남');
 expect(dday('',now)).toBe('정보 확인 필요');expect(dday('invalid',now)).toBe('정보 확인 필요');
});
