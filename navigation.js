// One task at a time; existing section URLs remain usable.
const viewSections=[...document.querySelectorAll('main > [data-view]')];
const primaryLinks=[...document.querySelectorAll('.app-nav a')];
const primaryIds={today:'today',routes:'routes',prep:'pack',places:'hotels',budget:'budget'};
function showSection(rawId){
 const id=rawId==='plan'?'today':rawId||'today';
 const target=document.getElementById(id)||document.getElementById('today');
 const view=target.closest('[data-view]')?.dataset.view||'today';
 viewSections.forEach(el=>{el.hidden=el.dataset.view!==view||(view==='routes' && el.id!== (id==='map'?'map':'routes'));});
 primaryLinks.forEach(a=>{
  const active=a.hash==='#'+primaryIds[view];
  if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 });
 const fold=target.querySelector(':scope > details.guide-fold');
 if(fold)fold.open=true;
 for(let parent=target.parentElement;parent;parent=parent.parentElement){if(parent.tagName==='DETAILS')parent.open=true;}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
window.showSection=showSection;
window.addEventListener('hashchange',()=>showSection(location.hash.slice(1)));
document.addEventListener('click',event=>{
 const a=event.target.closest('a[href^="#"]');
 if(!a)return;
 const id=a.getAttribute('href').slice(1);
 // Also handles clicking an already selected tab or section.
 showSection(id);
});
showSection(location.hash.slice(1));
