// Accounting 4AC1 question bank filters. Pure client-side filtering of rows already in the page.
(() => {
  'use strict';
  const table = document.querySelector('[data-bank-table]');
  if (!table) return;
  const rows = [...table.querySelectorAll('tbody tr')];
  const controls = [...document.querySelectorAll('[data-bank-filter]')];
  const text = document.querySelector('[data-bank-text]');
  const status = document.querySelector('[data-bank-status]');
  function apply() {
    const wanted = Object.fromEntries(controls.map(c => [c.dataset.bankFilter, c.value]));
    const terms = (text ? text.value : '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const row of rows) {
      const ok = Object.entries(wanted).every(([key, value]) => !value || row.dataset[key] === value)
        && terms.every(t => row.dataset.search.includes(t));
      row.hidden = !ok;
      if (ok) shown++;
    }
    if (status) status.textContent = `${shown} of ${rows.length} question parts shown`;
  }
  for (const c of controls) c.addEventListener('change', apply);
  if (text) text.addEventListener('input', apply);
  apply();
})();
