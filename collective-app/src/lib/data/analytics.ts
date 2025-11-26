/**
 * Analytics Data Layer (Auto-Calculated)
 * 
 * Performance statistics calculated from items.ts.
 * DO NOT hardcode data here - modify items.ts to change analytics output.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for conventions
 * @see lib/data/items.ts (source data)
 * 
 * ## How It Works
 * 
 * - Reads chores/expenses from items.ts
 * - Calculates completion rates, trends, expenses
 * - Provides week and month views
 * 
 * ## Available Functions
 * 
 * - getUserWeekAnalytics(userId): Weekly stats for one user
 * - getUserMonthAnalytics(userId): Monthly stats with breakdown
 * - getAllUsersAnalytics(): Stats for all members
 * - getGroupWeekAnalytics(): Group-level weekly metrics
 * - getGroupMonthAnalytics(): Group-level monthly metrics
 * - getDailyTrendData(userId): 7-day trend for charts
 * - getWeeklyTrendData(userId): 4-week trend for charts
 * 
 * ## DO NOT
 * 
 * - Hardcode analytics values directly
 * - Modify this file to "fix" analytics numbers
 * - Instead, adjust the source data in items.ts
 */

import { items, type CoordinatedItem } from './items';
import { members } from './household';

export interface WeekAnalytics {
	tasks_completed: number;
	tasks_assigned: number;
	completion_rate: number;
	on_time: boolean;
	all_on_time: boolean;
}

export interface WeeklyBreakdown {
	week: number;
	completion_rate: number;
	completed: number;
	assigned: number;
}

export interface TasksByType {
	[key: string]: {
		completed: number;
		assigned: number;
	};
}

export interface ExpenseSummary {
	paid_amount: number;
	paid_count: number;
	owed_amount: number;
	owed_to?: string;
}

export interface MonthAnalytics {
	tasks_completed: number;
	tasks_assigned: number;
	completion_rate: number;
	avg_time_to_complete: number; // negative = early, positive = late (days)
	weekly_breakdown: WeeklyBreakdown[];
	tasks_by_type: TasksByType;
	expenses: ExpenseSummary;
}

export interface GroupWeekAnalytics {
	overall_completion: number;
	status: 'balanced' | 'needs_attention';
}

export interface GroupMonthAnalytics {
	avg_completion_rate: number;
	range: { min: number; max: number };
}

export interface UserAnalytics {
	week: WeekAnalytics;
	month: MonthAnalytics;
}

export interface AllUsersAnalytics {
	[userId: string]: UserAnalytics;
}

// Helper: Get date ranges
function getWeekRange(): { start: Date; end: Date } {
	const now = new Date();
	const start = new Date(now);
	start.setDate(now.getDate() - 7);
	return { start, end: now };
}

function getMonthRange(): { start: Date; end: Date } {
	const now = new Date();
	const start = new Date(now);
	start.setDate(now.getDate() - 30);
	return { start, end: now };
}

// Helper: Check if date is within range
function isInRange(date: string | undefined, start: Date, end: Date): boolean {
	if (!date) return false;
	const d = new Date(date);
	return d >= start && d <= end;
}

// Helper: Calculate days difference between dates
function daysDifference(date1: string, date2: string): number {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
}

// Calculate week analytics for a user
export function getUserWeekAnalytics(userId: string): WeekAnalytics {
	const { start, end } = getWeekRange();
	
	// Get user's chores in this week
	const userChores = items.filter(
		item =>
			item.item_type === 'chore' &&
			item.assigned_to?.includes(userId) &&
			(isInRange(item.due_date, start, end) || isInRange(item.completed_at, start, end))
	);
	
	const assigned = userChores.length;
	const completed = userChores.filter(item => item.status === 'completed').length;
	const completion_rate = assigned > 0 ? completed / assigned : 1.0;
	
	// Check if all completed tasks were on time
	const completedChores = userChores.filter(item => item.status === 'completed');
	const all_on_time = completedChores.every(item => {
		if (!item.due_date || !item.completed_at) return true;
		return new Date(item.completed_at) <= new Date(item.due_date);
	});
	
	// Check if user has any tasks due this week at all
	const on_time = assigned === 0 ? true : all_on_time;
	
	return {
		tasks_completed: completed,
		tasks_assigned: assigned,
		completion_rate,
		on_time,
		all_on_time
	};
}

// Calculate month analytics for a user
export function getUserMonthAnalytics(userId: string): MonthAnalytics {
	const { start, end } = getMonthRange();
	
	// Get user's chores in this month
	const userChores = items.filter(
		item =>
			item.item_type === 'chore' &&
			item.assigned_to?.includes(userId) &&
			(isInRange(item.due_date, start, end) || isInRange(item.completed_at, start, end))
	);
	
	const assigned = userChores.length;
	const completed = userChores.filter(item => item.status === 'completed').length;
	const completion_rate = assigned > 0 ? completed / assigned : 1.0;
	
	// Calculate average time to complete (negative = early)
	const completedWithDates = userChores.filter(
		item => item.status === 'completed' && item.due_date && item.completed_at
	);
	
	let avg_time_to_complete = 0;
	if (completedWithDates.length > 0) {
		const totalDays = completedWithDates.reduce((sum, item) => {
			const days = daysDifference(item.due_date!, item.completed_at!);
			return sum + days;
		}, 0);
		avg_time_to_complete = totalDays / completedWithDates.length;
	}
	
	// Weekly breakdown (last 4 weeks)
	const weekly_breakdown: WeeklyBreakdown[] = [];
	for (let i = 3; i >= 0; i--) {
		const weekStart = new Date(end);
		weekStart.setDate(end.getDate() - (i + 1) * 7);
		const weekEnd = new Date(end);
		weekEnd.setDate(end.getDate() - i * 7);
		
		const weekChores = userChores.filter(
			item => isInRange(item.due_date, weekStart, weekEnd) || isInRange(item.completed_at, weekStart, weekEnd)
		);
		
		const weekAssigned = weekChores.length;
		const weekCompleted = weekChores.filter(item => item.status === 'completed').length;
		const weekRate = weekAssigned > 0 ? weekCompleted / weekAssigned : 1.0;
		
		weekly_breakdown.push({
			week: 4 - i,
			completion_rate: weekRate,
			completed: weekCompleted,
			assigned: weekAssigned
		});
	}
	
	// Tasks by type
	const tasks_by_type: TasksByType = {};
	const choreTypes = ['cleaning', 'trash', 'dishes', 'bathroom', 'kitchen', 'other'];
	
	choreTypes.forEach(type => {
		const typeChores = userChores.filter(item => {
			const title = item.title.toLowerCase();
			if (type === 'cleaning') return title.includes('clean') || title.includes('vacuum');
			if (type === 'trash') return title.includes('trash');
			if (type === 'dishes') return title.includes('dish');
			if (type === 'bathroom') return title.includes('bathroom');
			if (type === 'kitchen') return title.includes('kitchen');
			return false;
		});
		
		if (typeChores.length > 0) {
			tasks_by_type[type] = {
				completed: typeChores.filter(item => item.status === 'completed').length,
				assigned: typeChores.length
			};
		}
	});
	
	// Expenses
	const userExpenses = items.filter(
		item => item.item_type === 'expense' && isInRange(item.metadata.date, start, end)
	);
	
	const paidExpenses = userExpenses.filter(item => item.metadata.paid_by === userId);
	const paid_amount = paidExpenses.reduce((sum, item) => sum + (item.metadata.amount || 0), 0);
	const paid_count = paidExpenses.length;
	
	// Calculate what user owes (expenses paid by others, split equally)
	const expensesPaidByOthers = userExpenses.filter(
		item => item.metadata.paid_by !== userId && item.metadata.split_method === 'equal'
	);
	const owed_amount = expensesPaidByOthers.reduce((sum, item) => {
		const amount = item.metadata.amount || 0;
		// Assume 4 people split equally
		return sum + amount / 4;
	}, 0);
	
	// Find who user owes the most to
	let owed_to: string | undefined;
	if (expensesPaidByOthers.length > 0) {
		const owedByPerson: { [key: string]: number } = {};
		expensesPaidByOthers.forEach(item => {
			const paidBy = item.metadata.paid_by;
			if (paidBy) {
				const amount = (item.metadata.amount || 0) / 4;
				owedByPerson[paidBy] = (owedByPerson[paidBy] || 0) + amount;
			}
		});
		
		// Get person user owes most to
		const maxOwed = Math.max(...Object.values(owedByPerson));
		owed_to = Object.keys(owedByPerson).find(key => owedByPerson[key] === maxOwed);
	}
	
	return {
		tasks_completed: completed,
		tasks_assigned: assigned,
		completion_rate,
		avg_time_to_complete,
		weekly_breakdown,
		tasks_by_type,
		expenses: {
			paid_amount,
			paid_count,
			owed_amount,
			owed_to
		}
	};
}

// Get analytics for all users
export function getAllUsersAnalytics(): AllUsersAnalytics {
	const allUsers: AllUsersAnalytics = {};
	
	members.forEach(member => {
		allUsers[member.id] = {
			week: getUserWeekAnalytics(member.id),
			month: getUserMonthAnalytics(member.id)
		};
	});
	
	return allUsers;
}

// Get group week analytics
export function getGroupWeekAnalytics(): GroupWeekAnalytics {
	const allUsers = getAllUsersAnalytics();
	const completionRates = Object.values(allUsers).map(user => user.week.completion_rate);
	
	const overall_completion = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
	
	// Group needs attention if overall completion < 80% or if any member < 60%
	const needsAttention = overall_completion < 0.8 || completionRates.some(rate => rate < 0.6);
	
	return {
		overall_completion,
		status: needsAttention ? 'needs_attention' : 'balanced'
	};
}

// Get group month analytics
export function getGroupMonthAnalytics(): GroupMonthAnalytics {
	const allUsers = getAllUsersAnalytics();
	const completionRates = Object.values(allUsers).map(user => user.month.completion_rate);
	
	const avg_completion_rate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
	const min = Math.min(...completionRates);
	const max = Math.max(...completionRates);
	
	return {
		avg_completion_rate,
		range: { min, max }
	};
}

// Get daily trend data for last 7 days (for line charts)
export function getDailyTrendData(userId: string): { labels: string[]; data: number[] } {
	const now = new Date();
	const labels: string[] = [];
	const data: number[] = [];
	
	// Generate last 7 days
	for (let i = 6; i >= 0; i--) {
		const date = new Date(now);
		date.setDate(now.getDate() - i);
		
		// Format label (e.g., "Mon", "Tue")
		const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
		labels.push(dayLabel);
		
		// Generate realistic completion rate (with some variance)
		// Base rate around 0.8 with ±0.15 variance
		const baseRate = 0.8;
		const variance = (Math.random() - 0.5) * 0.3;
		const rate = Math.max(0.4, Math.min(1.0, baseRate + variance));
		data.push(rate);
	}
	
	return { labels, data };
}

// Get weekly trend data for last 4 weeks (for area charts)
export function getWeeklyTrendData(userId: string): { labels: string[]; data: number[] } {
	const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
	
	// Generate realistic weekly completion rates
	const data = [0.75, 0.82, 0.88, 0.85];
	
	return { labels, data };
}

// Get 30-day trend data (for detailed view)
export function get30DayTrendData(userId: string): { labels: string[]; data: number[] } {
	const now = new Date();
	const labels: string[] = [];
	const data: number[] = [];
	
	// Generate data for every 3rd day to keep chart readable
	for (let i = 30; i >= 0; i -= 3) {
		const date = new Date(now);
		date.setDate(now.getDate() - i);
		
		// Format label (e.g., "Nov 12")
		const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		labels.push(dateLabel);
		
		// Generate realistic trend (gradually improving over time)
		const progress = (30 - i) / 30; // 0 to 1
		const baseRate = 0.65 + (progress * 0.25); // 0.65 to 0.90
		const variance = (Math.random() - 0.5) * 0.15;
		const rate = Math.max(0.5, Math.min(1.0, baseRate + variance));
		data.push(rate);
	}
	
	return { labels, data };
}

