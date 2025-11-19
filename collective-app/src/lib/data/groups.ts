/**
 * Groups Data - Multi-group structure
 * Shows 1 active group (Brooklyn Apt) + 2 fake groups for demo
 */

export interface Group {
	id: string;
	name: string;
	icon: string; // emoji
	type: 'household' | 'trip' | 'project' | 'event' | 'team';
	member_count: number;
	pending_count?: number;
	is_active: boolean; // true = clickable, false = grayed out
	members?: string[]; // member IDs
	avatars?: string[]; // avatar image URLs
	next_action?: {
		text: string;
		amount?: string;
		due?: string;
	};
	money_info?: {
		text: string;
		amount?: string;
	};
	recent_activity?: {
		text: string;
		time_ago: string;
	};
	activity_data?: number[]; // Mock data for chart
}

export const groups: Group[] = [
	{
		id: 'brooklyn-apt',
		name: 'Brooklyn Apartment 4B',
		icon: '🏠',
		type: 'household',
		member_count: 4,
		pending_count: 3,
		is_active: true,
		members: ['sarah', 'mike', 'jessica', 'bob'],
		avatars: [
			'https://randomuser.me/api/portraits/women/44.jpg',
			'https://randomuser.me/api/portraits/men/32.jpg',
			'https://randomuser.me/api/portraits/women/68.jpg',
			'https://randomuser.me/api/portraits/men/85.jpg'
		],
		next_action: {
			text: 'Pay rent',
			amount: '$850',
			due: 'due tom.'
		},
		money_info: {
			text: 'You owe Emma for groceries',
			amount: '$23'
		},
		recent_activity: {
			text: 'Jake completed trash duty',
			time_ago: '15m ago'
		},
		activity_data: [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.9]
	},
	{
		id: 'tokyo-trip',
		name: 'Tokyo Trip 2026',
		icon: '✈️',
		type: 'trip',
		member_count: 3,
		pending_count: 0,
		is_active: false,
		members: ['sarah', 'alex', 'jordan'],
		next_action: {
			text: 'Book flights to Tokyo',
			due: 'due Feb 12'
		},
		money_info: {
			text: 'You owe Alex for hotel deposit',
			amount: '$450'
		},
		recent_activity: {
			text: 'Jordan added itinerary notes',
			time_ago: '2h ago'
		}
	},
	{
		id: 'q1-marketing',
		name: 'Q1 Marketing Campaign',
		icon: '💼',
		type: 'project',
		member_count: 5,
		pending_count: 0,
		is_active: false,
		members: ['sarah', 'team1', 'team2', 'team3', 'team4'],
		next_action: {
			text: 'Review ad creatives',
			due: 'due Mon'
		},
		money_info: {
			text: 'Budget remaining',
			amount: '$12,500'
		},
		recent_activity: {
			text: 'Team uploaded new designs',
			time_ago: '1d ago'
		}
	}
];

/**
 * Get group by ID
 */
export function getGroupById(id: string): Group | undefined {
	return groups.find(g => g.id === id);
}

/**
 * Get all groups user belongs to
 */
export function getAllGroups(): Group[] {
	return groups;
}

/**
 * Get only active (clickable) groups
 */
export function getActiveGroups(): Group[] {
	return groups.filter(g => g.is_active);
}

