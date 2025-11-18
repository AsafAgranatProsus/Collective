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
		members: ['sarah', 'mike', 'jessica', 'bob']
	},
	{
		id: 'tokyo-trip',
		name: 'Tokyo Trip 2026',
		icon: '✈️',
		type: 'trip',
		member_count: 3,
		pending_count: 0,
		is_active: false,
		members: ['sarah', 'alex', 'jordan']
	},
	{
		id: 'q1-marketing',
		name: 'Q1 Marketing Campaign',
		icon: '💼',
		type: 'project',
		member_count: 5,
		pending_count: 0,
		is_active: false,
		members: ['sarah', 'team1', 'team2', 'team3', 'team4']
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

