<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

$page = $_GET['page'] ?? 1;
$limit = $_GET['limit'] ?? 20;
$status = $_GET['status'] ?? null;
$offset = ($page - 1) * $limit;

$sql = '
    SELECT o.*, c.name as customer_name, c.phone as customer_phone
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
';
$params = [];
$countSql = 'SELECT COUNT(*) FROM orders o JOIN customers c ON o.customer_id = c.id';
$countParams = [];

if ($status) {
    $sql .= ' WHERE o.status = ?';
    $countSql .= ' WHERE o.status = ?';
    $params[] = $status;
    $countParams[] = $status;
}

$sql .= ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
$params[] = (int)$limit;
$params[] = (int)$offset;

$stmt = $db->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

$stmt = $db->prepare($countSql);
$stmt->execute($countParams);
$total = $stmt->fetchColumn();

foreach ($orders as &$order) {
    $stmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
    $stmt->execute([$order['id']]);
    $order['items'] = $stmt->fetchAll();
}

echo json_encode([
    'orders' => $orders,
    'total' => (int)$total,
    'page' => (int)$page,
    'pages' => ceil($total / $limit),
]);
