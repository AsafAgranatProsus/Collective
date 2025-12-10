<script lang="ts">
	import type { WeekAnalytics, GroupWeekAnalytics, AllUsersAnalytics } from '$lib/data/analytics';
	import { members, getMemberName } from '$lib/data/household';
	import { getDailyTrendData } from '$lib/data/analytics';
	import { fade, scale } from 'svelte/transition';
	import { Card } from 'm3-svelte';
	import CircularProgress from '$lib/components/CircularProgress.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import GradientLineChart from '$lib/components/Charts/GradientLineChart.svelte';
	
	let {
		userId,
		userData,
		groupData,
		allUsers
	} = $props<{
		userId: string;
		userData: WeekAnalytics;
		groupData: GroupWeekAnalytics;
		allUsers: AllUsersAnalytics;
	}>();
	
	const userName = getMemberName(userId);
	
	// Calculate completion percentage
	const completionPercentage = $derived(
		userData.tasks_assigned > 0 
			? Math.round((userData.tasks_completed / userData.tasks_assigned) * 100) 
			: 0
	);
	
	// Determine user status
	const userStatus = $derived(userData.completion_rate === 1.0 && userData.all_on_time ? 'success' : 'warning');
	
	// Get trend data for chart
	const trendData = getDailyTrendData(userId);
</script>

<!-- Horizontal Carousel for Analytics -->
<div class="analytics-carousel-wrapper">
	<div class="analytics-carousel">
		<!-- Card 1: Your Progress -->
		<div class="carousel-item">
			<Card variant="filled">
				<h4 class="card-label">Your Progress</h4>
				<div class="progress-section">
					<CircularProgress 
						value={completionPercentage} 
						size="large"
						showLabel={true}
					/>
					<div class="progress-text">
						<div class="completion-number">{userData.tasks_completed}<span class="of-total"> of {userData.tasks_assigned}</span></div>
						<div class="completion-label">tasks completed</div>
					</div>
				</div>
				{#if userData.all_on_time}
					<div class="status-badge-row">
						<StatusBadge type="success" size="small" />
						<span class="status-text">All completed on time</span>
					</div>
				{:else if userData.tasks_completed > 0}
					<div class="status-badge-row">
						<StatusBadge type="warning" size="small" />
						<span class="status-text">Some completed late</span>
					</div>
				{/if}
			</Card>
		</div>

		<!-- Card 2: 7-Day Trend -->
		<div class="carousel-item">
			<Card variant="filled">
				<h4 class="card-label">7-Day Trend</h4>
				<div class="chart-container">
					<GradientLineChart 
						data={trendData.data}
						labels={trendData.labels}
						height={180}
						gradientColor={userStatus === 'success' ? 'tertiary' : 'primary'}
						showPoints={true}
						showGrid={false}
					/>
				</div>
			</Card>
		</div>

		<!-- Card 3: Group Status -->
		<div class="carousel-item">
			<Card variant="filled">
				<h4 class="card-label">Group Status</h4>
				<ul class="stat-list">
					{#each members as member}
						{@const memberData = allUsers[member.id].week}
						<li class="stat-item">
							{#if memberData.completion_rate === 1.0}
								<StatusBadge type="success" size="small" />
							{:else if memberData.completion_rate > 0}
								<StatusBadge type="warning" size="small" />
							{:else}
								<StatusBadge type="info" size="small" />
							{/if}
							<span class="member-name">{member.name}:</span>
							<span class="member-stats">{memberData.tasks_completed}/{memberData.tasks_assigned}</span>
							{#if memberData.completion_rate < 1.0 && memberData.completion_rate > 0}
								<span class="muted">(catching up)</span>
							{/if}
						</li>
					{/each}
				</ul>
				<div class="summary">
					<strong>Overall:</strong> Group is {groupData.status === 'balanced' ? 'balanced' : 'catching up'}
				</div>
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
		width: 300px;
	}
	
	.carousel-item :global(.card) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.card-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin: 0 0 var(--space-4) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	/* Progress section with circular indicator */
	.progress-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: var(--space-4);
		padding: var(--space-4);
		background-color: rgba(var(--m3-scheme-primary), 0.05);
		border-radius: var(--m3-util-rounding-large);
	}
	
	.progress-text {
		text-align: center;
	}
	
	.completion-number {
		font-size: 2rem;
		font-weight: 700;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		line-height: 1;
		margin-bottom: 0.5rem;
	}
	
	.of-total {
		font-size: 1.125rem;
		font-weight: 400;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.completion-label {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
	}
	
	.status-badge-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: var(--space-3);
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: var(--m3-util-rounding-medium);
	}
	
	.status-text {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
	}
	
	/* Chart container */
	.chart-container {
		padding: var(--space-4);
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: var(--m3-util-rounding-large);
	}
	
	.stat-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-4) 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.stat-item {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		line-height: 1.5;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.member-name {
		font-weight: 500;
	}
	
	.member-stats {
		font-family: var(--font-mono);
		font-weight: 500;
		margin-left: auto;
	}
	
	.muted {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.8125rem;
		font-style: italic;
	}
	
	.summary {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		padding-top: var(--space-3);
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
	}
	
	.summary strong {
		font-weight: 600;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.carousel-item {
			width: 280px;
		}
		
		.completion-number {
			font-size: 1.75rem;
		}
		
		.of-total {
			font-size: 1rem;
		}
	}
</style>


