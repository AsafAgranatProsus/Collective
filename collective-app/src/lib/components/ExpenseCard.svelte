<script lang="ts">
	import type { CoordinatedItem } from '$lib/data/items';
	import { getMemberName } from '$lib/data/household';
	import CurrencyDollar from 'phosphor-svelte/lib/CurrencyDollar';
	import { Card } from 'm3-svelte';
	
	let { item } = $props<{ item: CoordinatedItem }>();
	
	// Format currency
	function formatCurrency(amount: number, currency = 'USD'): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(amount);
	}
	
	// Calculate split amount
	function getSplitAmount(amount: number): string {
		// Assuming 4 people for equal split
		return formatCurrency(amount / 4);
	}
</script>

<div class="card-wrapper">
	<Card variant="filled">
		<div class="card-content">
			<div class="card-header">
				<div class="icon-title">
					<div class="icon-circle">
						<CurrencyDollar size={24} weight="duotone" />
					</div>
					<div class="title-info">
						<h3 class="expense-title m3-font-title-medium">{item.title}</h3>
						<span class="category m3-font-label-medium">{item.metadata.category || 'expense'}</span>
					</div>
				</div>
				<div class="amount m3-font-title-large">
					{formatCurrency(item.metadata.amount || 0, item.metadata.currency)}
				</div>
			</div>
			
			<div class="card-details">
				{#if item.metadata.paid_by}
					<div class="detail-row">
						<span class="detail-label m3-font-body-medium">Paid by:</span>
						<span class="detail-value m3-font-body-medium">{getMemberName(item.metadata.paid_by)}</span>
					</div>
				{/if}
				
				{#if item.metadata.split_method === 'equal'}
					<div class="detail-row">
						<span class="detail-label m3-font-body-medium">Your share:</span>
						<span class="detail-value highlight m3-font-body-medium">{getSplitAmount(item.metadata.amount || 0)}</span>
					</div>
				{/if}
				
				{#if item.metadata.date}
					<div class="detail-row">
						<span class="detail-label m3-font-body-medium">Date:</span>
						<span class="detail-value m3-font-body-medium">{item.metadata.date}</span>
					</div>
				{/if}
			</div>
			
			{#if item.status === 'completed'}
				<div class="status-badge settled">
					✓ Settled
				</div>
			{:else}
				<div class="status-badge pending">
					Pending Settlement
				</div>
			{/if}
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
		margin-bottom: var(--space-4);
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
		background: linear-gradient(135deg, #FFD700, #FFA500);
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
	
	.expense-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.category {
		color: rgb(var(--m3-scheme-on-surface-variant));
		text-transform: uppercase;
		font-family: var(--font-mono);
	}
	
	.amount {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-mono);
		white-space: nowrap;
	}
	
	.card-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}
	
	.detail-row {
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
	
	.detail-value.highlight {
		color: rgb(var(--m3-scheme-primary));
		font-weight: 700;
	}
	
	.status-badge {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--m3-util-rounding-medium);
		font-size: var(--text-xs);
		font-weight: 500;
		font-family: var(--font-mono);
		text-align: center;
		text-transform: uppercase;
	}
	
	.status-badge.settled {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
	}
	
	.status-badge.pending {
		background-color: rgb(var(--m3-scheme-surface-variant));
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
</style>

