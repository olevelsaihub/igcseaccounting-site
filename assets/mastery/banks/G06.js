/* Group G06 mastery bank: Financial statements of a sole trader; Ratio analysis; Partnerships. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function rstep(a, b, s) { return rint(Math.ceil(a / s), Math.floor(b / s)) * s; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  // 12500 -> "12,500"; 3.5 -> "3.5"
  function f(x) {
    var n = Math.round(Math.abs(x) * 100) / 100, p = String(n).split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (x < 0 ? '-' : '') + p.join('.');
  }
  function m(x) { return (x < 0 ? '-$' : '$') + f(Math.abs(x)); }
  var PEOPLE = ['Amara', 'Bilal', 'Chen', 'Dario', 'Esi', 'Farid', 'Greta', 'Hana', 'Imran', 'Jonas', 'Kemi', 'Lucia', 'Mateo', 'Nadia', 'Omar', 'Priya', 'Rosa', 'Sanjay', 'Tariq', 'Uma', 'Viktor', 'Wen', 'Yusuf', 'Zainab', 'Kofi', 'Leila', 'Ravi', 'Sofia'];
  function who() { return pick(PEOPLE); }
  function pair() { var a = who(), b; do { b = who(); } while (b === a); return [a, b]; }
  function trio() { var p = pair(), c; do { c = who(); } while (c === p[0] || c === p[1]); return [p[0], p[1], c]; }
  var YEAR_END = ['31 March 2026', '30 June 2026', '31 December 2025', '30 September 2026', '31 May 2026', '31 January 2026'];
  function ye() { return pick(YEAR_END); }
  var SHOPS = ['a bicycle shop', 'a hardware store', 'a stationery shop', 'a garden centre', 'a shoe shop', 'a toy shop', 'a kitchenware shop', 'a pet supplies shop', 'a sports goods shop', 'a fabric shop'];
  function money(q, ans, why) {
    return { kind: 'num', q: q + ' Give your answer in $.', answer: ans, unit: '$', display: f(ans), why: why };
  }
  function pctQ(q, raw, why) {
    var a = R.roundDp(raw, 2);
    return { kind: 'num', q: q + ' Give your answer as a percentage to two decimal places.', answer: a, unit: '%', tol: 0.005, display: a.toFixed(2), why: why(a.toFixed(2)) };
  }
  function ratioQ(q, raw, why) {
    var a = R.roundDp(raw, 2);
    return { kind: 'num', q: q + ' Give the first figure of the ratio (x in x : 1) to two decimal places.', answer: a, unit: ': 1', tol: 0.005, display: a.toFixed(2), why: why(a.toFixed(2)) };
  }
  // Numerical multiple choice: correct first, distinct positive distractors, padded to four options.
  function mcqNum(q, correct, wrongs, why, fmt) {
    fmt = fmt || m;
    var opts = [fmt(correct)], seen = {};
    seen[opts[0]] = 1;
    wrongs.forEach(function (w) { var s = fmt(w); if (w > 0 && !seen[s] && opts.length < 5) { seen[s] = 1; opts.push(s); } });
    var step = Math.max(50, Math.round(Math.abs(correct) * 0.15 / 50) * 50), k = 1;
    while (opts.length < 4) {
      var c = correct + (k % 2 ? 1 : -1) * step * Math.ceil(k / 2), s = fmt(c);
      if (c > 0 && !seen[s]) { seen[s] = 1; opts.push(s); }
      k++;
    }
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  // Simple table: rows of cells; first row is the header when head is true.
  function tbl(rows, head) {
    return '<table class="mc-table">' + rows.map(function (r, i) {
      var t = head && i === 0 ? 'th' : 'td';
      return '<tr>' + r.map(function (c) { return '<' + t + '>' + c + '</' + t + '>'; }).join('') + '</tr>';
    }).join('') + '</table>';
  }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }

  /* ---------------- ACC-FS-01 Income statement ---------------- */
  B['ACC-FS-01'] = { title: 'Preparing an income statement for a trader or service business', items: [
    { skill: 'revenue-and-cost-of-sales', gen: function () {
      var n = who(), s = rstep(90000, 240000, 100), ri = rstep(1200, 6800, 10), ro = rstep(900, 4500, 10);
      var a = s - ri;
      return money('<b>' + n + '</b> runs ' + pick(SHOPS) + '. The trial balance shows sales ' + m(s) + ', returns inwards ' + m(ri) + ' and returns outwards ' + m(ro) + '. Calculate the revenue figure shown in the income statement.', a,
        'Revenue is sales less returns inwards (goods customers sent back): ' + m(s) + ' − ' + m(ri) + ' = ' + m(a) + '. Returns outwards are goods sent back to suppliers, so they reduce purchases in cost of sales, not revenue.');
    } },
    { skill: 'revenue-and-cost-of-sales', gen: function () {
      var n = who(), oi = rstep(6000, 18000, 50), p = rstep(60000, 140000, 100), ro = rstep(800, 3600, 10), cin = rstep(400, 1800, 10), cout = rstep(500, 2200, 10), ci = rstep(7000, 20000, 50);
      var a = oi + p - ro + cin - ci;
      return money('For the year, <b>' + n + '</b> had opening inventory ' + m(oi) + ', purchases ' + m(p) + ', returns outwards ' + m(ro) + ', carriage inwards ' + m(cin) + ', carriage outwards ' + m(cout) + ' and closing inventory ' + m(ci) + '. Calculate cost of sales.', a,
        'Cost of sales = opening inventory + purchases − returns outwards + carriage inwards − closing inventory = ' + m(oi) + ' + ' + m(p) + ' − ' + m(ro) + ' + ' + m(cin) + ' − ' + m(ci) + ' = ' + m(a) + '. Carriage outwards is a selling expense, shown below gross profit.');
    } },
    { skill: 'revenue-and-cost-of-sales', gen: function () {
      var n = who(), oi = rstep(5000, 15000, 50), p = rstep(50000, 120000, 100), own = rstep(600, 3200, 10), ci = rstep(6000, 16000, 50);
      var a = oi + p - own - ci;
      return money('<b>' + n + '</b> owns ' + pick(SHOPS) + '. Opening inventory was ' + m(oi) + ', purchases were ' + m(p) + ' and closing inventory was ' + m(ci) + '. During the year ' + n + ' took goods costing ' + m(own) + ' for personal use, and this has not yet been recorded. Calculate cost of sales.', a,
        'Goods taken by the owner are drawings, so their cost is taken out of purchases: ' + m(oi) + ' + (' + m(p) + ' − ' + m(own) + ') − ' + m(ci) + ' = ' + m(a) + '.');
    } },
    { skill: 'gross-profit', gen: function () {
      var n = who(), s = rstep(120000, 260000, 100), ri = rstep(1500, 6000, 10), oi = rstep(8000, 20000, 50), p = rstep(70000, 130000, 100), ro = rstep(1000, 4000, 10), cin = rstep(500, 2000, 10), ci = rstep(9000, 22000, 50);
      var rev = s - ri, cos = oi + p - ro + cin - ci, a = rev - cos;
      return money('From these balances for <b>' + n + '</b>, calculate gross profit for the year.' + tbl([['Item', '$'], ['Sales', f(s)], ['Returns inwards', f(ri)], ['Opening inventory', f(oi)], ['Purchases', f(p)], ['Returns outwards', f(ro)], ['Carriage inwards', f(cin)], ['Closing inventory', f(ci)]], true), a,
        'Revenue = ' + m(s) + ' − ' + m(ri) + ' = ' + m(rev) + '. Cost of sales = ' + m(oi) + ' + ' + m(p) + ' − ' + m(ro) + ' + ' + m(cin) + ' − ' + m(ci) + ' = ' + m(cos) + '. Gross profit = ' + m(rev) + ' − ' + m(cos) + ' = ' + m(a) + '.');
    } },
    { skill: 'gross-profit', gen: function () {
      var n = who(), sl = rstep(110000, 200000, 100), ri = rstep(1000, 4000, 10), oi = rstep(6000, 14000, 50), p = rstep(55000, 95000, 100), own = rstep(500, 2500, 10), ci = rstep(7000, 15000, 50);
      var rev = sl - ri, cos = oi + p - own - ci, a = rev - cos;
      return mcqNum('<b>' + n + '</b> gives you these figures. Goods costing ' + m(own) + ' taken by ' + n + ' for personal use have not yet been recorded. Which is the correct gross profit?' + tbl([['Item', '$'], ['Sales', f(sl)], ['Returns inwards', f(ri)], ['Opening inventory', f(oi)], ['Purchases', f(p)], ['Closing inventory', f(ci)]], true),
        a, [a - own, a + 2 * ri, a - own + 2 * ri], 'Revenue = ' + m(sl) + ' − ' + m(ri) + ' = ' + m(rev) + '. Cost of sales = ' + m(oi) + ' + (' + m(p) + ' − ' + m(own) + ') − ' + m(ci) + ' = ' + m(cos) + '. Gross profit = ' + m(rev) + ' − ' + m(cos) + ' = ' + m(a) + '. The goods taken are drawings, so they come out of purchases.');
    } },
    { skill: 'adjusted-expenses', gen: function () {
      var n = who(), p = rstep(2400, 7200, 60), y = rstep(300, 1200, 10);
      var a = p - y;
      return money('<b>' + n + '</b> paid insurance of ' + m(p) + ' during the year ended ' + ye() + '. Of this, ' + m(y) + ' covers the following year. Calculate the insurance expense in the income statement.', a,
        'The ' + m(y) + ' paid in advance is a prepayment, so it is taken off: ' + m(p) + ' − ' + m(y) + ' = ' + m(a) + '. Only this year\'s cost is charged.');
    } },
    { skill: 'adjusted-expenses', gen: function () {
      var n = who(), p = rstep(18000, 46000, 100), y = rstep(400, 2400, 10);
      var a = p + y;
      return money('<b>' + n + '</b> paid wages of ' + m(p) + ' during the year. At the year end, wages of ' + m(y) + ' were still owing to staff. Calculate the wages expense in the income statement.', a,
        'Wages owing are an accrual: they belong to this year even though unpaid, so they are added: ' + m(p) + ' + ' + m(y) + ' = ' + m(a) + '.');
    } },
    { skill: 'adjusted-expenses', gen: function () {
      var n = who(), o = rstep(300, 900, 10), p = rstep(8400, 15600, 100), c = rstep(500, 1500, 10);
      var a = p - o - c;
      return money('<b>' + n + '</b> rents a unit. At the start of the year rent of ' + m(o) + ' was owing for the previous year. During the year ' + n + ' paid rent of ' + m(p) + ', and at the year end ' + m(c) + ' of this had been paid in advance. Calculate the rent expense for the year.', a,
        'The payments include ' + m(o) + ' that belonged to last year and ' + m(c) + ' that belongs to next year, so both are taken off: ' + m(p) + ' − ' + m(o) + ' − ' + m(c) + ' = ' + m(a) + '.');
    } },
    { skill: 'adjusted-expenses', gen: function () {
      var n = who(), o = rstep(150, 600, 10), p = rstep(2400, 5600, 10), c = rstep(200, 800, 10);
      var a = p - o + c;
      return mcqNum('<b>' + n + '</b>\'s electricity account shows ' + m(o) + ' owing at the start of the year, payments of ' + m(p) + ' during the year and ' + m(c) + ' owing at the end. What is the electricity expense in the income statement?',
        a, [p + o + c, p + o - c, p - o - c], 'Take off the opening accrual (last year\'s cost paid this year) and add the closing accrual (this year\'s cost not yet paid): ' + m(p) + ' − ' + m(o) + ' + ' + m(c) + ' = ' + m(a) + '.');
    } },
    { skill: 'depreciation', gen: function () {
      var n = who(), d = rstep(1200, 6000, 100), L = pick([4, 5, 6, 8]), r = rstep(1000, 5000, 500);
      var cost = d * L + r;
      return money('<b>' + n + '</b> bought shop fittings for ' + m(cost) + '. They are expected to last ' + L + ' years and then be sold for ' + m(r) + '. Depreciation is by the straight line method. Calculate the depreciation charge for one year.', d,
        'Straight line: (cost − residual value) ÷ useful life = (' + m(cost) + ' − ' + m(r) + ') ÷ ' + L + ' = ' + m(d) + ' a year.');
    } },
    { skill: 'depreciation', gen: function () {
      var n = who(), c = rstep(24000, 60000, 1000), a0 = rstep(Math.round(c * 0.2), Math.round(c * 0.55), 100), r = pick([10, 15, 20, 25]);
      var a = (c - a0) * r / 100;
      return money('<b>' + n + '</b>\'s motor vehicles cost ' + m(c) + ' and accumulated depreciation brought forward is ' + m(a0) + '. Vehicles are depreciated at ' + r + '% a year using the reducing balance method. Calculate this year\'s depreciation charge.', a,
        'Reducing balance is worked on the carrying value, not cost: (' + m(c) + ' − ' + m(a0) + ') × ' + r + '% = ' + m(c - a0) + ' × ' + r + '% = ' + m(a) + '.');
    } },
    { skill: 'depreciation', gen: function () {
      var n = who(), c = rstep(20000, 45000, 1000), a0 = rstep(Math.round(c * 0.25), Math.round(c * 0.5), 100), nw = rstep(5000, 15000, 1000), r = pick([10, 20, 25]);
      var a = (c + nw - a0) * r / 100;
      return money('<b>' + n + '</b>\'s equipment at cost was ' + m(c) + ' with accumulated depreciation of ' + m(a0) + '. On the last day of the year, new equipment costing ' + m(nw) + ' was bought but has not yet been recorded. Equipment is depreciated at ' + r + '% reducing balance, with a full year\'s charge on all equipment held at the year end. Calculate the depreciation charge.', a,
        'Add the new equipment first, then apply the rate to the carrying value: (' + m(c) + ' + ' + m(nw) + ' − ' + m(a0) + ') × ' + r + '% = ' + m(c + nw - a0) + ' × ' + r + '% = ' + m(a) + '.');
    } },
    { skill: 'capital-items-and-disposals', gen: function () {
      var n = who(), v = rstep(9000, 22000, 500), run = rstep(3000, 8000, 10);
      var bal = v + run;
      return money('The motor expenses account of <b>' + n + '</b> shows a balance of ' + m(bal) + '. You find that this includes ' + m(v) + ' paid for a second-hand delivery van bought during the year. Calculate the motor expenses figure for the income statement.', run,
        'The van is capital expenditure (a non-current asset), so it is removed from the expense: ' + m(bal) + ' − ' + m(v) + ' = ' + m(run) + '. The van is then depreciated instead.');
    } },
    { skill: 'capital-items-and-disposals', gen: function () {
      var n = who(), c = rstep(12000, 30000, 500), ad = rstep(Math.round(c * 0.4), Math.round(c * 0.7), 100), cv = c - ad, pr = cv - rstep(300, Math.min(2500, cv - 500), 50);
      var a = cv - pr;
      return money('<b>' + n + '</b> sold a machine that cost ' + m(c) + ' and had accumulated depreciation of ' + m(ad) + '. It was sold for ' + m(pr) + ' cash. Calculate the amount shown as a loss on disposal in the income statement.', a,
        'Carrying value = ' + m(c) + ' − ' + m(ad) + ' = ' + m(cv) + '. The machine was sold for less, so the loss = ' + m(cv) + ' − ' + m(pr) + ' = ' + m(a) + ', shown with the expenses.');
    } },
    { skill: 'irrecoverable-debts-and-provision', gen: function () {
      var n = who(), tr = rstep(12000, 30000, 100), rate = pick([2, 4, 5]), req = tr * rate / 100, old = req + pick([-1, 1]) * rstep(40, Math.min(300, req - 60), 10);
      var ch = Math.abs(req - old), up = req > old;
      var q = '<b>' + n + '</b>\'s trade receivables at the year end are ' + m(tr) + '. The provision for irrecoverable debts is to be ' + rate + '% of trade receivables. The provision brought forward is ' + m(old) + '. How is the change in the provision shown in the income statement?';
      var opts = ['Expense of ' + m(ch), 'Income of ' + m(ch), (up ? 'Expense of ' : 'Income of ') + m(req), (up ? 'Income of ' : 'Expense of ') + m(req)];
      return { kind: 'mcq', q: q, options: opts, answer: up ? 0 : 1,
        why: 'Required provision = ' + rate + '% × ' + m(tr) + ' = ' + m(req) + '. Compared with ' + m(old) + ' it ' + (up ? 'rises' : 'falls') + ' by ' + m(ch) + '. Only the change goes to the income statement: an increase is an expense, a decrease is income.' };
    } },
    { skill: 'irrecoverable-debts-and-provision', gen: function () {
      var n = who(), ib = rstep(300, 1200, 10), w = rstep(200, 900, 10), tr0 = rstep(15000, 35000, 100) + w, rate = pick([2, 5]), old = rstep(150, 400, 10);
      var tr = tr0 - w, req = tr * rate / 100;
      if (req <= old) old = req - rstep(50, 150, 10);
      var a = ib + w + (req - old);
      return money('The trial balance of <b>' + n + '</b> shows irrecoverable debts ' + m(ib) + ', trade receivables ' + m(tr0) + ' and a provision for irrecoverable debts of ' + m(old) + '. A further debt of ' + m(w) + ' is to be written off, and the provision is to be ' + rate + '% of the remaining trade receivables. Calculate the total charged in the income statement for irrecoverable debts and the change in the provision.', a,
        'Irrecoverable debts = ' + m(ib) + ' + ' + m(w) + ' = ' + m(ib + w) + '. New provision = ' + rate + '% × (' + m(tr0) + ' − ' + m(w) + ') = ' + m(req) + ', an increase of ' + m(req - old) + '. Total = ' + m(ib + w) + ' + ' + m(req - old) + ' = ' + m(a) + '.');
    } },
    { skill: 'profit-for-the-year', gen: function () {
      var n = who(), gp = rstep(50000, 90000, 100), dr = rstep(300, 1200, 10), w = rstep(18000, 30000, 100), wo = rstep(400, 1500, 10), ge = rstep(3000, 8000, 10), ins = rstep(1200, 3000, 10);
      var exp = w + wo + ge + ins, a = gp + dr - exp;
      return money('<b>' + n + '</b>\'s gross profit is ' + m(gp) + '. Other balances: discount received ' + m(dr) + ', wages paid ' + m(w) + ', general expenses ' + m(ge) + ', insurance ' + m(ins) + '. Wages of ' + m(wo) + ' are owing at the year end. Calculate profit for the year.', a,
        'Add other income: ' + m(gp) + ' + ' + m(dr) + ' = ' + m(gp + dr) + '. Expenses = wages (' + m(w) + ' + ' + m(wo) + ') + ' + m(ge) + ' + ' + m(ins) + ' = ' + m(exp) + '. Profit for the year = ' + m(gp + dr) + ' − ' + m(exp) + ' = ' + m(a) + '.');
    } },
    { skill: 'profit-for-the-year', gen: function () {
      var n = who(), gp = rstep(40000, 80000, 100), rr = rstep(1200, 4800, 100), lr = rstep(2000, 6000, 500), sal = rstep(15000, 26000, 100), mot = rstep(2500, 6000, 10), li = rstep(300, 900, 10);
      var exp = sal + mot + li, a = gp + rr - exp;
      return money('Gross profit for <b>' + n + '</b> is ' + m(gp) + '. Other items for the year: rent received ' + m(rr) + ', salaries ' + m(sal) + ', motor expenses ' + m(mot) + ', bank loan interest ' + m(li) + ' and repayment of part of the bank loan ' + m(lr) + '. Calculate profit for the year.', a,
        'The loan repayment is not an expense: it only reduces a liability. Profit = ' + m(gp) + ' + ' + m(rr) + ' − (' + m(sal) + ' + ' + m(mot) + ' + ' + m(li) + ') = ' + m(a) + '. Loan interest is an expense.');
    } },
    { skill: 'profit-for-the-year', gen: function () {
      var n = who(), gp = rstep(60000, 110000, 100), fc = rstep(10000, 30000, 1000), fr = pick([10, 20]), w = rstep(20000, 35000, 100), ins = rstep(1800, 3600, 60), pp = rstep(200, 600, 10), ge = rstep(2500, 7000, 10);
      var dep = fc * fr / 100, exp = dep + w + (ins - pp) + ge, a = gp - exp;
      return money('Prepare the profit section for <b>' + n + '</b>, then give profit for the year. Gross profit ' + m(gp) + '; wages ' + m(w) + '; insurance paid ' + m(ins) + ', of which ' + m(pp) + ' is prepaid; general expenses ' + m(ge) + '; fixtures costing ' + m(fc) + ' are depreciated at ' + fr + '% of cost a year (no depreciation recorded yet).', a,
        'Depreciation = ' + fr + '% × ' + m(fc) + ' = ' + m(dep) + '. Insurance = ' + m(ins) + ' − ' + m(pp) + ' = ' + m(ins - pp) + '. Total expenses = ' + m(dep) + ' + ' + m(w) + ' + ' + m(ins - pp) + ' + ' + m(ge) + ' = ' + m(exp) + '. Profit = ' + m(gp) + ' − ' + m(exp) + ' = ' + m(a) + '.');
    } },
    { skill: 'placing-items', kind: 'multi', q: 'Which of these items are listed among the expenses <b>after</b> gross profit in a trader\'s income statement?',
      options: ['Carriage outwards', 'Discount allowed', 'Irrecoverable debts', 'Carriage inwards', 'Returns outwards', 'Cash drawings'], answers: [0, 1, 2],
      why: 'Carriage outwards, discount allowed and irrecoverable debts are expenses below gross profit. Carriage inwards and returns outwards belong in cost of sales, and drawings never appear in the income statement.' },
    { skill: 'placing-items', kind: 'mcq', q: 'A trader takes $500 from the business bank account for a family holiday. How is this shown in the income statement?',
      options: ['It is not shown there at all', 'As an expense after gross profit', 'As a deduction from revenue', 'As part of cost of sales'], answer: 0,
      why: 'Money taken by the owner is drawings. Drawings reduce equity in the statement of financial position; they are not a business expense.' },
    { skill: 'placing-items', kind: 'mcq', q: 'Where is carriage inwards shown in a trader\'s income statement?',
      options: ['Added to purchases in cost of sales', 'Deducted from sales to give revenue', 'Among the expenses after gross profit', 'Added to gross profit as other income'], answer: 0,
      why: 'Carriage inwards is part of the cost of getting goods into the shop, so it is added in cost of sales and reduces gross profit.' },
    { skill: 'placing-items', kind: 'mcq', q: 'A trader\'s provision for irrecoverable debts is reduced at the year end. How does the decrease appear in the income statement?',
      options: ['Other income, added after gross profit', 'An expense shown after gross profit', 'A deduction from revenue at the top', 'An addition to cost of sales'], answer: 0,
      why: 'A smaller provision means less has been charged than needed, so the decrease is credited to the income statement as other income.' },
    { skill: 'placing-items', kind: 'mcq', q: 'Which heading is correct for a sole trader\'s income statement?',
      options: ['Income statement for the year ended 31 May 2026', 'Income statement at 31 May 2026', 'Income statement on 31 May 2026 only', 'Income statement from 31 May 2026'], answer: 0,
      why: 'An income statement covers a period of time, so it is headed \'for the year ended\'. \'At\' a date is used for the statement of financial position.' },
    { skill: 'revenue-and-cost-of-sales', kind: 'mcq', q: 'A trader took goods costing $750 from inventory for personal use. How is this dealt with in the income statement?',
      options: ['Deducted from purchases in cost of sales', 'Added to purchases in cost of sales', 'Shown as an expense after gross profit', 'Added to revenue as a sale'], answer: 0,
      why: 'The goods were not used to make sales, so their cost is taken out of purchases. The $750 is added to the owner\'s drawings instead.' }
  ] };

  /* ---------------- ACC-FS-05 Statement of financial position ---------------- */
  B['ACC-FS-05'] = { title: 'Preparing a statement of financial position after adjustments', items: [
    { skill: 'non-current-assets', gen: function () {
      var n = who(), d = rstep(1500, 5000, 100), c = d * pick([5, 8, 10]), a0 = d * rint(1, 3);
      var a = c - a0 - d;
      return money('<b>' + n + '</b>\'s office equipment cost ' + m(c) + '. Accumulated depreciation brought forward is ' + m(a0) + ', and this year\'s straight line charge of ' + m(d) + ' has not yet been included. Calculate the carrying amount shown in the statement of financial position.', a,
        'Accumulated depreciation must include this year\'s charge: ' + m(a0) + ' + ' + m(d) + ' = ' + m(a0 + d) + '. Carrying amount = ' + m(c) + ' − ' + m(a0 + d) + ' = ' + m(a) + '.');
    } },
    { skill: 'non-current-assets', gen: function () {
      var n = who(), c = rstep(20000, 50000, 1000), a0 = rstep(Math.round(c * 0.2), Math.round(c * 0.5), 100), r = pick([10, 20, 25]);
      var ch = (c - a0) * r / 100, a = c - a0 - ch;
      return money('<b>' + n + '</b>\'s motor vans cost ' + m(c) + ' with accumulated depreciation of ' + m(a0) + ' before this year\'s charge. Vans are depreciated at ' + r + '% reducing balance. Calculate the carrying amount of the vans at the year end.', a,
        'This year\'s charge = ' + r + '% × (' + m(c) + ' − ' + m(a0) + ') = ' + m(ch) + '. Carrying amount = ' + m(c) + ' − (' + m(a0) + ' + ' + m(ch) + ') = ' + m(a) + '.');
    } },
    { skill: 'non-current-assets', gen: function () {
      var n = who(), cv = rstep(20000, 40000, 1000), cva = rstep(Math.round(cv * 0.3), Math.round(cv * 0.5), 100), cf = rstep(8000, 16000, 500), cfa = rstep(Math.round(cf * 0.2), Math.round(cf * 0.5), 100), cha = rstep(1000, 3000, 100);
      var a = cv - cva + cf - cfa - cha;
      return money('At the year end <b>' + n + '</b> has: vehicles at cost ' + m(cv) + ' with accumulated depreciation ' + m(cva) + ' (already updated); fixtures at cost ' + m(cf) + ' with accumulated depreciation brought forward ' + m(cfa) + ' and this year\'s fixtures charge of ' + m(cha) + ' still to be added. Calculate total non-current assets.', a,
        'Vehicles: ' + m(cv) + ' − ' + m(cva) + ' = ' + m(cv - cva) + '. Fixtures: ' + m(cf) + ' − (' + m(cfa) + ' + ' + m(cha) + ') = ' + m(cf - cfa - cha) + '. Total = ' + m(a) + '.');
    } },
    { skill: 'non-current-assets', gen: function () {
      var n = who(), c = rstep(40000, 80000, 1000), ad = rstep(Math.round(c * 0.3), Math.round(c * 0.5), 100), sc = rstep(6000, 12000, 500), sad = rstep(Math.round(sc * 0.4), Math.round(sc * 0.7), 100);
      var a = (c - sc) - (ad - sad);
      return money('<b>' + n + '</b>\'s machinery account shows cost ' + m(c) + ' and accumulated depreciation ' + m(ad) + ' (this year\'s charge included). On the last day of the year a machine that cost ' + m(sc) + ', with accumulated depreciation of ' + m(sad) + ', was sold; the disposal has not yet been recorded. Calculate the carrying amount of machinery.', a,
        'Remove the machine sold from both figures: cost ' + m(c) + ' − ' + m(sc) + ' = ' + m(c - sc) + '; depreciation ' + m(ad) + ' − ' + m(sad) + ' = ' + m(ad - sad) + '. Carrying amount = ' + m(c - sc) + ' − ' + m(ad - sad) + ' = ' + m(a) + '.');
    } },
    { skill: 'non-current-assets', gen: function () {
      var n = who(), c = rstep(10000, 30000, 1000), r = pick([10, 20]), y = rint(2, 4);
      var a = c - c * r / 100 * y;
      return money('<b>' + n + '</b> bought a delivery van for ' + m(c) + ' exactly ' + y + ' years before the year end. It is depreciated at ' + r + '% a year on cost (straight line). Calculate its carrying amount at the year end, after this year\'s charge.', a,
        'Each year\'s charge = ' + r + '% × ' + m(c) + ' = ' + m(c * r / 100) + '. After ' + y + ' years accumulated depreciation = ' + m(c * r / 100 * y) + ', so carrying amount = ' + m(c) + ' − ' + m(c * r / 100 * y) + ' = ' + m(a) + '.');
    } },
    { skill: 'current-assets', gen: function () {
      var n = who(), tr0 = rstep(14000, 30000, 100), w = rstep(200, 900, 100), rate = pick([2, 4, 5]);
      var tr = tr0 - w, pr = tr * rate / 100, a = tr - pr;
      return money('<b>' + n + '</b>\'s trade receivables are ' + m(tr0) + '. A debt of ' + m(w) + ' must still be written off, and a provision for irrecoverable debts of ' + rate + '% is to be made on the remaining receivables. Calculate the net trade receivables shown under current assets.', a,
        'Write off first: ' + m(tr0) + ' − ' + m(w) + ' = ' + m(tr) + '. Provision = ' + rate + '% × ' + m(tr) + ' = ' + m(pr) + '. Net trade receivables = ' + m(tr) + ' − ' + m(pr) + ' = ' + m(a) + '.');
    } },
    { skill: 'current-assets', gen: function () {
      var n = who(), inv = rstep(6000, 18000, 50), tr = rstep(8000, 16000, 100), pr = rstep(200, 600, 10), pp = rstep(150, 700, 10), bk = rstep(800, 5000, 10), cash = rstep(80, 600, 5);
      var a = inv + tr - pr + pp + bk + cash;
      return money('Calculate total current assets for <b>' + n + '</b> from: inventory ' + m(inv) + '; trade receivables ' + m(tr) + '; provision for irrecoverable debts ' + m(pr) + '; insurance prepaid ' + m(pp) + '; bank (debit balance) ' + m(bk) + '; cash ' + m(cash) + '.', a,
        m(inv) + ' + (' + m(tr) + ' − ' + m(pr) + ') + ' + m(pp) + ' + ' + m(bk) + ' + ' + m(cash) + ' = ' + m(a) + '. The provision is deducted from receivables, and the prepayment is an other receivable.');
    } },
    { skill: 'current-assets', gen: function () {
      var n = who(), tr = rstep(9000, 20000, 100), rate = pick([2, 5]), pr = tr * rate / 100;
      var a = tr - pr;
      return mcqNum('<b>' + n + '</b> has trade receivables of ' + m(tr) + ' and provides for irrecoverable debts at ' + rate + '% of the receivables balance. Which figure is shown for trade receivables in the statement of financial position?',
        a, [tr, tr + pr, pr], 'The provision is ' + rate + '% × ' + m(tr) + ' = ' + m(pr) + ', and it is deducted from receivables: ' + m(tr) + ' − ' + m(pr) + ' = ' + m(a) + '.');
    } },
    { skill: 'current-assets', gen: function () {
      var n = who(), r1 = rstep(200, 900, 10), r2 = rstep(100, 600, 10);
      var a = r1 + r2;
      return money('At the year end <b>' + n + '</b> has paid rent of ' + m(r1) + ' and insurance of ' + m(r2) + ' in advance, and owes wages of ' + m(rstep(300, 900, 10)) + '. Calculate the other receivables figure in current assets.', a,
        'Other receivables are amounts paid in advance (prepayments): ' + m(r1) + ' + ' + m(r2) + ' = ' + m(a) + '. Wages owing are an other payable, a current liability.');
    } },
    { skill: 'liabilities', gen: function () {
      var n = who(), tp = rstep(5000, 14000, 10), acc = rstep(200, 900, 10), od = rstep(500, 3000, 10), loan = rstep(8000, 20000, 1000);
      var a = tp + acc + od;
      return money('<b>' + n + '</b>\'s cash book shows a credit bank balance of ' + m(od) + '. Other balances: trade payables ' + m(tp) + ', electricity owing ' + m(acc) + ', and a bank loan of ' + m(loan) + ' repayable in ' + rint(4, 8) + ' years. Calculate total current liabilities.', a,
        'Current liabilities = trade payables + other payables + bank overdraft = ' + m(tp) + ' + ' + m(acc) + ' + ' + m(od) + ' = ' + m(a) + '. The loan is not due within a year, so it is a non-current liability.');
    } },
    { skill: 'liabilities', gen: function () {
      var n = who(), tp = rstep(4000, 12000, 10), op = rstep(200, 800, 10), loan = rstep(6000, 18000, 500);
      var a = tp + op + loan;
      return money('<b>' + n + '</b> has trade payables ' + m(tp) + ', other payables ' + m(op) + ' and a five-year bank loan of ' + m(loan) + '. The cash book shows a debit bank balance (money in the bank, an asset). Calculate total liabilities.', a,
        'Total liabilities = non-current liabilities + current liabilities = ' + m(loan) + ' + (' + m(tp) + ' + ' + m(op) + ') = ' + m(a) + '.');
    } },
    { skill: 'liabilities', gen: function () {
      var n = who(), w = rstep(300, 1200, 10), li = rstep(100, 500, 10), tp = rstep(4000, 9000, 10);
      var a = w + li;
      return money('At the year end <b>' + n + '</b> owes wages of ' + m(w) + ' and loan interest of ' + m(li) + ', and has trade payables of ' + m(tp) + '. Calculate the other payables figure in current liabilities.', a,
        'Other payables are accrued expenses: ' + m(w) + ' + ' + m(li) + ' = ' + m(a) + '. Trade payables are shown on a separate line.');
    } },
    { skill: 'equity', gen: function () {
      var n = who(), op = rstep(20000, 60000, 100), pf = rstep(15000, 40000, 10), dr = rstep(8000, Math.min(30000, pf + 5000), 10);
      var a = op + pf - dr;
      return money('<b>' + n + '</b>\'s equity at the start of the year was ' + m(op) + '. Profit for the year was ' + m(pf) + ' and drawings were ' + m(dr) + '. Calculate closing equity.', a,
        'Closing equity = opening equity + profit − drawings = ' + m(op) + ' + ' + m(pf) + ' − ' + m(dr) + ' = ' + m(a) + '.');
    } },
    { skill: 'equity', gen: function () {
      var n = who(), op = rstep(25000, 50000, 100), loss = rstep(2000, 8000, 10), dr = rstep(6000, 15000, 10), ci = rstep(5000, 15000, 1000);
      var a = op + ci - loss - dr;
      return money('<b>' + n + '</b> started the year with equity of ' + m(op) + '. During the year ' + n + ' paid in extra capital of ' + m(ci) + ' and took drawings of ' + m(dr) + '. The business made a loss for the year of ' + m(loss) + '. Calculate closing equity.', a,
        'Closing equity = ' + m(op) + ' + ' + m(ci) + ' − ' + m(loss) + ' − ' + m(dr) + ' = ' + m(a) + '. A loss reduces equity, like drawings.');
    } },
    { skill: 'equity', gen: function () {
      var n = who(), op = rstep(20000, 45000, 100), pf = rstep(18000, 35000, 10), dc = rstep(9000, 20000, 10), dg = rstep(400, 1500, 10);
      var a = op + pf - dc - dg;
      return mcqNum('<b>' + n + '</b>: opening equity ' + m(op) + ', profit for the year ' + m(pf) + ', cash drawings ' + m(dc) + ' and goods taken for own use costing ' + m(dg) + '. What is closing equity?',
        a, [op + pf + dc + dg, op + pf - dc, op + pf - dc + dg], 'Total drawings = ' + m(dc) + ' + ' + m(dg) + ' = ' + m(dc + dg) + '. Closing equity = ' + m(op) + ' + ' + m(pf) + ' − ' + m(dc + dg) + ' = ' + m(a) + '.');
    } },
    { skill: 'totals-and-balancing', gen: function () {
      var n = who(), nca = rstep(40000, 80000, 100), ca = rstep(12000, 30000, 10), ncl = rstep(5000, 15000, 500), cl = rstep(4000, 12000, 10), pf = rstep(12000, 25000, 10), dr = rstep(8000, 18000, 10);
      var ta = nca + ca, ce = ta - ncl - cl, oe = ce - pf + dr;
      return money('<b>' + n + '</b>\'s statement of financial position shows total assets of ' + m(ta) + ', non-current liabilities ' + m(ncl) + ' and current liabilities ' + m(cl) + '. Profit for the year was ' + m(pf) + ' and drawings ' + m(dr) + '. Calculate the opening equity.', oe,
        'Closing equity = total assets − total liabilities = ' + m(ta) + ' − ' + m(ncl + cl) + ' = ' + m(ce) + '. Opening equity = closing equity − profit + drawings = ' + m(ce) + ' − ' + m(pf) + ' + ' + m(dr) + ' = ' + m(oe) + '.');
    } },
    { skill: 'totals-and-balancing', gen: function () {
      var n = who(), c = rstep(30000, 60000, 1000), ad = rstep(8000, 20000, 100), inv = rstep(5000, 12000, 50), tr = rstep(4000, 10000, 10), bk = rstep(500, 4000, 10);
      var a = c - ad + inv + tr + bk;
      return money('<b>' + n + '</b> has premises at cost ' + m(c) + ' with accumulated depreciation ' + m(ad) + ', inventory ' + m(inv) + ', net trade receivables ' + m(tr) + ' and money in the bank of ' + m(bk) + '. Calculate total assets.', a,
        'Total assets = carrying amount of non-current assets + current assets = (' + m(c) + ' − ' + m(ad) + ') + (' + m(inv) + ' + ' + m(tr) + ' + ' + m(bk) + ') = ' + m(a) + '.');
    } },
    { skill: 'totals-and-balancing', gen: function () {
      var n = who(), ta = rstep(50000, 90000, 10), tp = rstep(4000, 10000, 10), od = rstep(500, 2500, 10), loan = rstep(10000, 20000, 1000);
      var a = ta - tp - od - loan;
      return money('<b>' + n + '</b>\'s total assets are ' + m(ta) + '. Liabilities are trade payables ' + m(tp) + ', bank overdraft ' + m(od) + ' and a bank loan of ' + m(loan) + '. What closing equity figure makes the statement of financial position balance?', a,
        'Total assets = equity + liabilities, so equity = ' + m(ta) + ' − (' + m(tp) + ' + ' + m(od) + ' + ' + m(loan) + ') = ' + m(a) + '.');
    } },
    { skill: 'spot-the-error', kind: 'mcq', q: 'A student\'s extract shows: <table class="mc-table"><tr><th>Equity</th><th>$</th></tr><tr><td>Opening equity</td><td>40,000</td></tr><tr><td>Profit for the year</td><td>18,500</td></tr><tr><td>Drawings</td><td>12,000</td></tr><tr><td>Closing equity</td><td>70,500</td></tr></table> What is wrong?',
      options: ['Drawings were added instead of deducted', 'Profit should have been deducted', 'Opening equity should be left out', 'Nothing: the closing equity is correct'], answer: 0,
      why: 'Closing equity = 40,000 + 18,500 − 12,000 = $46,500. The student added drawings, giving $70,500.' },
    { skill: 'spot-the-error', kind: 'mcq', q: 'A student lists a bank overdraft of $1,800 under current assets as "Bank (1,800)". Where should it be shown?',
      options: ['Under current liabilities', 'Under non-current liabilities', 'Deducted from equity', 'Under non-current assets'], answer: 0,
      why: 'A credit balance on the bank account is an overdraft: money owed to the bank and repayable on demand, so it is a current liability, not a negative asset.' },
    { skill: 'spot-the-error', kind: 'mcq', q: 'A student shows equipment as: cost $24,000, accumulated depreciation $9,000, carrying amount $15,000. The $9,000 is last year\'s figure and this year\'s charge of $3,000 was missed. What is the correct carrying amount?',
      options: ['$12,000', '$15,000', '$18,000', '$21,000'], answer: 0,
      why: 'Accumulated depreciation must include this year\'s charge: $9,000 + $3,000 = $12,000, so the carrying amount is $24,000 − $12,000 = $12,000.' },
    { skill: 'spot-the-error', kind: 'mcq', q: 'A trader\'s bank loan of $15,000 is repayable in 2032. A student includes it in current liabilities. What is the effect on the statement of financial position?',
      options: ['Current liabilities are overstated', 'Total liabilities are overstated', 'Current assets are understated', 'Equity is understated'], answer: 0,
      why: 'The loan is due after more than a year, so it is a non-current liability. Total liabilities stay the same, but current liabilities are shown too high.' },
    { skill: 'spot-the-error', kind: 'mcq', q: 'Which heading is correct for a statement of financial position?',
      options: ['Statement of financial position at 30 June 2026', 'Statement of financial position for the year ended 30 June 2026', 'Statement of financial position for the period to 30 June 2026', 'Statement of financial position during the year to 30 June 2026'], answer: 0,
      why: 'The statement of financial position shows assets, liabilities and equity at one moment in time, so it is headed \'at\' a date.' }
  ] };

  /* ---------------- ACC-FS-06 Where does this item go? ---------------- */
  var PLACES = ['Non-current asset', 'Current asset', 'Current liability', 'Non-current liability', 'Income statement: expense', 'Income statement: income'];
  function place(skill, stem, ans, why) {
    return { skill: skill, kind: 'mcq', q: stem + ' Where is it shown in the financial statements?', options: PLACES.slice(), answer: PLACES.indexOf(ans), why: why };
  }
  B['ACC-FS-06'] = { title: 'Where does this item go in the financial statements?', items: [
    place('assets', 'A café keeps a petty cash float. At the year end the petty cash book shows a balance of $85.', 'Current asset',
      'Petty cash is money the business holds, so it is a current asset alongside bank and cash.'),
    place('assets', 'A furniture maker has partly finished tables in its workshop at the year end (work in progress).', 'Current asset',
      'Work in progress is part of inventory, and inventory is a current asset.'),
    place('assets', 'A florist buys a refrigerated display cabinet to use in the shop for the next eight years.', 'Non-current asset',
      'The cabinet is kept for use in the business for more than a year, so it is a non-current asset.'),
    place('assets', 'A car dealer has six cars on the forecourt waiting to be sold to customers.', 'Current asset',
      'For a car dealer, cars bought to resell are inventory, a current asset. Only vehicles kept for use in the business are non-current assets.'),
    place('assets', 'A trader\'s trade receivables control account has a debit balance of $14,200 at the year end.', 'Current asset',
      'The balance is the total owed by credit customers (trade receivables), a current asset.'),
    place('assets', 'A builder pays for land on which a new storage yard will be built for the business.', 'Non-current asset',
      'Land bought for long-term use in the business is capital expenditure, shown as a non-current asset.'),
    place('liabilities', 'A sole trader\'s cash book shows a credit balance in the bank column at the year end.', 'Current liability',
      'A credit bank balance in the business\'s own books is an overdraft: money owed to the bank and repayable on demand, so a current liability.'),
    place('liabilities', 'A sole trader took out a bank loan that must be repaid in full in six years\' time.', 'Non-current liability',
      'The loan is due after more than 12 months, so it is a non-current liability.'),
    place('liabilities', 'A bank loan taken out three years ago must be repaid in full five months after the year end.', 'Current liability',
      'The loan is now due within 12 months of the year end, so it is a current liability.'),
    place('liabilities', 'A trader\'s trade payables control account has a credit balance of $9,600 at the year end.', 'Current liability',
      'The balance is the total owed to credit suppliers (trade payables), due within a year: a current liability.'),
    place('liabilities', 'At the year end a trader owes three months\' interest on a bank loan.', 'Current liability',
      'Interest owing is an accrual (other payable). It will be paid soon, so it is a current liability.'),
    place('income-statement-items', 'During the year a trader wrote off a customer\'s debt of $420 as irrecoverable.', 'Income statement: expense',
      'An irrecoverable debt is a loss to the business, so it is an expense in the income statement, not a balance in the statement of financial position.'),
    place('income-statement-items', 'A trader\'s provision for irrecoverable debts is increased by $160 at the year end.', 'Income statement: expense',
      'The increase in the provision is charged as an expense for the year. Only the provision balance itself is shown in current assets.'),
    place('income-statement-items', 'A trader\'s provision for irrecoverable debts is reduced by $90 at the year end.', 'Income statement: income',
      'A decrease in the provision is credited to the income statement as other income.'),
    place('income-statement-items', 'A trader took a discount of $65 when paying a supplier promptly.', 'Income statement: income',
      'Discount received is a gain for the business, shown as other income after gross profit.'),
    place('income-statement-items', 'A trader paid a courier $340 to deliver goods to customers.', 'Income statement: expense',
      'Delivering goods to customers is carriage outwards, a selling expense in the income statement.'),
    { skill: 'contra-and-equity', kind: 'mcq', q: 'Where is the accumulated depreciation on a trader\'s machinery shown?',
      options: ['Deducted from machinery in non-current assets', 'Under current liabilities', 'Under non-current liabilities', 'As an expense in the income statement'], answer: 0,
      why: 'Accumulated depreciation reduces the asset to its carrying amount, so it is deducted from cost in the non-current assets section. Only this year\'s charge is an expense.' },
    { skill: 'contra-and-equity', kind: 'mcq', q: 'Where is the balance on a trader\'s provision for irrecoverable debts shown?',
      options: ['Deducted from trade receivables in current assets', 'Under current liabilities as an amount owed', 'As an expense in the income statement', 'Added to equity in the statement of financial position'], answer: 0,
      why: 'The provision reduces trade receivables to the amount expected to be collected, so it is deducted from them under current assets. It is not a liability.' },
    { skill: 'contra-and-equity', kind: 'mcq', q: 'A sole trader took $6,000 from the business for personal use during the year. Where is this shown?',
      options: ['Deducted from equity', 'Expense in the income statement', 'Under current liabilities', 'Deducted from current assets'], answer: 0,
      why: 'Drawings are taken by the owner, not spent on running the business, so they reduce equity in the statement of financial position.' },
    { skill: 'contra-and-equity', kind: 'mcq', q: 'A trader spends $12,000 building an extension to the shop and $700 repainting the existing shop front. Where are these shown?',
      options: ['$12,000 non-current asset; $700 expense', '$12,000 expense; $700 non-current asset', 'Both as non-current assets', 'Both as expenses in the income statement'], answer: 0,
      why: 'The extension adds to the premises (capital expenditure), so it is a non-current asset. Repainting maintains the existing shop (revenue expenditure), so it is an expense.' },
    { skill: 'sort-a-list', kind: 'multi', q: 'Which of these balances are current assets?',
      options: ['Inventory', 'Petty cash', 'Rent paid in advance', 'Bank overdraft', 'Accumulated depreciation', 'Delivery van used by the business'], answers: [0, 1, 2],
      why: 'Inventory, petty cash and prepayments (other receivables) are current assets. An overdraft is a current liability, accumulated depreciation is deducted from non-current assets, and the van is a non-current asset.' },
    { skill: 'sort-a-list', kind: 'multi', q: 'Which of these items appear in the income statement?',
      options: ['Depreciation charge for the year', 'Irrecoverable debts written off', 'Increase in the provision for irrecoverable debts', 'Accumulated depreciation', 'Provision for irrecoverable debts balance', 'Drawings'], answers: [0, 1, 2],
      why: 'This year\'s depreciation, irrecoverable debts and the increase in the provision are expenses. Accumulated depreciation and the provision balance go in the statement of financial position, and drawings reduce equity.' },
    { skill: 'sort-a-list', kind: 'multi', q: 'Which of these are current liabilities at the year end?',
      options: ['Bank overdraft', 'Wages owing', 'Trade payables', 'Bank loan repayable in 2033', 'Provision for irrecoverable debts', 'Insurance paid in advance'], answers: [0, 1, 2],
      why: 'An overdraft, accrued wages and trade payables are all due within 12 months. A long-term loan is non-current, the provision is deducted from receivables, and a prepayment is a current asset.' },
    { skill: 'sort-a-list', kind: 'multi', q: 'Which of these are shown under non-current assets?',
      options: ['Premises', 'Shop fittings', 'Computer equipment used in the office', 'Goods held for resale', 'Trade receivables', 'Cash at bank'], answers: [0, 1, 2],
      why: 'Premises, fittings and office computers are kept for use for more than a year. Goods for resale, receivables and cash are current assets.' }
  ] };

  /* ---------------- ACC-FS-03 Effect on profit or working capital ---------------- */
  var IDN = ['Increase', 'Decrease', 'No effect'], OUN = ['Overstated', 'Understated', 'No effect'];
  function eff(skill, stem, ans, why) { return { skill: skill, kind: 'mcq', q: stem, options: IDN.slice(), answer: IDN.indexOf(ans), why: why, keepOrder: true }; }
  function ou(skill, stem, ans, why) { return { skill: skill, kind: 'mcq', q: stem, options: OUN.slice(), answer: OUN.indexOf(ans), why: why, keepOrder: true }; }
  var GPPF = ['Gross profit overstated', 'Gross profit understated', 'Profit for the year overstated', 'Profit for the year understated'];
  var GPBOTH = ['Both gross profit and profit for the year overstated', 'Both gross profit and profit for the year understated', 'Gross profit overstated; profit for the year no effect', 'Gross profit understated; profit for the year no effect'];
  function gpboth(skill, stem, ans, why) { return { skill: skill, kind: 'mcq', q: stem, options: GPBOTH.slice(), answer: GPBOTH.indexOf(ans), why: why, keepOrder: true }; }
  function gppf(skill, stem, ans, why) { return { skill: skill, kind: 'mcq', q: stem, options: GPPF.slice(), answer: GPPF.indexOf(ans), why: why, keepOrder: true }; }
  B['ACC-FS-03'] = { title: 'Will profit (or working capital) go up, down or stay the same?', items: [
    eff('transactions-and-profit', 'A sole trader withdraws $1,500 cash from the business for personal use. What is the effect on profit for the year?', 'No effect',
      'Debit drawings, credit cash. Neither account is income or expense, so profit is unchanged; drawings reduce equity instead.'),
    eff('transactions-and-profit', 'A trader pays a supplier $2,000 to settle a debt of $2,050, receiving a discount. What is the effect on profit for the year?', 'Increase',
      'The $50 discount received is income (credit discount received), so profit increases.'),
    eff('transactions-and-profit', 'A trader allows a customer to pay $980 to settle a debt of $1,000. What is the effect on profit for the year?', 'Decrease',
      'The $20 discount allowed is an expense (debit discount allowed), so profit decreases.'),
    eff('transactions-and-profit', 'The owner pays $10,000 of personal savings into the business bank account as extra capital. What is the effect on profit for the year?', 'No effect',
      'Debit bank, credit capital. Capital introduced increases equity directly; it is not income, so profit is unchanged.'),
    eff('transactions-and-profit', 'A trader pays a credit supplier the full $3,400 owed, with no discount. What is the effect on profit for the year?', 'No effect',
      'Debit trade payables, credit bank. One liability and one asset fall by the same amount; no income or expense is involved.'),
    eff('transactions-and-profit', 'A trader writes off a customer\'s debt of $360 as irrecoverable. What is the effect on profit for the year?', 'Decrease',
      'Debit irrecoverable debts (an expense), credit trade receivables. More expense means lower profit.'),
    eff('transactions-and-profit', 'A trader sells an old machine for exactly its carrying amount of $2,500. What is the effect on profit for the year?', 'No effect',
      'There is no gain or loss on disposal because the proceeds equal the carrying amount, so no income or expense arises.'),
    eff('transactions-and-profit', 'A shop sub-lets its spare storeroom and receives $600 rent for the year. What is the effect on profit for the year?', 'Increase',
      'Debit bank, credit rent received. Rent received is other income, so profit increases.'),
    { skill: 'transactions-and-profit', kind: 'multi', q: 'Which of these transactions change a sole trader\'s profit for the year?',
      options: ['Paying the electricity bill for the year', 'Receiving commission from a supplier', 'Buying a new computer for office use', 'Repaying part of a bank loan', 'Receiving extra capital from the owner', 'Transferring cash from the till to the bank'], answers: [0, 1],
      why: 'Only income and expenses change profit: electricity is an expense and commission received is income. Buying a non-current asset, repaying a loan, capital introduced and moving cash to the bank do not change profit.' },
    ou('omissions', 'At the year end, $480 of electricity used was owing but no accrual was recorded. What is the effect on profit for the year?', 'Overstated',
      'The electricity expense is $480 too low, so the profit shown is higher than it should be.'),
    ou('omissions', 'A trader paid a year\'s insurance in advance, but the prepayment of $300 was ignored at the year end. What is the effect on profit for the year?', 'Understated',
      'Without the prepayment, the insurance expense includes $300 belonging to next year, so the expense is too high and profit is too low.'),
    ou('omissions', 'A required increase of $250 in the provision for irrecoverable debts was not recorded. What is the effect on profit for the year?', 'Overstated',
      'The increase is an expense that has been left out, so profit is shown $250 too high.'),
    ou('omissions', 'A credit sale of $700 made on the last day of the year was not recorded. What is the effect on profit for the year?', 'Understated',
      'Revenue is $700 too low, so gross profit and profit for the year are both understated.'),
    { skill: 'omissions', kind: 'mcq', q: 'A trader forgot to record the depreciation charge for the year. What is the effect on the non-current assets and on profit for the year?',
      options: ['Both overstated', 'Assets overstated, profit understated', 'Assets understated, profit overstated', 'Both understated'], answer: 0, keepOrder: true,
      why: 'Without the charge, accumulated depreciation is too low (assets too high) and expenses are too low (profit too high).' },
    gppf('capital-or-revenue', 'A trader bought shelving for the shop and recorded it in the repairs and maintenance account. What is the effect?', 'Profit for the year understated',
      'Capital expenditure treated as revenue expenditure becomes an extra expense below gross profit, so profit for the year is too low. Gross profit is not affected.'),
    gppf('capital-or-revenue', 'A trader debited the cost of servicing the delivery van to the motor vehicles (asset) account. What is the effect?', 'Profit for the year overstated',
      'Revenue expenditure treated as capital means an expense is missing, so profit for the year is too high. Gross profit is not affected.'),
    { skill: 'capital-or-revenue', kind: 'mcq', q: 'A trader recorded the cost of a new van as motor expenses. What is the effect on gross profit?',
      options: ['Overstated', 'Understated', 'No effect'], answer: 2, keepOrder: true,
      why: 'Motor expenses are shown after gross profit, so gross profit is not affected. Only profit for the year is understated.' },
    gpboth('gross-profit-items', 'Closing inventory was counted as $14,500 instead of the correct $12,500. What is the effect on gross profit and on profit for the year?', 'Both gross profit and profit for the year overstated',
      'A higher closing inventory makes cost of sales $2,000 too low, so gross profit is overstated. Profit for the year starts from gross profit, so it is overstated by the same $2,000.'),
    gpboth('gross-profit-items', 'Goods costing $400 taken by the owner for personal use were not recorded. What is the effect on gross profit and on profit for the year?', 'Both gross profit and profit for the year understated',
      'Purchases still include the $400, so cost of sales is too high and gross profit is too low. Profit for the year is lower by the same $400.'),
    gpboth('gross-profit-items', 'Returns inwards of $650 were left out of the income statement. What is the effect on gross profit and on profit for the year?', 'Both gross profit and profit for the year overstated',
      'Revenue should be reduced by returns inwards. Without the deduction, revenue and gross profit are $650 too high, and so is profit for the year.'),
    { skill: 'gross-profit-items', kind: 'mcq', q: 'Carriage inwards of $820 was wrongly shown as carriage outwards. What is the effect on gross profit and on profit for the year?',
      options: ['Gross profit overstated; profit for the year no effect', 'Gross profit understated; profit for the year no effect', 'Gross profit no effect; profit for the year overstated', 'Both gross profit and profit for the year overstated'], answer: 0,
      why: 'Cost of sales is $820 too low, so gross profit is overstated. The $820 is still deducted as an expense below gross profit, so profit for the year is correct.' },
    eff('working-capital', 'A trader buys inventory of $1,200 on credit. What is the effect on working capital?', 'No effect',
      'Inventory (a current asset) and trade payables (a current liability) both rise by $1,200, so current assets less current liabilities is unchanged.'),
    eff('working-capital', 'A credit customer pays $900 into the trader\'s bank account. What is the effect on working capital?', 'No effect',
      'Bank rises and trade receivables fall by $900: a swap between two current assets, so working capital is unchanged.'),
    eff('working-capital', 'A trader pays $8,000 from the bank for a new delivery van. What is the effect on working capital?', 'Decrease',
      'Bank (a current asset) falls, while the van is a non-current asset, so working capital decreases.'),
    eff('working-capital', 'A trader receives a five-year bank loan of $10,000 into the bank account. What is the effect on working capital?', 'Increase',
      'Bank (a current asset) rises, but the loan is a non-current liability, so working capital increases.'),
    eff('working-capital', 'A trader pays a supplier $1,500 from the bank to clear the amount owed. What is the effect on working capital?', 'No effect',
      'Bank and trade payables both fall by $1,500, so current assets less current liabilities is unchanged.')
  ] };

  /* ---------------- ACC-FS-07 Ratio formulas and calculations ---------------- */
  B['ACC-FS-07'] = { title: 'Ratio formulas and how to calculate them', items: [
    { skill: 'formulas', kind: 'mcq', q: 'Which is the formula for the gross profit percentage?',
      options: ['Gross profit ÷ revenue × 100', 'Gross profit ÷ cost of sales × 100', 'Revenue ÷ gross profit × 100', 'Profit for the year ÷ revenue × 100'], answer: 0,
      why: 'Gross profit percentage compares gross profit with revenue: gross profit ÷ revenue × 100.' },
    { skill: 'formulas', kind: 'mcq', q: 'Which is the formula for return on capital employed?',
      options: ['Profit for the year ÷ capital employed × 100', 'Gross profit ÷ capital employed × 100', 'Capital employed ÷ profit for the year × 100', 'Profit for the year ÷ revenue × 100'], answer: 0,
      why: 'ROCE measures the profit for the year earned on the capital employed: profit for the year ÷ capital employed × 100.' },
    { skill: 'formulas', kind: 'mcq', q: 'Which is the formula for the liquid (acid test) ratio?',
      options: ['(Current assets − inventory) : current liabilities', 'Current assets : current liabilities', '(Current assets − inventory) : non-current liabilities', 'Inventory : current liabilities'], answer: 0,
      why: 'The liquid ratio leaves out inventory, the least liquid current asset: (current assets − inventory) ÷ current liabilities, written as x : 1.' },
    { skill: 'formulas', kind: 'mcq', q: 'Which is the formula for the current (working capital) ratio?',
      options: ['Current assets : current liabilities', 'Current liabilities : current assets', 'Current assets : total liabilities', 'Total assets : current liabilities'], answer: 0,
      why: 'The current ratio is current assets ÷ current liabilities, written as x : 1.' },
    { skill: 'formulas', kind: 'multi', q: 'Which of these ratios are profitability ratios, written as percentages?',
      options: ['Gross profit percentage', 'Profit for the year as a percentage of revenue', 'Return on capital employed', 'Current (working capital) ratio', 'Liquid (acid test) ratio'], answers: [0, 1, 2],
      why: 'The three profitability ratios are percentages. The current and liquid ratios measure liquidity and are written as x : 1.' },
    { skill: 'formulas', kind: 'mcq', q: 'A student calculates a current ratio as current assets $18,000 ÷ current liabilities $8,000. How should the answer be written?',
      options: ['2.25 : 1', '225%', '2.25%', '0.44 : 1'], answer: 0,
      why: '$18,000 ÷ $8,000 = 2.25. Liquidity ratios are written as a ratio to 1, so 2.25 : 1, not as a percentage.' },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), rev = rstep(80000, 200000, 100), gp = rstep(Math.round(rev * 0.25), Math.round(rev * 0.55), 10);
      return pctQ('<b>' + n + '</b>\'s revenue was ' + m(rev) + ' and gross profit was ' + m(gp) + '. Calculate the gross profit percentage.', gp / rev * 100,
        function (a) { return 'Gross profit ÷ revenue × 100 = ' + m(gp) + ' ÷ ' + m(rev) + ' × 100 = ' + a + '%.'; });
    } },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), rev = rstep(60000, 150000, 100), cos = rstep(Math.round(rev * 0.45), Math.round(rev * 0.75), 10);
      var gp = rev - cos;
      return pctQ('<b>' + n + '</b>\'s revenue was ' + m(rev) + ' and cost of sales was ' + m(cos) + '. Calculate the gross profit percentage.', gp / rev * 100,
        function (a) { return 'Gross profit = ' + m(rev) + ' − ' + m(cos) + ' = ' + m(gp) + '. Gross profit percentage = ' + m(gp) + ' ÷ ' + m(rev) + ' × 100 = ' + a + '%.'; });
    } },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), s = rstep(90000, 180000, 100), ri = rstep(1500, 5000, 10), gp = rstep(Math.round(s * 0.3), Math.round(s * 0.45), 10);
      var rev = s - ri;
      return pctQ('<b>' + n + '</b> had sales of ' + m(s) + ', returns inwards of ' + m(ri) + ' and gross profit of ' + m(gp) + '. Calculate the gross profit percentage.', gp / rev * 100,
        function (a) { return 'Revenue is sales less returns inwards: ' + m(s) + ' − ' + m(ri) + ' = ' + m(rev) + '. Gross profit percentage = ' + m(gp) + ' ÷ ' + m(rev) + ' × 100 = ' + a + '%.'; });
    } },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), rev = rstep(70000, 160000, 100), pf = rstep(Math.round(rev * 0.06), Math.round(rev * 0.22), 10);
      return pctQ('<b>' + n + '</b>\'s revenue was ' + m(rev) + ', gross profit was ' + m(Math.round(rev * 0.4)) + ' and profit for the year was ' + m(pf) + '. Calculate profit for the year as a percentage of revenue.', pf / rev * 100,
        function (a) { return 'Profit for the year ÷ revenue × 100 = ' + m(pf) + ' ÷ ' + m(rev) + ' × 100 = ' + a + '%. Gross profit is not used in this ratio.'; });
    } },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), rev = rstep(80000, 150000, 100), gp = rstep(Math.round(rev * 0.35), Math.round(rev * 0.45), 10), oi = rstep(200, 1500, 10), ex = rstep(Math.round(rev * 0.15), Math.round(rev * 0.25), 10);
      var pf = gp + oi - ex;
      return pctQ('<b>' + n + '</b>: revenue ' + m(rev) + ', gross profit ' + m(gp) + ', discount received ' + m(oi) + ', total expenses ' + m(ex) + '. Calculate profit for the year as a percentage of revenue.', pf / rev * 100,
        function (a) { return 'Profit for the year = ' + m(gp) + ' + ' + m(oi) + ' − ' + m(ex) + ' = ' + m(pf) + '. ' + m(pf) + ' ÷ ' + m(rev) + ' × 100 = ' + a + '%.'; });
    } },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), ce = rstep(40000, 120000, 500), pf = rstep(Math.round(ce * 0.08), Math.round(ce * 0.3), 10);
      return pctQ('<b>' + n + '</b>\'s profit for the year was ' + m(pf) + ' and capital employed was ' + m(ce) + '. Calculate the return on capital employed.', pf / ce * 100,
        function (a) { return 'ROCE = profit for the year ÷ capital employed × 100 = ' + m(pf) + ' ÷ ' + m(ce) + ' × 100 = ' + a + '%.'; });
    } },
    { skill: 'profitability-calculations', gen: function () {
      var n = who(), ce = rstep(120000, 220000, 500), gp = rstep(30000, 60000, 10), ex = rstep(15000, 25000, 10), rr = rstep(500, 3000, 100);
      var pf = gp + rr - ex;
      return pctQ('<b>' + n + '</b>: gross profit ' + m(gp) + ', rent received ' + m(rr) + ', expenses ' + m(ex) + ', capital employed ' + m(ce) + '. Calculate the return on capital employed.', pf / ce * 100,
        function (a) { return 'Profit for the year = ' + m(gp) + ' + ' + m(rr) + ' − ' + m(ex) + ' = ' + m(pf) + '. ROCE = ' + m(pf) + ' ÷ ' + m(ce) + ' × 100 = ' + a + '%.'; });
    } },
    { skill: 'liquidity-calculations', gen: function () {
      var n = who(), inv = rstep(5000, 15000, 50), tr = rstep(4000, 12000, 10), bk = rstep(500, 5000, 10), tp = rstep(4000, 10000, 10), acc = rstep(200, 900, 10);
      var ca = inv + tr + bk, cl = tp + acc;
      return ratioQ('<b>' + n + '</b>: inventory ' + m(inv) + ', trade receivables ' + m(tr) + ', bank ' + m(bk) + ', trade payables ' + m(tp) + ', other payables ' + m(acc) + '. Calculate the current ratio.', ca / cl,
        function (a) { return 'Current assets = ' + m(ca) + '; current liabilities = ' + m(cl) + '. ' + m(ca) + ' ÷ ' + m(cl) + ' = ' + a + ' : 1.'; });
    } },
    { skill: 'liquidity-calculations', gen: function () {
      var n = who(), inv = rstep(6000, 14000, 50), tr = rstep(5000, 10000, 100), pr = tr * pick([2, 5]) / 100, pp = rstep(100, 600, 10), cash = rstep(100, 800, 10), tp = rstep(5000, 9000, 10), od = rstep(500, 2500, 10), loan = rstep(10000, 20000, 1000);
      var ca = inv + tr - pr + pp + cash, cl = tp + od;
      return ratioQ('<b>' + n + '</b>: inventory ' + m(inv) + ', trade receivables ' + m(tr) + ' less provision ' + m(pr) + ', prepayments ' + m(pp) + ', cash ' + m(cash) + ', trade payables ' + m(tp) + ', bank overdraft ' + m(od) + ', bank loan (repayable 2031) ' + m(loan) + '. Calculate the current ratio.', ca / cl,
        function (a) { return 'Current assets = ' + m(inv) + ' + ' + m(tr - pr) + ' + ' + m(pp) + ' + ' + m(cash) + ' = ' + m(ca) + '. Current liabilities = ' + m(tp) + ' + ' + m(od) + ' = ' + m(cl) + ' (the loan is non-current). ' + m(ca) + ' ÷ ' + m(cl) + ' = ' + a + ' : 1.'; });
    } },
    { skill: 'liquidity-calculations', gen: function () {
      var n = who(), inv = rstep(8000, 18000, 50), tr = rstep(3000, 9000, 10), bk = rstep(300, 3000, 10), cl = rstep(5000, 11000, 10);
      var liq = tr + bk;
      return ratioQ('<b>' + n + '</b> has current assets of ' + m(inv + tr + bk) + ', of which inventory is ' + m(inv) + '. Current liabilities are ' + m(cl) + '. Calculate the liquid (acid test) ratio.', liq / cl,
        function (a) { return '(' + m(inv + tr + bk) + ' − ' + m(inv) + ') ÷ ' + m(cl) + ' = ' + m(liq) + ' ÷ ' + m(cl) + ' = ' + a + ' : 1.'; });
    } },
    { skill: 'liquidity-calculations', gen: function () {
      var n = who(), inv = rstep(6000, 12000, 50), tr = rstep(6000, 12000, 100), rate = pick([2, 5]), pp = rstep(100, 500, 10), bk = rstep(400, 2500, 10), tp = rstep(5000, 10000, 10), acc = rstep(150, 700, 10);
      var pr = tr * rate / 100, liq = tr - pr + pp + bk, cl = tp + acc;
      return ratioQ('<b>' + n + '</b>: inventory ' + m(inv) + ', trade receivables ' + m(tr) + ' with a ' + rate + '% provision for irrecoverable debts, other receivables ' + m(pp) + ', bank ' + m(bk) + ', trade payables ' + m(tp) + ', other payables ' + m(acc) + '. Calculate the liquid (acid test) ratio.', liq / cl,
        function (a) { return 'Net receivables = ' + m(tr) + ' − ' + m(pr) + ' = ' + m(tr - pr) + '. Liquid assets = ' + m(tr - pr) + ' + ' + m(pp) + ' + ' + m(bk) + ' = ' + m(liq) + '. ' + m(liq) + ' ÷ ' + m(cl) + ' = ' + a + ' : 1.'; });
    } },
    { skill: 'liquidity-calculations', gen: function () {
      var n = who(), inv = rstep(5000, 10000, 50), tr = rstep(4000, 8000, 10), bk = rstep(500, 2000, 10), tp = rstep(3000, 6000, 10), loan = rstep(8000, 15000, 1000);
      var ca = inv + tr + bk, liq = tr + bk, x = R.roundDp(liq / tp, 2);
      var fx = function (v) { return R.roundDp(v, 2).toFixed(2) + ' : 1'; };
      return mcqNum('<b>' + n + '</b>: inventory ' + m(inv) + ', trade receivables ' + m(tr) + ', bank ' + m(bk) + ', trade payables ' + m(tp) + ', bank loan repayable in 2030 ' + m(loan) + '. What is the liquid (acid test) ratio?',
        liq / tp, [ca / tp, liq / (tp + loan), ca / (tp + loan), tp / liq], 'Liquid assets = ' + m(tr) + ' + ' + m(bk) + ' = ' + m(liq) + ' (inventory left out). Current liabilities are only the trade payables of ' + m(tp) + '. ' + m(liq) + ' ÷ ' + m(tp) + ' = ' + x.toFixed(2) + ' : 1.', fx);
    } },
    { skill: 'working-backwards', gen: function () {
      var n = who(), gpp = pick([25, 30, 35, 40, 45]), rev = rstep(60000, 160000, 1000);
      var gp = rev * gpp / 100;
      return money('<b>' + n + '</b>\'s gross profit percentage was ' + gpp + '% and gross profit was ' + m(gp) + '. Calculate revenue.', rev,
        'Gross profit percentage = gross profit ÷ revenue × 100, so revenue = ' + m(gp) + ' × 100 ÷ ' + gpp + ' = ' + m(rev) + '.');
    } },
    { skill: 'working-backwards', gen: function () {
      var n = who(), cr = pick([1.5, 1.6, 1.8, 2, 2.4, 2.5]), cl = rstep(4000, 12000, 500);
      var ca = cr * cl;
      return money('<b>' + n + '</b>\'s current ratio is ' + cr.toFixed(2) + ' : 1 and current assets are ' + m(ca) + '. Calculate current liabilities.', cl,
        'Current ratio = current assets ÷ current liabilities, so current liabilities = ' + m(ca) + ' ÷ ' + cr.toFixed(2) + ' = ' + m(cl) + '.');
    } },
    { skill: 'working-backwards', gen: function () {
      var n = who(), cl = rstep(4000, 10000, 500), lr = pick([0.6, 0.8, 0.9, 1.1, 1.2]), gap = pick([0.8, 1, 1.2, 1.4]);
      var cr = R.roundDp(lr + gap, 1), inv = R.roundDp(gap * cl, 0);
      return money('<b>' + n + '</b> has current liabilities of ' + m(cl) + '. The current ratio is ' + cr.toFixed(1) + ' : 1 and the liquid ratio is ' + lr.toFixed(1) + ' : 1. Calculate the value of inventory.', inv,
        'The only difference between the two ratios is inventory: (' + cr.toFixed(1) + ' − ' + lr.toFixed(1) + ') × ' + m(cl) + ' = ' + gap.toFixed(1) + ' × ' + m(cl) + ' = ' + m(inv) + '.');
    } },
    { skill: 'working-backwards', gen: function () {
      var n = who(), ce = rstep(40000, 100000, 1000), roce = pick([8, 10, 12, 15, 18, 20, 24]);
      var pf = ce * roce / 100;
      return money('<b>' + n + '</b>\'s capital employed is ' + m(ce) + ' and the return on capital employed is ' + roce + '%. Calculate profit for the year.', pf,
        'Profit for the year = ROCE × capital employed ÷ 100 = ' + roce + ' × ' + m(ce) + ' ÷ 100 = ' + m(pf) + '.');
    } },
    { skill: 'working-backwards', gen: function () {
      var n = who(), rev = rstep(50000, 120000, 1000), pfp = pick([8, 10, 12, 15]), gpp = pfp + pick([15, 20, 25]);
      var ex = rev * (gpp - pfp) / 100;
      return money('<b>' + n + '</b> has no other income. Revenue was ' + m(rev) + ', the gross profit percentage was ' + gpp + '% and profit for the year as a percentage of revenue was ' + pfp + '%. Calculate total expenses.', ex,
        'Gross profit = ' + gpp + '% × ' + m(rev) + ' = ' + m(rev * gpp / 100) + '; profit for the year = ' + pfp + '% × ' + m(rev) + ' = ' + m(rev * pfp / 100) + '. Expenses are the difference: ' + m(ex) + '.');
    } }
  ] };

  /* ---------------- ACC-FS-08 Evaluating profitability ---------------- */
  function p1(x) { return x.toFixed(1) + '%'; }
  function profTable(g, p, r) {
    return tbl([['Ratio', '2024', '2025'], ['Gross profit percentage', p1(g[0]), p1(g[1])], ['Profit for the year as a % of revenue', p1(p[0]), p1(p[1])], ['Return on capital employed', p1(r[0]), p1(r[1])]], true);
  }
  function up(a, b) { var x = rstep(a * 10, b * 10, 1) / 10; return x; }
  B['ACC-FS-08'] = { title: 'Evaluating profitability using ratios', items: [
    { skill: 'gross-profit-movement', gen: function () {
      var n = who(), g0 = up(34, 45), g1 = g0 - up(3, 8), p0 = up(10, 15), p1v = p0 - up(2, 4), r0 = up(14, 22), r1 = r0 - up(1, 4);
      return { kind: 'mcq', q: '<b>' + n + '</b>, a retailer, has these ratios.' + profTable([g0, g1], [p0, p1v], [r0, r1]) + 'What is the most likely reason for the change in the gross profit percentage?',
        options: ['Suppliers raised prices but selling prices stayed the same', 'Wages and rent rose faster than revenue during the year', 'The owner paid extra capital into the business bank account', 'Credit customers took much longer to pay what they owed'], answer: 0,
        why: 'Gross profit percentage fell from ' + p1(g0) + ' to ' + p1(g1) + '. It depends only on selling prices and the cost of goods sold, so a higher purchase cost not passed on to customers explains it. Wages and rent are below gross profit, and capital or debt collection do not affect it.' };
    } },
    { skill: 'gross-profit-movement', gen: function () {
      var n = who(), g0 = up(28, 38), g1 = g0 + up(3, 7), p0 = up(8, 12), p1v = p0 + up(2, 5), r0 = up(12, 18), r1 = r0 + up(1, 4);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s ratios are shown.' + profTable([g0, g1], [p0, p1v], [r0, r1]) + 'Which is a likely reason for the change in the gross profit percentage?',
        options: ['Selling prices were raised while purchase costs did not change', 'Rent and insurance were both reduced by moving to a cheaper shop unit', 'The business kept a larger bank balance during the year', 'The owner took smaller drawings than in the year before'], answer: 0,
        why: 'Gross profit percentage rose from ' + p1(g0) + ' to ' + p1(g1) + '. Higher selling prices with the same cost of goods increase gross profit per $ of revenue. Rent and insurance only affect profit for the year, and drawings and the bank balance do not affect profit at all.' };
    } },
    { skill: 'expense-control', gen: function () {
      var n = who(), g = up(30, 42), p0 = up(12, 16), p1v = p0 - up(3, 6), r0 = up(15, 22), r1 = r0 - up(2, 5);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s ratios are shown.' + profTable([g, g], [p0, p1v], [r0, r1]) + 'What does the change in profit for the year as a percentage of revenue suggest?',
        options: ['Expenses grew faster than revenue, so control of expenses was weaker', 'Selling prices were cut, so each sale earned less gross profit than before', 'The cost of buying goods for resale rose sharply in 2025', 'The business found it harder to pay its short-term debts'], answer: 0,
        why: 'The gross profit percentage stayed at ' + p1(g) + ', so prices and buying costs did not change. Profit for the year as a % of revenue fell from ' + p1(p0) + ' to ' + p1(p1v) + ', so expenses took a bigger share of revenue. Paying debts is liquidity, not profitability.' };
    } },
    { skill: 'expense-control', gen: function () {
      var n = who(), g0 = up(35, 45), g1 = g0 - up(2, 5), p0 = up(9, 13), p1v = p0 + up(1, 4), r0 = up(12, 18), r1 = r0 + up(1, 3);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s ratios are shown.' + profTable([g0, g1], [p0, p1v], [r0, r1]) + 'Which conclusion about expenses is best supported?',
        options: ['Expenses were controlled better, more than making up for the fall in gross margin', 'Expenses rose faster than revenue, which caused the fall in gross margin', 'Expenses cannot have changed because gross profit percentage fell', 'Expenses were higher, because profit for the year rose more slowly than revenue did'], answer: 0,
        why: 'Gross profit percentage fell (' + p1(g0) + ' to ' + p1(g1) + ') but profit for the year as a % of revenue rose (' + p1(p0) + ' to ' + p1(p1v) + '). The gap between them (expenses as a % of revenue) narrowed, so expenses were better controlled.' };
    } },
    { skill: 'return-on-capital', gen: function () {
      var n = who(), pf0 = rstep(20000, 30000, 100), pf1 = pf0 + rstep(1000, 3000, 100), r0 = up(16, 22), r1 = r0 - up(3, 6);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s profit for the year rose from ' + m(pf0) + ' to ' + m(pf1) + ', but return on capital employed fell from ' + p1(r0) + ' to ' + p1(r1) + '. What is the most likely explanation?',
        options: ['Capital employed rose by a bigger proportion than profit did', 'Gross profit percentage must have fallen sharply during the year', 'The business made a loss on its sales during the year', 'Current liabilities grew faster than current assets'], answer: 0,
        why: 'ROCE = profit ÷ capital employed × 100. Profit went up, so for ROCE to fall the capital employed must have grown even faster, for example extra capital that is not yet earning profit.' };
    } },
    { skill: 'judgement-on-a-claim', gen: function () {
      var n = who(), g0 = up(32, 44), g1 = g0 - up(2, 5), p0 = up(11, 15), p1v = p0 - up(1, 4), r0 = up(14, 20), r1 = r0 - up(2, 5);
      return { kind: 'mcq', q: '<b>' + n + '</b> says: "My business was more profitable in 2025 than in 2024." The ratios are:' + profTable([g0, g1], [p0, p1v], [r0, r1]) + 'Which judgement is correct?',
        options: ['Incorrect: all three profitability ratios fell', 'Correct: profit for the year is still positive', 'Correct: gross profit percentage is above 30%', 'Cannot say without the current and liquid ratios'], answer: 0,
        why: 'Gross profit %, profit for the year as a % of revenue and ROCE all fell, so profitability worsened and the claim is wrong. Liquidity ratios are not needed to judge profitability.' };
    } },
    { skill: 'judgement-on-a-claim', gen: function () {
      var n = who(), g0 = up(36, 44), g1 = g0 - up(2, 4), p0 = up(9, 12), p1v = p0 + up(2, 4), r0 = up(13, 17), r1 = r0 + up(2, 4);
      return { kind: 'mcq', q: '<b>' + n + '</b> is unhappy: "The gross profit percentage fell, so 2025 was a worse year." The ratios are:' + profTable([g0, g1], [p0, p1v], [r0, r1]) + 'Which judgement is best?',
        options: ['Incorrect: profit for the year % and ROCE both improved', 'Correct: gross profit percentage is the only ratio that matters', 'Correct: a lower gross margin always means lower profit', 'Incorrect: gross profit percentage actually rose in 2025'], answer: 0,
        why: 'Although gross profit % fell (' + p1(g0) + ' to ' + p1(g1) + '), profit for the year as a % of revenue rose to ' + p1(p1v) + ' and ROCE rose to ' + p1(r1) + ', showing better expense control and better use of capital. Overall profitability improved.' };
    } },
    { skill: 'judgement-on-a-claim', gen: function () {
      var n = pair(), g0 = up(30, 40), g1 = g0 + up(1, 3), p0 = up(10, 14), p1v = p0 + up(1, 3), r0 = up(15, 20), r1 = r0 + up(1, 3);
      return { kind: 'mcq', q: 'Partners <b>' + n[0] + '</b> and <b>' + n[1] + '</b> believe profitability improved in 2025.' + profTable([g0, g1], [p0, p1v], [r0, r1]) + 'Which judgement is best supported?',
        options: ['Correct: every profitability ratio improved', 'Incorrect: profit for the year % fell in 2025', 'Incorrect: ROCE fell, so capital was wasted', 'Correct: but only because liquidity improved'], answer: 0,
        why: 'Gross profit % rose to ' + p1(g1) + ', profit for the year as a % of revenue rose to ' + p1(p1v) + ' and ROCE rose to ' + p1(r1) + ', so the partners are correct. Liquidity is a separate issue.' };
    } },
    { skill: 'meaning-of-ratios', kind: 'mcq', q: 'Which ratio is the best guide to how well a trader controls expenses?',
      options: ['Profit for the year as a percentage of revenue', 'Gross profit percentage', 'Current (working capital) ratio', 'Liquid (acid test) ratio'], answer: 0,
      why: 'Profit for the year is after all expenses, so this ratio shows how much of each $ of revenue is left after expenses. Gross profit % ignores expenses, and the other two are liquidity ratios.' },
    { skill: 'meaning-of-ratios', kind: 'mcq', q: 'Which ratio shows how efficiently the money invested in a business is used to earn profit?',
      options: ['Return on capital employed', 'Gross profit percentage', 'Liquid (acid test) ratio', 'Profit for the year as a percentage of revenue'], answer: 0,
      why: 'ROCE compares profit for the year with the capital employed, so it measures the return earned on the money invested.' },
    { skill: 'meaning-of-ratios', kind: 'mcq', q: 'A trader\'s ROCE rose from 12% to 15%. Which statement must be true?',
      options: ['Each $ of capital employed earned more profit', 'Profit for the year must have increased', 'Capital employed must have decreased', 'Gross profit percentage must also have increased this year'], answer: 0,
      why: 'A higher ROCE means more profit per $ of capital employed. This could come from higher profit or from less capital, so neither of those must be true on its own.' },
    { skill: 'meaning-of-ratios', kind: 'mcq', q: 'A trader\'s gross profit percentage is 40% and profit for the year as a percentage of revenue is 15%. There is no other income. What does the 25% difference represent?',
      options: ['Expenses as a percentage of revenue', 'Cost of sales as a percentage of revenue', 'Return on capital employed', 'Drawings as a percentage of revenue'], answer: 0,
      why: 'Profit for the year = gross profit − expenses, so the gap between the two percentages is expenses ÷ revenue × 100 = 25%.' },
    { skill: 'meaning-of-ratios', kind: 'mcq', q: 'Two shops sell the same goods. Shop X has a higher gross profit percentage than Shop Y, but a lower profit for the year as a percentage of revenue. What does this show?',
      options: ['Shop X has higher expenses compared with its revenue', 'Shop X buys its goods at a higher cost than Shop Y does', 'Shop X charges lower selling prices than Shop Y', 'Shop X has more capital employed than Shop Y'], answer: 0,
      why: 'Shop X keeps more gross profit per $ of sales but less after expenses, so its expenses take a larger share of revenue.' },
    { skill: 'causes', kind: 'multi', q: 'Which of these could cause a trader\'s gross profit percentage to rise?',
      options: ['Raising selling prices', 'Buying goods from a cheaper supplier', 'Receiving a bigger trade discount on purchases', 'Moving to a shop with lower rent', 'The owner introducing extra capital', 'Collecting debts from customers faster'], answers: [0, 1, 2],
      why: 'Gross profit % changes with selling prices and the cost of goods. Rent is an expense below gross profit, and capital or debt collection do not affect gross profit.' },
    { skill: 'causes', kind: 'multi', q: 'A trader\'s gross profit percentage stayed the same but profit for the year as a percentage of revenue fell. Which could explain this?',
      options: ['A big rise in wages', 'Higher rent for the shop', 'More irrecoverable debts written off', 'Higher selling prices', 'Cheaper purchases from suppliers', 'A lower bank overdraft'], answers: [0, 1, 2],
      why: 'With gross margin unchanged, the fall must come from higher expenses such as wages, rent or irrecoverable debts. Prices and purchase costs would change the gross profit %; the overdraft is a liquidity item.' },
    { skill: 'causes', kind: 'multi', q: 'Which of these could cause a trader\'s return on capital employed to fall?',
      options: ['Profit for the year fell', 'The owner introduced extra capital that has not yet earned profit', 'Expenses rose while revenue stayed the same', 'Capital employed fell while profit stayed the same', 'Profit rose while capital employed stayed the same'], answers: [0, 1, 2],
      why: 'ROCE falls when profit falls or capital employed rises faster than profit. Less capital, or more profit on the same capital, would raise ROCE.' },
    { skill: 'causes', kind: 'mcq', q: 'A shop moves to a unit with much higher rent. Selling prices and purchase costs do not change. What is the most likely effect?',
      options: ['Gross profit % unchanged; profit for the year % falls', 'Gross profit % falls; profit for the year % unchanged', 'Both ratios fall by the same amount', 'Both ratios stay exactly the same'], answer: 0,
      why: 'Rent is an expense below gross profit, so gross profit % is unchanged while profit for the year as a % of revenue falls.' },
    { skill: 'causes', kind: 'mcq', q: 'At the start of the year a trader pays in $20,000 of extra capital and leaves it unused in the bank all year. Profit is the same as last year. What happens to ROCE?',
      options: ['It falls', 'It rises', 'It stays the same', 'It doubles'], answer: 0, keepOrder: true,
      why: 'Capital employed rises but profit does not, so profit ÷ capital employed × 100 falls.' },
    { skill: 'causes', kind: 'mcq', q: 'A trader cuts selling prices by 10% to attract more customers, and sales volume rises strongly. What is the most likely effect on the gross profit percentage?',
      options: ['It falls, even if total gross profit rises', 'It rises because more goods are sold', 'It is unchanged because costs stay the same', 'It rises because revenue is higher'], answer: 0,
      why: 'Lower prices with the same cost per item mean less gross profit per $ of revenue, so the percentage falls. Selling more items may still raise total gross profit.' },
    { skill: 'evaluation-technique', kind: 'mcq', q: 'A question asks a student to evaluate whether a trader\'s profitability improved. Which point should <b>not</b> be included?',
      options: ['The liquid ratio fell below 1 : 1', 'ROCE rose from 14% to 17%', 'Gross profit % fell from 38% to 35%', 'Profit for the year % rose from 9% to 11%'], answer: 0,
      why: 'The liquid ratio measures liquidity, not profitability, so it earns no marks in a profitability evaluation.' },
    { skill: 'evaluation-technique', kind: 'mcq', q: 'Which sentence would earn the final conclusion mark in an evaluation of whether profitability improved?',
      options: ['Overall, profitability worsened, so the owner\'s claim is wrong.', 'Gross profit percentage was 32% in 2024.', 'Ratios are calculated using figures from the accounts.', 'Return on capital employed uses capital employed.'], answer: 0,
      why: 'The conclusion mark needs a clear overall judgement linked to the question, not a description of the figures or formulas.' },
    { skill: 'evaluation-technique', kind: 'mcq', q: 'Which sentence is the best analysis of a fall in profit for the year as a percentage of revenue from 14% to 10%?',
      options: ['It fell by 4 percentage points, suggesting expenses rose faster than revenue.', 'It fell by 4 percentage points, so the business cannot pay all of its suppliers on time.', 'It fell by 4 percentage points, so selling prices must have been cut.', 'It fell by 4 percentage points, so the owner took more drawings.'], answer: 0,
      why: 'A good analysis gives the movement and a sensible reason. Expense control is the usual reason; paying suppliers is liquidity, and drawings do not affect profit.' }
  ] };

  /* ---------------- ACC-FS-09 Liquidity and working capital ---------------- */
  function r2(x) { return x.toFixed(2) + ' : 1'; }
  function liqTable(c, l) { return tbl([['Ratio', '2024', '2025'], ['Current (working capital) ratio', r2(c[0]), r2(c[1])], ['Liquid (acid test) ratio', r2(l[0]), r2(l[1])]], true); }
  function rr(a, b) { return rint(Math.round(a * 100), Math.round(b * 100)) / 100; }
  B['ACC-FS-09'] = { title: 'Liquidity and working capital', items: [
    { skill: 'meaning', kind: 'mcq', q: 'What is meant by liquidity?',
      options: ['The ability to pay short-term debts when they fall due', 'The ability to make a profit from the business\'s activities', 'The total value of the business\'s non-current assets', 'The amount of capital the owner has invested'], answer: 0,
      why: 'Liquidity is about having enough cash or near-cash assets to pay debts due soon. Making profit is profitability.' },
    { skill: 'meaning', kind: 'mcq', q: 'A trader made a record profit this year but is struggling to pay suppliers on time. Which statement explains this?',
      options: ['Profitability and liquidity are different: profit is not the same as cash', 'The profit figure must be wrong if the trader cannot pay its suppliers on time', 'Liquidity always improves when profit rises', 'Suppliers are only paid out of the owner\'s capital'], answer: 0,
      why: 'Profit can be tied up in inventory, receivables or new assets, or taken as drawings, so a profitable business can still be short of cash.' },
    { skill: 'meaning', kind: 'mcq', q: 'Which ratio benchmarks are usually used to judge liquidity?',
      options: ['Current ratio 2 : 1; liquid ratio 1 : 1', 'Current ratio 1 : 1; liquid ratio 2 : 1', 'Current ratio 1 : 2; liquid ratio 1 : 1', 'Both ratios 2 : 1'], answer: 0,
      why: 'A current ratio of about 2 : 1 and a liquid ratio of about 1 : 1 are the usual guides.' },
    { skill: 'meaning', kind: 'mcq', q: 'Why is inventory left out of the liquid (acid test) ratio?',
      options: ['It takes the longest to turn into cash', 'It is not owned by the business', 'It is a non-current asset', 'It is already counted in current liabilities'], answer: 0,
      why: 'Inventory has to be sold, and often paid for later, before it becomes cash, so it is the least liquid current asset.' },
    { skill: 'meaning', gen: function () {
      var n = who(), inv = rstep(6000, 15000, 50), tr = rstep(4000, 10000, 10), bk = rstep(300, 3000, 10), tp = rstep(4000, 9000, 10), od = rstep(500, 2000, 10), loan = rstep(8000, 15000, 1000);
      var a = inv + tr + bk - tp - od;
      return money('<b>' + n + '</b>: inventory ' + m(inv) + ', trade receivables ' + m(tr) + ', cash ' + m(bk) + ', trade payables ' + m(tp) + ', bank overdraft ' + m(od) + ', bank loan repayable in 2032 ' + m(loan) + '. Calculate working capital.', a,
        'Working capital = current assets − current liabilities = (' + m(inv) + ' + ' + m(tr) + ' + ' + m(bk) + ') − (' + m(tp) + ' + ' + m(od) + ') = ' + m(a) + '. The long-term loan is not a current liability.');
    } },
    { skill: 'interpreting-ratios', gen: function () {
      var n = who(), c = rr(1.6, 2.1), l = rr(0.45, 0.75);
      return { kind: 'mcq', q: '<b>' + n + '</b> has a current ratio of ' + r2(c) + ' and a liquid ratio of ' + r2(l) + '. What does the liquid ratio show?',
        options: ['It may struggle to pay its debts due soon without selling inventory', 'It can easily pay all its short-term debts from cash and receivables', 'It is making too little profit on its sales', 'It holds too much cash that is not being used'], answer: 0,
        why: 'A liquid ratio of ' + r2(l) + ' is below the 1 : 1 guide, so liquid assets do not cover current liabilities. The business relies on selling inventory to pay its debts.' };
    } },
    { skill: 'interpreting-ratios', gen: function () {
      var n = who(), c = rr(2.6, 3.4), l = rr(0.6, 0.85);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s current ratio is ' + r2(c) + ' but the liquid ratio is only ' + r2(l) + '. What is the most likely reason for the large gap?',
        options: ['A large amount of inventory is held', 'Trade receivables are very high this year', 'The bank balance is very high', 'There is a large long-term loan'], answer: 0,
        why: 'The only difference between the two ratios is inventory. A big gap means a lot of the current assets are inventory.' };
    } },
    { skill: 'interpreting-ratios', gen: function () {
      var n = who(), c = rr(4.5, 7), l = rr(3, 4.4);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s current ratio is ' + r2(c) + ' and liquid ratio is ' + r2(l) + '. Which comment is most appropriate?',
        options: ['Debts can be paid, but too much may be tied up in idle assets', 'The business is likely to fail to pay its suppliers', 'The ratios are too low and credit suppliers should worry about being paid', 'Profitability must be very high to give these ratios'], answer: 0,
        why: 'Both ratios are well above 2 : 1 and 1 : 1, so paying debts is not a problem. However, very high ratios suggest cash, receivables or inventory that could be put to better use.' };
    } },
    { skill: 'interpreting-ratios', gen: function () {
      var n = who(), c = rr(0.6, 0.95);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s current ratio is ' + r2(c) + '. What does this tell you?',
        options: ['Current liabilities are greater than current assets', 'Current assets are about twice as large as current liabilities', 'The business has no inventory', 'The business is making a loss'], answer: 0,
        why: 'A current ratio below 1 : 1 means current liabilities exceed current assets, so working capital is negative and the business may not be able to pay its short-term debts.' };
    } },
    { skill: 'interpreting-ratios', gen: function () {
      var n = who(), c0 = rr(1.9, 2.3), c1 = c0, l0 = rr(0.9, 1.1), l1 = R.roundDp(l0 - rr(0.25, 0.4), 2);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s ratios are:' + liqTable([c0, c1], [l0, l1]) + 'Which is the most likely explanation?',
        options: ['More of the current assets are now held as inventory', 'Current liabilities have fallen sharply during the year', 'Profit for the year has fallen', 'More cash is held in the bank'], answer: 0,
        why: 'The current ratio is unchanged at ' + r2(c0) + ' but the liquid ratio fell from ' + r2(l0) + ' to ' + r2(l1) + '. Since the liquid ratio leaves out inventory, inventory must now make up a larger share of current assets.' };
    } },
    { skill: 'overall-judgement', gen: function () {
      var n = who(), c0 = rr(2, 2.5), c1 = R.roundDp(c0 - rr(0.5, 0.8), 2), l0 = rr(1, 1.3), l1 = R.roundDp(l0 - rr(0.35, 0.5), 2);
      return { kind: 'mcq', q: '<b>' + n + '</b> says liquidity has improved.' + liqTable([c0, c1], [l0, l1]) + 'Which judgement is correct?',
        options: ['No: both ratios fell, and the liquid ratio is now below 1 : 1', 'Yes: the current ratio is still above 1 : 1', 'Yes: falling ratios show that cash is being used more efficiently', 'No: but only because profitability fell'], answer: 0,
        why: 'The current ratio fell from ' + r2(c0) + ' to ' + r2(c1) + ' and the liquid ratio from ' + r2(l0) + ' to ' + r2(l1) + ', below the 1 : 1 guide. Liquidity has worsened.' };
    } },
    { skill: 'overall-judgement', gen: function () {
      var n = who(), c0 = rr(1.3, 1.7), c1 = R.roundDp(c0 + rr(0.5, 0.8), 2), l0 = rr(0.5, 0.75), l1 = R.roundDp(l0 + rr(0.35, 0.5), 2);
      return { kind: 'mcq', q: '<b>' + n + '</b>\'s liquidity ratios are shown.' + liqTable([c0, c1], [l0, l1]) + 'Which overall judgement is best?',
        options: ['Liquidity improved and both ratios are now close to the usual guides', 'Liquidity worsened because both ratios went up', 'Liquidity improved but the business is now less profitable', 'Liquidity is unchanged because the gap between the ratios is similar'], answer: 0,
        why: 'Both ratios rose: current ' + r2(c0) + ' to ' + r2(c1) + ' and liquid ' + r2(l0) + ' to ' + r2(l1) + '. They are now near 2 : 1 and 1 : 1, so the business can meet its short-term debts more easily.' };
    } },
    { skill: 'overall-judgement', kind: 'mcq', q: 'A trader says: "Profit rose this year, so my liquidity must have improved." Is the trader correct?',
      options: ['No: liquidity must be judged from the current and liquid ratios', 'Yes: higher profit always means there is more cash in the bank account', 'Yes: profit and liquidity are the same thing', 'No: higher profit always worsens liquidity'], answer: 0,
      why: 'Profit and liquidity are different. The extra profit may be tied up in inventory or receivables, or taken as drawings, so the liquidity ratios must be checked.' },
    { skill: 'stakeholders', kind: 'mcq', q: 'A trader\'s liquid ratio has fallen to 0.4 : 1. Why might a credit supplier be concerned?',
      options: ['It may be paid late or not at all', 'The trader will charge lower prices', 'The trader\'s ROCE will rise', 'The trader must form a partnership'], answer: 0,
      why: 'With few liquid assets to cover current liabilities, the trader may not pay on time. The supplier may reduce credit or ask for payment before delivery.' },
    { skill: 'stakeholders', kind: 'mcq', q: 'A supplier sees that a customer\'s liquidity has worsened sharply. What is the supplier most likely to do?',
      options: ['Reduce the credit limit or ask for cash on delivery', 'Offer a longer credit period to help the customer pay', 'Increase the trade discount given', 'Lend the customer money for new premises'], answer: 0,
      why: 'Poor liquidity raises the risk of not being paid, so a supplier protects itself by limiting credit.' },
    { skill: 'improving-liquidity', kind: 'multi', q: 'Which actions would help a trader improve liquidity?',
      options: ['Chasing credit customers to pay sooner', 'Negotiating longer credit periods with suppliers', 'Holding lower levels of inventory', 'Buying new shop fittings with cash from the bank', 'Increasing the owner\'s drawings', 'Giving customers longer to pay'], answers: [0, 1, 2],
      why: 'Collecting debts sooner and holding less inventory turn assets into cash faster, and longer supplier credit keeps cash in the business longer. Buying non-current assets with cash, more drawings and longer customer credit all drain cash.' },
    { skill: 'improving-liquidity', kind: 'mcq', q: 'The owner pays $8,000 of personal savings into the business bank account as extra capital. What is the effect on the current and liquid ratios?',
      options: ['Both ratios rise', 'Both ratios fall', 'Only the current ratio rises', 'Neither ratio changes'], answer: 0,
      why: 'Bank (a current and liquid asset) rises while current liabilities do not change, so both ratios increase.' },
    { skill: 'improving-liquidity', kind: 'mcq', q: 'How does selling off slow-moving inventory for cash at its cost price help liquidity?',
      options: ['It raises the liquid ratio by turning inventory into cash', 'It raises the current ratio by lowering current liabilities', 'It raises gross profit percentage', 'It has no effect on either liquidity ratio'], answer: 0,
      why: 'Inventory is left out of the liquid ratio but cash is included, so liquid assets rise and the liquid ratio improves; the current ratio is unchanged.' },
    { skill: 'improving-liquidity', kind: 'mcq', q: 'Which of these would make a trader\'s liquidity <b>worse</b>?',
      options: ['Using the overdraft to buy a new delivery van', 'Taking out a five-year loan paid into the bank', 'Selling an unused machine for cash', 'Receiving extra capital from the owner'], answer: 0,
      why: 'The van is a non-current asset, but the overdraft is a current liability, so current liabilities rise with no rise in current assets. The other three all bring cash in.' },
    { skill: 'improving-liquidity', gen: function () {
      var n = who(), cl = rstep(6000, 14000, 500), ca = Math.round(cl * rr(1.3, 1.8) / 10) * 10;
      var need = 2 * cl - ca;
      return money('<b>' + n + '</b> has current assets of ' + m(ca) + ' and current liabilities of ' + m(cl) + '. How much extra capital must be paid into the bank to bring the current ratio up to exactly 2 : 1?', need,
        'For 2 : 1, current assets must be 2 × ' + m(cl) + ' = ' + m(2 * cl) + '. Extra needed = ' + m(2 * cl) + ' − ' + m(ca) + ' = ' + m(need) + '.');
    } },
    { skill: 'improving-liquidity', gen: function () {
      var n = who(), ca0 = rstep(15000, 25000, 10), cl0 = rstep(8000, 12000, 10), d = rstep(500, 4000, 10), cl1 = cl0 + rstep(-1500, 2500, 10);
      var w0 = ca0 - cl0, ca1 = cl1 + w0 + d;
      return money('<b>' + n + '</b>: last year current assets were ' + m(ca0) + ' and current liabilities ' + m(cl0) + '. This year current assets are ' + m(ca1) + ' and current liabilities ' + m(cl1) + '. Calculate the increase in working capital.', d,
        'Working capital last year = ' + m(ca0) + ' − ' + m(cl0) + ' = ' + m(w0) + '. This year = ' + m(ca1) + ' − ' + m(cl1) + ' = ' + m(w0 + d) + '. Increase = ' + m(d) + '.');
    } },
    { skill: 'stakeholders', kind: 'mcq', q: 'A trader asks the bank for a larger overdraft. Why would the bank look closely at the liquid (acid test) ratio?',
      options: ['To judge whether the trader can repay short-term borrowing', 'To find out how much profit each sale makes', 'To check the value of the trader\'s premises', 'To see how much capital the owner first invested in the business'], answer: 0,
      why: 'An overdraft is short-term borrowing. The liquid ratio shows whether liquid assets cover current liabilities, so it helps the bank judge the risk of not being repaid.' },
    { skill: 'meaning', kind: 'mcq', q: 'Which calculation gives a trader\'s working capital?',
      options: ['Current assets − current liabilities', 'Total assets − total liabilities', 'Current assets − inventory', 'Non-current assets plus current assets'], answer: 0,
      why: 'Working capital (net current assets) is current assets less current liabilities. Total assets − total liabilities is equity.' }
  ] };

  /* ---------------- ACC-PIR-01 Forming a partnership or LLP ---------------- */
  B['ACC-PIR-01'] = { title: 'Should a trader form a partnership (or an LLP)?', items: [
    { skill: 'nature', kind: 'mcq', q: 'Which best describes a partnership?',
      options: ['Two or more people who run a business together and share profits', 'One owner who employs two or more staff to run the business', 'A business owned by shareholders whose shares are sold to the public', 'Two separate traders who buy their goods from the same supplier'], answer: 0,
      why: 'A partnership is formed when two or more people carry on a business together, sharing its profits and losses.' },
    { skill: 'nature', kind: 'mcq', q: 'In an ordinary partnership, what does unlimited liability mean for each partner?',
      options: ['Their own possessions can be used to pay business debts', 'They can lose only the amount they invested in the business', 'They never have to pay any of the business\'s debts', 'They pay the business\'s debts only if they agree in writing'], answer: 0,
      why: 'With unlimited liability, if the business cannot pay its debts, the partners\' own savings, car or home may be taken to pay them.' },
    { skill: 'nature', kind: 'mcq', q: 'A partnership owes suppliers $40,000 but has only $15,000 of assets. What could happen to the partners in an ordinary partnership?',
      options: ['Their own assets may be used to pay the other $25,000', 'The suppliers must accept $15,000 and lose the rest', 'Only the partner with the largest capital has to pay', 'Nothing, because a partnership is a separate legal entity'], answer: 0,
      why: 'Ordinary partners have unlimited liability, so creditors can claim the shortfall from the partners\' personal assets.' },
    { skill: 'llp', kind: 'mcq', q: 'What is the key difference between a limited liability partnership (LLP) and an ordinary partnership?',
      options: ['An LLP is a separate legal entity with limited liability', 'An LLP can only have one partner, so profits are not shared', 'An LLP does not need to keep any accounting records at all', 'An LLP\'s partners are personally liable for all business debts'], answer: 0,
      why: 'An LLP exists separately from its members in law, so each partner\'s liability is limited to the amount put into the business.' },
    { skill: 'llp', kind: 'mcq', q: 'If an LLP cannot pay its debts, what is the most a partner can lose?',
      options: ['The amount they have invested in the LLP', 'All of their personal possessions', 'Nothing at all', 'Their share of the LLP\'s profit for the next year'], answer: 0,
      why: 'Limited liability means a member\'s personal assets are protected; only the capital put into the LLP is at risk.' },
    { skill: 'llp', kind: 'mcq', q: 'Two architects plan to work together but are worried about losing their family homes if a project goes badly wrong. What should they consider?',
      options: ['Forming a limited liability partnership', 'Forming an ordinary partnership with a written deed', 'Each trading as a sole trader', 'Keeping no written agreement'], answer: 0,
      why: 'An LLP gives limited liability, so the architects\' personal assets, such as their homes, are protected from the business\'s debts.' },
    { skill: 'llp', kind: 'multi', q: 'Which statements about a limited liability partnership (LLP) are true?',
      options: ['It is a separate legal entity', 'Members\' liability is limited to the amount they invested', 'It can own property and enter contracts in its own name', 'Each member has unlimited liability for its debts', 'It must have only one member'], answers: [0, 1, 2],
      why: 'An LLP is a separate legal entity with limited liability for its members, so it can own assets and sign contracts itself. It needs at least two members.' },
    { skill: 'advantages', kind: 'multi', q: 'A sole trader is thinking of taking on a partner. Which of these are advantages?',
      options: ['More capital is brought into the business', 'The new partner may bring new skills and ideas', 'The workload and risks are shared', 'The original owner keeps all the profit', 'The original owner keeps full control of decisions'], answers: [0, 1, 2],
      why: 'A partner brings capital, skills and help with the work and risks. But profits must be shared and control is shared too.' },
    { skill: 'advantages', kind: 'mcq', q: 'Apart from extra capital, which is a reason a sole trader might want a partner?',
      options: ['Someone to share the work and cover during holidays or illness', 'The business would then have limited liability for all its debts', 'The owner would keep all of the profit', 'There would be no need to keep accounting records'], answer: 0,
      why: 'Sharing the workload and having cover is a key non-financial benefit. An ordinary partnership still has unlimited liability and profits are shared.' },
    { skill: 'advantages', kind: 'mcq', q: 'A baker who sells bread wants to start selling wedding cakes but has no decorating skills. Why might a partnership help?',
      options: ['A partner with decorating skills could join and bring expertise', 'A partnership would remove the need to buy equipment', 'Partners never have to pay any of the business\'s debts from their own money', 'The baker would no longer need to share profits'], answer: 0,
      why: 'A new partner can bring skills the business lacks, allowing it to offer new products and earn more revenue.' },
    { skill: 'advantages', kind: 'mcq', q: 'A student writes: "A new partner brings more capital." Which sentence best develops this point?',
      options: ['So the business can expand or buy equipment without borrowing', 'So the original owner keeps full control of every single decision', 'So the business will have limited liability from then on', 'So the original owner keeps all the profit for themselves'], answer: 0,
      why: 'Development explains the effect: the extra capital lets the business grow or buy assets without taking on loans and interest.' },
    { skill: 'advantages', kind: 'mcq', q: 'Two dentists each run their own surgery. Why might forming a partnership be helpful?',
      options: ['They can share patients and cover for each other', 'They would no longer need to employ or pay any staff', 'Their liability would become limited', 'They could each keep all of the profit'], answer: 0,
      why: 'Working together lets them share the workload and cover holidays or illness, as well as share equipment and ideas.' },
    { skill: 'disadvantages', kind: 'multi', q: 'Which of these are drawbacks for a sole trader who forms a partnership?',
      options: ['Profits must be shared with the partner', 'Decisions must be agreed, so the owner loses full control', 'The partners may disagree about how to run the business', 'More capital is available for expansion', 'The workload is shared'], answers: [0, 1, 2],
      why: 'Sharing profits, losing sole control and the risk of disputes are drawbacks. Extra capital and shared workload are advantages.' },
    { skill: 'disadvantages', kind: 'mcq', q: 'A sole trader enjoys making every decision alone. Which drawback of forming a partnership matters most to her?',
      options: ['She would lose full control of decisions', 'She would have less capital available to spend', 'She would have to work longer hours', 'She would gain limited liability'], answer: 0,
      why: 'In a partnership, decisions are made together, so she could no longer decide everything on her own.' },
    { skill: 'disadvantages', kind: 'mcq', q: 'A student writes: "The owner must share profits with the new partner." Which sentence best develops this point?',
      options: ['So the owner\'s own income may fall unless total profit grows', 'So the business will have more capital to spend on new assets', 'So the owner gains more free time for other work', 'So the business will be able to borrow more cheaply'], answer: 0,
      why: 'The development explains the effect on the owner: a smaller share of the profit means less income unless the partnership earns more.' },
    { skill: 'disadvantages', kind: 'mcq', q: 'Two partners are thinking of admitting a third partner. Which is a likely disadvantage?',
      options: ['More partners may mean more disagreements and slower decisions', 'The partnership will have less capital than before', 'The existing partners will have to work much longer hours than before', 'The partnership will lose all its existing customers'], answer: 0,
      why: 'Each extra partner adds another view, so disputes are more likely and decisions can take longer.' },
    { skill: 'disadvantages', kind: 'mcq', q: 'Which of these is <b>not</b> a reason for forming a partnership?',
      options: ['To keep all the profit for one person', 'To bring in more capital', 'To share the workload', 'To gain new skills and ideas'], answer: 0,
      why: 'In a partnership the profit is shared between partners, so keeping all the profit is a reason to stay a sole trader.' },
    { skill: 'decision', kind: 'mcq', q: 'An evaluation of whether a sole trader should form a partnership needs a final decision. Which sentence is the best conclusion?',
      options: ['She should form the partnership, as the extra capital will let her open a second shop.', 'There are advantages and disadvantages to forming a partnership.', 'Partnerships are common in many countries.', 'A partnership has two or more partners.'], answer: 0,
      why: 'A good conclusion makes a clear decision and links it to the strongest point in the case.' },
    { skill: 'decision', kind: 'mcq', q: 'A florist is very busy, has enough capital, and a skilled friend wants to join. The florist values independence but is close to exhaustion. Which advice is best supported?',
      options: ['Form the partnership, because sharing the workload outweighs loss of control', 'Do not form it, because the florist needs more capital first', 'Form it, because the florist will keep all of the profit', 'Do not form it, because partners always have limited liability'], answer: 0,
      why: 'The main problem is workload, which a partner solves. Capital is not needed, profits would be shared, and ordinary partners have unlimited liability.' },
    { skill: 'decision', kind: 'mcq', q: 'A trader earns good profits, works reasonable hours and has a large cash balance. A friend offers to join as a partner. Which advice is best supported?',
      options: ['Stay a sole trader, as a partner would mainly mean sharing profit and control', 'Form the partnership, because the business urgently needs extra capital', 'Form the partnership, because the trader is overworked', 'Stay a sole trader, because sole traders have limited liability'], answer: 0,
      why: 'The trader does not need capital or help with work, so the main effects would be drawbacks. Sole traders also have unlimited liability.' },
    { skill: 'decision', kind: 'mcq', q: 'A question says: "State <b>two</b> reasons, other than more capital, for forming a partnership." Which answer earns both marks?',
      options: ['Shared workload; additional skills', 'More capital; shared workload', 'Limited liability; shared profit', 'Additional finance; extra money'], answer: 0,
      why: 'Shared workload and extra skills are both valid and neither is about capital. Finance and money are the excluded reason, and ordinary partnerships do not have limited liability.' },
    { skill: 'nature', kind: 'mcq', q: 'A sole trader\'s business makes a loss. Who bears it?',
      options: ['The sole trader alone', 'The trader\'s suppliers', 'The trader\'s employees', 'The government'], answer: 0,
      why: 'A sole trader takes all the profit and bears all the losses. In a partnership, losses are shared between the partners.' }
  ] };

  /* ---------------- ACC-PIR-03 Reasons for partnership appropriations ---------------- */
  B['ACC-PIR-03'] = { title: 'Why partners get interest, salaries and loan interest', items: [
    { skill: 'interest-on-capital', kind: 'mcq', q: 'Why do many partnership agreements allow interest on capital?',
      options: ['To reward partners for the money they have invested', 'To discourage partners from investing too much', 'To pay partners for the hours they work', 'To charge partners for using the business\'s assets and equipment'], answer: 0,
      why: 'Interest on capital compensates partners for the capital they have put in and encourages them to invest.' },
    { skill: 'interest-on-capital', kind: 'mcq', q: 'Partner A invested $90,000 and Partner B invested $15,000. They share profits equally. What would make the sharing fairer to A?',
      options: ['Allowing interest on capital', 'Charging interest on drawings', 'Paying B a partnership salary', 'Paying A interest on drawings'], answer: 0,
      why: 'Interest on capital gives A a larger reward for having invested much more, before the rest is shared equally.' },
    { skill: 'interest-on-capital', kind: 'mcq', q: 'A student writes: "Interest on capital rewards partners for investing." Which sentence best develops this point?',
      options: ['So partners invest more, giving the business more funds', 'So partners take less money out, which improves cash flow', 'So the partner who works longest hours is rewarded', 'So the business pays less tax on its profits'], answer: 0,
      why: 'The development shows the effect: the reward encourages extra investment, giving the partnership more resources.' },
    { skill: 'interest-on-capital', kind: 'mcq', q: 'Is interest on capital an expense of the partnership?',
      options: ['No: it is a share of profit in the appropriation account', 'Yes: it is shown with the expenses in the income statement', 'Yes: it is deducted before gross profit', 'No: it is added to the profit for the year'], answer: 0,
      why: 'Interest on capital is an appropriation: it shares out profit to the owners and is deducted in the appropriation account, not the income statement.' },
    { skill: 'interest-on-drawings', kind: 'mcq', q: 'Why might a partnership charge interest on drawings?',
      options: ['To discourage partners from taking out too much money', 'To reward the partners who take the most drawings each year', 'To pay partners for their extra responsibilities', 'To increase the amount each partner invests'], answer: 0,
      why: 'Interest on drawings is a charge on the partner, so it puts partners off taking out more money than they need.' },
    { skill: 'interest-on-drawings', kind: 'mcq', q: 'A student writes: "Interest on drawings discourages excessive drawings." Which sentence best develops this point?',
      options: ['So more cash stays in the business, which helps liquidity', 'So partners receive a higher share of the residual profit each year', 'So the partnership\'s expenses are reduced', 'So partners are rewarded for investing'], answer: 0,
      why: 'If partners take less out, more cash remains to pay suppliers and other debts, improving cash flow and liquidity.' },
    { skill: 'interest-on-drawings', kind: 'mcq', q: 'Which statement about interest on drawings is correct?',
      options: ['It is charged to the partner and increases the profit to be shared', 'It is paid to the partner and so reduces the profit to be shared out', 'It is an expense in the income statement', 'It is paid only to the partner with the most capital'], answer: 0,
      why: 'Partners pay interest on drawings to the business, so it is added in the appropriation account and increases the profit to be shared.' },
    { skill: 'interest-on-drawings', kind: 'mcq', q: 'One partner takes large drawings early in the year; the other takes small amounts late in the year. Why is interest on drawings fairer here?',
      options: ['The partner who takes more out, for longer, is charged more', 'Both partners are charged the same fixed amount', 'The partner with smaller drawings receives all of the interest', 'It makes both partners\' drawings equal'], answer: 0,
      why: 'Interest on drawings depends on how much is taken and for how long, so the partner who removes more cash from the business pays more.' },
    { skill: 'salaries', kind: 'mcq', q: 'Why might one partner be given a partnership salary?',
      options: ['To reward extra work or responsibility in the business', 'To reward a partner who has made a larger capital investment', 'To discourage the partner from taking drawings', 'To repay a loan the partner made to the business'], answer: 0,
      why: 'A partnership salary rewards a partner who works more or takes on more responsibility than the others.' },
    { skill: 'salaries', kind: 'mcq', q: 'In a partnership, one partner manages the shop full-time while the other only helps at weekends. Profits are shared equally. What would make this fairer?',
      options: ['A salary for the full-time partner', 'Interest on capital for both partners', 'Interest on drawings for the full-time partner', 'A loan from the weekend partner'], answer: 0,
      why: 'A partnership salary rewards the extra time and responsibility of the full-time partner before the rest is shared.' },
    { skill: 'salaries', kind: 'mcq', q: 'How is a partner\'s salary treated in the accounts?',
      options: ['As a share of profit in the appropriation account', 'As wages in the income statement', 'As a liability in the statement of financial position', 'As a deduction from the partner\'s capital account'], answer: 0,
      why: 'A partner is an owner, not an employee, so the salary is an appropriation of profit and is credited to the partner\'s current account.' },
    { skill: 'partner-loans', kind: 'mcq', q: 'How is interest on a loan made by a partner to the partnership treated?',
      options: ['As an expense, before profit for the year is calculated', 'As a share of profit in the appropriation account', 'As a deduction from the partner\'s capital account', 'It is not recorded because the partner is an owner of the business'], answer: 0,
      why: 'The loan is a liability of the business, so interest on it is a cost like any other loan interest and is charged as an expense before profit for the year.' },
    { skill: 'partner-loans', kind: 'mcq', q: 'Why might a partner choose to lend money to the partnership rather than add it as extra capital?',
      options: ['A loan is repayable and earns a fixed rate of interest', 'A loan gives the partner limited liability', 'A loan increases the partner\'s share of profit', 'A loan does not need to be recorded in the partnership\'s accounts'], answer: 0,
      why: 'The partner can get a loan back at an agreed date and receives a set interest each year, even if profits are low.' },
    { skill: 'partner-loans', kind: 'mcq', q: 'The partnership made a loss this year. One partner has lent the business $20,000 at an agreed rate of interest. Does the partner still receive loan interest?',
      options: ['Yes: loan interest is an expense, due whatever the profit', 'No: loan interest is only paid in years when there is a profit', 'No: loan interest is cancelled in a loss-making year', 'Yes: but only if the other partners agree'], answer: 0,
      why: 'Loan interest is a business expense, not a share of profit, so it is due even in a loss-making year. This is one reason a partner may prefer to lend.' },
    { skill: 'partner-loans', kind: 'mcq', q: 'Which statement about interest on a partner\'s loan is correct?',
      options: ['It reduces profit for the year, like interest on a bank loan', 'It increases the profit available for distribution to the partners', 'It is shown in the appropriation account', 'It is charged to the partner as a penalty'], answer: 0,
      why: 'The interest is an expense of the partnership, charged in the income statement, so profit for the year is lower.' },
    { skill: 'accounts-needed', kind: 'mcq', q: 'What is the main purpose of a partnership appropriation account?',
      options: ['To show how the profit for the year is shared between the partners', 'To calculate gross profit for the year', 'To list the assets, liabilities and equity of the partnership at the year end', 'To record the partners\' day-to-day drawings'], answer: 0,
      why: 'The appropriation account starts with profit for the year and shows interest, salaries and each partner\'s share of what remains.' },
    { skill: 'accounts-needed', kind: 'mcq', q: 'Why do partners usually keep a current account as well as a capital account?',
      options: ['So capital stays fixed while yearly items are recorded separately', 'Because the law forbids partners to have capital accounts', 'So that each partner can keep a separate personal bank account for drawings', 'Because current accounts record the business\'s sales'], answer: 0,
      why: 'The capital account shows the long-term investment, which normally stays the same. The current account records each year\'s shares of profit, interest, salary and drawings.' },
    { skill: 'accounts-needed', kind: 'mcq', q: 'Why does a partnership need an appropriation account when a sole trader does not?',
      options: ['There is more than one owner, so profit must be shared out', 'Partnerships do not prepare income statements', 'Sole traders do not make any profit', 'Partnerships have no drawings'], answer: 0,
      why: 'A sole trader keeps all the profit. With two or more owners, the account shows how the profit is divided according to the agreement.' },
    { skill: 'accounts-needed', kind: 'multi', q: 'Which of these appear in a partnership appropriation account?',
      options: ['Interest on capital', 'Interest on drawings', 'Partners\' salaries', 'Interest on a partner\'s loan', 'Depreciation of equipment', 'Wages paid to employees'], answers: [0, 1, 2],
      why: 'Interest on capital, interest on drawings and partners\' salaries share out the profit. Loan interest, depreciation and employees\' wages are expenses in the income statement.' },
    { skill: 'accounts-needed', kind: 'mcq', q: 'What does a partner\'s capital account usually show?',
      options: ['The long-term amount the partner has invested', 'The partner\'s share of profit for the year', 'The partner\'s drawings for the year', 'The interest on the partner\'s drawings'], answer: 0,
      why: 'With fixed capital accounts, the capital account shows only the long-term investment. The yearly items go to the current account.' },
    { skill: 'salaries', kind: 'multi', q: 'Match purpose to item. Which of these pairings are correct?',
      options: ['Interest on capital: rewards investment', 'Interest on drawings: discourages taking cash out', 'Partnership salary: rewards extra responsibility', 'Interest on drawings: rewards investment', 'Partnership salary: discourages taking cash out'], answers: [0, 1, 2],
      why: 'Interest on capital rewards investment, interest on drawings discourages excessive withdrawals and a salary rewards extra work or responsibility.' },
    { skill: 'interest-on-capital', kind: 'mcq', q: 'Two partners invested exactly the same capital and share profits equally. Would interest on capital change how much each receives in total?',
      options: ['No: both get the same interest, so the total each receives is unchanged', 'Yes: the partner who joined first receives more', 'Yes: interest on capital always favours the older partner', 'No: interest on capital is never allowed between equal partners'], answer: 0,
      why: 'With equal capital and equal profit shares, interest on capital simply moves equal amounts to each partner, so each still receives the same total.' }
  ] };

  /* ---------------- ACC-PIR-04 Appropriation account ---------------- */
  var RATIOS = [[1, 1], [2, 1], [3, 2], [3, 1], [5, 3], [4, 1]];
  // A consistent two-partner case built from the residual upwards, so every figure is a whole number.
  function partCase() {
    var p = pair(), rt = pick(RATIOS), rs = rt[0] + rt[1], ri = pick([4, 5, 6, 8, 10]), rd = pick([2, 4, 5]);
    var cap = [rstep(30000, 90000, 5000), rstep(20000, 70000, 5000)], dr = [rstep(10000, 30000, 100), rstep(10000, 30000, 100)];
    var ioc = cap.map(function (c) { return c * ri / 100; }), iod = dr.map(function (d) { return d * rd / 100; });
    var salM = rstep(500, 2000, 100), sal = salM * 12, resid = rs * rstep(5000, 12000, 10);
    var pf = resid + ioc[0] + ioc[1] + sal - iod[0] - iod[1];
    return { p: p, rt: rt, rs: rs, ri: ri, rd: rd, cap: cap, dr: dr, ioc: ioc, iod: iod, salM: salM, sal: sal, resid: resid, pf: pf,
      share: [resid * rt[0] / rs, resid * rt[1] / rs] };
  }
  function caseText(c) {
    return 'Partners <b>' + c.p[0] + '</b> and <b>' + c.p[1] + '</b> share profits and losses in the ratio ' + c.rt[0] + ' : ' + c.rt[1] + '. Profit for the year is ' + m(c.pf) + '. Capitals: ' + c.p[0] + ' ' + m(c.cap[0]) + ', ' + c.p[1] + ' ' + m(c.cap[1]) + '. Drawings: ' + c.p[0] + ' ' + m(c.dr[0]) + ', ' + c.p[1] + ' ' + m(c.dr[1]) + '. Interest on capital is ' + c.ri + '% a year, interest on drawings is ' + c.rd + '%, and ' + c.p[1] + ' receives a salary of ' + m(c.salM) + ' a month.';
  }
  B['ACC-PIR-04'] = { title: 'Partnership appropriation account', items: [
    { skill: 'interest-and-salary', gen: function () {
      var n = pair(), cap = rstep(25000, 120000, 5000), r = pick([4, 5, 6, 8, 10]), a = cap * r / 100;
      return money('<b>' + n[0] + '</b> and <b>' + n[1] + '</b> are partners. ' + n[0] + '\'s capital account balance is ' + m(cap) + ' and the agreement allows interest on capital at ' + r + '% a year. Calculate ' + n[0] + '\'s interest on capital.', a,
        'Interest on capital = ' + m(cap) + ' × ' + r + '% = ' + m(a) + '. It is deducted in the appropriation account.');
    } },
    { skill: 'interest-and-salary', gen: function () {
      var n = pair(), d = rstep(8000, 36000, 100), r = pick([2, 3, 4, 5]), a = d * r / 100;
      return money('<b>' + n[1] + '</b> took drawings of ' + m(d) + ' during the year. The partnership charges interest on drawings at ' + r + '% of total drawings. Calculate the interest on drawings charged to ' + n[1] + '.', a,
        'Interest on drawings = ' + m(d) + ' × ' + r + '% = ' + m(a) + '. It is added in the appropriation account, because the partner pays it to the business.');
    } },
    { skill: 'interest-and-salary', gen: function () {
      var n = pair(), d = rstep(9000, 24000, 100), g = rstep(500, 2500, 100), r = pick([4, 5, 10]), a = (d + g) * r / 100;
      return money('<b>' + n[0] + '</b> took cash drawings of ' + m(d) + ' and goods costing ' + m(g) + ' for personal use. Interest on drawings is charged at ' + r + '% of total drawings. Calculate the interest on drawings for ' + n[0] + '.', a,
        'Goods taken are drawings too: total drawings = ' + m(d) + ' + ' + m(g) + ' = ' + m(d + g) + '. Interest = ' + m(d + g) + ' × ' + r + '% = ' + m(a) + '.');
    } },
    { skill: 'interest-and-salary', gen: function () {
      var n = pair(), s = rstep(600, 2500, 50), a = s * 12;
      return money('The partnership agreement gives <b>' + n[1] + '</b> a salary of ' + m(s) + ' a month. Calculate the salary shown in the appropriation account for the year.', a,
        'A full year\'s salary = ' + m(s) + ' × 12 = ' + m(a) + '.');
    } },
    { skill: 'interest-and-salary', gen: function () {
      var n = pair(), s = rstep(1000, 3000, 100), k = pick([3, 4, 6, 8, 9]), a = s * k;
      return money('<b>' + n[0] + '</b> became entitled to a partnership salary of ' + m(s) + ' a month starting ' + k + ' months before the year end. Calculate the salary for this year.', a,
        'Only ' + k + ' months are due this year: ' + m(s) + ' × ' + k + ' = ' + m(a) + '.');
    } },
    { skill: 'interest-and-salary', gen: function () {
      var t = trio(), c = [rstep(20000, 80000, 5000), rstep(20000, 80000, 5000), rstep(20000, 80000, 5000)], r = pick([5, 6, 8, 10]), a = sum(c) * r / 100;
      return money('<b>' + t[0] + '</b>, <b>' + t[1] + '</b> and <b>' + t[2] + '</b> have capitals of ' + m(c[0]) + ', ' + m(c[1]) + ' and ' + m(c[2]) + '. Interest on capital is ' + r + '% a year. Calculate the total interest on capital deducted in the appropriation account.', a,
        'Interest: ' + m(c[0] * r / 100) + ' + ' + m(c[1] * r / 100) + ' + ' + m(c[2] * r / 100) + ' = ' + m(a) + ' (or ' + r + '% × ' + m(sum(c)) + ').');
    } },
    { skill: 'residual-profit', gen: function () {
      var c = partCase();
      return money(caseText(c) + ' Calculate the profit available for distribution (residual profit).', c.resid,
        'Profit ' + m(c.pf) + ' + interest on drawings ' + m(c.iod[0] + c.iod[1]) + ' − interest on capital ' + m(c.ioc[0] + c.ioc[1]) + ' − salary ' + m(c.sal) + ' = ' + m(c.resid) + '.');
    } },
    { skill: 'residual-profit', gen: function () {
      var c = partCase();
      return money(caseText(c) + ' Calculate ' + c.p[1] + '\'s share of the residual profit.', c.share[1],
        'Residual = ' + m(c.pf) + ' + ' + m(c.iod[0] + c.iod[1]) + ' − ' + m(c.ioc[0] + c.ioc[1]) + ' − ' + m(c.sal) + ' = ' + m(c.resid) + '. ' + c.p[1] + '\'s share = ' + c.rt[1] + '/' + c.rs + ' × ' + m(c.resid) + ' = ' + m(c.share[1]) + '.');
    } },
    { skill: 'residual-profit', gen: function () {
      var c = partCase(), iodT = c.iod[0] + c.iod[1], iocT = c.ioc[0] + c.ioc[1];
      return mcqNum(caseText(c) + ' What is the profit available for distribution?', c.resid,
        [c.pf - iodT - iocT - c.sal, c.pf + iodT - iocT - c.salM, c.pf + iodT + iocT - c.sal, c.pf - iocT - c.sal],
        'Add interest on drawings (' + m(iodT) + '), then deduct interest on capital (' + m(iocT) + ') and the full-year salary (' + m(c.salM) + ' × 12 = ' + m(c.sal) + '): ' + m(c.pf) + ' + ' + m(iodT) + ' − ' + m(iocT) + ' − ' + m(c.sal) + ' = ' + m(c.resid) + '.');
    } },
    { skill: 'residual-profit', gen: function () {
      var t = trio(), rt = pick([[3, 2, 1], [2, 2, 1], [4, 3, 1], [5, 3, 2]]), rs = rt[0] + rt[1] + rt[2], res = rs * rstep(2000, 7000, 10), k = rint(0, 2);
      var a = res * rt[k] / rs;
      return money('<b>' + t[0] + '</b>, <b>' + t[1] + '</b> and <b>' + t[2] + '</b> share residual profits in the ratio ' + rt.join(' : ') + '. The profit available for distribution is ' + m(res) + '. Calculate ' + t[k] + '\'s share.', a,
        t[k] + '\'s share = ' + rt[k] + '/' + rs + ' × ' + m(res) + ' = ' + m(a) + '.');
    } },
    { skill: 'residual-profit', gen: function () {
      var n = pair(), rt = pick([[1, 1], [3, 2], [2, 1], [3, 1]]), rs = rt[0] + rt[1], ioc = rstep(6000, 10000, 100), sal = rstep(12, 20, 1) * 1000, iod = rstep(300, 1200, 10), loss = rs * rstep(500, 2000, 10);
      var pf = ioc + sal - iod - loss, a = loss * rt[0] / rs;
      return money('<b>' + n[0] + '</b> and <b>' + n[1] + '</b> share profits and losses ' + rt[0] + ' : ' + rt[1] + '. Profit for the year is ' + m(pf) + '. Interest on drawings totals ' + m(iod) + ', interest on capital totals ' + m(ioc) + ' and ' + n[1] + '\'s salary is ' + m(sal) + '. The appropriations leave a residual loss. Calculate ' + n[0] + '\'s share of the loss.', a,
        'Residual = ' + m(pf) + ' + ' + m(iod) + ' − ' + m(ioc) + ' − ' + m(sal) + ' = −' + m(loss) + ', a loss. ' + n[0] + '\'s share = ' + rt[0] + '/' + rs + ' × ' + m(loss) + ' = ' + m(a) + '.');
    } },
    { skill: 'residual-profit', gen: function () {
      var c = partCase();
      return money('Partners <b>' + c.p[0] + '</b> and <b>' + c.p[1] + '</b>: interest on drawings totalled ' + m(c.iod[0] + c.iod[1]) + ', interest on capital totalled ' + m(c.ioc[0] + c.ioc[1]) + ', salaries totalled ' + m(c.sal) + ' and the profit available for distribution was ' + m(c.resid) + '. Calculate the profit for the year.', c.pf,
        'Work backwards: profit for the year = residual + interest on capital + salaries − interest on drawings = ' + m(c.resid) + ' + ' + m(c.ioc[0] + c.ioc[1]) + ' + ' + m(c.sal) + ' − ' + m(c.iod[0] + c.iod[1]) + ' = ' + m(c.pf) + '.');
    } },
    { skill: 'correcting-draft-profit', gen: function () {
      var n = pair(), dp = rstep(40000, 90000, 10), L = rstep(10000, 30000, 1000), r = pick([4, 5, 6]), dep = rstep(800, 4000, 100);
      var li = L * r / 100, a = dp - li - dep;
      return money('<b>' + n[0] + '</b> and <b>' + n[1] + '</b> have a draft profit of ' + m(dp) + '. They find that: (1) interest at ' + r + '% a year on a ' + m(L) + ' loan from ' + n[0] + ' has not been recorded; (2) depreciation of ' + m(dep) + ' on equipment has not been charged. Calculate the corrected profit for the year.', a,
        'Loan interest = ' + r + '% × ' + m(L) + ' = ' + m(li) + ', an expense. Corrected profit = ' + m(dp) + ' − ' + m(li) + ' − ' + m(dep) + ' = ' + m(a) + '.');
    } },
    { skill: 'correcting-draft-profit', gen: function () {
      var n = pair(), dp = rstep(35000, 80000, 10), acc = rstep(300, 1500, 10), pp = rstep(200, 900, 10);
      var a = dp - acc + pp;
      return money('A draft profit of ' + m(dp) + ' for <b>' + n[0] + '</b> and <b>' + n[1] + '</b> did not take account of electricity owing of ' + m(acc) + ' or insurance prepaid of ' + m(pp) + '. Calculate the corrected profit for the year.', a,
        'The accrual adds to expenses (profit down ' + m(acc) + '); the prepayment reduces expenses (profit up ' + m(pp) + '): ' + m(dp) + ' − ' + m(acc) + ' + ' + m(pp) + ' = ' + m(a) + '.');
    } },
    { skill: 'correcting-draft-profit', gen: function () {
      var n = pair(), L = rstep(10000, 25000, 1000), r = pick([4, 5, 6]), dpf = rstep(50000, 90000, 10), ioc = rstep(5000, 9000, 100), sal = rstep(10, 18, 1) * 1000, rs = 2;
      var li = L * r / 100, pf = dpf - li, res0 = pf - ioc - sal, adj = res0 % rs;
      dpf -= adj; pf -= adj;
      var res = pf - ioc - sal;
      return money('<b>' + n[0] + '</b> and <b>' + n[1] + '</b> share residual profit equally. Their draft profit is ' + m(dpf) + ', but interest of ' + r + '% a year on ' + n[1] + '\'s loan of ' + m(L) + ' has not yet been charged. Interest on capital totals ' + m(ioc) + ' and ' + n[0] + '\'s salary is ' + m(sal) + '. There is no interest on drawings. Calculate each partner\'s share of the residual profit.', res / 2,
        'Loan interest = ' + m(li) + ' is an expense, so profit for the year = ' + m(dpf) + ' − ' + m(li) + ' = ' + m(pf) + '. Residual = ' + m(pf) + ' − ' + m(ioc) + ' − ' + m(sal) + ' = ' + m(res) + ', so each partner receives ' + m(res / 2) + '.');
    } },
    { skill: 'correcting-draft-profit', gen: function () {
      var n = pair(), L = rstep(8000, 30000, 1000), r = pick([3, 4, 5, 6]), li = L * r / 100;
      return { kind: 'mcq', q: '<b>' + n[1] + '</b> lent the partnership ' + m(L) + ' at ' + r + '% interest a year. The interest for the year has not been paid. How is it recorded?',
        options: ['Debit income statement ' + m(li) + '; credit ' + n[1] + '\'s current account', 'Debit appropriation account ' + m(li) + '; credit ' + n[1] + '\'s current account', 'Debit ' + n[1] + '\'s current account ' + m(li) + '; credit income statement', 'Debit ' + n[1] + '\'s capital account ' + m(li) + '; credit appropriation account'], answer: 0,
        why: 'Interest = ' + r + '% × ' + m(L) + ' = ' + m(li) + '. It is an expense (debit the income statement) owed to the partner (credit the partner\'s current account), not an appropriation of profit.' };
    } },
    { skill: 'layout-and-rules', kind: 'mcq', q: 'In a partnership appropriation account, how is interest on drawings treated?',
      options: ['Added to the profit for the year', 'Deducted from the profit for the year', 'Shared in the profit-sharing ratio', 'Shown as an expense in the income statement'], answer: 0,
      why: 'Partners pay interest on drawings to the business, so it increases the profit available to share.' },
    { skill: 'layout-and-rules', kind: 'mcq', q: 'The profit-sharing ratio is applied to which figure?',
      options: ['The residual profit after interest and salaries', 'The profit for the year before any appropriations', 'The gross profit for the year', 'The total of the partners\' capitals'], answer: 0,
      why: 'Interest on capital, interest on drawings and salaries are dealt with first. Only what is left (the residual) is shared in the profit-sharing ratio.' },
    { skill: 'layout-and-rules', kind: 'mcq', q: 'A partnership finds that its draft profit omitted depreciation. When should this be corrected?',
      options: ['Before the appropriation account, to get the correct profit for the year', 'After the residual profit has been shared', 'Only in the partners\' capital accounts', 'It does not need correcting because the partners will share it equally anyway'], answer: 0,
      why: 'Depreciation is an expense, so it must reduce profit for the year before interest, salaries and shares are worked out.' },
    { skill: 'layout-and-rules', gen: function () {
      var c = partCase(), iodT = c.iod[0] + c.iod[1], iocT = c.ioc[0] + c.ioc[1], wrong = c.pf - iodT - iocT - c.sal;
      var t = tbl([['Appropriation account', '$'], ['Profit for the year', f(c.pf)], ['Less interest on drawings', '(' + f(iodT) + ')'], ['Less interest on capital', '(' + f(iocT) + ')'], ['Less salary: ' + c.p[1], '(' + f(c.sal) + ')'], ['Profit available for distribution', f(wrong)]], true);
      return { kind: 'mcq', q: 'A student prepared this extract for <b>' + c.p[0] + '</b> and <b>' + c.p[1] + '</b>.' + t + 'What is wrong, and what should the residual profit be?',
        options: ['Interest on drawings should be added: ' + m(c.resid), 'Interest on capital should be added: ' + m(wrong + 2 * iocT), 'The salary should not be deducted: ' + m(wrong + c.sal), 'Nothing is wrong: ' + m(wrong)], answer: 0,
        why: 'Interest on drawings is paid by the partners to the business, so it is added: ' + m(c.pf) + ' + ' + m(iodT) + ' − ' + m(iocT) + ' − ' + m(c.sal) + ' = ' + m(c.resid) + '.' };
    } },
    { skill: 'layout-and-rules', kind: 'multi', q: 'Which of these are deducted from profit in a partnership appropriation account?',
      options: ['Interest on capital', 'Partners\' salaries', 'Interest on drawings', 'Interest on a partner\'s loan', 'Partners\' drawings'], answers: [0, 1],
      why: 'Interest on capital and salaries are deducted. Interest on drawings is added, loan interest is an expense in the income statement, and drawings go to the current accounts.' },
    { skill: 'layout-and-rules', kind: 'mcq', q: 'What is meant by the "profit available for distribution" in an appropriation account?',
      options: ['The profit left after interest and salaries, shared in the profit-sharing ratio', 'The gross profit before expenses are deducted', 'The cash in the bank that partners may withdraw', 'The total of all the partners\' cash and goods drawings taken out during the whole year'], answer: 0,
      why: 'It is the residual profit after adding interest on drawings and deducting interest on capital and salaries; it is then shared in the agreed ratio.' }
  ] };

  /* ---------------- ACC-PIR-05 Current and capital accounts ---------------- */
  // One partner's year: credits (interest on capital, salary, share of profit) and debits (drawings, interest on drawings).
  function curCase(opening) {
    var n = who(), ioc = rstep(2000, 8000, 100), sal = pick([0, rstep(6, 20, 1) * 1000]), sh = rstep(8000, 30000, 10), dr = rstep(12000, 40000, 100), iod = dr * pick([2, 4, 5]) / 100;
    var ob = opening === 'cr' ? rstep(500, 5000, 10) : opening === 'dr' ? -rstep(500, 3000, 10) : 0;
    var bal = ob + ioc + sal + sh - dr - iod;
    if (Math.abs(bal) < 200) { sh += 1000; bal += 1000; }
    return { n: n, ioc: ioc, sal: sal, sh: sh, dr: dr, iod: iod, ob: ob, bal: bal };
  }
  function curText(c) {
    return (c.ob > 0 ? 'opening credit balance ' + m(c.ob) + '; ' : c.ob < 0 ? 'opening debit balance ' + m(-c.ob) + '; ' : '') + 'interest on capital ' + m(c.ioc) + '; ' + (c.sal ? 'salary ' + m(c.sal) + '; ' : '') + 'share of profit ' + m(c.sh) + '; drawings ' + m(c.dr) + '; interest on drawings ' + m(c.iod);
  }
  function curWhy(c) {
    var cr = Math.max(c.ob, 0) + c.ioc + c.sal + c.sh, db = Math.max(-c.ob, 0) + c.dr + c.iod;
    return 'Credit side (amounts earned' + (c.ob > 0 ? ', including the opening credit balance' : '') + ') = ' + m(cr) + '. Debit side (drawings, interest on drawings' + (c.ob < 0 ? ', opening debit balance' : '') + ') = ' + m(db) + '. ' +
      (c.bal > 0 ? 'Credits are larger, so the balance is a credit of ' + m(c.bal) + ': the business owes the partner.' : 'Debits are larger, so the balance is a debit of ' + m(-c.bal) + ': the partner owes the business.');
  }
  B['ACC-PIR-05'] = { title: 'Partners\' current and capital accounts', items: [
    { skill: 'which-side', kind: 'mcq', q: 'To which account are a partner\'s drawings debited?',
      options: ['The partner\'s current account', 'The appropriation account', 'The income statement', 'The bank account'], answer: 0,
      why: 'Drawings reduce what the business owes the partner, so they are debited to the partner\'s current account (and credited to bank or cash).' },
    { skill: 'which-side', kind: 'multi', q: 'Which of these are entered on the <b>credit</b> side of a partner\'s current account?',
      options: ['Interest on capital', 'Partner\'s salary', 'Share of residual profit', 'Drawings', 'Interest on drawings', 'Share of residual loss'], answers: [0, 1, 2],
      why: 'Amounts the partner earns are credited: interest on capital, salary and share of profit. Drawings, interest on drawings and a share of loss are debited.' },
    { skill: 'which-side', kind: 'multi', q: 'Which of these are entered on the <b>debit</b> side of a partner\'s current account?',
      options: ['Drawings', 'Interest on drawings', 'Goods taken for own use', 'Interest on the partner\'s loan', 'Partner\'s salary', 'Opening credit balance'], answers: [0, 1, 2],
      why: 'Drawings (cash or goods) and interest on drawings reduce what is owed to the partner, so they are debits. Loan interest, salary and a credit balance b/d are credits.' },
    { skill: 'which-side', kind: 'mcq', q: 'A partner has lent money to the partnership. Where is the interest on this loan credited?',
      options: ['The partner\'s current account', 'The partner\'s capital account', 'The appropriation account', 'The loan account of the bank'], answer: 0,
      why: 'Loan interest is an expense of the business that is owed to the partner, so it is credited to the partner\'s current account.' },
    { skill: 'which-side', kind: 'mcq', q: 'The partnership made a residual loss. On which side of each partner\'s current account is the share of the loss entered?',
      options: ['Debit', 'Credit', 'Neither: it goes to the capital account', 'Neither: it stays in the appropriation account'], answer: 0,
      why: 'A share of loss reduces what the business owes the partner, so it is debited, like drawings.' },
    { skill: 'which-side', kind: 'mcq', q: 'A partner\'s current account had a credit balance of $2,400 at the start of the year. How is it entered?',
      options: ['Credit side, as Balance b/d', 'Debit side, as Balance b/d', 'Credit side, as Balance c/d', 'Debit side, as Drawings'], answer: 0,
      why: 'A credit balance means the business owed the partner $2,400, so it is brought down on the credit side.' },
    { skill: 'closing-balance', gen: function () {
      var c = curCase('cr');
      if (c.bal < 0) { c.sh += -c.bal + rstep(500, 3000, 10); c.bal = c.ob + c.ioc + c.sal + c.sh - c.dr - c.iod; }
      return money('From these items for partner <b>' + c.n + '</b>, calculate the closing balance on the current account (it is a credit balance): ' + curText(c) + '.', c.bal, curWhy(c));
    } },
    { skill: 'closing-balance', gen: function () {
      var c = curCase('dr');
      if (c.bal < 0) { c.sh += -c.bal + rstep(500, 3000, 10); c.bal = c.ob + c.ioc + c.sal + c.sh - c.dr - c.iod; }
      return money('Partner <b>' + c.n + '</b>\'s current account items for the year are: ' + curText(c) + '. Calculate the closing credit balance.', c.bal, curWhy(c));
    } },
    { skill: 'closing-balance', gen: function () {
      var c = curCase(pick(['cr', 'dr']));
      var b = Math.abs(c.bal), side = c.bal > 0 ? 'Credit' : 'Debit', other = c.bal > 0 ? 'Debit' : 'Credit';
      var alt = Math.abs(c.bal + 2 * c.iod), alt2 = Math.abs(c.bal - 2 * c.ob);
      return { kind: 'mcq', q: 'Partner <b>' + c.n + '</b>: ' + curText(c) + '. What is the balance brought down on the first day of the next year?',
        options: [side + ' ' + m(b), other + ' ' + m(b), side + ' ' + m(alt === b ? b + 1000 : alt), side + ' ' + m(alt2 === b || alt2 === alt ? b + 2000 : alt2)], answer: 0, why: curWhy(c) };
    } },
    { skill: 'closing-balance', gen: function () {
      var n = who(), ioc = rstep(1500, 5000, 100), sh = rstep(6000, 15000, 100), dr = sh + ioc + rstep(1000, 6000, 100), iod = dr * 2 / 100, ob = rstep(200, 1500, 10);
      var bal = dr + iod - ob - ioc - sh;
      return money('Partner <b>' + n + '</b>: opening credit balance ' + m(ob) + '; interest on capital ' + m(ioc) + '; share of profit ' + m(sh) + '; drawings ' + m(dr) + '; interest on drawings ' + m(iod) + '. The closing balance is a debit. Calculate it.', bal,
        'Credits = ' + m(ob) + ' + ' + m(ioc) + ' + ' + m(sh) + ' = ' + m(ob + ioc + sh) + '. Debits = ' + m(dr) + ' + ' + m(iod) + ' = ' + m(dr + iod) + '. Debit balance = ' + m(bal) + ', because drawings were more than the partner earned.');
    } },
    { skill: 'closing-balance', gen: function () {
      var c = curCase('cr');
      if (c.bal < 0) { c.sh += -c.bal + rstep(500, 3000, 10); c.bal = c.ob + c.ioc + c.sal + c.sh - c.dr - c.iod; }
      var tot = c.ob + c.ioc + c.sal + c.sh;
      return money('Partner <b>' + c.n + '</b>\'s current account is balanced at the year end: ' + curText(c) + '. What total appears at the foot of both sides of the account?', tot,
        'The bigger side is the credit side: ' + m(tot) + '. Balance c/d of ' + m(c.bal) + ' is placed on the debit side so that both sides total ' + m(tot) + '.');
    } },
    { skill: 'closing-balance', gen: function () {
      var n = who(), L = rstep(10000, 30000, 1000), r = pick([4, 5, 6]), li = L * r / 100, ob = rstep(500, 3000, 10), ioc = rstep(2000, 6000, 100), sh = rstep(10000, 25000, 10), dr = rstep(12000, 30000, 100);
      if (dr > ob + li + ioc + sh - 300) dr = ob + li + ioc + sh - rstep(500, 3000, 100);
      var bal = ob + li + ioc + sh - dr;
      return money('Partner <b>' + n + '</b> has lent the partnership ' + m(L) + ' at ' + r + '% a year. Current account items: opening credit balance ' + m(ob) + '; interest on capital ' + m(ioc) + '; share of profit ' + m(sh) + '; drawings ' + m(dr) + '. The year\'s loan interest has not yet been entered. Calculate the closing credit balance.', bal,
        'Loan interest = ' + r + '% × ' + m(L) + ' = ' + m(li) + ', credited to the current account. Balance = ' + m(ob) + ' + ' + m(li) + ' + ' + m(ioc) + ' + ' + m(sh) + ' − ' + m(dr) + ' = ' + m(bal) + '.');
    } },
    { skill: 'missing-figures', gen: function () {
      var c = curCase('cr');
      if (c.bal < 0) { c.sh += -c.bal + rstep(500, 3000, 10); c.bal = c.ob + c.ioc + c.sal + c.sh - c.dr - c.iod; }
      return money('Partner <b>' + c.n + '</b>\'s current account shows: opening credit balance ' + m(c.ob) + '; interest on capital ' + m(c.ioc) + '; ' + (c.sal ? 'salary ' + m(c.sal) + '; ' : '') + 'drawings ' + m(c.dr) + '; interest on drawings ' + m(c.iod) + '; closing credit balance ' + m(c.bal) + '. Calculate the partner\'s share of profit.', c.sh,
        'Credits must equal debits plus the credit balance c/d: share of profit = ' + m(c.dr) + ' + ' + m(c.iod) + ' + ' + m(c.bal) + ' − ' + m(c.ob) + ' − ' + m(c.ioc) + (c.sal ? ' − ' + m(c.sal) : '') + ' = ' + m(c.sh) + '.');
    } },
    { skill: 'missing-figures', gen: function () {
      var c = curCase('cr');
      if (c.bal < 0) { c.sh += -c.bal + rstep(500, 3000, 10); c.bal = c.ob + c.ioc + c.sal + c.sh - c.dr - c.iod; }
      return money('Partner <b>' + c.n + '</b>\'s current account: opening credit balance ' + m(c.ob) + '; interest on capital ' + m(c.ioc) + '; ' + (c.sal ? 'salary ' + m(c.sal) + '; ' : '') + 'share of profit ' + m(c.sh) + '; interest on drawings ' + m(c.iod) + '; closing credit balance ' + m(c.bal) + '. Calculate the partner\'s drawings.', c.dr,
        'Drawings = credits − interest on drawings − closing balance = ' + m(c.ob + c.ioc + c.sal + c.sh) + ' − ' + m(c.iod) + ' − ' + m(c.bal) + ' = ' + m(c.dr) + '.');
    } },
    { skill: 'missing-figures', gen: function () {
      var n = pair(), rt = pick([[3, 2], [2, 1], [1, 1], [3, 1]]), rs = rt[0] + rt[1], res = rs * rstep(3000, 8000, 10), ioc = rstep(2000, 6000, 100), ob = rstep(500, 2500, 10), sh = res * rt[0] / rs, dr = rstep(10000, 20000, 100);
      if (dr > ob + ioc + sh - 300) dr = ob + ioc + sh - rstep(500, 2500, 100);
      var bal = ob + ioc + sh - dr;
      return money('<b>' + n[0] + '</b> and <b>' + n[1] + '</b> share residual profit ' + rt[0] + ' : ' + rt[1] + '. The residual profit is ' + m(res) + '. ' + n[0] + ' had an opening current account credit balance of ' + m(ob) + ', interest on capital of ' + m(ioc) + ' and drawings of ' + m(dr) + ' (no interest on drawings). Calculate ' + n[0] + '\'s closing current account balance (credit).', bal,
        n[0] + '\'s share = ' + rt[0] + '/' + rs + ' × ' + m(res) + ' = ' + m(sh) + '. Balance = ' + m(ob) + ' + ' + m(ioc) + ' + ' + m(sh) + ' − ' + m(dr) + ' = ' + m(bal) + '.');
    } },
    { skill: 'meaning-of-balances', kind: 'mcq', q: 'At the year end a partner\'s current account has a debit balance. What does this mean?',
      options: ['The partner has taken out more than they were credited with', 'The partner has earned a large share of profit', 'The business owes money to the partner', 'The partner has invested more capital'], answer: 0,
      why: 'A debit balance means drawings and other debits exceeded the interest, salary and profit share credited, so the partner owes the business.' },
    { skill: 'meaning-of-balances', kind: 'mcq', q: 'A partner\'s current account has a credit balance of $3,800. What does this show?',
      options: ['The partnership owes the partner $3,800', 'The partner owes the partnership $3,800', 'The partner\'s capital has fallen by $3,800', 'The partnership made a loss of $3,800'], answer: 0,
      why: 'A credit balance means the partner has left part of their earnings in the business, so the business owes it to them.' },
    { skill: 'meaning-of-balances', kind: 'mcq', q: 'A partner\'s current account balance changed from credit $1,200 to debit $900 during the year. What is the most likely reason?',
      options: ['Drawings were greater than the partner\'s share of profit and other credits', 'The partner\'s share of profit was much larger than drawings', 'The partner put extra capital into the business', 'Interest on capital was increased'], answer: 0,
      why: 'Moving to a debit balance means more was debited (mainly drawings) than credited during the year.' },
    { skill: 'capital-accounts', kind: 'mcq', q: 'What does a partner\'s capital account normally record when capital accounts are fixed?',
      options: ['Capital the partner has invested in the business', 'Each year\'s share of profit and drawings', 'Interest on capital and salaries', 'The partner\'s personal bank account'], answer: 0,
      why: 'Fixed capital accounts show only the capital invested. Yearly shares, interest, salaries and drawings go through the current account.' },
    { skill: 'capital-accounts', gen: function () {
      var n = who(), cap = rstep(20000, 80000, 5000), add = rstep(5000, 20000, 1000), car = rstep(4000, 12000, 500);
      var a = cap + add + car;
      return money('Partner <b>' + n + '</b>\'s capital account had a balance of ' + m(cap) + ' at the start of the year. During the year ' + n + ' paid in ' + m(add) + ' from savings and transferred a personal car worth ' + m(car) + ' to the business. Drawings of ' + m(rstep(8000, 20000, 100)) + ' were debited to the current account. Calculate the closing capital account balance.', a,
        'Capital introduced, in cash or as assets, is credited to the capital account: ' + m(cap) + ' + ' + m(add) + ' + ' + m(car) + ' = ' + m(a) + '. Drawings go to the current account, so they do not affect it.');
    } },
    { skill: 'capital-accounts', kind: 'mcq', q: 'A partner pays $10,000 into the business bank account as extra capital. What is the double entry?',
      options: ['Debit bank; credit partner\'s capital account', 'Debit partner\'s capital account; credit bank', 'Debit bank; credit appropriation account', 'Debit partner\'s current account; credit bank'], answer: 0,
      why: 'The bank (an asset) increases, so it is debited. The business owes the partner more capital, so the capital account is credited.' },
    { skill: 'capital-accounts', kind: 'mcq', q: 'A current account is balanced on 31 December 2025. On which date is the balance brought down?',
      options: ['1 January 2026', '31 December 2025', '31 January 2026', '1 December 2025'], answer: 0,
      why: 'The balance is carried down on the last day of the year and brought down on the first day of the next year.' },
    { skill: 'capital-accounts', gen: function () {
      var c = curCase('cr');
      if (c.bal < 0) { c.sh += -c.bal + rstep(500, 3000, 10); c.bal = c.ob + c.ioc + c.sal + c.sh - c.dr - c.iod; }
      var rows = [['Dr', '$', 'Cr', '$'], ['Interest on drawings', f(c.iod), 'Balance b/d', f(c.ob)], ['Balance c/d', f(c.bal), 'Interest on capital', f(c.ioc)], ['', '', 'Share of profit', f(c.sh)], ['', '', 'Drawings', f(c.dr)]];
      if (c.sal) rows.splice(4, 0, ['', '', 'Salary', f(c.sal)]);
      return { kind: 'mcq', q: 'A student drafted partner <b>' + c.n + '</b>\'s current account and could not make it balance.' + tbl(rows, true) + 'Which entry is on the wrong side?',
        options: ['Drawings', 'Interest on drawings', 'Interest on capital', 'Share of profit'], answer: 0,
        why: 'Drawings reduce what the business owes the partner, so they belong on the debit side with interest on drawings. Interest on capital, salary and share of profit are credits.' };
    } }
  ] };

})();
