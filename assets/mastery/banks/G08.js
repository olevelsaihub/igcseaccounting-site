/* Group G08 mastery bank: Reading control-account balances; Finding equity with a statement of affairs; Opening journals and revised profit; Partnership statement of financial position; Incomplete records; Rare extensions. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function step(a, b, s) { return s * rint(Math.ceil(a / s), Math.floor(b / s)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(n) { n = R.roundDp(n, 2); var neg = n < 0; n = Math.abs(n); var s = Number.isInteger(n) ? String(n) : n.toFixed(2); var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '-' : '') + p.join('.'); }
  function money(n) { return (n < 0 ? '-$' : '$') + fmt(Math.abs(n)); }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function tbl(head, rows) {
    return '<table class="mc-table">' + (head ? '<tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  // A list of balances as a two-column table.
  function list(items) { return tbl(['Item', '$'], items.map(function (it) { return [it[0], fmt(it[1])]; })); }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  // Numeric MCQ: correct value first, distinct positive distractors, topped up to 4 options.
  function numMcq(q, ans, wrongs, why, f) {
    f = f || money;
    var vals = [ans];
    wrongs.forEach(function (w) { if (w > 0 && vals.indexOf(w) < 0 && vals.length < 5) vals.push(w); });
    var d = Math.max(10, Math.round(Math.abs(ans) * 0.06 / 10) * 10), k = 1;
    while (vals.length < 4) { var c = ans + (k % 2 ? 1 : -1) * d * Math.ceil(k / 2); if (c > 0 && vals.indexOf(c) < 0) vals.push(c); k++; }
    return { kind: 'mcq', q: q, options: vals.map(f), answer: 0, why: why };
  }
  function num(q, ans, why) { return { kind: 'num', q: q, answer: ans, unit: '$', display: fmt(ans), why: why }; }

  var NAMES = ['Kwame', 'Leila', 'Ravi', 'Noor', 'Hana', 'Ines', 'Bilal', 'Farah', 'Arjun', 'Mei', 'Zara', 'Lena', 'Haris', 'Priya', 'Tomas', 'Amara', 'Yusuf', 'Sofia', 'Kenji', 'Nadia', 'Oskar', 'Thandi', 'Rafael', 'Selin'];
  var SHOPS = ['Harbour Kitchenware', 'Pinecrest Hardware', 'Lumen Lighting', 'Copper Kettle Café', 'Bluebell Garden Centre', 'Northgate Stationers', 'Saffron Spice Store', 'Riverside Cycles', 'Tidewater Tiles', 'Maple Leaf Bakery', 'Orbit Phone Repairs', 'Juniper Pet Supplies'];
  var SUPPLIERS = ['Granite Tools Ltd', 'Westfield Machinery', 'Brightdesk Supplies', 'Hillcrest Motors', 'Alder Equipment', 'Quayside Fittings', 'Summit Office Systems'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function monthEnd(i) { i = ((i % 12) + 12) % 12; return MDAYS[i] + ' ' + MONTHS[i]; }

  /* ---------------------------------------------------------------- ACC-CTL-04 */
  B['ACC-CTL-04'] = { title: 'Reading the balance on a control account', items: [
    { skill: 'normal balance', kind: 'mcq', q: 'At the year end a trader&rsquo;s trade receivables ledger control account has a closing debit balance. What does this balance represent?',
      options: ['The total owed to the business by credit customers at the year end', 'The total value of goods sold on credit during the year', 'The total owed by the business to credit suppliers at the year end', 'The total cash received from credit customers during the year'], answer: 0,
      why: 'The receivables control account summarises the customers&rsquo; accounts in the receivables ledger. Its closing debit balance is what credit customers still owe at that date, not the sales or receipts for the whole year.' },
    { skill: 'normal balance', kind: 'mcq', q: 'Marlow Supplies has a closing credit balance of $14,260 on its trade payables ledger control account. What does the $14,260 represent?',
      options: ['The amount Marlow Supplies owes to its credit suppliers', 'The amount its credit customers owe to Marlow Supplies', 'The total credit purchases Marlow Supplies made this year', 'The total paid to credit suppliers during the year'], answer: 0,
      why: 'A credit balance on the payables control account is a liability: the total the business still owes to its credit suppliers at that date. It is not the purchases or payments for the year.' },
    { skill: 'normal balance', kind: 'mcq', q: 'On which side is the normal closing balance of a trade payables ledger control account, and why?',
      options: ['Credit, because it is an amount the business owes', 'Debit, because it is an amount the business owes', 'Debit, because suppliers owe money to the business', 'Credit, because customers owe money to the business'], answer: 0,
      why: 'Amounts owed to suppliers are a liability, and liabilities have credit balances. So the payables control account normally has a credit balance.' },
    { skill: 'normal balance', kind: 'mcq', q: 'On which side is the normal closing balance of a trade receivables ledger control account, and why?',
      options: ['Debit, because customers owe money to the business', 'Credit, because customers owe money to the business', 'Debit, because the business owes money to customers', 'Credit, because it is the total of credit sales'], answer: 0,
      why: 'Money owed by credit customers is an asset, and assets have debit balances. So the receivables control account normally has a debit balance.' },
    { skill: 'unusual-side balance', kind: 'multi', q: 'Which of these could cause a <b>debit</b> balance on a trade payables ledger control account?',
      options: ['The business paid a supplier more than the invoice total', 'The business paid a supplier before the goods were delivered', 'Goods were returned to a supplier after the invoice had been paid', 'A credit customer paid more than the amount owed', 'Goods were bought on credit and have not yet been paid for'], answers: [0, 1, 2],
      why: 'A debit balance on the payables side means a supplier now owes the business. That happens after overpaying, paying in advance or returning goods already paid for. A customer overpaying affects the receivables control account, and unpaid credit purchases give the normal credit balance.' },
    { skill: 'unusual-side balance', kind: 'multi', q: 'Which of these could cause a <b>credit</b> balance on a trade receivables ledger control account?',
      options: ['A customer paid twice for the same invoice', 'A customer paid a deposit before any goods were invoiced', 'A customer returned goods after paying the invoice in full', 'The business overpaid one of its suppliers', 'A customer has not yet paid for goods bought on credit'], answers: [0, 1, 2],
      why: 'A credit balance on the receivables side means the business owes a customer: the customer overpaid, paid in advance or returned goods after paying. Overpaying a supplier affects the payables control account, and an unpaid customer gives the normal debit balance.' },
    { skill: 'unusual-side balance', kind: 'mcq', q: 'Kestrel Bikes received an invoice for $460 from a supplier and, by mistake, paid $640. There were no other transactions with this supplier. How will this appear in the trade payables ledger control account?',
      options: ['A debit balance of $180 brought down', 'A credit balance of $180 brought down', 'A debit balance of $640 brought down', 'A credit balance of $460 brought down'], answer: 0,
      why: '$640 paid &minus; $460 owed = $180 overpaid. The supplier now owes Kestrel Bikes $180, so it is a debit (unusual-side) balance in the payables control account.' },
    { skill: 'unusual-side balance', kind: 'mcq', q: 'On 25 March a customer of Orchid Florists paid $300 in advance for a wedding order that will be invoiced in April. The year ends on 31 March. What effect does this have on the trade receivables ledger control account at 31 March?',
      options: ['It creates a credit balance of $300, owed to the customer', 'It creates a debit balance of $300, owed by the customer', 'It increases credit sales for the year by $300', 'It has no effect because no invoice has been sent'], answer: 0,
      why: 'The receipt is credited to the customer&rsquo;s account but no sale has been invoiced yet, so the customer is in credit by $300. Orchid Florists owes the customer goods or money, which is an unusual-side credit balance.' },
    { skill: 'both sides', kind: 'mcq', q: 'A trade payables ledger control account shows a debit balance b/d of $95 as well as a credit balance b/d of $21,400. What does the $95 debit balance mean?',
      options: ['One or more suppliers owe money to the business', 'One or more customers owe money to the business', 'The business owes $95 more to its suppliers', 'The account has been added up incorrectly by $95'], answer: 0,
      why: 'Most suppliers are owed money ($21,400 credit), but at least one supplier has been overpaid or paid in advance, so that supplier owes the business $95. It is not an error.' },
    { skill: 'both sides', kind: 'mcq', q: 'A trade receivables ledger control account shows a credit balance b/d of $240 as well as a debit balance b/d of $33,180. What does the $240 credit balance mean?',
      options: ['The business owes money to one or more credit customers', 'One or more credit suppliers owe money to the business', 'Credit customers owe the business a further $240', 'Credit sales were understated by $240 this year'], answer: 0,
      why: 'Most customers owe the business money ($33,180 debit). The $240 credit balance belongs to customers who have overpaid, paid in advance or returned goods after paying, so the business owes them.' },
    { skill: 'both sides', kind: 'mcq', q: 'Delta Tiles&rsquo; trade receivables ledger control account at 30 June has debit balances of $42,600 and credit balances of $380. How should these be brought down on 1 July?',
      options: ['$42,600 debit and $380 credit, shown separately', 'One net debit balance of $42,220', 'One net debit balance of $42,980', 'One net credit balance of $42,220'], answer: 0,
      why: 'The two balances belong to different customers, so each is brought down on its own side. Netting them to $42,220 would hide the $380 that Delta Tiles owes some customers.' },
    { skill: 'reading the account', gen: function () {
      var dr = step(18000, 64000, 10), cr = step(60, 900, 10), n = pick(NAMES);
      return num('At the start of the new year, ' + n + '&rsquo;s trade receivables ledger control account shows:<br>' + tbl(['Dr', '$', 'Cr', '$'], [['Balance b/d', fmt(dr), 'Balance b/d', fmt(cr)]]) +
        'What is the total amount owed <b>to</b> ' + n + ' by credit customers? Give your answer in $.', dr,
        'The debit balance b/d of ' + money(dr) + ' is the total owed by customers whose accounts are in debit. The credit balance of ' + money(cr) + ' is owed by ' + n + ' to other customers and is not netted off, so the answer is not ' + money(dr - cr) + '.');
    } },
    { skill: 'reading the account', gen: function () {
      var cr = step(9000, 48000, 10), dr = step(40, 750, 5), s = pick(SHOPS);
      return num('At the start of the new year, the trade payables ledger control account of ' + s + ' shows:<br>' + tbl(['Dr', '$', 'Cr', '$'], [['Balance b/d', fmt(dr), 'Balance b/d', fmt(cr)]]) +
        'How much does ' + s + ' owe to its credit suppliers in total? Give your answer in $.', cr,
        'The credit balance b/d of ' + money(cr) + ' is the total owed to suppliers. The ' + money(dr) + ' debit balance is owed <i>by</i> suppliers who were overpaid or paid early; it is brought down separately, not deducted.');
    } },
    { skill: 'unusual-side balance', gen: function () {
      var inv = step(600, 4800, 20), ret = step(60, Math.floor(inv / 3), 10), s = pick(SHOPS);
      return { kind: 'mcq', q: s + ' bought goods on credit for ' + money(inv) + ' and paid the invoice in full. A week later it returned faulty goods costing ' + money(ret) + ' to the supplier. What balance is now on this supplier&rsquo;s account, and so in the trade payables ledger control account?',
        options: ['Debit balance of ' + money(ret), 'Credit balance of ' + money(ret), 'Debit balance of ' + money(inv), 'Credit balance of ' + money(inv - ret)], answer: 0,
        why: 'The invoice of ' + money(inv) + ' was fully paid, so the account was clear. The return of ' + money(ret) + ' is then debited, so the supplier owes ' + s + ' ' + money(ret) + ': a debit balance.' };
    } },
    { skill: 'unusual-side balance', gen: function () {
      var inv = step(500, 3600, 10), over = step(20, 400, 10), paid = inv + over, n = pick(NAMES);
      return { kind: 'mcq', q: 'A credit customer of ' + n + ' owed ' + money(inv) + ' and paid ' + money(paid) + ' by bank transfer. This was the only balance on the customer&rsquo;s account. What balance is now on the customer&rsquo;s account, and so in the trade receivables ledger control account?',
        options: ['Credit balance of ' + money(over), 'Debit balance of ' + money(over), 'Credit balance of ' + money(paid), 'Debit balance of ' + money(inv)], answer: 0,
        why: money(paid) + ' paid &minus; ' + money(inv) + ' owed = ' + money(over) + ' overpaid. ' + n + ' now owes the customer ' + money(over) + ', which is a credit (unusual-side) balance on the receivables side.' };
    } },
    { skill: 'normal balance', kind: 'mcq', q: 'The balance on a trader&rsquo;s trade payables ledger control account at the year end is $9,870. Which total should it agree with?',
      options: ['The total of the balances in the payables ledger', 'The total of the balances in the receivables ledger', 'The total of the purchases day book for the year', 'The closing balance shown in the cash book'], answer: 0,
      why: 'The control account summarises every supplier&rsquo;s personal account, so its balance should equal the total of the payables ledger balances. If it does not, there is an error to find.' },
    { skill: 'normal balance', kind: 'mcq', q: 'A student writes: &ldquo;The closing balance on the trade payables ledger control account is the value of all goods bought on credit in the year.&rdquo; Why is this wrong?',
      options: ['It is only what is still unpaid to suppliers at that date', 'It is the amount owed by credit customers, not to suppliers', 'It includes cash purchases as well as credit purchases', 'It is the total paid to suppliers during the whole year'], answer: 0,
      why: 'Credit purchases are added during the year, but payments, returns and discounts received are taken off. What is left at the end is the amount still owed to suppliers.' },
    { skill: 'unusual-side balance', kind: 'mcq', q: 'Which of these would <b>not</b> lead to a debit balance on a trade payables ledger control account?',
      options: ['Buying goods on credit and not yet paying for them', 'Paying a supplier&rsquo;s invoice twice by mistake', 'Paying a supplier in advance for goods not yet delivered', 'Returning goods to a supplier after paying for them'], answer: 0,
      why: 'Unpaid credit purchases are owed to suppliers, which gives the normal credit balance. The other three leave a supplier owing the business, which is a debit balance.' },
    { skill: 'unusual-side balance', kind: 'mcq', q: 'Which of these would <b>not</b> lead to a credit balance on a trade receivables ledger control account?',
      options: ['Selling goods on credit to a customer who has not yet paid', 'A customer paying the same invoice twice by mistake', 'A customer paying a deposit before being invoiced', 'A customer returning goods after paying for them in full'], answer: 0,
      why: 'An unpaid credit sale means the customer owes the business, which is the normal debit balance. The other three leave the business owing the customer, which is a credit balance.' },
    { skill: 'both sides', kind: 'mcq', q: 'Lumen Lighting&rsquo;s trade receivables ledger control account shows a debit balance b/d of $27,300 and a credit balance b/d of $150 on 1 April. Which statement is correct?',
      options: ['Customers owe $27,300 and the business owes customers $150', 'Customers owe $27,150 in total after netting the balances', 'Suppliers owe $27,300 and the business owes suppliers $150', 'Customers owe $27,450 including the credit balance'], answer: 0,
      why: 'Both balances relate to customers. The debit is owed by customers to Lumen Lighting; the credit is owed by Lumen Lighting to customers who overpaid or paid early. They are kept separate.' },
    { skill: 'unusual-side balance', gen: function () {
      var d = step(250, 2400, 50), s = pick(SHOPS);
      return { kind: 'mcq', q: 'On 20 December, ' + s + ' paid a supplier a deposit of ' + money(d) + ' for stock to be delivered and invoiced in January. Its year ends on 31 December. How does the deposit affect the trade payables ledger control account at 31 December?',
        options: ['Debit balance of ' + money(d) + ': the supplier owes the business', 'Credit balance of ' + money(d) + ': the business owes the supplier', 'Credit purchases for the year rise by ' + money(d), 'No effect until the invoice arrives in January'], answer: 0,
        why: 'The payment is debited to the supplier&rsquo;s account before any invoice is credited, so the supplier is in debit by ' + money(d) + '. This is a payment in advance, giving an unusual-side debit balance.' };
    } },
    { skill: 'both sides', kind: 'mcq', q: 'Why might a trade payables ledger control account show balances on <b>both</b> sides at the year end?',
      options: ['Most suppliers are owed money, but a few were overpaid or paid early', 'The account contains an error that must be corrected before balancing', 'Cash purchases go on one side and credit purchases on the other', 'Opening and closing balances are always shown on opposite sides'], answer: 0,
      why: 'The control account totals many personal accounts. Most are credit balances (owed to suppliers), but a few suppliers may owe the business, so both totals are brought down.' },
    { skill: 'reading the account', gen: function () {
      var ob = step(6000, 22000, 10), sales = step(40000, 120000, 10), disc = step(200, 1500, 10), cd = step(5000, 24000, 10);
      var bank = ob + sales - disc - cd;
      var rows = [['Balance b/d', fmt(ob), 'Bank', fmt(bank)], ['Sales', fmt(sales), 'Discounts allowed', fmt(disc)], ['', '', 'Balance c/d', fmt(cd)], ['', fmt(ob + sales), '', fmt(ob + sales)]];
      return numMcq('A trader&rsquo;s trade receivables ledger control account for the year is shown.<br>' + tbl(['Dr', '$', 'Cr', '$'], rows) + 'How much do credit customers owe the trader at the end of the year?',
        cd, [ob, sales, bank], 'The balance c/d of ' + money(cd) + ' is what is left after receipts and discounts are taken from the opening balance plus credit sales. It is brought down as a debit: the amount still owed by customers.');
    } }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-07 */
  B['ACC-PIR-07'] = { title: 'Finding equity and profit when records are incomplete', items: [
    { skill: 'equity from a list', gen: function () {
      var eq = step(8000, 40000, 50), inv = step(3000, 15000, 50), tr = step(2000, 12000, 50), bk = step(500, 6000, 50), tp = step(2000, 9000, 50), n = pick(NAMES);
      var ta = eq + inv + tr + bk, ln = step(3000, Math.min(15000, ta - tp - 6000), 500), eqt = ta - tp - ln;
      return num(n + ' does not keep full records. On 1 January the business had these balances:<br>' + list([['Equipment (carrying amount)', eq], ['Inventory', inv], ['Trade receivables', tr], ['Cash at bank', bk], ['Trade payables', tp], ['Bank loan (repayable 2030)', ln]]) + 'Calculate ' + n + '&rsquo;s equity at 1 January. Give your answer in $.', eqt,
        'Total assets = ' + money(eq) + ' + ' + money(inv) + ' + ' + money(tr) + ' + ' + money(bk) + ' = ' + money(ta) + '. Total liabilities = ' + money(tp) + ' + ' + money(ln) + ' = ' + money(tp + ln) + '. Equity = ' + money(ta) + ' &minus; ' + money(tp + ln) + ' = ' + money(eqt) + '.');
    } },
    { skill: 'carrying amount', gen: function () {
      var cost = step(12000, 30000, 500), ad = step(2000, Math.floor(cost * 0.6), 500), inv = step(2000, 9000, 50), tr = step(1000, 7000, 50), cash = step(200, 2000, 10), tp = step(1500, 6000, 50), n = pick(NAMES);
      var ok = cost - ad + inv + tr + cash - tp;
      return numMcq('At 1 May, ' + n + '&rsquo;s business had a delivery van that cost ' + money(cost) + ' with accumulated depreciation of ' + money(ad) + ', inventory ' + money(inv) + ', trade receivables ' + money(tr) + ', cash ' + money(cash) + ' and trade payables ' + money(tp) + '. What is the equity at 1 May?',
        ok, [ok + ad, ok - ad, ok + 2 * tp], 'Use the van at carrying amount: ' + money(cost) + ' &minus; ' + money(ad) + ' = ' + money(cost - ad) + '. Assets = ' + money(cost - ad + inv + tr + cash) + '; less trade payables ' + money(tp) + ' gives equity ' + money(ok) + '.');
    } },
    { skill: 'overdraft is a liability', gen: function () {
      var fx = step(4000, 16000, 50), inv = step(3000, 12000, 50), tr = step(1500, 8000, 50), tp = step(1500, 7000, 50), od = step(300, 2500, 10), s = pick(SHOPS);
      var a = fx + inv + tr, ok = a - tp - od;
      return numMcq(s + ' had these balances on 1 October: fixtures and fittings (carrying amount) ' + money(fx) + ', inventory ' + money(inv) + ', trade receivables ' + money(tr) + ', trade payables ' + money(tp) + ' and a bank overdraft of ' + money(od) + '. What is the equity on 1 October?',
        ok, [a + od - tp, a - tp, a - od], 'A bank overdraft is money owed to the bank, so it is a liability. Equity = ' + money(a) + ' assets &minus; (' + money(tp) + ' + ' + money(od) + ') liabilities = ' + money(ok) + '.');
    } },
    { skill: 'carrying amount', gen: function () {
      var mc = step(10000, 25000, 500), mad = step(2000, 8000, 500), vc = step(8000, 20000, 500), vad = step(1000, 6000, 500), inv = step(2000, 10000, 50), tr = step(1000, 8000, 50), bk = step(300, 4000, 10), n = pick(NAMES);
      var nca = mc - mad + vc - vad, ta = nca + inv + tr + bk;
      return num('From ' + n + '&rsquo;s records at 1 July:<br>' + tbl(['Item', 'Cost $', 'Accumulated depreciation $'], [['Machinery', fmt(mc), fmt(mad)], ['Motor vehicle', fmt(vc), fmt(vad)]]) + 'Inventory ' + money(inv) + ', trade receivables ' + money(tr) + ', cash at bank ' + money(bk) + '.<br>Calculate total assets for the statement of affairs at 1 July. Give your answer in $.', ta,
        'Non-current assets at carrying amount: (' + money(mc) + ' &minus; ' + money(mad) + ') + (' + money(vc) + ' &minus; ' + money(vad) + ') = ' + money(nca) + '. Add current assets ' + money(inv + tr + bk) + ' to get ' + money(ta) + '.');
    } },
    { skill: 'profit from change in equity', gen: function () {
      var oe = step(15000, 60000, 100), p = step(4000, 25000, 100), d = step(3000, 15000, 100), ce = oe + p - d, n = pick(NAMES);
      return num(n + '&rsquo;s equity was ' + money(oe) + ' at the start of the year and ' + money(ce) + ' at the end. During the year ' + n + ' took ' + money(d) + ' cash for personal use and introduced no new capital. Calculate the profit for the year. Give your answer in $.', p,
        'Profit = closing equity &minus; opening equity + drawings = ' + money(ce) + ' &minus; ' + money(oe) + ' + ' + money(d) + ' = ' + money(p) + '. Drawings are added back because they reduced equity without being a trading loss.');
    } },
    { skill: 'profit from change in equity', gen: function () {
      var oe = step(20000, 70000, 100), p = step(6000, 30000, 100), d = step(4000, 16000, 100), k = step(2000, 10000, 500), ce = oe + p + k - d, n = pick(NAMES);
      return numMcq(n + '&rsquo;s equity rose from ' + money(oe) + ' to ' + money(ce) + ' during the year. ' + n + ' paid an extra ' + money(k) + ' of savings into the business bank account and took drawings of ' + money(d) + '. What was the profit for the year?',
        p, [ce - oe, ce - oe - d + k, ce - oe + d + k], 'Profit = ' + money(ce) + ' &minus; ' + money(oe) + ' + drawings ' + money(d) + ' &minus; capital introduced ' + money(k) + ' = ' + money(p) + '. New capital raised equity but was not earned, so it is taken off.');
    } },
    { skill: 'loss for the year', gen: function () {
      var oe = step(30000, 60000, 100), loss = step(1000, 6000, 100), d = step(2000, 8000, 100), ce = oe - loss - d, n = pick(NAMES);
      return { kind: 'mcq', q: n + '&rsquo;s equity was ' + money(oe) + ' at the start of the year and ' + money(ce) + ' at the end. Drawings were ' + money(d) + ' and no capital was introduced. What was the result for the year?',
        options: ['Loss of ' + money(loss), 'Profit of ' + money(loss), 'Loss of ' + money(oe - ce), 'Profit of ' + money(oe - ce + d)], answer: 0,
        why: 'Closing &minus; opening + drawings = ' + money(ce) + ' &minus; ' + money(oe) + ' + ' + money(d) + ' = ' + money(-loss) + '. The answer is negative, so it is a loss of ' + money(loss) + '.' };
    } },
    { skill: 'profit from change in equity', gen: function () {
      var oe = step(18000, 50000, 100), p = step(5000, 22000, 100), dc = step(3000, 12000, 100), g = step(200, 1800, 10), k = step(1000, 8000, 500), ce = oe + p + k - dc - g, n = pick(NAMES);
      return num(n + ' runs a grocery stall. Equity was ' + money(oe) + ' at the start of the year and ' + money(ce) + ' at the end. During the year ' + n + ' withdrew ' + money(dc) + ' in cash, took goods costing ' + money(g) + ' for family use, and paid in additional capital of ' + money(k) + '. Calculate the profit for the year. Give your answer in $.', p,
        'Drawings = ' + money(dc) + ' + ' + money(g) + ' = ' + money(dc + g) + '. Profit = ' + money(ce) + ' &minus; ' + money(oe) + ' + ' + money(dc + g) + ' &minus; ' + money(k) + ' = ' + money(p) + '.');
    } },
    { skill: 'profit from change in equity', gen: function () {
      var oe = step(20000, 55000, 100), p = step(6000, 24000, 100), d = step(4000, 14000, 100), ce = oe + p - d, n = pick(NAMES);
      return num('At the end of the year ' + n + '&rsquo;s equity is ' + money(ce) + '. Profit for the year was ' + money(p) + ', drawings were ' + money(d) + ' and no capital was introduced. Calculate the equity at the start of the year. Give your answer in $.', oe,
        'Closing equity = opening equity + profit &minus; drawings, so opening equity = ' + money(ce) + ' &minus; ' + money(p) + ' + ' + money(d) + ' = ' + money(oe) + '.');
    } },
    { skill: 'profit from change in equity', gen: function () {
      var oe = step(20000, 55000, 100), p = step(8000, 26000, 100), d = step(3000, Math.min(15000, p + 2000), 100), ce = oe + p - d, n = pick(NAMES);
      return num(n + '&rsquo;s equity was ' + money(oe) + ' at the start of the year and ' + money(ce) + ' at the end. The profit for the year was ' + money(p) + ' and no capital was introduced. Calculate ' + n + '&rsquo;s drawings for the year. Give your answer in $.', d,
        'Drawings = opening equity + profit &minus; closing equity = ' + money(oe) + ' + ' + money(p) + ' &minus; ' + money(ce) + ' = ' + money(d) + '.');
    } },
    { skill: 'classifying balances', kind: 'mcq', q: 'In a statement of affairs, which of these items is a liability?',
      options: ['Bank overdraft', 'Petty cash', 'Trade receivables', 'Inventory'], answer: 0,
      why: 'An overdraft is money the business owes the bank, so it is a liability. Petty cash, trade receivables and inventory are all assets.' },
    { skill: 'classifying balances', kind: 'multi', q: 'Kenji lists these balances to prepare a statement of affairs. Which of them are liabilities?',
      options: ['Trade payables', 'Bank loan repayable in 2030', 'Bank overdraft', 'Insurance paid in advance', 'Cash in hand', 'Motor van'], answers: [0, 1, 2],
      why: 'Liabilities are amounts the business owes: suppliers, the loan and the overdraft. Insurance paid in advance is an asset (other receivable), as are cash and the van.' },
    { skill: 'classifying balances', kind: 'mcq', q: 'Which calculation gives a trader&rsquo;s equity at a date?',
      options: ['Total assets &minus; total liabilities', 'Total assets + total liabilities', 'Total liabilities &minus; total assets', 'Non-current assets &minus; current liabilities'], answer: 0,
      why: 'The accounting equation is assets = equity + liabilities, so equity = assets &minus; liabilities.' },
    { skill: 'classifying balances', kind: 'mcq', q: 'What is a statement of affairs?',
      options: ['A list of assets and liabilities at a date, used to find equity', 'A summary of all cash received and paid by the business during the year', 'A list of income and expenses, used to find the profit', 'A record of each customer&rsquo;s balance at the year end'], answer: 0,
      why: 'When full records are not kept, a statement of affairs lists what the business owns and owes at a date. The difference is the equity at that date.' },
    { skill: 'profit from change in equity', gen: function () {
      var a1 = step(30000, 60000, 100), l1 = step(5000, 15000, 100), p = step(5000, 20000, 100), d = step(4000, 12000, 100), l2 = step(5000, 15000, 100);
      var e1 = a1 - l1, e2 = e1 + p - d, a2 = e2 + l2, n = pick(NAMES);
      return num(n + ' has no full records. Totals from two statements of affairs are:<br>' + tbl(['', '1 January $', '31 December $'], [['Total assets', fmt(a1), fmt(a2)], ['Total liabilities', fmt(l1), fmt(l2)]]) + 'Drawings in the year were ' + money(d) + '. No capital was introduced. Calculate the profit for the year. Give your answer in $.', p,
        'Opening equity = ' + money(a1) + ' &minus; ' + money(l1) + ' = ' + money(e1) + '. Closing equity = ' + money(a2) + ' &minus; ' + money(l2) + ' = ' + money(e2) + '. Profit = ' + money(e2) + ' &minus; ' + money(e1) + ' + ' + money(d) + ' = ' + money(p) + '.');
    } },
    { skill: 'profit from change in equity', gen: function () {
      var oe = step(15000, 45000, 100), p = step(4000, 20000, 100), d = step(3000, 12000, 100), v = step(4000, 12000, 500), ce = oe + p + v - d, n = pick(NAMES);
      return num('On 1 March, ' + n + ' brought a private car valued at ' + money(v) + ' into the business to use for deliveries. Equity was ' + money(oe) + ' at the start of the year and ' + money(ce) + ' at the end, and drawings were ' + money(d) + '. Calculate the profit for the year. Give your answer in $.', p,
        'The car is new capital: it raised equity without any trading. Profit = ' + money(ce) + ' &minus; ' + money(oe) + ' + ' + money(d) + ' &minus; ' + money(v) + ' = ' + money(p) + '.');
    } },
    { skill: 'equity from a list', gen: function () {
      var eq = step(5000, 20000, 50), inv = step(2000, 9000, 50), tr = step(1500, 7000, 50), pre = step(100, 900, 10), bk = step(300, 3000, 10), tp = step(1500, 6000, 50), acc = step(80, 700, 10), s = pick(SHOPS);
      var ta = eq + inv + tr + pre + bk, tl = tp + acc, e = ta - tl;
      return num('The owner of ' + s + ' gives these balances at 30 September:<br>' + list([['Shop equipment (carrying amount)', eq], ['Inventory', inv], ['Trade receivables', tr], ['Rent paid in advance', pre], ['Cash at bank', bk], ['Trade payables', tp], ['Electricity owing', acc]]) + 'Calculate the equity at 30 September. Give your answer in $.', e,
        'Rent paid in advance is an asset; electricity owing is a liability. Assets = ' + money(ta) + ', liabilities = ' + money(tp) + ' + ' + money(acc) + ' = ' + money(tl) + ', so equity = ' + money(e) + '.');
    } },
    { skill: 'carrying amount', kind: 'mcq', q: 'Why are non-current assets included in a statement of affairs at carrying amount rather than at cost?',
      options: ['Carrying amount shows the value not yet used up after depreciation', 'Cost is always lower than the carrying amount of an asset', 'Carrying amount is the cost with depreciation added on to it', 'Cost is only used for current assets such as inventory'], answer: 0,
      why: 'Carrying amount = cost &minus; accumulated depreciation, so it reflects the part of the asset still to be used. Using cost would overstate assets and so overstate equity.' },
    { skill: 'loss for the year', kind: 'mcq', q: 'Teodor&rsquo;s equity was $46,000 at the start of the year and $41,000 at the end. He took no drawings and introduced no capital. What does this show?',
      options: ['A loss of $5,000 for the year', 'A profit of $5,000 for the year', 'A profit of $87,000 for the year', 'A loss of $41,000 for the year'], answer: 0,
      why: 'With no drawings or new capital, the only reason equity changes is trading. Equity fell by $46,000 &minus; $41,000 = $5,000, so there was a loss of $5,000.' },
    { skill: 'equity from a list', gen: function () {
      var e = step(15000, 40000, 50), fx = step(5000, 15000, 50), tr = step(2000, 8000, 50), bk = step(500, 4000, 10), tp = step(2000, 7000, 50), ln = step(2000, 8000, 500);
      var inv = e + tp + ln - fx - tr - bk;
      if (inv < 1500) { e += 1500 - inv + step(500, 3000, 50); inv = e + tp + ln - fx - tr - bk; }
      var n = pick(NAMES);
      return num(n + '&rsquo;s equity at 1 April was ' + money(e) + '. The other balances were: fixtures ' + money(fx) + ', trade receivables ' + money(tr) + ', cash at bank ' + money(bk) + ', trade payables ' + money(tp) + ' and a bank loan of ' + money(ln) + '. The only other item was inventory. Calculate the value of inventory. Give your answer in $.', inv,
        'Assets = equity + liabilities = ' + money(e) + ' + ' + money(tp + ln) + ' = ' + money(e + tp + ln) + '. Inventory = ' + money(e + tp + ln) + ' &minus; other assets ' + money(fx + tr + bk) + ' = ' + money(inv) + '.');
    } },
    { skill: 'profit from change in equity', kind: 'mcq', q: 'When finding profit from the change in equity, why is capital introduced during the year deducted?',
      options: ['It raised equity, but it was not earned by trading', 'It is an expense that reduces the profit', 'It lowered equity in the same way as drawings', 'It is already included in the closing inventory'], answer: 0,
      why: 'New capital from the owner increases closing equity. That increase is not profit, so it is removed to leave only the growth caused by trading.' },
    { skill: 'profit from change in equity', kind: 'mcq', q: 'When finding profit from the change in equity, why are drawings added back?',
      options: ['Drawings lowered equity, but they are not a trading loss', 'Drawings are an expense in the income statement', 'Drawings increased the closing equity figure', 'Drawings are a liability owed to the owner'], answer: 0,
      why: 'The owner taking money or goods reduces closing equity. Profit was earned before that withdrawal, so drawings are added back to find it.' }
  ] };

  /* ---------------------------------------------------------------- ACC-FS-04 */
  function draft() { return step(18000, 75000, 10); }
  function yearEnd() { return pick([2, 5, 8, 11]); }   // month index of the year end (31 March, 30 June ...)
  function rev(p) { return 'Draft profit for the year was ' + money(p) + '. '; }

  B['ACC-FS-04'] = { title: 'Calculating a revised profit', items: [
    { skill: 'accrued expense', gen: function () {
      var p = draft(), ye = yearEnd(), k = rint(1, 2), t = step(360, 2400, 30), adj = t / 3 * k, endM = ye + (3 - k);
      return numMcq(rev(p) + 'A phone and internet bill of ' + money(t) + ', covering the quarter up to ' + monthEnd(endM) + ', arrived after the year end of ' + monthEnd(ye) + ' and has not been recorded. What is the revised profit?',
        p - adj, [p + adj, p - t, p + t, p - (t - adj)],
        'The part of the bill for this year covers ' + plural(k, 'month') + ': ' + money(t) + ' &divide; 3 &times; ' + k + ' = ' + money(adj) + '. It is an expense owing, so profit falls: ' + money(p) + ' &minus; ' + money(adj) + ' = ' + money(p - adj) + '.');
    } },
    { skill: 'prepaid expense', gen: function () {
      var p = draft(), s = rint(2, 12), a = step(1200, 6000, 120), pm = s - 1, adj = a * pm / 12;
      return num('A trader&rsquo;s year ends on 31 December 2025. ' + rev(p) + 'On 1 ' + MONTHS[s - 1] + ' 2025 an annual insurance premium of ' + money(a) + ' covering the next 12 months was paid and charged in full as an expense. Calculate the revised profit for the year. Give your answer in $.', p + adj,
        'The premium for ' + (pm === 1 ? 'January 2026' : 'January to ' + MONTHS[pm - 1] + ' 2026') + ' (' + plural(pm, 'month') + ') is for next year: ' + money(a) + ' &times; ' + pm + '/12 = ' + money(adj) + '. This prepayment reduces the expense, so add it: ' + money(p) + ' + ' + money(adj) + ' = ' + money(p + adj) + '.');
    } },
    { skill: 'income in advance', gen: function () {
      var p = draft(), x = step(200, 1500, 50), r = x + step(3000, 9000, 50), n = pick(NAMES);
      return numMcq(n + '&rsquo;s draft profit of ' + money(p) + ' includes ' + money(r) + ' of rent received from a tenant who uses a spare room. Of this, ' + money(x) + ' is rent for the first months of next year. What is the revised profit?',
        p - x, [p + x, p - r, p - (r - x)],
        'Rent received in advance is income of next year, so it is removed from this year&rsquo;s profit: ' + money(p) + ' &minus; ' + money(x) + ' = ' + money(p - x) + '.');
    } },
    { skill: 'accrued income', gen: function () {
      var p = draft(), c = step(150, 1200, 10);
      return num(rev(p) + 'Commission of ' + money(c) + ' earned from a supplier for this year had not been received or recorded by the year end. Calculate the revised profit. Give your answer in $.', p + c,
        'The commission was earned this year, so it is income owing (accrued income) and is added: ' + money(p) + ' + ' + money(c) + ' = ' + money(p + c) + '.');
    } },
    { skill: 'goods for own use', gen: function () {
      var p = draft(), g = step(150, 1500, 10), sp = Math.round(g * pick([1.25, 1.4, 1.5]) / 10) * 10, n = pick(NAMES);
      return numMcq(rev(p) + n + ' took goods costing ' + money(g) + ' (normal selling price ' + money(sp) + ') for personal use. This has not been recorded. What is the revised profit?',
        p + g, [p + sp, p - g, p - sp],
        'Goods for own use are drawings, so they are taken out of purchases at cost. Lower cost of sales means higher profit: ' + money(p) + ' + ' + money(g) + ' = ' + money(p + g) + '.');
    } },
    { skill: 'provision for irrecoverable debts', gen: function () {
      var p = draft(), tr = step(8000, 40000, 100), r = pick([2, 3, 4, 5]), prov = tr * r / 100;
      return num(rev(p) + 'Trade receivables at the year end were ' + money(tr) + '. The owner now wants to set up, for the first time, a provision equal to ' + r + '% of trade receivables to cover debts that may not be paid. Calculate the revised profit. Give your answer in $.', p - prov,
        'Provision = ' + r + '% &times; ' + money(tr) + ' = ' + money(prov) + '. Creating it is an expense: ' + money(p) + ' &minus; ' + money(prov) + ' = ' + money(p - prov) + '.');
    } },
    { skill: 'provision for irrecoverable debts', gen: function () {
      var p = draft(), tr = step(10000, 40000, 100), r = pick([2, 3, 4]), nw = tr * r / 100, old = nw + step(100, 600, 10), diff = old - nw;
      return numMcq(rev(p) + 'The provision for irrecoverable debts brought forward was ' + money(old) + '. It is to be adjusted to ' + r + '% of trade receivables of ' + money(tr) + '. What is the revised profit?',
        p + diff, [p - diff, p - nw, p + nw],
        'New provision = ' + r + '% &times; ' + money(tr) + ' = ' + money(nw) + '. It falls from ' + money(old) + ' by ' + money(diff) + ', and a reduction is added to profit: ' + money(p + diff) + '.');
    } },
    { skill: 'provision for irrecoverable debts', gen: function () {
      var p = draft(), tr = step(12000, 45000, 100), r = pick([3, 4, 5]), nw = tr * r / 100, old = nw - step(80, Math.min(500, nw - 50), 10), diff = nw - old;
      return num(rev(p) + 'The provision for irrecoverable debts at the start of the year was ' + money(old) + '. At the year end it must be ' + r + '% of trade receivables of ' + money(tr) + '. No adjustment has yet been made. Calculate the revised profit. Give your answer in $.', p - diff,
        'New provision = ' + money(nw) + '. Increase = ' + money(nw) + ' &minus; ' + money(old) + ' = ' + money(diff) + ', which is an expense. Revised profit = ' + money(p) + ' &minus; ' + money(diff) + ' = ' + money(p - diff) + '. Only the increase is charged, not the whole provision.');
    } },
    { skill: 'depreciation', gen: function () {
      var p = draft(), c = step(5000, 30000, 500), r = pick([10, 20, 25]), dep = c * r / 100;
      return num(rev(p) + 'Depreciation on machinery has not been charged. The machinery cost ' + money(c) + ' and is depreciated at ' + r + '% per year using the straight-line method. Calculate the revised profit. Give your answer in $.', p - dep,
        'Straight-line depreciation = ' + r + '% &times; cost ' + money(c) + ' = ' + money(dep) + '. It is an expense: ' + money(p) + ' &minus; ' + money(dep) + ' = ' + money(p - dep) + '.');
    } },
    { skill: 'depreciation', gen: function () {
      var p = draft(), c = step(12000, 30000, 1000), ad = step(2000, Math.floor(c / 2), 1000), r = pick([20, 25, 30]), dep = (c - ad) * r / 100;
      return num(rev(p) + 'Depreciation on the delivery van has not been charged. The van cost ' + money(c) + ' and accumulated depreciation brought forward is ' + money(ad) + '. The policy is ' + r + '% per year, reducing balance method. Calculate the revised profit. Give your answer in $.', p - dep,
        'Reducing balance uses the carrying amount: (' + money(c) + ' &minus; ' + money(ad) + ') &times; ' + r + '% = ' + money(dep) + '. Revised profit = ' + money(p) + ' &minus; ' + money(dep) + ' = ' + money(p - dep) + '.');
    } },
    { skill: 'capital and revenue errors', gen: function () {
      var p = draft(), k = step(2000, 12000, 100), r = pick([10, 20, 25]), dep = k * r / 100;
      return num(rev(p) + 'A new display cabinet costing ' + money(k) + ' was wrongly charged to repairs. Fixtures are depreciated at ' + r + '% per year on cost, with a full year&rsquo;s charge in the year of purchase. Calculate the revised profit. Give your answer in $.', p + k - dep,
        'Remove the wrong expense (+' + money(k) + ') and then charge depreciation on the new asset (&minus;' + money(dep) + '): ' + money(p) + ' + ' + money(k) + ' &minus; ' + money(dep) + ' = ' + money(p + k - dep) + '.');
    } },
    { skill: 'capital and revenue errors', gen: function () {
      var p = draft(), y = step(400, 3000, 50);
      return numMcq(rev(p) + 'The cost of repainting the shop, ' + money(y) + ', was wrongly debited to the premises account. Premises are not depreciated. What is the revised profit?',
        p - y, [p + y, p - 2 * y, p + 2 * y],
        'Repainting is revenue expenditure, so it should be an expense this year. Moving it out of premises and into expenses reduces profit: ' + money(p) + ' &minus; ' + money(y) + ' = ' + money(p - y) + '.');
    } },
    { skill: 'irrecoverable debts', gen: function () {
      var p = draft(), d = step(150, 1800, 10), n = pick(NAMES);
      return num(rev(p) + 'A credit customer who owes ' + money(d) + ' has been declared bankrupt and nothing will be received. The debt has not been written off. Calculate the revised profit. Give your answer in $.', p - d,
        'Writing off an irrecoverable debt is an expense: ' + money(p) + ' &minus; ' + money(d) + ' = ' + money(p - d) + '.');
    } },
    { skill: 'several adjustments', gen: function () {
      var p = draft(), x = step(100, 900, 10), g = step(100, 900, 10), c = step(4000, 20000, 500), r = pick([10, 20]), dep = c * r / 100, ans = p - x + g - dep;
      return num(rev(p) + 'These items were not recorded:<br>1 Wages owing at the year end, ' + money(x) + '.<br>2 Goods costing ' + money(g) + ' taken by the owner for own use.<br>3 Depreciation on equipment costing ' + money(c) + ' at ' + r + '% per year straight-line.<br>Calculate the revised profit. Give your answer in $.', ans,
        money(p) + ' &minus; ' + money(x) + ' (wages owing) + ' + money(g) + ' (goods for own use) &minus; ' + money(dep) + ' (depreciation) = ' + money(ans) + '.');
    } },
    { skill: 'several adjustments', gen: function () {
      var p = draft(), ra = step(200, 1200, 50), ip = step(100, 800, 10), tr = step(10000, 30000, 100), pr = pick([2, 4, 5]), prov = tr * pr / 100, g = step(100, 700, 10);
      var ans = p - ra + ip - prov + g;
      return numMcq(rev(p) + 'Not yet adjusted for: rent received in advance ' + money(ra) + '; insurance paid in advance ' + money(ip) + '; a new provision for irrecoverable debts of ' + pr + '% on trade receivables of ' + money(tr) + '; goods costing ' + money(g) + ' taken for own use. What is the revised profit?',
        ans, [p + ra - ip - prov + g, p - ra + ip - prov - g, p - ra + ip - tr + g, p + ra + ip - prov + g],
        money(p) + ' &minus; ' + money(ra) + ' + ' + money(ip) + ' &minus; ' + money(prov) + ' (' + pr + '% of ' + money(tr) + ') + ' + money(g) + ' = ' + money(ans) + '.');
    } },
    { skill: 'correcting errors', gen: function () {
      var p = draft(), s = step(300, 3000, 10);
      return num(rev(p) + 'An invoice for goods sold on credit for ' + money(s) + ' was left out of the sales day book. Calculate the revised profit. Give your answer in $.', p + s,
        'The sale was earned this year, so revenue rises by ' + money(s) + ': ' + money(p) + ' + ' + money(s) + ' = ' + money(p + s) + '.');
    } },
    { skill: 'correcting errors', gen: function () {
      var p = draft(), u = step(200, 2500, 10);
      return numMcq(rev(p) + 'It was then found that closing inventory had been undervalued by ' + money(u) + '. What is the revised profit?',
        p + u, [p - u, p + 2 * u, p - 2 * u],
        'Higher closing inventory means lower cost of sales, so gross profit and profit rise by ' + money(u) + ': ' + money(p + u) + '.');
    } },
    { skill: 'correcting errors', gen: function () {
      var p = draft(), d = step(40, 600, 5);
      return num(rev(p) + 'A payment to a supplier was recorded, but the discount received of ' + money(d) + ' on that payment was not recorded. Calculate the revised profit. Give your answer in $.', p + d,
        'Discount received is income, so recording it raises profit: ' + money(p) + ' + ' + money(d) + ' = ' + money(p + d) + '.');
    } },
    { skill: 'several adjustments', kind: 'multi', q: 'Which of these year-end adjustments would <b>increase</b> the draft profit?',
      options: ['Recording goods taken by the owner for own use', 'Reducing the provision for irrecoverable debts', 'Adjusting for insurance paid in advance', 'Recording rent received in advance', 'Recording wages owing at the year end', 'Charging depreciation that was left out'], answers: [0, 1, 2],
      why: 'Goods for own use reduce cost of sales, a smaller provision is a gain, and a prepayment reduces an expense, so all raise profit. Income in advance, wages owing and missed depreciation all reduce profit.' },
    { skill: 'income in advance', kind: 'mcq', q: 'When revising profit, how should rent received in advance be treated?',
      options: ['Deduct it, because it is income of next year', 'Add it, because the cash has been received', 'Add it, because it is a current asset', 'Ignore it, because the cash is in the bank'], answer: 0,
      why: 'Income belongs to the period it is earned in. Rent for next year was received early, so it is taken out of this year&rsquo;s profit and shown as a liability.' },
    { skill: 'correcting errors', gen: function () {
      var p = draft(), w = step(1000, 8000, 100), n = pick(NAMES);
      return num(rev(p) + n + ' transferred ' + money(w) + ' from the business bank account to a personal account and recorded it as wages. Calculate the revised profit after correcting this. Give your answer in $.', p + w,
        'Money taken by the owner is drawings, not an expense. Removing it from wages raises profit: ' + money(p) + ' + ' + money(w) + ' = ' + money(p + w) + '.');
    } },
    { skill: 'accrued expense', gen: function () {
      var p = draft(), m = step(300, 1500, 50), paid = rint(9, 11), owe = 12 - paid;
      return num(rev(p) + 'Shop rent is ' + money(m) + ' per month. Only ' + paid + ' months&rsquo; rent has been paid and recorded for the year. Calculate the revised profit. Give your answer in $.', p - owe * m,
        'Rent for ' + plural(owe, 'month') + ' is owing: ' + owe + ' &times; ' + money(m) + ' = ' + money(owe * m) + '. Revised profit = ' + money(p) + ' &minus; ' + money(owe * m) + ' = ' + money(p - owe * m) + '.');
    } },
    { skill: 'accrued expense', gen: function () {
      var p = draft(), l = step(2400, 24000, 2400), i = pick([5, 6, 8, 10]), m = rint(2, 9), ye = 11, start = ye - m + 1, int = l * i / 100 * m / 12;
      return numMcq('A trader&rsquo;s year ends on 31 December. ' + rev(p) + 'A bank loan of ' + money(l) + ' at ' + i + '% interest per year was taken out on 1 ' + MONTHS[start] + '. No interest has been paid or recorded. What is the revised profit?',
        p - int, [p - l * i / 100, p + int, p - l * i / 100 * (12 - m) / 12],
        'Interest for ' + m + ' months: ' + money(l) + ' &times; ' + i + '% &times; ' + m + '/12 = ' + money(int) + '. It is an expense owing: ' + money(p) + ' &minus; ' + money(int) + ' = ' + money(p - int) + '.');
    } }
  ] };

  /* ---------------------------------------------------------------- ACC-REC-14 */
  var ASSETS = [['Premises', 30000, 90000, 1000], ['Machinery', 6000, 25000, 500], ['Office equipment', 2000, 9000, 100], ['Motor vehicle', 6000, 20000, 500], ['Fixtures and fittings', 2000, 10000, 100], ['Inventory', 1500, 12000, 10], ['Trade receivables', 1000, 9000, 10]];
  var LIABS = [['Trade payables', 800, 7000, 10], ['Bank loan', 2000, 15000, 500], ['Other payables', 100, 900, 10]];
  function opening() {
    var a = shuffled(ASSETS).slice(0, 4).map(function (x) { return [x[0], step(x[1], x[2], x[3])]; });
    var l = shuffled(LIABS).slice(0, 2).map(function (x) { return [x[0], step(x[1], x[2], x[3])]; });
    if (Math.random() < 0.5) { a.push(['Cash at bank', step(500, 6000, 10)]); a.push(['Petty cash', step(50, 300, 10)]); }
    else { l.push(['Bank overdraft', step(300, 2500, 10)]); a.push(['Petty cash', step(50, 300, 10)]); }
    var ta = sum(a.map(function (x) { return x[1]; })), tl = sum(l.map(function (x) { return x[1]; }));
    if (ta - tl < 5000) return opening();
    return { a: a, l: l, ta: ta, tl: tl, eq: ta - tl, mixed: shuffled(a.concat(l)) };
  }

  B['ACC-REC-14'] = { title: 'Opening journal entries and other one-off journal entries', items: [
    { skill: 'equity figure', gen: function () {
      var o = opening(), n = pick(NAMES);
      return num(n + ' starts keeping full double-entry records on 1 January. The business&rsquo;s balances are:<br>' + list(o.mixed) + 'What amount is entered for equity in the opening journal entry? Give your answer in $.', o.eq,
        'Assets total ' + money(o.ta) + ' and liabilities (' + o.l.map(function (x) { return x[0].toLowerCase(); }).join(', ') + ') total ' + money(o.tl) + '. Equity = ' + money(o.ta) + ' &minus; ' + money(o.tl) + ' = ' + money(o.eq) + ', entered as a credit.');
    } },
    { skill: 'side of each line', gen: function () {
      var items = [['Bank overdraft', 0], ['Petty cash', 1], ['Trade receivables', 1], ['Bank loan', 0], ['Inventory', 1], ['Trade payables', 0], ['Cash at bank', 1], ['Other payables', 0], ['Office equipment', 1]];
      var it = pick(items), asset = it[1] === 1, amt = step(150, 9000, 10);
      var opts = ['Debit, as an asset', 'Credit, as a liability', 'Debit, as a liability', 'Credit, as an asset'];
      return { kind: 'mcq', q: 'A trader&rsquo;s opening journal entry has a line for <b>' + it[0].toLowerCase() + '</b>, ' + money(amt) + '. In which column does it go, and why?',
        options: opts, answer: asset ? 0 : 1,
        why: it[0] + (asset ? ' is something the business owns, so it is an asset and goes in the debit column.' : ' is an amount the business owes, so it is a liability and goes in the credit column.') + ' In an opening journal every asset is debited and every liability credited.' };
    } },
    { skill: 'spot the wrong line', gen: function () {
      var inv = step(2000, 9000, 10), tr = step(1000, 6000, 10), eqp = step(3000, 12000, 100), pc = step(50, 250, 10), tp = step(800, 5000, 10), od = step(300, 2000, 10);
      var eq = inv + tr + eqp + pc - tp - od;
      var wrong = pick(['od', 'tr', 'eq']);
      var rows = [
        ['Office equipment', fmt(eqp), ''], ['Inventory', fmt(inv), ''],
        wrong === 'tr' ? ['Trade receivables', '', fmt(tr)] : ['Trade receivables', fmt(tr), ''],
        ['Petty cash', fmt(pc), ''], ['Trade payables', '', fmt(tp)],
        wrong === 'od' ? ['Bank overdraft', fmt(od), ''] : ['Bank overdraft', '', fmt(od)],
        wrong === 'eq' ? ['Equity', fmt(eq), ''] : ['Equity', '', fmt(eq)]];
      var names = { od: 'Bank overdraft', tr: 'Trade receivables', eq: 'Equity' };
      var reason = { od: 'An overdraft is owed to the bank, so it is a liability and must be credited.', tr: 'Trade receivables are owed to the business, so they are an asset and must be debited.', eq: 'Equity is owed to the owner and is the balancing credit, so it must be in the credit column.' };
      return { kind: 'mcq', q: 'A student prepared this opening journal entry. One line is in the wrong column. Which one?<br>' + tbl(['Account', 'Debit $', 'Credit $'], rows),
        options: ['Bank overdraft', 'Trade receivables', 'Equity', 'Petty cash', 'Trade payables'], answer: ['Bank overdraft', 'Trade receivables', 'Equity'].indexOf(names[wrong]),
        why: reason[wrong] + ' Once corrected, debits = credits = ' + money(inv + tr + eqp + pc) + '.' };
    } },
    { skill: 'journal totals', gen: function () {
      var o = opening(), n = pick(NAMES);
      return num(n + '&rsquo;s balances on 1 August are listed below.<br>' + list(o.mixed) + 'What is the total of the <b>debit</b> column of the opening journal entry? Give your answer in $.', o.ta,
        'The debit column holds every asset: ' + o.a.map(function (x) { return money(x[1]); }).join(' + ') + ' = ' + money(o.ta) + '. It equals the credit total of liabilities plus equity.');
    } },
    { skill: 'one-off journals', kind: 'mcq', q: 'Zawadi buys a computer for her office on credit from Summit Office Systems. In the journal entry, which account is <b>credited</b>?',
      options: ['Summit Office Systems', 'Purchases', 'Bank', 'Office equipment'], answer: 0,
      why: 'The computer is a non-current asset, so Office equipment is debited. No money has been paid yet, so the supplier&rsquo;s account is credited because the business now owes Summit Office Systems.' },
    { skill: 'one-off journals', gen: function () {
      var v = step(3000, 15000, 500), n = pick(NAMES);
      return { kind: 'mcq', q: n + ' transfers a private car valued at ' + money(v) + ' into the business as a delivery vehicle. Which journal entry records this?',
        options: ['Dr Motor vehicle ' + money(v) + '; Cr Equity ' + money(v), 'Dr Motor vehicle ' + money(v) + '; Cr Bank ' + money(v), 'Dr Equity ' + money(v) + '; Cr Motor vehicle ' + money(v), 'Dr Purchases ' + money(v) + '; Cr Equity ' + money(v)], answer: 0,
        why: 'The business gains an asset, so Motor vehicle is debited. The owner has put more into the business, so equity rises: credit Equity. No business money was paid, so Bank is not used.' };
    } },
    { skill: 'narratives', kind: 'mcq', q: 'Which narrative best fits an opening journal entry?',
      options: ['Being assets, liabilities and equity at the start of trading', 'Being goods bought on credit from suppliers during the month', 'Being the correction of an error found in the nominal ledger', 'Being cash paid into the bank by the owner from savings'], answer: 0,
      why: 'An opening journal lists every asset, liability and the resulting equity at a date, and the narrative should say exactly that.' },
    { skill: 'side of each line', kind: 'multi', q: 'In an opening journal entry, which of these lines are entered in the <b>credit</b> column?',
      options: ['Bank overdraft', 'Equity', 'Bank loan', 'Petty cash', 'Inventory', 'Trade receivables'], answers: [0, 1, 2],
      why: 'Liabilities (overdraft, bank loan) and equity are credits. Petty cash, inventory and trade receivables are assets, so they are debits.' },
    { skill: 'equity figure', gen: function () {
      var prem = step(20000, 60000, 1000), inv = step(2000, 9000, 10), pc = step(50, 300, 10), tp = step(1000, 6000, 10), od = step(400, 3000, 10);
      var a = prem + inv + pc, ok = a - tp - od, n = pick(NAMES);
      return numMcq(n + '&rsquo;s business has premises ' + money(prem) + ', inventory ' + money(inv) + ', petty cash ' + money(pc) + ', trade payables ' + money(tp) + ' and a bank overdraft of ' + money(od) + '. What figure is credited to equity in the opening journal?',
        ok, [a + od - tp, ok - pc, a - tp],
        'Assets ' + money(a) + ' (premises, inventory and petty cash) &minus; liabilities ' + money(tp + od) + ' (trade payables and overdraft) = ' + money(ok) + '.');
    } },
    { skill: 'one-off journals', gen: function () {
      var f = step(3000, 12000, 100), d = step(500, Math.floor(f / 2), 100), s = pick(SUPPLIERS);
      return num('Shop fittings costing ' + money(f) + ' are bought from ' + s + '. A deposit of ' + money(d) + ' is paid by bank transfer and the rest is owed on credit. In the journal, how much is credited to ' + s + '? Give your answer in $.', f - d,
        'Fixtures and fittings is debited ' + money(f) + '. The credits are Bank ' + money(d) + ' and ' + s + ' ' + money(f) + ' &minus; ' + money(d) + ' = ' + money(f - d) + ', so debits equal credits.');
    } },
    { skill: 'one-off journals', kind: 'mcq', q: 'Ahmed uses $650 from his private savings to pay a supplier, Corvo Traders, money owed by his business. Which journal entry records this in the business books?',
      options: ['Dr Corvo Traders; Cr Equity', 'Dr Equity; Cr Corvo Traders', 'Dr Corvo Traders; Cr Bank', 'Dr Purchases; Cr Equity'], answer: 0,
      why: 'The business owes the supplier less, so Corvo Traders is debited. The owner paid with his own money, which is extra capital: credit Equity. The business bank account was not used.' },
    { skill: 'one-off journals', gen: function () {
      var c = step(400, 2500, 50), n = pick(NAMES);
      return { kind: 'mcq', q: n + ' takes home, for permanent private use, a business printer that was bought for ' + money(c) + ' earlier this month and has not been depreciated. Which journal entry records this?',
        options: ['Dr Drawings; Cr Office equipment', 'Dr Office equipment; Cr Drawings', 'Dr Drawings; Cr Purchases', 'Dr Office expenses; Cr Equity'], answer: 0,
        why: 'The owner has taken a business asset for private use, so Drawings is debited ' + money(c) + '. The business no longer has the printer, so Office equipment is credited.' };
    } },
    { skill: 'equity figure', kind: 'mcq', q: 'Why is equity entered in the credit column of an opening journal entry?',
      options: ['It is owed by the business to the owner, like a liability', 'It is an asset that the owner has given to the business', 'It is the balancing figure, so either column is acceptable', 'It is the cash the owner has paid into the business bank'], answer: 0,
      why: 'The business entity owes its equity to the owner. Like liabilities it is a credit, and it is the figure that makes the credit total equal the debit total.' },
    { skill: 'journal totals', kind: 'mcq', q: 'Which statement about every journal entry is correct?',
      options: ['Its debit total must equal its credit total', 'It lists assets only, never liabilities', 'It records all of the year&rsquo;s credit sales', 'Its credit total is always equity alone'], answer: 0,
      why: 'Every journal entry follows double entry, so total debits always equal total credits. Credit sales go in the sales day book, not the journal.' },
    { skill: 'equity figure', gen: function () {
      var eq = step(15000, 40000, 10), mc = step(6000, 18000, 500), tr = step(1000, 6000, 10), bk = step(500, 5000, 10), tp = step(1000, 6000, 10), ln = step(2000, 8000, 500);
      var inv = eq + tp + ln - mc - tr - bk;
      if (inv < 1500) { eq += 1500 - inv + step(500, 3000, 10); inv = eq + tp + ln - mc - tr - bk; }
      return num('An opening journal entry records machinery ' + money(mc) + ', trade receivables ' + money(tr) + ', cash at bank ' + money(bk) + ', inventory, trade payables ' + money(tp) + ', a bank loan of ' + money(ln) + ' and equity of ' + money(eq) + '. The inventory figure is missing. Calculate it. Give your answer in $.', inv,
        'Credits = ' + money(tp) + ' + ' + money(ln) + ' + ' + money(eq) + ' = ' + money(tp + ln + eq) + '. Debits must match, so inventory = ' + money(tp + ln + eq) + ' &minus; ' + money(mc + tr + bk) + ' = ' + money(inv) + '.');
    } },
    { skill: 'one-off journals', kind: 'mcq', q: 'Ruth pays the business&rsquo;s shop insurance of $1,200 from her private bank account. Which journal entry records this in the business books?',
      options: ['Dr Insurance $1,200; Cr Equity $1,200', 'Dr Equity $1,200; Cr Insurance $1,200', 'Dr Insurance $1,200; Cr Bank $1,200', 'Dr Drawings $1,200; Cr Insurance $1,200'], answer: 0,
      why: 'The business has incurred an insurance expense, so Insurance is debited. The owner paid it with private money, which is capital introduced: credit Equity.' },
    { skill: 'equity figure', gen: function () {
      var b = step(2000, 15000, 100), c = step(500, 2500, 50), inv = step(800, 5000, 10), n = pick(NAMES);
      return num('On 1 June ' + n + ' starts a business by paying ' + money(b) + ' of savings into a business bank account, bringing in a personal laptop worth ' + money(c) + ' and stock worth ' + money(inv) + '. There are no liabilities. What amount is credited to equity in the opening journal? Give your answer in $.', b + c + inv,
        'Everything the owner brings in becomes equity: ' + money(b) + ' + ' + money(c) + ' + ' + money(inv) + ' = ' + money(b + c + inv) + '. Bank, office equipment and inventory are each debited.');
    } },
    { skill: 'equity figure', kind: 'mcq', q: 'An opening journal shows assets of $52,000 and liabilities of $9,500, and the trader enters equity as a <b>debit</b> of $42,500. What is wrong?',
      options: ['Equity should be a credit, so the totals do not agree', 'Equity should be $61,500 entered as a debit', 'Equity should be $9,500 entered as a credit', 'Nothing is wrong, because equity is an asset'], answer: 0,
      why: 'Equity is $52,000 &minus; $9,500 = $42,500, but it is a credit. With it as a credit, credits are $9,500 + $42,500 = $52,000, matching the debits.' },
    { skill: 'one-off journals', gen: function () {
      var m = step(2000, 15000, 100), s = pick(SUPPLIERS);
      return { kind: 'mcq', q: 'A business buys a packing machine for ' + money(m) + ' on credit from ' + s + '. Which journal entry is correct?',
        options: ['Dr Machinery; Cr ' + s, 'Dr Purchases; Cr ' + s, 'Dr ' + s + '; Cr Machinery', 'Dr Machinery; Cr Bank'], answer: 0,
        why: 'A machine for use in the business is a non-current asset, so Machinery (not Purchases) is debited ' + money(m) + '. The business owes ' + s + ', so that account is credited.' };
    } },
    { skill: 'equity figure', kind: 'mcq', q: 'How is the equity figure in an opening journal entry worked out and entered?',
      options: ['Assets minus liabilities, entered as a credit', 'Assets plus liabilities, entered as a credit', 'Assets minus liabilities, entered as a debit', 'Cash paid in by the owner, entered as a debit'], answer: 0,
      why: 'Equity = assets &minus; liabilities. It is the balancing figure on the credit side, so total debits equal total credits.' },
    { skill: 'journal totals', gen: function () {
      var ta = step(30000, 90000, 10), tp = step(1500, 8000, 10), ln = step(3000, 15000, 500), od = step(200, 2000, 10);
      var eq = ta - tp - ln - od;
      return numMcq('The debit column of an opening journal entry totals ' + money(ta) + '. The liabilities are trade payables ' + money(tp) + ', a bank loan of ' + money(ln) + ' and a bank overdraft of ' + money(od) + '. What is the equity figure?',
        eq, [ta - tp - ln + od, ta - tp - ln, ta + tp + ln + od],
        'The debit total is total assets. Equity = ' + money(ta) + ' &minus; (' + money(tp) + ' + ' + money(ln) + ' + ' + money(od) + ') = ' + money(eq) + '.');
    } },
    { skill: 'side of each line', kind: 'mcq', q: 'Which set of lines is correct for an opening journal entry?',
      options: ['Dr Inventory; Dr Petty cash; Cr Bank loan; Cr Equity', 'Dr Inventory; Cr Petty cash; Cr Bank loan; Dr Equity', 'Dr Inventory; Dr Petty cash; Dr Bank loan; Cr Equity', 'Cr Inventory; Dr Petty cash; Cr Bank loan; Cr Equity'], answer: 0,
      why: 'Inventory and petty cash are assets (debit). A bank loan is a liability and equity is owed to the owner, so both are credits.' },
    { skill: 'narratives', kind: 'mcq', q: 'A business buys a delivery van on credit from Hillcrest Motors and the question asks for a narrative. Which narrative fits?',
      options: ['Being purchase of a delivery van on credit', 'Being goods for resale bought on credit', 'Being assets and liabilities at this date', 'Being payment to Hillcrest Motors by bank'], answer: 0,
      why: 'The narrative describes the transaction: a non-current asset bought on credit. It is not inventory for resale, an opening entry or a payment.' }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-06 */
  var PAIRS = [['Kofi', 'Ama'], ['Rhea', 'Dev'], ['Lucas', 'Elif'], ['Zainab', 'Idris'], ['Marta', 'Pavel'], ['Aisha', 'Ben'], ['Chloe', 'Rohan'], ['Femi', 'Lin']];

  B['ACC-PIR-06'] = { title: 'Partnership statement of financial position', items: [
    { skill: 'equity section', gen: function () {
      var p = pick(PAIRS), c1 = step(20000, 60000, 1000), c2 = step(15000, 50000, 1000), a1 = step(800, 9000, 10), d2 = step(200, 2500, 10), tot = c1 + c2 + a1 - d2;
      return num(p[0] + ' and ' + p[1] + ' are in partnership. At the year end: capital accounts ' + p[0] + ' ' + money(c1) + ', ' + p[1] + ' ' + money(c2) + '; current accounts ' + p[0] + ' ' + money(a1) + ' credit, ' + p[1] + ' ' + money(d2) + ' debit. Calculate total equity for the statement of financial position. Give your answer in $.', tot,
        'A debit current account balance is deducted. Total equity = ' + money(c1) + ' + ' + money(c2) + ' + ' + money(a1) + ' &minus; ' + money(d2) + ' = ' + money(tot) + '.');
    } },
    { skill: 'equity section', gen: function () {
      var p = pick(PAIRS), c2 = step(15000, 50000, 1000), d2 = step(300, 3000, 10);
      return numMcq('In the equity section of ' + p[0] + ' and ' + p[1] + '&rsquo;s statement of financial position, ' + p[1] + '&rsquo;s capital account is ' + money(c2) + ' and current account has a <b>debit</b> balance of ' + money(d2) + '. What total is shown in ' + p[1] + '&rsquo;s column?',
        c2 - d2, [c2 + d2, c2, d2],
        'A debit balance on a current account means the partner has drawn more than they were credited, so it is deducted: ' + money(c2) + ' &minus; ' + money(d2) + ' = ' + money(c2 - d2) + '.');
    } },
    { skill: 'equity section', gen: function () {
      var p = pick(PAIRS), c0 = step(20000, 60000, 1000), c1 = step(20000, 60000, 1000), a0 = step(500, 6000, 10), a1 = step(500, 6000, 10), ln = step(5000, 20000, 1000), yr = pick([2029, 2030, 2031]);
      var col = c1 + a1, tot = c0 + a0 + c1 + a1;
      return numMcq(p[0] + ' and ' + p[1] + ' are in partnership. At the year end their capital accounts are ' + p[0] + ' ' + money(c0) + ' and ' + p[1] + ' ' + money(c1) + ', and both current accounts have credit balances: ' + p[0] + ' ' + money(a0) + ', ' + p[1] + ' ' + money(a1) + '. ' + p[1] + ' has also lent the partnership ' + money(ln) + ', repayable in ' + yr + '. What total is shown in ' + p[1] + '&rsquo;s column of the equity section?',
        col, [col + ln, c1, tot, c1 - a1],
        p[1] + '&rsquo;s equity is capital plus the credit current account: ' + money(c1) + ' + ' + money(a1) + ' = ' + money(col) + '. The loan is owed to ' + p[1] + ' as a lender, so it is a non-current liability, not equity.');
    } },
    { skill: 'assets', gen: function () {
      var p = pick(PAIRS), land = step(40000, 120000, 5000), ec = step(10000, 30000, 1000), ea = step(2000, 9000, 500), vc = step(12000, 30000, 1000), va = step(3000, 10000, 500), tot = land + ec - ea + vc - va;
      return num(p[0] + ' and ' + p[1] + '&rsquo;s non-current assets at the year end:<br>' + tbl(['Asset', 'Cost or valuation $', 'Accumulated depreciation $'], [['Land (valuation)', fmt(land), '&ndash;'], ['Equipment', fmt(ec), fmt(ea)], ['Motor vehicles', fmt(vc), fmt(va)]]) + 'What is the total of non-current assets in the statement of financial position? Give your answer in $.', tot,
        'Each asset is shown at carrying amount: ' + money(land) + ' + (' + money(ec) + ' &minus; ' + money(ea) + ') + (' + money(vc) + ' &minus; ' + money(va) + ') = ' + money(tot) + '.');
    } },
    { skill: 'assets', gen: function () {
      var tr = step(8000, 40000, 100), r = pick([2, 3, 4, 5]), pr = tr * r / 100;
      return num('A partnership&rsquo;s trade receivables are ' + money(tr) + ' and the provision for irrecoverable debts is ' + r + '% of trade receivables. What net figure for trade receivables is included in current assets? Give your answer in $.', tr - pr,
        'Provision = ' + r + '% &times; ' + money(tr) + ' = ' + money(pr) + '. Net trade receivables = ' + money(tr) + ' &minus; ' + money(pr) + ' = ' + money(tr - pr) + '.');
    } },
    { skill: 'assets', gen: function () {
      var inv = step(6000, 30000, 10), tr = step(8000, 30000, 100), pr = tr * pick([2, 4, 5]) / 100, orc = step(100, 900, 10), bk = step(500, 8000, 10), tot = inv + tr - pr + orc + bk;
      return num('From a partnership&rsquo;s records at the year end: inventory ' + money(inv) + ', trade receivables ' + money(tr) + ', provision for irrecoverable debts ' + money(pr) + ', insurance prepaid ' + money(orc) + ', cash at bank ' + money(bk) + '. Calculate total current assets. Give your answer in $.', tot,
        'Net receivables = ' + money(tr - pr) + '. Current assets = ' + money(inv) + ' + ' + money(tr - pr) + ' + ' + money(orc) + ' + ' + money(bk) + ' = ' + money(tot) + '. Insurance prepaid is an other receivable.');
    } },
    { skill: 'liabilities', kind: 'mcq', q: 'Rhea lent her partnership $20,000, repayable in 2031. Where is the loan shown in the partnership&rsquo;s statement of financial position at 31 December 2025?',
      options: ['Non-current liabilities', 'Current liabilities', 'Equity, beside Rhea&rsquo;s capital', 'Current assets'], answer: 0,
      why: 'A partner&rsquo;s loan is a liability of the business, not capital. It is repayable more than 12 months after the year end, so it is non-current.' },
    { skill: 'liabilities', kind: 'mcq', q: 'A partner&rsquo;s loan of $6,000 to the partnership is repayable eight months after the year end. Where is it shown?',
      options: ['Current liabilities', 'Non-current liabilities', 'Equity, in the partner&rsquo;s current account', 'Non-current assets'], answer: 0,
      why: 'A loan is a liability. As it must be repaid within 12 months of the year end, it is a current liability.' },
    { skill: 'equity section', kind: 'multi', q: 'Which of these appear in the <b>equity</b> section of a partnership statement of financial position?',
      options: ['Each partner&rsquo;s capital account balance', 'Each partner&rsquo;s current account balance', 'A loan from a partner, repayable in 2030', 'Bank overdraft', 'Trade payables'], answers: [0, 1],
      why: 'Equity holds the partners&rsquo; capital and current account balances. A partner&rsquo;s loan, an overdraft and trade payables are all liabilities.' },
    { skill: 'totals', gen: function () {
      var eq = step(50000, 140000, 10), ln = step(5000, 25000, 1000), tp = step(4000, 20000, 10), op = step(100, 1200, 10), od = step(300, 3000, 10), tot = eq + ln + tp + op + od;
      return num('A partnership&rsquo;s total equity is ' + money(eq) + '. It also has a partner&rsquo;s loan repayable in 2030 of ' + money(ln) + ', trade payables ' + money(tp) + ', wages owing ' + money(op) + ' and a bank overdraft of ' + money(od) + '. Calculate total equity and liabilities. Give your answer in $.', tot,
        'Liabilities = ' + money(ln) + ' + ' + money(tp) + ' + ' + money(op) + ' + ' + money(od) + ' = ' + money(tot - eq) + '. Total equity and liabilities = ' + money(eq) + ' + ' + money(tot - eq) + ' = ' + money(tot) + '.');
    } },
    { skill: 'equity section', kind: 'mcq', q: 'How should a partner&rsquo;s debit current account balance be shown in the statement of financial position?',
      options: ['Deducted in that partner&rsquo;s equity column', 'Added in that partner&rsquo;s equity column', 'As a current liability of the partnership', 'As a non-current liability of the partnership'], answer: 0,
      why: 'A debit balance means the partner has taken out more than they were credited, which reduces their equity. It is deducted from their capital in the equity section.' },
    { skill: 'totals', gen: function () {
      var nca = step(40000, 150000, 100), inv = step(5000, 25000, 10), trn = step(5000, 25000, 10), bk = step(300, 6000, 10), pc = step(50, 250, 10), tot = nca + inv + trn + bk + pc;
      return num('A partnership has non-current assets at carrying amount of ' + money(nca) + ', inventory ' + money(inv) + ', trade receivables (net of provision) ' + money(trn) + ', cash at bank ' + money(bk) + ' and petty cash ' + money(pc) + '. Calculate total assets. Give your answer in $.', tot,
        'Current assets = ' + money(inv + trn + bk + pc) + '. Total assets = ' + money(nca) + ' + ' + money(inv + trn + bk + pc) + ' = ' + money(tot) + '.');
    } },
    { skill: 'liabilities', gen: function () {
      var tp = step(4000, 20000, 10), op = step(100, 900, 10), od = step(300, 3000, 10), ln = step(2000, 10000, 500), lnl = step(5000, 20000, 1000), tot = tp + op + od + ln;
      return numMcq('A partnership&rsquo;s liabilities are: trade payables ' + money(tp) + '; electricity owing ' + money(op) + '; bank overdraft ' + money(od) + '; a loan from one partner of ' + money(ln) + ' repayable in six months; a bank loan of ' + money(lnl) + ' repayable in 2032. What is the total of current liabilities?',
        tot, [tot - ln, tot + lnl, tot - od],
        'Current liabilities are due within 12 months: ' + money(tp) + ' + ' + money(op) + ' + ' + money(od) + ' + ' + money(ln) + ' = ' + money(tot) + '. The bank loan due in 2032 is non-current.');
    } },
    { skill: 'totals', gen: function () {
      var p = pick(PAIRS), c1 = step(30000, 60000, 1000), c2 = step(20000, 50000, 1000), a1 = step(1000, 8000, 10), a2 = step(1000, 8000, 10), tl = step(10000, 40000, 10), ta = c1 + c2 + a1 + a2 + tl;
      return num(p[0] + ' and ' + p[1] + '&rsquo;s statement of financial position shows total assets ' + money(ta) + ' and total liabilities ' + money(tl) + '. Capital accounts: ' + p[0] + ' ' + money(c1) + ', ' + p[1] + ' ' + money(c2) + '. ' + p[0] + '&rsquo;s current account is ' + money(a1) + ' credit. Calculate ' + p[1] + '&rsquo;s current account balance. Give your answer in $.', a2,
        'Total equity = ' + money(ta) + ' &minus; ' + money(tl) + ' = ' + money(ta - tl) + '. ' + p[1] + '&rsquo;s current account = ' + money(ta - tl) + ' &minus; ' + money(c1) + ' &minus; ' + money(c2) + ' &minus; ' + money(a1) + ' = ' + money(a2) + ' credit.');
    } },
    { skill: 'equity section', kind: 'mcq', q: 'Why is the equity section of a partnership statement of financial position set out in a separate column for each partner?',
      options: ['So each partner&rsquo;s share of the equity can be seen', 'Because every partner must invest equal capital', 'Because the law requires the balances to be netted', 'So the drawings can be shown as a liability'], answer: 0,
      why: 'Each partner has their own capital and current account. Separate columns show how much of the total equity belongs to each partner.' },
    { skill: 'equity section', kind: 'mcq', q: 'Where do partners&rsquo; drawings for the year appear in a partnership statement of financial position?',
      options: ['Only within the current account balances', 'As a separate current liability', 'As a deduction from the non-current assets total', 'As a separate line in current assets'], answer: 0,
      why: 'Drawings are debited to each partner&rsquo;s current account during the year. The statement shows the closing current account balance, which already reflects them.' },
    { skill: 'liabilities', kind: 'mcq', q: 'A draft statement of financial position for Femi and Lin lists: <i>Non-current assets:</i> premises. <i>Current assets:</i> inventory, bank overdraft. <i>Non-current liabilities:</i> loan from Lin, repayable 2029. <i>Current liabilities:</i> trade payables. Which item is in the wrong section?',
      options: ['Bank overdraft', 'Loan from Lin', 'Trade payables', 'Premises'], answer: 0,
      why: 'A bank overdraft is owed to the bank and is repayable on demand, so it is a current liability, not a current asset. The other items are correctly placed.' },
    { skill: 'current account balance', gen: function () {
      var p = pick(PAIRS), ob = step(200, 2000, 10), sh = step(6000, 15000, 100), over = step(300, 3000, 10), dr = ob + sh + over;
      return { kind: 'mcq', q: p[1] + '&rsquo;s current account opened with a credit balance of ' + money(ob) + '. ' + p[1] + ' was credited with a share of profit of ' + money(sh) + ' and took drawings of ' + money(dr) + '. What closing balance is shown in the equity section?',
        options: ['Debit ' + money(over) + ', deducted', 'Credit ' + money(over) + ', added', 'Credit ' + money(ob + sh) + ', added', 'Debit ' + money(dr - ob) + ', deducted'], answer: 0,
        why: money(ob) + ' + ' + money(sh) + ' &minus; ' + money(dr) + ' = &minus;' + money(over) + '. Drawings exceeded the credits, so the account has a debit balance of ' + money(over) + ', deducted in equity.' };
    } },
    { skill: 'equity section', gen: function () {
      var p = pick(PAIRS), ratio = pick([[1, 1], [2, 1], [3, 2], [3, 1]]), parts = ratio[0] + ratio[1], res = step(12000, 48000, 100 * parts), s1 = res * ratio[0] / parts, s2 = res * ratio[1] / parts;
      var c1 = step(20000, 50000, 1000), c2 = step(15000, 40000, 1000), o1 = step(500, 3000, 10), o2 = step(500, 3000, 10), d1 = step(2000, s1 + o1 - 100, 10), d2 = step(2000, s2 + o2 - 100, 10);
      if (d1 > s1 + o1 - 100) d1 = s1 + o1 - 100; if (d2 > s2 + o2 - 100) d2 = s2 + o2 - 100;
      var a1 = o1 + s1 - d1, a2 = o2 + s2 - d2, tot = c1 + c2 + a1 + a2;
      return num(p[0] + ' and ' + p[1] + ' share profits ' + ratio[0] + ':' + ratio[1] + '. Profit for the year was ' + money(res) + ' (no salaries or interest). Opening current account credit balances: ' + p[0] + ' ' + money(o1) + ', ' + p[1] + ' ' + money(o2) + '. Drawings: ' + p[0] + ' ' + money(d1) + ', ' + p[1] + ' ' + money(d2) + '. Capitals: ' + p[0] + ' ' + money(c1) + ', ' + p[1] + ' ' + money(c2) + '. Calculate total equity. Give your answer in $.', tot,
        'Shares: ' + money(s1) + ' and ' + money(s2) + '. Current accounts: ' + money(o1) + ' + ' + money(s1) + ' &minus; ' + money(d1) + ' = ' + money(a1) + '; ' + money(o2) + ' + ' + money(s2) + ' &minus; ' + money(d2) + ' = ' + money(a2) + '. Total equity = ' + money(c1 + c2) + ' + ' + money(a1 + a2) + ' = ' + money(tot) + '.');
    } },
    { skill: 'liabilities', kind: 'mcq', q: 'Under which heading is a bank overdraft shown in a partnership&rsquo;s statement of financial position?',
      options: ['Current liabilities', 'Current assets', 'Non-current liabilities', 'Equity'], answer: 0,
      why: 'An overdraft is money owed to the bank and can be called in at any time, so it is a current liability.' },
    { skill: 'assets', gen: function () {
      var c = step(8000, 30000, 500), ad = step(1500, Math.floor(c * 0.6), 500), p = pick(PAIRS);
      return numMcq(p[0] + ' and ' + p[1] + '&rsquo;s fixtures and fittings cost ' + money(c) + ' and have accumulated depreciation of ' + money(ad) + ' at the year end. What figure is shown for fixtures and fittings under non-current assets?',
        c - ad, [c, c + ad, ad],
        'Non-current assets are shown at carrying amount: cost ' + money(c) + ' &minus; accumulated depreciation ' + money(ad) + ' = ' + money(c - ad) + '.');
    } },
    { skill: 'assets', kind: 'mcq', q: 'Which of these is a current asset in a partnership&rsquo;s statement of financial position?',
      options: ['Rent paid in advance', 'Wages owing at the year end', 'A loan from a partner', 'Bank overdraft'], answer: 0,
      why: 'Rent paid in advance is an other receivable: the business has paid for something it will receive next year. The other three are liabilities.' },
    { skill: 'liabilities', kind: 'multi', q: 'Which of these are <b>non-current</b> liabilities of a partnership whose year ends on 31 March 2026?',
      options: ['Loan from a partner, repayable in four years', 'Bank loan, repayable in 2032', 'Bank overdraft', 'Trade payables', 'Partner&rsquo;s loan, repayable in six months'], answers: [0, 1],
      why: 'Non-current liabilities are due more than 12 months after the year end. The overdraft, trade payables and the loan due in six months are current liabilities.' }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-08 */
  B['ACC-PIR-08'] = { title: 'Finding missing sales, purchases and balances', items: [
    { skill: 'credit sales', gen: function () {
      var o = step(4000, 20000, 10), c = step(4000, 20000, 10), rc = step(40000, 150000, 10), cs = rc + c - o, n = pick(NAMES);
      return num(n + '&rsquo;s trade receivables were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. The bank summary shows ' + money(rc) + ' received from credit customers. There were no discounts or returns. Calculate credit sales for the year. Give your answer in $.', cs,
        'Credit sales = receipts + closing receivables &minus; opening receivables = ' + money(rc) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cs) + '.');
    } },
    { skill: 'credit sales', gen: function () {
      var o = step(5000, 20000, 10), c = step(5000, 20000, 10), rc = step(50000, 150000, 10), da = step(300, 2500, 10), sr = step(200, 1500, 10), cs = rc + da + sr + c - o, n = pick(NAMES);
      return numMcq(n + '&rsquo;s figures for the year: opening trade receivables ' + money(o) + ', closing trade receivables ' + money(c) + ', receipts from credit customers ' + money(rc) + ', discounts allowed ' + money(da) + ', sales returns ' + money(sr) + '. What were credit sales?',
        cs, [rc + c - o, rc - da - sr + c - o, rc + da + sr + c + o],
        'Everything that reduced receivables must be added back: ' + money(rc) + ' + ' + money(da) + ' + ' + money(sr) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cs) + '.');
    } },
    { skill: 'credit sales', gen: function () {
      var o = step(5000, 20000, 10), c = step(5000, 20000, 10), rc = step(50000, 140000, 10), ib = step(200, 1500, 10), da = step(200, 1800, 10), cs = rc + ib + da + c - o, s = pick(SHOPS);
      return num(s + ': trade receivables at start ' + money(o) + ', at end ' + money(c) + '. Received from customers ' + money(rc) + '. Discounts allowed ' + money(da) + '. Irrecoverable debts written off ' + money(ib) + '. Calculate credit sales for the year. Give your answer in $.', cs,
        'Credit sales = ' + money(rc) + ' + ' + money(da) + ' + ' + money(ib) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cs) + '. The written-off debt was a credit sale that was never paid.');
    } },
    { skill: 'credit purchases', gen: function () {
      var o = step(3000, 15000, 10), c = step(3000, 15000, 10), pm = step(30000, 120000, 10), cp = pm + c - o, n = pick(NAMES);
      return num(n + ' owed credit suppliers ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. Payments to credit suppliers were ' + money(pm) + '. There were no discounts or returns. Calculate credit purchases for the year. Give your answer in $.', cp,
        'Credit purchases = payments + closing payables &minus; opening payables = ' + money(pm) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cp) + '.');
    } },
    { skill: 'credit purchases', gen: function () {
      var o = step(3000, 15000, 10), c = step(3000, 15000, 10), pm = step(30000, 110000, 10), dr = step(200, 1800, 10), pr = step(150, 1200, 10), cp = pm + dr + pr + c - o, s = pick(SHOPS);
      return numMcq(s + ': opening trade payables ' + money(o) + ', closing trade payables ' + money(c) + ', paid to suppliers ' + money(pm) + ', discounts received ' + money(dr) + ', purchases returns ' + money(pr) + '. What were credit purchases?',
        cp, [pm + c - o, pm - dr - pr + c - o, pm + dr + pr + o - c],
        'Payments, discounts received and returns all reduced payables, so all are added: ' + money(pm) + ' + ' + money(dr) + ' + ' + money(pr) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cp) + '.');
    } },
    { skill: 'total sales and purchases', gen: function () {
      var o = step(4000, 18000, 10), c = step(4000, 18000, 10), rc = step(40000, 120000, 10), cash = step(5000, 30000, 10), cs = rc + c - o, n = pick(NAMES);
      return num(n + ' sells for cash and on credit. Cash sales were ' + money(cash) + '. Receipts from credit customers were ' + money(rc) + '; trade receivables were ' + money(o) + ' at the start and ' + money(c) + ' at the end. Calculate total sales. Give your answer in $.', cs + cash,
        'Credit sales = ' + money(rc) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cs) + '. Total sales = ' + money(cs) + ' + ' + money(cash) + ' = ' + money(cs + cash) + '.');
    } },
    { skill: 'total sales and purchases', gen: function () {
      var o = step(3000, 12000, 10), c = step(3000, 12000, 10), pm = step(25000, 90000, 10), cash = step(1000, 8000, 10), cp = pm + c - o, s = pick(SHOPS);
      return num(s + ' paid credit suppliers ' + money(pm) + ' and made cash purchases of ' + money(cash) + '. Trade payables were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. Calculate total purchases. Give your answer in $.', cp + cash,
        'Credit purchases = ' + money(pm) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cp) + '. Total purchases = ' + money(cp) + ' + ' + money(cash) + ' = ' + money(cp + cash) + '.');
    } },
    { skill: 'missing balance', gen: function () {
      var o = step(5000, 18000, 10), cs = step(60000, 150000, 10), da = step(300, 2000, 10), c = step(4000, 18000, 10), rc = o + cs - da - c, n = pick(NAMES);
      return num(n + '&rsquo;s opening trade receivables were ' + money(o) + '. Credit sales were ' + money(cs) + ', receipts from customers ' + money(rc) + ' and discounts allowed ' + money(da) + '. Calculate the closing trade receivables. Give your answer in $.', c,
        'Closing receivables = ' + money(o) + ' + ' + money(cs) + ' &minus; ' + money(rc) + ' &minus; ' + money(da) + ' = ' + money(c) + '.');
    } },
    { skill: 'missing balance', gen: function () {
      var c = step(3000, 14000, 10), cp = step(30000, 100000, 10), o = step(3000, 14000, 10), pm = o + cp - c, s = pick(SHOPS);
      return num(s + '&rsquo;s credit purchases for the year were ' + money(cp) + ' and payments to suppliers were ' + money(pm) + '. Trade payables at the end of the year were ' + money(c) + '. Calculate trade payables at the start of the year. Give your answer in $.', o,
        'Opening payables + purchases &minus; payments = closing payables, so opening = ' + money(c) + ' + ' + money(pm) + ' &minus; ' + money(cp) + ' = ' + money(o) + '.');
    } },
    { skill: 'mark-up and margin', gen: function () {
      var m = pick([20, 25, 40, 50]), cos = step(20000, 90000, 100), s = cos * (100 + m) / 100, n = pick(NAMES);
      return num(n + '&rsquo;s cost of sales for the year was ' + money(cos) + '. All goods are sold at a mark-up of ' + m + '% on cost. Calculate sales for the year. Give your answer in $.', s,
        'Mark-up is a percentage of cost: ' + money(cos) + ' &times; ' + (100 + m) + '% = ' + money(s) + '.');
    } },
    { skill: 'mark-up and margin', gen: function () {
      var m = pick([20, 25, 40, 50]), s = step(30000, 120000, 100), cos = s * (100 - m) / 100, n = pick(NAMES);
      return numMcq(n + '&rsquo;s cost of sales was ' + money(cos) + '. The business earns a gross profit margin of ' + m + '% on sales. What were sales for the year?',
        s, [Math.round(cos * (100 + m) / 100)],
        'Margin is a percentage of sales, so cost of sales is ' + (100 - m) + '% of sales. Sales = ' + money(cos) + ' &divide; ' + (100 - m) + '% = ' + money(s) + '.');
    } },
    { skill: 'missing balance', gen: function () {
      var oi = step(3000, 15000, 10), ci = step(3000, 15000, 10), cos = step(30000, 100000, 10), p = cos + ci - oi, n = pick(NAMES);
      return num(n + '&rsquo;s cost of sales for the year was ' + money(cos) + '. Inventory was ' + money(oi) + ' at the start of the year and ' + money(ci) + ' at the end. Calculate purchases for the year. Give your answer in $.', p,
        'Cost of sales = opening inventory + purchases &minus; closing inventory, so purchases = ' + money(cos) + ' + ' + money(ci) + ' &minus; ' + money(oi) + ' = ' + money(p) + '.');
    } },
    { skill: 'credit sales', kind: 'mcq', q: 'When reconstructing credit sales, where should the figure for receipts from credit customers come from?',
      options: ['The bank (and cash) summary', 'The income statement', 'The purchases day book', 'The statement of financial position'], answer: 0,
      why: 'Receipts are cash or bank movements, so they come from the summary of money received. The income statement shows sales, which is the figure being found.' },
    { skill: 'credit sales', kind: 'mcq', q: 'Which calculation gives credit sales from a trader&rsquo;s incomplete records?',
      options: ['Receipts + closing receivables &minus; opening receivables', 'Receipts + opening receivables &minus; closing receivables', 'Receipts &minus; closing receivables &minus; opening receivables', 'Payments + closing payables &minus; opening payables'], answer: 0,
      why: 'Opening receivables were sales of last year, so they are taken off. Closing receivables are sales of this year not yet received, so they are added. The last option gives credit purchases.' },
    { skill: 'credit sales', gen: function () {
      var o = step(4000, 16000, 10), cs = step(50000, 140000, 10), c = step(4000, 16000, 10), rc = o + cs - c, s = pick(SHOPS);
      return numMcq(s + '&rsquo;s credit sales for the year were ' + money(cs) + '. Trade receivables were ' + money(o) + ' at the start and ' + money(c) + ' at the end. There were no discounts, returns or irrecoverable debts. How much was received from credit customers?',
        rc, [cs + c - o, cs - o - c, cs + o + c],
        'Receipts = opening ' + money(o) + ' + sales ' + money(cs) + ' &minus; closing ' + money(c) + ' = ' + money(rc) + '.');
    } },
    { skill: 'total sales and purchases', gen: function () {
      var bk = step(30000, 90000, 10), w = step(2000, 8000, 10), d = step(1500, 6000, 10), n = pick(NAMES);
      return num(n + ' banks all cash takings after paying some items out of the till. During the year ' + money(bk) + ' of cash sales was banked. Before banking, ' + money(w) + ' was paid out in casual wages and ' + n + ' took ' + money(d) + ' for personal use. Calculate total cash sales. Give your answer in $.', bk + w + d,
        'Money paid out of takings was still cash sales. Cash sales = ' + money(bk) + ' + ' + money(w) + ' + ' + money(d) + ' = ' + money(bk + w + d) + '.');
    } },
    { skill: 'credit purchases', kind: 'mcq', q: 'Why can a trader not simply use the payments made to suppliers during the year as the purchases figure?',
      options: ['Some payments settle last year&rsquo;s debts and some purchases are unpaid', 'Payments to suppliers include the cash sales for the year', 'Payments to suppliers are an expense, not a purchase', 'Payments are only recorded once the goods are sold'], answer: 0,
      why: 'The payments include amounts owed at the start of the year and leave out amounts still owed at the end. Adjusting for opening and closing payables converts payments into purchases.' },
    { skill: 'credit sales', kind: 'multi', q: 'In a total trade receivables account used to find credit sales, which of these are entered on the <b>credit</b> side?',
      options: ['Receipts from credit customers', 'Discounts allowed', 'Sales returns', 'Balance b/d at the start of the year', 'Credit sales'], answers: [0, 1, 2],
      why: 'Items that reduce what customers owe are credits: receipts, discounts allowed and returns (and the balance c/d). The opening balance b/d and credit sales are debits.' },
    { skill: 'credit purchases', kind: 'multi', q: 'In a total trade payables account used to find credit purchases, which of these are entered on the <b>debit</b> side?',
      options: ['Payments to suppliers', 'Discounts received', 'Purchases returns', 'Credit purchases', 'Balance b/d at the start of the year'], answers: [0, 1, 2],
      why: 'Items that reduce what the business owes are debits: payments, discounts received and returns (and the balance c/d). Credit purchases and the opening credit balance are credits.' },
    { skill: 'missing balance', gen: function () {
      var o = step(3000, 14000, 10), cp = step(30000, 100000, 10), dr = step(200, 1500, 10), c = step(3000, 14000, 10), pm = o + cp - dr - c, s = pick(SHOPS);
      return num(s + ': opening trade payables ' + money(o) + ', credit purchases ' + money(cp) + ', payments to suppliers ' + money(pm) + ', discounts received ' + money(dr) + '. Calculate closing trade payables. Give your answer in $.', c,
        'Closing payables = ' + money(o) + ' + ' + money(cp) + ' &minus; ' + money(pm) + ' &minus; ' + money(dr) + ' = ' + money(c) + '.');
    } },
    { skill: 'credit purchases', gen: function () {
      var o = step(3000, 12000, 10), c = step(3000, 12000, 10), pb = step(25000, 90000, 10), pc = step(500, 4000, 10), cp = pb + pc + c - o, n = pick(NAMES);
      return numMcq(n + ' paid credit suppliers ' + money(pb) + ' by bank transfer and ' + money(pc) + ' in cash. Trade payables were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. What were credit purchases?',
        cp, [pb + c - o, pb + pc + o - c, pb + pc + c + o],
        'All payments to credit suppliers count, by bank or in cash: ' + money(pb) + ' + ' + money(pc) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(cp) + '.');
    } },
    { skill: 'mark-up and margin', gen: function () {
      var m = pick([25, 50, 60]), oi = step(4000, 15000, 100), ci = step(4000, 15000, 100), p = step(30000, 80000, 100), cos = oi + p - ci, s = cos * (100 + m) / 100, n = pick(NAMES);
      return num(n + ' sells all goods at a mark-up of ' + m + '%. Opening inventory was ' + money(oi) + ', purchases ' + money(p) + ' and closing inventory ' + money(ci) + '. Calculate sales for the year. Give your answer in $.', s,
        'Cost of sales = ' + money(oi) + ' + ' + money(p) + ' &minus; ' + money(ci) + ' = ' + money(cos) + '. Sales = ' + money(cos) + ' &times; ' + (100 + m) + '% = ' + money(s) + '.');
    } },
    { skill: 'credit sales', kind: 'mcq', q: 'Why is the opening balance of trade receivables deducted when calculating credit sales for the year?',
      options: ['It relates to sales made in the previous year', 'It is cash received during this year', 'It is a liability owed by the business', 'It is the same as the discounts allowed'], answer: 0,
      why: 'Customers paid the opening balance this year, so it is inside the receipts figure, but those sales were made last year. Deducting it leaves only this year&rsquo;s sales.' }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-09 */
  B['ACC-PIR-09'] = { title: 'Income statement from incomplete records', items: [
    { skill: 'cost of sales', gen: function () {
      var oi = step(5000, 20000, 10), ci = step(5000, 20000, 10), o = step(3000, 12000, 10), c = step(3000, 12000, 10), pm = step(40000, 110000, 10), p = pm + c - o, cos = oi + p - ci, n = pick(NAMES);
      return num(n + ' paid credit suppliers ' + money(pm) + '. Trade payables were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. Inventory was ' + money(oi) + ' at the start and ' + money(ci) + ' at the end. All purchases were on credit. Calculate cost of sales. Give your answer in $.', cos,
        'Purchases = ' + money(pm) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(p) + '. Cost of sales = ' + money(oi) + ' + ' + money(p) + ' &minus; ' + money(ci) + ' = ' + money(cos) + '.');
    } },
    { skill: 'revenue and gross profit', gen: function () {
      var o = step(4000, 16000, 10), c = step(4000, 16000, 10), rc = step(70000, 160000, 10), rev = rc + c - o, cos = Math.round(rev * pick([0.55, 0.6, 0.65, 0.7]) / 10) * 10, gp = rev - cos, n = pick(NAMES);
      return num(n + '&rsquo;s sales are all on credit. Receipts from customers were ' + money(rc) + '; trade receivables were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. Cost of sales was ' + money(cos) + '. Calculate gross profit. Give your answer in $.', gp,
        'Revenue = ' + money(rc) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(rev) + '. Gross profit = ' + money(rev) + ' &minus; ' + money(cos) + ' = ' + money(gp) + '.');
    } },
    { skill: 'adjusting expenses', gen: function () {
      var pd = step(8000, 30000, 10), o = step(200, 1500, 10), c = step(200, 1500, 10), e = pd - o + c, n = pick(NAMES);
      return num(n + ' paid ' + money(pd) + ' in wages during the year. Wages owing were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. Calculate the wages expense for the income statement. Give your answer in $.', e,
        'The opening amount owing was last year&rsquo;s wages, paid this year, so deduct it; the closing amount owing belongs to this year, so add it: ' + money(pd) + ' &minus; ' + money(o) + ' + ' + money(c) + ' = ' + money(e) + '.');
    } },
    { skill: 'adjusting expenses', gen: function () {
      var pd = step(2000, 9000, 10), op = step(100, 800, 10), cp = step(100, 800, 10), e = pd + op - cp, s = pick(SHOPS);
      return num(s + ' paid ' + money(pd) + ' for insurance during the year. Insurance prepaid was ' + money(op) + ' at the start of the year and ' + money(cp) + ' at the end. Calculate the insurance expense for the year. Give your answer in $.', e,
        'The opening prepayment is used up this year, so add it; the closing prepayment belongs to next year, so deduct it: ' + money(pd) + ' + ' + money(op) + ' &minus; ' + money(cp) + ' = ' + money(e) + '.');
    } },
    { skill: 'adjusting expenses', gen: function () {
      var pd = step(4000, 15000, 10), cp = step(200, 1500, 10), n = pick(NAMES);
      return numMcq(n + ' paid ' + money(pd) + ' for rent during the year, of which ' + money(cp) + ' is for the first month of next year. There were no balances at the start of the year. What rent expense is shown in the income statement?',
        pd - cp, [pd + cp, pd, cp],
        'Rent paid in advance is a prepayment, so it is deducted from the amount paid: ' + money(pd) + ' &minus; ' + money(cp) + ' = ' + money(pd - cp) + '.');
    } },
    { skill: 'depreciation', gen: function () {
      var c = step(10000, 30000, 1000), ad = step(2000, Math.floor(c / 2), 1000), r = pick([20, 25, 30]), d = (c - ad) * r / 100, n = pick(NAMES);
      return num(n + '&rsquo;s motor vehicle cost ' + money(c) + ' and had accumulated depreciation of ' + money(ad) + ' at the start of the year. It is depreciated at ' + r + '% per year using the reducing balance method. Calculate the depreciation charge for the year. Give your answer in $.', d,
        'Reducing balance is charged on the carrying amount: (' + money(c) + ' &minus; ' + money(ad) + ') &times; ' + r + '% = ' + money(ad === 0 ? c : c - ad) + ' &times; ' + r + '% = ' + money(d) + '.');
    } },
    { skill: 'depreciation', gen: function () {
      var c = step(4000, 20000, 500), r = pick([10, 15, 20, 25]), d = c * r / 100, s = pick(SHOPS);
      return num(s + '&rsquo;s shop equipment cost ' + money(c) + '. It is depreciated at ' + r + '% per year using the straight-line method. Calculate the depreciation charge for the year. Give your answer in $.', d,
        'Straight-line depreciation is a fixed percentage of cost: ' + money(c) + ' &times; ' + r + '% = ' + money(d) + '.');
    } },
    { skill: 'profit for the year', gen: function () {
      var ir = step(50, 600, 5), w = step(8000, 25000, 10), rn = step(3000, 12000, 10), dp = step(1000, 6000, 10), g = step(800, 4000, 10), ex = w + rn + dp + g, gp = step(Math.max(30000, ex + 2000), Math.max(80000, ex + 20000), 10), pf = gp + ir - ex;
      return num('From a trader&rsquo;s workings: gross profit ' + money(gp) + ', interest received ' + money(ir) + ', wages ' + money(w) + ', rent ' + money(rn) + ', depreciation ' + money(dp) + ', general expenses ' + money(g) + '. Calculate profit for the year. Give your answer in $.', pf,
        'Gross profit + other income = ' + money(gp + ir) + '. Expenses = ' + money(ex) + '. Profit for the year = ' + money(gp + ir) + ' &minus; ' + money(ex) + ' = ' + money(pf) + '.');
    } },
    { skill: 'cost of sales', gen: function () {
      var oi = step(4000, 18000, 10), p = step(40000, 100000, 10), g = step(300, 3000, 10), ci = step(4000, 18000, 10), cos = oi + p - g - ci, n = pick(NAMES);
      return num(n + '&rsquo;s opening inventory was ' + money(oi) + ', purchases ' + money(p) + ' and closing inventory ' + money(ci) + '. During the year ' + n + ' took goods costing ' + money(g) + ' for personal use. Calculate cost of sales. Give your answer in $.', cos,
        'Goods for own use are taken out of purchases: ' + money(oi) + ' + ' + money(p) + ' &minus; ' + money(g) + ' &minus; ' + money(ci) + ' = ' + money(cos) + '.');
    } },
    { skill: 'cost of sales', gen: function () {
      var oi = step(4000, 18000, 10), p = step(40000, 100000, 10), ca = step(200, 2000, 10), co = step(200, 2000, 10), ci = step(4000, 18000, 10), cos = oi + p + ca - ci, s = pick(SHOPS);
      return numMcq(s + ': opening inventory ' + money(oi) + ', purchases ' + money(p) + ', carriage inwards ' + money(ca) + ', carriage outwards ' + money(co) + ', closing inventory ' + money(ci) + '. What is cost of sales?',
        cos, [cos + co, cos - ca, oi + p + ca + co + ci],
        'Carriage inwards is part of the cost of buying goods, so it goes into cost of sales; carriage outwards is a selling expense. ' + money(oi) + ' + ' + money(p) + ' + ' + money(ca) + ' &minus; ' + money(ci) + ' = ' + money(cos) + '.');
    } },
    { skill: 'what goes in', kind: 'mcq', q: 'Petra took $9,600 from the business bank account for personal use during the year. How is this shown in her income statement?',
      options: ['It is not shown, because drawings are not an expense', 'It is added to the other expenses', 'It is deducted from revenue', 'It is added to cost of sales'], answer: 0,
      why: 'Drawings are the owner taking value out of the business. They reduce equity in the statement of financial position, not profit.' },
    { skill: 'what goes in', kind: 'multi', q: 'Which of these are shown as <b>expenses</b> in a sole trader&rsquo;s income statement?',
      options: ['Depreciation of shop fittings', 'Wages paid to an assistant', 'Discounts allowed', 'Cash taken by the owner', 'Cost of a new delivery van', 'Interest received'], answers: [0, 1, 2],
      why: 'Depreciation, wages and discounts allowed are costs of running the business. Drawings are not an expense, a new van is capital expenditure, and interest received is other income.' },
    { skill: 'what goes in', kind: 'mcq', q: 'Where is interest received on a business savings account shown in the income statement?',
      options: ['Added to gross profit as other income', 'Added to revenue before cost of sales', 'Deducted with the expenses', 'Included in cost of sales'], answer: 0,
      why: 'Interest received is income that is not from trading, so it is added after gross profit as other income.' },
    { skill: 'revenue and gross profit', gen: function () {
      var o = step(4000, 15000, 10), c = step(4000, 15000, 10), rc = step(50000, 120000, 10), da = step(300, 2500, 10), rev = rc + da + c - o, s = pick(SHOPS);
      return numMcq(s + ' sells only on credit. Receipts from customers were ' + money(rc) + ' after allowing discounts of ' + money(da) + '. Trade receivables were ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. What revenue is shown in the income statement?',
        rev, [rc + c - o, rc - da + c - o, rc + da + o - c],
        'Discounts allowed also cleared customer debts, so they are added back: ' + money(rc) + ' + ' + money(da) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(rev) + '. The discount is then shown separately as an expense.');
    } },
    { skill: 'revenue and gross profit', gen: function () {
      var o = step(3000, 12000, 10), c = step(3000, 12000, 10), rc = step(40000, 100000, 10), cash = step(5000, 25000, 10), cos = step(30000, 70000, 10), rev = rc + c - o + cash;
      if (cos >= rev) cos = Math.round(rev * 0.6 / 10) * 10;
      var gp = rev - cos, n = pick(NAMES);
      return num(n + '&rsquo;s cash sales were ' + money(cash) + '. Receipts from credit customers were ' + money(rc) + ', with trade receivables of ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. Cost of sales was ' + money(cos) + '. Calculate gross profit. Give your answer in $.', gp,
        'Revenue = credit sales (' + money(rc) + ' + ' + money(c) + ' &minus; ' + money(o) + ' = ' + money(rc + c - o) + ') + cash sales ' + money(cash) + ' = ' + money(rev) + '. Gross profit = ' + money(rev) + ' &minus; ' + money(cos) + ' = ' + money(gp) + '.');
    } },
    { skill: 'what goes in', kind: 'mcq', q: 'In a sole trader&rsquo;s income statement, where is discount received shown?',
      options: ['Added to gross profit as other income', 'Deducted with the other expenses', 'Included in the cost of sales', 'Deducted from the revenue figure'], answer: 0,
      why: 'Discount received is a gain from paying suppliers early or promptly, so it is other income added to gross profit.' },
    { skill: 'adjusting expenses', gen: function () {
      var rr = step(3000, 12000, 10), o = step(100, 900, 10), c = step(100, 900, 10), inc = rr - o + c, n = pick(NAMES);
      return num(n + ' sublets part of the shop. Rent received during the year was ' + money(rr) + '. At the start of the year the tenant owed ' + money(o) + ' and at the end owed ' + money(c) + '. Calculate rent receivable for the income statement. Give your answer in $.', inc,
        'The opening amount owed was last year&rsquo;s income, so deduct it; the closing amount owed was earned this year, so add it: ' + money(rr) + ' &minus; ' + money(o) + ' + ' + money(c) + ' = ' + money(inc) + '.');
    } },
    { skill: 'adjusting expenses', gen: function () {
      var tr = step(10000, 40000, 100), r = pick([2, 4, 5]), nw = tr * r / 100, old = nw - step(50, Math.min(400, nw - 50), 10), ch = nw - old, s = pick(SHOPS);
      return num(s + '&rsquo;s provision for irrecoverable debts was ' + money(old) + ' at the start of the year. At the end it is to be ' + r + '% of trade receivables of ' + money(tr) + '. Calculate the amount charged as an expense for the provision this year. Give your answer in $.', ch,
        'New provision = ' + r + '% &times; ' + money(tr) + ' = ' + money(nw) + '. Only the increase is an expense: ' + money(nw) + ' &minus; ' + money(old) + ' = ' + money(ch) + '.');
    } },
    { skill: 'profit for the year', gen: function () {
      var rev = step(80000, 160000, 10), cos = Math.round(rev * pick([0.55, 0.6, 0.65]) / 10) * 10, ir = step(100, 800, 10), gp = rev - cos, ex = step(15000, Math.min(30000, gp - 6000), 10), d = step(6000, 15000, 10), pf = gp + ir - ex;
      return numMcq('A trader&rsquo;s revenue was ' + money(rev) + ' and cost of sales ' + money(cos) + '. Other income (interest received) was ' + money(ir) + '. Expenses totalled ' + money(ex) + '. The owner also took drawings of ' + money(d) + '. What is the profit for the year?',
        pf, [pf - d, gp - ex, pf - ir - d],
        'Gross profit = ' + money(gp) + '. Profit = ' + money(gp) + ' + ' + money(ir) + ' &minus; ' + money(ex) + ' = ' + money(pf) + '. Drawings are not an expense, so they are ignored.');
    } },
    { skill: 'cost of sales', kind: 'mcq', q: 'Which order is correct for the trading section of an income statement?',
      options: ['Revenue; opening inventory + purchases &minus; closing inventory; gross profit', 'Opening inventory + revenue &minus; purchases; closing inventory; gross profit', 'Revenue; purchases &minus; opening inventory + closing inventory; gross profit', 'Purchases; revenue &minus; closing inventory; opening inventory; gross profit'], answer: 0,
      why: 'Revenue comes first. Cost of sales = opening inventory + purchases &minus; closing inventory, and gross profit = revenue &minus; cost of sales.' },
    { skill: 'adjusting expenses', gen: function () {
      var pd = step(6000, 20000, 10), o = step(200, 1200, 10), c = step(200, 1200, 10), e = pd - o + c, n = pick(NAMES);
      return numMcq(n + ' paid ' + money(pd) + ' for electricity during the year. ' + money(o) + ' was owing at the start of the year and ' + money(c) + ' was owing at the end. What is the electricity expense?',
        e, [pd + o - c, pd + o + c, pd - o - c],
        'Deduct last year&rsquo;s bill paid this year (' + money(o) + ') and add this year&rsquo;s unpaid bill (' + money(c) + '): ' + money(pd) + ' &minus; ' + money(o) + ' + ' + money(c) + ' = ' + money(e) + '.');
    } },
    { skill: 'adjusting expenses', gen: function () {
      var pd = step(5000, 15000, 10), o = step(200, 1200, 10), c = step(100, 900, 10), e = pd - o - c, s = pick(SHOPS);
      return num(s + ' paid ' + money(pd) + ' for advertising during the year. At the start of the year ' + money(o) + ' was owing to the advertising agency; at the end ' + money(c) + ' had been paid in advance for next year. Calculate the advertising expense. Give your answer in $.', e,
        'Deduct the opening amount owing (paid this year but last year&rsquo;s cost) and the closing prepayment (next year&rsquo;s cost): ' + money(pd) + ' &minus; ' + money(o) + ' &minus; ' + money(c) + ' = ' + money(e) + '.');
    } },
    { skill: 'depreciation', kind: 'mcq', q: 'On what amount is reducing-balance depreciation calculated each year?',
      options: ['The carrying amount at the start of the year', 'The original cost of the asset every year', 'The cost plus the accumulated depreciation', 'The expected selling price at the end of its life'], answer: 0,
      why: 'Reducing balance applies the same percentage to the carrying amount (cost &minus; accumulated depreciation), so the charge falls each year. A fixed percentage of cost is the straight-line method.' }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-10 */
  B['ACC-PIR-10'] = { title: 'Statement of financial position from incomplete records', items: [
    { skill: 'equity section', gen: function () {
      var oe = step(20000, 70000, 10), k = step(2000, 10000, 500), p = step(8000, 30000, 10), d = step(5000, 18000, 10), ce = oe + k + p - d, n = pick(NAMES);
      return num(n + '&rsquo;s equity at the start of the year was ' + money(oe) + '. During the year ' + n + ' introduced additional capital of ' + money(k) + ' and took drawings of ' + money(d) + '. Profit for the year was ' + money(p) + '. Calculate total equity at the year end. Give your answer in $.', ce,
        'Closing equity = ' + money(oe) + ' + ' + money(k) + ' + ' + money(p) + ' &minus; ' + money(d) + ' = ' + money(ce) + '.');
    } },
    { skill: 'drawings', gen: function () {
      var oe = step(20000, 60000, 10), p = step(8000, 25000, 10), dc = step(4000, 12000, 10), g = step(300, 2500, 10), ce = oe + p - dc - g, n = pick(NAMES);
      return numMcq(n + '&rsquo;s equity at the start of the year was ' + money(oe) + ' and profit was ' + money(p) + '. ' + n + ' withdrew ' + money(dc) + ' in cash and took goods costing ' + money(g) + ' for family use. What is total equity at the year end?',
        ce, [ce + g, ce + 2 * g, oe + p + dc + g],
        'Drawings include goods taken: ' + money(dc) + ' + ' + money(g) + ' = ' + money(dc + g) + '. Closing equity = ' + money(oe) + ' + ' + money(p) + ' &minus; ' + money(dc + g) + ' = ' + money(ce) + '.');
    } },
    { skill: 'profit as balancing figure', gen: function () {
      var oe = step(20000, 60000, 10), k = step(2000, 8000, 500), d = step(4000, 15000, 10), p = step(6000, 25000, 10), na = oe + k + p - d, n = pick(NAMES);
      return num('At the year end ' + n + '&rsquo;s total assets less total liabilities are ' + money(na) + '. Equity at the start of the year was ' + money(oe) + ', additional capital ' + money(k) + ' was introduced and drawings were ' + money(d) + '. Calculate the profit for the year. Give your answer in $.', p,
        'Closing equity must equal net assets, ' + money(na) + '. Profit = ' + money(na) + ' &minus; ' + money(oe) + ' &minus; ' + money(k) + ' + ' + money(d) + ' = ' + money(p) + '.');
    } },
    { skill: 'non-current assets', gen: function () {
      var c1 = step(10000, 25000, 1000), ad = step(2000, 8000, 500), c2 = step(2000, 10000, 1000), r = pick([10, 20]), dep = (c1 + c2) * r / 100, ca = c1 + c2 - ad - dep, n = pick(NAMES);
      return num(n + '&rsquo;s equipment cost ' + money(c1) + ' with accumulated depreciation of ' + money(ad) + ' at the start of the year. Extra equipment costing ' + money(c2) + ' was bought during the year. All equipment held at the year end is depreciated at ' + r + '% of cost. Calculate the carrying amount of equipment at the year end. Give your answer in $.', ca,
        'Cost = ' + money(c1) + ' + ' + money(c2) + ' = ' + money(c1 + c2) + '. This year&rsquo;s depreciation = ' + r + '% &times; ' + money(c1 + c2) + ' = ' + money(dep) + '. Carrying amount = ' + money(c1 + c2) + ' &minus; ' + money(ad) + ' &minus; ' + money(dep) + ' = ' + money(ca) + '.');
    } },
    { skill: 'non-current assets', gen: function () {
      var cav = step(8000, 24000, 100), r = pick([20, 25]), dep = cav * r / 100, n = pick(NAMES);
      return numMcq(n + '&rsquo;s van had a carrying amount of ' + money(cav) + ' at the start of the year. It is depreciated at ' + r + '% per year, reducing balance. What figure is shown for the van in the statement of financial position at the year end?',
        cav - dep, [cav, dep, cav + dep],
        'Depreciation = ' + r + '% &times; ' + money(cav) + ' = ' + money(dep) + '. Carrying amount = ' + money(cav) + ' &minus; ' + money(dep) + ' = ' + money(cav - dep) + '.');
    } },
    { skill: 'totals', gen: function () {
      var inv = step(4000, 20000, 10), tr = step(2000, 15000, 10), orc = step(100, 900, 10), ch = step(100, 800, 10), bk = step(500, 6000, 10), tot = inv + tr + orc + ch + bk, s = pick(SHOPS);
      return num('At the year end ' + s + ' has inventory ' + money(inv) + ', trade receivables ' + money(tr) + ', rent paid in advance ' + money(orc) + ', cash in hand ' + money(ch) + ' and cash at bank ' + money(bk) + '. Calculate total current assets. Give your answer in $.', tot,
        money(inv) + ' + ' + money(tr) + ' + ' + money(orc) + ' + ' + money(ch) + ' + ' + money(bk) + ' = ' + money(tot) + '. Rent paid in advance is an other receivable.');
    } },
    { skill: 'classifying liabilities', kind: 'mcq', q: 'Rafael&rsquo;s year ends on 31 December 2025. His bank loan is repayable in full in 2031. Where is it shown in his statement of financial position?',
      options: ['Non-current liabilities', 'Current liabilities', 'Equity', 'Non-current assets'], answer: 0,
      why: 'The loan is owed to the bank, so it is a liability. It is not due within 12 months of the year end, so it is non-current.' },
    { skill: 'classifying liabilities', kind: 'mcq', q: 'At the year end a sole trader has a bank overdraft of $1,350. How is it shown in the statement of financial position?',
      options: ['As a current liability', 'As a current asset', 'As a non-current liability', 'As a deduction from equity'], answer: 0,
      why: 'An overdraft is money owed to the bank that can be called in at any time, so it is a current liability.' },
    { skill: 'totals', gen: function () {
      var te = step(25000, 80000, 10), ln = step(5000, 20000, 1000), tp = step(3000, 15000, 10), op = step(100, 900, 10), od = step(200, 2500, 10), tot = te + ln + tp + op + od;
      return num('A sole trader&rsquo;s total equity is ' + money(te) + '. Liabilities: bank loan repayable in 2030 ' + money(ln) + ', trade payables ' + money(tp) + ', wages owing ' + money(op) + ', bank overdraft ' + money(od) + '. Calculate total equity and liabilities. Give your answer in $.', tot,
        money(te) + ' + ' + money(ln) + ' + ' + money(tp) + ' + ' + money(op) + ' + ' + money(od) + ' = ' + money(tot) + '.');
    } },
    { skill: 'equity section', kind: 'mcq', q: 'During the year Oskar used his own savings to buy a computer for the business for $1,800. How is this shown in the year-end statement of financial position?',
      options: ['Non-current asset and additional capital', 'Non-current asset and a deduction for drawings', 'An expense and a deduction from equity', 'A current asset and a current liability'], answer: 0,
      why: 'The business owns the computer, so it is a non-current asset. The owner paid with private money, so it is extra capital introduced, added in the equity section.' },
    { skill: 'totals', gen: function () {
      var ob = step(1000, 8000, 10), rc = step(60000, 140000, 10), pd = step(50000, 130000, 10), cb = ob + rc - pd;
      if (cb < 200) { rc += 200 - cb + step(500, 4000, 10); cb = ob + rc - pd; }
      var n = pick(NAMES);
      return num(n + '&rsquo;s bank summary shows an opening balance of ' + money(ob) + ' (in the bank), total receipts of ' + money(rc) + ' and total payments of ' + money(pd) + '. What figure is shown for cash at bank in the statement of financial position? Give your answer in $.', cb,
        'Closing bank = ' + money(ob) + ' + ' + money(rc) + ' &minus; ' + money(pd) + ' = ' + money(cb) + ', a current asset.');
    } },
    { skill: 'equity section', gen: function () {
      var oe = step(25000, 60000, 10), k = step(3000, 10000, 500), loss = step(1000, 6000, 10), d = step(4000, 12000, 10), ce = oe + k - loss - d, n = pick(NAMES);
      return numMcq(n + '&rsquo;s equity at the start of the year was ' + money(oe) + '. Additional capital of ' + money(k) + ' was introduced, the business made a loss of ' + money(loss) + ' and drawings were ' + money(d) + '. What is total equity at the year end?',
        ce, [ce + 2 * loss, ce - k, ce + 2 * d],
        'A loss reduces equity: ' + money(oe) + ' + ' + money(k) + ' &minus; ' + money(loss) + ' &minus; ' + money(d) + ' = ' + money(ce) + '.');
    } },
    { skill: 'equity section', gen: function () {
      var a = step(30000, 80000, 10), l = step(5000, 20000, 10), oe = a - l, p = step(6000, 20000, 10), d = step(4000, 12000, 10), ce = oe + p - d, n = pick(NAMES);
      return num('At the start of the year ' + n + '&rsquo;s business had assets of ' + money(a) + ' and liabilities of ' + money(l) + '. Profit for the year was ' + money(p) + ' and drawings were ' + money(d) + '. No capital was introduced. Calculate total equity at the year end. Give your answer in $.', ce,
        'Opening equity = ' + money(a) + ' &minus; ' + money(l) + ' = ' + money(oe) + '. Closing equity = ' + money(oe) + ' + ' + money(p) + ' &minus; ' + money(d) + ' = ' + money(ce) + '.');
    } },
    { skill: 'equity section', kind: 'multi', q: 'Which of these lines appear in the <b>equity</b> section of a sole trader&rsquo;s statement of financial position?',
      options: ['Equity at the start of the year', 'Additional capital introduced', 'Profit for the year', 'Drawings (deducted)', 'Bank loan', 'Trade payables'], answers: [0, 1, 2, 3],
      why: 'The equity section shows opening equity, plus any new capital and the profit, less drawings. Loans and trade payables are liabilities.' },
    { skill: 'totals', gen: function () {
      var c = step(15000, 40000, 1000), ad = step(3000, 12000, 500), inv = step(4000, 15000, 10), tr = step(3000, 12000, 10), bk = step(500, 5000, 10), tot = c - ad + inv + tr + bk, n = pick(NAMES);
      return num(n + '&rsquo;s fixtures cost ' + money(c) + ' with accumulated depreciation (including this year) of ' + money(ad) + '. Inventory is ' + money(inv) + ', trade receivables ' + money(tr) + ' and cash at bank ' + money(bk) + '. Calculate total assets. Give your answer in $.', tot,
        'Fixtures at carrying amount = ' + money(c - ad) + '. Total assets = ' + money(c - ad) + ' + ' + money(inv + tr + bk) + ' = ' + money(tot) + '.');
    } },
    { skill: 'classifying liabilities', gen: function () {
      var tp = step(3000, 15000, 10), op = step(100, 900, 10), od = step(200, 2500, 10), ls = step(2000, 8000, 500), ll = step(5000, 20000, 1000), tot = tp + op + od + ls, n = pick(NAMES);
      return numMcq(n + '&rsquo;s liabilities at the year end: trade payables ' + money(tp) + '; rent owing ' + money(op) + '; bank overdraft ' + money(od) + '; a loan of ' + money(ls) + ' repayable in 9 months; a loan of ' + money(ll) + ' repayable in 2030. What is the total of current liabilities?',
        tot, [tot - ls, tot + ll, tot - od],
        'Current liabilities are due within 12 months: ' + money(tp) + ' + ' + money(op) + ' + ' + money(od) + ' + ' + money(ls) + ' = ' + money(tot) + '. The loan due in 2030 is non-current.');
    } },
    { skill: 'classifying liabilities', kind: 'mcq', q: 'Which of these is a current liability in a sole trader&rsquo;s statement of financial position?',
      options: ['Electricity owing at the year end', 'Insurance paid in advance', 'Cash in hand', 'Shop fittings'], answer: 0,
      why: 'Electricity owing is an other payable: the business owes it and will pay soon. Insurance paid in advance and cash are current assets; shop fittings are non-current assets.' },
    { skill: 'drawings', kind: 'mcq', q: 'Why are goods taken by the owner for personal use included in drawings in the equity section?',
      options: ['They are business resources used privately, so they reduce equity', 'They are an expense of running the business', 'They increase the closing inventory figure', 'They are a liability owed by the owner to suppliers'], answer: 0,
      why: 'Taking goods is the same as taking cash: business resources leave for private use. So they are added to cash drawings and deducted from equity.' },
    { skill: 'profit as balancing figure', gen: function () {
      var veh = step(8000, 20000, 100), inv = step(4000, 15000, 10), tr = step(3000, 12000, 10), bk = step(500, 5000, 10), tp = step(3000, 10000, 10), oe = step(15000, 30000, 10), d = step(4000, 12000, 10);
      var na = veh + inv + tr + bk - tp;
      if (na - oe + d < 2000) oe = na + d - step(2000, 8000, 10);
      var p = na - oe + d, n = pick(NAMES);
      return numMcq('At the year end ' + n + ' has: motor vehicle (carrying amount) ' + money(veh) + ', inventory ' + money(inv) + ', trade receivables ' + money(tr) + ', cash at bank ' + money(bk) + ' and trade payables ' + money(tp) + '. Equity at the start of the year was ' + money(oe) + ' and drawings were ' + money(d) + '. No capital was introduced. What was the profit for the year?',
        p, [na - oe, na - oe - d, na + tp - oe + d],
        'Closing equity = net assets = ' + money(na + tp) + ' &minus; ' + money(tp) + ' = ' + money(na) + '. Profit = ' + money(na) + ' &minus; ' + money(oe) + ' + ' + money(d) + ' = ' + money(p) + '.');
    } },
    { skill: 'totals', gen: function () {
      var tr = step(8000, 30000, 100), r = pick([2, 3, 5]), pr = tr * r / 100, n = pick(NAMES);
      return numMcq(n + '&rsquo;s trade receivables at the year end are ' + money(tr) + '. A provision for irrecoverable debts of ' + r + '% is to be made. What net figure is included in current assets?',
        tr - pr, [tr, tr + pr, pr],
        'Provision = ' + r + '% &times; ' + money(tr) + ' = ' + money(pr) + '. Net trade receivables = ' + money(tr) + ' &minus; ' + money(pr) + ' = ' + money(tr - pr) + '.');
    } },
    { skill: 'classifying liabilities', kind: 'mcq', q: 'A sole trader&rsquo;s year ends on 31 December 2025. A loan of $12,000 must be repaid in full on 30 June 2026. How is it classified?',
      options: ['Current liabilities', 'Non-current liabilities', 'Equity', 'Current assets'], answer: 0,
      why: 'The loan is due within 12 months of the year end, so it is a current liability even though it is a loan.' },
    { skill: 'equity section', kind: 'mcq', q: 'Which calculation gives a sole trader&rsquo;s total equity at the year end?',
      options: ['Opening equity + capital introduced + profit &minus; drawings', 'Opening equity + capital introduced &minus; profit + drawings', 'Opening equity &minus; capital introduced + profit &minus; drawings', 'Opening equity + profit + drawings &minus; capital introduced'], answer: 0,
      why: 'New capital and profit increase what the business owes the owner; drawings reduce it.' },
    { skill: 'profit as balancing figure', gen: function () {
      var oe = step(15000, 50000, 10), dc = step(3000, 12000, 10), g = step(200, 2000, 10), k = step(2000, 8000, 500), p = step(5000, 20000, 10), na = oe + k + p - dc - g, n = pick(NAMES);
      return num(n + '&rsquo;s net assets at the year end total ' + money(na) + '. Opening equity was ' + money(oe) + '. During the year ' + n + ' paid in extra capital of ' + money(k) + ', withdrew cash of ' + money(dc) + ' and took goods costing ' + money(g) + ' for own use. Calculate the profit for the year. Give your answer in $.', p,
        'Drawings = ' + money(dc) + ' + ' + money(g) + ' = ' + money(dc + g) + '. Profit = ' + money(na) + ' &minus; ' + money(oe) + ' &minus; ' + money(k) + ' + ' + money(dc + g) + ' = ' + money(p) + '.');
    } }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-02 */
  B['ACC-PIR-02'] = { title: 'Partnership agreements and what happens without one', items: [
    { skill: 'Act rules', kind: 'mcq', q: 'Under section 24 of the Partnership Act 1890, how are profits and losses shared when there is no partnership agreement?',
      options: ['Equally between the partners', 'In the ratio of capital invested', 'In the ratio of hours worked', 'In the ratio of drawings taken'], answer: 0,
      why: 'Without an agreement the Act says profits and losses are shared equally, whatever each partner invested or worked.' },
    { skill: 'Act rules', kind: 'mcq', q: 'Two partners have no agreement. Under the Partnership Act 1890, what interest is each partner paid on the capital they invested?',
      options: ['No interest at all', '5% per year', '10% per year', 'The bank&rsquo;s base rate'], answer: 0,
      why: 'The Act gives no interest on capital. The 5% rate in the Act applies only to loans that partners make to the business.' },
    { skill: 'Act rules', kind: 'mcq', q: 'There is no partnership agreement. One partner lends the business money in addition to her capital. Under the Partnership Act 1890, what is she entitled to?',
      options: ['Interest of 5% per year on the loan', 'Interest of 10% per year on the loan', 'No interest on the loan at all', 'A larger share of the profit'], answer: 0,
      why: 'Section 24 entitles a partner who lends money beyond capital to interest of 5% per year on that loan.' },
    { skill: 'Act rules', kind: 'mcq', q: 'There is no partnership agreement. One partner runs the shop full-time while the other works there one day a week. Under the Partnership Act 1890, what salary does the full-time partner receive?',
      options: ['No salary', 'A salary set by the other partner', 'A salary of 5% of profit', 'A salary equal to an employee&rsquo;s wage'], answer: 0,
      why: 'The Act gives no partner a salary, however much work they do. Only an agreement can provide one.' },
    { skill: 'Act rules', kind: 'mcq', q: 'Under the Partnership Act 1890, what happens about interest on partners&rsquo; drawings when there is no agreement?',
      options: ['No interest is charged on drawings', '5% per year is charged on drawings', 'Interest is charged at the bank rate', 'Drawings are charged 10% per year'], answer: 0,
      why: 'The Act does not charge interest on drawings. An agreement is needed if the partners want to discourage large drawings this way.' },
    { skill: 'Act rules', kind: 'multi', q: 'Which statements are true under section 24 of the Partnership Act 1890 when there is no agreement?',
      options: ['Profits are shared equally', 'A partner&rsquo;s loan earns 5% interest per year', 'No partner receives a salary', 'Capital earns 5% interest per year', 'Losses are shared in the capital ratio'], answers: [0, 1, 2],
      why: 'The Act shares profits and losses equally, gives 5% on partners&rsquo; loans, and allows no salaries, no interest on capital and no interest on drawings.' },
    { skill: 'agreement contents', kind: 'multi', q: 'Which of these would a partnership agreement usually set out?',
      options: ['The profit-sharing ratio', 'Interest on capital and on drawings', 'Any salaries paid to partners', 'The prices charged to each customer', 'The names of the business&rsquo;s suppliers'], answers: [0, 1, 2],
      why: 'An agreement covers how profit is shared and the appropriation items: interest on capital, interest on drawings, salaries and interest on partners&rsquo; loans. Day-to-day trading details are not part of it.' },
    { skill: 'Act calculations', gen: function () {
      var p = pick(PAIRS), l = step(4000, 20000, 2000), int = l * 5 / 100, pr = step(20000, 60000, 200) + int, share = (pr - int) / 2;
      return num(p[0] + ' and ' + p[1] + ' have no partnership agreement. ' + p[0] + ' lent the business ' + money(l) + ' at the start of the year, in addition to capital. Profit before any interest on this loan was ' + money(pr) + '. Using the Partnership Act 1890, calculate the total amount ' + p[0] + ' receives from the business for the year (loan interest plus profit share). Give your answer in $.', share + int,
        'Loan interest = 5% &times; ' + money(l) + ' = ' + money(int) + ', charged before profit is shared. Remaining profit = ' + money(pr) + ' &minus; ' + money(int) + ' = ' + money(pr - int) + ', shared equally: ' + money(share) + ' each. ' + p[0] + ' receives ' + money(int) + ' + ' + money(share) + ' = ' + money(share + int) + '.');
    } },
    { skill: 'Act calculations', gen: function () {
      var pr = step(30000, 90000, 300), n = pick([['Asha', 'Bruno', 'Clara'], ['Dara', 'Eli', 'Fatima'], ['Gwen', 'Hugo', 'Ishaan']]);
      return num(n[0] + ', ' + n[1] + ' and ' + n[2] + ' invested capital of $40,000, $25,000 and $10,000. They have no partnership agreement and no partner loans. Profit for the year was ' + money(pr) + '. How much profit is ' + n[0] + '&rsquo;s share? Give your answer in $.', pr / 3,
        'The Act shares profit equally, regardless of capital: ' + money(pr) + ' &divide; 3 = ' + money(pr / 3) + '.');
    } },
    { skill: 'Act calculations', gen: function () {
      var l = step(3000, 30000, 1000), n = pick(NAMES);
      return num('There is no partnership agreement. ' + n + ' lent the partnership ' + money(l) + ' on the first day of the year, in addition to capital. How much loan interest is ' + n + ' entitled to for the full year? Give your answer in $.', l * 5 / 100,
        'Section 24 gives 5% per year on a partner&rsquo;s loan: 5% &times; ' + money(l) + ' = ' + money(l * 5 / 100) + '.');
    } },
    { skill: 'Act calculations', gen: function () {
      var p = pick(PAIRS), c1 = step(30000, 80000, 5000), c2 = step(5000, 25000, 5000), pr = step(20000, 60000, 200), eq = pr / 2, cr = pr * c1 / (c1 + c2);
      cr = Math.round(cr);
      return numMcq(p[0] + ' invested ' + money(c1) + ' and ' + p[1] + ' invested ' + money(c2) + '. They have no partnership agreement. Profit for the year was ' + money(pr) + '. What is ' + p[0] + '&rsquo;s share of the profit?',
        eq, [cr, eq + c1 * 5 / 100, pr],
        'Without an agreement the Act shares profit equally and gives no interest on capital: ' + money(pr) + ' &divide; 2 = ' + money(eq) + '.');
    } },
    { skill: 'Act calculations', gen: function () {
      var p = pick(PAIRS), loss = step(2000, 12000, 200);
      return numMcq(p[0] + ' and ' + p[1] + ' made a loss of ' + money(loss) + ' this year. They have no partnership agreement and no partner loans. How much of the loss does ' + p[1] + ' bear?',
        loss / 2, [loss, loss / 4, loss * 3 / 4],
        'The Act shares losses in the same way as profits: equally. ' + money(loss) + ' &divide; 2 = ' + money(loss / 2) + '.');
    } },
    { skill: 'why have an agreement', kind: 'mcq', q: 'Why is it advisable for partners to draw up a written partnership agreement?',
      options: ['It is written evidence of the terms, which helps to avoid disputes', 'It means the business no longer needs to keep accounting records', 'It guarantees that the partnership will make a profit each year', 'It means the partners will not have to pay any income tax'], answer: 0,
      why: 'If partners disagree, they can refer to what they signed. Clear written terms reduce arguments about profit shares, salaries and interest.' },
    { skill: 'why have an agreement', kind: 'mcq', q: 'Kira invested $60,000 and Luis $15,000 in a new partnership. They have no agreement. Why might Kira feel the result is unfair?',
      options: ['Profits are shared equally despite her larger capital', 'She must pay interest on her capital to Luis', 'Luis will receive a salary but she will not', 'Her share of profit will be cut by 5% a year'], answer: 0,
      why: 'Under the Act profit is shared equally and there is no interest on capital, so Kira gets no reward for investing four times as much. An agreement could give interest on capital or a different ratio.' },
    { skill: 'why have an agreement', kind: 'mcq', q: 'Which sentence best develops the point &ldquo;a partnership agreement sets out the profit-sharing ratio&rdquo;?',
      options: ['So each partner knows their share and arguments over profit are avoided', 'So the business can borrow from a bank at a lower rate of interest', 'So the partners can avoid paying any tax on their share of profit', 'So that the partnership does not need to keep a cash book at all'], answer: 0,
      why: 'Development explains the effect of the point. Knowing the ratio in advance means there is less to argue about when profit is divided.' },
    { skill: 'why have an agreement', kind: 'mcq', q: 'Two partners ask whether they should draw up a formal agreement. Which conclusion is correct and would earn the decision mark?',
      options: ['Yes, because it sets clear terms and avoids relying on the Act', 'No, because the Act already pays each of them a salary', 'No, because without one profit is shared in the capital ratio', 'Yes, because only then will the Act pay interest on capital'], answer: 0,
      why: 'A recommendation must be supported by correct reasoning. The Act gives no salaries, shares profit equally and gives no interest on capital, so the other three reasons are false.' },
    { skill: 'Act rules', kind: 'mcq', q: 'When does section 24 of the Partnership Act 1890 apply to a partnership?',
      options: ['When the partners have not agreed otherwise', 'Always, even if an agreement says otherwise', 'Only when the partnership makes a loss', 'Only when there are more than two partners'], answer: 0,
      why: 'The Act&rsquo;s rules are the fallback. If the partners have their own agreement on a matter, the agreement applies instead.' },
    { skill: 'why have an agreement', kind: 'mcq', q: 'Which of these is a drawback for a hard-working partner of relying on the Partnership Act 1890 instead of an agreement?',
      options: ['A partner who works more receives no salary for it', 'Partners receive 5% interest on their capital', 'Profits are shared in the ratio of capital', 'Partners are charged interest on their drawings'], answer: 0,
      why: 'The Act gives no salaries, so extra work is not rewarded. The other options describe rules the Act does not contain.' },
    { skill: 'Act calculations', gen: function () {
      var l = 2400 * rint(2, 8), m = rint(3, 9), start = 12 - m, int = l * 5 / 100 * m / 12, n = pick(NAMES);
      return num('A partnership&rsquo;s year ends on 31 December. There is no partnership agreement. On 1 ' + MONTHS[start] + ', ' + n + ' lent the business ' + money(l) + ' in addition to capital. Calculate the loan interest ' + n + ' is entitled to for the year. Give your answer in $.', int,
        'The loan was held for ' + m + ' months. Interest = ' + money(l) + ' &times; 5% &times; ' + m + '/12 = ' + money(int) + '.');
    } },
    { skill: 'Act calculations', gen: function () {
      var p = pick(PAIRS), pr = step(24000, 70000, 200), sal = step(6000, 12000, 500);
      return numMcq(p[0] + ' and ' + p[1] + ' have no partnership agreement. ' + p[0] + ' claims a salary of ' + money(sal) + ' for managing the business. Profit for the year was ' + money(pr) + ' and there are no partner loans. Applying the Act, how much profit is credited to ' + p[0] + '?',
        pr / 2, [sal + (pr - sal) / 2, pr / 2 + sal, (pr - sal) / 2],
        'The Act allows no partners&rsquo; salaries, so the whole ' + money(pr) + ' is shared equally: ' + money(pr / 2) + ' each.');
    } },
    { skill: 'agreement contents', kind: 'mcq', q: 'Which of these would a partnership agreement <b>not</b> normally cover?',
      options: ['The brand of computers the office buys', 'Interest charged on partners&rsquo; drawings', 'How profits and losses are shared', 'Salaries for partners who work in the business'], answer: 0,
      why: 'An agreement settles the partners&rsquo; rights and how profit is appropriated. Everyday buying decisions are not part of it.' },
    { skill: 'why have an agreement', kind: 'multi', q: 'Which are benefits of having a written partnership agreement?',
      options: ['Fewer disputes because the terms are written down', 'Each partner&rsquo;s rights are clear from the start', 'Partners can settle disagreements by checking it', 'The business can charge higher selling prices', 'The partnership no longer needs a bank account'], answers: [0, 1, 2],
      why: 'An agreement is written evidence of what was agreed, so it reduces disputes and helps settle them. It has no effect on prices or banking.' }
  ] };

  /* ---------------------------------------------------------------- ACC-PIR-11 */
  B['ACC-PIR-11'] = { title: 'Why keep a full set of accounting records', items: [
    { skill: 'what full records are', kind: 'mcq', q: 'What is meant by a business keeping a <b>full set of accounting records</b>?',
      options: ['Every transaction is recorded by double entry in books and ledgers', 'Only cash received and paid is recorded, in a simple notebook', 'Bank statements are filed each month and checked by the owner at the year end', 'A list of assets and liabilities is drawn up once a year'], answer: 0,
      why: 'Full records means double entry: every transaction goes through a book of prime entry into the ledgers, so a trial balance and statements can be produced.' },
    { skill: 'benefits', kind: 'multi', q: 'Which are genuine benefits of keeping a full set of accounting records?',
      options: ['Financial statements can be prepared more quickly', 'Up-to-date figures support better decisions', 'Amounts owed by customers can be chased promptly', 'The business is certain to make a profit', 'The business will not need to pay tax'], answers: [0, 1, 2],
      why: 'Full records make information ready and accurate, which speeds up statements, helps decisions and controls receivables. They cannot guarantee profit or remove tax.' },
    { skill: 'developing a reason', kind: 'mcq', q: 'A student writes: &ldquo;Full records let financial statements be prepared more often&hellip;&rdquo; Which ending best develops this point?',
      options: ['because the figures needed are already recorded and available', 'because the business will then make much more profit every single year', 'because statements are not needed if records are kept', 'because the owner can then stop counting the inventory'], answer: 0,
      why: 'Development explains why the point is true. The information is already in the books, so statements need no long reconstruction.' },
    { skill: 'drawbacks and judgement', kind: 'mcq', q: 'Which of these is a drawback of keeping a full set of accounting records?',
      options: ['It takes time and costs money to maintain', 'It makes a trial balance impossible to prepare', 'It hides errors from the owner', 'It reduces the accuracy of the profit figure'], answer: 0,
      why: 'Recording every transaction by double entry needs time, skill and sometimes a paid bookkeeper or software. The other options are not true.' },
    { skill: 'benefits', kind: 'mcq', q: 'How do full accounting records help a business control its trade receivables?',
      options: ['Each customer&rsquo;s balance is known, so overdue debts can be chased', 'Customers are no longer allowed to buy goods on credit', 'The provision for irrecoverable debts is no longer needed', 'Receivables are shown as a liability, so customers will pay them back sooner'], answer: 0,
      why: 'The receivables ledger shows exactly who owes what and for how long, so slow payers can be followed up before debts become irrecoverable.' },
    { skill: 'benefits', kind: 'mcq', q: 'How do full accounting records help a business manage its trade payables?',
      options: ['Each supplier&rsquo;s balance is known, so bills are paid on time', 'Suppliers will stop asking the business for payment of their invoices', 'The business can ignore discounts it is offered', 'Credit purchases are recorded as cash purchases'], answer: 0,
      why: 'The payables ledger shows what is owed to each supplier and when, so payments can be planned, discounts taken and good relations kept.' },
    { skill: 'benefits', kind: 'mcq', q: 'Which benefit of full records links to the trial balance?',
      options: ['A trial balance can be drawn up to help find some errors', 'A trial balance replaces the need for an income statement', 'A trial balance shows the value of the business to a buyer', 'A trial balance guarantees that no errors have been made'], answer: 0,
      why: 'Double entry makes a trial balance possible. If it does not balance, there is an error to find, although some errors do not affect the totals.' },
    { skill: 'benefits', kind: 'mcq', q: 'Why might a bank prefer a trader applying for a loan to keep full accounting records?',
      options: ['The figures are more reliable when judging if the loan can be repaid', 'The bank can then take a share of the business&rsquo;s profits as interest', 'The trader will not need to provide any security for the loan', 'The bank only lends to businesses that have no trade payables'], answer: 0,
      why: 'Complete, accurate records give lenders trustworthy evidence of profit and cash flow, so they can judge whether repayments are affordable.' },
    { skill: 'drawbacks and judgement', kind: 'mcq', q: 'Which conclusion best ends an &ldquo;Evaluate&rdquo; answer about a growing shop with many credit customers?',
      options: ['The benefits outweigh the cost, so the shop should keep full records', 'Full records are not worth it, because they guarantee no extra profit', 'The shop should keep records only of cash sales and cash expenses', 'The decision does not matter, as both methods give identical figures'], answer: 0,
      why: 'A judgement must weigh benefits against the drawback. With many credit customers, control of receivables and timely figures make the cost worthwhile.' },
    { skill: 'drawbacks and judgement', kind: 'mcq', q: 'Which of these is <b>not</b> a benefit of keeping a full set of accounting records?',
      options: ['It guarantees the business will make a profit', 'It helps the owner make better decisions', 'It allows statements to be prepared quickly', 'It helps control amounts owed by customers'], answer: 0,
      why: 'Good records give better information, but profit depends on trading. The other three are real benefits.' },
    { skill: 'what full records are', kind: 'mcq', q: 'Which problem is most likely for a trader who keeps only a cash book and bank statements?',
      options: ['Profit has to be worked out indirectly, so figures are slow to obtain', 'The trader is not allowed by law to open a bank account in the business name', 'The trader is not allowed to sell any goods on credit', 'Sales and purchases are recorded twice in the ledger'], answer: 0,
      why: 'Without double entry, profit must be reconstructed from changes in equity or from control-account workings, which takes time and may be less accurate.' },
    { skill: 'developing a reason', kind: 'mcq', q: 'Which answer both identifies a benefit and develops it?',
      options: ['Better decisions, because figures are accurate and up to date', 'Better decisions, because the decisions made will simply be better ones', 'Accurate figures and up-to-date figures', 'Statements are prepared; records are kept'], answer: 0,
      why: 'The first gives a reason (better decisions) and then its cause. The others repeat themselves or list facts without explaining an effect.' },
    { skill: 'developing a reason', kind: 'mcq', q: 'A question asks for <b>two</b> reasons to keep full records. Which pair counts as two different reasons?',
      options: ['Quicker financial statements; better control of credit customers', 'Faster financial statements; financial statements prepared in less time', 'Up-to-date figures; figures that are kept current', 'Better decisions; making decisions in a better way'], answer: 0,
      why: 'In each wrong pair the second point says the same thing as the first in other words, so it would only earn credit once.' },
    { skill: 'benefits', kind: 'mcq', q: 'How do full accounting records improve the owner&rsquo;s decision-making?',
      options: ['Accurate figures show which products or costs need attention', 'They remove the need to compare results with last year', 'They make every decision the owner takes correct', 'They let the owner set any selling price without ever checking the costs'], answer: 0,
      why: 'Detailed, current figures let the owner see where profit is made and where costs are rising, so decisions rest on evidence.' },
    { skill: 'benefits', kind: 'mcq', q: 'How can full accounting records help an owner detect theft or loss?',
      options: ['Cash and inventory can be checked against recorded figures', 'Employees are no longer able to handle any of the business cash', 'Inventory no longer needs to be counted at all', 'Customers are asked to pay only by cheque'], answer: 0,
      why: 'When every receipt, payment and purchase is recorded, actual cash and goods can be compared with what the records say should be there.' },
    { skill: 'benefits', kind: 'mcq', q: 'Why are tax authorities more likely to accept the profit of a trader who keeps full records?',
      options: ['The profit can be traced back to recorded transactions', 'Full records always show a lower profit figure', 'Traders with full records pay tax at a lower rate', 'Full records remove the need for an income statement'], answer: 0,
      why: 'Every figure in the statements can be checked to the books and source documents, so the profit is more trustworthy.' },
    { skill: 'drawbacks and judgement', kind: 'multi', q: 'Which of these are drawbacks of keeping a full set of accounting records?',
      options: ['Time spent recording every transaction', 'The cost of software or a bookkeeper', 'Training needed to use double entry', 'Faster year-end financial statements', 'Better control of receivables'], answers: [0, 1, 2],
      why: 'The drawbacks are the time, cost and skill needed. Faster statements and better control are benefits.' },
    { skill: 'drawbacks and judgement', kind: 'mcq', q: 'Which trader would gain most from moving from incomplete records to a full set of records?',
      options: ['A wholesaler selling on credit to 200 customers', 'A student selling homemade cards for cash twice a year', 'A market stall that sells only for cash one day a month', 'A hobby gardener selling spare plants to neighbours'], answer: 0,
      why: 'With many credit customers, the receivables ledger and up-to-date figures are vital. Very small cash-only activities gain little to set against the cost.' },
    { skill: 'what full records are', kind: 'mcq', q: 'Compared with incomplete records, how often can full records produce financial statements?',
      options: ['Whenever needed, such as monthly, as figures are ready', 'Only once a year, after a long reconstruction', 'Only when the bank asks to see the figures', 'Never, as statements need incomplete records'], answer: 0,
      why: 'Because the ledgers are up to date, a trial balance and statements can be produced at any time, for example monthly.' },
    { skill: 'benefits', kind: 'mcq', q: 'Which statement about full accounting records is correct?',
      options: ['They let the owner compare results from one period to the next', 'They remove the need for the business to have a bank account', 'They stop any errors from ever being made in the books', 'They mean inventory never needs to be counted again'], answer: 0,
      why: 'Consistent, complete records allow reliable comparison of revenue, costs and profit between periods. The other statements are false.' },
    { skill: 'drawbacks and judgement', kind: 'mcq', q: 'In an &ldquo;Evaluate&rdquo; question on keeping full records, what must follow the developed benefits?',
      options: ['A drawback weighed up and an overall judgement', 'A list of extra benefits with no development', 'A repeat of the wording of the question', 'A calculation of the profit for the year'], answer: 0,
      why: 'Evaluate needs balance and a conclusion: weigh a drawback such as time and cost against the benefits, then give a judgement.' },
    { skill: 'developing a reason', kind: 'mcq', q: 'Which development is weak because it only repeats the reason?',
      options: ['Full records help control receivables, because receivables are controlled', 'Full records help control receivables, because each balance is known', 'Full records give quicker statements, because figures are already recorded', 'Full records aid decisions, because the figures are accurate and current'], answer: 0,
      why: 'A development must add a cause or effect. Saying receivables are controlled &ldquo;because they are controlled&rdquo; adds nothing.' }
  ] };

  /* ---------------------------------------------------------------- ACC-REC-24 */
  var MIS = [
    ['a new delivery van', 'motor expenses', 1], ['a new shop counter', 'repairs', 1], ['an extension to the warehouse', 'building maintenance', 1], ['a new laptop for the office', 'office expenses', 1],
    ['repainting the shop front', 'premises', 0], ['servicing the delivery van', 'motor vehicles', 0], ['repairs to a broken window', 'buildings', 0], ['annual software licence fees', 'office equipment', 0]];

  B['ACC-REC-24'] = { title: 'Why the capital/revenue split matters', items: [
    { skill: 'capital treated as revenue', kind: 'mcq', q: 'A trader records the cost of a new delivery van as motor expenses. What is the effect on the financial statements for that year?',
      options: ['Profit understated and non-current assets understated', 'Profit overstated and non-current assets overstated', 'Profit understated and non-current assets overstated', 'Profit overstated and non-current assets understated', 'Profit unaffected, but non-current assets are understated'], answer: 0,
      why: 'The whole cost is charged as an expense, so expenses are too high and profit too low. The van is missing from the statement of financial position, so non-current assets are too low.' },
    { skill: 'revenue treated as capital', kind: 'mcq', q: 'The cost of repairs to a machine is added to the machinery account. What is the effect on the statement of financial position?',
      options: ['Non-current assets are overstated', 'Non-current assets are understated', 'Current liabilities are overstated', 'Inventory is understated'], answer: 0,
      why: 'Repairs only maintain the machine, so they are revenue expenditure. Adding them to machinery makes the asset look more valuable than it is.' },
    { skill: 'effects on both statements', gen: function () {
      var m = pick(MIS), n = pick(NAMES), cap = m[2] === 1;
      return { kind: 'mcq', q: n + ' recorded the cost of ' + m[0] + ' in the ' + m[1] + ' account. What is the effect on profit for the year and on non-current assets?',
        options: ['Profit understated; non-current assets understated', 'Profit overstated; non-current assets overstated', 'Profit understated; non-current assets overstated', 'Profit overstated; non-current assets understated', 'Profit is unaffected; only non-current assets are misstated'], answer: cap ? 0 : 1,
        why: cap ? 'This is capital expenditure wrongly charged as an expense: expenses are too high, so profit is too low, and the asset is missing, so non-current assets are too low.'
          : 'This is revenue expenditure wrongly treated as an asset: expenses are too low, so profit is too high, and non-current assets include a cost that is not an asset.' };
    } },
    { skill: 'matching and true and fair view', kind: 'mcq', q: 'Which accounting concept explains why the cost of a machine is spread over the years in which it is used?',
      options: ['Accruals (matching)', 'Business entity', 'Money measurement', 'Duality'], answer: 0,
      why: 'Accruals (matching) means costs are matched with the revenue they help to earn. A machine earns revenue for several years, so its cost is charged through depreciation over those years.' },
    { skill: 'matching and true and fair view', kind: 'mcq', q: 'Why does wrongly treating capital and revenue expenditure matter for the financial statements as a whole?',
      options: ['They would not give a true and fair view', 'They would no longer need to balance', 'They would include the owner&rsquo;s private assets', 'They would be prepared on a cash basis'], answer: 0,
      why: 'Misclassification misstates both profit and asset values, so the statements no longer give a true and fair view of performance and position.' },
    { skill: 'users and decisions', kind: 'mcq', q: 'A bank is deciding whether to lend to a trader who charged new equipment to expenses. How might the bank be misled?',
      options: ['Profit and assets look lower, so the business seems weaker than it is', 'Profit and assets look higher, so the business seems stronger than it is', 'Profit looks lower but assets look higher than they really are', 'The bank is not affected, since only expenses are changed'], answer: 0,
      why: 'Expensing capital items makes profit and non-current assets too low. The bank may refuse a loan the business could actually afford.' },
    { skill: 'users and decisions', kind: 'mcq', q: 'An owner treats repairs as capital expenditure. How might this mislead the owner?',
      options: ['Profit looks higher, so the owner may take too much in drawings', 'Profit looks lower, so the owner may cut selling prices much too far', 'Assets look lower, so the owner may sell assets too cheaply', 'Expenses look higher, so the owner may stop advertising'], answer: 0,
      why: 'Capitalising repairs keeps them out of expenses, so profit is overstated. The owner may believe there is more profit to withdraw than there really is.' },
    { skill: 'users and decisions', kind: 'mcq', q: 'Revenue expenditure is wrongly treated as capital expenditure. What is the likely effect on tax?',
      options: ['Profit is overstated, so too much tax may be paid', 'Profit is understated, so too little tax may be paid', 'Profit is overstated, so too little tax may be paid', 'Tax is unaffected, as only assets have changed'], answer: 0,
      why: 'Expenses are too low, so taxable profit is too high and the business may pay more tax than it should.' },
    { skill: 'capital treated as revenue', kind: 'mcq', q: 'A machine bought this year is wrongly charged in full as an expense. What happens to the profit of <b>later</b> years?',
      options: ['It is overstated, as no depreciation is charged on the machine', 'It is understated, as depreciation is charged twice on the machine', 'It is unaffected, as the error only affects this year', 'It is understated, as the machine is expensed again'], answer: 0,
      why: 'The machine never appears as an asset, so no depreciation is charged in the years it is used. Those years&rsquo; expenses are too low and profit too high.' },
    { skill: 'building the answer', kind: 'mcq', q: 'Which sentence best develops the point &ldquo;wrong treatment would misstate profit for the year&rdquo;?',
      options: ['Revenue costs belong to this year, so moving them changes profit', 'Capital expenditure is spending on non-current assets such as machinery', 'The statement of financial position must always balance at the year end', 'Revenue expenditure is spending on running costs such as wages'], answer: 0,
      why: 'Development explains why profit changes. The other sentences are definitions or general facts that do not explain the effect.' },
    { skill: 'building the answer', kind: 'mcq', q: 'Which concluding sentence would earn the final mark in an answer on the capital/revenue distinction?',
      options: ['Correct treatment is needed so that the statements give a true and fair view', 'Capital expenditure is usually larger than revenue expenditure in a single year', 'Revenue expenditure should always be kept as low as possible by traders', 'Capital expenditure should be avoided because it reduces the bank balance'], answer: 0,
      why: 'A conclusion pulls the points together: correct treatment gives accurate profit and asset values, which is a true and fair view.' },
    { skill: 'capital treated as revenue', kind: 'mcq', q: 'A student writes: &ldquo;If a capital item is treated as revenue, profit is overstated.&rdquo; What is wrong?',
      options: ['Expenses are too high, so profit is too low', 'Expenses are too low, so profit is understated', 'Only assets are affected, not profit', 'Revenue is too high, so profit is overstated'], answer: 0,
      why: 'Treating a capital item as revenue charges it all as an expense this year. Extra expense means lower profit, so profit is understated.' },
    { skill: 'matching and true and fair view', kind: 'multi', q: 'Which of these are valid reasons why it is important to distinguish capital and revenue expenditure?',
      options: ['Profit for the year is reported correctly', 'Non-current assets are shown at the right value', 'Costs are matched with the revenue they help earn', 'Inventory can be counted more quickly', 'Selling prices can be raised more easily'], answers: [0, 1, 2],
      why: 'Correct treatment gets profit right, values non-current assets correctly and applies the accruals (matching) concept. It has nothing to do with counting inventory or prices.' },
    { skill: 'users and decisions', kind: 'mcq', q: 'A trader treats similar spending as capital one year and as revenue the next. What is the main problem for users?',
      options: ['Results cannot be compared fairly between the years', 'The trial balance will no longer agree in either year', 'The trader&rsquo;s drawings will be recorded twice', 'Inventory will be valued at selling price'], answer: 0,
      why: 'Profit and assets would change because of the treatment, not because of performance, so year-on-year comparison would be misleading.' },
    { skill: 'matching and true and fair view', kind: 'mcq', q: 'How is capital expenditure charged against profit?',
      options: ['Gradually, through depreciation over its useful life', 'In full, in the year that it is paid for', 'Only in the year the asset is finally sold', 'Never, because it stays at cost in the asset account forever'], answer: 0,
      why: 'A non-current asset benefits several years, so its cost is spread through depreciation. Revenue expenditure, in contrast, is charged in full in the year.' },
    { skill: 'capital treated as revenue', kind: 'mcq', q: 'A trader charged the cost of a shop extension to building maintenance. What is the effect on the statement of financial position?',
      options: ['Non-current assets and equity are both understated', 'Non-current assets understated; equity overstated', 'Non-current assets overstated; equity understated', 'Non-current assets and equity are both overstated', 'Non-current assets understated, but equity is unaffected'], answer: 0,
      why: 'The extension is missing from non-current assets. Profit is too low because of the extra expense, and lower profit means lower closing equity.' },
    { skill: 'users and decisions', kind: 'mcq', q: 'In a partnership, a new machine is wrongly charged as an expense. How are the partners affected this year?',
      options: ['Each partner&rsquo;s share of profit is understated', 'Each partner&rsquo;s share of profit is overstated', 'Only the partners&rsquo; capital accounts change', 'The profit-sharing ratio has to be changed'], answer: 0,
      why: 'Profit is understated, so the residual profit shared between the partners, and each partner&rsquo;s share, is too low.' },
    { skill: 'capital treated as revenue', kind: 'mcq', q: 'A delivery van is wrongly charged to motor expenses. Which figure in the income statement is affected?',
      options: ['Profit for the year, but not gross profit', 'Gross profit only', 'Revenue and gross profit', 'Cost of sales and gross profit'], answer: 0,
      why: 'Motor expenses are shown below gross profit, so gross profit is unchanged but profit for the year is too low.' },
    { skill: 'building the answer', kind: 'mcq', q: 'Which sentence best uses an example in an &ldquo;Advise&rdquo; answer for Nia, who owns a bakery?',
      options: ['If Nia records her new oven as an expense, profit and assets will be too low', 'Capital expenditure is money spent on buying or improving non-current assets', 'All businesses must follow accounting rules when they prepare their accounts', 'Revenue expenditure includes items such as wages, rent and electricity bills'], answer: 0,
      why: 'Advise answers should refer to the trader. Using Nia&rsquo;s oven shows the effect of misclassification on her own profit and assets.' },
    { skill: 'users and decisions', kind: 'mcq', q: 'This year a trader wrongly charged a new machine to expenses. Comparing profit with last year, what false conclusion might she draw?',
      options: ['That performance has worsened, when the fall is caused by the error', 'That performance has improved, when the rise is caused by the error', 'That sales have risen, when only the expenses have changed', 'That her assets have risen, when they have actually fallen'], answer: 0,
      why: 'The extra expense lowers profit, so it looks as if trading got worse. The real cause is the misclassification.' },
    { skill: 'building the answer', kind: 'mcq', q: 'Which of these statements is only a definition and would not earn a development mark?',
      options: ['Capital expenditure is spending on non-current assets', 'Expensing a machine understates this year&rsquo;s profit', 'Capitalising repairs overstates non-current assets', 'Wrong treatment can mislead lenders about profit'], answer: 0,
      why: 'Development marks need an effect of misclassification. The first option simply defines capital expenditure; the other three explain a consequence.' },
    { skill: 'revenue treated as capital', kind: 'mcq', q: 'The cost of fuel for the delivery vans for the year is added to the motor vehicles account. What is the effect on profit for the year?',
      options: ['Overstated, because an expense has been left out', 'Understated, because an expense has been added', 'Unchanged, because only the asset is affected', 'Understated, because depreciation is too low'], answer: 0,
      why: 'Fuel is a running cost, so it is revenue expenditure. Leaving it out of expenses makes profit too high.' }
  ] };
})();
