<script lang="ts">
	import type { CoordinatedItem } from '$lib/data/items';
	import { getMemberName } from '$lib/data/household';
	import Broom from 'phosphor-svelte/lib/Broom';
	import { Card, Button } from 'm3-svelte';

	let { 
		item,
		onComplete
	} = $props<{ 
		item: CoordinatedItem;
		onComplete?: (id: string) => void;
	}>();
	
	// Format due date
	function formatDueDate(dueDate?: string): string {
		if (!dueDate) return '';
		const date = new Date(dueDate);
		const now = new Date();
		const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays === -1) return 'Yesterday';
		if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
		return `in ${diffDays} days`;
	}
	
	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'completed': return 'badge-complete';
			case 'overdue': return 'badge-overdue';
			default: return 'badge-pending';
		}
	}
	
	function handleComplete() {
		if (onComplete) {
			onComplete(item.id);
		}
	}
</script>

<div class="card-wrapper">
	<Card variant="filled">
		<div class="card-content">
			<div class="card-header">
				<div class="icon-title">
					<div class="icon-circle">
						<Broom size={24} weight="duotone" />
					</div>
					<div class="title-info">
						<h3 class="task-title m3-font-title-medium" class:completed={item.status === 'completed'}>
							{item.title}
						</h3>
						{#if item.metadata.location}
							<span class="location m3-font-body-small">📍 {item.metadata.location}</span>
						{/if}
					</div>
				</div>
				<span class="badge {getStatusBadgeClass(item.status)}">
					{item.status}
				</span>
			</div>
			
			<div class="card-details">
				{#if item.due_date}
					<span class="detail m3-font-body-medium">Due: {formatDueDate(item.due_date)}</span>
				{/if}
				{#if item.metadata.estimated_minutes}
					<span class="detail m3-font-body-medium">⏱ {item.metadata.estimated_minutes} min</span>
				{/if}
				{#if item.assigned_to && item.assigned_to.length > 0}
					<span class="detail m3-font-body-medium">👤 {getMemberName(item.assigned_to[0])}</span>
				{/if}
			</div>
			
			{#if item.status !== 'completed' && onComplete}
				<div class="card-actions">
					<Button variant="filled" onclick={handleComplete}>
						Mark Complete
					</Button>
				</div>
			{/if}
		</div>
	</Card>
</div>

<style>
	.card-wrapper {
		margin-bottom: var(--space-3);
	}

	/* Override M3 Card padding issues by using a content wrapper */
	.card-content {
		padding: var(--space-4);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-3);
		gap: var(--space-3);
	}
	
	.icon-title {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		flex: 1;
	}
	
	.icon-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgb(var(--m3-scheme-primary)), rgb(var(--m3-scheme-primary-container)));
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgb(var(--m3-scheme-on-primary));
		flex-shrink: 0;
	}
	
	.title-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	
	.task-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.task-title.completed {
		text-decoration: line-through;
		opacity: 0.6;
	}
	
	.location {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.badge {
		padding: var(--space-1) var(--space-3);
		border-radius: var(--m3-util-rounding-full);
		font-size: var(--text-xs); /* Keep custom size as it's specific to badge */
		font-weight: 500;
		font-family: var(--font-mono);
		text-transform: uppercase;
		white-space: nowrap;
	}
	
	.badge-pending {
		background-color: rgb(var(--m3-scheme-surface-variant));
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.badge-complete {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
	}
	
	.badge-overdue {
		background-color: rgb(var(--m3-scheme-error-container));
		color: rgb(var(--m3-scheme-on-error-container));
	}
	
	.card-details {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}
	
	.detail {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.card-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
	}
</style>

