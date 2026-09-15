// Name searches avoid treating approximate planning coordinates as verified entrances.
let mapProvider='amap';
try{mapProvider=localStorage.getItem('trip-map-provider')==='google'?'google':'amap';}catch{}
let selectedPlace='Siam Square Bangkok';
function mapSearch(query,provider=mapProvider,embedded=false){
 if(provider==='google')return embedded?'https://maps.google.com/maps?'+new URLSearchParams({q:query,output:'embed',hl:'zh-CN'}):'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query});
 return 'https://uri.amap.com/search?'+new URLSearchParams({keyword:query,view:'map',src:'bangkok-trip-2026',callnative:embedded?'0':'1'});
}
function providerControls(){
 document.querySelectorAll('[data-provider]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.provider===mapProvider)));
}
function updatePlaceMap(query=selectedPlace){
 selectedPlace=query;
 const frame=document.getElementById('trip-map');
 frame.src=mapSearch(query,mapProvider,true);frame.title=(mapProvider==='amap'?'高德':'Google')+' 地点搜索：'+query;
 document.getElementById('map-label').textContent='当前地点：'+query;
 const open=document.getElementById('open-place-map');open.href=mapSearch(query);open.textContent=(mapProvider==='amap'?'高德':'Google')+' 打开地点 ↗';
}
function adaptMapLinks(){
 document.querySelectorAll('a[href]').forEach(a=>{
  if(a.id==='open-place-map'||a.id==='daily-hotel-link'||a.dataset.routeNav)return;
  if(!a.dataset.googleMap && /https:\/\/www.google.com\/maps\/(search|dir)\//.test(a.href))a.dataset.googleMap=a.href;
  if(!a.dataset.googleMap)return;
  const url=new URL(a.dataset.googleMap),q=url.searchParams.get('query')||url.searchParams.get('destination');
  if(!q)return;
  const next=mapProvider==='google'?a.dataset.googleMap:mapSearch(q);
  if(a.href!==next)a.href=next;
  if(!a.dataset.mapLabel)a.dataset.mapLabel=a.textContent;
  const label=a.dataset.mapLabel.replace(/Google Maps|Google 地图|Google地图/g,mapProvider==='amap'?'高德地图':'Google 地图');
  if(a.textContent!==label)a.textContent=label;
 });
}
function setMapProvider(provider){
 mapProvider=provider;try{localStorage.setItem('trip-map-provider',provider);}catch{}
 const previousLeg=document.getElementById('route-leg-select').value;
 providerControls();renderRoute(activeRoute);if(previousLeg!=='')showRouteLeg(Number(previousLeg));updatePlaceMap();renderDashboard();adaptMapLinks();
}
document.addEventListener('click',event=>{const b=event.target.closest('[data-provider]');if(b)setMapProvider(b.dataset.provider);});
document.addEventListener('DOMContentLoaded',()=>{
 providerControls();updatePlaceMap();adaptMapLinks();
 new MutationObserver(adaptMapLinks).observe(document.querySelector('main'),{childList:true,subtree:true});
});
