/**
 * Card Helpers - Shared utilities for card rendering
 * Keeps card logic DRY across all components
 */

import type {
	CardSchema,
	CardSection,
	CardTemplate,
	SummaryCardData,
	CompletionCardData,
	TradeCardData,
	LeaderboardCardData,
	CardListItem
} from '$lib/types/card-schema';

// Import actual icon objects from iconset
import iconChecklist from '@ktibow/iconset-material-symbols/task-alt';
import iconMoney from '@ktibow/iconset-material-symbols/attach-money';
import iconShopping from '@ktibow/iconset-material-symbols/shopping-cart';
import iconChart from '@ktibow/iconset-material-symbols/insights';
import iconSuccess from '@ktibow/iconset-material-symbols/check-circle';
import iconWarning from '@ktibow/iconset-material-symbols/warning';
import iconError from '@ktibow/iconset-material-symbols/error';
import iconInfo from '@ktibow/iconset-material-symbols/info';
import iconTrending from '@ktibow/iconset-material-symbols/trending-up';
import iconGroup from '@ktibow/iconset-material-symbols/group-work';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);
}

export function formatPercentage(value: number, decimals: number = 0): string {
	return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}

export function formatTime(timestamp: string): string {
	const date = new Date(timestamp);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes.toString().padStart(2, '0');
	return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// ============================================================================
// COLOR & THEME UTILITIES
// ============================================================================

export function getStatusColor(status: 'success' | 'warning' | 'error' | 'info'): string {
	const colorMap = {
		success: 'var(--m3-scheme-tertiary)',
		warning: 'var(--m3-scheme-secondary)',
		error: 'var(--m3-scheme-error)',
		info: 'var(--m3-scheme-primary)'
	};
	return colorMap[status];
}

export function getChartColor(color: 'primary' | 'secondary' | 'tertiary'): string {
	const colorMap = {
		primary: 'var(--m3-scheme-primary)',
		secondary: 'var(--m3-scheme-secondary)',
		tertiary: 'var(--m3-scheme-tertiary)'
	};
	return colorMap[color];
}

// ============================================================================
// ICON MAPPINGS
// ============================================================================

export const ICON_MAP: Record<string, any> = {
	checklist: iconChecklist,
	money: iconMoney,
	shopping: iconShopping,
	chart: iconChart,
	success: iconSuccess,
	warning: iconWarning,
	error: iconError,
	info: iconInfo,
	trending: iconTrending,
	group: iconGroup
};

export function getIcon(iconName: string): any {
	return ICON_MAP[iconName] || iconInfo; // Default to info icon
}

// ============================================================================
// TEMPLATE TO SECTIONS CONVERTER
// ============================================================================

export function templateToSections(template: CardTemplate, data: any): CardSection[] {
	switch (template) {
		case 'summary':
			return summaryTemplate(data as SummaryCardData);
		case 'completion':
			return completionTemplate(data as CompletionCardData);
		case 'trade':
			return tradeTemplate(data as TradeCardData);
		case 'leaderboard':
			return leaderboardTemplate(data as LeaderboardCardData);
		case 'analytics':
			return analyticsTemplate(data);
		case 'detail':
			return detailTemplate(data);
		default:
			return [];
	}
}

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

function summaryTemplate(data: SummaryCardData): CardSection[] {
	const sections: CardSection[] = [
		{
			type: 'header',
			title: "What's on Your Plate",
			icon: 'checklist'
		}
	];

	if (data.chores && data.chores.length > 0) {
		sections.push({
			type: 'list',
			title: 'Chores',
			items: data.chores.map((chore, index) => ({
				id: `chore-${index}`,
				title: chore.title,
				subtitle: chore.due,
				icon: 'checklist'
			})),
			style: 'compact'
		});
	}

	if (data.money && data.money.length > 0) {
		sections.push({
			type: 'list',
			title: 'Money',
			items: data.money.map((item, index) => ({
				id: `money-${index}`,
				title: item.title,
				metadata: item.amount ? formatCurrency(item.amount) : undefined,
				icon: 'money'
			})),
			style: 'compact'
		});
	}

	if (data.shopping && data.shopping.length > 0) {
		sections.push({
			type: 'list',
			title: 'Shopping',
			items: data.shopping.map((item, index) => ({
				id: `shopping-${index}`,
				title: item.title,
				subtitle: item.note,
				icon: 'shopping'
			})),
			style: 'compact'
		});
	}

	return sections;
}

function completionTemplate(data: CompletionCardData): CardSection[] {
	const sections: CardSection[] = [
		{
			type: 'header',
			title: 'Task Completed',
			icon: 'success'
		},
		{
			type: 'stat_row',
			label: 'Task',
			value: data.task,
			icon: 'checklist',
			highlight: true
		},
		{
			type: 'stat_row',
			label: 'Completed',
			value: formatTime(data.completed_at)
		}
	];

	if (data.completionRate !== undefined) {
		sections.push({
			type: 'progress',
			value: data.completionRate,
			label: 'Weekly completion',
			size: 'medium',
			variant: 'circular'
		});
	}

	if (data.message) {
		sections.push({
			type: 'text',
			content: data.message,
			color: 'muted',
			align: 'center'
		});
	}

	return sections;
}

function tradeTemplate(data: TradeCardData): CardSection[] {
	return [
		{
			type: 'header',
			title: 'Trade Confirmed',
			icon: 'success'
		},
		{
			type: 'text',
			content: 'Before',
			size: 'small',
			color: 'muted'
		},
		{
			type: 'list',
			items: data.before.map((item, index) => ({
				id: `before-${index}`,
				title: item.task,
				subtitle: item.user
			})),
			style: 'compact'
		},
		{
			type: 'divider',
			spacing: 'medium'
		},
		{
			type: 'text',
			content: 'After',
			size: 'small',
			color: 'muted'
		},
		{
			type: 'list',
			items: data.after.map((item, index) => ({
				id: `after-${index}`,
				title: item.task,
				subtitle: item.user,
				highlight: true
			})),
			style: 'compact'
		}
	];
}

function leaderboardTemplate(data: LeaderboardCardData): CardSection[] {
	return [
		{
			type: 'header',
			title: 'Leaderboard',
			icon: 'trending'
		},
		{
			type: 'list',
			items: data.rankings.map((ranking, index) => ({
				id: `rank-${index}`,
				title: ranking.name,
				metadata: `${ranking.rate}%`,
				icon: ranking.icon,
				highlight: index === 0
			})),
			style: 'default'
		}
	];
}

function analyticsTemplate(data: any): CardSection[] {
	// Placeholder for analytics template - can be expanded
	return [
		{
			type: 'header',
			title: 'Analytics',
			icon: 'chart'
		},
		{
			type: 'text',
			content: 'Analytics view coming soon',
			color: 'muted',
			align: 'center'
		}
	];
}

function detailTemplate(data: any): CardSection[] {
	// Placeholder for detail template - can be expanded
	return [
		{
			type: 'header',
			title: 'Details',
			icon: 'info'
		}
	];
}

// ============================================================================
// SHARED CONSTANTS
// ============================================================================

export const CARD_SIZE = {
	small: 320,
	medium: 420,
	large: 520
} as const;

export const SECTION_SPACING = {
	small: 'var(--space-2)',
	medium: 'var(--space-4)',
	large: 'var(--space-6)'
} as const;

