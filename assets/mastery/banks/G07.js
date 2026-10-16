/* Group G07 mastery bank: Manufacturing accounts; Data security and credit control; Bookkeeping extensions. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function step(a, b, s) { return s * rint(Math.ceil(a / s), Math.floor(b / s)); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function fmt(x) {
    var neg = x < 0, n = Math.abs(x), s = isInt(n) ? String(Math.round(n)) : n.toFixed(2);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + p.join('.');
  }
  function money(x) { return (x < 0 ? '-$' : '$') + fmt(Math.abs(x)); }
  function until(fn) { for (var i = 0; i < 1000; i++) { var r = fn(); if (r) return r; } throw new Error('no clean values'); }
  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // rows: [label, value] where value is a number (shown as money without $), a string, or '' ; head optional.
  function table(rows, head) {
    var h = '<table class="mc-table">';
    if (head) h += '<tr>' + head.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
    rows.forEach(function (r) {
      h += '<tr>' + r.map(function (c) { return '<td>' + (typeof c === 'number' ? fmt(c) : c) + '</td>'; }).join('') + '</tr>';
    });
    return h + '</table>';
  }
  function num(q, ans, why) { return { kind: 'num', q: q, answer: ans, unit: '$', display: fmt(ans), why: why }; }
  function mcqMoney(q, ans, wrongs, why) {
    var opts = [ans];
    wrongs.forEach(function (w) { w = Math.round(w); if (w > 0 && opts.indexOf(w) < 0) opts.push(w); });
    var k = 1;
    while (opts.length < 4) {
      var f = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * Math.max(100, R.roundSf(ans * 0.1, 1));
      if (f > 0 && opts.indexOf(f) < 0) opts.push(f);
      k++;
    }
    return { kind: 'mcq', q: q, options: opts.map(money), answer: 0, why: why };
  }
  function mcq(q, options, answer, why) { return { kind: 'mcq', q: q, options: options, answer: answer, why: why }; }

  var FIRMS = [
    ['Brightwell Ceramics', 'plates and bowls'], ['Kestrel Furniture', 'oak tables'], ['Mowbray Bottling', 'fruit cordials'],
    ['Tavi Footwear', 'leather sandals'], ['Corrin Glassworks', 'drinking glasses'], ['Elm Valley Toys', 'wooden toys'],
    ['Sandoval Paints', 'wall paint'], ['Orrin Cycles', 'bicycle frames'], ['Fenwick Candles', 'scented candles'], ['Lakeside Tiles', 'floor tiles']
  ];
  var YE = ['31 May 2026', '30 June 2026', '31 August 2026', '30 September 2026', '31 October 2025', '31 December 2025', '28 February 2026'];
  var PEOPLE = ['Amara', 'Bastian', 'Chiara', 'Desmond', 'Esi', 'Farid', 'Greta', 'Hiroshi', 'Ines', 'Jabari', 'Kalani', 'Lorcan', 'Mireille', 'Nkechi', 'Oskar', 'Priya', 'Quentin', 'Rosalind', 'Santiago', 'Tobias', 'Valentina', 'Wendell', 'Yusra', 'Zoltan'];
  var MONTHS = ['January', 'March', 'April', 'May', 'July', 'August', 'October', 'November'];
  var MEND = { January: 31, March: 31, April: 30, May: 31, July: 31, August: 31, October: 31, November: 30 };
  function poss(n) { return n + (/s$/.test(n) ? '’' : '’s'); }
  function firm() { var f = pick(FIRMS); return { name: f[0], prod: f[1], ye: pick(YE) }; }

  var PLACES4 = ['Prime cost', 'Factory overheads', 'Income statement', 'Statement of financial position'];

  // =====================================================================
  // ACC-FS-10 The three inventories of a manufacturer
  // =====================================================================
  B['ACC-FS-10'] = { title: 'The three inventories of a manufacturer', items: [
    // define
    { skill: 'define', kind: 'mcq', q: 'Which of the following best describes <b>work in progress</b> for a manufacturer?',
      options: ['Goods that are only partly made at the end of the year', 'Completed goods that are waiting to be sold', 'Materials bought but not yet put into production', 'Goods that customers have sent back because they were faulty'], answer: 0,
      why: 'Work in progress is the middle stage: production has started on these goods but they are not finished at the year end. Completed goods waiting to be sold are finished goods.' },
    { skill: 'define', kind: 'mcq', q: 'Which of the following best describes <b>raw materials</b> for a manufacturer?',
      options: ['Items bought to be made into products, not yet used', 'Every item that the business bought from suppliers during the year', 'Products that are partly made at the year end', 'Complete products bought in from another maker'], answer: 0,
      why: 'Raw materials are bought so they can be <i>converted</i> into the business’s products, and they have not yet entered production. Not every purchase is a raw material, for example office stationery is not.' },
    { skill: 'define', kind: 'mcq', q: 'Which of the following best describes <b>finished goods</b> for a manufacturer?',
      options: ['Products that are fully completed and ready for sale', 'Materials waiting in the store to be used', 'Products part-way through the production process', 'Goods that customers have already ordered and paid for in advance'], answer: 0,
      why: 'Finished goods have been through the whole production process and can be sold. Goods already sold are no longer inventory at all.' },
    { skill: 'define', kind: 'mcq', q: 'A student writes: “Work in progress is goods that have been made and are waiting in the warehouse to be sold.” What is wrong with this definition?',
      options: ['It describes finished goods, not work in progress', 'It describes raw materials, not work in progress', 'Nothing: the definition is correct', 'Work in progress is not an inventory at all'], answer: 0,
      why: 'Goods that are made and waiting to be sold are finished goods. Work in progress is goods that are only partly completed at the year end.' },
    { skill: 'define', kind: 'mcq', q: 'Which inventory has been through some, but not all, of the production process?',
      options: ['Raw materials', 'Work in progress', 'Finished goods', 'Finished goods purchased'], answer: 1,
      why: 'Work in progress has started production but is not complete. Raw materials have not started; finished goods have completed every stage.' },
    // classify
    { skill: 'classify', kind: 'mcq', q: 'Orrin Cycles makes bicycles. At its year end it has 40 frames that have been welded and painted, but no wheels or gears have been fitted. How should these frames be classified?',
      options: ['Raw materials', 'Work in progress', 'Finished goods', 'Non-current assets'], answer: 1,
      why: 'Production has started (welding and painting) but the bicycles are not complete, so the frames are work in progress.' },
    { skill: 'classify', kind: 'mcq', q: 'Brightwell Ceramics makes plates. At its year end it holds two tonnes of clay that it has bought but not yet shaped. How should the clay be classified?',
      options: ['Raw materials', 'Work in progress', 'Finished goods', 'Factory overheads'], answer: 0,
      why: 'The clay has been bought to be made into plates and production has not started on it, so it is raw materials.' },
    { skill: 'classify', kind: 'mcq', q: 'Tavi Footwear makes sandals. At its year end 600 pairs are fully stitched, boxed and stored ready for dispatch. How should these sandals be classified?',
      options: ['Raw materials', 'Work in progress', 'Finished goods', 'Trade receivables'], answer: 2,
      why: 'The sandals are complete and ready to be sold, so they are finished goods.' },
    { skill: 'classify', kind: 'mcq', q: 'Kestrel Furniture makes tables. It also buys some ready-made chairs from another firm and resells them unchanged. At the year end 15 of these bought-in chairs are unsold. How should they be classified?',
      options: ['Raw materials', 'Work in progress', 'Finished goods', 'Non-current assets'], answer: 2,
      why: 'Bought-in goods that are complete and ready to sell are finished goods, even though the business did not make them itself.' },
    { skill: 'classify', kind: 'multi', q: 'Fenwick Candles makes candles. Which of these items at the year end are <b>work in progress</b>?',
      options: ['Candles poured into moulds that have not yet set', 'Candles set but still waiting for wicks to be trimmed and labels added', 'Blocks of wax in the store room', 'Candles labelled and packed for shops', 'Reels of wick bought last week'], answers: [0, 1],
      why: 'Work in progress is anything production has started on but not finished: the unset and the unlabelled candles. Wax and wick are raw materials; packed candles are finished goods.' },
    { skill: 'classify', kind: 'multi', q: 'Mowbray Bottling makes fruit cordial. Which of these items at the year end are <b>raw materials</b>?',
      options: ['Sugar held in the store', 'Fruit delivered but not yet crushed', 'Cordial being mixed in the vats', 'Sealed and labelled bottles in the warehouse'], answers: [0, 1],
      why: 'Sugar and uncrushed fruit have not entered production, so they are raw materials. Cordial in the vats is work in progress; sealed bottles are finished goods.' },
    // where-used
    { skill: 'where-used', kind: 'mcq', q: 'Where are the opening and closing inventories of <b>raw materials</b> used to work out a cost?',
      options: ['Manufacturing account, in raw materials consumed', 'Income statement, in the cost of sales', 'Manufacturing account, in factory overheads', 'Income statement, deducted in administrative expenses'], answer: 0,
      why: 'Cost of raw materials consumed = opening raw materials + purchases − closing raw materials, which is worked out at the start of the manufacturing account.' },
    { skill: 'where-used', kind: 'mcq', q: 'Where are the opening and closing inventories of <b>work in progress</b> used?',
      options: ['Manufacturing account, after factory overheads', 'Income statement, in the cost of sales', 'Manufacturing account, inside prime cost', 'Income statement, deducted after the gross profit line'], answer: 0,
      why: 'Opening work in progress is added and closing work in progress deducted after prime cost and factory overheads, to reach production cost. They are not part of prime cost.' },
    { skill: 'where-used', kind: 'mcq', q: 'Where are the opening and closing inventories of <b>finished goods</b> used?',
      options: ['Income statement, in the cost of sales', 'Manufacturing account, in raw materials consumed', 'Manufacturing account, after factory overheads', 'Income statement, in selling expenses'], answer: 0,
      why: 'Finished goods are what the business sells, so their inventories are used in the cost of sales in the income statement, together with production cost.' },
    { skill: 'where-used', kind: 'mcq', q: 'In a manufacturer’s statement of financial position, where are the closing inventories of raw materials, work in progress and finished goods shown?',
      options: ['Current assets', 'Non-current assets', 'Current liabilities', 'Capital'], answer: 0,
      why: 'All three closing inventories are expected to be used or sold within a year, so they are current assets.' },
    { skill: 'where-used', kind: 'multi', q: 'Which of these inventory figures are used in the <b>manufacturing account</b>?',
      options: ['Opening raw materials', 'Closing raw materials', 'Opening work in progress', 'Closing work in progress', 'Closing finished goods', 'Opening finished goods'], answers: [0, 1, 2, 3],
      why: 'The manufacturing account uses raw materials and work in progress inventories. Finished goods inventories belong in the cost of sales in the income statement.' },
    // buy-in
    { skill: 'buy-in', kind: 'mcq', q: 'Why might a manufacturer buy finished goods from another business?',
      options: ['It cannot make enough itself to meet demand', 'To lower its work in progress at the year end', 'So it need not prepare a manufacturing account', 'To raise the prime cost of its own products'], answer: 0,
      why: 'If demand is higher than the factory can produce, for example after a machine breakdown, buying in finished goods lets the business keep supplying customers.' },
    { skill: 'buy-in', kind: 'mcq', q: 'Rivera Kitchens makes cupboards. Its main cutting machine broke down for six weeks. Which explanation of why it bought finished cupboards from another maker would earn both marks?',
      options: ['Output fell during the breakdown, so it bought cupboards to keep meeting customer orders', 'It bought cupboards because finished goods are always cheaper than making them', 'It wanted more goods, so it decided to buy some cupboards from another maker', 'It bought the cupboards so that its raw materials inventory would be lower at the end of the year'], answer: 0,
      why: 'Two marks need a reason (production fell because of the breakdown) and its development (buying in keeps customers supplied). The other answers are vague, wrong or not developed.' },
    { skill: 'buy-in', kind: 'mcq', q: 'Which of the following is <b>not</b> a sensible reason for a manufacturer to buy in finished goods?',
      options: ['To increase its closing inventory of raw materials', 'Customer demand is higher than its factory can produce', 'Some items are cheaper to buy than to make', 'It wants to offer products it cannot make itself'], answer: 0,
      why: 'Buying finished goods does not add to raw materials at all. The other three are reasons a manufacturer might buy completed products from another business.' },
    { skill: 'buy-in', kind: 'mcq', q: 'A manufacturer buys some finished goods from another supplier to resell. Where is the cost of these goods shown?',
      options: ['Income statement, added in the cost of sales', 'Manufacturing account, in raw materials consumed', 'Manufacturing account, as a factory overhead', 'Statement of financial position, as a non-current asset'], answer: 0,
      why: 'Bought-in finished goods were not made in the factory, so they skip the manufacturing account and are added to production cost in the cost of sales.' },
    { skill: 'buy-in', kind: 'mcq', q: 'Snowpeak makes sledges. In November its orders rise to twice what its factory can produce. Which action is most likely, and why?',
      options: ['Buy in finished sledges, because demand is above its production capacity', 'Buy extra raw materials, because its work in progress is too low', 'Reduce its finished goods, because it has too many sledges in store', 'Stop production for the season, because the factory cannot meet all of the orders'], answer: 0,
      why: 'When demand is higher than the factory can make, the business can buy finished goods from another maker so it does not lose the orders.' },
    // difference
    { skill: 'difference', kind: 'mcq', q: 'In which order do goods normally move through a factory?',
      options: ['Raw materials, then work in progress, then finished goods', 'Work in progress, then raw materials, then finished goods', 'Raw materials, then finished goods, then work in progress', 'Finished goods, then work in progress, then raw materials'], answer: 0,
      why: 'Materials are bought (raw materials), production starts on them (work in progress) and they are completed (finished goods).' },
    { skill: 'difference', kind: 'mcq', q: 'Which statement about the three inventories of a manufacturer is correct?',
      options: ['Raw materials become work in progress once production starts', 'Finished goods inventories are used to work out prime cost', 'Work in progress is completed goods waiting for a buyer', 'Raw materials include all of the goods that the business buys for resale'], answer: 0,
      why: 'Once work begins on raw materials they become work in progress. Finished goods are not in prime cost, and goods bought to resell unchanged are finished goods.' },
    { skill: 'difference', kind: 'mcq', q: 'Which explanation of the difference between the three inventories would earn all 3 marks?',
      options: ['Raw materials are bought to be made into products, whereas work in progress is partly made and finished goods are complete', 'Raw materials are all goods the business buys, whereas work in progress is partly made and finished goods are complete', 'Raw materials are bought to be made into products, whereas work in progress and finished goods are waiting to be sold', 'Raw materials are simply materials, whereas work in progress is goods in progress and finished goods are goods that are finished'], answer: 0,
      why: 'Each inventory needs its own correct stage: not yet used (raw materials), partly made (work in progress) and complete (finished goods). The other answers misdefine one term or just repeat the words.' },
    { skill: 'difference', kind: 'mcq', q: 'A manufacturer’s closing inventory of work in progress is $0. What does this tell you?',
      options: ['No goods were partly made at the year end', 'No raw materials were left in the store', 'Every finished product had been sold', 'The factory made no products in the year'], answer: 0,
      why: 'Work in progress counts only goods partly made at the year end. A zero figure says nothing about raw materials, finished goods or how much was made during the year.' }
  ] };

  // =====================================================================
  // ACC-FS-11 Preparing and correcting a manufacturing account
  // =====================================================================
  function classifyItem(item, ans, why) {
    return { skill: 'classify', kind: 'mcq', q: 'A manufacturer is preparing its financial statements. Where should <b>' + item + '</b> be shown?', options: PLACES4.slice(), answer: ans, why: why };
  }
  B['ACC-FS-11'] = { title: 'Preparing and correcting a manufacturing account', items: [
    // rm-consumed
    { skill: 'rm-consumed', gen: function () {
      var f = firm(), o = step(12000, 30000, 100), p = step(90000, 240000, 50), ci = step(1500, 6000, 10), c = step(10000, 32000, 100), co = step(1500, 5000, 10);
      var ans = o + p + ci - c;
      return num(f.name + ' makes ' + f.prod + '. The following figures are for the year ended ' + f.ye + '.' +
        table([['Opening inventory of raw materials', o], ['Purchases of raw materials', p], ['Carriage inwards on raw materials', ci], ['Carriage outwards', co], ['Closing inventory of raw materials', c]], ['Item', '$']) +
        'Calculate the cost of raw materials consumed. Give your answer in $.', ans,
        fmt(o) + ' + ' + fmt(p) + ' + ' + fmt(ci) + ' − ' + fmt(c) + ' = ' + money(ans) + '. Carriage inwards is part of the cost of raw materials; carriage outwards is a selling cost for the income statement.');
    } },
    { skill: 'rm-consumed', gen: function () {
      var f = firm(), o = step(9000, 26000, 100), p = step(80000, 200000, 50), ro = step(1200, 5000, 10), c = step(9000, 26000, 100);
      var ans = o + p - ro - c;
      return mcqMoney(f.name + ' had raw materials inventory of ' + money(o) + ' at the start of the year and ' + money(c) + ' at the end. It bought raw materials of ' + money(p) + ' and returned ' + money(ro) + ' of them to suppliers. What is the cost of raw materials consumed?',
        ans, [o + p + ro - c, c + p - ro - o, o + p - c],
        'Purchases returns reduce purchases: ' + fmt(o) + ' + (' + fmt(p) + ' − ' + fmt(ro) + ') − ' + fmt(c) + ' = ' + money(ans) + '. Opening inventory is added and closing inventory deducted.');
    } },
    { skill: 'rm-consumed', gen: function () {
      var f = firm(), o = step(10000, 25000, 100), p = step(100000, 220000, 50), ci = step(1000, 5000, 10), c = step(10000, 28000, 100);
      var used = o + p + ci - c;
      return num(poss(f.name) + ' manufacturing account shows cost of raw materials consumed of ' + money(used) + '. Opening inventory of raw materials was ' + money(o) + ', purchases of raw materials were ' + money(p) + ' and carriage inwards was ' + money(ci) + '. Calculate the closing inventory of raw materials. Give your answer in $.', c,
        'Materials available = ' + fmt(o) + ' + ' + fmt(p) + ' + ' + fmt(ci) + ' = ' + fmt(o + p + ci) + '. Closing inventory = available − consumed = ' + fmt(o + p + ci) + ' − ' + fmt(used) + ' = ' + money(c) + '.');
    } },
    // prime-cost
    { skill: 'prime-cost', gen: function () {
      var f = firm(), rmc = step(90000, 260000, 50), pw = step(60000, 150000, 100), sw = step(18000, 34000, 100), roy = step(6000, 40000, 100), ow = step(20000, 45000, 100);
      var ans = rmc + pw + roy;
      return num(f.name + ' has worked out the cost of raw materials consumed for the year as ' + money(rmc) + '. Other costs for the year:' +
        table([['Wages – production workers', pw], ['Wages – factory supervisor', sw], ['Royalties paid', roy], ['Wages – office staff', ow]], ['Item', '$']) +
        'Calculate the prime cost. Give your answer in $.', ans,
        'Prime cost = raw materials consumed + direct wages + direct expenses = ' + fmt(rmc) + ' + ' + fmt(pw) + ' + ' + fmt(roy) + ' = ' + money(ans) + '. Supervisor wages are a factory overhead and office wages go to the income statement.');
    } },
    { skill: 'prime-cost', gen: function () {
      var f = firm(), o = step(8000, 22000, 100), p = step(70000, 180000, 50), c = step(8000, 22000, 100), dw = step(50000, 120000, 100), roy = step(5000, 25000, 100), rent = step(12000, 30000, 100);
      var rmc = o + p - c, ans = rmc + dw + roy;
      return mcqMoney(f.name + ': opening raw materials ' + money(o) + ', purchases of raw materials ' + money(p) + ', closing raw materials ' + money(c) + ', direct wages ' + money(dw) + ', royalties ' + money(roy) + ', factory rent ' + money(rent) + '. What is the prime cost?',
        ans, [ans + rent, rmc + dw, c + p - o + dw + roy],
        'Raw materials consumed = ' + fmt(o) + ' + ' + fmt(p) + ' − ' + fmt(c) + ' = ' + fmt(rmc) + '. Prime cost = ' + fmt(rmc) + ' + ' + fmt(dw) + ' + ' + fmt(roy) + ' = ' + money(ans) + '. Factory rent is an overhead, added after prime cost.');
    } },
    { skill: 'prime-cost', gen: function () {
      var f = firm(), rmc = step(80000, 200000, 50), roy = step(5000, 30000, 100), dw = step(50000, 130000, 100);
      var pc = rmc + roy + dw;
      return num(poss(f.name) + ' prime cost for the year was ' + money(pc) + '. Cost of raw materials consumed was ' + money(rmc) + ' and royalties were ' + money(roy) + '. There were no other direct expenses. Calculate the direct (production) wages. Give your answer in $.', dw,
        'Prime cost = raw materials consumed + direct wages + royalties, so direct wages = ' + fmt(pc) + ' − ' + fmt(rmc) + ' − ' + fmt(roy) + ' = ' + money(dw) + '.');
    } },
    // overheads
    { skill: 'overheads', gen: function () {
      return until(function () {
        var f = firm(), rent = step(24000, 60000, 200), pre = step(1000, 6000, 100), sh = pick([60, 70, 75, 80]);
        var ans = (rent - pre) * sh / 100;
        if (!isInt(ans)) return null;
        return num(f.name + ' paid rent of ' + money(rent) + ' during the year ended ' + f.ye + '. Of this, ' + money(pre) + ' was paid in advance for the next year. The factory uses ' + sh + '% of the premises and the office uses the rest. Calculate the rent charged in the manufacturing account. Give your answer in $.', ans,
          'Adjust first, then apportion: (' + fmt(rent) + ' − ' + fmt(pre) + ') × ' + sh + '% = ' + fmt(rent - pre) + ' × ' + sh + '% = ' + money(ans) + '.');
      });
    } },
    { skill: 'overheads', gen: function () {
      return until(function () {
        var f = firm(), paid = step(10000, 30000, 100), acc = step(400, 2400, 100), sh = pick([75, 80, 90]);
        var ans = (paid + acc) * sh / 100;
        if (!isInt(ans) || !isInt(paid * sh / 100) || !isInt((paid - acc) * sh / 100)) return null;
        return mcqMoney(f.name + ' paid ' + money(paid) + ' for power in the year. A further ' + money(acc) + ' was owing at the year end. ' + sh + '% of the power is used in the factory. What amount of power is charged in the manufacturing account?',
          ans, [paid * sh / 100 + acc, (paid - acc) * sh / 100, (paid + acc) * (100 - sh) / 100],
          'The accrual is added before apportioning: (' + fmt(paid) + ' + ' + fmt(acc) + ') × ' + sh + '% = ' + money(ans) + '. The remaining ' + (100 - sh) + '% goes to the income statement.');
      });
    } },
    { skill: 'overheads', gen: function () {
      return until(function () {
        var f = firm(), C = step(60000, 200000, 1000), A = step(15000, Math.floor(C * 0.6), 1000), r = pick([10, 15, 20, 25]);
        var nbv = C - A, ans = nbv * r / 100;
        if (!isInt(ans)) return null;
        return mcqMoney(poss(f.name) + ' factory machinery cost ' + money(C) + ' and has accumulated depreciation of ' + money(A) + ' at the start of the year. Machinery is depreciated at ' + r + '% per year using the reducing balance method. What depreciation is charged in the manufacturing account for the year?',
          ans, [C * r / 100, A * r / 100, nbv - ans],
          'Reducing balance is charged on net book value: (' + fmt(C) + ' − ' + fmt(A) + ') × ' + r + '% = ' + fmt(nbv) + ' × ' + r + '% = ' + money(ans) + '.');
      });
    } },
    { skill: 'overheads', gen: function () {
      var f = firm(), sup = step(18000, 32000, 100), ins = step(4000, 9000, 100), ip = step(200, 1500, 100), heat = step(8000, 20000, 100), dep = step(6000, 18000, 100),
        osal = step(20000, 40000, 100), co = step(1500, 5000, 10), roy = step(5000, 20000, 100);
      var ans = sup + (ins - ip) + heat + dep;
      return num(f.name + ' gives the following factory and office costs for the year ended ' + f.ye + '. Factory insurance of ' + money(ins) + ' includes ' + money(ip) + ' paid in advance.' +
        table([['Factory supervisor wages', sup], ['Factory insurance', ins], ['Factory heat and light', heat], ['Depreciation – factory machinery', dep], ['Office salaries', osal], ['Carriage outwards', co], ['Royalties', roy]], ['Item', '$']) +
        'Calculate the total factory overheads. Give your answer in $.', ans,
        fmt(sup) + ' + (' + fmt(ins) + ' − ' + fmt(ip) + ') + ' + fmt(heat) + ' + ' + fmt(dep) + ' = ' + money(ans) + '. Royalties are in prime cost; office salaries and carriage outwards go to the income statement.');
    } },
    { skill: 'overheads', gen: function () {
      return until(function () {
        var f = firm(), C = step(40000, 150000, 1000), res = step(0, 20000, 1000), n = pick([4, 5, 8, 10]);
        var ans = (C - res) / n;
        if (!isInt(ans) || res >= C / 2) return null;
        return num(f.name + ' bought a factory machine for ' + money(C) + '. It is expected to last ' + n + ' years and have a residual value of ' + money(res) + '. It is depreciated using the straight line method. Calculate the depreciation for one year to include in factory overheads. Give your answer in $.', ans,
          '(Cost − residual value) ÷ useful life = (' + fmt(C) + ' − ' + fmt(res) + ') ÷ ' + n + ' = ' + money(ans) + '.');
      });
    } },
    { skill: 'overheads', kind: 'mcq', q: 'Insurance of $12,000 covers both factory and office, and $2,000 of it is prepaid at the year end. The factory share is 75%. Which working gives the correct factory charge?',
      options: ['($12,000 − $2,000) × 75% = $7,500', '$12,000 × 75% − $2,000 = $7,000', '($12,000 + $2,000) × 75% = $10,500', '($12,000 − $2,000) × 25% = $2,500'], answer: 0,
      why: 'Adjust the total for the prepayment first, then take the factory share: $10,000 × 75% = $7,500. The 25% office share goes to the income statement.' },
    // production-cost
    { skill: 'production-cost', gen: function () {
      var f = firm(), P = step(180000, 420000, 10), O = step(40000, 120000, 10), w1 = step(4000, 22000, 100), w2 = step(4000, 22000, 100);
      var ans = P + O + w1 - w2;
      return num(poss(f.name) + ' manufacturing account for the year ended ' + f.ye + ' shows prime cost of ' + money(P) + ' and total factory overheads of ' + money(O) + '. Work in progress was ' + money(w1) + ' at the start of the year and ' + money(w2) + ' at the end. Calculate the production cost. Give your answer in $.', ans,
        fmt(P) + ' + ' + fmt(O) + ' + ' + fmt(w1) + ' − ' + fmt(w2) + ' = ' + money(ans) + '. Opening work in progress is finished this year, so it is added; closing work in progress is not finished yet, so it is deducted.');
    } },
    { skill: 'production-cost', gen: function () {
      return until(function () {
        var f = firm(), P = step(150000, 380000, 10), sup = step(18000, 30000, 100), pow = step(9000, 20000, 100), dep = step(6000, 15000, 100), w1 = step(5000, 20000, 100), w2 = step(5000, 20000, 100), fg = step(15000, 40000, 100);
        if (w1 === w2 || fg === w2) return null;
        var O = sup + pow + dep, ans = P + O + w1 - w2;
        return mcqMoney(f.name + ': prime cost ' + money(P) + '; supervisor wages ' + money(sup) + '; factory power ' + money(pow) + '; depreciation of factory machinery ' + money(dep) + '; opening work in progress ' + money(w1) + '; closing work in progress ' + money(w2) + '; closing finished goods ' + money(fg) + '. What is the production cost?',
          ans, [P + O - w1 + w2, P + O, P + O + w1 - fg],
          'Overheads = ' + fmt(sup) + ' + ' + fmt(pow) + ' + ' + fmt(dep) + ' = ' + fmt(O) + '. Production cost = ' + fmt(P) + ' + ' + fmt(O) + ' + ' + fmt(w1) + ' − ' + fmt(w2) + ' = ' + money(ans) + '. Finished goods belong in the income statement.');
      });
    } },
    { skill: 'production-cost', gen: function () {
      var f = firm(), o = step(8000, 25000, 100), p = step(80000, 200000, 10), c = step(8000, 25000, 100), dw = step(60000, 140000, 100), roy = step(5000, 30000, 100),
        sup = step(18000, 32000, 100), pw = step(12000, 30000, 100), pa = step(300, 1500, 10), mc = step(60000, 150000, 1000), w1 = step(5000, 20000, 100), w2 = step(5000, 20000, 100),
        os = step(25000, 45000, 100), co = step(1500, 5000, 10);
      var rmc = o + p - c, prime = rmc + dw + roy, dep = mc / 10, oh = sup + pw + pa + dep, ans = prime + oh + w1 - w2;
      return num(f.name + ' makes ' + f.prod + '. Figures for the year ended ' + f.ye + ':' +
        table([['Inventory of raw materials at start', o], ['Inventory of raw materials at end', c], ['Purchases of raw materials', p], ['Direct wages', dw], ['Royalties', roy], ['Factory supervisor wages', sup], ['Factory power paid', pw], ['Factory machinery at cost', mc], ['Work in progress at start', w1], ['Work in progress at end', w2], ['Office salaries', os], ['Carriage outwards', co]], ['Item', '$']) +
        'Factory power of ' + money(pa) + ' is owing at the year end. Factory machinery is depreciated at 10% of cost. Calculate the production cost. Give your answer in $.', ans,
        'Raw materials consumed ' + fmt(rmc) + '; prime cost ' + fmt(rmc) + ' + ' + fmt(dw) + ' + ' + fmt(roy) + ' = ' + fmt(prime) + '. Overheads ' + fmt(sup) + ' + ' + fmt(pw + pa) + ' + ' + fmt(dep) + ' = ' + fmt(oh) + '. Production cost = ' + fmt(prime) + ' + ' + fmt(oh) + ' + ' + fmt(w1) + ' − ' + fmt(w2) + ' = ' + money(ans) + '.');
    } },
    // correction
    { skill: 'correction', gen: function () {
      var f = firm(), D = step(250000, 480000, 10);
      var pool = [
        function () { var x = step(15000, 35000, 100); return ['office salaries of ' + money(x) + ' were included in factory overheads', -x, '− ' + fmt(x) + ' (office salaries removed)']; },
        function () { var x = step(4000, 20000, 100); return ['royalties of ' + money(x) + ' were left out', x, '+ ' + fmt(x) + ' (royalties added)']; },
        function () { var x = step(5000, 18000, 100); return ['closing work in progress of ' + money(x) + ' was added instead of deducted', -2 * x, '− ' + fmt(2 * x) + ' (closing work in progress reversed: 2 × ' + fmt(x) + ')']; },
        function () { var x = step(1000, 6000, 10); return ['carriage inwards of ' + money(x) + ' was left out', x, '+ ' + fmt(x) + ' (carriage inwards added)']; },
        function () { var x = step(500, 2500, 10); return ['factory power owing of ' + money(x) + ' was not included', x, '+ ' + fmt(x) + ' (power accrual added)']; },
        function () { var x = step(2000, 9000, 100); return ['depreciation of office equipment of ' + money(x) + ' was charged as a factory overhead', -x, '− ' + fmt(x) + ' (office depreciation removed)']; }
      ];
      var errs = shuffled(pool).slice(0, 3).map(function (g) { return g(); });
      var ans = D + errs.reduce(function (s, e) { return s + e[1]; }, 0);
      return num(poss(f.name) + ' draft manufacturing account shows a production cost of ' + money(D) + '. The following errors were then found:<br>' +
        errs.map(function (e, i) { return (i + 1) + '. ' + e[0].charAt(0).toUpperCase() + e[0].slice(1) + '.'; }).join('<br>') +
        '<br>Calculate the corrected production cost. Give your answer in $.', ans,
        fmt(D) + ' ' + errs.map(function (e) { return e[2]; }).join(' ') + ' = ' + money(ans) + '.');
    } },
    { skill: 'correction', gen: function () {
      var x = step(3000, 15000, 100), f = firm();
      var cases = [
        ['closing work in progress of ' + money(x) + ' was added instead of being deducted', 'Overstated by ' + money(2 * x), 'Adding instead of deducting puts the figure ' + fmt(x) + ' too high and also misses the ' + fmt(x) + ' deduction, so production cost is ' + money(2 * x) + ' too high.'],
        ['opening work in progress of ' + money(x) + ' was deducted instead of being added', 'Understated by ' + money(2 * x), 'Deducting instead of adding moves the figure twice: ' + fmt(x) + ' missing plus ' + fmt(x) + ' wrongly taken off, so production cost is ' + money(2 * x) + ' too low.'],
        ['royalties of ' + money(x) + ' were left out', 'Understated by ' + money(x), 'Royalties are a direct expense in prime cost; leaving them out makes production cost ' + money(x) + ' too low.'],
        ['office rent of ' + money(x) + ' was included in factory overheads', 'Overstated by ' + money(x), 'Office rent belongs in the income statement; including it makes production cost ' + money(x) + ' too high.']
      ];
      var c = pick(cases);
      var opts = ['Overstated by ' + money(x), 'Understated by ' + money(x), 'Overstated by ' + money(2 * x), 'Understated by ' + money(2 * x)];
      return mcq('In ' + poss(f.name) + ' manufacturing account, ' + c[0] + '. What is the effect on production cost?', opts, opts.indexOf(c[1]), c[2]);
    } },
    // classify
    classifyItem('wages of a factory supervisor', 1, 'A supervisor does not make the products directly, so the wages are an indirect factory cost: a factory overhead.'),
    classifyItem('royalties paid for each item made', 0, 'Royalties paid per item made are a direct expense, so they are part of prime cost.'),
    classifyItem('carriage outwards', 2, 'Carriage outwards is the cost of delivering goods to customers, a selling expense in the income statement.'),
    classifyItem('wages of production-line workers', 0, 'Production workers make the products, so their pay is direct wages, part of prime cost.'),
    classifyItem('depreciation of office computers', 2, 'Office depreciation is an administrative expense in the income statement, not a factory cost.'),
    classifyItem('insurance of the factory building', 1, 'Factory insurance is an indirect cost of running the factory, so it is a factory overhead.'),
    classifyItem('carriage inwards on raw materials', 0, 'Carriage inwards is part of the cost of raw materials consumed, which is part of prime cost.'),
    { skill: 'classify', kind: 'multi', q: 'Which of these costs belong in a manufacturer’s <b>factory overheads</b>?',
      options: ['Rent of the factory', 'Depreciation of factory machinery', 'Factory supervisor wages', 'Direct wages of machine operators', 'Wages of the sales team', 'Royalties'], answers: [0, 1, 2],
      why: 'Factory overheads are indirect factory costs: factory rent, factory depreciation and supervisor wages. Direct wages and royalties are prime cost; sales wages go to the income statement.' }
  ] };

  // =====================================================================
  // ACC-FS-02 Preparing a manufacturer's income statement
  // =====================================================================
  function isPlace(item, ans, why) {
    return { skill: 'classify', kind: 'mcq', q: 'In a manufacturer’s financial statements, where is this item shown: <b>' + item + '</b>?',
      options: ['Manufacturing account', 'Income statement', 'Neither: statement of financial position only'], answer: ans, why: why };
  }
  B['ACC-FS-02'] = { title: 'Preparing a manufacturer’s income statement', items: [
    // cost-of-sales
    { skill: 'cost-of-sales', gen: function () {
      var f = firm(), ofg = step(15000, 40000, 100), pc = step(250000, 500000, 10), cfg = step(15000, 40000, 100), crm = step(10000, 25000, 100), cw = step(5000, 15000, 100);
      var ans = ofg + pc - cfg;
      return num(f.name + ' is a manufacturer. For the year ended ' + f.ye + ':' +
        table([['Production cost (from the manufacturing account)', pc], ['Opening inventory – finished goods', ofg], ['Closing inventory – finished goods', cfg], ['Closing inventory – raw materials', crm], ['Closing inventory – work in progress', cw]], ['Item', '$']) +
        'Calculate the cost of sales. Give your answer in $.', ans,
        fmt(ofg) + ' + ' + fmt(pc) + ' − ' + fmt(cfg) + ' = ' + money(ans) + '. Only finished goods inventories are used in the income statement; raw materials and work in progress stay in the manufacturing account.');
    } },
    { skill: 'cost-of-sales', gen: function () {
      return until(function () {
        var f = firm(), ofg = step(12000, 35000, 100), pc = step(200000, 450000, 10), fp = step(5000, 25000, 100), cfg = step(12000, 35000, 100), cw = step(4000, 15000, 100);
        if (cw === cfg) return null;
        var ans = ofg + pc + fp - cfg;
        return mcqMoney(f.name + ': opening finished goods ' + money(ofg) + ', production cost ' + money(pc) + ', finished goods bought from another maker ' + money(fp) + ', closing finished goods ' + money(cfg) + ', closing work in progress ' + money(cw) + '. What is the cost of sales?',
          ans, [ofg + pc - cfg, ofg + pc + fp - cw, ofg + pc - fp - cfg],
          fmt(ofg) + ' + ' + fmt(pc) + ' + ' + fmt(fp) + ' − ' + fmt(cfg) + ' = ' + money(ans) + '. Bought-in finished goods are added to production cost; work in progress is not used here.');
      });
    } },
    { skill: 'cost-of-sales', gen: function () {
      var f = firm(), ofg = step(15000, 35000, 100), pc = step(220000, 420000, 10), fp = step(4000, 18000, 100), cfg = step(15000, 35000, 100);
      var cos = ofg + pc + fp - cfg;
      return num(poss(f.name) + ' income statement shows cost of sales of ' + money(cos) + '. Opening finished goods were ' + money(ofg) + ', finished goods bought in were ' + money(fp) + ' and closing finished goods were ' + money(cfg) + '. Calculate the production cost brought from the manufacturing account. Give your answer in $.', pc,
        'Cost of sales = opening + production cost + bought in − closing, so production cost = ' + fmt(cos) + ' − ' + fmt(ofg) + ' − ' + fmt(fp) + ' + ' + fmt(cfg) + ' = ' + money(pc) + '.');
    } },
    // gross-profit
    { skill: 'gross-profit', gen: function () {
      var f = firm(), pc = step(220000, 420000, 10), rev = pc + step(90000, 220000, 100), ri = step(2000, 12000, 100), ofg = step(15000, 35000, 100), cfg = step(15000, 35000, 100);
      var cos = ofg + pc - cfg, ans = rev - ri - cos;
      return num(f.name + ', a manufacturer, has revenue of ' + money(rev) + ' and returns inwards of ' + money(ri) + '. Opening finished goods were ' + money(ofg) + ', production cost was ' + money(pc) + ' and closing finished goods were ' + money(cfg) + '. Calculate the gross profit. Give your answer in $.', ans,
        'Net revenue ' + fmt(rev) + ' − ' + fmt(ri) + ' = ' + fmt(rev - ri) + '. Cost of sales ' + fmt(ofg) + ' + ' + fmt(pc) + ' − ' + fmt(cfg) + ' = ' + fmt(cos) + '. Gross profit = ' + fmt(rev - ri) + ' − ' + fmt(cos) + ' = ' + money(ans) + '.');
    } },
    { skill: 'gross-profit', gen: function () {
      return until(function () {
        var f = firm(), pc = step(200000, 400000, 10), rev = pc + step(80000, 200000, 100), ri = step(3000, 10000, 100), ofg = step(14000, 30000, 100), cfg = step(14000, 30000, 100), orm = step(8000, 20000, 100), crm = step(8000, 20000, 100);
        if (orm === ofg || crm === cfg || orm === crm) return null;
        var cos = ofg + pc - cfg, ans = rev - ri - cos;
        return mcqMoney(f.name + ' gives: revenue ' + money(rev) + '; returns inwards ' + money(ri) + '; production cost ' + money(pc) + '; inventories at start – raw materials ' + money(orm) + ', finished goods ' + money(ofg) + '; inventories at end – raw materials ' + money(crm) + ', finished goods ' + money(cfg) + '. What is the gross profit?',
          ans, [rev - cos, rev - ri - (orm + pc - crm), rev - ri - (ofg + pc + cfg)],
          'Cost of sales uses finished goods only: ' + fmt(ofg) + ' + ' + fmt(pc) + ' − ' + fmt(cfg) + ' = ' + fmt(cos) + '. Gross profit = ' + fmt(rev) + ' − ' + fmt(ri) + ' − ' + fmt(cos) + ' = ' + money(ans) + '.');
      });
    } },
    // office-expense
    { skill: 'office-expense', gen: function () {
      return until(function () {
        var f = firm(), paid = step(20000, 48000, 200), acc = step(1000, 5000, 100), sh = pick([20, 25, 30, 40]);
        var ans = (paid + acc) * sh / 100;
        if (!isInt(ans)) return null;
        return num(f.name + ' paid rent of ' + money(paid) + ' for the year ended ' + f.ye + ', and ' + money(acc) + ' of rent was still owing at the year end. The office uses ' + sh + '% of the premises and the factory uses the rest. Calculate the rent shown in the income statement. Give your answer in $.', ans,
          'Add the accrual first, then take the office share: (' + fmt(paid) + ' + ' + fmt(acc) + ') × ' + sh + '% = ' + money(ans) + '.');
      });
    } },
    { skill: 'office-expense', gen: function () {
      return until(function () {
        var f = firm(), paid = step(6000, 16000, 100), pre = step(400, 2000, 100), sh = pick([20, 25, 40]);
        var ans = (paid - pre) * sh / 100, w1 = paid * sh / 100 - pre;
        if (!isInt(ans) || w1 <= 0 || !isInt((paid + pre) * sh / 100)) return null;
        return mcqMoney(f.name + ' paid insurance of ' + money(paid) + ' in the year, of which ' + money(pre) + ' was paid in advance. Insurance is shared ' + (100 - sh) + '% factory and ' + sh + '% office. What insurance is charged in the income statement?',
          ans, [w1, (paid - pre) * (100 - sh) / 100, (paid + pre) * sh / 100],
          'Deduct the prepayment, then apportion: (' + fmt(paid) + ' − ' + fmt(pre) + ') × ' + sh + '% = ' + money(ans) + '. Apportioning before adjusting gives the wrong figure.');
      });
    } },
    { skill: 'office-expense', gen: function () {
      return until(function () {
        var f = firm(), C = step(20000, 60000, 500), A = step(4000, Math.floor(C * 0.6), 500), r = pick([20, 25, 30]);
        var ans = (C - A) * r / 100;
        if (!isInt(ans)) return null;
        return num(poss(f.name) + ' office equipment cost ' + money(C) + '. At the start of the year its accumulated depreciation was ' + money(A) + '. It is depreciated at ' + r + '% per year using the reducing balance method. Calculate the depreciation charge for office equipment in the income statement. Give your answer in $.', ans,
          '(' + fmt(C) + ' − ' + fmt(A) + ') × ' + r + '% = ' + fmt(C - A) + ' × ' + r + '% = ' + money(ans) + '. Office equipment is not a factory cost, so all of it goes to the income statement.');
      });
    } },
    { skill: 'office-expense', gen: function () {
      return until(function () {
        var f = firm(), C = step(200000, 600000, 10000), r = pick([2, 4, 5]), sh = pick([20, 25, 40]);
        var dep = C * r / 100, ans = dep * sh / 100;
        if (!isInt(ans)) return null;
        return num(poss(f.name) + ' premises cost ' + money(C) + ' and are depreciated at ' + r + '% per year on cost. The office occupies ' + sh + '% of the premises and the factory the rest. Calculate the premises depreciation shown in the income statement. Give your answer in $.', ans,
          'Depreciation for the year = ' + fmt(C) + ' × ' + r + '% = ' + fmt(dep) + '. Office share = ' + fmt(dep) + ' × ' + sh + '% = ' + money(ans) + '; the rest is a factory overhead.');
      });
    } },
    // profit-for-year
    { skill: 'profit-for-year', gen: function () {
      var f = firm(), gp = step(110000, 260000, 10), aw = step(20000, 45000, 100), co = step(1500, 6000, 10), ore = step(6000, 15000, 100), sup = step(18000, 30000, 100), roy = step(5000, 20000, 100), fpow = step(8000, 20000, 100);
      var ans = gp - aw - co - ore;
      return num(poss(f.name) + ' gross profit for the year ended ' + f.ye + ' is ' + money(gp) + '. It also gives these costs, already adjusted and apportioned:' +
        table([['Administrative wages', aw], ['Carriage outwards', co], ['Office rent', ore], ['Factory supervisor wages', sup], ['Royalties', roy], ['Factory power', fpow]], ['Item', '$']) +
        'Calculate the profit for the year. Give your answer in $.', ans,
        'Only office and selling costs are deducted: ' + fmt(gp) + ' − ' + fmt(aw) + ' − ' + fmt(co) + ' − ' + fmt(ore) + ' = ' + money(ans) + '. Supervisor wages, royalties and factory power are already in production cost.');
    } },
    { skill: 'profit-for-year', gen: function () {
      return until(function () {
        var f = firm(), pc = step(200000, 380000, 10), rev = pc + step(100000, 220000, 100), ofg = step(14000, 30000, 100), cfg = step(14000, 30000, 100), adm = step(25000, 50000, 100), sell = step(8000, 20000, 100), ins = step(5000, 12000, 100), sh = pick([20, 25, 40]);
        var insO = ins * sh / 100;
        if (!isInt(insO)) return null;
        var gp = rev - (ofg + pc - cfg), ans = gp - adm - sell - insO;
        return num(f.name + ': revenue ' + money(rev) + '; opening finished goods ' + money(ofg) + '; production cost ' + money(pc) + '; closing finished goods ' + money(cfg) + '; administrative expenses ' + money(adm) + '; selling expenses ' + money(sell) + '; insurance for the whole premises ' + money(ins) + ', of which ' + sh + '% relates to the office. Calculate the profit for the year. Give your answer in $.', ans,
          'Gross profit = ' + fmt(rev) + ' − (' + fmt(ofg) + ' + ' + fmt(pc) + ' − ' + fmt(cfg) + ') = ' + fmt(gp) + '. Office insurance = ' + fmt(ins) + ' × ' + sh + '% = ' + fmt(insO) + '. Profit = ' + fmt(gp) + ' − ' + fmt(adm) + ' − ' + fmt(sell) + ' − ' + fmt(insO) + ' = ' + money(ans) + '.');
      });
    } },
    { skill: 'profit-for-year', gen: function () {
      return until(function () {
        var f = firm(), D = step(40000, 120000, 10), rent = step(20000, 40000, 100), sh = pick([20, 25, 30]), sup = step(18000, 30000, 100);
        var back = rent * (100 - sh) / 100;
        if (!isInt(back)) return null;
        var ans = D + back + sup;
        return num(poss(f.name) + ' draft income statement shows a profit for the year of ' + money(D) + '. Two errors were found: the full rent for the premises of ' + money(rent) + ' was charged, although the office uses only ' + sh + '%; and factory supervisor wages of ' + money(sup) + ' were included in the expenses. Calculate the corrected profit for the year. Give your answer in $.', ans,
          'Only ' + sh + '% of rent should be charged, so add back ' + (100 - sh) + '%: ' + fmt(back) + '. Supervisor wages belong in the manufacturing account, so add back ' + fmt(sup) + '. ' + fmt(D) + ' + ' + fmt(back) + ' + ' + fmt(sup) + ' = ' + money(ans) + '.');
      });
    } },
    // spot-error
    { skill: 'spot-error', gen: function () {
      var f = firm(), rev = step(380000, 600000, 100), ofg = step(15000, 35000, 100), pc = step(240000, 330000, 10), crm = step(10000, 25000, 100);
      var cos = ofg + pc - crm;
      var opts = ['Revenue', 'Opening inventory – finished goods', 'Production cost', 'Closing inventory – raw materials'];
      return mcq(f.name + ' prepared this draft trading section. Which line is wrong?' +
        table([['Revenue', '', rev], ['Opening inventory – finished goods', ofg, ''], ['Production cost', pc, ''], ['Closing inventory – raw materials', '(' + fmt(crm) + ')', ''], ['Cost of sales', '', '(' + fmt(cos) + ')'], ['Gross profit', '', rev - cos]], ['', '$', '$']),
        opts, 3, 'Cost of sales must use the closing inventory of <b>finished goods</b>. Raw materials inventories belong in the manufacturing account.');
    } },
    { skill: 'spot-error', gen: function () {
      var f = firm(), gp = step(120000, 240000, 10), aw = step(20000, 40000, 100), co = step(1500, 5000, 10), sup = step(18000, 30000, 100), oi = step(1500, 4000, 10);
      var tot = aw + co + sup + oi;
      var opts = ['Administrative wages', 'Carriage outwards', 'Factory supervisor wages', 'Office insurance'];
      return mcq(f.name + ' is a manufacturer. Its draft income statement lists these expenses. Which one should not be here?' +
        table([['Gross profit', '', gp], ['Administrative wages', aw, ''], ['Carriage outwards', co, ''], ['Factory supervisor wages', sup, ''], ['Office insurance', oi, ''], ['', '', '(' + fmt(tot) + ')'], ['Profit for the year', '', gp - tot]], ['', '$', '$']),
        opts, 2, 'Supervisor wages are a factory overhead in the manufacturing account. Administrative wages, carriage outwards and office insurance are income statement expenses.');
    } },
    { skill: 'spot-error', gen: function () {
      return until(function () {
        var f = firm(), rent = step(20000, 40000, 100), sh = pick([20, 25, 30]), os = step(25000, 45000, 100), C = step(10000, 30000, 1000), co = step(1500, 5000, 10);
        var dep = C * 20 / 100;
        if (!isInt(rent * sh / 100)) return null;
        var opts = ['Rent', 'Office salaries', 'Depreciation – office equipment', 'Carriage outwards'];
        return mcq(poss(f.name) + ' notes: rent for the whole premises was ' + money(rent) + ' and the office uses ' + sh + '%; office salaries were ' + money(os) + '; office equipment costing ' + money(C) + ' is depreciated at 20% of cost; carriage outwards was ' + money(co) + '. The draft income statement shows these expenses. Which figure is wrong?' +
          table([['Rent', rent], ['Office salaries', os], ['Depreciation – office equipment', dep], ['Carriage outwards', co]], ['Expense', '$']),
          opts, 0, 'Only the office share of rent belongs here: ' + fmt(rent) + ' × ' + sh + '% = ' + money(rent * sh / 100) + '. The other three figures match the notes.');
      });
    } },
    // classify
    isPlace('the closing inventory of finished goods (as a cost-of-sales figure)', 1, 'Finished goods inventories are used in the cost of sales in the income statement.'),
    isPlace('the closing inventory of raw materials (as a cost figure)', 0, 'Raw materials inventories are used to find raw materials consumed in the manufacturing account.'),
    isPlace('carriage outwards', 1, 'Carriage outwards is a selling expense, so it is deducted from gross profit in the income statement.'),
    isPlace('finished goods bought from another manufacturer', 1, 'Bought-in finished goods are added to production cost in the cost of sales in the income statement.'),
    isPlace('wages of the factory supervisor', 0, 'Supervisor wages are a factory overhead in the manufacturing account, not an income statement expense.'),
    isPlace('trade payables at the year end', 2, 'Trade payables are a current liability in the statement of financial position, not an income or expense.'),
    { skill: 'classify', kind: 'multi', q: 'Which of these are deducted from gross profit in a manufacturer’s income statement?',
      options: ['Office share of electricity', 'Wages of administration staff', 'Carriage outwards', 'Royalties paid per unit made', 'Depreciation of factory machinery'], answers: [0, 1, 2],
      why: 'Office, administration and selling costs reduce gross profit to profit for the year. Royalties and factory depreciation are in the manufacturing account.' },
    // layout
    { skill: 'layout', kind: 'mcq', q: 'In a manufacturer’s income statement, which figure takes the place that purchases has in a trader’s income statement?',
      options: ['Production cost', 'Prime cost', 'Raw materials consumed', 'Factory overheads'], answer: 0,
      why: 'Production cost is the cost of the goods finished in the year, so it is carried to the cost of sales in place of purchases.' },
    { skill: 'layout', kind: 'mcq', q: 'Which formula gives a manufacturer’s cost of sales?',
      options: ['Opening finished goods + production cost + finished goods bought − closing finished goods', 'Opening raw materials + production cost + finished goods bought − closing raw materials', 'Opening finished goods + prime cost + finished goods bought − closing finished goods', 'Opening work in progress + production cost + finished goods bought − closing work in progress'], answer: 0,
      why: 'Cost of sales is about finished goods: those on hand at the start, those made (production cost) and bought, less those still on hand at the end.' }
  ] };

  // =====================================================================
  // ACC-ENV-06 Keeping computer accounting data safe
  // =====================================================================
  B['ACC-ENV-06'] = { title: 'Keeping computer accounting data safe', items: [
    // access
    { skill: 'access', kind: 'mcq', q: 'Which measure stops people outside a business from getting into its computer system over the internet?',
      options: ['A firewall', 'A daily backup', 'A copy kept off-site', 'A larger hard drive'], answer: 0,
      why: 'A firewall checks traffic coming in from outside and blocks unauthorised access. Backups protect against loss, not access.' },
    { skill: 'access', kind: 'mcq', q: 'Sanjana wants only her accounts clerk to be able to log in to the payroll software. Which measure is most suitable?',
      options: ['A strong password for the clerk', 'A backup kept in the cloud', 'Printing the payroll each month', 'Buying a faster computer'], answer: 0,
      why: 'A password means only people who know it can log in, so it controls who has access to the payroll.' },
    { skill: 'access', kind: 'multi', q: 'Which of these help protect accounting data from <b>unauthorised access</b>?',
      options: ['Passwords for each user', 'A firewall', 'Encrypting the data', 'Taking a backup every evening', 'Printing reports weekly'], answers: [0, 1, 2],
      why: 'Passwords, firewalls and encryption stop people without permission from getting in or reading the data. Backups protect against loss.' },
    { skill: 'access', kind: 'mcq', q: 'Which software detects and removes harmful programs that could damage or steal accounting data?',
      options: ['Anti-virus software', 'Spreadsheet software', 'Payroll software', 'Word-processing software'], answer: 0,
      why: 'Anti-virus (and anti-spyware) software scans for harmful programs and removes them before they damage or steal data.' },
    { skill: 'access', kind: 'mcq', q: 'Why should passwords to an accounting system be changed regularly?',
      options: ['A password someone has found out soon stops working', 'The computer will run faster with a new password', 'It creates a fresh backup of all the data each time it is changed', 'It removes viruses already on the computer'], answer: 0,
      why: 'If a password has been seen or guessed, changing it regularly limits how long someone could use it to get in.' },
    { skill: 'access', kind: 'mcq', q: 'How does encryption protect accounting data?',
      options: ['Stolen data cannot be read without the key', 'It makes a second copy of every file', 'It stops the computer losing power', 'It removes viruses from email attachments'], answer: 0,
      why: 'Encryption scrambles the data, so anyone who gets hold of it cannot read it without the key. This keeps it confidential.' },
    { skill: 'access', kind: 'mcq', q: 'Okafor Ltd lets its junior clerks open only the sales ledger, while the accountant can open every part of the system. What is this measure called?',
      options: ['Access levels', 'Backing up', 'Off-site storage', 'Anti-virus software'], answer: 0,
      why: 'Giving each user access only to the parts they need limits who can see or change sensitive records.' },
    // loss
    { skill: 'loss', kind: 'mcq', q: 'The hard drive holding Teodor’s accounts fails. Which earlier measure lets him restore his records?',
      options: ['Regular backups', 'A firewall', 'Strong passwords', 'Encryption'], answer: 0,
      why: 'A backup is a copy of the data, so the records can be restored after the drive fails. The other measures stop access, not loss.' },
    { skill: 'loss', kind: 'mcq', q: 'Why should backup copies be kept off-site or in the cloud rather than in the same office?',
      options: ['A fire or flood at the office would not destroy both copies', 'It stops hackers from reaching the main office computer over the internet', 'It makes the accounting software calculate faster', 'It means staff no longer need any passwords'], answer: 0,
      why: 'If the only backup sits next to the computer, one fire, flood or theft can destroy both. A copy elsewhere survives.' },
    { skill: 'loss', kind: 'multi', q: 'Which of these protect accounting data against <b>loss</b>?',
      options: ['Taking a backup at the end of each day', 'Storing a backup copy away from the office', 'Using a longer password', 'Locking the screen when away from the desk'], answers: [0, 1],
      why: 'Regular backups stored somewhere else let lost data be restored. Passwords and screen locks protect against access, not loss.' },
    { skill: 'loss', kind: 'mcq', q: 'How often should a busy business back up its accounting data?',
      options: ['Regularly, such as after each day’s work', 'Only once the year-end accounts are finished', 'Only when the computer is replaced', 'Never, if it has a firewall'], answer: 0,
      why: 'Backups only hold what was saved up to that point, so regular backups mean little data is lost if something goes wrong.' },
    { skill: 'loss', kind: 'mcq', q: 'Bianca’s office laptop is stolen. Her accounts were backed up to the cloud last night. What does the backup achieve?',
      options: ['She can restore her records on a new computer', 'The thief cannot switch on the laptop', 'The laptop will be found and returned', 'Her customers’ details stay confidential'], answer: 0,
      why: 'A backup protects against data loss: the records can be restored. It does not stop the thief reading the laptop; encryption and passwords do that.' },
    // match-risk
    { skill: 'match-risk', kind: 'mcq', q: 'A clerk opens an email attachment that installs a harmful program. Which measure would have helped most?',
      options: ['Anti-virus software', 'Off-site backups', 'A locked filing cabinet', 'A second monitor'], answer: 0,
      why: 'Anti-virus software detects and blocks harmful programs before they can damage or steal data.' },
    { skill: 'match-risk', kind: 'mcq', q: 'A former employee of Delacroix Traders still knows the login details for the accounting system. What should the business do?',
      options: ['Remove the user and change the passwords', 'Take an extra backup of the data', 'Install a larger hard drive', 'Print all of the ledgers every week and file them'], answer: 0,
      why: 'Removing the account and changing passwords stops someone who should no longer have access from logging in.' },
    { skill: 'match-risk', kind: 'mcq', q: 'Someone keeps trying to reach a firm’s accounting server from outside, over the internet. Which measure blocks this?',
      options: ['A firewall', 'A daily backup', 'A cloud copy', 'A printed trial balance'], answer: 0,
      why: 'A firewall blocks unauthorised connections from outside the business.' },
    { skill: 'match-risk', kind: 'mcq', q: 'A sales rep keeps customers’ bank details on a laptop that might be lost on a train. Which measure keeps those details confidential if it is lost?',
      options: ['Encrypting the data on the laptop', 'Backing up the laptop each day', 'Installing a faster processor', 'Saving the files in a new folder'], answer: 0,
      why: 'Encrypted data cannot be read by whoever finds the laptop. A backup would restore the data but would not keep it confidential.' },
    { skill: 'match-risk', kind: 'mcq', q: 'A visitor reads the sales ledger on a screen left switched on at an empty desk. Which data security issue is this?',
      options: ['Confidentiality', 'Data loss', 'Hardware failure', 'Slow processing'], answer: 0,
      why: 'Private business information has been seen by someone who should not see it, which is a confidentiality issue. Nothing has been lost.' },
    { skill: 'match-risk', kind: 'mcq', q: 'A power cut corrupts the file a bookkeeper was working on. Which data security issue is this, and which measure deals with it?',
      options: ['Data loss: restore from a backup', 'Unauthorised access: use a firewall', 'Confidentiality: encrypt the data', 'Unauthorised access: change the password'], answer: 0,
      why: 'The data has been damaged, so this is data loss. A recent backup lets the file be restored.' },
    // answer-quality
    { skill: 'answer-quality', kind: 'mcq', q: 'A question asks: “State one way to protect data in a computerised accounting system.” Which answer would earn the mark?',
      options: ['Install anti-virus software', 'Be careful with the computer', 'Computers are faster than people', 'Keep the data nice and safe'], answer: 0,
      why: 'The mark needs a specific protection method. “Be careful” and “keep it safe” are too vague, and speed is a benefit of computers, not a protection method.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'A student states two ways to protect data: “passwords” and “secret login codes”. Why would only one mark be given?',
      options: ['Both answers describe the same method', 'Passwords do not protect data at all', 'Login codes are a type of backup, not a security measure', 'Each answer needs a full paragraph'], answer: 0,
      why: 'A password and a secret login code are the same idea, and the same idea repeated earns one mark. A second, different method such as a firewall was needed.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'Which of these is a benefit of computerised accounting, <b>not</b> a way of protecting data?',
      options: ['Totals are calculated automatically', 'Data is backed up off-site', 'Users must enter a password', 'A firewall blocks outside access'], answer: 0,
      why: 'Automatic calculation is a benefit of using a computer. The other three are security measures.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'A question asks for two ways to stop <b>unauthorised access</b> to accounting data. Which pair earns both marks?',
      options: ['Passwords and a firewall', 'Backups and passwords', 'Passwords and login codes', 'A firewall and being careful'], answer: 0,
      why: 'Passwords and firewalls are two different access controls. Backups protect against loss, login codes repeat passwords, and “being careful” is vague.' },
    { skill: 'answer-quality', kind: 'multi', q: 'Which of these answers would each earn a mark when asked to state ways to protect accounting data?',
      options: ['Firewall', 'Anti-spyware software', 'Regular backups kept off-site', 'Work more quickly', 'Use a bigger screen'], answers: [0, 1, 2],
      why: 'Firewalls, anti-spyware and off-site backups are specific protection methods. Working quickly or using a bigger screen does nothing to protect data.' }
  ] };

  // =====================================================================
  // ACC-ADJ-08 Credit control and whether to sell on credit
  // =====================================================================
  B['ACC-ADJ-08'] = { title: 'Credit control and whether to sell on credit', items: [
    // measures
    { skill: 'measures', kind: 'mcq', q: 'Which of these would encourage credit customers to pay on time?',
      options: ['A cash discount for paying within 14 days', 'A trade discount on large orders', 'Longer credit terms of 90 days', 'A larger provision for irrecoverable debts'], answer: 0,
      why: 'A cash discount rewards customers who pay within the time allowed. Trade discount is for buying in bulk, and a provision does not change customer behaviour.' },
    { skill: 'measures', kind: 'multi', q: 'Which steps would help a trader reduce irrecoverable debts?',
      options: ['Check a new customer’s credit history first', 'Set a credit limit for each customer', 'Stop supplying customers with overdue balances', 'Give credit to every new customer straight away', 'Offer a bigger trade discount'], answers: [0, 1, 2],
      why: 'Checking credit history, limiting how much each customer can owe and stopping supplies to late payers all reduce the risk of debts that are never paid.' },
    { skill: 'measures', kind: 'mcq', q: 'Which single change would remove the risk of irrecoverable debts completely?',
      options: ['Selling only for cash', 'Sending monthly statements', 'Setting credit limits', 'Charging interest on late payment'], answer: 0,
      why: 'If no goods are sold on credit, no customer can fail to pay later. The other measures reduce the risk but do not remove it.' },
    { skill: 'measures', kind: 'mcq', q: 'How does sending each credit customer a statement of account every month help credit control?',
      options: ['It reminds customers how much they owe and that it is due', 'It gives customers a bigger discount for buying more goods at once', 'It increases the credit period allowed to customers', 'It records the sale in the sales day book'], answer: 0,
      why: 'A regular statement reminds the customer of the balance due, which prompts them to pay.' },
    { skill: 'measures', kind: 'mcq', q: 'How does charging interest on overdue accounts encourage customers to pay on time?',
      options: ['Customers pay promptly to avoid the extra charge', 'It lowers the price of goods for every customer', 'It removes the need to send statements', 'It turns credit sales into cash sales'], answer: 0,
      why: 'Late payers would owe more, so customers have a reason to pay within the agreed time.' },
    { skill: 'measures', kind: 'mcq', q: 'Halvorsen says: “I give a 10% trade discount, so my customers pay quickly.” What is wrong with his reasoning?',
      options: ['Trade discount does not depend on when the customer pays', 'Trade discount is only ever given to customers who pay in cash', 'Trade discount increases irrecoverable debts', 'Trade discount is recorded in the cash book'], answer: 0,
      why: 'Trade discount is a reduction for trade or bulk buyers, given whatever the payment date. Only a cash discount rewards paying early.' },
    { skill: 'measures', kind: 'mcq', q: 'What does credit control mean?',
      options: ['Managing credit customers so they pay in full and on time', 'Recording every credit sale in the sales day book', 'Writing off debts that customers will never pay', 'Deciding the trade discount for each customer'], answer: 0,
      why: 'Credit control is about getting money from credit customers in full and on time, for example by setting limits and chasing late payers.' },
    // adv-disadv
    { skill: 'adv-disadv', kind: 'mcq', q: 'Ngozi sells only for cash and is thinking of offering credit. Which is an advantage of this?',
      options: ['More customers may buy, so revenue may rise', 'Cash from sales will be received sooner', 'There will be no risk of irrecoverable debts', 'She will need less money to pay suppliers'], answer: 0,
      why: 'Offering credit can attract customers who cannot or will not pay straight away, which can raise revenue and profit. Cash would arrive later, not sooner.' },
    { skill: 'adv-disadv', kind: 'mcq', q: 'Which is a disadvantage of selling on credit?',
      options: ['Some customers may never pay, which reduces profit', 'Customers may buy more goods than before', 'Revenue may rise because more people buy', 'The trader can compete with rivals who offer credit'], answer: 0,
      why: 'Irrecoverable debts are written off as an expense, so profit falls. The other three are advantages.' },
    { skill: 'adv-disadv', kind: 'mcq', q: 'Pietro plans to stop selling on credit and sell only for cash. Which is an advantage of his plan?',
      options: ['Cash comes in at once, improving liquidity', 'Customers who want credit will stay loyal', 'Revenue is certain to rise next year', 'His trade payables will be paid by customers'], answer: 0,
      why: 'Cash sales bring money in at the time of sale, so the business has more cash available to pay its debts.' },
    { skill: 'adv-disadv', kind: 'mcq', q: 'Pietro plans to stop selling on credit and sell only for cash. Which is a disadvantage of his plan?',
      options: ['Customers wanting credit may go to rivals, so revenue falls', 'Irrecoverable debts are likely to increase next year', 'He will receive cash from sales more slowly', 'He will need a much larger provision for irrecoverable debts'], answer: 0,
      why: 'Some customers will only buy on credit; losing them reduces revenue and profit. Cash-only selling removes irrecoverable debts rather than increasing them.' },
    { skill: 'adv-disadv', kind: 'mcq', q: 'Why does selling on credit mainly affect a trader’s liquidity?',
      options: ['Cash from the sale is received later than the sale', 'The sale is not recorded until the cash arrives', 'Credit sales are worth less than cash sales', 'Credit customers always pay less than the invoice'], answer: 0,
      why: 'The sale is made now but the cash arrives later, so the business has less cash on hand in the meantime.' },
    { skill: 'adv-disadv', kind: 'multi', q: 'Which of these are consequences of irrecoverable debts for a trader?',
      options: ['Profit for the year is lower', 'Less cash is received than expected', 'Revenue recorded becomes higher', 'Trade payables increase'], answers: [0, 1],
      why: 'A debt that is never paid is written off as an expense (lower profit) and the cash expected never arrives. Revenue and trade payables are not increased by it.' },
    // explain-effect
    { skill: 'explain-effect', kind: 'mcq', q: 'Which answer would earn both marks for “Explain one way to encourage trade receivables to pay on time”?',
      options: ['Offer a cash discount, so customers who pay within the period pay less', 'Offer a trade discount, so customers will want to buy larger quantities', 'Send statements, because this is what most businesses usually do', 'Charge interest, which will increase the amount of trade receivables'], answer: 0,
      why: 'One mark for a valid method (cash discount) and one for how it works (paying early costs the customer less). The others name the wrong method or give no valid development.' },
    { skill: 'explain-effect', kind: 'mcq', q: 'Which ending correctly develops this point? “Selling on credit may attract new customers…”',
      options: ['…which may increase revenue and profit.', '…which will improve cash flow straight away.', '…which removes the risk of irrecoverable debts.', '…which reduces the need for credit control.'], answer: 0,
      why: 'New customers mean more sales, so revenue and profit may rise. Credit sales do not bring cash in straight away and they increase, not remove, the risk of bad debts.' },
    { skill: 'explain-effect', kind: 'mcq', q: 'Which ending correctly develops this point? “Selling on credit may lead to irrecoverable debts…”',
      options: ['…which would reduce the profit for the year.', '…which would increase the revenue for the year.', '…which would increase the cash in the bank.', '…which would reduce the trade payables owed.'], answer: 0,
      why: 'Irrecoverable debts are an expense, so they reduce profit for the year.' },
    { skill: 'explain-effect', kind: 'mcq', q: 'Which ending correctly develops this point? “If the trader sells only for cash, money will be received sooner…”',
      options: ['…improving the trader’s liquidity.', '…increasing the trader’s revenue.', '…raising the trader’s trade receivables.', '…lowering the trader’s cash balance.'], answer: 0,
      why: 'Getting cash sooner means more cash is available to pay bills, so liquidity improves. It does not by itself raise revenue.' },
    // evaluate
    { skill: 'evaluate', kind: 'mcq', q: 'A 5-mark “Advise” answer gives one developed advantage and one developed disadvantage of a proposal. What else is needed for full marks?',
      options: ['A clear decision on whether to go ahead', 'A third advantage of the proposal for the trader', 'A definition of credit control', 'A list of the trader’s customers'], answer: 0,
      why: 'Evaluate and Advise questions give a mark for the final judgement: a clear statement of whether the trader should proceed.' },
    { skill: 'evaluate', kind: 'mcq', q: 'Ravindra sells building materials. Almost all his customers are builders who expect 30 days’ credit, and all his rivals offer credit. Last year his irrecoverable debts were only $200 on revenue of $480,000. He is thinking of selling only for cash. Which advice is best supported?',
      options: ['Keep selling on credit, as cash only may lose most of his customers', 'Sell only for cash, as his irrecoverable debts are a serious problem', 'Sell only for cash, as builders prefer paying at once', 'Keep selling on credit, as credit sales bring cash in sooner'], answer: 0,
      why: 'His bad debts are tiny, while his customers expect credit and could go to rivals. Losing them would cut revenue and profit far more than $200.' },
    { skill: 'evaluate', kind: 'mcq', q: 'Leilani runs a snack kiosk. Her customers are mostly passers-by buying small items. A few regulars buy on credit, and last year several of them never paid. Which advice is best supported?',
      options: ['Sell only for cash, as few sales are lost and bad debts stop', 'Offer credit to everyone, as more passers-by will then buy snacks', 'Keep the credit, as irrecoverable debts increase her profit', 'Offer credit to everyone, as cash is then received sooner'], answer: 0,
      why: 'Most of her trade is already cash, so cash-only selling loses little revenue but stops the debts that reduce her profit.' },
    { skill: 'evaluate', gen: function () {
      var who = pick(PEOPLE), g = step(12000, 40000, 500), d = step(1500, 9000, 100), c = step(1000, 6000, 100);
      var ans = g - d - c;
      if (ans === 0) d += 100, ans = g - d - c;
      return { kind: 'num', q: who + ' is thinking of offering credit to customers. This is expected to add ' + money(g) + ' of gross profit next year. ' + who + ' also expects irrecoverable debts of ' + money(d) + ' and extra costs of ' + money(c) + ' for chasing late payers. By how much would profit for the year change? Give your answer in $ (use a minus sign if profit falls).',
        answer: ans, unit: '$', display: fmt(ans),
        why: 'Change in profit = extra gross profit − irrecoverable debts − extra costs = ' + fmt(g) + ' − ' + fmt(d) + ' − ' + fmt(c) + ' = ' + money(ans) + '. On profit alone, ' + (ans > 0 ? 'the proposal looks worthwhile, though cash will arrive later.' : 'the proposal is not worthwhile.') };
    } },
    { skill: 'evaluate', gen: function () {
      return until(function () {
        var who = pick(PEOPLE), S = step(40000, 120000, 1000), dp = pick([2, 4, 5, 8, 10]), g = step(4000, 16000, 500);
        var d = S * dp / 100, ch = g - d;
        if (!isInt(d) || Math.abs(ch) < 500 || d === g || d === Math.abs(ch) || g === Math.abs(ch)) return null;
        var opts = ['Go ahead: profit rises by ' + money(Math.abs(ch)), 'Do not go ahead: profit falls by ' + money(Math.abs(ch)), 'Go ahead: profit rises by ' + money(g), 'Do not go ahead: profit falls by ' + money(d)];
        return mcq(who + ' is considering selling on credit. Credit sales of ' + money(S) + ' are expected next year, adding ' + money(g) + ' to gross profit, and ' + dp + '% of credit sales are expected to become irrecoverable debts. Looking only at profit, what should ' + who + ' do?',
          opts, ch > 0 ? 0 : 1,
          'Irrecoverable debts = ' + fmt(S) + ' × ' + dp + '% = ' + fmt(d) + '. Change in profit = ' + fmt(g) + ' − ' + fmt(d) + ' = ' + money(ch) + ', so profit ' + (ch > 0 ? 'rises and ' + who + ' should go ahead.' : 'falls and ' + who + ' should not go ahead.'));
      });
    } }
  ] };

  // =====================================================================
  // ACC-REC-08 Why the petty cash in the box differs from the book
  // =====================================================================
  var GROUPS = ['Recording error or missing voucher', 'Loss or theft of cash', 'Timing difference', 'Not a cause of a difference'];
  B['ACC-REC-08'] = { title: 'Why the petty cash in the box differs from the book', items: [
    // cause
    { skill: 'cause', kind: 'mcq', q: 'Which is a possible reason why the cash in the petty cash box is <b>less</b> than the petty cash book balance?',
      options: ['A payment was made but no voucher was recorded', 'The petty cash book has analysis columns', 'The imprest was restored and recorded on time', 'A voucher was recorded for more than was paid'], answer: 0,
      why: 'Cash left the box but the book was not reduced, so the book shows more than the box. A voucher recorded too high would make the box show more than the book.' },
    { skill: 'cause', kind: 'multi', q: 'Which of these could explain a difference between the petty cash book balance and the cash counted in the box?',
      options: ['A voucher was mislaid and never entered', 'An employee took cash from the box', 'A voucher was entered at the wrong amount', 'The main cashier checks the book each month', 'The analysis columns are totalled each month'], answers: [0, 1, 2],
      why: 'Missing vouchers, theft and wrong amounts all make the book and the box disagree. Checking the book and totalling columns are good practice, not causes.' },
    { skill: 'cause', kind: 'mcq', q: 'Which of the following is <b>not</b> a reason why the petty cash book balance may differ from the cash held?',
      options: ['The petty cashier uses the imprest system', 'Some cash has been stolen from the box', 'A voucher has been lost before being entered', 'A voucher was entered twice in the book'], answer: 0,
      why: 'Using the imprest system is just how petty cash is topped up; it does not cause a difference. The other three all do.' },
    { skill: 'cause', kind: 'mcq', q: 'Which reason for a petty cash difference is a <b>timing</b> difference?',
      options: ['The top-up from the main cashier is not yet received', 'Cash was taken from the box overnight', 'A voucher was entered as $45 instead of $54', 'A voucher fell behind a desk and so was never entered in the book'], answer: 0,
      why: 'The top-up has been recorded but the cash will arrive later, so the difference sorts itself out over time. The others are theft and recording errors.' },
    { skill: 'cause', kind: 'mcq', q: 'After the imprest top-up, the petty cash book of Kowalski Plumbing shows a balance of $250, but only $232 is in the box. Which is the most likely explanation?',
      options: ['An $18 payment was made without a voucher being entered', 'The imprest amount should be $232, not $250', 'An $18 voucher had been entered twice in the petty cash book', 'The postage column was totalled incorrectly'], answer: 0,
      why: 'Cash is $18 lower than the book, which fits $18 paid out but not recorded. A voucher entered twice would make the box higher than the book.' },
    // cause-group
    { skill: 'cause-group', kind: 'mcq', q: 'A voucher for $61 was entered in the petty cash book as $16. Which kind of cause is this?', options: GROUPS.slice(), answer: 0,
      why: 'The amount was written wrongly in the book, which is a recording error.' },
    { skill: 'cause-group', kind: 'mcq', q: 'The petty cash box was left unlocked overnight and $25 is missing. Which kind of cause is this?', options: GROUPS.slice(), answer: 1,
      why: 'Cash has gone from the box without being paid out for the business, so this is loss or theft.' },
    { skill: 'cause-group', kind: 'mcq', q: 'A clerk was given $30 for stamps this afternoon; the voucher will be written tomorrow when she brings the receipt. Which kind of cause is this?', options: GROUPS.slice(), answer: 2,
      why: 'The payment will be recorded tomorrow, so the difference is only due to timing.' },
    { skill: 'cause-group', kind: 'mcq', q: 'The petty cashier used the analysis columns to show travel and postage separately. Which kind of cause is this?', options: GROUPS.slice(), answer: 3,
      why: 'Analysing payments into columns is normal practice and does not change the balance, so it is not a cause of a difference.' },
    // direction
    { skill: 'direction', kind: 'mcq', q: 'A petty cash voucher for $12 was entered twice in the petty cash book. What is the effect?',
      options: ['The cash in the box is $12 more than the book balance', 'The cash in the box is $12 less than the book balance', 'The cash in the box is $24 more than the book balance', 'There is no difference between the box and the book'], answer: 0,
      why: 'The book records $12 too much spending, so its balance is $12 too low. The box therefore holds $12 more than the book shows.' },
    { skill: 'direction', kind: 'mcq', q: 'Some cash has been stolen from the petty cash box. How does the cash in the box compare with the petty cash book balance?',
      options: ['The box holds less than the book shows', 'The box holds more than the book shows', 'The box and the book still agree', 'The book balance falls by the same amount'], answer: 0,
      why: 'Theft is never recorded in the book, so the book still shows the full balance while the box holds less.' },
    { skill: 'direction', gen: function () {
      var b = step(60, 240, 1), v = step(5, 45, 1), who = pick(PEOPLE);
      if (v >= b) v = Math.floor(b / 3);
      return num('The petty cash book kept by ' + who + ' shows a balance of ' + money(b) + '. A payment of ' + money(v) + ' for cleaning materials was made from the box, but the voucher was lost and never entered. Assuming there are no other differences, how much cash is in the box? Give your answer in $.', b - v,
        'The payment left the box but not the book, so the box holds ' + fmt(b) + ' − ' + fmt(v) + ' = ' + money(b - v) + '.');
    } },
    { skill: 'direction', gen: function () {
      return until(function () {
        var t = rint(1, 8), u = rint(1, 9);
        if (t === u) return null;
        var right = 10 * t + u, wrong = 10 * u + t, d = Math.abs(right - wrong);
        var boxMore = wrong > right;
        var opts = ['The box holds ' + money(d) + ' more than the book', 'The box holds ' + money(d) + ' less than the book', 'The box holds ' + money(right) + ' less than the book', 'The box and the book agree'];
        return mcq('A petty cash voucher for ' + money(right) + ' was entered in the petty cash book as ' + money(wrong) + '. What is the effect?', opts, boxMore ? 0 : 1,
          (boxMore ? 'The book shows ' + fmt(d) + ' more spending than really happened, so its balance is ' + fmt(d) + ' too low and the box holds ' + money(d) + ' more.' : 'The book shows ' + fmt(d) + ' less spending than really happened, so its balance is ' + fmt(d) + ' too high and the box holds ' + money(d) + ' less.'));
      });
    } },
    { skill: 'direction', gen: function () {
      return until(function () {
      var b = step(150, 300, 5), v = step(6, 40, 1), t = step(40, 120, 5), who = pick(PEOPLE);
      var ans = b - v - t;
      if (ans < 40) return null;
      return num('On 1 ' + pick(MONTHS) + ' the petty cash book kept by ' + who + ' shows a balance of ' + money(b) + ', which includes a top-up of ' + money(t) + ' from the main cashier that has been recorded but not yet handed over. A voucher for ' + money(v) + ' was also paid out from the box but never entered. How much cash is in the box? Give your answer in $.', ans,
        'Both causes leave the box short: ' + fmt(b) + ' − ' + fmt(t) + ' (top-up not received) − ' + fmt(v) + ' (unrecorded payment) = ' + money(ans) + '.');
      });
    } },
    { skill: 'direction', gen: function () {
      var b = step(80, 200, 1), v = step(5, 30, 1), s = step(5, 40, 5);
      var counted = b + v - s;
      return num('The petty cash book balance is ' + money(b) + ' and the cash counted is ' + money(counted) + '. A voucher for ' + money(v) + ' was entered twice in the book. Any remaining difference is cash that has been stolen. How much was stolen? Give your answer in $.', s,
        'Correct book balance = ' + fmt(b) + ' + ' + fmt(v) + ' (the duplicate removed) = ' + fmt(b + v) + '. Stolen = ' + fmt(b + v) + ' − ' + fmt(counted) + ' = ' + money(s) + '.');
    } },
    { skill: 'direction', kind: 'multi', q: 'Which of these would make the cash in the petty cash box <b>more</b> than the petty cash book balance?',
      options: ['A voucher was entered twice in the book', 'A voucher was entered for more than was paid', 'Cash was stolen from the box', 'A payment was made but no voucher was entered', 'A top-up was recorded but not yet received'], answers: [0, 1],
      why: 'If the book records more spending than really happened, its balance is too low, so the box holds more. Theft, unrecorded payments and a missing top-up all leave the box holding less.' },
    { skill: 'direction', kind: 'mcq', q: 'A taxi fare of $28 was paid from the petty cash box but entered as $22. How does the box compare with the book?',
      options: ['The box holds $6 less than the book', 'The box holds $6 more than the book', 'The box holds $28 less than the book', 'The box and the book agree'], answer: 0,
      why: 'The book records $6 too little spending, so its balance is $6 too high. The box holds $6 less than the book shows.' },
    // answer-quality
    { skill: 'answer-quality', kind: 'mcq', q: 'Which answer would earn the mark for “State one reason why the petty cash book balance may be different from the cash in the box”?',
      options: ['A voucher may not have been entered', 'A petty cash book saves the cashier time', 'There was some kind of mistake', 'The petty cashier keeps the book'], answer: 0,
      why: 'A missing voucher is a clear, specific cause. Saving time is a benefit of the book, and “some kind of mistake” does not say what or where.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'A student gives two reasons: “an error in the petty cash book” and “a wrong entry in the petty cash book”. Why would only one mark be given?',
      options: ['Both reasons describe the same cause', 'Errors cannot cause a petty cash difference', 'The answer should mention the imprest', 'Each reason must include a figure'], answer: 0,
      why: 'An error and a wrong entry in the book are the same idea. The second reason needed a different cause, such as theft or a top-up not yet received.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'Which two-reason answer would earn both marks?',
      options: ['Cash was stolen; a voucher is missing', 'Cash was stolen; cash was taken without permission', 'There was an error; there was a mistake', 'A voucher is missing; the book helps control spending'], answer: 0,
      why: 'Theft and a missing voucher are two different causes. The other answers repeat an idea, are vague, or give a benefit of the book.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'Which of these is a benefit of keeping a petty cash book, <b>not</b> a cause of a difference?',
      options: ['Small payments are kept out of the main cash book', 'A voucher was lost before it was recorded', 'Cash was taken from an unlocked box', 'A top-up was recorded before it arrived'], answer: 0,
      why: 'Keeping small payments out of the main cash book is a reason for having a petty cash book. The other three are causes of a difference.' },
    { skill: 'answer-quality', kind: 'mcq', q: 'Which of these answers is too vague to earn a mark for a cause of a petty cash shortage?',
      options: ['Something went wrong', 'Cash was stolen from the box', 'A voucher was not entered', 'A payment was entered too low'], answer: 0,
      why: '“Something went wrong” does not say what caused the shortage. Each of the others names a specific cause.' }
  ] };

  // =====================================================================
  // ACC-REC-21 Nominal accounts posted from the books of prime entry
  // =====================================================================
  var SIDES = ['Debit side of the sales account', 'Credit side of the sales account', 'Debit side of the sales returns account', 'Credit side of the cash book'];
  B['ACC-REC-21'] = { title: 'Nominal accounts posted from the books of prime entry', items: [
    // posting
    { skill: 'posting', kind: 'mcq', q: 'Where is the monthly total of the sales day book posted?', options: SIDES.slice(), answer: 1,
      why: 'Sales is income, which has a credit balance, so the sales day book total is credited to the sales account.' },
    { skill: 'posting', kind: 'mcq', q: 'Where is the monthly total of the purchases day book posted?',
      options: ['Debit side of the purchases account', 'Credit side of the purchases account', 'Debit side of the purchases returns account', 'Credit side of the cash book'], answer: 0,
      why: 'Purchases is an expense, which has a debit balance, so the purchases day book total is debited to the purchases account.' },
    { skill: 'posting', kind: 'mcq', q: 'The petty cash book has an analysis column for stationery. Where is the total of that column posted?',
      options: ['Debit, stationery account', 'Credit, stationery account', 'Debit, petty cash book', 'Credit, main cash book'], answer: 0,
      why: 'Stationery is an expense, so the column total is debited to the stationery account. The petty cash book itself is the credit entry.' },
    { skill: 'posting', kind: 'mcq', q: 'Cash sales are recorded in the cash book. Where is the other side of this entry made?', options: SIDES.slice(), answer: 1,
      why: 'The cash book is debited with the cash received and the sales account is credited, the same side as credit sales.' },
    { skill: 'posting', kind: 'mcq', q: 'Where is the monthly total of the sales returns day book posted?', options: SIDES.slice(), answer: 2,
      why: 'Sales returns have their own account, which is debited. They are not entered in the sales account itself.' },
    { skill: 'posting', kind: 'mcq', q: 'At the year end, how is the balance on the sales account closed?',
      options: ['Debit the sales account; details “Income statement”', 'Credit the sales account; details “Income statement”', 'Debit the sales account; details “Balance b/d”', 'Credit the sales account; details “Cash book”'], answer: 0,
      why: 'The sales account has a credit balance, so it is closed by a debit entry transferring the total to the income statement.' },
    // transfer
    { skill: 'transfer', gen: function () {
      var mo = pick(MONTHS), bd = step(40000, 120000, 10), sdb = step(3000, 12000, 1), cs = step(50, 900, 1), sr = step(100, 800, 1);
      var ans = bd + sdb + cs;
      return num('The financial year ends on ' + MEND[mo] + ' ' + mo + '. On 1 ' + mo + ' the sales account had a balance of ' + money(bd) + '. During ' + mo + ' the sales day book total was ' + money(sdb) + ', cash sales in the cash book were ' + money(cs) + ' and the sales returns day book total was ' + money(sr) + '. Calculate the transfer from the sales account to the income statement. Give your answer in $.', ans,
        'Credit side: ' + fmt(bd) + ' (balance b/d) + ' + fmt(sdb) + ' (sales day book) + ' + fmt(cs) + ' (cash) = ' + money(ans) + '. Sales returns go to their own account.');
    } },
    { skill: 'transfer', gen: function () {
      var mo = pick(MONTHS), bd = step(30000, 90000, 10), a = step(300, 2500, 1), b = step(300, 2500, 1), c = step(300, 2500, 1), pr = step(100, 600, 1);
      var ans = bd + a + b + c;
      return num('The financial year ends on ' + MEND[mo] + ' ' + mo + '. On 1 ' + mo + ' the purchases account had a balance of ' + money(bd) + '. The purchases day book for ' + mo + ' contains three invoices: ' + money(a) + ', ' + money(b) + ' and ' + money(c) + '. Goods costing ' + money(pr) + ' were returned to a supplier. Calculate the transfer from the purchases account to the income statement. Give your answer in $.', ans,
        'Day book total = ' + fmt(a) + ' + ' + fmt(b) + ' + ' + fmt(c) + ' = ' + fmt(a + b + c) + '. Debit side = ' + fmt(bd) + ' + ' + fmt(a + b + c) + ' = ' + money(ans) + '. Returns go to the purchases returns account.');
    } },
    { skill: 'transfer', gen: function () {
      var mo = pick(MONTHS), bd = step(50000, 110000, 10), x = step(2000, 8000, 1), a = step(200, 1500, 1), b = step(200, 1500, 1), cs = step(100, 700, 1);
      var sdb = x + a + b, ans = bd + sdb + cs;
      return mcqMoney('The year ends on ' + MEND[mo] + ' ' + mo + '. The sales account shows a balance b/d of ' + money(bd) + ' on 1 ' + mo + '. The sales day book for ' + mo + ' totalled ' + money(x) + ' up to 26 ' + mo + ', and two more invoices of ' + money(a) + ' and ' + money(b) + ' were issued after that. Cash sales for the month were ' + money(cs) + '. What is the transfer to the income statement?',
        ans, [bd + x + cs, bd + sdb, bd + sdb - cs],
        'Sales day book total = ' + fmt(x) + ' + ' + fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(sdb) + '. Transfer = ' + fmt(bd) + ' + ' + fmt(sdb) + ' + ' + fmt(cs) + ' = ' + money(ans) + '.');
    } },
    { skill: 'transfer', gen: function () {
      var mo = pick(MONTHS), bd = step(20000, 70000, 10), pdb = step(1500, 7000, 1), cp = step(50, 600, 1), dr = step(30, 300, 1);
      var ans = bd + pdb + cp;
      return mcqMoney('The year ends on ' + MEND[mo] + ' ' + mo + '. The purchases account has a balance b/d of ' + money(bd) + ' on 1 ' + mo + '. In ' + mo + ', the purchases day book total was ' + money(pdb) + ', goods bought for cash were ' + money(cp) + ' and discount received was ' + money(dr) + '. What is the transfer to the income statement?',
        ans, [bd + pdb, bd + pdb + cp - dr, bd + pdb - cp],
        'Debit side = ' + fmt(bd) + ' + ' + fmt(pdb) + ' + ' + fmt(cp) + ' = ' + money(ans) + '. Discount received has its own account and is not entered in the purchases account.');
    } },
    // balance
    { skill: 'balance', gen: function () {
      var mo = pick(MONTHS), bd = step(40, 400, 1), t = step(15, 120, 1);
      var ans = bd + t;
      return num('The travel expenses account had a balance b/d of ' + money(bd) + ' on 1 ' + mo + '. During ' + mo + ' the travel column of the petty cash book totalled ' + money(t) + '. The account is balanced at the end of the month. What is the balance c/d? Give your answer in $.', ans,
        'Debit side = ' + fmt(bd) + ' + ' + fmt(t) + ' = ' + fmt(ans) + '. The balance c/d of ' + money(ans) + ' is written on the credit side, then brought down on the debit side.');
    } },
    { skill: 'balance', gen: function () {
      var mo = pick(MONTHS), bd = step(30, 300, 1), a = step(3, 25, 1), b = step(3, 25, 1), c = step(3, 25, 1), d = step(3, 25, 1);
      var ans = bd + a + b + c + d;
      return num('The postage account had a balance b/d of ' + money(bd) + ' on 1 ' + mo + '. During ' + mo + ' four petty cash vouchers were analysed under postage: ' + money(a) + ', ' + money(b) + ', ' + money(c) + ' and ' + money(d) + '. What is the balance c/d on the postage account at the end of ' + mo + '? Give your answer in $.', ans,
        'Postage column total = ' + fmt(a + b + c + d) + ', posted as one debit. Balance = ' + fmt(bd) + ' + ' + fmt(a + b + c + d) + ' = ' + money(ans) + '.');
    } },
    { skill: 'balance', gen: function () {
      var mo = pick(MONTHS), bd = step(60, 500, 1), t = step(20, 150, 1);
      var tot = bd + t, nxt = MONTHS[(MONTHS.indexOf(mo) + 1) % MONTHS.length];
      var opts = ['Debit side, ' + money(tot), 'Credit side, ' + money(tot), 'Debit side, ' + money(t), 'Credit side, ' + money(bd)];
      return mcq('The cleaning expenses account had a balance b/d of ' + money(bd) + ' at the start of the month, and the petty cash book cleaning column for the month totalled ' + money(t) + '. The account is balanced. Where, and for how much, is the balance b/d shown at the start of the next month?',
        opts, 0, 'An expense account has a debit balance: ' + fmt(bd) + ' + ' + fmt(t) + ' = ' + money(tot) + ', carried down on the credit side and brought down on the debit side.');
    } },
    // layout
    { skill: 'layout', kind: 'mcq', q: 'A question says: “Prepare the sales account for the year showing the transfer to the income statement.” What goes in the details column for the closing entry?',
      options: ['Income statement', 'Balance c/d', 'Sales day book', 'Cash book'], answer: 0,
      why: 'When a transfer is asked for, the closing entry is labelled “Income statement”, not a balance carried down.' },
    { skill: 'layout', kind: 'mcq', q: 'A question says: “Prepare the rent account. Balance the account and bring the balance down.” How is the account closed?',
      options: ['Balance c/d, then Balance b/d on the next day', 'Income statement, on the side with the entries', 'Petty cash book, on the opposite side', 'Total only, with no balance shown'], answer: 0,
      why: '“Balance the account” means writing Balance c/d to make the totals equal, then bringing it down as Balance b/d at the start of the next period.' },
    { skill: 'layout', kind: 'mcq', q: 'On which side of the sales account does the balance b/d at the start of a month appear?',
      options: ['Credit side', 'Debit side', 'Either side, as the bookkeeper chooses', 'It is not shown in the account'], answer: 0,
      why: 'Sales is income, so its balance is a credit balance and is brought down on the credit side.' },
    { skill: 'layout', kind: 'mcq', q: 'A student prepared this sales account for March (year end 31 March). Which entry is wrong?' +
      table([['Mar 31', 'Sales returns day book', '640', 'Mar 1', 'Balance b/d', '58,200'], ['Mar 31', 'Income statement', '62,850', 'Mar 31', 'Sales day book', '4,920'], ['', '', '', 'Mar 31', 'Cash book', '370'], ['', '', '63,490', '', '', '63,490']], ['Date', 'Details', '$', 'Date', 'Details', '$']),
      options: ['Sales returns day book', 'Balance b/d', 'Sales day book', 'Cash book'], answer: 0,
      why: 'Sales returns are posted to their own sales returns account, not to the sales account. Without them, the transfer would be $63,490.' },
    { skill: 'layout', kind: 'mcq', q: 'A student prepared this purchases account. Which entry is on the wrong side?' +
      table([['Jul 1', 'Balance b/d', '24,300', 'Jul 31', 'Purchases day book', '2,160'], ['', '', '', 'Jul 31', 'Income statement', '22,140'], ['', '', '24,300', '', '', '24,300']], ['Date', 'Details', '$', 'Date', 'Details', '$']),
      options: ['Purchases day book', 'Balance b/d', 'Income statement', 'No entry is wrong'], answer: 0,
      why: 'The purchases day book total must be debited to purchases, on the same side as the balance b/d. The transfer should then be 24,300 + 2,160 = $26,460 on the credit side.' },
    // exclude
    { skill: 'exclude', kind: 'mcq', q: 'Which of these is <b>not</b> posted to the sales account?',
      options: ['Sales returns day book total', 'Sales day book total', 'Cash sales from the cash book', 'Transfer to the income statement'], answer: 0,
      why: 'Sales returns are kept in a separate sales returns account. The other three all appear in the sales account.' },
    { skill: 'exclude', kind: 'multi', q: 'Which of these entries appear in the <b>purchases</b> account?',
      options: ['Balance b/d', 'Purchases day book total', 'Cash purchases from the cash book', 'Purchases returns day book total', 'Discount received'], answers: [0, 1, 2],
      why: 'The purchases account holds the balance b/d, credit purchases from the day book and cash purchases. Returns and discount received have their own accounts.' },
    { skill: 'exclude', kind: 'mcq', q: 'Why is only the monthly total of the sales day book posted to the sales account, not each invoice?',
      options: ['The day book collects many similar invoices into one total', 'Individual invoices are posted to the purchases account', 'Each invoice is posted to the income statement instead', 'The sales account can only hold one entry each year'], answer: 0,
      why: 'Books of prime entry group similar transactions, so one total can be posted to the nominal account. Each invoice is posted to the customer’s personal account.' },
    { skill: 'exclude', kind: 'mcq', q: 'In which ledger are the sales, purchases and expense accounts kept?',
      options: ['Nominal (general) ledger', 'Sales ledger', 'Purchases ledger', 'Petty cash book'], answer: 0,
      why: 'Income and expense accounts are nominal accounts, kept in the nominal (general) ledger. The sales and purchases ledgers hold customers’ and suppliers’ personal accounts.' }
  ] };

  // =====================================================================
  // ACC-REC-05 Working out amounts after trade and cash discount
  // =====================================================================
  var TD = [10, 15, 20, 25], CD = [2, 2.5, 4, 5];
  function terms() {
    var n = pick([7, 10, 14]), d1 = rint(1, 8), mo = pick(MONTHS);
    return { n: n, d1: d1, mo: mo, early: d1 + n - rint(2, 4), late: d1 + n + rint(3, 8) };
  }
  function ord(d) { return d + (d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'); }
  function dateStr(d, mo) { return d + ' ' + mo + ' 2026'; }
  B['ACC-REC-05'] = { title: 'Working out amounts after trade and cash discount', items: [
    // recorded
    { skill: 'recorded', gen: function () {
      return until(function () {
        var L = step(800, 9000, 100), t = pick(TD), c = pick(CD), seller = pick(PEOPLE);
        var net = L * (100 - t) / 100, both = net * (100 - c) / 100;
        if (!isInt(net) || !isInt(both) || !isInt(L * (100 - c) / 100)) return null;
        return mcqMoney(seller + ' sells goods on credit with a list price of ' + money(L) + '. Terms are ' + t + '% trade discount and ' + c + '% cash discount for payment within 14 days. What amount is entered in ' + seller + '’s sales day book?',
          net, [L, both, L * (100 - c) / 100],
          'Only trade discount is deducted on the invoice: ' + fmt(L) + ' × ' + (100 - t) + '% = ' + money(net) + '. Cash discount is not known until the customer pays.');
      });
    } },
    { skill: 'recorded', gen: function () {
      return until(function () {
        var qty = rint(12, 80), pr = step(15, 120, 5), t = pick(TD), c = pick(CD), buyer = pick(PEOPLE);
        var L = qty * pr, net = L * (100 - t) / 100, both = net * (100 - c) / 100;
        if (!isInt(net) || !isInt(both) || !isInt(L * (100 - c) / 100)) return null;
        return mcqMoney(buyer + ' buys ' + qty + ' items at a list price of ' + money(pr) + ' each, less ' + t + '% trade discount. A ' + c + '% cash discount is offered for prompt payment. What amount is entered in ' + buyer + '’s purchases account?',
          net, [L, both, L * (100 - c) / 100],
          'List price ' + qty + ' × ' + fmt(pr) + ' = ' + fmt(L) + '. Less ' + t + '% trade discount = ' + money(net) + '. The buyer records the same net amount as the seller.');
      });
    } },
    { skill: 'recorded', gen: function () {
      return until(function () {
        var qty = rint(20, 150), pr = step(4, 60, 1), t = pick(TD);
        var L = qty * pr, net = L * (100 - t) / 100;
        if (!isInt(net)) return null;
        return num('A sales invoice is for ' + qty + ' units at ' + money(pr) + ' each, less ' + t + '% trade discount. Calculate the invoice total. Give your answer in $.', net,
          fmt(qty) + ' × ' + fmt(pr) + ' = ' + fmt(L) + '; trade discount ' + fmt(L * t / 100) + '; invoice total ' + fmt(L) + ' − ' + fmt(L * t / 100) + ' = ' + money(net) + '.');
      });
    } },
    { skill: 'recorded', gen: function () {
      return until(function () {
        var L = step(500, 8000, 100), t = pick(TD);
        var net = L * (100 - t) / 100;
        if (!isInt(net)) return null;
        return num('After a trade discount of ' + t + '%, an invoice total is ' + money(net) + '. What was the list price of the goods? Give your answer in $.', L,
          'The invoice is ' + (100 - t) + '% of list price, so list price = ' + fmt(net) + ' ÷ ' + (100 - t) + '% = ' + money(L) + '.');
      });
    } },
    { skill: 'recorded', kind: 'mcq', q: 'Which amount is entered in a seller’s sales day book for a credit sale?',
      options: ['List price less trade discount', 'List price less trade and cash discount', 'List price with no discount', 'List price less cash discount only'], answer: 0,
      why: 'The invoice shows the price after trade discount. Cash discount depends on when the customer pays, so it is not deducted in the day book.' },
    // payment
    { skill: 'payment', gen: function () {
      return until(function () {
        var L = step(1000, 9000, 100), t = pick(TD), c = pick(CD), T = terms(), cust = pick(PEOPLE);
        var net = L * (100 - t) / 100, paid = net * (100 - c) / 100;
        if (!isInt(net) || !isInt(paid)) return null;
        return num('On ' + dateStr(T.d1, T.mo) + ' goods with a list price of ' + money(L) + ' were sold to ' + cust + ' less ' + t + '% trade discount. Terms: ' + c + '% cash discount if paid within ' + T.n + ' days. ' + cust + ' paid on ' + dateStr(T.early, T.mo) + '. How much did ' + cust + ' pay? Give your answer in $.', paid,
          'Invoice = ' + fmt(L) + ' × ' + (100 - t) + '% = ' + fmt(net) + '. Paid within ' + T.n + ' days, so deduct ' + c + '%: ' + fmt(net) + ' × ' + (100 - c) + '% = ' + money(paid) + '.');
      });
    } },
    { skill: 'payment', gen: function () {
      return until(function () {
        var L = step(1000, 9000, 100), t = pick(TD), c = pick(CD), T = terms(), cust = pick(PEOPLE);
        var net = L * (100 - t) / 100, paid = net * (100 - c) / 100;
        if (!isInt(net) || !isInt(paid) || !isInt(L * (100 - c) / 100)) return null;
        return mcqMoney('An invoice dated ' + dateStr(T.d1, T.mo) + ' is for goods with a list price of ' + money(L) + ', less ' + t + '% trade discount. Terms: ' + c + '% cash discount if paid within ' + T.n + ' days. The customer, ' + cust + ', pays on ' + dateStr(T.late, T.mo) + '. How much does ' + cust + ' pay?',
          net, [paid, L, L * (100 - c) / 100],
          'Payment is after the ' + T.n + '-day period, so no cash discount is allowed. The full invoice amount after trade discount is paid: ' + money(net) + '.');
      });
    } },
    { skill: 'payment', gen: function () {
      return until(function () {
        var qty = rint(10, 60), pr = step(10, 90, 5), t = pick(TD), c = pick(CD), T = terms(), buyer = pick(PEOPLE);
        var L = qty * pr, net = L * (100 - t) / 100, paid = net * (100 - c) / 100;
        if (!isInt(net) || !isInt(paid)) return null;
        return num(buyer + ' bought ' + qty + ' items at ' + money(pr) + ' each on ' + dateStr(T.d1, T.mo) + '. The supplier allows ' + t + '% trade discount and ' + c + '% cash discount for payment within ' + T.n + ' days. ' + buyer + ' paid on ' + dateStr(T.early, T.mo) + '. How much did ' + buyer + ' pay? Give your answer in $.', paid,
          'List ' + fmt(L) + ' → after trade discount ' + fmt(net) + ' → paid in time, so less ' + c + '%: ' + money(paid) + '.');
      });
    } },
    { skill: 'payment', gen: function () {
      return until(function () {
        var net = step(400, 6000, 50), c = pick(CD), cust = pick(PEOPLE);
        var paid = net * (100 - c) / 100;
        if (!isInt(paid)) return null;
        return num(cust + ' settled an invoice within the cash discount period and paid ' + money(paid) + ' after deducting ' + c + '% cash discount. What was the invoice total after trade discount? Give your answer in $.', net,
          'The payment is ' + (100 - c) + '% of the invoice, so invoice = ' + fmt(paid) + ' ÷ ' + (100 - c) + '% = ' + money(net) + '.');
      });
    } },
    { skill: 'payment', kind: 'mcq', q: 'A customer pays an invoice after the cash discount period has ended. How much should the customer pay?',
      options: ['The invoice amount after trade discount', 'The invoice amount less cash discount', 'The list price before any discount', 'The list price less cash discount'], answer: 0,
      why: 'Cash discount is only allowed if payment is made within the stated period. After that, the full net invoice amount is due.' },
    // discount-amount
    { skill: 'discount-amount', gen: function () {
      return until(function () {
        var L = step(1000, 10000, 100), t = pick(TD), c = pick(CD), seller = pick(PEOPLE);
        var net = L * (100 - t) / 100, dis = net * c / 100;
        if (!isInt(net) || !isInt(dis)) return null;
        return num(seller + ' sold goods with a list price of ' + money(L) + ' less ' + t + '% trade discount. The customer paid within the period and took the ' + c + '% cash discount. What amount is entered in the discount allowed column of ' + seller + '’s cash book? Give your answer in $.', dis,
          'Cash discount is worked out on the net invoice: ' + fmt(net) + ' × ' + c + '% = ' + money(dis) + '. Using the list price would give too much.');
      });
    } },
    { skill: 'discount-amount', gen: function () {
      return until(function () {
        var L = step(1000, 8000, 100), t = pick(TD), c = pick(CD);
        var net = L * (100 - t) / 100, dis = net * c / 100, td = L * t / 100, tot = td + dis;
        if (!isInt(net) || !isInt(dis) || !isInt(L * c / 100)) return null;
        return mcqMoney('Goods with a list price of ' + money(L) + ' are bought less ' + t + '% trade discount, and paid for within the period with ' + c + '% cash discount. What is the <b>cash discount</b> received?',
          dis, [L * c / 100, tot, td],
          'Cash discount is on the amount after trade discount: ' + fmt(L) + ' × ' + (100 - t) + '% = ' + fmt(net) + '; ' + fmt(net) + ' × ' + c + '% = ' + money(dis) + '.');
      });
    } },
    { skill: 'discount-amount', kind: 'mcq', q: 'On which amount is cash discount calculated?',
      options: ['The invoice amount after trade discount', 'The list price before trade discount', 'The trade discount itself', 'The amount owing at the year end'], answer: 0,
      why: 'Trade discount is taken off first; cash discount is then a percentage of what the customer actually owes on the invoice.' },
    { skill: 'discount-amount', kind: 'mcq', q: 'Where is cash discount first recorded in the books?',
      options: ['In the discount column of the cash book when payment is made', 'In the sales day book at the time the sales invoice is sent to the customer', 'In the purchases day book when goods arrive', 'On the credit note sent to the customer'], answer: 0,
      why: 'Cash discount is only known when the customer pays in time, so it is recorded with the payment in the cash book discount columns.' },
    { skill: 'discount-amount', kind: 'mcq', q: 'Goods are sold less 20% trade discount and 5% cash discount, and the customer pays in time. What is the total reduction as a percentage of the list price?',
      options: ['24%', '25%', '20%', '15%'], answer: 0,
      why: 'On a $100 list price: trade discount $20 leaves $80; cash discount 5% of $80 is $4. Total reduction $24, which is 24% of list price, not 25%.' },
    { skill: 'discount-amount', kind: 'mcq', q: 'Why is cash discount not deducted from the amount recorded in the sales day book?',
      options: ['It is not yet known whether the customer will pay in time', 'Cash discount is only given to customers paying in cash', 'Cash discount is shown in the purchases day book instead', 'Cash discount is always added back at the year end'], answer: 0,
      why: 'At the time of the sale nobody knows if the customer will pay within the period, so the full net invoice is recorded and any discount is recorded later.' },
    // rate
    { skill: 'rate', gen: function () {
      return until(function () {
        var L = step(500, 8000, 100), t = pick([5, 10, 12, 15, 20, 25, 30]);
        var net = L * (100 - t) / 100;
        if (!isInt(net)) return null;
        return { kind: 'num', q: 'Goods with a list price of ' + money(L) + ' are invoiced at ' + money(net) + ' after trade discount. What is the rate of trade discount? Give your answer as a percentage.',
          answer: t, unit: '%', display: String(t), why: 'Trade discount = ' + fmt(L) + ' − ' + fmt(net) + ' = ' + fmt(L - net) + '. Rate = ' + fmt(L - net) + ' ÷ ' + fmt(L) + ' × 100 = ' + t + '%.' };
      });
    } },
    { skill: 'rate', gen: function () {
      return until(function () {
        var net = step(400, 6000, 50), c = pick([2, 3, 4, 5]);
        var paid = net * (100 - c) / 100;
        if (!isInt(paid)) return null;
        return { kind: 'num', q: 'An invoice total (after trade discount) is ' + money(net) + '. The customer pays within the discount period and sends ' + money(paid) + '. What is the rate of cash discount? Give your answer as a percentage.',
          answer: c, unit: '%', display: String(c), tol: 0.05, why: 'Cash discount = ' + fmt(net) + ' − ' + fmt(paid) + ' = ' + fmt(net - paid) + '. Rate = ' + fmt(net - paid) + ' ÷ ' + fmt(net) + ' × 100 = ' + c + '%.' };
      });
    } },
    { skill: 'rate', gen: function () {
      return until(function () {
        var L = step(1000, 8000, 200), t = pick([20, 25]), c = pick([2, 4, 5]);
        var net = L * (100 - t) / 100, dis = net * c / 100, wrong = R.roundDp(dis / L * 100, 2);
        if (!isInt(net) || !isInt(dis) || wrong === c) return null;
        var opts = [c + '%', wrong + '%', (c + t) + '%', t + '%'];
        return mcq('Goods are listed at ' + money(L) + ' and sold less ' + t + '% trade discount. The customer pays in time and is allowed cash discount of ' + money(dis) + '. What is the rate of cash discount?',
          opts, 0, 'Cash discount is based on the net invoice of ' + fmt(L) + ' × ' + (100 - t) + '% = ' + fmt(net) + '. Rate = ' + fmt(dis) + ' ÷ ' + fmt(net) + ' × 100 = ' + c + '%. Dividing by the list price gives the wrong base.');
      });
    } },
    // credit-note
    { skill: 'credit-note', gen: function () {
      return until(function () {
        var q1 = rint(15, 60), k = rint(2, 9), pr = step(6, 40, 1), t = pick(TD);
        if (k >= q1 || (q1 === 20 && pr === 8)) return null;
        var gross = k * pr, ans = gross * (100 - t) / 100;
        if (!isInt(ans) || !isInt(q1 * pr * (100 - t) / 100)) return null;
        return mcqMoney(pick(PEOPLE) + ' invoices a credit customer for ' + q1 + ' items priced at ' + money(pr) + ' each, less ' + t + '% trade discount. Later, ' + k + ' of the items are sent back. What amount is shown on the credit note?',
          ans, [gross, (q1 - k) * pr * (100 - t) / 100, q1 * pr * (100 - t) / 100 - gross],
          'The credit note uses the same trade discount as the invoice: ' + k + ' × ' + fmt(pr) + ' = ' + fmt(gross) + ', less ' + t + '% = ' + money(ans) + '.');
      });
    } },
    { skill: 'credit-note', gen: function () {
      return until(function () {
        var L = step(1500, 8000, 100), Lr = step(200, 1000, 100), t = pick(TD), c = pick(CD), T = terms(), cust = pick(PEOPLE);
        var net = L * (100 - t) / 100, cn = Lr * (100 - t) / 100, owed = net - cn, paid = owed * (100 - c) / 100;
        if (Lr >= L / 2 || !isInt(net) || !isInt(cn) || !isInt(paid)) return null;
        return num(cust + ' was invoiced on ' + dateStr(T.d1, T.mo) + ' for goods with a list price of ' + money(L) + ', less ' + t + '% trade discount. Goods with a list price of ' + money(Lr) + ' were returned and a credit note was issued. Terms: ' + c + '% cash discount within ' + T.n + ' days. ' + cust + ' paid the balance on ' + dateStr(T.early, T.mo) + '. How much was paid? Give your answer in $.', paid,
          'Invoice ' + fmt(net) + ' − credit note ' + fmt(cn) + ' = ' + fmt(owed) + ' owing. Paid in time, so less ' + c + '%: ' + fmt(owed) + ' × ' + (100 - c) + '% = ' + money(paid) + '.');
      });
    } },
    { skill: 'credit-note', kind: 'mcq', q: 'Goods sold less 20% trade discount are returned by the customer. How is the credit note value worked out?',
      options: ['List price of the returned goods less the 20% trade discount', 'List price of the returned goods with no discount', 'Invoice total less the full list price of the goods that were returned', 'Invoice total less any cash discount allowed'], answer: 0,
      why: 'The customer was charged the price after trade discount, so the credit note gives back the same net price for the returned goods.' }
  ] };
})();
