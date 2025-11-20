<script lang="ts">
	import type { QuickReply, Message } from '$lib/data/scenarios';
	import { containerTransform } from 'm3-svelte';
	import { Button } from 'm3-svelte';
	
	let { 
		mode = 'bubble',
		buttons = [],
		message = undefined,
		onSelect = undefined
	} = $props<{ 
		mode?: 'buttons' | 'morphing' | 'bubble';
		buttons?: QuickReply[];
		message?: Message;
		onSelect?: (value: string, label: string, messageToAdd?: Message) => void;
	}>();
	
	// Create containerTransform instance for button-to-bubble morphing
	const [send, receive] = containerTransform({ duration: 400 });
	
	// State for morphing mode
	let selectedButton = $state<string | null>(null);
	let morphedBubble = $state<{ content: string; timestamp: string } | null>(null);
	
	function handleClick(button: QuickReply) {
		console.log('🔵 Button clicked:', button.value);
		console.log('🔵 BEFORE - selectedButton:', selectedButton, 'morphedBubble:', morphedBubble);
		
		selectedButton = button.value;
		console.log('🔵 AFTER selectedButton set:', selectedButton);
		
		// Create the message object
		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			sender: 'user',
			content: button.label,
			timestamp: new Date().toISOString()
		};
		
		// Delay bubble creation to allow transition setup
		setTimeout(() => {
			console.log('🔵 Creating morphed bubble...');
			morphedBubble = {
				content: button.label,
				timestamp: new Date().toISOString()
			};
			console.log('🔵 Morphed bubble created:', morphedBubble);
		}, 100);
		
		// Notify parent AFTER transition completes (400ms + buffer)
		setTimeout(() => {
			console.log('🔵 Transition complete, notifying parent');
			onSelect?.(button.value, button.label, userMessage);
		}, 500);
	}
	
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

{#if mode === 'bubble' && message}
	<!-- Direct user message bubble -->
	<div class="message-container">
		<div class="message-bubble user-bubble">
			<p class="message-content">{message.content}</p>
		</div>
		<span class="message-timestamp m3-font-body-small">{formatTime(message.timestamp)}</span>
	</div>
{:else if mode === 'morphing' || mode === 'buttons'}
	<!-- Reply buttons that can morph into bubble -->
	<div class="button-area">
		{#if morphedBubble && selectedButton}
			<!-- Bubble morphed from button -->
			<div 
				class="message-container" 
				in:receive={{ key: 'morph-transition' }} 
				out:send={{ key: 'morph-transition' }}
			>
				<div class="message-bubble user-bubble">
					<p class="message-content">{morphedBubble.content}</p>
				</div>
				<span class="message-timestamp m3-font-body-small">{formatTime(morphedBubble.timestamp)}</span>
			</div>
		{:else}
			<!-- Buttons container -->
			<div 
				class="buttons-row"
				in:receive={{ key: 'morph-transition' }}
				out:send={{ key: 'morph-transition' }}
			>
				{#each buttons as button (button.value)}
					<button
						class="reply-button m3-font-label-large"
						onclick={() => handleClick(button)}
					>
						{button.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.button-area {
		display: grid;
		grid-template-columns: 1fr;
		justify-items: end;
		margin-bottom: 1rem;
	}
	
	/* Make all children occupy the same grid cell */
	.button-area > * {
		grid-column: 1;
		grid-row: 1;
	}
	
	.buttons-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: flex-end;
	}
	
	.reply-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgb(var(--m3-scheme-surface-container-highest));
		color: rgb(var(--m3-scheme-primary));
		border: 1px solid rgb(var(--m3-scheme-outline));
		height: 2.5rem;
		border-radius: var(--m3-util-rounding-full);
		padding: 0 1.5rem;
		cursor: pointer;
		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
	}
	
	.reply-button:hover {
		background-color: rgba(var(--m3-scheme-primary), 0.08);
	}
	
	.message-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-bottom: 1rem;
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
	}
	
	.message-content {
		margin: 0;
		line-height: 1.5;
		white-space: pre-wrap;
	}
	
	.message-timestamp {
		font-family: var(--font-mono);
		color: rgb(var(--m3-scheme-outline));
		margin-top: 0.25rem;
		padding: 0 0.5rem;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.message-bubble {
			max-width: 85%;
		}
	}
</style>

