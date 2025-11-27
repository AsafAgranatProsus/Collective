/**
 * Groups Data
 * 
 * Group definitions and metadata for the Collective prototype.
 * This is the canonical source for Group type and group instances.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for conventions
 * @see lib/data/types.ts for unified type imports
 * 
 * ## Structure
 * 
 * - `Group` interface: Metadata for a group (name, members, display info)
 * - `groups` array: All group instances
 * - Helper functions: getGroupById, getAllGroups, getActiveGroups
 * 
 * ## How to Extend
 * 
 * 1. Add new group object to `groups` array
 * 2. Set `is_active: false` for placeholder/coming-soon groups
 * 3. Use consistent ID format: lowercase-with-dashes
 * 
 * ## Note on Types
 * 
 * `household.ts` has a separate interface also called Group (now HouseholdConfig).
 * For group metadata, use THIS file's Group type.
 * For member details, use household.ts.
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

// Static/default groups
const staticGroups: Group[] = [
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

// Dynamic groups (created during scenarios like trip planning)
let dynamicGroups = $state<Group[]>([]);

// Combined groups array (for backward compatibility)
export const groups = staticGroups;

/**
 * Get group by ID (checks both static and dynamic groups)
 */
export function getGroupById(id: string): Group | undefined {
	return dynamicGroups.find(g => g.id === id) || staticGroups.find(g => g.id === id);
}

/**
 * Get all groups user belongs to (dynamic groups first, then static)
 */
export function getAllGroups(): Group[] {
	return [...dynamicGroups, ...staticGroups];
}

/**
 * Get only active (clickable) groups
 */
export function getActiveGroups(): Group[] {
	return getAllGroups().filter(g => g.is_active);
}

/**
 * Add a dynamic group (appears at top of list)
 */
export function addDynamicGroup(group: Group): void {
	// Check if group already exists
	if (!dynamicGroups.find(g => g.id === group.id)) {
		dynamicGroups = [group, ...dynamicGroups];
		console.log('Added dynamic group:', group.name);
	}
}

/**
 * Update a dynamic group
 */
export function updateDynamicGroup(id: string, updates: Partial<Group>): void {
	const index = dynamicGroups.findIndex(g => g.id === id);
	if (index !== -1) {
		dynamicGroups[index] = { ...dynamicGroups[index], ...updates };
		dynamicGroups = [...dynamicGroups]; // Trigger reactivity
		console.log('Updated dynamic group:', id);
	}
}

/**
 * Remove a dynamic group
 */
export function removeDynamicGroup(id: string): void {
	dynamicGroups = dynamicGroups.filter(g => g.id !== id);
	console.log('Removed dynamic group:', id);
}

/**
 * Clear all dynamic groups (for reset)
 */
export function clearDynamicGroups(): void {
	dynamicGroups = [];
	console.log('Cleared all dynamic groups');
}

