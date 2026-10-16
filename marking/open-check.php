<?php
// Accounting open-access answer checking. Written by igcse_engine open-site; the only PHP entry the open site has.
// .htaccess routes POST {base}check here. marking/check.php is a function library (never requested directly), so this
// file carries what the sign-in gate used to do before calling it: POST only, HTTPS only, crawler guard, size limit,
// then load the subject config and call the subject's endpoint function.
declare(strict_types=1);

function olv_open_check_refuse(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['error' => $message]);
}

header('Content-Type: application/json');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https'
    || (string)($_SERVER['SERVER_PORT'] ?? '') === '443';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    olv_open_check_refuse(405, 'POST only');
} elseif (!$https) {
    olv_open_check_refuse(403, 'HTTPS only');
} elseif ($ua === '' || preg_match('~bot|crawl|spider|scrap|curl/|wget/|python[-/]|httpx/|aiohttp/|libwww-perl|Go-http-client|Java/|node-fetch|undici|axios/|PostmanRuntime|HeadlessChrome|PhantomJS|Selenium|Playwright|Puppeteer~i', $ua)) {
    olv_open_check_refuse(403, 'Not available');
} elseif ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    olv_open_check_refuse(413, 'Answer too long');
} else {
    require_once __DIR__ . '/../accounting-config.php';
    require_once __DIR__ . '/check.php';
    ac_mk_endpoint();
}
