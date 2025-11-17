<script lang="ts">
	import type { CoordinatedItem } from '$lib/data/items';
	import { getMemberName } from '$lib/data/household';
	import Broom from 'phosphor-svelte/lib/Broom';
	
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

<div class="task-card">
	<div class="card-header">
		<div class="icon-title">
			<div class="icon-circle">
				<Broom size={24} weight="duotone" />
			</div>
			<div class="title-info">
				<h3 class="task-title" class:completed={item.status === 'completed'}>
					{item.title}
				</h3>
				{#if item.metadata.location}
					<span class="location">📍 {item.metadata.location}</span>
				{/if}
			</div>
		</div>
		<span class="badge {getStatusBadgeClass(item.status)}">
			{item.status}
		</span>
	</div>
	
	<div class="card-details">
		{#if item.due_date}
			<span class="detail">Due: {formatDueDate(item.due_date)}</span>
		{/if}
		{#if item.metadata.estimated_minutes}
			<span class="detail">⏱ {item.metadata.estimated_minutes} min</span>
		{/if}
		{#if item.assigned_to && item.assigned_to.length > 0}
			<span class="detail">👤 {getMemberName(item.assigned_to[0])}</span>
		{/if}
	</div>
	
	{#if item.status !== 'completed' && onComplete}
		<div class="card-actions">
			<button class="action-btn primary" onclick={handleComplete}>
				Mark Complete
			</button>
		</div>
	{/if}
</div>

<style>
	.task-card {
		background-color: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		box-shadow: var(--card-shadow);
		transition: all var(--transition-base);
		margin-bottom: var(--space-3);
	}
	
	.task-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
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
		background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		flex-shrink: 0;
	}
	
	.title-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	
	.task-title {
		font-size: var(--text-md);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		margin: 0;
		font-family: var(--font-sans);
	}
	
	.task-title.completed {
		text-decoration: line-through;
		opacity: 0.6;
	}
	
	.location {
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
	
	.badge {
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		font-family: var(--font-mono);
		text-transform: uppercase;
		white-space: nowrap;
	}
	
	.badge-pending {
		background-color: var(--status-pending-bg);
		color: var(--status-pending-text);
	}
	
	.badge-complete {
		background-color: var(--status-complete-bg);
		color: var(--status-complete-text);
	}
	
	.badge-overdue {
		background-color: var(--status-overdue-bg);
		color: var(--status-overdue-text);
	}
	
	.card-details {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}
	
	.detail {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		font-family: var(--font-sans);
	}
	
	.card-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid var(--border-primary);
	}
	
	.action-btn {
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		font-family: var(--font-sans);
		border: 1px solid transparent;
		cursor: pointer;
		transition: all var(--transition-base);
	}
	
	.action-btn.primary {
		background-color: var(--accent);
		color: var(--text-on-accent);
		border-color: var(--accent);
	}
	
	.action-btn:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}
	
	.action-btn:active {
		transform: scale(0.95);
	}
</style>

