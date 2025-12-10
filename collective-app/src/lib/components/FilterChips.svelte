<script lang="ts">
	import { Chip } from 'm3-svelte';
	import { slide } from 'svelte/transition';
	
	interface FilterOption {
		id: string;
		label: string;
		icon?: string;
	}
	
	let {
		filters,
		selectedFilter,
		onFilterSelect,
		showDivider = false,
		background = 'transparent',
		edgeToEdge = false,
		spacerWidth = '1rem'
	} = $props<{
		filters: FilterOption[];
		selectedFilter: string;
		onFilterSelect: (filterId: string) => void;
		showDivider?: boolean;
		background?: string;
		edgeToEdge?: boolean;
		spacerWidth?: string;
	}>();
</script>

<div 
	class="filter-chips" 
	class:with-divider={showDivider}
	class:edge-to-edge={edgeToEdge}
	style:background-color={background}
	style:--spacer-width={spacerWidth}
>
	<!-- Left spacer for visual alignment -->
	<div class="filter-spacer"></div>
	
	{#each filters as filter (filter.id)}
		<div 
			class="chip-wrapper"
			in:slide={{ axis: 'x', duration: 300 }}
		>
			<Chip
				variant="general"
				selected={selectedFilter === filter.id}
				onclick={() => onFilterSelect(filter.id)}
			>
				{#if filter.icon}{filter.icon} {/if}{filter.label}
			</Chip>
		</div>
	{/each}
	
	<!-- Right spacer for scroll end padding -->
	<div class="filter-spacer"></div>
</div>

<style>
	.filter-chips {
		flex-shrink: 0;
		display: flex;
		gap: 0.5rem;
		padding: 1rem 0; /* Remove horizontal padding for edge-to-edge scroll */
		overflow-x: auto;
		overflow-y: hidden;
		z-index: 100;
		
		/* Extend to edges by breaking out of parent padding (by default) */
		margin-left: -1.5rem;
		margin-right: -1.5rem;
		
		/* Hide scrollbar */
		scrollbar-width: none;
		-ms-overflow-style: none;
		
		/* Enable smooth scrolling */
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch; /* iOS momentum scrolling */

		:global(button) {
			border-radius: var(--m3-util-rounding-large);
		}
	}
	
	/* When inside a container that's already edge-to-edge (no padding) */
	.filter-chips.edge-to-edge {
		margin-left: 0;
		margin-right: 0;
	}
	
	.filter-chips.with-divider {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant) / 0.3);
		margin-bottom: 0.5rem;
	}
	
	.filter-chips::-webkit-scrollbar {
		display: none;
	}
	
	/* Spacer for visual alignment */
	.filter-spacer {
		flex-shrink: 0;
		width: var(--spacer-width, 1rem);
	}
	
	/* Chip wrapper for animation */
	.chip-wrapper {
		flex-shrink: 0;
		display: flex;
		overflow: hidden;
	}
	
	/* Ensure chips don't shrink and maintain natural width */
	.filter-chips :global(.m3-chip),
	.filter-chips > :global(*:not(.filter-spacer)) {
		flex-shrink: 0;
		width: auto;
		min-width: fit-content;
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.filter-chips {
			padding: 0.75rem 0 1rem 0; /* Keep edge-to-edge on mobile */
			margin-left: -1rem;
			margin-right: -1rem;
		}
		
		.filter-chips.edge-to-edge {
			margin-left: 0;
			margin-right: 0;
		}
	}
</style>

