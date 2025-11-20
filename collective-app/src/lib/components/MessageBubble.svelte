<script lang="ts">
	import type { Message } from '$lib/data/scenarios';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { markMessageAsRendered } from '$lib/stores/app.svelte';
	import CardRenderer from '$lib/components/Cards/CardRenderer.svelte';
	
	let { 
		message,
		onTypingChange = () => {}
	} = $props<{ 
		message: Message;
		onTypingChange?: (isTyping: boolean) => void;
	}>();
	
	// Check if message has a card to render
	const hasCard = $derived(message.ui_elements?.card_schema !== undefined);

	// Typing effect for AI messages
	let visibleText = $state('');
	let isTyping = $state(false);
	
	// Expose isTyping state to parent
	$effect(() => {
		onTypingChange(isTyping);
	});
	
	// Split text into word clusters (1-3 words each)
	function splitIntoChunks(text: string): string[] {
		const words = text.split(/(\s+)/); // Split but keep whitespace
		const chunks: string[] = [];
		let currentChunk = '';
		let wordCount = 0;
		
		for (const word of words) {
			currentChunk += word;
			
			// If it's not just whitespace, increment word count
			if (word.trim()) {
				wordCount++;
			}
			
			// Create chunks of 1-3 words with some randomness
			const chunkSize = Math.floor(Math.random() * 3) + 1;
			if (wordCount >= chunkSize) {
				chunks.push(currentChunk);
				currentChunk = '';
				wordCount = 0;
			}
		}
		
		if (currentChunk) {
			chunks.push(currentChunk);
		}
		
		return chunks;
	}
	
	// Typing effect
	onMount(() => {
		if (message.sender === 'ai') {
			// Skip animation if already rendered
			if (message.is_rendered) {
				visibleText = message.content;
				isTyping = false;
				return;
			}
			
			isTyping = true;
			const chunks = splitIntoChunks(message.content);
			let currentIndex = 0;
			
			const typeNextChunk = () => {
				if (currentIndex < chunks.length) {
					visibleText += chunks[currentIndex];
					currentIndex++;
					
					// Random delay between 50-150ms
					const delay = Math.random() * 100 + 50;
					setTimeout(typeNextChunk, delay);
				} else {
					isTyping = false;
					// Mark this message as fully rendered
					markMessageAsRendered(message.id);
				}
			};
			
			// Start typing after a brief delay
			setTimeout(typeNextChunk, 300);
		} else {
			// For user/peer messages, show immediately
			visibleText = message.content;
		}
	});
	
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
	class:peer={message.sender === 'peer'}
	in:fly={{ y: 20, duration: 200, delay: 50 }}
>
	<div 
		class="message-bubble" 
		class:user-bubble={message.sender === 'user'} 
		class:ai-bubble={message.sender === 'ai'}
		class:peer-bubble={message.sender === 'peer'}
	>
		<p class="message-content">
			{visibleText}
			{#if message.sender === 'ai' && isTyping}
				<span class="typing-cursor">▋</span>
			{/if}
		</p>
	</div>
	<span class="message-timestamp m3-font-body-small">{formatTime(message.timestamp)}</span>
	
	<!-- Render card if present -->
	{#if hasCard && message.ui_elements?.card_schema}
		<div class="card-container">
			<CardRenderer schema={message.ui_elements.card_schema} />
		</div>
	{/if}
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

	.message-container.peer {
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
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-extra-small) var(--m3-util-rounding-large);
		font-weight: var(--m3-font-body-semibold, 600);
	}
	
	.ai-bubble {
		/* background-color: rgb(var(--m3-scheme-surface-container-highest)); */
		color: rgb(var(--m3-scheme-on-surface));
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-extra-small);
		padding-left: .5rem;
		padding-bottom: .0;
		font-weight: var(--m3-font-body-semibold, 600);
	}

	.peer-bubble {
		background-color: rgb(var(--m3-scheme-tertiary-container));
		color: rgb(var(--m3-scheme-on-surface));
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-extra-small);
	}
	
	.message-content {
		margin: 0;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.typing-cursor {
		display: inline-block;
		animation: blink 1s infinite;
		margin-left: 2px;
		opacity: 0.7;
	}

	@keyframes blink {
		0%, 49% {
			opacity: 0.7;
		}
		50%, 100% {
			opacity: 0;
		}
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
	
	/* Card container styling */
	.card-container {
		margin-top: var(--space-3);
		width: 100%;
		display: flex;
		justify-content: flex-start;
	}
	
	.message-container.user .card-container {
		justify-content: flex-end;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.message-bubble {
			max-width: 85%;
		}
	}
</style>

