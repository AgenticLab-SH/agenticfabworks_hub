const KEY='asset_dashboard_v10', OLD='asset_dashboard_v9';
const PARTS=['수입','주거','식비','교통','통신·구독','생활·건강','취미','사회·가족','부채','저축·투자','차량'];
const COLORS=['#0071e3','#15966a','#e88620','#d94a4a','#7258e8','#19879b','#aa5a9f','#7d8d45','#9b6b43','#5872a8','#8b8d93'];
const MARKETS={us:'미국주식',kr:'국내주식',crypto:'코인',cash:'현금·채권',gold:'금·원자재'};
const STYLES={long:'장기',swing:'스윙',day:'단타',system:'시스템'};
const PRIORITY_LABEL={1:'필수생존',2:'계약·부채',3:'재무목표',4:'생활유지',5:'선택·취미'};
let charts={};
const uid=()=>Math.random().toString(36).slice(2,10);
const priorityFor=(part,type,name='')=>{if(part==='수입')return 1;if(part==='부채')return 2;if(type==='목표'||part==='저축·투자')return 3;if(type==='필수')return 1;if(part==='생활·건강')return 4;return 5};
function I(part,sub,name,type,freq,amount,qty=1,start='2026-09',end='',priority){return{id:uid(),part,sub,name,type,freq,amount,qty,start,end,active:true,priority:priority||priorityFor(part,type,name)}}
function defaults(){return{
 items:[
 I('수입','급여','수습 실수령','수입','월',2410623,1,'2026-09','2026-11',1),I('수입','급여','정상 실수령','수입','월',3846579,1,'2026-12','',1),
 I('주거','사택','회사 납부 주거비','필수','월',100000,1,'2026-10','',1),I('주거','관리','엘리베이터·관리비','필수','월',80000,1,'2026-10','',1),I('주거','공과금','전기','필수','월',30000,1,'2026-10','',1),I('주거','공과금','가스','필수','월',30000,1,'2026-10','',1),I('주거','공과금','수도','필수','월',10000,1,'2026-10','',1),
 I('식비','식사','아침','필수','일',3000,1,'2026-09','',1),I('식비','식사','점심','필수','일',7000,1,'2026-09','',1),I('식비','식사','저녁','필수','일',6000,1,'2026-09','',1),I('식비','간식','간식·음료','선택','일',2000,1,'2026-09','',5),
 I('교통','대중교통','버스·지하철','필수','월',80000,1,'2026-09','',1),I('교통','택시','택시·비상교통','선택','월',20000,1,'2026-09','',5),
 I('통신·구독','통신','휴대폰','필수','월',50000,1,'2026-09','',1),I('통신·구독','AI','ChatGPT','선택','월',30000,1,'2026-09','',4),I('통신·구독','디지털','클라우드·저장공간','선택','월',5000,1,'2026-09','',5),
 I('생활·건강','생활용품','세제·휴지·청소용품','필수','월',30000,1,'2026-09','',4),I('생활·건강','세탁','세탁·의류관리','필수','월',20000,1,'2026-09','',4),I('생활·건강','미용','이발 적립','필수','월',15000,1,'2026-09','',4),I('생활·건강','의류','의류·신발 적립','선택','월',50000,1,'2026-09','',5),I('생활·건강','의료','병원·약국 적립','필수','월',30000,1,'2026-09','',1),
 I('취미','배드민턴','라켓','선택','일회성',250000,1,'2026-09','',5),I('취미','배드민턴','스트링·그립','선택','월',20000,1,'2026-09','',5),I('취미','배드민턴','코트·회비','선택','월',30000,1,'2026-09','',5),I('취미','배드민턴','셔틀콕','선택','월',20000,1,'2026-09','',5),I('취미','배드민턴','신발·의류 적립','선택','월',15000,1,'2026-09','',5),I('취미','기타','기타 수리','선택','일회성',150000,1,'2026-09','',5),I('취미','기타','줄·피크·소모품','선택','월',10000,1,'2026-09','',5),I('취미','노래','코인노래방','선택','월',20000,1,'2026-09','',5),I('생활·건강','가구','의자','선택','일회성',100000,1,'2026-09','',5),
 I('사회·가족','사회생활','입사초기 회식·카페','선택','월',300000,1,'2026-09','2026-11',5),I('사회·가족','사회생활','정상 사회생활','선택','월',200000,1,'2026-12','',5),I('사회·가족','가족','부모님 용돈 1','선택','일회성',500000,1,'2026-10','',5),I('사회·가족','가족','부모님 용돈 2','선택','일회성',500000,1,'2026-11','',5),I('사회·가족','선물','주변 사람 베풀기','선택','월',250000,1,'2026-10','2027-01',5),
 I('부채','카드','카드 9월','필수','일회성',208000,1,'2026-09','',2),I('부채','카드','카드 10월','필수','일회성',61100,1,'2026-10','',2),I('부채','카드','카드 11월','필수','일회성',44500,1,'2026-11','',2),I('부채','카드','카드 12월','필수','일회성',44500,1,'2026-12','',2),I('부채','카드','카드 1월','필수','일회성',44500,1,'2027-01','',2),I('부채','카드','카드 2월','필수','일회성',44500,1,'2027-02','',2),I('부채','학자금','학자금 자발상환','목표','월',300000,1,'2027-01','',2),
 I('저축·투자','장기','투자 1단계','목표','월',200000,1,'2027-01','2027-03',3),I('저축·투자','장기','투자 2단계','목표','월',500000,1,'2027-04','',3)
 ],
 settings:{start:'2026-09',months:60,cash:0,invest:0,loan:8225997,loanRate:1.7,emergency:8345000,car:21599000,returnRate:7,regime:'neutral',market:{us:45,kr:25,crypto:10,cash:15,gold:5},style:{long:60,swing:20,day:5,system:15},risk:{maxPosition:8,maxTheme:20,maxDailyLoss:1.5,maxMonthlyLoss:6,systemCapital:15,cryptoCap:12}},
 holdings:[],
 themes:[
 {id:uid(),name:'AI 컴퓨트·반도체·메모리',score:9,markets:'미국·한국',groups:['GPU/가속기','HBM/메모리','반도체 장비'],note:'AI 확장에 필요한 칩과 메모리 대역폭 병목'},
 {id:uid(),name:'전력망·데이터센터 인프라',score:9,markets:'미국·글로벌',groups:['전력기기','냉각','데이터센터','유틸리티'],note:'AI 전력 수요와 물리적 인프라 병목'},
 {id:uid(),name:'로보틱스·자동화',score:8,markets:'미국·한국·일본',groups:['산업로봇','센서','비전','산업SW'],note:'AI의 물리세계 적용 확대'},
 {id:uid(),name:'방산·우주·첨단안보',score:8,markets:'미국·한국·유럽',groups:['방산','드론','우주','사이버보안'],note:'국방의 자동화·우주·첨단기술화'},
 {id:uid(),name:'핵심소재·자원',score:7,markets:'글로벌',groups:['구리','희토류','우라늄','전력소재'],note:'AI·전력·공급망 안보와 연결'},
 {id:uid(),name:'디지털자산·토큰화',score:7,markets:'글로벌',groups:['BTC','ETH','스테이블코인','토큰화 인프라'],note:'제도화·현물상품·토큰화 확장'},
 {id:uid(),name:'AI 응용·소프트웨어',score:7,markets:'미국·글로벌',groups:['에이전트','기업SW','보안','개발도구'],note:'인프라에서 실제 생산성/수익화로 확장'},
 {id:uid(),name:'헬스케어·바이오 AI',score:6,markets:'미국·글로벌',groups:['신약개발','진단','의료AI'],note:'AI 응용 확장 후보'}
 ],
 lastNotionExported:0,updated:Date.now()
}}
function migrate(old){let d=defaults();if(!old||!old.items)return d;d.items=old.items.map(x=>({...x,priority:x.priority||priorityFor(x.part,x.type,x.name)}));if(old.settings){d.settings={...d.settings,...old.settings,loanRate:old.settings.rate??d.settings.loanRate,returnRate:old.settings.ret??d.settings.returnRate}}return d}
let S;try{S=JSON.parse(localStorage.getItem(KEY));if(!S){const old=JSON.parse(localStorage.getItem(OLD)||'null');S=migrate(old)}}catch(e){S=defaults()}if(!S)S=defaults();
function ensure(){S.items=S.items||[];S.holdings=S.holdings||[];S.themes=S.themes||defaults().themes;S.settings={...defaults().settings,...(S.settings||{})};S.settings.market={...defaults().settings.market,...(S.settings.market||{})};S.settings.style={...defaults().settings.style,...(S.settings.style||{})};S.settings.risk={...defaults().settings.risk,...(S.settings.risk||{})};S.items.forEach(x=>{if(!x.priority)x.priority=priorityFor(x.part,x.type,x.name)});S.lastNotionExported=S.lastNotionExported||S.lastNotionApplied||0}ensure();
const W=n=>Math.round(Number(n)||0).toLocaleString('ko-KR')+'원';
const PCT=n=>(Number(n)||0).toFixed(1)+'%';
const idx=ym=>{let[y,m]=ym.split('-').map(Number),[sy,sm]=S.settings.start.split('-').map(Number);return(y-sy)*12+m-sm};
const ym=i=>{let[sy,sm]=S.settings.start.split('-').map(Number),d=new Date(sy,sm-1+i,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const mv=x=>x.amount*x.qty*(x.freq==='일'?365.25/12:x.freq==='주'?52/12:x.freq==='연'?1/12:1);
function active(x,i){let s=idx(x.start||S.settings.start),e=x.end?idx(x.end):1e9;return x.active&&i>=s&&i<=e}
function calc(i){let p={},inc=0,liv=0,inv=0,pri={1:0,2:0,3:0,4:0,5:0};for(let x of S.items){if(!active(x,i))continue;let v=x.freq==='일회성'?(idx(x.start)===i?x.amount*x.qty:0):mv(x);if(!v)continue;p[x.part]=(p[x.part]||0)+v;pri[x.priority]=(pri[x.priority]||0)+v;if(x.part==='수입')inc+=v;else if(x.part==='저축·투자')inv+=v;else liv+=v}return{p,pri,inc,liv,inv,free:inc-liv-inv}}
function project(){let cash=+S.settings.cash,invest=+S.settings.invest,loan=+S.settings.loan,r=(+S.settings.returnRate/100)/12,lr=(+S.settings.loanRate/100)/12,out=[];for(let i=0;i<S.settings.months;i++){let c=calc(i);let pay=S.items.filter(x=>x.part==='부채'&&x.sub==='학자금'&&active(x,i)).reduce((a,x)=>a+(x.freq==='일회성'?(idx(x.start)===i?x.amount*x.qty:0):mv(x)),0);if(loan>0)loan=Math.max(0,loan*(1+lr)-Math.min(pay,loan*(1+lr)));invest=invest*(1+r)+c.inv;cash+=c.free;out.push({...c,ym:ym(i),cash,invest,loan,net:cash+invest-loan})}return out}
function hit(target){let p=project().find(x=>x.cash>=target);return p?p.ym:'미도달'}
function saveState(){S.updated=Date.now();localStorage.setItem(KEY,JSON.stringify(S));refreshNonTable();updateSyncState()}
function sum(o){return Object.values(o).reduce((a,b)=>a+(+b||0),0)}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function debounce(fn,ms=80){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
