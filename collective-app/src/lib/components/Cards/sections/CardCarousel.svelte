<script lang="ts">
	import { Card } from 'm3-svelte';
	import type { CardSchema } from '$lib/types/card-schema';
	
	let {
		cards,
		cardWidth = 280,
		onCardAction
	} = $props<{
		cards: CardSchema[];
		cardWidth?: number;
		onCardAction?: (value: string) => void;
	}>();
	
	// We'll use CardRenderer to render each card in the carousel
	import CardRenderer from '../CardRenderer.svelte';
</script>

<div class="card-carousel">
	<!-- Left spacer for scroll alignment -->
	<div class="carousel-spacer"></div>
	
	{#each cards as cardSchema, index}
		<div class="carousel-item" style:--card-width="{cardWidth}px">
			<CardRenderer 
				schema={cardSchema}
				onAction={onCardAction}
			/>
		</div>
	{/each}
	
	<!-- Right spacer for scroll end padding -->
	<div class="carousel-spacer"></div>
</div>

<style>
	.card-carousel {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		overflow-y: visible;
		padding: 0.5rem 0 0 0;
		margin: 0 -1rem; /* Break out of card padding */
		
		/* Hide scrollbar */
		scrollbar-width: none;
		-ms-overflow-style: none;
		
		/* Enable smooth scrolling */
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}
	
	.card-carousel::-webkit-scrollbar {
		display: none;
	}
	
	.carousel-spacer {
		flex-shrink: 0;
		width: 1rem;
	}
	
	.carousel-item {
		flex-shrink: 0;
		width: var(--card-width, 280px);
	}
	
	/* Ensure cards within carousel have proper shadow visibility */
	.carousel-item :global(.m3-card) {
		box-shadow: var(--m3-util-elevation-1);
	}
	
	/* Mobile responsive */
	@media (max-width: 640px) {
		.card-carousel {
			margin: 0 -1rem;
		}
		
		.carousel-spacer {
			width: 0.75rem;
		}
		
		.carousel-item {
			width: calc(var(--card-width, 280px) * 0.9);
		}
	}
</style>

