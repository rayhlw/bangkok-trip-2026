'use strict';
const { days, places, legs } = window.TRIP;
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = (base, params) => base + new URLSearchParams(params).toString();
const searchURL = (address) => external('https://www.google.com/maps/search/?', { api: '1', query: address });
const routeURL = (leg) => external('https://www.google.com/maps/dir/?', { api: '1', origin: places[leg.from].address, destination: places[leg.to].address, travelmode: leg.mode });
function placeButton(id, label, leg) {
  return `<button type="button" class="place-link" data-place="${escapeHTML(id)}" ${leg ? `data-leg="${escapeHTML(leg)}"` : ''}>${escapeHTML(label || places[id].name)}<span aria-hidden="true"> ↗</span></button>`;
}
function renderRows(rows) {
  return rows.map(row => `<tr>
    <th scope="row">${escapeHTML(row.time)}</th>
    <td><div class="row-title">${row.place ? placeButton(row.place, row.title, row.leg) : escapeHTML(row.title)}${row.optional ? '<span class="optional">可选</span>' : ''}</div>
    <p>${escapeHTML(row.note)}</p>
    ${row.leg ? `<p class="transit">${escapeHTML(legs[row.leg].text)}</p>` : ''}
    ${row.extra ? `<p class="extra-place">相关地点：${placeButton(row.extra)}</p>` : ''}</td>
  </tr>`).join('');
}
function render() {
  $('#day-nav').innerHTML = '<button type="button" data-day="all" aria-pressed="true">全部<span>行程</span></button>' + days.map((d) => `<button type="button" data-day="${d.date}" aria-pressed="false">${Number(d.date.slice(5,7))}/${Number(d.date.slice(8))}<span>${d.week}</span></button>`).join('');
  $('#days').innerHTML = days.map((d,index) => `<section class="day" id="day-${d.date}" data-date="${d.date}" aria-labelledby="title-${d.date}">
    <header class="day-heading"><span class="day-number">${String(index+1).padStart(2,'0')}</span><div><p class="day-date">10月${Number(d.date.slice(8))}日 · ${d.week}</p><h2 id="title-${d.date}">${escapeHTML(d.title)}</h2></div></header>
    <p class="day-note">${escapeHTML(d.note)}</p>
    ${d.hotel ? `<p class="stay"><span>住宿</span>${placeButton(d.hotel)}<small>${escapeHTML(d.stay)}</small></p>` : ''}
    <table class="itinerary"><caption class="sr-only">${d.date} 行程安排</caption><thead><tr><th scope="col">时间</th><th scope="col">安排</th></tr></thead><tbody>${renderRows(d.rows)}</tbody></table>
    ${d.options.length ? `<details class="alternatives"><summary>当天备选与餐厅 <span>按兴趣替换，不必全去</span></summary><table class="itinerary"><caption class="sr-only">${d.date} 备选去处与餐厅</caption><tbody>${renderRows(d.options)}</tbody></table></details>` : ''}
  </section>`).join('');
}
function selectDay(date, updateURL = true) {
  const selected = days.some(d => d.date === date) ? date : 'all';
  document.querySelectorAll('[data-date]').forEach(section => { section.hidden = selected !== 'all' && section.dataset.date !== selected; });
  document.querySelectorAll('[data-day]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.day === selected)));
  if (updateURL) history.replaceState(null, '', selected === 'all' ? '#plan' : '#day-' + selected);
}
// One detail dialog is shared by every place, hotel and transport row.
let selectedAddress = '';
function openPlace(id, legKey) {
  const place = places[id];
  if (!place) return;
  const leg = legs[legKey];
  selectedAddress = place.address;
  $('#place-title').textContent = place.name;
  $('#place-detail').textContent = place.detail || '按完整地点名称查询，出发前核对分店、入口与营业情况。';
  $('#place-address').textContent = place.address;
  $('#place-kind').textContent = leg ? '地点与交通' : '地点详情';
  $('#place-route').hidden = !leg;
  $('#place-route').textContent = leg ? `${places[leg.from].name} → ${places[leg.to].name} · ${leg.text}` : '';
  $('#google-open').href = leg ? routeURL(leg) : searchURL(place.address);
  $('#source-open').hidden = !place.source;
  if (place.source) $('#source-open').href = place.source;
  else $('#source-open').removeAttribute('href');
  $('#place-map').src = leg ? (leg.embed || external('https://maps.google.com/maps?', { saddr: places[leg.from].address, daddr: places[leg.to].address, dirflg: leg.mode === 'walking' ? 'w' : 'd', output: 'embed', hl: 'zh-CN' })) : external('https://maps.google.com/maps?', { q: place.address, output: 'embed', hl: 'zh-CN' });
  $('#place-map').title = leg ? `Google 路线：${places[leg.from].name}至${place.name}` : `Google 地图：${place.name}`;
  $('#place-dialog').showModal();
  document.body.classList.add('dialog-open');
}
let feedbackTimer;
function feedback(text) {
  $('#feedback').textContent = text;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { $('#feedback').textContent = ''; }, 2200);
}
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    feedback('已复制');
  } catch {
    feedback('未能自动复制，请长按地址文字复制');
  }
}
function updateStatus(now = new Date()) {
  const outbound = new Date('2026-10-02T12:45:00+08:00');
  const arrival = new Date('2026-10-07T05:55:00+08:00');
  const thaiDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year:'numeric',month:'2-digit',day:'2-digit' }).format(now);
  if (now < outbound) $('#trip-status').textContent = `距出发还有 ${Math.round((Date.UTC(2026,9,2)-Date.parse(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)+'T00:00:00Z'))/86400000)} 天 · 10/2–3曼谷，10/4芭提雅，10/5回曼谷`;
  else if (now < arrival) $('#trip-status').textContent = `泰国当地 ${thaiDate} · 10/6晚上去机场，10/7凌晨返程`;
  else $('#trip-status').textContent = '行程已结束 · 可以继续查看全部安排';
}
render();
updateStatus();
const fromHash = () => selectDay(location.hash.replace('#day-', ''), false);
fromHash();
window.addEventListener('hashchange', fromHash);
setInterval(updateStatus, 60000);
$('#day-nav').addEventListener('click', event => {
  const button = event.target.closest('[data-day]');
  if (!button) return;
  selectDay(button.dataset.day);
  $('#day-nav').scrollIntoView({ block: 'start', behavior: 'instant' });
});
$('#days').addEventListener('click', event => {
  const button = event.target.closest('[data-place]');
  if (button) openPlace(button.dataset.place, button.dataset.leg);
});
$('#close-dialog').addEventListener('click', () => $('#place-dialog').close());
$('#place-dialog').addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  $('#place-map').removeAttribute('src');
});
$('#place-dialog').addEventListener('click', event => {
  if (event.target !== $('#place-dialog')) return;
  const r = event.target.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close();
});
$('#copy-address').addEventListener('click', () => copy(selectedAddress));
$('#share-page').addEventListener('click', () => copy(location.href));
