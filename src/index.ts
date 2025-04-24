import { Sqlify } from './sql';
import { SqlConnection, SqlExecutor, ModelClass } from './types';

/**
 * Creates an instance of the Sqlify utility
 * @param connection - The database connection with a query method
 */
export function createSqlify(connection: SqlConnection): Sqlify & ((strings: TemplateStringsArray, ...values: any[]) => SqlExecutor) {
  const sqlify = new Sqlify(connection);
  
  // Create a function that acts both as the template tag and as the object with methods
  const sqlTemplate = function(strings: TemplateStringsArray, ...values: any[]): SqlExecutor {
    return sqlify.sql(strings, ...values);
  };
  
  // Add the other methods from Sqlify to the function
  Object.assign(sqlTemplate, {
    fromFile: sqlify.fromFile.bind(sqlify),
    createQueryFromSchema: sqlify.createQueryFromSchema.bind(sqlify)
  });
  
  return sqlTemplate as Sqlify & ((strings: TemplateStringsArray, ...values: any[]) => SqlExecutor);
}

export { SqlConnection, SqlExecutor, ModelClass };
export default createSqlify;