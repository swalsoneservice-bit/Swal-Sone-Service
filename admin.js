(() => {
// Demo-only password: client-side checks are not secure for real participant data.
const ADMIN_PASSWORD = "ChangeMe2026!";
const STORE_KEY = "sss_event_registrations_v1";
const $ = (id) => document.getElementById(id);
const loginPanel = $("loginPanel"), dashboard = $("dashboard"), editorPanel = $("editorPanel");
let editingId = null;
function readAll(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return []}}
function writeAll(rows){localStorage.setItem(STORE_KEY,JSON.stringify(rows))}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){
 const rows=readAll();$("recordCount").textContent=`${rows.length} registration(s)`;const tbody=$("adminRows");tbody.innerHTML="";
 rows.slice().reverse().forEach(r=>{const tr=document.createElement("tr");
  [r.eventName||r.event||"",r.id||"",r.fullName||"",r.student||"",r.identity||"",r.category||r.musicTicket||"",r.mobile||"",r.createdAt?new Date(r.createdAt).toLocaleString():""].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td)});
  const actionTd=document.createElement("td"), actions=document.createElement("div");actions.className="row-actions";const edit=document.createElement("button");edit.type="button";edit.className="btn btn-outline";edit.textContent="Edit";edit.addEventListener("click",()=>openEditor(r.id));actions.appendChild(edit);actionTd.appendChild(actions);tr.appendChild(actionTd);tbody.appendChild(tr);
 });$("emptyState").classList.toggle("hidden",rows.length>0);
}
function openEditor(id){
 const row=readAll().find(r=>r.id===id);if(!row)return;editingId=id;$("editFields").innerHTML="";$("editorTitle").textContent=`Edit ${row.fullName||"registration"}`;$("editorSubtitle").textContent=`Registration ID: ${row.id} · ${row.eventName||row.event||"Event"}`;
 const excluded=new Set(["id","event","eventName","createdAt","updatedAt"]);
 Object.entries(row).filter(([key])=>!excluded.has(key)).forEach(([key,value])=>{
  const wrap=document.createElement("label");wrap.className="edit-field";const caption=document.createElement("span");caption.textContent=key.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase());wrap.appendChild(caption);
  let input;
  if(typeof value==="boolean") {input=document.createElement("input");input.type="checkbox";input.checked=value;input.name=key;input.style.width="auto";}
  else if(key==="medical"||key==="address"||key==="experience"||key==="terms") {input=document.createElement("textarea");input.name=key;input.value=value??"";}
  else {input=document.createElement("input");input.type="text";input.name=key;input.value=value??"";}
  wrap.appendChild(input);$("editFields").appendChild(wrap);
 });$("editStatus").textContent="";editorPanel.classList.remove("hidden");editorPanel.scrollIntoView({behavior:"smooth",block:"start"});
}
$("loginForm").addEventListener("submit",e=>{e.preventDefault();if($("password").value===ADMIN_PASSWORD){loginPanel.classList.add("hidden");dashboard.classList.remove("hidden");$("loginError").classList.add("hidden");$("password").value="";render()}else{$("loginError").classList.remove("hidden");$("password").select()}});
$("logout").addEventListener("click",()=>{dashboard.classList.add("hidden");loginPanel.classList.remove("hidden");editorPanel.classList.add("hidden");$("password").value=""});
$("editRecordForm").addEventListener("submit",e=>{e.preventDefault();if(!editingId)return;const rows=readAll(),idx=rows.findIndex(r=>r.id===editingId);if(idx<0){$("editStatus").textContent="Registration not found.";return;}const updates={};new FormData(e.currentTarget).forEach((v,k)=>updates[k]=String(v).trim());e.currentTarget.querySelectorAll('input[type="checkbox"]').forEach(el=>updates[el.name]=el.checked);rows[idx]={...rows[idx],...updates,updatedAt:new Date().toISOString()};writeAll(rows);editorPanel.classList.add("hidden");editingId=null;render();alert("Registration updated successfully.");});
$("cancelEdit").addEventListener("click",()=>{editorPanel.classList.add("hidden");editingId=null});
$("exportCsv").addEventListener("click",()=>{const rows=readAll();if(!rows.length){alert("No registrations to export.");return}const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];const csv=[keys,...rows.map(r=>keys.map(k=>r[k]===undefined?"":r[k]))].map(line=>line.map(v=>{const x=String(v??"");return /[",\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x}).join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="swal-sone-all-registrations.csv";a.click();URL.revokeObjectURL(url)});
})();
