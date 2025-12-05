import database from "../database/db.js";

export async function createPaymentsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

        order_id UUID NOT NULL UNIQUE,
        payment_type VARCHAR(20) DEFAULT 'COD' 
          CHECK (payment_type IN ('COD','Online')),

        payment_status VARCHAR(20) DEFAULT 'Pending'
          CHECK (payment_status IN ('Paid', 'Pending', 'Failed')),

        payment_info VARCHAR(255) DEFAULT 'Cash on Delivery',

        payment_intent_id VARCHAR(255),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `;

    await database.query(query);

  } catch (error) {
    console.error("❌ Failed To Create Payments Table.", error);
    process.exit(1);
  }
}
