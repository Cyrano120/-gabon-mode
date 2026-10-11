<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Identifiants requis']);
    exit;
}

$db = (new Database())->getConnection();
$stmt = $db->prepare('SELECT id, username, password_hash FROM admins WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Identifiants incorrects']);
    exit;
}

require_once __DIR__ . '/../../config/auth.php';
$token = generateJWT(['id' => $admin['id'], 'username' => $admin['username']]);

echo json_encode([
    'success' => true,
    'token' => $token,
    'user' => ['id' => $admin['id'], 'username' => $admin['username']]
]);
