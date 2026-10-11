<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$orderId = $data['order_id'] ?? null;
$message = $data['message'] ?? '';

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

// Build WhatsApp message
$defaultMessage = "Bonjour {$order['customer_name']} !\n";
$defaultMessage .= "Merci pour votre commande {$order['reference']} chez Gabon Mode 🛍️\n\n";

$stmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
$stmt->execute([$orderId]);
$items = $stmt->fetchAll();

foreach ($items as $item) {
    $defaultMessage .= "• {$item['product_name']} x{$item['quantity']} = " . number_format($item['total_price'], 0, '.', ' ') . " FCFA\n";
}
$defaultMessage .= "\nTotal: " . number_format($order['total'], 0, '.', ' ') . " FCFA\n";
$defaultMessage .= "Statut: " . str_replace('_', ' ', $order['status']) . "\n";
$defaultMessage .= "📱 Référence: {$order['reference']}\n\n";

switch ($order['status']) {
    case 'confirmee':
        $defaultMessage .= "✅ Votre commande est confirmée ! Nous vous contacterons dès qu'elle sera prête.\nRetrait à la boutique PK12, Libreville.";
        break;
    case 'pret':
        $defaultMessage .= "🎉 Votre commande est prête pour retrait au PK12 !\nPrésentez ce message à votre passage.";
        break;
    case 'livree':
        $defaultMessage .= "🎊 Commande livrée ! Merci de votre confiance.\nÀ bientôt chez Gabon Mode ✨";
        break;
    default:
        $defaultMessage .= "Merci de votre confiance !\nGabon Mode - PK12 Libreville";
}

$finalMessage = $message ?: $defaultMessage;

// Log notification
$stmt = $db->prepare("INSERT INTO notifications (order_id, type, recipient, message, status) VALUES (?, 'whatsapp', ?, ?, 'envoye')");
$stmt->execute([$orderId, $order['customer_phone'], $finalMessage]);

// Generate WhatsApp URL
$phone = preg_replace('/[^0-9]/', '', $order['customer_phone']);
$waUrl = 'https://wa.me/241' . $phone . '?text=' . urlencode($finalMessage);

echo json_encode([
    'success' => true,
    'whatsapp_url' => $waUrl,
    'message' => $finalMessage,
    'notification_id' => $db->lastInsertId(),
]);
