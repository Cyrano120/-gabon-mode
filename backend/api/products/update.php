<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID produit requis']);
    exit;
}

$db = (new Database())->getConnection();
$fields = [];
$params = [];

foreach (['name', 'description', 'price', 'compare_price', 'category_id', 'sizes', 'colors', 'stock', 'image_url', 'featured', 'active'] as $field) {
    if (isset($data[$field])) {
        $fields[] = "$field = ?";
        $params[] = $data[$field];
    }
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['error' => 'Aucun champ à mettre à jour']);
    exit;
}

$params[] = $id;
$sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $db->prepare($sql);

if ($stmt->execute($params)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la mise à jour']);
}
