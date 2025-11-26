<script lang="ts">
	import { goto } from '$app/navigation';
	import { Chip } from 'm3-svelte';
	import { getAllGroups } from '$lib/data/groups';
	import { getCurrentUser, getConversationReadOnly, getAllMembers, setNavigationDirection } from '$lib/stores/app.svelte';
	import { setLastActiveTab } from '$lib/stores/features.svelte';
	import { getNavigationPath } from '$lib/utils/modeHelpers';
	import type { Message } from '$lib/data/scenarios';
	import MessageBubble from './MessageBubble.svelte';
	import UserMessage from './UserMessage.svelte';
	
	const groups = getAllGroups();
	const members = getAllMembers();
	const currentUser = $derived(getCurrentUser());
	
	// State for selected filter
	let selectedFilter = $state<string>('all');
	
	// Derived data: all AI messages from all groups
	interface FeedMessage extends Message {
		groupId: string;
		groupName: string;
		groupIcon: string;
		userId: string;
	}
	
	let allMessages = $derived.by(() => {
		const messages: FeedMessage[] = [];
		
		groups.forEach(group => {
			if (!group.members) return;
			
			group.members.forEach(memberId => {
				const conversation = getConversationReadOnly(memberId as any, group.id);
				
				conversation.forEach(msg => {
					if (msg.sender === 'ai') {
						messages.push({
							...msg,
							groupId: group.id,
							groupName: group.name,
							groupIcon: group.icon,
							userId: memberId
						});
					}
				});
			});
		});
		
		// Sort by timestamp (oldest first, like in AI chat)
		return messages.sort((a, b) => 
			new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
		);
	});
	
	// Filtered messages based on selected group
	let filteredMessages = $derived.by(() => {
		if (selectedFilter === 'all') {
			return allMessages;
		}
		return allMessages.filter(msg => msg.groupId === selectedFilter);
	});
	
	function handleFilterSelect(filterId: string) {
		selectedFilter = filterId;
	}
	
	function handleGroupClick(groupId: string) {
		// Save that we're on the feed tab before navigating
		setLastActiveTab('feed');
		setNavigationDirection('forward');
		
		// Use mode-aware navigation path
		const path = getNavigationPath('feedMessageClick', groupId);
		goto(path);
	}
</script>

<div class="feed-view">
	<!-- Filter Chips -->
	<div class="filter-chips">
		<!-- Left spacer for visual alignment -->
		<div class="filter-spacer"></div>
		
		<Chip
			variant="general"
			selected={selectedFilter === 'all'}
			onclick={() => handleFilterSelect('all')}
		>
			All
		</Chip>
		{#each groups as group}
			<Chip
				variant="general"
				selected={selectedFilter === group.id}
				onclick={() => handleFilterSelect(group.id)}
			>
				{group.icon} {group.name}
			</Chip>
		{/each}
		
		<!-- Right spacer for scroll end padding -->
		<div class="filter-spacer"></div>
	</div>
	
	<!-- Messages Feed -->
	<div class="messages-feed">
		{#if filteredMessages.length === 0}
			<div class="empty-state">
				<div class="empty-icon">💬</div>
				<h3 class="m3-font-title-large">No AI interactions yet</h3>
				<p class="m3-font-body-medium">Start chatting with your groups to see interactions here</p>
			</div>
		{:else}
			{#each filteredMessages as message (message.id)}
				<div class="feed-message">
					<!-- Group Context Header -->
					<button 
						class="message-context"
						onclick={() => handleGroupClick(message.groupId)}
						aria-label="Go to {message.groupName}"
					>
						<span class="context-icon">{message.groupIcon}</span>
						<span class="context-group m3-font-label-medium">{message.groupName}</span>
						<span class="context-separator">•</span>
						<span class="context-time m3-font-label-small">
							{new Date(message.timestamp).toLocaleString(undefined, {
								month: 'short',
								day: 'numeric',
								hour: 'numeric',
								minute: '2-digit'
							})}
						</span>
					</button>
					
					<!-- Message Bubble -->
					<MessageBubble {message} />
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.feed-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: rgb(var(--m3-scheme-background));
	}
	
	.filter-chips {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 0; /* Remove horizontal padding for edge-to-edge scroll */
		overflow-x: auto;
		overflow-y: hidden;
		/* border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant)); */
		background: rgb(var(--m3-scheme-surface));
		position: sticky;
		top: 0;
		z-index: 100;
		
		/* Hide scrollbar */
		scrollbar-width: none;
		-ms-overflow-style: none;
		
		/* Enable smooth scrolling */
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch; /* iOS momentum scrolling */

        :global(button) {
            border-radius: var(--m3-util-rounding-large);
        }
	}
	
	.filter-chips::-webkit-scrollbar {
		display: none;
	}
	
	/* Spacer for visual alignment */
	.filter-spacer {
		flex-shrink: 0;
		width: 1.5rem; /* Same as the removed horizontal padding */
	}
	
	/* Ensure chips don't shrink and maintain natural width */
	.filter-chips :global(.m3-chip),
	.filter-chips > :global(*:not(.filter-spacer)) {
		flex-shrink: 0;
		width: auto;
		min-width: fit-content;
	}
	
	.messages-feed {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.feed-message {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.message-context {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		padding: 0.5rem;
		background: none;
		border: none;
		border-radius: var(--m3-util-rounding-medium);
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: left;
		width: fit-content;
	}
	
	.message-context:hover {
		background-color: rgb(var(--m3-scheme-surface-container-high));
	}
	
	.message-context:active {
		background-color: rgb(var(--m3-scheme-surface-container-highest));
	}
	
	.context-icon {
		font-size: 1rem;
	}
	
	.context-group {
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.context-separator {
		color: rgb(var(--m3-scheme-outline));
	}
	
	.context-time {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 1rem;
		padding: 3rem 1.5rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.empty-icon {
		font-size: 4rem;
		opacity: 0.5;
	}
	
	.empty-state h3 {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.empty-state p {
		margin: 0;
		max-width: 300px;
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.filter-chips {
			padding: 0.75rem 0; /* Keep edge-to-edge on mobile */
		}
		
		.filter-spacer {
			width: 1rem; /* Match mobile padding */
		}
		
		.messages-feed {
			padding: 1rem;
		}
	}
</style>

