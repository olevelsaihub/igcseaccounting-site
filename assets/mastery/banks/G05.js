/* Group G05 mastery bank: Correction of errors and the suspense account; Control accounts; Bank reconciliation. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function rstep(a, b, s) { return s * rint(Math.ceil(a / s), Math.floor(b / s)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function pickN(a, n) { var c = a.slice(), o = []; while (o.length < n && c.length) o.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return o; }
  function num(n) { return Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function money(n) { return (n < 0 ? '−$' : '$') + num(n); }
  function disp(n) { return (n < 0 ? '-' : '') + num(n); }
  function bracket(n) { return n < 0 ? '(' + num(n) + ')' : num(n); }
  // Options with the correct one first; later duplicates are dropped and the list is topped up to `size`.
  function uniq(correct, cands, size, extra) {
    var out = [correct];
    cands.forEach(function (c) { if (out.indexOf(c) < 0) out.push(c); });
    (extra || []).forEach(function (c) { if (out.length < (size || 4) && out.indexOf(c) < 0) out.push(c); });
    return out.slice(0, size || 4);
  }
  // Money options built from numbers; tops up with nearby values if two distractors collide.
  function moneyOpts(correct, cands, step) {
    var vals = [correct];
    cands.forEach(function (c) { if (vals.indexOf(c) < 0) vals.push(c); });
    var k = 1; step = step || 10;
    while (vals.length < 4) { [correct + k * step, correct - k * step].forEach(function (v) { if (vals.length < 4 && vals.indexOf(v) < 0) vals.push(v); }); k++; }
    return vals.slice(0, 4).map(money);
  }
  function mcq(q, options, why, extra) { var o = { kind: 'mcq', q: q, options: options, answer: 0, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function numq(q, answer, why, extra) { var o = { kind: 'num', q: q, answer: answer, unit: '$', display: disp(answer), why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function jr(dr, cr, amt) { return 'Dr ' + dr + ' ' + money(amt) + '; Cr ' + cr + ' ' + money(amt); }
  // T-account as a table: dr and cr are arrays of [details, amount].
  function tacct(title, dr, cr, total) {
    var n = Math.max(dr.length, cr.length), h = '<table class="mc-table"><tr><th colspan="4">' + title + '</th></tr><tr><th>Details (Dr)</th><th>$</th><th>Details (Cr)</th><th>$</th></tr>';
    for (var i = 0; i < n; i++) {
      var d = dr[i], c = cr[i];
      h += '<tr><td>' + (d ? d[0] : '') + '</td><td>' + (d ? num(d[1]) : '') + '</td><td>' + (c ? c[0] : '') + '</td><td>' + (c ? num(c[1]) : '') + '</td></tr>';
    }
    if (total) h += '<tr><td></td><td><b>' + num(total) + '</b></td><td></td><td><b>' + num(total) + '</b></td></tr>';
    return h + '</table>';
  }
  // A two-column list (label | $) as a table.
  function list(title, rows) {
    var h = '<table class="mc-table">' + (title ? '<tr><th colspan="2">' + title + '</th></tr>' : '');
    rows.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td>' + (typeof r[1] === 'number' ? num(r[1]) : r[1]) + '</td></tr>'; });
    return h + '</table>';
  }
  var PEOPLE = ['Bello', 'Chen', 'Diaz', 'Eriksen', 'Farah', 'Gupta', 'Haddad', 'Ito', 'Jensen', 'Kowalski', 'Lopez', 'Mbeki', 'Novak', 'Okafor', 'Petrov', 'Rossi', 'Sato', 'Tanaka', 'Varga', 'Walsh', 'Yilmaz', 'Zhou', 'Achebe', 'Moreau'];
  var OWNERS = ['Leila', 'Tomasz', 'Nadia', 'Kwame', 'Ingrid', 'Rafael', 'Sunita', 'Oskar', 'Mei', 'Amaru', 'Zainab', 'Felix'];
  var MONTHS = [['31 January', '1 February'], ['31 March', '1 April'], ['30 April', '1 May'], ['31 May', '1 June'], ['30 June', '1 July'], ['31 August', '1 September'], ['30 September', '1 October'], ['30 November', '1 December']];
  function two() { return pickN(PEOPLE, 2); }
  // Three-digit amount with three different digits, and the same amount with the last two digits swapped.
  function transposed() {
    var a, b, c; do { a = rint(1, 9); b = rint(0, 9); c = rint(0, 9); } while (a === b || b === c || a === c);
    return [100 * a + 10 * b + c, 100 * a + 10 * c + b];
  }

  // ======================================================================
  // ACC-CTL-07 Types of error
  // ======================================================================
  var ERR = { om: 'Omission', com: 'Commission', pr: 'Principle', oe: 'Original entry', rev: 'Complete reversal', cp: 'Compensating' };
  function errQ(q, key, must, why) {
    var others = Object.keys(ERR).filter(function (k) { return k !== key && must.indexOf(k) < 0; });
    var keys = [key].concat(must, pickN(others, 3 - must.length));
    return mcq(q, keys.map(function (k) { return ERR[k]; }), why);
  }
  function revealQ(q, kind, d, why) {
    // kind: 'dr' debit total higher by d, 'cr' credit total higher by d
    var right = kind === 'dr' ? 'Yes: the debit total is higher by ' + money(d) : 'Yes: the credit total is higher by ' + money(d);
    var wrongSide = kind === 'dr' ? 'Yes: the credit total is higher by ' + money(d) : 'Yes: the debit total is higher by ' + money(d);
    var alt = d % 2 === 0 ? d / 2 : d * 2;
    var other = (kind === 'dr' ? 'Yes: the debit total is higher by ' : 'Yes: the credit total is higher by ') + money(alt);
    return mcq(q, [right, wrongSide, other, 'No: the two totals still agree'], why);
  }

  B['ACC-CTL-07'] = { title: 'Types of error and whether the trial balance shows them', items: [
    { skill: 'name the error', gen: function () {
      var c = pick(PEOPLE), a = rstep(150, 950, 10), o = pick(OWNERS);
      return errQ(o + ' sold goods on credit to ' + c + ' for ' + money(a) + '. The invoice was mislaid before it reached the sales day book, so nothing was recorded anywhere. Name the type of error.',
        'om', ['com', 'oe'], 'The transaction was left out of the books completely, with no debit and no credit, so it is an error of omission. Because both sides are missing, the trial balance still agrees.');
    } },
    { skill: 'name the error', gen: function () {
      var p = two(), a = rstep(80, 900, 5);
      return errQ('A cheque for ' + money(a) + ' received from ' + p[0] + ', a credit customer, was entered correctly in the cash book but credited to the account of ' + p[1] + ', another credit customer. Name the type of error.',
        'com', ['pr', 'rev'], 'The right amount went to the wrong account of the SAME kind (one customer instead of another), so it is an error of commission. The debit and credit are still equal.');
    } },
    { skill: 'name the error', gen: function () {
      var a = rstep(4000, 18000, 500), item = pick(['a delivery van', 'a forklift truck', 'a refrigerated display unit', 'a cash register']), exp = { 'a delivery van': 'motor expenses', 'a forklift truck': 'repairs', 'a refrigerated display unit': 'general expenses', 'a cash register': 'general expenses' }[item];
      return errQ('The purchase of ' + item + ' for ' + money(a) + ', paid by bank transfer, was debited to the ' + exp + ' account. Name the type of error.',
        'pr', ['com', 'oe'], 'A non-current asset was recorded as an expense: the wrong KIND of account was used. That is an error of principle, not commission, because the two accounts are in different classes.');
    } },
    { skill: 'name the error', gen: function () {
      var t = transposed(), c = pick(PEOPLE);
      return errQ('A credit sale to ' + c + ' for ' + money(t[0]) + ' was entered in the sales day book as ' + money(t[1]) + '. Both the sales account and ' + c + '’s account were then posted with ' + money(t[1]) + '. Name the type of error.',
        'oe', ['cp', 'com'], 'The wrong amount was written in the book of prime entry, so both the debit and the credit carry the same wrong figure (' + money(t[1]) + '). That is an error of original entry.');
    } },
    { skill: 'name the error', gen: function () {
      var a = rstep(60, 640, 5);
      return errQ('Cash sales of ' + money(a) + ' were debited to the sales account and credited to the cash account. Name the type of error.',
        'rev', ['pr', 'com'], 'The correct two accounts and the correct amount were used, but the debit and credit were swapped. That is a complete reversal of entries.');
    } },
    { skill: 'name the error', gen: function () {
      var a = rstep(100, 900, 100), pair = pick([['rent', 'sales'], ['wages', 'commission received'], ['electricity', 'rent received'], ['purchases', 'discount received']]);
      return errQ('The ' + pair[0] + ' account was overcast by ' + money(a) + ', and in a separate mistake the ' + pair[1] + ' account was also overcast by ' + money(a) + '. Name the type of error.',
        'cp', ['oe', 'om'], 'The ' + pair[0] + ' account has a debit balance and the ' + pair[1] + ' account has a credit balance, so both totals rise by ' + money(a) + ' and the two mistakes cancel out. That is a compensating error.');
    } },
    { skill: 'name the error', q: 'The owner’s private holiday was paid for from the business bank account, and the payment was debited to the travel expenses account. Name the type of error.',
      kind: 'mcq', options: ['Principle', 'Commission', 'Omission', 'Complete reversal'], answer: 0,
      why: 'A private payment should be debited to drawings (a reduction of equity), but it went to an expense account, which is a different class. Posting to the wrong class of account is an error of principle.' },
    { skill: 'name the error', gen: function () {
      var a = rstep(40, 380, 5);
      return errQ('Office stationery costing ' + money(a) + ' was paid by cheque. The cheque was entered correctly in the cash book, but the debit was posted to the rent account. Name the type of error.',
        'com', ['pr', 'oe'], 'Rent and stationery are both expense accounts, so the amount went to the wrong account of the same class. That is an error of commission.');
    } },
    { skill: 'name the error', q: 'Goods that cost $260 were taken from inventory by the owner for family use. No entry of any kind was made in the books. Name the type of error.',
      kind: 'mcq', options: ['Omission', 'Principle', 'Commission', 'Compensating'], answer: 0,
      why: 'No debit and no credit were made at all, so this is an error of omission, even though the correct entry would involve drawings.' },
    { skill: 'name the error', gen: function () {
      var s = pick(PEOPLE), a = rstep(120, 990, 10);
      return errQ('A payment of ' + money(a) + ' to ' + s + ', a credit supplier, was recorded as a debit in the bank account and a credit in ' + s + '’s account. Name the type of error.',
        'rev', ['com', 'om'], 'The bank and ' + s + ' are the right accounts and ' + money(a) + ' is the right amount, but the debit and credit have been swapped. That is a complete reversal.');
    } },
    { skill: 'name the error', gen: function () {
      var a = rstep(600, 2400, 50);
      return errQ('A laptop for use in the office, costing ' + money(a) + ', was bought on credit. It was debited to the purchases account. Name the type of error.',
        'pr', ['com', 'rev'], 'The laptop is a non-current asset, but purchases is an expense account for goods bought for resale. Using the wrong class of account is an error of principle.');
    } },
    { skill: 'name the error', gen: function () {
      var t = transposed(), s = pick(PEOPLE);
      return errQ('A credit note for ' + money(t[0]) + ' received from ' + s + ', a supplier, was entered in the purchases returns day book as ' + money(t[1]) + ' and posted from there. Name the type of error.',
        'oe', ['cp', 'rev'], 'The wrong figure was entered in the book of prime entry, so both ' + s + '’s account and purchases returns carry ' + money(t[1]) + '. Both sides are equally wrong: an error of original entry.');
    } },
    // ---- does the trial balance show it? ----
    { skill: 'trial balance effect', gen: function () {
      var t = transposed(), up = Math.random() < 0.5, c = up ? t[0] : t[1], w = up ? t[1] : t[0], d = Math.abs(w - c);
      var q = 'Repairs of ' + money(c) + ' were paid by cheque and entered correctly in the cash book. The repairs account was debited with ' + money(w) + '. Will the trial balance totals disagree?';
      return revealQ(q, w > c ? 'dr' : 'cr', d, 'The bank credit is ' + money(c) + ' but the repairs debit is ' + money(w) + ', so only one side is wrong. The ' + (w > c ? 'debit' : 'credit') + ' total is higher by ' + (w > c ? money(w) + ' − ' + money(c) : money(c) + ' − ' + money(w)) + ' = ' + money(d) + '.');
    } },
    { skill: 'trial balance effect', gen: function () {
      var a = rstep(150, 800, 10), c = pick(PEOPLE);
      return revealQ('A credit sale of ' + money(a) + ' to ' + c + ' was entered on the credit side of ' + c + '’s account and on the credit side of the sales account. Will the trial balance totals disagree?', 'cr', 2 * a,
        'There are two credits of ' + money(a) + ' and no debit. Compared with a correct entry, credits rise by ' + money(a) + ' and debits fall by ' + money(a) + ', so the credit total is higher by 2 × ' + money(a) + ' = ' + money(2 * a) + '.');
    } },
    { skill: 'trial balance effect', gen: function () {
      var a = rstep(20, 95, 5), c = pick(PEOPLE), b = rstep(300, 900, 10), s = pick(PEOPLE), e = rstep(150, 600, 10), f = rstep(200, 700, 10);
      return mcq('Which error would be shown up by the trial balance totals not agreeing?', [
        'Discount allowed of ' + money(a) + ' credited to ' + c + ' only, with no other entry',
        'A credit purchase of ' + money(b) + ' from ' + s + ' left out of all the books',
        'Rent paid of ' + money(e) + ' debited to the rates account in error',
        'Cash sales of ' + money(f) + ' debited to sales and credited to cash'
      ], 'Only the discount allowed error is one-sided: ' + c + '’s account was credited but no debit was made, so the credit total is ' + money(a) + ' higher. Omission, commission and complete reversal all keep debits equal to credits.');
    } },
    { skill: 'trial balance effect', gen: function () {
      var a = rstep(30, 300, 10), t = transposed(), z = rstep(400, 1500, 50);
      return mcq('Which error would cause the trial balance totals to disagree?', [
        'The wages account balance was undercast by ' + money(a),
        'Heating and rent received both overcast by ' + money(a),
        'A sales invoice of ' + money(t[0]) + ' recorded throughout as ' + money(t[1]),
        'A ' + money(z) + ' printer for office use debited to office expenses'
      ], 'An undercast on one account changes only one side of the trial balance, so the totals differ by ' + money(a) + '. The other three are compensating, original entry and principle errors, which leave debits equal to credits.');
    } },
    { skill: 'trial balance effect', gen: function () {
      var a = rstep(40, 250, 5);
      return revealQ('Discount received of ' + money(a) + ' was correctly debited to the supplier’s account but was posted to the debit side of the discount received account. Will the trial balance totals disagree?', 'dr', 2 * a,
        'There are two debits of ' + money(a) + ' and no credit. The debit side gains ' + money(a) + ' and the credit side loses ' + money(a) + ', so the debit total is higher by ' + money(2 * a) + '.');
    } },
    { skill: 'which errors are hidden', kind: 'multi', q: 'Which of these errors would NOT be revealed by the trial balance, because the totals would still agree?',
      options: ['A supplier’s invoice left out of the books entirely', 'Motor repairs debited to the motor vehicles account', 'A cheque payment debited to bank and credited to the supplier', 'A cash receipt posted to the cash book only', 'The purchases account balance overcast by $100', 'Interest received credited to the interest account as $45 instead of $54, with the cash book correct'],
      answers: [0, 1, 2],
      why: 'Omission, principle and complete reversal keep debits equal to credits. A posting to one book only, an overcast on one account and a wrong figure on one side only all upset the totals.' },
    { skill: 'which errors are hidden', kind: 'multi', q: 'Select every error that WOULD make the trial balance totals disagree.',
      options: ['A total in the sales day book added up wrongly', 'A payment to a supplier posted to the debit of the bank account and the debit of the supplier', 'Electricity paid posted to the telephone account', 'Wages and sales both undercast by $300', 'A credit note for $90 left out of the books', 'A sales invoice entered in the day book as $410 instead of $401'],
      answers: [0, 1],
      why: 'A wrong day book total and a two-debit posting change one side only. Commission, compensating, omission and original entry errors leave the two totals equal.' },
    { skill: 'which errors are hidden', q: 'Why does an error of original entry NOT stop the trial balance from agreeing?',
      kind: 'mcq', options: ['The same wrong amount is posted to both the debit and credit accounts', 'The error is found and corrected when the bank statement arrives', 'Only accounts of the same class are affected by the mistake', 'The incorrect amount is recorded in the suspense account at once'], answer: 0,
      why: 'The mistake is made in the book of prime entry, before posting, so both the debit and the credit are made with the same wrong figure and still match.' },
    // ---- telling two types apart ----
    { skill: 'tell two types apart', q: 'Which statement correctly explains how an error of commission differs from an error of principle?',
      kind: 'mcq', options: ['Commission uses a wrong account of the same class; principle uses a wrong class of account', 'Commission records the wrong amount; principle records the amount on the wrong side', 'Commission is shown by the trial balance; principle is never shown by the trial balance', 'Commission affects only customers’ accounts; principle affects only expense accounts'], answer: 0,
      why: 'Both use the right amount in the wrong account. In commission the wrong account is the same kind (e.g. one customer for another); in principle it is a different kind (e.g. an asset as an expense).' },
    { skill: 'tell two types apart', q: 'Which pair of mistakes, made separately, forms a compensating error?',
      kind: 'mcq', options: ['Purchases overcast by $50 and sales overcast by $50', 'Purchases undercast by $50 and wages undercast by $50', 'Sales overcast by $50 and discount received overcast by $50', 'Rent overcast by $50 and a $50 sale omitted from the books'], answer: 0,
      why: 'Purchases has a debit balance and sales a credit balance, so overcasting both raises each side by $50 and the mistakes cancel. In the other pairs both mistakes hit the same side, or only one side, so the totals would differ.' },
    { skill: 'tell two types apart', q: 'A clerk says: “An error of original entry and a complete reversal are the same, because neither affects the trial balance.” Which reply is correct?',
      kind: 'mcq', options: ['They differ: original entry uses a wrong amount, a reversal swaps the debit and credit sides', 'They are the same type, because both are hidden by the trial balance', 'They differ: original entry uses the wrong account, a reversal uses the wrong amount', 'They differ: only a complete reversal leaves the trial balance totals in agreement'], answer: 0,
      why: 'Sharing the effect on the trial balance does not make them the same type. Original entry records a wrong figure on both sides; a complete reversal has the right figure and accounts but the sides swapped.' },
    { skill: 'tell two types apart', q: 'The trial balance of a shop agrees. Which mistake could still be in its books?',
      kind: 'mcq', options: ['A purchase of a shop fitting debited to repairs', 'A cash payment recorded only in the cash book', 'The discount allowed account undercast by $70', 'A receipt debited to the bank as $380 but credited as $308'], answer: 0,
      why: 'An error of principle keeps debits and credits equal, so it can hide behind an agreed trial balance. The other three are one-sided and would make the totals differ.' },
    { skill: 'tell two types apart', q: 'Which description is an error of omission rather than an error of commission?',
      kind: 'mcq', options: ['A credit purchase from Sato is not entered in any book', 'A credit purchase from Sato is posted to Moreau’s account', 'A credit purchase from Sato is debited to Sato and credited to purchases', 'A credit purchase from Sato is recorded at the wrong amount throughout'], answer: 0,
      why: 'Omission means nothing at all was recorded. Posting to Moreau is commission, the swapped sides is a complete reversal and the wrong amount throughout is original entry.' }
  ] };

  // ======================================================================
  // ACC-CTL-08 Journal entries to correct errors
  // ======================================================================
  B['ACC-CTL-08'] = { title: 'Journal entries to correct errors', items: [
    // ---- errors that did not affect the trial balance ----
    { skill: 'correct without suspense', gen: function () {
      var a = rstep(5000, 16000, 500);
      return mcq('A delivery vehicle bought for ' + money(a) + ' was debited to the motor expenses account. Which journal entry corrects the error?',
        [jr('Motor vehicles', 'Motor expenses', a), jr('Motor expenses', 'Motor vehicles', a), jr('Motor vehicles', 'Suspense', a), jr('Suspense', 'Motor expenses', a)],
        'Motor expenses was wrongly debited, so credit it to remove the entry, and debit motor vehicles where the asset belongs. This is an error of principle, so the trial balance was not affected and suspense is not used.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var p = two(), a = rstep(90, 850, 5);
      return mcq('A receipt of ' + money(a) + ' from ' + p[0] + ', a credit customer, was credited to the account of ' + p[1] + ' in error. Which journal entry corrects the error?',
        [jr(p[1], p[0], a), jr(p[0], p[1], a), jr('Suspense', p[0], a), jr('Bank', p[0], a)],
        p[1] + '’s account was wrongly credited, so debit ' + p[1] + ' to cancel it, and credit ' + p[0] + ', who actually paid. The bank entry was already right, so it is not touched and suspense is not needed.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var a = rstep(45, 480, 5);
      return mcq('Cash sales of ' + money(a) + ' were debited to the sales account and credited to the cash account. Which journal entry corrects the error?',
        [jr('Cash', 'Sales', 2 * a), jr('Cash', 'Sales', a), jr('Sales', 'Cash', 2 * a), jr('Cash', 'Suspense', 2 * a)],
        'This is a complete reversal. ' + money(a) + ' cancels the wrong entry and another ' + money(a) + ' makes the right one, so debit cash and credit sales with 2 × ' + money(a) + ' = ' + money(2 * a) + '.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var a = rstep(60, 420, 5);
      return mcq('Goods costing ' + money(a) + ' were taken by the owner for personal use. No entries had been made. Which journal entry records the correction?',
        [jr('Drawings', 'Purchases', a), jr('Purchases', 'Drawings', a), jr('Drawings', 'Suspense', a), jr('Drawings', 'Bank', a)],
        'Goods for own use reduce the owner’s equity and reduce the goods bought for resale, so debit drawings and credit purchases with ' + money(a) + '. It was an omission, so suspense is not involved and no money left the bank.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var t = transposed(), lo = Math.min(t[0], t[1]), hi = Math.max(t[0], t[1]), c = pick(PEOPLE), d = hi - lo;
      return mcq('A credit sale to ' + c + ' for ' + money(hi) + ' was recorded in the sales day book as ' + money(lo) + ' and posted from there. Which journal entry corrects the error?',
        [jr(c, 'Sales', d), jr(c, 'Sales', hi), jr('Sales', c, d), jr(c, 'Suspense', d)],
        'Both accounts were posted with ' + money(lo) + ' instead of ' + money(hi) + ', so each must go up by the difference: ' + money(hi) + ' − ' + money(lo) + ' = ' + money(d) + '. Debit ' + c + ' and credit sales.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var t = transposed(), lo = Math.min(t[0], t[1]), hi = Math.max(t[0], t[1]), s = pick(PEOPLE), d = hi - lo;
      return mcq('A credit purchase from ' + s + ' for ' + money(lo) + ' was recorded in the purchases day book as ' + money(hi) + ' and posted from there. Which journal entry corrects the error?',
        [jr(s, 'Purchases', d), jr('Purchases', s, d), jr(s, 'Purchases', lo), jr('Suspense', 'Purchases', d)],
        'Purchases was debited and ' + s + ' credited with ' + money(d) + ' too much (' + money(hi) + ' − ' + money(lo) + '). Reduce both: debit ' + s + ' and credit purchases with ' + money(d) + '.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var a = rstep(35, 260, 5);
      return mcq('A payment of ' + money(a) + ' for stationery was entered correctly in the cash book but debited to the rent account. Which journal entry corrects the error?',
        [jr('Stationery', 'Rent', a), jr('Rent', 'Stationery', a), jr('Stationery', 'Bank', a), jr('Stationery', 'Suspense', a)],
        'Rent was debited by mistake, so credit rent to remove it and debit stationery. The bank credit was correct, and this commission error kept the trial balance agreeing, so neither bank nor suspense is used.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var a = rstep(150, 900, 10), m = pick(['machinery', 'fixtures and fittings', 'office equipment']);
      return mcq('A bill of ' + money(a) + ' for routine repairs to ' + m + ' was debited to the ' + m + ' account. Which journal entry corrects the error?',
        [jr('Repairs', m.charAt(0).toUpperCase() + m.slice(1), a), jr(m.charAt(0).toUpperCase() + m.slice(1), 'Repairs', a), jr('Repairs', 'Suspense', a), jr('Repairs', 'Bank', a)],
        'Routine repairs are revenue expenditure, but they were added to a non-current asset (an error of principle). Credit ' + m + ' to remove them and debit repairs.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var s = pick(PEOPLE), a = rstep(150, 950, 10);
      return mcq('A cheque for ' + money(a) + ' paid to ' + s + ', a credit supplier, was debited in the bank account and credited in ' + s + '’s account. Which journal entry corrects the error?',
        [jr(s, 'Bank', 2 * a), jr(s, 'Bank', a), jr('Bank', s, 2 * a), jr(s, 'Suspense', 2 * a)],
        'The sides were swapped (complete reversal), so double the amount is needed: ' + money(a) + ' to cancel and ' + money(a) + ' to record it properly. Debit ' + s + ' and credit bank with ' + money(2 * a) + '.');
    } },
    { skill: 'correct without suspense', gen: function () {
      var s = pick(PEOPLE), a = rstep(200, 1200, 10);
      return mcq('A credit purchase of goods for ' + money(a) + ' from ' + s + ' had been left out of the books completely. Which journal entry corrects the error?',
        [jr('Purchases', s, a), jr(s, 'Purchases', a), jr('Purchases', 'Suspense', a), jr('Purchases', 'Bank', a)],
        'The full entry is missing, so make it now: debit purchases (goods in) and credit ' + s + ' (the business owes the supplier ' + money(a) + ').');
    } },
    { skill: 'correct without suspense', gen: function () {
      var a = rstep(100, 600, 50);
      return mcq('The owner withdrew ' + money(a) + ' from the business bank account and put it in the office cash tin to pay small expenses. No entries were made. Which journal entry corrects the error?',
        [jr('Cash', 'Bank', a), jr('Bank', 'Cash', a), jr('Drawings', 'Bank', a), jr('Cash', 'Suspense', a)],
        'Money moved from the bank to cash inside the business, so cash increases (debit) and bank decreases (credit). It was not taken for private use, so drawings is wrong.');
    } },
    // ---- errors that need the suspense account ----
    { skill: 'correct through suspense', gen: function () {
      var a = rstep(250, 1800, 10);
      return mcq('Wages of ' + money(a) + ' were paid and entered in the cash book, but nothing was posted to the wages account. Which journal entry corrects the error?',
        [jr('Wages', 'Suspense', a), jr('Suspense', 'Wages', a), jr('Wages', 'Bank', a), jr('Wages', 'Suspense', 2 * a)],
        'Only the debit to wages is missing, so the trial balance was out and suspense holds the difference. Debit wages with ' + money(a) + ' and take the other leg to suspense (credit).');
    } },
    { skill: 'correct through suspense', gen: function () {
      var t = transposed(), up = Math.random() < 0.5, c = up ? t[0] : t[1], w = up ? t[1] : t[0], d = Math.abs(c - w);
      var right = c > w ? jr('Rent', 'Suspense', d) : jr('Suspense', 'Rent', d), wrong = c > w ? jr('Suspense', 'Rent', d) : jr('Rent', 'Suspense', d);
      return mcq('Rent of ' + money(c) + ' was paid by cheque and entered correctly in the cash book. It was posted to the debit side of the rent account as ' + money(w) + '. Which journal entry corrects the error?',
        [right, wrong, (c > w ? jr('Rent', 'Bank', d) : jr('Bank', 'Rent', d)), (c > w ? jr('Rent', 'Suspense', c) : jr('Suspense', 'Rent', w))],
        'Only the rent account is wrong, by ' + money(Math.max(c, w)) + ' − ' + money(Math.min(c, w)) + ' = ' + money(d) + '. Rent needs ' + (c > w ? 'more debit, so debit rent' : 'less debit, so credit rent') + ' with ' + money(d) + ', and suspense takes the other leg.');
    } },
    { skill: 'correct through suspense', gen: function () {
      var a = rstep(25, 180, 5), c = pick(PEOPLE);
      return mcq('Discount allowed of ' + money(a) + ' to ' + c + ' was credited correctly to ' + c + '’s account but was entered on the credit side of the discount allowed account. Which journal entry corrects the error?',
        [jr('Discount allowed', 'Suspense', 2 * a), jr('Discount allowed', 'Suspense', a), jr('Suspense', 'Discount allowed', 2 * a), jr('Discount allowed', c, 2 * a)],
        'The discount allowed account shows a credit of ' + money(a) + ' where it needs a debit of ' + money(a) + ', a swing of 2 × ' + money(a) + ' = ' + money(2 * a) + '. Debit discount allowed ' + money(2 * a) + '; ' + c + ' was right, so suspense takes the credit.');
    } },
    { skill: 'correct through suspense', gen: function () {
      var a = rstep(100, 900, 100);
      return mcq('The sales account was undercast by ' + money(a) + '. Which journal entry corrects the error?',
        [jr('Suspense', 'Sales', a), jr('Sales', 'Suspense', a), jr('Trade receivables', 'Sales', a), jr('Suspense', 'Sales', 2 * a)],
        'Sales is a credit balance that was added up ' + money(a) + ' too low, so it needs ' + money(a) + ' more on the credit side. Only one account is wrong, so the debit goes to suspense.');
    } },
    { skill: 'correct through suspense', gen: function () {
      var a = rstep(30, 160, 5), s = pick(PEOPLE);
      return mcq('Discount received of ' + money(a) + ' from ' + s + ' was debited correctly to ' + s + '’s account, but the other entry was made on the debit side of the discount allowed account. Which journal entry corrects the error?',
        ['Dr Suspense ' + money(2 * a) + '; Cr Discount allowed ' + money(a) + '; Cr Discount received ' + money(a),
         'Dr Discount allowed ' + money(a) + '; Cr Discount received ' + money(a),
         'Dr Discount received ' + money(2 * a) + '; Cr Discount allowed ' + money(2 * a),
         'Dr Discount allowed ' + money(a) + '; Dr Discount received ' + money(a) + '; Cr Suspense ' + money(2 * a)],
        'Two debits were made, so credit discount allowed ' + money(a) + ' to remove the wrong debit and credit discount received ' + money(a) + ' to make the missing entry. The trial balance was out by ' + money(2 * a) + ', so suspense is debited ' + money(2 * a) + '.');
    } },
    { skill: 'correct through suspense', gen: function () {
      var a = rstep(120, 700, 10);
      return mcq('Cash sales of ' + money(a) + ' were entered in the cash book but were never posted to the sales account. Which journal entry corrects the error?',
        [jr('Suspense', 'Sales', a), jr('Sales', 'Suspense', a), jr('Cash', 'Sales', a), jr('Suspense', 'Cash', a)],
        'The cash debit is already there; only the credit to sales is missing. Credit sales with ' + money(a) + ' and debit suspense, which was holding the difference.');
    } },
    // ---- the amount of the correction ----
    { skill: 'correction amount', gen: function () {
      var a = rstep(110, 640, 5), s = pick(PEOPLE);
      return numq('A credit purchase of ' + money(a) + ' from ' + s + ' was debited to ' + s + '’s account and credited to the purchases account. What amount appears in the debit column of the correcting journal? Give your answer in $.', 2 * a,
        'This is a complete reversal, so the correction is double the amount: 2 × ' + money(a) + ' = ' + money(2 * a) + ' (debit purchases, credit ' + s + ').');
    } },
    { skill: 'correction amount', gen: function () {
      var t = transposed(), lo = Math.min(t[0], t[1]), hi = Math.max(t[0], t[1]), c = pick(PEOPLE);
      return numq('A sales returns note of ' + money(hi) + ' from ' + c + ' was entered in the sales returns day book as ' + money(lo) + '. What amount is used in the correcting journal entry? Give your answer in $.', hi - lo,
        'An original entry error is corrected for the difference only: ' + money(hi) + ' − ' + money(lo) + ' = ' + money(hi - lo) + ' (debit returns inwards, credit ' + c + ').');
    } },
    { skill: 'correction amount', gen: function () {
      var a = rstep(40, 310, 5), acc = pick(['insurance', 'carriage inwards', 'telephone', 'advertising']);
      return numq('A payment of ' + money(a) + ' for ' + acc + ' was entered correctly in the cash book but posted to the credit side of the ' + acc + ' account. What amount is debited to the ' + acc + ' account in the correcting journal? Give your answer in $.', 2 * a,
        'The ' + acc + ' account shows a credit of ' + money(a) + ' instead of a debit of ' + money(a) + '. Debiting 2 × ' + money(a) + ' = ' + money(2 * a) + ' cancels the wrong credit and records the debit; suspense is credited.');
    } },
    { skill: 'correction amount', gen: function () {
      var t = transposed(), up = Math.random() < 0.5, c = up ? t[0] : t[1], w = up ? t[1] : t[0], d = Math.abs(c - w), acc = pick(['commission received', 'rent received']);
      return numq('Cash of ' + money(c) + ' for ' + acc + ' was entered correctly in the cash book. The ' + acc + ' account was credited with ' + money(w) + '. What amount passes through the suspense account to correct this? Give your answer in $.', d,
        'Only the ' + acc + ' account is wrong, by ' + money(Math.max(c, w)) + ' − ' + money(Math.min(c, w)) + ' = ' + money(d) + '. The correction ' + (c > w ? 'credits ' + acc + ' and debits suspense' : 'debits ' + acc + ' and credits suspense') + ' with ' + money(d) + '.');
    } },
    // ---- checking a correction ----
    { skill: 'check a correction', gen: function () {
      var a = rstep(80, 450, 5);
      return mcq('Carriage outwards of ' + money(a) + ' was debited to the bank account and credited to the carriage outwards account. A clerk corrects it with: ' + jr('Carriage outwards', 'Bank', a) + '. What is wrong with this correction?',
        ['The amount should be ' + money(2 * a) + ', because the sides were reversed', 'The bank account should be debited and carriage outwards credited', 'The credit should go to the suspense account instead of bank', 'Nothing is wrong: the correction is complete as it stands'],
        'After the clerk’s entry, carriage outwards is only back to zero and so is the bank. A complete reversal needs twice the amount, ' + money(2 * a) + ', to cancel the error and then record the payment.');
    } },
    { skill: 'check a correction', kind: 'multi', q: 'Which of these errors need the suspense account as one side of the correcting journal?',
      options: ['A purchase of $2,400 of shelving debited to the purchases account', 'The discount allowed account undercast by $40', 'Wages of $600 entered in the cash book only', 'A receipt from Novak credited to Varga', 'Bank charges of $15 omitted from the books', 'Insurance debited as $590 instead of $950, with the cash book correct'],
      answers: [1, 2, 5],
      why: 'Suspense is used only when the original error upset the trial balance: the undercast, the one-sided wages posting and the wrong amount on one side. Principle, commission and omission errors are corrected between two ordinary accounts.' }
  ] };

  // ======================================================================
  // ACC-CTL-09 The suspense account
  // ======================================================================
  function susSide(debitTotal, creditTotal) { return debitTotal < creditTotal ? 'debit' : 'credit'; }
  B['ACC-CTL-09'] = { title: 'The suspense account', items: [
    // ---- why and when ----
    { skill: 'purpose', gen: function () {
      var o = pick(OWNERS), t = rstep(30000, 60000, 50), d = rstep(40, 400, 10);
      return mcq(o + ' has just drawn up a trial balance. In which situation should a suspense account be opened?',
        ['The debit column totals ' + money(t) + ' and the credit column ' + money(t - d), 'Both columns of the trial balance total exactly ' + money(t), 'The income statement for the year shows a loss', 'A customer has not paid an invoice for over 90 days'],
        'A suspense account is opened when the trial balance totals do not agree. Here they differ by ' + money(d) + ', so the difference is placed in suspense until the errors are found.');
    } },
    { skill: 'purpose', kind: 'multi', q: 'Which are purposes of a suspense account?',
      options: ['To make the trial balance totals agree while the errors are found', 'To help in correcting errors that affected the trial balance', 'To calculate the profit for the year', 'To record goods taken by the owner for personal use', 'To replace the need for correcting journal entries'],
      answers: [0, 1],
      why: 'Suspense temporarily holds the trial balance difference so that the totals agree, and it is then used as one side of the corrections. It does not calculate profit, record drawings or replace journals.' },
    { skill: 'purpose', q: 'Every error that affected the trial balance has now been found and corrected. What balance is left on the suspense account?',
      kind: 'mcq', options: ['No balance, because both sides now total the same', 'A debit balance equal to the original difference', 'A credit balance shown as a current liability', 'A balance that is transferred to the capital account'], answer: 0,
      why: 'Each correction removes part of the difference. When all the errors are corrected the two sides are equal, so the account closes with no balance.' },
    { skill: 'purpose', q: 'Which statement about the suspense account is correct?',
      kind: 'mcq', options: ['It is used only for errors that stop the trial balance totals agreeing', 'It is used to correct every error, including omissions and principle errors', 'Its opening entry goes on the larger side of the trial balance', 'It is a permanent account that always appears in every year’s statements'], answer: 0,
      why: 'Only errors that upset the totals pass through suspense. Its opening entry goes on the SMALLER side, and it is closed once the errors are corrected.' },
    { skill: 'purpose', q: 'Which error would be corrected WITHOUT any entry in the suspense account?',
      kind: 'mcq', options: ['Rent paid of $700 debited to the rates account', 'Sales account overcast by $200', 'Wages of $350 posted to the cash book only', 'Discount received of $25 posted to the debit of its account'], answer: 0,
      why: 'Debiting rates instead of rent is an error of commission: the trial balance still agrees, so the correction is Dr Rent, Cr Rates with no suspense entry. The other three upset the totals.' },
    // ---- opening balance ----
    { skill: 'opening entry', gen: function () {
      var c = rstep(40000, 90000, 10), d = rstep(30, 900, 10), dr = c - d;
      return mcq('A trial balance shows debit totals of ' + money(dr) + ' and credit totals of ' + money(c) + '. How is the suspense account opened?',
        ['Debit side, ' + money(d), 'Credit side, ' + money(d), 'Debit side, ' + money(2 * d), 'Credit side, ' + money(c)],
        'The debit side is short by ' + money(c) + ' − ' + money(dr) + ' = ' + money(d) + '. The opening entry goes on the smaller side, so suspense starts with a debit of ' + money(d) + '.');
    } },
    { skill: 'opening entry', gen: function () {
      var dr = rstep(40000, 90000, 10), d = rstep(30, 900, 10), c = dr - d;
      return mcq('The credit column of a trial balance totals ' + money(c) + ' and the debit column ' + money(dr) + '. How is the suspense account opened?',
        ['Credit side, ' + money(d), 'Debit side, ' + money(d), 'Credit side, ' + money(2 * d), 'Debit side, ' + money(dr)],
        'The credit column is short by ' + money(dr) + ' − ' + money(c) + ' = ' + money(d) + ', so the suspense account is opened with a credit of ' + money(d) + ' to make the totals agree.');
    } },
    { skill: 'opening entry', gen: function () {
      var dr = rstep(20000, 70000, 1), d = rint(18, 950), c = dr + (Math.random() < 0.5 ? d : -d);
      return numq('A trial balance has debit totals of ' + money(dr) + ' and credit totals of ' + money(c) + '. What is the opening balance of the suspense account? Give your answer in $.', d,
        'The difference between the totals is ' + money(Math.max(dr, c)) + ' − ' + money(Math.min(dr, c)) + ' = ' + money(d) + '. It goes on the ' + susSide(dr, c) + ' side of suspense, the side that is short.');
    } },
    { skill: 'opening entry', q: 'On which side of the trial balance is the difference placed when a suspense account is opened?',
      kind: 'mcq', options: ['The side with the smaller total', 'The side with the larger total', 'Always the debit side', 'Always the credit side'], answer: 0,
      why: 'The suspense figure tops up the side that is short, so it goes on the side with the smaller total. It can be a debit or a credit.' },
    // ---- posting corrections to suspense ----
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(200, 1500, 10);
      return mcq('A correcting journal reads: ' + jr('Wages', 'Suspense', a) + '. How does this appear in the suspense account?',
        ['Credit side, details “Wages”, ' + money(a), 'Debit side, details “Wages”, ' + money(a), 'Credit side, details “Suspense”, ' + money(a), 'Debit side, details “Bank”, ' + money(a)],
        'The journal credits suspense, so the entry goes on the credit side of the suspense account. The details name the other account in the double entry: wages.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(100, 900, 100);
      return mcq('The sales account had been undercast by ' + money(a) + '. How is the correction shown in the suspense account?',
        ['Debit side, details “Sales”, ' + money(a), 'Credit side, details “Sales”, ' + money(a), 'Debit side, details “Sales”, ' + money(2 * a), 'No entry in the suspense account'],
        'Sales needs ' + money(a) + ' more on its credit side, so the journal is Dr Suspense, Cr Sales. The suspense account therefore shows ' + money(a) + ' on the debit side with “Sales” as the detail.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(20, 140, 5);
      return mcq('Discount allowed of ' + money(a) + ' was entered as a credit in the discount allowed account; the customer’s account was correct. How is the correction shown in the suspense account?',
        ['Credit side, details “Discount allowed”, ' + money(2 * a), 'Credit side, details “Discount allowed”, ' + money(a), 'Debit side, details “Discount allowed”, ' + money(2 * a), 'No entry in the suspense account'],
        'The correction is Dr Discount allowed ' + money(2 * a) + ', Cr Suspense ' + money(2 * a) + ' (double, because the wrong side was used). So suspense shows ' + money(2 * a) + ' on its credit side.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(3000, 12000, 500);
      return mcq('A new computer costing ' + money(a) + ' was debited to the office expenses account. How is the correction shown in the suspense account?',
        ['No entry in the suspense account', 'Debit side, details “Office equipment”, ' + money(a), 'Credit side, details “Office expenses”, ' + money(a), 'Credit side, details “Office equipment”, ' + money(a)],
        'This is an error of principle: the debit and credit were equal, so it did not cause the difference. It is corrected Dr Office equipment, Cr Office expenses with no suspense entry.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(100, 800, 100);
      return mcq('The purchases account was overcast by ' + money(a) + '. How is the correction shown in the suspense account?',
        ['Debit side, details “Purchases”, ' + money(a), 'Credit side, details “Purchases”, ' + money(a), 'Debit side, details “Trade payables”, ' + money(a), 'No entry in the suspense account'],
        'Purchases (a debit balance) is ' + money(a) + ' too high, so the journal is Dr Suspense, Cr Purchases. The suspense account shows ' + money(a) + ' on its debit side, detail “Purchases”.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(60, 450, 5);
      return mcq('A correcting journal reads: ' + jr('Suspense', 'Rent received', a) + '. How does this appear in the suspense account?',
        ['Debit side, details “Rent received”, ' + money(a), 'Credit side, details “Rent received”, ' + money(a), 'Debit side, details “Suspense”, ' + money(a), 'Credit side, details “Bank”, ' + money(a)],
        'The journal debits suspense, so the entry is on the debit side of the suspense account, with the other account, rent received, as the detail.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(40, 400, 10), b = rstep(100, 900, 100);
      return mcq('Which correction would be entered on the DEBIT side of the suspense account?',
        ['Sales account undercast by ' + money(b), 'Purchases account undercast by ' + money(b), 'Wages of ' + money(a) + ' entered in the cash book only', 'Rent paid of ' + money(a) + ' posted to the credit of rent'],
        'Sales is a credit balance, so an undercast is corrected Dr Suspense, Cr Sales. The other three need more debit in purchases, wages or rent, so suspense is credited.');
    } },
    { skill: 'posting to suspense', gen: function () {
      var a = rstep(15, 240, 1);
      return mcq('Bank interest received of ' + money(a) + ' was entered in the cash book but not in the interest received account. How is the correction shown in the suspense account?',
        ['Debit side, details “Interest received”, ' + money(a), 'Credit side, details “Interest received”, ' + money(a), 'Debit side, details “Bank”, ' + money(a), 'No entry in the suspense account'],
        'The missing entry is a credit to interest received, so the journal is Dr Suspense, Cr Interest received. Suspense shows ' + money(a) + ' on its debit side, with the other account as the detail.');
    } },
    // ---- writing up and balancing ----
    { skill: 'writing up the account', gen: function () {
      var s, w, d, net;
      do { s = rstep(100, 600, 100); w = rstep(150, 900, 10); d = rstep(20, 90, 5); net = w + 2 * d - s; } while (net === 0 || Math.abs(net) < 30);
      var side = net > 0 ? 'Debit' : 'Credit', other = net > 0 ? 'Credit' : 'Debit', amt = Math.abs(net);
      return mcq('A suspense account was opened for the trial balance difference. These were the only errors:<br>1 Sales were undercast by ' + money(s) + '.<br>2 Wages of ' + money(w) + ' were entered in the cash book only.<br>3 Discount allowed of ' + money(d) + ' was entered as a credit in the discount allowed account (the customer’s account was correct).<br>What was the opening balance on the suspense account?',
        uniq(side + ' ' + money(amt), [other + ' ' + money(amt), side + ' ' + money(Math.abs(w + d - s)), side + ' ' + money(s + w + 2 * d)], 4, [side + ' ' + money(amt + 2 * d), other + ' ' + money(amt + 2 * d)]),
        'Suspense legs: debit ' + money(s) + ' (sales), credit ' + money(w) + ' (wages), credit ' + money(2 * d) + ' (discount allowed, doubled). ' + (net > 0 ? 'Credits exceed debits by ' + money(w) + ' + ' + money(2 * d) + ' − ' + money(s) + ' = ' + money(amt) + ', so the account must have opened with a debit of ' + money(amt) + '.' : 'Debits exceed credits by ' + money(s) + ' − ' + money(w) + ' − ' + money(2 * d) + ' = ' + money(amt) + ', so the account must have opened with a credit of ' + money(amt) + '.'));
    } },
    { skill: 'writing up the account', gen: function () {
      var a, b, c, open;
      do { a = rstep(100, 500, 100); b = rstep(150, 600, 10); c = rstep(15, 80, 5); open = b + c - a; } while (open < 20);
      var acct = tacct('Suspense account', [['Balance b/d', open], ['Sales', a]], [['Insurance', b], ['Carriage inwards', c]]);
      return numq('This suspense account has been written up after correcting all the errors.' + acct + 'What is the total of each side of the account? Give your answer in $.', open + a,
        'Debit side: ' + money(open) + ' + ' + money(a) + ' = ' + money(open + a) + '. The credit side, ' + money(b) + ' + ' + money(c) + ', gives the same total, so no balance remains.');
    } },
    { skill: 'writing up the account', gen: function () {
      var d = rstep(300, 950, 10), a = rstep(50, Math.floor((d - 40) / 20) * 10, 10);
      return numq('A suspense account was opened with a credit balance of ' + money(d) + '. The first error found was that cash sales of ' + money(a) + ' had been posted to the debit side of the sales account; the cash book was correct. After correcting this error, what balance is left on the suspense account? Give your answer in $.', d - 2 * a,
        'Sales needs 2 × ' + money(a) + ' = ' + money(2 * a) + ' of credit (to cancel the wrong debit and make the credit), so the journal is Dr Suspense ' + money(2 * a) + ', Cr Sales. The suspense credit balance falls to ' + money(d) + ' − ' + money(2 * a) + ' = ' + money(d - 2 * a) + '.');
    } },
    { skill: 'writing up the account', gen: function () {
      var a, b, c, open;
      do { a = rstep(100, 400, 100); b = rstep(60, 300, 5); c = rstep(10, 60, 5); open = a + b - c; } while (open < 50);
      var shown = tacct('Suspense account (draft)', [['Balance b/d', open], ['Sales', a], ['Discount received', c]], [['Rent', b]]);
      return mcq('A suspense account was opened with a debit of ' + money(open) + '. The errors were: sales overcast by ' + money(a) + '; rent of ' + money(b) + ' entered in the cash book only; discount received of ' + money(c) + ' entered in the supplier’s account but not in the discount received account. A trainee drew up this draft:' + shown + 'Which entry is on the wrong side?',
        ['Sales', 'Rent', 'Discount received', 'Balance b/d'],
        'Sales was overcast, so it needs a debit (Dr Sales, Cr Suspense): the sales entry belongs on the CREDIT side of suspense. Then the debits are ' + money(open) + ' + ' + money(c) + ' = ' + money(open + c) + ' and the credits ' + money(a) + ' + ' + money(b) + ' = ' + money(a + b) + ', which agree.');
    } },
    { skill: 'writing up the account', gen: function () {
      var u = rstep(100, 700, 100), t = transposed(), up = Math.random() < 0.5, c = up ? t[0] : t[1], w = up ? t[1] : t[0];
      // rent account undercast u -> Dr Rent u, Cr Suspense u. Commission received c credited as w (cash book right): c>w -> Cr Comm (c-w), Dr Suspense; c<w -> Dr Comm, Cr Suspense.
      var drS = c > w ? c - w : 0, crS = u + (c < w ? w - c : 0), net = crS - drS;
      if (net === 0) { u += 100; crS += 100; net = crS - drS; }
      return numq('These were the only errors behind a trial balance difference:<br>1 The rent account was undercast by ' + money(u) + '.<br>2 Commission received of ' + money(c) + ' was entered correctly in the cash book but credited to the commission received account as ' + money(w) + '.<br>What was the difference in the trial balance (the opening balance of the suspense account)? Give your answer in $.', Math.abs(net),
        'Rent needs ' + money(u) + ' more debit: Cr Suspense ' + money(u) + '. Commission received ' + (c > w ? 'needs ' + money(c - w) + ' more credit: Dr Suspense ' + money(c - w) + '. Net: ' + money(u) + ' − ' + money(c - w) : 'is ' + money(w - c) + ' too high: Cr Suspense ' + money(w - c) + '. Total: ' + money(u) + ' + ' + money(w - c)) + ' = ' + money(Math.abs(net)) + (net > 0 ? ', which must have been a debit opening balance.' : ', which must have been a credit opening balance.'));
    } },
    { skill: 'writing up the account', q: 'After posting every correction it knows about, a business finds its suspense account still has a debit balance of $45. What does this tell the business?',
      kind: 'mcq', options: ['At least one error that affected the trial balance has not been found yet', 'All the errors have been corrected and the $45 is a profit', 'The $45 should be shown as a current asset permanently', 'The trial balance totals must have agreed in the first place'], answer: 0,
      why: 'When every error affecting the totals is corrected, suspense has no balance. A remaining $45 means more errors are still to be found.' }
  ] };

  // ======================================================================
  // ACC-CTL-03 Why keep control accounts?
  // ======================================================================
  B['ACC-CTL-03'] = { title: 'Why keep control accounts?', items: [
    { skill: 'benefits', q: 'Which is a benefit of keeping a trade receivables ledger control account?',
      kind: 'mcq', options: ['It gives a quick total of trade receivables', 'It removes the need for an account for each customer', 'It records every cash sale made in the period', 'It shows the profit earned on credit sales'], answer: 0,
      why: 'The control account holds the total of all customers’ balances, so the trade receivables figure is ready for the trial balance and statement of financial position. Individual customer accounts are still needed.' },
    { skill: 'benefits', kind: 'multi', q: 'Select the benefits of keeping ledger control accounts.',
      options: ['A check on the arithmetical accuracy of the personal ledger', 'Ready totals for the trial balance and financial statements', 'A deterrent to fraud when kept by a separate member of staff', 'Proof that every posting went to the correct personal account', 'No further need to prepare a trial balance', 'A record of each cash sale and cash purchase'],
      answers: [0, 1, 2],
      why: 'Control accounts check the ledger’s arithmetic, give ready totals and deter fraud. They cannot prove every posting went to the right customer or supplier, they do not replace the trial balance and they do not record cash sales or purchases.' },
    { skill: 'benefits', q: 'The closing balance of a trade receivables ledger control account equals the total of the list of customers’ balances. What does this show?',
      kind: 'mcq', options: ['The receivables ledger is arithmetically correct', 'Every customer was invoiced at the right price for the goods', 'No customer balance will become irrecoverable', 'The business made a profit for the period'], answer: 0,
      why: 'Agreement shows the additions and postings in the ledger add up correctly. It says nothing about prices, whether customers will pay, or profit.' },
    { skill: 'benefits', gen: function () {
      var n = rstep(150, 600, 10), b = pick(['Harbour Lane Timber', 'Sunfield Office Supplies', 'Kestrel Auto Parts', 'Blue Orchid Wholesale']);
      return mcq(b + ' has ' + n + ' credit customers. How does a trade receivables ledger control account help when the statement of financial position is prepared?',
        ['It gives the trade receivables figure without adding up all ' + n + ' balances', 'It lists every customer’s balance in date order for the auditors', 'It shows which customers will pay within the credit period', 'It replaces the need to record sales invoices in the day book'],
        'The control account balance is the total owed by all ' + n + ' customers, so the trade receivables figure is available straight away.');
    } },
    { skill: 'benefits', kind: 'multi', q: 'Select the reasons for keeping a trade payables ledger control account.',
      options: ['It checks the arithmetical accuracy of the payables ledger', 'It gives the trade payables total for the financial statements', 'It helps to detect fraud by the payables ledger clerk', 'It records the discounts allowed to credit customers', 'It shows the profit made on goods bought on credit'],
      answers: [0, 1, 2],
      why: 'The payables control account checks the suppliers’ ledger, supplies the trade payables figure and acts as an independent check against fraud. Discount allowed belongs to customers, and control accounts do not measure profit.' },
    { skill: 'benefits', q: 'Which statement explains how control accounts help managers with credit control?',
      kind: 'mcq', options: ['They show the total owed by customers at any time', 'They show the cash in the bank at the end of each day', 'They set the credit limit for each new customer', 'They list the goods each customer has bought'], answer: 0,
      why: 'The receivables control account balance shows at a glance how much customers owe in total, so managers can watch whether debts are building up.' },
    // ---- fraud and independence ----
    { skill: 'fraud and independence', q: 'Why is it better for the trade receivables control account to be kept by a different person from the clerk who keeps the customers’ accounts?',
      kind: 'mcq', options: ['A clerk who altered a customer’s account could not also hide it in the control total', 'A different person can post sales invoices much more quickly than the receivables ledger clerk', 'The control account must legally be prepared by the owner of the business', 'It means the clerk no longer needs to balance each customer’s account'], answer: 0,
      why: 'Separating the two jobs gives an independent check. If the ledger clerk changed a customer’s balance to cover a theft, the list of balances would no longer agree with the control account kept by someone else.' },
    { skill: 'fraud and independence', q: 'Why is the control account written up from totals in the books of prime entry rather than from the customers’ accounts?',
      kind: 'mcq', options: ['So it is an independent check: a posting error in the ledger shows as a difference', 'So that fewer entries are needed in the sales day book and the cash book', 'Because the customers’ accounts are not balanced until after the year end', 'Because the books of prime entry contain cash sales as well as all the credit sales made'], answer: 0,
      why: 'If the control account used the same figures as the personal ledger, any mistake in the ledger would be copied into it. Using separate totals from the books of prime entry makes the comparison a real check.' },
    { skill: 'fraud and independence', gen: function () {
      var b = pick(['Riverbend Tiles', 'Copperleaf Garden Centre', 'Northgate Pharmacy', 'Marlow Paints']);
      return mcq('At ' + b + ', one clerk keeps both the receivables ledger and the receivables control account. The owner is worried about fraud. Which change would reduce the risk most?',
        ['Give the control account to a different member of staff', 'Ask the same clerk to balance the control account weekly', 'Stop keeping the control account to save the clerk’s time', 'Enter cash sales in the control account as well'],
        'Fraud is deterred when a different person keeps the control account, because a false entry in a customer’s account would not agree with an independently prepared total.');
    } },
    { skill: 'fraud and independence', q: 'Why can a control account deter fraud even in a year when no fraud is found?',
      kind: 'mcq', options: ['Staff know an independent check is made', 'It records the name of each person who posts an entry', 'It is sent to every customer at the end of each month', 'It stops any cash being paid out without approval'], answer: 0,
      why: 'Because staff know their ledger will be compared with a total prepared independently, they are less likely to attempt a fraud in the first place.' },
    // ---- locating errors ----
    { skill: 'locating errors', q: 'A trial balance does not agree. The trade payables control account agrees with the list of suppliers’ balances, but the trade receivables control account does not agree with the list of customers’ balances. What does this suggest?',
      kind: 'mcq', options: ['The error is likely to be in the receivables ledger', 'The error is likely to be in the payables ledger', 'There is no error, because one control account agrees', 'The error must be an error of omission'], answer: 0,
      why: 'Comparing each control account with its ledger shows where the mistake is. The receivables side does not agree, so the search can start there.' },
    { skill: 'locating errors', q: 'Why do control accounts make it quicker to find errors in a business with many personal accounts?',
      kind: 'mcq', options: ['They show which ledger holds the error, so fewer accounts need checking', 'They correct any errors automatically at the end of each accounting month', 'They contain every individual transaction in date order', 'They are not affected by errors in the books of prime entry'], answer: 0,
      why: 'Each ledger is checked against its own control total, so a difference points to one ledger rather than the whole set of books.' },
    { skill: 'locating errors', gen: function () {
      var d = rstep(20, 400, 5);
      return mcq('The receivables ledger clerk finds that the list of customers’ balances is ' + money(d) + ' less than the control account balance. What is the most sensible first step?',
        ['Check the additions and postings in the customers’ accounts', 'Write off ' + money(d) + ' as an irrecoverable debt', 'Change the control account to agree with the list', 'Ignore it, because ' + money(d) + ' is a small amount'],
        'A difference means a mistake in either the ledger or the control account. The checks should find it; simply forcing the figures to agree or writing it off would hide the error.');
    } },
    { skill: 'locating errors', gen: function () {
      var a = rstep(40, 600, 10), c = pick(PEOPLE);
      return mcq('An invoice for ' + money(a) + ' was entered correctly in the sales day book but was never posted to ' + c + '’s account. How would the control account help?',
        ['The list of customers’ balances would be ' + money(a) + ' less than the control account', 'The control account would also be ' + money(a) + ' short, so nothing would show', 'The control account would show ' + c + '’s name on the credit side', 'The sales day book total would be ' + money(a) + ' less than the control account'],
        'The control account takes the correct day book total, but ' + c + '’s account is missing ' + money(a) + '. The list of balances is therefore ' + money(a) + ' lower, which reveals the error.');
    } },
    // ---- limitations ----
    { skill: 'limitations', q: 'The trade receivables control account agrees with the list of customers’ balances. Which error could still exist?',
      kind: 'mcq', options: ['A receipt from one customer credited to another customer', 'A customer’s account added up $100 too high', 'A sales invoice in the day book not posted to the customer', 'A credit note posted to the customer as $64 instead of $46'], answer: 0,
      why: 'Posting to the wrong customer keeps the total of all customers’ balances the same, so the control account still agrees. The other errors change the list of balances only.' },
    { skill: 'limitations', kind: 'multi', q: 'Which errors would NOT be revealed by comparing the receivables control account with the list of customers’ balances?',
      options: ['A sales invoice left out of the sales day book entirely', 'A payment from Ito posted to Tanaka’s account', 'A sales invoice recorded in the day book at the wrong amount', 'A customer’s account balanced incorrectly by $50', 'A cheque received posted twice to the same customer'],
      answers: [0, 1, 2],
      why: 'If an item is missing from, or wrong in, the day book, both the control account and the customer’s account use the same figure. Posting to the wrong customer leaves the total unchanged. Wrong balancing or a double posting affects the ledger only and would show.' },
    { skill: 'limitations', q: 'A student writes: “A control account proves that every entry in the ledger is correct.” Why is this wrong?',
      kind: 'mcq', options: ['Some errors, such as a posting to the wrong customer, do not affect the totals', 'A control account is only prepared once every five years', 'The control account is kept in the cash book, not in the general ledger with other accounts', 'Control accounts contain only cash transactions, not credit ones'], answer: 0,
      why: 'Like a trial balance, a control account only checks totals. Errors that leave the total unchanged, such as commission or omission, go undetected.' },
    { skill: 'limitations', q: 'Which is a limitation of a trade receivables ledger control account?',
      kind: 'mcq', options: ['It does not show what each customer owes', 'It can only be prepared by an external auditor', 'It includes cash sales, so the total is overstated', 'It must be prepared every day to be useful'], answer: 0,
      why: 'The control account holds only the total. To know what a particular customer owes, the business must still look at that customer’s personal account.' },
    // ---- what it is ----
    { skill: 'what it is', q: 'What does a trade payables ledger control account summarise?',
      kind: 'mcq', options: ['All the credit suppliers’ accounts', 'All the credit customers’ accounts', 'All cash and cheque payments', 'All the expense accounts'], answer: 0,
      why: 'The trade payables control account is a summary of the payables (purchases) ledger, which contains an account for each credit supplier.' },
    { skill: 'what it is', gen: function () {
      var o = pick(OWNERS);
      return mcq(o + ' runs a shop and wants to check the accuracy of the accounts kept for the firms that sell goods to the shop on credit. Which control account is needed?',
        ['Trade payables ledger control account', 'Trade receivables ledger control account', 'Sales ledger control account', 'Suspense account'],
        'Businesses that sell to ' + o + ' on credit are suppliers, so their accounts are in the payables ledger, summarised by the trade payables ledger control account.');
    } },
    { skill: 'what it is', kind: 'multi', q: 'Which sources provide totals for writing up a trade receivables ledger control account?',
      options: ['Sales day book', 'Cash book', 'Sales returns day book', 'Purchases day book', 'Purchases returns day book'],
      answers: [0, 1, 2],
      why: 'Credit sales come from the sales day book, receipts and discounts from the cash book, and returns inwards from the sales returns day book. Purchases and purchases returns belong to the payables side.' },
    { skill: 'what it is', q: 'Which is the most balanced conclusion about keeping control accounts for a business with many credit customers and suppliers?',
      kind: 'mcq', options: ['Worthwhile: the checks and quick totals outweigh the small extra work', 'Worthwhile, because they guarantee that no errors or fraud can ever occur', 'Not worthwhile, because a trial balance shows every error anyway', 'Not worthwhile, because they replace the personal ledgers'], answer: 0,
      why: 'Control accounts take a little extra work, but they check accuracy, give totals quickly and deter fraud. They cannot guarantee there are no errors, and a trial balance does not show every error.' }
  ] };

  // ======================================================================
  // ACC-CTL-05 Which items go in a control account, and on which side
  // ======================================================================
  var SIDES = ['Debit side', 'Credit side', 'No entry'];
  function side(item, acct, correct, why) {
    var opts = [correct].concat(SIDES.filter(function (s) { return s !== correct; }));
    return { kind: 'mcq', q: 'Where should <b>' + item + '</b> be entered in the ' + acct + '?', options: opts, answer: 0, why: why };
  }
  var RCA = 'trade receivables ledger control account', PCA = 'trade payables ledger control account';
  function sideItem(skill, item, acct, correct, why) { var o = side(item, acct, correct, why); o.skill = skill; return o; }
  B['ACC-CTL-05'] = { title: 'Which items go in a control account, and on which side', items: [
    sideItem('receivables control', 'a customer’s cheque returned unpaid by the bank', RCA, 'Debit side', 'The customer owes the money again, so the debt is reinstated on the debit side, just as in the customer’s own account.'),
    sideItem('receivables control', 'discount allowed to credit customers', RCA, 'Credit side', 'Discount allowed reduces what customers owe, so it is credited, like a receipt.'),
    sideItem('receivables control', 'irrecoverable debts written off', RCA, 'Credit side', 'Writing off a debt removes it from what customers owe, so it goes on the credit side.'),
    sideItem('receivables control', 'interest charged to a customer on an overdue account', RCA, 'Debit side', 'Interest charged increases the amount the customer owes, so it is debited.'),
    sideItem('receivables control', 'goods returned by credit customers', RCA, 'Credit side', 'Returns inwards reduce what customers owe, so they are credited (total from the sales returns day book).'),
    sideItem('receivables control', 'a refund paid to a customer who had overpaid', RCA, 'Debit side', 'The refund removes the customer’s credit balance, so it is debited, the same as in the customer’s account.'),
    sideItem('no entry', 'cash sales', RCA, 'No entry', 'Cash sales never create a debt owed by a credit customer, so they do not appear in the receivables control account.'),
    sideItem('no entry', 'an increase in the provision for irrecoverable debts', RCA, 'No entry', 'The provision is a separate estimate; no customer’s debt is removed, so nothing is entered in the control account.'),
    sideItem('no entry', 'discount received from credit suppliers', RCA, 'No entry', 'Discount received concerns suppliers, so it belongs in the trade payables control account, not the receivables one.'),
    { skill: 'receivables control', q: 'Which of these is recorded on the credit side of the trade receivables ledger control account?',
      kind: 'mcq', options: ['Cheques received from credit customers', 'Credit sales from the sales day book', 'Customers’ cheques dishonoured by the bank', 'Interest charged on overdue customer accounts'], answer: 0,
      why: 'Money received from customers reduces what they owe, so it is credited. Credit sales, dishonoured cheques and interest charged all increase the debt and are debited.' },
    sideItem('payables control', 'credit purchases', PCA, 'Credit side', 'Credit purchases increase what the business owes to suppliers, so they are credited (total from the purchases day book).'),
    sideItem('payables control', 'discount received from suppliers', PCA, 'Debit side', 'Discount received reduces what the business owes, so it is debited, like a payment.'),
    sideItem('payables control', 'goods returned to credit suppliers', PCA, 'Debit side', 'Returns outwards reduce the amount owed to suppliers, so they go on the debit side.'),
    sideItem('payables control', 'interest charged by a supplier on a late payment', PCA, 'Credit side', 'The interest adds to what the business owes the supplier, so it is credited.'),
    sideItem('payables control', 'a refund received from a supplier who was overpaid', PCA, 'Credit side', 'The refund cancels the debit balance the supplier was holding, so it is credited.'),
    sideItem('no entry', 'cash purchases', PCA, 'No entry', 'Cash purchases are paid at once, so no amount is owed to a credit supplier and nothing goes in the control account.'),
    sideItem('no entry', 'goods returned by credit customers', PCA, 'No entry', 'Returns inwards involve customers, so they belong in the receivables control account, not the payables one.'),
    { skill: 'payables control', q: 'Which of these is recorded on the debit side of the trade payables ledger control account?',
      kind: 'mcq', options: ['Payments made to credit suppliers', 'Credit purchases from the purchases day book', 'Interest charged by suppliers', 'Refunds received from suppliers'], answer: 0,
      why: 'Payments reduce what the business owes, so they are debited. Credit purchases, interest charged and refunds received are credited.' },
    // ---- contras and less routine items ----
    { skill: 'contras and refunds', gen: function () {
      var p = pick(PEOPLE), a = rstep(60, 900, 5);
      return mcq(p + ' both buys from and sells to the business. A contra of ' + money(a) + ' is made to set off the two balances. How is it recorded in the control accounts?',
        ['Dr Trade payables control; Cr Trade receivables control', 'Dr Trade receivables control; Cr Trade payables control', 'Dr Trade receivables control; Cr Bank', 'No entry; only the personal accounts change'],
        'The set-off reduces what ' + p + ' owes the business (credit receivables control) and what the business owes ' + p + ' (debit payables control), each by ' + money(a) + '.');
    } },
    { skill: 'contras and refunds', gen: function () {
      var p = pick(PEOPLE), x = rstep(300, 1500, 10), y = rstep(150, 1400, 10);
      while (y === x) y += 10;
      var m = Math.min(x, y);
      return numq(p + ' owes the business ' + money(x) + ' for goods bought on credit. The business owes ' + p + ' ' + money(y) + ' for goods supplied on credit. Both agree to set off the balances. What is the amount of the contra entry? Give your answer in $.', m,
        'Only the smaller balance can be set off, because that is the most both sides can cancel. The contra is ' + money(m) + ', leaving ' + money(Math.abs(x - y)) + (x > y ? ' still owed by ' + p + '.' : ' still owed to ' + p + '.'));
    } },
    { skill: 'contras and refunds', q: 'Why does a contra entry arise between the two control accounts?',
      kind: 'mcq', options: ['One firm is both a customer and a supplier, so the balances are set off', 'A customer has paid by cheque and the cheque has been dishonoured', 'A supplier has charged interest on an overdue payment', 'A customer’s debt has been written off as irrecoverable'], answer: 0,
      why: 'When a firm owes the business and is also owed by it, the two balances can be cancelled against each other, which is recorded as a contra (set-off).' },
    { skill: 'contras and refunds', kind: 'multi', q: 'Select every item that is entered on the DEBIT side of the trade receivables ledger control account.',
      options: ['Credit sales', 'Customers’ cheques dishonoured', 'Interest charged to customers', 'Contra with the payables control account', 'Returns inwards', 'Discount received'],
      answers: [0, 1, 2],
      why: 'Credit sales, dishonoured cheques and interest charged all increase what customers owe. The contra and returns inwards are credits, and discount received does not belong in this account.' },
    { skill: 'contras and refunds', kind: 'multi', q: 'In a trade payables ledger control account, which of these items are credit entries?',
      options: ['Credit purchases', 'Interest charged by suppliers', 'Refunds received from suppliers', 'Contra with the receivables control account', 'Discount received', 'Discount allowed'],
      answers: [0, 1, 2],
      why: 'Credit purchases, interest charged and refunds received all go on the credit side. The contra and discount received are debits, and discount allowed belongs to customers.' }
  ] };

  // ======================================================================
  // ACC-CTL-06 Preparing a trade receivables or trade payables control account
  // ======================================================================
  function frac(x, lo, hi, step) { return Math.round(x * (lo + Math.random() * (hi - lo)) / step) * step; }
  function dataTable(heading, rows) { return list(heading, rows.map(function (r) { return [r[0], r[1]]; })); }
  function sumList(xs) { return xs.reduce(function (a, b) { return a + b; }, 0); }
  function plus(xs) { return xs.map(money).join(' + '); }
  B['ACC-CTL-06'] = { title: 'Preparing a trade receivables or trade payables control account', items: [
    // ---- trade receivables control ----
    { skill: 'receivables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(8000, 40000, 10), sales = rstep(20000, 70000, 10), disc = rstep(150, 900, 5), ret = rstep(200, 2500, 5), irr = rstep(100, 1200, 10);
      var rec = frac(open + sales, 0.62, 0.8, 10), bal = open + sales - rec - disc - ret - irr;
      return numq('Use this information to write up and balance the trade receivables ledger control account at ' + m[0] + '.' + dataTable('', [['Balance at start of month (debit)', open], ['Credit sales', sales], ['Cheques received from credit customers', rec], ['Discount allowed', disc], ['Returns inwards', ret], ['Irrecoverable debts written off', irr]]) + 'What is the balance carried down on ' + m[0] + '? Give your answer in $.', bal,
        'Debit side: ' + plus([open, sales]) + ' = ' + money(open + sales) + '. Credit side before the balance: ' + plus([rec, disc, ret, irr]) + ' = ' + money(rec + disc + ret + irr) + '. Balance c/d = ' + money(open + sales) + ' − ' + money(rec + disc + ret + irr) + ' = ' + money(bal) + ', brought down as a debit on ' + m[1] + '.');
    } },
    { skill: 'receivables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(10000, 35000, 10), sales = rstep(25000, 60000, 10), cash = rstep(3000, 9000, 10), drec = rstep(200, 900, 5), disc = rstep(200, 800, 5), prov = rstep(100, 600, 10), ret = rstep(300, 1800, 5);
      var rec = frac(open + sales, 0.65, 0.8, 10), bal = open + sales - rec - disc - ret;
      return numq('A trader gives the totals below for one month. Write up the trade receivables ledger control account, balancing it at ' + m[0] + '.' + dataTable('', [['Debit balance at start of month', open], ['Credit sales', sales], ['Cash sales', cash], ['Receipts from credit customers', rec], ['Discount allowed', disc], ['Discount received', drec], ['Sales returns', ret], ['Increase in provision for irrecoverable debts', prov]]) + 'What is the balance carried down? Give your answer in $.', bal,
        'Leave out cash sales, discount received and the provision: none of them changes what credit customers owe. Debit: ' + plus([open, sales]) + ' = ' + money(open + sales) + '. Credit: ' + plus([rec, disc, ret]) + ' = ' + money(rec + disc + ret) + '. Balance c/d = ' + money(bal) + '.');
    } },
    { skill: 'receivables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(12000, 45000, 10), sales = rstep(20000, 55000, 10), dish = rstep(150, 800, 5), intc = rstep(20, 160, 1), contra = rstep(200, 1200, 5), disc = rstep(150, 700, 5);
      var rec = frac(open + sales, 0.62, 0.78, 10), dr = open + sales + dish + intc, cr = rec + disc + contra, bal = dr - cr;
      return numq('Write up the trade receivables ledger control account from these monthly totals, balancing it at ' + m[0] + '.' + dataTable('', [['Balance b/d (debit)', open], ['Sales day book total', sales], ['Cash book: receipts from customers', rec], ['Cash book: discount allowed', disc], ['Customers’ cheques dishonoured', dish], ['Interest charged on overdue accounts', intc], ['Set-off against trade payables ledger', contra]]) + 'What is the balance carried down? Give your answer in $.', bal,
        'Dishonoured cheques and interest charged increase the debt (debit). The set-off is a credit. Debit: ' + plus([open, sales, dish, intc]) + ' = ' + money(dr) + '. Credit: ' + plus([rec, disc, contra]) + ' = ' + money(cr) + '. Balance c/d = ' + money(bal) + '.');
    } },
    { skill: 'receivables control balance', gen: function () {
      var m = pick(MONTHS), odr = rstep(15000, 40000, 10), ocr = rstep(120, 700, 10), sales = rstep(20000, 50000, 10), ret = rstep(300, 1500, 5), ccr = rstep(100, 600, 10);
      var rec = frac(odr + sales, 0.62, 0.78, 10), dr = odr + sales + ccr, cr = ocr + rec + ret, bal = dr - cr;
      return numq('A business provides this information for the month ended ' + m[0] + '.' + dataTable('', [['Opening debit balances', odr], ['Opening credit balances', ocr], ['Credit sales', sales], ['Receipts from credit customers', rec], ['Returns inwards', ret], ['Credit balances on customers’ accounts at the end of the month', ccr]]) + 'Prepare the trade receivables ledger control account. What is the DEBIT balance carried down? Give your answer in $.', bal,
        'The closing credit balance of ' + money(ccr) + ' is carried down on the debit side. Debit: ' + plus([odr, sales, ccr]) + ' = ' + money(dr) + '. Credit: ' + plus([ocr, rec, ret]) + ' = ' + money(cr) + '. The debit balance c/d (on the credit side) = ' + money(dr) + ' − ' + money(cr) + ' = ' + money(bal) + '.');
    } },
    { skill: 'receivables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(6000, 25000, 10), sales = rstep(15000, 45000, 10), cash = rstep(2000, 7000, 10), ret = rstep(300, 1500, 5), disc = rstep(100, 600, 5);
      var rec = frac(open + sales, 0.65, 0.8, 10), bal = open + sales - rec - ret - disc;
      return mcq('For the month ended ' + m[0] + ': opening debit balance ' + money(open) + ', credit sales ' + money(sales) + ', cash sales ' + money(cash) + ', receipts from credit customers ' + money(rec) + ', returns inwards ' + money(ret) + ', discount allowed ' + money(disc) + '. What is the closing balance of the trade receivables ledger control account?',
        moneyOpts(bal, [bal + cash, bal + 2 * ret, bal + 2 * disc], 10),
        'Cash sales do not belong in the account. ' + money(open) + ' + ' + money(sales) + ' − ' + money(rec) + ' − ' + money(ret) + ' − ' + money(disc) + ' = ' + money(bal) + ', a debit balance.');
    } },
    // ---- trade payables control ----
    { skill: 'payables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(6000, 30000, 10), purch = rstep(15000, 50000, 10), disc = rstep(100, 800, 5), ret = rstep(200, 1800, 5);
      var pay = frac(open + purch, 0.62, 0.8, 10), bal = open + purch - pay - disc - ret;
      return numq('Use this information to write up and balance the trade payables ledger control account at ' + m[0] + '.' + dataTable('', [['Balance at start of month (credit)', open], ['Credit purchases', purch], ['Payments to credit suppliers', pay], ['Discount received', disc], ['Returns outwards', ret]]) + 'What is the balance carried down on ' + m[0] + '? Give your answer in $.', bal,
        'Credit side: ' + plus([open, purch]) + ' = ' + money(open + purch) + '. Debit side before the balance: ' + plus([pay, disc, ret]) + ' = ' + money(pay + disc + ret) + '. Balance c/d = ' + money(bal) + ', brought down as a credit on ' + m[1] + '.');
    } },
    { skill: 'payables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(8000, 28000, 10), purch = rstep(18000, 50000, 10), cashp = rstep(1500, 6000, 10), dalw = rstep(150, 700, 5), disc = rstep(150, 700, 5), retin = rstep(200, 1200, 5), ret = rstep(200, 1500, 5);
      var pay = frac(open + purch, 0.62, 0.8, 10), bal = open + purch - pay - disc - ret;
      return numq('A trader gives the totals below for one month. Write up the trade payables ledger control account, balancing it at ' + m[0] + '.' + dataTable('', [['Credit balance at start of month', open], ['Credit purchases', purch], ['Cash purchases', cashp], ['Payments to credit suppliers', pay], ['Discount allowed', dalw], ['Discount received', disc], ['Returns inwards', retin], ['Returns outwards', ret]]) + 'What is the balance carried down? Give your answer in $.', bal,
        'Ignore cash purchases, discount allowed and returns inwards: they do not involve credit suppliers. Credit: ' + plus([open, purch]) + ' = ' + money(open + purch) + '. Debit: ' + plus([pay, disc, ret]) + ' = ' + money(pay + disc + ret) + '. Balance c/d = ' + money(bal) + '.');
    } },
    { skill: 'payables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(9000, 30000, 10), purch = rstep(15000, 45000, 10), intc = rstep(25, 180, 1), refund = rstep(60, 400, 5), contra = rstep(150, 900, 5), disc = rstep(100, 600, 5);
      var pay = frac(open + purch, 0.6, 0.78, 10), cr = open + purch + intc + refund, dr = pay + disc + contra, bal = cr - dr;
      return numq('Write up the trade payables ledger control account from these monthly totals, balancing it at ' + m[0] + '.' + dataTable('', [['Balance b/d (credit)', open], ['Purchases day book total', purch], ['Cash book: payments to suppliers', pay], ['Cash book: discount received', disc], ['Interest charged by a supplier', intc], ['Refund received from a supplier', refund], ['Set-off against trade receivables ledger', contra]]) + 'What is the balance carried down? Give your answer in $.', bal,
        'Interest charged and refunds received go on the credit side; the set-off is a debit. Credit: ' + plus([open, purch, intc, refund]) + ' = ' + money(cr) + '. Debit: ' + plus([pay, disc, contra]) + ' = ' + money(dr) + '. Balance c/d = ' + money(bal) + '.');
    } },
    { skill: 'payables control balance', gen: function () {
      var m = pick(MONTHS), ocr = rstep(10000, 30000, 10), odr = rstep(80, 500, 10), purch = rstep(18000, 45000, 10), disc = rstep(100, 600, 5), cdr = rstep(90, 450, 10);
      var pay = frac(ocr + purch, 0.6, 0.78, 10), cr = ocr + purch + cdr, dr = odr + pay + disc, bal = cr - dr;
      return numq('A business gives this information for the month ended ' + m[0] + '.' + dataTable('', [['Opening credit balances', ocr], ['Opening debit balances', odr], ['Credit purchases', purch], ['Payments to suppliers', pay], ['Discount received', disc], ['Debit balances on suppliers’ accounts at the end of the month', cdr]]) + 'Prepare the trade payables ledger control account. What is the CREDIT balance carried down? Give your answer in $.', bal,
        'The closing debit balance of ' + money(cdr) + ' is carried down on the credit side. Credit: ' + plus([ocr, purch, cdr]) + ' = ' + money(cr) + '. Debit: ' + plus([odr, pay, disc]) + ' = ' + money(dr) + '. Credit balance c/d (on the debit side) = ' + money(bal) + '.');
    } },
    { skill: 'payables control balance', gen: function () {
      var m = pick(MONTHS), open = rstep(5000, 22000, 10), purch = rstep(12000, 40000, 10), disc = rstep(100, 500, 5), ret = rstep(200, 1200, 5), cashp = rstep(1000, 5000, 10);
      var pay = frac(open + purch, 0.62, 0.8, 10), bal = open + purch - pay - disc - ret;
      return mcq('For the month ended ' + m[0] + ': opening credit balance ' + money(open) + ', credit purchases ' + money(purch) + ', cash purchases ' + money(cashp) + ', payments to suppliers ' + money(pay) + ', discount received ' + money(disc) + ', returns outwards ' + money(ret) + '. What is the closing balance of the trade payables ledger control account?',
        moneyOpts(bal, [bal + cashp, bal + 2 * ret, bal + 2 * disc], 10),
        'Cash purchases are left out. ' + money(open) + ' + ' + money(purch) + ' − ' + money(pay) + ' − ' + money(disc) + ' − ' + money(ret) + ' = ' + money(bal) + ', a credit balance.');
    } },
    // ---- totals ----
    { skill: 'account totals', gen: function () {
      var open = rstep(9000, 30000, 10), sales = rstep(20000, 50000, 10), dish = rstep(120, 700, 5), disc = rstep(100, 600, 5), irr = rstep(100, 900, 10);
      var rec = frac(open + sales, 0.62, 0.8, 10), tot = open + sales + dish;
      return numq('A trade receivables ledger control account has these entries: balance b/d (debit) ' + money(open) + ', credit sales ' + money(sales) + ', cheques received ' + money(rec) + ', a customer’s cheque dishonoured ' + money(dish) + ', discount allowed ' + money(disc) + ' and irrecoverable debts ' + money(irr) + '. After it is balanced, what total appears at the foot of each side? Give your answer in $.', tot,
        'The debit side is the larger: ' + plus([open, sales, dish]) + ' = ' + money(tot) + '. The balance c/d of ' + money(tot - rec - disc - irr) + ' is placed on the credit side to make it total the same.');
    } },
    { skill: 'account totals', gen: function () {
      var open = rstep(7000, 25000, 10), purch = rstep(15000, 45000, 10), intc = rstep(20, 150, 1), disc = rstep(100, 600, 5), ret = rstep(150, 1000, 5);
      var pay = frac(open + purch, 0.6, 0.78, 10), tot = open + purch + intc;
      return numq('A trade payables ledger control account has these entries: balance b/d (credit) ' + money(open) + ', credit purchases ' + money(purch) + ', interest charged by a supplier ' + money(intc) + ', payments ' + money(pay) + ', discount received ' + money(disc) + ' and returns outwards ' + money(ret) + '. After it is balanced, what total appears at the foot of each side? Give your answer in $.', tot,
        'The credit side is the larger: ' + plus([open, purch, intc]) + ' = ' + money(tot) + '. The balance c/d of ' + money(tot - pay - disc - ret) + ' goes on the debit side so both sides total ' + money(tot) + '.');
    } },
    // ---- spotting an error in a prepared account ----
    { skill: 'spot the error', gen: function () {
      var open = rstep(9000, 30000, 10), sales = rstep(20000, 50000, 10), cash = rstep(2000, 6000, 10), disc = rstep(100, 600, 5), ret = rstep(200, 1500, 5), rec = frac(open + sales, 0.62, 0.8, 10);
      return mcq('A trainee prepared this trade receivables ledger control account.' + tacct('Trade receivables ledger control account', [['Balance b/d', open], ['Sales day book', sales], ['Cash sales', cash]], [['Cash book', rec], ['Discount allowed', disc], ['Sales returns day book', ret]]) + 'Which entry should NOT appear in the account?',
        ['Cash sales', 'Sales day book', 'Discount allowed', 'Sales returns day book'],
        'Cash sales are paid for at once, so no customer owes anything for them. Including them overstates the closing balance by ' + money(cash) + '.');
    } },
    { skill: 'spot the error', gen: function () {
      var open = rstep(9000, 30000, 10), sales = rstep(20000, 50000, 10), contra = rstep(200, 900, 5), irr = rstep(100, 800, 10), rec = frac(open + sales, 0.62, 0.8, 10);
      return mcq('A trainee prepared this trade receivables ledger control account.' + tacct('Trade receivables ledger control account', [['Balance b/d', open], ['Sales day book', sales], ['Set-off: trade payables', contra]], [['Cash book', rec], ['Irrecoverable debts', irr]]) + 'Which entry is on the wrong side?',
        ['Set-off: trade payables', 'Sales day book', 'Cash book', 'Irrecoverable debts'],
        'A set-off (contra) reduces what the customer owes, so it belongs on the credit side of the receivables control account. Correcting it lowers the closing balance by 2 × ' + money(contra) + ' = ' + money(2 * contra) + '.');
    } },
    { skill: 'spot the error', gen: function () {
      var open = rstep(6000, 25000, 10), purch = rstep(15000, 45000, 10), dalw = rstep(100, 700, 5), ret = rstep(200, 1200, 5), pay = frac(open + purch, 0.6, 0.78, 10);
      return mcq('A trainee prepared this trade payables ledger control account.' + tacct('Trade payables ledger control account', [['Cash book', pay], ['Discount allowed', dalw], ['Purchases returns day book', ret]], [['Balance b/d', open], ['Purchases day book', purch]]) + 'Which entry should NOT appear in the account?',
        ['Discount allowed', 'Cash book', 'Purchases returns day book', 'Purchases day book'],
        'Discount allowed is given to customers, so it belongs in the trade receivables control account. The trade payables account should show discount received instead.');
    } },
    { skill: 'spot the error', gen: function () {
      var open = rstep(6000, 25000, 10), purch = rstep(15000, 45000, 10), intc = rstep(25, 180, 1), disc = rstep(100, 500, 5), pay = frac(open + purch, 0.6, 0.78, 10);
      return mcq('A trainee prepared this trade payables ledger control account.' + tacct('Trade payables ledger control account', [['Cash book', pay], ['Discount received', disc], ['Interest charged', intc]], [['Balance b/d', open], ['Purchases day book', purch]]) + 'Which entry is on the wrong side?',
        ['Interest charged', 'Discount received', 'Cash book', 'Purchases day book'],
        'Interest charged by a supplier increases what the business owes, so it belongs on the credit side. On the debit side it wrongly reduces the balance owed.');
    } },
    { skill: 'spot the error', gen: function () {
      var x = rstep(9000, 35000, 10), y = rstep(1500, 6000, 10);
      return numq('A student’s trade receivables ledger control account shows a debit balance c/d of ' + money(x) + '. The teacher notices that cash sales of ' + money(y) + ' were included on the debit side. What is the correct balance carried down? Give your answer in $.', x - y,
        'Removing ' + money(y) + ' from the debit side reduces the balance by the same amount: ' + money(x) + ' − ' + money(y) + ' = ' + money(x - y) + '.');
    } },
    // ---- layout, dates and details ----
    { skill: 'layout and balances', gen: function () {
      var m = pick(MONTHS);
      return mcq('A trade receivables ledger control account is balanced on ' + m[0] + ', with the balance carried down on the credit side. How is it brought down?',
        ['As Balance b/d on the debit side on ' + m[1], 'As Balance b/d on the credit side on ' + m[1], 'As Balance c/d on the debit side on ' + m[0], 'As Balance b/d on the debit side on ' + m[0]],
        'The balance carried down on the credit side is brought down on the opposite (debit) side, dated the first day of the next period, ' + m[1] + '. Customers still owe this amount.');
    } },
    { skill: 'layout and balances', gen: function () {
      var d = rstep(20000, 60000, 10), c = rstep(150, 900, 10);
      return mcq('At the start of the month the receivables ledger has debit balances totalling ' + money(d) + ' and credit balances totalling ' + money(c) + '. How are these shown in the control account?',
        ['Separately: ' + money(d) + ' debit and ' + money(c) + ' credit, each as Balance b/d', 'As one net debit of ' + money(d - c) + ', because only one balance is allowed', 'As one debit of ' + money(d + c) + ', because both are owed by customers', 'Only the ' + money(d) + ' is shown; credit balances are ignored'],
        'Both totals are brought down separately on their own sides. Netting them to ' + money(d - c) + ' is a common error that loses marks.');
    } },
    { skill: 'layout and balances', gen: function () {
      var a = rstep(90, 600, 10);
      return mcq('At the end of the year some suppliers owe the business a total of ' + money(a) + ' because of overpayments. How is this shown in the trade payables ledger control account?',
        ['Balance c/d on the credit side, brought down on the debit side', 'Balance c/d on the debit side, brought down on the credit side', 'Deducted from the main credit balance and not shown separately', 'Transferred to the trade receivables ledger control account'],
        'Debit balances in the payables ledger are the unusual side. They are carried down on the credit side and brought down as a debit, separately from the main credit balance.');
    } },
    { skill: 'layout and balances', q: 'In a trade receivables ledger control account, which is the best detail for the total of money received from credit customers?',
      kind: 'mcq', options: ['Cash book', 'Sales day book', 'Sales returns day book', 'Balance c/d'], answer: 0,
      why: 'The details name the source of the total. Receipts come from the cash book; credit sales come from the sales day book and returns from the sales returns day book.' },
    { skill: 'layout and balances', q: 'A control account’s debit side adds to $84,320 and its credit side, before balancing, adds to $79,150. What should be done?',
      kind: 'mcq', options: ['Enter Balance c/d $5,170 on the credit side so both sides total $84,320', 'Enter Balance c/d $5,170 on the debit side so both sides total $84,320', 'Enter Balance c/d $84,320 on the credit side so both sides agree', 'Enter Balance b/d $5,170 on the credit side on the same date'], answer: 0,
      why: 'The larger total, $84,320, goes on both sides. The balancing figure, $84,320 − $79,150 = $5,170, is carried down on the smaller (credit) side and brought down as a debit next period.' }
  ] };

  // ======================================================================
  // ACC-CTL-11 Bank terms and ways of paying
  // ======================================================================
  var PAYTERMS = ['Standing order', 'Direct debit', 'Credit transfer', 'Dishonoured cheque'];
  function termQ(q, correct, why, pool) { pool = pool || PAYTERMS; return mcq(q, [correct].concat(pool.filter(function (t) { return t !== correct; })).slice(0, 4), why); }
  B['ACC-CTL-11'] = { title: 'Bank terms and ways of paying', items: [
    { skill: 'payment methods', gen: function () {
      var a = rstep(250, 1800, 50), d = pick(['1st', '15th', '28th']);
      return termQ('A business instructs its bank to pay ' + money(a) + ' to its landlord on the ' + d + ' of every month. What is this method of payment called?', 'Standing order',
        'The business (the payer) sets up the instruction, and the amount is fixed at ' + money(a) + ', paid at regular intervals. That is a standing order.');
    } },
    { skill: 'payment methods', q: 'A telephone company takes a different amount from a shop’s bank account each month, with the shop’s permission, to settle its bills. What is this method of payment called?',
      kind: 'mcq', options: ['Direct debit', 'Standing order', 'Credit transfer', 'Unpresented cheque'], answer: 0,
      why: 'The payee (the telephone company) collects the money and the amount can vary each month, which are the two features of a direct debit.' },
    { skill: 'payment methods', gen: function () {
      var c = pick(PEOPLE), a = rstep(120, 2400, 5);
      return termQ(c + ', a credit customer, pays ' + money(a) + ' straight into the business’s bank account electronically. On the business’s bank statement, what is this receipt called?', 'Credit transfer',
        'Money paid directly into the business’s account by someone else is a credit transfer (an electronic receipt). The business may only learn of it from the bank statement.', ['Credit transfer', 'Standing order', 'Direct debit', 'Outstanding lodgement']);
    } },
    { skill: 'payment methods', kind: 'multi', q: 'Select the features of a direct debit.',
      options: ['The amount can vary from one payment to the next', 'The payment is collected at the request of the payee', 'It is used for regular, recurring payments', 'The payer fixes the amount in an instruction to the bank', 'It can only be used for a single one-off payment'],
      answers: [0, 1, 2],
      why: 'A direct debit is started by the payee, may vary in amount and date, and is used for recurring bills. A fixed amount set by the payer describes a standing order.' },
    { skill: 'payment methods', kind: 'multi', q: 'Select the features of a standing order.',
      options: ['A fixed amount is paid each time', 'The payer gives the instruction to the bank', 'Payments are made at regular intervals', 'The payee decides how much to collect each month', 'The amount changes with the size of each bill'],
      answers: [0, 1, 2],
      why: 'A standing order is a fixed, regular payment set up by the payer. If the payee decides the amount, or it changes with each bill, it is a direct debit.' },
    { skill: 'payment methods', q: 'Which statement correctly contrasts a standing order with a direct debit?',
      kind: 'mcq', options: ['A standing order is a fixed sum set by the payer; a direct debit is collected by the payee and may vary', 'A standing order is collected by the payee; a direct debit is a fixed sum set up in advance by the payer each year', 'A standing order is paid by cheque; a direct debit is paid in cash at the bank counter', 'A standing order is for receipts; a direct debit is only for paying wages to employees'], answer: 0,
      why: 'Standing order: payer starts it, amount fixed. Direct debit: payee starts it, amount can vary.' },
    { skill: 'payment methods', gen: function () {
      var o = pick(OWNERS);
      return mcq(o + '’s electricity bill is a different amount every month. Why is a direct debit more suitable than a standing order for paying it?',
        ['A direct debit lets the supplier collect the varying amount', 'A standing order cannot be used by a small business', 'A direct debit is always cheaper than a standing order', 'A standing order must be paid in cash each month'],
        'A standing order pays a fixed sum, which would not match a bill that changes. With a direct debit the payee collects whatever the bill is each month.');
    } },
    { skill: 'payment methods', q: 'In a direct debit, who starts (initiates) each payment?',
      kind: 'mcq', options: ['The payee, who is receiving the money', 'The payer, who owns the bank account used', 'The bank, without any instruction', 'The business’s accountant'], answer: 0,
      why: 'The payer gives permission once, but each payment is collected by the payee. In a standing order it is the payer who instructs the bank.' },
    // ---- timing differences ----
    { skill: 'timing differences', q: 'What is an unpresented cheque?',
      kind: 'mcq', options: ['A cheque written and entered in the cash book that the bank has not yet paid', 'A cheque received from a customer that the bank has refused to pay', 'Money paid into the bank that the bank has not yet recorded', 'A cheque that has been written by the business but not yet entered in its own cash book'], answer: 0,
      why: 'The business has recorded the payment, but the cheque has not yet reached the bank for payment, so it is not on the bank statement.' },
    { skill: 'timing differences', q: 'What is an outstanding (uncredited) lodgement?',
      kind: 'mcq', options: ['Money paid into the bank and entered in the cash book but not yet on the bank statement', 'A cheque paid by the business that the bank has not yet taken from the account', 'An amount the bank has added to the account that is not in the cash book', 'A customer’s cheque returned by the bank to the business because the drawer could not pay it'], answer: 0,
      why: 'The business has recorded the deposit, but the bank has not yet credited it, usually because it was paid in at the very end of the period.' },
    { skill: 'timing differences', gen: function () {
      var m = pick(MONTHS), a = rstep(300, 2500, 10);
      return termQ('On ' + m[0] + ' a business paid ' + money(a) + ' of takings into the bank and entered it in the cash book. The bank statement dated ' + m[0] + ' does not show it. What is this item?', 'Outstanding lodgement',
        'The deposit is in the cash book but not yet on the bank statement, so it is an outstanding (uncredited) lodgement, a timing difference.', ['Outstanding lodgement', 'Unpresented cheque', 'Credit transfer', 'Dishonoured cheque']);
    } },
    { skill: 'timing differences', gen: function () {
      var m = pick(MONTHS), s = pick(PEOPLE), a = rstep(150, 1800, 5);
      return termQ('Near the end of the month a business sent ' + s + ' a cheque for ' + money(a) + ' and entered it in the cash book. It is not on the bank statement dated ' + m[0] + '. What is this item?', 'Unpresented cheque',
        'The payment is in the cash book but ' + s + ' has not yet presented the cheque for payment, so the bank has not deducted it: an unpresented cheque.', ['Unpresented cheque', 'Outstanding lodgement', 'Standing order', 'Dishonoured cheque']);
    } },
    { skill: 'timing differences', q: 'Which pair are both timing differences between the cash book and the bank statement?',
      kind: 'mcq', options: ['Unpresented cheques and outstanding lodgements', 'Bank charges and standing orders', 'Credit transfers and direct debits', 'Dishonoured cheques and bank interest'], answer: 0,
      why: 'Unpresented cheques and outstanding lodgements are already in the cash book and will reach the bank soon. The other items are known only from the bank statement until the cash book is updated.' },
    // ---- dishonoured cheques ----
    { skill: 'dishonoured cheques', q: 'What is a dishonoured cheque?',
      kind: 'mcq', options: ['A cheque that the bank refuses to pay', 'A cheque that has not yet been presented', 'A cheque paid into the bank late', 'A cheque written for the wrong supplier'], answer: 0,
      why: 'A cheque is dishonoured when the bank will not pay it, for example because the drawer does not have enough money in the account.' },
    { skill: 'dishonoured cheques', kind: 'multi', q: 'Select the reasons why a bank might dishonour a cheque.',
      options: ['There is not enough money in the drawer’s account', 'The cheque has not been signed', 'The amounts in words and figures do not agree', 'The cheque is out of date', 'The cheque was paid in on the day it was written', 'The payee is a regular customer of the bank'],
      answers: [0, 1, 2, 3],
      why: 'Insufficient funds, a missing signature, words and figures that differ, and a stale (out-of-date) cheque are all reasons to refuse payment. Paying a cheque in promptly is not a problem.' },
    { skill: 'dishonoured cheques', gen: function () {
      var c = pick(PEOPLE), a = rstep(80, 900, 5);
      return mcq('A cheque for ' + money(a) + ' received from ' + c + ' has been dishonoured. What does this mean for the business?',
        ['The money it recorded as received has not arrived, so ' + c + ' owes it again', 'The bank has paid ' + money(a) + ' into the account a second time by mistake', c + ' no longer owes anything, so the debt is written off', 'The business must pay ' + money(a) + ' to ' + c + ' as a refund'],
        'The business recorded ' + money(a) + ' as received, but the bank would not pay the cheque. The bank balance is lower than the cash book shows and ' + c + '’s debt is reinstated.');
    } },
    // ---- reading the bank statement ----
    { skill: 'reading the bank statement', gen: function () {
      var a = rstep(400, 9000, 10);
      return mcq('A bank statement ends with a balance of ' + money(a) + ' Cr. What does this mean?',
        ['The business has ' + money(a) + ' in its bank account', 'The business is overdrawn by ' + money(a), 'The business owes the bank ' + money(a) + ' in charges', 'The bank has refused a cheque for ' + money(a)],
        'The statement is written from the bank’s side. A credit balance means the bank owes the business that money, so it is money in the account.');
    } },
    { skill: 'reading the bank statement', gen: function () {
      var a = rstep(200, 4000, 10);
      return mcq('A bank statement ends with a balance of ' + money(a) + ' Dr. What does this mean?',
        ['The business has an overdraft of ' + money(a), 'The business has ' + money(a) + ' in its bank account', 'The bank owes the business ' + money(a) + ' in interest', 'The business has unpresented cheques of ' + money(a)],
        'From the bank’s side, a debit balance means the business owes the bank: the account is overdrawn by ' + money(a) + ', and the bank is a creditor of the business.');
    } },
    { skill: 'reading the bank statement', q: 'Why does money paid into a business’s account appear as a credit on its bank statement?',
      kind: 'mcq', options: ['The statement is the bank’s record, and the bank now owes the money to the business', 'Money received is always a credit in the business’s own cash book as well', 'The bank charges a fee whenever money is paid into an account', 'The statement only ever shows the amounts that are owed by the business to its bank'], answer: 0,
      why: 'The bank keeps the customer’s account in its own books. A deposit increases what the bank owes the customer, a liability for the bank, so it is credited. In the cash book the same receipt is a debit.' },
    { skill: 'reading the bank statement', q: 'A business is overdrawn at the bank. On which side of its own cash book (bank column) is the balance brought down?',
      kind: 'mcq', options: ['Credit side', 'Debit side', 'It is not shown in the cash book', 'Either side, as the business chooses'], answer: 0,
      why: 'In the cash book an overdraft is a credit balance (money owed to the bank). On the bank statement the same overdraft appears as a debit balance, because the statement is the bank’s view.' },
    { skill: 'reading the bank statement', q: 'In which column of the business’s bank statement does a standing order paid by the business appear?',
      kind: 'mcq', options: ['The debit (payments) column', 'The credit (receipts) column', 'It does not appear on the statement', 'The balance column only'], answer: 0,
      why: 'Money leaving the account reduces what the bank owes the business, so it is shown as a debit (payment) on the bank statement.' },
    { skill: 'reading the bank statement', q: 'In which column of the business’s bank statement does a credit transfer from a customer appear?',
      kind: 'mcq', options: ['The credit (receipts) column', 'The debit (payments) column', 'It never appears on a bank statement', 'The balance column only'], answer: 0,
      why: 'Money paid into the account increases what the bank owes the business, so the bank shows it in the credit (receipts) column.' }
  ] };

  // ======================================================================
  // ACC-CTL-10 Why prepare a bank reconciliation statement?
  // ======================================================================
  B['ACC-CTL-10'] = { title: 'Why prepare a bank reconciliation statement?', items: [
    { skill: 'nature', q: 'Which statement best describes a bank reconciliation statement?',
      kind: 'mcq', options: ['The business’s own explanation of why its cash book and bank statement balances differ', 'A statement prepared by the bank each month and posted out to every one of its business customers', 'An account in the general ledger with debit and credit sides, balanced each month', 'A list of all the bank charges and interest paid by the business during the year'], answer: 0,
      why: 'The business prepares it to explain the difference between the bank balance in its cash book and the balance on the bank statement on the same date.' },
    { skill: 'nature', q: 'Is a bank reconciliation statement part of the double-entry system?',
      kind: 'mcq', options: ['No: it is a separate statement, not a ledger account', 'Yes: it is debited and credited just like the cash book', 'Yes: it replaces the bank column of the cash book', 'No: it is only prepared by the bank’s own staff'], answer: 0,
      why: 'It is a working statement that explains a difference. Any items that need recording, such as bank charges, are entered in the cash book, not in the reconciliation.' },
    { skill: 'nature', q: 'What two figures does a bank reconciliation statement link together?',
      kind: 'mcq', options: ['The cash book bank balance and the bank statement balance at the same date', 'The opening and closing balances of the cash book for the same month', 'The cash in the till and the cash book balance at the end of the day', 'The trade receivables total and the bank statement balance at the year end'], answer: 0,
      why: 'It starts from one of the two bank balances (cash book or statement) on the same date and shows how the other is reached.' },
    { skill: 'nature', q: 'Who prepares a bank reconciliation statement?',
      kind: 'mcq', options: ['The trader or the trader’s bookkeeper', 'The manager at the bank’s local branch office', 'The business’s customers', 'The tax authority'], answer: 0,
      why: 'The trader prepares it from the cash book and the bank statement. The bank only supplies the statement.' },
    { skill: 'nature', q: 'Why do the cash book balance and the bank statement balance usually differ at the end of a month?',
      kind: 'mcq', options: ['Timing differences, items not yet in the cash book, and errors', 'The bank always rounds the account balances to the nearest $100', 'The cash book includes only cash, not cheques or transfers', 'The bank statement includes the owner’s private account too'], answer: 0,
      why: 'Some cheques and lodgements have not yet reached the bank, some bank items (charges, transfers) are not yet in the cash book, and either side may have made a mistake.' },
    { skill: 'nature', q: 'After the cash book has been updated and the reconciliation completed, which bank figure is shown in the statement of financial position?',
      kind: 'mcq', options: ['The updated cash book balance', 'The bank statement balance', 'The original cash book balance', 'The total of unpresented cheques'], answer: 0,
      why: 'The updated cash book balance includes everything the business has paid or received, including cheques the bank has not yet processed, so it is the business’s true bank figure.' },
    // ---- benefits ----
    { skill: 'benefits', kind: 'multi', q: 'Select the benefits of preparing a bank reconciliation statement.',
      options: ['It helps find errors in the cash book', 'It helps find errors made by the bank', 'It helps deter and detect fraud', 'It shows items to enter in the cash book, such as bank charges', 'It calculates the profit for the year', 'It removes the need to keep a cash book'],
      answers: [0, 1, 2, 3],
      why: 'Reconciling checks the cash book against an independent record, so it finds errors on either side, deters fraud and brings the cash book up to date. It does not calculate profit or replace the cash book.' },
    { skill: 'benefits', q: 'How does preparing a bank reconciliation statement help to deter fraud?',
      kind: 'mcq', options: ['The bank statement is an independent record, so a hidden payment would show as a difference', 'The bank refuses to pay any cheque until the reconciliation has been completed and checked by the owner', 'It records the name of every employee who writes a cheque for the business', 'It is sent to the police every month to check for unusual payments'], answer: 0,
      why: 'Staff cannot easily hide a theft in the cash book, because the bank’s own record must agree with it once timing differences are explained.' },
    { skill: 'benefits', q: 'How does a bank reconciliation help to keep the cash book up to date?',
      kind: 'mcq', options: ['It reveals items such as standing orders and bank charges that are not yet recorded', 'It adds all the unpresented cheques to the cash book for a second time so they match', 'It changes the bank statement to match the cash book', 'It removes outstanding lodgements from the cash book'], answer: 0,
      why: 'Comparing the two records shows items only the bank knew about, such as direct debits, charges, interest and credit transfers, which can then be entered in the cash book.' },
    { skill: 'benefits', q: 'Why is it useful that a bank reconciliation shows cheques that have been unpresented for many months?',
      kind: 'mcq', options: ['They may never be cashed and may need cancelling in the cash book', 'They prove that the bank has made an error in its own records for the month', 'They must be paid again to the supplier straight away', 'They show that the business has made a loss'], answer: 0,
      why: 'Very old cheques may have been lost or will be refused as out of date. Spotting them lets the business follow them up and correct the cash book if needed.' },
    { skill: 'benefits', q: 'Which answer to “Explain one benefit of a bank reconciliation statement” is best developed?',
      kind: 'mcq', options: ['It finds errors in the cash book, so the bank balance used for decisions is correct', 'It finds errors.', 'It is a statement prepared at the end of the month.', 'It lists the unpresented cheques and the outstanding lodgements at the end of every month.'], answer: 0,
      why: 'An Explain answer needs a benefit and its development. “Finds errors in the cash book” is the benefit; “so the balance used for decisions is correct” develops it.' },
    { skill: 'benefits', q: 'Why does a reconciled, up-to-date cash book help a trader plan payments to suppliers?',
      kind: 'mcq', options: ['The trader knows the true amount available in the bank', 'The bank will then allow an unlimited overdraft', 'Suppliers can see the cash book before sending goods', 'Unpresented cheques are removed from the account'], answer: 0,
      why: 'Once bank-only items and errors are put right, the cash book shows the real bank position, so the trader can see whether there is enough money to pay suppliers on time.' },
    // ---- what it reveals ----
    { skill: 'what it reveals', gen: function () {
      var o = pick(OWNERS), a = rstep(30, 400, 5), what = pick(['a direct debit for insurance', 'bank charges', 'a standing order for rent']);
      return mcq('While reconciling, ' + o + ' finds ' + what + ' of ' + money(a) + ' on the bank statement, not yet recorded in the cash book. What does this show?',
        ['The cash book needs updating with this payment', 'The bank has made an error that it must reverse', 'It is a timing difference to list in the statement', 'The payment should be ignored as it is small'],
        'The bank has already made this payment, but the business has not recorded it. It is entered on the credit side of the cash book, not listed as a timing difference.');
    } },
    { skill: 'what it reveals', q: 'Which item would a bank reconciliation reveal as an error made by the BANK?',
      kind: 'mcq', options: ['A cheque written by another firm deducted from the business’s account', 'A cheque payment of $508 entered in the business’s own cash book as $580', 'A standing order for rent not yet entered in the cash book', 'Takings paid in on the last day not yet shown by the bank'], answer: 0,
      why: 'Another firm’s cheque should never be taken from this account, so the bank must correct it. The other items are a cash book error, an item to update and a timing difference.' },
    { skill: 'what it reveals', q: 'Which item would a bank reconciliation reveal as an error in the CASH BOOK?',
      kind: 'mcq', options: ['A receipt from a customer of $640 recorded in the cash book as $460', 'A cheque to a supplier not yet presented for payment', 'Interest added by the bank at the end of the month', 'A cheque drawn on another firm’s account deducted from this account by the bank in error'], answer: 0,
      why: 'The bank statement shows the true $640, so the business’s own record is wrong and must be corrected by $180. The other items are a timing difference, an update item and a bank error.' },
    { skill: 'what it reveals', kind: 'multi', q: 'Which items does a business usually learn about only when it receives the bank statement?',
      options: ['Bank charges', 'Interest paid by the bank', 'Credit transfers from customers', 'Customers’ cheques that have been dishonoured', 'Cheques it has sent to suppliers', 'Takings it has paid into the bank'],
      answers: [0, 1, 2, 3],
      why: 'Charges, interest, credit transfers and dishonoured cheques are first recorded by the bank. The business already knows about the cheques it wrote and the takings it banked.' },
    { skill: 'what it reveals', q: 'A reconciliation shows several cheques sent to suppliers in the last few days that are not yet on the bank statement. What does this mean?',
      kind: 'mcq', options: ['They are timing differences and need no correction', 'The cash book must be credited with them again', 'The bank has made an error and must be told', 'The suppliers have refused to accept the cheques'], answer: 0,
      why: 'The cheques are correctly in the cash book; the bank has simply not paid them yet. They are listed as unpresented cheques in the statement.' },
    // ---- advice ----
    { skill: 'advice', gen: function () {
      var o = pick(OWNERS);
      return mcq(o + ' says: “My bank never makes mistakes, so I will stop preparing bank reconciliation statements.” What is the best advice?',
        ['Continue: it also finds your own errors, missing items and possible fraud', 'Stop: if the bank is reliable, the reconciliation has no other use for the business', 'Stop: the bank will prepare the reconciliation for you if needed', 'Continue, but only once every five years to save time'],
        'Even with a reliable bank, the reconciliation checks the business’s own cash book, brings it up to date with bank-only items and deters fraud, so it should be prepared regularly.');
    } },
    { skill: 'advice', q: 'How often should a business normally prepare a bank reconciliation statement?',
      kind: 'mcq', options: ['Regularly, for example each time a bank statement arrives', 'Only when the business makes a loss', 'Only when the bank asks for one', 'Once, when the business first opens'], answer: 0,
      why: 'Regular reconciliation means errors, missing items and fraud are found quickly, while the details are still fresh and easy to check.' },
    { skill: 'advice', q: 'A student is asked to “Explain the benefits of a bank reconciliation statement”. Which answer would earn no marks?',
      kind: 'mcq', options: ['Start with the cash book balance, add unpresented cheques and deduct lodgements', 'It shows bank charges not yet in the cash book, so the balance can be corrected', 'It acts as a check by an independent party, which helps to deter fraud', 'It identifies errors by the bank, so they can be reported and put right'], answer: 0,
      why: 'That answer describes how to PREPARE the statement, not WHY it is useful. The question asks for benefits, so method steps gain no credit.' },
    { skill: 'advice', gen: function () {
      var o = pick(OWNERS), a = rstep(200, 900, 10);
      return mcq(o + ' has not reconciled the bank account for six months. A customer’s cheque for ' + money(a) + ' was dishonoured in that time. What is the most likely result?',
        ['The cash book balance is overstated and the debt is not being chased', 'The bank statement balance is overstated by ' + money(a) + ' because of this cheque', 'The cheque will automatically be paid again by the bank', 'There is no effect, because the bank corrects its own records'],
        'Without reconciling, ' + o + ' may not know the cheque was dishonoured. The cash book still shows the ' + money(a) + ' as received, so its balance is too high and the customer is not asked to pay again.');
    } },
    { skill: 'advice', q: 'Which conclusion would best complete an answer advising a trader whether to continue preparing monthly bank reconciliations?',
      kind: 'mcq', options: ['Continue: the small time cost is outweighed by finding errors and deterring fraud', 'Stop: the bank statement already shows the correct balance for the year-end accounts', 'Stop: reconciliations are only needed by large companies', 'Continue, but only list the unpresented cheques and nothing else'], answer: 0,
      why: 'A good conclusion weighs the benefits (errors found, cash book up to date, fraud deterred) against the small effort and gives a clear recommendation.' }
  ] };

  // ======================================================================
  // ACC-CTL-12 Updating the cash book from the bank statement
  // ======================================================================
  var CBS = ['Debit side', 'Credit side', 'No entry in the cash book'];
  function cbSide(skill, item, correct, why) {
    return { skill: skill, kind: 'mcq', q: 'The cash book (bank column) is being updated from the bank statement. How is this item treated: <b>' + item + '</b>?',
      options: [correct].concat(CBS.filter(function (s) { return s !== correct; })), answer: 0, why: why };
  }
  var OD = ' Give an overdraft as a negative number, for example -350.';
  function upd(open, plusItems, minusItems) {
    // plusItems/minusItems: arrays of [label, amount]; returns [answer, working text]
    var v = open, txt = money(open);
    plusItems.forEach(function (p) { v += p[1]; txt += ' + ' + money(p[1]) + ' (' + p[0] + ')'; });
    minusItems.forEach(function (p) { v -= p[1]; txt += ' − ' + money(p[1]) + ' (' + p[0] + ')'; });
    return [v, txt + ' = ' + money(v)];
  }
  B['ACC-CTL-12'] = { title: 'Updating the cash book from the bank statement', items: [
    cbSide('which side', 'a standing order for rent paid by the bank', 'Credit side', 'A standing order is money paid out of the account, so it goes on the credit (payments) side of the cash book.'),
    cbSide('which side', 'a credit transfer received from a customer', 'Debit side', 'A credit transfer is money received into the bank, so it is debited in the cash book.'),
    cbSide('which side', 'a customer’s cheque returned unpaid (dishonoured)', 'Credit side', 'The business had debited the cheque as money received. The money never arrived, so the cash book is credited to cancel it.'),
    cbSide('which side', 'interest received from the bank', 'Debit side', 'Interest received increases the money in the bank, so it goes on the debit side.'),
    cbSide('which side', 'bank charges for the month', 'Credit side', 'Bank charges are taken out of the account, so they are entered on the credit side of the cash book.'),
    cbSide('not entered', 'a cheque sent to a supplier that is not yet on the bank statement', 'No entry in the cash book', 'An unpresented cheque is already in the cash book. It is a timing difference that goes in the reconciliation statement, not entered again.'),
    cbSide('not entered', 'takings paid into the bank on the last day, not yet on the bank statement', 'No entry in the cash book', 'An outstanding lodgement is already recorded in the cash book. It appears only in the bank reconciliation statement.'),
    { skill: 'not entered', kind: 'multi', q: 'A bank statement and a cash book are compared. Select every item that should be ENTERED in the cash book when it is updated.',
      options: ['A direct debit for insurance shown only on the bank statement', 'Bank interest received shown only on the bank statement', 'A dishonoured cheque from a customer', 'A cheque paid to a supplier that the bank has not yet paid', 'Cash paid in on the last day that the bank has not yet recorded'],
      answers: [0, 1, 2],
      why: 'Items the bank has recorded but the business has not (direct debits, interest, dishonoured cheques) go into the cash book. Unpresented cheques and outstanding lodgements are already there.' },
    { skill: 'not entered', gen: function () {
      var m = pick(MONTHS), open = rstep(900, 4500, 10), so = rstep(150, 600, 10), ct = rstep(200, 1500, 5), up = rstep(200, 1500, 5), lodg = rstep(300, 2000, 10);
      var r = upd(open, [['credit transfer', ct]], [['standing order', so]]);
      return numq('On ' + m[0] + ' the cash book shows a debit balance of ' + money(open) + '. Comparing the cash book with the bank statement shows these differences:<br>• a standing order for rent, ' + money(so) + ', not in the cash book<br>• a credit transfer from a customer, ' + money(ct) + ', not in the cash book<br>• unpresented cheques, ' + money(up) + '<br>• an outstanding lodgement, ' + money(lodg) + '<br>What is the updated cash book balance? Give your answer in $.', r[0],
        'Only bank-only items are entered: ' + r[1] + '. The unpresented cheques and the lodgement are already in the cash book; they belong in the reconciliation statement.');
    } },
    // ---- updated balance ----
    { skill: 'updated balance', gen: function () {
      var m = pick(MONTHS), open = rstep(800, 4000, 10), so = rstep(150, 600, 10), ch = rint(12, 60), ct = rstep(200, 1500, 5);
      var r = upd(open, [['credit transfer', ct]], [['standing order', so], ['bank charges', ch]]);
      return numq('A trader’s cash book (bank column) has a debit balance of ' + money(open) + ' on ' + m[0] + '. The bank statement shows a standing order of ' + money(so) + ', bank charges of ' + money(ch) + ' and a credit transfer from a customer of ' + money(ct) + ', none of which are in the cash book. What is the updated balance brought down on ' + m[1] + '? Give your answer in $.', r[0],
        'Receipts go on the debit side and payments on the credit side: ' + r[1] + ', a debit balance.');
    } },
    { skill: 'updated balance', gen: function () {
      var m = pick(MONTHS), open = rstep(1200, 5000, 10), dish = rstep(80, 600, 5), intr = rint(5, 45), dd = rstep(40, 300, 5), c = pick(PEOPLE);
      var r = upd(open, [['interest received', intr]], [['dishonoured cheque, ' + c, dish], ['direct debit', dd]]);
      return numq('The cash book shows money in the bank of ' + money(open) + ' on ' + m[0] + '. The bank statement reveals: a cheque from ' + c + ' for ' + money(dish) + ' has been dishonoured; interest of ' + money(intr) + ' has been received; a direct debit of ' + money(dd) + ' for insurance has been paid. What is the updated cash book balance? Give your answer in $.', r[0],
        'The dishonoured cheque and the direct debit are credited; interest received is debited: ' + r[1] + '.');
    } },
    { skill: 'updated balance', gen: function () {
      var open = rstep(1500, 5000, 10), dish = rstep(100, 700, 5), ch = rint(15, 70), ct = rstep(200, 1200, 5), up = rstep(300, 1400, 5);
      var right = open + ct - dish - ch;
      return mcq('The cash book has a debit balance of ' + money(open) + '. Not yet recorded in it: a dishonoured cheque of ' + money(dish) + ', bank charges of ' + money(ch) + ' and a credit transfer of ' + money(ct) + '. There are also unpresented cheques of ' + money(up) + '. What is the updated cash book balance?',
        moneyOpts(right, [right + 2 * dish, right - up, right - 2 * ct], 5),
        money(open) + ' + ' + money(ct) + ' − ' + money(dish) + ' − ' + money(ch) + ' = ' + money(right) + '. The dishonoured cheque is credited (money out), and the unpresented cheques are left for the reconciliation statement.');
    } },
    { skill: 'updated balance', gen: function () {
      var open = rstep(900, 3500, 10), ct = rstep(150, 900, 5), intr = rint(6, 40), so = rstep(100, 500, 10), ch = rint(10, 50), bal = open + ct + intr - so - ch;
      return numq('A cash book (bank column) is updated: balance b/d ' + money(open) + ' (debit), credit transfer ' + money(ct) + ', interest received ' + money(intr) + ', standing order ' + money(so) + ', bank charges ' + money(ch) + '. After it is balanced, what total appears at the foot of each side? Give your answer in $.', open + ct + intr,
        'The debit side is larger: ' + money(open) + ' + ' + money(ct) + ' + ' + money(intr) + ' = ' + money(open + ct + intr) + '. The balance c/d of ' + money(bal) + ' goes on the credit side to make both sides equal.');
    } },
    { skill: 'updated balance', gen: function () {
      var open = rstep(2000, 6000, 10), ep = rstep(300, 1400, 5), intr = rint(8, 50), dish = rstep(100, 500, 5), s = pick(PEOPLE), c = pick(PEOPLE.filter(function (p) { return p !== s; }));
      var r = upd(open, [['interest received', intr]], [['transfer to ' + s, ep], ['dishonoured cheque, ' + c, dish]]);
      return numq('The cash book shows a debit balance of ' + money(open) + '. The bank statement shows three items not in the cash book: an electronic payment of ' + money(ep) + ' to ' + s + ', a supplier; interest received of ' + money(intr) + '; and a cheque from ' + c + ' of ' + money(dish) + ' returned unpaid. What is the updated balance? Give your answer in $.', r[0],
        r[1] + '. Payments out and the dishonoured cheque are credited; interest received is debited.');
    } },
    // ---- overdrafts ----
    { skill: 'overdrafts', gen: function () {
      var od = rstep(300, 2500, 10), so = rstep(100, 500, 10), ch = rint(15, 80), ct = rstep(150, 1800, 5), v = -od + ct - so - ch;
      if (v === 0) ct += 5, v += 5;
      return numq('A cash book (bank column) shows a CREDIT balance of ' + money(od) + '. Not yet recorded: a credit transfer from a customer of ' + money(ct) + ', a standing order of ' + money(so) + ' and overdraft charges of ' + money(ch) + '. What is the updated cash book balance?' + OD, v,
        'A credit balance is an overdraft, so start at −' + money(od) + '. −' + money(od) + ' + ' + money(ct) + ' − ' + money(so) + ' − ' + money(ch) + ' = ' + money(v) + (v < 0 ? ', still an overdraft (a credit balance).' : ', now money in the bank (a debit balance).'), { unit: '$' });
    } },
    { skill: 'overdrafts', gen: function () {
      var open = rstep(100, 500, 10), dd = rstep(open + 100, open + 900, 10), ch = rint(10, 60), v = open - dd - ch;
      return numq('The cash book shows money in the bank of ' + money(open) + '. The bank statement shows a direct debit of ' + money(dd) + ' and bank charges of ' + money(ch) + ', neither in the cash book. What is the updated cash book balance?' + OD, v,
        money(open) + ' − ' + money(dd) + ' − ' + money(ch) + ' = ' + money(v) + '. The account is now overdrawn, so the updated balance is brought down on the credit side.');
    } },
    { skill: 'overdrafts', gen: function () {
      var a = rstep(150, 1500, 10), m = pick(MONTHS);
      return mcq('The cash book (bank column) shows a credit balance of ' + money(a) + ' on ' + m[1] + '. How is this entered when the cash book is updated, and what does it mean?',
        ['Credit side as Balance b/d: the business is overdrawn', 'Debit side as Balance b/d: the business has money in the bank', 'Credit side as Balance b/d: the business has money in the bank', 'Debit side as Balance c/d: the business is overdrawn'],
        'In the cash book, a credit balance means more has been paid out than received, so the account is overdrawn by ' + money(a) + '. It stays on the credit side as Balance b/d.');
    } },
    cbSide('overdrafts', 'interest charged by the bank on an overdraft', 'Credit side', 'Overdraft interest is taken by the bank, so it is a payment and goes on the credit side, increasing the overdraft.'),
    // ---- errors in the cash book ----
    { skill: 'cash book errors', gen: function () {
      var t = transposed(), up = Math.random() < 0.5, c = up ? t[0] : t[1], w = up ? t[1] : t[0], d = Math.abs(c - w), s = pick(PEOPLE);
      var right = (c > w ? 'Credit side, ' : 'Debit side, ') + money(d), wrong = (c > w ? 'Debit side, ' : 'Credit side, ') + money(d);
      return mcq('A cheque for ' + money(c) + ' paid to ' + s + ' was entered in the cash book as ' + money(w) + '. The bank statement shows ' + money(c) + '. How is the cash book corrected?',
        [right, wrong, (c > w ? 'Credit side, ' : 'Debit side, ') + money(c), 'No entry: list it in the reconciliation statement'],
        (c > w ? 'The payment was understated by ' : 'The payment was overstated by ') + money(Math.max(c, w)) + ' − ' + money(Math.min(c, w)) + ' = ' + money(d) + '. ' + (c > w ? 'More must be shown as paid out, so credit ' : 'Some of the payment must be cancelled, so debit ') + money(d) + '.');
    } },
    { skill: 'cash book errors', gen: function () {
      var t = transposed(), c = Math.max(t[0], t[1]), w = Math.min(t[0], t[1]), open = rstep(800, 4000, 10), ch = rint(12, 55), cu = pick(PEOPLE);
      var v = open + (c - w) - ch;
      return numq('The cash book shows a debit balance of ' + money(open) + '. A cheque received from ' + cu + ' for ' + money(c) + ' was entered in the cash book as ' + money(w) + ', and bank charges of ' + money(ch) + ' have not been entered. What is the updated cash book balance? Give your answer in $.', v,
        'The receipt was understated by ' + money(c) + ' − ' + money(w) + ' = ' + money(c - w) + ', so debit that difference. ' + money(open) + ' + ' + money(c - w) + ' − ' + money(ch) + ' = ' + money(v) + '.');
    } },
    { skill: 'cash book errors', gen: function () {
      var t = transposed(), c = Math.min(t[0], t[1]), w = Math.max(t[0], t[1]), open = rstep(800, 4000, 10), so = rstep(100, 600, 10);
      var v = open + (w - c) - so;
      return numq('The cash book shows a debit balance of ' + money(open) + '. A payment for repairs of ' + money(c) + ' was entered in the cash book as ' + money(w) + ', and a standing order of ' + money(so) + ' is on the bank statement only. What is the updated cash book balance? Give your answer in $.', v,
        'Too much was credited: ' + money(w) + ' − ' + money(c) + ' = ' + money(w - c) + ', so debit that difference back. ' + money(open) + ' + ' + money(w - c) + ' − ' + money(so) + ' = ' + money(v) + '.');
    } },
    { skill: 'cash book errors', gen: function () {
      var a = rstep(200, 1500, 10);
      return mcq('Cash takings of ' + money(a) + ' paid into the bank were entered on the credit side of the cash book (bank column) by mistake. How is the cash book corrected?',
        ['Debit side, ' + money(2 * a), 'Debit side, ' + money(a), 'Credit side, ' + money(2 * a), 'No entry: list it as an outstanding lodgement'],
        'The cash book shows ' + money(a) + ' going out instead of coming in. Debiting 2 × ' + money(a) + ' = ' + money(2 * a) + ' cancels the wrong payment and records the receipt.');
    } },
    { skill: 'cash book errors', gen: function () {
      var t = transposed(), c = Math.max(t[0], t[1]), w = Math.min(t[0], t[1]), open = rstep(900, 4000, 10), ct = rstep(150, 900, 5);
      var v = open + ct - (c - w);
      return numq('The cash book shows a debit balance of ' + money(open) + '. Wages of ' + money(c) + ' were paid but entered in the cash book as ' + money(w) + '. A credit transfer from a customer of ' + money(ct) + ' appears only on the bank statement. What is the updated cash book balance? Give your answer in $.', v,
        'Wages paid were understated by ' + money(c) + ' − ' + money(w) + ' = ' + money(c - w) + ', so credit that difference. ' + money(open) + ' + ' + money(ct) + ' − ' + money(c - w) + ' = ' + money(v) + '.');
    } }
  ] };

  // ======================================================================
  // ACC-CTL-13 Preparing a bank reconciliation statement
  // ======================================================================
  B['ACC-CTL-13'] = { title: 'Preparing a bank reconciliation statement', items: [
    // ---- starting from the cash book ----
    { skill: 'from the cash book', gen: function () {
      var m = pick(MONTHS), x = rstep(800, 4500, 1), u1 = rstep(60, 700, 1), u2 = rstep(60, 700, 1), l = rstep(150, Math.min(x, 1500), 5), y = x + u1 + u2 - l;
      return numq('After updating, the cash book shows a debit balance of ' + money(x) + ' on ' + m[0] + '. Two cheques, for ' + money(u1) + ' and ' + money(u2) + ', have not yet been presented, and a lodgement of ' + money(l) + ' has not yet been credited by the bank. Prepare a bank reconciliation statement. What is the balance per bank statement? Give your answer in $.', y,
        'Start from the updated cash book: ' + money(x) + ' + ' + money(u1 + u2) + ' (unpresented cheques) − ' + money(l) + ' (outstanding lodgement) = ' + money(y) + '.');
    } },
    { skill: 'from the cash book', gen: function () {
      var u = rstep(150, 900, 5), l = rstep(150, 900, 5), x = rstep(u + l + 300, u + l + 4000, 1), y = x + u - l;
      return mcq('The updated cash book balance is ' + money(x) + ' (debit). Unpresented cheques total ' + money(u) + ' and outstanding lodgements total ' + money(l) + '. What should the bank statement show?',
        moneyOpts(y, [x - u + l, x + u + l, x - u - l], 5),
        money(x) + ' + ' + money(u) + ' − ' + money(l) + ' = ' + money(y) + '. Unpresented cheques are added (the bank has not taken them out yet) and lodgements are deducted (the bank has not added them yet).');
    } },
    { skill: 'from the cash book', gen: function () {
      var x = rstep(1000, 3500, 1), l = rstep(150, 800, 5), u = rstep(100, 900, 1), y = x + u - l;
      return numq('A trader’s updated cash book shows ' + money(x) + ' in the bank. The bank statement shows a credit balance of ' + money(y) + '. The only other difference is an outstanding lodgement of ' + money(l) + '. What is the total of the unpresented cheques? Give your answer in $.', u,
        'Cash book + unpresented cheques − lodgement = bank statement, so unpresented cheques = ' + money(y) + ' − ' + money(x) + ' + ' + money(l) + ' = ' + money(u) + '.');
    } },
    { skill: 'from the cash book', gen: function () {
      var m = pick(MONTHS), x = rstep(1500, 6000, 1), u = [rstep(40, 500, 1), rstep(40, 500, 1), rstep(40, 500, 1)], l = [rstep(100, 700, 5), rstep(100, 700, 5)];
      var su = sumList(u), sl = sumList(l), y = x + su - sl, n = rint(301, 880);
      return numq('On ' + m[0] + ' the updated cash book shows a debit balance of ' + money(x) + '. Cheques no. ' + n + ' (' + money(u[0]) + '), no. ' + (n + 1) + ' (' + money(u[1]) + ') and no. ' + (n + 2) + ' (' + money(u[2]) + ') are unpresented. Lodgements of ' + money(l[0]) + ' and ' + money(l[1]) + ' are not yet on the bank statement. What is the balance per bank statement? Give your answer in $.', y,
        'Unpresented cheques: ' + plus(u) + ' = ' + money(su) + '. Lodgements: ' + plus(l) + ' = ' + money(sl) + '. ' + money(x) + ' + ' + money(su) + ' − ' + money(sl) + ' = ' + money(y) + '.');
    } },
    { skill: 'from the cash book', q: 'A bank reconciliation statement has been prepared correctly, starting from the updated cash book balance. What must its final figure equal?',
      kind: 'mcq', options: ['The balance shown on the bank statement at the same date', 'The original cash book balance before any updating was done', 'The total of the unpresented cheques', 'Zero, because the differences cancel out'], answer: 0,
      why: 'The statement explains the gap between the two records, so working from the cash book through the timing differences must arrive at the bank statement balance. If it does not, an item has been missed.' },
    // ---- starting from the bank statement ----
    { skill: 'from the bank statement', gen: function () {
      var y = rstep(800, 5000, 1), u = rstep(100, 900, 1), l = rstep(100, 900, 5), x = y - u + l;
      while (x <= 0) { y += 500; x += 500; }
      return numq('A bank statement shows a credit balance of ' + money(y) + '. Unpresented cheques total ' + money(u) + ' and an outstanding lodgement is ' + money(l) + '. Starting from the bank statement, what is the updated cash book balance? Give your answer in $.', x,
        'From the bank statement the signs reverse: ' + money(y) + ' − ' + money(u) + ' (unpresented cheques) + ' + money(l) + ' (lodgement) = ' + money(x) + '.');
    } },
    { skill: 'from the bank statement', q: 'A reconciliation starts from the bank statement balance and works back to the cash book. How are unpresented cheques treated?',
      kind: 'mcq', options: ['Deducted', 'Added', 'Ignored', 'Doubled'], answer: 0,
      why: 'The bank has not yet paid the cheques, so its balance is too high compared with the cash book. Starting from the bank, they are deducted.' },
    { skill: 'from the bank statement', gen: function () {
      var y = rstep(1500, 6000, 1), u = [rstep(50, 600, 1), rstep(50, 600, 1)], l = [rstep(100, 800, 5), rstep(100, 800, 5)], x = y - sumList(u) + sumList(l);
      return numq('The bank statement shows ' + money(y) + ' in hand. Two cheques (' + money(u[0]) + ' and ' + money(u[1]) + ') are unpresented and two lodgements (' + money(l[0]) + ' and ' + money(l[1]) + ') are not yet credited. Working from the bank statement, what should the updated cash book balance be? Give your answer in $.', x,
        'From the bank statement the signs reverse: ' + money(y) + ' − ' + money(sumList(u)) + ' (unpresented cheques) + ' + money(sumList(l)) + ' (lodgements) = ' + money(x) + '.');
    } },
    // ---- overdrafts ----
    { skill: 'overdrafts', gen: function () {
      var x = rstep(300, 2500, 1), u = rstep(100, 1200, 1), l = rstep(100, 900, 5), y = -x + u - l;
      if (y === 0) { u += 7; y += 7; }
      return numq('After updating, the cash book shows an overdraft of ' + money(x) + ' (a credit balance). Unpresented cheques total ' + money(u) + ' and an outstanding lodgement is ' + money(l) + '. What is the balance per bank statement?' + OD, y,
        'Start at −' + money(x) + ', add the unpresented cheques and deduct the lodgement: −' + money(x) + ' + ' + money(u) + ' − ' + money(l) + ' = ' + money(y) + (y < 0 ? ', an overdraft on the bank statement.' : ', money in the bank on the bank statement.'));
    } },
    { skill: 'overdrafts', gen: function () {
      var y = rstep(300, 2500, 1), u = rstep(100, 900, 1), l = rstep(100, 900, 5), x = -y - u + l;
      if (x === 0) { l += 5; x += 5; }
      return numq('A bank statement shows an overdraft of ' + money(y) + '. Unpresented cheques total ' + money(u) + ' and an outstanding lodgement is ' + money(l) + '. Working from the bank statement, what is the updated cash book balance?' + OD, x,
        '−' + money(y) + ' − ' + money(u) + ' (unpresented cheques) + ' + money(l) + ' (lodgement) = ' + money(x) + '.');
    } },
    { skill: 'overdrafts', gen: function () {
      var x = rstep(1200, 3000, 1), u = rstep(100, 800, 1), l = rstep(100, 600, 5), y = -x + u - l, wrong = -x - u + l;
      return mcq('The updated cash book shows an overdraft of ' + money(x) + '. Unpresented cheques are ' + money(u) + ' and an outstanding lodgement is ' + money(l) + '. What does the bank statement show?',
        uniq('An overdraft of ' + money(-y), ['An overdraft of ' + money(-wrong), 'A balance in hand of ' + money(-y), 'An overdraft of ' + money(x + u + l)], 4, ['A balance in hand of ' + money(x + u + l)]),
        '−' + money(x) + ' + ' + money(u) + ' − ' + money(l) + ' = −' + money(-y) + ', so the bank statement shows an overdraft (a debit balance) of ' + money(-y) + '.');
    } },
    { skill: 'items and direction', gen: function () {
      var x = rstep(600, 3000, 1), u = rstep(100, 700, 1), l = rstep(100, 700, 5), shown = x + u + l, right = x + u - l;
      var tbl = list('Bank reconciliation statement (draft)', [['Balance per updated cash book', x], ['Add: unpresented cheques', u], ['Add: outstanding lodgement', l], ['Balance per bank statement', shown]]);
      return mcq('A trainee prepared this draft.' + tbl + 'What is wrong with it?',
        ['The outstanding lodgement should be deducted, not added', 'The unpresented cheques should be deducted, not added', 'It should start from the original cash book balance', 'Nothing: the statement is correct'],
        'Starting from the cash book, a lodgement the bank has not yet recorded must be deducted. The correct bank balance is ' + money(x) + ' + ' + money(u) + ' − ' + money(l) + ' = ' + money(right) + ', not ' + money(shown) + '.');
    } },
    // ---- updating first ----
    { skill: 'update first', gen: function () {
      var x = rstep(1800, 5000, 1), s = rstep(100, 600, 10), c = rint(10, 60), u = rstep(100, 900, 1), l = rstep(150, 900, 5), cb = x - s - c, y = cb + u - l;
      return numq('A cash book shows a debit balance of ' + money(x) + '. The bank statement shows a standing order of ' + money(s) + ' and bank charges of ' + money(c) + ' not yet in the cash book. Unpresented cheques total ' + money(u) + ' and an outstanding lodgement is ' + money(l) + '. Update the cash book, then reconcile. What is the balance per bank statement? Give your answer in $.', y,
        'Updated cash book: ' + money(x) + ' − ' + money(s) + ' − ' + money(c) + ' = ' + money(cb) + '. Then ' + money(cb) + ' + ' + money(u) + ' − ' + money(l) + ' = ' + money(y) + '.');
    } },
    { skill: 'update first', gen: function () {
      var x = rstep(1200, 5000, 1), t = rstep(150, 900, 5), d = rstep(80, 500, 5), u = rstep(100, 900, 1), l = rstep(150, 900, 5), cb = x + t - d, y = cb + u - l;
      return numq('A cash book shows ' + money(x) + ' in the bank. The bank statement shows a credit transfer from a customer of ' + money(t) + ' and a dishonoured cheque of ' + money(d) + ', neither in the cash book. There are unpresented cheques of ' + money(u) + ' and an outstanding lodgement of ' + money(l) + '. What balance does the bank statement show? Give your answer in $.', y,
        'Update first: ' + money(x) + ' + ' + money(t) + ' − ' + money(d) + ' = ' + money(cb) + '. Reconcile: ' + money(cb) + ' + ' + money(u) + ' − ' + money(l) + ' = ' + money(y) + '.');
    } },
    { skill: 'update first', q: 'From which figure should a bank reconciliation statement start when the cash book side is used?',
      kind: 'mcq', options: ['The updated cash book balance', 'The cash book balance before updating', 'The total of the cash book debit side', 'The opening balance for the month'], answer: 0,
      why: 'Bank-only items such as charges and standing orders are entered in the cash book first. Only timing differences remain to be shown in the statement.' },
    { skill: 'update first', gen: function () {
      var t = transposed(), c = Math.max(t[0], t[1]), w = Math.min(t[0], t[1]), x = rstep(1500, 5000, 1), u = rstep(100, 800, 1), l = rstep(150, 800, 5), cb = x - (c - w), y = cb + u - l;
      return numq('The cash book shows a debit balance of ' + money(x) + '. A cheque paid for advertising of ' + money(c) + ' had been entered as ' + money(w) + '. Unpresented cheques total ' + money(u) + ' and an outstanding lodgement is ' + money(l) + '. After correcting the cash book, what is the balance per bank statement? Give your answer in $.', y,
        'Correct the payment by ' + money(c) + ' − ' + money(w) + ' = ' + money(c - w) + ' (credit), so the cash book becomes ' + money(cb) + '. Then ' + money(cb) + ' + ' + money(u) + ' − ' + money(l) + ' = ' + money(y) + '.');
    } },
    { skill: 'update first', gen: function () {
      var x = rstep(1500, 5000, 1), d = rstep(60, 400, 5), u = rstep(100, 800, 1), l = rstep(150, 800, 5), z = x + u - l;
      return mcq('A student started a reconciliation from the cash book balance of ' + money(x) + ', added unpresented cheques of ' + money(u) + ' and deducted a lodgement of ' + money(l) + ', getting ' + money(z) + '. The student forgot a direct debit of ' + money(d) + ' that was not yet in the cash book. What is the correct balance per bank statement?',
        moneyOpts(z - d, [z, z + d, z - 2 * d], 5),
        'The direct debit must first reduce the cash book to ' + money(x - d) + '. Every later figure is the same, so the answer falls by ' + money(d) + ': ' + money(z) + ' − ' + money(d) + ' = ' + money(z - d) + '.');
    } },
    // ---- which items and which way ----
    { skill: 'items and direction', q: 'Starting from the updated cash book balance, how are outstanding lodgements treated in a bank reconciliation statement?',
      kind: 'mcq', options: ['Deducted', 'Added', 'Left out', 'Entered in the cash book'], answer: 0,
      why: 'The cash book already includes the lodgement but the bank has not, so the bank balance is lower. Starting from the cash book, the lodgement is deducted to reach the bank figure.' },
    { skill: 'items and direction', kind: 'multi', q: 'Select every item that appears in a bank reconciliation statement prepared from the updated cash book.',
      options: ['Unpresented cheques', 'Outstanding lodgements', 'Bank charges', 'A standing order for rent', 'A credit transfer from a customer', 'A dishonoured cheque'],
      answers: [0, 1],
      why: 'Only timing differences go in the statement. Charges, standing orders, credit transfers and dishonoured cheques are entered in the cash book when it is updated.' },
    { skill: 'items and direction', q: 'Starting from the cash book, why are unpresented cheques ADDED in a bank reconciliation statement?',
      kind: 'mcq', options: ['The bank has not yet taken the money out, so its balance is higher', 'The cheques have been dishonoured and so the money is returned to the business', 'The business has not yet recorded the cheques in its cash book', 'Unpresented cheques are a type of receipt from customers'], answer: 0,
      why: 'The cash book has already deducted these cheques, but the bank has not, so the bank statement shows more money. Adding them back moves from the cash book figure to the bank figure.' },
    { skill: 'items and direction', q: 'Why is a standing order shown on the bank statement NOT listed in the bank reconciliation statement?',
      kind: 'mcq', options: ['It is entered in the cash book first, when the cash book is updated', 'Standing orders never appear on bank statements', 'It is a timing difference that will clear itself when next month’s statement arrives', 'It is listed only if it is larger than the bank charges'], answer: 0,
      why: 'A standing order is a real payment the business has not yet recorded. It is put in the cash book during updating, so it is no longer a difference to explain.' },
    { skill: 'items and direction', q: 'Which label should appear against the final figure of a bank reconciliation statement that starts from the updated cash book?',
      kind: 'mcq', options: ['Balance per bank statement', 'Balance per cash book', 'Total unpresented cheques', 'Balance c/d'], answer: 0,
      why: 'Working from the cash book through the timing differences ends at the bank’s figure, so the last line is labelled “Balance per bank statement”. Every figure needs a label to earn the mark.' }
  ] };
})();
