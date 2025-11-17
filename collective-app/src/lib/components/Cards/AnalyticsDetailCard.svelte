<script lang="ts">
	import type { MonthAnalytics, GroupMonthAnalytics } from '$lib/data/analytics';
	import { getMemberName } from '$lib/data/household';
	import SimpleBarChart from './SimpleBarChart.svelte';
	import { scale } from 'svelte/transition';
	
	let {
		userId,
		userData,
		groupData
	} = $props<{
		userId: string;
		userData: MonthAnalytics;
		groupData: GroupMonthAnalytics;
	}>();
	
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
	
	function getConsistencyLabel(rate: number): string {
		if (rate >= 0.95) return 'Very High';
		if (rate >= 0.85) return 'High';
		if (rate >= 0.75) return 'Good';
		if (rate >= 0.60) return 'Fair';
		return 'Low';
	}
	
	// Prepare weekly breakdown data for chart
	const weeklyData = userData.weekly_breakdown.map((week: { week: number; completion_rate: number }) => ({
		label: `Week ${week.week}`,
		value: week.completion_rate
	}));
	
	// Prepare tasks by type data for chart
	const tasksByTypeData = Object.entries(userData.tasks_by_type).map(([type, data]) => ({
		label: type.charAt(0).toUpperCase() + type.slice(1),
		value: (data as { completed: number; assigned: number }).completed
	}));
	
	const maxTasksByType = Math.max(...tasksByTypeData.map(d => d.value), 1);
</script>

<div class="analytics-detail-card" transition:scale={{ duration: 200, start: 0.95 }}>
	<h3 class="card-title">Last 30 Days</h3>
	
	<!-- Performance Summary -->
	<div class="section">
		<h4 class="section-title">YOUR PERFORMANCE</h4>
		<ul class="stat-list">
			<li class="stat-item">
				<span class="stat-label">Tasks completed:</span>
				<span class="stat-value">{userData.tasks_completed} of {userData.tasks_assigned} 
					<span class="percentage">({Math.round(userData.completion_rate * 100)}%)</span>
				</span>
			</li>
			<li class="stat-item">
				<span class="stat-label">Average time-to-completion:</span>
				<span class="stat-value">
					{#if userData.avg_time_to_complete < 0}
						{Math.abs(userData.avg_time_to_complete).toFixed(1)} days early
					{:else if userData.avg_time_to_complete > 0}
						{userData.avg_time_to_complete.toFixed(1)} days late
					{:else}
						On time
					{/if}
				</span>
			</li>
			<li class="stat-item">
				<span class="stat-label">Consistency:</span>
				<span class="stat-value">{getConsistencyLabel(userData.completion_rate)}</span>
			</li>
		</ul>
	</div>
	
	<!-- Weekly Completion Chart -->
	{#if weeklyData.length > 0}
		<div class="section">
			<h4 class="section-title">WEEKLY COMPLETION</h4>
			<div class="chart-container">
				<SimpleBarChart data={weeklyData} max={1.0} />
			</div>
		</div>
	{/if}
	
	<!-- Tasks by Type -->
	{#if tasksByTypeData.length > 0}
		<div class="section">
			<h4 class="section-title">TASKS BY TYPE</h4>
			<div class="chart-container">
				<SimpleBarChart data={tasksByTypeData} max={maxTasksByType} />
			</div>
		</div>
	{/if}
	
	<!-- Expenses -->
	<div class="section">
		<h4 class="section-title">EXPENSES</h4>
		<ul class="stat-list">
			<li class="stat-item">
				<span class="stat-label">Paid:</span>
				<span class="stat-value">{formatCurrency(userData.expenses.paid_amount)} 
					<span class="muted">({userData.expenses.paid_count} {userData.expenses.paid_count === 1 ? 'item' : 'items'})</span>
				</span>
			</li>
			{#if userData.expenses.owed_amount > 0}
				<li class="stat-item">
					<span class="stat-label">Owed:</span>
					<span class="stat-value">{formatCurrency(userData.expenses.owed_amount)} 
						{#if userData.expenses.owed_to}
							<span class="muted">to {getMemberName(userData.expenses.owed_to)}</span>
						{/if}
					</span>
				</li>
			{/if}
		</ul>
	</div>
	
	<!-- Group Comparison -->
	<div class="section">
		<h4 class="section-title">GROUP COMPARISON</h4>
		<div class="comparison-bar">
			<span class="comparison-item">
				<strong>You:</strong> {Math.round(userData.completion_rate * 100)}%
			</span>
			<span class="divider">|</span>
			<span class="comparison-item">
				<strong>Avg:</strong> {Math.round(groupData.avg_completion_rate * 100)}%
			</span>
			<span class="divider">|</span>
			<span class="comparison-item">
				<strong>Range:</strong> {Math.round(groupData.range.min * 100)}-{Math.round(groupData.range.max * 100)}%
			</span>
		</div>
		<p class="comparison-note">
			{#if userData.completion_rate >= groupData.avg_completion_rate}
				You're {userData.completion_rate > groupData.avg_completion_rate ? 'above' : 'at'} average for the household.
			{:else}
				You're slightly below average, but no major issues.
			{/if}
		</p>
	</div>
</div>

<style>
	.analytics-detail-card {
		background-color: #FFFFFF;
		border: 1px solid #E5E7EB;
		border-radius: 12px;
		padding: 24px;
		max-width: 450px;
		width: 95%;
		margin: var(--space-3) 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		max-height: 80vh;
		overflow-y: auto;
	}
	
	:global(html[data-mode='dark']) .analytics-detail-card {
		background-color: #1A1A1A;
		border-color: #333333;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
	
	.card-title {
		font-size: 16px;
		font-weight: 600;
		color: #1F2937;
		font-family: var(--font-sans);
		margin: 0 0 var(--space-5) 0;
	}
	
	:global(html[data-mode='dark']) .card-title {
		color: #F8F9FA;
	}
	
	.section {
		margin-bottom: var(--space-5);
	}
	
	.section:last-of-type {
		margin-bottom: 0;
	}
	
	.section-title {
		font-size: 12px;
		font-weight: 600;
		color: #6B7280;
		font-family: var(--font-sans);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin: 0 0 var(--space-3) 0;
	}
	
	:global(html[data-mode='dark']) .section-title {
		color: #9CA3AF;
	}
	
	.stat-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.stat-item {
		font-size: 14px;
		color: #1F2937;
		font-family: var(--font-sans);
		line-height: 1.5;
		display: flex;
		justify-content: space-between;
		gap: var(--space-2);
	}
	
	:global(html[data-mode='dark']) .stat-item {
		color: #E5E7EB;
	}
	
	.stat-label {
		color: #6B7280;
	}
	
	:global(html[data-mode='dark']) .stat-label {
		color: #9CA3AF;
	}
	
	.stat-value {
		font-family: var(--font-mono);
		font-weight: 500;
		text-align: right;
	}
	
	.percentage {
		color: #6B7280;
		font-family: var(--font-sans);
	}
	
	:global(html[data-mode='dark']) .percentage {
		color: #9CA3AF;
	}
	
	.muted {
		color: #6B7280;
		font-size: 13px;
		font-family: var(--font-sans);
	}
	
	:global(html[data-mode='dark']) .muted {
		color: #9CA3AF;
	}
	
	.chart-container {
		padding: var(--space-2) 0;
	}
	
	.comparison-bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background-color: #F9FAFB;
		border-radius: 8px;
		font-size: 14px;
		font-family: var(--font-mono);
		color: #1F2937;
		flex-wrap: wrap;
	}
	
	:global(html[data-mode='dark']) .comparison-bar {
		background-color: #0A0A0A;
		color: #E5E7EB;
	}
	
	.comparison-item {
		display: flex;
		gap: var(--space-1);
	}
	
	.comparison-item strong {
		font-weight: 600;
		font-family: var(--font-sans);
	}
	
	.divider {
		color: #D1D5DB;
	}
	
	:global(html[data-mode='dark']) .divider {
		color: #4B5563;
	}
	
	.comparison-note {
		font-size: 13px;
		color: #6B7280;
		font-family: var(--font-sans);
		margin: var(--space-2) 0 0 0;
		line-height: 1.5;
	}
	
	:global(html[data-mode='dark']) .comparison-note {
		color: #9CA3AF;
	}
	
	/* Scrollbar styling for card */
	.analytics-detail-card::-webkit-scrollbar {
		width: 6px;
	}
	
	.analytics-detail-card::-webkit-scrollbar-track {
		background: #F3F4F6;
		border-radius: 3px;
	}
	
	:global(html[data-mode='dark']) .analytics-detail-card::-webkit-scrollbar-track {
		background: #1F2937;
	}
	
	.analytics-detail-card::-webkit-scrollbar-thumb {
		background: #D1D5DB;
		border-radius: 3px;
	}
	
	:global(html[data-mode='dark']) .analytics-detail-card::-webkit-scrollbar-thumb {
		background: #4B5563;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.analytics-detail-card {
			width: 98%;
			padding: 20px;
			max-height: 75vh;
		}
		
		.card-title {
			font-size: 15px;
		}
		
		.section-title {
			font-size: 11px;
		}
		
		.stat-item,
		.comparison-bar {
			font-size: 13px;
		}
		
		.comparison-bar {
			gap: var(--space-2);
			padding: var(--space-2);
		}
		
		.comparison-item {
			font-size: 12px;
		}
	}
</style>

