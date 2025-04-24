# Advanced Example: SQL Views + JS Expressions + Dynamic Queries

This advanced example demonstrates the power of combining:

1. SQL Views - for complex data aggregation and analytics
2. JavaScript expressions in SQL templates - for dynamic query parts
3. Parameterized queries - for type safety and SQL injection prevention
4. Conditional filters - that can be included or excluded at runtime

## Use Case

This example simulates a simple e-commerce analytics system with:

- **Order Analytics View**: Aggregates order data per user (counts, totals, dates)
- **Product Reviews View**: Aggregates product reviews (average ratings, review counts)
- **Dynamic filters**: Can be included or excluded based on runtime conditions
- **Dynamic sorting**: Can change sort fields and direction based on user preferences

## Key Features Demonstrated

### 1. JavaScript expressions for dynamic query parts

```typescript
const getOrderAnalytics = sql`
  SELECT * FROM "ORDER_TOTAL"
  WHERE 
    ${props => props.minTotal ? createFilter('total_amount', '>=')(props) : '1=1'}
    AND ${props => props.afterDate ? createFilter('last_order_date', '>=')(props) : '1=1'}
  ORDER BY ${props => props.orderBy || 'total_amount'} ${props => props.orderDirection || 'DESC'}
`;
```

### 2. View-based models for complex queries

```typescript
// Create models from Views
const OrderAnalytics = sql.createQueryFromSchema(orderAnalyticsView, "ORDER_TOTAL");
const ProductReviews = sql.createQueryFromSchema(productReviewsView, "PRODUCT_REVIEWS");

// Using the models
const allAnalytics = await OrderAnalytics.find();
```

### 3. Type-safe parameters

```typescript
const topProducts = await getTopProducts({
  minRating: 4.5,          // Float type
  minReviews: 50,          // Integer type
  limit: 5                 // Integer type
});
```

## Running the Example

```bash
# From the project root
npm run ts-node examples/advanced-example.ts
```

## Expected Output

The example will show the generated SQL queries and simulated results, demonstrating how the library:

- Transforms JavaScript expressions into SQL parts
- Properly parameterizes values to prevent SQL injection
- Creates model classes from view definitions
- Supports complex conditional logic in queries