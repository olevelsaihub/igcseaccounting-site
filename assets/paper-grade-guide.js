(function (root) {
  'use strict';

  // Pearson International GCSE Accounting 4AC1, June 2026 overall subject boundaries.
  // These apply to the named complete Paper 1 + Paper 2 pair, never to selected question parts.
  const boundaries = Object.freeze({
    standard: Object.freeze({9: 133, 8: 121, 7: 109, 6: 98, 5: 87, 4: 76, 3: 57, 2: 39, 1: 21}),
    regional: Object.freeze({9: 131, 8: 116, 7: 101, 6: 91, 5: 81, 4: 72, 3: 53, 2: 34, 1: 16})
  });

  function assessOfficialPair(variant, score) {
    const table = boundaries[variant];
    if (!table || !Number.isInteger(score) || score < 0 || score > 150) return null;
    const grade = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(level => score >= table[level]) || 0;
    const secureGrade = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(level => score >= table[level] + 10) || 0;
    const nextGrade = grade < 9 ? grade + 1 : null;
    return {
      variant, score, grade, secureGrade, nextGrade,
      nextMarks: nextGrade ? table[nextGrade] - score : 0,
      boundaries: table
    };
  }

  function describeCustomPaper(paper, types) {
    const topics = new Set();
    const difficultyMarks = {Easy: 0, Medium: 0, Difficult: 0, 'Very Difficult': 0};
    let total = 0;
    let legacyMarks = 0;
    for (const part of paper.parts || []) {
      const marks = Number(part.marks);
      if (!Number.isInteger(marks) || marks < 1) continue;
      total += marks;
      if (String(part.source || '').startsWith('4AC1-LEGACY-')) legacyMarks += marks;
      const type = types.get(part.typeKey);
      if (type?.topicId) topics.add(type.topicId);
      if (type?.difficulty in difficultyMarks) difficultyMarks[type.difficulty] += marks;
    }
    const filters = paper.filters || {};
    const focused = Boolean(filters.topic || filters.difficulty || filters.plan || filters.scopeMode) || total < 120 || topics.size < 5;
    return {total, topics: topics.size, difficultyMarks, legacyMarks, focused};
  }

  root.OlvPaperGradeGuide = Object.freeze({boundaries, assessOfficialPair, describeCustomPaper});
})(typeof window !== 'undefined' ? window : globalThis);
