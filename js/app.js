/* ============================================
   رستوران‌یار - اپلیکیشن
   طراحی شده توسط محمدعلی بزازی
   ============================================ */

// تبدیل اعداد به فارسی
const toFa = (n) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

// Sparkline bars
document.querySelectorAll('[data-spark]').forEach(el => {
  const values = el.dataset.spark.split(',').map(Number);
  const max = Math.max(...values);
  el.innerHTML = values.map(v => `<i style="height:${(v/max)*100}%"></i>`).join('');
});

// Chart (SVG line chart)
function drawChart() {
  const wrap = document.getElementById('chart');
  if (!wrap) return;
  const days = ['شنبه','یک‌شنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه'];
  const current = [22, 38, 31, 45, 52, 68, 72];
  const previous = [18, 28, 35, 32, 40, 48, 55];

  const w = wrap.clientWidth, h = 240;
  const pad = { t: 20, r: 16, b: 30, l: 36 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const max = 80;

  const x = i => pad.l + (i * innerW) / (days.length - 1);
  const y = v => pad.t + innerH - (v / max) * innerH;

  const toPath = arr => arr.map((v,i)=> `${i===0?'M':'L'}${x(i)},${y(v)}`).join(' ');
  const toArea = arr => toPath(arr) + ` L${x(arr.length-1)},${pad.t+innerH} L${x(0)},${pad.t+innerH} Z`;

  // gridlines
  let grid = '';
  for (let i=0; i<=4; i++) {
    const gy = pad.t + (innerH * i/4);
    grid += `<line x1="${pad.l}" y1="${gy}" x2="${w-pad.r}" y2="${gy}" stroke="rgba(255,255,255,0.05)"/>`;
    grid += `<text x="${pad.l-8}" y="${gy+4}" fill="#5a6478" font-size="10" text-anchor="end">${toFa(Math.round(max - max*i/4))}</text>`;
  }
  let labels = '';
  days.forEach((d,i) => {
    labels += `<text x="${x(i)}" y="${h-10}" fill="#8893a8" font-size="11" text-anchor="middle">${d.slice(0,3)}</text>`;
  });

  // dots
  let dots = '';
  current.forEach((v,i) => {
    dots += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#ff6b35" stroke="#151c2e" stroke-width="2"/>`;
  });

  wrap.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ff6b35" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#ff6b35" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${grid}
      <path d="${toArea(current)}" fill="url(#g1)"/>
      <path d="${toPath(previous)}" stroke="#5a6478" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
      <path d="${toPath(current)}" stroke="#ff6b35" stroke-width="2.5" fill="none"/>
      ${dots}
      ${labels}
    </svg>
  `;
}
drawChart();
window.addEventListener('resize', drawChart);

// Orders table
const orders = [
  { id: '۱۰۲۳۴', name: 'سارا احمدی',     items: 'چلوکباب سلطانی، نوشابه',    table: '۵',  amount: '۴۲۰٬۰۰۰', status: 'cooking',  st: 'در حال آماده‌سازی', time: '۲ دقیقه قبل' },
  { id: '۱۰۲۳۳', name: 'رضا محمودی',     items: 'پیتزا مخصوص، سالاد سزار',   table: '۱۲', amount: '۳۸۵٬۰۰۰', status: 'pending',  st: 'در انتظار',         time: '۵ دقیقه قبل' },
  { id: '۱۰۲۳۲', name: 'مریم کریمی',     items: 'پاستا آلفردو، چیزکیک',      table: '۷',  amount: '۲۹۰٬۰۰۰', status: 'done',     st: 'تحویل شده',         time: '۱۲ دقیقه قبل' },
  { id: '۱۰۲۳۱', name: 'علی نوری',       items: 'برگر گوشت، سیب‌زمینی، کوکا', table: '۳',  amount: '۲۲۵٬۰۰۰', status: 'cooking',  st: 'در حال آماده‌سازی', time: '۱۸ دقیقه قبل' },
  { id: '۱۰۲۳۰', name: 'فاطمه رضایی',   items: 'استیک گوشت، سوپ روز',       table: '۹',  amount: '۵۸۰٬۰۰۰', status: 'pending',  st: 'در انتظار',         time: '۲۲ دقیقه قبل' },
  { id: '۱۰۲۲۹', name: 'حسین صالحی',    items: 'سوشی میکس',                  table: '۱۵', amount: '۴۹۰٬۰۰۰', status: 'done',     st: 'تحویل شده',         time: '۳۰ دقیقه قبل' },
  { id: '۱۰۲۲۸', name: 'نگین تقوی',     items: 'خوراک مرغ، دوغ',             table: '۲',  amount: '۱۸۵٬۰۰۰', status: 'cancel',   st: 'لغو شده',           time: '۴۵ دقیقه قبل' },
];

const eyeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const editSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
const moreSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>';

document.getElementById('ordersBody').innerHTML = orders.map(o => `
  <tr>
    <td><strong>#${o.id}</strong></td>
    <td>${o.name}</td>
    <td style="color:var(--text-muted)">${o.items}</td>
    <td>میز ${o.table}</td>
    <td><strong>${o.amount}</strong> <small style="color:var(--text-muted)">تومان</small></td>
    <td><span class="status ${o.status}">${o.st}</span></td>
    <td style="color:var(--text-muted)">${o.time}</td>
    <td><div class="row-actions"><button title="مشاهده">${eyeSvg}</button><button title="ویرایش">${editSvg}</button><button title="بیشتر">${moreSvg}</button></div></td>
  </tr>
`).join('');

// Sidebar toggle (mobile)
const sidebar = document.getElementById('sidebar');
document.getElementById('menuToggle')?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Nav active state
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    if (window.innerWidth < 768) sidebar.classList.remove('open');
  });
});

// Period switcher
document.querySelectorAll('.period-switch button, .filters .chip').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.querySelectorAll('button, .chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Search shortcut
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.search input')?.focus();
  }
});

console.log('%c رستوران‌یار ', 'background:linear-gradient(135deg,#ff6b35,#ffd166);color:#fff;padding:6px 12px;border-radius:6px;font-weight:bold', 'طراحی شده توسط محمدعلی بزازی');
