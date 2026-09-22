import Image from 'next/image';

export function Brand(){
 return <span className="brand-lockup inline-flex items-center gap-2"><span>샤논</span><Image data-testid="brand-symbol" src="/snu-sha.png" alt="" width={28} height={28} className="brand-symbol h-7 w-7 shrink-0"/></span>;
}
