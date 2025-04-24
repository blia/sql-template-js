import { SqlParameter, SqlTemplate, SqlPlaceholderTransformer } from './types';

const PARAM_REGEX = /\$\(([\w.]+)\)(?::(\w+))?|\${([^}]+)}/g;

/**
 * Parses an SQL template string, extracting parameters and transformers
 */
export function parseTemplate(strings: TemplateStringsArray, ...values: any[]): SqlTemplate {
  let sqlText = '';
  const parameters: SqlParameter[] = [];
  let paramIndex = 0;

  // Merge the template strings with values
  for (let i = 0; i < strings.length; i++) {
    sqlText += strings[i];
    
    if (i < values.length) {
      // Handle JavaScript expressions/transformers
      if (typeof values[i] === 'function') {
        const placeholder = `__placeholder_${paramIndex++}__`;
        sqlText += placeholder;
        parameters.push({
          name: placeholder,
          type: 'string', // Default type
          value: values[i] as SqlPlaceholderTransformer
        });
      } else {
        sqlText += values[i];
      }
    }
  }

  // Extract parameters from the SQL using regex
  let match;
  let placeholderId = paramIndex;
  const processedSql = sqlText.replace(PARAM_REGEX, (match, name, type, jsExpr) => {
    if (jsExpr) {
      // This is a JavaScript expression placeholder
      return `$${placeholderId++}`;
    }
    
    // This is a named parameter with optional type
    parameters.push({
      name,
      type: (type || 'string') as SqlParameter['type'],
      value: undefined // Will be filled when executing
    });
    
    return `$${parameters.length}`;
  });

  return {
    sql: processedSql,
    parameters
  };
}