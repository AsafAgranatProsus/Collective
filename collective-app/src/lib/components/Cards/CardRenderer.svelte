<script lang="ts">
	import type { CardSchema, CardSection } from '$lib/types/card-schema';
	import { templateToSections } from '$lib/utils/cardHelpers';
	import { Card } from 'm3-svelte';
	import { scale } from 'svelte/transition';
	
	// Import all section components
	import CardHeader from './sections/CardHeader.svelte';
	import CardStatRow from './sections/CardStatRow.svelte';
	import CardProgressIndicator from './sections/CardProgressIndicator.svelte';
	import CardListItems from './sections/CardListItems.svelte';
	import CardChart from './sections/CardChart.svelte';
	import CardComparisonBar from './sections/CardComparisonBar.svelte';
	import CardActions from './sections/CardActions.svelte';
	import CardDivider from './sections/CardDivider.svelte';
	import CardText from './sections/CardText.svelte';
	
	let {
		schema,
		onAction
	} = $props<{
		schema: CardSchema;
		onAction?: (value: string) => void;
	}>();
	
	// Convert template to sections if needed, otherwise use sections directly
	const sections = $derived<CardSection[]>(
		schema.template && schema.data
			? templateToSections(schema.template, schema.data)
			: schema.sections || []
	);
</script>

<div 
	class="card-renderer-wrapper" 
	style="max-width: {schema.maxWidth ? `${schema.maxWidth}px` : '480px'}"
	transition:scale={{ duration: 200, start: 0.95 }}
>
	<Card variant={schema.variant || 'filled'}>
		<div class="card-renderer-content" class:scrollable={schema.scrollable}>
			{#each sections as section, index (index)}
				{#if section.type === 'header'}
					<CardHeader {section} />
				{:else if section.type === 'stat_row'}
					<CardStatRow {section} />
				{:else if section.type === 'progress'}
					<CardProgressIndicator {section} />
				{:else if section.type === 'list'}
					<CardListItems {section} />
				{:else if section.type === 'chart'}
					<CardChart {section} />
				{:else if section.type === 'comparison'}
					<CardComparisonBar {section} />
				{:else if section.type === 'actions'}
					<CardActions {section} {onAction} />
				{:else if section.type === 'divider'}
					<CardDivider {section} />
				{:else if section.type === 'text'}
					<CardText {section} />
				{/if}
			{/each}
		</div>
	</Card>
</div>

<style>
	.card-renderer-wrapper {
		width: 95%;
		/* margin: var(--space-4) 0; */
	}
	
	.card-renderer-content {
		display: flex;
		flex-direction: column;
	}
	
	.card-renderer-content.scrollable {
		max-height: 80vh;
		overflow-y: auto;
	}
	
	/* Scrollbar styling for scrollable cards */
	.card-renderer-content.scrollable::-webkit-scrollbar {
		width: 6px;
	}
	
	.card-renderer-content.scrollable::-webkit-scrollbar-track {
		background: rgb(var(--m3-scheme-surface-container));
		border-radius: 3px;
	}
	
	.card-renderer-content.scrollable::-webkit-scrollbar-thumb {
		background: rgb(var(--m3-scheme-outline));
		border-radius: 3px;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.card-renderer-wrapper {
			width: 98%;
		}
		
		.card-renderer-content.scrollable {
			max-height: 75vh;
		}
	}
</style>

