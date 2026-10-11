(() => {
// Change this demo password before publishing. Client-side passwords are NOT secure.
const ADMIN_PASSWORD = "ChangeMe2026!";
const STORE_KEY = "sss_event_registrations_v1";
const $ = (id) => document.getElementById(id);
const loginPanel = $("loginPanel"), dashboard = $("dashboard");
function readAll(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return []}}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){const rows=readAll();$("recordCount").textContent=`${rows.length} registration(s)`;const tbody=$("adminRows");tbody.innerHTML="";rows.slice().reverse().forEach(r=>{const tr=document.createElement("tr");[r.eventName||r.event||"",r.id||"",r.fullName||"",r.student||"",r.identity||"",r.category||r.musicTicket||"",r.mobile||"",r.createdAt?new Date(r.createdAt).toLocaleString():""].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td)});tbody.appendChild(tr)});$("emptyState").classList.toggle("hidden",rows.length>0)}
$("loginForm").addEventListener("submit",e=>{e.preventDefault();if($("password").value===ADMIN_PASSWORD){loginPanel.classList.add("hidden");dashboard.classList.remove("hidden");$("loginError").classList.add("hidden");$("password").value="";render()}else{$("loginError").classList.remove("hidden");$("password").select()}});
$("logout").addEventListener("click",()=>{dashboard.classList.add("hidden");loginPanel.classList.remove("hidden");$("password").value=""});
$("exportCsv").addEventListener("click",()=>{const rows=readAll();if(!rows.length){alert("No registrations to export.");return}const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];const csv=[keys,...rows.map(r=>keys.map(k=>r[k]===undefined?"":r[k]))].map(line=>line.map(v=>{const x=String(v??"");return /[",\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x}).join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="swal-sone-all-registrations.csv";a.click();URL.revokeObjectURL(url)});
})();