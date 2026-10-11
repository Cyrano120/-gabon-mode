CREATE DATABASE IF NOT EXISTS gabon_mode CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gabon_mode;

-- Admin users
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,0) NOT NULL,
  compare_price DECIMAL(10,0) DEFAULT NULL,
  category_id INT,
  sizes VARCHAR(255) DEFAULT NULL,
  colors VARCHAR(255) DEFAULT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500) DEFAULT NULL,
  images JSON DEFAULT NULL,
  featured TINYINT(1) DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Customers
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_phone (phone)
) ENGINE=InnoDB;

-- Orders / Reservations
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(20) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  status ENUM('en_attente','confirmee','preparation','pret','livree','annulee') DEFAULT 'en_attente',
  total DECIMAL(10,0) NOT NULL,
  payment_method VARCHAR(50) DEFAULT NULL,
  payment_status ENUM('impaye','paye','rembourse') DEFAULT 'impaye',
  payment_reference VARCHAR(100) DEFAULT NULL,
  delivery_method VARCHAR(50) DEFAULT 'retrait_magasin',
  notes TEXT,
  qr_code VARCHAR(500) DEFAULT NULL,
  invoice_pdf VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Order items
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,0) NOT NULL,
  total_price DECIMAL(10,0) NOT NULL,
  size VARCHAR(50) DEFAULT NULL,
  color VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Payments log
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  method VARCHAR(50) NOT NULL,
  reference VARCHAR(100) DEFAULT NULL,
  amount DECIMAL(10,0) NOT NULL,
  status ENUM('initie','reussi','echoue','rembourse') DEFAULT 'initie',
  raw_response JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Delivery tracking
CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status ENUM('preparation','pret','livree') DEFAULT 'preparation',
  notes TEXT,
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- WhatsApp notifications log
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  recipient VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('envoye','echoue') DEFAULT 'envoye',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert default admin (password: admin123)
INSERT INTO admins (username, password_hash, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@gabonmode.com');

-- Insert categories
INSERT INTO categories (name, slug) VALUES
('Vêtements', 'vetements'),
('Chaussures', 'chaussures'),
('Accessoires', 'accessoires'),
('Sacs', 'sacs'),
('Montres', 'montres');

-- Insert sample products
INSERT INTO products (name, slug, description, price, category_id, sizes, stock, image_url, featured) VALUES
('Chemise Premium Lin Blanc', 'chemise-premium-lin-blanc', 'Chemise en lin blanc pur, coupe ajustée, idéale pour les occasions spéciales.', 45000, 1, 'S,M,L,XL', 15, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 1),
('Robe Élégante Soirée', 'robe-elegante-soiree', 'Rose de soirée en mousseline avec motifs floraux.', 65000, 1, 'S,M,L', 8, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 1),
('Baskets Premium Cuir', 'baskets-premium-cuir', 'Baskets en cuir véritable blanc, semelle confort.', 55000, 2, '39,40,41,42,43,44', 20, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 1),
('Sac à Main Tressé', 'sac-a-main-tresse', 'Sac en cuir tressé fait main, anse dorée.', 35000, 4, NULL, 12, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', 1),
('Montre Classique Acier', 'montre-classique-acier', 'Montre bracelet acier inoxydable, cadran bleu.', 85000, 5, NULL, 5, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', 0),
('Lunettes de Soleil Aviator', 'lunettes-soleil-aviator', 'Monture dorée, verres polarisés anti-UV.', 25000, 3, NULL, 25, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 0),
('Costume 2 Pièces Bleu Marine', 'costume-2pcs-bleu-marine', 'Costume moderne coupe slim en tissu italien.', 150000, 1, '38,40,42,44,46', 7, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', 1),
('Sandales Été Dorées', 'sandales-ete-dorees', 'Sandales plates à lanières dorées, confortables.', 18000, 2, '36,37,38,39,40', 18, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=400', 0);
