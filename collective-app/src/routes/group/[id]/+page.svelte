<script lang="ts">
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import MessageBubble from "$lib/components/MessageBubble.svelte";
	import UserMessage from "$lib/components/UserMessage.svelte";
	import MorphReplyButtons from "$lib/components/MorphReplyButtons.svelte";
	import TypingIndicator from "$lib/components/TypingIndicator.svelte";
	import ChatInput from "$lib/components/ChatInput.svelte";
	import TaskCard from "$lib/components/TaskCard.svelte";
	import ExpenseCard from "$lib/components/ExpenseCard.svelte";
	import ShoppingCard from "$lib/components/ShoppingCard.svelte";
	import AnalyticsSummaryCard from "$lib/components/Cards/AnalyticsSummaryCard.svelte";
	import AnalyticsDetailCard from "$lib/components/Cards/AnalyticsDetailCard.svelte";
	import GroupChat from "$lib/components/GroupChat.svelte";
	import GlassHeader from "$lib/components/GlassHeader.svelte";
	import { Icon, Button } from "m3-svelte";
	import iconArrowBack from "@ktibow/iconset-material-symbols/arrow-back";
	import iconChat from "@ktibow/iconset-material-symbols/chat";
	import { sharedAxisTransition } from "m3-svelte";
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
		getNavigationDirection,
		getSelectedReplyIds,
		setSelectedReplyId,
	} from "$lib/stores/app.svelte";
	import { viewMyTasksScenario } from "$lib/data/scenarios";
	import type { Message, QuickReply } from "$lib/data/scenarios";
	import { getItemsByUser, type CoordinatedItem } from "$lib/data/items";
	import {
		getAllUsersAnalytics,
		getGroupWeekAnalytics,
		getGroupMonthAnalytics,
	} from "$lib/data/analytics";
	import { getGroupById } from "$lib/data/groups";
	import { addGroupChatMessage, type GroupChatMessage as GroupChatMessageType } from "$lib/data/groupChat";

	// Get group ID from route params
	let groupId = $derived($page.params.id || "brooklyn-apt");
	let group = $derived(getGroupById(groupId));

	let currentUser = $derived(getCurrentUser());
	let conversation = $derived(getCurrentConversation());
	let memberInfo = $derived(getMemberInfo(currentUser));
	let typingVisible = $derived(getTypingIndicatorVisible());
	let navDirection = $derived(getNavigationDirection());
	let selectedReplyIds = $derived(getSelectedReplyIds());

	let messagesContainer: HTMLDivElement;
	let groupChatOpen = $state(false);
	
	// Track typing state for each message
	let messageTypingStates = $state<Record<string, boolean>>({});

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (conversation && messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: "smooth",
				});
			}, 100);
		}
	});

	// Unified message handler - routes to AI or group chat based on active view
	function handleSendMessage(content: string) {
		if (groupChatOpen) {
			// Send to group chat
			handleSendToGroupChat(content);
		} else {
			// Send to AI chat
			handleSendToAI(content);
		}
	}

	// Handle sending message to AI chat
	function handleSendToAI(content: string) {
		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			sender: "user",
			content,
			timestamp: new Date().toISOString(),
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
			handleQuickReply("tasks", content);
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
			handleQuickReply("fairness", content);
			return;
		}

		// Scenario 3: Trade a Chore
		if (
			lowerContent.includes("trade") ||
			lowerContent.includes("swap") ||
			lowerContent.includes("switch") ||
			(lowerContent.includes("someone else") &&
				lowerContent.includes("chore"))
		) {
			handleQuickReply("trade", content);
			return;
		}

		// Scenario 4: How's the House
		if (
			lowerContent.includes("how's the house") ||
			lowerContent.includes("hows the house") ||
			lowerContent.includes("house doing")
		) {
			handleQuickReply("house", content);
			return;
		}

		// Scenario 6: Complete a Task
		if (
			lowerContent.includes("done with") ||
			lowerContent.includes("finished") ||
			lowerContent.includes("completed") ||
			lowerContent.includes("mark as done")
		) {
			handleQuickReply("complete", content);
			return;
		}

		// Default fallback response
		setTimeout(() => {
			sendAIResponse(
				"I'm not quite sure what you mean by that. Try asking about your tasks, fairness, or trading chores!",
				{
					quick_replies: [
						{ label: "What's on my plate?", value: "tasks" },
						{ label: "Am I doing enough?", value: "fairness" },
						{ label: "Can I trade a chore?", value: "trade" },
					],
				},
			);
		}, 1000);
	}

	// Handle sending message to group chat
	function handleSendToGroupChat(content: string) {
		const trimmed = content.trim();
		if (trimmed && memberInfo) {
			const newMessage: GroupChatMessageType = {
				id: `gc-${Date.now()}`,
				sender: currentUser,
				sender_name: memberInfo.name,
				avatar: memberInfo.avatar,
				content: trimmed,
				timestamp: new Date().toISOString()
			};
			
			// Add to global data store
			addGroupChatMessage(groupId, newMessage);
		}
	}

	// Handle quick reply selection
	function handleQuickReply(
		value: string,
		label: string,
		messageToAdd?: Message,
	) {
		// Store selection state AFTER animation completes (600ms animation duration)
		// We find the latest AI message that has these quick replies
		const lastAiMessage = conversation
			.filter((m) => m.sender === "ai" && m.ui_elements?.quick_replies)
			.pop();
		if (lastAiMessage) {
			setTimeout(() => {
				setSelectedReplyId(lastAiMessage.id, value);
			}, 650); // Slightly after animation completes
		}

		// If message is provided (after morph completes), add it
		if (messageToAdd) {
			addMessage(messageToAdd);
		}

		// Handle based on value
		if (value === "show_tasks" || value === "tasks") {
			setTimeout(() => {
				sendAIResponse("Alright, here's your week:", {
					card_schema: {
						template: 'summary',
						data: {
							chores: [
								{ title: 'Kitchen cleanup', due: 'Wed evening' },
								{ title: 'Trash out', due: 'Saturday morning' }
							],
							money: [
								{ title: 'You owe Mike $23.50 for groceries' },
								{ title: 'Jessica paid utilities - your share is $42' }
							],
							shopping: [
								{ title: 'Bob needs milk - you pass the bodega, mind grabbing it today?' }
							]
						}
					},
					quick_replies: [
						{ label: "Looks good", value: "confirm" },
						{ label: "Send me reminders", value: "reminders" },
					],
				});
			}, 1000);
		} else if (value === "fairness") {
			setTimeout(() => {
				const allUsers = getAllUsersAnalytics();
				const userData = allUsers[currentUser].week;

				sendAIResponse(
					`You've been really consistent lately.\n\nThis week you finished all ${userData.tasks_completed} tasks, all on time. Last month you completed ${userData.tasks_completed} assigned.\n\nWant to see the full breakdown?`,
					{
						quick_replies: [
							{ label: "Yeah, show me", value: "show_summary" },
							{ label: "Nah, sounds good", value: "sounds_good" },
						],
					},
				);
			}, 1000);
		} else if (value === "show_summary") {
			setTimeout(() => {
				sendAIResponse("Here's the full picture:", {
					analytics_summary: true,
				});
				setTimeout(() => {
					sendAIResponse(
						"No major imbalances. You're doing slightly more than average, which is great. Overall the house is humming along.",
						{
							quick_replies: [
								{
									label: "Show me trends over time",
									value: "show_trends",
								},
								{ label: "Thanks!", value: "thanks" },
							],
						},
					);
				}, 500);
			}, 1000);
		} else if (value === "show_trends") {
			setTimeout(() => {
				sendAIResponse("Let me pull up your analytics.", {
					analytics_detail: true,
				});
				setTimeout(() => {
					sendAIResponse(
						"You're one of the most reliable in the household. Consistently on time, rarely miss anything.",
					);
				}, 500);
			}, 1000);
		} else if (value === "trade") {
			setTimeout(() => {
				sendAIResponse(
					"Let me check who's available… Want me to propose a swap?",
					{
						quick_replies: [
							{ label: "Yes please", value: "yes_trade" },
							{ label: "Never mind", value: "cancel" },
						],
					},
				);
			}, 1000);
		} else if (value === "house") {
			setTimeout(() => {
				sendAIResponse(
					"Everyone's pulling their weight this week. No drama, everyone's good.",
					{
						quick_replies: [
							{ label: "Show me details", value: "show_summary" },
							{ label: "Cool, thanks", value: "thanks" },
						],
					},
				);
			}, 1000);
		} else if (value === "complete") {
			setTimeout(() => {
				sendAIResponse("Nice! Which task did you complete?", {
					quick_replies: [
						{ label: "Kitchen cleanup", value: "complete_kitchen" },
						{ label: "Trash", value: "complete_trash" },
					],
				});
			}, 1000);
		} else if (value === "reminders") {
			setTimeout(() => {
				sendAIResponse(
					"You got it. I'll bug you:\n• Wednesday 6pm for kitchen\n• Saturday 9am for trash\n\nWant them earlier/later?",
					{
						quick_replies: [
							{ label: "Earlier", value: "earlier" },
							{ label: "Later", value: "later" },
							{ label: "Perfect", value: "perfect" },
						],
					},
				);
			}, 1000);
		} else if (
			value === "perfect" ||
			value === "sounds_good" ||
			value === "thanks" ||
			value === "confirm"
		) {
			setTimeout(() => {
				sendAIResponse("Great! Let me know if you need anything else.");
			}, 800);
		}
	}

	// Handle back button
	function handleBack() {
		setNavigationDirection("back");
		goto("/groups");
	}

	// Handle group chat toggle
	function handleGroupChatToggle() {
		groupChatOpen = !groupChatOpen;
	}

	// Load initial scenario on mount
	onMount(() => {
		// Validate group exists and is active
		if (!group || !group.is_active) {
			goto("/groups");
			return;
		}

		// Set current group in app state
		setCurrentGroup(groupId);

		// Load the first scenario for Sarah
		if (conversation.length === 0) {
			const initialMessages = viewMyTasksScenario.messages.slice(0, 1);
			initialMessages.forEach((msg) => addMessage(msg));
		}
	});
</script>

<div class="app-container">
	<!-- Animated Background -->
	<div class="background-gradient"></div>

	<!-- Header -->
	<!-- <div
		in:sharedAxisTransition={{
			direction: navDirection === "back" ? "X" : "X",
			rightSeam: navDirection !== "back",
		}}
	> -->
		<GlassHeader title={group?.name || "Group"} zIndex={200} absolute={true} sticky={false}>
			{#snippet leading()}
				<Button
					variant="text"
					iconType="full"
					onclick={handleBack}
					aria-label="Back to groups"
				>
					<Icon icon={iconArrowBack} />
				</Button>
			{/snippet}

			{#snippet trailing()}
				<Button
					variant="text"
					iconType="full"
					onclick={handleGroupChatToggle}
					aria-label="Open group chat"
				>
					<Icon icon={iconChat} />
				</Button>
			{/snippet}
		</GlassHeader>
	<!-- </div> -->

	<!-- Messages Area -->
	<div class="messages-area custom-scrollbar" bind:this={messagesContainer}>
		<div
			class="messages-container"
			in:sharedAxisTransition={{
				direction: "X",
				rightSeam: navDirection !== "back",
			}}
		>
			{#each conversation as message, index (message.id)}
				{#if message.sender === "ai"}
					<MessageBubble 
						{message} 
						onTypingChange={(isTyping) => {
							messageTypingStates[message.id] = isTyping;
						}}
					/>

					{#if message.ui_elements?.quick_replies}
						{@const hasUserMessageAfter = conversation
							.slice(index + 1)
							.some((m) => m.sender === "user")}
						{@const savedSelection = selectedReplyIds[message.id]}
						{@const isTyping = messageTypingStates[message.id] ?? false}
						{#if !hasUserMessageAfter && !isTyping}
							{#if savedSelection}
								<!-- Show as bubble if already selected -->
								{@const selectedOption =
									message.ui_elements.quick_replies.find(
										(qr) => qr.value === savedSelection,
									)}
								<UserMessage
									mode="bubble"
									message={{
										id: `reply-${message.id}`,
										sender: "user",
										content: selectedOption?.label || "",
										timestamp: new Date().toISOString(),
									}}
								/>
							{:else}
								<!-- Show morphing buttons if not yet selected and not typing -->
								<MorphReplyButtons
									options={message.ui_elements.quick_replies.map(
										(qr) => ({
											id: qr.value,
											label: qr.label,
										}),
									)}
									onSelect={(id, label) =>
										handleQuickReply(id, label)}
								/>
							{/if}
						{/if}
					{/if}
				{:else}
					<UserMessage mode="bubble" {message} />
				{/if}

				{#if message.ui_elements?.cards}
					<div class="cards-container">
						{#each message.ui_elements.cards as item}
							{#if item.item_type === "chore"}
								<TaskCard {item} />
							{:else if item.item_type === "expense"}
								<ExpenseCard {item} />
							{:else if item.item_type === "shopping_item"}
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
	<div class="chat-input-container">
		<ChatInput 
			onSend={handleSendMessage}
			placeholder={groupChatOpen ? "Message group..." : "Type a message..."}
		/>
	</div>

	<!-- Group Chat Overlay -->
	<GroupChat
		{groupId}
		isOpen={groupChatOpen}
		onClose={() => (groupChatOpen = false)}
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

		/* :global(.group-chat-panel):before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgb(var(--m3-scheme-secondary));
				z-index: 1;
				pointer-events: none;
				mix-blend-mode: overlay;


		} */
	}

	/* [data-mode="dark"] .app-container :global(.group-chat-panel):before {
		
		
	}

	[data-mode="light"] :global(.group-chat-panel):before {
		mix-blend-mode: overlay;
	
	} */

	.chat-input-container {
		/* display: contents; */
		
		z-index: var(--z-chat-input);
	}

	.background-gradient {
		position: fixed;
		inset: 0;
		background: rgb(var(--m3-scheme-background));
		z-index: -1;
	}

	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-5);
		scroll-behavior: smooth;
		padding-top: 5rem;
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
		.messages-area {
			padding: var(--space-4);
		padding-top: 5rem;

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
