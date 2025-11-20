<script lang="ts">
	import type { CardStatRowSection } from '$lib/types/card-schema';
	import { Icon } from 'm3-svelte';
	import { getIcon } from '$lib/utils/cardHelpers';
	
	let { section } = $props<{ section: CardStatRowSection }>();
</script>

<div class="card-stat-row">
	<div class="card-stat-row-label card-section-label">
		{#if section.icon}
			<Icon icon={getIcon(section.icon)} />
		{/if}
		<span>{section.label}</span>
	</div>
	<div class="card-stat-row-value card-section-value" class:highlight={section.highlight}>
		{section.value}
		{#if section.metadata}
			<span class="card-section-metadata"> • {section.metadata}</span>
		{/if}
	</div>
</div>

