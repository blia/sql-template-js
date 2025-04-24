import createSqlify from '../src';

// Example database connection (this would be provided by your DB library)
const dbConnection = {
  query: async (sql: string, params?: any[]) => {
    console.log('Executing SQL:', sql);
    console.log('With parameters:', params);
    // Simulate a database response
    return [{ id: 1, name: 'Test User' }];
  }
};

// Create the SQL utility instance
const sql = createSqlify(dbConnection);

// Example 1: Basic SQL template
const findUser = sql`SELECT * FROM users WHERE id = $(id):integer`;

// Example 2: SQL template with JS expressions
const findUserByProperty = sql`SELECT * FROM users WHERE ${prop => prop.field} = $(value):string`;

// Example 3: Load from file
const userQuery = sql.fromFile(__dirname + '/queries/users.sql');
const User = sql.fromFile(__dirname + '/schemas/user.sql');

// Execute the queries
async function run() {
  // Execute the basic query
  const user = await findUser({ id: 1 });
  console.log('User:', user);
  
  // Execute with JS expression
  const userByName = await findUserByProperty({ field: 'name', value: 'John' });
  console.log('User by name:', userByName);
  
  // Execute from file
  const userById = await userQuery({ id: 1 });
  console.log('User from file:', userById);
  
  // Use the model class
  const users = await User.find();
  console.log('All users:', users);
  
  const userOne = await User.findOne({ id: 1 });
  console.log('User from model:', userOne);
}

run().catch(console.error);