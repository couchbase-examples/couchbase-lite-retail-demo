// Helper function to create DocID
export function DocID(id: string): string {
  return id;
}

/**
 * Convert Couchbase Lite data objects to plain JavaScript values
 * Handles nested objects and arrays recursively
 */
export function convertCBLToPlain(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // If it's a Couchbase Lite value object (has 'type' and 'value' properties)
  if (data && typeof data === 'object' && 'type' in data && 'value' in data) {
    // Extract the primitive value
    const value = data.value;
    
    // Recursively convert if the value is also an object/array
    if (typeof value === 'object' && value !== null) {
      return convertCBLToPlain(value);
    }
    
    return value;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => convertCBLToPlain(item));
  }

  // Handle plain objects
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = convertCBLToPlain(data[key]);
      }
    }
    return result;
  }

  // Return primitives as-is
  return data;
}

// Re-export types we need
export type { Database, DatabaseConfig } from "@couchbase/lite-js";
