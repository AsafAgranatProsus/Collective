<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { getTypingIndicatorExiting } from '$lib/stores/app.svelte';
	
	// Ghost trail frames with block characters cycling through positions
	// Each frame has characters, colors, and opacity values for trailing effect
	const frames = [
		{ chars: ['▋', '▊', '▌', ' ', ' '], colors: ['primary', 'primary', 'primary', 'none', 'none'], opacities: [1, 0.6, 0.3, 0, 0] },
		{ chars: [' ', '▋', '▊', '▌', ' '], colors: ['none', 'tertiary', 'tertiary', 'tertiary', 'none'], opacities: [0, 1, 0.6, 0.3, 0] },
		{ chars: [' ', ' ', '▋', '▊', '▌'], colors: ['none', 'none', 'secondary', 'secondary', 'secondary'], opacities: [0, 0, 1, 0.6, 0.3] },
		{ chars: ['▌', ' ', ' ', '▋', '▊'], colors: ['secondary', 'none', 'none', 'primary', 'primary'], opacities: [0.3, 0, 0, 1, 0.6] },
		{ chars: ['▊', '▌', ' ', ' ', '▋'], colors: ['primary', 'primary', 'none', 'none', 'tertiary'], opacities: [0.6, 0.3, 0, 0, 1] },
	];
	
	let currentFrame = $state(0);
	let isExiting = $derived(getTypingIndicatorExiting());
	let blockOpacities = $state([1, 1, 1, 1, 1]); // Track individual block opacities for exit
	let interval: ReturnType<typeof setInterval> | null = null;
	let exitStarted = $state(false);
	
	// Watch for exit state change
	$effect(() => {
		if (isExiting && !exitStarted) {
			exitStarted = true;
			
			// Stop the cycling animation
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			
			// Fade out blocks sequentially with random timing
			const fadeOutBlock = (index: number, delay: number) => {
				setTimeout(() => {
					blockOpacities[index] = 0;
				}, delay);
			};
			
			// Stagger the disappearance with some randomness
			fadeOutBlock(0, Math.random() * 100); // First block: 0-100ms
			fadeOutBlock(1, 100 + Math.random() * 100); // Second: 100-200ms  
			fadeOutBlock(2, 200 + Math.random() * 100); // Third: 200-300ms
			fadeOutBlock(3, 300 + Math.random() * 100); // Fourth: 300-400ms
			fadeOutBlock(4, 400 + Math.random() * 100); // Fifth: 400-500ms
		} else if (!isExiting && exitStarted) {
			// Reset when indicator becomes visible again
			exitStarted = false;
			blockOpacities = [1, 1, 1, 1, 1];
		}
	});
	
	onMount(() => {
		// Cycle through frames every 150ms for smooth motion
		interval = setInterval(() => {
			if (!isExiting) {
				currentFrame = (currentFrame + 1) % frames.length;
			}
		}, 150);
	});
	
	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div class="typing-indicator" in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
	<div class="typing-bubble">
		<span class="cursor-trail">
			{#each frames[currentFrame].chars as char, i}
				<span 
					class="cursor-block"
					class:primary={frames[currentFrame].colors[i] === 'primary'}
					class:secondary={frames[currentFrame].colors[i] === 'secondary'}
					class:tertiary={frames[currentFrame].colors[i] === 'tertiary'}
					class:exiting={isExiting}
					style:opacity={isExiting ? blockOpacities[i] : frames[currentFrame].opacities[i]}
				>
					{char}
				</span>
			{/each}
		</span>
		<span class="thinking-text" style:opacity={isExiting ? 0 : 0.6}>thinking</span>
	</div>
</div>

<style>
	.typing-indicator {
		display: flex;
		align-items: flex-start;
		margin-bottom: var(--space-4);
	}
	
	.typing-bubble {
		/* Match AI bubble styling - no background */
		color: rgb(var(--m3-scheme-on-surface));
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-extra-small);
		padding: 0.75rem 1rem;
		padding-left: 0.5rem;
		display: flex;
		gap: var(--space-2);
		align-items: center;
		font-family: var(--font-mono); /* Terminal aesthetic */
		font-weight: var(--m3-font-body-semibold, 600);
	}
	
	.cursor-trail {
		display: inline-flex;
		font-size: 1.1rem;
		line-height: 1;
		letter-spacing: 0;
	}
	
	.cursor-block {
		transition: opacity 100ms ease-out;
	}
	
	.cursor-block.exiting {
		transition: opacity 200ms ease-out;
	}
	
	.cursor-block.primary {
		color: rgb(var(--m3-scheme-primary));
	}
	
	.cursor-block.secondary {
		color: rgb(var(--m3-scheme-secondary));
	}
	
	.cursor-block.tertiary {
		color: rgb(var(--m3-scheme-tertiary));
	}
	
	.thinking-text {
		font-size: 0.9rem;
		margin-left: var(--space-1);
		transition: opacity 200ms ease-out;
	}
</style>
