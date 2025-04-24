import fs from 'fs';
import path from 'path';
import { SqlConnection, SqlExecutor, ModelClass, SqlParameter } from './types';
import { parseTemplate } from './parser';

export class Sqlify {
  private connection: SqlConnection;

  constructor(connection: SqlConnection) {
    this.connection = connection;
  }

  /**
   * Creates a SQL template function from a template string
   */
  sql(strings: TemplateStringsArray, ...values: any[]): SqlExecutor {
    const template = parseTemplate(strings, ...values);
    
    return async (params?: Record<string, any>) => {
      const executionParams: any[] = [];
      
      // Process parameters
      for (const param of template.parameters) {
        let value;
        
        if (typeof param.value === 'function') {
          // Handle transformer functions
          value = param.value(params);
        } else if (params && param.name in params) {
          value = params[param.name];
          
          // Validate type
          this.validateParameterType(value, param);
        } else {
          throw new Error(`Missing parameter: ${param.name}`);
        }
        
        executionParams.push(value);
      }
      
      return this.connection.query(template.sql, executionParams);
    };
  }

  /**
   * Loads an SQL file and converts it to a template function
   */
  fromFile(filePath: string): SqlExecutor | ModelClass {
    const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8');
    
    // Check if this is a schema definition
    if (fileContent.toLowerCase().includes('create table') || 
        fileContent.toLowerCase().includes('schema')) {
      return this.createModelFromSchema(fileContent, path.basename(filePath, '.sql'));
    }
    
    // Otherwise treat as a regular SQL query
    return this.createQueryFromSql(fileContent);
  }

  /**
   * Creates a query function from raw SQL
   */
  private createQueryFromSql(sqlText: string): SqlExecutor {
    // Create template string array from raw SQL
    const template = { raw: [sqlText] } as unknown as TemplateStringsArray;
    return this.sql(template);
  }

  /**
   * Creates a model class from SQL schema
   */
  private createModelFromSchema(schema: string, tableName: string): ModelClass {
    // Extract fields from the schema
    const fieldRegex = /(\w+)\s+(\w+)/g;
    const fields: Record<string, { type: string }> = {};
    const connection = this.connection;
    const sqlMethod = this.sql.bind(this);
    
    let match;
    while ((match = fieldRegex.exec(schema)) !== null) {
      const [, fieldName, fieldType] = match;
      fields[fieldName] = { type: this.mapSqlTypeToJs(fieldType) };
    }
    
    // Create the model class
    const ModelClass = class {
      static tableName = tableName;
      static fields = fields;
      
      // Create static query methods
      static findOne = sqlMethod`SELECT * FROM ${tableName} WHERE id = $(id):integer LIMIT 1`;
      static find = sqlMethod`SELECT * FROM ${tableName}`;
      static create = async (data: any) => {
        const fieldNames = Object.keys(data).join(', ');
        const values = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${values}) RETURNING *`;
        return connection.query(query, Object.values(data));
      };
      static update = async (id: any, data: any) => {
        const setClause = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
        const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING *`;
        return connection.query(query, [id, ...Object.values(data)]);
      };
      static delete = async (id: any) => {
        return connection.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
      };
      
      constructor(data: Record<string, any>) {
        Object.assign(this, data);
      }
    };
    
    return ModelClass as unknown as ModelClass;
  }

  /**
   * Maps SQL types to JavaScript types
   */
  private mapSqlTypeToJs(sqlType: string): string {
    const typeMap: Record<string, string> = {
      'int': 'number',
      'integer': 'number',
      'bigint': 'number',
      'float': 'number',
      'double': 'number',
      'decimal': 'number',
      'char': 'string',
      'varchar': 'string',
      'text': 'string',
      'boolean': 'boolean',
      'bool': 'boolean',
      'date': 'Date',
      'timestamp': 'Date',
      'json': 'object',
      'jsonb': 'object',
    };
    
    return typeMap[sqlType.toLowerCase()] || 'any';
  }

  /**
   * Validates parameter types at runtime
   */
  private validateParameterType(value: any, param: SqlParameter): void {
    switch (param.type) {
      case 'integer':
        if (!Number.isInteger(value)) {
          throw new Error(`Parameter ${param.name} must be an integer`);
        }
        break;
      case 'float':
        if (typeof value !== 'number') {
          throw new Error(`Parameter ${param.name} must be a number`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`Parameter ${param.name} must be a boolean`);
        }
        break;
      case 'date':
        if (!(value instanceof Date) && !isNaN(Date.parse(value))) {
          throw new Error(`Parameter ${param.name} must be a valid date`);
        }
        break;
      case 'json':
        try {
          if (typeof value === 'string') {
            JSON.parse(value);
          }
        } catch (e) {
          throw new Error(`Parameter ${param.name} must be valid JSON`);
        }
        break;
    }
  }
}