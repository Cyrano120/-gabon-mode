<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$orderId = $data['order_id'] ?? null;
$phone = $data['phone'] ?? '';
$amount = $data['amount'] ?? 0;

if (!$orderId || !$phone || !$amount) {
    http_response_code(400);
    echo json_encode(['error' => 'Commande, téléphone et montant requis']);
    exit;
}

$db = (new Database())->getConnection();

// Verify order exists
$stmt = $db->prepare('SELECT id, reference, status FROM orders WHERE id = ?');
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    http_response_code(404);
    echo json_encode(['error' => 'Commande non trouvée']);
    exit;
}

// Log payment attempt
$stmt = $db->prepare("INSERT INTO payments (order_id, method, reference, amount, status, raw_response) VALUES (?, 'airtel_money', ?, ?, 'initie', ?)");
$ref = 'AM-' . strtoupper(uniqid());
$stmt->execute([$orderId, $ref, $amount, json_encode(['phone' => $phone, 'amount' => $amount])]);

// Simulate Airtel Money USSD push
$ussdCode = '*182*' . $amount . '*' . $phone . '#';

echo json_encode([
    'success' => true,
    'payment_id' => $db->lastInsertId(),
    'reference' => $ref,
    'message' => 'Push USSD envoyé. Veuillez entrer votre code PIN sur votre téléphone.',
    'ussd' => $ussdCode,
    'instructions' => "Un paiement de {$amount} FCFA a été initié. Vous allez recevoir une notification sur votre téléphone. Entrez votre code PIN Airtel Money pour confirmer.",
]);
