import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const bank=JSON.parse(fs.readFileSync(new URL('../content/questions.seed.json',import.meta.url)));
const byId=Object.fromEntries(bank.questions.map(q=>[q.id,q]));
const base=process.env.TEST_URL||'http://127.0.0.1:5173/wi1103-planet-roast/';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1050}});
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const profile=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('planet-roast.profile.v1')));
const click=async(name)=>page.getByRole('button',{name,exact:true}).click();
try{
 await page.goto(base);await page.getByRole('heading',{name:'Save the planet. Survive the syllabus.'}).waitFor();
 await page.screenshot({path:'/tmp/planet-roast-desktop.png',fullPage:true});
 await click('Cram 10 Questions →');
 let p=await profile();assert.equal(p.active.ids.length,10);
 // One deliberately wrong, one hinted, then unaided: finish a real run.
 for(let i=0;i<10;i++){
  p=await profile();const s=p.active,q=byId[s.ids[s.index]];
  const choice=i===0?q.options.find(o=>o.id!==q.answerOptionId).id:q.answerOptionId;
  if(i===1)await click('☼ Need a hint?');
  const index=s.orders[q.id].indexOf(choice);
  if(i===2){await page.getByRole('heading',{name:q.stem}).focus();await page.keyboard.press(String(index+1));await page.keyboard.press('Enter');}
  else{await page.getByRole('button',{name:new RegExp(`^${'ABCDE'[index]} ${q.options.find(o=>o.id===choice).text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}`)}).click();await click('Submit answer →');}
  await page.getByRole('status').filter({has:page.getByRole('heading',{name:/Correct\. Nice work\.|Not quite/})}).waitFor();
  if(i===2){const xp=(await profile()).xp;await page.reload();await page.getByText('✓ Correct. Nice work.').waitFor();assert.equal((await profile()).xp,xp);}
  await click(i===9?'Finish run →':'Next question →');
 }
 await page.getByRole('heading',{name:'Less meltdown. More momentum.'}).waitFor();
 p=await profile();assert.equal(p.active.done,true);assert.equal(Object.keys(p.mistakes).length,1);assert.equal(p.active.attempts.length,10);
 await click('Back to study desk');await page.getByRole('button',{name:/Mistake Rematch 1 concepts waiting/}).click();
 p=await profile();assert.equal(p.active.ids.length,1);const q=byId[p.active.ids[0]],index=p.active.orders[q.id].indexOf(q.answerOptionId);
 await page.getByRole('group',{name:'Answer options'}).getByRole('button').nth(index).click();await click('Submit answer →');await click('Finish run →');assert.equal((await profile()).active.done,true);
 await click('Back to study desk');await page.getByRole('button',{name:/CHAPTER 01/}).click();
 p=await profile();assert.equal(p.active.mode,'boss');assert.equal(p.active.ids.length,5);
 for(let i=0;i<5;i++){p=await profile();const q=byId[p.active.ids[i]],index=p.active.orders[q.id].indexOf(q.answerOptionId);await page.getByRole('group',{name:'Answer options'}).getByRole('button').nth(index).click();await click('Submit answer →');await click(i===4?'Finish run →':'Next question →');}
 await page.getByRole('heading',{name:'Boss defeated. Concepts recovered.'}).waitFor();
 await click('Back to study desk');await page.getByRole('button',{name:/2025 Paper Simulation/}).click();
 p=await profile();assert.equal(p.active.mode,'exam');const deadline=p.active.deadline;const examSession=structuredClone(p.active);
 await page.getByRole('group',{name:'Answer options'}).getByRole('button').nth(1).click();await click('Next →');await click('☆ Bookmark');await page.reload();assert.equal((await profile()).active.deadline,deadline);assert.equal((await profile()).active.index,1);
 await click('Submit paper');await page.getByRole('dialog').getByRole('button',{name:'Submit paper',exact:true}).click();await page.getByRole('heading',{name:'Paper submitted. Now, the useful part.'}).waitFor();
 p=await profile();assert.equal(p.active.attempts.filter(a=>a.outcome==='blocked').length,4);assert.equal(p.active.xp,0);
 await click('Back to study desk');await page.getByRole('button',{name:'▤ Library',exact:true}).click();await page.getByRole('combobox',{name:'Content filter'}).selectOption('issues');assert.equal(await page.locator('.library-list article').count(),4);
 await page.locator('.library-stem').first().click();await page.getByText('Ungraded source issue',{exact:false}).first().waitFor();
 await page.getByRole('button',{name:'⚙ Settings',exact:true}).click();await page.getByLabel('Player name').fill('<b>Rondo</b>');await page.getByLabel('Roast level').selectOption('off');assert.equal((await profile()).settings.roast,'off');assert.equal(await page.locator('b').filter({hasText:'Rondo'}).count(),0);
 await page.getByRole('button',{name:'Reset all progress',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Cancel'}).click();assert.ok((await profile()).xp>0);
 await page.getByRole('button',{name:'▦ Study desk',exact:true}).click();
 await page.setViewportSize({width:360,height:800});await page.screenshot({path:'/tmp/planet-roast-mobile.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
 await click('Cram 10 Questions →');await page.screenshot({path:'/tmp/planet-roast-mobile-question.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
 // Off immediately suppresses feedback jokes, including after reload.
 await page.getByRole('group',{name:'Answer options'}).getByRole('button').first().click();await click('Submit answer →');assert.equal(await page.locator('.joke').count(),0);
 // Expired exam restoration is finalized exactly once.
 await page.evaluate(exam=>{const p=JSON.parse(localStorage.getItem('planet-roast.profile.v1'));p.active={...exam,deadline:1};localStorage.setItem('planet-roast.profile.v1',JSON.stringify(p));},examSession);
 await page.reload();await page.getByRole('heading',{name:'Paper submitted. Now, the useful part.'}).waitFor();assert.equal((await profile()).active.done,true);
 assert.deepEqual(errors,[]);console.log('PASS: desktop/mobile Cram, keyboard, reload, rematch, boss, simulation, library, settings, no overflow or console errors');
}finally{await browser.close();}
