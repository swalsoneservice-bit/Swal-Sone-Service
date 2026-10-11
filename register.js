(() => {
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const slug = document.body.dataset.event || 'event';
const eventName = document.body.dataset.eventName || 'Event';
const form = $('#registrationForm'), status = $('#formStatus'), formSection = $('#formSection'), summarySection = $('#summarySection'), summaryGrid = $('#summaryGrid'), recordIdInput = $('#recordId');
const studentSelect = $('#student', form), identityInput = $('#identity', form);
const API_URL = window.SSS_CONFIG?.API_URL || '';
const capacityStatus=$('#capacityStatus');
async function loadPublicCapacity(){if(!capacityStatus||slug!=='fun-run'||!API_URL||API_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'))return;try{const r=await fetch(API_URL+'?action=publicSettings');const d=await r.json();if(d.ok){const full=Number(d.funRunLimit)>0&&Number(d.funRunCount)>=Number(d.funRunLimit);capacityStatus.classList.toggle('capacity-warning',full);capacityStatus.setAttribute('role','alert');capacityStatus.textContent=full?`⚠️ Registration is full. The maximum of ${d.funRunLimit} participants has been reached. New registrations are currently closed. Please contact the organizer for assistance.`:(Number(d.funRunLimit)>0?`Registrations: ${d.funRunCount} / ${d.funRunLimit}`:`Registrations open · ${d.funRunCount} registered`);const submit=form.querySelector('button[type=submit]');if(submit){submit.disabled=full;submit.textContent=full?'Registration Closed':'Review summary ↗';submit.title=full?'Registration capacity has been reached.':'';}if(full){const confirm=$('#confirmSubmit');if(confirm){confirm.disabled=true;confirm.title='Registration capacity has been reached.';}}}}catch(_){capacityStatus.textContent='';}}
loadPublicCapacity();
function updateIdentityRequirement(){ if(!studentSelect||!identityInput)return; const isStudent=studentSelect.value==='Yes'; identityInput.required=!isStudent; const label=$('label[for="identity"]',form); if(label)label.textContent=isStudent?'NRC (or) Passport No (optional for students)':'NRC (or) Passport No *'; }
if(studentSelect){studentSelect.addEventListener('change',updateIdentityRequirement);updateIdentityRequirement();}
let current=null;
function getValues(){const data={};$$('[name]',form).forEach(el=>{if(el.name==='recordId')return;if(el.type==='checkbox')data[el.name]=el.checked;else data[el.name]=(el.value||'').trim();});return data;}
function fillForm(data={}){$$('[name]',form).forEach(el=>{if(el.name==='recordId')return;if(el.type==='checkbox')el.checked=!!data[el.name];else el.value=data[el.name]||'';});}
function showStatus(msg,error=false){status.textContent=msg;status.classList.remove('hidden','status-error');if(error)status.classList.add('status-error');}
function renderSummary(data){summaryGrid.innerHTML='';const labels={fullName:'Full Name',identity:'NRC / Passport No',student:'Student',dob:'Date of Birth',fatherName:'Father Name',nationality:'Nationality',gender:'Gender',division:'Division / State',address:'Full Address',email:'Email Address',viber:'Viber Number',mobile:'Mobile Number',emergency:'Emergency Contact',tshirt:'T-Shirt Size',experience:'Experience',category:'Category',itraId:'ITRA-ID',bloodType:'Blood Type',medical:'Medical Conditions',musicTicket:'Ticket Type',quantity:'Quantity',terms:'Terms & Conditions'};Object.entries(data).forEach(([key,value])=>{if(key==='terms'&&value===true)value='Accepted';if(value===false||value===''||value==null)return;const item=document.createElement('div');item.className='summary-item';const small=document.createElement('small');small.textContent=labels[key]||key;const strong=document.createElement('b');strong.textContent=String(value);item.append(small,strong);summaryGrid.append(item);});}
function showSummary(){current=getValues();renderSummary(current);formSection.classList.add('hidden');summarySection.classList.remove('hidden');window.scrollTo({top:formSection.getBoundingClientRect().top+window.scrollY-100,behavior:'smooth'});}
function showForm(){summarySection.classList.add('hidden');formSection.classList.remove('hidden');window.scrollTo({top:formSection.getBoundingClientRect().top+window.scrollY-100,behavior:'smooth'});}
function apiConfigured(){return API_URL && !API_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE');}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;showSummary();});
$('#editInfo').addEventListener('click',showForm);$('#cancelSummary').addEventListener('click',showForm);
$('#confirmSubmit').addEventListener('click',async()=>{
 const data=Object.assign({},current||getValues(),{event:slug,eventName});
 if($('#terms',form)&&!data.terms){showForm();showStatus('Please accept the Terms & Conditions before continuing.',true);return;}
 if(!apiConfigured()){showForm();showStatus('Registration database is not connected yet. Admin must add the Apps Script Web App URL in config.js.',true);return;}
 const button=$('#confirmSubmit');button.disabled=true;button.textContent='Waiting…';const submitStatus=$('#submitStatus');if(submitStatus){submitStatus.textContent='Waiting — your registration is being submitted.';submitStatus.classList.remove('hidden','status-error');}
 try{
   const response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'register',data})});
   const result=await response.json();if(!result.ok){const message=result.error||'Could not save registration';if(/full|capacity|limit|maximum/i.test(message)){showForm();showStatus('⚠️ Registration is full. The participant limit has been reached, so new registrations are currently closed. Please contact the organizer.',true);await loadPublicCapacity();return;}throw new Error(message);}
   summarySection.classList.add('hidden');formSection.classList.remove('hidden');form.reset();recordIdInput.value='';updateIdentityRequirement();
   const successMessage='Successful — your registration has been submitted. Registration ID: '+result.id+'. Please keep it for your records.';showStatus(successMessage);if(submitStatus){submitStatus.textContent=successMessage;submitStatus.classList.remove('hidden','status-error');}loadPublicCapacity();$('#savedId').textContent=result.id;$('#savedPanel').classList.remove('hidden');$('#savedPanel').scrollIntoView({behavior:'smooth',block:'center'});
 }catch(err){showForm();showStatus('Could not submit registration: '+err.message+'. Please try again or contact the organizer.',true);const submitStatus=$('#submitStatus');if(submitStatus){submitStatus.textContent='Submission failed: '+err.message;submitStatus.classList.remove('hidden');submitStatus.classList.add('status-error');}}
 finally{button.disabled=false;button.textContent='Confirm & Submit';}
});
$('#newRegistration').addEventListener('click',()=>{$('#savedPanel').classList.add('hidden');form.reset();recordIdInput.value='';current=null;updateIdentityRequirement();showForm();showStatus('Ready for a new registration.');});
const loadBtn=$('#loadRecord');if(loadBtn){loadBtn.disabled=true;loadBtn.title='Participants should contact the organizer to request changes. Admin can edit records in admin.html.';loadBtn.addEventListener('click',()=>showStatus('For registration changes, please contact the event organizer. Admin can edit records from the secure Admin page.',true));}
})();
