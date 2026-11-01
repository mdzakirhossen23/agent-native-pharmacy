import assert from 'node:assert/strict';
import {stat} from 'node:fs/promises';const base=process.env.TEST_URL||'http://localhost:8084';let snapshot;async function call(route,args,expect=200){const body=args===undefined?undefined:JSON.stringify({args,workspaceState:snapshot});const response=await fetch(base+route,{method:args===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},body});const data=await response.json();assert.equal(response.status,expect,JSON.stringify(data));if(response.ok){if(route.endsWith('workspace'))snapshot=data;else{assert.equal(data.framework,'@agent-native/core 0.222.2');snapshot=data.state}}return data}

await call('/api/workspace');
const product=(await call('/api/pharmacy/catalog-save',{name:'Test medicine',generic:'Test',strength:'Demo',unit:'tablet',barcode:'TEST-1',price:1250,reorder:10,rx:true,image:''})).result;
const receive={requestId:'purchase-test',supplier:'Test supplier',invoice:'INV-1',items:[{productId:product.id,batch:'LATE',expiry:'2028-12-01',qty:10,cost:500},{productId:product.id,batch:'EARLY',expiry:'2028-01-01',qty:5,cost:600}]};
let d=await call('/api/pharmacy/purchase-receive',receive);assert.equal(d.result.total,8000);assert.equal(d.state.batches.reduce((n,b)=>n+b.qty,0),15);
d=await call('/api/pharmacy/purchase-receive',receive);assert.equal(d.state.batches.reduce((n,b)=>n+b.qty,0),15);
const sale={requestId:'sale-test',items:[{productId:product.id,qty:6}],discount:100,paid:10000,method:'Cash',prescriptionChecked:false};
await call('/api/pharmacy/sale-checkout',sale,400);sale.prescriptionChecked=true;
d=await call('/api/pharmacy/sale-checkout',sale);assert.equal(d.result.total,7400);assert.equal(d.result.change,2600);assert.equal(d.result.cost,3500);assert.equal(d.result.profit,3900);assert.equal(d.result.lines[0].allocations[0].batch,'EARLY');assert.equal(d.state.batches.reduce((n,b)=>n+b.qty,0),9);const receipt=d.result;
d=await call('/api/pharmacy/sale-checkout',sale);assert.equal(d.state.sales.length,1);assert.equal(d.state.batches.reduce((n,b)=>n+b.qty,0),9);
await call('/api/pharmacy/sale-checkout',{...sale,requestId:'oversell',items:[{productId:product.id,qty:500}]},400);
await call('/api/pharmacy/sale-checkout',{...sale,requestId:'bad-discount',discount:999999},400);
d=await call('/api/pharmacy/sale-return',{id:receipt.id,reason:'Test complete return'});assert.equal(d.state.batches.reduce((n,b)=>n+b.qty,0),9);assert.equal(d.state.batches.reduce((n,b)=>n+b.quarantine,0),6);
d=await call('/api/pharmacy/sale-return',{id:receipt.id,reason:'Repeat same return'});assert.equal(d.state.batches.reduce((n,b)=>n+b.quarantine,0),6);
d=await call('/api/pharmacy/reorder-approve',{requestId:'draft-test',items:[{productId:product.id,qty:10,reason:'Low stock'}]});assert.equal(d.state.drafts.length,1);assert.equal(d.state.batches.reduce((n,b)=>n+b.qty,0),9);
await call('/api/pharmacy/purchase-receive',{...receive,requestId:'expired',items:[{productId:product.id,batch:'EXPIRED',expiry:'2020-01-01',qty:3,cost:10}]},400);
const second=await fetch(base+'/api/workspace');assert.equal((await second.json()).products.length,0);
const {context,checkout}=await import('../pharmacy-actions.mjs');const expiredState={products:[{...product,rx:false}],batches:[{id:'expired',productId:product.id,expiry:'2020-01-01',qty:20,cost:10}],purchases:[],sales:[],audit:[],drafts:[]};await assert.rejects(context.run(expiredState,()=>checkout.run({...sale,requestId:'expired-sale',prescriptionChecked:false})));assert.equal(expiredState.batches[0].qty,20);
console.log('PASS shared real-framework bridge: catalogue, purchase totals, purchase idempotency, prescription gate, FEFO, exact totals/profit/change, checkout idempotency, stock limits, discount limits, quarantine returns, return idempotency, AI draft stock isolation, expired receive/sale blocking, workspace isolation.');
