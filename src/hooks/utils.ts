export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {},
) {
  const { currency = 'USD', notation = 'compact' } = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function areObjectsEqual<T>(obj1: T, obj2: T): boolean {
  // If both are the same reference or equal primitive values
  if (obj1 === obj2) {
    return true;
  }

  // If either is not an object, or either is null, they're not equal
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1) as Array<keyof T>;
  const keys2 = Object.keys(obj2) as Array<keyof T>;

  // If number of properties is different, they're not equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all properties and their values are equal
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    const areBothObjects = typeof val1 === 'object' && typeof val2 === 'object';

    // If both values are objects, recurse
    if (areBothObjects && !areObjectsEqual(val1, val2)) {
      return false;
    } else if (!areBothObjects && val1 !== val2) {
      // Directly compare values if not both are objects
      return false;
    }
  }

  return true;
}
