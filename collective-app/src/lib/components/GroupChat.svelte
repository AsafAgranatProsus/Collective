<script lang="ts">
	import { onMount } from "svelte";
	import { slide, fade } from "svelte/transition";
	import GroupChatMessage from "./GroupChatMessage.svelte";
	import GlassHeader from "./GlassHeader.svelte";
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

	let { groupId, isOpen, onClose } = $props<{
		groupId: string;
		isOpen: boolean;
		onClose: () => void;
	}>();

	let messages = $state<GroupChatMessageType[]>([]);
	let inputValue = $state("");
	let messagesContainer = $state<HTMLDivElement>();

	let currentUser = $derived(getCurrentUser());
	let currentMember = $derived(getMemberInfo(currentUser));
	let group = $derived(getGroupById(groupId));

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
				timestamp: new Date().toISOString(),
			};

			// Add to messages (local state for demo)
			messages = [...messages, newMessage];

			// Also add to global data store
			addGroupChatMessage(groupId, newMessage);

			// Clear input
			inputValue = "";

			// Scroll to bottom
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
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
		<div class="messages-area" bind:this={messagesContainer}>
			<div class="messages-container">
				{#each messages as message (message.id)}
					<GroupChatMessage {message} />
				{/each}
			</div>
		</div>

		<!-- Input Area -->
		<form class="chat-input-form" onsubmit={handleSend}>
			<!-- <div class="text-field-wrapper">
				<TextField
					bind:value={inputValue}
					label="Type a message..."
					type="filled"
					onkeydown={handleKeydown}
				/>
			</div>
			<Button
				variant="filled"
				iconType="full"
				type="submit"
				disabled={!inputValue.trim()}
				aria-label="Send message"
			>
				<Icon icon={iconSend} />
			</Button> -->
		</form>
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
		/* width: 400px; */
		width: var(--group-chat-width, 400px);
	}

	.messages-container {
		display: flex;
		flex-direction: column;
	}

	.chat-input-form {
		/* display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
		background-color: rgb(var(--m3-scheme-surface-container-low)); */
		flex-shrink: 0;
		min-height: 5rem;
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
			width: var(--group-chat-width, 100vw);
		}

		.chat-input-form {
			padding: 0.75rem 1rem;
		}
	}

	/* Scrollbar styling */
	.messages-area::-webkit-scrollbar {
		width: 8px;
	}

	.messages-area::-webkit-scrollbar-track {
		background: rgb(var(--m3-scheme-surface-container));
		border-radius: var(--m3-util-rounding-full);
	}

	.messages-area::-webkit-scrollbar-thumb {
		background: rgb(var(--m3-scheme-outline));
		border-radius: var(--m3-util-rounding-full);
	}

	.messages-area::-webkit-scrollbar-thumb:hover {
		background: rgb(var(--m3-scheme-on-surface-variant));
	}
</style>
