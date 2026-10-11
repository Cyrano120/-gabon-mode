<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

$page = $_GET['page'] ?? 1;
$limit = $_GET['limit'] ?? 50;
$offset = ($page - 1) * $limit;

$stmt = $db->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?");
$stmt->execute([(int)$limit, (int)$offset]);
$products = $stmt->fetchAll();

$stmt = $db->prepare('SELECT COUNT(*) FROM products');
$stmt->execute();
$total = $stmt->fetchColumn();

echo json_encode([
    'products' => $products,
    'total' => (int)$total,
    'page' => (int)$page,
    'pages' => ceil($total / $limit),
]);
