(() => {
const STORE_KEY = "sss_event_registrations_v1";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const readAll = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch { return []; } };
const writeAll = rows => localStorage.setItem(STORE_KEY, JSON.stringify(rows));
const slug = document.body.dataset.event || "event";
const eventName = document.body.dataset.eventName || "Event";
const form = $("#registrationForm");
const status = $("#formStatus");
const formSection = $("#formSection");
const summarySection = $("#summarySection");
const summaryGrid = $("#summaryGrid");
const recordIdInput = $("#recordId");
let current = null;

function makeId(){ return "SSS-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2,8).toUpperCase(); }
function getValues(){ const data={}; $$("[name]",form).forEach(el=>{ if(el.name==="recordId")return; if(el.type==="checkbox")data[el.name]=el.checked; else data[el.name]=(el.value||"").trim(); }); return data; }
function fillForm(data={}){ $$("[name]",form).forEach(el=>{ if(el.name==="recordId")return; if(el.type==="checkbox")el.checked=!!data[el.name]; else el.value=data[el.name]||""; }); }
function showStatus(msg,error=false){ status.textContent=msg;status.classList.remove("hidden","status-error");if(error)status.classList.add("status-error"); }
function renderSummary(data){
  summaryGrid.innerHTML="";
  const labels={fullName:"Full Name",identity:"NRC / Passport No",student:"Student",dob:"Date of Birth",fatherName:"Father Name",nationality:"Nationality",gender:"Gender",division:"Division / State",address:"Full Address",email:"Email Address",viber:"Viber Number",mobile:"Mobile Number",emergency:"Emergency Contact",tshirt:"T-Shirt Size",experience:"Experience",category:"Category",itraId:"ITRA-ID",bloodType:"Blood Type",medical:"Medical Conditions",musicTicket:"Ticket Type",quantity:"Quantity",terms:"Terms & Conditions"};
  Object.entries(data).forEach(([key,value])=>{
    if(key==="terms" && value===true)value="Accepted";
    if(value===false||value===""||value==null)return;
    const item=document.createElement("div");item.className="summary-item";
    const small=document.createElement("small");small.textContent=labels[key]||key;
    const strong=document.createElement("b");strong.textContent=String(value);
    item.append(small,strong);summaryGrid.append(item);
  });
}
function showSummary(){current=getValues();renderSummary(current);formSection.classList.add("hidden");summarySection.classList.remove("hidden");window.scrollTo({top:formSection.getBoundingClientRect().top+window.scrollY-100,behavior:"smooth"});}
function showForm(){summarySection.classList.add("hidden");formSection.classList.remove("hidden");window.scrollTo({top:formSection.getBoundingClientRect().top+window.scrollY-100,behavior:"smooth"});}
function resetForm(){form.reset();recordIdInput.value="";current=null;showForm();showStatus("Ready for a new registration.");}
form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;showSummary();});
$("#editInfo").addEventListener("click",showForm);
$("#cancelSummary").addEventListener("click",showForm);
$("#confirmSubmit").addEventListener("click",()=>{
  const data=current||getValues();
  if($("#terms",form) && !data.terms){showForm();showStatus("Please accept the Terms & Conditions before continuing.",true);return;}
  const rows=readAll();let id=recordIdInput.value;
  if(id){const idx=rows.findIndex(r=>r.id===id);if(idx>=0){rows[idx]={...rows[idx],...data,updatedAt:new Date().toISOString()};}else{id=makeId();rows.push({id,event:slug,eventName,...data,createdAt:new Date().toISOString()});}}
  else{id=makeId();rows.push({id,event:slug,eventName,...data,createdAt:new Date().toISOString()});}
  writeAll(rows);
  summarySection.classList.add("hidden");formSection.classList.remove("hidden");
  form.reset();recordIdInput.value="";
  showStatus(`Saved successfully. Your demo registration ID is ${id}. Keep it to edit your entry later.`);
  $("#savedId").textContent=id;$("#savedPanel").classList.remove("hidden");
  $("#savedPanel").scrollIntoView({behavior:"smooth",block:"center"});
  renderAdmin();
});
$("#newRegistration").addEventListener("click",()=>{ $("#savedPanel").classList.add("hidden");resetForm(); });
$("#loadRecord").addEventListener("click",()=>{
 const id=$("#lookupId").value.trim().toUpperCase();const row=readAll().find(r=>r.id.toUpperCase()===id);
 if(!row){showStatus("No matching registration found in this browser. Check the ID and try again.",true);return;}
 if(row.event!==slug){showStatus(`That ID belongs to ${row.eventName}. Please open that event's profile to edit it.`,true);return;}
 fillForm(row);recordIdInput.value=row.id;showForm();showStatus("Registration loaded. Edit the fields and review the summary before saving.");
});
$("#exportCsv").addEventListener("click",()=>{
 const rows=readAll().filter(r=>r.event===slug);
 if(!rows.length){showStatus("No saved registrations for this event in this browser yet.",true);return;}
 const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];
 const csv=[keys,...rows.map(r=>keys.map(k=>r[k]===undefined?"":r[k]))].map(line=>line.map(v=>{const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(",")).join("\r\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`swal-sone-${slug}-registrations.csv`;a.click();URL.revokeObjectURL(url);
 showStatus(`Exported ${rows.length} registration(s) to CSV.`);
});
function renderAdmin(){
 const body=$("#adminRows");if(!body)return;body.innerHTML="";
 const rows=readAll().filter(r=>r.event===slug);
 $("#recordCount").textContent=rows.length;
 rows.forEach(r=>{const tr=document.createElement("tr");[r.id,r.fullName||"",r.category||r.musicTicket||"",r.mobile||"",new Date(r.createdAt).toLocaleDateString()].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td);});
 const td=document.createElement("td"),btn=document.createElement("button");btn.textContent="Edit";btn.addEventListener("click",()=>{fillForm(r);recordIdInput.value=r.id;showForm();showStatus("Loaded from this browser's demo storage. Make changes and save again.");window.scrollTo({top:0,behavior:"smooth"});});td.append(btn);tr.append(td);body.append(tr);});
 if(!rows.length){const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=6;td.textContent="No local demo registrations yet.";tr.append(td);body.append(tr);}
}
$("#refreshAdmin")?.addEventListener("click",renderAdmin);
$("#clearLookup")?.addEventListener("click",()=>{$("#lookupId").value="";});
renderAdmin();
})();