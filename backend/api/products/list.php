<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $featured = $_GET['featured'] ?? false;
    $category = $_GET['category'] ?? null;
    $id = $_GET['id'] ?? null;

    if ($id) {
        $stmt = $db->prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.active = 1');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if ($product) {
            $product['images'] = $product['images'] ? json_decode($product['images'], true) : [$product['image_url']];
            $product['sizes'] = $product['sizes'] ? explode(',', $product['sizes']) : [];
        }
        echo json_encode($product ?: ['error' => 'Produit non trouvé']);
        exit;
    }

    $sql = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.active = 1';
    $params = [];

    if ($featured) {
        $sql .= ' AND p.featured = 1';
    }
    if ($category) {
        $sql .= ' AND c.slug = ?';
        $params[] = $category;
    }
    $sql .= ' ORDER BY p.featured DESC, p.created_at DESC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    foreach ($products as &$p) {
        $p['sizes'] = $p['sizes'] ? explode(',', $p['sizes']) : [];
    }

    echo json_encode(['products' => $products]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
