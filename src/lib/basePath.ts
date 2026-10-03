export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function withBasePath(path: string) {
  if (!path || path.startsWith('http') || path.startsWith(BASE_PATH)) return path
  return `${BASE_PATH}${path}`
}