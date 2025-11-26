/**
 * Mock Household Data - Brooklyn Apartment 4B
 */

export interface Group {
	id: string;
	name: string;
	group_type: 'household' | 'trip' | 'project' | 'event' | 'team';
	created_at: string;
	settings: {
		timezone: string;
		enabled_domains: Array<'chores' | 'expenses' | 'shopping' | 'trips' | 'activities'>;
	};
}

export interface Member {
	id: string;
	group_id: string;
	name: string;
	avatar: string;
	role: 'creator' | 'member';
	joined_at: string;
	bio?: string;
}

export const brooklynApt: Group = {
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

