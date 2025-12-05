import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

    //  PLACE NEW ORDER ( CASH ON DELIVERY )
 export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
  } = req.body;

  if (
    !full_name ||
    !state ||
    !city ||
    !country ||
    !address ||
    !pincode ||
    !phone
  ) {
    return next(new ErrorHandler("Please provide complete shipping details.", 400));
  }

  const items = Array.isArray(orderedItems)
    ? orderedItems
    : JSON.parse(orderedItems);

  if (!items || items.length === 0) {
    return next(new ErrorHandler("Your cart is empty.", 400));
  }

  const productIds = items.map((item) => item.product.id);

  const { rows: products } = await database.query(
    `SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])`,
    [productIds]
  );

  let total_price = 0;
  const values = [];
  const placeholders = [];

  items.forEach((item, index) => {
    const product = products.find((p) => p.id === item.product.id);

    if (!product) {
      return next(new ErrorHandler(`Product not found: ${item.product.id}`, 404));
    }

    if (item.quantity > product.stock) {
      return next(
        new ErrorHandler(`Only ${product.stock} left for ${product.name}`, 400)
      );
    }

    const itemTotal = product.price * item.quantity;
    total_price += itemTotal;

    values.push(
      null,
      product.id,
      item.quantity,
      product.price,
      item.product.images[0].url || "",
      product.name
    );

    const offset = index * 6;

    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`
    );
  });

  const tax_price = 0.18;
  const shipping_price = total_price >= 500 ? 0 : 50;

  total_price = Math.round(total_price + total_price * tax_price + shipping_price);

  // INSERT ORDER WITH COD
  const orderResult = await database.query(
    `
    INSERT INTO orders 
    (buyer_id, total_price, tax_price, shipping_price, payment_method, payment_info, paid_at)
    VALUES ($1, $2, $3, $4, 'COD', 'Cash On Delivery', NOW())
    RETURNING *
  `,
    [req.user.id, total_price, tax_price, shipping_price]
  );

  const orderId = orderResult.rows[0].id;

  for (let i = 0; i < values.length; i += 6) {
    values[i] = orderId;
  }

  // INSERT ORDER ITEMS
  await database.query(
    `
    INSERT INTO order_items (order_id, product_id, quantity, price, image, title)
    VALUES ${placeholders.join(", ")}
  `,
    values
  );

  // INSERT SHIPPING INFO
  await database.query(
    `
    INSERT INTO shipping_info 
    (order_id, full_name, state, city, country, address, pincode, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `,
    [orderId, full_name, state, city, country, address, pincode, phone]
  );

  // REDUCE STOCK
  for (const item of items) {
    await database.query(
      `UPDATE products SET stock = stock - $1 WHERE id = $2`,
      [item.quantity, item.product.id]
    );
  }

  res.status(200).json({
    success: true,
    message: "Order placed successfully with Cash on Delivery!",
    orderId,
    total_price,
  });
});

    // FETCH SINGLE ORDER
export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  const result = await database.query(
    `
      SELECT 
        o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'order_item_id', oi.id,
              'order_id', oi.order_id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'image', oi.image,
              'title', oi.title
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS order_items,
        json_build_object(
          'full_name', s.full_name,
          'state', s.state,
          'city', s.city,
          'country', s.country,
          'address', s.address,
          'pincode', s.pincode,
          'phone', s.phone
        ) AS shipping_info
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_info s ON o.id = s.order_id
      WHERE o.id = $1
      GROUP BY o.id, s.id
    `,
    [orderId]
  );

  res.status(200).json({
    success: true,
    orders: result.rows[0],
  });
});

    //  FETCH USER ORDERS (All COD orders)
 export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await database.query(
    `
      SELECT o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'order_item_id', oi.id,
            'order_id', oi.order_id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', oi.image,
            'title', oi.title
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS order_items,
      json_build_object(
        'full_name', s.full_name,
        'state', s.state,
        'city', s.city,
        'country', s.country,
        'address', s.address,
        'pincode', s.pincode,
        'phone', s.phone
      ) AS shipping_info 
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_info s ON o.id = s.order_id
      WHERE o.buyer_id = $1
      GROUP BY o.id, s.id
    `,
    [req.user.id]
  );

  res.status(200).json({
    success: true,
    myOrders: result.rows,
  });
});

    // ADMIN — FETCH ALL ORDERS
export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await database.query(
    `
      SELECT o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'order_item_id', oi.id,
            'order_id', oi.order_id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', oi.image,
            'title', oi.title
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS order_items,
      json_build_object(
        'full_name', s.full_name,
        'state', s.state,
        'city', s.city,
        'country', s.country,
        'address', s.address,
        'pincode', s.pincode,
        'phone', s.phone
      ) AS shipping_info
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_info s ON o.id = s.order_id
      GROUP BY o.id, s.id
    `
  );

  res.status(200).json({
    success: true,
    orders: result.rows,
  });
});

    //  UPDATE ORDER STATUS
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const { orderId } = req.params;

  if (!status) {
    return next(new ErrorHandler("Provide a valid status.", 400));
  }

  const exists = await database.query(`SELECT * FROM orders WHERE id = $1`, [
    orderId,
  ]);

  if (exists.rows.length === 0) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  const updatedOrder = await database.query(
    `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *`,
    [status, orderId]
  );

  res.status(200).json({
    success: true,
    updatedOrder: updatedOrder.rows[0],
  });
});

    // DELETE ORDER
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  const results = await database.query(
    `DELETE FROM orders WHERE id = $1 RETURNING *`,
    [orderId]
  );

  if (results.rows.length === 0) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted.",
    order: results.rows[0],
  });
});
