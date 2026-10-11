CREATE DATABASE IF NOT EXISTS gabon_mode
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gabon_mode;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  category ENUM('Chaussures', 'Vetements', 'Accessoires') NOT NULL,
  description TEXT,
  price INT UNSIGNED NOT NULL DEFAULT 0,
  sizes JSON NOT NULL,
  status ENUM('Disponible', 'Stock faible', 'Sur demande', 'Indisponible') NOT NULL DEFAULT 'Disponible',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reservation_code VARCHAR(40) NOT NULL UNIQUE,
  customer_name VARCHAR(160) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  total INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('En attente', 'Validee', 'Annulee') NOT NULL DEFAULT 'En attente',
  qr_payload JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservation_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reservation_id BIGINT UNSIGNED NOT NULL,
  product_id VARCHAR(60),
  product_name VARCHAR(160) NOT NULL,
  price INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservation_items_reservation
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    ON DELETE CASCADE
);

INSERT INTO products (sku, name, category, description, price, sizes, status, image_url) VALUES
('GM-SH-001', 'Derbies signature anthracite', 'Chaussures', 'Cuir lisse, silhouette habillee et finition premium.', 45000, JSON_ARRAY('40','41','42','43'), 'Disponible', ''),
('GM-CL-003', 'Chemise noire coupe prestige', 'Vetements', 'Tissu leger, col structure et coupe moderne.', 26000, JSON_ARRAY('M','L','XL'), 'Disponible', ''),
('GM-AC-005', 'Ceinture cuir boucle or', 'Accessoires', 'Accessoire sobre avec detail dore.', 18000, JSON_ARRAY('Unique'), 'Disponible', '')
ON DUPLICATE KEY UPDATE name = VALUES(name);
