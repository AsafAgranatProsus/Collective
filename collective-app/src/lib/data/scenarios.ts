/**
 * Mock Scenario Scripts - Word-for-word dialogue for demo
 */

import type { CoordinatedItem } from './items';

export interface QuickReply {
	label: string;
	value: string;
}

export interface Message {
	id: string;
	sender: 'user' | 'ai';
	content: string;
	timestamp: string;
	ui_elements?: {
		quick_replies?: QuickReply[];
		cards?: CoordinatedItem[];
		card_data?: any;
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
				card_data: {
					type: 'summary',
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
				card_data: {
					type: 'trade',
					before: [
						{ task: 'Kitchen (Wed)', user: 'You' },
						{ task: 'Trash (Sat)', user: 'Bob' }
					],
					after: [
						{ task: 'Kitchen (Wed)', user: 'Bob' },
						{ task: 'Trash (Sat)', user: 'You' }
					]
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
				card_data: {
					type: 'completion',
					task: 'Take out trash',
					completed_at: 'Sat 9:42 AM'
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
				card_data: {
					type: 'leaderboard',
					rankings: [
						{ name: 'Sarah', rate: 95, icon: '🥇' },
						{ name: 'Jessica', rate: 92, icon: '🥈' },
						{ name: 'Bob', rate: 92, icon: '🥈' },
						{ name: 'Mike', rate: 78, icon: '🥉' }
					]
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

// Export all scenarios
export const scenarios: Scenario[] = [
	viewMyTasksScenario,
	fairnessScenario,
	tradeChoreScenario,
	completeTaskScenario,
	minimalAnalyticsScenario
];

// Helper to get scenario by ID
export function getScenarioById(id: string): Scenario | undefined {
	return scenarios.find(s => s.id === id);
}

// Helper to get scenarios for a specific user
export function getScenariosByUser(userId: string): Scenario[] {
	return scenarios.filter(s => s.initial_user === userId);
}

