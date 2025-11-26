/**
 * Content Fragments Library
 * 
 * Reusable content pieces for scenarios.
 * Always check here before creating new quick replies or card patterns.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for usage conventions
 * 
 * Usage:
 * ```typescript
 * import { QUICK_REPLIES, CARD_SECTIONS, MESSAGE_TEMPLATES } from './fragments';
 * 
 * ui_elements: {
 *   quick_replies: QUICK_REPLIES.confirmation
 * }
 * ```
 */

import type { QuickReply } from './scenarios';
import type { CardSection } from '$lib/types/card-schema';

// =============================================================================
// QUICK REPLY SETS
// =============================================================================

/**
 * Pre-defined quick reply button sets.
 * Use these instead of creating inline quick replies.
 */
export const QUICK_REPLIES = {
	/** Generic confirmation options */
	confirmation: [
		{ label: 'Sounds good', value: 'confirm' },
		{ label: 'Thanks!', value: 'thanks' }
	] as QuickReply[],

	/** Yes/No binary choice */
	yesNo: [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' }
	] as QuickReply[],

	/** Yes/No with maybe */
	yesNoMaybe: [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' },
		{ label: 'Maybe later', value: 'maybe' }
	] as QuickReply[],

	/** Show more details options */
	showDetails: [
		{ label: 'Show me details', value: 'show_details' },
		{ label: 'Show me trends', value: 'show_trends' },
		{ label: "I'm good", value: 'done' }
	] as QuickReply[],

	/** Task reminder timing */
	reminderTiming: [
		{ label: 'Earlier', value: 'earlier' },
		{ label: 'Later', value: 'later' },
		{ label: 'Perfect', value: 'perfect' }
	] as QuickReply[],

	/** Continue or stop flow */
	continueOrDone: [
		{ label: 'Continue', value: 'continue' },
		{ label: "I'm done", value: 'done' }
	] as QuickReply[],

	/** Group type selection (onboarding) */
	groupTypes: [
		{ label: '🏠 Shared apartment', value: 'type_apartment' },
		{ label: '👨‍👩‍👧 Family', value: 'type_family' },
		{ label: '⚽ Sports team', value: 'type_sports' },
		{ label: '✈️ Trip/event', value: 'type_trip' },
		{ label: '👥 Friends', value: 'type_friends' }
	] as QuickReply[],

	/** Member count selection */
	memberCounts: [
		{ label: '2', value: 'count_2' },
		{ label: '3', value: 'count_3' },
		{ label: '4', value: 'count_4' },
		{ label: '5+', value: 'count_5plus' },
		{ label: 'Not sure', value: 'count_unsure' }
	] as QuickReply[],

	/** Split expense options */
	splitOptions: [
		{ label: 'Split equally', value: 'split_equal' },
		{ label: 'Just me', value: 'split_just_me' },
		{ label: 'Custom split', value: 'split_custom' }
	] as QuickReply[],

	/** Share invite options */
	shareOptions: [
		{ label: 'Copy link', value: 'copy_link' },
		{ label: 'Share via text', value: 'share_text' },
		{ label: 'Skip for now', value: 'skip_invite' }
	] as QuickReply[]
} as const;

// =============================================================================
// CARD SECTION PATTERNS
// =============================================================================

/**
 * Pre-defined card section patterns.
 * Static patterns are objects, dynamic patterns are functions.
 */
export const CARD_SECTIONS = {
	// --- Headers ---
	
	/** Money/expense header */
	moneyHeader: {
		type: 'header',
		title: 'Money',
		icon: 'money'
	} as CardSection,

	/** Chores header */
	choresHeader: {
		type: 'header',
		title: 'Chores',
		icon: 'checklist'
	} as CardSection,

	/** Shopping header */
	shoppingHeader: {
		type: 'header',
		title: 'Shopping',
		icon: 'shopping'
	} as CardSection,

	/** Success header */
	successHeader: {
		type: 'header',
		title: 'Success!',
		icon: 'success'
	} as CardSection,

	// --- Dynamic Patterns ---

	/** Create a header with custom title */
	header: (title: string, icon?: string): CardSection => ({
		type: 'header',
		title,
		...(icon && { icon })
	}),

	/** Create a chores list section */
	choresList: (items: Array<{ title: string; subtitle?: string }>): CardSection => ({
		type: 'list',
		items: items.map(item => ({
			title: item.title,
			subtitle: item.subtitle,
			icon: 'checklist'
		})),
		style: 'default'
	}),

	/** Create a money list section */
	moneyList: (items: Array<{ title: string; amount?: string }>): CardSection => ({
		type: 'list',
		items: items.map(item => ({
			title: item.title,
			...(item.amount && { metadata: item.amount }),
			icon: 'money'
		})),
		style: 'default'
	}),

	/** Create a stat row */
	statRow: (label: string, value: string, options?: { icon?: string; highlight?: boolean }): CardSection => ({
		type: 'stat_row',
		label,
		value,
		...(options?.icon && { icon: options.icon }),
		...(options?.highlight && { highlight: true })
	}),

	/** Standard divider */
	divider: (spacing: 'small' | 'medium' | 'large' = 'medium'): CardSection => ({
		type: 'divider',
		spacing
	}),

	/** Muted text note */
	mutedText: (content: string): CardSection => ({
		type: 'text',
		content,
		color: 'muted',
		size: 'small'
	})
} as const;

// =============================================================================
// MESSAGE TEMPLATES
// =============================================================================

/**
 * Template functions for common message patterns.
 * Use these for consistency in AI responses.
 */
export const MESSAGE_TEMPLATES = {
	/** Task completion message */
	taskComplete: (task: string) => 
		`Nice! Marked ${task} complete.`,

	/** Task completion with stats */
	taskCompleteWithStats: (task: string, completed: number, total: number) =>
		`Nice! Marked ${task} complete. You're ${completed}/${total} this week now 🎉`,

	/** Welcome message */
	welcome: (name: string) =>
		`Morning ${name}! ☀️ Got your week sorted out. Want the rundown?`,

	/** Reminder set confirmation */
	reminderSet: (items: string[]) =>
		`You got it. I'll remind you about:\n${items.map(i => `• ${i}`).join('\n')}`,

	/** Trade confirmation */
	tradeConfirmed: (task: string, fromUser: string, toUser: string) =>
		`Done! ${task} swapped from ${fromUser} to ${toUser}. Updated ✓`,

	/** Expense logged */
	expenseLogged: (name: string, amount: string, splitCount: number) =>
		`Done! ${name} logged for ${amount}, split ${splitCount} ways.`,

	/** Group created */
	groupCreated: (name: string, type: string, memberCount: number) =>
		`You're all set! ${name} created as a ${type} with ${memberCount} members.`,

	/** Fairness summary intro */
	fairnessSummary: (userName: string, completionRate: number) =>
		`You've been really consistent lately.\n\nThis week you're at ${Math.round(completionRate * 100)}% completion rate.`,

	/** Generic acknowledgment */
	acknowledge: () =>
		"Got it! Let me know if you need anything else."
} as const;

// =============================================================================
// TIMESTAMP HELPERS
// =============================================================================

/**
 * Helper functions for creating realistic timestamps in scenarios.
 */
export const TIMESTAMPS = {
	/** Current time */
	now: () => new Date().toISOString(),

	/** Minutes ago */
	minutesAgo: (minutes: number) => 
		new Date(Date.now() - minutes * 60 * 1000).toISOString(),

	/** Hours ago */
	hoursAgo: (hours: number) =>
		new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),

	/** Days ago */
	daysAgo: (days: number) =>
		new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),

	/** Staggered timestamps for a conversation (1-2 min between messages) */
	conversationSequence: (messageCount: number): string[] => {
		const timestamps: string[] = [];
		let baseTime = Date.now() - messageCount * 2 * 60 * 1000; // Start from past
		
		for (let i = 0; i < messageCount; i++) {
			timestamps.push(new Date(baseTime).toISOString());
			baseTime += (60 + Math.random() * 60) * 1000; // 1-2 min gaps
		}
		
		return timestamps;
	}
} as const;

// =============================================================================
// ICON MAPPINGS (for reference)
// =============================================================================

/**
 * Available icons for cards and UI elements.
 * Reference these when creating card sections.
 */
export const ICONS = {
	checklist: 'checklist',
	money: 'money',
	shopping: 'shopping',
	success: 'success',
	warning: 'warning',
	error: 'error',
	info: 'info',
	trending: 'trending',
	group: 'group',
	chart: 'chart'
} as const;

