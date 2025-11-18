<script lang="ts">
	import type { MonthAnalytics, GroupMonthAnalytics } from '$lib/data/analytics';
	import { getMemberName } from '$lib/data/household';
	import { get30DayTrendData } from '$lib/data/analytics';
	import CircularProgress from '$lib/components/CircularProgress.svelte';
	import GradientAreaChart from '$lib/components/Charts/GradientAreaChart.svelte';
	import GradientLineChart from '$lib/components/Charts/GradientLineChart.svelte';
	import SmoothBarChart from '$lib/components/Charts/SmoothBarChart.svelte';
	import { Icon, Card } from 'm3-svelte';
	import iconInsights from '@ktibow/iconset-material-symbols/insights';
	import iconTrendingUp from '@ktibow/iconset-material-symbols/trending-up';
	import iconChecklist from '@ktibow/iconset-material-symbols/checklist';
	import iconAttachMoney from '@ktibow/iconset-material-symbols/attach-money';
	import iconGroupWork from '@ktibow/iconset-material-symbols/group-work';
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
	
	// Calculate completion percentage
	const completionPercentage = $derived(Math.round(userData.completion_rate * 100));
	
	// Get 30-day trend data
	const trendData = get30DayTrendData(userId);
	
	// Prepare weekly breakdown data for chart
	const weeklyLabels = userData.weekly_breakdown.map((week: { week: number }) => `Week ${week.week}`);
	const weeklyData = userData.weekly_breakdown.map((week: { completion_rate: number }) => week.completion_rate);
	
	// Prepare tasks by type data for chart
	const taskTypeLabels = Object.keys(userData.tasks_by_type).map(type => 
		type.charAt(0).toUpperCase() + type.slice(1)
	);
	const taskTypeData = Object.values(userData.tasks_by_type).map((data: any) => data.completed);
	const maxTasksByType = Math.max(...taskTypeData, 1);
</script>

<div class="card-wrapper" transition:scale={{ duration: 200, start: 0.95 }}>
	<Card variant="filled">
		<div class="header">
			<h3 class="card-title m3-font-title-large">Last 30 Days</h3>
			<CircularProgress 
				value={completionPercentage} 
				size="medium"
				showLabel={true}
			/>
		</div>
		
		<!-- 30-Day Trend Overview -->
		<div class="chart-section primary">
			<h4 class="section-title">
				<Icon icon={iconTrendingUp} />
				<span>30-DAY TREND</span>
			</h4>
			<div class="chart-container">
				<GradientAreaChart 
					datasets={[{ data: trendData.data, label: 'Completion Rate', color: 'primary' }]}
					labels={trendData.labels}
					height={180}
					showPoints={false}
					showGrid={true}
					showLegend={false}
				/>
			</div>
		</div>
		
		<!-- Performance Summary -->
		<div class="section">
			<h4 class="section-title">
				<Icon icon={iconInsights} />
				<span>YOUR PERFORMANCE</span>
			</h4>
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-number m3-font-headline-medium">{userData.tasks_completed}</div>
					<div class="stat-label m3-font-body-small">of {userData.tasks_assigned} tasks</div>
				</div>
				<div class="stat-card">
					<div class="stat-number m3-font-headline-medium">
						{#if userData.avg_time_to_complete < 0}
							<span class="positive">-{Math.abs(userData.avg_time_to_complete).toFixed(1)}d</span>
						{:else if userData.avg_time_to_complete > 0}
							<span class="negative">+{userData.avg_time_to_complete.toFixed(1)}d</span>
						{:else}
							0d
						{/if}
					</div>
					<div class="stat-label m3-font-body-small">avg completion time</div>
				</div>
				<div class="stat-card">
					<div class="stat-number m3-font-headline-medium">{getConsistencyLabel(userData.completion_rate)}</div>
					<div class="stat-label m3-font-body-small">consistency</div>
				</div>
			</div>
		</div>
		
		<!-- Weekly Completion Chart -->
		{#if weeklyData.length > 0}
			<div class="chart-section">
				<h4 class="section-title">
					<Icon icon={iconTrendingUp} />
					<span>WEEKLY BREAKDOWN</span>
				</h4>
				<div class="chart-container">
					<GradientLineChart 
						data={weeklyData}
						labels={weeklyLabels}
						height={160}
						gradientColor="secondary"
						showPoints={true}
						showGrid={true}
					/>
				</div>
			</div>
		{/if}
		
		<!-- Tasks by Type -->
		{#if taskTypeData.length > 0}
			<div class="chart-section">
				<h4 class="section-title">
					<Icon icon={iconChecklist} />
					<span>TASKS BY TYPE</span>
				</h4>
				<div class="chart-container">
					<SmoothBarChart 
						data={taskTypeData}
						labels={taskTypeLabels}
						height={200}
						gradientColor="tertiary"
						horizontal={true}
						showGrid={true}
						max={maxTasksByType}
					/>
				</div>
			</div>
		{/if}
	
	<!-- Expenses -->
	<div class="section">
		<h4 class="section-title">
			<Icon icon={iconAttachMoney} />
			<span>EXPENSES</span>
		</h4>
		<ul class="stat-list">
			<li class="stat-item">
				<span class="stat-label">Paid:</span>
				<span class="stat-value highlight">{formatCurrency(userData.expenses.paid_amount)} 
					<span class="muted-inline">({userData.expenses.paid_count} {userData.expenses.paid_count === 1 ? 'item' : 'items'})</span>
				</span>
			</li>
			{#if userData.expenses.owed_amount > 0}
				<li class="stat-item">
					<span class="stat-label">Owed:</span>
					<span class="stat-value">{formatCurrency(userData.expenses.owed_amount)} 
						{#if userData.expenses.owed_to}
							<span class="muted-inline">to {getMemberName(userData.expenses.owed_to)}</span>
						{/if}
					</span>
				</li>
			{/if}
		</ul>
	</div>
	
	<!-- Group Comparison -->
	<div class="section">
		<h4 class="section-title">
			<Icon icon={iconGroupWork} />
			<span>GROUP COMPARISON</span>
		</h4>
		<div class="comparison-bar">
			<span class="comparison-item">
				<strong>You:</strong> <span class="highlight">{Math.round(userData.completion_rate * 100)}%</span>
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
	</Card>
</div>

<style>
	.card-wrapper {
		max-width: 480px;
		width: 95%;
		margin: var(--space-4) 0;
		max-height: 80vh;
		overflow-y: auto;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-5);
	}
	
	.card-title {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin: 0;
	}
	
	/* Chart sections */
	.chart-section {
		margin-bottom: var(--space-5);
		padding: var(--space-4);
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: var(--m3-util-rounding-large);
	}
	
	.chart-section.primary {
		background-color: rgba(var(--m3-scheme-primary), 0.05);
	}
	
	.chart-container {
		margin-top: var(--space-3);
	}
	
	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: var(--space-3);
	}
	
	.stat-card {
		padding: var(--space-3);
		background-color: rgb(var(--m3-scheme-surface-container));
		border-radius: var(--m3-util-rounding-medium);
		text-align: center;
	}
	
	.stat-number {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin-bottom: 0.25rem;
	}
	
	.stat-label {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
	}
	
	.section {
		margin-bottom: var(--space-5);
	}
	
	.section:last-of-type {
		margin-bottom: 0;
	}
	
	.section-title {
		font-size: 0.75rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin: 0 0 var(--space-3) 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.section-title :global(.icon) {
		font-size: 1rem;
	}
	
	.stat-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}
	
	.stat-item {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		line-height: 1.5;
		display: flex;
		justify-content: space-between;
		gap: var(--space-2);
		align-items: baseline;
	}
	
	.stat-label {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.stat-value {
		font-family: var(--font-mono);
		font-weight: 500;
		text-align: right;
	}
	
	.highlight {
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-primary));
	}
	
	.positive {
		color: rgb(var(--m3-scheme-tertiary));
	}
	
	.negative {
		color: rgb(var(--m3-scheme-error));
	}
	
	.muted-inline {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.8125rem;
		font-family: var(--font-sans);
		font-weight: 400;
	}
	
	.comparison-bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: linear-gradient(135deg, rgba(var(--m3-scheme-primary), 0.04) 0%, rgba(var(--m3-scheme-tertiary), 0.04) 100%);
		border-radius: var(--m3-util-rounding-medium);
		font-size: 0.875rem;
		font-family: var(--font-mono);
		color: rgb(var(--m3-scheme-on-surface));
		flex-wrap: wrap;
	}
	
	.comparison-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
	
	.comparison-item strong {
		font-weight: 600;
		font-family: var(--font-sans);
	}
	
	.divider {
		color: rgb(var(--m3-scheme-outline));
	}
	
	.comparison-note {
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
		margin: var(--space-2) 0 0 0;
		line-height: 1.5;
	}
	
	/* Scrollbar styling for card */
	.card-wrapper::-webkit-scrollbar {
		width: 6px;
	}
	
	.card-wrapper::-webkit-scrollbar-track {
		background: rgb(var(--m3-scheme-surface-container));
		border-radius: 3px;
	}
	
	.card-wrapper::-webkit-scrollbar-thumb {
		background: rgb(var(--m3-scheme-outline));
		border-radius: 3px;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.card-wrapper {
			width: 98%;
			max-height: 75vh;
		}
		
		.header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
		
		.card-title {
			font-size: 1rem;
		}
		
		.section-title {
			font-size: 0.6875rem;
		}
		
		.stat-item,
		.comparison-bar {
			font-size: 0.8125rem;
		}
		
		.highlight {
			font-size: 1rem;
		}
		
		.comparison-bar {
			gap: var(--space-2);
			padding: var(--space-2);
		}
		
		.comparison-item {
			font-size: 0.75rem;
		}
	}
</style>

