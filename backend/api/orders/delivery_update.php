<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$orderId = $data['order_id'] ?? null;
$status = $data['status'] ?? null;
$notes = $data['notes'] ?? '';

if (!$orderId || !$status) {
    http_response_code(400);
    echo json_encode(['error' => 'Commande et statut requis']);
    exit;
}

$validStatuses = ['preparation', 'pret', 'livree'];
if (!in_array($status, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Statut invalide']);
    exit;
}

$db = (new Database())->getConnection();

try {
    $db->beginTransaction();

    $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $orderId]);

    $stmt = $db->prepare("INSERT INTO deliveries (order_id, status, notes, updated_by) VALUES (?, ?, ?, ?)");
    $stmt->execute([$orderId, $status, $notes, $data['admin_id'] ?? 1]);

    $db->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Erreur: ' . $e->getMessage()]);
}
