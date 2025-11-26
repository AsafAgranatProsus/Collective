<script lang="ts">
	import type { Message } from '$lib/data/scenarios';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { markMessageAsRendered } from '$lib/stores/app.svelte';
	import CardRenderer from '$lib/components/Cards/CardRenderer.svelte';
	
	let { 
		message,
		showTimestamp = true,
		onTypingChange = () => {},
		onCardRendered = () => {}
	} = $props<{ 
		message: Message;
		showTimestamp?: boolean;
		onTypingChange?: (isTyping: boolean) => void;
		onCardRendered?: () => void;
	}>();
	
	// Check if message has a card to render
	const hasCard = $derived(
		message.ui_elements?.card_schema !== undefined || 
		(message.ui_elements?.card_schemas !== undefined && message.ui_elements.card_schemas.length > 0)
	);
	const cardSchemas = $derived(
		message.ui_elements?.card_schemas || 
		(message.ui_elements?.card_schema ? [message.ui_elements.card_schema] : [])
	);

	// Progressive reveal states
	let visibleText = $state('');
	// Initialize isTyping to true for AI messages that need animation
	let isTyping = $state(message.sender === 'ai' && !message.is_rendered);
	let showCard = $state(false);
	let cardRendered = $state(false);
	// Track when timestamp should appear (after typing completes for AI messages)
	let showTimestampAfterTyping = $state(message.sender !== 'ai' || message.is_rendered);
	
	// Expose isTyping state to parent
	$effect(() => {
		onTypingChange(isTyping);
	});
	
	// Notify parent when card is rendered
	$effect(() => {
		if (cardRendered) {
			onCardRendered();
		}
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
				showCard = hasCard;
				cardRendered = hasCard;
				return;
			}
			
			// isTyping is already true from initialization
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
					
					// Show timestamp after typing completes (with small delay for fade-in)
					setTimeout(() => {
						showTimestampAfterTyping = true;
					}, 150);
					
					// Show card after text is fully typed (with small delay)
					if (hasCard) {
						setTimeout(() => {
							showCard = true;
							// Mark card as rendered after animation completes
							setTimeout(() => {
								cardRendered = true;
							}, 250); // Wait for scale animation
						}, 200);
					}
				}
			};
			
			// Start typing after a brief delay
			setTimeout(typeNextChunk, 300);
		} else {
			// For user/peer messages, show immediately
			visibleText = message.content;
			showCard = hasCard;
			cardRendered = hasCard;
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
	
	// Parse text for markdown-style headings
	// # Heading 1, ## Heading 2, ### Heading 3
	type TextPart = { type: 'h1' | 'h2' | 'h3' | 'text'; content: string };
	
	function parseTextWithHeadings(text: string): TextPart[] {
		const lines = text.split('\n');
		const parts: TextPart[] = [];
		let currentText = '';
		
		for (const line of lines) {
			// Check for headings at the start of a line
			if (line.startsWith('### ')) {
				if (currentText) {
					parts.push({ type: 'text', content: currentText });
					currentText = '';
				}
				parts.push({ type: 'h3', content: line.slice(4) });
			} else if (line.startsWith('## ')) {
				if (currentText) {
					parts.push({ type: 'text', content: currentText });
					currentText = '';
				}
				parts.push({ type: 'h2', content: line.slice(3) });
			} else if (line.startsWith('# ')) {
				if (currentText) {
					parts.push({ type: 'text', content: currentText });
					currentText = '';
				}
				parts.push({ type: 'h1', content: line.slice(2) });
			} else {
				// Regular text - append with newline if needed
				if (currentText) {
					currentText += '\n' + line;
				} else {
					currentText = line;
				}
			}
		}
		
		// Don't forget remaining text
		if (currentText) {
			parts.push({ type: 'text', content: currentText });
		}
		
		return parts;
	}
	
	// Derived parsed content
	let parsedContent = $derived(parseTextWithHeadings(visibleText));
</script>

<div 
	class="message-container"
	class:user={message.sender === 'user'}
	class:ai={message.sender === 'ai'}
	class:peer={message.sender === 'peer'}
	class:typing-active={isTyping && message.sender === 'ai'}
	in:fly={{ y: 20, duration: 200, delay: 50 }}
>
	<div 
		class="message-bubble" 
		class:user-bubble={message.sender === 'user'} 
		class:ai-bubble={message.sender === 'ai'}
		class:peer-bubble={message.sender === 'peer'}
		class:typing={isTyping}
	>
		<div class="message-content">
			{#each parsedContent as part, i}
				{#if part.type === 'h1'}
					<span class="heading-1">{part.content}</span>
				{:else if part.type === 'h2'}
					<span class="heading-2">{part.content}</span>
				{:else if part.type === 'h3'}
					<span class="heading-3">{part.content}</span>
				{:else}
					<span class="text-content">{part.content}</span>
				{/if}
			{/each}
			{#if message.sender === 'ai' && isTyping}
				<span class="typing-cursor">▋</span>
			{/if}
		</div>
	</div>
	
	<!-- Show timestamp after text only if there are no cards -->
	{#if showTimestamp && !hasCard && showTimestampAfterTyping}
		<span class="message-timestamp m3-font-body-small" in:fade={{ duration: 300 }}>{formatTime(message.timestamp)}</span>
	{/if}
	
	<!-- Render cards progressively after text completes -->
	{#if showCard && cardSchemas.length > 0}
		<div class="cards-container">
			{#each cardSchemas as schema, index (index)}
				<CardRenderer {schema} />
			{/each}
		</div>
	{/if}
	
	<!-- Show timestamp after cards if cards exist -->
	{#if showTimestamp && hasCard && showCard && showTimestampAfterTyping}
		<span class="message-timestamp m3-font-body-small" in:fade={{ duration: 300 }}>{formatTime(message.timestamp)}</span>
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
	
	/* Pre-allocate vertical space ONLY for the last AI message while typing */
	/* Previous messages revert to auto when a new message appears - the scroll jump hides this transition */
	.message-container.ai:last-child {
		min-height: clamp(100px, 25vh, 350px);
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
		font-weight: var(--m3-font-body-semibold, 500);
	}
	
	/* Pre-allocate space during typing - only for last message (via parent selector) */
	.message-container.ai.typing-active:last-child .ai-bubble.typing {
		min-height: clamp(80px, 20vh, 300px);
	}

	.peer-bubble {
		background-color: rgb(var(--m3-scheme-tertiary-container));
		color: rgb(var(--m3-scheme-on-surface));
		border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-extra-small);
	}
	
	.message-content {
		margin: 0;
		line-height: 1.5;
	}
	
	.message-content .text-content {
		white-space: pre-wrap;
	}
	
	.message-content .heading-1 {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.3;
		margin-bottom: 0.5rem;
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.message-content .heading-2 {
		display: block;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: 0.4rem;
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.message-content .heading-3 {
		display: block;
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: 0.3rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
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
	.cards-container {
		margin-top: var(--space-3);
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		justify-content: flex-start;
	}
	
	.message-container.user .cards-container {
		align-items: flex-end;
	}
	
	.message-container.ai .cards-container {
		align-items: flex-start;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.message-bubble {
			max-width: 85%;
		}
	}
</style>

