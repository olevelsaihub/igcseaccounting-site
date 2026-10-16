/* Group G03 mastery bank: The trial balance; Petty cash; Capital and revenue expenditure; Depreciation and disposals. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function step(a, b, s) { return s * rint(Math.ceil(a / s), Math.floor(b / s)); }
  // 12880 -> "12,880"; with dp: 110.5 -> "110.50"
  function num(n, dp) {
    var neg = n < 0; n = Math.abs(n);
    var s = dp ? R.roundDp(n, dp).toFixed(dp) : String(Math.round(n));
    var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + p.join('.');
  }
  function money(n, dp) { return (n < 0 ? '-$' : '$') + num(Math.abs(n), dp); }
  function c2(n) { return money(n, 2); }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  // Single-answer item: the correct option first (the engine shuffles), duplicates removed.
  function mcq(q, right, wrong, why) {
    var opts = [right];
    wrong.forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 5) opts.push(w); });
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  // Numeric options: candidates that clash with the answer or each other are replaced by nearby values.
  function moneyMcq(q, right, cands, why, dp) {
    var used = [right], out = [];
    cands.forEach(function (c) { if (c > 0 && used.indexOf(c) < 0) { used.push(c); out.push(c); } });
    var k = 1;
    while (out.length < 3) { var c = right + k * (dp ? 10 : (right > 2000 ? 1000 : 100)); if (c > 0 && used.indexOf(c) < 0) { used.push(c); out.push(c); } k = k > 0 ? -k : -k + 1; }
    return mcq(q, money(right, dp), out.map(function (x) { return money(x, dp); }), why);
  }
  function numQ(q, ans, why, dp) {
    var o = { kind: 'num', q: q, answer: ans, unit: '$', display: num(ans, dp), why: why };
    if (dp) o.tol = 0.005;
    return o;
  }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  // T-account: dr and cr are arrays of [date, details, amount-string]
  function tacct(title, dr, cr) {
    var n = Math.max(dr.length, cr.length), rows = [];
    for (var i = 0; i < n; i++) {
      var d = dr[i] || ['', '', ''], c = cr[i] || ['', '', ''];
      rows.push(d.concat(c));
    }
    return '<b>' + title + '</b> <i>(Dr | Cr)</i>' + table(['Date', 'Details', '$', 'Date', 'Details', '$'], rows);
  }
  var NAMES = ['Amara', 'Bilal', 'Chen Wei', 'Dalia', 'Emeka', 'Farida', 'Gustavo', 'Hana', 'Ishaan', 'Jovana', 'Kwabena', 'Leila', 'Mateo', 'Nadia', 'Oskar', 'Priya', 'Rafael', 'Sana', 'Tariq', 'Umi', 'Valentina', 'Wen', 'Yusuf', 'Zara', 'Ines', 'Kofi', 'Lucia', 'Marek', 'Noor', 'Pita'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // ---------- trial balance builder ----------
  // [name, side, min, max, step]
  var TB_POOL = [
    ['Purchases', 'D', 30000, 110000, 10], ['Wages', 'D', 9000, 38000, 10], ['General expenses', 'D', 2000, 14000, 10],
    ['Drawings', 'D', 6000, 24000, 10], ['Rent and rates', 'D', 3000, 12000, 10], ['Advertising', 'D', 800, 4500, 10],
    ['Insurance', 'D', 600, 3200, 10], ['Motor expenses', 'D', 900, 4800, 10], ['Carriage inwards', 'D', 200, 1400, 10],
    ['Carriage outwards', 'D', 200, 1400, 10], ['Returns inwards', 'D', 300, 2600, 10], ['Discount allowed', 'D', 100, 900, 10],
    ['Irrecoverable debts', 'D', 150, 950, 10], ['Trade receivables ledger control', 'D', 5000, 26000, 10],
    ['Fixtures and fittings – cost', 'D', 6000, 24000, 100], ['Motor vehicles – cost', 'D', 14000, 48000, 100],
    ['Cash', 'D', 100, 800, 10], ['Petty cash', 'D', 50, 300, 10],
    ['Bank loan', 'C', 3000, 20000, 100], ['Trade payables ledger control', 'C', 4000, 22000, 10],
    ['Returns outwards', 'C', 300, 2200, 10], ['Discount received', 'C', 100, 900, 10], ['Rent received', 'C', 600, 4000, 10],
    ['Commission received', 'C', 300, 2500, 10], ['Provision for irrecoverable debts', 'C', 150, 900, 10],
    ['Bank overdraft', 'C', 300, 4000, 10]
  ];
  var TRICKY = ['Bank overdraft', 'Returns outwards', 'Returns inwards', 'Discount received', 'Discount allowed', 'Carriage outwards',
    'Provision for irrecoverable debts', 'Trade payables ledger control', 'Trade receivables ledger control', 'Carriage inwards', 'Commission received'];
  function side(name) {
    if (/provision for depreciation/i.test(name)) return 'C';
    if (/^Inventory at/.test(name) || name === 'Premises') return 'D';
    if (name === 'Revenue' || name === 'Equity') return 'C';
    for (var i = 0; i < TB_POOL.length; i++) if (TB_POOL[i][0] === name) return TB_POOL[i][1];
    return 'D';
  }
  // A balanced trial balance: Revenue, Purchases, Inventory, Equity always present plus n extras.
  function makeTB(n, must) {
    for (var tries = 0; tries < 400; tries++) {
      var mon = rint(0, 11), lines = [];
      var y = rint(2026, 2028);
      lines.push({ a: 'Inventory at 1 ' + MONTHS[mon] + ' ' + (y - 1), v: step(6000, 30000, 10) });
      var pool = shuf(TB_POOL.filter(function (p) { return p[0] !== 'Purchases'; }));
      var chosen = ['Purchases'].concat(must || []);
      for (var i = 0; i < pool.length && chosen.length < n + 1; i++) {
        var nm = pool[i][0];
        if (chosen.indexOf(nm) >= 0) continue;
        if ((nm === 'Cash' && chosen.indexOf('Petty cash') >= 0) || (nm === 'Petty cash' && chosen.indexOf('Cash') >= 0)) continue;
        chosen.push(nm);
      }
      chosen.forEach(function (nm) { var p = TB_POOL.filter(function (q) { return q[0] === nm; })[0]; lines.push({ a: nm, v: step(p[2], p[3], p[4]) }); });
      if (chosen.indexOf('Motor vehicles – cost') >= 0) {
        var mv = lines.filter(function (l) { return l.a === 'Motor vehicles – cost'; })[0].v;
        lines.push({ a: 'Motor vehicles – provision for depreciation', v: step(mv * 0.2, mv * 0.6, 10) });
      }
      var purch = lines.filter(function (l) { return l.a === 'Purchases'; })[0].v;
      lines.push({ a: 'Revenue', v: step(purch * 1.5, purch * 1.9, 10) });
      var dr = sum(lines.filter(function (l) { return side(l.a) === 'D'; }).map(function (l) { return l.v; }));
      var cr = sum(lines.filter(function (l) { return side(l.a) === 'C'; }).map(function (l) { return l.v; }));
      var eq = dr - cr;
      if (eq < 8000 || eq > 120000) continue;
      lines.push({ a: 'Equity', v: eq });
      lines.forEach(function (l) { l.s = side(l.a); });
      lines.sort(function (p, q) { return p.a < q.a ? -1 : 1; });
      return { lines: lines, total: dr, year: y, mon: mon };
    }
    throw new Error('makeTB failed');
  }
  function listTable(lines) { return table(['Account', '$'], lines.map(function (l) { return [l.a, num(l.v)]; })); }
  function draftTable(lines, totals) {
    var rows = lines.map(function (l) { return [l.a, l.s === 'D' ? num(l.v) : '', l.s === 'C' ? num(l.v) : '']; });
    if (totals) rows.push(['<b>Totals</b>', '<b>' + num(totals[0]) + '</b>', '<b>' + num(totals[1]) + '</b>']);
    return table(['Account', 'Debit $', 'Credit $'], rows);
  }
  function tot(lines, s) { return sum(lines.filter(function (l) { return l.s === s; }).map(function (l) { return l.v; })); }
  function listOf(lines, s) { return lines.filter(function (l) { return l.s === s; }).map(function (l) { return l.a + ' ' + num(l.v); }).join(' + '); }

  B['ACC-CTL-02'] = { title: 'Preparing a trial balance', items: [
    { skill: 'column-totals', gen: function () {
      var t = makeTB(rint(7, 9)), nm = pick(NAMES);
      return numQ(nm + ' extracted these balances on ' + MDAYS[(t.mon + 11) % 12] + ' ' + MONTHS[(t.mon + 11) % 12] + ' ' + (t.mon === 0 ? t.year - 1 : t.year) + '. When they are entered in a trial balance, what is the total of the <b>debit</b> column? Give your answer in $.' + listTable(t.lines),
        t.total, 'Debit balances are assets, expenses, drawings, purchases, returns inwards and opening inventory: ' + listOf(t.lines, 'D') + ' = $' + num(t.total) + '. The credit column must give the same total.');
    } },
    { skill: 'column-totals', gen: function () {
      var t = makeTB(rint(7, 9), [pick(['Bank overdraft', 'Provision for irrecoverable debts', 'Returns outwards'])]), nm = pick(NAMES);
      return numQ(nm + ' has listed the balances below. What is the total of the <b>credit</b> column of the trial balance? Give your answer in $.' + listTable(t.lines),
        t.total, 'Credit balances are equity, liabilities (including any overdraft), revenue, other income, returns outwards and provisions: ' + listOf(t.lines, 'C') + ' = $' + num(t.total) + '.');
    } },
    { skill: 'suspense-figure', gen: function () {
      var t = makeTB(rint(7, 8)), nm = pick(NAMES), d = step(40, 900, 10), short = pick(['D', 'C']);
      var lines = t.lines.map(function (l) { return { a: l.a, v: l.v, s: l.s }; });
      var cand = lines.filter(function (l) { return l.s === short && l.a !== 'Equity' && l.v > d * 3; });
      var hit = pick(cand); hit.v -= d;
      var dr = tot(lines, 'D'), cr = tot(lines, 'C');
      var sd = short === 'D' ? 'debit' : 'credit', other = short === 'D' ? 'credit' : 'debit';
      return mcq(nm + '’s balances are listed below. Any difference in the trial balance is to be entered in a suspense account. Which entry is needed?' + listTable(lines),
        'Suspense ' + money(d) + ' in the ' + sd + ' column',
        ['Suspense ' + money(d) + ' in the ' + other + ' column', 'Suspense ' + money(2 * d) + ' in the ' + sd + ' column', 'Suspense ' + money(2 * d) + ' in the ' + other + ' column'],
        'Debit total $' + num(dr) + ', credit total $' + num(cr) + '. The ' + sd + ' column is short by $' + num(d) + ', so the suspense balance goes in the ' + sd + ' column to make both totals $' + num(Math.max(dr, cr)) + '.');
    } },
    { skill: 'suspense-figure', gen: function () {
      var t = makeTB(rint(7, 8)), nm = pick(NAMES), d = step(30, 600, 10), short = pick(['D', 'C']);
      var lines = t.lines.map(function (l) { return { a: l.a, v: l.v, s: l.s }; });
      var hit = pick(lines.filter(function (l) { return l.s === short && l.a !== 'Equity' && l.v > d * 3; })); hit.v -= d;
      var dr = tot(lines, 'D'), cr = tot(lines, 'C'), big = Math.max(dr, cr);
      return numQ(nm + ' prepares a trial balance from the balances below, entering any difference in a suspense account. What will each column total be once the suspense balance is included? Give your answer in $.' + listTable(lines),
        big, 'Debit total $' + num(dr) + ', credit total $' + num(cr) + '. The suspense figure of $' + num(Math.abs(dr - cr)) + ' is added to the smaller side, so both columns total $' + num(big) + '.');
    } },
    { skill: 'redraft-misplaced', gen: function () {
      var t = makeTB(rint(7, 8), [pick(['Bank overdraft', 'Returns outwards', 'Discount received', 'Provision for irrecoverable debts'])]), nm = pick(NAMES);
      var lines = t.lines.map(function (l) { return { a: l.a, v: l.v, s: l.s }; });
      var wrong = pick(lines.filter(function (l) { return TRICKY.indexOf(l.a) >= 0 || /provision for depreciation/.test(l.a); }));
      wrong.s = wrong.s === 'D' ? 'C' : 'D';
      var dr = tot(lines, 'D'), cr = tot(lines, 'C');
      var others = shuf(lines.filter(function (l) { return l !== wrong && l.a !== 'Equity'; })).slice(0, 3).map(function (l) { return l.a; });
      return mcq(nm + '’s assistant drafted this trial balance but the totals do not agree. Exactly one balance is in the wrong column. Which one?' + draftTable(lines, [dr, cr]),
        wrong.a, others,
        wrong.a + ' is a ' + (wrong.s === 'D' ? 'credit' : 'debit') + ' balance but was put in the ' + (wrong.s === 'D' ? 'debit' : 'credit') + ' column. The totals differ by $' + num(Math.abs(dr - cr)) + ', which is twice $' + num(wrong.v) + '.');
    } },
    { skill: 'redraft-misplaced', gen: function () {
      var t = makeTB(rint(8, 9), ['Returns inwards', 'Returns outwards']), nm = pick(NAMES);
      var lines = t.lines.map(function (l) { return { a: l.a, v: l.v, s: l.s }; });
      lines.forEach(function (l) { if (l.a === 'Returns inwards' || l.a === 'Returns outwards') l.s = l.s === 'D' ? 'C' : 'D'; });
      var dr = tot(lines, 'D'), cr = tot(lines, 'C');
      return numQ(nm + ' drafted the trial balance below. When it is redrafted correctly, what will the total of each column be? Give your answer in $.' + draftTable(lines, [dr, cr]),
        t.total, 'Returns inwards (sales returns) is a debit and returns outwards (purchases returns) is a credit, and the draft has them swapped. Move each amount to its correct column, keeping the amounts: both columns then total $' + num(t.total) + '.');
    } },
    { skill: 'redraft-misplaced', gen: function () {
      var nm = pick(NAMES), item = pick([['bank overdraft', 'credit', 'debit'], ['provision for irrecoverable debts', 'credit', 'debit'], ['discount allowed', 'debit', 'credit'], ['carriage outwards', 'debit', 'credit'], ['commission received', 'credit', 'debit']]);
      var v = step(200, 3800, 10);
      return numQ(nm + ' prepared a trial balance in which every balance is correct except that the ' + item[0] + ' of $' + num(v) + ' was entered in the ' + item[2] + ' column instead of the ' + item[1] + ' column. By how much will the two column totals differ? Give your answer in $.',
        2 * v, 'The ' + item[2] + ' column gains $' + num(v) + ' it should not have and the ' + item[1] + ' column is missing $' + num(v) + ', so the gap is 2 × $' + num(v) + ' = $' + num(2 * v) + '.');
    } },
    { skill: 'redraft-misplaced', gen: function () {
      var nm = pick(NAMES), T = step(60000, 240000, 10), p = step(150, 1200, 10);
      var item = pick([['provision for irrecoverable debts', 'debit'], ['bank overdraft', 'debit'], ['returns outwards', 'debit']]);
      return moneyMcq(nm + '’s draft trial balance shows a debit total of $' + num(T + p) + ' and a credit total of $' + num(T - p) + '. The only mistake is that the ' + item[0] + ' of $' + num(p) + ' is in the ' + item[1] + ' column. What will both totals be after redrafting?',
        T, [T + p, T - p, T + 2 * p], 'Moving $' + num(p) + ' out of the debit column gives $' + num(T + p) + ' − $' + num(p) + ' = $' + num(T) + '; adding it to the credit column gives $' + num(T - p) + ' + $' + num(p) + ' = $' + num(T) + '.');
    } },
    { skill: 'missing-balance', gen: function () {
      var t = makeTB(rint(7, 9)), nm = pick(NAMES);
      var eq = t.lines.filter(function (l) { return l.a === 'Equity'; })[0].v;
      var lines = t.lines.filter(function (l) { return l.a !== 'Equity'; });
      return numQ(nm + '’s trial balance agrees. All balances are shown below except equity. Calculate the equity balance. Give your answer in $.' + listTable(lines),
        eq, 'Debits: ' + listOf(t.lines, 'D') + ' = $' + num(t.total) + '. Other credits total $' + num(t.total - eq) + ', so equity = $' + num(t.total) + ' − $' + num(t.total - eq) + ' = $' + num(eq) + '.');
    } },
    { skill: 'missing-balance', gen: function () {
      var od = Math.random() < 0.5;
      var t; do { t = makeTB(rint(7, 8), [od ? 'Bank overdraft' : 'Cash']); } while (!od && t.lines.some(function (l) { return l.a === 'Bank overdraft'; }));
      var nm = pick(NAMES);
      var bankLine = t.lines.filter(function (l) { return l.a === (od ? 'Bank overdraft' : 'Cash'); })[0];
      var lines = t.lines.filter(function (l) { return l !== bankLine; });
      var v = bankLine.v, dr = tot(lines, 'D'), cr = tot(lines, 'C');
      return mcq(nm + '’s trial balance agrees once the bank balance is included. Every other balance is listed below. What is the missing bank balance?' + listTable(lines),
        od ? 'Bank overdraft ' + money(v) + ', credit column' : 'Bank in hand ' + money(v) + ', debit column',
        od ? ['Bank in hand ' + money(v) + ', debit column', 'Bank overdraft ' + money(2 * v) + ', credit column', 'Bank in hand ' + money(2 * v) + ', debit column']
           : ['Bank overdraft ' + money(v) + ', credit column', 'Bank in hand ' + money(2 * v) + ', debit column', 'Bank overdraft ' + money(2 * v) + ', credit column'],
        'Without the bank, debits are $' + num(dr) + ' and credits $' + num(cr) + '. The ' + (od ? 'credit' : 'debit') + ' side is short by $' + num(v) + ', and a ' + (od ? 'credit bank balance is an overdraft (a liability).' : 'debit bank balance is money in the bank (an asset).'));
    } },
    { skill: 'layout-rules', gen: function () {
      var cr = shuf(['Returns outwards', 'Bank overdraft', 'Discount received', 'Provision for irrecoverable debts', 'Commission received', 'Trade payables ledger control', 'Motor vehicles – provision for depreciation']).slice(0, rint(2, 3));
      var dr = shuf(['Returns inwards', 'Carriage outwards', 'Discount allowed', 'Drawings', 'Trade receivables ledger control', 'Carriage inwards', 'Irrecoverable debts']).slice(0, 6 - cr.length);
      var opts = cr.concat(dr), nm = pick(NAMES);
      return { kind: 'multi', q: nm + '’s trainee put every one of these balances in the debit column of the trial balance. Which of them must be moved to the credit column when the trial balance is redrafted?',
        options: opts, answers: cr.map(function (_, i) { return i; }),
        why: cr.join(', ') + ' are income, liabilities or provisions, so they are credit balances. ' + dr.join(', ') + ' are expenses, assets or drawings and stay in the debit column.' };
    } },
    { skill: 'column-totals', gen: function () {
      var nm = pick(NAMES), mv = step(18000, 45000, 100), pd = step(mv * 0.25, mv * 0.6, 10), ff = step(5000, 15000, 100), pf = step(ff * 0.2, ff * 0.5, 10);
      var ri = step(300, 1500, 10), ro = step(300, 1500, 10), ci = step(200, 900, 10), co = step(200, 900, 10);
      var lines = [{ a: 'Carriage inwards', v: ci, s: 'D' }, { a: 'Carriage outwards', v: co, s: 'D' }, { a: 'Fixtures and fittings – cost', v: ff, s: 'D' }, { a: 'Fixtures and fittings – provision for depreciation', v: pf, s: 'C' },
        { a: 'Motor vehicles – cost', v: mv, s: 'D' }, { a: 'Motor vehicles – provision for depreciation', v: pd, s: 'C' }, { a: 'Returns inwards', v: ri, s: 'D' }, { a: 'Returns outwards', v: ro, s: 'C' }];
      var d = tot(lines, 'D');
      return moneyMcq('These are some of the balances in ' + nm + '’s trial balance. What is the total of these balances that belong in the <b>debit</b> column?' + listTable(lines),
        d, [d + pf + pd - co - ci, d - ci - co, d + ro, d - ri + ro],
        'Debit: both carriage accounts, both asset cost accounts and returns inwards: $' + num(ci) + ' + $' + num(co) + ' + $' + num(ff) + ' + $' + num(mv) + ' + $' + num(ri) + ' = $' + num(d) + '. Provisions for depreciation and returns outwards are credits.');
    } },
    { skill: 'suspense-figure', gen: function () {
      var nm = pick(NAMES), dr = step(50000, 180000, 10), d = step(20, 700, 10), crBig = Math.random() < 0.5;
      var cr = crBig ? dr + d : dr - d;
      return mcq(nm + '’s trial balance totals are: debit $' + num(dr) + ', credit $' + num(cr) + '. The difference is to be entered in a suspense account. How is the suspense balance shown?',
        money(d) + ' in the ' + (crBig ? 'debit' : 'credit') + ' column',
        [money(d) + ' in the ' + (crBig ? 'credit' : 'debit') + ' column', money(2 * d) + ' in the ' + (crBig ? 'debit' : 'credit') + ' column', money(Math.round(d / 2)) + ' in each column'],
        'The ' + (crBig ? 'debit' : 'credit') + ' column is the smaller one by $' + num(cr > dr ? cr - dr : dr - cr) + ', so the suspense balance goes on that side, labelled ‘Suspense’, and both totals become $' + num(Math.max(dr, cr)) + '.');
    } },
    { skill: 'missing-balance', gen: function () {
      var t = makeTB(rint(7, 8)), nm = pick(NAMES);
      var rev = t.lines.filter(function (l) { return l.a === 'Revenue'; })[0].v;
      var lines = t.lines.filter(function (l) { return l.a !== 'Revenue'; });
      return numQ('The revenue figure is missing from ' + nm + '’s list of balances, but the trial balance is known to agree. Calculate revenue. Give your answer in $.' + listTable(lines),
        rev, 'Debit total = ' + listOf(t.lines, 'D') + ' = $' + num(t.total) + '. Credits other than revenue = $' + num(t.total - rev) + '. Revenue = $' + num(t.total) + ' − $' + num(t.total - rev) + ' = $' + num(rev) + '.');
    } },
    { skill: 'layout-rules', kind: 'mcq', q: 'Rustam’s list of balances at 30 June includes “Inventory at 1 July last year $14,200” and a note that inventory at 30 June is $16,900. How are these treated in his trial balance?',
      options: ['$14,200 in the debit column; the $16,900 is not in the trial balance', '$16,900 in the debit column; the $14,200 is not in the trial balance', 'Both amounts in the debit column, as both are inventory', '$14,200 in the debit column and $16,900 in the credit column'], answer: 0,
      why: 'The trial balance lists ledger balances on that date, and the only inventory balance in the ledger is the opening inventory. Closing inventory is counted at the year end and is used in the financial statements, not in the trial balance.' },
    { skill: 'layout-rules', kind: 'mcq', q: 'Sakura’s draft trial balance shows returns outwards of $1,460 in the debit column. What should she do when she redrafts it?',
      options: ['Move $1,460 to the credit column', 'Leave it in the debit column', 'Move $2,920 to the credit column', 'Remove it and use a suspense account'], answer: 0,
      why: 'Returns outwards (purchases returns) reduce purchases, so they are a credit balance. When redrafting you keep the same amount and simply move it to the correct column.' },
    { skill: 'redraft-misplaced', kind: 'multi', q: 'Ravi’s draft trial balance is shown below. Which balances are in the wrong column?' +
        '<table class="mc-table"><tr><th>Account</th><th>Debit $</th><th>Credit $</th></tr><tr><td>Carriage outwards</td><td>640</td><td></td></tr><tr><td>Discount received</td><td>380</td><td></td></tr><tr><td>Drawings</td><td>11,200</td><td></td></tr><tr><td>Equity</td><td></td><td>27,500</td></tr><tr><td>Irrecoverable debts</td><td></td><td>420</td></tr><tr><td>Trade payables ledger control</td><td></td><td>8,950</td></tr></table>',
      options: ['Discount received', 'Irrecoverable debts', 'Carriage outwards', 'Drawings', 'Equity', 'Trade payables ledger control'], answers: [0, 1],
      why: 'Discount received is income (credit) and irrecoverable debts is an expense (debit), so these two have been swapped round. Carriage outwards and drawings are debits; equity and trade payables are credits, so they are correct.' },
    { skill: 'layout-rules', kind: 'mcq', q: 'A trainee asks why “Machinery – provision for depreciation $9,300” goes in the credit column of the trial balance. Which reason is correct?',
      options: ['It is accumulated depreciation that reduces the asset', 'It is cash put aside to replace the machinery', 'It is an expense of the current year', 'It is the amount the machinery could be sold for'], answer: 0,
      why: 'The provision for depreciation holds the depreciation built up so far; it is a credit balance that is deducted from the machinery cost. It is not cash, not this year’s expense and not a market value.' },
    { skill: 'suspense-figure', kind: 'mcq', q: 'Diego’s debit column totals $87,420 and his credit column totals $87,960. He is told to enter the difference in a suspense account. Which line completes his trial balance?',
      options: ['Suspense $540 debit', 'Suspense $540 credit', 'Suspense $1,080 debit', 'Suspense $270 debit'], answer: 0,
      why: 'The debit column is $87,960 − $87,420 = $540 smaller, so a debit suspense balance of $540 is inserted and both columns total $87,960.' },
    { skill: 'redraft-misplaced', kind: 'mcq', q: 'In Folake’s draft trial balance the debit total exceeds the credit total by $3,600. Only one balance is in the wrong column. Which balance could explain this?',
      options: ['Bank overdraft $1,800 shown as a debit', 'Bank overdraft $3,600 shown as a debit', 'Wages $1,800 shown as a credit', 'Purchases $3,600 shown as a credit'], answer: 0,
      why: 'Putting a credit balance in the debit column adds it to the debits and removes it from the credits, so the gap is twice the amount: 2 × $1,800 = $3,600, with debits larger. Wages or purchases shown as credits would make the credit side larger.' },
    { skill: 'column-totals', kind: 'mcq', q: 'Hamid has entered every balance in the correct column. His debit column totals $142,380 but the credit total he wrote is $141,380. Before looking for a ledger error, what should he check first?',
      options: ['His addition of each column', 'Whether closing inventory is included', 'Whether drawings belong in the credit column', 'Whether the bank balance should be doubled'], answer: 0,
      why: 'A difference of exactly $1,000 with every balance in its correct column often comes from a slip in adding the columns. Re-adding both columns is the first check when preparing a trial balance.' },
    { skill: 'layout-rules', kind: 'mcq', q: 'Which statement about preparing a trial balance is correct?',
      options: ['Each balance is listed once, in the column of its ledger balance', 'Each transaction of the year is listed in both columns', 'Only the asset and liability balances are listed', 'Closing inventory is always listed in the credit column'], answer: 0,
      why: 'A trial balance lists the closing balance of every ledger account once: debit balances in the debit column and credit balances in the credit column. It is not a list of transactions.' }
  ] };

  // ---------- ACC-CTL-01 ----------
  function S(skill, q, right, wrong, why) { var o = mcq(q, right, wrong, why); o.skill = skill; return o; }
  function M(skill, q, opts, answers, why) { return { skill: skill, kind: 'multi', q: q, options: opts, answers: answers, why: why }; }

  B['ACC-CTL-01'] = { title: 'Why keep a trial balance? Benefits and limits', items: [
    S('purpose', 'Complete the sentence. “A trial balance is prepared mainly to test the ________ of the bookkeeping.”',
      'arithmetical accuracy', ['market value', 'profitability', 'cash position'],
      'If every debit has an equal credit, the debit and credit columns add to the same total. That is a test of arithmetical accuracy, not of value, profit or cash.'),
    M('purpose', 'Which of these are purposes of preparing a trial balance?',
      ['To check that total debits equal total credits', 'To provide a summary of balances for the financial statements', 'To prove that no errors have been made', 'To show the market value of the assets', 'To record transactions in the ledger'], [0, 1],
      'A trial balance checks the arithmetic of the double entry and gathers every balance in one place, which speeds up the financial statements. It cannot prove there are no errors, does not show market values and records no transactions.'),
    S('limits', 'Mehmet’s trial balance totals agree. What can he safely conclude?',
      'Total debit entries equal total credit entries', ['Every transaction was posted to the right account', 'Every transaction was recorded at the right amount', 'His profit for the year is correct'],
      'Equal totals only show that the debits and credits match in total. Errors such as posting to the wrong account or entering the wrong amount on both sides leave the totals equal.'),
    S('nature', 'Which statement about a trial balance is correct?',
      'It is a list of balances, not a ledger account', ['It is a ledger account with debit and credit sides', 'It is a book of prime entry for cash sales', 'It is part of the double entry for every sale'],
      'A trial balance is simply a list of the balances on the ledger accounts on one date. Nothing is posted to or from it, so it is not part of the double entry.'),
    S('limits', 'Yasmin entered a credit sale of $860 as $680 in both the sales day book and the ledger. Her trial balance totals still agree. Why?',
      'The same wrong amount was debited and credited', ['The trial balance ignores all credit sales', 'Credit sales are only checked in the cash book', 'The error makes both totals $180 too high'],
      'Both sides were entered at $680, so the debit and credit still match. A trial balance only detects errors that make the debits and credits unequal.'),
    S('limits', 'Which limitation of a trial balance is stated correctly?',
      'Some errors are not revealed by the totals', ['It cannot be prepared without a suspense account', 'It can only be prepared once every five years', 'It lists only the cash and bank balances'],
      'Agreement of the totals does not mean the books are free of errors, because some mistakes affect debits and credits equally. That is the main limitation.'),
    S('purpose', 'Kwame’s trial balance totals do not agree. What does this tell him?',
      'There is at least one error in the books', ['There are no errors in the books', 'Only the bank account can contain the error here', 'His profit for the year is too high'],
      'Unequal totals prove that somewhere a debit and its credit do not match, so at least one error exists. It does not show where the error is or its effect on profit.'),
    S('evaluate', 'Pilar asks whether she should stop preparing a trial balance, since “it does not find every error”. Which advice is best?',
      'Keep it: it still checks arithmetic and speeds up the accounts', ['Stop it: an incomplete check is worse than having no check at all', 'Stop it: errors can only be found by an auditor', 'Keep it: equal totals prove the books are free of errors'],
      'An evaluation weighs both sides: some errors stay hidden, but the trial balance still detects many errors and summarises every balance for the statements, so it is worth keeping. Equal totals never prove there are no errors.'),
    S('evaluate', 'A question says “Evaluate the benefits and drawbacks of keeping a trial balance”. What is needed for full marks?',
      'A developed advantage and disadvantage, then a conclusion', ['Two advantages only, each one fully developed with an example', 'A list of the balances in the correct columns', 'A definition of a trial balance and nothing more'],
      'Evaluate needs both sides, each explained with a reason or consequence, and a final judgement. A one-sided answer cannot reach full marks.'),
    S('purpose', 'Which point is a correctly developed benefit of preparing a trial balance?',
      'It summarises all balances, so the statements are prepared faster', ['It is prepared on the last day of the financial year', 'It has a debit column and a credit column', 'It summarises all balances and it lists every single ledger account'],
      'The developed answer gives the benefit (a summary of all balances) and links it to a result (the income statement and statement of financial position can be drawn up quickly). The others describe the layout or repeat the point.'),
    S('limits', 'Arjun posted a payment for repairs to the motor vehicles account instead of the repairs account. Why does his trial balance still agree?',
      'A debit was still made for the correct amount', ['Repairs are not shown in a trial balance', 'The credit entry was also made in the repairs account instead', 'Motor vehicles is a credit balance'],
      'Bank was credited and a debit of the same amount was made, just in the wrong account. Debits still equal credits, so the trial balance cannot reveal the mistake.'),
    S('purpose', 'Ahmed’s debit total is $62,300 and his credit total is $61,950. What should he do while he looks for the error?',
      'Open a suspense account for the $350 difference', ['Add $350 to revenue so the totals agree', 'Ignore the difference because it is too small to matter at all', 'Delete the bank balance from the list'],
      'A suspense account holds the difference until the error is found and corrected. Changing other balances to force agreement would hide the error.'),
    M('limits', 'Which of these mistakes would still leave the trial balance totals equal?',
      ['A purchase invoice omitted from the books completely', 'Two errors of $200 on opposite sides that cancel out', 'A sale debited to the wrong customer’s account', 'A payment recorded only on the credit side of the bank account', 'Wages of $520 debited as $250 with bank credited $520'], [0, 1, 2],
      'If nothing is entered, or debits and credits are wrong by the same amount, the totals still agree. A one-sided entry or a debit that differs from its credit makes the totals unequal.'),
    S('nature', 'On which date are the balances in a trial balance shown?',
      'On one particular date, often the year end', ['Over the whole financial year, shown month by month', 'On the date of each transaction', 'Only on the day the business started'],
      'A trial balance is a snapshot of every ledger balance on one date, usually when the accounts are balanced at the end of the period.'),
    S('evaluate', 'Which is a disadvantage of preparing a trial balance?',
      'Equal totals may give false confidence that there are no errors', ['It shows whether total debits equal total credits', 'It brings every ledger balance together on one page for the owner', 'It helps the trader prepare the financial statements'],
      'The others are advantages. The risk is that a trader sees equal totals and assumes the books are correct, when errors such as omissions or compensating errors may remain.'),
    S('nature', 'Sunita says, “I post my year-end balances into the trial balance account.” What is wrong with this?',
      'A trial balance is a list, so nothing is posted to it', ['A trial balance only includes the bank account', 'Balances should be posted at the start of the year', 'The trial balance must be kept in the journal, not as a list'],
      'Ledger balances are copied onto the trial balance as a list. It is not an account and no double entry is made to it.'),
    S('purpose', 'How does preparing a trial balance help when the income statement is drawn up?',
      'Revenue, purchases and expenses are already listed together', ['It shows the closing inventory for the year', 'It already includes every year-end adjustment', 'It calculates the profit for the year automatically'],
      'All the balances needed are gathered in one list, so the accountant can take revenue, purchases and expenses straight from it. Closing inventory and year-end adjustments still have to be added.'),
    S('evaluate', 'Which conclusion would earn the judgement mark in “Advise Chidi whether he should continue to prepare a trial balance”?',
      'Chidi should continue, as its benefits outweigh its limitations', ['A trial balance has a debit and a credit column, which helps Chidi', 'Some errors are not revealed by a trial balance', 'Trial balances are prepared by many businesses'],
      'An Advise answer must end with a clear recommendation to the named trader, linked to the points made. A limitation or a general fact is not a decision.'),
    S('limits', 'Lena paid $430 for stationery. She debited bank $430 and credited stationery $430. What will her trial balance show?',
      'Equal totals, even though both entries are reversed', ['Totals that differ by $430', 'Totals that differ by $860', 'A suspense balance of $430'],
      'A debit and a credit of $430 were both made, just on the wrong sides. Total debits still equal total credits, so the trial balance does not reveal this complete reversal.'),
    S('purpose', 'Which statement best explains why equal trial balance totals are expected?',
      'Every debit entry has an equal and opposite credit entry', ['Assets always equal the total of all expenses', 'Revenue always equals purchases plus expenses', 'Each account always has a zero balance'],
      'Double entry records every transaction with a debit and an equal credit, so when all the balances are listed the two columns should add to the same amount.'),
    M('evaluate', 'Which of these are advantages of preparing a trial balance?',
      ['Arithmetical errors in the double entry can be detected', 'Balances are summarised before the financial statements are prepared', 'It confirms that every transaction has been recorded', 'It shows how much cash the business will have next year'], [0, 1],
      'It can reveal errors that make debits and credits unequal, and it summarises balances for the statements. It cannot show that every transaction was recorded, nor forecast cash.'),
    S('limits', 'Ming forgot to record a cash sale of $95 anywhere in her books. How does this affect her trial balance?',
      'The totals still agree, so the omission is not revealed', ['The debit total is $95 lower than the credit total', 'The credit total is $95 lower than the debit total', 'A suspense balance of $95 appears automatically'],
      'Neither the debit (cash) nor the credit (revenue) was made, so both totals are lower by the same $95 and still agree.')
  ] };

  // ---------- ACC-REC-07 ----------
  B['ACC-REC-07'] = { title: 'Why keep a petty cash book', items: [
    M('purpose', 'Which of these are purposes of keeping a petty cash book?',
      ['To train a junior member of staff', 'To reduce the number of entries in the main cash book', 'To record credit sales to customers', 'To calculate depreciation on office equipment', 'To record large payments to suppliers by cheque'], [0, 1],
      'Small cash spending is handled by a junior petty cashier, which trains them and keeps the main cash book free of many small entries. Credit sales, depreciation and large supplier payments are recorded elsewhere.'),
    S('purpose', 'Which item would normally be paid from petty cash and recorded in the petty cash book?',
      'A $12 bus fare for a delivery assistant', ['A $3,400 payment to a supplier', 'A $900 monthly rent payment', 'A $15,000 purchase of a delivery van'],
      'The petty cash book is for small, low-value cash payments such as fares, postage and cleaning materials. Large payments go through the main cash book.'),
    S('develop', 'A student writes: “A petty cash book reduces the number of entries in the main cash book…”. Which ending develops this point?',
      '…so the main cash book is easier to check', ['…and it has analysis columns for expenses', '…and it is kept by the petty cashier', '…so small expenses are recorded in it'],
      'A development gives the consequence of the point. Fewer small entries mean the main cash book is clearer and quicker to check; the other endings describe the book instead.'),
    S('develop', 'Which sentence is a developed benefit of using a petty cashier?',
      'Small payments are delegated, so the chief cashier has more time for large items', ['Small payments are recorded in a separate book called the petty cash book', 'The petty cashier records small payments and the chief cashier records large ones', 'The petty cashier keeps vouchers for small payments in the petty cash box'],
      'The benefit (delegating small payments) is linked to its result (the chief cashier’s time is freed for more important work). The other sentences only describe who does what.'),
    S('develop', 'How do the analysis columns in a petty cash book help the business?',
      'Each column total is posted to its expense account in one entry', ['Each payment is posted separately to the bank account in the ledger', 'They show the cash left at the start of the month', 'They record the money received from customers'],
      'Grouping payments by type (postage, travel, cleaning) means only the column totals are posted to the ledger, saving time and showing how much is spent on each type.'),
    S('drawback', 'Which is a drawback of keeping a petty cash book?',
      'Cash kept in the office could be lost or stolen', ['Fewer small entries appear in the main cash book', 'A junior member of staff gains experience', 'Spending on each type of expense can be monitored'],
      'Keeping a cash float on the premises creates a risk of loss or theft. The other three are benefits.'),
    S('distinguish', 'Which statement correctly contrasts the petty cash book with the main cash book?',
      'The petty cash book records small cash payments; the cash book records larger cash and bank items', ['The petty cash book records bank payments; the cash book records only small cash items', 'The petty cash book records credit sales; the cash book records credit purchases', 'The petty cash book records large cash items, whereas the main cash book records only small bank items'],
      'Low-value cash spending is kept separate in the petty cash book, while the main cash book handles cash and bank receipts and payments of larger amounts.'),
    S('judgement', 'Rosa runs a market stall alone and makes about three small cash payments a month. Should she keep a petty cash book?',
      'Probably not: the extra work outweighs the small benefit', ['Yes: every business must keep one by law, whatever its size', 'Yes: it would record her credit sales', 'No: small payments are never recorded'],
      'With very few small payments and no staff to delegate to, the benefits (fewer cash book entries, training, delegation) are small, so the extra record may not be worth it. Her small payments must still be recorded somewhere.'),
    S('judgement', 'Tembo Travel’s office makes about 80 small cash payments a month and the chief cashier is overloaded. Which conclusion is best supported?',
      'It should keep a petty cash book and delegate small payments', ['It should stop recording small payments to save time', 'It should record small payments in the sales day book', 'It should pay every one of its small items by bank transfer instead'],
      'With many small payments and a busy chief cashier, the benefits of a petty cash book (delegation, fewer cash book entries, control) clearly outweigh the extra work.'),
    S('purpose', 'A student was asked for a purpose of a petty cash book. Which answer actually gives a purpose?',
      'To keep track of and control small expenses', ['It has columns for postage, travel and cleaning', 'It has a receipts column on the left-hand side', 'It is balanced at the end of every month'],
      'A purpose says why the book is kept, such as controlling small spending. The others describe what the book looks like or how it is balanced.'),
    S('develop', 'How does keeping a petty cash book help to train staff?',
      'A junior gains bookkeeping experience, so can take on more later', ['The chief cashier records each payment twice', 'The junior learns to prepare the trial balance and the final accounts', 'The petty cash float is increased each month'],
      'Keeping the petty cash book is a simple, low-risk bookkeeping task. A junior who does it builds skills and can be given more responsibility later.'),
    S('purpose', 'Who normally keeps the petty cash book?',
      'A petty cashier, often a junior member of staff', ['The business’s external auditor', 'The bank that holds the business account', 'The trade payables of the business'],
      'The petty cashier, often a junior employee, makes and records the small payments, which frees the chief cashier for larger work.'),
    S('develop', 'A petty cash voucher is signed for every payment. Why does this help the business?',
      'Each payment can be checked, which helps to control spending', ['It removes the need for a main cash book', 'It increases the size of the cash float', 'It changes the small cash payments into credit purchases instead'],
      'Vouchers give evidence for every payment, so spending can be checked against the cash left, which supports control of small expenses.'),
    S('distinguish', 'Which of these would be recorded in the main cash book rather than the petty cash book?',
      'A $2,750 cheque payment for new office chairs', ['A $6.40 payment for milk and sugar', 'A $18 taxi fare to the post office', 'A $9.50 payment for envelopes'],
      'Large payments such as office furniture go through the main cash book (bank column). The small, everyday cash items belong in the petty cash book.'),
    S('drawback', 'In a “Discuss” answer about keeping a petty cash book, which point would best balance the benefits?',
      'It needs time to record vouchers and top up the float', ['It reduces the workload of the chief cashier', 'It keeps the main cash book free of many small, everyday items', 'It allows small expenses to be monitored'],
      'A discuss answer needs a drawback as well as benefits. Extra administration (vouchers, balancing and topping up) is a drawback; the other three are benefits.'),
    M('purpose', 'A student lists four “different” reasons for keeping a petty cash book. Which two are really the same reason?',
      ['Keeps the main cash book uncluttered', 'Fewer entries in the main cash book', 'Trains a junior member of staff', 'Helps to monitor small expenses'], [0, 1],
      'An uncluttered main cash book and fewer entries in it are the same idea, so they earn only one mark. Training and monitoring expenses are different reasons.'),
    S('judgement', 'Which conclusion would earn the final mark in “Discuss whether Kenji should keep a petty cash book”?',
      'Kenji should keep one, as his many small payments outweigh the extra work', ['A petty cash book has analysis columns for each different kind of small expense', 'Petty cash can be stolen if it is not kept in a locked box', 'Small cash payments are often made for postage and fares'],
      'A discuss answer must end with a decision for the named business, linked to the points made. A fact or a single drawback is not a conclusion.'),
    S('purpose', 'Which of these is NOT a reason for keeping a petty cash book?',
      'To record goods sold on credit to customers', ['To record low-value cash payments', 'To reduce the main cashier’s workload', 'To control spending on small items'],
      'Credit sales are recorded in the sales day book. The other three are standard reasons for keeping a petty cash book.'),
    S('develop', 'Why does a petty cash book make it easier to see how much is spent on travel?',
      'Travel payments are collected in their own analysis column', ['Travel is paid from the bank, not from petty cash', 'Travel costs are recorded in the purchases day book with the invoices', 'Travel payments are added to the cash float'],
      'Each travel payment is entered in the travel analysis column, so the column total shows the month’s travel spending at a glance and can be compared with other months.'),
    S('judgement', 'Which situation gives the strongest case for a business to start a petty cash book?',
      'Many small cash payments are being made by a busy chief cashier', ['All payments are large and made by bank transfer', 'The owner works alone and pays for everything online using a card', 'Only one small cash payment is made each year'],
      'The benefits (delegation, fewer entries in the main cash book, control) are greatest when there are many small payments and the chief cashier is busy.'),
    S('drawback', 'Which risk is reduced by keeping the petty cash float small?',
      'The amount that could be lost or stolen', ['The number of entries in the main cash book', 'The need for petty cash vouchers', 'The number of analysis columns needed'],
      'A small float means only a little cash is on the premises at any time, which limits the loss if it goes missing.'),
    S('distinguish', 'Where is the money for petty cash spending usually obtained?',
      'From the main cash book, usually the bank column', ['From the trade receivables ledger', 'From the sales day book', 'From the purchases returns book'],
      'The chief cashier gives the petty cashier money from the business bank (or cash). This is recorded as a payment in the main cash book and a receipt in the petty cash book.')
  ] };

  // ---------- petty cash vouchers ----------
  var PC_ITEMS = {
    Postage: ['Postage stamps', 'Parcel postage', 'Registered letter', 'Courier for documents'],
    Travel: ['Taxi fare', 'Bus fares', 'Train ticket', 'Parking fee'],
    Cleaning: ['Window cleaner', 'Cleaning materials', 'Office cleaner’s wages', 'Carpet shampoo'],
    Stationery: ['Printer paper', 'Envelopes', 'Printer ink', 'Pens and folders'],
    Refreshments: ['Tea and coffee', 'Milk and sugar', 'Biscuits for visitors', 'Bottled water']
  };
  function pcMonth() {
    var cols = shuf(['Postage', 'Travel', 'Cleaning', 'Stationery', 'Refreshments']).slice(0, 4);
    var flt = pick([100, 120, 150, 200, 250]), mon = rint(0, 11), y = rint(2026, 2028);
    var n = rint(5, 6), days = shuf([2, 4, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27]).slice(0, n).sort(function (a, b) { return a - b; });
    var v = [], used = {};
    for (var i = 0; i < n; i++) {
      var c = i < 4 ? cols[i] : pick(cols), d;
      do { d = pick(PC_ITEMS[c]); } while (used[d]);
      used[d] = 1;
      v.push({ day: days[i], col: c, det: d, amt: R.roundDp(rint(Math.round(flt * 0.04 * 20), Math.round(flt * 0.13 * 20)) * 5 / 100, 2) });
    }
    v = shuf(v).sort(function (a, b) { return a.day - b.day; });
    var tot = R.roundDp(sum(v.map(function (x) { return x.amt; })), 2);
    if (tot > flt * 0.9) return pcMonth();
    return { cols: cols, flt: flt, mon: mon, y: y, v: v, tot: tot, ch: pick(['Ana', 'Bao', 'Cyrus', 'Delphine', 'Eko', 'Fen', 'Gita', 'Hugo']), vn: rint(31, 89) * 10 };
  }
  function voucherTable(m) {
    return table(['Date', 'Voucher', 'Details', '$'], m.v.map(function (x, i) { return [x.day + ' ' + MONTHS[m.mon].slice(0, 3), String(m.vn + i + 1), x.det, num(x.amt, 2)]; }));
  }
  function colTot(m, c) { return R.roundDp(sum(m.v.filter(function (x) { return x.col === c; }).map(function (x) { return x.amt; })), 2); }
  function pcIntro(m) { return 'The petty cashier, ' + m.ch + ', uses the imprest system with a float of ' + c2(m.flt) + '. On 1 ' + MONTHS[m.mon] + ' the balance b/d was ' + c2(m.flt) + '. The analysis columns are ' + m.cols.join(', ') + '. Payments in ' + MONTHS[m.mon] + ' were:'; }
  function lastDay(m) { return MDAYS[m.mon] + ' ' + MONTHS[m.mon]; }
  function nextFirst(m) { return '1 ' + MONTHS[(m.mon + 1) % 12]; }

  B['ACC-REC-10'] = { title: 'Preparing an analysed petty cash book', items: [
    { skill: 'analysis-column', gen: function () {
      var cols = shuf(['Postage', 'Travel', 'Cleaning', 'Stationery', 'Refreshments']).slice(0, 4), c = pick(cols), d = pick(PC_ITEMS[c]);
      return mcq('A petty cash book has analysis columns for ' + cols.join(', ') + '. In which analysis column is a payment for “' + d + '” entered?', c, cols.filter(function (x) { return x !== c; }),
        '“' + d + '” is a ' + c.toLowerCase() + ' expense, so the amount goes in the total payments column and again in the ' + c + ' column.');
    } },
    { skill: 'column-total', gen: function () {
      var m = pcMonth(), c = pick(m.cols.filter(function (k) { return m.v.filter(function (x) { return x.col === k; }).length > 1; })), t = colTot(m, c);
      return numQ(pcIntro(m) + voucherTable(m) + 'What is the total of the <b>' + c + '</b> analysis column at ' + lastDay(m) + '? Give your answer in $ to 2 decimal places.', t,
        'Add only the ' + c.toLowerCase() + ' vouchers: ' + m.v.filter(function (x) { return x.col === c; }).map(function (x) { return x.det + ' ' + num(x.amt, 2); }).join(' + ') + ' = $' + num(t, 2) + '.', 2);
    } },
    { skill: 'column-total', gen: function () {
      var m = pcMonth();
      return numQ(pcIntro(m) + voucherTable(m) + 'What is the total of the total payments column before the balance is carried down? Give your answer in $ to 2 decimal places.', m.tot,
        'Every voucher goes in the total payments column: ' + m.v.map(function (x) { return num(x.amt, 2); }).join(' + ') + ' = $' + num(m.tot, 2) + '. The analysis column totals must add across to this figure.', 2);
    } },
    { skill: 'restore-entry', gen: function () {
      var m = pcMonth();
      return moneyMcq(pcIntro(m) + voucherTable(m) + 'On ' + lastDay(m) + ' the imprest is restored from the bank. What amount is entered in the receipts column?', m.tot,
        [R.roundDp(m.flt - m.tot, 2), m.flt, R.roundDp(m.flt + m.tot, 2)],
        'Under the imprest system the amount restored equals the amount spent: $' + num(m.tot, 2) + '. This brings the cash back to the float of $' + num(m.flt, 2) + '.', 2);
    } },
    { skill: 'balance-cd', gen: function () {
      var m = pcMonth();
      return moneyMcq(pcIntro(m) + voucherTable(m) + 'The imprest is restored from the bank on ' + lastDay(m) + ' and the book is balanced on that date. What is the balance c/d?', m.flt,
        [R.roundDp(m.flt - m.tot, 2), m.tot, R.roundDp(m.flt + m.tot, 2)],
        'Cash left = $' + num(m.flt, 2) + ' − $' + num(m.tot, 2) + ' = $' + num(m.flt - m.tot, 2) + '; adding the $' + num(m.tot, 2) + ' restored gives back the float, so the balance c/d is $' + num(m.flt, 2) + '.', 2);
    } },
    { skill: 'balance-cd', gen: function () {
      var m = pcMonth(), t = R.roundDp(m.flt + m.tot, 2);
      return numQ(pcIntro(m) + voucherTable(m) + 'The imprest is restored from the bank on ' + lastDay(m) + ', and the book is balanced. What figure appears as the total of <b>each side</b> of the petty cash book? Give your answer in $ to 2 decimal places.', t,
        'Receipts side: balance b/d $' + num(m.flt, 2) + ' + bank $' + num(m.tot, 2) + ' = $' + num(t, 2) + '. Payments side: payments $' + num(m.tot, 2) + ' + balance c/d $' + num(m.flt, 2) + ' = $' + num(t, 2) + '.', 2);
    } },
    { skill: 'restore-entry', gen: function () {
      var m = pcMonth(), left = R.roundDp(m.flt - m.tot, 2);
      return moneyMcq(pcIntro(m) + voucherTable(m) + 'This time the book is balanced on ' + lastDay(m) + ' <b>before</b> the imprest is restored; the restoring cheque is received on ' + nextFirst(m) + '. What is the balance c/d on ' + lastDay(m) + '?', left,
        [m.flt, m.tot, R.roundDp(m.flt + m.tot, 2)],
        'No top-up has been received by ' + lastDay(m) + ', so the cash left is the float less the spending: $' + num(m.flt, 2) + ' − $' + num(m.tot, 2) + ' = $' + num(left, 2) + '. The $' + num(m.tot, 2) + ' from the bank is entered on ' + nextFirst(m) + '.', 2);
    } },
    { skill: 'column-total', gen: function () {
      var m = pcMonth(), miss = pick(m.cols.slice(0, 4)), others = m.cols.slice(0, 4).filter(function (c) { return c !== miss; });
      var mt = colTot(m, miss);
      return numQ('A petty cash book shows total payments of ' + c2(m.tot) + ' for ' + MONTHS[m.mon] + '. The analysis column totals are: ' + others.map(function (c) { return c + ' ' + c2(colTot(m, c)); }).join(', ') + ' and ' + miss + ' (smudged). What is the ' + miss + ' column total? Give your answer in $ to 2 decimal places.', mt,
        'The analysis columns must add across to the total payments column: $' + num(m.tot, 2) + ' − ' + others.map(function (c) { return '$' + num(colTot(m, c), 2); }).join(' − ') + ' = $' + num(mt, 2) + '.', 2);
    } },
    { skill: 'analysis-column', gen: function () {
      var m = pcMonth(), wrongIdx = rint(0, m.v.length - 1), cols = m.cols;
      var bad = pick(cols.filter(function (c) { return c !== m.v[wrongIdx].col; }));
      var rows = m.v.map(function (x, i) { var cc = i === wrongIdx ? bad : x.col; return [x.day + ' ' + MONTHS[m.mon].slice(0, 3), x.det, num(x.amt, 2)].concat(cols.map(function (c) { return c === cc ? num(x.amt, 2) : ''; })); });
      var others = shuf(m.v.filter(function (_, i) { return i !== wrongIdx; })).slice(0, 3).map(function (x) { return x.det; });
      return mcq('Part of a petty cash book is shown. One payment has been entered in the wrong analysis column. Which one?' + table(['Date', 'Details', 'Total $'].concat(cols.map(function (c) { return c + ' $'; })), rows),
        m.v[wrongIdx].det, others,
        '“' + m.v[wrongIdx].det + '” is a ' + m.v[wrongIdx].col.toLowerCase() + ' expense but has been analysed under ' + bad + '. Each payment must go in the column that matches its type.');
    } },
    { skill: 'balance-cd', gen: function () {
      var m = pcMonth();
      return mcq('A petty cash book with an imprest of ' + c2(m.flt) + ' is restored from the bank on ' + lastDay(m) + ' after spending of ' + c2(m.tot) + '. Which entry appears on ' + nextFirst(m) + '?',
        'Balance b/d ' + c2(m.flt) + ' in the receipts column', ['Balance b/d ' + c2(m.flt) + ' in the total payments column', 'Balance b/d ' + c2(m.flt - m.tot) + ' in the receipts column', 'Bank ' + c2(m.tot) + ' in the receipts column'],
        'After restoring, the cash in hand equals the float. It is carried down on the payments side on ' + lastDay(m) + ' and brought down on the receipts side as $' + num(m.flt, 2) + ' on ' + nextFirst(m) + '.');
    } },
    { skill: 'restore-entry', gen: function () {
      var m = pcMonth(), left = R.roundDp(m.flt - m.tot, 2);
      return numQ('At the end of ' + MONTHS[m.mon] + ' the petty cash box holds ' + c2(left) + ' and the vouchers for the month total ' + c2(m.tot) + '. The imprest is ' + c2(m.flt) + '. In the petty cash book, what is the amount of the “Bank” entry on ' + lastDay(m) + '? Give your answer in $ to 2 decimal places.', m.tot,
        'The bank entry restores the imprest, so it equals the spending: $' + num(m.flt, 2) + ' − $' + num(left, 2) + ' = $' + num(m.tot, 2) + ', which matches the vouchers.', 2);
    } },
    { skill: 'column-total', gen: function () {
      var m = pcMonth(), a = m.cols[0], b = m.cols[1], t = R.roundDp(colTot(m, a) + colTot(m, b), 2);
      return numQ(pcIntro(m) + voucherTable(m) + 'The business later decides to combine ' + a + ' and ' + b + ' into one column. What would the total of that combined column be for ' + MONTHS[m.mon] + '? Give your answer in $ to 2 decimal places.', t,
        a + ' $' + num(colTot(m, a), 2) + ' + ' + b + ' $' + num(colTot(m, b), 2) + ' = $' + num(t, 2) + '.', 2);
    } },
    { skill: 'layout', kind: 'mcq', q: 'In an analysed petty cash book, where is the amount received from the bank to restore the imprest entered?',
      options: ['In the receipts column', 'In the total payments column', 'In an analysis column', 'In the balance c/d line'], answer: 0,
      why: 'Money coming into petty cash is a receipt, so the restoring amount is entered in the receipts column (on the left), with the detail “Bank” or “Cash book”.' },
    { skill: 'layout', kind: 'mcq', q: 'How many times is each petty cash payment entered on the payments side of an analysed petty cash book?',
      options: ['Twice: in the total column and in one analysis column', 'Once: in the total payments column only', 'Once: in one analysis column only', 'Three times: total, analysis and receipts columns'], answer: 0,
      why: 'Each payment goes in the total payments column and again in the analysis column for its type, so the analysis columns add across to the total.' },
    { skill: 'layout', kind: 'mcq', q: 'A petty cash book’s analysis columns total $38.40, $21.75 and $17.10, but the total payments column shows $79.25. What does this show?',
      options: ['A payment has been missed from an analysis column or mis-added', 'The book is correct because totals never agree', 'The imprest should be restored by $77.25', 'The balance c/d should be $79.25'], answer: 0,
      why: 'The analysis columns add to $38.40 + $21.75 + $17.10 = $77.25, not $79.25. They must add across to the total payments column, so a $2.00 entry is missing or a column is wrongly added.' },
    { skill: 'balance-cd', kind: 'mcq', q: 'A petty cashier wrote “Balance c/d” on the receipts side of the petty cash book. Why is this wrong?',
      options: ['Balance c/d is on the payments side; balance b/d is on the receipts side', 'Balance c/d should be shown in an analysis column', 'Balance c/d should not be shown in a petty cash book', 'Balance c/d belongs in the main cash book only'], answer: 0,
      why: 'Petty cash is an asset. The closing balance is carried down on the payments (credit) side and brought down on the receipts (debit) side at the start of the next period.' },
    { skill: 'analysis-column', kind: 'mcq', q: 'A petty cash book has analysis columns for Postage and stationery, Travel and Cleaning. There is no separate Stationery column. Where should a $7.60 payment for envelopes be analysed?',
      options: ['Postage and stationery', 'Travel', 'Cleaning', 'Receipts'], answer: 0,
      why: 'Envelopes are stationery. When the business combines postage and stationery in one column, the payment is analysed there.' },
    { skill: 'layout', kind: 'mcq', q: 'Which details are needed on each payment line of a petty cash book to earn full credit?',
      options: ['Date, details and the amounts', 'Only the amount in the total column', 'Only the date and the analysis column', 'The name of the chief cashier'], answer: 0,
      why: 'Each line needs its date, what was bought and the amount in both the total and the analysis column. Dates, details and amounts are marked together.' },
    { skill: 'restore-entry', kind: 'mcq', q: 'Gloria’s petty cash book has receipts of $180.00 (balance b/d) and payments totalling $143.65. She restores the imprest. Which detail and amount does she write in the receipts column?',
      options: ['Bank $143.65', 'Bank $36.35', 'Balance c/d $36.35', 'Bank $180.00'], answer: 0,
      why: 'The top-up equals the amount spent, $143.65, and comes from the bank, so the detail is “Bank” (or “Cash book”). $36.35 is the cash left before the top-up.' },
    { skill: 'balance-cd', kind: 'mcq', q: 'After restoring the imprest, Hiro’s petty cash book totals $312.40 on each side. His imprest is $200. What did he spend during the month?',
      options: ['$112.40', '$200.00', '$312.40', '$87.60'], answer: 0,
      why: 'Each side total = float + amount restored = float + spending. So spending = $312.40 − $200.00 = $112.40.' },
    { skill: 'analysis-column', kind: 'mcq', q: 'Which voucher would be analysed in the Travel column of a petty cash book?',
      options: ['Rail fare for a sales assistant', 'Stamps for customer letters', 'Detergent for the kitchen', 'A box of printer paper'], answer: 0,
      why: 'A rail fare is a travel cost. Stamps go under postage, detergent under cleaning and printer paper under stationery.' },
    { skill: 'layout', kind: 'mcq', q: 'Why does a petty cash book include a separate total payments column as well as the analysis columns?',
      options: ['It gives the month’s total spending, used as a check on the analysis', 'It records the money received from the chief cashier', 'It shows the cash left in the box after each payment', 'It replaces the need for petty cash vouchers'], answer: 0,
      why: 'The total column gives total spending (the amount to restore) and lets the bookkeeper check that the analysis columns add across to the same figure.' }
  ] };

  // ---------- ACC-REC-09 ----------
  var FLOATS = [100, 120, 150, 180, 200, 250, 300, 350, 400];
  B['ACC-REC-09'] = { title: 'The imprest system: topping up petty cash', items: [
    { skill: 'restore-amount', gen: function () {
      var f = pick(FLOATS), s = step(f * 0.35, f * 0.9, 5), nm = pick(NAMES);
      if ((f === 250 && s === 180) || (f === 200 && s === 160) || (f === 300 && s === 185)) s += 5;
      return moneyMcq(nm + ' keeps a petty cash float of $' + num(f) + ' under the imprest system. During the month $' + num(s) + ' was spent from petty cash. How much is needed to restore the float?', s,
        [f - s, f, f + s], 'Under the imprest system the top-up equals the amount spent: $' + num(s) + '. That brings the cash back from $' + num(f - s) + ' to $' + num(f) + '.');
    } },
    { skill: 'restore-amount', gen: function () {
      var f = pick(FLOATS), left = R.roundDp(rint(Math.round(f * 0.1 * 4), Math.round(f * 0.6 * 4)) / 4, 2), nm = pick(NAMES), s = R.roundDp(f - left, 2);
      return numQ('The petty cash float at ' + nm + '’s shop is $' + num(f) + '. At the end of the week ' + c2(left) + ' is left in the box. How much must be paid in to restore the imprest? Give your answer in $ to 2 decimal places.', s,
        'Amount to restore = float − cash left = $' + num(f, 2) + ' − $' + num(left, 2) + ' = $' + num(s, 2) + ', which is the amount spent.', 2);
    } },
    { skill: 'restore-amount', gen: function () {
      var f = pick(FLOATS), n = rint(4, 6), v = [], nm = pick(NAMES);
      for (var i = 0; i < n; i++) v.push(rint(Math.round(f * 0.03 * 4), Math.round(f * 0.12 * 4)) * 25 / 100);
      var s = R.roundDp(sum(v), 2);
      return numQ(nm + ' runs petty cash on an imprest of $' + num(f) + '. This month’s vouchers were: ' + v.map(function (x) { return c2(x); }).join(', ') + '. What amount should the chief cashier give to restore the imprest? Give your answer in $ to 2 decimal places.', s,
        'Add the vouchers: ' + v.map(function (x) { return num(x, 2); }).join(' + ') + ' = $' + num(s, 2) + '. The top-up equals the total spent.', 2);
    } },
    { skill: 'float-from-data', gen: function () {
      var f = pick(FLOATS), s = step(f * 0.3, f * 0.85, 5), nm = pick(NAMES);
      return moneyMcq('At the month end ' + nm + '’s petty cash box holds $' + num(f - s) + ', and the vouchers kept with it add up to $' + num(s) + '. No cash is missing. What is the imprest?', f,
        [s, f - s, s - (f - s) > 0 ? s - (f - s) : 2 * f], 'Under the imprest system, cash left + vouchers = the float: $' + num(f - s) + ' + $' + num(s) + ' = $' + num(f) + '.');
    } },
    { skill: 'float-from-data', gen: function () {
      var f0 = pick([100, 150, 200, 250]), f1 = f0 + pick([50, 100]), s = step(f0 * 0.4, f0 * 0.85, 5), nm = pick(NAMES);
      return numQ(nm + '’s petty cash imprest is $' + num(f0) + '. This month $' + num(s) + ' was spent. From next month the imprest is to be raised to $' + num(f1) + '. How much should be transferred from the bank today? Give your answer in $.', s + f1 - f0,
        'Restore the spending of $' + num(s) + ' and add the $' + num(f1 - f0) + ' increase: $' + num(s) + ' + $' + num(f1 - f0) + ' = $' + num(s + f1 - f0) + '. Check: cash left $' + num(f0 - s) + ' + $' + num(s + f1 - f0) + ' = $' + num(f1) + '.');
    } },
    { skill: 'float-from-data', gen: function () {
      var f0 = pick([200, 250, 300, 400]), f1 = f0 - pick([50, 100]), s = step(f0 * 0.6, f0 * 0.85, 5), nm = pick(NAMES);
      return numQ(nm + '’s petty cash imprest of $' + num(f0) + ' is to be reduced to $' + num(f1) + '. During the month $' + num(s) + ' was spent. How much should the chief cashier give the petty cashier at the month end? Give your answer in $.', s - (f0 - f1),
        'Cash left = $' + num(f0) + ' − $' + num(s) + ' = $' + num(f0 - s) + '. To reach the new imprest of $' + num(f1) + ', the top-up is $' + num(f1) + ' − $' + num(f0 - s) + ' = $' + num(s - (f0 - f1)) + '.');
    } },
    { skill: 'double-entry', gen: function () {
      var f = pick(FLOATS), s = step(f * 0.3, f * 0.9, 5);
      return mcq('A business restores its petty cash imprest of $' + num(f) + ' after spending $' + num(s) + '. The money is drawn from the bank. Which double entry records the top-up?',
        'Debit petty cash $' + num(s) + '; credit bank $' + num(s), ['Debit bank $' + num(s) + '; credit petty cash $' + num(s), 'Debit petty cash $' + num(f - s) + '; credit bank $' + num(f - s), 'Debit petty cash $' + num(f) + '; credit bank $' + num(f)],
        'Petty cash (an asset) increases, so it is debited; bank decreases, so it is credited. The amount is the $' + num(s) + ' spent, not the cash left or the whole float.');
    } },
    { skill: 'restore-amount', gen: function () {
      var f = pick(FLOATS), s1 = step(f * 0.3, f * 0.9, 5), s2 = step(f * 0.3, f * 0.9, 5), m = rint(0, 10);
      return numQ('An office uses an imprest of $' + num(f) + ', restored at the end of each month. Spending was $' + num(s1) + ' in ' + MONTHS[m] + ' and $' + num(s2) + ' in ' + MONTHS[m + 1] + '. How much was transferred from the bank to petty cash over the two months in total? Give your answer in $.', s1 + s2,
        'Each month the top-up equals that month’s spending: $' + num(s1) + ' + $' + num(s2) + ' = $' + num(s1 + s2) + '. The float itself is not paid in again.');
    } },
    { skill: 'restore-amount', gen: function () {
      var f = pick(FLOATS), s = step(f * 0.3, f * 0.9, 5);
      return moneyMcq('An imprest of $' + num(f) + ' is used and $' + num(s) + ' is spent. The imprest is then restored. What is the petty cash balance immediately after restoring?', f,
        [f - s, s, f + s], 'Cash left $' + num(f - s) + ' + top-up $' + num(s) + ' = $' + num(f) + '. After restoring, petty cash is always back to the full imprest.');
    } },
    { skill: 'float-from-data', gen: function () {
      var f = pick(FLOATS), s = R.roundDp(rint(Math.round(f * 0.3 * 4), Math.round(f * 0.9 * 4)) / 4, 2), left = R.roundDp(f - s, 2);
      return numQ('On 30 ' + pick(['April', 'June', 'September', 'November']) + ' a petty cashier received ' + c2(s) + ' from the bank to restore the imprest. Before the top-up there was ' + c2(left) + ' in the box. What is the imprest? Give your answer in $.', f,
        'After the top-up the box holds the imprest: $' + num(left, 2) + ' + $' + num(s, 2) + ' = $' + num(f, 2) + '.', 2);
    } },
    { skill: 'cash-book-side', kind: 'mcq', q: 'Where does the transfer to restore the petty cash imprest appear in the main (three-column) cash book?',
      options: ['Credit side, bank column', 'Debit side, bank column', 'Credit side, discount column', 'Debit side, cash column'], answer: 0,
      why: 'Money leaves the bank account to top up petty cash, so it is a payment: the credit (payments) side of the cash book, in the bank column.' },
    { skill: 'definition', kind: 'mcq', q: 'Which statement describes the imprest system?',
      options: ['The float is restored to a fixed amount at the end of each period', 'The petty cashier asks for money whenever the box is empty', 'Every petty cash payment must be paid by cheque', 'The float is increased by the amount spent each month'], answer: 0,
      why: 'Under the imprest system the petty cashier begins every period with the same fixed float, because the amount spent is reimbursed at the end of the period.' },
    { skill: 'definition', kind: 'mcq', q: 'Under the imprest system, the amount given to the petty cashier at the end of a period is equal to…',
      options: ['the amount spent during the period', 'the cash left in the box', 'the full amount of the float', 'the float plus the amount spent'], answer: 0,
      why: 'Restoring the spending puts the cash back to the fixed float. Giving the cash left or the whole float again would leave the wrong balance.' },
    { skill: 'double-entry', kind: 'mcq', q: 'Which account is debited when the petty cash imprest is restored from the bank?',
      options: ['Petty cash', 'Bank', 'Postage', 'Capital'], answer: 0,
      why: 'Petty cash receives the money, so the petty cash book (account) is debited and bank is credited.' },
    { skill: 'double-entry', kind: 'mcq', q: 'A bookkeeper recorded the petty cash top-up of $164 as debit bank, credit petty cash. What is the effect?',
      options: ['The entries are reversed: bank and petty cash are both wrong by $328', 'There is no effect because the amounts are equal', 'Only the petty cash book is wrong, by $164', 'Only the bank account is wrong, by $164'], answer: 0,
      why: 'Bank should have been credited $164 but was debited $164, a difference of $328; petty cash is wrong by $328 the other way. The top-up must be debit petty cash, credit bank.' },
    { skill: 'definition', kind: 'mcq', q: 'Which is an advantage of the imprest system for controlling petty cash?',
      options: ['At any time, cash plus vouchers should equal the float', 'The petty cashier never needs to keep vouchers', 'It removes the need to keep a main cash book', 'It increases the float automatically each month'], answer: 0,
      why: 'Because the float is fixed, cash in the box plus the vouchers for payments should always add up to the imprest. Any shortfall is easy to spot.' },
    { skill: 'restore-amount', kind: 'mcq', q: 'Anwar has an imprest of $250. The box contains $63 and his vouchers total $187. A colleague says the top-up should be $63. Which mistake has the colleague made?',
      options: ['Using the cash left instead of the amount spent', 'Adding the spending to the float', 'Using the float instead of the cash left', 'Debiting bank instead of petty cash'], answer: 0,
      why: 'The top-up must equal the amount spent ($187), bringing the $63 left back up to $250. $63 is the cash left.' },
    { skill: 'cash-book-side', kind: 'mcq', q: 'The petty cash top-up of $142 is drawn from the bank. In which two places is it recorded?',
      options: ['Petty cash book receipts; cash book bank payments', 'Petty cash book payments; cash book bank receipts', 'Petty cash book receipts; cash book bank receipts', 'Petty cash book payments; cash book bank payments'], answer: 0,
      why: 'Petty cash receives $142 (receipts, debit side) and the bank pays it out (cash book credit side, bank column).' },
    { skill: 'float-from-data', kind: 'mcq', q: 'A petty cashier starts each month with $120 and is reimbursed $96.40 at the month end. How much cash was in the box just before the reimbursement?',
      options: ['$23.60', '$96.40', '$120.00', '$216.40'], answer: 0,
      why: 'Under the imprest system the reimbursement equals spending, so cash left = $120.00 − $96.40 = $23.60.' },
    { skill: 'cash-book-side', kind: 'mcq', q: 'The petty cash top-up is paid from office cash, not the bank. Where is it recorded in the main cash book?',
      options: ['Credit side, cash column', 'Credit side, bank column', 'Debit side, cash column', 'Debit side, bank column'], answer: 0,
      why: 'The money leaves the main cash, so the cash book is credited in its cash column; petty cash is debited.' },
    { skill: 'definition', kind: 'mcq', q: 'At the start of each month, how much should a petty cashier on the imprest system hold?',
      options: ['The same fixed amount every month', 'Whatever was left at the end of the last month', 'Last month’s spending plus a 10% margin', 'An amount set by each month’s first voucher'], answer: 0,
      why: 'The imprest system restores the float to the same fixed amount at the end of every period, so each period starts with that amount.' },
    { skill: 'restore-amount', kind: 'mcq', q: 'Which pair of facts is enough to work out the imprest top-up?',
      options: ['The float and the cash left in the box', 'The cash left and the number of vouchers', 'The float and the number of vouchers', 'The cash left and the bank balance'], answer: 0,
      why: 'Top-up = float − cash left (the amount spent). The number of vouchers or the bank balance does not give the amount spent.' }
  ] };

  // ---------- ACC-REC-23 ----------
  B['ACC-REC-23'] = { title: 'Defining capital and revenue expenditure', items: [
    S('define-capital', 'Which is the best definition of capital expenditure?',
      'Spending on buying or improving non-current assets', ['Money the owner puts into the business', 'Spending on the everyday running costs of the whole business', 'Money received from selling goods to customers'],
      'Capital expenditure buys or improves non-current assets that will be used for more than one year. Money introduced by the owner is capital, not capital expenditure.'),
    S('define-revenue', 'Which is the best definition of revenue expenditure?',
      'Spending on day-to-day running costs that benefit the current year', ['Money earned from the sale of goods and services', 'Spending on non-current assets that will be used for several years', 'Money borrowed from a bank to run the business'],
      'Revenue expenditure is money spent on running the business, with the benefit used up within the current year. It is money spent, not money earned.'),
    S('difference', 'Which sentence states a correct difference between capital and revenue expenditure?',
      'Capital expenditure benefits more than one year, whereas revenue expenditure benefits only the current year', ['Capital expenditure is paid in cash, whereas revenue expenditure is always bought on credit terms from suppliers', 'Capital expenditure is money earned, whereas revenue expenditure is money spent', 'Capital expenditure appears in the income statement, whereas revenue expenditure does not'],
      'A full difference compares both sides. The benefit of capital expenditure lasts beyond one year; revenue expenditure is used up in the year. Method of payment is irrelevant.'),
    S('placement', 'Where is capital expenditure shown in the financial statements?',
      'As a non-current asset in the statement of financial position', ['As an expense in the income statement', 'As a current liability in the statement of financial position', 'As part of revenue in the income statement'],
      'Capital expenditure creates or improves a non-current asset, so it is shown in the statement of financial position; its cost is then spread over the asset’s life by depreciation.'),
    S('placement', 'Where is revenue expenditure shown in the financial statements?',
      'As an expense in the income statement of that year', ['As a non-current asset in the statement of financial position', 'As a deduction from equity in the statement of financial position', 'As a current asset in the statement of financial position'],
      'Revenue expenditure is a running cost, so it is charged as an expense in the income statement for the year in which it is incurred, reducing profit.'),
    S('misconceptions', 'A student writes: “Capital expenditure is the money the owner invests in the business.” What is wrong?',
      'That describes capital, not capital expenditure', ['That describes revenue expenditure', 'That describes a bank loan', 'Nothing: the definition is correct'],
      'Money introduced by the owner is capital (equity). Capital expenditure is spending by the business on buying or improving non-current assets.'),
    S('misconceptions', 'A student writes: “Revenue expenditure is the income a business earns from sales.” What is wrong?',
      'Revenue expenditure is money spent, not money earned', ['Revenue expenditure is only spending on assets', 'Revenue expenditure is only spending on inventory', 'Nothing: the definition is correct'],
      'Revenue is income from sales; revenue expenditure is money spent on running the business, such as wages, rent and repairs.'),
    M('define-capital', 'Which of these are examples of capital expenditure?',
      ['Buying a delivery van', 'Building an extension to a warehouse', 'Paying staff wages', 'Paying for fuel', 'Paying rent on an office'], [0, 1],
      'A van and a warehouse extension are non-current assets that benefit the business for several years. Wages, fuel and rent are running costs (revenue expenditure).'),
    M('define-revenue', 'Which of these are examples of revenue expenditure?',
      ['Insurance on the shop', 'Repairs to a broken machine', 'Buying new shop fittings', 'Installing a new machine', 'Buying a plot of land'], [0, 1],
      'Insurance and repairs are running costs that keep the business going this year. Fittings, installation of a new machine and land create or improve non-current assets.'),
    S('justify', 'Odette paid $3,200 to install a new oven in her bakery. Why is this treated as capital expenditure?',
      'It gets a non-current asset ready for use over several years', ['It is a running cost of baking and selling bread during this year', 'It was paid in cash on the day the oven arrived', 'It is a cost that will not happen again next year'],
      'Installation is part of the cost of bringing the oven into use. The oven will benefit the bakery for several years, so the installation is capitalised with it.'),
    S('justify', 'Why are repairs to a delivery van treated as revenue expenditure?',
      'They restore the van to its working state and do not improve it', ['They increase the van’s value above the original cost it was bought for', 'They make the van last longer than originally expected', 'They are paid to a garage instead of the supplier'],
      'Repairs keep the van working as before. They do not create or improve a non-current asset, so they are charged as an expense in the income statement.'),
    S('justify', 'Wei treats the $45,000 cost of a new machine as an expense in this year’s income statement. What is the effect?',
      'Profit is understated and non-current assets are understated', ['Profit is overstated and non-current assets are overstated', 'Profit is understated and non-current assets are overstated', 'Profit and non-current assets are both unaffected'],
      'Charging capital expenditure as an expense reduces this year’s profit too much, and the machine is missing from the statement of financial position, so non-current assets are too low.'),
    S('justify', 'Elif records $1,800 of repairs to her shop roof as an addition to premises. What is the effect?',
      'Profit is overstated and non-current assets are overstated', ['Profit is understated and non-current assets are understated', 'Profit is overstated and non-current assets are understated', 'Profit and non-current assets are both unaffected'],
      'Repairs are revenue expenditure. Treating them as capital leaves the expense out of the income statement (profit too high) and adds them to premises (non-current assets too high).'),
    S('difference', 'Complete the sentence: “Capital expenditure is shown in the statement of financial position, whereas revenue expenditure is shown in the…”',
      'income statement', ['statement of financial position', 'trial balance only', 'sales day book'],
      'The comparison is between statements: capital expenditure becomes a non-current asset in the statement of financial position; revenue expenditure is an expense in the income statement.'),
    S('define-capital', 'Which phrase best completes the definition: “Capital expenditure is spending on non-current assets that…”',
      'will be used by the business for more than one year', ['will be sold to customers at a profit', 'will be used up within the current year', 'will be paid for in the following year'],
      'The key feature is the time span: non-current assets bought with capital expenditure are used in the business for more than one financial year.'),
    S('define-revenue', 'Which phrase best completes the definition: “Revenue expenditure is spending on running costs whose benefit…”',
      'is used up within the current year', ['lasts for several years', 'is shown in the statement of financial position', 'increases the value of non-current assets'],
      'Revenue expenditure gives a benefit that is consumed in the current accounting period, so it is an expense of that year.'),
    S('difference', 'Which pair gives one example of each correctly (capital first, then revenue)?',
      'Computer equipment; electricity bill', ['Electricity bill; computer equipment', 'Staff wages; delivery van', 'Shop extension; new shop fittings'],
      'Computer equipment is a non-current asset (capital). An electricity bill is a running cost (revenue). The shop extension and new fittings are both capital.'),
    S('justify', 'Pablo paid $650 to deliver a new machine to his factory. Why should this be included in the cost of the machine?',
      'It is part of the cost of getting the machine ready for use', ['It is a regular running cost of the factory', 'Delivery costs are always revenue expenditure', 'The supplier added it to the same invoice as the machine itself'],
      'Costs needed to bring a new non-current asset into use, such as delivery and installation, are capital expenditure and form part of the asset’s cost.'),
    S('placement', 'How does capital expenditure on a machine affect profit over the years?',
      'Its cost reduces profit gradually through depreciation', ['Its full cost reduces profit in the year of purchase', 'It never affects profit at any time', 'It increases profit in the year of purchase'],
      'The machine is recorded as a non-current asset and its cost is spread over its useful life as a depreciation expense, so profit is reduced year by year.'),
    S('misconceptions', 'Which statement about capital and revenue expenditure is correct?',
      'Revenue expenditure reduces the profit of the year it is incurred', ['Capital expenditure is always larger in amount than revenue expenditure', 'Capital expenditure is recorded only when paid in cash', 'Revenue expenditure is recorded as a non-current asset'],
      'Revenue expenditure is an expense in that year’s income statement. Size and method of payment do not decide the classification; the nature and the time span of the benefit do.'),
    S('difference', 'Which is a correct “whereas” comparison for capital and revenue expenditure?',
      'Capital expenditure buys or improves non-current assets, whereas revenue expenditure pays running costs', ['Capital expenditure pays running costs, whereas revenue expenditure buys non-current assets', 'Capital expenditure is money owed to suppliers, whereas revenue expenditure is money owned by the business', 'Capital expenditure is a liability, whereas revenue expenditure is an asset of the business'],
      'A difference answer gives both halves: what capital expenditure is spent on, and what revenue expenditure is spent on.'),
    S('justify', 'Tunde spends $8,000 adding a second floor to his shop. Why is this capital expenditure?',
      'It improves the premises and benefits several years', ['It keeps the premises in their existing condition for the next year', 'It is spent only once in the year', 'It was financed by a bank loan'],
      'An extension adds to the premises and gives benefits for many years, so it is capital expenditure. How it was financed does not matter.')
  ] };

  // ---------- ACC-REC-22 ----------
  var CR_ASSETS = {
    van: { name: 'a new delivery van', cap: [['Purchase price of the van', 18000, 36000, 100], ['Delivery charge for the van', 200, 700, 10], ['Painting the business name on the new van', 300, 900, 10], ['Shelving fitted inside the new van', 400, 1500, 10]],
      rev: [['Fuel for the first month', 150, 600, 10], ['Insurance for the first year', 600, 1800, 10], ['Extended warranty', 300, 900, 10], ['Annual vehicle licence', 150, 400, 10], ['First service after 6 months', 150, 400, 10]] },
    machine: { name: 'a new packing machine', cap: [['Purchase price of the machine', 12000, 40000, 100], ['Delivery of the machine', 300, 900, 10], ['Installation of the machine', 500, 2000, 10], ['Concrete base built for the machine', 400, 1500, 10]],
      rev: [['Annual maintenance contract', 400, 1500, 10], ['Electricity to run the machine for a month', 100, 500, 10], ['Lubricating oil', 50, 250, 10], ['Repair of a broken belt', 100, 600, 10]] },
    premises: { name: 'new shop premises', cap: [['Purchase price of the premises', 90000, 200000, 1000], ['Legal fees on buying the premises', 1500, 4500, 10], ['Building a storage extension', 8000, 25000, 100], ['New shop fittings', 3000, 9000, 10]],
      rev: [['Interest on the loan used to buy the premises', 2000, 7000, 10], ['Business rates for the year', 1000, 4000, 10], ['Repainting the shop front', 600, 2000, 10], ['Building insurance for the year', 500, 1800, 10]] },
    computers: { name: 'new office computers', cap: [['Purchase price of the computers', 4000, 12000, 100], ['Delivery of the computers', 80, 300, 10], ['Installation and network set-up', 300, 1200, 10]],
      rev: [['Printer ink and paper', 80, 400, 10], ['Repairs to a damaged screen', 100, 400, 10], ['Annual antivirus subscription', 60, 250, 10]] }
  };
  function crPick(key, nc, nr) {
    var a = CR_ASSETS[key];
    var cap = shuf(a.cap.slice(1)).slice(0, nc - 1); cap.unshift(a.cap[0]);
    var rev = shuf(a.rev).slice(0, nr);
    var items = cap.map(function (c) { return { d: c[0], v: step(c[1], c[2], c[3]), k: 'C' }; }).concat(rev.map(function (r) { return { d: r[0], v: step(r[1], r[2], r[3]), k: 'R' }; }));
    return { name: a.name, items: shuf(items) };
  }
  function crTable(items) { return table(['Item', '$'], items.map(function (x) { return [x.d, num(x.v)]; })); }
  var ALL_CAP = [], ALL_REV = [];
  Object.keys(CR_ASSETS).forEach(function (k) { CR_ASSETS[k].cap.forEach(function (c) { ALL_CAP.push(c[0]); }); CR_ASSETS[k].rev.forEach(function (r) { ALL_REV.push(r[0]); }); });

  B['ACC-REC-22'] = { title: 'Is it capital or revenue expenditure?', items: [
    { skill: 'calc-totals', gen: function () {
      var s = crPick('van', rint(3, 4), rint(2, 3)), nm = pick(NAMES);
      var cap = s.items.filter(function (x) { return x.k === 'C'; }), t = sum(cap.map(function (x) { return x.v; }));
      return numQ(nm + ' bought ' + s.name + ' and paid the following. Calculate the total capital expenditure. Give your answer in $.' + crTable(s.items), t,
        'Capital: ' + cap.map(function (x) { return x.d.toLowerCase() + ' $' + num(x.v); }).join(' + ') + ' = $' + num(t) + '. Running costs such as fuel, insurance, licences, servicing and warranties are revenue expenditure.');
    } },
    { skill: 'calc-totals', gen: function () {
      var s = crPick('machine', rint(3, 4), rint(2, 3)), nm = pick(NAMES);
      var cap = s.items.filter(function (x) { return x.k === 'C'; }), t = sum(cap.map(function (x) { return x.v; }));
      var rv = sum(s.items.filter(function (x) { return x.k === 'R'; }).map(function (x) { return x.v; }));
      return moneyMcq(nm + '’s factory bought ' + s.name + '. The costs were as follows. What is the total capital expenditure?' + crTable(s.items), t,
        [t + rv, Math.max.apply(null, cap.map(function (x) { return x.v; })), t - cap[cap.length - 1].v + rv],
        'Capital expenditure is everything needed to buy the machine and get it working: ' + cap.map(function (x) { return '$' + num(x.v); }).join(' + ') + ' = $' + num(t) + '. Maintenance, electricity, oil and repairs are revenue.');
    } },
    { skill: 'calc-totals', gen: function () {
      var s = crPick('premises', rint(2, 3), rint(2, 3)), nm = pick(NAMES);
      var rev = s.items.filter(function (x) { return x.k === 'R'; }), t = sum(rev.map(function (x) { return x.v; }));
      return numQ(nm + ' bought ' + s.name + '. During the first year the following were paid. Calculate the total revenue expenditure. Give your answer in $.' + crTable(s.items), t,
        'Revenue: ' + rev.map(function (x) { return x.d.toLowerCase() + ' $' + num(x.v); }).join(' + ') + ' = $' + num(t) + '. Loan interest is a cost of borrowing, so it is revenue even though the loan bought premises; legal fees on purchase are capital.');
    } },
    { skill: 'calc-totals', gen: function () {
      var nm = pick(NAMES), price = step(5000, 12000, 100), del = step(80, 300, 10), inst = step(300, 1000, 10), sup = step(150, 400, 10), yrs = rint(2, 4), ink = step(80, 300, 10);
      var t = sup * yrs + ink;
      return numQ(nm + ' bought new office computers for $' + num(price) + ', paying $' + num(del) + ' for delivery and $' + num(inst) + ' for installation. ' + nm + ' also paid $' + num(ink) + ' for printer ink and paper, and paid in advance for a support contract costing $' + num(sup) + ' per year for ' + yrs + ' years. Calculate the total revenue expenditure. Give your answer in $.', t,
        'Revenue: support $' + num(sup) + ' × ' + yrs + ' = $' + num(sup * yrs) + ', plus ink and paper $' + num(ink) + ' = $' + num(t) + '. The price, delivery and installation are capital expenditure.');
    } },
    { skill: 'single-item', gen: function () {
      var c = pick(ALL_CAP.filter(function (x) { return !/Purchase price/.test(x); })), r = shuf(ALL_REV).slice(0, 3);
      return mcq('Which item is capital expenditure?', c, r,
        '“' + c + '” buys, prepares or improves a non-current asset, so it is capital expenditure. The other items are running costs (revenue expenditure).');
    } },
    { skill: 'single-item', gen: function () {
      var r = pick(ALL_REV), c = shuf(ALL_CAP.filter(function (x) { return !/Purchase price/.test(x); })).slice(0, 3);
      return mcq('Which item is revenue expenditure?', r, c,
        '“' + r + '” is a running cost that benefits only the current period, so it is revenue expenditure. The others are part of the cost of getting a non-current asset ready, or improving it.');
    } },
    { skill: 'select-all', gen: function () {
      var key = pick(['van', 'machine', 'premises']), a = CR_ASSETS[key];
      var cap = shuf(a.cap.slice(1)).slice(0, rint(2, 3)).map(function (x) { return x[0]; }), rev = shuf(a.rev).slice(0, 5 - cap.length).map(function (x) { return x[0]; });
      return { kind: 'multi', q: 'A business has just bought ' + a.name + '. Which of these costs are capital expenditure?', options: cap.concat(rev), answers: cap.map(function (_, i) { return i; }),
        why: 'Capital: ' + cap.join('; ') + ' (getting the asset ready or improving it). Revenue: ' + rev.join('; ') + ' (running or keeping the asset going).' };
    } },
    { skill: 'select-all', gen: function () {
      var key = pick(['van', 'machine', 'computers']), a = CR_ASSETS[key];
      var rev = shuf(a.rev).slice(0, rint(2, 3)).map(function (x) { return x[0]; }), cap = shuf(a.cap).slice(0, 5 - rev.length).map(function (x) { return x[0]; });
      return { kind: 'multi', q: 'A business has just bought ' + a.name + '. Which of these costs are revenue expenditure?', options: rev.concat(cap), answers: rev.map(function (_, i) { return i; }),
        why: 'Revenue: ' + rev.join('; ') + '. These keep the asset running and benefit only the current period. The rest are capital expenditure.' };
    } },
    { skill: 'calc-totals', gen: function () {
      var nm = pick(NAMES), price = step(20000, 34000, 100), del = step(200, 600, 10), sign = step(300, 800, 10), fuel = step(200, 500, 10), ins = step(700, 1600, 10), resign = step(200, 500, 10);
      var t = price + del + sign;
      return numQ(nm + ' bought a van for $' + num(price) + ' plus delivery of $' + num(del) + ', and paid $' + num(sign) + ' to have the business logo painted on it. In the same year ' + nm + ' paid $' + num(fuel) + ' for fuel, $' + num(ins) + ' for insurance and $' + num(resign) + ' to repaint the logo after it was scratched. What should the van be recorded at in the statement of financial position, before depreciation? Give your answer in $.', t,
        'Cost = price $' + num(price) + ' + delivery $' + num(del) + ' + first logo $' + num(sign) + ' = $' + num(t) + '. Fuel, insurance and repainting a damaged logo are revenue expenditure.');
    } },
    { skill: 'pairs', kind: 'mcq', q: 'Which pair is classified correctly (capital, revenue)?',
      options: ['Installing a new machine; servicing the machine', 'Servicing a machine; installing a new machine', 'Repairing a roof; building an extension', 'Insuring a van; delivering a new van'], answer: 0,
      why: 'Installing a new machine gets it ready for use (capital). Servicing keeps it running (revenue). The other pairs are the wrong way round.' },
    { skill: 'pairs', kind: 'mcq', q: 'A bakery paid legal fees when buying its new premises and interest on the loan used to buy them. How are they classified?',
      options: ['Legal fees capital; loan interest revenue', 'Legal fees revenue; loan interest capital', 'Both are capital expenditure', 'Both are revenue expenditure'], answer: 0,
      why: 'Legal fees are part of the cost of acquiring the premises (capital). Interest is a cost of borrowing money and is charged each year as an expense (revenue).' },
    { skill: 'pairs', kind: 'mcq', q: 'A florist has her shop name painted on a newly bought van and, two years later, has it repainted after it faded. How are the two costs classified?',
      options: ['First painting capital; repainting revenue', 'First painting revenue; repainting capital', 'Both are capital expenditure', 'Both are revenue expenditure'], answer: 0,
      why: 'The first sign is part of preparing the new van for use (capital). Repainting restores it to its earlier condition (revenue).' },
    { skill: 'single-item', kind: 'mcq', q: 'Which of these is capital expenditure for a hotel?',
      options: ['Adding ten new bedrooms', 'Replacing broken window glass', 'Repainting the reception area', 'Paying the receptionist’s wages'], answer: 0,
      why: 'Adding bedrooms extends the building and benefits many future years. Replacing glass and repainting restore the building; wages are a running cost.' },
    { skill: 'single-item', kind: 'mcq', q: 'A clothes shop buys rails and shelving for $2,600 and dresses for resale for $5,400. How are these classified?',
      options: ['Rails and shelving capital; dresses revenue', 'Rails and shelving revenue; dresses capital', 'Both are capital expenditure', 'Both are revenue expenditure'], answer: 0,
      why: 'Shelving is a non-current asset (fixtures and fittings). Goods bought for resale are purchases (inventory), which is revenue expenditure.' },
    { skill: 'pairs', kind: 'mcq', q: 'A builder buys a cement mixer with a 3-year extended warranty. How is the warranty classified?',
      options: ['Revenue expenditure', 'Capital expenditure', 'Part of the mixer’s cost', 'A non-current liability'], answer: 0,
      why: 'An extended warranty covers future running and repair of the asset, so it is revenue expenditure, even though it was bought with the mixer.' },
    { skill: 'select-all', kind: 'multi', q: 'A gym has just bought new treadmills. Which costs are capital expenditure?',
      options: ['Delivery of the treadmills', 'Fixing the treadmills to the floor', 'Electricity used by the treadmills', 'Cleaning the treadmills each week', 'Replacing a worn belt after a year'], answers: [0, 1],
      why: 'Delivery and fixing them in place get the new treadmills ready for use (capital). Electricity, cleaning and replacing worn parts are running costs (revenue).' },
    { skill: 'single-item', kind: 'mcq', q: 'Which item is revenue expenditure for a taxi business?',
      options: ['New tyres to replace worn ones', 'Buying an extra taxi', 'Fitting a meter to a new taxi', 'Painting the logo on a new taxi'], answer: 0,
      why: 'Replacing worn tyres keeps an existing taxi running (revenue). Buying a taxi and fitting or painting a new one are capital expenditure.' },
    { skill: 'pairs', kind: 'mcq', q: 'A factory has its old roof repaired and also builds a new loading bay. Which classification is correct?',
      options: ['Roof repair revenue; loading bay capital', 'Roof repair capital; loading bay revenue', 'Both are capital expenditure', 'Both are revenue expenditure'], answer: 0,
      why: 'Repairing the roof restores the building (revenue). A new loading bay is an improvement that benefits future years (capital).' },
    { skill: 'calc-totals', kind: 'mcq', q: 'Ines bought a coffee machine for $6,800, paid $240 for delivery, $310 for installation and $95 for the first month’s coffee beans. What is the total capital expenditure?',
      options: ['$7,350', '$7,445', '$7,040', '$6,800'], answer: 0,
      why: 'Capital = $6,800 + $240 + $310 = $7,350. Coffee beans are a running cost (revenue).' },
    { skill: 'select-all', kind: 'multi', q: 'Which of these are revenue expenditure for a delivery business?',
      options: ['Wages of the van drivers', 'Interest on a loan for new vans', 'Fuel for the vans', 'Buying two more vans', 'Fitting racks inside the new vans'], answers: [0, 1, 2],
      why: 'Wages, loan interest and fuel are running costs. Buying vans and fitting racks in new vans are capital expenditure.' },
    { skill: 'single-item', kind: 'mcq', q: 'Which item is capital expenditure for a restaurant?',
      options: ['Extractor fan installed in a new kitchen', 'Food bought for this week’s meals', 'Cleaning the extractor fan', 'Repairing a cracked tile'], answer: 0,
      why: 'Installing equipment in a new kitchen creates a non-current asset. Food, cleaning and repairs are revenue expenditure.' },
    { skill: 'pairs', kind: 'mcq', q: 'A printing firm pays to train a new employee and to upgrade a printer so it can print twice as fast. Which classification is most appropriate?',
      options: ['Training revenue; upgrade capital', 'Training capital; upgrade revenue', 'Both are capital expenditure', 'Both are revenue expenditure'], answer: 0,
      why: 'Training staff is a running cost (revenue). Upgrading the printer improves its capacity beyond its original state, which is capital expenditure.' }
  ] };

  // ---------- ACC-ADJ-01 ----------
  var CAUSES = ['Wear and tear', 'Obsolescence', 'Passage of time', 'Depletion'];
  function cause(q, right, why) { return S('identify-cause', q, right, CAUSES.filter(function (c) { return c !== right; }), why); }
  B['ACC-ADJ-01'] = { title: 'Why non-current assets lose value (causes of depreciation)', items: [
    cause('A courier company’s delivery van has been driven 140,000 km and its engine and brakes are worn. Which cause of depreciation does this show?', 'Wear and tear',
      'Heavy use wears out the parts of the van, which is wear and tear (physical deterioration through usage).'),
    cause('A design studio’s computers still work, but new software will not run on them because faster models are now standard. Which cause of depreciation is this?', 'Obsolescence',
      'The computers are out of date because better technology has appeared. That is obsolescence, even though they are not worn out.'),
    cause('A business pays for a 6-year lease on a warehouse. Each year one-sixth of the lease runs out, however much the warehouse is used. Which cause of depreciation is this?', 'Passage of time',
      'A lease loses value simply because time passes and it gets closer to its end date, whatever the level of use.'),
    cause('A company owns a gravel pit. Each year more gravel is dug out and sold, so less remains. Which cause of depreciation is this?', 'Depletion',
      'Depletion is the using up of a natural resource as it is extracted, as with a gravel pit, mine or quarry.'),
    cause('A bakery’s mixing machine runs 12 hours a day and its blades and motor are gradually wearing down. Which cause of depreciation is this?', 'Wear and tear',
      'Constant use wears out the machine’s parts. This is wear and tear from usage.'),
    cause('A shop’s till cannot accept the contactless card payments customers now expect, so it is replaced although it still works. Which cause of depreciation is this?', 'Obsolescence',
      'The till has become out of date because of technological change, not because it is worn out.'),
    cause('A firm buys the right to use a design for 8 years. After 8 years the right expires. Which cause of depreciation applies?', 'Passage of time',
      'The right is limited by time; it loses value as each year passes, regardless of how much it is used.'),
    cause('A timber business owns a forest. Trees are felled and sold each year, so the forest’s value falls. Which cause of depreciation is this?', 'Depletion',
      'Felling and selling the trees uses up a natural resource, which is depletion.'),
    cause('A tool-hire shop rents out its carpet cleaners almost every day, and their brushes and pumps are wearing out. Which cause of depreciation best describes this?', 'Wear and tear',
      'Constant use by customers wears out the parts of the machines. That is wear and tear (deterioration through usage).'),
    cause('A printing firm’s machine works perfectly, but the firm now prints large posters that the machine cannot handle. Which cause of depreciation is this?', 'Obsolescence',
      'The machine no longer suits the needs of the business, so it has become obsolete (inadequate) even though it is not worn out.'),
    M('select-causes', 'Which of these are causes of depreciation?',
      ['Wear and tear', 'Obsolescence', 'Depletion', 'Reducing balance', 'Spreading the cost over the useful life'], [0, 1, 2],
      'Wear and tear, obsolescence and depletion explain why an asset loses value. Reducing balance is a method of calculating depreciation, and spreading the cost is the purpose of charging it.'),
    M('select-causes', 'Which of these are causes of the fall in value of a non-current asset?',
      ['Passage of time', 'Usage', 'Straight line method', 'Saving money to replace the asset', 'Matching costs with revenue'], [0, 1],
      'Passage of time and usage (wear and tear) are causes. The straight line method is a calculation method, saving money is a common misconception, and matching is a reason for charging depreciation.'),
    S('cause-vs-method', 'A student is asked for one cause of depreciation and writes “straight line”. Why does this earn no mark?',
      'It is a method of calculating depreciation, not a cause', ['It is a cause, but only for buildings', 'It is a cause, but must be spelled “straight-line”', 'It is a concept, not a type of asset'],
      'Straight line and reducing balance are ways of calculating the charge. A cause explains why the value falls: wear and tear, obsolescence, passage of time or depletion.'),
    S('cause-vs-purpose', 'Which answer gives a cause of depreciation rather than a reason for charging it?',
      'The asset becomes out of date as technology improves', ['The cost is spread over the years that benefit', 'Profit would otherwise be overstated', 'Cost is matched with the revenue earned'],
      'Becoming out of date (obsolescence) is why the value falls. The other options explain why a business records depreciation (accruals and prudence).'),
    S('distinct-causes', 'A student gives two causes of depreciation: “usage” and “wear and tear”. Why might only one mark be awarded?',
      'They are the same idea in different words', ['Usage is not a cause of depreciation at all', 'Wear and tear only applies to buildings', 'Two causes are never accepted together'],
      'Usage and wear and tear describe the same cause, so they count only once. A second mark needs a different idea such as obsolescence or passage of time.'),
    S('distinct-causes', 'Which pair gives two genuinely different causes of depreciation?',
      'Wear and tear; obsolescence', ['Wear and tear; physical use', 'Usage; physical deterioration', 'Obsolescence; out of date'],
      'Wear and tear and obsolescence are separate causes. The other pairs repeat one idea in different words.'),
    S('identify-cause', 'Which asset is most likely to lose value mainly through depletion?',
      'A copper mine', ['A delivery van', 'A ten-year lease', 'A laptop computer'],
      'A mine is a natural resource that is used up as copper is extracted. Vans wear out, leases expire with time and laptops become obsolete.'),
    S('identify-cause', 'Which asset is most likely to lose value mainly through obsolescence?',
      'A mobile phone used by sales staff', ['A quarry', 'A 5-year licence', 'A road surface used by lorries'],
      'Phones are quickly overtaken by newer models, so they become out of date. A quarry is depleted, a licence expires with time and a road surface wears.'),
    S('cause-vs-purpose', 'A student is asked to state a cause of depreciation and writes “to provide funds to replace the asset”. Which is the best comment?',
      'This is not a cause, and depreciation does not provide funds', ['This is a cause linked to obsolescence', 'This is correct, as replacement is a cause', 'This is a cause linked to wear and tear'],
      'A cause explains why value falls (for example wear and tear). Depreciation is not a fund of cash for replacement, so the answer earns no credit.'),
    S('identify-cause', 'Which statement about passage of time as a cause of depreciation is correct?',
      'An asset can lose value even if it is hardly used', ['It only applies to natural resources', 'It means the asset has worn out through use', 'It means a newer model has been invented'],
      'Some assets, such as leases, lose value just because time passes, whatever the level of use. Natural resources are depleted; use is wear and tear; newer models cause obsolescence.'),
    S('distinct-causes', 'A student writes “the asset gets old” as a cause. How could this be improved to earn a mark clearly?',
      'Say “passage of time” or “wear and tear through use”', ['Say “straight line” or “reducing balance”', 'Say “to spread the cost over its life”', 'Say “the asset is sold at a loss”'],
      '“Gets old” is vague. Linking it to the passage of time or to wear and tear names a recognised cause.'),
    M('select-causes', 'A taxi firm’s cars lose value. Which of these could be causes?',
      ['The cars are driven many kilometres each year', 'New electric models make the cars out of date', 'The firm uses the reducing balance method', 'The firm wants to save for new cars'], [0, 1],
      'Heavy use is wear and tear and newer electric models cause obsolescence. The method chosen and saving for replacement do not cause the cars to lose value.')
  ] };

  // ---------- ACC-ADJ-02 ----------
  B['ACC-ADJ-02'] = { title: 'Why businesses charge depreciation', items: [
    S('purpose', 'What is the main purpose of charging depreciation on non-current assets?',
      'To spread the asset’s cost over its useful life', ['To set aside enough cash to replace the asset when it wears out', 'To show what the asset could be sold for', 'To record the cash paid for the asset each year'],
      'Depreciation allocates the cost of an asset to the years that use it. It does not save cash, does not show market value and involves no cash payment.'),
    S('accruals', 'How does charging depreciation apply the accruals (matching) concept?',
      'The cost of using the asset is charged in the years it helps to earn revenue', ['The asset is recorded at what it could be sold for at the end of each financial year', 'Cash is set aside each year to buy a replacement asset', 'The asset’s full cost is charged in the year it is bought'],
      'An asset helps to earn revenue over several years, so its cost is spread over those same years and matched against that revenue.'),
    S('prudence', 'How does charging depreciation apply the prudence concept?',
      'It prevents profit and non-current assets from being overstated', ['It makes profit as high as possible each year', 'It shows non-current assets at the price they could be sold for today', 'It records the asset only when it has been paid for'],
      'Without depreciation, the fall in value would be ignored, so profit and the carrying value of assets would be shown too high. Prudence avoids overstating them.'),
    S('misconceptions', 'Ahmad says, “I charge depreciation so I will have cash to buy a new van.” Why is he wrong?',
      'Depreciation is a non-cash expense and saves no money', ['Depreciation is paid into the bank each year as a separate fund', 'Depreciation is only charged on buildings', 'Depreciation increases the cash balance'],
      'Depreciation is a book entry: debit income statement, credit provision for depreciation. No cash leaves or is set aside, so it does not fund a replacement.'),
    S('misconceptions', 'Which statement about the carrying value of an asset is correct?',
      'It is cost less accumulated depreciation, not its market value', ['It is the amount the asset could be sold for today on the open market', 'It is the cost of replacing the asset with a new one', 'It is the cash set aside for the asset’s replacement'],
      'Carrying value (net book value) is cost minus depreciation charged so far. It is not a selling or replacement price.'),
    { skill: 'effect', gen: function () {
      var nm = pick(NAMES), p = step(18000, 60000, 10), d = step(1500, 9000, 10);
      return numQ(nm + ' calculated a profit for the year of $' + num(p) + ' but forgot to charge depreciation of $' + num(d) + ' on equipment. What is the correct profit for the year? Give your answer in $.', p - d,
        'Depreciation is an expense, so it reduces profit: $' + num(p) + ' − $' + num(d) + ' = $' + num(p - d) + '. Leaving it out overstated profit, which breaks the prudence concept.');
    } },
    { skill: 'effect', gen: function () {
      var nm = pick(NAMES), cost = step(20000, 60000, 1000), acc = step(cost * 0.2, cost * 0.5, 100), d = step(cost * 0.1, cost * 0.2, 100);
      return moneyMcq(nm + '’s machinery cost $' + num(cost) + ' and accumulated depreciation before this year was $' + num(acc) + '. This year’s depreciation of $' + num(d) + ' has not yet been recorded. What carrying value should be shown in the statement of financial position?', cost - acc - d,
        [cost - acc, cost - d, cost], 'Carrying value = cost − all depreciation to date = $' + num(cost) + ' − ($' + num(acc) + ' + $' + num(d) + ') = $' + num(cost - acc - d) + '. Without this year’s charge, the asset would be overstated.');
    } },
    S('accruals', 'A machine costing $50,000 will help a factory earn revenue for 5 years. Under the accruals concept, how should its cost be treated?',
      'Charged across the 5 years in which it earns revenue', ['Charged in full in the year it is bought', 'Charged in full in the year it is sold', 'Never charged as an expense at all'],
      'Matching means the cost of using the machine is charged in the same years as the revenue it helps to earn, so it is spread over its 5-year life.'),
    S('effect', 'What is the effect on the financial statements if a business does not charge depreciation?',
      'Profit and non-current assets are both overstated', ['Profit and non-current assets are both understated', 'Profit is overstated; non-current assets are understated', 'Profit is understated; non-current assets are overstated'],
      'Depreciation is an expense (reduces profit) and is deducted from the asset’s cost (reduces carrying value). Leaving it out makes both too high.'),
    S('purpose', 'Where does the yearly depreciation charge appear?',
      'As an expense in the income statement', ['As revenue in the income statement', 'As a current liability', 'As a current asset'],
      'Each year’s charge is an expense that reduces profit. Accumulated depreciation is deducted from cost in the statement of financial position.'),
    S('misconceptions', 'A student writes: “Depreciation shows the value the asset could be sold for.” What is the best correction?',
      'It allocates cost over the asset’s life; it is not a market value', ['It shows the cost of a brand new replacement asset', 'It shows the cash spent on repairing the asset during the whole year', 'It shows the total of the asset’s running costs'],
      'Depreciation spreads cost; the resulting carrying value is not intended to equal what the asset would fetch if sold.'),
    S('prudence', 'Which sentence develops the prudence reason for charging depreciation?',
      'Assets lose value, so without depreciation profit and asset values would be too high', ['Assets are used over many years, so their cost is matched with each year’s revenue earned', 'Assets are recorded at cost, so the money paid is shown in the accounts', 'Assets are shown in the statement of financial position, so owners can see them'],
      'Prudence is about not overstating profit or assets. The second option explains accruals (matching), not prudence.'),
    S('accruals', 'Which sentence develops the accruals reason for charging depreciation?',
      'The asset earns revenue for several years, so its cost is spread over them', ['The asset may fall in value, so profits and asset values must not be overstated', 'The asset may become obsolete, so it should be replaced soon', 'The asset is owned by the business, not by the owner personally'],
      'Accruals (matching) links each year’s revenue with the cost of the resources used to earn it, so the cost is spread over the asset’s useful life.'),
    S('purpose', 'Why is it unfair to charge the whole $30,000 cost of a 6-year asset in the year of purchase?',
      'That year’s profit would be too low and later years too high', ['That year’s profit would be too high and later years too low', 'The asset would be shown at too high a value that year', 'The trial balance totals would no longer agree'],
      'The asset benefits 6 years. Charging it all at once understates profit in year 1 and overstates profit in years 2–6; spreading the cost matches it with revenue.'),
    S('misconceptions', 'Which is NOT a reason for charging depreciation?',
      'To show the asset’s current selling price', ['To apply the accruals concept', 'To apply the prudence concept', 'To spread the cost over the useful life'],
      'Depreciation is charged to match cost with revenue (accruals), to avoid overstating profit and assets (prudence), and so spreads the cost over the useful life. It does not produce a selling price.'),
    { skill: 'accruals', gen: function () {
      var nm = pick(NAMES), yrs = pick([4, 5, 8]), c = step(2000, 9000, 500), cost = c * yrs;
      return numQ(nm + ' buys a machine for $' + num(cost) + ' that will help to earn revenue for ' + yrs + ' years, with no residual value. Instead of charging depreciation, ' + nm + ' charges the whole cost as an expense in year 1. The cost should have been spread equally over the ' + yrs + ' years (straight line). By how much is year 1 profit <b>understated</b>? Give your answer in $.', cost - c,
        'Matching spreads the cost over the ' + yrs + ' years: $' + num(cost) + ' ÷ ' + yrs + ' = $' + num(c) + ' a year. Charging $' + num(cost) + ' in year 1 makes the expense $' + num(cost) + ' − $' + num(c) + ' = $' + num(cost - c) + ' too high, so profit is understated by that amount (and overstated in later years).');
    } },
    S('prudence', 'Kalinda’s accounts show machinery at its original cost of $40,000, although it has been used for 3 years. Which concept has she failed to apply?',
      'Prudence, because the asset value is overstated', ['Business entity, because the machine is hers', 'Money measurement, because cost is in dollars', 'Materiality, because the machine is expensive'],
      'Without depreciation the machinery is shown above its carrying value and profit has been too high, so the accounts are not prudent.'),
    S('purpose', 'Which of these best describes depreciation?',
      'An expense allocating an asset’s cost over its useful life', ['A cash payment made to the asset’s supplier', 'A fund of money kept in the bank for the asset’s replacement', 'A gain made when an asset is sold'],
      'Depreciation is a non-cash expense that allocates the cost of the asset over the years it is used.'),
    S('effect', 'Depreciation for the year is $4,600. Which double entry records it?',
      'Debit income statement; credit provision for depreciation', ['Debit provision for depreciation; credit income statement', 'Debit bank; credit provision for depreciation', 'Debit income statement; credit bank'],
      'The charge is an expense (debit income statement) and builds up accumulated depreciation (credit provision for depreciation). No cash is involved.'),
    S('misconceptions', 'Which statement about depreciation and cash is correct?',
      'Depreciation reduces profit but not the bank balance', ['Depreciation reduces both profit and the bank balance', 'Depreciation increases the bank balance', 'Depreciation reduces the bank balance but not profit'],
      'Depreciation is a book entry. The cash was spent when the asset was bought; the yearly charge reduces profit only.'),
    M('purpose', 'Which of these are valid reasons for a business to charge depreciation?',
      ['To match the cost of the asset with the revenue it helps earn', 'To avoid overstating profit and non-current assets', 'To build up cash to replace the asset', 'To show the asset at its market value'], [0, 1],
      'Matching (accruals) and avoiding overstatement (prudence) are the reasons. Depreciation neither builds up cash nor shows market value.'),
    S('accruals', 'A van is expected to be used for 4 years. Which approach matches its cost with revenue?',
      'Charge part of its cost in each of the 4 years', ['Charge all its cost in the first year', 'Charge all its cost when it is sold', 'Charge only its running costs each year'],
      'Under the accruals concept, the cost of the van is spread over the 4 years in which it helps earn revenue.')
  ] };

  // ---------- ACC-ADJ-03 ----------
  B['ACC-ADJ-03'] = { title: 'Choosing between straight line and reducing balance, and changing method', items: [
    M('name-methods', 'Which are methods of calculating depreciation named in the specification?',
      ['Straight line', 'Reducing balance', 'Obsolescence', 'Depletion', 'Accruals'], [0, 1],
      'Straight line and reducing balance (diminishing balance) are the two methods. Obsolescence and depletion are causes; accruals is a concept.'),
    S('pattern', 'Which statement describes the reducing balance method?',
      'A fixed % of carrying value, so the charge falls each year', ['The same amount is charged every year of the asset’s life', 'A fixed % of cost, so the charge rises each year', 'The asset’s full cost is charged in its final year'],
      'Reducing balance applies a fixed percentage to the carrying value at the start of each year. As the carrying value falls, so does the charge.'),
    S('pattern', 'Which statement describes the straight line method?',
      'The same charge each year of the asset’s useful life', ['A fixed % of carrying value, so the charge falls', 'A larger charge each year as the asset gets older', 'A charge only in the year the asset is sold'],
      'Straight line spreads (cost − residual value) equally over the useful life, giving an equal charge every year.'),
    S('suitability', 'For which asset is the reducing balance method usually most suitable?',
      'Delivery vans that lose most value early and need more repairs later', ['Office desks and chairs that are used evenly and steadily for many years', 'A 10-year lease used evenly over its life', 'Shelving that wears out at a steady rate'],
      'Vans lose most of their value in the first years and repair costs rise later; a falling depreciation charge balances this. Evenly used assets suit straight line.'),
    S('suitability', 'For which asset is the straight line method usually most suitable?',
      'A 5-year lease on a shop, used evenly', ['A computer that becomes outdated quickly', 'A van that loses half its value in year one', 'A machine used most in its early years'],
      'A lease gives the same benefit each year, so an equal charge matches cost with benefit. The others lose value faster early on.'),
    S('consistency', 'Mira wants to change her depreciation method every year to the one that gives the highest profit. Which concept does this break?',
      'Consistency', ['Business entity', 'Money measurement', 'Materiality'],
      'Consistency requires the same method to be used from year to year so that results can be compared. Changing to flatter profit makes comparison meaningless.'),
    S('consistency', 'Why should a business normally keep the same depreciation method from year to year?',
      'So that results can be compared fairly between years', ['So that the asset’s market value is shown', 'So that the asset is replaced at the right time in future', 'So that depreciation provides replacement cash'],
      'Applying the consistency concept means profit figures are worked out the same way each year and can be compared.'),
    S('effect-profit', 'A business switches from straight line to reducing balance for a new asset. What is the usual effect on profit in the early years?',
      'Lower profit, because the early charges are higher', ['Higher profit, because the early charges are lower', 'No effect, because total depreciation is identical', 'Higher profit, because no depreciation is charged'],
      'Reducing balance gives larger charges in the first years, so expenses are higher and profit for the year is lower in those years.'),
    S('effect-cv', 'Compared with straight line, how does reducing balance usually affect the carrying value of an asset in the early years?',
      'Carrying value is lower, as more depreciation is charged early', ['Carrying value is higher, as less depreciation is charged early', 'Carrying value is the same, as cost is unchanged', 'Carrying value rises over time under reducing balance'],
      'Higher early charges build up accumulated depreciation faster, so cost − accumulated depreciation is smaller in the statement of financial position.'),
    S('effect-profit', 'In the later years of an asset’s life, how does reducing balance compare with straight line?',
      'Smaller charges, so profit tends to be higher than under straight line', ['Larger charges, so profit tends to be lower than under straight line', 'Identical charges, so profit is the same under both methods', 'No charges at all, as the asset is fully depreciated'],
      'Under reducing balance the charge keeps falling, so in later years it is often below the straight line charge, and profit is higher.'),
    S('consistency', 'Which is a good reason for changing the depreciation method?',
      'The pattern of the asset’s use has changed, and the change is disclosed', ['The owner wants this year’s profit to look higher to impress the bank manager', 'The bank manager prefers round numbers', 'The bookkeeper finds straight line quicker'],
      'A change is acceptable only for a genuine reason, such as a change in how the asset gives benefits, and the effect should be explained so comparisons remain fair.'),
    { skill: 'compare-calc', gen: function () {
      var nm = pick(NAMES), cost = step(12000, 60000, 1000), sl = pick([10, 20, 25]), rb = pick([20, 30, 40].filter(function (r) { return r > sl; }));
      var a = cost * sl / 100, b = cost * rb / 100;
      return numQ(nm + ' buys a machine for $' + num(cost) + '. Option 1: straight line at ' + sl + '% of cost. Option 2: reducing balance at ' + rb + '%. By how much would profit for year 1 be lower under option 2? Give your answer in $.', b - a,
        'Year 1 charges: straight line ' + sl + '% × $' + num(cost) + ' = $' + num(a) + '; reducing balance ' + rb + '% × $' + num(cost) + ' = $' + num(b) + '. Profit is $' + num(b - a) + ' lower under option 2.');
    } },
    { skill: 'compare-calc', gen: function () {
      var nm = pick(NAMES), cost = step(15000, 60000, 1000), sl = pick([10, 15, 20]), rb = pick([20, 30, 40]);
      var s3 = cost * sl / 100, r3 = R.roundDp(cost * Math.pow(1 - rb / 100, 2) * rb / 100, 0);
      if (s3 === r3) { sl = sl === 20 ? 10 : 20; s3 = cost * sl / 100; }
      var hi = r3 < s3 ? 'Reducing balance' : 'Straight line', d = Math.abs(s3 - r3);
      var lo = hi === 'Straight line' ? 'Reducing balance' : 'Straight line', d1 = Math.abs(cost * (rb - sl) / 100);
      if (d1 === d || d1 === 0) d1 = d + 500;
      return mcq(nm + ' is comparing two methods for equipment costing $' + num(cost) + ': straight line at ' + sl + '% of cost, or reducing balance at ' + rb + '%. Which method gives the higher profit for <b>year 3</b>, and by how much?',
        hi + ', by $' + num(d), [lo + ', by $' + num(d), hi + ', by $' + num(d1), lo + ', by $' + num(d1)],
        'Year 3 straight line: ' + sl + '% × $' + num(cost) + ' = $' + num(s3) + '. Reducing balance: carrying value at start of year 3 = $' + num(cost) + ' × ' + (1 - rb / 100) + ' × ' + (1 - rb / 100) + ' = $' + num(cost * Math.pow(1 - rb / 100, 2)) + '; × ' + rb + '% = $' + num(r3) + '. The lower charge gives the higher profit: ' + hi.toLowerCase() + ', by $' + num(d) + '.');
    } },
    { skill: 'compare-calc', gen: function () {
      var nm = pick(NAMES), cost = step(20000, 50000, 1000), sl = pick([20, 25]), rb = pick([30, 40]);
      var cvS = cost - 2 * cost * sl / 100, cvR = R.roundDp(cost * Math.pow(1 - rb / 100, 2), 0);
      return numQ(nm + ' bought a van for $' + num(cost) + '. After 2 years, what is the difference between its carrying value using straight line at ' + sl + '% of cost and using reducing balance at ' + rb + '%? Give your answer in $.', Math.abs(cvS - cvR),
        'Straight line: $' + num(cost) + ' − 2 × $' + num(cost * sl / 100) + ' = $' + num(cvS) + '. Reducing balance: $' + num(cost) + ' × ' + (1 - rb / 100) + ' × ' + (1 - rb / 100) + ' = $' + num(cvR) + '. Difference = $' + num(Math.abs(cvS - cvR)) + '.');
    } },
    S('effect-profit', 'Over an asset’s whole life, with the same cost and similar residual value, what mainly differs between the two methods?',
      'The timing of the charges between the years', ['The total cost of buying the asset', 'The cash paid out each year for the asset by the business', 'Whether the asset appears in the accounts'],
      'Both methods spread roughly the same total amount; reducing balance charges more early and less later. The cost and the cash spent are unchanged.'),
    S('suitability', 'Why might reducing balance better apply the accruals concept for a machine used heavily when new?',
      'The machine gives more benefit early, so more cost is charged early', ['The machine gives equal benefit each year, so the charge is equal', 'The machine’s market value is shown at each year end', 'The machine is replaced as soon as it is fully paid for'],
      'If most of the benefit (revenue earned) comes in the early years, charging more depreciation then matches cost with benefit.'),
    S('suitability', 'A firm’s vans need few repairs when new but many when old. Why does reducing balance help here?',
      'High early depreciation plus low repairs, then the reverse, evens out total cost', ['Low early depreciation plus low repairs keeps early profit as high as possible', 'It removes the need to pay for repairs in later years of use', 'It makes the vans’ repair costs capital expenditure instead'],
      'Falling depreciation plus rising repairs gives a more even total cost each year, which matches the van’s cost with its use more fairly.'),
    S('consistency', 'Ravi changed from straight line to reducing balance this year without telling anyone. Profit fell. What is the main problem for users of his accounts?',
      'This year’s profit cannot be fairly compared with last year’s', ['The trial balance will no longer agree after the change of method', 'Revenue will have been recorded twice', 'The asset will be removed from the accounts'],
      'Changing method breaks consistency. Part of the fall in profit is caused by the method, not by trading, so comparisons are misleading.'),
    S('effect-cv', 'An asset is depreciated using reducing balance at 25%. What happens to its carrying value?',
      'It falls every year but never quite reaches zero', ['It falls by the same amount each year', 'It reaches zero after exactly 4 years', 'It stays the same once it is half of cost'],
      'Each year 25% of the remaining carrying value is charged, leaving 75%. The value keeps falling by smaller amounts and never reaches zero.'),
    S('pattern', 'A van costing $30,000 is depreciated at 20% a year. Which pair of year 1 and year 2 charges shows the reducing balance method?',
      '$6,000 then $4,800', ['$6,000 then $6,000', '$4,800 then $6,000', '$6,000 then $1,200'],
      'Year 1: 20% × $30,000 = $6,000. Year 2: 20% × ($30,000 − $6,000) = $4,800. Equal charges would be straight line.'),
    S('consistency', 'Which advice best applies the consistency concept to a proposed method change?',
      'Keep the current method unless a change gives a fairer view, and explain any change', ['Change the method every year so that the reported profit grows steadily and smoothly', 'Use whichever method gives the lowest tax that year', 'Use both methods together and add the charges'],
      'Consistency means keeping the same method so results are comparable. A change is acceptable only if it gives a more appropriate view, and its effect is explained.'),
    S('effect-profit', 'Yaw proposes changing from reducing balance to straight line for a 2-year-old machine. In the coming year, straight line will give a higher charge. What is the effect?',
      'Profit falls and the carrying value is lower', ['Profit rises and the carrying value is higher', 'Profit falls but the carrying value is higher', 'Profit and carrying value are unchanged'],
      'A higher depreciation charge is a larger expense (lower profit) and adds more to accumulated depreciation (lower carrying value).')
  ] };

  // ---------- dates and policies ----------
  // e = year-end month (1-12). Financial year label = calendar year in which that financial year ends.
  function fyOf(y, m, e) { return m <= e ? y : y + 1; }
  function dstr(d, m, y) { return d + ' ' + MONTHS[m - 1] + ' ' + y; }
  function ye(e, fy) { return dstr(MDAYS[e - 1], e, fy); }
  var POLICY = 'The policy is to charge a full year’s depreciation in the year an asset is bought and nothing in the year it is sold.';
  var ASSETS = ['machine', 'delivery van', 'printing press', 'forklift truck', 'coffee roaster', 'tractor', 'food truck', 'kiln'];

  // ---------- ACC-ADJ-04 ----------
  B['ACC-ADJ-04'] = { title: 'Calculating depreciation and carrying value', items: [
    { skill: 'sl-charge', gen: function () {
      var L = pick([4, 5, 6, 8, 10]), a = step(1000, 7000, 100), r = step(0, 4000, 500), cost = a * L + r, nm = pick(NAMES), as = pick(ASSETS);
      return numQ(nm + ' buys a ' + as + ' for $' + num(cost) + '. It is expected to last ' + L + ' years' + (r ? ' and then be sold for $' + num(r) : ', with no residual value') + '. Calculate the annual depreciation charge using the straight line method. Give your answer in $.', a,
        '(Cost − residual value) ÷ useful life = ($' + num(cost) + ' − $' + num(r) + ') ÷ ' + L + ' = $' + num(a) + ' a year.');
    } },
    { skill: 'carrying-value', gen: function () {
      var cost = step(10000, 60000, 1000), r = pick([10, 15, 20, 25]), n = rint(2, 3), nm = pick(NAMES);
      if (cost === 40000 && r === 25 && n === 2) cost = 44000;
      var acc = cost * r / 100 * n, cv = cost - acc, rb = R.roundDp(cost * Math.pow(1 - r / 100, n), 0);
      return moneyMcq(nm + ' buys equipment for $' + num(cost) + ' and depreciates it at ' + r + '% a year (straight line method). What is its carrying value after ' + n + ' full years?', cv,
        [acc, rb, cost - cost * r / 100], 'Each year: ' + r + '% × $' + num(cost) + ' = $' + num(cost * r / 100) + '. After ' + n + ' years accumulated depreciation is $' + num(acc) + ', so carrying value = $' + num(cost) + ' − $' + num(acc) + ' = $' + num(cv) + '.');
    } },
    { skill: 'rb-charge', gen: function () {
      var r = pick([10, 20, 25, 30, 40]), cost = r === 25 ? step(12000, 60000, 4000) : step(10000, 60000, 1000), nm = pick(NAMES);
      var y1 = cost * r / 100, y2 = (cost - y1) * r / 100;
      return numQ(nm + ' buys a ' + pick(ASSETS) + ' for $' + num(cost) + ' and depreciates it at ' + r + '% a year (reducing balance method). Calculate the depreciation charge for the <b>second</b> year. Give your answer in $.', y2,
        'Year 1: ' + r + '% × $' + num(cost) + ' = $' + num(y1) + ', leaving $' + num(cost - y1) + '. Year 2: ' + r + '% × $' + num(cost - y1) + ' = $' + num(y2) + '.');
    } },
    { skill: 'carrying-value', gen: function () {
      var cost = step(10000, 50000, 1000), r = pick([10, 20, 30, 40]), nm = pick(NAMES), f = 1 - r / 100;
      var v1 = cost * f, v2 = R.roundDp(v1 * f, 0), v3 = R.roundDp(cost * f * f * f, 0);
      return numQ(nm + '’s ' + pick(ASSETS) + ' cost $' + num(cost) + '. It is depreciated at ' + r + '% per annum on the reducing balance. Calculate its carrying value at the end of year 3. Give your answer in $.', v3,
        'Each year the carrying value is multiplied by ' + f + ': $' + num(cost) + ' → $' + num(v1) + ' → $' + num(v2) + ' → $' + num(v3) + '.');
    } },
    { skill: 'accumulated', gen: function () {
      var r = pick([20, 25, 30, 40]), cost = r === 25 ? step(12000, 60000, 4000) : step(10000, 60000, 1000), nm = pick(NAMES);
      var y1 = cost * r / 100, y2 = (cost - y1) * r / 100;
      return numQ(nm + ' depreciates vehicles at ' + r + '% a year (reducing balance method). A vehicle cost $' + num(cost) + '. Calculate the accumulated depreciation on it after 2 years. Give your answer in $.', y1 + y2,
        'Year 1: $' + num(y1) + '. Year 2: ' + r + '% × ($' + num(cost) + ' − $' + num(y1) + ') = $' + num(y2) + '. Accumulated = $' + num(y1) + ' + $' + num(y2) + ' = $' + num(y1 + y2) + '.');
    } },
    { skill: 'part-year', gen: function () {
      var m = rint(2, 11), r = pick([10, 20, 25]), cost = step(12000, 60000, 1200), y = rint(2026, 2028), nm = pick(NAMES);
      var months = 13 - m, c = cost * r / 100 * months / 12;
      return numQ(nm + ' bought a ' + pick(ASSETS) + ' on 1 ' + MONTHS[m - 1] + ' ' + y + ' for $' + num(cost) + '. Depreciation is ' + r + '% per annum on cost (straight line), calculated monthly. The financial year ends on 31 December. Calculate the depreciation charge for the year ended 31 December ' + y + '. Give your answer in $.', c,
        'The asset was owned for ' + months + ' months of the year: ' + r + '% × $' + num(cost) + ' × ' + months + '/12 = $' + num(c) + '.');
    } },
    { skill: 'part-year', gen: function () {
      var e = pick([3, 6, 9]), y = rint(2022, 2024), bm = rint(1, 12), cost = step(10000, 40000, 1000), r = pick([10, 20, 25]), nm = pick(NAMES);
      var fyB = fyOf(y, bm, e), k = rint(2, 4), fyS = fyB + k;
      var sm = e === 12 ? rint(1, 12) : rint(1, 12), sy;
      // choose a sale date inside financial year fyS
      sy = sm <= e ? fyS : fyS - 1;
      var acc = cost * r / 100 * k;
      return numQ(nm + '’s financial year ends on ' + MDAYS[e - 1] + ' ' + MONTHS[e - 1] + '. A ' + pick(ASSETS) + ' bought on 1 ' + MONTHS[bm - 1] + ' ' + y + ' for $' + num(cost) + ' was sold on 15 ' + MONTHS[sm - 1] + ' ' + sy + '. Depreciation is ' + r + '% per annum on cost. ' + POLICY + ' Calculate the total depreciation charged on this asset. Give your answer in $.', acc,
        'Financial years charged: the year ending ' + ye(e, fyB) + ' (year of purchase) up to the year ending ' + ye(e, fyS - 1) + ', which is ' + k + ' years; none in the year of sale. ' + k + ' × ' + r + '% × $' + num(cost) + ' = $' + num(acc) + '.');
    } },
    { skill: 'sl-charge', gen: function () {
      var cA = step(10000, 40000, 1000), rA = pick([10, 20]), cB = step(10000, 40000, 1000), vB = step(cB * 0.5, cB * 0.8, 1000), rB = pick([20, 25, 30]), nm = pick(NAMES);
      var dA = cA * rA / 100, dB = vB * rB / 100;
      return numQ(nm + ' owns two machines. Machine X cost $' + num(cA) + ' and is depreciated at ' + rA + '% per annum straight line. Machine Y cost $' + num(cB) + ', is depreciated at ' + rB + '% per annum reducing balance and had a carrying value of $' + num(vB) + ' at the start of this year. Calculate the total depreciation charge for this year. Give your answer in $.', dA + dB,
        'Machine X: ' + rA + '% × $' + num(cA) + ' = $' + num(dA) + '. Machine Y: ' + rB + '% × $' + num(vB) + ' (carrying value, not cost) = $' + num(dB) + '. Total = $' + num(dA + dB) + '.');
    } },
    { skill: 'sl-charge', gen: function () {
      var r = pick([5, 10, 12.5, 20, 25]), cost = step(8000, 64000, 1600), c = cost * r / 100, nm = pick(NAMES);
      return { kind: 'num', q: nm + '’s equipment cost $' + num(cost) + ' and is depreciated by the straight line method with no residual value. The annual charge is $' + num(c) + '. What percentage of cost is charged each year?', answer: r, unit: '%', tol: 0.05, display: String(r),
        why: 'Rate = annual charge ÷ cost × 100 = $' + num(c) + ' ÷ $' + num(cost) + ' × 100 = ' + r + '%.' };
    } },
    { skill: 'rb-charge', gen: function () {
      var cost = step(20000, 60000, 1000), acc = step(cost * 0.2, cost * 0.6, 1000), r = pick([20, 25, 30, 40]), nm = pick(NAMES);
      var c = (cost - acc) * r / 100;
      return moneyMcq(nm + '’s vehicles cost $' + num(cost) + ' and accumulated depreciation at the start of the year is $' + num(acc) + '. Depreciation is ' + r + '% per annum on the reducing balance. What is this year’s charge?', c,
        [cost * r / 100, acc * r / 100, (cost + acc) * r / 100], 'Reducing balance uses the carrying value: ' + r + '% × ($' + num(cost) + ' − $' + num(acc) + ') = ' + r + '% × $' + num(cost - acc) + ' = $' + num(c) + '.');
    } },
    { skill: 'accumulated', gen: function () {
      var y = rint(2025, 2027), m = pick([4, 7, 10]), cost = step(12000, 48000, 1200), r = pick([10, 20]), nm = pick(NAMES);
      var monthsFirst = 13 - m, totalMonths = monthsFirst + 24, acc = cost * r / 100 * totalMonths / 12;
      return numQ(nm + ' bought a ' + pick(ASSETS) + ' on 1 ' + MONTHS[m - 1] + ' ' + y + ' for $' + num(cost) + '. Depreciation is ' + r + '% per annum straight line, charged monthly. The year end is 31 December. Calculate the accumulated depreciation at 31 December ' + (y + 2) + '. Give your answer in $.', acc,
        'Months owned: ' + monthsFirst + ' in ' + y + ' + 12 + 12 = ' + totalMonths + ' months. ' + r + '% × $' + num(cost) + ' × ' + totalMonths + '/12 = $' + num(acc) + '.');
    } },
    { skill: 'carrying-value', gen: function () {
      var L = pick([4, 5, 8, 10]), a = step(1000, 6000, 100), res = step(500, 4000, 500), cost = a * L + res, n = rint(2, L - 1), nm = pick(NAMES);
      return numQ(nm + ' bought a ' + pick(ASSETS) + ' for $' + num(cost) + ' with an expected residual value of $' + num(res) + ' after ' + L + ' years. Using the straight line method, what is its carrying value after ' + n + ' years? Give your answer in $.', cost - a * n,
        'Annual charge = ($' + num(cost) + ' − $' + num(res) + ') ÷ ' + L + ' = $' + num(a) + '. After ' + n + ' years: $' + num(cost) + ' − ' + n + ' × $' + num(a) + ' = $' + num(cost - a * n) + '.');
    } },
    { skill: 'carrying-value', gen: function () {
      var cost = step(10000, 50000, 1000), r = pick([20, 40]), nm = pick(NAMES), f = 1 - r / 100;
      var cv = R.roundDp(cost * f * f, 0), sl = cost - 2 * cost * r / 100;
      return moneyMcq(nm + ' depreciates a ' + pick(ASSETS) + ' costing $' + num(cost) + ' at ' + r + '% a year (reducing balance method). What is its carrying value after 2 years?', cv,
        [sl, cost - cv, cost * f], 'Year 1: $' + num(cost) + ' × ' + f + ' = $' + num(cost * f) + '. Year 2: $' + num(cost * f) + ' × ' + f + ' = $' + num(cv) + '. ($' + num(sl) + ' would be straight line.)');
    } },
    { skill: 'sl-charge', gen: function () {
      var L = pick([4, 5, 6, 8, 10]), a = step(800, 5000, 100), res = step(0, 3000, 500), cost = a * L + res, nm = pick(NAMES);
      return { kind: 'num', q: nm + '’s equipment cost $' + num(cost) + (res ? ' and has a residual value of $' + num(res) : ' and has no residual value') + '. Straight line depreciation is $' + num(a) + ' a year. What is its expected useful life in years?', answer: L, unit: 'years',
        why: 'Useful life = (cost − residual value) ÷ annual charge = ($' + num(cost) + ' − $' + num(res) + ') ÷ $' + num(a) + ' = ' + L + ' years.' };
    } },
    { skill: 'rb-charge', gen: function () {
      var cost = step(10000, 50000, 1000), r = pick([10, 20, 30, 40]), f = 1 - r / 100, nm = pick(NAMES);
      var v2 = R.roundDp(cost * f * f, 0), c3 = R.roundDp(v2 * r / 100, 0);
      return numQ(nm + ' bought a ' + pick(ASSETS) + ' for $' + num(cost) + '. Depreciation is ' + r + '% per annum on the reducing balance. Calculate the depreciation charge for year 3. Give your answer in $.', c3,
        'Carrying value at the start of year 3 = $' + num(cost) + ' × ' + f + ' × ' + f + ' = $' + num(v2) + '. Year 3 charge = ' + r + '% × $' + num(v2) + ' = $' + num(c3) + '.');
    } },
    { skill: 'sl-charge', gen: function () {
      var c0 = step(30000, 90000, 1000), add = step(8000, 30000, 1000), r = pick([10, 15, 20]), nm = pick(NAMES), mo = pick(['March', 'June', 'September']);
      var c = (c0 + add) * r / 100;
      return numQ('At the start of the year ' + nm + '’s fixtures cost $' + num(c0) + '. In ' + mo + ' more fixtures were bought for $' + num(add) + '. Depreciation is ' + r + '% per annum on cost, with a full year charged in the year of purchase. Nothing was sold. Calculate the depreciation charge for the year. Give your answer in $.', c,
        'With a full year in the year of purchase, depreciation is on all fixtures held at the year end: ' + r + '% × ($' + num(c0) + ' + $' + num(add) + ') = $' + num(c) + '.');
    } },
    S('carrying-value', 'Which formula gives the carrying value (net book value) of a non-current asset?',
      'Cost − accumulated depreciation', ['Cost − this year’s depreciation only', 'Cost + accumulated depreciation', 'Accumulated depreciation − residual value'],
      'Carrying value is the cost less all the depreciation charged since the asset was bought.'),
    S('rb-charge', 'A student calculates reducing balance depreciation at 20% on a $25,000 van as $5,000 every year. What mistake has been made?',
      'The rate was applied to cost instead of carrying value', ['The residual value was not deducted from cost', 'The rate should have been 20% of the profit', 'Nothing: this is the reducing balance method'],
      'Applying 20% to the original cost every year is the straight line method. Under reducing balance, year 2 is 20% × $20,000 = $4,000, and so on.'),
    S('accumulated', 'A machine has cost $36,000 and a carrying value of $21,600. What is its accumulated depreciation?',
      '$14,400', ['$21,600', '$57,600', '$36,000'],
      'Accumulated depreciation = cost − carrying value = $36,000 − $21,600 = $14,400.'),
    S('part-year', 'A business charges “a full year’s depreciation in the year of purchase and none in the year of disposal”. An asset is bought in the last month of year 1 and sold in the first month of year 4. For how many years is depreciation charged?',
      '3 years', ['2 years', '4 years', '2 years and 2 months'],
      'Years 1, 2 and 3 each receive a full charge (year 1 is the year of purchase). Year 4 is the year of disposal, so it has none.'),
    S('sl-charge', 'A $16,000 machine has a residual value of $2,000 and a 7-year life. A student charges $16,000 ÷ 7 per year. What has gone wrong?',
      'The residual value was not deducted first', ['The rate should be applied to carrying value', 'The life should have been 8 years', 'Straight line cannot have a residual value'],
      'Straight line charge = (cost − residual value) ÷ life = ($16,000 − $2,000) ÷ 7 = $2,000 a year.'),
    S('accumulated', 'Which statement about accumulated depreciation is correct?',
      'It is the total of all depreciation charged on the asset so far', ['It is the depreciation charged in the current year only', 'It is the amount the asset can be sold for today', 'It is the cash set aside to replace the asset'],
      'Accumulated depreciation builds up year by year; deducting it from cost gives the carrying value.')
  ] };

  // ---------- ACC-ADJ-05 ----------
  // Class of assets, straight line on cost, full year in year of purchase and none in year of disposal.
  function provScenario() {
    var e = pick([3, 6, 12]), fy = rint(2026, 2028), r = pick([10, 20, 25]), cls = pick(['Motor vehicles', 'Machinery', 'Equipment', 'Fixtures and fittings']);
    var cs = step(8000, 30000, 1000), k = rint(1, 3), ds = cs * r / 100 * k;
    var c0 = cs + step(30000, 120000, 1000), p0 = ds + step(c0 * 0.15, c0 * 0.35, 100);
    var cn = Math.random() < 0.6 ? step(8000, 30000, 1000) : 0;
    var charge = (c0 - cs + cn) * r / 100, bal = p0 - ds + charge;
    var sm = rint(1, 12), sy = sm <= e ? fy : fy - 1;
    var start = e === 12 ? dstr(1, 1, fy) : dstr(1, e + 1, fy - 1), end = ye(e, fy), next = e === 12 ? dstr(1, 1, fy + 1) : dstr(1, e + 1, fy);
    return { e: e, fy: fy, r: r, cls: cls, cs: cs, k: k, ds: ds, c0: c0, p0: p0, cn: cn, charge: charge, bal: bal, sale: dstr(rint(1, 28), sm, sy), start: start, end: end, next: next, nm: pick(NAMES) };
  }
  B['ACC-ADJ-05'] = { title: 'Provision for depreciation account', items: [
    { skill: 'balance-cd', gen: function () {
      var s = provScenario();
      return numQ('The ' + s.cls.toLowerCase() + ' – provision for depreciation account of ' + s.nm + ' had a balance of $' + num(s.p0) + ' on ' + s.start + '. During the year, an asset with accumulated depreciation of $' + num(s.ds) + ' was sold, and the depreciation charge for the year was $' + num(s.charge) + '. What is the balance c/d on ' + s.end + '? Give your answer in $.', s.bal,
        'Credit side: balance b/d $' + num(s.p0) + ' + income statement $' + num(s.charge) + '. Debit side: disposal $' + num(s.ds) + '. Balance c/d = $' + num(s.p0) + ' + $' + num(s.charge) + ' − $' + num(s.ds) + ' = $' + num(s.bal) + '.');
    } },
    { skill: 'is-charge', gen: function () {
      var s = provScenario();
      return numQ(s.nm + '’s ' + s.cls.toLowerCase() + ' cost $' + num(s.c0) + ' on ' + s.start + '. On ' + s.sale + ' an item costing $' + num(s.cs) + ' was sold' + (s.cn ? ', and new items costing $' + num(s.cn) + ' were bought during the year' : '') + '. Depreciation is ' + s.r + '% per annum on cost. ' + POLICY + ' What is the “Income statement” entry in the provision for depreciation account in the year to ' + s.end + '? Give your answer in $.', s.charge,
        'Charge on assets held at the year end: ' + s.r + '% × ($' + num(s.c0) + ' − $' + num(s.cs) + (s.cn ? ' + $' + num(s.cn) : '') + ') = ' + s.r + '% × $' + num(s.c0 - s.cs + s.cn) + ' = $' + num(s.charge) + '. The item sold gets no charge in the year of disposal.');
    } },
    { skill: 'disposal-entry', gen: function () {
      var s = provScenario(), bm = rint(1, 12);
      var fyS = fyOf(Number(s.sale.split(' ')[2]), MONTHS.indexOf(s.sale.split(' ')[1]) + 1, s.e), fyB = fyS - s.k;
      var item = { 'Motor vehicles': 'motor vehicle', 'Machinery': 'machine', 'Equipment': 'piece of equipment', 'Fixtures and fittings': 'set of shop fittings' }[s.cls];
      var by = bm <= s.e ? fyB : fyB - 1;
      return numQ(s.nm + '’s financial year ends on ' + MDAYS[s.e - 1] + ' ' + MONTHS[s.e - 1] + '. A ' + item + ' bought on ' + dstr(1, bm, by) + ' for $' + num(s.cs) + ' was sold on ' + s.sale + '. Depreciation is ' + s.r + '% per annum on cost. ' + POLICY + ' What amount is debited to the provision for depreciation account with the detail “Disposal”? Give your answer in $.', s.ds,
        'Years charged: from the year of purchase (ending ' + ye(s.e, fyB) + ') up to the year before the sale, ' + s.k + (s.k === 1 ? ' year' : ' years') + '. ' + s.k + ' × ' + s.r + '% × $' + num(s.cs) + ' = $' + num(s.ds) + '.');
    } },
    { skill: 'balance-cd', gen: function () {
      var s = provScenario();
      var dr = [[s.sale, 'Disposal', num(s.ds)], [s.end, 'Balance c/d', '?']], cr = [[s.start, 'Balance b/d', num(s.p0)], [s.end, 'Income statement', num(s.charge)]];
      return numQ('Complete ' + s.nm + '’s account. What is the missing balance c/d? Give your answer in $.' + tacct(s.cls + ' – Provision for Depreciation Account', dr, cr), s.bal,
        'Credit side total = $' + num(s.p0) + ' + $' + num(s.charge) + ' = $' + num(s.p0 + s.charge) + '. Balance c/d = $' + num(s.p0 + s.charge) + ' − $' + num(s.ds) + ' = $' + num(s.bal) + '.');
    } },
    { skill: 'balance-cd', gen: function () {
      var s = provScenario();
      return numQ('A provision for depreciation account has: balance b/d $' + num(s.p0) + ', disposal $' + num(s.ds) + ' and income statement $' + num(s.charge) + '. When the account is balanced, what total appears at the foot of <b>each</b> side? Give your answer in $.', s.p0 + s.charge,
        'The credit side holds balance b/d $' + num(s.p0) + ' + income statement $' + num(s.charge) + ' = $' + num(s.p0 + s.charge) + '. The debit side (disposal $' + num(s.ds) + ' + balance c/d $' + num(s.bal) + ') totals the same.');
    } },
    { skill: 'is-charge', gen: function () {
      var nm = pick(NAMES), r = pick([20, 25, 30]), c0 = step(60000, 120000, 1000), cs = step(8000, 25000, 1000), p0 = step(c0 * 0.3, c0 * 0.5, 100), ds = step(cs * 0.3, cs * 0.6, 100);
      var base = (c0 - cs) - (p0 - ds), ch = R.roundDp(base * r / 100, 0);
      return numQ(nm + ' depreciates vehicles at ' + r + '% per annum on the reducing balance, with no depreciation in the year of disposal. At the start of the year vehicles cost $' + num(c0) + ' with a provision for depreciation of $' + num(p0) + '. During the year a vehicle that cost $' + num(cs) + ', with depreciation to date of $' + num(ds) + ', was sold. No vehicles were bought. Calculate the depreciation charge for the year. Give your answer in $.', ch,
        'Carrying value of vehicles kept = ($' + num(c0) + ' − $' + num(cs) + ') − ($' + num(p0) + ' − $' + num(ds) + ') = $' + num(base) + '. Charge = ' + r + '% × $' + num(base) + ' = $' + num(ch) + '.');
    } },
    { skill: 'details', gen: function () {
      var s = provScenario();
      return mcq('How is the depreciation on the asset sold on ' + s.sale + ' ($' + num(s.ds) + ') recorded in the ' + s.cls.toLowerCase() + ' – provision for depreciation account?',
        'Debit side, detail “Disposal”', ['Credit side, detail “Disposal”', 'Debit side, detail “Income statement”', 'Debit side, detail “Bank”'],
        'The depreciation on the asset sold is removed from the provision (debit) and transferred to the disposal account, so the detail names the other account: Disposal.');
    } },
    { skill: 'balance-cd', gen: function () {
      var s = provScenario();
      return mcq('After balancing ' + s.nm + '’s ' + s.cls.toLowerCase() + ' – provision for depreciation account on ' + s.end + ', the balance c/d is $' + num(s.bal) + '. How is it brought down?',
        'Credit side, ' + s.next + ', “Balance b/d” $' + num(s.bal), ['Debit side, ' + s.next + ', “Balance b/d” $' + num(s.bal), 'Credit side, ' + s.end + ', “Balance b/d” $' + num(s.bal), 'Credit side, ' + s.next + ', “Income statement” $' + num(s.bal)],
        'A provision for depreciation has a credit balance. It is carried down on the debit side on the last day of the year and brought down on the credit side on the first day of the next year.');
    } },
    { skill: 'balance-cd', gen: function () {
      var s = provScenario();
      return numQ('On ' + s.end + ' the balance c/d on ' + s.nm + '’s provision for depreciation account was $' + num(s.bal) + '. During the year the income statement charge was $' + num(s.charge) + ' and $' + num(s.ds) + ' was transferred to disposal. What was the balance b/d on ' + s.start + '? Give your answer in $.', s.p0,
        'Opening balance + charge − disposal = closing balance, so opening = $' + num(s.bal) + ' − $' + num(s.charge) + ' + $' + num(s.ds) + ' = $' + num(s.p0) + '.');
    } },
    { skill: 'details', gen: function () {
      var s = provScenario(), wrong = rint(0, 2);
      var dr = [[s.sale, 'Disposal', num(s.ds)], [s.end, 'Balance c/d', num(s.bal)]], cr = [[s.start, 'Balance b/d', num(s.p0)], [s.end, 'Income statement', num(s.charge)]];
      var labels = ['Disposal ' + money(s.ds), 'Balance b/d ' + money(s.p0), 'Income statement ' + money(s.charge)];
      if (wrong === 0) { dr[0][1] = 'Bank'; labels[0] = 'Bank ' + money(s.ds); }
      if (wrong === 1) { dr = [[s.start, 'Balance b/d', num(s.p0)], [s.sale, 'Disposal', num(s.ds)], [s.end, 'Balance c/d', num(s.bal)]]; cr = [[s.end, 'Income statement', num(s.charge)]]; }
      if (wrong === 2) { cr[1][1] = 'Depreciation'; labels[2] = 'Depreciation ' + money(s.charge); }
      var why = ['The transfer of depreciation on the asset sold goes to the disposal account, so its detail must be “Disposal”, not “Bank”: no cash is involved.',
        'The opening balance of a provision for depreciation is a credit, so “Balance b/d” must be on the credit side.',
        'The yearly charge is transferred to the income statement, so the detail must be “Income statement”, not just “Depreciation”.'][wrong];
      return mcq('A trainee prepared this account. Which entry is wrong?' + tacct(s.cls + ' – Provision for Depreciation Account', dr, cr), labels[wrong],
        labels.filter(function (_, i) { return i !== wrong; }).concat(['Balance c/d ' + money(s.bal)]), why);
    } },
    S('opening-side', 'On which side of a provision for depreciation account is the opening balance shown?',
      'Credit side, as “Balance b/d”', ['Debit side, as “Balance b/d”', 'Credit side, as “Income statement”', 'Debit side, as “Balance c/d”'],
      'Accumulated depreciation is a credit balance, so the opening balance b/d is on the credit side on the first day of the year.'),
    S('is-charge', 'Which entries record the depreciation charge for the year?',
      'Debit income statement; credit provision for depreciation', ['Debit provision for depreciation; credit income statement', 'Debit provision for depreciation; credit asset cost account', 'Debit bank; credit provision for depreciation'],
      'The charge is an expense in the income statement and increases accumulated depreciation, which is a credit in the provision account.'),
    S('details', 'What detail is written next to the year’s depreciation charge in the provision for depreciation account?',
      'Income statement', ['Depreciation', 'Bank', 'Disposal'],
      'The detail names the other account in the double entry. The charge is transferred to the income statement.'),
    S('is-charge', 'A business charges no depreciation in the year of disposal. Why is the cost of an asset sold during the year left out of this year’s charge?',
      'It was not owned at the year end, so it gets no charge this year', ['Its depreciation is added to the income statement twice', 'It is depreciated using reducing balance instead', 'Its cost is charged in full as an expense instead'],
      'Under this policy only assets still held at the year end (including new ones) are depreciated for the year. Including the sold asset overstates the charge.'),
    S('disposal-entry', 'Why is the depreciation on an asset sold debited to the provision for depreciation account?',
      'It removes that asset’s depreciation and moves it to disposal', ['It records the cash received for the asset', 'It records this year’s depreciation expense', 'It increases accumulated depreciation on the asset'],
      'When an asset leaves the business, its accumulated depreciation must leave the provision account too; it is transferred to the disposal account.'),
    S('balance-cd', 'Where is the closing balance of a provision for depreciation account entered before it is brought down?',
      'Debit side, “Balance c/d”, last day of the year', ['Credit side, “Balance c/d”, last day of the year', 'Debit side, “Balance b/d”, first day of the year', 'Credit side, “Income statement”, last day of the year'],
      'The balancing figure for a credit-balance account is carried down on the debit side on the last day, then brought down on the credit side the next day.'),
    S('opening-side', 'What is the normal balance on a provision for depreciation account?',
      'A credit balance', ['A debit balance', 'A zero balance', 'A debit or a credit, alternately'],
      'Accumulated depreciation is built up by credits each year, so the account normally has a credit balance that is deducted from cost.'),
    S('details', 'Which pair of details would appear on the <b>debit</b> side of a provision for depreciation account in a year when an asset is sold?',
      'Disposal; Balance c/d', ['Balance b/d; Income statement', 'Bank; Balance c/d', 'Disposal; Income statement'],
      'The debit side holds the transfer to disposal and the closing balance c/d. Balance b/d and the income statement charge are on the credit side.'),
    S('is-charge', 'A provision for depreciation account for the year shows: balance b/d $18,400, disposal $5,200 and balance c/d $19,900. What was the income statement charge?',
      '$6,700', ['$1,500', '$5,200', '$24,100'],
      'Credits = debits: $18,400 + charge = $5,200 + $19,900 = $25,100, so the charge is $25,100 − $18,400 = $6,700.'),
    S('disposal-entry', 'Which entry does the provision for depreciation account receive when an asset is sold?',
      'A debit of the depreciation on the asset sold', ['A credit of the sale proceeds', 'A debit of the asset’s original cost', 'A credit of the profit on disposal'],
      'Only the depreciation on the asset sold goes through this account (debit). The cost goes from the cost account to disposal, and proceeds are credited to disposal.'),
    S('balance-cd', 'A provision for depreciation account’s credit side totals $31,500. The only debit entry before balancing is disposal $7,800. What is the balance c/d?',
      '$23,700', ['$39,300', '$31,500', '$7,800'],
      'Balance c/d = credit total − other debits = $31,500 − $7,800 = $23,700, entered on the debit side.'),
    S('details', 'A student writes “Asset sold” as the detail for the disposal transfer in the provision for depreciation account. What should it be?',
      'Disposal', ['Bank', 'Income statement', 'Balance c/d'],
      'The detail names the other account used in the double entry, which is the disposal account.')
  ] };

  // ---------- ACC-ADJ-06 ----------
  function dispSL() {
    var nm = pick(NAMES), as = pick(ASSETS), cost = step(8000, 50000, 1000), r = pick([10, 20, 25]), k = rint(1, Math.min(4, Math.floor(80 / r)));
    var dep = cost * r / 100 * k, cv = cost - dep, pl = step(-cv * 0.3, cv * 0.3, 50);
    if (pl === 0) pl = 250;
    if (cv + pl === cost) pl -= 100;
    return { nm: nm, as: as, cost: cost, r: r, k: k, dep: dep, cv: cv, proc: cv + pl, pl: pl };
  }
  function plText(x) { return x >= 0 ? 'profit of ' + money(x) : 'loss of ' + money(-x); }
  B['ACC-ADJ-06'] = { title: 'Disposal of non-current assets: cost, disposal and profit or loss on sale', items: [
    { skill: 'profit-loss', gen: function () {
      var d = dispSL();
      return mcq(d.nm + ' sold a ' + d.as + ' for $' + num(d.proc) + '. It had cost $' + num(d.cost) + ' and accumulated depreciation on it was $' + num(d.dep) + '. What was the result of the sale?',
        plText(d.pl).replace(/^./, function (c) { return c.toUpperCase(); }),
        [plText(-d.pl).replace(/^./, function (c) { return c.toUpperCase(); }), (d.proc - d.cost >= 0 ? 'Profit of ' + money(d.proc - d.cost) : 'Loss of ' + money(d.cost - d.proc)), 'Profit of ' + money(d.proc)],
        'Carrying value = $' + num(d.cost) + ' − $' + num(d.dep) + ' = $' + num(d.cv) + '. Proceeds $' + num(d.proc) + ' − carrying value $' + num(d.cv) + ' = ' + (d.pl >= 0 ? '$' + num(d.pl) + ', a profit.' : '−$' + num(-d.pl) + ', a loss.'));
    } },
    { skill: 'depreciation-to-date', gen: function () {
      var e = pick([3, 6, 12]), y = rint(2021, 2023), bm = rint(1, 12), r = pick([20, 30, 40]), cost = step(10000, 40000, 1000), nm = pick(NAMES);
      var fyB = fyOf(y, bm, e), k = rint(2, 3), fyS = fyB + k, sm = rint(1, 12), sy = sm <= e ? fyS : fyS - 1;
      var v = cost, dep = 0, parts = [];
      for (var i = 0; i < k; i++) { var c = R.roundDp(v * r / 100, 0); parts.push('$' + num(c)); dep += c; v -= c; }
      return numQ(nm + '’s year end is ' + MDAYS[e - 1] + ' ' + MONTHS[e - 1] + '. A ' + pick(ASSETS) + ' bought on 1 ' + MONTHS[bm - 1] + ' ' + y + ' for $' + num(cost) + ' was sold on 10 ' + MONTHS[sm - 1] + ' ' + sy + '. Depreciation is ' + r + '% per annum on the reducing balance. ' + POLICY + ' What amount of depreciation is credited to the disposal account? Give your answer in $.', dep,
        k + ' financial years are charged (the year of purchase onwards, none in the year of sale): ' + parts.join(' + ') + ' = $' + num(dep) + '.');
    } },
    { skill: 'profit-loss', gen: function () {
      var e = pick([3, 12]), y = rint(2021, 2023), bm = rint(1, 12), r = pick([20, 30]), cost = step(12000, 48000, 1000), nm = pick(NAMES);
      var fyB = fyOf(y, bm, e), k = rint(2, 3), fyS = fyB + k, sm = rint(1, 12), sy = sm <= e ? fyS : fyS - 1;
      var v = cost; for (var i = 0; i < k; i++) v -= R.roundDp(v * r / 100, 0);
      var proc = step(v * 0.7, v * 1.3, 100); if (proc === v) proc += 300;
      var pl = proc - v;
      return numQ(nm + ' (year end ' + MDAYS[e - 1] + ' ' + MONTHS[e - 1] + ') bought equipment on 1 ' + MONTHS[bm - 1] + ' ' + y + ' for $' + num(cost) + ' and sold it on 20 ' + MONTHS[sm - 1] + ' ' + sy + ' for $' + num(proc) + '. Depreciation is ' + r + '% per annum on the reducing balance. ' + POLICY + ' Calculate the ' + (pl > 0 ? 'profit' : 'loss') + ' on disposal. Give your answer in $.', Math.abs(pl),
        'Depreciation for ' + k + ' years leaves a carrying value of $' + num(v) + '. Proceeds $' + num(proc) + ' − $' + num(v) + ' = ' + (pl > 0 ? '$' + num(pl) + ' profit.' : '−$' + num(-pl) + ', a loss of $' + num(-pl) + '.'));
    } },
    { skill: 'disposal-account', gen: function () {
      var d = dispSL(), tot = Math.max(d.cost, d.dep + d.proc);
      return numQ(d.nm + ' sold a ' + d.as + ' that cost $' + num(d.cost) + ', with depreciation to date of $' + num(d.dep) + ', for $' + num(d.proc) + ' paid into the bank. When the disposal account is balanced, what total appears at the foot of each side? Give your answer in $.', tot,
        'Debit: cost $' + num(d.cost) + (d.pl > 0 ? ' + profit $' + num(d.pl) : '') + '. Credit: depreciation $' + num(d.dep) + ' + bank $' + num(d.proc) + (d.pl < 0 ? ' + loss $' + num(-d.pl) : '') + '. Both sides total $' + num(tot) + '.');
    } },
    { skill: 'cost-account', gen: function () {
      var nm = pick(NAMES), c0 = step(60000, 160000, 1000), cs = step(10000, 30000, 1000), cn = step(15000, 45000, 1000), cls = pick(['Motor vehicles', 'Machinery', 'Equipment']);
      return numQ('On 1 January ' + nm + '’s ' + cls.toLowerCase() + ' – cost account had a balance of $' + num(c0) + '. During the year an item costing $' + num(cs) + ' was sold for $' + num(step(cs * 0.3, cs * 0.6, 100)) + ' and a new item was bought by bank transfer for $' + num(cn) + '. What is the balance c/d on 31 December? Give your answer in $.', c0 - cs + cn,
        'Debit: balance b/d $' + num(c0) + ' + bank $' + num(cn) + '. Credit: disposal $' + num(cs) + ' (the cost of the item sold, not its proceeds). Balance c/d = $' + num(c0 + cn) + ' − $' + num(cs) + ' = $' + num(c0 - cs + cn) + '.');
    } },
    { skill: 'profit-loss', gen: function () {
      var d = dispSL();
      return numQ(d.nm + ' sold a ' + d.as + ' that cost $' + num(d.cost) + '. Depreciation to the date of sale was $' + num(d.dep) + ' and the disposal account shows a ' + (d.pl >= 0 ? 'profit' : 'loss') + ' of $' + num(Math.abs(d.pl)) + '. How much was received from the sale? Give your answer in $.', d.proc,
        'Carrying value = $' + num(d.cost) + ' − $' + num(d.dep) + ' = $' + num(d.cv) + '. Proceeds = carrying value ' + (d.pl >= 0 ? '+ profit' : '− loss') + ' = $' + num(d.cv) + (d.pl >= 0 ? ' + ' : ' − ') + '$' + num(Math.abs(d.pl)) + ' = $' + num(d.proc) + '.');
    } },
    { skill: 'disposal-account', gen: function () {
      var d = dispSL(), y = rint(2026, 2028), m = rint(2, 11), dt = dstr(rint(1, 28), m, y);
      var dr = [[dt, d.as.charAt(0).toUpperCase() + d.as.slice(1) + ' – cost', num(d.cost)]], cr = [[dt, 'Provision for depreciation', num(d.dep)], [dt, 'Bank', num(d.proc)]];
      return mcq('This disposal account has not yet been balanced. Which entry completes it?' + tacct('Disposal Account', dr, cr),
        d.pl >= 0 ? 'Debit “Income statement” ' + money(d.pl) + ' (profit)' : 'Credit “Income statement” ' + money(-d.pl) + ' (loss)',
        d.pl >= 0 ? ['Credit “Income statement” ' + money(d.pl) + ' (loss)', 'Debit “Income statement” ' + money(d.pl * 2) + ' (profit)', 'Credit “Bank” ' + money(d.pl) + ' (profit)'] : ['Debit “Income statement” ' + money(-d.pl) + ' (profit)', 'Credit “Income statement” ' + money(-d.pl * 2) + ' (loss)', 'Debit “Bank” ' + money(-d.pl) + ' (loss)'],
        'Debits $' + num(d.cost) + '; credits $' + num(d.dep) + ' + $' + num(d.proc) + ' = $' + num(d.dep + d.proc) + '. ' + (d.pl >= 0 ? 'Credits are bigger, so the balancing figure of $' + num(d.pl) + ' goes on the debit side: a profit, transferred to the income statement.' : 'Debits are bigger, so the balancing figure of $' + num(-d.pl) + ' goes on the credit side: a loss, transferred to the income statement.'));
    } },
    { skill: 'profit-loss', gen: function () {
      var nm = pick(NAMES), L = pick([4, 5, 8]), a = step(1500, 6000, 100), res = step(500, 3000, 500), cost = a * L + res, k = rint(1, L - 1), cv = cost - a * k;
      var proc = step(cv * 0.7, cv * 1.3, 100); if (proc === cv) proc += 200;
      var pl = proc - cv;
      return mcq(nm + ' bought a ' + pick(ASSETS) + ' for $' + num(cost) + ', expecting ' + (L === 8 ? 'an ' : 'a ') + L + '-year life and a residual value of $' + num(res) + '. It was depreciated using the straight line method for ' + k + (k === 1 ? ' year' : ' years') + ', then sold for $' + num(proc) + '. What was the result of the sale?',
        (pl > 0 ? 'Profit of ' : 'Loss of ') + money(Math.abs(pl)), [(pl > 0 ? 'Loss of ' : 'Profit of ') + money(Math.abs(pl)), (proc - (cost - cost / L * k) > 0 ? 'Profit of ' : 'Loss of ') + money(Math.abs(Math.round(proc - (cost - cost / L * k)))), (proc - res > 0 ? 'Profit of ' : 'Loss of ') + money(Math.abs(proc - res)), 'Loss of ' + money(a * k)].filter(function (x) { return !/ \$0$/.test(x); }),
        'Annual charge = ($' + num(cost) + ' − $' + num(res) + ') ÷ ' + L + ' = $' + num(a) + '. Carrying value = $' + num(cost) + ' − ' + k + ' × $' + num(a) + ' = $' + num(cv) + '. $' + num(proc) + ' − $' + num(cv) + ' gives a ' + (pl > 0 ? 'profit' : 'loss') + ' of $' + num(Math.abs(pl)) + '.');
    } },
    { skill: 'disposal-account', gen: function () {
      var d = dispSL();
      return mcq('A ' + d.as + ' that cost $' + num(d.cost) + ' is sold for $' + num(d.proc) + '. Which entry transfers its cost into the disposal account?',
        'Debit disposal $' + num(d.cost) + '; credit ' + d.as + ' – cost $' + num(d.cost), ['Debit ' + d.as + ' – cost $' + num(d.cost) + '; credit disposal $' + num(d.cost), 'Debit disposal $' + num(d.cv) + '; credit ' + d.as + ' – cost $' + num(d.cv), 'Debit disposal $' + num(d.proc) + '; credit ' + d.as + ' – cost $' + num(d.proc)],
        'The full original cost ($' + num(d.cost) + ') is removed from the cost account (credit) and placed on the debit side of the disposal account. Carrying value and proceeds are not used for this entry.');
    } },
    { skill: 'cost-account', gen: function () {
      var nm = pick(NAMES), c1 = step(50000, 150000, 1000), cs = step(10000, 30000, 1000), cn = step(15000, 40000, 1000);
      var c0 = c1 + cs - cn;
      if (c0 <= cs) c0 = cs + 20000, c1 = c0 - cs + cn;
      return numQ(nm + '’s equipment – cost account shows a balance c/d of $' + num(c1) + ' at the year end. During the year equipment costing $' + num(cs) + ' was sold and new equipment costing $' + num(cn) + ' was bought. What was the balance b/d at the start of the year? Give your answer in $.', c0,
        'Opening + purchases − cost of item sold = closing, so opening = $' + num(c1) + ' − $' + num(cn) + ' + $' + num(cs) + ' = $' + num(c0) + '.');
    } },
    { skill: 'depreciation-to-date', gen: function () {
      var e = pick([3, 12]), y = rint(2022, 2024), bm = rint(1, 12), r = pick([10, 20]), cost = step(12000, 36000, 1200), nm = pick(NAMES);
      var sm = rint(1, 12), months = rint(15, 40);
      var total = bm - 1 + months, sy = y + Math.floor(total / 12), smm = total % 12 + 1;
      var dep = cost * r / 100 * months / 12;
      return numQ(nm + ' charges depreciation monthly at ' + r + '% per annum on cost (straight line). A ' + pick(ASSETS) + ' costing $' + num(cost) + ' was bought on 1 ' + MONTHS[bm - 1] + ' ' + y + ' and sold on 1 ' + MONTHS[smm - 1] + ' ' + sy + '. Calculate the depreciation to the date of sale. Give your answer in $.', dep,
        'The asset was owned for ' + months + ' months: ' + r + '% × $' + num(cost) + ' × ' + months + '/12 = $' + num(dep) + '.');
    } },
    S('disposal-account', 'Which entry records the sale proceeds when an asset is sold for cash paid into the bank?',
      'Debit bank; credit disposal', ['Debit disposal; credit bank', 'Debit bank; credit asset cost account', 'Debit income statement; credit bank'],
      'The bank receives the money (debit). The proceeds are credited to the disposal account to compare with the carrying value.'),
    S('disposal-account', 'Which entry transfers depreciation on an asset sold into the disposal account?',
      'Debit provision for depreciation; credit disposal', ['Debit disposal; credit provision for depreciation', 'Debit income statement; credit disposal', 'Debit disposal; credit income statement'],
      'Accumulated depreciation on the asset is removed from the provision (debit) and credited to disposal, where it reduces the cost to the carrying value.'),
    S('profit-loss', 'In a disposal account, the debit side totals more than the credit side before balancing. What does this show?',
      'A loss on disposal, entered on the credit side', ['A profit on disposal, entered on the debit side', 'A loss on disposal, entered on the debit side', 'A profit on disposal, entered on the credit side'],
      'Cost (debit) exceeds depreciation plus proceeds (credits), so the asset was sold for less than its carrying value. The balancing loss goes on the credit side, transferred to the income statement.'),
    S('profit-loss', 'A machine with a carrying value of $7,400 is sold for $8,100. How is the result treated in the income statement?',
      'A $700 profit added as other income', ['A $700 loss charged as an expense', 'An $8,100 increase in revenue', 'A $7,400 reduction in purchases'],
      'Proceeds exceed carrying value by $8,100 − $7,400 = $700, a profit on disposal. It is added to profit as other income, not included in revenue.'),
    S('cost-account', 'When an asset is sold, which amount is credited to the asset’s cost account?',
      'The original cost of the asset sold', ['The sale proceeds', 'The carrying value at the date of sale', 'The depreciation to the date of sale'],
      'The cost account holds assets at cost, so the full original cost of the asset sold is removed (credited, detail “Disposal”).'),
    S('disposal-account', 'A student enters only the carrying value of the asset sold on the debit side of the disposal account. What is wrong?',
      'Cost and depreciation must be entered separately', ['Carrying value belongs on the credit side', 'Proceeds should be on the debit side', 'Nothing is wrong with this method'],
      'The double entry removes the cost from the cost account and the depreciation from the provision account, so both appear in the disposal account as separate entries.'),
    S('profit-loss', 'A van cost $22,000 and had depreciation to date of $13,500. It was sold for $7,900. What was the result?',
      'Loss of $600', ['Profit of $600', 'Loss of $14,100', 'Profit of $8,500'],
      'Carrying value = $22,000 − $13,500 = $8,500. $7,900 − $8,500 = −$600, so there is a loss of $600.'),
    S('disposal-account', 'In the disposal account, what detail is written next to a profit on disposal?',
      'Income statement, on the debit side', ['Income statement, on the credit side', 'Bank, on the debit side', 'Profit, on the credit side'],
      'The profit is the balancing figure on the debit side and is transferred to the income statement, so the detail names that account.'),
    S('depreciation-to-date', 'A business charges a full year’s depreciation in the year of purchase and none in the year of disposal. An asset is bought and sold in the same financial year. How much depreciation is credited to the disposal account?',
      'None', ['One full year', 'Half a year', 'The full cost'],
      'The year of purchase is also the year of disposal, and the policy gives no depreciation in the year of disposal, so the depreciation to date is nil.'),
    S('cost-account', 'Which pair of entries appears on the debit side of an asset cost account during a year with one sale and one purchase?',
      'Balance b/d; Bank (new asset)', ['Disposal; Balance c/d', 'Bank (proceeds); Disposal', 'Balance b/d; Disposal'],
      'The opening balance and new purchases are debits. The cost of the asset sold (Disposal) and the closing balance c/d are credits.'),
    S('profit-loss', 'Which formula gives the profit or loss on disposal directly?',
      'Proceeds − (cost − depreciation to date)', ['Proceeds − cost', 'Cost − depreciation to date − residual value', 'Proceeds − depreciation to date'],
      'Profit or loss = proceeds − carrying value, where carrying value = cost − depreciation to date. A positive result is a profit, a negative one a loss.')
  ] };
})();
