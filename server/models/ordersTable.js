import database from "../database/db.js";

export async function createOrdersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        buyer_id UUID NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        tax_price DECIMAL(10,2) NOT NULL,
        shipping_price DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20) DEFAULT 'COD',
        payment_info VARCHAR(255),
        order_status VARCHAR(50) DEFAULT 'Processing',
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    await database.query(query);
  } catch (error) {
    console.error("❌ Failed To Create Orders Table.", error);
    process.exit(1);
  }
}
