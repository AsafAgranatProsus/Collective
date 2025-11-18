<script lang="ts">
	import type { QuickReply } from '$lib/data/scenarios';
	import { fly, scale } from 'svelte/transition';
	
	let { 
		buttons, 
		onSelect 
	} = $props<{ 
		buttons: QuickReply[]; 
		onSelect: (value: string, label: string) => void;
	}>();
	
	function handleClick(button: QuickReply) {
		onSelect(button.value, button.label);
	}
</script>

<div 
	class="quick-replies"
	in:fly={{ y: 20, duration: 200 }}
	out:scale={{ duration: 150, start: 0.95, opacity: 0 }}
>
	{#each buttons as button, index (button.value)}
		<button
			class="quick-reply-btn"
			onclick={() => handleClick(button)}
			in:fly={{ y: 20, duration: 200, delay: index * 50 }}
			out:scale={{ duration: 150, start: 0.95, opacity: 0 }}
		>
			{button.label}
		</button>
	{/each}
</div>

<style>
	.quick-replies {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-3);
		margin-bottom: var(--space-4);
	}
	
	.quick-reply-btn {
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		font-family: var(--font-sans);
		background-color: transparent;
		color: var(--text-primary);
		border: 1px solid var(--chat-bubble-user-bg);
		transition: all var(--transition-base);
		cursor: pointer;
		white-space: nowrap;
	}
	
	.quick-reply-btn:hover {
		background-color: var(--chat-bubble-user-bg);
		color: var(--chat-bubble-user-text);
		transform: scale(1.02);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
	
	.quick-reply-btn:active {
		transform: scale(0.95);
	}
	
	.quick-reply-btn:focus-visible {
		outline: 2px solid var(--chat-bubble-user-bg);
		outline-offset: 2px;
	}
	
	/* Ensure touch targets are large enough */
	@media (max-width: 640px) {
		.quick-reply-btn {
			min-height: 44px;
			padding: var(--space-3) var(--space-4);
		}
	}
</style>

