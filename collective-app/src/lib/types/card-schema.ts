/**
 * Card Schema Type Definitions
 * Defines the JSON schema for generative card UI composition
 */

// ============================================================================
// SECTION TYPES
// ============================================================================

export interface CardHeaderSection {
	type: 'header';
	title: string;
	subtitle?: string;
	icon?: string;
	showIcon?: boolean; // Default: false
	action?: {
		label: string;
		value: string;
	};
}

export interface CardStatRowSection {
	type: 'stat_row';
	label: string;
	value: string | number;
	icon?: string;
	highlight?: boolean;
	metadata?: string; // Additional small text
}

export interface CardProgressIndicatorSection {
	type: 'progress';
	value: number; // 0-100
	label?: string;
	size?: 'small' | 'medium' | 'large';
	variant?: 'circular' | 'linear';
}

export interface CardListItem {
	id?: string;
	title: string;
	subtitle?: string;
	metadata?: string;
	icon?: string;
	checked?: boolean;
	highlight?: boolean;
}

export interface CardListItemsSection {
	type: 'list';
	items: CardListItem[];
	style?: 'compact' | 'default' | 'detailed';
	showCheckboxes?: boolean;
	title?: string; // Optional section title
}

export interface CardChartSection {
	type: 'chart';
	chartType: 'line' | 'bar' | 'area';
	data: number[];
	labels: string[];
	title?: string;
	height?: number;
	color?: 'primary' | 'secondary' | 'tertiary';
	showGrid?: boolean;
	showPoints?: boolean;
}

export interface CardComparisonBarSection {
	type: 'comparison';
	items: Array<{
		label: string;
		value: number | string;
		highlight?: boolean;
	}>;
	title?: string;
	note?: string; // Additional context below bar
}

export interface CardActionsSection {
	type: 'actions';
	buttons: Array<{
		label: string;
		value: string;
		variant?: 'filled' | 'outlined' | 'text';
		primary?: boolean;
	}>;
	layout?: 'row' | 'column';
}

export interface CardDividerSection {
	type: 'divider';
	spacing?: 'small' | 'medium' | 'large';
}

export interface CardTextSection {
	type: 'text';
	content: string;
	size?: 'small' | 'medium' | 'large';
	align?: 'left' | 'center' | 'right';
	color?: 'default' | 'muted' | 'primary';
}

export interface CardCarouselSection {
	type: 'carousel';
	cards: CardSchema[];
	cardWidth?: number; // Default: 280px
}

// Union type of all section types
export type CardSection =
	| CardHeaderSection
	| CardStatRowSection
	| CardProgressIndicatorSection
	| CardListItemsSection
	| CardChartSection
	| CardComparisonBarSection
	| CardActionsSection
	| CardDividerSection
	| CardTextSection
	| CardCarouselSection;

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

export type CardTemplate = 
	| 'summary'
	| 'detail'
	| 'analytics'
	| 'completion'
	| 'trade'
	| 'leaderboard';

// Template-specific data structures
export interface SummaryCardData {
	chores?: Array<{ title: string; due?: string }>;
	money?: Array<{ title: string; amount?: number }>;
	shopping?: Array<{ title: string; note?: string }>;
}

export interface CompletionCardData {
	task: string;
	completed_at: string;
	completionRate?: number;
	message?: string;
}

export interface TradeCardData {
	before: Array<{ task: string; user: string }>;
	after: Array<{ task: string; user: string }>;
}

export interface LeaderboardCardData {
	rankings: Array<{
		name: string;
		rate: number;
		icon?: string;
	}>;
}

// ============================================================================
// ROOT SCHEMA
// ============================================================================

export interface CardSchema {
	// Template mode: use predefined template with data
	template?: CardTemplate;
	data?: SummaryCardData | CompletionCardData | TradeCardData | LeaderboardCardData | any;
	
	// Custom mode: compose from sections array
	sections?: CardSection[];
	
	// Global card options
	maxWidth?: number;
	variant?: 'filled' | 'elevated' | 'outlined';
	scrollable?: boolean;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface CardContext {
	userId?: string;
	groupId?: string;
	timestamp?: string;
}

