<?php
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Today's stats
$today = date('Y-m-d');
$stmt = $db->prepare("SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders WHERE DATE(created_at) = ? AND status != 'annulee'");
$stmt->execute([$today]);
$todayStats = $stmt->fetch();

// Monthly stats
$month = date('Y-m');
$stmt = $db->prepare("SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders WHERE DATE_FORMAT(created_at, '%Y-%m') = ? AND status != 'annulee'");
$stmt->execute([$month]);
$monthStats = $stmt->fetch();

// Total stats
$stmt = $db->prepare("SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != 'annulee'");
$stmt->execute();
$totalStats = $stmt->fetch();

// Orders by status
$stmt = $db->prepare("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
$stmt->execute();
$statusCounts = $stmt->fetchAll();

// Top products
$stmt = $db->prepare("
    SELECT oi.product_name, SUM(oi.quantity) as total_qty, SUM(oi.total_price) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'annulee'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY total_qty DESC
    LIMIT 10
");
$stmt->execute();
$topProducts = $stmt->fetchAll();

// Unique customers
$stmt = $db->prepare("SELECT COUNT(DISTINCT customer_id) as count FROM orders WHERE status != 'annulee'");
$stmt->execute();
$customers = $stmt->fetch();

// Recent orders
$stmt = $db->prepare("
    SELECT o.id, o.reference, c.name, o.total, o.status, o.created_at
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
    LIMIT 10
");
$stmt->execute();
$recentOrders = $stmt->fetchAll();

echo json_encode([
    'today' => [
        'orders' => (int)$todayStats['count'],
        'revenue' => (float)$todayStats['revenue'],
    ],
    'month' => [
        'orders' => (int)$monthStats['count'],
        'revenue' => (float)$monthStats['revenue'],
    ],
    'total' => [
        'orders' => (int)$totalStats['count'],
        'revenue' => (float)$totalStats['revenue'],
        'customers' => (int)$customers['count'],
    ],
    'status_counts' => $statusCounts,
    'top_products' => $topProducts,
    'recent_orders' => $recentOrders,
]);
