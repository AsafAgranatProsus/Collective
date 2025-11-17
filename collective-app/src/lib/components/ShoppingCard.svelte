<script lang="ts">
	import type { CoordinatedItem } from '$lib/data/items';
	import { getMemberName } from '$lib/data/household';
	import ShoppingCart from 'phosphor-svelte/lib/ShoppingCart';
	
	let { item } = $props<{ item: CoordinatedItem }>();
	
	function getUrgencyClass(urgency?: string): string {
		switch (urgency) {
			case 'high': return 'urgency-high';
			case 'medium': return 'urgency-medium';
			case 'low': return 'urgency-low';
			default: return 'urgency-medium';
		}
	}
	
	function getUrgencyLabel(urgency?: string): string {
		return urgency ? urgency.charAt(0).toUpperCase() + urgency.slice(1) : 'Medium';
	}
</script>

<div class="shopping-card">
	<div class="card-header">
		<div class="icon-title">
			<div class="icon-circle">
				<ShoppingCart size={24} weight="duotone" />
			</div>
			<div class="title-info">
				<h3 class="shopping-title">{item.title}</h3>
				{#if item.metadata.store}
					<span class="store">🏪 {item.metadata.store}</span>
				{/if}
			</div>
		</div>
		<div class="urgency-badge {getUrgencyClass(item.metadata.urgency)}">
			{getUrgencyLabel(item.metadata.urgency)}
		</div>
	</div>
	
	<div class="card-details">
		{#if item.metadata.quantity}
			<div class="detail">
				<span class="detail-label">Quantity:</span>
				<span class="detail-value">{item.metadata.quantity}</span>
			</div>
		{/if}
		
		{#if item.metadata.requested_by}
			<div class="detail">
				<span class="detail-label">Requested by:</span>
				<span class="detail-value">{getMemberName(item.metadata.requested_by)}</span>
			</div>
		{/if}
		
		{#if item.assigned_to && item.assigned_to.length > 0}
			<div class="detail">
				<span class="detail-label">Assigned to:</span>
				<span class="detail-value">{getMemberName(item.assigned_to[0])}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.shopping-card {
		background-color: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		box-shadow: var(--card-shadow);
		transition: all var(--transition-base);
		margin-bottom: var(--space-3);
	}
	
	.shopping-card:hover {
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
		background: linear-gradient(135deg, #4158D0, #C850C0);
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
	
	.shopping-title {
		font-size: var(--text-md);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		margin: 0;
		font-family: var(--font-sans);
	}
	
	.store {
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
	
	.urgency-badge {
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		font-family: var(--font-mono);
		text-transform: uppercase;
		white-space: nowrap;
	}
	
	.urgency-high {
		background-color: var(--status-overdue-bg);
		color: var(--status-overdue-text);
	}
	
	.urgency-medium {
		background-color: var(--status-pending-bg);
		color: var(--status-pending-text);
	}
	
	.urgency-low {
		background-color: var(--status-complete-bg);
		color: var(--status-complete-text);
	}
	
	.card-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	
	.detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-sm);
	}
	
	.detail-label {
		color: var(--text-secondary);
		font-family: var(--font-sans);
	}
	
	.detail-value {
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
	}
</style>

