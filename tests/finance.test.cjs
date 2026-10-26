const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const box={};vm.createContext(box);vm.runInContext(script.slice(0,script.indexOf('function parseCSV'))+';this.api={DEFAULT,simulate,irr,validate};',box);
const {DEFAULT,simulate,irr,validate}=box.api;
const clone=x=>JSON.parse(JSON.stringify(x));
let checks=0;
function close(a,b){assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),`${a} != ${b}`);checks++}
function plan(){const p=clone(DEFAULT);Object.assign(p,{reserve:false,initial:10000,annual:0,years:1,inflation:0,growth:0});p.assets.forEach((a,i)=>Object.assign(a,{q:i===0?100:0,r:0,c:0,stamp:0,entry:0,tax:26,mode:'final'}));return p}
{
 const p=plan();p.assets[0].r=10;close(simulate(p).last.net,10740);close(irr(simulate(p)),.074);
 p.assets[0].stamp=.2;const z=simulate(p).last;close(z.stamp,22);close(z.net,10718);close(z.paid+z.finalTax,260);close(z.tax,282);assert.ok(z.paid>0);checks++;
 p.assets[0].mode='annual';close(simulate(p).last.net,10740*(1-.002));
 p.assets[0].r=-10;close(simulate(p).last.net,8982);close(simulate(p).last.paid,0);
}
{
 const p=plan();p.assets[0].r=10;p.assets[0].entry=2;p.assets[0].stamp=.2;const z=simulate(p).last;close(z.entry,200);close(z.net,9800*1.1-780*.26-9800*1.1*.002);
 p.assets[0].entry=0;p.assets[0].stamp=0;p.assets[0].c=1;close(simulate(p).last.net,10666);p.assets[0].costIncluded=true;close(simulate(p).last.net,10740);close(simulate(p).last.costs,0);
}
{
 const p=plan();Object.assign(p,{initial:20000,reserve:true,reserveTarget:10000,years:3,inflation:2});p.assets[3].r=5;p.assets[3].mode='annual';const s=simulate(p);for(const row of s.rows)close(row.values[3],10000*1.02**row.t);
 const short=plan();Object.assign(short,{initial:0,annual:6000,reserve:true,reserveTarget:10000,years:2});let r=simulate(short);close(r.rows[0].values[3],6000);close(r.rows[0].values[0],0);close(r.rows[0].reserveGap,4000);close(r.last.values[3],10000);close(r.last.values[0],2000);close(r.last.contrib,12000);
 Object.assign(short,{annual:0});r=simulate(short);close(r.last.net,0);close(r.last.reserveGap,10000);
}
{
 const p=plan();p.years=3;p.assets[0].r=10;p.assets[0].mode='every3';let r=simulate(p);close(r.last.net,10000+3310*.74);close(r.last.finalTax,0);close(r.last.paid,3310*.26);
 p.years=4;r=simulate(p);close(r.last.net,(10000+3310*.74)*1.074);
}
{
 const p=clone(DEFAULT);p.reserve=false;p.assets.forEach((a,i)=>a.q=[40,30,10,20][i]);const base=simulate(p),low=simulate(p,-2),high=simulate(p,2);assert.ok(low.last.net<base.last.net&&base.last.net<high.last.net);checks++;
 for(let i=1;i<4;i++)close(low.last.values[i],high.last.values[i]);
 const r=clone(p);r.reserve=true;r.assets.forEach((a,i)=>a.q=i===3?0:a.q/80*100);assert.equal(validate(r),'');checks++;
 for(const mode of ['final','annual','monthly','daily','every3','every5','every10'])for(const reserve of [false,true])for(const inflation of [-2,0,2,10]){
  const t=clone(reserve?r:p);t.inflation=inflation;t.years=12;t.assets.forEach(a=>a.mode=mode);const s=simulate(t);assert.ok(Number.isFinite(s.last.net)&&s.last.net>=0);checks++;
  for(const z of s.rows){close(z.tax,z.paid+z.finalTax+z.stamp);close(z.taxReal,z.paidReal+z.finalTax/z.def+z.stampReal);close(z.net,z.values.reduce((a,b)=>a+b,0));close(z.real,z.net/z.def)}
 }
}
console.log(`${checks} numerical checks passed`);
