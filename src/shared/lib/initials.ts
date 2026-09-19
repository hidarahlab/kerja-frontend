/**
 * Huruf pertama kata pertama + huruf pertama kata terakhir, mis. "Admin King" -> "AK".
 * Nama satu kata dobel huruf pertamanya, mis. "Arif" -> "AA".
 */
export function getInitials(name: string | null | undefined): string {
  const trimmed = name?.trim()
  if (!trimmed) return '?'

  const words = trimmed.split(/\s+/)
  const first = words[0][0]?.toUpperCase() ?? ''
  const last = words.length > 1 ? (words[words.length - 1][0]?.toUpperCase() ?? '') : first

  return first + last
}
