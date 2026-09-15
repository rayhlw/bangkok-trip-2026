// One continuous document. Extra reference material stays below the itinerary.
const main=document.querySelector('main');
const references=document.createElement('details');references.id='references';references.className='reference-drawer';
const title=document.createElement('summary');title.textContent='想看更多：地点地图与吃喝玩乐备选';references.append(title);
const content=document.createElement('div');content.className='reference-content';references.append(content);
[...main.children].filter(el=>el.id!=='today'&&el.tagName!=='FOOTER').forEach(el=>{el.hidden=false;content.append(el);});
main.insertBefore(references,main.querySelector('footer'));
function showSection(rawId){
 const id=rawId==='plan'?'today':rawId||'today';
 const target=document.getElementById(id)||document.getElementById('today');
 if(target.classList.contains('journey-day'))selectDay(id.slice(4));
 for(let parent=target.parentElement;parent;parent=parent.parentElement){if(parent.tagName==='DETAILS')parent.open=true;}
 const fold=target.querySelector(':scope > details.guide-fold');if(fold)fold.open=true;
 requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
window.showSection=showSection;
window.addEventListener('hashchange',()=>showSection(location.hash.slice(1)));
document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(a)showSection(a.hash.slice(1));});
if(location.hash)showSection(location.hash.slice(1));
