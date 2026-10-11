<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$period = $_GET['period'] ?? 'monthly';
$year = $_GET['year'] ?? date('Y');

switch ($period) {
    case 'daily':
        $stmt = $db->prepare("
            SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
            FROM orders
            WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? AND status != 'annulee'
            GROUP BY DATE(created_at)
            ORDER BY date
        ");
        $stmt->execute([$year, date('m')]);
        break;
    case 'monthly':
        $stmt = $db->prepare("
            SELECT DATE_FORMAT(created_at, '%Y-%m') as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
            FROM orders
            WHERE YEAR(created_at) = ? AND status != 'annulee'
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY date
        ");
        $stmt->execute([$year]);
        break;
    case 'yearly':
        $stmt = $db->prepare("
            SELECT YEAR(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
            FROM orders
            WHERE status != 'annulee'
            GROUP BY YEAR(created_at)
            ORDER BY date
        ");
        $stmt->execute();
        break;
}

echo json_encode($stmt->fetchAll());
