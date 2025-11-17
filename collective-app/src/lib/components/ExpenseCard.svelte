<script lang="ts">
	import type { CoordinatedItem } from '$lib/data/items';
	import { getMemberName } from '$lib/data/household';
	import CurrencyDollar from 'phosphor-svelte/lib/CurrencyDollar';
	
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

<div class="expense-card">
	<div class="card-header">
		<div class="icon-title">
			<div class="icon-circle">
				<CurrencyDollar size={24} weight="duotone" />
			</div>
			<div class="title-info">
				<h3 class="expense-title">{item.title}</h3>
				<span class="category">{item.metadata.category || 'expense'}</span>
			</div>
		</div>
		<div class="amount">
			{formatCurrency(item.metadata.amount || 0, item.metadata.currency)}
		</div>
	</div>
	
	<div class="card-details">
		{#if item.metadata.paid_by}
			<div class="detail-row">
				<span class="detail-label">Paid by:</span>
				<span class="detail-value">{getMemberName(item.metadata.paid_by)}</span>
			</div>
		{/if}
		
		{#if item.metadata.split_method === 'equal'}
			<div class="detail-row">
				<span class="detail-label">Your share:</span>
				<span class="detail-value highlight">{getSplitAmount(item.metadata.amount || 0)}</span>
			</div>
		{/if}
		
		{#if item.metadata.date}
			<div class="detail-row">
				<span class="detail-label">Date:</span>
				<span class="detail-value">{item.metadata.date}</span>
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

<style>
	.expense-card {
		background-color: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		box-shadow: var(--card-shadow);
		transition: all var(--transition-base);
		margin-bottom: var(--space-3);
	}
	
	.expense-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
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
		font-size: var(--text-md);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		margin: 0;
		font-family: var(--font-sans);
	}
	
	.category {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		text-transform: uppercase;
		font-family: var(--font-mono);
	}
	
	.amount {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
		color: var(--text-primary);
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
	
	.detail-value.highlight {
		color: var(--accent);
		font-weight: var(--weight-semibold);
	}
	
	.status-badge {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		font-family: var(--font-mono);
		text-align: center;
		text-transform: uppercase;
	}
	
	.status-badge.settled {
		background-color: var(--status-complete-bg);
		color: var(--status-complete-text);
	}
	
	.status-badge.pending {
		background-color: var(--status-pending-bg);
		color: var(--status-pending-text);
	}
</style>

