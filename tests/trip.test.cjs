const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/trip-data.js','utf8'), context);
const { days, places, legs } = context.window.TRIP;
assert.deepEqual(Array.from(days,d=>d.date), ['2026-10-02','2026-10-03','2026-10-04','2026-10-05','2026-10-06','2026-10-07']);
assert.deepEqual(Array.from(days.slice(0,4),d=>d.hotel), ['hotel','hotel','photel','mhotel']);
assert.match(places.hotel.address,/9 Soonvijai 4/);
assert.match(places.photel.address,/102\/35/);
assert.match(places.mhotel.address,/2802 Thong Lo/);
assert.match(days[4].rows.at(-1).note,/23:00/);
assert.equal(days[4].rows.at(-1).place,'bkk');
assert.equal(days[5].rows[0].time,'02:00');
assert.match(days[5].rows[0].title,/HX760/);
assert.ok(!days.flatMap(d=>d.rows).some(r=>/包车|上岛|人妖|打枪/.test(r.title)));
// The reference's added venues remain reachable; fixed bookings and prior cancellations win.
const reachable = new Set(days.flatMap(d=>[
  d.hotel, ...[...d.rows,...d.options].flatMap(r=>[r.place,r.extra])
]).filter(Boolean));
for (const id of ['bangluang','paknam','textile','arun','river','bigbuddha','viewpoint','neon',
 'nueng','jaewan','pungdet','somsom','aey','chula','sampeng','mangkon','yaowarat','gaysorn',
 'paor','goang','herehai','wattana','maevaree','kpanich','kolun','kruadusit','thipsamai',
 'thipsamaiicon','somsak','naimong','naiek','patonggo','jekpui','phedmark','polo','somtumder',
 'victorynoodles','savoey','chatramue','jayfai','nusara','potong','rhaan','ledu']) {
 assert.ok(reachable.has(id),`Reference venue has no visible entry: ${id}`);
}
assert.ok(days[1].rows.some(r=>r.place==='paknam' && r.optional));
assert.ok(days[1].options.some(r=>r.place==='arun' && r.extra==='river'));
assert.ok(days[4].options.some(r=>r.place==='yaowarat'));
assert.ok(!days[4].rows.some(r=>['potong','rhaan','ledu','nusara','jayfai'].includes(r.place)),
 'No long tasting dinner or closed Jay Fai on the flight day');
assert.ok(!days.flatMap(d=>[...d.rows,...d.options]).some(r=>/格兰岛|Koh Larn|租泰服|人妖/.test(r.title)));
assert.match(places.jeho.detail,/17:30/);
assert.match(places.herehai.detail,/周一休/);
assert.match(places.kpanich.detail,/芒果糯米饭/);
for (const day of days) for (const row of [...day.rows,...day.options]) {
  if(row.place) assert.ok(places[row.place],`Missing place ${row.place}`);
  if(row.extra) assert.ok(places[row.extra],`Missing extra ${row.extra}`);
  if(row.leg){ assert.ok(legs[row.leg]);assert.equal(legs[row.leg].to,row.place); }
}
for (const leg of Object.values(legs)) {
 assert.ok(places[leg.from] && places[leg.to]);
 if(leg.embed) assert.equal(new URL(leg.embed).hostname,'www.google.com');
}
for (const place of Object.values(places)) {
 assert.ok(place.address);
 if(place.source) assert.equal(new URL(place.source).protocol,'https:');
}
const html = fs.readFileSync('dist/index.html','utf8');
for(const [,file] of html.matchAll(/(?:src|href)="([^"?:]+\.(?:js|css))/g)) assert.ok(fs.existsSync('dist/'+file),file);
assert.ok(!/routes\.js|dashboard\.js|leaflet|navigation\.js/.test(html));
console.log('Trip invariants passed: dates, hotels, return flight, reference coverage, alternatives, all place/route references, and assets.');
