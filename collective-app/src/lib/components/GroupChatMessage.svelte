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
		gap: 0.25rem;
		margin-bottom: 1rem;
	}
	
	.message-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 75%;
	}
	
	.message-wrapper.current-user .message-content {
		align-self: flex-end;
	}
	
	.message-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.5rem;
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
	
	.message-bubble {
		background-color: rgb(var(--m3-scheme-surface-container-highest));
		padding: 0.75rem;
		border-radius: var(--m3-util-rounding-large);
	}
	
	.message-bubble.user-bubble {
		background-color: rgb(var(--m3-scheme-secondary-container));
		color: rgb(var(--m3-scheme-on-secondary-container));
		align-self: flex-end;
	}
	
	.message-text {
		margin: 0;
		font-size: 0.9375rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		line-height: 1.5;
		word-wrap: break-word;
	}
	
	.message-bubble.user-bubble .message-text {
		color: rgb(var(--m3-scheme-on-secondary-container));
	}
	
	.message-time {
		font-size: 0.75rem;
		color: rgb(var(--m3-scheme-outline));
		font-family: var(--font-mono);
		text-align: right;
		padding: 0 0.5rem;
	}
	
	.message-wrapper.current-user .message-time {
		align-self: flex-end;
	}
</style>

