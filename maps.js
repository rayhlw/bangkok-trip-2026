// Google only. Search by full names/addresses, not approximate entrance coordinates.
const mapProvider='google';
let selectedPlace='Siam Square Bangkok';
function mapSearch(query,provider='google',embedded=false){
 return embedded?'https://maps.google.com/maps?'+new URLSearchParams({q:query,output:'embed',hl:'zh-CN'}):'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query});
}
function updatePlaceMap(query=selectedPlace){
 selectedPlace=query;
 const frame=document.getElementById('trip-map');
 frame.src=mapSearch(query,'google',true);frame.title='Google 地点搜索：'+query;
 document.getElementById('map-label').textContent='当前地点：'+query;
 const open=document.getElementById('open-place-map');open.href=mapSearch(query);open.textContent='直接打开 Google 地图 ↗';
}
document.addEventListener('DOMContentLoaded',()=>updatePlaceMap());
