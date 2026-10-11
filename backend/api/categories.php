<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

$stmt = $db->prepare('SELECT * FROM categories ORDER BY name');
$stmt->execute();

echo json_encode(['categories' => $stmt->fetchAll()]);
