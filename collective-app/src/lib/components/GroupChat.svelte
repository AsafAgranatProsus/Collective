<script lang="ts">
	import { onMount } from "svelte";
	import { slide, fade } from "svelte/transition";
	import GroupChatMessage from "./GroupChatMessage.svelte";
	import GlassHeader from "./GlassHeader.svelte";
	import ChatInput from "./ChatInput.svelte";
	import {
		getGroupChatMessages,
		addGroupChatMessage,
		type GroupChatMessage as GroupChatMessageType,
	} from "$lib/data/groupChat";
	import { getCurrentUser, getMemberInfo } from "$lib/stores/app.svelte";
	import { getGroupById } from "$lib/data/groups.svelte";
	import { Icon, Button, TextField } from "m3-svelte";
	import iconArrowBack from "@ktibow/iconset-material-symbols/arrow-back";
	import iconSend from "@ktibow/iconset-material-symbols/send";

	let { groupId, isOpen, onClose, onSendMessage, onQuickReply } = $props<{
		groupId: string;
		isOpen: boolean;
		onClose: () => void;
		onSendMessage?: (content: string) => void;
		onQuickReply?: (value: string, label: string) => void;
	}>();

	let messages = $state<GroupChatMessageType[]>([]);
	let messagesContainer = $state<HTMLDivElement>();

	let currentUser = $derived(getCurrentUser());
	let currentMember = $derived(getMemberInfo(currentUser));
	let group = $derived(getGroupById(groupId));
	
	// Get members who have joined the chat (from group chat messages)
	let chatMembers = $derived.by(() => {
		const uniqueMembers = new Map<string, { id: string; name: string; avatar: string }>();
		
		// Add current user
		if (currentMember) {
			uniqueMembers.set(currentUser, {
				id: currentUser,
				name: 'You',
				avatar: currentMember.avatar
			});
		}
		
		// Add other members who have sent messages
		messages.forEach(msg => {
			if (msg.sender !== 'system' && msg.sender !== currentUser && !uniqueMembers.has(msg.sender)) {
				uniqueMembers.set(msg.sender, {
					id: msg.sender,
					name: msg.sender_name,
					avatar: msg.avatar
				});
			}
		});
		
		return Array.from(uniqueMembers.values());
	});

	// Load messages when component mounts or groupId changes
	$effect(() => {
		if (isOpen && groupId) {
			messages = getGroupChatMessages(groupId);

			// Immediately scroll to bottom without animation
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		}
	});

	// Poll for new messages while chat is open
	$effect(() => {
		if (isOpen && groupId) {
			const interval = setInterval(() => {
				const latestMessages = getGroupChatMessages(groupId);
				// Check if messages changed (length or last message ID)
				const hasChanged = latestMessages.length !== messages.length ||
					(latestMessages.length > 0 && messages.length > 0 && 
					 latestMessages[latestMessages.length - 1]?.id !== messages[messages.length - 1]?.id);
				
				if (hasChanged) {
					messages = [...latestMessages]; // Create new array reference
					// Scroll to bottom when messages change
					setTimeout(() => {
						if (messagesContainer) {
							messagesContainer.scrollTop =
								messagesContainer.scrollHeight;
						}
					}, 10);
				}
			}, 300); // Check every 300ms for faster updates

			return () => clearInterval(interval);
		}
	});

	function handleSend(content: string) {
		const trimmed = content.trim();
		if (trimmed && currentMember) {
			// If parent provided onSendMessage, use it (for routing @Collective)
			if (onSendMessage) {
				onSendMessage(trimmed);
				return;
			}
			
			// Otherwise, add to group chat directly
			const newMessage: GroupChatMessageType = {
				id: `gc-${Date.now()}`,
				sender: currentUser,
				sender_name: currentMember.name,
				avatar: currentMember.avatar,
				content: trimmed,
				timestamp: new Date().toISOString(),
			};

			// Add to messages (local state for demo)
			messages = [...messages, newMessage];

			// Also add to global data store
			addGroupChatMessage(groupId, newMessage);

			// Scroll to bottom
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
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
		transition:slide={{ duration: 300, axis: "x" }}
		role="dialog"
		aria-label="Group chat"
	>
		<!-- Header -->
		<GlassHeader sticky={false} absolute={true}>
			{#snippet leading()}
				<Button
					variant="text"
					iconType="full"
					onclick={onClose}
					aria-label="Close group chat"
				>
					<Icon icon={iconArrowBack} />
				</Button>
			{/snippet}

			{#snippet titleContent()}
				<div class="chat-header-title">
					<h2 class="group-name m3-font-title-medium">
						{group?.name || "Group"}
					</h2>
					<p class="chat-subtitle m3-font-body-small">Group Chat</p>
				</div>
			{/snippet}
		</GlassHeader>

		<!-- Messages Area -->
		<div class="messages-area custom-scrollbar" bind:this={messagesContainer}>
			<div class="messages-container">
				{#each messages as message (message.id)}
					<GroupChatMessage {message} onQuickReply={onQuickReply} />
				{/each}
			</div>
		</div>

		<!-- Input Area -->
		<ChatInput 
			onSend={handleSend}
			placeholder="Type a message..."
			enableReferences={true}
			members={chatMembers}
		/>
	</div>
{/if}

<style>
	.overlay-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: var(--z-modal-backdrop);
		cursor: pointer;
		border: none;
	}

	.group-chat-panel {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: var(--group-chat-width, 400px);
		max-width: 100vw;
		background-color: rgb(var(--m3-scheme-surface-container-low));
		box-shadow: var(--m3-util-elevation-3);
		z-index: var(--z-drawer);
		display: flex;
		flex-direction: column;
	}

	.chat-header-title {
		display: flex;
		flex-direction: column;
		align-items: flex-star;
		gap: 0.125rem;
		text-align: flex-start;
	}

	.group-name {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
		font-family: var(--font-sans) !important;
		line-height: 1.2;
	}

	.chat-subtitle {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin: 0;
		font-family: var(--font-sans) !important;
		line-height: 1.2;
		/* opacity: 0.7; */
	}

	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
		overflow-x: hidden;
		padding-top: 4rem;
		padding-bottom: 1rem;
		/* width: 400px; */
		width: var(--group-chat-width, 400px);
	}

	.messages-container {
		display: flex;
		flex-direction: column;
	}

	/* Mobile: full screen overlay */
	@media (max-width: 640px) {
		.group-chat-panel {
			width: 100vw;

			--group-chat-width: 100vw;
		}

		.messages-area {
			padding: 1rem;
			padding-top: 5rem;
			padding-bottom: 1rem;
			width: var(--group-chat-width, 100vw);
		}
	}
</style>
