<?php
/**
 * Simple QR Code generator using Google Charts API (no external library needed)
 */
function generateQRCodeBase64($data) {
    $size = 150;
    $url = 'https://chart.googleapis.com/chart?chs=' . $size . 'x' . $size . '&cht=qr&chl=' . urlencode(is_string($data) ? $data : json_encode($data)) . '&choe=UTF-8';
    $imageData = @file_get_contents($url);
    if ($imageData === false) {
        // Fallback: render a placeholder
        return 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect fill="white" width="120" height="120"/><text x="60" y="60" text-anchor="middle" fill="#333" font-size="10">QR</text></svg>');
    }
    return 'data:image/png;base64,' . base64_encode($imageData);
}
