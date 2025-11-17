<script lang="ts">
	import { onMount } from 'svelte';
	
	let {
		data,
		max = 1.0
	} = $props<{
		data: Array<{ label: string; value: number }>;
		max?: number;
	}>();
	
	let mounted = $state(false);
	
	onMount(() => {
		// Trigger animation after mount
		setTimeout(() => {
			mounted = true;
		}, 50);
	});
	
	function getPercentage(value: number): number {
		return Math.min((value / max) * 100, 100);
	}
	
	function formatValue(value: number): string {
		if (max <= 1) {
			// Display as percentage
			return `${Math.round(value * 100)}%`;
		}
		return value.toString();
	}
</script>

<div class="bar-chart">
	{#each data as item, index}
		<div class="bar-row" style="animation-delay: {index * 50}ms;">
			<span class="bar-label">{item.label}</span>
			<div class="bar-container">
				<div 
					class="bar-fill" 
					class:mounted
					style="width: {mounted ? getPercentage(item.value) : 0}%"
				></div>
			</div>
			<span class="bar-value">{formatValue(item.value)}</span>
		</div>
	{/each}
</div>

<style>
	.bar-chart {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
	}
	
	.bar-row {
		display: grid;
		grid-template-columns: minmax(80px, auto) 1fr auto;
		gap: 12px;
		align-items: center;
		opacity: 0;
		animation: fadeIn 200ms ease-out forwards;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.bar-label {
		font-size: 12px;
		color: #6B7280;
		font-family: var(--font-sans);
		text-align: left;
	}
	
	.bar-container {
		position: relative;
		height: 8px;
		background-color: #E5E7EB;
		border-radius: 4px;
		overflow: hidden;
	}
	
	.bar-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background-color: #3B82F6;
		border-radius: 4px;
		transition: width 300ms ease-out;
		width: 0;
	}
	
	/* Width set via inline style in .bar-fill.mounted */
	
	.bar-value {
		font-size: 12px;
		color: #1F2937;
		font-family: var(--font-mono);
		text-align: right;
		min-width: 45px;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.bar-row {
			grid-template-columns: minmax(60px, auto) 1fr auto;
			gap: 8px;
		}
		
		.bar-label {
			font-size: 11px;
		}
		
		.bar-value {
			font-size: 11px;
			min-width: 40px;
		}
	}
</style>

