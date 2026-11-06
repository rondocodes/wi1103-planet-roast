import {initialProfile,finalizeExam,type Profile} from '../game/engine';
import {bank,byId,gradable} from '../content/bank';
export const STORAGE_KEY='planet-roast.profile.v1';
const object=(x:unknown):x is Record<string,any>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x:unknown)=>Number.isSafeInteger(x)&&Number(x)>=0;
const ids=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(i=>typeof i==='string'&&Object.hasOwn(byId,i));
export function parseProfile(text:string):Profile{
 if(text.length>2000000)throw new Error('File too large');
 const p:unknown=JSON.parse(text);
 if(!object(p)||p.version!==1||p.bankVersion!==bank.bankVersion||!integer(p.xp)||!ids(p.rewarded)||!ids(p.bookmarks)||!object(p.settings)||typeof p.settings.name!=='string'||p.settings.name.length>40||!['off','mild','spicy'].includes(p.settings.roast)||typeof p.settings.sound!=='boolean'||typeof p.settings.motion!=='boolean'||!object(p.mistakes)||!object(p.observations)||!Array.isArray(p.recentJokes)||!p.recentJokes.every(integer))throw new Error('Invalid or incompatible progress file');
 for(const [id,m] of Object.entries(p.mistakes))if(!Object.hasOwn(byId,id)||!gradable(byId[id])||!object(m)||!integer(m.recovery)||m.recovery>1)throw new Error('Invalid mistake');
 for(const [id,o] of Object.entries(p.observations))if(!Object.hasOwn(byId,id)||!gradable(byId[id])||!object(o)||!integer(o.count)||o.count>2||!Array.isArray(o.runs)||!o.runs.every((r:unknown)=>typeof r==='string')||typeof o.practised!=='boolean')throw new Error('Invalid observation');
 const s=p.active;
 if(s!==null){
  if(!object(s)||typeof s.id!=='string'||!['cram','boss','rematch','exam'].includes(s.mode)||!ids(s.ids)||(!s.ids.length&&!(s.mode==='rematch'&&s.done))||s.ids.length>40||!integer(s.index)||s.index>=Math.max(1,s.ids.length)||!object(s.orders)||!object(s.selected)||!ids(s.hints)||!ids(s.retryIds)||!Array.isArray(s.attempts)||s.attempts.length>s.ids.length||!integer(s.streak)||!integer(s.hearts)||s.hearts>3||!integer(s.xp)||typeof s.done!=='boolean'||typeof s.continued!=='boolean'||!integer(s.started))throw new Error('Invalid session');
  for(const id of s.ids)if(!Array.isArray(s.orders[id])||[...s.orders[id]].sort().join('')!=='abcde')throw new Error('Invalid option order');
  for(const [id,choice]of Object.entries(s.selected))if(!s.ids.includes(id)||!byId[id].options.some(o=>o.id===choice))throw new Error('Invalid selection');
  for(const [i,a] of s.attempts.entries())if(!object(a)||a.questionId!==s.ids[i]||!(a.selection===null||byId[a.questionId].options.some(o=>o.id===a.selection))||typeof a.hint!=='boolean'||!['correct','wrong','skip','blocked'].includes(a.outcome)||!integer(a.xp))throw new Error('Invalid attempt');
  if(s.mode==='exam'&&(!integer(s.deadline)||s.ids.join()!==bank.questions.map(q=>q.id).join()))throw new Error('Invalid exam');
  if(s.mode!=='exam'&&s.ids.some((id:string)=>!gradable(byId[id])))throw new Error('Invalid practice item');
  if(s.mode!=='exam'&&(s.attempts.length<s.index||s.attempts.length>s.index+1))throw new Error('Invalid attempt cursor');
 }
 return p as Profile;
}
export function load(storage?:Pick<Storage,'getItem'>):{profile:Profile;warning:string}{
 try{const raw=(storage??window.localStorage).getItem(STORAGE_KEY);const p=raw?parseProfile(raw):initialProfile();return {profile:p.active?.mode==='exam'&&!p.active.done&&Date.now()>=p.active.deadline!?finalizeExam(p):p,warning:''};}
 catch{return {profile:initialProfile(),warning:'Saved progress could not be loaded. You can still play in memory; export progress before leaving.'};}
}
export function save(p:Profile,storage?:Pick<Storage,'setItem'>){try{(storage??window.localStorage).setItem(STORAGE_KEY,JSON.stringify(p));return true;}catch{return false;}}
