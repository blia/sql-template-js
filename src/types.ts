export type SqlConnection = {
  query: (sql: string, params?: any[]) => Promise<any>;
};

export type SqlParameter = {
  name: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'json';
  value: any;
};

export type SqlTemplate = {
  sql: string;
  parameters: SqlParameter[];
};

export type SqlExecutor = (params?: Record<string, any>) => Promise<any>;

export type SqlPlaceholderTransformer = (propValue: any) => any;

export type ModelClass = {
  new (...args: any[]): any;
  tableName: string;
  fields: Record<string, { type: string }>;
  findOne: SqlExecutor;
  find: SqlExecutor;
  create: (data: any) => Promise<any>;
  update: (id: any, data: any) => Promise<any>;
  delete: (id: any) => Promise<any>;
};