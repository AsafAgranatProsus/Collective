/**
 * Scenario Scripts
 * 
 * AI conversation scenarios for the Collective prototype.
 * Each scenario is a scripted conversation flow with messages, quick replies, and cards.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for conventions
 * 
 * ## How to Extend
 * 
 * 1. **Add messages to existing scenario**: Push new messages to the messages array
 * 2. **Create variant**: Spread existing scenario and override specific messages
 * 3. **New scenario**: Only for fundamentally different user journeys
 * 
 * ## Before Adding Content
 * 
 * Check `fragments.ts` for reusable:
 * - Quick reply sets (QUICK_REPLIES)
 * - Card section patterns (CARD_SECTIONS)
 * - Message templates (MESSAGE_TEMPLATES)
 * 
 * ## Naming Convention
 * 
 * - Scenario IDs: `scenario-{number}` or descriptive like `onboarding`
 * - Message IDs: `msg-{scenario}-{sequence}` e.g., `msg-1-1`, `msg-1-2`
 * 
 * ## DO NOT
 * 
 * - Duplicate entire scenarios for minor variations
 * - Copy-paste quick replies that exist in fragments.ts
 * - Create inline card schemas that could be reusable patterns
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
		card_schema?: CardSchema; // Single card
		card_schemas?: CardSchema[]; // Multiple cards
		animation?: string;
		analytics_summary?: boolean;
		analytics_detail?: boolean;
		show_group_card?: boolean; // Show embedded group card (for trip planning)
	};
}

export interface Scenario {
	id: string;
	title: string;
	description: string;
	initial_user: string;
	requires_user_switch?: boolean;
	messages: Message[];
	/** If true, scenario won't appear in the meta menu but remains in codebase */
	hidden?: boolean;
}

// Scenario 1: View My Tasks
export const viewMyTasksScenario: Scenario = {
	id: 'scenario-1',
	title: 'View My Tasks',
	description: "Sarah asks what's on her plate this week",
	initial_user: 'sarah',
	hidden: true,
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
			content: "Here's what's on your plate:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schemas: [
					{
						sections: [
							{
								type: 'header',
								title: 'Chores'
							},
							{
								type: 'list',
								items: [
									{
										title: 'Kitchen cleanup',
										subtitle: 'Wed evening',
										icon: 'checklist'
									},
									{
										title: 'Trash out',
										subtitle: 'Saturday morning',
										icon: 'checklist'
									}
								],
								style: 'default'
							}
						],
						maxWidth: 420
					},
					{
						sections: [
							{
								type: 'header',
								title: 'Money'
							},
							{
								type: 'list',
								items: [
									{
										title: 'You owe Mike $23.50 for groceries',
										icon: 'money'
									},
									{
										title: 'Jessica paid utilities - your share is $42',
										icon: 'money'
									}
								],
								style: 'default'
							}
						],
						maxWidth: 420
					},
					{
						sections: [
							{
								type: 'header',
								title: 'Shopping'
							},
							{
								type: 'list',
								items: [
									{
										title: 'Bob needs milk - you pass the bodega, mind grabbing it today?',
										icon: 'shopping'
									}
								],
								style: 'default'
							}
						],
						maxWidth: 420
					}
				],
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
	hidden: true,
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
	hidden: true,
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
	hidden: true,
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
	hidden: true,
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
	hidden: true,
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
	hidden: true,
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
	hidden: true,
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

// ============================================================================
// ONBOARDING SCENARIO - Cold boot new user experience
// ============================================================================

export const onboardingScenario: Scenario = {
	id: 'onboarding',
	title: 'New User Onboarding',
	description: 'Cold boot - first time user creates a group and logs first expense',
	initial_user: 'sarah',
	messages: [
		// Step 1: Welcome message
		{
			id: 'onboard-1',
			sender: 'ai',
			content: "# Welcome to Collective! 👋\n\nWhether you're roommates sharing chores, a family managing life, or friends organizing trips—I help you see who's doing what, and get things done, so no one carries everything.",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Create a group', value: 'create_group' },
					{ label: 'Join a group', value: 'join_group' },
					{ label: 'See examples', value: 'see_examples' }
				]
			}
		},
		// Step 2: User chooses to create a group
		{
			id: 'onboard-2',
			sender: 'user',
			content: 'Create a group',
			timestamp: new Date().toISOString()
		},
		// Step 3: Group type selection
		{
			id: 'onboard-3',
			sender: 'ai',
			content: "Let's get you set up! What type of group is this?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: '🏠 Shared apartment', value: 'type_apartment' },
					{ label: '👨‍👩‍👧 Family', value: 'type_family' },
					{ label: '⚽ Sports team', value: 'type_sports' },
					{ label: '✈️ Trip/event', value: 'type_trip' },
					{ label: '👥 Friends', value: 'type_friends' }
				]
			}
		},
		// Step 4: User selects apartment
		{
			id: 'onboard-4',
			sender: 'user',
			content: '🏠 Shared apartment',
			timestamp: new Date().toISOString()
		},
		// Step 5: Ask for group name
		{
			id: 'onboard-5',
			sender: 'ai',
			content: "Great choice! What would you like to call your group?\n\nJust type a name below.",
			timestamp: new Date().toISOString()
		},
		// Step 6: User types group name
		{
			id: 'onboard-6',
			sender: 'user',
			content: 'Brooklyn Apartment',
			timestamp: new Date().toISOString()
		},
		// Step 7: Ask for member count
		{
			id: 'onboard-7',
			sender: 'ai',
			content: "Brooklyn Apartment—I like it! 🏠\n\nHow many people will be in this group?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: '2', value: 'count_2' },
					{ label: '3', value: 'count_3' },
					{ label: '4', value: 'count_4' },
					{ label: '5+', value: 'count_5plus' },
					{ label: 'Not sure', value: 'count_unsure' }
				]
			}
		},
		// Step 8: User selects 3
		{
			id: 'onboard-8',
			sender: 'user',
			content: '3',
			timestamp: new Date().toISOString()
		},
		// Step 9: Group created confirmation card
		{
			id: 'onboard-9',
			sender: 'ai',
			content: "You're all set!",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: '🎉 Brooklyn Apartment',
							subtitle: 'Shared apartment • 3 people'
						},
						{
							type: 'divider',
							spacing: 'small'
						},
						{
							type: 'text',
							content: 'Share this link with your roommates:',
							size: 'small',
							color: 'muted'
						},
						{
							type: 'text',
							content: 'collective.app/join/xK7mP2',
							size: 'large'
						}
					],
					maxWidth: 380
				},
				quick_replies: [
					{ label: 'Copy link', value: 'copy_link' },
					{ label: 'Share via text', value: 'share_text' },
					{ label: 'Skip for now', value: 'skip_invite' }
				]
			}
		},
		// Step 10: User skips invite
		{
			id: 'onboard-10',
			sender: 'user',
			content: 'Skip for now',
			timestamp: new Date().toISOString()
		},
		// Step 11: Prompt for first expense
		{
			id: 'onboard-11',
			sender: 'ai',
			content: "No problem! You can share the link anytime from group settings.\n\nWant to log your first expense? Even before others join, you can start tracking what you pay.",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Log an expense', value: 'log_expense' },
					{ label: "I'll explore first", value: 'explore' }
				]
			}
		},
		// Step 12: User chooses to log expense
		{
			id: 'onboard-12',
			sender: 'user',
			content: 'Log an expense',
			timestamp: new Date().toISOString()
		},
		// Step 13: Ask for expense name
		{
			id: 'onboard-13',
			sender: 'ai',
			content: "What's the expense for?\n\nJust type it below—like \"Rent\", \"Groceries\", or \"Utilities\".",
			timestamp: new Date().toISOString()
		},
		// Step 14: User types expense name
		{
			id: 'onboard-14',
			sender: 'user',
			content: 'Rent',
			timestamp: new Date().toISOString()
		},
		// Step 15: Ask for amount
		{
			id: 'onboard-15',
			sender: 'ai',
			content: "Got it—Rent. How much was it?",
			timestamp: new Date().toISOString()
		},
		// Step 16: User types amount
		{
			id: 'onboard-16',
			sender: 'user',
			content: '$2550',
			timestamp: new Date().toISOString()
		},
		// Step 17: Ask how to split
		{
			id: 'onboard-17',
			sender: 'ai',
			content: "$2,550 for rent. How should we split it?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Between everyone (3 people)', value: 'split_everyone' },
					{ label: 'Just me', value: 'split_just_me' }
				]
			}
		},
		// Step 18: User chooses to split
		{
			id: 'onboard-18',
			sender: 'user',
			content: 'Between everyone (3 people)',
			timestamp: new Date().toISOString()
		},
		// Step 19: Expense confirmation card
		{
			id: 'onboard-19',
			sender: 'ai',
			content: "Done!",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: '✓ Rent logged!'
						},
						{
							type: 'stat_row',
							label: 'Amount',
							value: '$2,550',
							icon: 'money',
							highlight: true
						},
						{
							type: 'stat_row',
							label: 'Split 3 ways',
							value: '$850 each',
							icon: 'group'
						},
						{
							type: 'divider',
							spacing: 'small'
						},
						{
							type: 'text',
							content: "When your roommates join, they'll see they each owe you $850.",
							color: 'muted',
							size: 'small'
						}
					],
					maxWidth: 380
				},
				quick_replies: [
					{ label: 'Share invite link', value: 'share_after_expense' },
					{ label: 'Done', value: 'onboarding_complete' }
				]
			}
		},
		// Step 20: User completes onboarding
		{
			id: 'onboard-20',
			sender: 'user',
			content: 'Done',
			timestamp: new Date().toISOString()
		},
		// Step 21: Final message
		{
			id: 'onboard-21',
			sender: 'ai',
			content: "You're all set! 🎉\n\nI'll be here to help you coordinate with your roommates—tracking expenses, sharing shopping lists, and making sure everyone does their fair share.\n\nJust message me anytime!",
			timestamp: new Date().toISOString()
		}
	]
};

// Post-Onboarding Group Chat - First interaction in the newly created group
export const postOnboardingGroupScenario: Scenario = {
	id: 'post-onboarding-group',
	title: 'Post-Onboarding Group Setup',
	description: 'First time entering the newly created group after onboarding',
	initial_user: 'sarah',
	messages: [
		// Step 1: Welcome to group-level chat
		{
			id: 'post-onboard-1',
			sender: 'ai',
			content: "Nice! This is where you and I discuss this group specifically.\n\nI noticed you logged rent. I'd like to help track that payment going forward. When is it usually due?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: '1st of the month', value: 'rent_1st' },
					{ label: '15th of the month', value: 'rent_15th' },
					{ label: 'End of month', value: 'rent_end' },
					{ label: 'Varies', value: 'rent_varies' }
				]
			}
		},
		// Step 2: User selects rent date
		{
			id: 'post-onboard-2',
			sender: 'user',
			content: '1st of the month',
			timestamp: new Date().toISOString()
		},
		// Step 3: AI acknowledges and asks about reminders
		{
			id: 'post-onboard-3',
			sender: 'ai',
			content: "Got it—rent due on the 1st.\n\nWant me to remind you a few days before? I'll also ping your roommates once they join.",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Yes, remind me', value: 'remind_yes' },
					{ label: 'No thanks', value: 'remind_no' }
				]
			}
		},
		// Step 4: User accepts reminders
		{
			id: 'post-onboard-4',
			sender: 'user',
			content: 'Yes, remind me',
			timestamp: new Date().toISOString()
		},
		// Step 5: Confirmation and next prompt
		{
			id: 'post-onboard-5',
			sender: 'ai',
			content: "Perfect! I'll nudge everyone 3 days before rent is due. 📅\n\nAnything else you want to set up while we're at it?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Add recurring chores', value: 'add_chores' },
					{ label: 'Set up utilities', value: 'add_utilities' },
					{ label: "I'm good for now", value: 'done_setup' }
				]
			}
		},
		// Step 6: User says they're good
		{
			id: 'post-onboard-6',
			sender: 'user',
			content: "I'm good for now",
			timestamp: new Date().toISOString()
		},
		// Step 7: Final wrap-up
		{
			id: 'post-onboard-7',
			sender: 'ai',
			content: "Sounds good! You can always come back here to:\n\n• Log expenses & settle up\n• Track who owes what\n• Assign chores & tasks\n• Ask me anything about the group\n\nI'm here whenever you need me. 🙌",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: "What's on my plate?", value: 'show_tasks' },
					{ label: 'How does fairness work?', value: 'fairness_explain' },
					{ label: 'Thanks!', value: 'thanks' }
				]
			}
		}
	]
};

// ============================================================================
// TRIP PLANNING SCENARIO - Conversational trip group creation
// ============================================================================

export const tripPlanningScenario: Scenario = {
	id: 'trip-planning',
	title: 'Trip Planning',
	description: 'Plan a Barcelona trip with friends - conversational group creation',
	initial_user: 'sarah',
	messages: [
		// Step 1: Initial greeting in Feed view
		{
			id: 'trip-1',
			sender: 'ai',
			content: "# Good morning, Nishi ☀️\nFriday, November 29",
			timestamp: new Date().toISOString()
		},
		// Step 2: User expresses trip intent (matched by fuzzy detection)
		{
			id: 'trip-2',
			sender: 'user',
			content: 'I want to plan a trip to Barcelona with my friends in March',
			timestamp: new Date().toISOString()
		},
		// Step 3: AI suggests creating trip group
		{
			id: 'trip-3',
			sender: 'ai',
			content: "That sounds exciting! 🎉\n\nPlanning a trip with friends can get messy fast. Want me to create a dedicated group for this trip?\n\nI can help you:\n• Find flights & hotels\n• Track decisions & bookings\n• Split costs fairly\n• Keep everyone on the same page",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Yes, create trip group', value: 'create_trip_group' },
					{ label: 'Just give me tips', value: 'just_tips' }
				]
			}
		},
		// Step 4: User confirms group creation
		{
			id: 'trip-4',
			sender: 'user',
			content: 'Yes, create trip group',
			timestamp: new Date().toISOString()
		},
		// Step 5: Ask for group name
		{
			id: 'trip-5',
			sender: 'ai',
			content: "Perfect! Let's set this up.\n\nWhat should we call this group?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Barcelona March 2025', value: 'name_barcelona_march' },
					{ label: 'Barcelona Trip', value: 'name_barcelona_trip' },
					{ label: 'Friends Barcelona', value: 'name_friends_barcelona' }
				]
			}
		},
		// Step 6: User selects name
		{
			id: 'trip-6',
			sender: 'user',
			content: 'Barcelona March 2025',
			timestamp: new Date().toISOString()
		},
		// Step 7: Ask for people count
		{
			id: 'trip-7',
			sender: 'ai',
			content: "Great! Barcelona March 2025\n\nHow many people are going?\n(Including you)",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: '2', value: 'count_2' },
					{ label: '3', value: 'count_3' },
					{ label: '4', value: 'count_4' },
					{ label: '5', value: 'count_5' },
					{ label: '6+', value: 'count_6plus' }
				]
			}
		},
		// Step 8: User selects 4
		{
			id: 'trip-8',
			sender: 'user',
			content: '4',
			timestamp: new Date().toISOString()
		},
		// Step 9: Ask for timing
		{
			id: 'trip-9',
			sender: 'ai',
			content: "4 people - perfect group size!\n\nWhen are you thinking of going?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Early March', value: 'timing_early' },
					{ label: 'Mid March', value: 'timing_mid' },
					{ label: 'Late March', value: 'timing_late' },
					{ label: 'Not sure yet', value: 'timing_unsure' }
				]
			}
		},
		// Step 10: User selects Mid March
		{
			id: 'trip-10',
			sender: 'user',
			content: 'Mid March',
			timestamp: new Date().toISOString()
		},
		// Step 11: Ask for duration
		{
			id: 'trip-11',
			sender: 'ai',
			content: "Mid March in Barcelona - great timing! Weather should be nice.\n\nHow many nights?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Weekend (2-3 nights)', value: 'duration_weekend' },
					{ label: 'Long weekend (4-5 nights)', value: 'duration_long' },
					{ label: 'Full week (6-7 nights)', value: 'duration_week' },
					{ label: 'Not sure yet', value: 'duration_unsure' }
				]
			}
		},
		// Step 12: User selects long weekend
		{
			id: 'trip-12',
			sender: 'user',
			content: 'Long weekend (4-5 nights)',
			timestamp: new Date().toISOString()
		},
		// Step 13: AI thinking message (triggers rotating loader)
		// This is handled specially in the UI - shows thinking with rotating trip-specific text
		{
			id: 'trip-13',
			sender: 'ai',
			content: "Got it! Let me set this up...",
			timestamp: new Date().toISOString(),
			ui_elements: {
				animation: 'trip-thinking' // Special animation type for rotating text
			}
		},
		// Step 14: Group created with insights
		{
			id: 'trip-14',
			sender: 'ai',
			content: "✓ Barcelona March 2025 created!\n\nI've started working on this for you. Here's what I found:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: '💡 Quick Insights',
							icon: 'info'
						},
						{
							type: 'list',
							items: [
								{ title: 'Mid-March Barcelona: 18-22°C', icon: 'info' },
								{ title: '4-5 nights needs planning by early January for best prices', icon: 'info' },
								{ title: 'Budget estimate: €600-900/person for flights + hotel', icon: 'money' }
							],
							style: 'compact'
						}
					],
					maxWidth: 420
				}
			}
		},
		// Step 15: Ready to dive in with group card display
		{
			id: 'trip-15',
			sender: 'ai',
			content: "Ready to dive in?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				// This triggers GroupCard display in the UI
				show_group_card: true,
				quick_replies: [
					{ label: 'Start planning', value: 'start_planning' },
					{ label: 'Invite friends first', value: 'invite_first' }
				]
			}
		}
	]
};

// Trip Planning Group-Level Scenario - Continues after entering the group
export const tripPlanningGroupScenario: Scenario = {
	id: 'trip-planning-group',
	title: 'Trip Planning - Group Level',
	description: 'Continues trip planning inside the group with flight options and coordination',
	initial_user: 'sarah',
	messages: [
		// Step 1: AI shows planning breakdown
		{
			id: 'trip-group-1',
			sender: 'ai',
			content: "Let's break this down into steps:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schemas: [
					{
						sections: [
							{
								type: 'header',
								title: '1. ✈️ Find Flights',
								subtitle: 'In progress...'
							},
							{
								type: 'text',
								content: "I'm searching for the best options now.",
								size: 'small',
								color: 'muted'
							}
						],
						maxWidth: 380
					},
					{
						sections: [
							{
								type: 'header',
								title: '2. 🏨 Pick Accommodation',
								subtitle: 'Ready to start'
							}
						],
						maxWidth: 380
					},
					{
						sections: [
							{
								type: 'header',
								title: '3. 🎯 Plan Activities',
								subtitle: 'Coming soon'
							}
						],
						maxWidth: 380
					},
					{
						sections: [
							{
								type: 'header',
								title: '4. 💰 Set Budget',
								subtitle: 'Coming soon'
							}
						],
						maxWidth: 380
					}
				]
			}
		},
		// Step 2: Prompt while searching
		{
			id: 'trip-group-2',
			sender: 'ai',
			content: "While I search, want to invite your friends?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Invite friends', value: 'invite_friends' },
					{ label: 'Keep planning', value: 'keep_planning' }
				]
			}
		},
		// Step 3: Flight options found
		{
			id: 'trip-group-3',
			sender: 'ai',
			content: "I found 3 great flight options!",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: '✈️ Flight Options'
						},
						{
							type: 'text',
							content: 'For: Mid-March (flexible dates)\n4 people, round-trip from NYC',
							size: 'small',
							color: 'muted'
						},
						{
							type: 'carousel',
							cardWidth: 300,
							cards: [
								// Option 1 - Best Price
								{
									sections: [
										{
											type: 'header',
											title: '✈️ Option 1 - Best Price',
											icon: 'flight'
										},
										{
											type: 'stat_row',
											label: 'Norwegian Air',
											value: '$458/person',
											highlight: true
										},
										{
											type: 'text',
											content: 'Mar 12-17 (Wed-Mon) • Direct',
											size: 'small'
										},
										{
											type: 'text',
											content: 'Total: $1,832 for 4 people',
											size: 'small',
											color: 'muted'
										},
										{
											type: 'list',
											items: [
												{ title: 'Checked bag included', icon: 'checklist' }
											],
											style: 'compact'
										},
										{
											type: 'actions',
											buttons: [
												{ label: 'Vote for this', value: 'vote_option1', variant: 'filled', primary: true },
												{ label: 'Details', value: 'details_option1', variant: 'outlined' }
											],
											layout: 'row'
										}
									],
									variant: 'elevated'
								},
								// Option 2 - Better Times
								{
									sections: [
										{
											type: 'header',
											title: '✈️ Option 2 - Better Times',
											icon: 'flight'
										},
										{
											type: 'stat_row',
											label: 'Delta',
											value: '$542/person',
											highlight: true
										},
										{
											type: 'text',
											content: 'Mar 13-18 (Thu-Tue) • 1 stop',
											size: 'small'
										},
										{
											type: 'text',
											content: 'Total: $2,168 for 4 people',
											size: 'small',
											color: 'muted'
										},
										{
											type: 'list',
											items: [
												{ title: 'More departure time options', icon: 'checklist' }
											],
											style: 'compact'
										},
										{
											type: 'actions',
											buttons: [
												{ label: 'Vote for this', value: 'vote_option2', variant: 'filled', primary: true },
												{ label: 'Details', value: 'details_option2', variant: 'outlined' }
											],
											layout: 'row'
										}
									],
									variant: 'elevated'
								},
								// Option 3 - Premium
								{
									sections: [
										{
											type: 'header',
											title: '✈️ Option 3 - Premium',
											icon: 'flight'
										},
										{
											type: 'stat_row',
											label: 'Iberia',
											value: '$612/person',
											highlight: true
										},
										{
											type: 'text',
											content: 'Mar 14-19 (Fri-Wed) • Direct',
											size: 'small'
										},
										{
											type: 'text',
											content: 'Total: $2,448 for 4 people',
											size: 'small',
											color: 'muted'
										},
										{
											type: 'list',
											items: [
												{ title: 'Best flight times', icon: 'checklist' },
												{ title: 'Extra legroom available', icon: 'checklist' }
											],
											style: 'compact'
										},
										{
											type: 'actions',
											buttons: [
												{ label: 'Vote for this', value: 'vote_option3', variant: 'filled', primary: true },
												{ label: 'Details', value: 'details_option3', variant: 'outlined' }
											],
											layout: 'row'
										}
									],
									variant: 'elevated'
								}
							]
						}
					],
					maxWidth: 420
				}
				// No quick_replies here - AI recommendation with buttons will follow immediately
			}
		},
		// Step 4: AI recommendation
		{
			id: 'trip-group-4',
			sender: 'ai',
			content: "💡 My recommendation:\nOption 1 saves $336 total and Wed-Mon dates avoid weekend prices in Barcelona.\n\nShare with group to decide?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Share options', value: 'share_options' },
					{ label: 'Keep researching', value: 'keep_researching' }
				]
			}
		},
		// Step 5: Share/Invite flow
		{
			id: 'trip-group-5',
			sender: 'ai',
			content: "Who should I share this with?\n\nThis group needs 3 more people:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: 'Invite Link'
						},
						{
							type: 'text',
							content: 'collective.app/join/bcn2025',
							size: 'large'
						},
						{
							type: 'actions',
							buttons: [
								{ label: 'Copy link', value: 'copy_link', variant: 'filled', primary: true },
								{ label: 'Share via text', value: 'share_text', variant: 'outlined' },
								{ label: 'Share via WhatsApp', value: 'share_whatsapp', variant: 'outlined' }
							],
							layout: 'column'
						},
						{
							type: 'divider',
							spacing: 'medium'
						},
						{
							type: 'text',
							content: 'Or I can send them:',
							size: 'small',
							color: 'muted'
						},
						{
							type: 'text',
							content: '"Hey! Nishi invited you to plan our Barcelona trip on Collective. I already found flight options - tap to review and vote!"',
							size: 'small'
						}
					],
					maxWidth: 420
				},
				quick_replies: [
					{ label: 'Send invite message', value: 'send_invite' }
				]
			}
		},
		// Step 6: Invite sent confirmation
		{
			id: 'trip-group-6',
			sender: 'ai',
			content: "✓ Invite link copied!\n\nI'll let you know when people join.\n\nMeanwhile, want me to start on hotel options?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Yes, find hotels', value: 'find_hotels' },
					{ label: "I'll wait for the group", value: 'wait_for_group' }
				]
			}
		},
		// Step 7: Jerone joins (simulated after delay) - pause for greeting
		{
			id: 'trip-group-7',
			sender: 'ai',
			content: "🎉 Jerone joined the group!\n(2 of 4 people now)",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Say hi 👋', value: 'greet_jerone_hi' },
					{ label: 'Greet and share findings', value: 'greet_jerone_share' }
				]
			}
		},
		// Step 8: Jerone vote card (for group chat - AI notices the vote)
		{
			id: 'trip-group-vote-card',
			sender: 'ai',
			content: '',
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schemas: [
					{
						sections: [
							{
								type: 'header',
								title: '✅ Vote Recorded',
								subtitle: 'Jerone voted for Option 1'
							},
							{
								type: 'stat_row',
								label: 'Norwegian Air',
								value: '$458/person',
								highlight: true
							},
							{
								type: 'text',
								content: 'Votes: 1 of 4 • Waiting for more votes',
								size: 'small',
								color: 'muted'
							}
						],
						maxWidth: 320
					}
				]
			}
		},
		// Step 8b: Jerone votes notification (legacy - for AI chat)
		{
			id: 'trip-group-8',
			sender: 'ai',
			content: "Jerone voted for Norwegian Air (Option 1 - $458/person)\n\nCurrent votes: 1 of 2 members",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Vote for Option 1 too', value: 'vote_option1_confirm' },
					{ label: 'Vote for Option 2', value: 'vote_option2_confirm' },
					{ label: 'See options again', value: 'see_options_again' }
				]
			}
		},
		// Step 8c: AI asks first accommodation question (style)
		{
			id: 'trip-group-accom-1',
			sender: 'ai',
			content: "Great! Now let's find a place to stay.\n\nWhat style of accommodation are you looking for?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Boutique hotel', value: 'accom_style_boutique' },
					{ label: 'Modern apartment', value: 'accom_style_apartment' },
					{ label: 'Budget-friendly', value: 'accom_style_budget' },
					{ label: 'Flexible', value: 'accom_style_flexible' }
				]
			}
		},
		// Step 8d: AI asks location preference
		{
			id: 'trip-group-accom-2',
			sender: 'ai',
			content: "Which area of Barcelona would you prefer?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Gothic Quarter', value: 'accom_location_gothic' },
					{ label: 'El Born', value: 'accom_location_elborn' },
					{ label: 'Barceloneta', value: 'accom_location_barceloneta' },
					{ label: 'Near Sagrada Familia', value: 'accom_location_sagrada' }
				]
			}
		},
		// Step 8e: AI asks price range
		{
			id: 'trip-group-accom-3',
			sender: 'ai',
			content: "What's your budget per night?",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Budget ($60-80/night)', value: 'accom_price_budget' },
					{ label: 'Mid-range ($80-120/night)', value: 'accom_price_mid' },
					{ label: 'Premium ($120+/night)', value: 'accom_price_premium' }
				]
			}
		},
		// Step 8f: AI presents accommodation options
		{
			id: 'trip-group-accom-4',
			sender: 'ai',
			content: "Perfect! I found some great options for you:",
			timestamp: new Date().toISOString(),
			ui_elements: {
				card_schema: {
					sections: [
						{
							type: 'header',
							title: '🏨 Accommodation Options'
						},
						{
							type: 'text',
							content: 'For: Mar 12-17 (5 nights) • 4 people',
							size: 'small',
							color: 'muted'
						},
						{
							type: 'carousel',
							cardWidth: 300,
							cards: [
								// Option 1 - Boutique Hotel
								{
									sections: [
										{
											type: 'header',
											title: '🏨 Hotel Neri',
											subtitle: 'Boutique Hotel',
											icon: 'hotel'
										},
										{
											type: 'stat_row',
											label: 'Gothic Quarter',
											value: '€95/night',
											highlight: true
										},
										{
											type: 'text',
											content: 'Total: €475 (5 nights)',
											size: 'small',
											color: 'muted'
										},
										{
											type: 'list',
											items: [
												{ title: 'Historic building', icon: 'checklist' },
												{ title: 'Rooftop terrace', icon: 'checklist' },
												{ title: 'Walking distance to landmarks', icon: 'checklist' }
											],
											style: 'compact'
										},
										{
											type: 'stat_row',
											label: 'Rating',
											value: '4.8/5'
										},
										{
											type: 'actions',
											buttons: [
												{ label: 'Vote for this', value: 'vote_accom1', variant: 'filled', primary: true },
												{ label: 'Details', value: 'details_accom1', variant: 'outlined' }
											],
											layout: 'row'
										}
									],
									variant: 'elevated'
								},
								// Option 2 - Modern Apartment
								{
									sections: [
										{
											type: 'header',
											title: '🏠 El Born Loft',
											subtitle: 'Modern Apartment',
											icon: 'apartment'
										},
										{
											type: 'stat_row',
											label: 'El Born',
											value: '€110/night',
											highlight: true
										},
										{
											type: 'text',
											content: 'Total: €550 (5 nights)',
											size: 'small',
											color: 'muted'
										},
										{
											type: 'list',
											items: [
												{ title: 'Full kitchen', icon: 'checklist' },
												{ title: '2 bedrooms', icon: 'checklist' },
												{ title: 'Balcony with views', icon: 'checklist' }
											],
											style: 'compact'
										},
										{
											type: 'stat_row',
											label: 'Rating',
											value: '4.9/5'
										},
										{
											type: 'actions',
											buttons: [
												{ label: 'Vote for this', value: 'vote_accom2', variant: 'filled', primary: true },
												{ label: 'Details', value: 'details_accom2', variant: 'outlined' }
											],
											layout: 'row'
										}
									],
									variant: 'elevated'
								},
								// Option 3 - Budget Hostel
								{
									sections: [
										{
											type: 'header',
											title: '🏖️ Beach Hostel',
											subtitle: 'Budget-friendly',
											icon: 'bed'
										},
										{
											type: 'stat_row',
											label: 'Barceloneta',
											value: '€68/night',
											highlight: true
										},
										{
											type: 'text',
											content: 'Total: €340 (5 nights)',
											size: 'small',
											color: 'muted'
										},
										{
											type: 'list',
											items: [
												{ title: 'Near beach', icon: 'checklist' },
												{ title: 'Private room for 4', icon: 'checklist' },
												{ title: 'Shared kitchen', icon: 'checklist' }
											],
											style: 'compact'
										},
										{
											type: 'stat_row',
											label: 'Rating',
											value: '4.6/5'
										},
										{
											type: 'actions',
											buttons: [
												{ label: 'Vote for this', value: 'vote_accom3', variant: 'filled', primary: true },
												{ label: 'Details', value: 'details_accom3', variant: 'outlined' }
											],
											layout: 'row'
										}
									],
									variant: 'elevated'
								}
							]
						}
					],
					maxWidth: 420
				}
			}
		},
		// Step 9: Both voted same
		{
			id: 'trip-group-9',
			sender: 'ai',
			content: "✓ You and Jerone both chose Norwegian Air (Option 1)\n\nOnce the other 2 members join and vote, we can lock this in.\n\nWant me to start finding hotels near your flight dates?\n(Mar 12-17)",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Yes, find hotels', value: 'find_hotels_after_vote' },
					{ label: 'Wait for everyone', value: 'wait_for_everyone' }
				]
			}
		},
		// Step 10: Hotels search started
		{
			id: 'trip-group-10',
			sender: 'ai',
			content: "On it! Searching for hotels in Barcelona for Mar 12-17...\n\nWhile I work on this, here's what you and Jerone have accomplished:\n\n✓ Flight option selected\n✓ Dates confirmed (Mar 12-17)\n✓ 2 of 4 people onboard\n\nNEXT STEPS:\n• Wait for other 2 to join & vote\n• I'll find hotel options (5 min)\n• Then we can set a budget\n• And start planning activities\n\nI'll notify you when hotels are ready to review!",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Back to Feed', value: 'back_to_feed' },
					{ label: 'View group', value: 'view_group' }
				]
			}
		},
		// Step 11: Hotels ready notification (proactive)
		{
			id: 'trip-group-11',
			sender: 'ai',
			content: "Hotel options ready! I found 4 great options in Gothic Quarter.",
			timestamp: new Date().toISOString(),
			ui_elements: {
				quick_replies: [
					{ label: 'Review hotels', value: 'review_hotels' }
				]
			}
		}
	]
};

// Export all scenarios (visible ones first, in display order)
export const scenarios: Scenario[] = [
	// Visible scenarios (in display order)
	onboardingScenario,
	postOnboardingGroupScenario,
	tripPlanningScenario,
	tripPlanningGroupScenario,
	// Hidden scenarios
	viewMyTasksScenario,
	fairnessScenario,
	tradeChoreScenario,
	completeTaskScenario,
	minimalAnalyticsScenario,
	weeklyReviewScenario,
	shoppingRequestScenario,
	paymentSummaryScenario
];

// Helper to get only visible scenarios (for meta menu)
export function getVisibleScenarios(): Scenario[] {
	return scenarios.filter(s => !s.hidden);
}

// Helper to get scenario by ID
export function getScenarioById(id: string): Scenario | undefined {
	return scenarios.find(s => s.id === id);
}

// Helper to get scenarios for a specific user
export function getScenariosByUser(userId: string): Scenario[] {
	return scenarios.filter(s => s.initial_user === userId);
}

