// ============================================================
// Funnel Builders — Utility Formatters
// ============================================================

/**
 * Format a price string for display (e.g., "49.99" → "49,99 €")
 */
export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (num === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
}

/**
 * Format a duration string "HH:MM:SS" for display
 * e.g., "05:30:00" → "5h 30min", "00:10:30" → "10min 30s"
 */
export function formatDuration(duration: string | null): string {
  if (!duration) return '';
  const parts = duration.split(':').map(Number);
  if (parts.length !== 3) return duration;

  const [hours, minutes, seconds] = parts;
  const segments: string[] = [];

  if (hours > 0) segments.push(`${hours}h`);
  if (minutes > 0) segments.push(`${minutes}min`);
  if (seconds > 0 && hours === 0) segments.push(`${seconds}s`);

  return segments.join(' ') || '0s';
}

/**
 * Format a datetime string for display
 * e.g., "2026-01-15T10:30:00Z" → "15 janvier 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a short date
 * e.g., "2026-01-15T10:30:00Z" → "15/01/2026"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR').format(date);
}

/**
 * Get level label in French
 */
export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé',
  };
  return labels[level] || level;
}

/**
 * Get status label in French
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Brouillon',
    PUBLISHED: 'Publié',
  };
  return labels[status] || status;
}

/**
 * Get user initials from first and last name
 */
export function getUserInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Convert seconds to mm:ss or hh:mm:ss format
 */
export function secondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
