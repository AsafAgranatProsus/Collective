<script lang="ts">
	import type { CardListItemsSection } from '$lib/types/card-schema';
	import { Icon } from 'm3-svelte';
	import { getIcon } from '$lib/utils/cardHelpers';
	
	let { section } = $props<{ section: CardListItemsSection }>();
</script>

<div class="card-section">
	{#if section.title}
		<h4 class="card-section-title">{section.title}</h4>
	{/if}
	
	<ul class="card-list">
		{#each section.items as item (item.id || item.title)}
			<li class="card-list-item" class:compact={section.style === 'compact'} class:highlight={item.highlight}>
				{#if section.showCheckboxes}
					<input type="checkbox" checked={item.checked} disabled class="list-item-checkbox" />
				{/if}
				
				{#if item.icon}
					<div class="card-list-item-icon">
						<Icon icon={getIcon(item.icon)} />
					</div>
				{/if}
				
				<div class="card-list-item-content">
					<p class="card-list-item-title">{item.title}</p>
					{#if item.subtitle}
						<p class="card-list-item-subtitle">{item.subtitle}</p>
					{/if}
				</div>
				
				{#if item.metadata}
					<span class="card-list-item-metadata">{item.metadata}</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.list-item-checkbox {
		flex-shrink: 0;
		margin-top: 0.125rem;
		width: 1.125rem;
		height: 1.125rem;
		accent-color: rgb(var(--m3-scheme-primary));
	}
</style>

