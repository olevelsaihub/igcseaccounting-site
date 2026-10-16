<?php
/**
 * Accounting 4AC1 answer checking (ported from Business 4BS1) (server side). Mirrors work/marking.py; no AI at marking time.
 * POST {"part": id, "answer": text} -> feedback after submission.
 * Rules come from the private bundle outside the web root (never served):
 *   {private_dir}/accounting-marking/bundle.json   (built by work/build_marking_bundle.py)
 * PHP 7.4 compatible. Not deployed: local build only until a release is approved.
 */
declare(strict_types=1);

function ac_mk_numbers(string $text): array {
    $out = [];
    // Mirrors marking.py: a thousands separator is one space, thin space or comma before exactly three digits.
    if (!preg_match_all('/[-\x{2212}\x{2013}]?\d{1,3}(?:[ ,\x{2009}\x{202F}\x{00A0}]\d{3})+(?!\d)(?:\.\d+)?|[-\x{2212}\x{2013}]?\d+(?:\.\d+)?/u', $text, $m)) return $out;
    foreach ($m[0] as $raw) {
        $raw = preg_replace('/[ ,\x{2009}\x{202F}\x{00A0}]/u', '', $raw);
        $raw = str_replace(["\u{2212}", "\u{2013}"], ['-', '-'], $raw);
        if (is_numeric($raw)) $out[] = (float)$raw;
    }
    return $out;
}

function ac_mk_close(float $x, array $values, float $tol): bool {
    foreach ($values as $v) if (abs($x - (float)$v) <= max($tol, 1e-9) + 1e-9) return true;
    return false;
}

function ac_mk_check(array $rule, string $answer): array {
    $mode = $rule['mode'];
    if ($mode === 'mcq') {
        if (!empty($rule['void'])) {
            return ['mode' => 'mcq', 'marks' => $rule['max'], 'max' => $rule['max'], 'correct' => null,
                    'feedback' => 'This question had no correct option in the exam, so every candidate was given the mark.'];
        }
        $letter = strtoupper(substr(trim($answer), 0, 1));
        $ok = $letter === $rule['key'];
        $fb = ['mode' => 'mcq', 'marks' => $ok ? $rule['max'] : 0, 'max' => $rule['max'], 'correct' => $ok,
               'key' => $rule['key'], 'why' => $rule['why'] ?? ''];
        if (!$ok && isset($rule['distractor_notes'][$letter])) $fb['your_option'] = $rule['distractor_notes'][$letter];
        return $fb;
    }
    if ($mode === 'numeric') {
        $ans = $rule['answer'];
        $tol = (float)($ans['tol'] ?? 0);
        $nums = ac_mk_numbers($answer);
        $final = $nums ? end($nums) : null;
        if ($final !== null && ac_mk_close($final, $ans['values'], $tol)) {
            return ['mode' => 'numeric', 'marks' => $rule['max'], 'max' => $rule['max'], 'correct' => true,
                    'working' => $rule['working'] ?? '', 'why' => $rule['why'] ?? ''];
        }
        $got = 0; $steps = [];
        foreach ($rule['partial'] ?? [] as $p) {
            $hit = false;
            // method marks need the intermediate value itself: within 0.2% (at least 0.0005), not a loose band
            foreach ($nums as $n) foreach ($p['accept_values'] ?? [] as $v) if (abs($n - (float)$v) <= max(abs((float)$v) * 0.002, 0.0005) + 1e-9) { $hit = true; break 2; }
            $steps[] = ['label' => $p['label'], 'found' => $hit];
            if ($hit) $got += (int)$p['marks'];
        }
        return ['mode' => 'numeric', 'marks' => min($got, $rule['max'] - 1), 'max' => $rule['max'], 'correct' => false,
                'steps' => $steps, 'working' => $rule['working'] ?? '', 'why' => $rule['why'] ?? ''];
    }
    if ($mode === 'figures') {
        $nums = ac_mk_numbers($answer);
        $low = ' ' . preg_replace('/[^a-z0-9]+/', ' ', strtolower($answer)) . ' ';
        $got = 0; $own = 0; $items = [];
        foreach ($rule['items'] as $it) {
            if (!empty($it['self_check'])) {   // presentation marks (dates, details, labels): a key word cannot judge them
                $items[] = ['label' => $it['label'], 'marks' => $it['marks'], 'found' => null];
                $own += (int)$it['marks'];
                continue;
            }
            $hit = false;
            foreach ($nums as $n) foreach ($it['accept_values'] ?? [] as $v) if (abs($n - (float)$v) <= max(abs((float)$v) * 0.002, 0.0005) + 1e-9) { $hit = true; break 2; }
            if (!$hit) foreach ($it['accept_words'] ?? [] as $w) {
                $w = ' ' . trim(preg_replace('/[^a-z0-9]+/', ' ', strtolower((string)$w))) . ' ';
                if (strpos($low, $w) !== false) { $hit = true; break; }
            }
            $items[] = ['label' => $it['label'], 'marks' => $it['marks'], 'found' => $hit];
            if ($hit) $got += (int)$it['marks'];
        }
        $got = min($got, (int)$rule['max'] - $own);
        return ['mode' => 'figures', 'marks' => $got, 'max' => $rule['max'], 'self_marks' => $own, 'correct' => $got === (int)$rule['max'] - $own, 'items' => $items,
                'ideal' => $rule['ideal'] ?? '', 'why' => $rule['why'] ?? '',
                'note' => 'Checked by figures and key words only: the place and side of each entry are not checked, so compare your layout with the model.'];
    }
    if ($mode === 'self') {
        return ['mode' => 'self', 'marks' => null, 'max' => $rule['max'], 'ideal' => $rule['ideal'],
                'checklist' => $rule['checklist'], 'levels' => $rule['levels'] ?? null, 'tip' => $rule['self_mark_tip'] ?? ''];
    }
    throw new RuntimeException('unknown mode');
}

/** Handle one POST {"part": id, "answer": text}. Called by auth-gate.php for an enrolled user's POST to {base}check. */
function ac_mk_endpoint(): void {
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    try {
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') throw new RuntimeException('POST only');
        require_once dirname(__DIR__) . '/accounting-config.php';
        $config = ac_config();
        if (!empty($config['bundle_key'])) {   // open deploy: marking/bundle.sealed, key only in the private config
            require_once __DIR__ . '/olv-bundle.php';
            $bundle = olv_open_bundle(__DIR__ . '/bundle.sealed', (string)$config['bundle_key']);
        } else {
            $bundleFile = rtrim((string)$config['private_dir'], '/') . '/accounting-marking/bundle.json';
            $bundle = json_decode((string)@file_get_contents($bundleFile), true);
        }
        $req = json_decode((string)file_get_contents('php://input', false, null, 0, 20000), true) ?: [];
        $rule = $bundle['rules'][(string)($req['part'] ?? '')] ?? null;
        if (!$rule) throw new RuntimeException('no checking rule for this part');
        echo json_encode(ac_mk_check($rule, substr((string)($req['answer'] ?? ''), 0, 5000)));
    } catch (Throwable $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Answer checking is not available right now.']);
    }
}
