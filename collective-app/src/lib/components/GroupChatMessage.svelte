<script lang="ts">
	import type { GroupChatMessage } from '$lib/data/groupChat';
	import type { Message } from '$lib/data/scenarios';
	import { getCurrentUser } from '$lib/stores/app.svelte';
	import MessageBubble from './MessageBubble.svelte';
	
	let { message } = $props<{ message: GroupChatMessage }>();
	
	let currentUser = $derived(getCurrentUser());
	let isCurrentUser = $derived(message.sender === currentUser);
	let isSystemMessage = $derived(message.type === 'system');
	let isTypingMessage = $derived(message.type === 'typing');
	
	// Convert GroupChatMessage to Message format for MessageBubble
	// Use 'peer' for other users in group chat (not 'ai')
	let bubbleMessage = $derived<Message>({
		id: message.id,
		sender: isCurrentUser ? 'user' : 'peer',
		content: message.content,
		timestamp: message.timestamp
	});
</script>

{#if isSystemMessage}
	<!-- System message (centered, styled differently) -->
	<div class="system-message">
		<span class="system-text">{message.content}</span>
	</div>
{:else if isTypingMessage}
	<!-- Typing indicator -->
	<div class="message-wrapper typing-wrapper">
		<div class="message-content">
			<div class="typing-indicator-row">
				<div class="typing-dots">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
				<span class="typing-label">{message.sender_name} is responding</span>
			</div>
		</div>
	</div>
{:else}
	<!-- Regular message -->
	<div class="message-wrapper" class:current-user={isCurrentUser}>
		<div class="message-content">
			{#if !isCurrentUser}
				<div class="message-header">
					<span class="sender-avatar">{message.avatar}</span>
					<span class="sender-name">{message.sender_name}</span>
				</div>
			{:else}
				<div class="message-header">
					<span class="sender-name">{message.sender_name}</span>
				</div>
			{/if}
			
			<MessageBubble message={bubbleMessage} />
		</div>
	</div>
{/if}

<style>
	/* System message - centered */
	.system-message {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0;
		margin: 0.5rem 0;
	}
	
	.system-text {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
		background-color: rgb(var(--m3-scheme-surface-container-high));
		padding: 0.5rem 1rem;
		border-radius: 1rem;
	}
	
	/* Regular message */
	.message-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin-bottom: 0.5rem;
	}
	
	.message-content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		max-width: 85%;
	}
	
	.message-wrapper.current-user .message-content {
		align-self: flex-end;
	}
	
	.message-header {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		padding: 0 0.5rem;
		margin-bottom: 0.125rem;
	}
	
	.message-wrapper.current-user .message-header {
		justify-content: flex-end;
	}
	
	.sender-avatar {
		font-size: 16px;
	}
	
	.sender-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
	}
	
	/* Typing indicator */
	.typing-wrapper {
		margin-bottom: 0.75rem;
	}
	
	.typing-indicator-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
	}
	
	.typing-dots {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 8px 12px;
		background-color: rgb(var(--m3-scheme-surface-container-high));
		border-radius: 1rem;
	}
	
	.typing-dots .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: rgb(var(--m3-scheme-on-surface-variant));
		animation: typingBounce 1.4s infinite ease-in-out both;
	}
	
	.typing-dots .dot:nth-child(1) {
		animation-delay: -0.32s;
	}
	
	.typing-dots .dot:nth-child(2) {
		animation-delay: -0.16s;
	}
	
	.typing-dots .dot:nth-child(3) {
		animation-delay: 0s;
	}
	
	@keyframes typingBounce {
		0%, 80%, 100% {
			transform: scale(0.6);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	.typing-label {
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans);
		font-style: italic;
	}
</style>

