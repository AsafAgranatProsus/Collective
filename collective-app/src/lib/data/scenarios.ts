/**
 * Mock Scenario Scripts - Word-for-word dialogue for demo
 */

import type { CoordinatedItem } from './items';
import type { CardSchema } from '$lib/types/card-schema';

export interface QuickReply {
	label: string;
	value: string;
}

export interface Message {
	id: string;
	sender: 'user' | 'ai' | 'peer';
	content: string;
	timestamp: string;
	is_rendered?: boolean; // Track if AI message has fully rendered (to prevent re-animation on reload)
	ui_elements?: {
		quick_replies?: QuickReply[];
		cards?: CoordinatedItem[];
		card_data?: any; // Legacy - kept for backwards compatibility
		card_schema?: CardSchema; // New generative card system
		animation?: string;
		analytics_summary?: boolean;
		analytics_detail?: boolean;
	};
}

export interface Scenario {
	id: string;
	title: string;
	description: string;
	initial_user: string;
	requires_user_switch?: boolean;
	messages: Message[];
}

// Scenario 1: View My Tasks
export const viewMyTasksScenario: Scenario = {
	id: 'scenario-1',
	title: 'View My Tasks',
	description: "Sarah asks what's on her plate this week",
	initial_user: 'sarah',
	messages: [
		{
			id: 'msg-1-1',
			sender: 'ai',
			content: 'Morning Sarah! ☀️ Got your week sorted out. Want the rundown?',
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: "What's on my plate?", value: 'show_tasks' },
					{ label: 'Just chores', value: 'show_chores' },
					{ label: 'Everything', value: 'show_all' }
				]
			}
		},
		{
			id: 'msg-1-2',
			sender: 'user',
			content: "What's on my plate?",
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-1-3',
			sender: 'ai',
			content: "Alright, here's your week:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					template: 'summary',
					data: {
						chores: [
							{ title: 'Kitchen cleanup', due: 'Wed evening' },
							{ title: 'Trash out', due: 'Saturday morning' }
						],
						money: [
							{ title: 'You owe Mike $23.50 for groceries' },
							{ title: 'Jessica paid utilities - your share is $42' }
						],
						shopping: [
							{ title: 'Bob needs milk - you pass the bodega, mind grabbing it today?' }
						]
					}
				},
				quick_replies: [
					{ label: 'Looks good', value: 'confirm' },
					{ label: 'Can I trade anything?', value: 'trade' },
					{ label: 'Send me reminders', value: 'reminders' }
				]
			}
		},
		{
			id: 'msg-1-4',
			sender: 'user',
			content: 'Send me reminders',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-1-5',
			sender: 'ai',
			content: "You got it. I'll bug you:\n• Wednesday 6pm for kitchen\n• Saturday 9am for trash\n• Today around 5pm to grab milk\n\nWant them earlier/later?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Earlier', value: 'earlier' },
					{ label: 'Later', value: 'later' },
					{ label: 'Perfect', value: 'perfect' }
				]
			}
		},
		{
			id: 'msg-1-6',
			sender: 'user',
			content: 'Earlier is better',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-1-7',
			sender: 'ai',
			content: "Changed to 1 hour earlier across the board. You're all set! 🎯",
			timestamp: new Date().toISOString()
		}
	]
};

// Scenario 2: How Am I Doing? (Progressive Disclosure)
export const howAmIDoingScenario: Scenario = {
	id: 'scenario-2',
	title: 'How Am I Doing?',
	description: 'Jessica asks about her performance with progressive disclosure',
	initial_user: 'jessica',
	messages: [
		{
			id: 'msg-2-1',
			sender: 'user',
			content: 'How am I doing?',
			timestamp: new Date().toISOString()
		},
		// Level 1: Inline response
		{
			id: 'msg-2-2',
			sender: 'ai',
			content: "You've been really consistent lately.\n\nThis week you finished all 3 tasks, all on time. Last month you completed 12 of 13 assigned.\n\nGroup-wise, everyone's around your level except Mike who's at 78%, but he's improving.\n\nWant to see the full breakdown?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Yeah, show me', value: 'show_summary' },
					{ label: 'Nah, sounds good', value: 'sounds_good' },
					{ label: 'What about expenses?', value: 'expenses' }
				]
			}
		},
		{
			id: 'msg-2-3',
			sender: 'user',
			content: 'Yeah, show me',
			timestamp: new Date().toISOString()
		},
		// Level 2: Summary Card
		{
			id: 'msg-2-4',
			sender: 'ai',
			content: "Here's the full picture:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				analytics_summary: true
			}
		},
		{
			id: 'msg-2-5',
			sender: 'ai',
			content: "No major imbalances. You're doing slightly more than average, which is great. Mike occasionally needs reminders but overall the house is humming along.",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Show me trends over time', value: 'show_trends' },
					{ label: 'What patterns do you see?', value: 'show_patterns' },
					{ label: 'Thanks!', value: 'thanks' }
				]
			}
		},
		{
			id: 'msg-2-6',
			sender: 'user',
			content: 'Show me trends over time',
			timestamp: new Date().toISOString()
		},
		// Level 3: Analytics Detail Card
		{
			id: 'msg-2-7',
			sender: 'ai',
			content: 'Let me pull up your analytics.',
			timestamp: new Date().toISOString(),
			ui_elements: {
				analytics_detail: true
			}
		},
		{
			id: 'msg-2-8',
			sender: 'ai',
			content: "You're one of the most reliable in the household. Consistently on time, rarely miss anything.",
			timestamp: new Date().toISOString()
		}
	]
};

// Legacy export alias for backward compatibility
export const fairnessScenario = howAmIDoingScenario;

// Scenario 3: Trade a Chore
export const tradeChoreScenario: Scenario = {
	id: 'scenario-3',
	title: 'Trade a Chore',
	description: 'Sarah trades kitchen chore with Bob',
	initial_user: 'sarah',
	requires_user_switch: true,
	messages: [
		{
			id: 'msg-3-1',
			sender: 'user',
			content: "Can someone else do kitchen Wednesday? I've got a work thing",
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-3-2',
			sender: 'ai',
			content: "Let me check who's available… Mike has bathroom Thursday and Bob has trash Saturday. Want me to propose a swap?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Try Bob', value: 'bob' },
					{ label: 'Try Mike', value: 'mike' },
					{ label: 'Never mind', value: 'cancel' }
				]
			}
		},
		{
			id: 'msg-3-3',
			sender: 'user',
			content: 'Try Bob',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-3-4',
			sender: 'ai',
			content: 'On it! Give me a sec…',
			timestamp: new Date().toISOString(),
			ui_elements: {
				animation: 'thinking'
			}
		},
		// === SWITCH TO BOB ===
		{
			id: 'msg-3-5',
			sender: 'ai',
			content: "Hey Bob! Sarah's got a work conflict Wednesday. Could you take kitchen if she covers your trash Saturday?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Yeah sure', value: 'accept' },
					{ label: 'What time?', value: 'time' },
					{ label: "Can't, sorry", value: 'decline' }
				]
			}
		},
		{
			id: 'msg-3-6',
			sender: 'user',
			content: 'Yeah sure',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-3-7',
			sender: 'ai',
			content: 'Awesome, thanks! Updating now…',
			timestamp: new Date().toISOString()
		},
		// === SWITCH BACK TO SARAH ===
		{
			id: 'msg-3-8',
			sender: 'ai',
			content: "Bob's in! You've got trash Saturday, he's got kitchen Wednesday. Updated ✓",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					template: 'trade',
					data: {
						before: [
							{ task: 'Kitchen (Wed)', user: 'You' },
							{ task: 'Trash (Sat)', user: 'Bob' }
						],
						after: [
							{ task: 'Kitchen (Wed)', user: 'Bob' },
							{ task: 'Trash (Sat)', user: 'You' }
						]
					}
				},
				animation: 'celebration'
			}
		}
	]
};

// Scenario 6: Complete a Task
export const completeTaskScenario: Scenario = {
	id: 'scenario-6',
	title: 'Complete a Task',
	description: 'Sarah marks trash as done',
	initial_user: 'sarah',
	messages: [
		{
			id: 'msg-6-1',
			sender: 'user',
			content: 'Done with trash',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-6-2',
			sender: 'ai',
			content: "Nice! Marked complete. You're 3/3 this week now 🎉",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					template: 'completion',
					data: {
						task: 'Take out trash',
						completed_at: 'Sat 9:42 AM',
						completionRate: 100
					}
				},
				animation: 'confetti'
			}
		},
		{
			id: 'msg-6-3',
			sender: 'ai',
			content: "By the way, you're officially the most reliable this month. Just saying. 😎",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					template: 'leaderboard',
					data: {
						rankings: [
							{ name: 'Sarah', rate: 95, icon: '🥇' },
							{ name: 'Jessica', rate: 92, icon: '🥈' },
							{ name: 'Bob', rate: 92, icon: '🥈' },
							{ name: 'Mike', rate: 78, icon: '🥉' }
						]
					}
				}
			}
		}
	]
};

// Scenario 4: Minimal Analytics (Sarah's Variant)
export const minimalAnalyticsScenario: Scenario = {
	id: 'scenario-4',
	title: "How's the House?",
	description: "Sarah asks minimal question, gets minimal answer",
	initial_user: 'sarah',
	messages: [
		{
			id: 'msg-4-1',
			sender: 'user',
			content: "How's the house doing?",
			timestamp: new Date().toISOString()
		},
		// Level 1 only: Inline response
		{
			id: 'msg-4-2',
			sender: 'ai',
			content: "Everyone's pulling their weight this week.\n\nYou and Jessica are at 100%, Bob's at 100%, Mike finished 2 of 4 but he's traveling so I paused the others.\n\nNo drama, everyone's good.",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Show me details', value: 'show_summary' },
					{ label: 'What about me specifically?', value: 'show_me' },
					{ label: 'Cool, thanks', value: 'thanks' }
				]
			}
		},
		{
			id: 'msg-4-3',
			sender: 'user',
			content: 'Show me details',
			timestamp: new Date().toISOString()
		},
		// Level 2: Summary Card (only if requested)
		{
			id: 'msg-4-4',
			sender: 'ai',
			content: "Here's the breakdown:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				analytics_summary: true
			}
		},
		{
			id: 'msg-4-5',
			sender: 'ai',
			content: 'Looking solid all around. No issues this week.',
			timestamp: new Date().toISOString()
		}
	]
};

// ============================================================================
// CUSTOM SECTION EXAMPLES - Demonstrating flexible card composition
// ============================================================================

// Example 1: Weekly Review with mixed sections
export const weeklyReviewScenario: Scenario = {
	id: 'scenario-7',
	title: 'Weekly Review (Custom Sections)',
	description: 'Demonstrates mixing header, progress, chart, comparison, and text sections',
	initial_user: 'sarah',
	messages: [
		{
			id: 'msg-7-1',
			sender: 'user',
			content: 'Give me my weekly review',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-7-2',
			sender: 'ai',
			content: "Here's your complete weekly performance breakdown:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: 'Weekly Performance',
							subtitle: 'Nov 14 - Nov 20',
							icon: 'trending'
						},
						{
							type: 'progress',
							value: 85,
							label: 'Overall completion rate',
							size: 'large',
							variant: 'circular'
						},
						{
							type: 'divider',
							spacing: 'medium'
						},
						{
							type: 'stat_row',
							label: 'Tasks Completed',
							value: '11 of 13',
							icon: 'checklist',
							highlight: true
						},
						{
							type: 'stat_row',
							label: 'Average Response Time',
							value: '2.3 hours',
							icon: 'info'
						},
						{
							type: 'chart',
							chartType: 'line',
							title: '7-Day Trend',
							data: [60, 75, 85, 80, 90, 85, 85],
							labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
							height: 140,
							color: 'primary',
							showGrid: true,
							showPoints: true
						},
						{
							type: 'comparison',
							title: 'Group Comparison',
							items: [
								{ label: 'You', value: '85%', highlight: true },
								{ label: 'Group Avg', value: '78%' },
								{ label: 'Top', value: '92%' }
							],
							note: "You're above average this week! Keep it up 🎉"
						}
					],
					maxWidth: 480,
					scrollable: true
				}
			}
		}
	]
};

// Example 2: Shopping Request with list and actions
export const shoppingRequestScenario: Scenario = {
	id: 'scenario-8',
	title: 'Shopping Request (Custom Sections)',
	description: 'Demonstrates list items with checkboxes and action buttons',
	initial_user: 'bob',
	messages: [
		{
			id: 'msg-8-1',
			sender: 'user',
			content: 'What do we need from the store?',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-8-2',
			sender: 'ai',
			content: "Here's our current shopping list:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: 'Shopping List',
							subtitle: '7 items needed',
							icon: 'shopping'
						},
						{
							type: 'list',
							title: 'Groceries',
							items: [
								{ id: '1', title: 'Milk (2%)', subtitle: 'Requested by Sarah', icon: 'shopping', checked: false },
								{ id: '2', title: 'Bread', subtitle: 'Whole wheat preferred', icon: 'shopping', checked: false },
								{ id: '3', title: 'Eggs (dozen)', icon: 'shopping', checked: false }
							],
							style: 'default',
							showCheckboxes: true
						},
						{
							type: 'list',
							title: 'Household',
							items: [
								{ id: '4', title: 'Dish soap', subtitle: 'Running low', icon: 'shopping', checked: false },
								{ id: '5', title: 'Paper towels', icon: 'shopping', checked: false },
								{ id: '6', title: 'Laundry detergent', subtitle: 'Unscented', icon: 'shopping', checked: false },
								{ id: '7', title: 'Light bulbs (60W)', icon: 'shopping', checked: false }
							],
							style: 'compact',
							showCheckboxes: true
						},
						{
							type: 'text',
							content: 'Estimated total: $45-60',
							color: 'muted',
							align: 'center',
							size: 'small'
						},
						{
							type: 'actions',
							buttons: [
								{ label: "I'll go", value: 'accept', variant: 'filled', primary: true },
								{ label: 'Add item', value: 'add', variant: 'outlined' },
								{ label: 'Remind me later', value: 'remind', variant: 'text' }
							],
							layout: 'row'
						}
					],
					maxWidth: 420
				}
			}
		}
	]
};

// Example 3: Payment Summary with stats and comparison
export const paymentSummaryScenario: Scenario = {
	id: 'scenario-9',
	title: 'Payment Summary (Custom Sections)',
	description: 'Demonstrates stat rows, comparison bars, and mixed content',
	initial_user: 'jessica',
	messages: [
		{
			id: 'msg-9-1',
			sender: 'user',
			content: 'Show me money owed',
			timestamp: new Date().toISOString()
		},
		{
			id: 'msg-9-2',
			sender: 'ai',
			content: "Here's the current money situation:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: 'Payment Summary',
							subtitle: 'November 2024',
							icon: 'money'
						},
						{
							type: 'stat_row',
							label: 'You paid',
							value: '$156.00',
							metadata: '3 expenses',
							highlight: true,
							icon: 'money'
						},
						{
							type: 'stat_row',
							label: 'You owe',
							value: '$42.00',
							metadata: 'to Mike (utilities)',
							icon: 'money'
						},
						{
							type: 'stat_row',
							label: 'Others owe you',
							value: '$0',
							icon: 'money'
						},
						{
							type: 'divider',
							spacing: 'medium'
						},
						{
							type: 'text',
							content: 'Group Spending Breakdown',
							size: 'small',
							color: 'muted'
						},
						{
							type: 'comparison',
							items: [
								{ label: 'Jessica', value: '$156', highlight: true },
								{ label: 'Sarah', value: '$142' },
								{ label: 'Mike', value: '$178' },
								{ label: 'Bob', value: '$124' }
							],
							note: 'Total household spending: $600 this month'
						},
						{
							type: 'chart',
							chartType: 'bar',
							title: 'Monthly Trend',
							data: [520, 580, 600],
							labels: ['Sep', 'Oct', 'Nov'],
							height: 160,
							color: 'tertiary',
							showGrid: true
						},
						{
							type: 'actions',
							buttons: [
								{ label: 'Settle up', value: 'settle', variant: 'filled', primary: true },
								{ label: 'View details', value: 'details', variant: 'outlined' }
							],
							layout: 'row'
						}
					],
					maxWidth: 480,
					scrollable: true
				}
			}
		}
	]
};

// Export all scenarios
export const scenarios: Scenario[] = [
	viewMyTasksScenario,
	fairnessScenario,
	tradeChoreScenario,
	completeTaskScenario,
	minimalAnalyticsScenario,
	weeklyReviewScenario,
	shoppingRequestScenario,
	paymentSummaryScenario
];

// Helper to get scenario by ID
export function getScenarioById(id: string): Scenario | undefined {
	return scenarios.find(s => s.id === id);
}

// Helper to get scenarios for a specific user
export function getScenariosByUser(userId: string): Scenario[] {
	return scenarios.filter(s => s.initial_user === userId);
}

