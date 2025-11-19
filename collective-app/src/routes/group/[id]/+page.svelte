<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MessageBubble from '$lib/components/MessageBubble.svelte';
	import QuickReplyButtons from '$lib/components/QuickReplyButtons.svelte';
	import TypingIndicator from '$lib/components/TypingIndicator.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import TaskCard from '$lib/components/TaskCard.svelte';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import ShoppingCard from '$lib/components/ShoppingCard.svelte';
	import AnalyticsSummaryCard from '$lib/components/Cards/AnalyticsSummaryCard.svelte';
	import AnalyticsDetailCard from '$lib/components/Cards/AnalyticsDetailCard.svelte';
	import GroupChat from '$lib/components/GroupChat.svelte';
	import { Icon, Button } from 'm3-svelte';
	import iconArrowBack from '@ktibow/iconset-material-symbols/arrow-back';
	import iconGroup from '@ktibow/iconset-material-symbols/group';
	import { sharedAxisTransition } from 'm3-svelte';
	import {
		getCurrentUser,
		getCurrentConversation,
		getMemberInfo,
		addMessage,
		getTypingIndicatorVisible,
		sendAIResponse,
		setDemoMenuOpen,
		loadScenario,
		setCurrentGroup,
		setNavigationDirection,
		getNavigationDirection
	} from '$lib/stores/app.svelte';
	import { viewMyTasksScenario } from '$lib/data/scenarios';
	import type { Message, QuickReply } from '$lib/data/scenarios';
	import { getItemsByUser, type CoordinatedItem } from '$lib/data/items';
	import {
		getAllUsersAnalytics,
		getGroupWeekAnalytics,
		getGroupMonthAnalytics
	} from '$lib/data/analytics';
	import { getGroupById } from '$lib/data/groups';
	
	// Get group ID from route params
	let groupId = $derived($page.params.id || 'brooklyn-apt');
	let group = $derived(getGroupById(groupId));
	
	let currentUser = $derived(getCurrentUser());
	let conversation = $derived(getCurrentConversation());
	let memberInfo = $derived(getMemberInfo(currentUser));
	let typingVisible = $derived(getTypingIndicatorVisible());
	let navDirection = $derived(getNavigationDirection());
	
	let messagesContainer: HTMLDivElement;
	let groupChatOpen = $state(false);
	
	// Track the last message with quick replies that should show buttons
	let lastQuickReplyMessageId = $state<string | null>(null);
	
	// Effect to update which quick reply buttons should show
	$effect(() => {
		// Find the last message with quick replies
		let foundMessageId: string | null = null;
		let foundIndex = -1;
		
		for (let i = conversation.length - 1; i >= 0; i--) {
			if (conversation[i].ui_elements?.quick_replies) {
				foundMessageId = conversation[i].id;
				foundIndex = i;
				break;
			}
		}
		
		// Check if there are any user messages after this quick reply message
		if (foundMessageId !== null && foundIndex !== -1) {
			let hasUserMessageAfter = false;
			for (let i = foundIndex + 1; i < conversation.length; i++) {
				if (conversation[i].sender === 'user') {
					hasUserMessageAfter = true;
					break;
				}
			}
			
			// Only show buttons if no user message has come after them
			lastQuickReplyMessageId = hasUserMessageAfter ? null : foundMessageId;
		} else {
			lastQuickReplyMessageId = foundMessageId;
		}
	});
	
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
		
		// Detect user intent and route to appropriate scenario
		const lowerContent = content.toLowerCase().trim();
		
		// Scenario 1: View My Tasks
		if (
			lowerContent.includes("what's on my plate") ||
			lowerContent.includes("whats on my plate") ||
			lowerContent.includes("my plate") ||
			lowerContent.includes("my tasks") ||
			lowerContent.includes("what do i have")
		) {
			handleQuickReply('tasks', content);
			return;
		}
		
		// Scenario 2: How Am I Doing / Fairness
		if (
			lowerContent.includes("how am i doing") ||
			lowerContent.includes("am i doing enough") ||
			lowerContent.includes("my fair share") ||
			lowerContent.includes("fairness") ||
			lowerContent.includes("doing my part")
		) {
			handleQuickReply('fairness', content);
			return;
		}
		
		// Scenario 3: Trade a Chore
		if (
			lowerContent.includes("trade") ||
			lowerContent.includes("swap") ||
			lowerContent.includes("switch") ||
			(lowerContent.includes("someone else") && lowerContent.includes("chore"))
		) {
			handleQuickReply('trade', content);
			return;
		}
		
		// Scenario 4: How's the House
		if (
			lowerContent.includes("how's the house") ||
			lowerContent.includes("hows the house") ||
			lowerContent.includes("house doing")
		) {
			handleQuickReply('house', content);
			return;
		}
		
		// Scenario 6: Complete a Task
		if (
			lowerContent.includes("done with") ||
			lowerContent.includes("finished") ||
			lowerContent.includes("completed") ||
			lowerContent.includes("mark as done")
		) {
			handleQuickReply('complete', content);
			return;
		}
		
		// Default fallback response
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
		// Only add user message if not already added (avoid duplicates from handleSendMessage)
		if (conversation.length === 0 || conversation[conversation.length - 1].content !== label) {
			const userMessage: Message = {
				id: `msg-${Date.now()}`,
				sender: 'user',
				content: label,
				timestamp: new Date().toISOString()
			};
			
			addMessage(userMessage);
		}
		
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
		} else if (value === 'fairness') {
			setTimeout(() => {
				const allUsers = getAllUsersAnalytics();
				const userData = allUsers[currentUser].week;
				
				sendAIResponse(
					`You've been really consistent lately.\n\nThis week you finished all ${userData.tasks_completed} tasks, all on time. Last month you completed ${userData.tasks_completed} assigned.\n\nWant to see the full breakdown?`,
					{
						quick_replies: [
							{ label: 'Yeah, show me', value: 'show_summary' },
							{ label: 'Nah, sounds good', value: 'sounds_good' }
						]
					}
				);
			}, 1000);
		} else if (value === 'show_summary') {
			setTimeout(() => {
				sendAIResponse("Here's the full picture:", {
					analytics_summary: true
				});
				setTimeout(() => {
					sendAIResponse(
						"No major imbalances. You're doing slightly more than average, which is great. Overall the house is humming along.",
						{
							quick_replies: [
								{ label: 'Show me trends over time', value: 'show_trends' },
								{ label: 'Thanks!', value: 'thanks' }
							]
						}
					);
				}, 500);
			}, 1000);
		} else if (value === 'show_trends') {
			setTimeout(() => {
				sendAIResponse('Let me pull up your analytics.', {
					analytics_detail: true
				});
				setTimeout(() => {
					sendAIResponse("You're one of the most reliable in the household. Consistently on time, rarely miss anything.");
				}, 500);
			}, 1000);
		} else if (value === 'trade') {
			setTimeout(() => {
				sendAIResponse(
					"Let me check who's available… Want me to propose a swap?",
					{
						quick_replies: [
							{ label: 'Yes please', value: 'yes_trade' },
							{ label: 'Never mind', value: 'cancel' }
						]
					}
				);
			}, 1000);
		} else if (value === 'house') {
			setTimeout(() => {
				sendAIResponse(
					"Everyone's pulling their weight this week. No drama, everyone's good.",
					{
						quick_replies: [
							{ label: 'Show me details', value: 'show_summary' },
							{ label: 'Cool, thanks', value: 'thanks' }
						]
					}
				);
			}, 1000);
		} else if (value === 'complete') {
			setTimeout(() => {
				sendAIResponse(
					"Nice! Which task did you complete?",
					{
						quick_replies: [
							{ label: 'Kitchen cleanup', value: 'complete_kitchen' },
							{ label: 'Trash', value: 'complete_trash' }
						]
					}
				);
			}, 1000);
		} else if (value === 'reminders') {
			setTimeout(() => {
				sendAIResponse(
					"You got it. I'll bug you:\n• Wednesday 6pm for kitchen\n• Saturday 9am for trash\n\nWant them earlier/later?",
					{
						quick_replies: [
							{ label: 'Earlier', value: 'earlier' },
							{ label: 'Later', value: 'later' },
							{ label: 'Perfect', value: 'perfect' }
						]
					}
				);
			}, 1000);
		} else if (value === 'perfect' || value === 'sounds_good' || value === 'thanks' || value === 'confirm') {
			setTimeout(() => {
				sendAIResponse("Great! Let me know if you need anything else.");
			}, 800);
		}
	}
	
	// Handle back button
	function handleBack() {
		setNavigationDirection('back');
		goto('/groups');
	}
	
	// Handle group chat toggle
	function handleGroupChatToggle() {
		groupChatOpen = !groupChatOpen;
	}
	
	// Load initial scenario on mount
	onMount(() => {
		// Validate group exists and is active
		if (!group || !group.is_active) {
			goto('/groups');
			return;
		}
		
		// Set current group in app state
		setCurrentGroup(groupId);
		
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
	<header 
		class="app-header"
		in:sharedAxisTransition={{ 
			direction: navDirection === 'back' ? 'X' : 'X', 
			rightSeam: navDirection !== 'back'
		}}
	>
		<!-- Back Button -->
		<Button variant="text" iconType="full" onclick={handleBack} aria-label="Back to groups">
			<Icon icon={iconArrowBack} />
		</Button>
		
		<!-- Group Title -->
		<div class="group-title-container">
			<h1 class="group-title m3-font-title-large">{group?.name || 'Group'}</h1>
		</div>
		
		<!-- Group Chat Icon -->
		<Button variant="text" iconType="full" onclick={handleGroupChatToggle} aria-label="Open group chat">
			<Icon icon={iconGroup} />
		</Button>
	</header>
	
	<!-- Messages Area -->
	<div class="messages-area custom-scrollbar" bind:this={messagesContainer}>
		<div 
			class="messages-container"
			in:sharedAxisTransition={{ 
				direction: 'X', 
				rightSeam: navDirection !== 'back'
			}}
		>
			{#each conversation as message (message.id)}
				<MessageBubble {message} />
				
				{#if message.ui_elements?.quick_replies && message.id === lastQuickReplyMessageId}
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
	
	<!-- Group Chat Overlay -->
	<GroupChat 
		{groupId}
		isOpen={groupChatOpen}
		onClose={() => groupChatOpen = false}
	/>
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
		background: rgb(var(--m3-scheme-background));
		z-index: -1;
	}
	
	.app-header {
		position: sticky;
		top: 0;
		z-index: 200;
		padding: 1rem 1.5rem;
		background-color: rgba(var(--m3-scheme-surface), 0.8);
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.group-title-container {
		flex: 1;
		text-align: center;
		min-width: 0;
	}
	
	.group-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
		white-space: nowrap;
		font-family: var(--font-sans) !important;
		overflow: hidden;
		text-overflow: ellipsis;
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
		
		.group-title {
			font-size: var(--text-base);
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

