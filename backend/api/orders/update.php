<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

if (!$id || !$status) {
    http_response_code(400);
    echo json_encode(['error' => 'ID et statut requis']);
    exit;
}

$validStatuses = ['en_attente', 'confirmee', 'preparation', 'pret', 'livree', 'annulee'];
if (!in_array($status, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Statut invalide']);
    exit;
}

$db = (new Database())->getConnection();

try {
    $db->beginTransaction();

    $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);

    if (in_array($status, ['preparation', 'pret', 'livree'])) {
        $stmt = $db->prepare('INSERT INTO deliveries (order_id, status, notes, updated_by) VALUES (?, ?, ?, ?)');
        $stmt->execute([$id, $status, $data['notes'] ?? '', $data['admin_id'] ?? 1]);
    }

    $db->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Erreur: ' . $e->getMessage()]);
}
