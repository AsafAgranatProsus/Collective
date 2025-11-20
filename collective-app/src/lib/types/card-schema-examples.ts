/**
 * Card Schema Examples
 * Quick reference for using the generative card framework
 */

import type { CardSchema } from './card-schema';

// ============================================================================
// TEMPLATE MODE - Simple and Quick
// ============================================================================

// Use predefined templates with data
export const templateExample: CardSchema = {
	template: 'summary',
	data: {
		chores: [
			{ title: 'Kitchen cleanup', due: 'Wed evening' },
			{ title: 'Trash out', due: 'Saturday morning' }
		],
		money: [
			{ title: 'You owe Mike $23.50 for groceries' }
		],
		shopping: [
			{ title: 'Buy milk' }
		]
	}
};

// Other template examples
export const completionTemplate: CardSchema = {
	template: 'completion',
	data: {
		task: 'Clean kitchen',
		completed_at: new Date().toISOString(),
		completionRate: 85
	}
};

export const leaderboardTemplate: CardSchema = {
	template: 'leaderboard',
	data: {
		rankings: [
			{ name: 'Sarah', rate: 95, icon: '🥇' },
			{ name: 'Mike', rate: 78, icon: '🥉' }
		]
	}
};

// ============================================================================
// CUSTOM SECTIONS MODE - Maximum Flexibility
// ============================================================================

// Build cards from individual sections
export const customSectionsExample: CardSchema = {
	sections: [
		// Header section
		{
			type: 'header',
			title: 'My Custom Card',
			subtitle: 'With mixed content',
			icon: 'checklist'
		},
		
		// Progress indicator
		{
			type: 'progress',
			value: 75,
			label: 'Task completion',
			size: 'medium',
			variant: 'circular'
		},
		
		// Stat rows
		{
			type: 'stat_row',
			label: 'Total tasks',
			value: '15 of 20',
			icon: 'checklist',
			highlight: true
		},
		
		// List items
		{
			type: 'list',
			title: 'Upcoming Tasks',
			items: [
				{ title: 'Task 1', subtitle: 'Due tomorrow', icon: 'checklist' },
				{ title: 'Task 2', subtitle: 'Due Friday', icon: 'checklist' }
			],
			style: 'compact'
		},
		
		// Chart
		{
			type: 'chart',
			chartType: 'line',
			title: 'Weekly Trend',
			data: [60, 70, 80, 75, 85],
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
			height: 140,
			color: 'primary'
		},
		
		// Comparison bar
		{
			type: 'comparison',
			items: [
				{ label: 'You', value: '85%', highlight: true },
				{ label: 'Average', value: '78%' }
			],
			note: "You're above average!"
		},
		
		// Actions
		{
			type: 'actions',
			buttons: [
				{ label: 'Confirm', value: 'confirm', variant: 'filled', primary: true },
				{ label: 'Cancel', value: 'cancel', variant: 'text' }
			],
			layout: 'row'
		}
	],
	maxWidth: 480,
	scrollable: true
};

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

// Minimal card with just header and text
export const minimalCard: CardSchema = {
	sections: [
		{
			type: 'header',
			title: 'Task Complete',
			icon: 'success'
		},
		{
			type: 'text',
			content: 'Great job! You finished your task.',
			color: 'muted',
			align: 'center'
		}
	]
};

// List with checkboxes
export const checklistCard: CardSchema = {
	sections: [
		{
			type: 'header',
			title: 'Shopping List',
			subtitle: '5 items'
		},
		{
			type: 'list',
			items: [
				{ title: 'Milk', checked: false },
				{ title: 'Bread', checked: true },
				{ title: 'Eggs', checked: false }
			],
			showCheckboxes: true,
			style: 'default'
		}
	]
};

// Stats-focused card
export const statsCard: CardSchema = {
	sections: [
		{
			type: 'header',
			title: 'Performance Stats'
		},
		{
			type: 'stat_row',
			label: 'Tasks Completed',
			value: 45,
			icon: 'checklist',
			highlight: true
		},
		{
			type: 'stat_row',
			label: 'On-time Rate',
			value: '95%',
			icon: 'trending'
		},
		{
			type: 'stat_row',
			label: 'Team Rank',
			value: '#2 of 4',
			icon: 'group'
		}
	]
};

// ============================================================================
// USAGE IN SCENARIOS
// ============================================================================

// Add to message ui_elements:
/*
{
	id: 'msg-example',
	sender: 'ai',
	content: "Here's your summary:",
	timestamp: new Date().toISOString(),
	ui_elements: {
		card_schema: {
			template: 'summary',
			data: { ... }
		},
		// OR
		card_schema: {
			sections: [
				{ type: 'header', title: '...' },
				// ... more sections
			]
		}
	}
}
*/

