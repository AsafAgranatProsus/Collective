/**
 * Household Data
 * 
 * Member information and household configuration for the Brooklyn Apt demo.
 * This is the canonical source for Member type and member instances.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for conventions
 * @see lib/data/types.ts for unified type imports
 * @see lib/data/groups.ts for Group type (group metadata)
 * 
 * ## Structure
 * 
 * - `Member` interface: Person in a group (name, avatar, role)
 * - `HouseholdConfig` interface: Household-specific settings
 * - `members` array: All member instances
 * - `brooklynApt`: The demo household config
 * - `fairnessStats`: Pre-computed fairness data for demo
 * 
 * ## How to Extend
 * 
 * 1. Add member to `members` array
 * 2. Use lowercase ID (e.g., 'sarah', 'mike')
 * 3. Also update groups.ts if member belongs to a group
 * 
 * ## Note on Types
 * 
 * Use `Group` from groups.ts for group metadata.
 * Use `Member` from this file for member details.
 * `HouseholdConfig` is for household-specific settings only.
 */

/**
 * Household-specific configuration.
 * For group metadata (name, icon, members list), use Group from groups.ts.
 */
export interface HouseholdConfig {
	id: string;
	name: string;
	group_type: 'household' | 'trip' | 'project' | 'event' | 'team';
	created_at: string;
	settings: {
		timezone: string;
		enabled_domains: Array<'chores' | 'expenses' | 'shopping' | 'trips' | 'activities'>;
	};
}

/**
 * @deprecated Use Group from groups.ts for group metadata.
 * This alias is kept for backward compatibility only.
 */
export type Group = HouseholdConfig;

export interface Member {
	id: string;
	group_id: string;
	name: string;
	avatar: string;
	role: 'creator' | 'member';
	joined_at: string;
	bio?: string;
}

export const brooklynApt: HouseholdConfig = {
	id: 'group-001',
	name: 'Brooklyn Apartment 4B',
	group_type: 'household',
	created_at: '2024-11-01T10:00:00Z',
	settings: {
		timezone: 'America/New_York',
		enabled_domains: ['chores', 'expenses', 'shopping']
	}
};

export const members: Member[] = [
	{
		id: 'sarah',
		group_id: 'group-001',
		name: 'You',
		avatar: '👩🏻‍💼',
		role: 'creator',
		joined_at: '2024-11-01T10:00:00Z',
		bio: 'Product Designer, organized, detail-oriented'
	},
	{
		id: 'mike',
		group_id: 'group-001',
		name: 'Mike Rodriguez',
		avatar: '👨🏽‍💻',
		role: 'member',
		joined_at: '2024-11-01T10:15:00Z',
		bio: 'Software Engineer, easygoing, sometimes forgets tasks'
	},
	{
		id: 'jessica',
		group_id: 'group-001',
		name: 'Jessica Taylor',
		avatar: '👩🏼‍💼',
		role: 'member',
		joined_at: '2024-11-01T10:20:00Z',
		bio: 'Marketing Manager, on top of things, values fairness'
	},
	{
		id: 'bob',
		group_id: 'group-001',
		name: 'Bob Kim',
		avatar: '👨🏻‍🎨',
		role: 'member',
		joined_at: '2024-11-01T10:25:00Z',
		bio: 'Graphic Designer, flexible, helpful, accommodating'
	}
];

// Fairness statistics for demo
export const fairnessStats = {
	period: 'last_30_days',
	members: [
		{
			member_id: 'sarah',
			chores: { completed: 11, assigned: 12, rate: 0.92 },
			expenses: { paid: 2, owed: 1, net_balance: -23.50 },
			shopping: { completed: 4, assigned: 5 }
		},
		{
			member_id: 'mike',
			chores: { completed: 10, assigned: 13, rate: 0.77 },
			expenses: { paid: 3, owed: 2, net_balance: 23.50 },
			shopping: { completed: 2, assigned: 3 }
		},
		{
			member_id: 'jessica',
			chores: { completed: 12, assigned: 13, rate: 0.92 },
			expenses: { paid: 3, owed: 1, net_balance: 42.00 },
			shopping: { completed: 3, assigned: 3 }
		},
		{
			member_id: 'bob',
			chores: { completed: 11, assigned: 12, rate: 0.92 },
			expenses: { paid: 2, owed: 3, net_balance: -42.00 },
			shopping: { completed: 5, assigned: 5 }
		}
	]
};

// Helper to get member by ID
export function getMemberById(id: string): Member | undefined {
	return members.find(m => m.id === id);
}

// Helper to get member name
export function getMemberName(id: string): string {
	const member = getMemberById(id);
	return member ? member.name : 'Unknown';
}

