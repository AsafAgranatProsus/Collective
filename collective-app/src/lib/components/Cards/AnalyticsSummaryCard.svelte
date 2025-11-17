<script lang="ts">
	import type { WeekAnalytics, GroupWeekAnalytics, AllUsersAnalytics } from '$lib/data/analytics';
	import { members, getMemberName } from '$lib/data/household';
	import { fade, scale } from 'svelte/transition';
	
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
</script>

<div class="analytics-summary-card" transition:scale={{ duration: 200, start: 0.95 }}>
	<h3 class="card-title">This Week</h3>
	
	<!-- User's completion -->
	<div class="section">
		<h4 class="section-title">You completed:</h4>
		<ul class="stat-list">
			<li class="stat-item">
				<span class="checkmark">✓</span>
				{userData.tasks_completed} of {userData.tasks_assigned} tasks
			</li>
			{#if userData.all_on_time}
				<li class="stat-item">
					<span class="checkmark">✓</span>
					All on time
				</li>
			{:else if userData.tasks_completed > 0}
				<li class="stat-item muted">
					Some completed late
				</li>
			{/if}
		</ul>
	</div>
	
	<!-- Group status -->
	<div class="section">
		<h4 class="section-title">Group status:</h4>
		<ul class="stat-list">
			{#each members as member}
				{@const memberData = allUsers[member.id].week}
				<li class="stat-item">
					{#if memberData.completion_rate === 1.0}
						<span class="checkmark">✓</span>
					{/if}
					<span class="member-name">{member.name}:</span>
					{memberData.tasks_completed}/{memberData.tasks_assigned}
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
</div>

<style>
	.analytics-summary-card {
		background-color: #FFFFFF;
		border: 1px solid #E5E7EB;
		border-radius: 12px;
		padding: 20px;
		max-width: 400px;
		width: 90%;
		margin: var(--space-3) 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}
	
	:global(html[data-mode='dark']) .analytics-summary-card {
		background-color: #1A1A1A;
		border-color: #333333;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
	
	.card-title {
		font-size: 16px;
		font-weight: 600;
		color: #1F2937;
		font-family: var(--font-sans);
		margin: 0 0 var(--space-4) 0;
	}
	
	:global(html[data-mode='dark']) .card-title {
		color: #F8F9FA;
	}
	
	.section {
		margin-bottom: var(--space-4);
	}
	
	.section:last-of-type {
		margin-bottom: var(--space-3);
	}
	
	.section-title {
		font-size: 14px;
		font-weight: 500;
		color: #1F2937;
		font-family: var(--font-sans);
		margin: 0 0 var(--space-2) 0;
	}
	
	:global(html[data-mode='dark']) .section-title {
		color: #F8F9FA;
	}
	
	.stat-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.stat-item {
		font-size: 14px;
		color: #1F2937;
		font-family: var(--font-sans);
		line-height: 1.5;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	
	:global(html[data-mode='dark']) .stat-item {
		color: #E5E7EB;
	}
	
	.checkmark {
		color: #10B981;
		font-weight: bold;
		font-size: 16px;
		flex-shrink: 0;
	}
	
	.member-name {
		font-weight: 500;
	}
	
	.muted {
		color: #6B7280;
		font-size: 13px;
	}
	
	:global(html[data-mode='dark']) .muted {
		color: #9CA3AF;
	}
	
	.summary {
		font-size: 14px;
		color: #1F2937;
		font-family: var(--font-sans);
		padding-top: var(--space-3);
		border-top: 1px solid #F3F4F6;
	}
	
	:global(html[data-mode='dark']) .summary {
		color: #E5E7EB;
		border-top-color: #333333;
	}
	
	.summary strong {
		font-weight: 600;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.analytics-summary-card {
			width: 95%;
			padding: 16px;
		}
		
		.card-title {
			font-size: 15px;
		}
		
		.section-title,
		.stat-item,
		.summary {
			font-size: 13px;
		}
	}
</style>

