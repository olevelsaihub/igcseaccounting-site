/* Group G04 mastery bank: Irrecoverable debts; Accruals and prepayments; Concepts and technology in practice. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function comma(n) {
    var neg = n < 0, s = String(Math.round(Math.abs(n)));
    return (neg ? '-' : '') + s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function money(n) { return '$' + comma(n); }
  function fmt2(n) { if (n % 1 === 0) return comma(n); var t = n.toFixed(2).split('.'); return comma(+t[0]) + '.' + t[1]; }
  function mcq(q, correct, wrongs, why) {
    var seen = {}, opts = [correct];
    seen[String(correct).toLowerCase()] = 1;
    wrongs.forEach(function (w) { var k = String(w).toLowerCase(); if (!seen[k] && opts.length < 5) { seen[k] = 1; opts.push(w); } });
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  // Money options: the correct value plus distinct positive distractors (filled if any collide).
  function mcqMoney(q, ans, cands, why) {
    var vals = [], seen = {}; seen[ans] = 1;
    cands.forEach(function (c) { c = Math.round(c); if (c > 0 && !seen[c] && vals.length < 3) { seen[c] = 1; vals.push(c); } });
    var step = Math.max(10, Math.round(ans / 10 / 10) * 10), k = 1;
    while (vals.length < 3) { var v = ans + (k % 2 ? 1 : -1) * step * Math.ceil(k / 2); if (v > 0 && !seen[v]) { seen[v] = 1; vals.push(v); } k++; }
    return { kind: 'mcq', q: q, options: [money(ans)].concat(vals.map(money)), answer: 0, why: why };
  }
  function numQ(q, ans, why) { return { kind: 'num', q: q, answer: ans, unit: '$', display: comma(ans), why: why }; }

  var TRADERS = ['Amara Okafor', 'Bilal Haider', 'Carmen Ruiz', 'Dev Patel', 'Elif Yilmaz', 'Femi Adeyemi', 'Grace Tan', 'Hassan Karimi', 'Isla Fraser', 'Jonas Weber', 'Kavya Rao', 'Luca Romano', 'Maya Cohen', 'Nikhil Bose', 'Olga Petrova', 'Pablo Navarro', 'Qasim Iqbal', 'Rosa Lindqvist', 'Samir Aziz', 'Tara Quinn'];
  var CUSTOMERS = ['Harbour Traders', 'Pinewood Stores', 'Kestrel Supplies', 'Sunfield Ltd', 'Marigold Crafts', 'Oakridge Garage', 'Bluebell Bakery', 'Northgate Motors', 'Coral Bay Cafe', 'Redstone Builders', 'Willow Lane Florists', 'Tidewater Ltd'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function lastDay(m, y) { return [31, (y % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]; }
  // A financial year: end month index and the calendar year it ends in.
  function fy() {
    var e = pick([11, 2, 5, 8, 4, 9]), y = e === 11 ? 2025 : pick([2025, 2026]);
    var sm = (e + 1) % 12, sy = e === 11 ? y : y - 1, nm = sm, ny = e === 11 ? y + 1 : y;
    return {
      e: e, y: y,
      end: lastDay(e, y) + ' ' + MONTHS[e] + ' ' + y,
      start: '1 ' + MONTHS[sm] + ' ' + sy,
      next: '1 ' + MONTHS[nm] + ' ' + ny,
      endShort: lastDay(e, y) + ' ' + MONTHS[e].slice(0, 3) + ' ' + y,
      startShort: '1 ' + MONTHS[sm].slice(0, 3) + ' ' + sy,
      nextShort: '1 ' + MONTHS[nm].slice(0, 3) + ' ' + ny
    };
  }
  // A T-account as an mc-table. dr and cr are arrays of [date, details, amount]; amount may be a string such as '?'.
  // afterDr / afterCr are rows shown below the totals (balances brought down on the first day of the next year).
  function tAcc(title, dr, cr, totals, afterDr, afterCr) {
    var rows = '';
    function cell(v) { return v === '' || v == null ? '' : (typeof v === 'number' ? comma(v) : v); }
    function add(D, C) {
      for (var i = 0, n = Math.max(D.length, C.length); i < n; i++) {
        var d = D[i] || ['', '', ''], c = C[i] || ['', '', ''];
        rows += '<tr><td>' + d[0] + '</td><td>' + d[1] + '</td><td>' + cell(d[2]) + '</td><td>' + c[0] + '</td><td>' + c[1] + '</td><td>' + cell(c[2]) + '</td></tr>';
      }
    }
    add(dr, cr);
    if (totals) rows += '<tr><td></td><td></td><td><b>' + cell(totals[0]) + '</b></td><td></td><td></td><td><b>' + cell(totals[1]) + '</b></td></tr>';
    add(afterDr || [], afterCr || []);
    return '<br><b>' + title + '</b><table class="mc-table"><tr><th colspan="3">Debit</th><th colspan="3">Credit</th></tr><tr><th>Date</th><th>Details</th><th>$</th><th>Date</th><th>Details</th><th>$</th></tr>' + rows + '</table>';
  }
  function journal(date, lines) {
    return '<table class="mc-table"><tr><th>Date</th><th>Account</th><th>Debit $</th><th>Credit $</th></tr>' + lines.map(function (l, i) {
      return '<tr><td>' + (i === 0 ? date : '') + '</td><td>' + l[0] + '</td><td>' + (l[1] ? comma(l[1]) : '') + '</td><td>' + (l[2] ? comma(l[2]) : '') + '</td></tr>';
    }).join('') + '</table>';
  }
  // Provision data: net receivables (after write-off) give a whole-dollar provision that differs from the opening one.
  function provData(dir) {
    var rate = pick([2, 3, 4, 5]), net = rint(90, 650) * 100, P = net / 100 * rate;
    var up = dir === 'up' ? true : dir === 'down' ? false : Math.random() < 0.5;
    var delta = rint(3, 45) * 10;
    while (delta === P || 2 * delta === P) delta = rint(3, 45) * 10;  // keep the change distinct from both provisions
    var O = up ? P - delta : P + delta;
    if (O <= 0) { O = P + delta; up = false; }
    var W = rint(12, 190) * 10 + pick([0, 5]);
    return { rate: rate, net: net, P: P, O: O, W: W, gross: net + W, up: up, ch: Math.abs(P - O) };
  }

  var IDE = 'Irrecoverable debts', TRLC = 'Trade receivables ledger control', PID = 'Provision for irrecoverable debts', IS = 'Income statement';
  function dc(d, c) { return 'Debit ' + d + '; credit ' + c; }

  // =====================================================================
  B['ACC-ADJ-07'] = {
    title: 'Irrecoverable debts and the provision for irrecoverable debts: why and how they differ',
    items: [
      { skill: 'distinguish', kind: 'mcq', q: 'Which statement best describes an <b>irrecoverable debt</b>?',
        options: ['A debt owed by a named customer that will never be paid', 'An estimate of the amount that customers in general may fail to pay', 'An amount of cash kept in the bank in case some customers do not pay', 'A debt from a customer who paid late but has now paid in full'],
        answer: 0, why: 'An irrecoverable debt is a known loss: one particular customer cannot or will not pay, so the debt is written off. The estimate for customers in general is the provision.' },
      { skill: 'distinguish', kind: 'mcq', q: 'Which statement best describes a <b>provision for irrecoverable debts</b>?',
        options: ['An estimate of trade receivables that may not be paid, with no customer named', 'The total of debts from named customers written off during this year', 'Money placed in a separate bank account to cover customers who do not pay', 'The amount that a customer still owes after paying only part of the debt it owed'],
        answer: 0, why: 'A provision is a best guess (often a % of trade receivables) of possible losses. No particular customer is named and no cash is set aside.' },
      { skill: 'distinguish', kind: 'multi', q: 'Kezia Mensah sells on credit. Which of these statements describe a <b>provision</b> for irrecoverable debts rather than an irrecoverable debt?',
        options: ['It is an estimate of a possible loss', 'It is often calculated as a percentage of trade receivables', 'It relates to one named customer who cannot pay', 'It is removed from that customer\'s account in the sales ledger', 'It is held as cash so the business can cover the loss'],
        answers: [0, 1], why: 'The provision is an estimate, usually a % of trade receivables. A named customer whose account is cleared describes a written-off debt, and a provision is never cash.' },
      { skill: 'distinguish', kind: 'mcq', q: 'How does the treatment of a written-off debt differ from the treatment of a provision for irrecoverable debts?',
        options: ['The written-off debt is cleared from the customer\'s account; a provision leaves customer accounts unchanged', 'The written-off debt is a current liability; the provision is a current asset', 'Both are cleared from the individual customers\' accounts in the sales ledger', 'The provision is cleared from each customer\'s account, but the written-off debt stays in that customer\'s account'],
        answer: 0, why: 'Writing off a debt removes that customer\'s balance. A provision is a general estimate, so no customer account is touched; it is simply deducted from total trade receivables.' },
      { skill: 'distinguish', kind: 'mcq', q: 'Hugo Varga says: "My provision for irrecoverable debts of $900 means I have $900 put aside in the bank in case customers don\'t pay." Why is Hugo wrong?',
        options: ['The provision is a book entry estimating a loss; no cash is set aside', 'The provision is kept as cash in the till, not in the bank account', 'The provision is a liability that must eventually be paid to the customers concerned', 'The $900 is the total of the debts already written off this year'],
        answer: 0, why: 'A provision is only an accounting estimate that reduces profit and the value of trade receivables. It does not move any money into a bank account.' },
      { skill: 'distinguish', kind: 'mcq', q: 'Which event should lead a business to <b>write off</b> a debt rather than adjust its provision?',
        options: ['A customer company has closed and its liquidator confirms nothing will be paid', 'The owner expects about 3% of next year\'s credit customers may not pay', 'Several customers are paying more slowly than they did last year', 'The economy is weak, so customers in general may struggle to pay'],
        answer: 0, why: 'A write-off is for a specific debt that is certain to be lost. The other events are general risks, which are allowed for by a provision.' },
      { skill: 'prudence', kind: 'mcq', q: 'Which explanation shows why the <b>prudence</b> concept requires a provision for irrecoverable debts?',
        options: ['Without it, trade receivables and profit could be shown at more than they are really worth', 'It makes sure that the same percentage is used every year so results compare', 'It matches the cost of debts with the cash received from customers in the year', 'It keeps the owner\'s private debts separate from the debts owed to and by the business itself'],
        answer: 0, why: 'Prudence means assets and profit must not be overstated. Some receivables will probably not be collected, so a provision reduces them (and profit) to a realistic figure.' },
      { skill: 'prudence', kind: 'mcq', q: 'Javier Ortega has trade receivables of $40,000. He has never made a provision, although some customers are known to pay very late and a few never pay. What does the prudence concept suggest?',
        options: ['He should create a provision so his current assets are not overstated', 'He should write off the whole $40,000 as irrecoverable debts now', 'He should make no entry until a customer actually fails to pay', 'He should increase profit to reflect the debts he expects to collect'],
        answer: 0, why: 'Prudence says allow for likely losses. Writing off all $40,000 goes too far, because most customers will pay; a provision gives a realistic value.' },
      { skill: 'prudence', kind: 'mcq', q: 'Which sentence would earn <b>both</b> marks for explaining why prudence applies to a provision for irrecoverable debts?',
        options: ['Prudence avoids overstating assets, so receivables are reduced by the amount that may not be collected', 'Prudence is an accounting concept that every business selling goods on credit must use', 'Prudence means a business should be careful before it decides to give credit', 'Prudence means that the provision must always stay at exactly the same percentage as in the previous year'],
        answer: 0, why: 'One mark is for what prudence requires (do not overstate assets or profit) and one is for applying it (receivables reduced by the likely loss). The other sentences do neither.' },
      { skill: 'prudence', kind: 'mcq', q: 'In an "Explain" answer a student writes only: "Because of the prudence concept." Why does this earn just 1 mark out of 3?',
        options: ['It names the concept but does not say that profit and receivables would otherwise be overstated', 'It names the wrong concept, because only the accruals concept applies to provisions for irrecoverable debts', 'It should have said that the provision is money kept back to pay the customers', 'It should have named the customers who are not expected to pay their debts'],
        answer: 0, why: 'Development marks come from applying the concept: without a provision, trade receivables and profit for the year would be shown at more than they are worth.' },
      { skill: 'accruals', kind: 'mcq', q: 'How does the <b>accruals (matching)</b> concept support making a provision for irrecoverable debts?',
        options: ['The expected loss is charged in the same year as the credit sales that caused it', 'The loss is recorded only in the year when the customer finally fails to pay', 'Debts are recorded only when cash is received from the customer', 'The provision stays at the same rate each year so that the results of different years can be compared'],
        answer: 0, why: 'Matching puts expenses in the same period as the income they relate to. Likely losses on this year\'s credit sales therefore belong in this year\'s income statement.' },
      { skill: 'accruals', kind: 'mcq', q: 'Ngozi Bello made large credit sales in 2025. She expects some of these customers will not pay, but she will not know which ones until 2026. Why should she create a provision at the end of 2025?',
        options: ['So the likely loss reduces 2025 profit, the year in which the sales were made', 'So the loss reduces 2026 profit, the year when the bad debts are known', 'So the 2025 bank balance shows the cash that is going to be lost', 'So the customers can be removed from the sales ledger during 2025'],
        answer: 0, why: 'Under the accruals concept the expected loss is matched with the 2025 sales that created the debts, so 2025 profit is not overstated.' },
      { skill: 'accruals', kind: 'mcq', q: 'A student writes: "A provision for irrecoverable debts applies the matching concept." Which sentence is the best <b>development</b> of this point?',
        options: ['The likely loss on this year\'s credit sales is charged as an expense in this year', 'The provision is matched with the cash held in the bank at the year end', 'The loss is charged in the year when a customer finally refuses to pay', 'The same rate of provision is used every year so results can be compared'],
        answer: 0, why: 'Matching puts the expected loss in the same year as the credit sales that created the debts. Using the same rate each year is consistency, and a provision has nothing to do with cash.' },
      { skill: 'accruals', kind: 'mcq', q: 'If no provision is made, when is the cost of a debt that later turns bad usually recorded?',
        options: ['In a later year when the debt is written off, not the year of the sale', 'In the year of the sale, exactly as the accruals concept requires', 'Never, because no cash ever leaves the business when a customer fails to pay a debt', 'In the year that the customer first bought goods for cash'],
        answer: 0, why: 'Without a provision the loss only appears when the debt is written off, often the next year, so the cost is not matched with the sale. A provision fixes this.' },
      { skill: 'effects', kind: 'mcq', q: 'Ahmed Rasul did not write off a debt of $650 from a customer who has disappeared and cannot be traced. What is the effect on his financial statements?',
        options: ['Profit for the year and trade receivables are both overstated by $650', 'Profit for the year and trade receivables are both understated by $650', 'Profit is overstated by $650 but trade receivables are correct', 'Only the bank balance is overstated, by $650'],
        answer: 0, why: 'The write-off would be an expense of $650 and would remove $650 from trade receivables. Leaving it out keeps both figures $650 too high.' },
      { skill: 'effects', kind: 'mcq', q: 'Creating a provision for irrecoverable debts for the first time will:',
        options: ['reduce profit for the year and reduce the net trade receivables shown', 'reduce profit for the year and increase current liabilities', 'increase profit for the year and reduce the net trade receivables shown', 'have no effect on profit but reduce the trade receivables shown'],
        answer: 0, why: 'The new provision is an expense, so profit falls. It is deducted from trade receivables in the statement of financial position; it is not a liability.' },
      { skill: 'effects', kind: 'multi', q: 'Which of the following are results of creating a provision for irrecoverable debts?',
        options: ['Profit for the year is reduced', 'Trade receivables are shown at a more realistic value', 'The bank balance is reduced', 'Individual customer accounts are reduced', 'Closing inventory is reduced'],
        answers: [0, 1], why: 'The provision is an expense (lower profit) and is deducted from trade receivables. It involves no cash and does not touch customer accounts or inventory.' },
      { skill: 'effects', kind: 'mcq', q: 'Why might a bank considering a loan to a trader prefer the trader to keep a provision for irrecoverable debts?',
        options: ['The current assets shown give a more realistic view of what will be collected', 'The provision guarantees that all customers will pay their debts in full', 'The provision increases the cash available to repay the loan', 'The provision raises the profit for the year shown to the bank'],
        answer: 0, why: 'A provision stops trade receivables being overstated, so the bank sees a cautious, realistic value of what the trader is likely to collect.' },
      { skill: 'effects', kind: 'multi', q: 'A business ignores debts that it knows are likely to be lost. Which of the following will be true of its financial statements?',
        options: ['Profit for the year is overstated', 'Current assets are overstated', 'Current liabilities are overstated', 'Drawings are understated', 'The bank balance is overstated'],
        answers: [0, 1], why: 'The missing expense makes profit too high, and trade receivables (a current asset) include amounts that will not be collected. Liabilities, drawings and bank are unaffected.' },
      { skill: 'judge-situation', kind: 'mcq', q: 'Selin Kaya\'s customer, Bluewave Ltd, has been declared bankrupt and will pay nothing towards its $2,300 debt. What should Selin do?',
        options: ['Write off the $2,300 as an irrecoverable debt', 'Increase her provision by $2,300 and keep the debt', 'Make no entry until Bluewave Ltd has closed down', 'Record the $2,300 as drawings by the owner'],
        answer: 0, why: 'The loss is certain and the customer is known, so the debt is written off (debit irrecoverable debts, credit the customer). A provision is only for uncertain, general losses.' },
      { skill: 'judge-situation', kind: 'mcq', q: 'Ravi Pillai has 120 credit customers. Experience shows that about 2% of the amount owed is never collected, but he cannot say which customers will fail to pay. What is the most suitable treatment?',
        options: ['Create a provision for irrecoverable debts of 2% of trade receivables', 'Write off 2% of every customer\'s balance in the sales ledger', 'Write off the debts of the two customers who owe the most', 'Take no action until a customer actually refuses to pay'],
        answer: 0, why: 'The loss is likely but no customer can be named, so an estimate (a provision) is right. Writing off needs a specific debt that is known to be lost.' },
      { skill: 'judge-situation', kind: 'mcq', q: 'Which situation calls for a provision for irrecoverable debts rather than a write-off?',
        options: ['A general risk that some of the year-end customers will not pay', 'A customer who has died leaving no money to pay the debt', 'A customer who has moved abroad and cannot be traced', 'A customer company that has closed with nothing left to pay'],
        answer: 0, why: 'Only the general risk is an estimate with no named customer. Each of the other cases is a specific debt that is known to be lost, so it is written off.' },
      { skill: 'judge-situation', kind: 'mcq', q: 'Tariq Mansur runs a juice bar where every sale is for cash. A friend advises him to create a provision for irrecoverable debts. What is the best advice?',
        options: ['He does not need one, because he has no trade receivables', 'He must create one, because prudence applies to every business', 'He should create one equal to 5% of his cash sales', 'He should create one equal to his cash in hand at the year end'],
        answer: 0, why: 'A provision reduces trade receivables to a realistic value. With only cash sales there are no customers owing money, so there is nothing to provide against.' },
      { skill: 'judge-situation', kind: 'mcq', q: 'Leah Moretti\'s credit customers are mostly long-standing firms that have always paid in full and on time. Which conclusion about a provision is best supported?',
        options: ['A low rate of provision is reasonable because the risk of non-payment is low', 'A very large provision is needed because prudence always requires the maximum', 'All of the debts should be written off now to be as prudent as possible', 'A provision is not allowed when customers are long-standing firms'],
        answer: 0, why: 'The provision should be a realistic estimate. Prudence means not overstating assets, not deliberately understating them, so a low rate suits a low risk.' }
    ]
  };

  // =====================================================================
  B['ACC-ADJ-09'] = {
    title: 'Double entry for irrecoverable debts and the provision',
    items: [
      { skill: 'write-off-entry', gen: function () {
        var t = pick(TRADERS), c = pick(CUSTOMERS), x = rint(25, 260) * 10, f = fy();
        return mcq(t + ' keeps a trade receivables ledger control account. On ' + f.end + ' the trader decided to write off ' + money(x) + ' owed by ' + c + ', which will never pay. Which double entry records this?',
          dc(IDE, TRLC), [dc(TRLC, IDE), dc(IDE, PID), dc(PID, TRLC)],
          'The irrecoverable debts account (an expense) is debited ' + money(x) + ' and trade receivables are reduced by crediting the control account ' + money(x) + '. The provision account is not used for a specific write-off.');
      } },
      { skill: 'write-off-entry', gen: function () {
        var t = pick(TRADERS), c = pick(CUSTOMERS), x = rint(18, 140) * 10;
        return mcq(t + ' keeps a separate account for each customer in the sales ledger. ' + c + ' owes ' + money(x) + ' and has stopped trading with nothing left to pay. Which double entry writes off the debt?',
          dc(IDE, c), [dc(c, IDE), dc(IDE, 'Sales'), dc('Sales returns', c)],
          'Debit the irrecoverable debts expense ' + money(x) + ' and credit ' + c + '\'s account ' + money(x) + ', which clears the balance the customer owed.');
      } },
      { skill: 'expense-transfer', kind: 'mcq', q: 'What type of account is the irrecoverable debts account, and where does its balance go at the year end?',
        options: ['An expense account; its balance is transferred to the income statement', 'A current asset; its balance is shown in the statement of financial position', 'A current liability; its balance is shown under other payables', 'An income account; its balance is added to gross profit'],
        answer: 0, why: 'Debts written off are a cost of selling on credit. The debit balance on irrecoverable debts is transferred to the income statement as an expense, reducing profit.' },
      { skill: 'journal-amount', gen: function () {
        var cs = CUSTOMERS.slice().sort(function () { return Math.random() - 0.5; }), c = cs[0], c2 = cs[1], x = rint(30, 240) * 10, y = rint(2, Math.floor(x / 20)) * 10, z = rint(15, 120) * 10, f = fy();
        return numQ('During the year ended ' + f.end + ' two debts were written off. ' + c + ' owed ' + money(x) + ' and paid ' + money(y) + ' by bank transfer in full and final settlement. ' + c2 + ' owed ' + money(z) + ' and paid nothing. What is the total debited to the irrecoverable debts account for the year? Give your answer in $.',
          x - y + z, 'Only the amounts that will never be received are written off: (' + money(x) + ' - ' + money(y) + ') + ' + money(z) + ' = ' + money(x - y) + ' + ' + money(z) + ' = ' + money(x - y + z) + '. The ' + money(y) + ' received is recorded through the cash book.');
      } },
      { skill: 'journal-amount', gen: function () {
        var c = pick(CUSTOMERS), x = rint(20, 300) * 20, cents = pick([10, 15, 20, 25, 30, 40]), paid = x * cents / 100;
        return numQ('A customer, ' + c + ', owed ' + money(x) + ' when it became bankrupt. It paid ' + cents + ' cents for every $1 owed, and the remaining balance was written off. What amount is credited to the trade receivables ledger control account for the <b>write-off</b>? Give your answer in $.',
          x - paid, 'The customer paid ' + cents + '% of ' + money(x) + ' = ' + money(paid) + '. The rest, ' + money(x) + ' - ' + money(paid) + ' = ' + money(x - paid) + ', is written off: debit irrecoverable debts, credit trade receivables ledger control.');
      } },
      { skill: 'journal-amount', gen: function () {
        var t = pick(TRADERS), c = pick(CUSTOMERS), x = rint(40, 260) * 10, y = rint(3, Math.floor(x / 30)) * 10, d = x - y;
        return mcq(c + ' owed ' + t + ' ' + money(x) + '. It paid ' + money(y) + ' in final settlement and ' + t + ' wrote off the balance. Which journal entry records the write-off?',
          'Debit ' + IDE + ' ' + money(d) + '; credit ' + TRLC + ' ' + money(d),
          ['Debit ' + IDE + ' ' + money(x) + '; credit ' + TRLC + ' ' + money(x),
           'Debit ' + TRLC + ' ' + money(d) + '; credit ' + IDE + ' ' + money(d),
           'Debit ' + IDE + ' ' + money(d) + '; credit Bank ' + money(d)],
          'Only the unpaid ' + money(x) + ' - ' + money(y) + ' = ' + money(d) + ' is written off. The expense account is debited and trade receivables are credited; bank is not involved because no cash moves.');
      } },
      { skill: 'journal-amount', gen: function () {
        var c = pick(CUSTOMERS), x = rint(30, 200) * 10, r = rint(2, Math.floor(x / 25)) * 10;
        return numQ(c + ' owed ' + money(x) + '. It returned faulty goods invoiced at ' + money(r) + ', which were accepted. It then ceased trading, and the remaining balance was written off. What is the amount of the journal entry for the write-off? Give your answer in $.',
          x - r, 'The returned goods reduce the debt first (a sales return). The amount left, ' + money(x) + ' - ' + money(r) + ' = ' + money(x - r) + ', is the irrecoverable debt.');
      } },
      { skill: 'provision-entry', gen: function () {
        var t = pick(TRADERS), p = rint(12, 120) * 10, f = fy();
        return mcq('On ' + f.end + ' ' + t + ' created a provision for irrecoverable debts of ' + money(p) + ' for the first time. Which double entry records this?',
          dc(IS, PID), [dc(PID, IS), dc(IDE, TRLC), dc(TRLC, PID)],
          'Creating a provision is an expense, so the income statement is debited ' + money(p) + '. The provision account is credited ' + money(p) + ' because it reduces the value of trade receivables.');
      } },
      { skill: 'provision-entry', gen: function () {
        var o = rint(10, 90) * 10, n = o + rint(3, 40) * 10, i = n - o;
        return mcq('A provision for irrecoverable debts of ' + money(o) + ' is to be increased to ' + money(n) + ' at the year end. Which entry records the change?',
          'Debit ' + IS + ' ' + money(i) + '; credit ' + PID + ' ' + money(i),
          ['Debit ' + IS + ' ' + money(n) + '; credit ' + PID + ' ' + money(n),
           'Debit ' + PID + ' ' + money(i) + '; credit ' + IS + ' ' + money(i),
           'Debit ' + TRLC + ' ' + money(i) + '; credit ' + PID + ' ' + money(i)],
          'Only the increase is recorded: ' + money(n) + ' - ' + money(o) + ' = ' + money(i) + '. An increase is an extra expense, so debit the income statement and credit the provision account.');
      } },
      { skill: 'provision-entry', gen: function () {
        var n = rint(10, 90) * 10, o = n + rint(3, 40) * 10, d = o - n;
        return mcq('The provision for irrecoverable debts was ' + money(o) + '. At the year end only ' + money(n) + ' is needed. Which entry records the change?',
          'Debit ' + PID + ' ' + money(d) + '; credit ' + IS + ' ' + money(d),
          ['Debit ' + IS + ' ' + money(d) + '; credit ' + PID + ' ' + money(d),
           'Debit ' + PID + ' ' + money(n) + '; credit ' + IS + ' ' + money(n),
           'Debit ' + PID + ' ' + money(d) + '; credit ' + TRLC + ' ' + money(d)],
          'The provision falls by ' + money(o) + ' - ' + money(n) + ' = ' + money(d) + '. A decrease adds to profit, so debit the provision account and credit the income statement.');
      } },
      { skill: 'provision-entry', kind: 'mcq', q: 'A bookkeeper credited several customers\' accounts when creating a provision for irrecoverable debts. Why is this wrong?',
        options: ['A provision names no customer, so individual customer accounts must not change', 'The customers\' accounts should have been debited with the provision instead', 'The provision should have been credited to the bank account instead', 'Customer accounts are only changed when the provision is reduced'],
        answer: 0, why: 'A provision is a general estimate. It is credited to the provision for irrecoverable debts account; each customer still owes the full amount, so their accounts are unchanged.' },
      { skill: 'provision-entry', kind: 'mcq', q: 'When a provision for irrecoverable debts is reduced, what is the effect of the double entry on profit for the year?',
        options: ['Profit increases, because the income statement is credited', 'Profit decreases, because the income statement is debited', 'There is no effect, because only the provision account changes', 'Profit decreases, because the provision account is debited'],
        answer: 0, why: 'A smaller provision is needed, so the surplus is released: debit the provision account and credit the income statement, which adds to profit.' },
      { skill: 'debit-or-credit', gen: function () {
        var x = money(rint(15, 150) * 10), c = pick(CUSTOMERS);
        var ev = pick([
          { e: 'writing off a debt of ' + x + ' owed by ' + c + ' (a trade receivables ledger control account is kept)', a: [[IDE, 'Debited'], [TRLC, 'Credited'], [PID, 'Not affected'], ['Bank', 'Not affected']], full: 'debit irrecoverable debts, credit trade receivables ledger control' },
          { e: 'creating a provision for irrecoverable debts of ' + x + ' for the first time', a: [[IS, 'Debited'], [PID, 'Credited'], [TRLC, 'Not affected'], [IDE, 'Not affected']], full: 'debit income statement, credit provision for irrecoverable debts' },
          { e: 'reducing the provision for irrecoverable debts by ' + x, a: [[PID, 'Debited'], [IS, 'Credited'], [TRLC, 'Not affected']], full: 'debit provision for irrecoverable debts, credit income statement' }
        ]);
        var p = pick(ev.a), all = ['Debited', 'Credited', 'Not affected'];
        return mcq('When ' + ev.e + ', what happens to the <b>' + p[0] + '</b> account?', p[1], all.filter(function (o) { return o !== p[1]; }),
          'The entry is: ' + ev.full + '. So the ' + p[0].toLowerCase() + ' account is ' + p[1].toLowerCase() + '.');
      } },
      { skill: 'debit-or-credit', kind: 'multi', q: 'A business writes off a debt that a customer will never pay. Which of the following happen?',
        options: ['The irrecoverable debts account is debited', 'The trade receivables ledger control account is credited', 'The provision for irrecoverable debts account is credited', 'The bank account is credited', 'The sales account is debited'],
        answers: [0, 1], why: 'A write-off is debit irrecoverable debts (expense) and credit trade receivables. No cash moves, sales are not changed and the provision account is not used.' },
      { skill: 'debit-or-credit', kind: 'multi', q: 'Which accounts are affected when an existing provision for irrecoverable debts is increased?',
        options: ['Income statement', 'Provision for irrecoverable debts', 'Trade receivables ledger control', 'Bank', 'Each customer\'s account in the sales ledger'],
        answers: [0, 1], why: 'Debit the income statement with the increase and credit the provision account. Trade receivables, bank and customer accounts are untouched by a change in an estimate.' },
      { skill: 'interpret-entry', gen: function () {
        var x = money(rint(15, 150) * 10);
        var list = [
          { e: 'Debit ' + IDE + ' ' + x + '; credit ' + TRLC + ' ' + x, a: 'Writing off a debt that will not be paid' },
          { e: 'Debit ' + IS + ' ' + x + '; credit ' + PID + ' ' + x, a: 'Creating or increasing the provision' },
          { e: 'Debit ' + PID + ' ' + x + '; credit ' + IS + ' ' + x, a: 'Reducing the provision for irrecoverable debts' },
          { e: 'Debit ' + IS + ' ' + x + '; credit ' + IDE + ' ' + x, a: 'Transferring debts written off to the income statement' }
        ];
        var k = rint(0, 3), ch = list[k];
        return mcq('Which event is recorded by this entry?<br><i>' + ch.e + '</i>', ch.a, list.filter(function (_, i) { return i !== k; }).map(function (l) { return l.a; }),
          'Write-off: debit irrecoverable debts, credit trade receivables. New or higher provision: debit income statement, credit provision. Lower provision: the reverse. Year-end transfer: debit income statement, credit irrecoverable debts.');
      } },
      { skill: 'expense-transfer', gen: function () {
        var a = rint(15, 90) * 10, b = rint(15, 90) * 10, c = rint(15, 90) * 10, tot = a + b + c, f = fy();
        return mcq('During the year ended ' + f.end + ' three debts were written off: ' + money(a) + ', ' + money(b) + ' and ' + money(c) + '. Which entry transfers the irrecoverable debts account to the income statement at the year end?',
          'Debit ' + IS + ' ' + money(tot) + '; credit ' + IDE + ' ' + money(tot),
          ['Debit ' + IDE + ' ' + money(tot) + '; credit ' + IS + ' ' + money(tot),
           'Debit ' + IS + ' ' + money(tot) + '; credit ' + TRLC + ' ' + money(tot),
           'Debit ' + IS + ' ' + money(c) + '; credit ' + IDE + ' ' + money(c)],
          'The account has a debit balance of ' + money(a) + ' + ' + money(b) + ' + ' + money(c) + ' = ' + money(tot) + '. To close it, credit it and debit the income statement, where it is shown as an expense.');
      } },
      { skill: 'spot-error', gen: function () {
        var t = pick(TRADERS), c = pick(CUSTOMERS), x = rint(30, 220) * 10, y = rint(2, Math.floor(x / 30)) * 10, d = x - y, f = fy();
        var O = ['The debit and credit entries are the wrong way round', 'The provision account was credited instead of trade receivables', 'The amount should be only the balance left after the payment', 'Bank should be credited instead of irrecoverable debts'];
        var k = rint(0, 2), lines;
        if (k === 0) lines = [[TRLC, d, 0], ['&nbsp;&nbsp;' + IDE, 0, d]];
        else if (k === 1) lines = [[IDE, d, 0], ['&nbsp;&nbsp;' + PID, 0, d]];
        else lines = [[IDE, x, 0], ['&nbsp;&nbsp;' + TRLC, 0, x]];
        var fix = 'The correct journal is debit irrecoverable debts ' + money(d) + ', credit trade receivables ledger control ' + money(d) + ' (' + money(x) + ' owed less ' + money(y) + ' received).';
        return mcq(c + ' owed ' + t + ' ' + money(x) + ' and paid ' + money(y) + ' in final settlement. The bookkeeper prepared this journal to write off the rest. What is wrong with it?<br>' + journal(f.endShort, lines),
          O[k], O.filter(function (_, i) { return i !== k; }), fix);
      } },
      { skill: 'spot-error', gen: function () {
        var o = rint(10, 80) * 10, n = o + rint(4, 40) * 10, i = n - o, f = fy();
        return mcq('The provision for irrecoverable debts was ' + money(o) + ' and is to be ' + money(n) + ' at ' + f.end + '. A trainee wrote this journal:<br>' + journal(f.endShort, [[IS, n, 0], ['&nbsp;&nbsp;' + PID, 0, n]]) + 'What is wrong with it?',
          'It should record only the increase of ' + money(i) + ', not ' + money(n),
          ['The income statement should be credited, not debited', 'Trade receivables should be credited instead of the provision', 'The irrecoverable debts account should be credited'],
          'The provision account already holds ' + money(o) + ', so only ' + money(n) + ' - ' + money(o) + ' = ' + money(i) + ' is needed: debit income statement ' + money(i) + ', credit provision ' + money(i) + '.');
      } },
      { skill: 'spot-error', kind: 'mcq', q: 'A journal entry writing off a debt owed by Corvo Stores needs a narrative. Which narrative is most suitable?',
        options: ['Write-off of debt owed by Corvo Stores, which will not be paid', 'Irrecoverable debts debited and trade receivables credited', 'Provision for irrecoverable debts created for the year', 'Payment received from Corvo Stores by bank transfer'],
        answer: 0, why: 'A narrative explains why the entry is made. Repeating the account names adds nothing, and the other two describe different events.' },
      { skill: 'expense-transfer', kind: 'mcq', q: 'In which book of prime entry is the writing off of an irrecoverable debt first recorded?',
        options: ['The journal', 'The sales journal', 'The cash book', 'The sales returns journal'],
        answer: 0, why: 'A write-off is not a credit sale, a return or a cash movement, so it is first recorded in the (general) journal before posting to the ledger.' },
      { skill: 'interpret-entry', gen: function () {
        var w = rint(15, 120) * 10, o = rint(20, 90) * 10, n = o + rint(3, 30) * 10, i = n - o;
        if (w === i) w += 10;
        return { kind: 'multi', q: 'At the year end a debt of ' + money(w) + ' is written off and the provision for irrecoverable debts is increased from ' + money(o) + ' to ' + money(n) + '. Which of these entries are needed?',
          options: ['Debit irrecoverable debts ' + money(w), 'Credit trade receivables ledger control ' + money(w), 'Credit provision for irrecoverable debts ' + money(i), 'Credit provision for irrecoverable debts ' + money(w), 'Debit trade receivables ledger control ' + money(i), 'Debit income statement ' + money(n)],
          answers: [0, 1, 2], why: 'The write-off is debit irrecoverable debts ' + money(w) + ', credit trade receivables ' + money(w) + '. The provision change is only ' + money(n) + ' - ' + money(o) + ' = ' + money(i) + ': debit income statement, credit provision.' };
      } }
    ]
  };

  // =====================================================================
  B['ACC-ADJ-10'] = {
    title: 'Calculating the provision for irrecoverable debts',
    items: [
      { skill: 'new-provision', gen: function () {
        var t = pick(TRADERS), f = fy(), rate = pick([2, 3, 4, 5, 6]), r = rint(60, 700) * 100, p = r / 100 * rate;
        return numQ(t + '\'s trade receivables at ' + f.end + ' were ' + money(r) + '. A provision for irrecoverable debts is kept at ' + rate + '% of trade receivables. Calculate the provision required at ' + f.end + '. Give your answer in $.',
          p, 'The provision is a percentage of trade receivables: ' + rate + '% x ' + money(r) + ' = ' + money(p) + '.');
      } },
      { skill: 'new-provision', gen: function () {
        var d = provData(), t = pick(TRADERS), f = fy();
        return numQ('At ' + f.end + ' ' + t + '\'s trade receivables were ' + money(d.gross) + '. This includes a debt of ' + money(d.W) + ' that is to be written off. The provision for irrecoverable debts is ' + d.rate + '% of trade receivables. Calculate the provision required. Give your answer in $.',
          d.P, 'Write off first: ' + money(d.gross) + ' - ' + money(d.W) + ' = ' + money(d.net) + '. Then ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + '.');
      } },
      { skill: 'new-provision', gen: function () {
        var rate = pick([2, 3, 4, 5]), net = rint(80, 500) * 100, p = net / 100 * rate, w1 = rint(10, 90) * 10, w2 = rint(10, 90) * 10 + 5, g = net + w1 + w2, c1 = pick(CUSTOMERS), c2 = pick(CUSTOMERS.filter(function (c) { return c !== c1; }));
        return numQ('Trade receivables at the year end total ' + money(g) + '. Two customers, ' + c1 + ' (' + money(w1) + ') and ' + c2 + ' (' + money(w2) + '), will never pay and are to be written off. A provision of ' + rate + '% of the remaining trade receivables is required. Calculate the provision. Give your answer in $.',
          p, money(g) + ' - ' + money(w1) + ' - ' + money(w2) + ' = ' + money(net) + '; ' + rate + '% x ' + money(net) + ' = ' + money(p) + '.');
      } },
      { skill: 'new-provision', gen: function () {
        var net = rint(40, 400) * 200, p = net * 2.5 / 100, w = rint(10, 80) * 10, g = net + w;
        return numQ('A business has trade receivables of ' + money(g) + ', of which ' + money(w) + ' is an irrecoverable debt to be written off. The provision for irrecoverable debts is 2.5% of trade receivables. Calculate the provision required. Give your answer in $.',
          p, '(' + money(g) + ' - ' + money(w) + ') x 2.5% = ' + money(net) + ' x 0.025 = ' + money(p) + '.');
      } },
      { skill: 'new-provision', gen: function () {
        var d = provData(), f = fy(), wrongG = d.gross * d.rate / 100;
        var q = mcqMoney('At ' + f.end + ' trade receivables were ' + money(d.gross) + ', of which ' + money(d.W) + ' is to be written off. The opening provision was ' + money(d.O) + '. The provision is to be ' + d.rate + '% of trade receivables. What is the provision required at ' + f.end + '?',
          d.P, [Math.round(wrongG), d.ch, d.P + d.O], 'Deduct the write-off first: (' + money(d.gross) + ' - ' + money(d.W) + ') x ' + d.rate + '% = ' + money(d.P) + '. The question asks for the provision required, not the change.');
        return q;
      } },
      { skill: 'new-provision', gen: function () {
        var rate = pick([3, 4, 5]), names = CUSTOMERS.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 4);
        var bal = names.map(function () { return rint(15, 140) * 50; }), bad = rint(0, 3);
        var net = 0; bal.forEach(function (b, i) { if (i !== bad) net += b; });
        while (net * rate % 100) { bal[(bad + 1) % 4] += 50; net += 50; }
        var p = net * rate / 100;
        var rows = names.map(function (n, i) { return '<tr><td>' + n + (i === bad ? ' (to be written off)' : '') + '</td><td>' + comma(bal[i]) + '</td></tr>'; }).join('');
        return numQ('These are the only balances in a trader\'s sales ledger at the year end.<table class="mc-table"><tr><th>Customer</th><th>Balance $</th></tr>' + rows + '</table>The provision for irrecoverable debts is ' + rate + '% of trade receivables. Calculate the provision required. Give your answer in $.',
          p, 'Leave out the debt being written off (' + money(bal[bad]) + '). Remaining receivables = ' + money(net) + '; ' + rate + '% x ' + money(net) + ' = ' + money(p) + '.');
      } },
      { skill: 'change', gen: function () {
        var d = provData('up'), f = fy();
        return numQ('The provision for irrecoverable debts at the start of the year was ' + money(d.O) + '. At ' + f.end + ' trade receivables were ' + money(d.net) + ' and the provision is to be ' + d.rate + '% of trade receivables. Calculate the increase in the provision. Give your answer in $.',
          d.ch, 'New provision = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + '. Increase = ' + money(d.P) + ' - ' + money(d.O) + ' = ' + money(d.ch) + '.');
      } },
      { skill: 'change', gen: function () {
        var d = provData('down'), f = fy();
        return numQ('On ' + f.start + ' the provision for irrecoverable debts was ' + money(d.O) + '. At ' + f.end + ' trade receivables were ' + money(d.gross) + ' before writing off a debt of ' + money(d.W) + '. The provision is maintained at ' + d.rate + '%. Calculate the decrease in the provision. Give your answer in $.',
          d.ch, 'New provision = ' + d.rate + '% x (' + money(d.gross) + ' - ' + money(d.W) + ') = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + '. Decrease = ' + money(d.O) + ' - ' + money(d.P) + ' = ' + money(d.ch) + '.');
      } },
      { skill: 'change', gen: function () {
        var d = provData(), f = fy(), word = d.up ? 'Increase' : 'Decrease', other = d.up ? 'Decrease' : 'Increase';
        var wrongNew = Math.round(d.gross * d.rate / 100), wrongCh = Math.abs(wrongNew - d.O);
        var opts = [word + ' of ' + money(d.ch), other + ' of ' + money(d.ch), word + ' of ' + money(d.P), (wrongCh && wrongCh !== d.ch ? (wrongNew > d.O ? 'Increase' : 'Decrease') + ' of ' + money(wrongCh) : other + ' of ' + money(d.P))];
        return mcq('Opening provision for irrecoverable debts: ' + money(d.O) + '. Trade receivables at ' + f.end + ': ' + money(d.gross) + ', of which ' + money(d.W) + ' is to be written off. Provision rate: ' + d.rate + '%. What is the change in the provision?',
          opts[0], opts.slice(1),
          'New provision = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + ', compared with ' + money(d.O) + ' before. That is ' + (d.up ? 'an increase' : 'a decrease') + ' of ' + money(d.ch) + '.');
      } },
      { skill: 'change', gen: function () {
        var rate = pick([2, 4, 5]), r1 = rint(60, 400) * 100, r2 = r1 + pick([-1, 1]) * rint(5, 120) * 100, o = r1 * rate / 100, n = r2 * rate / 100, ch = Math.abs(n - o);
        var f = fy();
        return numQ('A trader keeps the provision at ' + rate + '% of trade receivables every year. Trade receivables were ' + money(r1) + ' at the end of last year and ' + money(r2) + ' at ' + f.end + '. Calculate the ' + (n > o ? 'increase' : 'decrease') + ' in the provision this year. Give your answer in $.',
          ch, 'Opening provision = ' + rate + '% x ' + money(r1) + ' = ' + money(o) + '. New provision = ' + rate + '% x ' + money(r2) + ' = ' + money(n) + '. Change = ' + money(Math.max(n, o)) + ' - ' + money(Math.min(n, o)) + ' = ' + money(ch) + ' (' + (n > o ? 'increase' : 'decrease') + ').');
      } },
      { skill: 'change', gen: function () {
        var r = rint(80, 500) * 100, oldRate = pick([3, 4, 5, 6]), newRate = pick([2, 3, 4, 5, 6].filter(function (x) { return x !== oldRate; }));
        var o = rint(80, 500) * 100 * oldRate / 100, n = r * newRate / 100;
        if (n === o) o += 100 * oldRate;
        var ch = Math.abs(n - o);
        return numQ('A trader has decided to change the provision for irrecoverable debts from ' + oldRate + '% to ' + newRate + '% of trade receivables. The provision brought forward is ' + money(o) + ' and trade receivables at the year end are ' + money(r) + '. Calculate the ' + (n > o ? 'increase' : 'decrease') + ' in the provision. Give your answer in $.',
          ch, 'Use the new rate on this year\'s receivables: ' + newRate + '% x ' + money(r) + ' = ' + money(n) + '. Compare with the balance brought forward of ' + money(o) + ': ' + (n > o ? 'increase' : 'decrease') + ' of ' + money(ch) + '. The old rate is already reflected in ' + money(o) + '.');
      } },
      { skill: 'change', gen: function () {
        var up = Math.random() < 0.5, n = rint(20, 200) * 10, ch = rint(3, 40) * 10, o = up ? n - ch : n + ch;
        return numQ('At the year end the provision for irrecoverable debts was ' + (up ? 'increased' : 'decreased') + ' by ' + money(ch) + ' to ' + money(n) + '. What was the balance of the provision at the start of the year? Give your answer in $.',
          o, up ? 'An increase was added to the opening balance: opening = ' + money(n) + ' - ' + money(ch) + ' = ' + money(o) + '.' : 'A decrease was taken off the opening balance: opening = ' + money(n) + ' + ' + money(ch) + ' = ' + money(o) + '.');
      } },
      { skill: 'rate', gen: function () {
        var rate = pick([2, 3, 4, 5, 6, 8]), r = rint(50, 600) * 100, p = r * rate / 100;
        return { kind: 'num', q: 'Trade receivables are ' + money(r) + ' and the provision for irrecoverable debts is ' + money(p) + '. What percentage of trade receivables is the provision?', answer: rate, unit: '%', display: String(rate),
          why: money(p) + ' / ' + money(r) + ' x 100 = ' + rate + '%.' };
      } },
      { skill: 'rate', gen: function () {
        var d = provData(), f = fy();
        return { kind: 'num', q: 'At ' + f.end + ' trade receivables were ' + money(d.gross) + ' before writing off an irrecoverable debt of ' + money(d.W) + '. After the write-off, the provision for irrecoverable debts was set at ' + money(d.P) + '. What percentage rate was used?', answer: d.rate, unit: '%', display: String(d.rate),
          why: 'The provision is based on receivables after the write-off: ' + money(d.gross) + ' - ' + money(d.W) + ' = ' + money(d.net) + '. ' + money(d.P) + ' / ' + money(d.net) + ' x 100 = ' + d.rate + '%.' };
      } },
      { skill: 'rate', gen: function () {
        var rate = pick([2, 2.5, 4, 5]), p = rint(12, 90) * (rate === 2.5 ? 50 : 20), r = p * 100 / rate;
        return numQ('A provision for irrecoverable debts of ' + money(p) + ' is ' + rate + '% of trade receivables (after write-offs). What is the value of trade receivables after write-offs? Give your answer in $.',
          r, 'If ' + rate + '% = ' + money(p) + ', then 100% = ' + money(p) + ' / ' + rate + ' x 100 = ' + money(r) + '.');
      } },
      { skill: 'adjusted-receivables', gen: function () {
        var g = rint(150, 900) * 100 + rint(0, 9) * 10, w1 = rint(10, 99) * 10, w2 = rint(10, 99) * 10, f = fy();
        return numQ('At ' + f.end + ' trade receivables were ' + money(g) + '. Two debts of ' + money(w1) + ' and ' + money(w2) + ' are to be written off before the provision for irrecoverable debts is calculated. What figure for trade receivables should the provision be based on? Give your answer in $.',
          g - w1 - w2, money(g) + ' - ' + money(w1) + ' - ' + money(w2) + ' = ' + money(g - w1 - w2) + '. Debts already written off are known losses, so no provision is needed for them.');
      } },
      { skill: 'income-statement', gen: function () {
        var d = provData(), f = fy();
        var c = d.up ? money(d.ch) + ' as an expense, reducing profit' : money(d.ch) + ' as income, increasing profit';
        var w1 = d.up ? money(d.ch) + ' as income, increasing profit' : money(d.ch) + ' as an expense, reducing profit';
        return mcq('The provision for irrecoverable debts is to change from ' + money(d.O) + ' to ' + money(d.P) + ' at ' + f.end + '. What is shown in the income statement for this change?',
          c, [w1, money(d.P) + ' as an expense, reducing profit', money(d.P) + ' as income, increasing profit'],
          'Only the change goes to the income statement: ' + money(Math.max(d.P, d.O)) + ' - ' + money(Math.min(d.P, d.O)) + ' = ' + money(d.ch) + '. ' + (d.up ? 'A bigger provision is an extra expense.' : 'A smaller provision is added to profit.'));
      } },
      { skill: 'income-statement', gen: function () {
        var d = provData('down'), f = fy();
        return numQ('The provision for irrecoverable debts was ' + money(d.O) + ' at the start of the year. At ' + f.end + ' trade receivables were ' + money(d.net) + ' and the provision is kept at ' + d.rate + '%. By how much does the adjustment to the provision <b>increase</b> profit for the year? Give your answer in $.',
          d.ch, 'New provision = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + ', which is lower than ' + money(d.O) + '. The decrease of ' + money(d.ch) + ' is added to profit.');
      } },
      { skill: 'spot-error', gen: function () {
        var k = rint(0, 2), d = provData(k === 2 ? 'down' : null), wrongNew = d.gross * d.rate / 100, work;
        var O = ['The debt to be written off was not deducted first', 'The new provision was given instead of the change', 'The change is a decrease, not an increase', 'The rate was applied to the opening provision'];
        if (k === 0) { d.W = rint(2, 15) * 100; d.gross = d.net + d.W; wrongNew = d.gross * d.rate / 100; if (wrongNew === d.O) { d.W += 100; d.gross += 100; wrongNew = d.gross * d.rate / 100; }
          var c0 = wrongNew - d.O; work = money(d.gross) + ' x ' + d.rate + '% = ' + money(wrongNew) + '; ' + (c0 >= 0 ? 'increase' : 'decrease') + ' = ' + money(Math.abs(c0)); }
        else if (k === 1) work = '(' + money(d.gross) + ' - ' + money(d.W) + ') x ' + d.rate + '% = ' + money(d.P) + '; change in provision = ' + money(d.P);
        else work = '(' + money(d.gross) + ' - ' + money(d.W) + ') x ' + d.rate + '% = ' + money(d.P) + '; increase = ' + money(d.O) + ' - ' + money(d.P) + ' = ' + money(d.ch);
        return mcq('Opening provision ' + money(d.O) + '; trade receivables ' + money(d.gross) + ', of which ' + money(d.W) + ' is to be written off; rate ' + d.rate + '%. A student calculated the change in the provision like this:<br><i>' + work + '</i><br>What is the mistake?',
          O[k], O.filter(function (_, i) { return i !== k; }),
          'Correct working: (' + money(d.gross) + ' - ' + money(d.W) + ') x ' + d.rate + '% = ' + money(d.P) + '; compared with ' + money(d.O) + ' this is ' + (d.up ? 'an increase' : 'a decrease') + ' of ' + money(d.ch) + '.');
      } },
      { skill: 'spot-error', gen: function () {
        var d = provData(), word = d.up ? 'increase' : 'decrease';
        var right = '(' + comma(d.gross) + ' - ' + comma(d.W) + ') x ' + d.rate + '% = ' + comma(d.P) + '; ' + word + ' ' + comma(d.ch);
        var gNew = R.roundDp(d.gross * d.rate / 100, 2), gch = R.roundDp(Math.abs(gNew - d.O), 2);
        var w1 = comma(d.gross) + ' x ' + d.rate + '% = ' + fmt2(gNew) + '; ' + (gNew > d.O ? 'increase' : 'decrease') + ' ' + fmt2(gch);
        var w2 = '(' + comma(d.gross) + ' - ' + comma(d.W) + ') x ' + d.rate + '% = ' + comma(d.P) + '; ' + (d.up ? 'decrease' : 'increase') + ' ' + comma(d.ch);
        var g3 = R.roundDp((d.gross + d.W) * d.rate / 100, 2), c3 = R.roundDp(Math.abs(g3 - d.O), 2);
        var w3 = '(' + comma(d.gross) + ' + ' + comma(d.W) + ') x ' + d.rate + '% = ' + fmt2(g3) + '; ' + (g3 > d.O ? 'increase' : 'decrease') + ' ' + fmt2(c3);
        return mcq('Opening provision $' + comma(d.O) + '. Trade receivables $' + comma(d.gross) + ', of which $' + comma(d.W) + ' is to be written off. Provision rate ' + d.rate + '%. Which working for the change in the provision is correct (figures in $)?',
          right, [w1, w2, w3], 'Deduct the write-off, apply the rate, then compare with the opening provision of $' + comma(d.O) + ': $' + comma(d.P) + ' is ' + (d.up ? 'more' : 'less') + ', so it is ' + (d.up ? 'an increase' : 'a decrease') + ' of $' + comma(d.ch) + '.');
      } },
      { skill: 'adjusted-receivables', kind: 'mcq', q: 'Why are debts that are being written off deducted from trade receivables <b>before</b> the provision is calculated?',
        options: ['They are already treated as lost, so providing for them again would count the loss twice', 'The provision must always be calculated on the largest possible receivables figure', 'Written-off debts are added back to receivables in the next financial year', 'The provision rate only applies to customers who have already paid'],
        answer: 0, why: 'A written-off debt is charged in full as an irrecoverable debt. The provision is only for possible losses on the debts that remain.' },
      { skill: 'adjusted-receivables', kind: 'multi', q: 'Which figures do you need to work out how much the provision for irrecoverable debts changes at the year end?',
        options: ['Trade receivables at the year end', 'Debts to be written off at the year end', 'The provision rate', 'The opening balance of the provision', 'Cash sales for the year', 'The bank balance at the year end'],
        answers: [0, 1, 2, 3], why: '(Trade receivables - write-offs) x rate gives the new provision; comparing it with the opening provision gives the change. Cash sales and bank do not affect it.' }
    ]
  };

  // =====================================================================
  function provAcc(d, f, opt) {
    opt = opt || {};
    var dr = [], cr = [[f.startShort, 'Balance b/d', opt.hideO ? '?' : d.O]];
    if (d.up) cr.push([f.endShort, 'Income statement', opt.hideI ? '?' : d.ch]);
    else dr.push([f.endShort, 'Income statement', opt.hideI ? '?' : d.ch]);
    if (!opt.noCd) dr.push([f.endShort, 'Balance c/d', opt.hideP ? '?' : d.P]);
    var tot = opt.noTot ? null : [Math.max(d.O, d.P), Math.max(d.O, d.P)];
    if (opt.hideTot) tot = ['?', '?'];
    return tAcc('Provision for Irrecoverable Debts Account', dr, cr, tot, [], opt.noBd ? [] : [[f.nextShort, 'Balance b/d', d.P]]);
  }

  B['ACC-ADJ-11'] = {
    title: 'Provision for irrecoverable debts account',
    items: [
      { skill: 'is-transfer', gen: function () {
        var d = provData(), f = fy();
        var side = d.up ? 'Credit' : 'Debit', other = d.up ? 'Debit' : 'Credit';
        return mcq('The provision for irrecoverable debts account had a balance b/d of ' + money(d.O) + ' on ' + f.start + '. At ' + f.end + ' trade receivables were ' + money(d.net) + ' and the provision is ' + d.rate + '% of trade receivables. Which year-end transfer entry appears in the provision account?',
          side + ' side: Income statement ' + money(d.ch), [other + ' side: Income statement ' + money(d.ch), side + ' side: Income statement ' + money(d.P), 'Debit side: Irrecoverable debts ' + money(d.ch)],
          'New provision = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + '. ' + (d.up ? 'It rises by ' + money(d.ch) + ', so the increase is credited (an expense in the income statement).' : 'It falls by ' + money(d.ch) + ', so the decrease is debited (added to profit).'));
      } },
      { skill: 'is-transfer', gen: function () {
        var d = provData(), f = fy();
        return mcq('Look at this completed account.' + provAcc(d, f) + 'What does the income statement entry tell you?',
          d.up ? 'The provision increased by ' + money(d.ch) + ', reducing profit' : 'The provision decreased by ' + money(d.ch) + ', increasing profit',
          [d.up ? 'The provision decreased by ' + money(d.ch) + ', increasing profit' : 'The provision increased by ' + money(d.ch) + ', reducing profit',
           'Debts of ' + money(d.ch) + ' were written off during the year',
           'Customers paid ' + money(d.ch) + ' of their debts during the year'],
          'The transfer is on the ' + (d.up ? 'credit' : 'debit') + ' side. ' + (d.up ? 'A credit increases the provision, an expense in the income statement.' : 'A debit reduces the provision, and the surplus is added to profit.') + ' Write-offs and receipts never pass through this account.');
      } },
      { skill: 'is-transfer', gen: function () {
        var d = provData(), f = fy();
        d.O = 0; d.up = true; d.ch = d.P;
        return numQ(pick(TRADERS) + ' decided to create a provision for irrecoverable debts for the first time at ' + f.end + ', at ' + d.rate + '% of trade receivables. Trade receivables totalled ' + money(d.gross) + ', and ' + money(d.W) + ' of this is to be written off. What amount is credited in the provision account with the detail "Income statement"? Give your answer in $.',
          d.P, 'There is no opening balance, so the whole new provision is the increase: ' + d.rate + '% x (' + money(d.gross) + ' - ' + money(d.W) + ') = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + '.');
      } },
      { skill: 'balance-cd', gen: function () {
        var d = provData('up'), f = fy();
        return numQ('Here is part of a provision for irrecoverable debts account.' + provAcc(d, f, { hideP: true, noTot: true, noBd: true }) + 'Calculate the balance carried down on ' + f.end + '. Give your answer in $.',
          d.P, 'The credit side holds ' + money(d.O) + ' + ' + money(d.ch) + ' = ' + money(d.P) + '. The balance c/d on the debit side must equal this, so it is ' + money(d.P) + '.');
      } },
      { skill: 'balance-cd', gen: function () {
        var d = provData('down'), f = fy();
        return numQ('Here is part of a provision for irrecoverable debts account.' + provAcc(d, f, { hideP: true, noTot: true, noBd: true }) + 'Calculate the balance carried down on ' + f.end + '. Give your answer in $.',
          d.P, 'The credit side holds ' + money(d.O) + '. The debit side already has the decrease of ' + money(d.ch) + ', so the balance c/d = ' + money(d.O) + ' - ' + money(d.ch) + ' = ' + money(d.P) + '.');
      } },
      { skill: 'balance-cd', gen: function () {
        var d = provData(), f = fy();
        return mcq('On ' + f.start + ' the provision for irrecoverable debts was ' + money(d.O) + '. At ' + f.end + ' it is to be ' + d.rate + '% of trade receivables of ' + money(d.gross) + ', after writing off ' + money(d.W) + '. What is brought down on ' + f.next + '?',
          'Credit side: Balance b/d ' + money(d.P), ['Debit side: Balance b/d ' + money(d.P), 'Credit side: Balance b/d ' + money(d.O), 'Credit side: Balance b/d ' + money(d.ch)],
          'The new provision, ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + ', is carried down on the debit side and brought down on the credit side, because the provision normally has a credit balance.');
      } },
      { skill: 'totals', gen: function () {
        var d = provData('up'), f = fy();
        return numQ('Trade receivables at ' + f.end + ' are ' + money(d.net) + ' and the provision for irrecoverable debts is ' + d.rate + '% of this. The provision brought down on ' + f.start + ' was ' + money(d.O) + '. When the provision account is balanced at ' + f.end + ', what is the total on each side? Give your answer in $.',
          d.P, 'New provision = ' + money(d.P) + ' (debit, Balance c/d). Credit side = ' + money(d.O) + ' b/d + ' + money(d.ch) + ' income statement = ' + money(d.P) + '. Both sides total ' + money(d.P) + '.');
      } },
      { skill: 'totals', gen: function () {
        var d = provData('down'), f = fy();
        return numQ('A provision for irrecoverable debts account shows a balance b/d of ' + money(d.O) + ' on ' + f.start + '. At ' + f.end + ' the provision needed is ' + money(d.P) + '. When the account is balanced, what is the total on each side? Give your answer in $.',
          d.O, 'The provision falls by ' + money(d.ch) + ' (debit, Income statement). Debit side = ' + money(d.ch) + ' + Balance c/d ' + money(d.P) + ' = ' + money(d.O) + ', which equals the credit side (' + money(d.O) + ' b/d).');
      } },
      { skill: 'totals', gen: function () {
        var d = provData(), f = fy(), drTot = d.up ? d.P : d.O;
        return numQ('At ' + f.end + ' a trader\'s trade receivables totalled ' + money(d.gross) + '. An irrecoverable debt of ' + money(d.W) + ' within this total is to be written off. The provision is kept at ' + d.rate + '% and the opening balance was ' + money(d.O) + '. What is the total of the <b>debit</b> side of the provision account for the year? Give your answer in $.',
          drTot, 'New provision = ' + d.rate + '% x ' + money(d.net) + ' = ' + money(d.P) + '. ' + (d.up ? 'An increase is credited, so the debit side holds only Balance c/d ' + money(d.P) + '.' : 'The decrease of ' + money(d.ch) + ' is debited with Balance c/d ' + money(d.P) + ': total ' + money(d.O) + '.') + ' The write-off does not enter this account.');
      } },
      { skill: 'missing-figure', gen: function () {
        var d = provData(), f = fy();
        return numQ('The opening balance has been smudged in this account.' + provAcc(d, f, { hideO: true, noTot: true }) + 'What was the balance b/d on ' + f.start + '? Give your answer in $.',
          d.O, d.up ? 'The credit side must reach the balance c/d of ' + money(d.P) + ': opening = ' + money(d.P) + ' - ' + money(d.ch) + ' = ' + money(d.O) + '.' : 'The debit side totals ' + money(d.ch) + ' + ' + money(d.P) + ' = ' + money(d.O) + ', which must equal the opening balance.');
      } },
      { skill: 'missing-figure', gen: function () {
        var d = provData(), f = fy();
        return numQ('Find the missing income statement figure in this account.' + provAcc(d, f, { hideI: true }) + 'Give your answer in $.',
          d.ch, 'Both sides total ' + money(Math.max(d.O, d.P)) + '. ' + (d.up ? 'Credit side: ' + money(d.P) + ' - ' + money(d.O) + ' = ' + money(d.ch) + '.' : 'Debit side: ' + money(d.O) + ' - ' + money(d.P) + ' = ' + money(d.ch) + '.'));
      } },
      { skill: 'opening-closing', kind: 'mcq', q: 'On which side, and with which detail, is the opening balance of the provision for irrecoverable debts account entered?',
        options: ['Credit side, Balance b/d', 'Debit side, Balance b/d', 'Credit side, Income statement', 'Debit side, Balance c/d'],
        answer: 0, why: 'The provision reduces an asset, so it normally has a credit balance. It is brought down on the credit side on the first day of the year.' },
      { skill: 'opening-closing', kind: 'mcq', q: 'How is the new (required) provision recorded in the provision account at the year end?',
        options: ['Debit side as Balance c/d, then credit side as Balance b/d the next day', 'Credit side as Balance c/d, then debit side as Balance b/d the next day', 'Credit side as Income statement for the full amount of the provision', 'Debit side as Irrecoverable debts, then credit side as Balance b/d'],
        answer: 0, why: 'Balancing a credit-balance account puts the balance c/d on the debit side. It is then brought down on the credit side on the first day of the next year.' },
      { skill: 'opening-closing', kind: 'mcq', q: 'The provision for irrecoverable debts account normally has which kind of balance, and why?',
        options: ['A credit balance, because it reduces the value of an asset', 'A debit balance, because the provision is an asset of the business', 'A debit balance, because the provision is an expense', 'A credit balance, because it is owed to customers'],
        answer: 0, why: 'The provision is deducted from trade receivables. It is not owed to anyone and it is not itself the expense; only the change goes to the income statement.' },
      { skill: 'opening-closing', gen: function () {
        var f = fy();
        return mcq('For the year ended ' + f.end + ', which pair of dates is correct in the provision for irrecoverable debts account?',
          'Income statement transfer ' + f.end + '; Balance b/d ' + f.next,
          ['Income statement transfer ' + f.start + '; Balance b/d ' + f.end, 'Income statement transfer ' + f.next + '; Balance b/d ' + f.next, 'Income statement transfer ' + f.end + '; Balance b/d ' + f.end],
          'The change is worked out at the year end (' + f.end + '), when the balance is also carried down. It is brought down on the first day of the next year (' + f.next + ').');
      } },
      { skill: 'spot-error', gen: function () {
        var d = provData('up'), f = fy();
        var acc = tAcc('Provision for Irrecoverable Debts Account', [[f.endShort, 'Balance c/d', d.P + d.O]], [[f.startShort, 'Balance b/d', d.O], [f.endShort, 'Income statement', d.P]], [d.P + d.O, d.P + d.O]);
        return mcq('A provision of ' + d.rate + '% is needed on trade receivables of ' + money(d.net) + '. A student prepared this account:' + acc + 'What is the main error?',
          'The whole new provision was transferred instead of the increase',
          ['The opening balance should be on the debit side', 'The detail should be Irrecoverable debts, not Income statement', 'The increase should have been entered on the debit side of the account'],
          'The provision needed is ' + money(d.P) + '. Only the increase, ' + money(d.P) + ' - ' + money(d.O) + ' = ' + money(d.ch) + ', is credited as Income statement, and Balance c/d should be ' + money(d.P) + '.');
      } },
      { skill: 'spot-error', gen: function () {
        var d = provData('down'), f = fy(), wrong = d.O + d.ch;
        var acc = tAcc('Provision for Irrecoverable Debts Account', [[f.endShort, 'Balance c/d', wrong]], [[f.startShort, 'Balance b/d', d.O], [f.endShort, 'Income statement', d.ch]], [wrong, wrong]);
        return mcq('The provision was ' + money(d.O) + ' and is to fall to ' + money(d.P) + '. A student prepared this account:' + acc + 'What is the error?',
          'The decrease was entered on the credit side instead of the debit side',
          ['The opening balance should be on the debit side', 'The whole new provision should be shown as Income statement on the credit side', 'The detail should be Bank, not Income statement'],
          'A decrease of ' + money(d.ch) + ' is debited (it adds to profit). Then Balance c/d = ' + money(d.O) + ' - ' + money(d.ch) + ' = ' + money(d.P) + ', and both sides total ' + money(d.O) + '.');
      } },
      { skill: 'spot-error', gen: function () {
        var d = provData('up'), f = fy(), c = pick(CUSTOMERS);
        var acc = tAcc('Provision for Irrecoverable Debts Account', [[f.endShort, c, d.W], [f.endShort, 'Balance c/d', d.P]], [[f.startShort, 'Balance b/d', d.O], [f.endShort, 'Income statement', d.ch + d.W]], [d.P + d.W, d.P + d.W]);
        return mcq('During the year a debt of ' + money(d.W) + ' owed by ' + c + ' was written off. A student prepared this account:' + acc + 'What is the error?',
          'The written-off debt should not be posted to this account',
          ['The balance c/d should be shown on the credit side', 'The opening balance should be on the debit side', 'The written-off debt should have been entered on the credit side instead'],
          'Write-offs go to the irrecoverable debts account. This account only shows the opening balance, the change of ' + money(d.ch) + ' and the new provision of ' + money(d.P) + '.');
      } },
      { skill: 'spot-error', kind: 'mcq', q: 'A student labels the year-end transfer in the provision for irrecoverable debts account "Irrecoverable debts". Which detail should be used?',
        options: ['Income statement', 'Bank', 'Trade receivables', 'Balance c/d'],
        answer: 0, why: 'The change in the provision is transferred to the income statement, so the detail is "Income statement". Irrecoverable debts is a separate account for write-offs.' },
      { skill: 'full-account', gen: function () {
        var d = provData(), f = fy();
        var right = d.up ? 'Dr: Balance c/d ' + money(d.P) + ' | Cr: Balance b/d ' + money(d.O) + ', Income statement ' + money(d.ch)
                         : 'Dr: Income statement ' + money(d.ch) + ', Balance c/d ' + money(d.P) + ' | Cr: Balance b/d ' + money(d.O);
        var w1 = d.up ? 'Dr: Income statement ' + money(d.ch) + ', Balance c/d ' + money(d.P) + ' | Cr: Balance b/d ' + money(d.O)
                      : 'Dr: Balance c/d ' + money(d.P) + ' | Cr: Balance b/d ' + money(d.O) + ', Income statement ' + money(d.ch);
        var w2 = 'Dr: Balance c/d ' + money(d.P) + ' | Cr: Balance b/d ' + money(d.O) + ', Income statement ' + money(d.P);
        var w3 = 'Dr: Balance b/d ' + money(d.O) + ', Income statement ' + money(d.ch) + ' | Cr: Balance c/d ' + money(d.P);
        return mcq('Opening provision ' + money(d.O) + '; provision required at ' + f.end + ': ' + d.rate + '% of trade receivables of ' + money(d.net) + '. Which summary of the provision account for the year is correct?',
          right, [w1, w2, w3], 'New provision = ' + money(d.P) + '. ' + (d.up ? 'The increase of ' + money(d.ch) + ' is credited' : 'The decrease of ' + money(d.ch) + ' is debited') + '; the opening balance is a credit and the new provision is carried down on the debit side.');
      } },
      { skill: 'full-account', kind: 'multi', q: 'Which entries could appear on the <b>debit</b> side of a provision for irrecoverable debts account?',
        options: ['Balance c/d (the new provision)', 'Income statement (a decrease in the provision)', 'Balance b/d (the opening provision)', 'Income statement (an increase in the provision)', 'A customer\'s debt being written off'],
        answers: [0, 1], why: 'Debit side: a decrease (added to profit) and the closing balance c/d. The opening balance and any increase are credits, and write-offs never go here.' },
      { skill: 'full-account', kind: 'multi', q: 'Which entries could appear on the <b>credit</b> side of a provision for irrecoverable debts account?',
        options: ['Balance b/d (the opening provision)', 'Income statement (an increase in the provision)', 'Balance c/d (the new provision)', 'Bank (cash paid by customers)', 'Trade receivables ledger control (a debt written off)'],
        answers: [0, 1], why: 'The opening balance and any increase are credits. Balance c/d is on the debit side, and receipts and write-offs are recorded in other accounts.' }
    ]
  };

  // =====================================================================
  B['ACC-ADJ-12'] = {
    title: 'Why accruals, prepayments and owner\'s own use are adjusted (concepts)',
    items: [
      { skill: 'accruals-concept', kind: 'mcq', q: 'Why must a business adjust for rent that it has paid in advance at the year end?',
        options: ['Accruals: expenses belong to the period they relate to, so next year\'s rent is excluded', 'Prudence: every payment must be shown as an expense as soon as it is made', 'Business entity: the landlord\'s own records must always be kept separate from the records of the business', 'Consistency: the rent expense must be exactly the same amount every year'],
        answer: 0, why: 'The accruals (matching) concept charges each year only with the costs that relate to it. Rent for next year is a prepayment, not this year\'s expense.' },
      { skill: 'accruals-concept', kind: 'mcq', q: 'Which statement best describes the accruals (matching) concept?',
        options: ['Income and expenses are recorded in the period they relate to, not when cash moves', 'Income is recorded when cash is received and expenses when cash is paid', 'Expenses are recorded at the lowest possible value to avoid overstating them in the income statement', 'Only items with a reliable money value are recorded in the accounts'],
        answer: 0, why: 'Accruals ignores the timing of cash. The second option describes cash accounting, which is exactly what the concept replaces.' },
      { skill: 'accruals-concept', kind: 'mcq', q: 'Electricity of $640 used in the last two months of the year has not yet been paid. Why should it be included in this year\'s expense?',
        options: ['It was used to earn this year\'s income, so it is matched with this year', 'It will be paid next year, so it really belongs to next year\'s expense', 'It is small, so materiality allows it to go in either year', 'Prudence requires all bills to be paid before the year end'],
        answer: 0, why: 'The electricity was consumed this year to earn this year\'s revenue. Under accruals it is this year\'s expense even though the cash is paid later, so $640 is an amount owing.' },
      { skill: 'accruals-concept', kind: 'mcq', q: 'A business receives rent from a tenant. Rent received in advance for next year is removed from this year\'s rent income. Why?',
        options: ['It is earned next year, so the accruals concept places it in next year', 'It has been received in cash, so it is already part of this year\'s profit', 'Prudence says income must never be recorded until the year after it is received', 'The tenant is a separate entity, so the rent is never income of the business'],
        answer: 0, why: 'Income belongs to the period in which it is earned. The advance relates to next year, so it is shown as an other payable now and as income next year.' },
      { skill: 'accruals-concept', kind: 'mcq', q: 'Which conclusion best completes an evaluation of why a business adjusts for other receivables and other payables?',
        options: ['Adjusting gives a true and fair profit and lets users compare one year with another', 'Adjusting is optional as long as all of the cash has been recorded correctly in the cash book', 'Adjusting always increases profit, so owners are always better off doing it', 'Adjusting removes the need for the business to keep a cash book at all'],
        answer: 0, why: 'The adjustments make each year carry its own income and expenses, so profit and the statement of financial position are realistic and years can be compared fairly.' },
      { skill: 'business-entity', kind: 'mcq', q: 'Ingrid Larsen took goods costing $300 from her shop for her family. Why must this be recorded as drawings?',
        options: ['The business is separate from its owner, so private use is not a business cost', 'Prudence requires goods taken by the owner to be valued at selling price', 'Accruals requires the goods to be matched with next year\'s sales', 'The goods are a business expense because the shop paid for them'],
        answer: 0, why: 'Business entity: the business and Ingrid are separate. Goods she uses privately are drawings (reducing her capital), not a cost of running the shop.' },
      { skill: 'business-entity', kind: 'mcq', q: 'A student writes: "Goods taken by the owner are recorded as drawings because of the business entity concept." Which sentence best <b>develops</b> this point?',
        options: ['Otherwise private goods stay in purchases, so cost of sales is too high and profit too low', 'Otherwise the goods would have to be shown as a non-current asset of the business', 'Otherwise closing inventory would have to be valued at its selling price', 'Otherwise the owner would have to pay the supplier for the goods personally'],
        answer: 0, why: 'The development shows the effect: if the goods are not taken out of purchases, the business bears a private cost, so cost of sales is overstated and profit understated.' },
      { skill: 'business-entity', kind: 'multi', q: 'An owner takes goods from the business for personal use. Which statements about the correct treatment are true?',
        options: ['The cost of the goods is treated as drawings', 'Purchases (or cost of sales) are reduced', 'The owner\'s capital is reduced by the drawings', 'Profit for the year is reduced by the cost of the goods', 'The goods are shown as an expense in the income statement'],
        answers: [0, 1, 2], why: 'Debit drawings, credit purchases. Lower purchases mean the business does not bear the cost, so profit is not reduced; the drawings reduce the owner\'s capital instead.' },
      { skill: 'business-entity', kind: 'mcq', q: 'Ji-woo Han pays her home telephone bill from the business bank account and records it as a business expense. What is the effect?',
        options: ['Expenses are overstated and profit understated; business entity is broken', 'Expenses are understated and profit overstated; accruals is broken', 'Profit is correct, because the bill was paid from the business account', 'Drawings are overstated and capital understated; prudence is broken'],
        answer: 0, why: 'A private bill is not a business cost. Recording it as an expense makes expenses too high and profit too low; it should be drawings (business entity).' },
      { skill: 'business-entity', kind: 'mcq', q: 'A trader pays her son\'s school fees from the business bank account and records them as "Sundry expenses". What is the correct treatment?',
        options: ['Record the payment as drawings, as it is a private payment by the owner', 'Keep it as sundry expenses, as the business bank account was used', 'Record it as a prepayment, as the fees cover next term', 'Record it as a non-current asset, as education lasts for years'],
        answer: 0, why: 'Business entity: the fees are the owner\'s private spending. They are drawings, which reduce capital, not an expense of the business.' },
      { skill: 'misstatement', kind: 'mcq', q: 'If an expense owing at the year end is <b>not</b> recorded, what is the effect on the financial statements?',
        options: ['Profit is overstated and current liabilities are understated', 'Profit is understated and current liabilities are overstated', 'Profit is overstated and current assets are understated', 'Profit is correct but current assets are overstated'],
        answer: 0, why: 'The missing accrual means the expense is too low (profit too high) and the other payable is left out of current liabilities.' },
      { skill: 'misstatement', kind: 'mcq', q: 'If an expense paid in advance is <b>not</b> adjusted at the year end, what is the effect?',
        options: ['Profit is understated and current assets are understated', 'Profit is overstated and current assets are overstated', 'Profit is understated and current liabilities are overstated', 'Profit is overstated and current liabilities are understated'],
        answer: 0, why: 'All the cash paid stays as this year\'s expense, so profit is too low, and the prepayment (an other receivable, a current asset) is missing.' },
      { skill: 'misstatement', kind: 'mcq', q: 'Commission received in advance for next year is included in this year\'s income. What is the effect?',
        options: ['Profit is overstated and current liabilities are understated', 'Profit is understated and current liabilities are overstated', 'Profit is overstated and current assets are overstated', 'Profit is understated and current assets are understated'],
        answer: 0, why: 'Income is too high, so profit is overstated. The business owes next year\'s service, an other payable, which is missing from current liabilities.' },
      { skill: 'misstatement', kind: 'mcq', q: 'Interest earned on a business deposit but not yet received is left out of the accounts. What is the effect?',
        options: ['Profit is understated and current assets are understated', 'Profit is overstated and current assets are overstated', 'Profit is understated and current liabilities are understated', 'Profit is overstated and current liabilities are overstated'],
        answer: 0, why: 'The income earned this year is missing, so profit is too low, and the amount owed to the business (an other receivable) is missing from current assets.' },
      { skill: 'misstatement', kind: 'mcq', q: 'Goods taken by the owner for personal use are not recorded at all. What is the effect on the income statement?',
        options: ['Cost of sales is overstated, so profit is understated', 'Cost of sales is understated, so profit is overstated', 'Sales are overstated, so profit is overstated', 'Expenses are understated, so profit is overstated'],
        answer: 0, why: 'The goods are included in purchases but are not in closing inventory or sales, so cost of sales is too high and profit too low. Recording them as drawings fixes this.' },
      { skill: 'apply-to-item', kind: 'mcq', q: 'Insurance of $1,800 was paid on 1 October 2025 for the 12 months to 30 September 2026. The financial year ends on 31 December 2025. How does the accruals concept apply?',
        options: ['Only $450 belongs to 2025; the other $1,350 is a prepayment for 2026', 'All $1,800 belongs to 2025, because it was paid during 2025', 'Only $450 belongs to 2025; the other $1,350 is an accrual still owing', 'None belongs to 2025, because most of the cover falls in 2026'],
        answer: 0, why: 'Monthly cost = $1,800 / 12 = $150. October to December is 3 months = $450 for 2025. The remaining 9 months ($1,350) are paid in advance: an other receivable.' },
      { skill: 'apply-to-item', kind: 'mcq', q: 'Staff wages earned in the last week of the financial year are paid in the first week of the next year. How are they treated?',
        options: ['As an expense of this year, with the amount shown as an other payable', 'As an expense of next year, when the wages are actually paid', 'As a prepayment, with the amount shown as an other receivable', 'As drawings, because they are paid after the year end'],
        answer: 0, why: 'The work was done this year, so the cost is matched with this year\'s income. The unpaid amount is owed, so it is an accrual (other payable).' },
      { skill: 'apply-to-item', kind: 'mcq', q: 'Why do accrual and prepayment adjustments make year-on-year comparison more reliable?',
        options: ['Each year shows only the income and costs that belong to it, whatever the payment dates', 'Each year shows exactly the same amount of cash paid out for expenses, whatever the level of trading', 'Each year\'s profit is made equal so that trends are easy to read', 'They remove the need to prepare a statement of financial position'],
        answer: 0, why: 'Without adjustments, one year might include 13 months of rent and the next 11, depending on when bills were paid. Matching removes this distortion.' },
      { skill: 'apply-to-item', kind: 'multi', q: 'Which of these year-end items are adjusted because of the <b>accruals</b> concept?',
        options: ['Rent paid in advance', 'Wages owing', 'Commission receivable still owed to the business', 'Goods taken by the owner for personal use', 'Inventory valued at cost or net realisable value, whichever is lower'],
        answers: [0, 1, 2], why: 'Amounts owing or paid in advance are matched to the right period (accruals). Owner\'s goods are a business entity adjustment, and the inventory rule is prudence.' },
      { skill: 'answer-quality', kind: 'mcq', q: 'Asked to explain why an adjustment is made for wages owing, a student writes: "Because of the accruals concept." Why does this earn only 1 of 2 marks?',
        options: ['It names the concept but does not apply it to the wages or their effect', 'It names the wrong concept, because prudence is the concept for wages owing', 'It should have said that wages owing are an asset of the business', 'It should have said that wages are always paid in the next year'],
        answer: 0, why: 'The second mark is for application, for example: the wages were earned this year, so they must be matched with this year\'s income even though they are paid later.' },
      { skill: 'answer-quality', kind: 'mcq', q: 'Which answer best explains, using a concept, the adjustment for office stationery taken home by the owner?',
        options: ['Business entity: the owner is separate, so the stationery is drawings, not an office cost', 'Accruals: the stationery will be used next year, so it is carried forward', 'Prudence: the stationery taken home must be valued at cost or at its resale value, whichever is lower', 'Materiality: stationery is cheap, so it is left out of the accounts completely'],
        answer: 0, why: 'Personal use by the owner is a business entity issue. The stationery account is credited and drawings debited, so the business does not bear a private cost.' },
      { skill: 'answer-quality', kind: 'mcq', q: 'A student writes: "An accrual must be recorded." Which sentence is the best <b>development</b> of this point?',
        options: ['Otherwise the expense and current liabilities are understated and profit is overstated', 'Otherwise the business will not have enough cash to pay the amount owing when it falls due next year', 'Otherwise the owner will have to pay the amount from private funds', 'Otherwise the trial balance will not balance at the end of the year'],
        answer: 0, why: 'Development explains the effect on the financial statements. Leaving out an accrual omits a cost and a liability, so profit is too high. The trial balance still balances.' }
    ]
  };

  // =====================================================================
  var CLS = ['Other receivable (current asset)', 'Other payable (current liability)', 'Trade receivable (current asset)', 'Trade payable (current liability)'];
  function cls(skill, q, k, why) { return { skill: skill, kind: 'mcq', q: q, options: CLS.slice(), answer: k, why: why }; }
  function monthsAhead(e, y, n) { var m = e + n, yy = y + Math.floor(m / 12); m = m % 12; return lastDay(m, yy) + ' ' + MONTHS[m] + ' ' + yy; }
  function monthsBack(e, y, n) { var m = e - n, yy = y; while (m < 0) { m += 12; yy--; } return lastDay(m, yy) + ' ' + MONTHS[m] + ' ' + yy; }

  B['ACC-ADJ-13'] = {
    title: 'Other receivables and other payables: what they are and where they go',
    items: [
      cls('classify-item', 'At the year end a business has paid rent for the first two months of next year. How is this amount classified?', 0,
        'The business has paid for something it has not yet used, so it is owed a service: an expense paid in advance, an other receivable (current asset).'),
      cls('classify-item', 'At the year end staff are owed wages of $1,150 for work already done. How is this amount classified?', 1,
        'The business owes the wages for work done this year: an expense owing (accrual), an other payable (current liability). Trade payables are for goods bought on credit.'),
      cls('classify-item', 'A business lets part of its building. At the year end the tenant has already paid next month\'s rent. How is this amount classified by the business?', 1,
        'The business has received income it has not yet earned, so it owes the tenant the use of the space: income received in advance is an other payable.'),
      cls('classify-item', 'A business earns commission for selling another firm\'s products. At the year end $420 of commission has been earned but not yet received. How is this classified?', 0,
        'The business is owed money it has earned: income owing (accrued income) is an other receivable. Trade receivables are only for credit sales of goods.'),
      cls('classify-item', 'At the year end an electricity bill of $380 for the last quarter has been received but not paid. How is this amount classified?', 1,
        'The electricity was used this year and is still owed: an expense owing, which is an other payable, not a trade payable (not goods for resale).'),
      cls('classify-item', 'At the year end an insurance premium covering the first three months of next year has already been paid. How is this amount classified?', 0,
        'The cover for next year has been paid for but not used: a prepayment, shown as an other receivable under current assets.'),
      cls('classify-item', 'A fitness studio has received membership fees from members for next year\'s classes. How is this amount classified at the year end?', 1,
        'The studio owes its members classes they have paid for. Income received in advance is an other payable (current liability).'),
      { skill: 'asset-or-liability', kind: 'multi', q: 'Which of these year-end balances are <b>current liabilities</b>?',
        options: ['Rent receivable received in advance', 'Wages accrued', 'Rates paid in advance', 'Rent receivable still owed by a tenant', 'Insurance prepaid'],
        answers: [0, 1], why: 'Ask "who owes whom?". The business owes a service for rent received in advance and owes the wages, so both are other payables. The rest are owed to the business (other receivables).' },
      { skill: 'asset-or-liability', kind: 'multi', q: 'Which of these year-end balances would be shown as <b>other receivables</b>?',
        options: ['Advertising paid in advance', 'Interest receivable earned but not received', 'Loan interest owing by the business', 'Rent received in advance from a tenant', 'Provision for irrecoverable debts'],
        answers: [0, 1], why: 'Other receivables are expenses paid in advance and income still owed to the business. Interest owing by the business and income received in advance are other payables; the provision is deducted from trade receivables.' },
      { skill: 'asset-or-liability', kind: 'mcq', q: 'Which of these is an <b>asset</b> of the business at the year end?',
        options: ['Advertising paid in advance', 'Rent received in advance', 'Wages accrued', 'Loan interest owing'],
        answer: 0, why: 'Advertising paid in advance means the business is owed a service: an other receivable (current asset). The others are all amounts the business owes.' },
      { skill: 'asset-or-liability', kind: 'mcq', q: 'Which of these is <b>not</b> an other payable?',
        options: ['Provision for irrecoverable debts', 'Wages accrued at the year end', 'Rent received in advance', 'Electricity owing at the year end'],
        answer: 0, why: 'The provision is an estimate deducted from trade receivables, not an amount owed to anyone. The other three are owed by the business.' },
      { skill: 'balance-meaning', gen: function () {
        var acc = pick(['Rent', 'Insurance', 'Advertising', 'Rates', 'Electricity']), f = fy(), x = rint(12, 90) * 10;
        return mcq('The ' + acc.toLowerCase() + ' account shows this opening balance:' + tAcc(acc + ' Account', [[f.startShort, 'Balance b/d', x]], [], null) + 'What does the ' + money(x) + ' represent?',
          'An expense paid in advance: an other receivable', ['An expense owing: an other payable', 'Income received in advance: an other payable', 'Income owing: an other receivable'],
          'A debit balance on an expense account is an asset: last year the business paid ' + money(x) + ' for ' + acc.toLowerCase() + ' that belongs to this year (a prepayment).');
      } },
      { skill: 'balance-meaning', gen: function () {
        var acc = pick(['Wages', 'Electricity', 'Telephone', 'Rent', 'Loan interest']), f = fy(), x = rint(12, 90) * 10;
        return mcq('The ' + acc.toLowerCase() + ' account shows this opening balance:' + tAcc(acc + ' Account', [], [[f.startShort, 'Balance b/d', x]], null) + 'What does the ' + money(x) + ' represent?',
          'An expense owing: an other payable', ['An expense paid in advance: an other receivable', 'Income received in advance: an other payable', 'Income owing: an other receivable'],
          'A credit balance on an expense account is a liability: ' + money(x) + ' of ' + acc.toLowerCase() + ' belonging to last year was still unpaid (an accrual).');
      } },
      { skill: 'balance-meaning', gen: function () {
        var acc = pick(['Rent receivable', 'Commission receivable', 'Rent income']), f = fy(), x = rint(12, 90) * 10;
        return mcq('The ' + acc.toLowerCase() + ' account shows this opening balance:' + tAcc(acc + ' Account', [], [[f.startShort, 'Balance b/d', x]], null) + 'What does the ' + money(x) + ' represent?',
          'Income received in advance: an other payable', ['Income owing: an other receivable', 'An expense owing: an other payable', 'An expense paid in advance: an other receivable'],
          'Income is normally credited. A credit balance brought down on an income account means ' + money(x) + ' was received early, so the business owes that service: a liability.');
      } },
      { skill: 'balance-meaning', gen: function () {
        var acc = pick(['Rent receivable', 'Commission receivable', 'Interest receivable']), f = fy(), x = rint(12, 90) * 10;
        return mcq('The ' + acc.toLowerCase() + ' account shows this opening balance:' + tAcc(acc + ' Account', [[f.startShort, 'Balance b/d', x]], [], null) + 'What does the ' + money(x) + ' represent?',
          'Income owing: an other receivable', ['Income received in advance: an other payable', 'An expense paid in advance: an other receivable', 'An expense owing: an other payable'],
          'A debit balance on an income account is an asset: ' + money(x) + ' was earned last year but had not been received, so it is owed to the business.');
      } },
      { skill: 'definition', kind: 'mcq', q: 'Which is the best definition of <b>other payables</b> arising from expenses?',
        options: ['Expenses incurred in the year that remain unpaid at the financial year end', 'Expenses paid during the year that relate to the next financial year', 'Amounts owed to suppliers for goods bought on credit for resale', 'Amounts owed by customers for goods sold to them on credit'],
        answer: 0, why: 'An accrual is a cost already incurred (used) but not yet paid at the year end. Amounts owed to suppliers of goods are trade payables.' },
      { skill: 'definition', kind: 'mcq', q: 'Which is the best definition of <b>other receivables</b> arising from expenses?',
        options: ['Expenses paid before the year end that relate to the next financial period', 'Expenses incurred in the year that have not been paid by the year end', 'Amounts owed by customers for goods sold to them on credit', 'Cash received from customers before the goods are delivered'],
        answer: 0, why: 'A prepayment is paid now for a benefit that belongs to the next period, so the business is owed that benefit at the year end.' },
      { skill: 'definition', kind: 'mcq', q: 'A student defines a prepayment as "an expense paid in advance". Which addition would earn the second mark?',
        options: ['...at the end of the financial year, for a period that falls in the next year', '...by a customer, before the goods have been delivered to them', '...which is shown as a current liability in the statement of financial position', '...which is always the same amount as in the previous financial year'],
        answer: 0, why: 'A full definition gives what the amount is (expense paid in advance) and its timing (at the year end, relating to the next period). A prepayment is a current asset.' },
      { skill: 'who-owes-whom', kind: 'mcq', q: 'Why is rent received in advance from a tenant a liability of the business?',
        options: ['The business owes the tenant the use of the property for the months paid', 'The business has received cash, and cash received is always a liability', 'The tenant owes the business rent for the months already paid for', 'The rent is income of the current year, so it is shown as a liability'],
        answer: 0, why: 'The business has been paid but has not yet provided the service. It owes that service, so the amount is an other payable.' },
      { skill: 'who-owes-whom', kind: 'mcq', q: 'Why is an expense paid in advance an asset of the business?',
        options: ['The business is owed a service it has already paid for', 'The business owes the supplier for a service already received', 'The expense has been used up during the current year', 'Cash has left the business, so it must be a liability'],
        answer: 0, why: 'Paying early gives the business a right to a future benefit (for example insurance cover next year). A right to receive something is an asset: an other receivable.' },
      { skill: 'who-owes-whom', gen: function () {
        var f = fy(), n = pick([1, 2, 3, 4, 5, 7, 8, 9]), t = pick(TRADERS), what = pick(['insurance', 'rent', 'rates', 'a maintenance contract']);
        var mo = function (k) { return k + (k === 1 ? ' month' : ' months'); };
        return mcq('The financial year of ' + t + ' ends on ' + f.end + '. By that date ' + t + ' had paid for ' + what + ' up to ' + monthsAhead(f.e, f.y, n) + '. Which statement is correct at ' + f.end + '?',
          mo(n) + ' paid in advance: an other receivable', [mo(n) + ' paid in advance: an other payable', mo(12 - n) + ' paid in advance: an other receivable', mo(n) + ' owing: an other payable'],
          'From ' + f.end + ' to ' + monthsAhead(f.e, f.y, n) + ' is ' + mo(n) + ', paid before the year end for next year. The business is owed that benefit, so it is an other receivable.');
      } },
      { skill: 'who-owes-whom', gen: function () {
        var f = fy(), n = pick([1, 2, 3, 4, 5, 7]), t = pick(TRADERS), what = pick(['rent', 'loan interest', 'cleaning charges', 'electricity']);
        var mo = function (k) { return k + (k === 1 ? ' month' : ' months'); };
        return mcq('The financial year of ' + t + ' ends on ' + f.end + '. ' + t + ' had paid ' + what + ' only up to ' + monthsBack(f.e, f.y, n) + '. Which statement is correct at ' + f.end + '?',
          mo(n) + ' owing: an other payable', [mo(n) + ' owing: an other receivable', mo(12 - n) + ' owing: an other payable', mo(n) + ' paid in advance: an other receivable'],
          'From ' + monthsBack(f.e, f.y, n) + ' to ' + f.end + ' is ' + mo(n) + (n === 1 ? ' that has' : ' that have') + ' been used but not paid for. The business owes this amount, so it is an other payable.');
      } }
    ]
  };

  // =====================================================================
  var EXP = ['Rent', 'Insurance', 'Rates', 'Electricity', 'Advertising', 'Cleaning', 'Telephone'];
  function r10(a, b) { return rint(a, b) * 10; }

  B['ACC-ADJ-14'] = {
    title: 'Expense and income accounts with accruals and prepayments',
    items: [
      { skill: 'expense-charge', gen: function () {
        var acc = pick(EXP), f = fy(), a = r10(20, 90), p = r10(300, 1200), b = r10(15, 90), e = p - a - b;
        return numQ('For the year ended ' + f.end + ': on ' + f.start + ' ' + money(a) + ' of ' + acc.toLowerCase() + ' was owing. During the year ' + money(p) + ' was paid. At ' + f.end + ', ' + money(b) + ' had been paid in advance. Calculate the ' + acc.toLowerCase() + ' expense for the income statement. Give your answer in $.',
          e, money(p) + ' paid - ' + money(a) + ' (belongs to last year) - ' + money(b) + ' (belongs to next year) = ' + money(e) + '.');
      } },
      { skill: 'expense-charge', gen: function () {
        var acc = pick(EXP), f = fy(), a = r10(15, 80), p = r10(300, 1200), b = r10(20, 90), e = p + a + b;
        return numQ('For the year ended ' + f.end + ': on ' + f.start + ' ' + acc.toLowerCase() + ' of ' + money(a) + ' had been paid in advance. During the year ' + money(p) + ' was paid. At ' + f.end + ', ' + money(b) + ' was owing. Calculate the ' + acc.toLowerCase() + ' expense for the income statement. Give your answer in $.',
          e, money(p) + ' paid + ' + money(a) + ' (prepaid last year, used this year) + ' + money(b) + ' (owing, used this year) = ' + money(e) + '.');
      } },
      { skill: 'expense-charge', gen: function () {
        var f = fy(), a = r10(100, 400), p = r10(3000, 9000), b = r10(100, 400), e = p - a + b;
        return numQ('Wages owing on ' + f.start + ' were ' + money(a) + '. Wages paid during the year were ' + money(p) + ', including the amount owing at the start of the year. Wages owing at ' + f.end + ' were ' + money(b) + '. Calculate the wages expense for the year. Give your answer in $.',
          e, money(p) + ' - ' + money(a) + ' + ' + money(b) + ' = ' + money(e) + '. The opening amount owing was last year\'s cost; the closing amount owing is this year\'s.');
      } },
      { skill: 'expense-charge', gen: function () {
        var acc = pick(EXP), f = fy(), oPre = Math.random() < 0.5, a = r10(20, 90), p1 = r10(100, 500), p2 = r10(100, 500), b = r10(20, 90);
        var e = oPre ? a + p1 + p2 + b : p1 + p2 - a - b;
        var dr = [], cr = [];
        if (oPre) dr.push([f.startShort, 'Balance b/d', a]); else cr.push([f.startShort, 'Balance b/d', a]);
        dr.push(['', 'Bank', p1], ['', 'Bank', p2]);
        cr.push([f.endShort, 'Income statement', '?']);
        if (oPre) dr.push([f.endShort, 'Balance c/d', b]); else cr.push([f.endShort, 'Balance c/d', b]);
        var tot = oPre ? a + p1 + p2 + b : p1 + p2;
        return numQ('Find the transfer to the income statement in this account.' + tAcc(acc + ' Account', dr, cr, [tot, tot]) + 'Give your answer in $.',
          e, oPre ? 'Debit side total = ' + money(a) + ' + ' + money(p1) + ' + ' + money(p2) + ' + ' + money(b) + ' = ' + money(tot) + '. The only credit entry is the transfer, so it is ' + money(e) + '.'
                  : 'Debit side total = ' + money(p1) + ' + ' + money(p2) + ' = ' + money(tot) + '. Credit side: ' + money(tot) + ' - ' + money(a) + ' - ' + money(b) + ' = ' + money(e) + '.');
      } },
      { skill: 'expense-charge', gen: function () {
        var acc = pick(EXP), f = fy(), a = r10(20, 90), p = r10(400, 1500), b = r10(20, 90), e = p - a + b;
        return mcqMoney('A business paid ' + money(p) + ' for ' + acc.toLowerCase() + ' in the year ended ' + f.end + '. ' + money(a) + ' was owing at the start of the year and ' + money(b) + ' was owing at the end. What is the ' + acc.toLowerCase() + ' figure in the income statement?',
          e, [p, p + a + b, p + a - b], money(p) + ' - ' + money(a) + ' + ' + money(b) + ' = ' + money(e) + '. The cash paid is not the expense: the opening amount owing belongs to last year and the closing amount owing belongs to this year.');
      } },
      { skill: 'income-figure', gen: function () {
        var f = fy(), a = r10(30, 120), rcv = r10(400, 1500), b = r10(30, 120), inc = rcv + a + b;
        return numQ('A business lets a storeroom. On ' + f.start + ' the tenant had paid ' + money(a) + ' of rent in advance. During the year ended ' + f.end + ' the business received ' + money(rcv) + '. At ' + f.end + ' the tenant owed ' + money(b) + '. Calculate the rent receivable for the income statement. Give your answer in $.',
          inc, money(rcv) + ' received + ' + money(a) + ' (received last year, earned this year) + ' + money(b) + ' (earned, not yet received) = ' + money(inc) + '.');
      } },
      { skill: 'income-figure', gen: function () {
        var f = fy(), a = r10(30, 120), rcv = r10(400, 1500), b = r10(30, 120), inc = rcv - a - b;
        return numQ('On ' + f.start + ' ' + money(a) + ' of commission receivable was owed to the business. During the year ended ' + f.end + ', ' + money(rcv) + ' of commission was received. At ' + f.end + ', ' + money(b) + ' of commission had been received in advance. Calculate the commission receivable for the income statement. Give your answer in $.',
          inc, money(rcv) + ' - ' + money(a) + ' (earned last year) - ' + money(b) + ' (earned next year) = ' + money(inc) + '.');
      } },
      { skill: 'income-figure', gen: function () {
        var f = fy(), a = r10(30, 120), rcv = r10(500, 1600), b = r10(30, 120), inc = rcv - a + b;
        var dr = [[f.startShort, 'Balance b/d', a], [f.endShort, 'Income statement', '?']], cr = [['', 'Bank', rcv], [f.endShort, 'Balance c/d', b]];
        return numQ('Find the transfer to the income statement in this income account.' + tAcc('Rent Receivable Account', dr, cr, [rcv + b, rcv + b]) + 'Give your answer in $.',
          inc, 'Credit side total = ' + money(rcv) + ' + ' + money(b) + ' = ' + money(rcv + b) + '. Debit side: ' + money(rcv + b) + ' - ' + money(a) + ' = ' + money(inc) + '. The opening debit was rent owing from last year; the closing ' + money(b) + ' is rent owing this year.');
      } },
      { skill: 'income-figure', gen: function () {
        var f = fy(), a = r10(30, 120), rcv = r10(500, 1600), b = r10(30, 120), inc = rcv + a - b;
        return mcqMoney('Rent received in advance was ' + money(a) + ' at ' + f.start + ' and ' + money(b) + ' at ' + f.end + '. Rent received during the year was ' + money(rcv) + '. What is the rent income for the income statement?',
          inc, [rcv, rcv - a + b, rcv + a + b], money(rcv) + ' + ' + money(a) + ' (received last year, earned this year) - ' + money(b) + ' (received now, earned next year) = ' + money(inc) + '.');
      } },
      { skill: 'time-apportion', gen: function () {
        var f = fy(), k = rint(2, 10), m = ((f.e - k + 1) % 12 + 12) % 12, yr = m <= f.e ? f.y : f.y - 1, mon = rint(8, 60) * 5, ann = mon * 12;
        return numQ('The financial year ends on ' + f.end + '. On 1 ' + MONTHS[m] + ' ' + yr + ' a business paid an annual insurance premium of ' + money(ann) + ' for the 12 months from that date. Calculate the amount prepaid at ' + f.end + '. Give your answer in $.',
          mon * (12 - k), 'Monthly cost = ' + money(ann) + ' / 12 = ' + money(mon) + '. ' + k + ' months fall in this year, so ' + (12 - k) + ' months are prepaid: ' + (12 - k) + ' x ' + money(mon) + ' = ' + money(mon * (12 - k)) + '.');
      } },
      { skill: 'time-apportion', gen: function () {
        var f = fy(), mon = rint(15, 90) * 10, paid = rint(8, 11), owe = 12 - paid;
        return numQ('A trader rents a unit for ' + money(mon) + ' a month. During the year ended ' + f.end + ' only ' + paid + ' months\' rent was paid. Calculate the rent accrued (owing) at ' + f.end + '. Give your answer in $.',
          mon * owe, '12 months are used in the year, but only ' + paid + ' were paid. ' + owe + ' x ' + money(mon) + ' = ' + money(mon * owe) + ' is owing.');
      } },
      { skill: 'time-apportion', gen: function () {
        var f = fy(), q = rint(20, 120) * 30, owe = rint(1, 2), mon = q / 3;
        return numQ('A business pays for cleaning at ' + money(q) + ' per quarter, in arrears. At ' + f.end + ' the last ' + (owe === 1 ? 'month' : '2 months') + ' of cleaning had been carried out but not yet invoiced or paid. Calculate the amount to be accrued for cleaning at ' + f.end + '. Give your answer in $.',
          mon * owe, 'Monthly cost = ' + money(q) + ' / 3 = ' + money(mon) + '. ' + owe + ' x ' + money(mon) + ' = ' + money(mon * owe) + ' is owing for work already done.');
      } },
      { skill: 'time-apportion', gen: function () {
        var f = fy(), k = rint(3, 9), m = ((f.e - k + 1) % 12 + 12) % 12, yr = m <= f.e ? f.y : f.y - 1, mon = rint(10, 50) * 5, oldMon = mon - rint(0, 3) * 5, open = oldMon * (12 - k), ann = mon * 12, pre = mon * (12 - k), e = open + ann - pre;
        return numQ('Insurance prepaid on ' + f.start + ' was ' + money(open) + ', covering the period up to ' + monthsBack(f.e, f.y, k) + '. On 1 ' + MONTHS[m] + ' ' + yr + ' the business paid ' + money(ann) + ' for 12 months\' cover. The financial year ends on ' + f.end + '. Calculate the insurance expense for the year. Give your answer in $.',
          e, 'Closing prepayment = ' + (12 - k) + ' x (' + money(ann) + ' / 12) = ' + money(pre) + '. Expense = ' + money(open) + ' + ' + money(ann) + ' - ' + money(pre) + ' = ' + money(e) + '.');
      } },
      { skill: 'balance-side', gen: function () {
        var acc = pick(EXP), f = fy();
        return mcq('A trader\'s financial year ends on ' + f.end + '. How is the amount of ' + acc.toLowerCase() + ' <b>owing</b> on that date entered in the ' + acc.toLowerCase() + ' account?',
          'Debit side: Balance c/d on ' + f.end, ['Credit side: Balance c/d on ' + f.end, 'Debit side: Balance b/d on ' + f.next, 'Credit side: Income statement on ' + f.end],
          'The amount owing is part of this year\'s expense, so it is carried down on the debit side and brought down on the credit side on ' + f.next + ' as a liability.');
      } },
      { skill: 'balance-side', gen: function () {
        var acc = pick(EXP), f = fy();
        return mcq('An expense account shows ' + acc.toLowerCase() + ' paid in advance at ' + f.end + '. How is this balance <b>brought down</b> on ' + f.next + '?',
          'Debit side: Balance b/d', ['Credit side: Balance b/d', 'Debit side: Balance c/d', 'Credit side: Income statement'],
          'The prepayment is carried down on the credit side on ' + f.end + ' and brought down on the debit side on ' + f.next + ': a debit balance is an asset.');
      } },
      { skill: 'balance-side', gen: function () {
        var f = fy(), acc = pick(['rent receivable', 'commission receivable']);
        return mcq('In the ' + acc + ' account, income <b>received in advance</b> at ' + f.end + ' is carried down. Which entry is correct?',
          'Debit side: Balance c/d on ' + f.end, ['Credit side: Balance c/d on ' + f.end, 'Debit side: Balance b/d on ' + f.end, 'Credit side: Income statement on ' + f.end],
          'Income accounts are the reverse of expense accounts. Income received in advance is carried down on the debit side and brought down on the credit side as a liability.');
      } },
      { skill: 'balance-side', kind: 'multi', q: 'In an <b>expense</b> account, which of these entries are made on the debit side?',
        options: ['Cash paid during the year', 'Opening prepayment (Balance b/d)', 'Closing amount owing (Balance c/d)', 'Opening amount owing (Balance b/d)', 'Transfer to the income statement', 'Closing prepayment (Balance c/d)'],
        answers: [0, 1, 2], why: 'Debit side: opening prepayment b/d, cash paid and closing accrual c/d. Credit side: opening accrual b/d, the income statement transfer and closing prepayment c/d.' },
      { skill: 'consumables', gen: function () {
        var f = fy(), o = r10(15, 60), p = r10(80, 300), d = r10(2, 8), c = r10(10, 50), e = o + p - d - c;
        return numQ('Stationery account for the year ended ' + f.end + ': unused stationery at ' + f.start + ' was ' + money(o) + '. Stationery bought and paid for during the year was ' + money(p) + '. The owner took stationery costing ' + money(d) + ' for personal use. Unused stationery at ' + f.end + ' was ' + money(c) + '. Calculate the stationery expense for the income statement. Give your answer in $.',
          e, money(o) + ' + ' + money(p) + ' - ' + money(d) + ' (drawings) - ' + money(c) + ' (unused, carried down) = ' + money(e) + '.');
      } },
      { skill: 'consumables', gen: function () {
        var f = fy(), o = r10(20, 80), p = r10(150, 500), owe = r10(10, 60), c = r10(15, 70), e = o + p + owe - c;
        return numQ('Packaging materials for the year ended ' + f.end + ': unused packaging at ' + f.start + ' cost ' + money(o) + '. During the year ' + money(p) + ' was paid to suppliers of packaging. At ' + f.end + ' a packaging invoice of ' + money(owe) + ' was unpaid, and unused packaging cost ' + money(c) + '. Calculate the packaging expense. Give your answer in $.',
          e, money(o) + ' + ' + money(p) + ' + ' + money(owe) + ' (owing, used this year) - ' + money(c) + ' (unused) = ' + money(e) + '.');
      } },
      { skill: 'consumables', gen: function () {
        var x = r10(2, 9), t = pick(TRADERS);
        return mcq(t + ' took stationery costing ' + money(x) + ' from the business for personal use. How is this entered in the stationery account?',
          'Credit side, detail Drawings', ['Debit side, detail Drawings', 'Credit side, detail Income statement', 'Debit side, detail Bank'],
          'The stationery leaves the business, so the stationery account is credited ' + money(x) + ' and drawings are debited (business entity concept).');
      } },
      { skill: 'account-totals', gen: function () {
        var acc = pick(EXP), f = fy(), oPre = Math.random() < 0.5, cOwe = Math.random() < 0.5, a = r10(20, 90), p = r10(400, 1500), b = r10(20, 90);
        var dr = (oPre ? a : 0) + p + (cOwe ? b : 0), e = p + (oPre ? a : -a) + (cOwe ? b : -b);
        return numQ(acc + ' for the year ended ' + f.end + ': opening ' + (oPre ? 'prepayment' : 'amount owing') + ' ' + money(a) + '; paid during the year ' + money(p) + '; closing ' + (cOwe ? 'amount owing' : 'prepayment') + ' ' + money(b) + '. When the ' + acc.toLowerCase() + ' account is balanced, what is the total on each side? Give your answer in $.',
          dr, 'Debit side: ' + (oPre ? money(a) + ' b/d + ' : '') + money(p) + ' paid' + (cOwe ? ' + ' + money(b) + ' c/d' : '') + ' = ' + money(dr) + '. The credit side (' + (oPre ? '' : money(a) + ' b/d + ') + 'income statement ' + money(e) + (cOwe ? '' : ' + ' + money(b) + ' c/d') + ') has the same total.');
      } },
      { skill: 'spot-error', gen: function () {
        var acc = pick(EXP), f = fy(), k = rint(0, 2), a = r10(20, 90), p = r10(400, 1200), b = r10(20, 90), dr, cr, e;
        var O = ['The opening prepayment should be on the debit side', 'The closing prepayment c/d should be on the credit side', 'The balance b/d should be on the opposite side to the c/d', 'The bank payment should be on the credit side'];
        if (k === 0) { e = p - a; dr = [['', 'Bank', p]]; cr = [[f.startShort, 'Balance b/d (prepaid)', a], [f.endShort, 'Income statement', e]]; return mcq('A student prepared this account. There was a prepayment of ' + money(a) + ' at the start of the year and nothing owing or prepaid at the end.' + tAcc(acc + ' Account', dr, cr, [p, p]) + 'What is the error?', O[0], [O[1], O[2], O[3]], 'An opening prepayment is an asset, so it is a debit balance b/d. The expense should be ' + money(a) + ' + ' + money(p) + ' = ' + money(a + p) + '.'); }
        if (k === 1) { e = p + b; dr = [['', 'Bank', p], [f.endShort, 'Balance c/d (prepaid)', b]]; cr = [[f.endShort, 'Income statement', e]]; return mcq('A student prepared this account. Nothing was owing or prepaid at the start of the year; ' + money(b) + ' was prepaid at the end.' + tAcc(acc + ' Account', dr, cr, [e, e]) + 'What is the error?', O[1], [O[0], O[2], O[3]], 'A closing prepayment reduces the expense, so it is carried down on the credit side. The expense should be ' + money(p) + ' - ' + money(b) + ' = ' + money(p - b) + '.'); }
        e = p + b; dr = [['', 'Bank', p], [f.endShort, 'Balance c/d', b]]; cr = [[f.endShort, 'Income statement', e]];
        return mcq('A student prepared this account. ' + money(b) + ' was owing at the year end.' + tAcc(acc + ' Account', dr, cr, [e, e], [[f.nextShort, 'Balance b/d', b]], []) + 'What is the error?', O[2], [O[0], O[1], O[3]], 'The ' + money(b) + ' owing is carried down on the debit side, so it must be brought down on the credit side on ' + f.next + ', where it shows as a liability.');
      } },
      { skill: 'spot-error', gen: function () {
        var acc = pick(EXP), f = fy(), a = r10(20, 90), p = r10(500, 1500), b = r10(20, 90), e = p - a + b;
        return mcqMoney('A trader paid ' + money(p) + ' for ' + acc.toLowerCase() + ' during the year ended ' + f.end + ' and entered ' + money(p) + ' in the income statement. ' + money(a) + ' was owing at the start of the year and ' + money(b) + ' at the end. What should the income statement figure have been?',
          e, [p + a - b, p + a + b, p - a - b], 'Expense = cash paid - opening owing + closing owing = ' + money(p) + ' - ' + money(a) + ' + ' + money(b) + ' = ' + money(e) + '. Using the cash paid ignores the accruals concept.');
      } }
    ]
  };

  // =====================================================================
  B['ACC-ENV-05'] = {
    title: 'Technology in accounting: benefits, drawbacks and decisions',
    items: [
      { skill: 'benefits', kind: 'mcq', q: 'Which is a benefit of accounting software for a small trader?',
        options: ['A sale entered once updates all the related ledger accounts automatically', 'It removes any need for the trader to check the figures that are entered', 'It means that source documents such as invoices no longer need to be kept', 'It guarantees that the profit for the year will be higher than before'],
        answer: 0, why: 'Software completes the double entry and updates the ledgers from a single input, which saves time. It cannot spot wrong figures, does not replace documents and does not raise profit.' },
      { skill: 'benefits', kind: 'multi', q: 'Which of these are benefits of using technology in accounting?',
        options: ['Faster processing of transactions', 'Improved accuracy of calculations', 'Reports and financial statements produced quickly', 'No cost of training staff', 'No risk of data being lost', 'Wrong figures typed in are corrected automatically'],
        answers: [0, 1, 2], why: 'Speed, accurate calculations and quick reports are the main benefits. Training still costs money, data can still be lost, and software cannot know that a typed figure is wrong.' },
      { skill: 'benefits', kind: 'mcq', q: 'Accounting software gives the owner up-to-date information. Which sentence best develops why this matters?',
        options: ['The owner can see current receivables and quickly decide which customers to chase', 'The owner no longer needs to prepare an income statement at the end of each financial year', 'The owner can stop keeping a cash book because the bank holds the records', 'The owner will not need to record any transactions with credit customers'],
        answer: 0, why: 'A developed point links the benefit to a consequence for the business: current figures lead to quicker, better decisions such as chasing overdue debts.' },
      { skill: 'benefits', kind: 'mcq', q: 'How does accounting software improve the accuracy of the double entry?',
        options: ['Each transaction is posted to both accounts automatically, so the totals agree', 'Each transaction is checked against the supplier\'s records before it is saved', 'The software refuses to accept any figure that is larger than last year\'s', 'The software chooses the correct accounts even if the user picks the wrong ones'],
        answer: 0, why: 'Because the debit and credit are posted together, casting and posting errors are avoided. The software still relies on the user choosing the right accounts and amounts.' },
      { skill: 'benefits', kind: 'mcq', q: 'After computerising, a business produces its financial statements in two days instead of three weeks. Which benefit of technology is shown?',
        options: ['Speed of producing reports', 'Improved security of the data', 'Lower cost of hardware', 'Greater confidentiality'],
        answer: 0, why: 'The statements are ready much faster, which is the speed benefit. Nothing in the example concerns security, cost or confidentiality.' },
      { skill: 'drawbacks', kind: 'mcq', q: 'Which is a drawback of introducing accounting software?',
        options: ['Staff need training, which costs money and time', 'Reports take longer to produce than by hand', 'The double entry must still be completed by hand', 'Calculations become less accurate than before'],
        answer: 0, why: 'Training is a real cost of any new system. The other options are the opposite of what software does.' },
      { skill: 'drawbacks', kind: 'multi', q: 'Which of these are drawbacks of computerising a business\'s accounting records?',
        options: ['Cost of buying hardware and software', 'Risk of data loss through system failure or viruses', 'Time lost while staff learn the system', 'Slower production of the trial balance', 'More arithmetic errors in the totals'],
        answers: [0, 1, 2], why: 'Cost, data risk and training time are the drawbacks. Software makes the trial balance faster and the arithmetic more accurate, not worse.' },
      { skill: 'drawbacks', kind: 'mcq', q: 'Why might computerising the accounts reduce a trader\'s profit for the year, at least at first?',
        options: ['Running costs such as licence fees and training are expenses in the income statement', 'The computer hardware is treated as drawings by the owner and is taken out of the profit for the year', 'Customers buy less because they dislike computer-printed invoices', 'Closing inventory has to be valued lower once a computer is used'],
        answer: 0, why: 'Licence fees, training and support are revenue expenses, so they reduce profit. Hardware is a non-current asset (depreciated), not drawings.' },
      { skill: 'accuracy-limits', kind: 'mcq', q: 'A trader says: "Once I use accounting software, my accounts cannot contain errors." Why is this wrong?',
        options: ['If a wrong amount is typed in, the software posts the wrong amount', 'Software makes more arithmetic mistakes than a careful bookkeeper', 'Software can only record cash transactions, not credit ones', 'Software cannot produce a trial balance or financial statements'],
        answer: 0, why: 'Software adds and posts correctly, but it can only use the figures it is given. A wrong input gives a wrong output.' },
      { skill: 'accuracy-limits', kind: 'mcq', q: 'Which error would accounting software <b>not</b> prevent?',
        options: ['Entering a supplier invoice for $540 as $450', 'Adding up the sales journal incorrectly', 'Posting a debit entry without the matching credit', 'Balancing an account with the wrong total'],
        answer: 0, why: 'The software cannot know the invoice really said $540, so both entries will be $450. Totalling, posting both sides and balancing are done automatically.' },
      { skill: 'accuracy-limits', kind: 'mcq', q: 'Which statement is the best-balanced conclusion about accounting software and accuracy?',
        options: ['Calculations become more accurate, but the figures entered still need checking', 'Accounts become completely accurate, so all checking of figures by the owner can stop', 'Accounts become less accurate than records kept by hand', 'Accuracy depends only on how much the software costs'],
        answer: 0, why: 'A good evaluation weighs both sides: software removes arithmetic and posting errors, but input errors remain, so checks are still needed.' },
      { skill: 'spreadsheets', kind: 'mcq', q: 'What is the main benefit of using a spreadsheet to calculate monthly sales totals?',
        options: ['Formulae recalculate the totals automatically when a figure changes', 'The spreadsheet records the matching credit entry in the sales ledger', 'The spreadsheet stops any customer from paying late', 'The spreadsheet removes the need for sales invoices'],
        answer: 0, why: 'Spreadsheets do repeated calculations with formulae, so changing one figure updates every total at once, quickly and accurately.' },
      { skill: 'spreadsheets', kind: 'mcq', q: 'A trader keeps a spreadsheet listing 60 credit customers and the dates of their invoices. Which use gives the clearest benefit?',
        options: ['Sorting the balances by age to see quickly who is overdue', 'Making sure that every customer pays on the due date', 'Turning the trade receivables into a non-current asset', 'Removing the need to send invoices to customers'],
        answer: 0, why: 'Sorting and filtering let the trader spot overdue debts quickly and take action. A spreadsheet cannot make customers pay or change how assets are classified.' },
      { skill: 'spreadsheets', kind: 'mcq', q: 'Which is a limitation of a spreadsheet compared with accounting software?',
        options: ['It does not complete the double entry, so the user must set up and check formulae', 'It cannot carry out any calculations unless each one is typed in by hand', 'It cannot be used to list balances owed by customers or to suppliers', 'It cannot be saved, so all of the data entered is lost every time the computer is turned off'],
        answer: 0, why: 'A spreadsheet is a calculating grid, not a bookkeeping system. Formulae must be built correctly by the user, and a wrong formula gives wrong totals.' },
      { skill: 'evaluate-decision', kind: 'mcq', q: 'Mira Kovac has a small market stall with about 20 cash sales a day and no credit customers. She is thinking of paying $1,200 a year for accounting software. Which advice is best supported?',
        options: ['Probably not yet: the cost is high for the few simple records she keeps', 'Yes: software is always worth buying, whatever the size of the business', 'Yes: software will remove any need for her to keep receipts', 'No: software is not able to record cash sales at all'],
        answer: 0, why: 'The decision weighs benefits against costs. With so few, simple transactions the time saved is small compared with $1,200 a year, so a simple cash book or spreadsheet may do.' },
      { skill: 'evaluate-decision', kind: 'mcq', q: 'Kenji Arai\'s wholesale business has 300 credit customers, and his bookkeeper works long overtime at each year end. Which advice is best supported?',
        options: ['Yes: faster processing should cut overtime, though training costs must be paid first', 'No: accounting software is only really useful for businesses that have no credit customers at all', 'Yes: software will mean that no customer ever pays late again', 'No: computerised records cannot produce a trial balance'],
        answer: 0, why: 'With many transactions, speed and automatic reports bring real savings. A balanced answer still mentions the drawback (training cost) before deciding.' },
      { skill: 'evaluate-decision', kind: 'mcq', q: 'Which of these would earn <b>two</b> marks as a developed point in an evaluation of accounting software?',
        options: ['Software is faster, so the owner gets monthly reports sooner and can act on problems', 'Software is faster and more accurate and also produces reports and statements', 'Software is good and it is now used by a very large number of businesses', 'Software costs money, needs staff training, can be hacked by outsiders and can lose important data'],
        answer: 0, why: 'A developed point gives the benefit and its consequence for the business. A list of points without consequences earns at most one mark each and limits the answer.' },
      { skill: 'evaluate-decision', kind: 'mcq', q: 'An evaluation of buying accounting software lists three advantages, gives no disadvantages, and ends "so he should buy it". What would most improve it?',
        options: ['Adding a developed disadvantage, such as training cost, before the decision', 'Adding a fourth and a fifth advantage so that the list of benefits is longer and more complete', 'Removing the decision, because evaluations should not give one', 'Rewriting the advantages as one long sentence without examples'],
        answer: 0, why: 'Evaluate means weigh both sides, then judge. Without a disadvantage the answer is one-sided, which caps the marks however many advantages are listed.' },
      { skill: 'bookkeeper', kind: 'mcq', q: 'Ana Duarte is choosing between employing a part-time bookkeeper and learning to use accounting software herself. Which is a valid point about the bookkeeper option?',
        options: ['Wages are a running expense that reduces profit, but Ana needs no training', 'Wages are capital expenditure, so profit for the year is not affected', 'A bookkeeper removes all risk of errors from the accounts and the financial statements', 'Wages are treated as drawings, so they do not reduce profit'],
        answer: 0, why: 'A bookkeeper brings skill without Ana spending time on training, but the wages are an expense every year, which lowers profit.' },
      { skill: 'bookkeeper', kind: 'mcq', q: 'Which is an advantage of using accounting software rather than employing a bookkeeper?',
        options: ['Yearly running costs may be lower than paying a bookkeeper\'s wages', 'The software can judge whether a customer should be given credit', 'The software will never need any updates or support', 'The software removes the need to keep business records'],
        answer: 0, why: 'Once bought and learned, software usually costs less each year than a salary. It cannot replace judgement, and it still needs support and correct input.' },
      { skill: 'bookkeeper', kind: 'mcq', q: 'Which is an advantage of employing a qualified bookkeeper rather than the owner using software alone?',
        options: ['The bookkeeper\'s skill reduces the risk of wrong entries being made', 'The bookkeeper\'s wages do not count as an expense of the business', 'The bookkeeper makes calculations faster than a computer does', 'The bookkeeper removes any need for an accounting system'],
        answer: 0, why: 'Software is only as good as its input. An experienced bookkeeper is less likely to post to the wrong account or misread a document.' },
      { skill: 'data-risk', kind: 'mcq', q: 'Why is data loss a disadvantage of keeping accounting records on computer?',
        options: ['If files are damaged or deleted, records needed for the accounts may be gone', 'Computer files always take up much more office space than the same records kept on paper', 'Data on a computer can never be printed for the owner to read', 'Computer records cannot be used to prepare the financial statements'],
        answer: 0, why: 'A system failure, virus or mistake can wipe out records the business needs, which could stop it preparing accurate accounts or chasing debts.' },
      { skill: 'data-risk', kind: 'multi', q: 'Which of these are risks of keeping accounting records on computer?',
        options: ['Hacking by people outside the business', 'Loss of data if the computer fails', 'Viruses damaging files', 'Slower calculation of totals', 'Debits posted without matching credits'],
        answers: [0, 1, 2], why: 'Hacking, hardware failure and viruses are the main data risks. Software calculates faster and posts both sides of each entry automatically.' }
    ]
  };

  // =====================================================================
  function cq(skill, q, correct, wrongs, why) { return { skill: skill, kind: 'mcq', q: q, options: [correct].concat(wrongs), answer: 0, why: why }; }
  var Q = 'Which accounting concept is being applied?';
  var QN = 'Which accounting concept has <b>not</b> been applied?';

  B['ACC-ENV-04'] = {
    title: 'Spotting the concept behind an accounting treatment',
    items: [
      cq('business-entity', 'A trader paid for a family holiday from the business bank account and recorded the payment as drawings. ' + Q, 'Business entity', ['Materiality', 'Prudence', 'Consistency'],
        'The holiday is the owner\'s private spending. Treating it as drawings keeps the business separate from its owner.'),
      cq('business-entity', 'The insurance on the owner\'s private car is not included in the motor expenses of the business. ' + Q, 'Business entity', ['Accruals', 'Money measurement', 'Materiality'],
        'Only the business\'s own costs are recorded as expenses; the owner\'s private costs are kept out (business entity).'),
      cq('business-entity', 'Packets of coffee taken from a café\'s inventory by the owner for use at home are recorded as drawings. ' + Q, 'Business entity', ['Prudence', 'Consistency', 'Accruals'],
        'Goods taken for personal use are not a business cost, so they are drawings: the business is treated as separate from its owner.'),
      cq('business-entity', 'A trader recorded the cost of her daughter\'s birthday party as a business entertainment expense. ' + QN, 'Business entity', ['Materiality', 'Consistency', 'Money measurement'],
        'The party is private spending by the owner, so it should be drawings. Treating it as a business expense ignores business entity.'),
      cq('materiality', 'A stapler costing $12, which will last several years, is recorded as an office expense. ' + Q, 'Materiality', ['Business entity', 'Consistency', 'Money measurement'],
        'The stapler lasts more than a year, but its cost is too small to matter, so it is treated as an expense rather than a non-current asset.'),
      cq('materiality', 'A waste bin costing $18 is charged to general expenses instead of fixtures and fittings. ' + Q, 'Materiality', ['Prudence', 'Accruals', 'Business entity'],
        'The amount is too small to affect anyone\'s view of the accounts, so recording and depreciating it as an asset is not worthwhile.'),
      cq('materiality', 'A trader recorded a $9 pair of scissors as a non-current asset and plans to depreciate it over five years. ' + QN, 'Materiality', ['Consistency', 'Business entity', 'Money measurement'],
        'Such a cheap item should simply be an expense. Treating it as a non-current asset ignores materiality.'),
      cq('consistency', 'A business has depreciated its delivery vans at 25% reducing balance every year since it started. ' + Q, 'Consistency', ['Prudence', 'Materiality', 'Business entity'],
        'Using the same method every year means results can be compared fairly from one year to the next.'),
      cq('consistency', 'A trader switches between straight-line and reducing balance depreciation each year, choosing whichever gives the higher profit. ' + QN, 'Consistency', ['Materiality', 'Business entity', 'Money measurement'],
        'Changing method to suit the result makes profits impossible to compare between years, so consistency is broken.'),
      cq('consistency', 'Inventory is valued using the same method every year so that the gross profit of different years can be compared. ' + Q, 'Consistency', ['Money measurement', 'Business entity', 'Materiality'],
        'Keeping the same method each year is consistency. It allows fair comparison of results over time.'),
      cq('prudence', 'Damaged jackets in inventory are valued at the amount they can now be sold for, which is below their cost. ' + Q, 'Prudence', ['Consistency', 'Accruals', 'Materiality'],
        'Inventory is valued at the lower of cost and net realisable value so that assets and profit are not overstated.'),
      cq('prudence', 'A trader reduces trade receivables by an estimate of the debts that may not be paid. ' + Q, 'Prudence', ['Consistency', 'Materiality', 'Money measurement'],
        'A provision for irrecoverable debts stops trade receivables and profit being shown at more than they are really worth.'),
      cq('prudence', 'A trader values unsold goods at their expected selling price, which is well above what they cost. ' + QN, 'Prudence', ['Business entity', 'Materiality', 'Money measurement'],
        'Valuing inventory above cost counts a profit before the goods are sold and overstates assets. Prudence requires the lower of cost and net realisable value.'),
      cq('accruals', 'At the year end, rent of $400 that is owing is added to the rent expense for the year. ' + Q, 'Accruals', ['Business entity', 'Consistency', 'Money measurement'],
        'The rent belongs to this year even though it has not been paid, so it is matched with this year.'),
      cq('accruals', 'Insurance paid for next year is carried forward as an other receivable instead of being charged as this year\'s expense. ' + Q, 'Accruals', ['Business entity', 'Materiality', 'Money measurement'],
        'Each year is charged only with the cost that relates to it, so next year\'s insurance is carried forward.'),
      cq('accruals', 'Commission earned in the last month of the year but received after the year end is included in this year\'s income. ' + Q, 'Accruals', ['Consistency', 'Money measurement', 'Business entity'],
        'Income is recorded in the period in which it is earned, not when the cash arrives.'),
      cq('accruals', 'A trader records rent as an expense only when it is paid, and ignores $600 still owing at the year end. ' + QN, 'Accruals', ['Business entity', 'Consistency', 'Money measurement'],
        'The $600 relates to this year and should be added to the expense as an accrual. Recording only cash paid ignores the matching concept.'),
      cq('money-measurement', 'The loyalty of long-standing customers is not shown as an asset in the statement of financial position. ' + Q, 'Money measurement', ['Materiality', 'Business entity', 'Consistency'],
        'Customer loyalty has no reliable money value, so it cannot be recorded in the accounts.'),
      cq('money-measurement', 'A business does not record the friendly atmosphere of its shop, which attracts many shoppers, as an asset. ' + Q, 'Money measurement', ['Prudence', 'Materiality', 'Accruals'],
        'Only items that can be measured reliably in money are recorded. An atmosphere cannot be given a reliable money value.'),
      { skill: 'scenario-choice', kind: 'mcq', q: 'Which scenario is an application of the <b>money measurement</b> concept?',
        options: ['The good reputation of the business is not recorded as an asset', 'Damaged goods are valued below their cost price', 'The same depreciation method is used each year', 'The owner\'s home rent is recorded as drawings'],
        answer: 0, why: 'A reputation cannot be measured reliably in money, so it is left out. The others show prudence, consistency and business entity.' },
      { skill: 'scenario-choice', kind: 'mcq', q: 'Which scenario is an application of the <b>prudence</b> concept?',
        options: ['Inventory is valued at cost or net realisable value, whichever is lower', 'A $15 calculator is recorded as an office expense', 'Wages owing at the year end are added to wages', 'The owner\'s private phone bill is charged to drawings'],
        answer: 0, why: 'Valuing inventory at the lower figure avoids overstating assets and profit. The others show materiality, accruals and business entity.' },
      { skill: 'scenario-choice', kind: 'mcq', q: 'Which scenario <b>breaks</b> the business entity concept?',
        options: ['The owner\'s home electricity bill is charged to the business electricity account', 'A $10 desk lamp is charged to office expenses instead of equipment', 'The same rate of depreciation is used on equipment every year', 'Rent paid in advance is carried forward to the next year'],
        answer: 0, why: 'A private bill has been treated as a business cost. It should be drawings. The other scenarios correctly apply materiality, consistency and accruals.' },
      { skill: 'scenario-choice', kind: 'multi', q: 'Which <b>two</b> concepts are most often used to justify making a provision for irrecoverable debts?',
        options: ['Prudence', 'Accruals', 'Business entity', 'Money measurement', 'Materiality'],
        answers: [0, 1], why: 'Prudence stops receivables and profit being overstated; accruals matches the expected loss with the year of the credit sales.' }
    ]
  };
})();
