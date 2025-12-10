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

<!-- Horizontal Carousel for Detailed Analytics -->
<div class="analytics-carousel-wrapper">
	<div class="analytics-carousel">
		<!-- Card 1: 30-Day Overview + Performance -->
		<div class="carousel-item">
			<Card variant="filled">
				<div class="header">
					<h4 class="card-label">Last 30 Days</h4>
					<CircularProgress 
						value={completionPercentage} 
						size="medium"
						showLabel={true}
					/>
				</div>
				
				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-number">{userData.tasks_completed}</div>
						<div class="stat-label">of {userData.tasks_assigned} tasks</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">
							{#if userData.avg_time_to_complete < 0}
								<span class="positive">-{Math.abs(userData.avg_time_to_complete).toFixed(1)}d</span>
							{:else if userData.avg_time_to_complete > 0}
								<span class="negative">+{userData.avg_time_to_complete.toFixed(1)}d</span>
							{:else}
								0d
							{/if}
						</div>
						<div class="stat-label">avg time</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">{getConsistencyLabel(userData.completion_rate)}</div>
						<div class="stat-label">consistency</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Card 2: 30-Day Trend -->
		<div class="carousel-item">
			<Card variant="filled">
				<h4 class="card-label">
					<Icon icon={iconTrendingUp} />
					<span>30-Day Trend</span>
				</h4>
				<div class="chart-section">
					<GradientAreaChart 
						datasets={[{ data: trendData.data, label: 'Completion Rate', color: 'primary' }]}
						labels={trendData.labels}
						height={180}
						showPoints={false}
						showGrid={true}
						showLegend={false}
					/>
				</div>
			</Card>
		</div>

		<!-- Card 3: Weekly Breakdown -->
		{#if weeklyData.length > 0}
			<div class="carousel-item">
				<Card variant="filled">
					<h4 class="card-label">
						<Icon icon={iconTrendingUp} />
						<span>Weekly Breakdown</span>
					</h4>
					<div class="chart-section">
						<GradientLineChart 
							data={weeklyData}
							labels={weeklyLabels}
							height={180}
							gradientColor="secondary"
							showPoints={true}
							showGrid={true}
						/>
					</div>
				</Card>
			</div>
		{/if}

		<!-- Card 4: Tasks by Type -->
		{#if taskTypeData.length > 0}
			<div class="carousel-item">
				<Card variant="filled">
					<h4 class="card-label">
						<Icon icon={iconChecklist} />
						<span>Tasks by Type</span>
					</h4>
					<div class="chart-section">
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
				</Card>
			</div>
		{/if}

		<!-- Card 5: Expenses -->
		<div class="carousel-item">
			<Card variant="filled">
				<h4 class="card-label">
					<Icon icon={iconAttachMoney} />
					<span>Expenses</span>
				</h4>
				<ul class="stat-list">
					<li class="stat-item">
						<span class="stat-label-text">Paid:</span>
						<span class="stat-value highlight">{formatCurrency(userData.expenses.paid_amount)}</span>
					</li>
					<li class="stat-item-small">
						<span class="muted-inline">{userData.expenses.paid_count} {userData.expenses.paid_count === 1 ? 'item' : 'items'}</span>
					</li>
					{#if userData.expenses.owed_amount > 0}
						<li class="stat-item">
							<span class="stat-label-text">Owed:</span>
							<span class="stat-value">{formatCurrency(userData.expenses.owed_amount)}</span>
						</li>
						{#if userData.expenses.owed_to}
							<li class="stat-item-small">
								<span class="muted-inline">to {getMemberName(userData.expenses.owed_to)}</span>
							</li>
						{/if}
					{/if}
				</ul>
			</Card>
		</div>

		<!-- Card 6: Group Comparison -->
		<div class="carousel-item">
			<Card variant="filled">
				<h4 class="card-label">
					<Icon icon={iconGroupWork} />
					<span>Group Comparison</span>
				</h4>
				<div class="comparison-grid">
					<div class="comparison-item">
						<strong>You</strong>
						<span class="highlight">{Math.round(userData.completion_rate * 100)}%</span>
					</div>
					<div class="comparison-item">
						<strong>Avg</strong>
						<span>{Math.round(groupData.avg_completion_rate * 100)}%</span>
					</div>
					<div class="comparison-item">
						<strong>Range</strong>
						<span>{Math.round(groupData.range.min * 100)}-{Math.round(groupData.range.max * 100)}%</span>
					</div>
				</div>
				<p class="comparison-note">
					{#if userData.completion_rate >= groupData.avg_completion_rate}
						You're {userData.completion_rate > groupData.avg_completion_rate ? 'above' : 'at'} average for the household.
					{:else}
						You're slightly below average, but no major issues.
					{/if}
				</p>
			</Card>
		</div>
	</div>
</div>

<style>
	.analytics-carousel-wrapper {
		width: 100%;
		margin: var(--space-4) 0;
	}
	
	.analytics-carousel {
		display: flex;
		gap: var(--space-3);
		overflow-x: auto;
		overflow-y: visible;
		padding: var(--space-2) 0;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		
		/* Hide scrollbar but keep functionality */
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	
	.analytics-carousel::-webkit-scrollbar {
		display: none;
	}
	
	.carousel-item {
		flex-shrink: 0;
		width: 320px;
	}
	
	.carousel-item :global(.card) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}
	
	.card-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin: 0 0 var(--space-4) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.card-label :global(.icon) {
		font-size: 1rem;
	}
	
	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-3);
	}
	
	.stat-card {
		padding: var(--space-3);
		background-color: rgb(var(--m3-scheme-surface-container));
		border-radius: var(--m3-util-rounding-medium);
		text-align: center;
	}
	
	.stat-number {
		font-size: 1.5rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin-bottom: 0.25rem;
	}
	
	.stat-label {
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
	}
	
	/* Chart sections */
	.chart-section {
		padding: var(--space-4);
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: var(--m3-util-rounding-large);
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
	
	.stat-item-small {
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		padding-left: var(--space-2);
	}
	
	.stat-label-text {
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
	
	/* Comparison grid */
	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
		padding: var(--space-3);
		background: linear-gradient(135deg, rgba(var(--m3-scheme-primary), 0.04) 0%, rgba(var(--m3-scheme-tertiary), 0.04) 100%);
		border-radius: var(--m3-util-rounding-medium);
		margin-bottom: var(--space-3);
	}
	
	.comparison-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}
	
	.comparison-item strong {
		font-size: 0.75rem;
		font-weight: 600;
		font-family: var(--font-sans);
		color: rgb(var(--m3-scheme-on-surface-variant));
		text-transform: uppercase;
	}
	
	.comparison-item span {
		font-size: 1.25rem;
		font-weight: 600;
		font-family: var(--font-mono);
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.comparison-note {
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
		margin: 0;
		line-height: 1.5;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.carousel-item {
			width: 300px;
		}
		
		.stat-number {
			font-size: 1.25rem;
		}
		
		.comparison-item span {
			font-size: 1.125rem;
		}
	}
</style>


