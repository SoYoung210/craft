export function isDevelopment() {
  return (
    typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development'
  );
}
