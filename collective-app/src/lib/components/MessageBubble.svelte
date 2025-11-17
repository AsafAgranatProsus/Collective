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
	<span class="message-timestamp">{formatTime(message.timestamp)}</span>
</div>

<style>
	.message-container {
		display: flex;
		flex-direction: column;
		margin-bottom: var(--space-4);
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
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-xl);
		word-wrap: break-word;
		box-shadow: var(--shadow-sm);
		transition: all var(--transition-base);
	}
	
	.user-bubble {
		background-color: var(--chat-bubble-user-bg);
		color: var(--chat-bubble-user-text);
		border-radius: var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		font-family: var(--font-serif);
		font-size: var(--text-md);
	}
	
	.ai-bubble {
		background-color: var(--chat-bubble-ai-bg);
		color: var(--chat-bubble-ai-text);
		border: 1px solid var(--chat-bubble-ai-border);
		border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm);
		font-family: var(--font-sans);
		font-size: var(--text-base);
		letter-spacing: -0.01em;
	}
	
	.message-content {
		margin: 0;
		line-height: 1.5;
		white-space: pre-wrap;
	}
	
	.message-timestamp {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-tertiary);
		margin-top: var(--space-1);
		padding: 0 var(--space-2);
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

