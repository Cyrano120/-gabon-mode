<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api';
$path = parse_url($requestUri, PHP_URL_PATH);

// Route to public endpoints
$publicRoutes = [
    '/api/auth/login' => 'auth/login.php',
    '/api/categories' => 'categories.php',
    '/api/products' => 'products/list.php',
    '/api/products/featured' => 'products/list.php',
    '/api/products/category' => 'products/list.php',
    '/api/orders/create' => 'orders/create.php',
    '/api/orders/track' => 'orders/track.php',
    '/api/payments/airtel/init' => 'payments/airtel_init.php',
    '/api/payments/airtel/callback' => 'payments/airtel_callback.php',
    '/api/invoice/generate' => 'invoice/generate.php',
];

// Route to protected endpoints
$protectedRoutes = [
    '/api/admin/products' => 'products/admin_list.php',
    '/api/admin/products/create' => 'products/create.php',
    '/api/admin/products/update' => 'products/update.php',
    '/api/admin/products/delete' => 'products/delete.php',
    '/api/admin/orders' => 'orders/admin_list.php',
    '/api/admin/orders/update' => 'orders/update.php',
    '/api/admin/stats/dashboard' => 'stats/dashboard.php',
    '/api/admin/stats/sales' => 'stats/sales.php',
    '/api/admin/deliveries/update' => 'orders/delivery_update.php',
    '/api/admin/notify/whatsapp' => 'notify/whatsapp.php',
];

if (isset($publicRoutes[$path])) {
    require __DIR__ . '/' . $publicRoutes[$path];
} elseif (isset($protectedRoutes[$path])) {
    requireAuth();
    require __DIR__ . '/' . $protectedRoutes[$path];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found', 'path' => $path]);
}
