// The actual Agent-Native definitions live in pharmacy-actions.mjs on the server.
// This transport is deliberately stateless; durable records remain in IndexedDB.
export async function runSharedAction(name,args,state){
 const response=await fetch('api/pharmacy/'+encodeURIComponent(name),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({args,workspaceState:state})});
 const data=await response.json();if(!response.ok)throw Error(data.error||'Action failed');if(data.framework!=='@agent-native/core 0.222.2'||!data.state)throw Error('Reload the app to connect the shared action service');return data;
}
