<script lang="ts">
	import type { CoordinatedItem } from '$lib/data/items';
	import { getMemberName } from '$lib/data/household';
	import ShoppingCart from 'phosphor-svelte/lib/ShoppingCart';
	import { Card } from 'm3-svelte';
	
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

<div class="card-wrapper">
	<Card variant="filled">
		<div class="card-content">
			<div class="card-header">
				<div class="icon-title">
					<div class="icon-circle">
						<ShoppingCart size={24} weight="duotone" />
					</div>
					<div class="title-info">
						<h3 class="shopping-title m3-font-title-medium">{item.title}</h3>
						{#if item.metadata.store}
							<span class="store m3-font-body-small">🏪 {item.metadata.store}</span>
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
						<span class="detail-label m3-font-body-medium">Quantity:</span>
						<span class="detail-value m3-font-body-medium">{item.metadata.quantity}</span>
					</div>
				{/if}
				
				{#if item.metadata.requested_by}
					<div class="detail">
						<span class="detail-label m3-font-body-medium">Requested by:</span>
						<span class="detail-value m3-font-body-medium">{getMemberName(item.metadata.requested_by)}</span>
					</div>
				{/if}
				
				{#if item.assigned_to && item.assigned_to.length > 0}
					<div class="detail">
						<span class="detail-label m3-font-body-medium">Assigned to:</span>
						<span class="detail-value m3-font-body-medium">{getMemberName(item.assigned_to[0])}</span>
					</div>
				{/if}
			</div>
		</div>
	</Card>
</div>

<style>
	.card-wrapper {
		margin-bottom: var(--space-3);
	}

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
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.store {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.urgency-badge {
		padding: var(--space-1) var(--space-3);
		border-radius: var(--m3-util-rounding-full);
		font-size: var(--text-xs);
		font-weight: 500;
		font-family: var(--font-mono);
		text-transform: uppercase;
		white-space: nowrap;
	}
	
	.urgency-high {
		background-color: rgb(var(--m3-scheme-error-container));
		color: rgb(var(--m3-scheme-on-error-container));
	}
	
	.urgency-medium {
		background-color: rgb(var(--m3-scheme-surface-variant));
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.urgency-low {
		background-color: rgb(var(--m3-scheme-secondary-container));
		color: rgb(var(--m3-scheme-on-secondary-container));
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
	}
	
	.detail-label {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.detail-value {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-mono);
		font-weight: 500;
	}
</style>

