import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { bi, categories, entries, events, gallery, questions } from '../src/content.js';
import { saaralStory } from '../src/saaral-story.js';
import { scoreAnswers } from '../src/quiz.js';

test('published editorial records have English and Tamil content', () => {
  const bilingual = value => {
    if (!value || typeof value !== 'object') return;
    if ('en' in value || 'ta' in value) {
      assert.ok(value.en?.trim(), 'English copy missing');
      assert.ok(value.ta?.trim(), 'Tamil copy missing');
    } else Object.values(value).forEach(bilingual);
  };
  [categories, entries, events, gallery, questions, saaralStory].forEach(bilingual);
});
test('content IDs are unique and references resolve', async () => {
  const all = [...entries, saaralStory];
  assert.equal(new Set(all.map(e => e.id)).size, all.length);
  for (const e of all) {
    assert.ok(categories.some(c => c.id === e.category));
    await access('assets/' + e.art + '.svg');
  }
  for (const g of gallery) await access('assets/' + g.art + '.svg');
});
test('the full Saaral article is preserved and distinguished from samples', () => {
  assert.equal(saaralStory.sample, false);
  assert.equal(saaralStory.sections.length, 6);
  const text = JSON.stringify(saaralStory);
  for (const name of ['Murugesan', 'Prabhakaran', 'Sengadir', 'Rakshagan', 'Lakshana', 'Rajalakshmi', 'Parthiban', 'Nadaswaram', '2004']) assert.ok(text.includes(name), name);
  assert.ok(!text.includes('canvas'));
  assert.equal(events[0].date.en, 'Date to be announced');
});
test('quiz scoring handles partial, correct and incorrect attempts', () => {
  assert.equal(scoreAnswers([], questions), 0);
  assert.equal(scoreAnswers(questions.map(q => q.answer), questions), questions.length);
  assert.equal(scoreAnswers(questions.map(q => (q.answer + 1) % q.options.length), questions), 0);
  assert.equal(scoreAnswers([questions[0].answer], questions), 1);
});
test('question answers are valid choices and explained bilingually', () => {
  for (const q of questions) {
    assert.ok(q.answer >= 0 && q.answer < q.options.length);
    assert.ok(q.explanation.en && q.explanation.ta);
  }
});
test('application renders all public pages, language switching and quiz flow', async () => {
  const listeners = {};
  const fakeElement = () => ({innerHTML:'',focus(){},classList:{remove(){},toggle(){}},setAttribute(){}});
  const app = fakeElement(), panel = fakeElement(), viewer = {...fakeElement(),open:false,addEventListener(){},close(){this.open=false},showModal(){this.open=true}};
  globalThis.document = {
    documentElement: {lang:'en'},body:{},
    querySelector(s){return s==='#app'?app:s==='#viewer'?viewer:s==='#quiz-panel'?panel:fakeElement()},
    addEventListener(name,callback){listeners[name]=callback},
  };
  globalThis.localStorage={getItem(){return null},setItem(){}};
  globalThis.location={pathname:'/'};
  globalThis.history={pushState(_a,_b,path){location.pathname=path}};
  let pop;
  globalThis.window={scrollY:0,scrollTo(){},addEventListener(_name,callback){pop=callback}};
  await import('../src/app.js');
  assert.ok(app.innerHTML.includes('Our roots.'));
  assert.ok(!app.innerHTML.includes('&lt;br&gt;'));
  assert.ok(app.innerHTML.includes('<em>Still growing.</em>'));
  const paths=['/about','/practice','/product','/perspectives','/events','/events/saaral','/archive','/community','/quiz','/perspectives/saaral-story','/practice/kolam','/missing'];
  for(const path of paths){location.pathname=path;pop();assert.ok(app.innerHTML.includes('<main'),path);assert.ok(!app.innerHTML.includes('undefined'),path);}
  location.pathname='/perspectives/saaral-story';pop();
  assert.ok(app.innerHTML.includes('There is no fruit without a root'));
  const clickAction=(action,extra={})=>listeners.click({target:{closest(s){return s==='button'?{dataset:{action,...extra}}:null}}});
  clickAction('language');assert.equal(document.documentElement.lang,'ta');
  assert.ok(app.innerHTML.includes('கல்லூரியின் ஆன்மா'));
  location.pathname='/quiz';pop();clickAction('start-quiz');
  questions.forEach(q=>{clickAction('',{answer:String(q.answer)});assert.ok(panel.innerHTML.includes('quiz-feedback'));clickAction('next-question')});
  assert.ok(panel.innerHTML.includes('5 / 5'));
  clickAction('start-quiz');assert.ok(panel.innerHTML.includes('1 / 5'));
  clickAction('language');assert.equal(document.documentElement.lang,'en');
  location.pathname='/archive';pop();clickAction('',{filter:'craft'});
  assert.ok(app.innerHTML.includes('2 illustrations'));
});
test('Vercel output contains every module and local asset', async () => {
  for(const file of ['index.html','styles.css','src/app.js','src/content.js','src/quiz.js','src/saaral-story.js','assets/basket.svg','assets/flowers.svg','assets/kolam.svg','assets/food.svg','assets/arts.svg','assets/ssn-logo.svg'])await access('dist/'+file);
  const config=JSON.parse(await readFile('vercel.json','utf8'));
  assert.equal(config.outputDirectory,'dist');
});
