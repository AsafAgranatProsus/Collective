<script lang="ts">
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import GroupChatMessage from './GroupChatMessage.svelte';
	import { getGroupChatMessages, addGroupChatMessage, type GroupChatMessage as GroupChatMessageType } from '$lib/data/groupChat';
	import { getCurrentUser, getMemberInfo } from '$lib/stores/app.svelte';
	
	let {
		groupId,
		isOpen,
		onClose
	} = $props<{
		groupId: string;
		isOpen: boolean;
		onClose: () => void;
	}>();
	
	let messages = $state<GroupChatMessageType[]>([]);
	let inputValue = $state('');
	let messagesContainer = $state<HTMLDivElement>();
	
	let currentUser = $derived(getCurrentUser());
	let currentMember = $derived(getMemberInfo(currentUser));
	
	// Load messages when component mounts or groupId changes
	$effect(() => {
		if (isOpen && groupId) {
			messages = getGroupChatMessages(groupId);
			
			// Scroll to bottom after messages load
			setTimeout(() => {
				if (messagesContainer) {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}
			}, 100);
		}
	});
	
	function handleSend(e: Event) {
		e.preventDefault();
		
		const trimmed = inputValue.trim();
		if (trimmed && currentMember) {
			const newMessage: GroupChatMessageType = {
				id: `gc-${Date.now()}`,
				sender: currentUser,
				sender_name: currentMember.name,
				avatar: currentMember.avatar,
				content: trimmed,
				timestamp: new Date().toISOString()
			};
			
			// Add to messages (local state for demo)
			messages = [...messages, newMessage];
			
			// Also add to global data store
			addGroupChatMessage(groupId, newMessage);
			
			// Clear input
			inputValue = '';
			
			// Scroll to bottom
			setTimeout(() => {
				if (messagesContainer) {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}
			}, 10);
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend(e);
		}
	}
	
	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<!-- Overlay backdrop -->
	<button 
		class="overlay-backdrop" 
		onclick={handleOverlayClick}
		transition:fade={{ duration: 200 }}
		aria-label="Close group chat"
	></button>
	
	<!-- Group Chat Panel -->
	<div 
		class="group-chat-panel"
		transition:slide={{ duration: 300, axis: 'x' }}
		role="dialog"
		aria-label="Group chat"
	>
		<!-- Header -->
		<header class="chat-header">
			<button class="back-button" onclick={onClose} aria-label="Close group chat">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<h2 class="chat-title">Group Chat</h2>
		</header>
		
		<!-- Messages Area -->
		<div class="messages-area" bind:this={messagesContainer}>
			<div class="messages-container">
				{#each messages as message (message.id)}
					<GroupChatMessage {message} />
				{/each}
			</div>
		</div>
		
		<!-- Input Area -->
		<form class="chat-input-form" onsubmit={handleSend}>
			<input
				bind:value={inputValue}
				onkeydown={handleKeydown}
				type="text"
				class="chat-input"
				placeholder="Type a message..."
				autocomplete="off"
			/>
			<button 
				type="submit" 
				class="send-button"
				disabled={!inputValue.trim()}
				aria-label="Send message"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</form>
	</div>
{/if}

<style>
	.overlay-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 999;
		cursor: pointer;
		border: none;
	}
	
	.group-chat-panel {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: 400px;
		max-width: 100vw;
		background-color: #F8F9FA;
		box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		display: flex;
		flex-direction: column;
	}
	
	:global(html[data-mode='dark']) .group-chat-panel {
		background-color: #1A1A1A;
		box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
	}
	
	.chat-header {
		padding: var(--space-4) var(--space-5);
		border-bottom: 1px solid #E5E7EB;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-shrink: 0;
	}
	
	:global(html[data-mode='dark']) .chat-header {
		border-bottom: 1px solid #2A2A2A;
	}
	
	.back-button {
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-md);
		transition: all var(--transition-base);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.back-button:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
	
	:global(html[data-mode='dark']) .back-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	
	.chat-title {
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		margin: 0;
		font-family: var(--font-sans);
	}
	
	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-5);
		scroll-behavior: smooth;
	}
	
	.messages-container {
		display: flex;
		flex-direction: column;
	}
	
	.chat-input-form {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-5);
		border-top: 1px solid #E5E7EB;
		background-color: #FFFFFF;
		flex-shrink: 0;
	}
	
	:global(html[data-mode='dark']) .chat-input-form {
		border-top: 1px solid #2A2A2A;
		background-color: #0A0A0A;
	}
	
	.chat-input {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid #D1D5DB;
		background-color: #F9FAFB;
		color: var(--text-primary);
		font-size: var(--text-base);
		font-family: var(--font-sans);
		transition: all var(--transition-base);
		outline: none;
	}
	
	.chat-input:focus {
		border-color: #9CA3AF;
		background-color: #FFFFFF;
	}
	
	:global(html[data-mode='dark']) .chat-input {
		border-color: #3A3A3A;
		background-color: #2A2A2A;
	}
	
	:global(html[data-mode='dark']) .chat-input:focus {
		border-color: #4A4A4A;
		background-color: #1A1A1A;
	}
	
	.send-button {
		background-color: #3B82F6;
		color: #FFFFFF;
		border: none;
		border-radius: var(--radius-lg);
		padding: var(--space-3);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-base);
		flex-shrink: 0;
	}
	
	.send-button:hover:not(:disabled) {
		background-color: #2563EB;
		transform: translateY(-1px);
	}
	
	.send-button:active:not(:disabled) {
		transform: translateY(0);
	}
	
	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	/* Mobile: full screen overlay */
	@media (max-width: 640px) {
		.group-chat-panel {
			width: 100vw;
		}
		
		.chat-header {
			padding: var(--space-3) var(--space-4);
		}
		
		.messages-area {
			padding: var(--space-4);
		}
		
		.chat-input-form {
			padding: var(--space-3) var(--space-4);
		}
	}
	
	/* Scrollbar styling */
	.messages-area::-webkit-scrollbar {
		width: 8px;
	}
	
	.messages-area::-webkit-scrollbar-track {
		background: #E5E7EB;
		border-radius: var(--radius-full);
	}
	
	:global(html[data-mode='dark']) .messages-area::-webkit-scrollbar-track {
		background: #2A2A2A;
	}
	
	.messages-area::-webkit-scrollbar-thumb {
		background: #9CA3AF;
		border-radius: var(--radius-full);
	}
	
	:global(html[data-mode='dark']) .messages-area::-webkit-scrollbar-thumb {
		background: #4A4A4A;
	}
	
	.messages-area::-webkit-scrollbar-thumb:hover {
		background: #6B7280;
	}
	
	:global(html[data-mode='dark']) .messages-area::-webkit-scrollbar-thumb:hover {
		background: #5A5A5A;
	}
</style>

