/**
 * Coordinated Items
 * 
 * Chores, expenses, and shopping items for the Collective prototype.
 * This data drives analytics calculations automatically.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for conventions
 * @see lib/data/analytics.ts (auto-calculates from this data)
 * 
 * ## Item Types
 * 
 * - `chore`: Household tasks with due dates and assignments
 * - `expense`: Money paid by someone, split among group
 * - `shopping_item`: Items needed from stores
 * - `bill`: Recurring bills (utilities, rent)
 * - `maintenance`: Home maintenance tasks
 * 
 * ## How to Extend
 * 
 * 1. Add new item to `items` array
 * 2. Include all required fields (id, group_id, item_type, title, status)
 * 3. Add relevant metadata based on item_type
 * 4. Analytics will automatically recalculate
 * 
 * ## Important
 * 
 * - Changing items here affects analytics.ts output
 * - Use consistent member IDs from household.ts (sarah, mike, jessica, bob)
 * - Use ISO date strings for timestamps
 */

export type ItemType = 
	| 'chore'
	| 'expense'
	| 'shopping_item'
	| 'bill'
	| 'maintenance';

export type ItemStatus = 
	| 'pending'
	| 'active'
	| 'completed'
	| 'overdue'
	| 'cancelled';

export interface CoordinatedItem {
	id: string;
	group_id: string;
	item_type: ItemType;
	title: string;
	description?: string;
	status: ItemStatus;
	assigned_to?: string[];
	due_date?: string;
	recurrence?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'one-time';
	metadata: {
		// Chores
		difficulty?: number;
		estimated_minutes?: number;
		location?: string;
		
		// Expenses
		amount?: number;
		currency?: string;
		paid_by?: string;
		split_method?: 'equal' | 'percentage' | 'custom';
		category?: string;
		receipt_url?: string;
		date?: string;
		
		// Shopping
		quantity?: number;
		store?: string;
		urgency?: 'low' | 'medium' | 'high';
		requested_by?: string;
		
		[key: string]: any;
	};
	created_at: string;
	created_by: string;
	completed_at?: string;
	completed_by?: string;
}

export const items: CoordinatedItem[] = [
	// === CHORES ===
	{
		id: 'chore-001',
		group_id: 'group-001',
		item_type: 'chore',
		title: 'Clean kitchen',
		status: 'pending',
		assigned_to: ['sarah'],
		due_date: '2024-11-20T20:00:00Z',
		recurrence: 'weekly',
		metadata: {
			difficulty: 3,
			estimated_minutes: 30,
			location: 'kitchen'
		},
		created_at: '2024-11-18T08:00:00Z',
		created_by: 'sarah'
	},
	{
		id: 'chore-002',
		group_id: 'group-001',
		item_type: 'chore',
		title: 'Take out trash',
		status: 'pending',
		assigned_to: ['sarah'],
		due_date: '2024-11-23T09:00:00Z',
		recurrence: 'weekly',
		metadata: {
			difficulty: 2,
			estimated_minutes: 10
		},
		created_at: '2024-11-18T08:00:00Z',
		created_by: 'sarah'
	},
	{
		id: 'chore-003',
		group_id: 'group-001',
		item_type: 'chore',
		title: 'Clean bathroom',
		status: 'pending',
		assigned_to: ['mike'],
		due_date: '2024-11-21T20:00:00Z',
		recurrence: 'weekly',
		metadata: {
			difficulty: 4,
			estimated_minutes: 45,
			location: 'bathroom'
		},
		created_at: '2024-11-18T08:00:00Z',
		created_by: 'mike'
	},
	{
		id: 'chore-004',
		group_id: 'group-001',
		item_type: 'chore',
		title: 'Vacuum living room',
		status: 'completed',
		assigned_to: ['jessica'],
		due_date: '2024-11-22T18:00:00Z',
		completed_at: '2024-11-22T17:30:00Z',
		completed_by: 'jessica',
		metadata: {
			difficulty: 2,
			estimated_minutes: 20
		},
		created_at: '2024-11-18T08:00:00Z',
		created_by: 'jessica'
	},
	{
		id: 'chore-005',
		group_id: 'group-001',
		item_type: 'chore',
		title: 'Do dishes',
		status: 'overdue',
		assigned_to: ['mike'],
		due_date: '2024-11-19T23:00:00Z',
		recurrence: 'daily',
		metadata: {
			difficulty: 2,
			estimated_minutes: 15
		},
		created_at: '2024-11-18T08:00:00Z',
		created_by: 'mike'
	},
	
	// === EXPENSES ===
	{
		id: 'expense-001',
		group_id: 'group-001',
		item_type: 'expense',
		title: "Groceries (Trader Joe's)",
		status: 'pending',
		metadata: {
			amount: 94.50,
			currency: 'USD',
			paid_by: 'mike',
			split_method: 'equal',
			category: 'groceries',
			date: '2024-11-18'
		},
		created_at: '2024-11-18T14:30:00Z',
		created_by: 'mike'
	},
	{
		id: 'expense-002',
		group_id: 'group-001',
		item_type: 'expense',
		title: 'November utilities',
		status: 'pending',
		metadata: {
			amount: 168.00,
			currency: 'USD',
			paid_by: 'jessica',
			split_method: 'equal',
			category: 'utilities',
			date: '2024-11-15'
		},
		created_at: '2024-11-15T10:00:00Z',
		created_by: 'jessica'
	},
	{
		id: 'expense-003',
		group_id: 'group-001',
		item_type: 'expense',
		title: 'WiFi & streaming',
		status: 'completed',
		completed_at: '2024-11-10T12:00:00Z',
		metadata: {
			amount: 89.99,
			currency: 'USD',
			paid_by: 'bob',
			split_method: 'equal',
			category: 'subscriptions',
			date: '2024-11-01'
		},
		created_at: '2024-11-01T10:00:00Z',
		created_by: 'bob'
	},
	
	// === SHOPPING ===
	{
		id: 'shopping-001',
		group_id: 'group-001',
		item_type: 'shopping_item',
		title: 'Milk (whole)',
		status: 'pending',
		assigned_to: ['sarah'],
		metadata: {
			quantity: 1,
			store: 'bodega on corner',
			urgency: 'medium',
			requested_by: 'bob'
		},
		created_at: '2024-11-18T09:00:00Z',
		created_by: 'bob'
	},
	{
		id: 'shopping-002',
		group_id: 'group-001',
		item_type: 'shopping_item',
		title: 'Toilet paper',
		status: 'pending',
		metadata: {
			quantity: 2,
			urgency: 'high',
			requested_by: 'jessica'
		},
		created_at: '2024-11-17T15:00:00Z',
		created_by: 'jessica'
	},
	{
		id: 'shopping-003',
		group_id: 'group-001',
		item_type: 'shopping_item',
		title: 'Dish soap',
		status: 'pending',
		assigned_to: ['bob'],
		metadata: {
			quantity: 1,
			store: 'Target',
			urgency: 'low',
			requested_by: 'mike'
		},
		created_at: '2024-11-16T12:00:00Z',
		created_by: 'mike'
	}
];

// Helper functions
export function getItemsByUser(userId: string): CoordinatedItem[] {
	return items.filter(item => item.assigned_to?.includes(userId));
}

export function getItemsByType(type: ItemType): CoordinatedItem[] {
	return items.filter(item => item.item_type === type);
}

export function getItemsByStatus(status: ItemStatus): CoordinatedItem[] {
	return items.filter(item => item.status === status);
}

export function getItemById(id: string): CoordinatedItem | undefined {
	return items.find(item => item.id === id);
}

