<script lang="ts">
	import { onMount } from 'svelte';
	import MessageBubble from '$lib/components/MessageBubble.svelte';
	import QuickReplyButtons from '$lib/components/QuickReplyButtons.svelte';
	import TypingIndicator from '$lib/components/TypingIndicator.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import MetaMenu from '$lib/components/MetaMenu.svelte';
	import TaskCard from '$lib/components/TaskCard.svelte';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import ShoppingCard from '$lib/components/ShoppingCard.svelte';
	import AnalyticsSummaryCard from '$lib/components/Cards/AnalyticsSummaryCard.svelte';
	import AnalyticsDetailCard from '$lib/components/Cards/AnalyticsDetailCard.svelte';
	import {
		getCurrentUser,
		getCurrentConversation,
		getMemberInfo,
		addMessage,
		getTypingIndicatorVisible,
		sendAIResponse,
		setDemoMenuOpen,
		loadScenario
	} from '$lib/stores/app.svelte';
	import { viewMyTasksScenario } from '$lib/data/scenarios';
	import type { Message, QuickReply } from '$lib/data/scenarios';
	import { getItemsByUser, type CoordinatedItem } from '$lib/data/items';
	import {
		getAllUsersAnalytics,
		getGroupWeekAnalytics,
		getGroupMonthAnalytics
	} from '$lib/data/analytics';
	
	let currentUser = $derived(getCurrentUser());
	let conversation = $derived(getCurrentConversation());
	let memberInfo = $derived(getMemberInfo(currentUser));
	let typingVisible = $derived(getTypingIndicatorVisible());
	
	let messagesContainer: HTMLDivElement;
	let tapCount = 0;
	let tapTimeout: ReturnType<typeof setTimeout>;
	
	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (conversation && messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: 'smooth'
				});
			}, 100);
		}
	});
	
	// Handle message send
	function handleSendMessage(content: string) {
		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			sender: 'user',
			content,
			timestamp: new Date().toISOString()
		};
		
		addMessage(userMessage);
		
		// Simulate AI response
		setTimeout(() => {
			sendAIResponse(
				"I'm not quite sure what you mean by that. Try asking about your tasks, fairness, or trading chores!",
				{
					quick_replies: [
						{ label: "What's on my plate?", value: 'tasks' },
						{ label: 'Am I doing enough?', value: 'fairness' },
						{ label: 'Can I trade a chore?', value: 'trade' }
					]
				}
			);
		}, 1000);
	}
	
	// Handle quick reply selection
	function handleQuickReply(value: string, label: string) {
		// Add user message
		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			sender: 'user',
			content: label,
			timestamp: new Date().toISOString()
		};
		
		addMessage(userMessage);
		
		// Handle based on value
		if (value === 'show_tasks' || value === 'tasks') {
			setTimeout(() => {
				const items = getItemsByUser(currentUser);
				const chores = items.filter(i => i.item_type === 'chore' && i.status === 'pending');
				const expenses = items.filter(i => i.item_type === 'expense');
				const shopping = items.filter(i => i.item_type === 'shopping_item');
				
				const content = `Alright, here's your week:\n\n📋 Chores: ${chores.length}\n💰 Money: ${expenses.length} items\n🛒 Shopping: ${shopping.length} items`;
				
				sendAIResponse(content, {
					quick_replies: [
						{ label: 'Looks good', value: 'confirm' },
						{ label: 'Send me reminders', value: 'reminders' }
					]
				});
			}, 1000);
		}
	}
	
	// Handle logo tap (triple-tap to open menu)
	function handleLogoTap() {
		tapCount++;
		clearTimeout(tapTimeout);
		
		if (tapCount === 3) {
			setDemoMenuOpen(true);
			tapCount = 0;
		} else {
			tapTimeout = setTimeout(() => {
				tapCount = 0;
			}, 500);
		}
	}
	
	// Load initial scenario on mount
	onMount(() => {
		// Load the first scenario for Sarah
		if (conversation.length === 0) {
			const initialMessages = viewMyTasksScenario.messages.slice(0, 1);
			initialMessages.forEach(msg => addMessage(msg));
		}
	});
</script>

<div class="app-container">
	<!-- Animated Background -->
	<div class="background-gradient"></div>
	
	<!-- Header -->
	<header class="app-header">
		<button class="logo" onclick={handleLogoTap} aria-label="Open menu">
			<span class="logo-text">Collective</span>
		</button>
		
		<div class="user-indicator">
			<span class="user-avatar">{memberInfo?.avatar}</span>
			<span class="user-name">{memberInfo?.name}</span>
		</div>
	</header>
	
	<!-- Messages Area -->
	<div class="messages-area custom-scrollbar" bind:this={messagesContainer}>
		<div class="messages-container">
			{#each conversation as message (message.id)}
				<MessageBubble {message} />
				
				{#if message.ui_elements?.quick_replies}
					<QuickReplyButtons 
						buttons={message.ui_elements.quick_replies}
						onSelect={handleQuickReply}
					/>
				{/if}
				
				{#if message.ui_elements?.cards}
					<div class="cards-container">
						{#each message.ui_elements.cards as item}
							{#if item.item_type === 'chore'}
								<TaskCard {item} />
							{:else if item.item_type === 'expense'}
								<ExpenseCard {item} />
							{:else if item.item_type === 'shopping_item'}
								<ShoppingCard {item} />
							{/if}
						{/each}
					</div>
				{/if}
				
				{#if message.ui_elements?.analytics_summary}
					{@const allUsers = getAllUsersAnalytics()}
					{@const groupData = getGroupWeekAnalytics()}
					{@const userData = allUsers[currentUser].week}
					<div class="cards-container">
						<AnalyticsSummaryCard 
							userId={currentUser}
							{userData}
							{groupData}
							{allUsers}
						/>
					</div>
				{/if}
				
				{#if message.ui_elements?.analytics_detail}
					{@const allUsers = getAllUsersAnalytics()}
					{@const groupData = getGroupMonthAnalytics()}
					{@const userData = allUsers[currentUser].month}
					<div class="cards-container">
						<AnalyticsDetailCard 
							userId={currentUser}
							{userData}
							{groupData}
						/>
					</div>
				{/if}
			{/each}
			
			{#if typingVisible}
				<TypingIndicator />
			{/if}
		</div>
	</div>
	
	<!-- Chat Input -->
	<ChatInput onSend={handleSendMessage} />
	
	<!-- Meta Menu (Prototype Settings) -->
	<MetaMenu />
</div>

<style>
	.app-container {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.background-gradient {
		position: fixed;
		inset: 0;
		background: var(--gradient-mesh);
		z-index: -1;
	}
	
	.app-header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		padding: var(--space-4) var(--space-5);
		background-color: transparent;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	:global(html[data-mode='dark']) .app-header {
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		transition: all var(--transition-base);
	}
	
	.logo:hover {
		transform: scale(1.05);
	}
	
	.logo:active {
		transform: scale(0.95);
	}
	
	.logo-text {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
		background: var(--gradient-primary);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-family: var(--font-sans);
		letter-spacing: -0.02em;
	}
	
	.user-indicator {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-full);
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	:global(html[data-mode='dark']) .user-indicator {
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.user-avatar {
		font-size: var(--text-lg);
	}
	
	.user-name {
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--text-primary);
		font-family: var(--font-sans);
	}
	
	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-5);
		scroll-behavior: smooth;
	}
	
	.messages-container {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.cards-container {
		margin: var(--space-3) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.app-header {
			padding: var(--space-3) var(--space-4);
		}
		
		.messages-area {
			padding: var(--space-4);
		}
		
		.user-name {
			display: none;
		}
	}
	
	/* Scrollbar styling */
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}
	
	.custom-scrollbar::-webkit-scrollbar-track {
		background: var(--bg-tertiary);
		border-radius: var(--radius-full);
	}
	
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--border-secondary);
		border-radius: var(--radius-full);
	}
	
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: var(--text-tertiary);
	}
</style>
