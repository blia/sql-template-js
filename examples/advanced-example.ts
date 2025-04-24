import createSqlify from '../src';
import { Pool } from 'pg'; // For example purposes

// Mock database connection (in real app, use your DB library)
const mockDb = {
  query: async (sql: string, params?: any[]) => {
    console.log('🔍 Executing query:');
    console.log(sql);
    
    if (params?.length) {
      console.log('📋 With parameters:', params);
    }
    
    // Simulate query results based on the query type
    if (sql.includes('ORDER_TOTAL')) {
      return [
        { user_id: 1, username: 'john_doe', order_count: 5, total_amount: 530.75, last_order_date: new Date('2025-03-15') },
        { user_id: 2, username: 'jane_smith', order_count: 3, total_amount: 290.50, last_order_date: new Date('2025-04-02') }
      ];
    } else if (sql.includes('PRODUCT_REVIEWS')) {
      return [
        { id: 101, product_name: 'Wireless Headphones', avg_rating: 4.7, review_count: 120 },
        { id: 102, product_name: 'Smart Watch', avg_rating: 4.2, review_count: 85 }
      ];
    } else {
      return [{ result: 'No specific data available for this query' }];
    }
  }
};

// Initialize our SQL utility
const sql = createSqlify(mockDb);

// ========================================================
// ⭐️ Advanced Example: Combining Views, Dynamic Filters, JS Expressions
// ========================================================

console.log('🚀 SQL-TEMPLATE-JS ADVANCED EXAMPLE 🚀\n');

// ---------------------------------------------
// 1. Create a complex view with analytics data
// ---------------------------------------------

// In a real app, this would be loaded from a file
const orderAnalyticsView = `
-- Complex view for order analytics
CREATE VIEW "ORDER_TOTAL" AS
  SELECT 
    u.id AS user_id,
    u.username,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_amount,
    MAX(o.created_at) AS last_order_date
  FROM "users" u
  LEFT JOIN "orders" o ON u.id = o.user_id
  GROUP BY u.id, u.username
`;

// ---------------------------------------------
// 2. Create product reviews view 
// ---------------------------------------------

const productReviewsView = `
-- View for product reviews with average ratings
CREATE VIEW "PRODUCT_REVIEWS" AS
  SELECT 
    p.id,
    p.name AS product_name,
    AVG(r.rating) AS avg_rating,
    COUNT(r.id) AS review_count
  FROM "products" p
  LEFT JOIN "reviews" r ON p.id = r.product_id
  GROUP BY p.id, p.name
`;

// ---------------------------------------------
// 3. Create our model classes from the views
// ---------------------------------------------

const OrderAnalytics = sql.fromFile = (() => {
  // This is just for example - in a real app use sql.fromFile
  const content = orderAnalyticsView;
  return createSqlify(mockDb).createQueryFromSchema(content, "ORDER_TOTAL");
})();

const ProductReviews = sql.fromFile = (() => {
  // This is just for example - in a real app use sql.fromFile
  const content = productReviewsView;
  return createSqlify(mockDb).createQueryFromSchema(content, "PRODUCT_REVIEWS");
})();

// ---------------------------------------------
// 4. Dynamic filter builder with JS expressions
// ---------------------------------------------

// Create a dynamic filter builder function
const createFilter = (field: string, operator: string) => {
  return (props: any) => `${field} ${operator} $${props.paramName}`;
};

// ---------------------------------------------
// 5. Create advanced queries with dynamic parts
// ---------------------------------------------

// Dynamic order analytics query with conditional filters
const getOrderAnalytics = sql`
  SELECT * FROM "ORDER_TOTAL"
  WHERE 
    ${props => props.minTotal ? createFilter('total_amount', '>=')(props) : '1=1'}
    AND ${props => props.afterDate ? createFilter('last_order_date', '>=')(props) : '1=1'}
    AND ${props => props.userId ? `user_id = $(userId):integer` : '1=1'}
  ORDER BY ${props => props.orderBy || 'total_amount'} ${props => props.orderDirection || 'DESC'}
  LIMIT $(limit):integer
`;

// Dynamic product query with configurable rating threshold
const getTopProducts = sql`
  SELECT * FROM "PRODUCT_REVIEWS"
  WHERE 
    ${props => props.minRating ? `avg_rating >= $(minRating):float` : '1=1'}
    AND review_count >= $(minReviews):integer
  ORDER BY avg_rating DESC, review_count DESC
  LIMIT $(limit):integer
`;

// ---------------------------------------------
// 6. Run our queries with different parameters
// ---------------------------------------------

async function demo() {
  console.log('📊 DEMO 1: Order Analytics');
  console.log('---------------------------');
  
  // Query 1: Get big spenders (>$500) with custom ordering
  console.log('🧾 Query 1: Big spenders (>$500) ordered by username');
  const bigSpenders = await getOrderAnalytics({
    minTotal: true,
    paramName: 'minTotalAmount',
    minTotalAmount: 500,
    orderBy: 'username',
    orderDirection: 'ASC',
    limit: 10
  });
  console.log('📈 Result:', JSON.stringify(bigSpenders, null, 2), '\n');

  // Query 2: Get recent orders since March 2025
  console.log('🧾 Query 2: Recent orders since March 2025');
  const recentOrders = await getOrderAnalytics({
    afterDate: true,
    paramName: 'startDate',
    startDate: new Date('2025-03-01'),
    limit: 5
  });
  console.log('📈 Result:', JSON.stringify(recentOrders, null, 2), '\n');

  // Query 3: Get orders for a specific user
  console.log('🧾 Query 3: Orders for user ID 1');
  const userOrders = await getOrderAnalytics({
    userId: 1,
    limit: 10
  });
  console.log('📈 Result:', JSON.stringify(userOrders, null, 2), '\n');

  // Query 4: Use the view's default methods
  console.log('🧾 Query 4: Using the view\'s standard methods');
  const allAnalytics = await OrderAnalytics.find();
  console.log('📈 Result:', JSON.stringify(allAnalytics, null, 2), '\n');

  console.log('\n📊 DEMO 2: Product Reviews');
  console.log('---------------------------');

  // Query 5: Get top-rated products with at least 50 reviews
  console.log('🧾 Query 5: Top-rated products (4.5+) with 50+ reviews');
  const topProducts = await getTopProducts({
    minRating: 4.5,
    minReviews: 50,
    limit: 5
  });
  console.log('📈 Result:', JSON.stringify(topProducts, null, 2), '\n');
}

// Run the demo
console.log('Starting advanced SQL-template-js demo...\n');
demo().catch(console.error);