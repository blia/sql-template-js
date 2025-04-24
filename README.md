# sql-template-js

A flexible SQL template utility for Node.js that works with any database library. Transform SQL templates into type-safe JavaScript functions with parameter validation.

[![npm version](https://img.shields.io/npm/v/sql-template-js.svg)](https://www.npmjs.com/package/sql-template-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- 🚀 Convert SQL templates to JavaScript functions using tagged templates
- ✅ Runtime type validation for SQL parameters
- 📂 Support for loading SQL from files
- 🏗️ Create model classes from SQL schemas
- 🔄 Support for JavaScript expressions in SQL templates
- 🔒 SQL injection prevention with parameterized queries
- 🔌 Works with any database library that has a query method

## Installation

```bash
npm install sql-template-js
```

## Usage

### Basic Example

```typescript
import createSqlify from 'sql-template-js';
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

### Parameter Types

You can specify parameter types for validation:

```typescript
const findUser = sql`
  SELECT * FROM users 
  WHERE id = $(id):integer
  AND created_at > $(since):date
  AND active = $(active):boolean
`;

// This will be validated at runtime
const result = await findUser({
  id: 123,
  since: new Date('2023-01-01'),
  active: true
});
```

Supported types:
- `string` (default if not specified)
- `integer`
- `float`
- `boolean`
- `date`
- `json`

### JavaScript Expressions in Templates

You can use JavaScript expressions in your SQL templates for dynamic SQL generation:

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

You can load SQL from external files:

```typescript
// Load a regular query
const getUserOrders = sql.fromFile('./queries/get-user-orders.sql');
const orders = await getUserOrders({ userId: 1 });

// Load a schema and create a model
const User = sql.fromFile('./schemas/user.sql');
const users = await User.find();
const user = await User.findOne({ id: 1 });
```

The content of `users.sql` might look like:
```sql
-- User queries
SELECT * FROM users WHERE id = $(id):integer
```

### Model Classes from Schemas

When loading a file containing a SQL schema definition (using CREATE TABLE), a model class is automatically created:

```typescript
// Schema file: user.sql
/*
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP
)
*/

const User = sql.fromFile('./schemas/user.sql');

// Use the model
const users = await User.find();
const user = await User.findOne({ id: 1 });
const newUser = await User.create({ name: 'John', email: 'john@example.com' });
await User.update(1, { name: 'Jane' });
await User.delete(1);
```

## How It Works

The library works by:

1. Parsing SQL templates using tagged template literals
2. Extracting parameters and their types
3. Converting templates to parameterized SQL with proper placeholder numbering
4. Validating parameters at runtime
5. Executing the SQL with a database connection

## Examples

See the [examples directory](./examples) for more usage examples.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)