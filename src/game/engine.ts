import {bank,byId,questions,gradable} from '../content/bank';
export type Mode='cram'|'rematch'|'boss'|'exam';
export type Settings={name:string;roast:'off'|'mild'|'spicy';sound:boolean;motion:boolean};
export type Observation={count:number;runs:string[];practised:boolean};
export type Miss={recovery:number};
export type Attempt={questionId:string;selection:string|null;hint:boolean;outcome:'correct'|'wrong'|'skip'|'blocked';xp:number;jokeIndex?:number};
export type Session={id:string;mode:Mode;chapter?:string;ids:string[];orders:Record<string,string[]>;index:number;selected:Record<string,string>;hints:string[];attempts:Attempt[];retryIds:string[];streak:number;hearts:number;xp:number;done:boolean;deadline?:number;continued:boolean;started:number};
export type Profile={version:1;bankVersion:string;xp:number;rewarded:string[];settings:Settings;mistakes:Record<string,Miss>;observations:Record<string,Observation>;bookmarks:string[];active:Session|null;recentJokes:number[]};
export const initialProfile=():Profile=>({version:1,bankVersion:bank.bankVersion,xp:0,rewarded:[],settings:{name:'Rondo',roast:'mild',sound:false,motion:true},mistakes:{},observations:{},bookmarks:[],active:null,recentJokes:[]});
export function shuffle<T>(items:T[],rng:()=>number=Math.random):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createSession(p:Profile,mode:Mode,chapter?:string,topics:string[]=[],rng= Math.random,now=Date.now()):Session{
 let pool=questions.filter(q=>gradable(q)&&(!chapter||q.chapter===chapter)&&(!topics.length||q.topics.some(t=>topics.includes(t))));
 if(mode==='rematch')pool=pool.filter(q=>p.mistakes[q.id]);
 const chosen=mode==='exam'?questions:shuffle(pool,rng).slice(0,mode==='boss'?5:10);
 return {id:crypto.randomUUID(),mode,chapter,ids:chosen.map(q=>q.id),orders:Object.fromEntries(chosen.map(q=>[q.id,(mode==='exam'?q.options:shuffle(q.options,rng)).map(o=>o.id)])),index:0,selected:{},hints:[],attempts:[],retryIds:[],streak:0,hearts:3,xp:0,done:chosen.length===0,deadline:mode==='exam'?now+3600000:undefined,continued:false,started:now};
}
export function multiplier(streak:number){return Math.min(3,1+Math.floor((streak-1)/3));}
export function firstAttempts(s:Session){return s.attempts.filter((a,i,all)=>all.findIndex(b=>b.questionId===a.questionId)===i);}
export function stats(s:Session){const a=firstAttempts(s);return {correct:a.filter(a=>a.outcome==='correct').length,submitted:a.filter(a=>a.outcome==='correct'||a.outcome==='wrong').length,unaided:a.filter(a=>a.outcome==='correct'&&!a.hint).length,skips:a.filter(a=>a.outcome==='skip').length,retries:s.attempts.length-a.length};}
function observe(p:Profile,id:string,correct:boolean,hint:boolean,run:string){
 const o=p.observations[id]??{count:0,runs:[],practised:false};o.practised=true;
 if(!correct){o.count=0;o.runs=[];p.mistakes[id]={recovery:0};}
 else if(!hint){if(!o.runs.includes(run)){o.count=Math.min(2,o.count+1);o.runs.push(run);}if(p.mistakes[id]){p.mistakes[id].recovery++;if(p.mistakes[id].recovery>=2)delete p.mistakes[id];}}
 p.observations[id]=o;
}
export function submit(p:Profile,skip=false):Profile{
 if(!p.active||p.active.done||p.active.mode==='exam')return p;
 const s0=p.active;if(s0.attempts.length>s0.index)return p;
 const id=s0.ids[s0.index],q=byId[id],choice=s0.selected[id];if(!skip&&!choice&&gradable(q))return p;
 const next=structuredClone(p),s=next.active!;const hint=s.hints.includes(id);const correct=choice===q.answerOptionId;
 let outcome:Attempt['outcome']=!gradable(q)?'blocked':skip?'skip':correct?'correct':'wrong';let xp=0;
 if(outcome==='correct'){
  if(!hint)s.streak++;if(!next.rewarded.includes(id)){xp=hint?50:100*multiplier(s.streak);next.rewarded.push(id);}observe(next,id,true,hint,s.id);
 }else if(outcome==='wrong'){s.streak=0;s.hearts=Math.max(0,s.hearts-1);observe(next,id,false,false,s.id);}else if(outcome==='skip')s.streak=0;
 const pool=outcome==='correct'?Array.from({length:8},(_,i)=>100+i):Array.from({length:13},(_,i)=>i);
 const candidates=pool.filter(i=>!next.recentJokes.slice(-3).includes(i));const jokeIndex=candidates[(q.sourceQuestionNumber+s.attempts.length)%candidates.length];
 if(outcome==='correct'||outcome==='wrong')next.recentJokes=[...next.recentJokes.slice(-2),jokeIndex];
 next.xp+=xp;s.xp+=xp;s.attempts.push({questionId:id,selection:choice??null,hint,outcome,xp,jokeIndex});s.continued=false;
 return next;
}
export function nextQuestion(p:Profile):Profile{
 const original=p.active;if(!original||original.done||original.mode==='exam'||original.attempts.length<=original.index)return p;
 const next=structuredClone(p),s=next.active!;
 // Schedule only once spacing is actually available; otherwise retain the miss for a later run.
 if(s.mode==='rematch'){
  for(const a of s.attempts){if(a.outcome!=='wrong'||s.retryIds.includes(a.questionId))continue;
   const pos=s.attempts.indexOf(a);const intervening=new Set(s.attempts.slice(pos+1).filter(b=>b.questionId!==a.questionId&&['correct','wrong'].includes(b.outcome)).map(b=>b.questionId));
   if(intervening.size>=3){s.ids.push(a.questionId);s.retryIds.push(a.questionId);}
  }
 }
 if(s.index+1>=s.ids.length)s.done=true;else s.index++;return next;
}
export function finalizeExam(p:Profile):Profile{
 if(!p.active||p.active.mode!=='exam'||p.active.done)return p;
 const next=structuredClone(p),s=next.active!;
 s.attempts=s.ids.map(id=>{const q=byId[id],selection=s.selected[id]??null;const outcome=!gradable(q)?'blocked':selection===q.answerOptionId?'correct':selection?'wrong':'skip';if(gradable(q)&&outcome!=='correct')next.mistakes[id]={recovery:0};return {questionId:id,selection,hint:false,outcome,xp:0};});s.done=true;return next;
}
export type Action={type:'start';mode:Mode;chapter?:string;topics?:string[]}|{type:'select';id:string}|{type:'hint'}|{type:'submit';skip?:boolean}|{type:'next'}|{type:'finalize'}|{type:'navigate';index:number}|{type:'settings';settings:Partial<Settings>}|{type:'bookmark';id:string}|{type:'continue'}|{type:'home'}|{type:'restore';profile:Profile};
export function reducer(p:Profile,a:Action):Profile{
 if(a.type==='restore')return a.profile;
 if(a.type==='submit')return submit(p,a.skip);
 if(a.type==='next')return nextQuestion(p);
 if(a.type==='finalize')return finalizeExam(p);
 if(a.type==='start')return {...p,active:createSession(p,a.mode,a.chapter,a.topics)};
 if(a.type==='settings')return {...p,settings:{...p.settings,...a.settings}};
 if(a.type==='bookmark')return {...p,bookmarks:p.bookmarks.includes(a.id)?p.bookmarks.filter(x=>x!==a.id):[...p.bookmarks,a.id]};
 if(a.type==='home')return {...p,active:null};
 const s=p.active;if(!s||s.done)return p;
 if(a.type==='select'&&(s.mode==='exam'||s.attempts.length<=s.index))return {...p,active:{...s,selected:{...s.selected,[s.ids[s.index]]:a.id}}};
 if(a.type==='hint'&&!s.hints.includes(s.ids[s.index])&&s.mode!=='exam'&&s.attempts.length<=s.index)return {...p,active:{...s,hints:[...s.hints,s.ids[s.index]]}};
 if(a.type==='navigate'&&s.mode==='exam')return {...p,active:{...s,index:Math.max(0,Math.min(s.ids.length-1,a.index))}};
 if(a.type==='continue')return {...p,active:{...s,continued:true}};
 return p;
}
