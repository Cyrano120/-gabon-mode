<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$customerName = $data['customer_name'] ?? '';
$customerPhone = $data['customer_phone'] ?? '';
$items = $data['items'] ?? [];
$notes = $data['notes'] ?? '';

if (!$customerName || !$customerPhone || empty($items)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nom, téléphone et panier requis']);
    exit;
}

$db = (new Database())->getConnection();

try {
    $db->beginTransaction();

    // Find or create customer
    $stmt = $db->prepare('SELECT id FROM customers WHERE phone = ?');
    $stmt->execute([$customerPhone]);
    $customer = $stmt->fetch();

    if ($customer) {
        $customerId = $customer['id'];
        $stmt = $db->prepare('UPDATE customers SET name = ? WHERE id = ?');
        $stmt->execute([$customerName, $customerId]);
    } else {
        $stmt = $db->prepare('INSERT INTO customers (name, phone) VALUES (?, ?)');
        $stmt->execute([$customerName, $customerPhone]);
        $customerId = $db->lastInsertId();
    }

    // Calculate total
    $total = 0;
    foreach ($items as $item) {
        $total += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
    }

    // Generate reference
    $reference = 'GM-' . strtoupper(substr(uniqid(), -8));

    // Create order
    $stmt = $db->prepare('INSERT INTO orders (reference, customer_id, status, total, notes) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$reference, $customerId, 'en_attente', $total, $notes]);
    $orderId = $db->lastInsertId();

    // Create order items
    $stmt = $db->prepare('INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, size, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($items as $item) {
        $stmt->execute([
            $orderId,
            $item['product_id'] ?? 0,
            $item['name'] ?? '',
            $item['quantity'] ?? 1,
            $item['price'] ?? 0,
            ($item['price'] ?? 0) * ($item['quantity'] ?? 1),
            $item['size'] ?? null,
            $item['color'] ?? null,
        ]);
    }

    $db->commit();

    echo json_encode([
        'success' => true,
        'reference' => $reference,
        'order_id' => $orderId,
        'total' => $total,
    ]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la création: ' . $e->getMessage()]);
}
