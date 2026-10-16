/* Group G01 mastery bank: The accounting environment; Business documents and discounts; Books of prime entry. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function sep(s) { var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function c2(cents) { return sep((cents / 100).toFixed(2)); }          // cents -> "1,304.50"
  function d0(x) { return sep(String(Math.round(x))); }                  // dollars -> "1,304"
  function mc(skill, q, options, answer, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mu(skill, q, options, answers, why) { return { skill: skill, kind: 'multi', q: q, options: options, answers: answers, why: why }; }
  // MCQ with a correct value and distractor values; drops duplicates and keeps 4 options.
  function mcqVals(q, correct, distract, fmt, why) {
    var opts = [correct], seen = {}; seen[correct] = 1;
    distract.forEach(function (d) { if (d > 0 && !seen[d] && opts.length < 4) { seen[d] = 1; opts.push(d); } });
    var k = 1; while (opts.length < 4) { var extra = correct + k * (correct > 2000 ? 100 : 10); if (!seen[extra]) { seen[extra] = 1; opts.push(extra); } k++; }
    return { kind: 'mcq', q: q, options: opts.map(fmt), answer: 0, why: why };
  }
  function tbl(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  var NAMES = ['Okafor', 'Haddad', 'Nakamura', 'Kowalski', 'Mensah', 'Larsen', 'Chaudhry', 'Duarte', 'Ibrahim', 'Petrov', 'Adeyemi', 'Silva', 'Tanaka', 'Moreau', 'Banerjee', 'Osei'];
  var TRADERS = ['Amara', 'Diego', 'Leila', 'Tomasz', 'Priya', 'Kofi', 'Yuki', 'Hana', 'Rashid', 'Elena', 'Nadia', 'Sipho'];
  var MONTHS = ['March', 'May', 'August', 'October'];

  // =====================================================================
  // ACC-ENV-01 Public sector, private sector and sole traders
  // =====================================================================
  B['ACC-ENV-01'] = { title: 'Public sector, private sector and sole traders', items: [
    mc('classify-sector', 'Marisol opened a café using her own savings. She runs it alone, makes every decision and keeps all of the profit. Which type of organisation is her café?',
      ['A sole trader in the private sector', 'A public sector organisation', 'A partnership in the private sector', 'A government department'], 0,
      'One owner who supplies the capital, takes the decisions and keeps all the profit is a sole trader. Sole traders are owned by private individuals, so they are in the private sector.'),
    mc('classify-sector', 'A state secondary school is run by the education ministry and paid for from taxes. In which sector is the school?',
      ['The public sector', 'The private sector', 'It is a sole trader', 'It is a partnership'], 0,
      'It is owned and run by the government and funded from taxes, so it is a public sector organisation.'),
    mu('classify-sector', 'Which of these are public sector organisations?',
      ['A national police force', 'A government-run hospital', 'A state primary school', 'A family bakery owned by one person', 'A dental practice run by two partners', 'A hair salon owned by its stylist'], [0, 1, 2],
      'The police force, the government hospital and the state school are owned and funded by the government. The bakery, the dental partnership and the salon are owned by private individuals, so they are private sector.'),
    mu('classify-sector', 'Which of these organisations are in the private sector?',
      ['A corner shop owned by one person', 'A partnership of two accountants', 'A taxi firm owned by a local family', 'The city fire and rescue service', 'A public library paid for by the council'], [0, 1, 2],
      'Businesses owned by private individuals (sole traders, partnerships, family firms) are private sector. The fire service and the council library are run and funded by government, so they are public sector.'),
    mc('classify-sector', 'Which of these is a public sector organisation?',
      ['A national museum funded by the government', 'A public limited company selling phones', 'A bookshop run by a sole trader', 'An architects\' partnership of two people'], 0,
      'Public sector means owned and funded by the government. A public limited company is owned by private shareholders, so despite the word "public" it is in the private sector.'),
    mc('aims-funding', 'What is the main aim of a public sector organisation?',
      ['To provide a service to the community', 'To make as much profit as possible', 'To pay a high return to its owners', 'To win customers away from rivals'], 0,
      'Public sector bodies such as hospitals and schools exist to serve the community. Making a profit is the main aim of private sector businesses.'),
    mc('aims-funding', 'What is the main aim of a private sector business such as a sole trader?',
      ['To make a profit for its owner', 'To provide free services to the public', 'To spend the taxes it receives', 'To carry out government policy'], 0,
      'Private sector businesses are owned by private individuals who invest capital in order to earn a profit.'),
    mc('aims-funding', 'How is a public sector organisation mainly funded?',
      ['By the government, mainly from taxes', 'By capital put in by a single owner', 'By selling shares to private investors', 'By money invested by two or more partners'], 0,
      'Public sector organisations are paid for by the government, which raises most of its money through taxes.'),
    mc('aims-funding', 'Who owns a public sector organisation?',
      ['The government', 'Private shareholders', 'One private individual', 'Its own employees'], 0,
      'The public sector is the part of the economy owned and run by the government. "Owned by shareholders" describes a company, which is private sector.'),
    mc('aims-funding', 'Which of these is <b>not</b> a characteristic of a public sector organisation?',
      ['It aims to make a profit for its owner', 'It is funded by the government', 'It provides a service to the community', 'It is owned and run by the government'], 0,
      'Public sector bodies do not have profit as their main aim; they are funded by government to serve the community. Making a profit for an owner is a private sector aim.'),
    mc('sole-trader', 'Which of these is <b>not</b> a characteristic of a sole trader?',
      ['Profits are shared between the partners', 'There is only one owner', 'The owner makes all the decisions', 'The owner provides the capital'], 0,
      'A sole trader has a single owner, who provides the capital, takes the decisions and keeps all the profit. Sharing profit between partners describes a partnership.'),
    mc('sole-trader', 'Which is an advantage of trading as a sole trader?',
      ['Decisions can be made quickly', 'The owner has limited liability', 'Profits are shared with others', 'Capital comes from many owners'], 0,
      'With only one owner there is nobody else to consult, so decisions can be made quickly. Sole traders have unlimited liability and do not share profit.'),
    mu('sole-trader', 'Which of these are advantages of being a sole trader?',
      ['The owner has full control of the business', 'The owner keeps all of the profit', 'It is easy and cheap to set up', 'The owner has unlimited liability for debts', 'Capital is limited to what one person can raise'], [0, 1, 2],
      'Full control, keeping all the profit and easy, cheap set-up are advantages. Unlimited liability and limited capital are disadvantages, so they do not answer an "advantages" question.'),
    mc('sole-trader', 'Kwame plans to open a phone repair stall. He wants to keep every dollar the business earns. Which feature of a sole trader suits him best?',
      ['The owner keeps all of the profit', 'The owner shares decisions with others', 'The business is funded from taxes', 'The business must serve the community'], 0,
      'A sole trader does not share profit with anyone, so every dollar of profit belongs to Kwame.'),
    mc('sole-trader', 'Who takes the decisions in a sole trader business?',
      ['The owner alone', 'The owner and the government', 'A board of shareholders', 'The partners by a vote'], 0,
      'A sole trader is one person who owns and controls the business, so the owner takes every decision.'),
    mc('sole-trader', 'Where does most of the capital of a newly opened sole trader business come from?',
      ['The owner\'s own money', 'The government through taxes', 'Shareholders who buy shares', 'Several partners'], 0,
      'A sole trader puts in the capital personally, often from savings, sometimes topped up with a loan. Government funding describes the public sector.'),
    mc('sole-trader', 'Which statement about a sole trader is correct?',
      ['The owner is personally liable for all business debts', 'The owner can only lose the capital put into the business', 'The business is owned by the government', 'The profit must be shared equally with employees'], 0,
      'A sole trader has unlimited liability: if the business cannot pay its debts, the owner\'s private possessions can be used to pay them.'),
    mc('difference', 'Which sentence correctly states one difference between public sector and private sector organisations?',
      ['Public sector bodies aim to serve the community whereas private sector businesses aim to make a profit', 'Public sector bodies aim to make a profit whereas private sector businesses aim to serve the community', 'Public sector bodies are owned by shareholders whereas private sector businesses are owned by the state', 'Public sector bodies and private sector businesses both aim mainly to make a profit'], 0,
      'A difference needs both sides, joined by "whereas": the public sector serves the community, the private sector aims for profit. The second option reverses them and the last is not a difference at all.'),
    mc('difference', 'Which sentence correctly states a difference in how the two sectors are funded?',
      ['Public sector bodies are funded by the government whereas private sector businesses are financed by their owners', 'Public sector bodies are financed by their owners whereas private sector businesses are funded by the government', 'Public sector bodies are funded by shareholders whereas private sector businesses are funded by taxes', 'Public sector bodies and private sector businesses are both funded mainly from taxes'], 0,
      'Government money (mainly taxes) pays for the public sector; owners\' capital (and loans they arrange) finances private sector businesses.'),
    mc('difference', 'A student answered a 2-mark "state one difference" question with: "Public sector organisations provide a service to the community." Why does this earn only 1 mark?',
      ['It describes only one type of organisation', 'It is not a feature of the public sector', 'It should have said the public sector makes a profit', 'It uses the word community instead of public'], 0,
      'A difference has two sides. The student needed to add "whereas private sector organisations aim to make a profit" to gain the second mark.'),
    mc('difference', 'Selma owns a private bus company. Her city also has a bus service run by the city government. Which statement correctly compares them?',
      ['The city service aims to serve the community whereas Selma\'s company aims to make a profit', 'Selma\'s company is funded by taxes whereas the city service is financed by its owner', 'Both bus services are in the private sector because they charge fares', 'Both bus services are in the public sector because they carry the public'], 0,
      'Ownership decides the sector: the government-run service is public sector and aims to serve the community; Selma\'s company is private sector and aims for profit.'),
    mc('public-vs-plc', 'A student says that a public limited company is part of the public sector. Why is the student wrong?',
      ['It is owned by private shareholders', 'It is owned and funded by the government', 'It does not aim to make a profit', 'It has only one owner'], 0,
      'The word "public" in a public limited company means its shares can be sold to the public. It is owned by private shareholders, so it is in the private sector, not the public sector.'),
    mc('public-vs-plc', 'Which statement about the word "public" is correct?',
      ['A public sector body is owned by the government, but a public limited company is privately owned', 'A public limited company is owned by the government, like every public sector body', 'A public sector body is owned by shareholders who are members of the public', 'Any organisation that serves members of the public is in the public sector'], 0,
      'Ownership decides the sector. The government owns public sector bodies; shareholders own a public limited company, which is private sector even though its shares are sold to the public.'),
    mc('classify-sector', 'Which pair of organisations are <b>both</b> in the private sector?',
      ['A sole trader and a partnership', 'A sole trader and a state school', 'A partnership and the national army', 'A state hospital and the police'], 0,
      'Sole traders and partnerships are both owned by private individuals and aim to make a profit, so both are private sector.')
  ] };

  // =====================================================================
  // ACC-ENV-07 The principles of professional ethics
  // =====================================================================
  var P5 = ['Integrity', 'Objectivity', 'Professional competence', 'Confidentiality', 'Professional behaviour'];
  function eth(skill, q, correct, why, others) {
    var opts = [correct].concat(others || sample(P5.filter(function (p) { return p !== correct; }), 3));
    return mc(skill, q, opts, 0, why);
  }
  B['ACC-ENV-07'] = { title: 'The principles of professional ethics', items: [
    eth('name-principle', 'Which principle of professional ethics is described? <i>"An accountant must be straightforward and truthful in everything they do at work."</i>', 'Integrity',
      'Being straightforward, honest and truthful is integrity. Objectivity is about being free from bias, which is a different idea.', ['Objectivity', 'Professional competence', 'Confidentiality']),
    eth('name-principle', 'Which principle of professional ethics is described? <i>"An accountant must not let personal interests or pressure from others override their fair judgement."</i>', 'Objectivity',
      'Not letting bias, conflicts of interest or pressure affect judgement is objectivity. Integrity is about honesty, not freedom from bias.', ['Integrity', 'Confidentiality', 'Professional behaviour']),
    eth('name-principle', 'Which principle of professional ethics is described? <i>"An accountant must keep their skills and knowledge up to date and work carefully."</i>', 'Professional competence',
      'Keeping knowledge and skills at the right level and working with due care is professional competence.', ['Professional behaviour', 'Integrity', 'Objectivity']),
    eth('name-principle', 'Which principle of professional ethics is described? <i>"An accountant must not pass on information about a client without the client\'s permission, unless the law requires it."</i>', 'Confidentiality',
      'Keeping client and employer information private unless there is permission or a legal duty is confidentiality.', ['Integrity', 'Professional competence', 'Objectivity']),
    eth('name-principle', 'Which principle of professional ethics is described? <i>"An accountant must obey the law and avoid any action that would damage the good name of the profession."</i>', 'Professional behaviour',
      'Complying with laws and regulations and not bringing the profession into disrepute is professional behaviour. Competence is about skills, not obeying the law.', ['Professional competence', 'Confidentiality', 'Integrity']),
    eth('scenario', 'A client asks Farah, an accountant, to record sales that never happened so that the business looks more profitable. Farah refuses. Which principle is she following?', 'Integrity',
      'Recording false sales would be dishonest. Refusing to mislead keeps Farah straightforward and truthful, which is integrity.'),
    eth('scenario', 'Ben is asked to prepare the accounts of a business owned by his brother. He passes the job to a colleague because his family link might affect his judgement. Which principle is he protecting?', 'Objectivity',
      'A family link is a conflict of interest that could bias Ben\'s judgement. Avoiding it protects his objectivity.'),
    eth('scenario', 'Lin attends a training course every year to learn about new accounting and tax rules. Which principle of professional ethics does this support?', 'Professional competence',
      'Keeping knowledge up to date so that work is done to the right standard is professional competence.'),
    eth('scenario', 'A neighbour asks Omar, an accountant, how much profit a local shop made last year. The shop is Omar\'s client. Omar refuses to say. Which principle is he following?', 'Confidentiality',
      'Client information must not be shared without permission, so refusing to tell the neighbour is confidentiality.'),
    eth('scenario', 'An accountant posts insulting comments about her clients on social media, which harms the reputation of accountants generally. Which principle has she broken?', 'Professional behaviour',
      'Actions that bring the profession into disrepute break the principle of professional behaviour.'),
    eth('scenario', 'Viktor agrees to prepare a complicated set of accounts even though he has never been trained in that type of work, and makes many mistakes. Which principle has he broken?', 'Professional competence',
      'Taking on work without the necessary skills, and not working with due care, breaks professional competence.'),
    eth('scenario', 'A supplier gives an accountant an expensive watch. The accountant then recommends that supplier to her employer although its prices are higher. Which principle has she broken?', 'Objectivity',
      'The gift creates a conflict of interest that has biased her judgement, so she has broken objectivity.'),
    eth('scenario', 'An accountant tells a friend how much each employee of a client business is paid. Which principle has the accountant broken?', 'Confidentiality',
      'Pay details are private client information. Sharing them without permission breaks confidentiality.'),
    eth('scenario', 'An accountant signs a statement saying a set of figures is correct although he knows several of them are false. Which principle has he broken?', 'Integrity',
      'Knowingly approving false figures is dishonest, so it breaks integrity.'),
    mc('not-a-principle', 'A trainee lists four principles of professional ethics, but one item on her list is wrong. Which item does not belong?',
      ['Prudence', 'Professional competence', 'Confidentiality', 'Integrity'], 0,
      'Prudence is an accounting concept about not overstating profits and assets. The other three are principles of professional ethics.'),
    mc('not-a-principle', 'Three of these are ethics principles an accountant must follow. Which one is an accounting concept instead?',
      ['Consistency', 'Objectivity', 'Professional behaviour', 'Integrity'], 0,
      'Consistency is an accounting concept (use the same methods each year). Objectivity, professional behaviour and integrity are ethics principles.'),
    mc('not-a-principle', 'Identify the odd one out: the item that is <b>not</b> an ethics principle for accountants.',
      ['Accruals', 'Confidentiality', 'Objectivity', 'Professional competence'], 0,
      'Accruals is an accounting concept about matching income and expenses to the right period, not a rule of ethical behaviour.'),
    mc('not-a-principle', 'A firm\'s code of conduct is meant to list the principles of professional ethics. Which item has been included by mistake?',
      ['Business entity', 'Professional behaviour', 'Integrity', 'Confidentiality'], 0,
      'Business entity is an accounting concept (the business is separate from its owner). The others are ethics principles.'),
    mc('not-a-principle', 'Which item below is an accounting concept rather than an ethics principle?',
      ['Money measurement', 'Objectivity', 'Integrity', 'Professional competence'], 0,
      'Money measurement is an accounting concept (only items with a money value are recorded). The others are ethics principles.'),
    mu('not-a-principle', 'Which of these are principles of professional ethics?',
      ['Objectivity', 'Confidentiality', 'Professional behaviour', 'Prudence', 'Materiality', 'Going concern'], [0, 1, 2],
      'Objectivity, confidentiality and professional behaviour are ethics principles. Prudence, materiality and going concern are accounting concepts.'),
    mu('not-a-principle', 'An accountant\'s code of ethics should contain which of these?',
      ['Integrity', 'Professional competence', 'Consistency', 'Accruals', 'Business entity'], [0, 1],
      'Integrity and professional competence are ethics principles. Consistency, accruals and business entity are accounting concepts.'),
    mc('key-idea', 'Which key word best matches the principle of objectivity?',
      ['Unbiased', 'Honest', 'Skilled', 'Law-abiding'], 0,
      'Objectivity means judgement free from bias. Honest matches integrity, skilled matches competence and law-abiding matches professional behaviour.'),
    mc('key-idea', 'Which key word best matches the principle of integrity?',
      ['Honest', 'Unbiased', 'Up to date', 'Private'], 0,
      'Integrity means being honest and straightforward. "Unbiased" is objectivity, "up to date" is competence and "private" is confidentiality.'),
    mc('key-idea', 'When may an accountant share a client\'s information with someone else without the client\'s permission?',
      ['When there is a legal duty to disclose it', 'When a friend of the client asks for it', 'When the amounts involved are small', 'When the client has stopped using the accountant'], 0,
      'Confidentiality allows disclosure without permission only where there is a legal or professional duty to do so, for example a request from the authorities.')
  ] };

  // =====================================================================
  // ACC-ENV-03 Naming and describing the accounting concepts
  // =====================================================================
  B['ACC-ENV-03'] = { title: 'Naming and describing the accounting concepts', items: [
    mc('name-concept', 'Which accounting concept is described? <i>"Income and expenses are recorded in the period they relate to, not when the cash is received or paid."</i>',
      ['Accruals', 'Consistency', 'Prudence', 'Money measurement'], 0,
      'Matching income and expenses to the period they belong to is the accruals (matching) concept.'),
    mc('name-concept', 'Which accounting concept is described? <i>"The owner\'s personal possessions and spending are kept out of the records of the business."</i>',
      ['Business entity', 'Going concern', 'Materiality', 'Accruals'], 0,
      'The business entity concept keeps the business separate from its owner. Going concern is about the business continuing to trade.'),
    mc('name-concept', 'Which accounting concept is described? <i>"Once a method has been chosen, it is applied in the same way each year so that results can be compared."</i>',
      ['Consistency', 'Prudence', 'Accruals', 'Business entity'], 0,
      'Using the same methods every year so results are comparable is the consistency concept.'),
    mc('name-concept', 'Which accounting concept is described? <i>"Items of very small value can be treated as an expense rather than recorded separately as assets."</i>',
      ['Materiality', 'Money measurement', 'Prudence', 'Consistency'], 0,
      'Items too small to matter need not be recorded separately; this is materiality.'),
    mc('name-concept', 'Which accounting concept is described? <i>"Something is only entered in the accounts if it can be given a value in money."</i>',
      ['Money measurement', 'Materiality', 'Business entity', 'Accruals'], 0,
      'Recording only items that can be expressed in money is the money measurement concept. Things such as staff skill or customer goodwill built up over time are not recorded.'),
    mc('name-concept', 'Which accounting concept is described? <i>"Accountants should be cautious, so profits and assets are not overstated and liabilities are not understated."</i>',
      ['Prudence', 'Consistency', 'Accruals', 'Going concern'], 0,
      'Taking the cautious figure so that profit and assets are not overstated is prudence.'),
    mc('name-concept', 'Which accounting concept is described? <i>"The business is expected to keep trading for the foreseeable future."</i>',
      ['Going concern', 'Business entity', 'Consistency', 'Materiality'], 0,
      'Assuming the business will continue trading is the going concern concept. Business entity is about separating the owner from the business.'),
    mc('describe-concept', 'Which description of the <b>consistency</b> concept would earn the mark?',
      ['The same accounting methods are used every year', 'Profits and assets must not be overstated', 'Only items with a money value are recorded', 'The owner is separate from the business'], 0,
      'Consistency means using the same methods (for example the same depreciation method) every year. The other options describe prudence, money measurement and business entity.'),
    mc('describe-concept', 'Which description of the <b>prudence</b> concept would earn the mark?',
      ['Profits and assets should not be overstated', 'Income is matched to the period it relates to', 'Small items need not be recorded separately', 'Methods stay the same from year to year'], 0,
      'Prudence means being cautious so that profits and assets are not overstated (and liabilities not understated).'),
    mc('describe-concept', 'Which description of the <b>accruals</b> concept would earn the mark?',
      ['Expenses are matched to the period they relate to', 'The business will continue trading for years', 'Only events with a money value are recorded', 'Profits must be calculated cautiously'], 0,
      'Accruals (matching) means income and expenses belong to the period in which they are earned or used, whatever the date of payment.'),
    mc('describe-concept', 'Which description of the <b>business entity</b> concept would earn the mark?',
      ['The business is separate from its owner', 'The business will keep trading in future', 'Low-value items are treated as expenses', 'The same methods are used every year'], 0,
      'Business entity means the business and the owner are treated as separate, so the owner\'s private items stay out of the business books.'),
    mc('describe-concept', 'Which description of the <b>materiality</b> concept would earn the mark?',
      ['Very small items need not be recorded separately', 'Only items with a money value are recorded', 'Profits and assets are never overstated', 'Expenses belong to the period they relate to'], 0,
      'Materiality allows items of trivial value, such as a stapler, to be expensed instead of treated as assets.'),
    mc('describe-concept', 'A student describes consistency as "the business should be consistent". Why does this earn no mark for the description?',
      ['It only repeats the name of the concept', 'Consistency is not an accounting concept', 'It describes prudence, not consistency', 'A description must give a money figure'], 0,
      'Repeating the name explains nothing. A creditworthy description says what is kept the same: the accounting methods used from one year to the next.'),
    mc('is-it-a-concept', 'Which one of the following is <b>not</b> an accounting concept?',
      ['Objectivity', 'Accruals', 'Prudence', 'Consistency'], 0,
      'Objectivity is a principle of professional ethics (freedom from bias). Accruals, prudence and consistency are accounting concepts.'),
    mc('is-it-a-concept', 'A student lists four accounting concepts, but one is wrong. Which item does not belong?',
      ['Integrity', 'Business entity', 'Materiality', 'Money measurement'], 0,
      'Integrity is an ethics principle (honesty). The other three are accounting concepts in the specification.'),
    mc('is-it-a-concept', 'Three of these are accounting concepts. Which one is a principle of professional ethics instead?',
      ['Confidentiality', 'Money measurement', 'Business entity', 'Accruals'], 0,
      'Confidentiality is an ethics principle about keeping client information private. The others are accounting concepts.'),
    mu('is-it-a-concept', 'Which of these are accounting concepts?',
      ['Prudence', 'Materiality', 'Business entity', 'Integrity', 'Confidentiality', 'Objectivity'], [0, 1, 2],
      'Prudence, materiality and business entity are accounting concepts. Integrity, confidentiality and objectivity are principles of professional ethics.'),
    mu('is-it-a-concept', 'A question asks you to name accounting concepts. Which of these answers would earn credit?',
      ['Consistency', 'Money measurement', 'Accruals', 'Professional competence', 'Professional behaviour'], [0, 1, 2],
      'Consistency, money measurement and accruals are accounting concepts. Professional competence and professional behaviour are ethics principles.'),
    mc('confusable-pairs', 'A student wrote: "Business entity means the business will carry on trading in the future." Which concept has the student actually described?',
      ['Going concern', 'Business entity', 'Consistency', 'Accruals'], 0,
      'Carrying on trading in future is going concern. Business entity means the business is separate from its owner.'),
    mc('confusable-pairs', 'Which pair matches the concept to its key idea correctly?',
      ['Prudence: do not overstate profit', 'Consistency: do not overstate profit', 'Prudence: same method every year', 'Accruals: owner kept separate'], 0,
      'Prudence is the cautious "do not overstate" concept. Consistency is about using the same method every year, and the owner being kept separate is business entity.'),
    mc('confusable-pairs', 'Money measurement and materiality are often confused. Which pairing is correct?',
      ['Money measurement: has a money value', 'Materiality: has a money value', 'Money measurement: very small items', 'Business entity: very small items'], 0,
      'Money measurement means only items with a money value are recorded. Materiality is the concept about very small items.'),
    mc('confusable-pairs', 'Going concern and business entity are often confused. Which pairing is correct?',
      ['Going concern: keeps trading', 'Business entity: keeps trading', 'Going concern: owner is separate', 'Consistency: owner is separate'], 0,
      'Going concern assumes the business keeps trading for the foreseeable future. Business entity is the one about the owner being separate.'),
    mc('confusable-pairs', 'A student wrote: "Prudence means the same accounting methods are used every year." Which concept has the student actually described?',
      ['Consistency', 'Prudence', 'Materiality', 'Money measurement'], 0,
      'Using the same methods every year is consistency. Prudence means not overstating profits and assets (or understating liabilities).')
  ] };

  // =====================================================================
  // ACC-ENV-02 Stakeholders and why they read the accounts
  // =====================================================================
  B['ACC-ENV-02'] = { title: 'Stakeholders and why they read the accounts', items: [
    mc('internal-external', 'Which of these is an internal stakeholder of a business?',
      ['An employee', 'A bank', 'The government', 'A competitor'], 0,
      'Internal stakeholders work inside the business: the owner, managers and employees. Banks, government and competitors are outside it.'),
    mc('internal-external', 'Which of these is an external stakeholder of a business?',
      ['A supplier', 'The owner', 'A manager', 'An employee'], 0,
      'A supplier deals with the business from outside, so it is external. Owners, managers and employees are internal.'),
    mu('internal-external', 'Which of these are external stakeholders of a business?',
      ['The bank that lent it money', 'A supplier of goods on credit', 'The tax authority', 'The owner', 'A sales manager', 'A warehouse employee'], [0, 1, 2],
      'The bank, suppliers and the tax authority are outside the business. The owner, managers and employees are internal stakeholders.'),
    mu('internal-external', 'Which of these are internal stakeholders of a business?',
      ['The owner', 'The managers', 'The employees', 'Customers', 'The local community'], [0, 1, 2],
      'Owners, managers and employees are inside the business. Customers and the local community deal with it from outside.'),
    mc('interest-of-stakeholder', 'Why would a supplier who sells goods on credit to a business read that business\'s financial statements?',
      ['To judge whether it will be paid on time', 'To check whether its loan interest will be repaid', 'To work out the tax the business owes', 'To decide whether its own job is secure'], 0,
      'A supplier is a trade payable of the business. It wants to know whether the business has enough money to pay for the goods supplied.'),
    mc('interest-of-stakeholder', 'Why would a bank read the financial statements of a business it has lent money to?',
      ['To check that the loan and interest can be repaid', 'To check that its invoices will be paid', 'To decide whether to keep buying goods', 'To see whether wages will rise next year'], 0,
      'A lender wants to know whether the business can afford the repayments and interest on the loan.'),
    mc('interest-of-stakeholder', 'Why would employees be interested in the financial statements of the business they work for?',
      ['To judge whether their jobs are secure', 'To check that loan interest will be paid', 'To calculate the tax due on profit', 'To decide whether to supply on credit'], 0,
      'Employees want to know if the business is doing well enough to keep them employed and perhaps pay rises.'),
    mc('interest-of-stakeholder', 'Why would the owner of a business read its financial statements?',
      ['To find out whether it is making a profit', 'To decide whether to give it credit', 'To calculate tax for the government', 'To compare it with their own business'], 0,
      'The owner has invested capital and wants to know how much profit the business is making for them.'),
    mc('interest-of-stakeholder', 'Why would the government be interested in a business\'s financial statements?',
      ['To work out how much tax is due', 'To check that it will be paid for goods', 'To judge whether jobs are secure', 'To decide whether to buy its products'], 0,
      'Tax is charged on profit, so the government uses the financial statements to work out the tax the business must pay.'),
    mc('interest-of-stakeholder', 'A hotel buys all of its bedding from one manufacturer. Why might the hotel read the manufacturer\'s financial statements?',
      ['To check the manufacturer will keep supplying', 'To check that its own invoices will be paid', 'To work out the tax the manufacturer owes', 'To decide whether its staff jobs are safe'], 0,
      'The hotel is a customer. Customers want to know that the business will survive and continue to supply them.'),
    mc('interest-of-stakeholder', 'Why would a competitor look at another business\'s published financial statements?',
      ['To compare its own performance with a rival', 'To make sure its loan will be repaid', 'To make sure it is paid for goods it sold', 'To work out the tax payable on the profit'], 0,
      'A competitor compares profits and other results with its own to see how well it is performing against a rival.'),
    mc('stakeholder-from-interest', 'A stakeholder wants to know whether the business will be able to repay a $25,000 loan, plus interest, over five years. Who is this stakeholder most likely to be?',
      ['The bank', 'A customer', 'An employee', 'A competitor'], 0,
      'Repayment of a loan and interest is the concern of the lender, usually a bank.'),
    mc('stakeholder-from-interest', 'A stakeholder reads the income statement to calculate how much tax the business must pay on its profit. Who is this stakeholder?',
      ['The government', 'The owner', 'A supplier', 'The bank'], 0,
      'Working out tax on profit is the government\'s interest in the financial statements.'),
    mc('stakeholder-from-interest', 'A stakeholder is worried that several unpaid invoices it sent to the business may never be settled. Who is this stakeholder?',
      ['A supplier', 'A customer', 'A manager', 'The government'], 0,
      'A business that sends invoices and waits to be paid is a supplier giving credit to the business.'),
    mc('stakeholder-from-interest', 'A stakeholder wants to know whether the business can afford a pay rise next year and whether jobs are safe. Who is this stakeholder?',
      ['Employees', 'Suppliers', 'The bank', 'Customers'], 0,
      'Pay and job security are the main financial concerns of employees.'),
    mc('stakeholder-from-interest', 'A stakeholder is deciding whether to put money into the business in return for a share of future profits. Who is this stakeholder?',
      ['An investor', 'A supplier', 'A customer', 'An employee'], 0,
      'An investor wants to know whether the investment will be safe and earn a good return before putting money in.'),
    mc('specific-interest', 'Which interest for a <b>supplier</b> would earn a mark?',
      ['To check that it will be paid for goods sold on credit', 'To see how the business is doing', 'To work out the tax the business owes', 'To check that its own job is secure'], 0,
      'The interest must be specific and must fit the stakeholder. "To see how the business is doing" is too vague, and the other two belong to the government and employees.'),
    mc('specific-interest', 'A student wrote: "Bank: to see how the business is doing." Why does the interest earn no mark?',
      ['It is too vague to show what the bank needs to know', 'Banks are not stakeholders of a business', 'Banks are internal stakeholders', 'Banks only read the cash book, not the statements'], 0,
      'A creditworthy interest is specific, for example "to check that the loan and interest can be repaid".'),
    mc('specific-interest', 'A table asks for two stakeholders and their interests. The first row is completed: <i>Employees: job security</i>. Which stakeholder for the next row would earn a mark?',
      ['Suppliers', 'Workers', 'Staff', 'Employees'], 0,
      'Workers and staff are the same group as the example given (employees), so they earn nothing. A different group such as suppliers is needed.'),
    mc('specific-interest', 'A question asks for two different stakeholders. Which pair would earn both marks?',
      ['Bank and supplier', 'Bank and lender', 'Staff and employees', 'Owner and proprietor'], 0,
      'Bank and lender, staff and employees, owner and proprietor are each the same group named twice. Bank and supplier are two different stakeholders.'),
    mc('specific-interest', 'Which stakeholder and interest are matched correctly?',
      ['Customer: will the business keep supplying us', 'Supplier: will our loan and interest be repaid', 'Government: are our jobs secure', 'Employee: how much tax is due on the profit'], 0,
      'Customers care about continuity of supply. Loan repayment is the bank\'s interest, job security is the employees\' and tax is the government\'s.'),
    mc('specific-interest', 'What is a stakeholder of a business?',
      ['Any person or group with an interest in the business', 'Only the person who owns the business', 'Only people who have lent money to it', 'Only people who work inside the business'], 0,
      'A stakeholder is anyone affected by or interested in how the business performs, both inside it (owner, staff) and outside it (customers, suppliers, banks, government).'),
    mc('internal-external', 'Which stakeholder is incorrectly described?',
      ['Customers are internal stakeholders', 'Managers are internal stakeholders', 'Suppliers are external stakeholders', 'Banks are external stakeholders'], 0,
      'Customers buy from the business but do not work inside it, so they are external stakeholders.')
  ] };

  // =====================================================================
  // ACC-REC-01 Business documents: what each one is and why it is sent
  // =====================================================================
  B['ACC-REC-01'] = { title: 'Business documents: what each one is and why it is sent', items: [
    mc('name-document', 'A shop wants 40 boxes of printer paper from a wholesaler. Which document does the shop send to the wholesaler to ask for the goods?',
      ['Purchase order', 'Sales invoice', 'Statement of account', 'Remittance advice'], 0,
      'A purchase order is sent by the buyer to the seller to request goods. No sale has happened yet, so it is not entered in the books.'),
    mc('name-document', 'A seller sends a document to a credit customer showing the goods supplied, their prices, the trade discount and the amount now owed. What is this document?',
      ['Sales invoice', 'Credit note', 'Purchase order', 'Bank statement'], 0,
      'The sales invoice is issued at the time of a credit sale and shows what is owed for those goods.'),
    mc('name-document', 'A credit customer sends back six damaged lamps. Which document does the seller send to the customer as a result?',
      ['Credit note', 'Sales invoice', 'Remittance advice', 'Purchase order'], 0,
      'A credit note is issued by the seller when goods are returned. It reduces the amount the customer owes.'),
    mc('name-document', 'At the end of the month a seller sends each credit customer a document listing the opening balance, invoices, returns, payments received and the balance still owed. What is it called?',
      ['Statement of account', 'Sales invoice', 'Credit note', 'Remittance advice'], 0,
      'A statement of account summarises all the dealings with a customer for the period and shows the closing balance. An invoice covers only one sale.'),
    mc('name-document', 'A customer pays a supplier and includes a slip listing the invoice numbers being paid. What is the slip called?',
      ['Remittance advice', 'Receipt', 'Credit note', 'Statement of account'], 0,
      'A remittance advice is sent by the customer with (or to announce) a payment and shows which invoices are being paid.'),
    mc('name-document', 'Which document would show that the bank has taken charges and paid interest on a business\'s account during the month?',
      ['Bank statement', 'Cheque counterfoil', 'Remittance advice', 'Sales invoice'], 0,
      'Bank charges and interest are decided by the bank, so the business first learns about them from the bank statement.'),
    mc('name-document', 'Which document does a business keep as its own record of a cheque it has written?',
      ['Cheque counterfoil', 'Bank statement', 'Remittance advice', 'Purchase invoice'], 0,
      'The counterfoil (stub) stays in the cheque book and records the date, payee and amount of each cheque written.'),
    mc('name-document', 'A customer pays $60 in cash at a market stall. Which document is evidence that the cash was paid?',
      ['Receipt', 'Credit note', 'Purchase order', 'Statement of account'], 0,
      'A receipt is given to show that cash has been paid. Invoices and statements are for credit transactions.'),
    mc('name-document', 'Which document does a buyer send to a seller to ask for a credit note after returning faulty goods?',
      ['Debit note', 'Purchase order', 'Remittance advice', 'Sales invoice'], 0,
      'The buyer raises a debit note to request credit; the seller then issues the credit note. Do not confuse the two.'),
    mc('name-document', 'A furniture maker sends an invoice to a shop that bought chairs on credit. What does the shop call this document in its own records?',
      ['Purchase invoice', 'Sales invoice', 'Credit note', 'Purchase order'], 0,
      'The same invoice is a sales invoice for the seller and a purchase invoice for the buyer.'),
    mc('sender', 'Who issues a credit note?',
      ['The seller of the goods', 'The customer who returns goods', 'The bank', 'The government'], 0,
      'A credit note is issued by the seller to the customer, reducing what the customer owes. Saying the customer sends it is a common error.'),
    mc('sender', 'Who sends a remittance advice?',
      ['The customer making a payment', 'The seller asking for payment', 'The bank after a transfer', 'The supplier after a return'], 0,
      'The remittance advice goes with a payment, so it is sent by the customer (the payer) to the supplier.'),
    mc('sender', 'Who sends a purchase order?',
      ['The buyer of the goods', 'The seller of the goods', 'The bank', 'The delivery firm'], 0,
      'The buyer sends the purchase order to the seller to request goods.'),
    mc('sender', 'Who sends a statement of account, and to whom?',
      ['The seller sends it to a credit customer', 'The customer sends it to the seller', 'The bank sends it to the business', 'The buyer sends it to the bank'], 0,
      'The seller sends the statement of account to each credit customer, usually at the end of the month.'),
    mu('sender', 'Which of these documents are sent by the <b>seller</b> to a credit customer?',
      ['Sales invoice', 'Credit note', 'Statement of account', 'Purchase order', 'Remittance advice'], [0, 1, 2],
      'The seller sends invoices, credit notes and statements. The purchase order and the remittance advice come from the buyer.'),
    mu('sender', 'Which of these documents are sent by the <b>buyer</b>?',
      ['Purchase order', 'Remittance advice', 'Debit note', 'Credit note', 'Statement of account', 'Sales invoice'], [0, 1, 2],
      'The buyer orders goods (purchase order), asks for credit (debit note) and sends details with payment (remittance advice). The others come from the seller.'),
    mc('purpose', 'What is the purpose of a credit note?',
      ['To reduce the amount a customer owes', 'To ask a customer to pay a debt', 'To order goods from a supplier', 'To show money paid into the bank'], 0,
      'A credit note is issued after a return or an overcharge, and it reduces the customer\'s debt.'),
    mc('purpose', 'A customer was charged $45 too much on an invoice. Which document should the seller send to put this right?',
      ['Credit note', 'Sales invoice', 'Remittance advice', 'Purchase order'], 0,
      'An overcharge is corrected by a credit note, which reduces the amount owed by $45.'),
    mc('purpose', 'What is the main purpose of a remittance advice?',
      ['To show which invoices a payment is for', 'To ask a supplier for goods', 'To reduce a customer\'s debt', 'To list bank charges for the month'], 0,
      'The remittance advice tells the supplier which invoices are being settled by the payment.'),
    mc('purpose', 'What is the main purpose of a statement of account?',
      ['To show a customer the balance still owed', 'To record goods returned by a customer', 'To order goods from a supplier', 'To prove that cash has been paid'], 0,
      'It summarises the month\'s dealings and reminds the customer how much is still owed.'),
    mc('purpose', 'Why is a purchase order not entered in the accounting books?',
      ['No purchase has taken place yet', 'It is only sent by the bank', 'It always contains a mistake', 'It is the same as a credit note'], 0,
      'A purchase order is only a request for goods. Nothing is recorded until the goods and the invoice arrive.'),
    mc('what-it-shows', 'Which item would a business first learn about from its bank statement rather than from its own documents?',
      ['Interest paid to it by the bank', 'A credit sale to a customer', 'Goods returned to a supplier', 'An order placed for stock'], 0,
      'Interest and charges are decided by the bank, so the bank statement is where the business first sees them.'),
    mc('what-it-shows', 'Which document shows the list price of goods sold on credit, the trade discount deducted and the net amount the customer owes for that one sale?',
      ['Sales invoice', 'Statement of account', 'Remittance advice', 'Purchase order'], 0,
      'The sales invoice is drawn up for each credit sale and shows the list price, the trade discount and the net amount owed. A statement of account only summarises the month\'s invoice totals.')
  ] };

  // =====================================================================
  // ACC-REC-03 Why businesses give trade discount and cash discount
  // =====================================================================
  B['ACC-REC-03'] = { title: 'Why businesses give trade discount and cash discount', items: [
    mc('cash-reason', 'Why does a seller offer a cash discount to credit customers?',
      ['To encourage them to pay promptly', 'To encourage them to buy in bulk', 'To reward them for paying in coins', 'To attract other traders as customers'], 0,
      'Cash (settlement) discount is a reward for paying within an agreed time. It has nothing to do with paying in notes and coins.'),
    mc('trade-reason', 'Why does a wholesaler offer trade discount?',
      ['To encourage customers to buy in bulk', 'To encourage customers to pay early', 'To reduce the irrecoverable debts', 'To get cash into the bank much sooner'], 0,
      'Trade discount is given to trade customers and bulk buyers to encourage larger and repeat orders. Paying early is the reason for cash discount.'),
    mc('cash-reason', 'Dina buys on credit. Her supplier\'s terms are "3% cash discount for payment within 10 days". In which case does Dina earn the discount?',
      ['She pays by bank transfer on day 8', 'She pays in notes and coins on day 20', 'She doubles the size of her next order', 'She buys from the supplier every month'], 0,
      'Cash discount depends only on paying inside the time limit. Day 8 is within 10 days; paying in notes and coins late, bulk orders and regular buying do not earn it.'),
    mc('trade-reason', 'Which customer is most likely to be given a trade discount?',
      ['A shop buying goods to resell', 'A private person buying one item', 'A customer who pays within 7 days', 'A customer who pays in cash'], 0,
      'Trade discount goes to other businesses in the trade and to bulk buyers. Paying quickly earns cash discount instead.'),
    mc('cash-benefit', 'How does offering a cash discount help the seller\'s liquidity?',
      ['Money from customers arrives sooner', 'Customers place much bigger orders', 'The list price can then be increased', 'Fewer invoices need to be sent out'], 0,
      'Customers who take the discount pay earlier, so the seller has cash available sooner.'),
    mc('cash-benefit', 'Which benefit to the seller comes from offering cash discount?',
      ['A lower risk of irrecoverable debts', 'More customers buying in bulk', 'Better loyalty from trade buyers', 'Higher gross profit on each sale'], 0,
      'Debts that are paid quickly are less likely to become irrecoverable, so cash discount lowers that risk.'),
    mc('trade-benefit', 'Which benefit to the seller comes from offering trade discount?',
      ['Customers return to make repeat orders', 'Customers pay their invoices sooner', 'Fewer debts become irrecoverable', 'Bank charges are reduced'], 0,
      'Trade discount builds loyalty and repeat business. Faster payment and fewer bad debts come from cash discount.'),
    mu('trade-benefit', 'Which of these are benefits to a seller of offering <b>trade discount</b>?',
      ['Encourages bulk buying', 'Encourages repeat business', 'Helps increase sales', 'Gets cash in sooner', 'Reduces irrecoverable debts'], [0, 1, 2],
      'Trade discount is about the size and loyalty of orders. Getting cash sooner and reducing irrecoverable debts are benefits of cash discount.'),
    mu('cash-benefit', 'Which of these are benefits to a seller of offering <b>cash discount</b>?',
      ['Customers pay sooner', 'Liquidity improves', 'Risk of irrecoverable debts falls', 'Customers order in larger quantities', 'Other traders become loyal customers'], [0, 1, 2],
      'Cash discount speeds up payment, which improves liquidity and cuts the risk of bad debts. Bulk orders and trade loyalty come from trade discount.'),
    mc('classify', 'Rafiq\'s wholesale business takes 15% off the list price for retailers who order 100 or more units. What type of discount is this?',
      ['Trade discount', 'Cash discount', 'Settlement discount', 'Discount received'], 0,
      'A reduction from list price for traders buying in bulk is trade discount. It is deducted on the invoice at the time of sale.'),
    mc('classify', 'An invoice says: "Terms: 4% discount if paid within 14 days." What type of discount is being offered?',
      ['Cash discount', 'Trade discount', 'Bulk discount', 'Loyalty discount'], 0,
      'A discount that depends on paying within a time limit is cash (settlement) discount.'),
    mc('classify', 'A customer pays by bank transfer within 10 days and is allowed to deduct 2% from the invoice total. What type of discount has the customer received?',
      ['Cash discount', 'Trade discount', 'No discount at all', 'Bulk discount'], 0,
      'The discount was earned by paying early, so it is a cash discount, even though the payment was a bank transfer and not notes and coins.'),
    mc('classify', 'Terms on an invoice are "3% discount for payment within 30 days". The customer pays in notes and coins after 45 days. Is the customer entitled to the discount?',
      ['No, the payment was outside the time limit', 'Yes, because the payment was in cash', 'Yes, because the customer is a trade buyer', 'No, because cash discount is never given'], 0,
      'Cash discount depends on paying within the agreed time. Paying in notes and coins does not matter; 45 days is outside the 30-day limit.'),
    mc('recording', 'How is trade discount recorded in the ledger accounts of the seller?',
      ['It is not recorded; only the net amount is entered', 'It is debited to the discount allowed account', 'It is credited to the discount received account', 'It is recorded as a selling expense in the journal'], 0,
      'Trade discount is deducted on the invoice, and only the net amount after trade discount is entered in the books.'),
    mc('recording', 'When is trade discount deducted?',
      ['On the invoice, at the time of sale', 'When the customer pays early', 'At the end of the financial year', 'Only if the customer returns goods'], 0,
      'Trade discount is taken off the list price on the invoice itself.'),
    mc('recording', 'When is a cash discount deducted?',
      ['When payment is made within the time limit', 'On the invoice, at the time of the sale', 'When the goods are delivered to the buyer', 'When the purchase order is sent to the seller'], 0,
      'Cash discount is only shown as a term on the invoice; it is deducted later, if and when the customer pays in time.'),
    mc('recording', 'Which statement about trade discount is correct?',
      ['It is a reduction from list price for trade buyers', 'It is a reward for paying invoices within 30 days', 'It is entered in the ledger as a selling expense', 'It is only given to customers paying in notes and coins'], 0,
      'Trade discount reduces the list price for trade and bulk buyers. It is never entered in the ledger.'),
    mc('recording', 'Which statement about cash discount is correct?',
      ['It is only taken if payment is made in time', 'It is deducted from list price on the invoice', 'It is given for buying large quantities', 'It means the customer must pay in notes and coins'], 0,
      'Cash discount is conditional on prompt payment and is not deducted on the invoice.'),
    mc('choose-discount', 'A seller has plenty of orders but is short of cash because customers take a long time to pay. Which discount would best help?',
      ['Cash discount', 'Trade discount', 'A higher list price', 'No discount at all'], 0,
      'Cash discount encourages customers to pay sooner, which brings money in more quickly.'),
    mc('choose-discount', 'A manufacturer wants trade customers to place larger orders. Which discount would best help?',
      ['Trade discount', 'Cash discount', 'Settlement discount', 'Discount received'], 0,
      'Trade discount rewards trade customers and bulk orders, encouraging bigger and repeat purchases.'),
    mc('choose-discount', 'Why might a buyer choose to pay an invoice early in order to take a cash discount?',
      ['It lowers the cost of the goods bought', 'It increases the trade discount given', 'It means the invoice is not recorded', 'It turns the purchase into a cash sale'], 0,
      'Paying early means the buyer pays less than the invoice total, so the goods cost less overall.'),
    mc('recording', 'A student wrote: "Cash discount is given to customers who pay with cash instead of by cheque." Why is this wrong?',
      ['It is given for paying within an agreed time', 'It is given for buying in large quantities', 'It is given only to other businesses', 'It is given only on cash sales'], 0,
      'Despite its name, cash discount is about when the customer pays, not how. A cheque or bank transfer paid in time also earns it.')
  ] };

  // =====================================================================
  // ACC-REC-04 Completing an invoice or credit note
  // =====================================================================
  var PRODUCTS = [['Desk lamps', [1250, 1480, 995]], ['Folding stools', [4250, 3990, 5600]], ['Storage boxes', [345, 420, 275]],
    ['Notebooks', [180, 215, 240]], ['Phone cases', [650, 725, 880]], ['Water bottles', [495, 560, 610]], ['Wall clocks', [1875, 2240, 1660]],
    ['Garden hoses', [1395, 1520, 1150]], ['Kettles', [2280, 2650, 1940]], ['Bath towels', [735, 890, 640]], ['Coffee mugs', [325, 380, 410]],
    ['USB cables', [260, 315, 190]], ['Table fans', [3150, 2875, 3460]], ['Picture frames', [585, 470, 745]]];
  var SELLERS = ['Kestrel Supplies', 'Bluewater Traders', 'Halden Wholesale', 'Orchid Home Goods', 'Ridgeway Distributors', 'Lantern Trading Co', 'Saffron Imports', 'Copperfield Wholesale'];
  var RATES = [5, 10, 15, 20, 25];
  function makeDoc(n, rate) {
    for (;;) {
      var lines = sample(PRODUCTS, n).map(function (p) { var q = rint(3, 48), pc = pick(p[1]); return { d: p[0], q: q, pc: pc, tc: q * pc }; });
      var sub = lines.reduce(function (s, l) { return s + l.tc; }, 0), r = rate || pick(RATES);
      if ((sub * r) % 100 === 0 && sub < 2000000) return { lines: lines, sub: sub, rate: r, disc: sub * r / 100, net: sub - sub * r / 100, seller: pick(SELLERS), buyer: pick(NAMES) };
    }
  }
  // gaps: {line0: '(i)', sub: '(iii)', ...}; a key mapped to a number (cents) shows that figure instead.
  function docHtml(title, d, gaps, terms) {
    gaps = gaps || {};
    function cell(key, val) { return gaps[key] == null ? c2(val) : (typeof gaps[key] === 'number' ? c2(gaps[key]) : '<b>' + gaps[key] + '</b>'); }
    var rows = d.lines.map(function (l, i) { return [l.d, l.q, c2(l.pc), cell('line' + i, l.tc)]; });
    rows.push(['Subtotal', '', '', cell('sub', d.sub)]);
    rows.push(['Less trade discount at ' + d.rate + '%', '', '', cell('disc', d.disc)]);
    rows.push(['Total due', '', '', cell('net', d.net)]);
    return '<b>' + title + '</b> from ' + d.seller + ' to ' + d.buyer + '<br>' + tbl(['Description', 'Quantity', 'Unit cost $', 'Total cost $'], rows) + (terms ? '<i>' + terms + '</i>' : '');
  }
  function lc(s) { return s.indexOf('USB') === 0 ? s : s.toLowerCase(); }
  function numC(q, cents, why) { return { kind: 'num', q: q, answer: cents / 100, unit: '$', tol: 0.005, display: c2(cents), why: why }; }
  function lineWork(d) { return d.lines.map(function (l) { return l.q + ' × ' + c2(l.pc) + ' = ' + c2(l.tc); }).join('; '); }
  function mcqC(q, correct, distract, why) { return mcqVals(q, correct, distract, function (c) { return '$' + c2(c); }, why); }

  B['ACC-REC-04'] = { title: 'Completing an invoice or credit note', items: [
    { skill: 'line-total', gen: function () {
      var d = makeDoc(2), l = d.lines[0];
      return numC('Complete gap (i) on this invoice. Give your answer in $ to 2 decimal places.<br>' + docHtml('Invoice', d, { line0: '(i)', line1: '(ii)', sub: '(iii)', disc: '(iv)', net: '(v)' }),
        l.tc, 'A line total is quantity × unit cost: ' + l.q + ' × $' + c2(l.pc) + ' = $' + c2(l.tc) + '.');
    } },
    { skill: 'line-total', gen: function () {
      var d = makeDoc(2), l = d.lines[1];
      return numC('Complete gap (ii) on this credit note for goods returned. Give your answer in $ to 2 decimal places.<br>' + docHtml('Credit note', d, { line0: '(i)', line1: '(ii)', sub: '(iii)', disc: '(iv)', net: '(v)' }, 'Reason: goods damaged in transit'),
        l.tc, 'A credit note is laid out like an invoice: ' + l.q + ' × $' + c2(l.pc) + ' = $' + c2(l.tc) + '.');
    } },
    { skill: 'line-total', gen: function () {
      var d = makeDoc(3), l = d.lines[1];
      var q = 'On an invoice from ' + d.seller + ', the line for ' + lc(l.d) + ' shows a quantity of ' + l.q + ' and a line total of $' + c2(l.tc) + ', but the unit cost has been smudged. What is the unit cost? Give your answer in $ to 2 decimal places.';
      return numC(q, l.pc, 'Unit cost = line total ÷ quantity = $' + c2(l.tc) + ' ÷ ' + l.q + ' = $' + c2(l.pc) + '.');
    } },
    { skill: 'line-total', gen: function () {
      var d = makeDoc(2), l = d.lines[0];
      var q = 'A line on an invoice from ' + d.seller + ' shows ' + lc(l.d) + ' at a unit cost of $' + c2(l.pc) + ' and a line total of $' + c2(l.tc) + '. How many units were supplied?';
      return { kind: 'num', q: q, answer: l.q, unit: '', display: String(l.q), why: 'Quantity = line total ÷ unit cost = $' + c2(l.tc) + ' ÷ $' + c2(l.pc) + ' = ' + l.q + '.' };
    } },
    { skill: 'subtotal', gen: function () {
      var d = makeDoc(2);
      return numC('Complete gap (iii), the subtotal, on this invoice. Give your answer in $ to 2 decimal places.<br>' + docHtml('Invoice', d, { line0: '(i)', line1: '(ii)', sub: '(iii)', disc: '(iv)', net: '(v)' }),
        d.sub, 'Line totals: ' + lineWork(d) + '. Subtotal = $' + c2(d.lines[0].tc) + ' + $' + c2(d.lines[1].tc) + ' = $' + c2(d.sub) + '.');
    } },
    { skill: 'subtotal', gen: function () {
      var d = makeDoc(3);
      return numC('Complete the subtotal on this invoice, which has three lines. Give your answer in $ to 2 decimal places.<br>' + docHtml('Invoice', d, { line0: '?', line1: '?', line2: '?', sub: '(iv)', disc: '(v)', net: '(vi)' }),
        d.sub, 'Line totals: ' + lineWork(d) + '. Adding them gives the subtotal at list price, $' + c2(d.sub) + '.');
    } },
    { skill: 'trade-discount', gen: function () {
      var d = makeDoc(2);
      return numC('Complete gap (iv), the trade discount, on this invoice. Give your answer in $ to 2 decimal places.<br>' + docHtml('Invoice', d, { disc: '(iv)', net: '(v)' }),
        d.disc, 'Trade discount is a percentage of the subtotal: ' + d.rate + '% × $' + c2(d.sub) + ' = $' + c2(d.disc) + '.');
    } },
    { skill: 'trade-discount', gen: function () {
      var d = makeDoc(2), wrong1 = Math.round(d.lines[0].tc * d.rate / 100);
      var q = 'On this invoice the trade discount is missing. Which figure should be entered for the trade discount?<br>' + docHtml('Invoice', d, { disc: '?', net: '?' });
      var o = mcqC(q, d.disc, [wrong1, d.net, Math.round(d.lines[1].tc * d.rate / 100)],
        'Trade discount is worked out on the whole subtotal, not on one line: ' + d.rate + '% × $' + c2(d.sub) + ' = $' + c2(d.disc) + '.');
      return o;
    } },
    { skill: 'trade-discount', gen: function () {
      var d = makeDoc(3);
      return numC('Complete gap (v), the trade discount, on this credit note. Give your answer in $ to 2 decimal places.<br>' + docHtml('Credit note', d, { line0: '(i)', line1: '(ii)', line2: '(iii)', sub: '(iv)', disc: '(v)', net: '(vi)' }, 'Reason: wrong goods delivered'),
        d.disc, 'Line totals: ' + lineWork(d) + '. Subtotal $' + c2(d.sub) + '. Trade discount = ' + d.rate + '% × $' + c2(d.sub) + ' = $' + c2(d.disc) + '.');
    } },
    { skill: 'net-total', gen: function () {
      var d = makeDoc(2), cr = pick([2, 3, 5]);
      return numC('Complete gap (v), the total, on this invoice. Give your answer in $ to 2 decimal places.<br>' + docHtml('Invoice', d, { line0: '(i)', line1: '(ii)', sub: '(iii)', disc: '(iv)', net: '(v)' }, 'Terms: ' + cr + '% cash discount if paid within 21 days.'),
        d.net, 'Line totals: ' + lineWork(d) + '. Subtotal $' + c2(d.sub) + '; trade discount ' + d.rate + '% = $' + c2(d.disc) + '; total = $' + c2(d.sub) + ' − $' + c2(d.disc) + ' = $' + c2(d.net) + '. The cash discount is only a term and is not deducted.');
    } },
    { skill: 'net-total', gen: function () {
      var d = makeDoc(3);
      return numC('Complete the total owed on this invoice. Give your answer in $ to 2 decimal places.<br>' + docHtml('Invoice', d, { line0: '?', line1: '?', line2: '?', sub: '?', disc: '?', net: '?' }),
        d.net, 'Line totals: ' + lineWork(d) + '. Subtotal $' + c2(d.sub) + '; trade discount ' + d.rate + '% = $' + c2(d.disc) + '; total = $' + c2(d.net) + '.');
    } },
    { skill: 'net-total', gen: function () {
      var d = makeDoc(2), cr = pick([2, 4, 5]);
      var cashOff = Math.round(d.net * (100 - cr) / 100), subCash = Math.round(d.sub * (100 - cr) / 100);
      var q = 'What figure should appear as the total on this invoice?<br>' + docHtml('Invoice', d, { net: '?' }, 'Terms: ' + cr + '% discount if paid within 14 days.');
      return mcqC(q, d.net, [cashOff, d.sub, subCash],
        'Total = subtotal − trade discount = $' + c2(d.sub) + ' − $' + c2(d.disc) + ' = $' + c2(d.net) + '. The ' + cr + '% cash discount is not deducted on the invoice; it is only taken if the customer pays within 14 days.');
    } },
    { skill: 'credit-note', gen: function () {
      var d = makeDoc(1);
      var l = d.lines[0];
      var q = d.buyer + ' returned ' + l.q + ' ' + lc(l.d) + ' bought from ' + d.seller + ' at $' + c2(l.pc) + ' each, less ' + d.rate + '% trade discount. What total should appear on the credit note? Give your answer in $ to 2 decimal places.';
      return numC(q, d.net, 'Gross value ' + l.q + ' × $' + c2(l.pc) + ' = $' + c2(d.sub) + '. Less the same ' + d.rate + '% trade discount ($' + c2(d.disc) + ') gives $' + c2(d.net) + ', the amount by which the debt is reduced.');
    } },
    { skill: 'credit-note', gen: function () {
      var d = makeDoc(2), r2 = d.rate === 10 ? 20 : 10;
      var q = 'Goods originally sold with ' + d.rate + '% trade discount are returned. What figure should appear as the total on this credit note?<br>' + docHtml('Credit note', d, { disc: '?', net: '?' }, 'Reason: goods faulty');
      return mcqC(q, d.net, [d.sub, d.disc, Math.round(d.sub * (100 - r2) / 100)],
        'The customer is credited the net amount, using the same trade discount as the sale: $' + c2(d.sub) + ' − ' + d.rate + '% ($' + c2(d.disc) + ') = $' + c2(d.net) + '. Crediting the list price would give back more than was charged.');
    } },
    { skill: 'credit-note', gen: function () {
      var d = makeDoc(2);
      return numC('Complete the total on this credit note. Give your answer in $ to 2 decimal places.<br>' + docHtml('Credit note', d, { line0: '(i)', line1: '(ii)', sub: '(iii)', disc: '(iv)', net: '(v)' }, 'Reason: goods not ordered'),
        d.net, 'Line totals: ' + lineWork(d) + '. Subtotal $' + c2(d.sub) + ' less ' + d.rate + '% trade discount ($' + c2(d.disc) + ') = $' + c2(d.net) + '.');
    } },
    { skill: 'invoice-errors', gen: function () {
      var d = makeDoc(2), type = pick(['line', 'sub', 'disc', 'net']), shown = {}, why;
      var l0 = d.lines[0].tc, l1 = d.lines[1].tc, sub = d.sub, disc = d.disc, net = d.net;
      if (type === 'line') { l1 = d.lines[1].tc + pick([1000, 2000, 500]); sub = l0 + l1; disc = sub * d.rate / 100; net = sub - disc;
        why = 'The ' + lc(d.lines[1].d) + ' line should be ' + d.lines[1].q + ' × $' + c2(d.lines[1].pc) + ' = $' + c2(d.lines[1].tc) + ', not $' + c2(l1) + '. The later figures were worked correctly from that wrong line.'; }
      if (type === 'sub') { sub = d.sub + pick([1000, 2000, 3000]); disc = sub * d.rate / 100; net = sub - disc;
        why = 'The two line totals add to $' + c2(d.sub) + ', not $' + c2(sub) + '. The discount and total were then worked correctly from the wrong subtotal.'; }
      if (type === 'disc') { disc = Math.round(l0 * d.rate / 100); net = sub - disc;
        why = 'The trade discount was worked out on the first line only. It should be ' + d.rate + '% × $' + c2(d.sub) + ' = $' + c2(d.disc) + '.'; }
      if (type === 'net') { net = Math.round(d.net * 0.95);
        why = 'The total should be $' + c2(d.sub) + ' − $' + c2(d.disc) + ' = $' + c2(d.net) + '. A 5% cash discount was also deducted, but cash discount is only a term and is never deducted on the invoice.'; }
      shown = { line0: l0, line1: l1, sub: sub, disc: disc, net: net };
      var q = 'One figure on this invoice was calculated wrongly. Every figure after it was worked correctly from the figures above it. Which figure was calculated wrongly?<br>' + docHtml('Invoice', d, shown, 'Terms: 5% cash discount for payment within 30 days.');
      var opts = ['The ' + lc(d.lines[1].d) + ' line total', 'The subtotal', 'The trade discount', 'The total'];
      return { kind: 'mcq', q: q, options: opts, answer: ['line', 'sub', 'disc', 'net'].indexOf(type), why: why };
    } },
    { skill: 'invoice-errors', gen: function () {
      var d = makeDoc(1), l = d.lines[0], wrongNet = d.sub;
      var q = 'A clerk prepared a credit note for ' + l.q + ' returned ' + lc(l.d) + ' at $' + c2(l.pc) + ' each. The original sale had ' + d.rate + '% trade discount. The clerk credited the customer with $' + c2(wrongNet) + '. By how much has the customer been over-credited? Give your answer in $ to 2 decimal places.';
      return numC(q, d.disc, 'The credit should be the net amount: $' + c2(d.sub) + ' − ' + d.rate + '% = $' + c2(d.net) + '. The clerk credited the list price, so the over-credit equals the trade discount, $' + c2(d.disc) + '.');
    } },
    mc('terms', 'Which item on an invoice is <b>not</b> deducted to arrive at the total the customer owes?',
      ['Cash discount for payment within 30 days', 'Trade discount for a trade customer', 'Trade discount for a bulk order', 'Trade discount for a regular buyer'], 0,
      'Trade discount is deducted on the invoice. Cash discount only appears as a term, because nobody knows yet whether the customer will pay in time.'),
    mc('credit-note', 'Goods sold with 15% trade discount are later returned. What trade discount rate should be used on the credit note?',
      ['15%, the same rate as on the sale', 'No discount, the full list price', 'The cash discount rate in the terms', 'Whatever rate applies on the day of return'], 0,
      'The customer is only credited with what was actually charged, so the original 15% trade discount is deducted on the credit note too.'),
    mu('terms', 'Which of these details normally appear on a sales invoice?',
      ['The seller\'s name and address', 'The customer\'s name and address', 'An invoice number and date', 'The customer\'s bank balance', 'The cash discount already taken off the total'], [0, 1, 2],
      'An invoice identifies the seller, the customer, the date and a reference number, plus the goods and amounts. It never shows the customer\'s bank balance, and cash discount is not deducted on it.'),
    mc('terms', 'A document lists goods returned by a customer, their quantity and price, the trade discount and a total, with "Reason: faulty goods" at the bottom. What title should be written at the top?',
      ['Credit note', 'Sales invoice', 'Statement of account', 'Purchase order'], 0,
      'A document for returned goods that reduces the customer\'s debt is a credit note.'),
    mc('subtotal', 'What does the subtotal on an invoice represent?',
      ['The total of the line totals at list price', 'The amount after trade discount is deducted', 'The amount after cash discount is deducted', 'The total the customer owes from earlier months'], 0,
      'The subtotal is the gross amount: all line totals added together before trade discount.'),
    mc('net-total', 'Which calculation gives the total owed at the bottom of an invoice?',
      ['Subtotal minus trade discount', 'Subtotal minus cash discount', 'Subtotal plus trade discount', 'Subtotal minus both discounts'], 0,
      'The customer owes the subtotal less trade discount. Cash discount is shown only as a term.')
  ] };

  // =====================================================================
  // ACC-REC-06 Choosing the book of original entry
  // =====================================================================
  var BOOKS = ['Sales day book', 'Purchases day book', 'Sales returns day book', 'Purchases returns day book', 'Cash book', 'Petty cash book', 'Journal'];
  function book(skill, q, correct, others, why) { return mc(skill, q, [correct].concat(others), 0, why); }
  B['ACC-REC-06'] = { title: 'Choosing the book of original entry', items: [
    book('credit-goods', 'Tomasz sells 30 jackets on credit to a clothing shop. In which book of original entry is this first recorded?', 'Sales day book',
      ['Cash book', 'Journal', 'Purchases day book'], 'Goods sold on credit go in the sales day book. No money has moved yet, so it is not the cash book.'),
    book('credit-goods', 'Priya buys goods for resale on credit from a wholesaler. In which book of original entry is this first recorded?', 'Purchases day book',
      ['Sales day book', 'Cash book', 'Journal'], 'Credit purchases of goods for resale are listed in the purchases day book.'),
    book('credit-goods', 'A trader receives an invoice from a supplier for goods bought to resell. In which book of original entry does the trader record it?', 'Purchases day book',
      ['Sales day book', 'Purchases returns day book', 'Journal'], 'An invoice received for goods bought on credit is a purchase invoice, so it is entered in the purchases day book.'),
    book('credit-goods', 'Kofi sells goods to a customer who pays immediately in cash. In which book is the sale first recorded?', 'Cash book',
      ['Sales day book', 'Journal', 'Petty cash book'], 'Money is received at once, so this cash sale goes in the cash book. Only credit sales go in the sales day book.'),
    book('returns', 'A credit customer returns faulty goods to Hana\'s shop. In which book of original entry is the return recorded?', 'Sales returns day book',
      ['Purchases returns day book', 'Sales day book', 'Journal'], 'Goods coming back from a credit customer are sales returns, recorded in the sales returns day book.'),
    book('returns', 'Rashid sends damaged goods back to the supplier he bought them from on credit. In which book of original entry is this recorded?', 'Purchases returns day book',
      ['Sales returns day book', 'Purchases day book', 'Cash book'], 'Goods sent back to a credit supplier are purchases returns.'),
    book('returns', 'Elena sends a credit note to a customer who returned goods. In which book of original entry does Elena record the credit note?', 'Sales returns day book',
      ['Purchases returns day book', 'Sales day book', 'Journal'], 'A credit note sent to a customer records a sales return, so it goes in the sales returns day book.'),
    book('returns', 'Nadia receives a credit note from a supplier after returning unwanted goods. In which book of original entry is it recorded in Nadia\'s books?', 'Purchases returns day book',
      ['Sales returns day book', 'Purchases day book', 'Petty cash book'], 'In the buyer\'s books a credit note received records a purchases return.'),
    book('cash-book', 'A customer settles their account by credit transfer straight into the business bank account. In which book of original entry is this first recorded?', 'Cash book',
      ['Sales day book', 'Journal', 'Sales returns day book'], 'Money received through the bank, including credit transfers, is recorded in the cash book.'),
    book('cash-book', 'A customer pays early and is allowed a cash discount. In which book is the discount allowed first recorded?', 'Cash book',
      ['Journal', 'Sales day book', 'Sales returns day book'], 'Discounts are first recorded in the discount column of the cash book when the payment is made.'),
    book('cash-book', 'A business pays its monthly rent by standing order. In which book of original entry is this payment first recorded?', 'Cash book',
      ['Journal', 'Petty cash book', 'Purchases day book'], 'A standing order is a payment out of the bank account, so it goes in the cash book.'),
    book('cash-book', 'A cheque received from a customer is returned unpaid (dishonoured) by the bank. In which book of original entry is this first recorded?', 'Cash book',
      ['Journal', 'Sales returns day book', 'Sales day book'], 'A dishonoured cheque reverses money that was banked, so it is recorded in the cash book.'),
    book('cash-book', 'Sipho pays a supplier within the agreed time and deducts a cash discount. In which book is the discount received first recorded?', 'Cash book',
      ['Journal', 'Purchases day book', 'Purchases returns day book'], 'Discount received is recorded in the cash book discount column at the time of payment, not in the journal.'),
    book('petty-cash', 'A receptionist buys postage stamps for $6 using the office float. In which book of original entry is this recorded?', 'Petty cash book',
      ['Cash book', 'Journal', 'Purchases day book'], 'Small cash payments from the petty cash float are recorded in the petty cash book.'),
    book('petty-cash', 'A taxi fare of $9 for delivering an urgent parcel is paid from petty cash. In which book of original entry is this recorded?', 'Petty cash book',
      ['Cash book', 'Purchases day book', 'Journal'], 'It is a small cash payment from the petty cash float, so it goes in the petty cash book.'),
    book('petty-cash', 'Milk and tea bags for the staff room are bought for $4 from the petty cash tin. In which book of original entry is this recorded?', 'Petty cash book',
      ['Purchases day book', 'Cash book', 'Sales day book'], 'Small office spending paid from the float belongs in the petty cash book.'),
    book('journal', 'Yuki buys a delivery van on credit from a garage. In which book of original entry is this first recorded?', 'Journal',
      ['Purchases day book', 'Cash book', 'Petty cash book'], 'A van is a non-current asset, not goods for resale, so a credit purchase of it goes in the journal.'),
    book('journal', 'A customer who owes $340 has disappeared and the debt is written off as irrecoverable. In which book of original entry is this recorded?', 'Journal',
      ['Cash book', 'Sales returns day book', 'Sales day book'], 'No money moves and no goods are involved, so writing off an irrecoverable debt is recorded in the journal.'),
    book('journal', 'An amount was posted to the wrong customer\'s account and must be corrected. In which book of original entry is the correction first recorded?', 'Journal',
      ['Cash book', 'Sales day book', 'Sales returns day book'], 'Corrections of errors are recorded in the journal.'),
    book('journal', 'Diego starts a business with a bank balance, equipment and a vehicle. In which book of original entry are these opening balances first recorded?', 'Journal',
      ['Cash book', 'Purchases day book', 'Petty cash book'], 'Opening entries for a new business are recorded in the journal.'),
    book('journal', 'Amara sells an old shop counter, a non-current asset, on credit to another trader. In which book of original entry is this recorded?', 'Journal',
      ['Sales day book', 'Cash book', 'Sales returns day book'], 'The sales day book is only for goods sold in the normal course of trade. Disposal of a non-current asset on credit is recorded in the journal.'),
    mc('purpose', 'What is a book of original entry?',
      ['Where a transaction is first recorded before ledger posting', 'Where the final balances of all accounts are listed', 'Where the year\'s profit is calculated', 'Where a customer\'s monthly balance is sent'], 0,
      'Transactions are first listed in a book of original (prime) entry, then posted to the ledger accounts.'),
    mc('purpose', 'Which book of original entry is used for transactions that do not belong in any of the other books?',
      ['The journal', 'The cash book', 'The petty cash book', 'The sales day book'], 0,
      'The journal records items such as non-current assets bought on credit, irrecoverable debts, corrections and opening entries.'),
    mc('purpose', 'What is recorded in the petty cash book?',
      ['Small cash payments made from a float', 'All money paid into the bank', 'Goods bought on credit for resale', 'Goods returned by credit customers'], 0,
      'The petty cash book records small everyday cash spending such as postage, cleaning and travel.'),
    mu('journal', 'Which of these are first recorded in the journal?',
      ['Buying office computers on credit', 'Writing off an irrecoverable debt', 'Correcting an error in the ledger', 'Selling goods on credit', 'Paying a supplier by cheque'], [0, 1, 2],
      'Non-current assets bought on credit, irrecoverable debts and corrections go in the journal. Credit sales go in the sales day book and cheque payments go in the cash book.'),
    mu('cash-book', 'Which of these are first recorded in the cash book?',
      ['Bank charges', 'A receipt by credit transfer', 'Discount allowed to a customer', 'A credit purchase of goods', 'Goods returned to a supplier'], [0, 1, 2],
      'Bank charges, credit transfers and discounts all involve the bank or a payment, so they go in the cash book. Credit purchases and returns go in day books.')
  ] };

  // =====================================================================
  // ACC-REC-02 Matching each transaction to its source document (and book)
  // =====================================================================
  B['ACC-REC-02'] = { title: 'Matching each transaction to its source document (and book)', items: [
    mc('money-documents', 'The bank adds interest to a business\'s bank account. What is the source document for this transaction?',
      ['Bank statement', 'Sales invoice', 'Cheque counterfoil', 'Credit note'], 0,
      'The business learns of interest only when it appears on the bank statement, so that is the source document.'),
    mc('money-documents', 'The bank deducts $18 of charges from a business account. What is the source document?',
      ['Bank statement', 'Receipt', 'Remittance advice', 'Purchase invoice'], 0,
      'Bank charges are shown on the bank statement; the business has no other document for them.'),
    mc('money-documents', 'Leila pays a supplier by writing a cheque. What source document does Leila keep for this payment?',
      ['Cheque counterfoil', 'Bank statement', 'Sales invoice', 'Credit note'], 0,
      'When a cheque is written, the counterfoil (stub) stays in the cheque book as the business\'s record.'),
    mc('money-documents', 'Ana writes a business cheque to pay her own home electricity bill. What is the source document for this drawing?',
      ['Cheque counterfoil', 'Purchase invoice', 'Petty cash voucher', 'Credit note'], 0,
      'The payment was made by business cheque, so the evidence the business holds is the cheque counterfoil.'),
    mc('money-documents', 'A business sells goods for cash to a walk-in customer. What is the source document for the sale?',
      ['Receipt (or till roll)', 'Sales invoice', 'Statement of account', 'Credit note'], 0,
      'A cash sale is evidenced by a receipt or the till roll. An invoice is used for credit sales; writing "invoice" here is a common error.'),
    mc('money-documents', 'A credit customer pays the amount owed by credit transfer directly into the business bank account. Which document shows this receipt?',
      ['Bank statement', 'Sales invoice', 'Credit note', 'Purchase order'], 0,
      'A credit transfer appears on the bank statement (a remittance advice from the customer may also show it). An invoice or credit note does not record money received.'),
    mc('money-documents', 'A customer\'s cheque arrives with a slip listing the invoices it pays. What is the slip, which supports the entry in the books?',
      ['Remittance advice', 'Credit note', 'Purchase order', 'Statement of account'], 0,
      'The slip sent with a payment showing which invoices are settled is a remittance advice.'),
    mc('goods-documents', 'A business sells goods on credit. What is the source document for the sale?',
      ['Sales invoice (copy)', 'Receipt', 'Bank statement', 'Remittance advice'], 0,
      'A credit sale is evidenced by the copy of the sales invoice sent to the customer.'),
    mc('goods-documents', 'A business buys goods for resale on credit. What is the source document?',
      ['Purchase invoice', 'Sales invoice', 'Receipt', 'Cheque counterfoil'], 0,
      'The supplier\'s invoice is the buyer\'s purchase invoice. Naming a sales invoice answers from the wrong side.'),
    mc('goods-documents', 'A credit customer returns faulty goods. What source document does the seller hold for this?',
      ['A copy of the credit note sent', 'A copy of the sales invoice', 'The bank statement', 'A cheque counterfoil'], 0,
      'The seller issues a credit note to the customer and keeps a copy as the source document for the sales return.'),
    mc('goods-documents', 'A business returns unwanted goods to a credit supplier. What source document does the business receive?',
      ['Credit note', 'Sales invoice', 'Receipt', 'Bank statement'], 0,
      'The supplier sends a credit note to reduce what the business owes; that credit note is the source document.'),
    mc('other-documents', 'A business buys a new photocopier on credit for use in its office. What is the source document?',
      ['Purchase invoice', 'Petty cash voucher', 'Credit note', 'Bank statement'], 0,
      'The supplier sends an invoice for the photocopier. It is entered in the journal, but the document is still a purchase invoice.'),
    mc('other-documents', 'Coffee for the office is bought for $7 using petty cash. What is the source document?',
      ['Petty cash voucher', 'Credit note', 'Bank statement', 'Statement of account'], 0,
      'Small cash spending from the float is supported by a petty cash voucher (often with the shop receipt attached).'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>buying a delivery van on credit</b>?',
      ['Purchase invoice; Journal', 'Purchase invoice; Purchases day book', 'Credit note; Journal', 'Receipt; Cash book'], 0,
      'The supplier\'s invoice is the document, but the van is a non-current asset, so it is entered in the journal rather than the purchases day book.'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>selling goods on credit</b>?',
      ['Sales invoice; Sales day book', 'Sales invoice; Cash book', 'Receipt; Sales day book', 'Credit note; Sales day book'], 0,
      'A credit sale is evidenced by a sales invoice and first recorded in the sales day book.'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>returning goods to a credit supplier</b>?',
      ['Credit note; Purchases returns day book', 'Credit note; Sales returns day book', 'Sales invoice; Purchases returns day book', 'Receipt; Purchases day book'], 0,
      'The supplier\'s credit note supports the return, which is a purchases return.'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>buying envelopes for $5 from petty cash</b>?',
      ['Petty cash voucher; Petty cash book', 'Purchase invoice; Purchases day book', 'Receipt; Journal', 'Petty cash voucher; Journal'], 0,
      'Small cash spending is supported by a petty cash voucher and recorded in the petty cash book.'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>bank charges taken by the bank</b>?',
      ['Bank statement; Cash book', 'Bank statement; Journal', 'Cheque counterfoil; Journal', 'Receipt; Petty cash book'], 0,
      'Bank charges appear on the bank statement and, like all bank payments, are recorded in the cash book.'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>a cash sale of goods</b>?',
      ['Receipt; Cash book', 'Sales invoice; Sales day book', 'Receipt; Sales day book', 'Sales invoice; Cash book'], 0,
      'A cash sale is supported by a receipt or till roll and recorded in the cash book, because money is received at once.'),
    mc('document-and-book', 'Which answer gives the correct source document, then the book of original entry, for <b>paying a supplier by credit transfer</b>?',
      ['Remittance advice; Cash book', 'Purchase invoice; Purchases day book', 'Remittance advice; Journal', 'Credit note; Cash book'], 0,
      'The business sends a remittance advice with the transfer (the payment also appears on the bank statement), and the payment goes in the cash book.'),
    mc('whose-books', 'Osei runs a shop. A wholesaler sells him goods on credit and sends an invoice. In <b>Osei\'s</b> books, what is this document?',
      ['Purchase invoice', 'Sales invoice', 'Credit note', 'Purchase order'], 0,
      'Always answer from the point of view of the business whose books are being written up. To Osei, the buyer, it is a purchase invoice.'),
    mu('money-documents', 'For which of these transactions is the bank statement the source document?',
      ['Bank interest received', 'Bank charges paid', 'Receipt from a customer by credit transfer', 'Sale of goods on credit', 'Return of goods to a supplier'], [0, 1, 2],
      'Interest, charges and credit transfers all appear on the bank statement. Credit sales and returns are supported by invoices and credit notes.'),
    mc('whose-books', 'A student wrote "invoice" as the source document for paying an electricity bill in cash. Which document should have been given?',
      ['Receipt', 'Sales invoice', 'Credit note', 'Purchase order'], 0,
      'When cash is paid, the evidence is the receipt received in return.')
  ] };

  // =====================================================================
  // ACC-REC-11 Writing up day books and returns books
  // =====================================================================
  function lp(lo, hi) { return rint(lo || 5, hi || 150) * 20; }           // list price, multiple of $20, so every trade discount is whole dollars
  function net(l, r) { return l - l * r / 100; }
  function num0(q, ans, why) { return { kind: 'num', q: q, answer: ans, unit: '$', display: d0(ans), why: why }; }
  function mcq0(q, correct, distract, why) { return mcqVals(q, correct, distract, function (v) { return '$' + d0(v); }, why); }
  function dayRows(rows) { return tbl(['Date', 'Name', '$'], rows); }
  function days(n) { var s = {}; var out = []; while (out.length < n) { var x = rint(2, 29); if (!s[x]) { s[x] = 1; out.push(x); } } return out.sort(function (a, b) { return a - b; }); }

  B['ACC-REC-11'] = { title: 'Writing up day books and returns books', items: [
    { skill: 'net-entry', gen: function () {
      var t = pick(TRADERS), s = pick(NAMES), m = pick(MONTHS), l = lp(), r = pick(RATES), n = net(l, r);
      return num0('On ' + rint(2, 28) + ' ' + m + ' ' + t + ' bought goods on credit from ' + s + ', list price $' + d0(l) + ' less ' + r + '% trade discount. What amount is entered in ' + t + '\'s purchases day book? Give your answer in $.',
        n, 'Only the net amount is entered: $' + d0(l) + ' − ' + r + '% ($' + d0(l * r / 100) + ') = $' + d0(n) + '.');
    } },
    { skill: 'net-entry', gen: function () {
      var t = pick(TRADERS), c = pick(NAMES), l = lp(10, 150), r = pick([10, 20, 25]), cr = pick([2, 5]), n = net(l, r);
      var q = t + ' sold goods on credit to ' + c + ' at a list price of $' + d0(l) + ', less ' + r + '% trade discount. The terms offer ' + cr + '% cash discount for payment within 30 days. What amount should appear in the sales day book?';
      return mcq0(q, n, [l, Math.round(n * (100 - cr) / 100), l * r / 100],
        'The sales day book shows list price less trade discount: $' + d0(l) + ' − $' + d0(l * r / 100) + ' = $' + d0(n) + '. Cash discount is never shown in a day book.');
    } },
    { skill: 'net-entry', gen: function () {
      var t = pick(TRADERS), s = pick(NAMES), l = lp(), cr = pick([2, 3, 5]);
      return num0(t + ' bought goods for resale on credit from ' + s + ' at a list price of $' + d0(l) + '. No trade discount was given, but ' + s + ' offers ' + cr + '% cash discount for payment within 14 days. What amount is entered in the purchases day book? Give your answer in $.',
        l, 'With no trade discount the full $' + d0(l) + ' is owed. The cash discount may or may not be taken later, so it is not deducted in the day book.');
    } },
    { skill: 'returns-value', gen: function () {
      var t = pick(TRADERS), s = pick(NAMES), m = pick(MONTHS), l = lp(25, 150), r = pick(RATES), rl = lp(2, 20), n = net(rl, r);
      if (rl >= l) rl = l / 2;
      n = net(rl, r);
      return num0('On 4 ' + m + ' ' + t + ' bought goods with a list price of $' + d0(l) + ' less ' + r + '% trade discount from ' + s + '. On 15 ' + m + ' goods from this batch with a list price of $' + d0(rl) + ' were returned to ' + s + '. What amount is entered in the purchases returns day book? Give your answer in $.',
        n, 'Returns are valued at list price less the same trade discount as the original purchase: $' + d0(rl) + ' − ' + r + '% = $' + d0(n) + '.');
    } },
    { skill: 'returns-value', gen: function () {
      var t = pick(TRADERS), s = pick(NAMES), m = pick(MONTHS), rr = sample(RATES, 2), dd = days(2), which = rint(0, 1);
      var rA = rr[which], rB = rr[1 - which], rl = lp(3, 25), n = net(rl, rA);
      var q = 'During ' + m + ', ' + t + ' made two credit purchases from ' + s + ': on ' + dd[0] + ' ' + m + ' less ' + rr[0] + '% trade discount, and on ' + dd[1] + ' ' + m + ' less ' + rr[1] + '% trade discount. Goods from the ' + dd[which] + ' ' + m + ' purchase with a list price of $' + d0(rl) + ' were returned. What amount is entered in the purchases returns day book?';
      return mcq0(q, n, [net(rl, rB), rl, rl * rA / 100],
        'Use the trade discount of the purchase the goods came from (' + dd[which] + ' ' + m + ', ' + rA + '%): $' + d0(rl) + ' − $' + d0(rl * rA / 100) + ' = $' + d0(n) + '. The other rate (' + rB + '%) does not apply to these goods.');
    } },
    { skill: 'returns-value', gen: function () {
      var t = pick(TRADERS), c = pick(NAMES), r = pick(RATES), rl = lp(2, 30), n = net(rl, r);
      return num0(t + ' sells to ' + c + ' on credit, always allowing ' + r + '% trade discount. ' + c + ' returned goods with a list price of $' + d0(rl) + '. What amount is entered in ' + t + '\'s sales returns day book? Give your answer in $.',
        n, 'The return is valued like the sale: list price less ' + r + '% trade discount = $' + d0(rl) + ' − $' + d0(rl * r / 100) + ' = $' + d0(n) + '.');
    } },
    { skill: 'book-total', gen: function () {
      var t = pick(TRADERS), ns = sample(NAMES, 4), dd = days(4), m = pick(MONTHS), r1 = pick(RATES), r2 = pick(RATES);
      var a = lp(), b = lp(), cc = lp(), e = lp();
      var tot = net(a, r1) + b + net(e, r2);
      var q = t + '\'s transactions with suppliers in ' + m + ':<br>' + tbl(['Date', 'Transaction'], [
        [dd[0] + ' ' + m, 'Bought goods on credit from ' + ns[0] + ', list price $' + d0(a) + ' less ' + r1 + '% trade discount'],
        [dd[1] + ' ' + m, 'Bought goods on credit from ' + ns[1] + ', list price $' + d0(b)],
        [dd[2] + ' ' + m, 'Bought goods from ' + ns[2] + ' for $' + d0(cc) + ', paid immediately by cheque'],
        [dd[3] + ' ' + m, 'Bought goods on credit from ' + ns[3] + ', list price $' + d0(e) + ' less ' + r2 + '% trade discount']]) +
        'What is the total of the purchases day book for ' + m + '? Give your answer in $.';
      return num0(q, tot, 'Enter only credit purchases at net value: $' + d0(net(a, r1)) + ' + $' + d0(b) + ' + $' + d0(net(e, r2)) + ' = $' + d0(tot) + '. The cheque purchase from ' + ns[2] + ' goes in the cash book.');
    } },
    { skill: 'book-total', gen: function () {
      var t = pick(TRADERS), ns = sample(NAMES, 4), dd = days(4), m = pick(MONTHS), r = pick([10, 20, 25]);
      var a = lp(), b = lp(), cs = lp(), e = lp();
      var tot = net(a, r) + net(b, r) + net(e, r);
      var q = t + ' allows all credit customers ' + r + '% trade discount. Sales in ' + m + ':<br>' + tbl(['Date', 'Transaction'], [
        [dd[0] + ' ' + m, 'Credit sale to ' + ns[0] + ', list price $' + d0(a)],
        [dd[1] + ' ' + m, 'Credit sale to ' + ns[1] + ', list price $' + d0(b)],
        [dd[2] + ' ' + m, 'Cash sale to ' + ns[2] + ', $' + d0(cs)],
        [dd[3] + ' ' + m, 'Credit sale to ' + ns[3] + ', list price $' + d0(e)]]) +
        'What is the total of the sales day book for ' + m + '? Give your answer in $.';
      return num0(q, tot, 'Credit sales at net value: $' + d0(net(a, r)) + ' + $' + d0(net(b, r)) + ' + $' + d0(net(e, r)) + ' = $' + d0(tot) + '. The cash sale is recorded in the cash book, not the sales day book.');
    } },
    { skill: 'book-total', gen: function () {
      var t = pick(TRADERS), ns = sample(NAMES, 2), m = pick(MONTHS), r1 = pick([10, 20]), r2 = pick([5, 15, 25]);
      var x = lp(2, 25), y = lp(2, 25), tot = net(x, r1) + net(y, r2);
      var q = 'In ' + m + ' ' + t + ' returned goods to two credit suppliers:<br>' + tbl(['Date', 'Transaction'], [
        ['9 ' + m, 'Returned goods, list price $' + d0(x) + ', to ' + ns[0] + ' (originally bought less ' + r1 + '% trade discount)'],
        ['23 ' + m, 'Returned goods, list price $' + d0(y) + ', to ' + ns[1] + ' (originally bought less ' + r2 + '% trade discount)']]) +
        'What is the total of the purchases returns day book for ' + m + '? Give your answer in $.';
      return num0(q, tot, 'Each return is valued at its own original trade discount: $' + d0(net(x, r1)) + ' + $' + d0(net(y, r2)) + ' = $' + d0(tot) + '.');
    } },
    { skill: 'book-total', gen: function () {
      var t = pick(TRADERS), ns = sample(NAMES, 2), m = pick(MONTHS), todate = rint(40, 160) * 25, r = pick([10, 20]), td = rint(15, 21);
      var a = lp(), b = lp(), tot = todate + net(a, r) + net(b, r);
      var q = t + '\'s sales day book shows a total to date of $' + d0(todate) + ' on ' + td + ' ' + m + '. Later that month there were two more credit sales, each less ' + r + '% trade discount: to ' + ns[0] + ', list price $' + d0(a) + ', and to ' + ns[1] + ', list price $' + d0(b) + '. What is the total of the sales day book for the month? Give your answer in $.';
      return num0(q, tot, '$' + d0(todate) + ' + $' + d0(net(a, r)) + ' + $' + d0(net(b, r)) + ' = $' + d0(tot) + '. The new lines are entered at net value after ' + r + '% trade discount.');
    } },
    { skill: 'book-total', gen: function () {
      var t = pick(TRADERS), ns = sample(NAMES, 3), m = pick(MONTHS), r = pick([10, 20, 25]);
      var s1 = lp(), ret1 = lp(2, 15), ret2 = lp(2, 15), tot = net(ret1, r) + net(ret2, r);
      var q = t + ' gives all credit customers ' + r + '% trade discount. In ' + m + ':<br>' + tbl(['Date', 'Transaction'], [
        ['3 ' + m, 'Sold goods on credit to ' + ns[0] + ', list price $' + d0(s1)],
        ['11 ' + m, ns[1] + ' returned goods, list price $' + d0(ret1)],
        ['19 ' + m, 'Returned goods to supplier ' + ns[2] + ', list price $' + d0(lp(2, 10))],
        ['27 ' + m, ns[0] + ' returned goods, list price $' + d0(ret2)]]) +
        'What is the total of the sales returns day book for ' + m + '? Give your answer in $.';
      return num0(q, tot, 'Only goods returned by customers go in the sales returns day book, at net value: $' + d0(net(ret1, r)) + ' + $' + d0(net(ret2, r)) + ' = $' + d0(tot) + '. The return to a supplier belongs in the purchases returns day book.');
    } },
    { skill: 'spot-error', gen: function () {
      var t = pick(TRADERS), ns = sample(NAMES, 4), dd = days(4), m = pick(MONTHS), r = pick([10, 20, 25]);
      var ls = [lp(), lp(), lp(), lp()], bad = rint(0, 3), type = pick(['list', 'cash', 'cashdisc']);
      var rows = [], desc = [];
      for (var i = 0; i < 4; i++) {
        var amt = net(ls[i], r), d = 'Bought goods on credit from ' + ns[i] + ', list price $' + d0(ls[i]) + ' less ' + r + '% trade discount';
        if (i === bad && type === 'list') amt = ls[i];
        if (i === bad && type === 'cash') { amt = ls[i]; d = 'Bought goods from ' + ns[i] + ' for $' + d0(ls[i]) + ', paid in cash'; }
        if (i === bad && type === 'cashdisc') { amt = Math.round(net(ls[i], r) * 0.95); d = 'Bought goods on credit from ' + ns[i] + ', list price $' + d0(ls[i]) + ' less ' + r + '% trade discount; 5% cash discount offered for payment within 7 days'; }
        rows.push([dd[i] + ' ' + m, ns[i], d0(amt)]); desc.push([dd[i] + ' ' + m, d]);
      }
      var q = t + '\'s transactions:<br>' + tbl(['Date', 'Transaction'], desc) + 'A clerk wrote up the purchases day book:<br>' + dayRows(rows) + 'Which entry is wrong?';
      var why = type === 'list' ? 'The ' + ns[bad] + ' entry shows the list price $' + d0(ls[bad]) + '; it should be the net amount $' + d0(net(ls[bad], r)) + '.'
        : type === 'cash' ? 'The purchase from ' + ns[bad] + ' was paid in cash, so it belongs in the cash book, not the purchases day book.'
        : 'The ' + ns[bad] + ' entry has had the 5% cash discount deducted. Day books show list price less trade discount only: $' + d0(net(ls[bad], r)) + '.';
      return { kind: 'mcq', q: q, options: ns.map(function (n, i) { return 'The entry for ' + n + ' on ' + dd[i] + ' ' + m; }), answer: bad, why: why };
    } },
    { skill: 'select-entries', gen: function () {
      var t = pick(TRADERS), s = pick(NAMES), l = lp(3, 40), r = pick(RATES), n = net(l, r);
      var q = t + ' returned goods with a list price of $' + d0(l) + ' to ' + s + '. They had been bought on credit less ' + r + '% trade discount. Which entry is correct?';
      return { kind: 'mcq', q: q, options: ['Purchases returns day book, $' + d0(n), 'Purchases returns day book, $' + d0(l), 'Sales returns day book, $' + d0(n), 'Purchases day book, $' + d0(n)], answer: 0,
        why: 'Goods sent back to a supplier are purchases returns, valued at list price less the original ' + r + '% trade discount: $' + d0(n) + '.' };
    } },
    { skill: 'select-entries', gen: function () {
      var t = pick(TRADERS), c = pick(NAMES), l = lp(5, 60), r = pick(RATES), n = net(l, r);
      var q = t + ' sold goods on credit to ' + c + ' at a list price of $' + d0(l) + ' less ' + r + '% trade discount. Which entry is correct?';
      return { kind: 'mcq', q: q, options: ['Sales day book, $' + d0(n), 'Sales day book, $' + d0(l), 'Purchases day book, $' + d0(n), 'Cash book, $' + d0(n)], answer: 0,
        why: 'A credit sale goes in the sales day book at net value: $' + d0(l) + ' − ' + r + '% = $' + d0(n) + '.' };
    } },
    mc('layout', 'What does each line of a purchases day book show?',
      ['Date, supplier name and net amount', 'Date, supplier name and list price', 'Supplier name and cash discount', 'Date, goods description and profit'], 0,
      'Each entry shows the date, the supplier and the amount after trade discount, which is what is actually owed.'),
    mc('layout', 'How is cash discount shown in a sales day book?',
      ['It is not shown at all', 'It is deducted from each sale', 'It is shown in a separate column', 'It is added to each sale'], 0,
      'Day books show list price less trade discount only. Cash discount is recorded later in the cash book if the customer pays in time.'),
    mc('layout', 'When is a day book totalled?',
      ['At the end of the period, such as the month', 'After every single entry', 'Only at the end of the financial year', 'Only when a customer pays'], 0,
      'Each day book is totalled at the end of the period (usually monthly), with the date and "Total".'),
    mc('layout', 'At what value are goods returned by a credit customer entered in the sales returns day book?',
      ['List price less the trade discount on the sale', 'Full list price with no deduction', 'List price less any cash discount offered', 'The cost price paid by the seller'], 0,
      'The customer is credited with what they were charged, so the original trade discount is deducted.'),
    mu('select-entries', 'Which of these transactions are entered in a trader\'s <b>purchases day book</b>?',
      ['Goods for resale bought on credit with trade discount', 'Goods for resale bought on credit at list price', 'Goods for resale bought on credit with cash discount terms', 'Shop shelving bought on credit', 'Goods for resale bought and paid for by cheque'], [0, 1, 2],
      'Only credit purchases of goods for resale go in the purchases day book. Shelving is a non-current asset (journal) and the cheque purchase goes in the cash book.'),
    mu('select-entries', 'Which of these are entered in a trader\'s <b>sales returns day book</b>?',
      ['Faulty goods returned by a credit customer', 'A credit note sent to a customer for returned goods', 'Unwanted goods sent back by a credit customer', 'Goods returned to a supplier', 'A credit sale to a customer'], [0, 1, 2],
      'Goods coming back from credit customers, and the credit notes sent for them, go in the sales returns day book. Returns to a supplier go in the purchases returns day book, and credit sales go in the sales day book.'),
    mc('select-entries', 'Which of these is <b>not</b> entered in the sales day book?',
      ['A sale of goods for cash', 'A credit sale with trade discount', 'A credit sale at list price', 'A credit sale with cash discount terms'], 0,
      'Cash sales go straight into the cash book. All credit sales, whatever their discount terms, go in the sales day book.'),
    mc('layout', 'What does the total of the sales day book for a month show?',
      ['Credit sales for the month after trade discount', 'All cash and credit sales for the month', 'Money received from customers that month', 'Credit sales for the month at list price'], 0,
      'The sales day book lists only credit sales at net value, so its total is credit sales after trade discount.')
  ] };
})();
