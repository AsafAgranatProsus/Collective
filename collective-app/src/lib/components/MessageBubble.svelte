<script lang="ts">
	import type { Message } from '$lib/data/scenarios';
	import { fade, fly } from 'svelte/transition';
	
	let { message } = $props<{ message: Message }>();
	
	// Format timestamp
	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes.toString().padStart(2, '0');
		return `${formattedHours}:${formattedMinutes} ${ampm}`;
	}
</script>

<div 
	class="message-container"
	class:user={message.sender === 'user'}
	class:ai={message.sender === 'ai'}
	in:fly={{ y: 20, duration: 200, delay: 50 }}
>
	<div class="message-bubble" class:user-bubble={message.sender === 'user'} class:ai-bubble={message.sender === 'ai'}>
		<p class="message-content">{message.content}</p>
	</div>
	<span class="message-timestamp m3-font-body-small">{formatTime(message.timestamp)}</span>
</div>

<style>
	.message-container {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
		animation: slideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	
	.message-container.user {
		align-items: flex-end;
	}
	
	.message-container.ai {
		align-items: flex-start;
	}
	
	.message-bubble {
		max-width: 80%;
		padding: 0.75rem 1rem;
		border-radius: var(--m3-util-rounding-large);
		word-wrap: break-word;
		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.user-bubble {
		background-color: rgb(var(--m3-scheme-secondary-container));
		color: rgb(var(--m3-scheme-on-secondary-container));
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-small) var(--m3-util-rounding-large);
		/* font-family: var(--font-sans);
		font-size: 1rem; */
	}
	
	.ai-bubble {
		/* background-color: rgb(var(--m3-scheme-surface-container-highest)); */
		color: rgb(var(--m3-scheme-on-surface));
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-small);
		/* font-family: var(--font-sans);
		font-size: 0.9375rem;
		letter-spacing: -0.01em; */
		padding-left: .5rem
	}
	
	.message-content {
		margin: 0;
		line-height: 1.5;
		white-space: pre-wrap;
	}
	
	.message-timestamp {
		font-family: var(--font-mono);
		/* font-size: 0.75rem; */
		color: rgb(var(--m3-scheme-outline));
		margin-top: 0.25rem;
		padding: 0 0.5rem;
	}
	
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.message-bubble {
			max-width: 85%;
		}
	}
</style>

