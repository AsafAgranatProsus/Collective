<script lang="ts">
	import type { CardProgressIndicatorSection } from '$lib/types/card-schema';
	import CircularProgress from '$lib/components/CircularProgress.svelte';
	
	let { section } = $props<{ section: CardProgressIndicatorSection }>();
	
	const sizeMap = {
		small: 'small',
		medium: 'medium',
		large: 'large'
	} as const;
</script>

<div class="card-section">
	<div class="card-progress-container">
		{#if section.variant === 'linear'}
			<div class="progress-linear-container">
				<div class="progress-linear-track">
					<div class="progress-linear-fill" style="width: {section.value}%"></div>
				</div>
				{#if section.label}
					<span class="card-progress-label">{section.label}</span>
				{/if}
			</div>
		{:else}
			<CircularProgress 
				value={section.value} 
				size={sizeMap[section.size || 'medium']}
				showLabel={true}
			/>
			{#if section.label}
				<span class="card-progress-label">{section.label}</span>
			{/if}
		{/if}
	</div>
</div>

<style>
	.progress-linear-container {
		width: 100%;
	}
	
	.progress-linear-track {
		width: 100%;
		height: 8px;
		background-color: rgb(var(--m3-scheme-surface-container-highest));
		border-radius: var(--m3-util-rounding-full);
		overflow: hidden;
	}
	
	.progress-linear-fill {
		height: 100%;
		background-color: rgb(var(--m3-scheme-primary));
		border-radius: var(--m3-util-rounding-full);
		transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.card-progress-label {
		display: block;
		margin-top: var(--space-2);
	}
</style>

