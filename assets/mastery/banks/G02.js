/* Group G02 mastery bank: Double entry and the ledgers; Ledger accounts and the cash book. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi, step) { step = step || 1; return lo + step * Math.floor(Math.random() * (Math.floor((hi - lo) / step) + 1)); }
  function sample(a, n) { a = a.slice(); var out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); return out; }
  function sep(n) { var p = String(Math.abs(n)).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (n < 0 ? '-' : '') + p.join('.'); }
  function money(n) { return '$' + sep(n); }
  function mc(q, right, wrong, why) { return { kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why }; }
  function multi(q, rights, wrongs, why) { return { kind: 'multi', q: q, options: rights.concat(wrongs), answers: rights.map(function (_, i) { return i; }), why: why }; }
  function num(q, ans, why) { return { kind: 'num', q: q, answer: ans, unit: '$', display: sep(ans), why: why }; }
  function S(skill, o) { o.skill = skill; return o; }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  // Two-sided ledger account: rows are [date, details, amount]; amounts are numbers or ''.
  function account(dr, cr) {
    var n = Math.max(dr.length, cr.length), rows = [];
    function cell(r, i) { return r ? (i === 2 ? (typeof r[2] === 'number' ? sep(r[2]) : r[2]) : r[i]) : ''; }
    for (var i = 0; i < n; i++) rows.push([cell(dr[i], 0), cell(dr[i], 1), cell(dr[i], 2), cell(cr[i], 0), cell(cr[i], 1), cell(cr[i], 2)]);
    return table(['Date', 'Details', '$', 'Date', 'Details', '$'], rows);
  }
  // Three-column cash book: rows are [date, details, discount, cash, bank].
  function cashBook(dr, cr) {
    var n = Math.max(dr.length, cr.length), rows = [];
    function f(v) { return v === '' || v == null ? '' : (typeof v === 'number' ? sep(v) : v); }
    function side(r) { return r ? [r[0], r[1], f(r[2]), f(r[3]), f(r[4])] : ['', '', '', '', '']; }
    for (var i = 0; i < n; i++) rows.push(side(dr[i]).concat(side(cr[i])));
    return table(['Date', 'Details', 'Disc $', 'Cash $', 'Bank $', 'Date', 'Details', 'Disc $', 'Cash $', 'Bank $'], rows);
  }
  function poss(n) { return /s$/.test(n) ? n + '’' : n + '’s'; }
  function dc(d, c) { return 'Debit ' + d + ', credit ' + c; }

  var CUST = ['Amara Diallo', 'Kwame Asante', 'Lina Haddad', 'Ruben Ortega', 'Priya Nair', 'Tomasz Wolski', 'Hana Sato', 'Femi Adeyemi', 'Isla Brennan', 'Yusuf Demir'];
  var SUPP = ['Copperleaf Ltd', 'Northgate Wholesale', 'Bluefin Traders', 'Harbourline Supplies', 'Greystone Fabrics', 'Marigold Imports', 'Kestrel Hardware', 'Silverbirch Paper'];
  var OWN = ['Zara', 'Mateo', 'Aisha', 'Nikhil', 'Chloe', 'Dmitri', 'Leila', 'Owen', 'Farah', 'Kenji'];
  var BIZ = ['bakery', 'bicycle shop', 'stationery shop', 'garden centre', 'phone repair shop', 'clothing boutique', 'hardware store', 'pet shop'];
  var MONTHS = [['March', 31, 'April'], ['April', 30, 'May'], ['June', 30, 'July'], ['September', 30, 'October'], ['October', 31, 'November'], ['January', 31, 'February']];
  var LED = { R: 'Receivables ledger', P: 'Payables ledger', N: 'Nominal (general) ledger' };
  var PRIME = ['Sales day book', 'Purchases day book', 'General journal', 'Sales returns day book', 'Purchases returns day book'];

  // =====================================================================
  // ACC-REC-15 Which ledger holds which account
  // =====================================================================
  var NOMINAL = [['Sales', 'income'], ['Purchases', 'the cost of goods bought for resale'], ['Rent', 'an expense'], ['Wages', 'an expense'], ['Motor vehicles', 'a non-current asset'],
    ['Drawings', 'the owner’s withdrawals'], ['Bank loan', 'a liability'], ['Purchases returns', 'returns to suppliers'], ['Sales returns', 'returns from customers'],
    ['Equity', 'the owner’s capital'], ['Electricity', 'an expense'], ['Fixtures and fittings', 'a non-current asset']];
  B['ACC-REC-15'] = { title: 'Which ledger holds which account', items: [
    { skill: 'personal-accounts', gen: function () {
      var c = pick(CUST), o = pick(OWN), b = pick(BIZ);
      return mc(o + ' owns a ' + b + '. ' + c + ' buys goods from the business regularly and pays 30 days after each invoice. In which part of ' + o + '’s books is ' + c + '’s account kept?',
        LED.R, [LED.P, LED.N, pick(['Sales day book', 'General journal'])],
        c + ' is a credit customer, so the personal account is kept in the receivables ledger. A day book or the journal is a book of prime entry, not a ledger.');
    } },
    { skill: 'personal-accounts', gen: function () {
      var s = pick(SUPP), o = pick(OWN), b = pick(BIZ);
      return mc(o + '’s ' + b + ' buys stock on credit from ' + s + ' and settles the account at the end of each month. Where is the account of ' + s + ' kept in ' + o + '’s books?',
        LED.P, [LED.R, LED.N, 'Purchases day book'],
        s + ' sells to the business on credit, so it is a credit supplier. Credit suppliers’ accounts are kept in the payables ledger.');
    } },
    { skill: 'nominal-accounts', gen: function () {
      var a = pick(NOMINAL), o = pick(OWN);
      return mc('In which ledger would ' + o + ' keep the <b>' + a[0] + '</b> account?', LED.N, [LED.R, LED.P, pick(PRIME)],
        'The ' + a[0].toLowerCase() + ' account records ' + a[1] + ', not a customer or a supplier, so it is an impersonal account kept in the nominal (general) ledger.');
    } },
    S('personal-accounts', mc('Which accounts make up the receivables ledger?', 'Accounts of customers who buy goods on credit',
      ['Accounts of suppliers who sell goods on credit', 'The sales account and the sales returns account', 'A record of every cash sale made in the period'],
      'The receivables ledger holds one personal account for each credit customer, showing how much that customer owes. Sales and sales returns are nominal ledger accounts.')),
    S('personal-accounts', mc('Which of these accounts would be found in the payables ledger of a furniture workshop?', 'Timberline Ltd, which supplies wood on credit',
      ['A hotel that buys tables from the workshop on credit', 'The purchases account for wood bought', 'The bank loan used to buy machinery'],
      'Timberline Ltd sells to the workshop on credit, so it is a credit supplier and its account is in the payables ledger. The hotel is a credit customer (receivables ledger); purchases and the bank loan are nominal ledger accounts.')),
    S('ledger-vs-prime-entry', mc('Which of these is a book of prime entry rather than a ledger?', 'Sales day book', ['Payables ledger', 'Receivables ledger', 'Nominal ledger'],
      'Day books are books of prime entry: transactions are listed there first and then posted to the accounts in the ledgers.')),
    S('ledger-purpose', mc('What is the main purpose of the receivables ledger?', 'To show how much each credit customer owes the business',
      ['To show how much the business owes each credit supplier', 'To list credit sales invoices before they are posted', 'To hold the sales, purchases and expense accounts'],
      'The receivables ledger keeps a separate account for every credit customer, so the amount each one owes can be seen at any time.')),
    S('ledger-purpose', mc('A trader wants to find out quickly how much she owes each of her credit suppliers. Where should she look?', LED.P, [LED.R, LED.N, 'Purchases day book'],
      'Each credit supplier has a personal account in the payables ledger, and its balance is the amount owed to that supplier.')),
    S('ledger-purpose', mc('Which statement best describes the nominal (general) ledger?', 'It holds all accounts other than customer and supplier accounts',
      ['It holds the personal accounts of every credit customer of the business', 'It holds the personal accounts of every credit supplier of the business', 'It lists credit invoices in date order before they are posted'],
      'The nominal ledger holds the impersonal accounts: income, expenses, assets, liabilities, equity and drawings. Personal accounts are in the receivables and payables ledgers.')),
    S('personal-accounts', mc('An older textbook refers to the “creditors ledger”. What is this ledger called in International GCSE Accounting?', 'Payables ledger', ['Receivables ledger', 'Nominal ledger', 'Purchases day book'],
      'Creditors are now called trade payables, so the creditors ledger is the payables ledger. The old “debtors ledger” is the receivables ledger.')),
    { skill: 'transaction-ledgers', gen: function () {
      var s = pick(SUPP), o = pick(OWN);
      return mc(o + ' returns faulty goods to ' + s + ', a credit supplier. In which ledgers of ' + o + '’s business is this transaction recorded?',
        'Payables ledger and nominal ledger', ['Receivables ledger and nominal ledger', 'Payables ledger and receivables ledger', 'Nominal ledger only'],
        'Debit ' + s + ' (a supplier, in the payables ledger) and credit purchases returns (in the nominal ledger).');
    } },
    { skill: 'transaction-ledgers', gen: function () {
      var c = pick(CUST), o = pick(OWN);
      return mc(c + ', a credit customer, sends back damaged goods to ' + o + '’s business. In which ledgers of the business is this recorded?',
        'Receivables ledger and nominal ledger', ['Payables ledger and nominal ledger', 'Receivables ledger and payables ledger', 'Receivables ledger only'],
        'Debit sales returns (nominal ledger) and credit ' + c + '’s account (receivables ledger), because the customer now owes less.');
    } },
    { skill: 'transaction-ledgers', gen: function () {
      var c = pick(CUST), o = pick(OWN), b = pick(BIZ);
      return mc(o + '’s ' + b + ' sells goods on credit to ' + c + '. Which ledgers of the business are used to record the sale?',
        'Receivables ledger and nominal ledger', ['Payables ledger and nominal ledger', 'Receivables ledger and payables ledger', 'Nominal ledger only'],
        'Debit ' + c + ' in the receivables ledger (the customer now owes the money) and credit sales in the nominal ledger.');
    } },
    S('transaction-ledgers', mc('Which transaction needs an entry in a business’s receivables ledger?', 'Goods sold on credit to a customer',
      ['Goods sold to a customer for cash', 'An old van sold on credit to a garage', 'Goods bought on credit from a supplier'],
      'Only credit sales of goods create or change a customer account in the receivables ledger. A cash sale has no customer account, and selling a non-current asset is not a sale of goods.')),
    S('transaction-ledgers', mc('Which transaction needs an entry in a business’s payables ledger?', 'Paying a credit supplier by cheque',
      ['Buying goods for resale and paying in cash', 'Receiving a cheque from a credit customer', 'Paying the monthly rent by cheque'],
      'Paying a credit supplier reduces what is owed, so the supplier’s account in the payables ledger is debited. A cash purchase never goes through a supplier account.')),
    S('nominal-accounts', multi('Which of these accounts are kept in the nominal ledger?', ['Sales returns', 'Wages', 'Drawings', 'Bank loan'], ['Fernhill Ltd (a credit supplier)', 'Dina Rao (a credit customer)'],
      'Sales returns, wages, drawings and the bank loan are impersonal accounts, so they are in the nominal ledger. Fernhill Ltd belongs in the payables ledger and Dina Rao in the receivables ledger.')),
    S('ledger-vs-prime-entry', multi('Which of these are books of prime entry, not ledgers?', ['Sales day book', 'General journal', 'Purchases returns day book'], ['Receivables ledger', 'Nominal ledger', 'Payables ledger'],
      'Day books and the journal are where transactions are first recorded. The receivables, payables and nominal ledgers hold the accounts they are posted to.')),
    { skill: 'personal-accounts', gen: function () {
      var c = pick(CUST), o = pick(OWN);
      return mc(c + ' runs a café and buys cakes on credit from ' + o + '’s bakery. In the café’s own books, where is the account of ' + o + '’s bakery kept?',
        LED.P, [LED.R, LED.N, 'Sales day book'],
        'From the café’s point of view the bakery is a credit supplier, so its account goes in the café’s payables ledger. In the bakery’s books it would be the other way round.');
    } },
    S('ledger-vs-prime-entry', mc('Which statement about day books and ledgers is correct?', 'Day books are books of prime entry, not ledgers',
      ['Customer accounts are kept in the sales day book', 'The nominal ledger is a book of prime entry', 'Supplier accounts are kept in the purchases day book'],
      'Transactions are first listed in a day book and then posted to accounts in the ledgers. Customer and supplier accounts are kept in the receivables and payables ledgers.')),
    S('nominal-accounts', mc('Which statement is correct?', 'The sales account is kept in the nominal ledger',
      ['The sales account is kept in the receivables ledger', 'The purchases account is kept in the payables ledger', 'A credit supplier’s account is kept in the nominal ledger'],
      'Sales and purchases are impersonal accounts, so they are in the nominal ledger. Only the personal accounts of credit customers and suppliers go in the receivables and payables ledgers.')),
    S('transaction-ledgers', mc('Kito Electronics sells its unwanted delivery van on credit to a motor dealer. Why is no account opened for the dealer in the receivables ledger?', 'The van is a non-current asset, not goods for resale',
      ['The sale was not made for cash', 'Motor dealers are always treated as suppliers', 'Vans are recorded in the payables ledger'],
      'The receivables ledger is for customers who buy the business’s goods on credit. Selling a non-current asset is not a sale of goods, so it is not recorded there.')),
    { skill: 'nominal-accounts', gen: function () {
      var a = pick(NOMINAL), o = pick(OWN), b = pick(BIZ), cs = sample(CUST, 2), s = pick(SUPP);
      return mc('Which of these accounts would be found in the nominal ledger of ' + o + '’s ' + b + '?', a[0],
        [cs[0] + ' (a credit customer)', s + ' (a credit supplier)', cs[1] + ' (a credit customer)'],
        'The ' + a[0].toLowerCase() + ' account is impersonal, so it is in the nominal ledger. Credit customers are in the receivables ledger and credit suppliers in the payables ledger.');
    } },
    S('ledger-purpose', mc('Why do most businesses divide the ledger into three parts?', 'So work can be shared and balances found quickly',
      ['Because the law requires three separate ledgers', 'So that cash sales and credit sales are kept apart', 'So that the trial balance will always agree'],
      'Splitting the ledger into receivables, payables and nominal ledgers lets different people work on it at once and makes it quick to find what each customer or supplier owes.'))
  ] };

  // =====================================================================
  // ACC-REC-16 The accounting equation and the dual effect
  // =====================================================================
  function startPosition() {
    var A = rint(40, 180) * 500, L = rint(10, 45) * 200;
    if (L > A * 0.45) L = Math.round(A * 0.3 / 100) * 100;
    return { A: A, L: L, E: A - L };
  }
  function posTable(p) { return table(['Total assets', 'Total liabilities', 'Equity'], [[money(p.A), money(p.L), money(p.E)]]); }
  var ASSET_POOL = ['Premises', 'Fixtures and fittings', 'Motor vehicles', 'Inventory', 'Trade receivables', 'Cash in hand'];
  var LIAB_POOL = ['Trade payables', 'Bank loan', 'Bank overdraft', 'Other payables'];
  var DUAL = [
    ['bought shop equipment on credit', 'Assets increase and liabilities increase', 'equipment (an asset) goes up and the amount owed to the supplier (a liability) goes up by the same amount'],
    ['took out a bank loan, which was paid into the business bank account', 'Assets increase and liabilities increase', 'the bank balance (an asset) goes up and the loan (a liability) goes up'],
    ['paid a credit supplier by bank transfer', 'Assets decrease and liabilities decrease', 'the bank balance (an asset) goes down and trade payables (a liability) go down'],
    ['repaid part of the bank loan by cheque', 'Assets decrease and liabilities decrease', 'the bank balance goes down and the loan owed goes down'],
    ['paid some personal savings into the business bank account', 'Assets increase and equity increases', 'the bank balance goes up and the owner’s investment (equity) goes up'],
    ['brought a private car into the business to use as a delivery vehicle', 'Assets increase and equity increases', 'motor vehicles go up and equity goes up because the owner has invested more'],
    ['withdrew cash from the till for personal use', 'Assets decrease and equity decreases', 'cash goes down and drawings reduce the owner’s equity'],
    ['received a cheque from a credit customer', 'One asset increases and another asset decreases', 'the bank balance goes up and trade receivables go down, so total assets do not change'],
    ['bought a computer and paid by cheque', 'One asset increases and another asset decreases', 'equipment goes up and the bank balance goes down by the same amount']];
  var DUAL_OPTS = ['Assets increase and liabilities increase', 'Assets decrease and liabilities decrease', 'Assets increase and equity increases', 'Assets decrease and equity decreases', 'One asset increases and another asset decreases'];

  B['ACC-REC-16'] = { title: 'The accounting equation and the dual effect', items: [
    { skill: 'missing-figure', gen: function () {
      var p = startPosition(), o = pick(OWN);
      return num(o + '’s business has total assets of ' + money(p.A) + ' and total liabilities of ' + money(p.L) + '. Calculate the owner’s equity. Give your answer in $.', p.E,
        'Equity = Assets − Liabilities = ' + money(p.A) + ' − ' + money(p.L) + ' = ' + money(p.E) + '.');
    } },
    { skill: 'missing-figure', gen: function () {
      var p = startPosition(), o = pick(OWN);
      return num('The statement of financial position of ' + o + '’s ' + pick(BIZ) + ' shows total assets of ' + money(p.A) + ' and equity of ' + money(p.E) + '. Calculate the total liabilities. Give your answer in $.', p.L,
        'Liabilities = Assets − Equity = ' + money(p.A) + ' − ' + money(p.E) + ' = ' + money(p.L) + '.');
    } },
    { skill: 'missing-figure', gen: function () {
      var p = startPosition();
      return num('A business has liabilities of ' + money(p.L) + ' and the owner’s equity is ' + money(p.E) + '. Calculate the total assets. Give your answer in $.', p.A,
        'Assets = Liabilities + Equity = ' + money(p.L) + ' + ' + money(p.E) + ' = ' + money(p.A) + '.');
    } },
    { skill: 'missing-figure', gen: function () {
      var RANGE = { 'Premises': [160, 600], 'Fixtures and fittings': [8, 60], 'Motor vehicles': [20, 120], 'Inventory': [12, 80], 'Trade receivables': [4, 48], 'Cash in hand': [1, 6],
        'Trade payables': [4, 40], 'Bank loan': [20, 120], 'Other payables': [1, 8] };
      var as = sample(ASSET_POOL, 4), ls = sample(['Trade payables', 'Bank loan', 'Other payables'], 2);
      var av = as.map(function (n) { return rint(RANGE[n][0], RANGE[n][1]) * 250; }), lv = ls.map(function (n) { return rint(RANGE[n][0], RANGE[n][1]) * 250; });
      var ta = av.reduce(function (s, x) { return s + x; }, 0), tl = lv.reduce(function (s, x) { return s + x; }, 0);
      while (tl > ta * 0.7) { lv = lv.map(function (v) { return Math.max(250, Math.round(v / 500) * 250); }); tl = lv[0] + lv[1]; }
      var rows = as.map(function (n, i) { return [n, money(av[i])]; }).concat(ls.map(function (n, i) { return [n, money(lv[i])]; }));
      rows = sample(rows, rows.length);
      return num('A trader lists these balances.' + table(['Item', '$'], rows) + 'Calculate the trader’s equity. Give your answer in $.', ta - tl,
        'Assets = ' + as.join(', ') + ' = ' + money(ta) + '. Liabilities = ' + ls.join(' and ') + ' = ' + money(tl) + '. Equity = ' + money(ta) + ' − ' + money(tl) + ' = ' + money(ta - tl) + '.');
    } },
    { skill: 'missing-figure', gen: function () {
      var inv = rint(8, 40) * 250, rec = rint(4, 24) * 250, prem = rint(60, 160) * 500, pay = rint(4, 20) * 250, od = rint(2, 12) * 250, loan = rint(20, 80) * 250;
      var ta = inv + rec + prem, E = ta - pay - od - loan;
      return num('On 31 March a shop has premises ' + money(prem) + ', inventory ' + money(inv) + ', trade receivables ' + money(rec) + ', trade payables ' + money(pay) + ' and a bank overdraft of ' + money(od) + '. The owner’s equity is ' + money(E) + '. The only other item is a bank loan. Calculate the bank loan. Give your answer in $.', loan,
        'Liabilities = Assets − Equity = ' + money(ta) + ' − ' + money(E) + ' = ' + money(ta - E) + '. The overdraft is a liability, so loan = ' + money(ta - E) + ' − ' + money(pay) + ' − ' + money(od) + ' = ' + money(loan) + '.');
    } },
    { skill: 'missing-figure', gen: function () {
      var ps = [startPosition(), startPosition(), startPosition()], names = sample(['Business P', 'Business Q', 'Business R'], 3), k = rint(0, 2);
      var rows = ps.map(function (p, i) { var r = [names[i], money(p.A), money(p.L), money(p.E)]; r[1 + ((i + k) % 3)] = '?'; return r; });
      var ask = rint(0, 2), col = (ask + k) % 3, p = ps[ask], ans = [p.A, p.L, p.E][col], lab = ['assets', 'liabilities', 'equity'][col];
      var how = col === 0 ? 'Assets = Liabilities + Equity = ' + money(p.L) + ' + ' + money(p.E) : col === 1 ? 'Liabilities = Assets − Equity = ' + money(p.A) + ' − ' + money(p.E) : 'Equity = Assets − Liabilities = ' + money(p.A) + ' − ' + money(p.L);
      return num('Each row of the table is missing one figure.' + table(['', 'Assets $', 'Liabilities $', 'Equity $'], rows) + 'What is the missing ' + lab + ' figure for ' + names[ask] + '? Give your answer in $.', ans,
        how + ' = ' + money(ans) + '.');
    } },
    { skill: 'after-transaction', gen: function () {
      var p = startPosition(), x = rint(4, 30) * 100;
      return num('A business starts the day with this position.' + posTable(p) + 'It then buys a display cabinet costing ' + money(x) + ' on credit. What are the total assets after this transaction? Give your answer in $.', p.A + x,
        'The cabinet is a new asset and the amount owed is a new liability, so assets rise by ' + money(x) + ': ' + money(p.A) + ' + ' + money(x) + ' = ' + money(p.A + x) + '.');
    } },
    { skill: 'after-transaction', gen: function () {
      var p = startPosition(), x = rint(2, 20) * 50;
      return num('A trader’s position is shown below.' + posTable(p) + 'The trader returns goods costing ' + money(x) + ' to a credit supplier. What are the total liabilities after this transaction? Give your answer in $.', p.L - x,
        'Returning goods to a credit supplier reduces trade payables (and inventory) by ' + money(x) + ': ' + money(p.L) + ' − ' + money(x) + ' = ' + money(p.L - x) + '.');
    } },
    { skill: 'after-transaction', gen: function () {
      var p = startPosition(), x = rint(5, 40) * 200, o = pick(OWN);
      return num(o + '’s business has this position.' + posTable(p) + o + ' then pays ' + money(x) + ' of personal savings into the business bank account as extra capital. What is the equity after this transaction? Give your answer in $.', p.E + x,
        'Bank (an asset) and equity both rise by ' + money(x) + ': ' + money(p.E) + ' + ' + money(x) + ' = ' + money(p.E + x) + '.');
    } },
    { skill: 'after-transaction', gen: function () {
      var p = startPosition(), x = rint(4, 25) * 100;
      if (x >= p.L) x = Math.round(p.L / 200) * 100;
      return num('A business has this position.' + posTable(p) + 'It pays ' + money(x) + ' to a credit supplier by bank transfer. What are the total assets after this payment? Give your answer in $.', p.A - x,
        'Bank (an asset) and trade payables (a liability) both fall by ' + money(x) + '. Assets = ' + money(p.A) + ' − ' + money(x) + ' = ' + money(p.A - x) + '.');
    } },
    { skill: 'after-transaction', gen: function () {
      var p = startPosition(), a = rint(4, 20) * 100, b = rint(2, 15) * 100, c = rint(2, 8) * 100, ask = pick(['assets', 'liabilities', 'equity']);
      var res = { assets: p.A + a - c, liabilities: p.L + a, equity: p.E - c }[ask];
      var why = 'Inventory bought on credit: assets +' + money(a) + ', liabilities +' + money(a) + '. Customer’s payment: one asset up, another down, no change in totals. Cash drawings: assets −' + money(c) + ', equity −' + money(c) + '. ';
      why += ask === 'assets' ? 'Assets = ' + money(p.A) + ' + ' + money(a) + ' − ' + money(c) + ' = ' + money(res) + '.' : ask === 'liabilities' ? 'Liabilities = ' + money(p.L) + ' + ' + money(a) + ' = ' + money(res) + '.' : 'Equity = ' + money(p.E) + ' − ' + money(c) + ' = ' + money(res) + '.';
      return num('A business starts the week with this position.' + posTable(p) + 'During the week:<br>• it buys inventory on credit, ' + money(a) + '<br>• it receives ' + money(b) + ' by cheque from a credit customer<br>• the owner takes ' + money(c) + ' cash for personal use.<br>Calculate the total ' + ask + ' at the end of the week. Give your answer in $.', res, why);
    } },
    { skill: 'after-transaction', gen: function () {
      var p = startPosition(), x = rint(3, 30) * 20, o = pick(OWN);
      return num(o + '’s grocery business has this position.' + posTable(p) + o + ' takes goods costing ' + money(x) + ' from the shelves for family use. What is the equity after this? Give your answer in $.', p.E - x,
        'Goods taken by the owner are drawings: inventory (an asset) falls and equity falls by ' + money(x) + '. ' + money(p.E) + ' − ' + money(x) + ' = ' + money(p.E - x) + '.');
    } },
    S('equation-forms', mc('Which of these is a correct form of the accounting equation?', 'Assets − Equity = Liabilities', ['Equity − Liabilities = Assets', 'Assets + Liabilities = Equity', 'Liabilities − Assets = Equity'],
      'Start from Assets = Liabilities + Equity and take equity from both sides: Assets − Equity = Liabilities. Test with assets 100, liabilities 30, equity 70: 100 − 70 = 30.')),
    S('equation-forms', mc('Three of these are correct versions of the accounting equation. Which one is <b>not</b> correct?', 'Liabilities − Equity = Assets', ['Equity + Liabilities = Assets', 'Assets − Liabilities = Equity', 'Assets − Equity = Liabilities'],
      'Test with assets 100, liabilities 30 and equity 70. Liabilities − Equity = 30 − 70 = −40, not 100. The other three all work.')),
    S('equation-forms', mc('Which equation gives a missing liabilities figure?', 'Liabilities = Assets − Equity', ['Liabilities = Assets + Equity', 'Liabilities = Equity − Assets'],
      'Assets = Liabilities + Equity, so subtracting equity from both sides gives Liabilities = Assets − Equity.')),
    { skill: 'dual-effect', gen: function () {
      var d = pick(DUAL), o = pick(OWN);
      var wrong = sample(DUAL_OPTS.filter(function (x) { return x !== d[1]; }), 3);
      return mc(o + ', a sole trader, ' + d[0] + '. What is the effect on the accounting equation?', d[1], wrong, 'Two items change: ' + d[2] + '. The equation still balances.');
    } },
    S('dual-effect', mc('A transaction increased total assets by $4,500 and total liabilities by $4,500. Which transaction was it?', 'Bought a machine on credit',
      ['Bought a machine and paid by cheque', 'Owner paid in $4,500 of savings', 'Paid a credit supplier $4,500'],
      'Buying on credit adds an asset (the machine) and a liability (the amount owed). Paying by cheque swaps one asset for another; extra capital raises equity; paying a supplier lowers both.')),
    S('dual-effect', mc('Which transaction does <b>not</b> change a business’s total assets?', 'A credit customer pays her account by cheque',
      ['Shop fittings are bought on credit', 'The owner takes cash for personal use', 'A credit supplier is paid by bank transfer'],
      'When a customer pays, bank rises and trade receivables fall by the same amount, so total assets stay the same.')),
    S('dual-effect', mc('Which transaction reduces the owner’s equity?', 'The owner takes goods for her family’s use',
      ['Buying a computer on credit', 'Repaying part of a bank loan', 'Receiving a loan from a bank'],
      'Goods taken by the owner are drawings, which reduce equity (and assets). The other transactions change only assets and liabilities.')),
    S('dual-effect', mc('A trader returns goods costing $600 to a credit supplier. What is the effect on the accounting equation?', 'Assets fall by $600 and liabilities fall by $600',
      ['Assets rise by $600 and liabilities fall by $600', 'Liabilities fall by $600 and equity rises by $600', 'Liabilities fall by $600 and nothing else changes'],
      'The goods leave the business, so inventory (an asset) falls, and the trader owes the supplier less, so trade payables (a liability) fall. Both sides drop by $600.')),
    S('classify', multi('Which of these are liabilities of a business?', ['Trade payables', 'Bank overdraft', 'Bank loan'], ['Trade receivables', 'Inventory', 'Cash in hand'],
      'Liabilities are amounts the business owes: trade payables, an overdraft and a loan. Trade receivables, inventory and cash are resources the business controls, so they are assets.')),
    { skill: 'classify', gen: function () {
      var o = pick(OWN), wantLiab = Math.random() < 0.5;
      var right = wantLiab ? pick(LIAB_POOL) : pick(ASSET_POOL), wrong = sample(wantLiab ? ASSET_POOL : LIAB_POOL, 3);
      return mc('Which of these is ' + (wantLiab ? 'a liability' : 'an asset') + ' of ' + o + '’s business?', right, wrong,
        wantLiab ? right + ' is an amount the business owes, so it is a liability. The others are resources the business controls (assets).' : right + ' is a resource the business controls, so it is an asset. The others are amounts the business owes (liabilities).');
    } }
  ] };

  // =====================================================================
  // ACC-REC-17 Debit and credit for one transaction
  // =====================================================================
  function entry(stem, d, c, wrongs, why) {
    return mc(stem + ' Which double entry records this in the business’s books?', dc(d, c), wrongs.map(function (w) { return dc(w[0], w[1]); }), why);
  }
  function who() { return pick(OWN) + ', who owns a ' + pick(BIZ) + ','; }
  B['ACC-REC-17'] = { title: 'Debit and credit for one transaction', items: [
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(12, 90) * 25;
      return entry(who() + ' buys goods for resale costing ' + money(x) + ' and pays by cheque.', 'Purchases', 'Bank', [['Bank', 'Purchases'], ['Purchases', 'Cash'], ['Inventory', 'Bank']],
        'Goods for resale are debited to purchases (not inventory). The money left the bank account, so bank gives value and is credited.');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(4, 40) * 5;
      return entry(who() + ' buys a box of goods for resale for ' + money(x) + ', paying with notes from the till.', 'Purchases', 'Cash', [['Cash', 'Purchases'], ['Purchases', 'Bank'], ['Inventory', 'Cash']],
        'Purchases receives value, so it is debited. The cash came from the till, so the cash account (not bank) is credited.');
    } },
    { skill: 'drawings', gen: function () {
      var x = rint(4, 30) * 10;
      return entry(who() + ' takes ' + money(x) + ' in notes from the till to spend on a family meal.', 'Drawings', 'Cash', [['Cash', 'Drawings'], ['Drawings', 'Bank'], ['Wages', 'Cash']],
        'Money taken by the owner for private use is drawings, which is debited. Cash leaves the till, so cash is credited. It is not wages: the owner is not an employee.');
    } },
    { skill: 'drawings', gen: function () {
      var x = rint(10, 80) * 50;
      return entry(who() + ' transfers ' + money(x) + ' from the business bank account to a personal account to pay for a holiday.', 'Drawings', 'Bank', [['Bank', 'Drawings'], ['Drawings', 'Cash'], ['Cash', 'Bank']],
        'The money is for the owner’s private use, so debit drawings. It left the business bank account, so credit bank, not cash.');
    } },
    { skill: 'drawings', gen: function () {
      var x = rint(3, 30) * 10;
      return entry(pick(OWN) + ', who runs a toy shop, takes games costing ' + money(x) + ' from the shelves as presents for relatives.', 'Drawings', 'Purchases', [['Drawings', 'Sales'], ['Purchases', 'Drawings'], ['Sales', 'Drawings']],
        'Goods taken by the owner are drawings (debit). They were bought, not sold, so the credit reduces purchases. Crediting sales would overstate income.');
    } },
    { skill: 'owner-funds', gen: function () {
      var e = pick(['Insurance', 'Repairs', 'Advertising', 'Cleaning']), x = rint(6, 60) * 10;
      return entry(who() + ' pays a business ' + e.toLowerCase() + ' bill of ' + money(x) + ' from a <b>personal</b> bank account.', e, 'Equity', [[e, 'Bank'], ['Equity', e], [e, 'Cash']],
        'The business has had the benefit of the ' + e.toLowerCase() + ', so debit ' + e.toLowerCase() + '. No business money was used: the owner has put more into the business, so credit equity.');
    } },
    { skill: 'owner-funds', gen: function () {
      var x = rint(8, 60) * 10;
      return entry(who() + ' pays ' + money(x) + ' for a delivery of goods for resale with a personal credit card, not business money.', 'Purchases', 'Equity', [['Purchases', 'Bank'], ['Equity', 'Purchases'], ['Purchases', 'Cash']],
        'Purchases receives value, so it is debited. No business cash or bank money was used; the owner has invested more in the business, so equity is credited.');
    } },
    { skill: 'owner-funds', gen: function () {
      var a = pick([['a private van', 'Motor vehicles'], ['a personal laptop', 'Office equipment'], ['some shelving from home', 'Fixtures and fittings']]), x = a[1] === 'Motor vehicles' ? rint(25, 90) * 100 : rint(4, 15) * 100;
      return entry(who() + ' brings ' + a[0] + ' valued at ' + money(x) + ' into the business for permanent use.', a[1], 'Equity', [['Equity', a[1]], [a[1], 'Bank'], ['Purchases', 'Equity']],
        'The business gains a non-current asset, so debit ' + a[1].toLowerCase() + ' (not purchases, as it is not for resale). The owner has invested more, so credit equity.');
    } },
    { skill: 'owner-funds', gen: function () {
      var x = rint(10, 100) * 100;
      return entry(who() + ' pays ' + money(x) + ' of personal savings into the business bank account as extra capital.', 'Bank', 'Equity', [['Equity', 'Bank'], ['Bank', 'Sales'], ['Cash', 'Equity']],
        'The business bank account receives the money (debit bank). The owner’s investment rises (credit equity). It is not income, so sales is wrong.');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(20, 160) * 25;
      return entry('At the end of the day a shop pays ' + money(x) + ' of its office cash into the business bank account.', 'Bank', 'Cash', [['Cash', 'Bank'], ['Bank', 'Sales'], ['Bank', 'Equity']],
        'Bank receives the money (debit) and cash gives it (credit). This is a contra entry: both accounts belong to the business.');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(4, 20) * 50;
      return entry('A business withdraws ' + money(x) + ' from its bank account to put in the till as change for customers.', 'Cash', 'Bank', [['Bank', 'Cash'], ['Drawings', 'Bank'], ['Cash', 'Equity']],
        'The cash is for business use, not the owner, so it is not drawings. Cash receives value (debit) and bank gives it (credit).');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var e = pick(['Rent', 'Electricity', 'Telephone']), x = rint(10, 90) * 10;
      return entry('A business pays its ' + e.toLowerCase() + ' bill of ' + money(x) + ' by bank transfer.', e, 'Bank', [['Bank', e], [e, 'Cash'], [e, 'Equity']],
        'An expense receives value, so debit ' + e.toLowerCase() + '. The money left the bank account, so credit bank.');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(20, 200) * 5;
      return entry('A market stall sells goods for ' + money(x) + ' and the customers pay in notes and coins.', 'Cash', 'Sales', [['Sales', 'Cash'], ['Bank', 'Sales'], ['Cash', 'Purchases']],
        'Cash comes in, so debit cash. Sales is income, so it is credited.');
    } },
    { skill: 'credit-trading', gen: function () {
      var c = pick(CUST), x = rint(8, 80) * 25;
      return entry('A wholesaler sells goods for ' + money(x) + ' on credit to ' + c + '.', c, 'Sales', [['Sales', c], ['Bank', 'Sales'], [c, 'Cash']],
        c + ' now owes the money, so the customer’s account is debited. Sales (income) is credited. No money has moved yet, so cash and bank are not used.');
    } },
    { skill: 'credit-trading', gen: function () {
      var s = pick(SUPP), x = rint(8, 80) * 25;
      return entry('A retailer buys goods for resale for ' + money(x) + ' on credit from ' + s + '.', 'Purchases', s, [[s, 'Purchases'], ['Purchases', 'Bank'], ['Inventory', s]],
        'Purchases receives value (debit). ' + s + ' gives value and is now owed money, so the supplier’s account is credited.');
    } },
    { skill: 'credit-trading', gen: function () {
      var s = pick(SUPP), x = rint(8, 80) * 25;
      return entry('A business pays ' + s + ', a credit supplier, ' + money(x) + ' by cheque.', s, 'Bank', [['Bank', s], ['Purchases', 'Bank'], [s, 'Cash']],
        'The supplier receives the payment, so debit ' + s + ' (the debt falls). Bank gives the money, so credit bank. Purchases was already recorded when the goods were bought.');
    } },
    { skill: 'credit-trading', gen: function () {
      var c = pick(CUST), x = rint(8, 80) * 25;
      return entry('A business receives a cheque for ' + money(x) + ' from ' + c + ', a credit customer, and pays it into the bank.', 'Bank', c, [[c, 'Bank'], ['Bank', 'Sales'], ['Cash', c]],
        'Bank receives the money (debit). ' + c + ' now owes less, so the customer’s account is credited. The sale was recorded earlier, so sales is not credited again.');
    } },
    { skill: 'credit-trading', gen: function () {
      var c = pick(CUST), x = rint(2, 30) * 10;
      return entry(c + ', a credit customer, returns faulty goods worth ' + money(x) + '.', 'Sales returns', c, [[c, 'Sales returns'], ['Sales', c], ['Purchases returns', c]],
        'The returned goods come back into the business, so debit sales returns. The customer owes less, so credit ' + c + '.');
    } },
    { skill: 'credit-trading', gen: function () {
      var s = pick(SUPP), x = rint(2, 30) * 10;
      return entry('A business sends back goods worth ' + money(x) + ' to ' + s + ', a credit supplier.', s, 'Purchases returns', [['Purchases returns', s], [s, 'Sales returns'], ['Sales returns', s]],
        'The business now owes the supplier less, so debit ' + s + '. The goods go out to the supplier, so credit purchases returns.');
    } },
    { skill: 'loans-and-assets', gen: function () {
      var s = pick(['Ridgeway Motors', 'Coastline Vans', 'Hillcrest Garage']), x = rint(40, 180) * 100;
      return entry('A florist buys a delivery van for ' + money(x) + ' on credit from ' + s + '.', 'Motor vehicles', s, [[s, 'Motor vehicles'], ['Purchases', s], ['Motor vehicles', 'Bank']],
        'The van is a non-current asset, so debit motor vehicles (not purchases, which is for goods for resale). The business owes ' + s + ', so credit that account.');
    } },
    { skill: 'loans-and-assets', gen: function () {
      var x = rint(10, 60) * 500;
      return entry('A business receives a bank loan of ' + money(x) + ', which is paid into its bank account.', 'Bank', 'Bank loan', [['Bank loan', 'Bank'], ['Bank', 'Equity'], ['Cash', 'Bank loan']],
        'The bank account receives the money (debit). The loan is a liability that has increased, so credit bank loan. It is not the owner’s capital.');
    } },
    { skill: 'loans-and-assets', gen: function () {
      var x = rint(6, 60) * 50;
      return entry('A hairdresser buys a new styling chair for use in the salon for ' + money(x) + ' and pays by cheque.', 'Equipment', 'Bank', [['Bank', 'Equipment'], ['Purchases', 'Bank'], ['Equipment', 'Cash']],
        'The chair will be used for years, so it is a non-current asset: debit equipment, not purchases. Payment was by cheque, so credit bank.');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(10, 60) * 10;
      return entry('A shop sublets a spare room and receives ' + money(x) + ' rent in cash from the tenant.', 'Cash', 'Rent received', [['Rent received', 'Cash'], ['Cash', 'Sales'], ['Bank', 'Rent received']],
        'Cash comes in, so debit cash. Rent received is income, so it is credited. It is not a sale of goods.');
    } },
    { skill: 'cash-and-bank', gen: function () {
      var x = rint(20, 90) * 10;
      return entry('A café pays its part-time staff wages of ' + money(x) + ' in cash.', 'Wages', 'Cash', [['Cash', 'Wages'], ['Wages', 'Bank'], ['Drawings', 'Cash']],
        'Wages is an expense, so it is debited. Cash is paid out, so cash is credited. Staff wages are not drawings, which are only for the owner.');
    } }
  ] };

  // =====================================================================
  // ACC-REC-19 Normal balances: debit side or credit side
  // =====================================================================
  var DRB = [['Carriage inwards', 'an expense'], ['Carriage outwards', 'an expense'], ['Discount allowed', 'an expense'], ['Returns inwards', 'a return from customers that reduces sales'],
    ['Drawings', 'a reduction in equity'], ['Purchases', 'an expense'], ['Wages', 'an expense'], ['Premises', 'an asset'], ['Inventory', 'an asset'],
    ['Trade receivables', 'an asset'], ['Other receivables', 'an asset'], ['Motor vehicles', 'an asset'], ['Rent and rates', 'an expense']];
  var CRB = [['Discount received', 'income'], ['Returns outwards', 'a return to suppliers that reduces purchases'], ['Sales', 'income'], ['Equity', 'the owner’s capital'], ['Bank loan', 'a liability'],
    ['Trade payables', 'a liability'], ['Other payables', 'a liability'], ['Provision for depreciation', 'a provision that reduces an asset'], ['Rent received', 'income'],
    ['Commission received', 'income'], ['Interest received', 'income']];
  function listWhy(arr, side) { return arr.map(function (a) { return a[0] + ' (' + a[1] + ')'; }).join(', ') + (arr.length > 1 ? ' are ' : ' is ') + side + ' balances.'; }
  var TB_CLASSES = [['Debit column, because it is an asset', ['Premises', 'Inventory', 'Trade receivables', 'Motor vehicles', 'Other receivables', 'Office equipment']],
    ['Debit column, because it is an expense', ['Carriage outwards', 'Discount allowed', 'Wages', 'Insurance', 'Carriage inwards', 'Rent and rates']],
    ['Credit column, because it is a liability', ['Trade payables', 'Bank loan', 'Other payables', 'Bank overdraft']],
    ['Credit column, because it is income', ['Discount received', 'Commission received', 'Rent received', 'Sales']],
    ['Credit column, because it is equity', ['Equity']]];

  B['ACC-REC-19'] = { title: 'Normal balances: debit side or credit side', items: [
    { skill: 'which-credit', gen: function () {
      var r = pick(CRB), w = sample(DRB, 3);
      return mc('Which of these accounts normally has a <b>credit</b> balance?', r[0], w.map(function (x) { return x[0]; }),
        r[0] + ' is ' + r[1] + ', so it has a credit balance. ' + listWhy(w, 'debit'));
    } },
    { skill: 'which-debit', gen: function () {
      var r = pick(DRB), w = sample(CRB, 3);
      return mc('Which of these accounts normally has a <b>debit</b> balance?', r[0], w.map(function (x) { return x[0]; }),
        r[0] + ' is ' + r[1] + ', so it has a debit balance. ' + listWhy(w, 'credit'));
    } },
    { skill: 'tb-column', gen: function () {
      var k = rint(0, TB_CLASSES.length - 1), item = pick(TB_CLASSES[k][1]);
      return mc('In which column of a trial balance is the balance on the <b>' + item + '</b> account entered, and why?', TB_CLASSES[k][0],
        TB_CLASSES.filter(function (_, i) { return i !== k; }).map(function (c) { return c[0]; }),
        'Assets and expenses are debit balances; liabilities, income and equity are credit balances. ' + item + ' is ' + TB_CLASSES[k][0].split('it is ')[1] + '.');
    } },
    { skill: 'tb-column', gen: function () {
      var nd = rint(2, 4), d = sample(DRB, nd), c = sample(CRB, 6 - nd);
      return multi('Which of these balances are entered in the <b>debit</b> column of a trial balance?', d.map(function (x) { return x[0]; }), c.map(function (x) { return x[0]; }),
        listWhy(d, 'debit') + ' ' + listWhy(c, 'credit'));
    } },
    S('traps', multi('Which of these accounts normally have a debit balance?', ['Carriage outwards', 'Discount allowed', 'Returns inwards'], ['Discount received', 'Returns outwards', 'Provision for depreciation'],
      'Carriage outwards and discount allowed are expenses and returns inwards reduces sales, so all three are debits. Discount received is income, returns outwards reduces purchases and a provision reduces an asset, so those are credits.')),
    S('traps', mc('What are the normal balances on the carriage inwards and carriage outwards accounts?', 'Both are debit balances',
      ['Both are credit balances', 'Carriage inwards debit; carriage outwards credit', 'Carriage inwards credit; carriage outwards debit'],
      'Both are delivery costs paid by the business, so both are expenses with debit balances. “Outwards” describes the direction of the goods, not the side of the account.')),
    S('traps', mc('What are the normal balances on the returns inwards and returns outwards accounts?', 'Returns inwards debit; returns outwards credit',
      ['Returns inwards credit; returns outwards debit', 'Both are debit balances', 'Both are credit balances'],
      'Returns inwards (sales returns) reduce sales income, so they are a debit. Returns outwards (purchases returns) reduce purchases, so they are a credit.')),
    S('traps', mc('What are the normal balances on the discount allowed and discount received accounts?', 'Discount allowed debit; discount received credit',
      ['Discount allowed credit; discount received debit', 'Both are debit balances', 'Both are credit balances'],
      'Discount allowed is given away to customers, so it is an expense (debit). Discount received is a benefit from suppliers, so it is income (credit).')),
    S('traps', mc('Why does the provision for depreciation account have a credit balance?', 'It reduces an asset, which is a debit balance',
      ['It is a non-current asset owned by the business', 'It is income earned by using the asset', 'It is cash set aside to replace the asset'],
      'The provision is deducted from the cost of a non-current asset. The asset is a debit, so the amount that reduces it sits on the credit side.')),
    { skill: 'bank-and-cash', gen: function () {
      var x = rint(4, 60) * 25, m = pick(MONTHS);
      return mc('On ' + m[1] + ' ' + m[0] + ' the bank column of a trader’s cash book has a <b>credit</b> balance of ' + money(x) + '. What does this mean?', 'The business has an overdraft of ' + money(x),
        ['The business has ' + money(x) + ' in its bank account', 'The business has ' + money(x) + ' cash in hand', 'Credit customers owe the business ' + money(x)],
        'A debit balance on the bank account is money in the bank. A credit balance means the business owes the bank: it is overdrawn by ' + money(x) + '.');
    } },
    { skill: 'bank-and-cash', gen: function () {
      var x = rint(4, 60) * 5;
      return mc('A shop’s cash account has a debit balance of ' + money(x) + '. What does this show?', money(x) + ' of notes and coins is held',
        ['The business owes ' + money(x) + ' to the bank', 'The cash account is overdrawn by ' + money(x), 'Customers owe ' + money(x) + ' in cash'],
        'Cash is an asset, so a debit balance is the cash actually held. Cash can never be overdrawn: you cannot pay out more notes than you have.');
    } },
    S('bank-and-cash', mc('Which of these balances is impossible?', 'A credit balance on the cash account', ['A credit balance on the bank account', 'A debit balance on the bank account', 'A debit balance on the cash account'],
      'A business cannot pay out more notes and coins than it holds, so cash always has a debit balance (or nil). A bank account can be either side because the bank may allow an overdraft.')),
    S('bank-and-cash', mc('Which account can normally have either a debit or a credit balance?', 'Bank current account', ['Cash', 'Equity', 'Bank loan'],
      'A bank current account is a debit when there is money in it and a credit when it is overdrawn. Cash is always a debit; equity and a bank loan are always credits.')),
    S('which-debit', mc('Which of these accounts always has a debit balance?', 'Insurance', ['Bank loan', 'Commission received', 'Bank current account'],
      'Insurance is an expense, so it is always a debit. The loan is a liability and commission received is income (both credits); a current account can be either side.')),
    S('traps', mc('In which columns of a trial balance do other receivables and other payables appear?', 'Other receivables debit; other payables credit',
      ['Other receivables credit; other payables debit', 'Both in the debit column', 'Both in the credit column'],
      'Other receivables (such as prepayments) are assets, so debit. Other payables (such as accruals) are liabilities, so credit.')),
    S('which-credit', mc('Why does the equity account have a credit balance?', 'It is the amount the business owes to its owner',
      ['It is money the owner owes to the business', 'It is income earned during the year', 'It is an asset belonging to the owner'],
      'The business is treated as separate from its owner, so the owner’s capital is like a debt the business owes to the owner. That makes it a credit balance.')),
    S('which-debit', mc('Which statement about the drawings account is correct?', 'It is a debit balance, because it reduces equity',
      ['It is a credit balance, because it is equity', 'It is a credit balance, because it is income', 'It is a debit balance, because it is an expense'],
      'Drawings reduce what the business owes the owner, so they sit on the opposite side to equity: debit. Drawings are not an expense of running the business.')),
    { skill: 'tb-column', gen: function () {
      var rows = sample(DRB, 2).map(function (x) { return [x[0], 'D']; }).concat(sample(CRB, 2).map(function (x) { return [x[0], 'C']; }));
      rows = sample(rows, 4);
      var k = rint(0, 3), wrongRow = rows[k];
      var shown = rows.map(function (r, i) { var side = i === k ? (r[1] === 'D' ? 'C' : 'D') : r[1]; return [r[0], side === 'D' ? '✓' : '', side === 'C' ? '✓' : '']; });
      return mc('A student has ticked the trial balance column for four balances.' + table(['Account', 'Debit', 'Credit'], shown) + 'Which balance has been placed in the wrong column?',
        wrongRow[0], rows.filter(function (_, i) { return i !== k; }).map(function (r) { return r[0]; }),
        wrongRow[0] + ' should be in the ' + (wrongRow[1] === 'D' ? 'debit' : 'credit') + ' column. ' + rows.filter(function (_, i) { return i !== k; }).map(function (r) { return r[0] + ' (' + (r[1] === 'D' ? 'debit' : 'credit') + ')'; }).join(', ') + ' are correct.');
    } },
    { skill: 'bank-and-cash', gen: function () {
      var x = rint(4, 60) * 50;
      return mc('A trial balance includes a bank overdraft of ' + money(x) + '. In which column is it entered?', 'Credit column, as a liability',
        ['Debit column, as an asset', 'Debit column, as an expense', 'Credit column, as income'],
        'An overdraft is money owed to the bank, so it is a liability and goes in the credit column.');
    } },
    S('traps', mc('Which pair of accounts <b>both</b> normally have credit balances?', 'Returns outwards and discount received',
      ['Returns inwards and discount received', 'Carriage outwards and returns outwards', 'Discount allowed and carriage inwards'],
      'Returns outwards reduce purchases and discount received is income, so both are credits. Returns inwards, carriage (in or out) and discount allowed are all debits.')),
    S('traps', mc('Which pair of accounts <b>both</b> normally have debit balances?', 'Carriage outwards and returns inwards',
      ['Carriage outwards and returns outwards', 'Discount received and carriage inwards', 'Returns inwards and rent received'],
      'Carriage outwards is an expense and returns inwards reduce sales, so both are debits. Returns outwards, discount received and rent received are credits.')),
    S('which-credit', mc('A business borrowed $20,000 from its bank. On which side does the bank loan account balance?', 'Credit, because it is a liability',
      ['Debit, because the money went into the bank', 'Debit, because it is an asset', 'Credit, because it is income'],
      'The loan is an amount owed to the bank, so it is a liability with a credit balance. The debit entry is in the bank account, not the loan account.')),
    S('bank-and-cash', mc('Which trial balance entry shows that a trader has money in the business bank account?', 'Bank in the debit column',
      ['Bank in the credit column', 'Bank loan in the credit column', 'Bank loan in the debit column'],
      'Money in the bank is an asset, so bank appears as a debit. Bank in the credit column would be an overdraft; a bank loan is a liability (credit).'))
  ] };

  // =====================================================================
  // ACC-REC-18 What goes in the owner's equity account
  // =====================================================================
  var NOT_EQUITY = ['Gross profit', 'Profit on disposal of a non-current asset', 'Loss on disposal of a non-current asset', 'Sales revenue', 'Discount received'];
  function yr() { return pick([2025, 2026]); }
  B['ACC-REC-18'] = { title: 'What goes in the owner’s equity account', items: [
    { skill: 'in-equity', gen: function () {
      var r = pick(['Profit for the year', 'Loss for the year']), w = sample(NOT_EQUITY, 3);
      return mc('Which of these items is entered in a sole trader’s equity account?', r, w,
        r + ' is the final figure of the income statement and is transferred to equity at the year end. ' + w.join(', ') + ' are income statement items, so they are never entered in the equity account.');
    } },
    { skill: 'credit-side', gen: function () {
      var r = pick(['Profit for the year', 'Extra capital paid in by the owner', 'Opening capital balance']), w = sample(['Cash drawings', 'Goods taken for own use', 'Loss for the year', 'Gross profit'], 3);
      return mc('Which of these is entered on the <b>credit</b> side of the equity account?', r, w,
        'Capital paid in, the opening capital and the profit for the year all increase what the business owes the owner, so they are credits. Drawings and a loss are debits; gross profit is not entered at all.');
    } },
    { skill: 'debit-side', gen: function () {
      var r = pick(['Drawings for the year', 'Loss for the year']), w = sample(['Profit for the year', 'Capital introduced', 'Gross profit', 'Profit on disposal of a non-current asset'], 3);
      return mc('Which of these is entered on the <b>debit</b> side of the equity account?', r, w,
        'Drawings and a loss for the year reduce the owner’s equity, so they are debits. Profit for the year and capital introduced are credits; gross profit and profit on disposal are income statement items.');
    } },
    S('in-equity', multi('Which of these items appear in a sole trader’s equity account?', ['Profit for the year', 'Drawings', 'Capital introduced'], ['Gross profit', 'Profit on disposal of equipment', 'Sales'],
      'Only capital paid in, profit or loss for the year and drawings go into equity. Gross profit, profit on disposal and sales are part of the income statement.')),
    { skill: 'calc-equity', gen: function () {
      var o = pick(OWN), O = rint(40, 160) * 250, P = rint(30, 120) * 100, D = rint(20, 90) * 100;
      return num(o + '’s equity on 1 January was ' + money(O) + '. Profit for the year was ' + money(P) + ' and drawings were ' + money(D) + '. Calculate the balance on the equity account on 31 December. Give your answer in $.', O + P - D,
        'Closing equity = opening + profit − drawings = ' + money(O) + ' + ' + money(P) + ' − ' + money(D) + ' = ' + money(O + P - D) + '.');
    } },
    { skill: 'calc-equity', gen: function () {
      var o = pick(OWN), O = rint(60, 160) * 250, C = rint(10, 60) * 100, L = rint(5, 40) * 100, D = rint(10, 60) * 100;
      return num('At the start of the year ' + o + '’s equity was ' + money(O) + '. During the year ' + o + ' paid in extra capital of ' + money(C) + ' and took drawings of ' + money(D) + '. The business made a <b>loss</b> for the year of ' + money(L) + '. Calculate the closing balance on the equity account. Give your answer in $.', O + C - L - D,
        'Credits: opening ' + money(O) + ' + capital ' + money(C) + '. Debits: loss ' + money(L) + ' + drawings ' + money(D) + '. Balance = ' + money(O + C) + ' − ' + money(L + D) + ' = ' + money(O + C - L - D) + '.');
    } },
    { skill: 'calc-equity', gen: function () {
      var O = rint(40, 140) * 250, P = rint(30, 120) * 100, D = rint(20, 90) * 100, Cl = O + P - D;
      return num('A sole trader’s equity was ' + money(O) + ' at the start of the year and ' + money(Cl) + ' at the end. Drawings for the year were ' + money(D) + ' and no extra capital was paid in. Calculate the profit for the year. Give your answer in $.', P,
        'Closing = opening + profit − drawings, so profit = closing − opening + drawings = ' + money(Cl) + ' − ' + money(O) + ' + ' + money(D) + ' = ' + money(P) + '.');
    } },
    { skill: 'calc-equity', gen: function () {
      var O = rint(40, 140) * 250, P = rint(40, 120) * 100, D = rint(20, 90) * 100, Cl = O + P - D;
      return num('A shopkeeper’s equity account shows an opening balance of ' + money(O) + ', profit for the year of ' + money(P) + ' and a closing balance of ' + money(Cl) + '. The only other entry is drawings. Calculate the drawings for the year. Give your answer in $.', D,
        'Drawings = opening + profit − closing = ' + money(O) + ' + ' + money(P) + ' − ' + money(Cl) + ' = ' + money(D) + '.');
    } },
    { skill: 'transfer', gen: function () {
      var o = pick(OWN), GP = rint(80, 200) * 250, NP = rint(20, 70) * 250;
      return mc(o + '’s income statement shows gross profit of ' + money(GP) + ' and profit for the year of ' + money(NP) + '. How is the result for the year recorded in the equity account?',
        money(NP) + ' on the credit side', [money(GP) + ' on the credit side', money(NP) + ' on the debit side', money(GP) + ' on the debit side'],
        'Only the final figure, profit for the year (' + money(NP) + '), is transferred. A profit increases equity, so it goes on the credit side. Gross profit is before expenses.');
    } },
    { skill: 'transfer', gen: function () {
      var o = pick(OWN), GP = rint(40, 120) * 250, L = rint(4, 30) * 250;
      return mc('Expenses were higher than gross profit for ' + o + '’s business this year. The income statement shows gross profit of ' + money(GP) + ' and a loss for the year of ' + money(L) + '. How is this recorded in the equity account?',
        money(L) + ' on the debit side', [money(L) + ' on the credit side', money(GP) + ' on the credit side', money(GP) + ' on the debit side'],
        'The loss for the year (' + money(L) + ') is transferred. A loss reduces equity, so it is a debit. Gross profit is never transferred to equity.');
    } },
    S('in-equity', mc('A trader sells old shop fittings and makes a profit on disposal of $350. How does this reach the equity account?', 'Only as part of the profit for the year',
      ['It is credited to equity as a separate line', 'It is debited to equity as a separate line', 'It never affects the equity account'],
      'A profit on disposal is income in the income statement. It increases the profit for the year, and only that final figure is transferred to equity.')),
    S('debit-side', mc('An owner takes goods from the business for personal use during the year. How do these goods finally affect the equity account?', 'They are included in drawings, which are debited',
      ['They are credited as extra capital paid in', 'They are debited as a loss for the year', 'They are credited as part of sales'],
      'Goods taken by the owner are drawings. At the year end the total drawings are transferred to the debit side of the equity account, reducing it.')),
    S('credit-side', mc('Why is profit for the year credited to the equity account?', 'Profit belongs to the owner, so it increases equity',
      ['Profit is an expense of the business', 'Profit is an amount owed to suppliers', 'Profit has already been paid out to the owner'],
      'Profit earned by the business belongs to the owner. It increases the amount the business owes the owner, so it is credited like capital.')),
    S('in-equity', mc('Why is gross profit <b>not</b> transferred to the equity account?', 'Expenses have not yet been deducted from it',
      ['It is shown in the statement of financial position instead', 'It has already been taken by the owner as drawings', 'It is only an estimate of the year’s sales'],
      'Gross profit is sales less cost of sales. Expenses still have to be deducted (and other income added) to reach the profit for the year, which is the figure transferred.')),
    { skill: 'spot-error', gen: function () {
      var y = yr(), O = rint(40, 140) * 250, P = rint(30, 90) * 100, GP = P + rint(20, 60) * 250, D = rint(20, 80) * 100;
      var cd = O + GP - D;
      var t = account([['31 Dec', 'Drawings', D], ['31 Dec', 'Balance c/d', cd]], [['1 Jan', 'Balance b/d', O], ['31 Dec', 'Gross profit', GP]]);
      return mc('A trainee has prepared this equity account for ' + y + '. Profit for the year was ' + money(P) + '.' + t + 'Which item should not appear in this account at all?', 'Gross profit',
        ['Drawings', 'Balance b/d', 'Balance c/d'],
        'Gross profit should not be in the equity account. The credit should be profit for the year, ' + money(P) + ', so the balance c/d should be ' + money(O + P - D) + '. Drawings on the debit side and the opening balance on the credit side are correct.');
    } },
    { skill: 'spot-error', gen: function () {
      var O = rint(40, 140) * 250, P = rint(30, 90) * 100, D = rint(20, 80) * 100, C = rint(5, 30) * 100;
      var cd = O + P + C + D;
      var t = account([['31 Dec', 'Balance c/d', cd]], [['1 Jan', 'Balance b/d', O], ['15 May', 'Bank (capital introduced)', C], ['31 Dec', 'Profit for the year', P], ['31 Dec', 'Drawings', D]]);
      return mc('Look at this equity account.' + t + 'Which entry is on the wrong side?', 'Drawings', ['Bank (capital introduced)', 'Profit for the year', 'Balance b/d'],
        'Drawings reduce equity, so they belong on the debit side. The correct balance c/d is ' + money(O) + ' + ' + money(C) + ' + ' + money(P) + ' − ' + money(D) + ' = ' + money(O + C + P - D) + '.');
    } },
    { skill: 'calc-equity', gen: function () {
      var O = rint(40, 140) * 250, P = rint(30, 90) * 100, D = rint(20, 80) * 100, C = rint(5, 30) * 100;
      var t = account([['31 Dec', 'Drawings', D], ['31 Dec', 'Balance c/d', '?']], [['1 Jan', 'Balance b/d', O], ['10 Apr', 'Bank', C], ['31 Dec', 'Profit for the year', P]]);
      return num('Complete this equity account.' + t + 'What is the balance c/d? Give your answer in $.', O + C + P - D,
        'Credit side total = ' + money(O) + ' + ' + money(C) + ' + ' + money(P) + ' = ' + money(O + C + P) + '. Balance c/d = ' + money(O + C + P) + ' − drawings ' + money(D) + ' = ' + money(O + C + P - D) + '.');
    } },
    S('credit-side', mc('A sole trader pays $8,000 from a personal savings account into the business bank account. Where does this appear in the equity account?', 'On the credit side, as capital introduced',
      ['On the debit side, as drawings', 'On the credit side, as profit for the year', 'It does not appear in the equity account'],
      'Money paid in by the owner increases the owner’s investment, so it is credited to equity as capital introduced. It is not profit.')),
    S('debit-side', mc('A trader makes a loss for the year. How is it recorded in the equity account?', 'On the debit side, reducing equity',
      ['On the credit side, reducing equity', 'On the debit side, increasing equity', 'It is not recorded in the equity account'],
      'A loss is the opposite of a profit: it reduces what the business owes the owner, so it is debited to equity.')),
    S('in-equity', mc('Which of these is <b>not</b> entered directly in the equity account?', 'Loss on disposal of a van', ['Loss for the year', 'Drawings for the year', 'Capital introduced'],
      'A loss on disposal is an expense in the income statement. It reaches equity only as part of the profit or loss for the year.')),
    { skill: 'calc-equity', gen: function () {
      var o = pick(OWN), O = rint(40, 140) * 250, P = rint(30, 90) * 100, m = rint(2, 8) * 50, g = rint(4, 30) * 20;
      var D = m * 12 + g;
      return num(o + '’s equity on 1 January was ' + money(O) + '. During the year ' + o + ' took ' + money(m) + ' cash from the business every month and goods costing ' + money(g) + ' for personal use. Profit for the year was ' + money(P) + '. Calculate the closing equity. Give your answer in $.', O + P - D,
        'Drawings = 12 × ' + money(m) + ' + ' + money(g) + ' = ' + money(D) + '. Closing equity = ' + money(O) + ' + ' + money(P) + ' − ' + money(D) + ' = ' + money(O + P - D) + '.');
    } },
    S('credit-side', mc('Which pair of items is entered on the credit side of the equity account?', 'Opening capital and profit for the year',
      ['Drawings and profit for the year', 'Opening capital and loss for the year', 'Gross profit and capital introduced'],
      'Opening capital and profit for the year both increase equity, so both are credits. Drawings and a loss are debits; gross profit is not entered.')),
    S('debit-side', mc('Which pair of items is entered on the debit side of the equity account?', 'Drawings and loss for the year',
      ['Drawings and profit for the year', 'Capital introduced and loss for the year', 'Loss on disposal and drawings'],
      'Drawings and a loss for the year both reduce equity, so both are debits. A loss on disposal stays in the income statement.'))
  ] };

  // =====================================================================
  // ACC-REC-12 Preparing a three-column cash book
  // =====================================================================
  // A cash discount rate and an invoice amount that gives a whole-dollar discount.
  function discInvoice(lo, hi) {
    var p = pick([2, 5, 10]), step = { 2: 50, 5: 20, 10: 10 }[p];
    var inv = rint(Math.ceil(lo / step), Math.floor(hi / step)) * step;
    return { p: p, inv: inv, d: inv * p / 100, net: inv - inv * p / 100 };
  }
  var SIDE4 = ['Debit side, bank column', 'Credit side, bank column', 'Debit side, cash column', 'Credit side, cash column'];
  var BANK_ITEMS = [
    ['a standing order of $X for the monthly rent', 1, 'A standing order is money paid out of the bank, so it is a payment on the credit side of the bank column.'],
    ['a direct debit of $X to the electricity company', 1, 'A direct debit is a payment taken from the bank account, so it goes on the credit side of the bank column.'],
    ['a cheque for $X from a customer that the bank has returned dishonoured', 1, 'The money originally recorded as received has not arrived, so it is taken back out: credit side, bank column.'],
    ['a credit transfer of $X received from a customer directly into the bank account', 0, 'Money has come into the bank account, so it is a receipt on the debit side of the bank column.'],
    ['a cheque for $X received from a credit customer and paid into the bank', 0, 'A cheque paid into the bank is a receipt, so it goes on the debit side of the bank column.']];
  B['ACC-REC-12'] = { title: 'Preparing a three-column cash book', items: [
    { skill: 'settlement-discount', gen: function () {
      var c = pick(CUST), x = discInvoice(400, 3000);
      return num(c + ' owes ' + money(x.inv) + ' and pays by cheque within the time allowed for a ' + x.p + '% cash discount. What amount is entered in the bank column of the cash book? Give your answer in $.', x.net,
        'Discount = ' + x.p + '% × ' + money(x.inv) + ' = ' + money(x.d) + '. The bank column shows the money actually received: ' + money(x.inv) + ' − ' + money(x.d) + ' = ' + money(x.net) + '. The ' + money(x.d) + ' goes in the discount column.');
    } },
    { skill: 'settlement-discount', gen: function () {
      var s = pick(SUPP), x = discInvoice(400, 3000);
      return num('A business pays ' + s + ' an invoice of ' + money(x.inv) + ' by cheque, deducting a ' + x.p + '% cash discount for paying early. How much discount received is recorded in the cash book for this payment? Give your answer in $.', x.d,
        'Discount received = ' + x.p + '% × ' + money(x.inv) + ' = ' + money(x.d) + '. The bank column shows the ' + money(x.net) + ' actually paid.');
    } },
    { skill: 'settlement-discount', gen: function () {
      var c = pick(CUST), x = discInvoice(400, 3000);
      return num('A cheque for ' + money(x.net) + ' is received from ' + c + ' in full settlement of the account after deducting a ' + x.p + '% cash discount. What amount is entered in the discount column? Give your answer in $.', x.d,
        'The cheque is ' + (100 - x.p) + '% of the debt, so the debt was ' + money(x.net) + ' ÷ ' + (100 - x.p) / 100 + ' = ' + money(x.inv) + '. Discount = ' + money(x.inv) + ' − ' + money(x.net) + ' = ' + money(x.d) + '. (Taking ' + x.p + '% of the cheque instead gives the wrong answer.)');
    } },
    { skill: 'settlement-discount', gen: function () {
      var c = pick(CUST), x = discInvoice(300, 2500), m = pick(MONTHS), d0 = rint(2, 6), d1 = d0 + rint(16, 22);
      return num('A trader allows a ' + x.p + '% cash discount to customers who pay within 10 days. ' + c + ' was invoiced ' + money(x.inv) + ' on ' + d0 + ' ' + m[0] + ' and paid the account by cheque on ' + d1 + ' ' + m[0] + '. What amount is entered in the bank column? Give your answer in $.', x.inv,
        c + ' paid ' + (d1 - d0) + ' days after the invoice, outside the 10 days allowed, so no discount is given. The full ' + money(x.inv) + ' is received and nothing goes in the discount column.');
    } },
    { skill: 'contra', gen: function () {
      var x = rint(20, 120) * 25;
      return mc('At the end of a busy week a shop pays ' + money(x) + ' of its cash takings into the bank. How is this recorded in the three-column cash book?', 'Debit side bank column and credit side cash column',
        ['Debit side cash column and credit side bank column', 'Debit side bank column only', 'Credit side cash column only'],
        'This is a contra entry, recorded on both sides. Bank receives the money (debit side, bank column) and cash gives it (credit side, cash column).');
    } },
    { skill: 'contra', gen: function () {
      var x = rint(4, 20) * 25, flip = Math.random() < 0.5;
      return mc(flip ? 'A business withdraws ' + money(x) + ' from the bank for use as office cash. On the debit side of the cash book, the ' + money(x) + ' is entered in the cash column. What is written in the details column beside it?'
        : 'A business pays ' + money(x) + ' of office cash into its bank account. On the debit side of the cash book, the ' + money(x) + ' is entered in the bank column. What is written in the details column beside it?',
        flip ? 'Bank' : 'Cash', [flip ? 'Cash' : 'Bank', 'Sales', 'Balance b/d'],
        'The details column names the other account in the double entry. ' + (flip ? 'The cash came from the bank, so the details say “Bank”.' : 'The money in the bank came from the cash column, so the details say “Cash”.'));
    } },
    { skill: 'opening-balances', gen: function () {
      var m = pick(MONTHS), od = rint(4, 40) * 25, c = rint(4, 30) * 5;
      return mc('On 1 ' + m[0] + ' a trader has cash in hand of ' + money(c) + ' and a bank overdraft of ' + money(od) + '. How are these opening balances entered in the cash book?', 'Cash on the debit side; bank on the credit side',
        ['Both on the debit side', 'Both on the credit side', 'Cash on the credit side; bank on the debit side'],
        'Cash in hand is an asset, so it is brought down on the debit side. An overdraft is money owed to the bank, so it is brought down on the credit side of the bank column.');
    } },
    { skill: 'bank-items', gen: function () {
      var it = pick(BANK_ITEMS), x = rint(8, 60) * 5;
      return mc('In a three-column cash book, where is this recorded: ' + it[0].replace('$X', money(x)) + '?', SIDE4[it[1]], SIDE4.filter(function (_, i) { return i !== it[1]; }), it[2]);
    } },
    { skill: 'bank-items', gen: function () {
      var c = pick(CUST), x = rint(8, 60) * 10;
      return mc('A cheque for ' + money(x) + ' from ' + c + ', a credit customer, is returned by the bank as dishonoured. It is entered in the bank column on the credit side. What is written in the details column?', c,
        ['Bank', 'Cash', 'Sales returns'],
        'The details column names the other account. The customer’s account is debited again because ' + c + ' still owes the money, so the details are “' + c + '”.');
    } },
    S('discount-columns', mc('Which statement about the discount columns of a three-column cash book is correct?', 'They are totalled but not balanced',
      ['They are balanced like the cash and bank columns', 'Their totals are added to the bank balance', 'Discount allowed is shown on the credit side'],
      'Discounts are not money paid or received, so the discount columns are only totalled at the end of the period. Discount allowed is on the debit side and discount received on the credit side.')),
    { skill: 'balancing', gen: function () {
      var m = pick(MONTHS), oc = rint(10, 60) * 5, ob = rint(20, 120) * 25, s1 = rint(80, 250) * 10, w = rint(10, 30) * 10, w1 = rint(10, 30) * 10, st = rint(4, 16) * 5, bal = rint(6, 60) * 5;
      var b = oc + s1 + w - w1 - st - bal, c = pick(CUST), x = discInvoice(300, 1500);
      var dr = [['1', 'Balance b/d', '', oc, ob], ['6', 'Sales', '', s1, ''], ['11', 'Cash', '', '', b], ['14', c, x.d, '', x.net], ['22', 'Bank', '', w, '']];
      var cr = [['4', 'Wages', '', w1, ''], ['11', 'Bank', '', b, ''], ['22', 'Cash', '', '', w], ['27', 'Stationery', '', st, '']];
      return num('Here is the cash book of a small shop for ' + m[0] + ' before balancing.' + cashBook(dr, cr) + 'What is the cash balance carried down on ' + m[1] + ' ' + m[0] + '? Give your answer in $.', bal,
        'Cash column only: receipts ' + money(oc) + ' + ' + money(s1) + ' + ' + money(w) + ' = ' + money(oc + s1 + w) + '; payments ' + money(w1) + ' + ' + money(b) + ' + ' + money(st) + ' = ' + money(w1 + b + st) + '. Balance = ' + money(bal) + '. The bank and discount columns are ignored.');
    } },
    { skill: 'balancing', gen: function () {
      var m = pick(MONTHS), od = rint(8, 36) * 25, b = rint(40, 120) * 25, c = pick(CUST), s = pick(SUPP), x = discInvoice(400, 1500), y = discInvoice(300, 1200), dd = rint(6, 20) * 10;
      var bal = b + x.net - od - dd - y.net;
      if (bal < 100) { b += 200 - bal + rint(0, 20) * 25; bal = b + x.net - od - dd - y.net; }
      var dr = [['9', 'Cash', '', '', b], ['15', c, x.d, '', x.net]];
      var cr = [['1', 'Balance b/d', '', '', od], ['20', 'Electricity (DD)', '', '', dd], ['26', s, y.d, '', y.net]];
      return num('This extract shows only the bank side of a trader’s cash book for ' + m[0] + ' (the cash column entries are not shown).' + cashBook(dr, cr) + 'What is the bank balance brought down on 1 ' + m[2] + '? Give your answer in $.', bal,
        'The opening overdraft is on the credit side. Bank receipts = ' + money(b) + ' + ' + money(x.net) + ' = ' + money(b + x.net) + '. Bank payments = ' + money(od) + ' + ' + money(dd) + ' + ' + money(y.net) + ' = ' + money(od + dd + y.net) + '. Balance = ' + money(bal) + ' (debit: money in the bank). Discounts are not part of the balance.');
    } },
    { skill: 'balancing', gen: function () {
      var m = pick(MONTHS), dr = rint(60, 200) * 25, d = rint(4, 40) * 25, cr = dr + d;
      return mc('Before balancing, the bank column of a cash book totals ' + money(dr) + ' on the debit side and ' + money(cr) + ' on the credit side. How is the balance brought down on 1 ' + m[2] + '?', money(d) + ' on the credit side: an overdraft',
        [money(d) + ' on the debit side: money in the bank', money(d) + ' on the debit side: an overdraft', money(d) + ' on the credit side: money in the bank'],
        'Payments exceed receipts by ' + money(cr) + ' − ' + money(dr) + ' = ' + money(d) + '. Balance c/d goes on the smaller (debit) side, so the balance b/d is on the credit side, meaning the business is overdrawn.');
    } },
    { skill: 'balancing', gen: function () {
      var c = pick(CUST), s = pick(SUPP), ob = rint(20, 80) * 25, x = discInvoice(600, 2400), y = discInvoice(400, 1600), cb = rint(20, 60) * 25, so = rint(10, 40) * 10;
      var bal = ob + x.net + cb - so - y.net;
      while (bal < 100) { ob += 500; bal += 500; }
      return num('A trader’s bank balance is ' + money(ob) + ' (not overdrawn) at the start of the month. During the month:<br>• ' + c + ' pays an invoice of ' + money(x.inv) + ' by cheque, less ' + x.p + '% cash discount<br>• the trader pays ' + money(cb) + ' of cash takings into the bank<br>• rent of ' + money(so) + ' is paid by standing order<br>• the trader pays ' + s + ' an invoice of ' + money(y.inv) + ' by cheque, less ' + y.p + '% cash discount.<br>What is the bank balance at the end of the month? Give your answer in $.', bal,
        'Receipts: ' + money(ob) + ' + ' + money(x.net) + ' + ' + money(cb) + ' = ' + money(ob + x.net + cb) + '. Payments: ' + money(so) + ' + ' + money(y.net) + ' = ' + money(so + y.net) + '. Balance = ' + money(bal) + '. Only the amounts actually paid or received after discount go in the bank column.');
    } },
    { skill: 'balancing', gen: function () {
      var oc = rint(10, 50) * 5, cs = rint(60, 200) * 10, w = rint(15, 40) * 10, cb = rint(40, 120) * 10, wd = rint(4, 12) * 25, st = rint(3, 12) * 5;
      while (oc + cs - w - cb + wd - st < 20) cb -= 50;
      var bal = oc + cs - w - cb + wd - st;
      return num('A shop starts the month with cash in hand of ' + money(oc) + '. During the month it:<br>• makes cash sales of ' + money(cs) + '<br>• pays wages of ' + money(w) + ' in cash<br>• pays ' + money(cb) + ' cash into the bank<br>• withdraws ' + money(wd) + ' from the bank for office cash<br>• buys stationery for ' + money(st) + ' in cash.<br>What is the cash balance at the end of the month? Give your answer in $.', bal,
        'Cash in: ' + money(oc) + ' + ' + money(cs) + ' + ' + money(wd) + ' = ' + money(oc + cs + wd) + '. Cash out: ' + money(w) + ' + ' + money(cb) + ' + ' + money(st) + ' = ' + money(w + cb + st) + '. Balance = ' + money(bal) + '. Both contra entries affect the cash column.');
    } },
    { skill: 'discount-columns', gen: function () {
      var cs = sample(CUST, 3), xs = cs.map(function () { return discInvoice(200, 1800); }), s = pick(SUPP), y = discInvoice(300, 1500);
      var tot = xs.reduce(function (t, x) { return t + x.d; }, 0);
      return num('During the month a business records these settlements:<br>' + cs.map(function (c, i) { return '• received ' + money(xs[i].net) + ' from ' + c + ' in full settlement of ' + money(xs[i].inv); }).join('<br>') + '<br>• paid ' + money(y.net) + ' to ' + s + ' in full settlement of ' + money(y.inv) + '.<br>What is the total discount allowed recorded in the cash book for the month? Give your answer in $.', tot,
        'The debit side holds discount allowed to customers only: ' + xs.map(function (x) { return money(x.d); }).join(' + ') + ' = ' + money(tot) + '. The ' + money(y.d) + ' from ' + s + ' is discount received, on the credit side.');
    } },
    { skill: 'spot-error', gen: function () {
      var c = pick(CUST), m = pick(MONTHS), od = rint(8, 30) * 25, x = discInvoice(400, 1500), so = rint(8, 30) * 10, cb = rint(20, 60) * 25, k = rint(0, 3);
      var lab = ['1 ' + m[0] + ': opening bank overdraft', '8 ' + m[0] + ': receipt from ' + c, '15 ' + m[0] + ': insurance by standing order', '21 ' + m[0] + ': cash paid into the bank'];
      var dr = [], cr = [];
      if (k === 0) dr.push(['1', 'Balance b/d', '', '', od]); else cr.push(['1', 'Balance b/d', '', '', od]);
      dr.push(['8', c, x.d, '', k === 1 ? x.inv : x.net]);
      if (k === 2) dr.push(['15', 'Insurance (SO)', '', '', so]); else cr.push(['15', 'Insurance (SO)', '', '', so]);
      dr.push(['21', 'Cash', '', '', cb]); if (k !== 3) cr.push(['21', 'Bank', '', cb, '']);
      var fix = ['An overdraft is owed to the bank, so the opening balance belongs on the credit side.',
        'The bank column should show the ' + money(x.net) + ' actually received, not the full ' + money(x.inv) + ' invoice.',
        'A standing order is a payment out of the bank, so it belongs on the credit side.',
        'A contra needs both entries: the credit side cash column should also show “Bank” ' + money(cb) + '.'][k];
      return mc('In ' + m[0] + ' a trader had: an opening bank overdraft of ' + money(od) + '; a cheque from ' + c + ' paying an invoice of ' + money(x.inv) + ' less ' + x.p + '% cash discount; insurance of ' + money(so) + ' paid by standing order; and ' + money(cb) + ' cash paid into the bank. A trainee wrote up the cash book like this.' + cashBook(dr, cr) + 'Which transaction has been recorded incorrectly?', lab[k], lab.filter(function (_, i) { return i !== k; }), fix);
    } },
    S('bank-items', mc('A shop sells goods and the customer pays in notes and coins. How is this recorded in the cash book?', 'Debit side, cash column, details “Sales”',
      ['Credit side, cash column, details “Sales”', 'Debit side, bank column, details “Sales”', 'Debit side, cash column, details “Cash”'],
      'Money received goes on the debit side, and notes and coins go in the cash column. The details name the other account, which is sales.')),
    S('bank-items', multi('Which of these are entered on the credit side of the bank column?', ['A standing order paid to a landlord', 'A customer’s cheque returned dishonoured', 'A cheque paid to a credit supplier'],
      ['A credit transfer received from a customer', 'Cash paid into the bank', 'An opening bank balance that is not overdrawn'],
      'Payments out of the bank are credits: standing orders, cheques paid and dishonoured cheques (money taken back out). Credit transfers received, cash banked and a positive opening balance are debits.')),
    { skill: 'settlement-discount', gen: function () {
      var s = pick(SUPP), p = pick([5, 10]), step = p === 5 ? 20 : 10, rem = rint(20, 120) * step, R = rint(4, 20) * 10, X = rem + R;
      return num('A business owed ' + s + ' ' + money(X) + ' for goods. It returned goods worth ' + money(R) + ' and then paid the balance by cheque within the time allowed for a ' + p + '% cash discount. What amount is entered in the bank column? Give your answer in $.', rem * (100 - p) / 100,
        'Amount owed after the return = ' + money(X) + ' − ' + money(R) + ' = ' + money(rem) + '. Discount = ' + p + '% × ' + money(rem) + ' = ' + money(rem * p / 100) + '. Paid = ' + money(rem) + ' − ' + money(rem * p / 100) + ' = ' + money(rem * (100 - p) / 100) + '.');
    } },
    S('balancing', mc('When the cash and bank columns are balanced at the end of the month, where is each balance brought down?', 'On the next day, on the opposite side to the balance c/d',
      ['On the same day, on the same side as the balance c/d', 'On the next day, as one combined cash and bank figure', 'On the next day, in the discount column of the same side'],
      'Each money column is balanced separately. The balance c/d goes on the smaller side on the last day, and it is brought down on the other side on the first day of the next month.')),
    S('contra', mc('A cash book shows “Cash $400” in the bank column on the debit side on 12 May, but there is no entry for it in the credit side cash column. What is wrong?', 'The matching credit in the cash column is missing',
      ['Nothing: a contra is entered on one side only', 'The $400 should be in the discount column', 'The $400 should be on the credit side of the bank column'],
      'Paying cash into the bank is a contra entry. Bank is debited and cash must also be credited (details “Bank”), so both columns stay correct.'))
  ] };

  // =====================================================================
  // ACC-REC-13 Discount columns in the cash book: where the totals go
  // =====================================================================
  var POST4 = ['Debit the discount allowed account', 'Credit the discount allowed account', 'Debit the discount received account', 'Credit the discount received account'];
  function totalsRow(m, a, b) {
    return cashBook([[m[1], 'Totals', a, '…', '…']], [[m[1], 'Totals', b, '…', '…']]);
  }
  B['ACC-REC-13'] = { title: 'Discount columns in the cash book: where the totals go', items: [
    S('credit-side-total', mc('At the end of June, Odile adds up the discount column on the payments side of her cash book. Where is this total posted in the nominal ledger?', POST4[3], [POST4[0], POST4[1], POST4[2]],
      'The payments (credit) side holds discounts received from suppliers. The total is posted to the same side of the matching account: credit discount received, which is income.')),
    S('debit-side-total', mc('Kasim totals the discount column on the receipts side of his three-column cash book at the month end. Where is that total posted in the nominal ledger?', POST4[0], [POST4[1], POST4[2], POST4[3]],
      'The receipts (debit) side holds discounts allowed to customers. The total is debited to the discount allowed account, which is an expense.')),
    { skill: 'credit-side-total', gen: function () {
      var m = pick(MONTHS), a = rint(20, 300), b = rint(20, 300);
      while (b === a) b = rint(20, 300);
      return mc('The discount column totals of a cash book for ' + m[0] + ' are shown.' + totalsRow(m, a, b) + 'Which entry is made in the nominal ledger for the ' + money(b) + ' total?', 'Credit discount received ' + money(b),
        ['Debit discount received ' + money(b), 'Credit discount allowed ' + money(b), 'Credit discount received ' + money(a)],
        'The ' + money(b) + ' is on the credit (payments) side, so it is discount received. It is credited to the discount received account. The ' + money(a) + ' on the debit side is discount allowed.');
    } },
    S('meaning', mc('In a three-column cash book, what is listed in the discount column on the receipts (<b>debit</b>) side?', 'Discounts allowed to credit customers for paying early',
      ['Discounts received from suppliers for paying early', 'Trade discounts given to customers buying in bulk', 'Refunds paid to customers who returned goods'],
      'The debit side records receipts. When a customer pays early and is allowed a discount, the discount is written beside the money received.')),
    S('meaning', mc('In a three-column cash book, what is listed in the discount column on the payments (<b>credit</b>) side?', 'Discounts given to the business by its suppliers',
      ['Discounts the business gave to its customers', 'Trade discounts shown on purchase invoices', 'Interest paid by the bank on the account'],
      'The credit side records payments. When the business pays a supplier early and deducts a discount, that discount received is written beside the payment.')),
    { skill: 'figure', gen: function () {
      var m = pick(MONTHS), a = rint(30, 400), b = rint(30, 400);
      while (b === a) b = rint(30, 400);
      return num('A cash book’s discount column totals for ' + m[0] + ' are shown.' + totalsRow(m, a, b) + 'What amount is posted to the discount received account? Give your answer in $.', b,
        'Discount received is on the credit (payments) side, so ' + money(b) + ' is credited to discount received. The debit-side total of ' + money(a) + ' is discount allowed.');
    } },
    { skill: 'figure', gen: function () {
      var cs = sample(CUST, 3), ds = cs.map(function () { return rint(6, 60); });
      var tot = ds[0] + ds[1] + ds[2];
      return num('In March three credit customers paid early and were allowed cash discounts:<br>' + cs.map(function (c, i) { return '• ' + c + ', ' + money(ds[i]); }).join('<br>') + '<br>What amount is debited to the discount allowed account at the end of March? Give your answer in $.', tot,
        'The debit-side discount column is totalled: ' + money(ds[0]) + ' + ' + money(ds[1]) + ' + ' + money(ds[2]) + ' = ' + money(tot) + ', and this total is debited to discount allowed.');
    } },
    { skill: 'personal-account', gen: function () {
      var c = pick(CUST), d = rint(5, 60);
      return mc(c + ' pays early and is allowed a discount of ' + money(d) + '. Besides the cash book, where else is this ' + money(d) + ' entered individually?', 'Credit side of ' + c + '’s account',
        ['Debit side of ' + c + '’s account', 'Credit side of the discount received account', 'Debit side of the sales account'],
        'The discount reduces what ' + c + ' owes, so it is credited to the customer’s account in the receivables ledger. The month’s total is debited to discount allowed.');
    } },
    { skill: 'personal-account', gen: function () {
      var s = pick(SUPP), d = rint(5, 60);
      return mc('A business pays ' + s + ' early and deducts a discount of ' + money(d) + '. Besides the cash book, where else is this ' + money(d) + ' entered individually?', 'Debit side of ' + poss(s) + ' account',
        ['Credit side of ' + poss(s) + ' account', 'Debit side of the discount allowed account', 'Credit side of the purchases account'],
        'The discount reduces what the business owes ' + s + ', so the supplier’s account in the payables ledger is debited. The month’s total is credited to discount received.');
    } },
    S('memorandum', mc('Why are the discount columns of a cash book totalled but never balanced?', 'They are not part of the double entry in the cash book',
      ['They always total exactly the same amount', 'They are balanced in the trial balance instead', 'Discounts are already included in the bank balance'],
      'No money moves when a discount is given, so the discount columns are only memorandum columns. Their totals are posted to the discount accounts in the nominal ledger.')),
    S('memorandum', mc('Matteo allows a customer a $25 discount for early payment. How does this $25 affect the cash and bank columns of his cash book?', 'It affects neither; it is only in the discount column',
      ['It is added to the bank column on the debit side', 'It is deducted from the cash column balance', 'It is entered in the bank column on the credit side'],
      'The discount is not money received or paid, so it never changes the cash or bank balance. It is written in the discount column next to the money actually received.')),
    S('personal-account', mc('The debit-side discount total is debited to the discount allowed account. Where are the matching credit entries made?', 'In each customer’s account in the receivables ledger',
      ['In the discount received account in the nominal ledger', 'In the bank column of the cash book', 'In each supplier’s account in the payables ledger'],
      'Each discount allowed is credited to the customer it was given to, because that customer now owes less. Together these credits match the total debited to discount allowed.')),
    S('personal-account', mc('The credit-side discount total is credited to the discount received account. Where are the matching debit entries made?', 'In each supplier’s account in the payables ledger',
      ['In each customer’s account in the receivables ledger', 'In the discount allowed account', 'In the purchases account'],
      'Each discount received is debited to the supplier who gave it, because the business now owes that supplier less.')),
    { skill: 'figure', gen: function () {
      var c = pick(CUST), s = sample(SUPP, 2), d1 = rint(10, 80), d2 = rint(5, 60), d3 = rint(5, 60);
      return num('During April a trader records these discounts in the cash book:<br>• allowed to ' + c + ', ' + money(d1) + '<br>• received from ' + s[0] + ', ' + money(d2) + '<br>• received from ' + s[1] + ', ' + money(d3) + '<br>What amount is credited to the discount received account at the end of April? Give your answer in $.', d2 + d3,
        'Only discounts received are on the credit side: ' + money(d2) + ' + ' + money(d3) + ' = ' + money(d2 + d3) + '. The ' + money(d1) + ' allowed to ' + c + ' goes to the discount allowed account.');
    } },
    S('memorandum', multi('Which statements about the discount columns of a three-column cash book are correct?', ['Discount allowed is recorded on the debit side', 'The columns are totalled, not balanced', 'Discount received is recorded on the credit side'],
      ['The columns are balanced at the end of the month', 'Discount received is recorded on the debit side', 'The totals change the bank balance'],
      'Discount allowed sits with receipts (debit) and discount received with payments (credit). The columns are memorandum only: totalled, never balanced, and they do not change cash or bank.')),
    { skill: 'debit-side-total', gen: function () {
      var a = rint(30, 300), b = rint(30, 300);
      while (b === a) b = rint(30, 300);
      return mc('A cash book’s discount column totals ' + money(a) + ' on the debit side and ' + money(b) + ' on the credit side. Which pair of postings is correct?', 'Debit discount allowed ' + money(a) + '; credit discount received ' + money(b),
        ['Debit discount received ' + money(b) + '; credit discount allowed ' + money(a), 'Debit discount allowed ' + money(b) + '; credit discount received ' + money(a), 'Credit discount allowed ' + money(a) + '; debit discount received ' + money(b)],
        'Each total goes to the same side of its own account: the debit-side ' + money(a) + ' is debited to discount allowed, and the credit-side ' + money(b) + ' is credited to discount received.');
    } },
    S('which-side', mc('On which side of a three-column cash book is discount allowed recorded?', 'Debit side, next to the money received',
      ['Credit side, next to the money paid', 'Credit side, next to the money received', 'Only in the sales day book, not the cash book'],
      'Discount allowed is given to a customer who is paying, so it is written on the receipts (debit) side, beside the amount received from that customer.')),
    { skill: 'which-side', gen: function () {
      var cust = Math.random() < 0.5, d = rint(5, 60), n = cust ? pick(CUST) : pick(SUPP);
      var opts = ['Debit side discount column', 'Credit side discount column', 'Debit side bank column', 'Credit side bank column'], k = cust ? 0 : 1;
      return mc(cust ? n + ', a credit customer, pays early and is allowed ' + money(d) + ' discount. Where is the ' + money(d) + ' recorded in the cash book?' : 'A business pays ' + n + ' early and deducts ' + money(d) + ' discount. Where is the ' + money(d) + ' recorded in the cash book?',
        opts[k], opts.filter(function (_, i) { return i !== k; }),
        cust ? 'Discount allowed goes in the discount column on the debit (receipts) side. It is not money, so it is not in the bank column.' : 'Discount received goes in the discount column on the credit (payments) side. It is not money, so it is not in the bank column.');
    } },
    { skill: 'which-side', gen: function () {
      var c = pick(CUST), y = rint(20, 150) * 10, d = rint(5, 40);
      return mc(c + ' owed ' + money(y + d) + ' and pays ' + money(y) + ' by cheque, being allowed ' + money(d) + ' discount. Which entries are made on that line of the cash book?', 'Discount ' + money(d) + ' and bank ' + money(y) + ', both on the debit side',
        ['Discount ' + money(d) + ' and bank ' + money(y + d) + ', both on the debit side', 'Bank ' + money(y + d) + ' on the debit side, with no discount', 'Discount ' + money(d) + ' on the credit side and bank ' + money(y) + ' on the debit side'],
        'The bank column shows the money actually received (' + money(y) + ') and the discount column shows ' + money(d) + ' on the same, debit, side. Together they clear the ' + money(y + d) + ' debt.');
    } },
    S('debit-side-total', mc('Why is the debit-side discount total debited to the discount allowed account?', 'Discount allowed is an expense of the business',
      ['Discount allowed is income earned by the business', 'Discount allowed is a liability owed to customers', 'Discount allowed is money received from customers'],
      'Giving customers a discount costs the business money, so discount allowed is an expense. Expenses are debited.')),
    S('credit-side-total', mc('Why is the credit-side discount total credited to the discount received account?', 'Discount received is income for the business',
      ['Discount received is an expense of the business', 'Discount received is an asset of the business', 'Discount received reduces the owner’s equity'],
      'Paying a supplier less than the invoice is a gain for the business, so discount received is income. Income is credited.')),
    { skill: 'credit-side-total', gen: function () {
      var n = pick(['Ines', 'Bruno', 'Sakura', 'Tobi']), b = rint(30, 300);
      return mc('A trainee bookkeeper, ' + n + ', posted the ' + money(b) + ' total of the credit-side discount column to the <b>debit</b> of the discount received account. Which entry should have been made?', 'Credit discount received ' + money(b),
        ['Debit discount allowed ' + money(b), 'Credit discount allowed ' + money(b), 'Debit discount received ' + money(b) + ' (no error)'],
        'The credit-side total is discount received, which is income, so it is credited to the discount received account. Posting it as a debit reverses the side.');
    } }
  ] };

  // =====================================================================
  // ACC-REC-20 Writing up customer and supplier accounts
  // =====================================================================
  function tradeRate() { return pick([10, 20, 25]); }
  var CUST_TX = [
    ['sold goods on credit to the customer', 0, 'Sales day book', 'the customer now owes more'],
    ['received faulty goods back from the customer', 1, 'Sales returns day book', 'the customer now owes less'],
    ['received a cheque from the customer', 1, 'Bank', 'the customer now owes less'],
    ['was told by the bank that it had dishonoured a cheque from the customer', 0, 'Bank', 'the customer owes the money again'],
    ['wrote off as irrecoverable the debt owed by the customer', 1, 'Irrecoverable debts', 'the debt is removed']];
  var SUPP_TX = [
    ['bought goods on credit from the supplier', 1, 'Purchases day book', 'the business now owes more'],
    ['returned damaged goods to the supplier', 0, 'Purchases returns day book', 'the business now owes less'],
    ['made a payment by cheque to the supplier', 0, 'Bank', 'the business now owes less'],
    ['deducted a cash discount for early payment when paying the supplier', 0, 'Discount received', 'the business now owes less']];
  function sideOpts(k, det, otherDet) {
    var sd = ['Debit side', 'Credit side'];
    return { right: sd[k] + ', details “' + det + '”', wrong: [sd[1 - k] + ', details “' + det + '”', sd[k] + ', details “' + otherDet + '”', sd[1 - k] + ', details “' + otherDet + '”'] };
  }
  B['ACC-REC-20'] = { title: 'Writing up customer and supplier accounts', items: [
    { skill: 'balancing', gen: function () {
      var c = pick(CUST), m = pick(MONTHS), O = rint(10, 60) * 10, Sa = rint(20, 100) * 10, Rt = rint(2, 12) * 10, P = rint(10, 50) * 10;
      while (O + Sa - Rt - P <= 0) P -= 50;
      var bal = O + Sa - Rt - P;
      return num('On 1 ' + m[0] + ' ' + c + ', a credit customer, owed a trader ' + money(O) + '. During ' + m[0] + ':<br>• 7 ' + m[0] + ': goods sold to ' + c + ' on credit, ' + money(Sa) + '<br>• 12 ' + m[0] + ': ' + c + ' returned goods, ' + money(Rt) + '<br>• 25 ' + m[0] + ': cheque received from ' + c + ', ' + money(P) + '<br>What is the balance brought down on ' + c + '’s account on 1 ' + m[2] + '? Give your answer in $.', bal,
        'Debit side: ' + money(O) + ' + ' + money(Sa) + ' = ' + money(O + Sa) + '. Credit side: ' + money(Rt) + ' + ' + money(P) + ' = ' + money(Rt + P) + '. Balance b/d = ' + money(bal) + ' on the debit side: the amount ' + c + ' still owes.');
    } },
    { skill: 'balancing', gen: function () {
      var s = pick(SUPP), m = pick(MONTHS), x = discInvoice(300, 1500), Pu = rint(20, 100) * 10, Rt = rint(2, 12) * 10;
      var bal = Pu - Rt;
      return num('On 1 ' + m[0] + ' a business owed ' + s + ' ' + money(x.inv) + '. During ' + m[0] + ':<br>• 5 ' + m[0] + ': bought goods on credit from ' + s + ', ' + money(Pu) + '<br>• 9 ' + m[0] + ': settled the opening balance by cheque, less ' + x.p + '% cash discount<br>• 18 ' + m[0] + ': returned goods to ' + s + ', ' + money(Rt) + '<br>What is the balance brought down on ' + poss(s) + ' account on 1 ' + m[2] + '? Give your answer in $.', bal,
        'Credit side: ' + money(x.inv) + ' + ' + money(Pu) + ' = ' + money(x.inv + Pu) + '. Debit side: bank ' + money(x.net) + ' + discount received ' + money(x.d) + ' + returns ' + money(Rt) + ' = ' + money(x.net + x.d + Rt) + '. Balance b/d = ' + money(bal) + ' (credit). Forgetting the discount line would leave ' + money(x.d) + ' too much.');
    } },
    { skill: 'trade-discount', gen: function () {
      var c = pick(CUST), t = tradeRate(), L = rint(10, 150) * 20;
      return num('A wholesaler sells goods with a list price of ' + money(L) + ' to ' + c + ' on credit, less ' + t + '% trade discount. What amount is entered in ' + c + '’s account? Give your answer in $.', L * (100 - t) / 100,
        'Trade discount = ' + t + '% × ' + money(L) + ' = ' + money(L * t / 100) + '. Only the net amount is recorded: ' + money(L) + ' − ' + money(L * t / 100) + ' = ' + money(L * (100 - t) / 100) + '.');
    } },
    { skill: 'trade-discount', gen: function () {
      var s = pick(SUPP), t = tradeRate(), L = rint(3, 40) * 20;
      return num('A business bought goods from ' + s + ' at list price less ' + t + '% trade discount. It returns some of these goods with a list price of ' + money(L) + '. What amount is entered in ' + poss(s) + ' account for the return? Give your answer in $.', L * (100 - t) / 100,
        'The returned goods were bought at the discounted price, so the same ' + t + '% trade discount applies: ' + money(L) + ' − ' + money(L * t / 100) + ' = ' + money(L * (100 - t) / 100) + '.');
    } },
    { skill: 'cash-discount', gen: function () {
      var s = pick(SUPP), x = discInvoice(400, 2500);
      return num('A business owes ' + s + ' ' + money(x.inv) + '. It pays within the period allowed for a ' + x.p + '% cash discount. What amount of discount received is entered in ' + poss(s) + ' account? Give your answer in $.', x.d,
        'Discount received = ' + x.p + '% × ' + money(x.inv) + ' = ' + money(x.d) + '. It is debited to the supplier’s account next to the payment of ' + money(x.net) + '.');
    } },
    { skill: 'cash-discount', gen: function () {
      var c = pick(CUST), x = discInvoice(300, 2000), m = pick(MONTHS), d0 = rint(1, 6), days = pick([7, 10, 14]), d1 = d0 + days + rint(3, 9);
      return num('A trader offers ' + x.p + '% cash discount if invoices are paid within ' + days + ' days. ' + c + ' was invoiced ' + money(x.inv) + ' on ' + d0 + ' ' + m[0] + ' and paid by cheque on ' + d1 + ' ' + m[0] + '. What amount is credited to ' + c + '’s account for the payment? Give your answer in $.', x.inv,
        'Payment came ' + (d1 - d0) + ' days after the invoice, which is outside the ' + days + ' days allowed, so no discount is given. The full ' + money(x.inv) + ' is received and credited.');
    } },
    { skill: 'balancing', gen: function () {
      var s = pick(SUPP), m = pick(MONTHS), t = tradeRate(), L = rint(20, 100) * 20, Rl = rint(2, 10) * 20, x = discInvoice(300, 1200);
      var pu = L * (100 - t) / 100, rt = Rl * (100 - t) / 100, bal = pu - rt;
      return num('On 1 ' + m[0] + ' a business owed ' + s + ' ' + money(x.inv) + '. In ' + m[0] + ' it bought goods with a list price of ' + money(L) + ' less ' + t + '% trade discount, returned goods with a list price of ' + money(Rl) + ' from that order, and paid the opening balance by cheque less ' + x.p + '% cash discount. What is the balance on ' + poss(s) + ' account at the end of the month? Give your answer in $.', bal,
        'Purchases = ' + money(L) + ' less ' + t + '% = ' + money(pu) + '. Returns = ' + money(Rl) + ' less ' + t + '% = ' + money(rt) + '. The opening ' + money(x.inv) + ' is cleared by bank ' + money(x.net) + ' plus discount ' + money(x.d) + '. Balance = ' + money(pu) + ' − ' + money(rt) + ' = ' + money(bal) + ' (credit).');
    } },
    { skill: 'entry-side', gen: function () {
      var c = pick(CUST), k = rint(0, CUST_TX.length - 1), tx = CUST_TX[k];
      var other = pick(CUST_TX.filter(function (t) { return t[2] !== tx[2]; }))[2], o = sideOpts(tx[1], tx[2], other);
      return mc('A trader ' + tx[0] + ', ' + c + '. How is this entered in ' + c + '’s account in the receivables ledger?', o.right, o.wrong,
        (tx[1] ? 'Credit' : 'Debit') + ' side, because ' + tx[3] + '. The details name the other account or book: “' + tx[2] + '”.');
    } },
    { skill: 'entry-side', gen: function () {
      var s = pick(SUPP), k = rint(0, SUPP_TX.length - 1), tx = SUPP_TX[k];
      var other = pick(SUPP_TX.filter(function (t) { return t[2] !== tx[2]; }))[2], o = sideOpts(tx[1], tx[2], other);
      return mc('A business ' + tx[0] + ', ' + s + '. How is this entered in ' + poss(s) + ' account in the payables ledger?', o.right, o.wrong,
        (tx[1] ? 'Credit' : 'Debit') + ' side, because ' + tx[3] + '. The details name the other account or book: “' + tx[2] + '”.');
    } },
    S('details', mc('Mbali receives a cheque from her credit customer Joel Kirk. In Joel Kirk’s account, what is written in the details column for this entry?', 'Bank',
      ['Joel Kirk', 'Sales day book', 'Discount allowed'],
      'The details column names the other account in the double entry. The money went into the bank, so the details are “Bank” (or “Cash book”), never the customer’s own name.')),
    S('balance-bd', mc('A customer’s account in the receivables ledger has a debit balance b/d of $640. What does this mean?', 'The customer owes the business $640',
      ['The business owes the customer $640', 'The customer has overpaid by $640', 'The customer has $640 of goods on order'],
      'A customer’s account normally has a debit balance, which is the amount still owed to the business.')),
    S('unusual-balance', mc('Which of these could cause a credit balance on a customer’s account?', 'The customer paid more than the amount owed',
      ['The business sold more goods to the customer', 'The customer was given a trade discount', 'The customer’s cheque was dishonoured'],
      'If the customer pays more than the debt (or pays in advance), the credits exceed the debits, so the business owes the customer. The other events increase or do not change the debit balance.')),
    S('unusual-balance', multi('A supplier’s account in the payables ledger has a <b>debit</b> balance. Which of these could explain it?', ['The business paid the supplier too much', 'The business paid for goods in advance', 'Goods were returned after the invoice had been paid'],
      ['More goods were bought on credit', 'The supplier allowed a trade discount', 'The supplier sent a new invoice'],
      'A debit balance means the supplier owes the business. That happens after an overpayment, an advance payment, or returning goods that were already paid for. More credit purchases or invoices increase the normal credit balance.')),
    { skill: 'spot-error', gen: function () {
      var s = pick(SUPP), m = pick(MONTHS), O = rint(20, 80) * 10, Pu = rint(20, 80) * 10, Rt = rint(2, 10) * 10, P = O, k = rint(0, 2);
      var lab = ['Purchases day book', 'Purchases returns day book', 'Bank'];
      var dr = [], cr = [['1', 'Balance b/d', O]];
      if (k === 0) dr.push(['6', 'Purchases day book', Pu]); else cr.push(['6', 'Purchases day book', Pu]);
      if (k === 1) cr.push(['14', 'Purchases returns day book', Rt]); else dr.push(['14', 'Purchases returns day book', Rt]);
      if (k === 2) cr.push(['20', 'Bank', P]); else dr.push(['20', 'Bank', P]);
      var why = ['Credit purchases increase the amount owed, so they belong on the credit side.', 'Returns to the supplier reduce the amount owed, so they belong on the debit side.', 'A payment to the supplier reduces the amount owed, so it belongs on the debit side.'][k];
      return mc('A trainee has written up ' + poss(s) + ' account in the payables ledger for ' + m[0] + ' (before balancing).' + account(dr, cr) + 'Which entry is on the wrong side?', lab[k], lab.filter(function (_, i) { return i !== k; }).concat(['Balance b/d']), why + ' The opening balance owed to a supplier is correctly on the credit side.');
    } },
    { skill: 'balance-bd', gen: function () {
      var c = pick(CUST), m = pick(MONTHS), dr = rint(40, 200) * 10, cr = dr - rint(5, 30) * 10, d = dr - cr;
      return mc('Before balancing, ' + c + '’s account (a credit customer) totals ' + money(dr) + ' on the debit side and ' + money(cr) + ' on the credit side. How is the account balanced?', 'Balance c/d ' + money(d) + ' on the credit side; balance b/d on the debit side on 1 ' + m[2],
        ['Balance c/d ' + money(d) + ' on the debit side; balance b/d on the credit side on 1 ' + m[2], 'Balance c/d ' + money(d) + ' on the credit side; balance b/d on the credit side on 1 ' + m[2], 'Balance c/d ' + money(dr + cr) + ' on the credit side; balance b/d on the debit side on 1 ' + m[2]],
        'The balance c/d (' + money(dr) + ' − ' + money(cr) + ' = ' + money(d) + ') goes on the smaller, credit side so both totals are ' + money(dr) + '. It is brought down on the opposite (debit) side: the customer owes ' + money(d) + '.');
    } },
    { skill: 'balancing', gen: function () {
      var c = pick(CUST), m = pick(MONTHS), x = discInvoice(200, 800), O = x.inv, Sa = rint(20, 90) * 10, Rt = rint(2, 8) * 10;
      var dr = [['1', 'Balance b/d', O], ['10', 'Sales day book', Sa]], cr = [['8', 'Bank', x.net], ['8', 'Discount allowed', x.d], ['22', 'Sales returns day book', Rt]];
      var bal = O + Sa - x.net - x.d - Rt;
      return num(c + '’s account for ' + m[0] + ' is shown before balancing.' + account(dr, cr) + 'What is the balance brought down on 1 ' + m[2] + '? Give your answer in $.', bal,
        'Debit total = ' + money(O) + ' + ' + money(Sa) + ' = ' + money(O + Sa) + '. Credit total = ' + money(x.net) + ' + ' + money(x.d) + ' + ' + money(Rt) + ' = ' + money(x.net + x.d + Rt) + '. Balance b/d = ' + money(bal) + ' on the debit side.');
    } },
    { skill: 'cash-discount', gen: function () {
      var c = pick(CUST), x = discInvoice(400, 2400);
      return num(c + ' owed ' + money(x.inv) + ' and paid ' + money(x.net) + ' in full settlement. What amount of discount allowed is entered in ' + c + '’s account? Give your answer in $.', x.d,
        'Payment plus discount must clear the debt: ' + money(x.inv) + ' − ' + money(x.net) + ' = ' + money(x.d) + ' discount allowed, credited to ' + c + '’s account.');
    } },
    { skill: 'entry-side', gen: function () {
      var c = pick(CUST), x = discInvoice(400, 2400);
      return mc(c + ' owed ' + money(x.inv) + ' and paid ' + money(x.net) + ' by cheque in full settlement. The cheque is credited to ' + c + '’s account. Which other entry is needed in that account?', 'Credit: Discount allowed ' + money(x.d),
        ['Debit: Discount allowed ' + money(x.d), 'Credit: Discount received ' + money(x.d), 'Debit: Sales returns ' + money(x.d)],
        'The ' + money(x.d) + ' difference is discount allowed. It also reduces what ' + c + ' owes, so it goes on the credit side next to the payment, clearing the debt.');
    } },
    { skill: 'balancing', gen: function () {
      var s = pick(SUPP), m = pick(MONTHS), O = rint(20, 80) * 10, Pu = rint(30, 90) * 10, Rt = rint(2, 8) * 10, cl = rint(10, 40) * 10;
      var pay = O + Pu - Rt - cl;
      return num('A business’s account for ' + s + ' shows: balance b/d on 1 ' + m[0] + ' ' + money(O) + ' (credit); credit purchases ' + money(Pu) + '; purchases returns ' + money(Rt) + '; and one payment by cheque. The balance b/d on 1 ' + m[2] + ' is ' + money(cl) + ' (credit). There was no discount. How much was the payment? Give your answer in $.', pay,
        'Credits ' + money(O) + ' + ' + money(Pu) + ' = ' + money(O + Pu) + ' must equal debits: returns ' + money(Rt) + ' + payment + balance c/d ' + money(cl) + '. Payment = ' + money(O + Pu) + ' − ' + money(Rt) + ' − ' + money(cl) + ' = ' + money(pay) + '.');
    } },
    S('balance-bd', mc('How is the balance owed to a credit supplier at the start of the month shown in that supplier’s account?', 'Credit side, details “Balance b/d”',
      ['Debit side, details “Balance b/d”', 'Credit side, details “Balance c/d”', 'Debit side, details “Purchases day book”'],
      'An amount owed to a supplier is a liability, so it is brought down on the credit side on the first day, labelled “Balance b/d”.')),
    { skill: 'unusual-balance', gen: function () {
      var c = pick(CUST), m = pick(MONTHS), O = rint(20, 80) * 10, Rt = rint(2, 9) * 10;
      return mc('On 1 ' + m[0] + ' ' + c + ' owed a trader ' + money(O) + '. On 6 ' + m[0] + ' ' + c + ' paid the full ' + money(O) + ' by cheque. On 20 ' + m[0] + ' ' + c + ' returned goods worth ' + money(Rt) + ' from an earlier order. There were no other transactions. What is the balance on 1 ' + m[2] + '?', 'Credit balance of ' + money(Rt) + ': the trader owes ' + c,
        ['Debit balance of ' + money(Rt) + ': ' + c + ' owes the trader', 'Credit balance of ' + money(O - Rt) + ': the trader owes ' + c, 'Nil: the account is fully cleared'],
        'Debits ' + money(O) + '; credits ' + money(O) + ' + ' + money(Rt) + '. The extra ' + money(Rt) + ' credit gives an unusual credit balance: the trader now owes the customer for goods returned after payment.');
    } },
    S('trade-discount', mc('Why does trade discount not appear as a separate line in a customer’s account?', 'It is deducted before the sale is recorded',
      ['It is posted to the discount allowed account instead', 'It is only given when a customer pays early', 'It is recorded in the cash book discount column'],
      'Trade discount is a reduction in the list price for trade customers. Only the net invoice amount is recorded, so no discount line appears. Cash discount, for early payment, does appear.')),
    { skill: 'trade-discount', gen: function () {
      var c = pick(CUST), t = tradeRate(), p = 5, L = rint(1, 8) * 400;
      var net = L * (100 - t) / 100, d = net * p / 100;
      return num('Goods with a list price of ' + money(L) + ' are sold to ' + c + ' less ' + t + '% trade discount. ' + c + ' pays within the time allowed for a ' + p + '% cash discount. How much does ' + c + ' pay? Give your answer in $.', net - d,
        'Invoice = ' + money(L) + ' less ' + t + '% = ' + money(net) + '. Cash discount = ' + p + '% × ' + money(net) + ' = ' + money(d) + '. Paid = ' + money(net) + ' − ' + money(d) + ' = ' + money(net - d) + '. Cash discount is worked out on the net invoice, not the list price.');
    } }
  ] };
})();
