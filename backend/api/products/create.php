<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$description = $data['description'] ?? '';
$price = $data['price'] ?? 0;
$category_id = $data['category_id'] ?? null;
$sizes = $data['sizes'] ?? '';
$stock = $data['stock'] ?? 0;
$image_url = $data['image_url'] ?? '';
$featured = $data['featured'] ?? 0;

if (!$name || !$price) {
    http_response_code(400);
    echo json_encode(['error' => 'Nom et prix requis']);
    exit;
}

$slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $name), '-'));

$db = (new Database())->getConnection();
$stmt = $db->prepare('INSERT INTO products (name, slug, description, price, category_id, sizes, stock, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

try {
    $stmt->execute([$name, $slug, $description, $price, $category_id, $sizes, $stock, $image_url, $featured]);
    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Erreur lors de la création: ' . $e->getMessage()]);
}
