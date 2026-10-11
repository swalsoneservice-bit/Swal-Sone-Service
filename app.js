document.addEventListener("DOMContentLoaded",()=>{
  const toggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
  if(toggle&&nav)toggle.addEventListener("click",()=>nav.classList.toggle("open"));
  const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
});