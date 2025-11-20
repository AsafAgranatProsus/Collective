<script lang="ts">
	import type { GroupChatMessage } from '$lib/data/groupChat';
	import type { Message } from '$lib/data/scenarios';
	import { getCurrentUser } from '$lib/stores/app.svelte';
	import MessageBubble from './MessageBubble.svelte';
	
	let { message } = $props<{ message: GroupChatMessage }>();
	
	let currentUser = $derived(getCurrentUser());
	let isCurrentUser = $derived(message.sender === currentUser);
	
	// Convert GroupChatMessage to Message format for MessageBubble
	// Use 'peer' for other users in group chat (not 'ai')
	let bubbleMessage = $derived<Message>({
		id: message.id,
		sender: isCurrentUser ? 'user' : 'peer',
		content: message.content,
		timestamp: message.timestamp
	});
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
		
		<MessageBubble message={bubbleMessage} />
	</div>
</div>

<style>
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
		gap: 0.5rem;
		padding: 0 0.5rem;
		margin-bottom: 0.125rem;
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
</style>

