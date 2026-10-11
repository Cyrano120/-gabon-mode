<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Simulate Airtel Money callback
$data = json_decode(file_get_contents('php://input'), true);
$paymentRef = $data['payment_reference'] ?? $_POST['payment_reference'] ?? '';
$status = $data['status'] ?? 'reussi';
$transactionId = $data['transaction_id'] ?? 'TXN' . uniqid();

if (!$paymentRef) {
    http_response_code(400);
    echo json_encode(['error' => 'Référence de paiement requise']);
    exit;
}

$db = (new Database())->getConnection();

$stmt = $db->prepare('SELECT id, order_id FROM payments WHERE reference = ?');
$stmt->execute([$paymentRef]);
$payment = $stmt->fetch();

if (!$payment) {
    http_response_code(404);
    echo json_encode(['error' => 'Paiement non trouvé']);
    exit;
}

$newStatus = $status === 'reussi' ? 'reussi' : 'echoue';
$stmt = $db->prepare('UPDATE payments SET status = ?, raw_response = ? WHERE id = ?');
$stmt->execute([$newStatus, json_encode($data), $payment['id']]);

if ($newStatus === 'reussi') {
    $stmt = $db->prepare("UPDATE orders SET payment_status = 'paye', status = 'confirmee', payment_reference = ? WHERE id = ?");
    $stmt->execute([$transactionId, $payment['order_id']]);
}

echo json_encode(['success' => true, 'status' => $newStatus]);
