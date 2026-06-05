export function formatDate(value: string | null): string {
  if (!value) return 'Date inconnue'

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function plural(value: number, singular: string, pluralLabel = `${singular}s`): string {
  return `${value} ${value > 1 ? pluralLabel : singular}`
}
