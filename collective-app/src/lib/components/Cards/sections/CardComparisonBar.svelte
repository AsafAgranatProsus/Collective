<script lang="ts">
	import type { CardComparisonBarSection } from '$lib/types/card-schema';
	
	let { section } = $props<{ section: CardComparisonBarSection }>();
</script>

<div class="card-section">
	{#if section.title}
		<h4 class="card-section-title">{section.title}</h4>
	{/if}
	
	<div class="card-comparison-bar">
		{#each section.items as item, index}
			<span class="card-comparison-item" class:highlight={item.highlight}>
				<strong>{item.label}:</strong> {item.value}
			</span>
			{#if index < section.items.length - 1}
				<span class="card-comparison-divider">|</span>
			{/if}
		{/each}
	</div>
	
	{#if section.note}
		<p class="card-comparison-note">{section.note}</p>
	{/if}
</div>

