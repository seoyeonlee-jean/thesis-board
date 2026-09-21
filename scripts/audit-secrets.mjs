import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const git = (...args) => execFileSync('git', args, {encoding:'utf8',maxBuffer:128*1024*1024});
const patterns = [
 ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
 ['provider-token', /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-(?:proj-)?[A-Za-z0-9_-]{25,}|AKIA[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{30,}|xox[baprs]-[A-Za-z0-9-]{20,})/],
 ['credential-assignment', /(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd)\s*[=:]\s*["'][^"'\s]{8,}["']/i],
 ['credential-url', /https?:\/\/[^\s/:]+:[^\s/@]+@/],
];
const findings=[]; let scanned=0;
function inspect(label, content) { scanned++; content.split('\n').forEach((line,i)=>patterns.forEach(([rule,re])=>{if(re.test(line))findings.push({file:label,line:i+1,rule});})); }
const files=git('ls-files','--cached','--others','--exclude-standard','-z').split('\0').filter(Boolean);
for(const file of files)inspect(file,readFileSync(file,'utf8'));
const objects=git('rev-list','--objects','--all').trim().split('\n'); let historyBlobs=0;
for(const item of objects){const [hash,...path]=item.split(' '); if(git('cat-file','-t',hash).trim()!=='blob')continue;historyBlobs++;inspect(`history:${hash}:${path.join(' ')}`,git('cat-file','blob',hash));}
console.log(JSON.stringify({workingTreeFiles:files.length,historyBlobs,scanned,findings},null,2));
process.exitCode=findings.length?1:0;
