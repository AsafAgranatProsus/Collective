<script lang="ts">
	import type { GroupChatMessage } from '$lib/data/groupChat';
	import { getCurrentUser } from '$lib/stores/app.svelte';
	
	let { message } = $props<{ message: GroupChatMessage }>();
	
	let currentUser = $derived(getCurrentUser());
	let isCurrentUser = $derived(message.sender === currentUser);
	
	// Format timestamp to human-readable time
	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true 
		});
	}
</script>

<div class="message-wrapper" class:current-user={isCurrentUser}>
	<div class="message-content">
		{#if !isCurrentUser}
			<div class="message-header">
				<span class="sender-avatar">{message.avatar}</span>
				<span class="sender-name">{message.sender_name}</span>
			</div>
		{:else}
			<div class="message-header">
				<span class="sender-name">{message.sender_name} (You)</span>
			</div>
		{/if}
		
		<div class="message-bubble" class:user-bubble={isCurrentUser}>
			<p class="message-text">{message.content}</p>
		</div>
		
		<span class="message-time">{formatTime(message.timestamp)}</span>
	</div>
</div>

<style>
	.message-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin-bottom: var(--space-4);
	}
	
	.message-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		max-width: 75%;
	}
	
	.message-wrapper.current-user .message-content {
		align-self: flex-end;
	}
	
	.message-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0 var(--space-2);
	}
	
	.sender-avatar {
		font-size: 16px;
	}
	
	.sender-name {
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
		color: var(--text-secondary);
		font-family: var(--font-sans);
	}
	
	.message-bubble {
		background-color: #F3F4F6;
		padding: var(--space-3);
		border-radius: var(--radius-lg);
		border: 1px solid transparent;
	}
	
	.message-bubble.user-bubble {
		background-color: #E8FFD0;
		align-self: flex-end;
	}
	
	:global(html[data-mode='dark']) .message-bubble {
		background-color: #2A2A2A;
		border-color: #3A3A3A;
	}
	
	:global(html[data-mode='dark']) .message-bubble.user-bubble {
		background-color: #3A4A2A;
		border-color: #4A5A3A;
	}
	
	.message-text {
		margin: 0;
		font-size: var(--text-base);
		color: var(--text-primary);
		font-family: var(--font-sans);
		line-height: 1.5;
		word-wrap: break-word;
	}
	
	.message-time {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
		font-family: var(--font-mono);
		text-align: right;
		padding: 0 var(--space-2);
	}
	
	.message-wrapper.current-user .message-time {
		align-self: flex-end;
	}
</style>

