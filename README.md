# 曼谷 / 芭提雅国庆行程

2026年10月2日至7日，GitHub Pages 静态旅游攻略。

在线地址：https://rayhlw.github.io/bangkok-trip-2026/

## 修改内容

- `dist/trip-data.js`：每天的主行程、可替换去处、已订酒店、地点地址与分段交通。所有行程内容由这里统一读取。
- `dist/app.js`：日期筛选、表格渲染、统一地点详情窗口、地图和地址复制。
- `dist/style.css`：唯一一套页面样式，桌面与手机共用结构。
- `dist/index.html`：页面骨架和简短出行提示。

已确认的酒店：10/2–4 A-ONE Bangkok；10/4–5 PAYAA Pattaya；10/5–6 Metropole Bangkok。6日晚去BKK，7日02:00起飞。

## 本地检查和发布

```sh
python3 -m http.server 4173 --directory dist
node tests/trip.test.cjs
node --check dist/app.js
node --check dist/trip-data.js
git diff --check
```

提交所有修改到 main 后运行 `sh publish.sh`。脚本推送 main，再把 dist 的子树发布到 gh-pages。确认 GitHub Pages 构建成功后读回在线文件。

不使用 GitHub Actions，不需要 AWS，也不需要每次重新申请域名。地图使用 Google，是否能加载取决于访问者网络。

设计与验证记录见 `docs/refactor-2026-09-15.md`。
