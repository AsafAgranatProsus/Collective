<script lang="ts">
	import type { CardHeaderSection } from '$lib/types/card-schema';
	import { Icon } from 'm3-svelte';
	import { getIcon } from '$lib/utils/cardHelpers';
	
	let { section } = $props<{ section: CardHeaderSection }>();
</script>

<div class="card-section card-section-header">
	<div class="header-content">
		{#if section.icon}
			<div class="header-icon">
				<Icon icon={getIcon(section.icon)} />
			</div>
		{/if}
		<div class="header-text">
			<h3 class="m3-font-title-large header-title">{section.title}</h3>
			{#if section.subtitle}
				<p class="m3-font-body-medium header-subtitle">{section.subtitle}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.header-content {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	
	.header-icon {
		color: rgb(var(--m3-scheme-primary));
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.header-text {
		flex: 1;
	}
	
	.header-title {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		margin: 0;
		line-height: 1.2;
	}
	
	.header-subtitle {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
		margin: 0.25rem 0 0 0;
		line-height: 1.4;
	}
	
	@media (max-width: 640px) {
		.header-title {
			font-size: 1.125rem;
		}
		
		.header-subtitle {
			font-size: 0.875rem;
		}
	}
</style>

