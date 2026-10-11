<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $reference = $_GET['ref'] ?? $_GET['reference'] ?? null;

    if ($reference) {
        $stmt = $db->prepare('
            SELECT o.*, c.name as customer_name, c.phone as customer_phone
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.reference = ?
        ');
        $stmt->execute([$reference]);
        $order = $stmt->fetch();

        if (!$order) {
            http_response_code(404);
            echo json_encode(['error' => 'Commande non trouvée']);
            exit;
        }

        $stmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();

        $stmt = $db->prepare('SELECT * FROM deliveries WHERE order_id = ? ORDER BY created_at DESC');
        $stmt->execute([$order['id']]);
        $order['deliveries'] = $stmt->fetchAll();

        echo json_encode($order);
    } else {
        $phone = $_GET['phone'] ?? '';
        if (!$phone) {
            http_response_code(400);
            echo json_encode(['error' => 'Référence ou téléphone requis']);
            exit;
        }
        $stmt = $db->prepare('
            SELECT o.*, c.name as customer_name, c.phone as customer_phone
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE c.phone = ?
            ORDER BY o.created_at DESC
        ');
        $stmt->execute([$phone]);
        echo json_encode(['orders' => $stmt->fetchAll()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
