# Sqlify

A flexible SQL template utility for Node.js that works with any database library.

## Features

- Convert SQL templates to JavaScript functions
- Type validation for SQL parameters
- Support for loading SQL from files
- Create model classes from SQL schemas
- Support for JavaScript expressions in SQL templates

## Installation

```bash
npm install sqlify
```

## Usage

### Basic Example

```typescript
import createSqlify from 'sqlify';
import { Pool } from 'pg'; // or any other DB library

// Initialize with your database connection
const pool = new Pool();
const sql = createSqlify({
  query: (text, params) => pool.query(text, params)
});

// Create SQL template functions
const findUser = sql`SELECT * FROM users WHERE id = $(id):integer`;

// Execute the query
const result = await findUser({ id: 1 });
console.log(result.rows);
```

### JavaScript Expressions in Templates

```typescript
const findByProperty = sql`
  SELECT * FROM users 
  WHERE ${prop => prop.field} = $(value):string
`;

const users = await findByProperty({
  field: 'email',
  value: 'user@example.com'
});
```

### Loading from SQL Files

```typescript
// Load a regular query
const getUserOrders = sql.fromFile('./queries/get-user-orders.sql');
const orders = await getUserOrders({ userId: 1 });

// Load a schema and create a model
const User = sql.fromFile('./schemas/user.sql');
const users = await User.find();
const user = await User.findOne({ id: 1 });
```

## License

MIT