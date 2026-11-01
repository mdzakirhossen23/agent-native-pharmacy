import {upgradeBusiness} from './finance.js';
import initSqlJs from 'sql.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=process.env.PHARMACY_DATA_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../agent-native-pharmacy-private');
const file=path.join(dir,'pharmacy.sqlite'),lock=path.join(dir,'write.lock');
const SQL=await initSqlJs({locateFile:()=>path.join(path.dirname(fileURLToPath(import.meta.url)),'sql-wasm.wasm')});
let queue=Promise.resolve();
export function transaction(fn){const operation=queue.then(async()=>{await fs.mkdir(dir,{recursive:true,mode:0o700});let held=false;for(let i=0;i<100;i++){try{await fs.mkdir(lock);held=true;break}catch(e){if(e.code!=='EEXIST')throw e;try{const stat=await fs.stat(lock);if(Date.now()-stat.mtimeMs>120000){await fs.rmdir(lock);continue}}catch{}await new Promise(r=>setTimeout(r,50))}}if(!held)throw Error('Database busy. Retry shortly.');let db;try{let bytes;try{bytes=await fs.readFile(file)}catch(e){if(e.code!=='ENOENT')throw e}db=bytes?new SQL.Database(bytes):new SQL.Database();db.run('CREATE TABLE IF NOT EXISTS workspaces (id TEXT PRIMARY KEY, data TEXT NOT NULL)');const result=await fn(db);const temp=file+'.tmp-'+process.pid;await fs.writeFile(temp,db.export(),{mode:0o600});await fs.rename(temp,file);return result}finally{db?.close();await fs.rmdir(lock)}});queue=operation.catch(()=>{});return operation}
export function load(db,id){const q=db.prepare('SELECT data FROM workspaces WHERE id=?');q.bind([id]);let data;if(q.step())data=JSON.parse(q.getAsObject().data);q.free();data??={products:[],batches:[],purchases:[],sales:[],drafts:[],audit:[]};upgradeBusiness(data);store(db,id,data);return data}
export function store(db,id,data){db.run('INSERT INTO workspaces(id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data',[id,JSON.stringify(data)])}




