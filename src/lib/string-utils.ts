export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function sanitizeInput(str: string): string {
  return str.trim().replace(/[<>]/g, '')
}

export function validateAnswer(answer: string): boolean {
  return answer.trim().length > 0 && answer.trim().length <= 50
}

export function formatPlayerName(name: string): string {
  return capitalizeFirst(sanitizeInput(name))
}