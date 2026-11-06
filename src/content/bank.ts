import seed from '../../content/questions.seed.json';
import refs from '../../content/references.json';
export type Question = typeof seed.questions[number];
export const bank = seed;
export const questions = seed.questions;
export const references = refs.references;
export const byId = Object.fromEntries(questions.map(q => [q.id,q])) as Record<string,Question>;
export const gradable = (q: Question) => q.gradingStatus !== 'blocked' && q.answerOptionId !== null;
export const chapters = [
 {id:'foundations',name:'Foundations',boss:'The Commons Goblin',icon:'✳',desc:'Shared planet. Shared responsibility.',color:'mint'},
 {id:'climate',name:'Climate & Solutions',boss:'The Carbon Goblin',icon:'☁',desc:'Turn down the planetary thermostat.',color:'orange'},
 {id:'systems',name:'Systems & SDGs',boss:'The Nexus Hydra',icon:'✺',desc:'Everything is connected. Yes, everything.',color:'purple'},
 {id:'consumption',name:'Consumption & Rebound',boss:'The Jevons Gremlin',icon:'ϟ',desc:'Efficiency has entered the group chat.',color:'blue'},
];
export function validateContent() {
 const errors:string[]=[]; const expected=[1,2,3,4,5,6,7,...Array.from({length:29},(_,i)=>i+18)];
 const pages=[1,1,2,2,2,3,3,4,4,4,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,10,10,11,11,12,12,12,13,13];
 if(questions.length!==36) errors.push('Expected 36 items');
 if(new Set(questions.map(q=>q.id)).size!==36)errors.push('Duplicate IDs');
 questions.forEach((q,i)=>{
  if(q.sourceQuestionNumber!==expected[i]||q.sourcePage!==pages[i])errors.push(`Source mapping Q${q.sourceQuestionNumber}`);
  if(!q.id||!q.stem||!q.explanation||!q.hint||!q.memoryHook||!q.answerBasis||!q.origin||!q.topics.length||!chapters.some(c=>c.id===q.chapter))errors.push(`Missing fields ${q.id}`);
  if(q.options.length!==5||q.options.map(o=>o.id).join('')!=='abcde'||q.options.some(o=>!o.text||!o.explanation))errors.push(`Options ${q.id}`);
  if(!['blocked','provisional','verified'].includes(q.gradingStatus))errors.push(`Status ${q.id}`);
  if([5,6,7,33].includes(q.sourceQuestionNumber)!==(q.gradingStatus==='blocked'))errors.push(`Blocked policy ${q.id}`);
  if(q.gradingStatus==='blocked' ? q.answerOptionId!==null||!q.reviewNotes.length : q.options.filter(o=>o.id===q.answerOptionId).length!==1)errors.push(`Answer ${q.id}`);
  if(q.referenceIds.some(id=>!references.some(r=>r.id===id)))errors.push(`Reference ${q.id}`);
 });
 if(errors.length)throw new Error(errors.join('\n'));
 return {total:questions.length,gradable:questions.filter(gradable).length,blocked:questions.filter(q=>!gradable(q)).length};
}
validateContent();
