<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/qr_code_generator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$orderId = $_GET['order_id'] ?? null;

if (!$orderId) {
    http_response_code(400);
    echo json_encode(['error' => 'ID commande requis']);
    exit;
}

$db = (new Database())->getConnection();

$stmt = $db->prepare('
    SELECT o.*, c.name as customer_name, c.phone as customer_phone
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
');
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    http_response_code(404);
    echo json_encode(['error' => 'Commande non trouvée']);
    exit;
}

$stmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
$stmt->execute([$orderId]);
$items = $stmt->fetchAll();

// Generate QR data
$qrData = json_encode([
    'ref' => $order['reference'],
    'client' => $order['customer_name'],
    'total' => $order['total'],
    'date' => $order['created_at'],
]);
$qrCode = generateQRCodeBase64($qrData);

// Build invoice HTML
$itemsHtml = '';
foreach ($items as $item) {
    $itemsHtml .= "<tr><td>{$item['product_name']} x{$item['quantity']}</td><td align='right'>" . number_format($item['total_price'], 0, '.', ' ') . " FCFA</td></tr>";
}

$invoiceHtml = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'><title>Facture {$order['reference']}</title>
<style>
body{font-family:sans-serif;padding:40px;color:#333}
.header{text-align:center;border-bottom:2px solid #c9a84c;padding-bottom:20px;margin-bottom:20px}
.header h1{color:#1a1a2e;margin:0;font-size:24px}
.header p{color:#666;margin:4px 0}
.details{display:flex;justify-content:space-between;margin-bottom:20px}
.details div{flex:1}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
th,td{padding:10px;border-bottom:1px solid #eee;text-align:left}
th{background:#1a1a2e;color:#fff}
.total{text-align:right;font-size:20px;font-weight:700;color:#c9a84c;margin-bottom:30px}
.qr{text-align:center;margin-top:20px}
.footer{text-align:center;color:#999;font-size:12px;margin-top:40px;border-top:1px solid #eee;padding-top:20px}
</style></head>
<body>
<div class='header'>
<h1>GABON MODE</h1>
<p>PK12, Libreville - Gabon</p>
<p>Tel: +241 74 00 00 00</p>
</div>
<h2>FACTURE PRO-FORMA</h2>
<div class='details'>
<div><strong>Réf:</strong> {$order['reference']}<br><strong>Date:</strong> " . date('d/m/Y H:i', strtotime($order['created_at'])) . "</div>
<div style='text-align:right'><strong>Client:</strong> {$order['customer_name']}<br><strong>Tel:</strong> {$order['customer_phone']}</div>
</div>
<table><thead><tr><th>Article</th><th>Montant</th></tr></thead><tbody>{$itemsHtml}</tbody></table>
<div class='total'>Total: " . number_format($order['total'], 0, '.', ' ') . " FCFA</div>
<div class='qr'><img src='{$qrCode}' width='120' height='120'><br><small>Scannez pour identifier la commande</small></div>
<div class='footer'>Merci de votre confiance - Gabon Mode ✨</div>
</body></html>";

// Save invoice HTML
$filename = 'invoice-' . $order['reference'] . '.html';
$filepath = __DIR__ . '/../../invoices/' . $filename;
if (!is_dir(dirname($filepath))) mkdir(dirname($filepath), 0755, true);
file_put_contents($filepath, $invoiceHtml);

// Update order with invoice URL
$invoiceUrl = '/invoices/' . $filename;
$stmt = $db->prepare('UPDATE orders SET invoice_pdf = ?, qr_code = ? WHERE id = ?');
$stmt->execute([$invoiceUrl, $qrCode, $orderId]);

echo json_encode([
    'success' => true,
    'invoice_url' => $invoiceUrl,
    'qr_code' => $qrCode,
    'html' => $invoiceHtml,
]);
