/**
 * Shared Formatting Utilities
 * Single source of truth for date, time, and number formatting across the app
 */

// ============================================================================
// TIME & DATE FORMATTING
// ============================================================================

/**
 * Format a timestamp to 12-hour time (e.g., "2:30 PM")
 * Used by: MessageBubble, GroupChatMessage
 */
export function formatTime(timestamp: string | Date): string {
	const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes.toString().padStart(2, '0');
	return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Format a date with month, day, and time (e.g., "Nov 26, 2:30 PM")
 * Used by: FeedView, Cards
 */
export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 * Used by: Activity feeds, notifications
 */
export function formatRelativeTime(timestamp: string | Date): string {
	const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	
	return formatDate(date);
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format a number as currency (e.g., "$23.50")
 * Used by: ExpenseCard, GroupCard, analytics
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);
}

/**
 * Format a number as percentage (e.g., "92%")
 * Used by: Analytics, progress indicators
 */
export function formatPercentage(value: number, decimals: number = 0): string {
	return `${value.toFixed(decimals)}%`;
}

