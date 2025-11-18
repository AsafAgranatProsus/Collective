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

<div class="card-wrapper" class:success={userStatus === 'success'} transition:scale={{ duration: 200, start: 0.95 }}>
	<Card variant="filled">
		<h3 class="card-title">This Week</h3>
	
	<!-- Circular progress indicator -->
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
	
	<!-- Week Trend Chart -->
	<div class="chart-section">
		<h4 class="section-title">7-Day Trend</h4>
		<div class="chart-container">
			<GradientLineChart 
				data={trendData.data}
				labels={trendData.labels}
				height={140}
				gradientColor={userStatus === 'success' ? 'tertiary' : 'primary'}
				showPoints={true}
				showGrid={false}
			/>
		</div>
	</div>
	
	<!-- User's completion status -->
	<div class="section">
		<ul class="stat-list">
			{#if userData.all_on_time}
				<li class="stat-item">
					<StatusBadge type="success" size="small" />
					<span>All completed on time</span>
				</li>
			{:else if userData.tasks_completed > 0}
				<li class="stat-item">
					<StatusBadge type="warning" size="small" />
					<span>Some completed late</span>
				</li>
			{/if}
		</ul>
	</div>
	
	<!-- Group status -->
	<div class="section">
		<h4 class="section-title">Group Status</h4>
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
	</div>
	
		<!-- Overall summary -->
		<div class="summary">
			<strong>Overall:</strong> Group is {groupData.status === 'balanced' ? 'balanced' : 'catching up'}
		</div>
	</Card>
</div>

<style>
	.card-wrapper {
		max-width: 420px;
		width: 90%;
		margin: var(--space-4) 0;
	}
	
	.card-wrapper :global(.card) {
		transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	/* Success tint for users who completed everything on time */
	.card-wrapper.success :global(.card) {
		background-color: rgba(var(--m3-scheme-tertiary), 0.08);
		background-blend-mode: overlay;
	}
	
	.card-title {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin: 0 0 var(--space-5) 0;
	}
	
	/* Progress section with circular indicator */
	.progress-section {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: var(--space-5);
		padding: var(--space-4);
		background-color: rgba(var(--m3-scheme-primary), 0.05);
		border-radius: var(--m3-util-rounding-large);
	}
	
	.progress-text {
		flex: 1;
	}
	
	.completion-number {
		font-size: 2.25rem;
		font-weight: 700;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		line-height: 1;
		margin-bottom: 0.5rem;
	}
	
	.of-total {
		font-size: 1.25rem;
		font-weight: 400;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.completion-label {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
	}
	
	/* Chart section */
	.chart-section {
		margin-bottom: var(--space-5);
		padding: var(--space-4);
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: var(--m3-util-rounding-large);
	}
	
	.chart-container {
		margin-top: var(--space-3);
	}
	
	.section {
		margin-bottom: var(--space-5);
	}
	
	.section:last-of-type {
		margin-bottom: var(--space-3);
	}
	
	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.stat-list {
		list-style: none;
		padding: 0;
		margin: 0;
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
		.card-wrapper {
			width: 95%;
		}
		
		.progress-section {
			flex-direction: column;
			text-align: center;
		}
		
		.card-title {
			font-size: 1rem;
		}
		
		.completion-number {
			font-size: 1.75rem;
		}
		
		.of-total {
			font-size: 1.125rem;
		}
		
		.section-title,
		.stat-item,
		.summary {
			font-size: 0.8125rem;
		}
	}
</style>

