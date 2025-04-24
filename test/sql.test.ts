// Example test file (you'll need to install Jest to run these tests)

import createSqlify from '../src';

// Mock database connection
const mockDb = {
  query: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }])
};

describe('Sqlify', () => {
  let sql: ReturnType<typeof createSqlify>;
  
  beforeEach(() => {
    sql = createSqlify(mockDb);
    mockDb.query.mockClear();
  });
  
  it('should create a query function from a template', () => {
    const query = sql`SELECT * FROM users WHERE id = $(id):integer`;
    expect(typeof query).toBe('function');
  });
  
  it('should execute the query with parameters', async () => {
    const query = sql`SELECT * FROM users WHERE id = $(id):integer`;
    const result = await query({ id: 1 });
    
    expect(mockDb.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = $1',
      [1]
    );
    expect(result).toEqual([{ id: 1, name: 'John' }]);
  });
  
  it('should handle JavaScript expressions', async () => {
    const query = sql`SELECT * FROM users WHERE ${(p: { field: string }) => p.field} = $(value):string`;
    await query({ field: 'name', value: 'John' });
    
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE __placeholder_0__ = $1'),
      ['John']
    );
  });
  
  it('should validate parameter types', async () => {
    const query = sql`SELECT * FROM users WHERE id = $(id):integer`;
    
    await expect(query({ id: 'not-a-number' })).rejects.toThrow(
      'Parameter id must be an integer'
    );
  });
});