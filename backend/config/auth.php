<?php
function generateJWT($payload) {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['iat'] = time();
    $payload['exp'] = time() + (24 * 3600);
    $payloadEncoded = base64url_encode(json_encode($payload));
    $secret = getenv('JWT_SECRET') ?: 'gabon_mode_secret_2026_pk12';
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payloadEncoded", $secret, true));
    return "$header.$payloadEncoded.$signature";
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $secret = getenv('JWT_SECRET') ?: 'gabon_mode_secret_2026_pk12';
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    if (!hash_equals($expected, $signature)) return null;
    $data = json_decode(base64url_decode($payload), true);
    if (!$data || (isset($data['exp']) && $data['exp'] < time())) return null;
    return $data;
}

function requireAuth() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $auth, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentification requise']);
        exit;
    }
    $user = verifyJWT($matches[1]);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Token invalide ou expiré']);
        exit;
    }
    return $user;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}
