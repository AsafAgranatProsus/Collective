<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import MessageBubble from './MessageBubble.svelte';
	import MorphReplyButtons from './MorphReplyButtons.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	import ChatInput from './ChatInput.svelte';
	import { onboardingScenario, type Message } from '$lib/data/scenarios';
	import { 
		setOnboardingGroupCreated,
		setOnboardingGroup,
		showTypingIndicator,
		hideTypingIndicator,
		startTypingIndicatorExit,
		getTypingIndicatorVisible,
		getOnboardingMessages,
		addOnboardingMessage,
		type OnboardingGroup
	} from '$lib/stores/app.svelte';
	import ChecklistSheet from './ChecklistSheet.svelte';
	
	// Checklist bottom sheet state
	let checklistOpen = $state(false);
	
	// Conversation state - now from store (persists across component remounts)
	const messages = $derived(getOnboardingMessages());
	let currentStep = $state(0);
	let typingVisible = $derived(getTypingIndicatorVisible());
	
	// Track collected group data during onboarding
	let collectedGroupData = $state<{
		type: string;
		name: string;
		memberCount: number;
		expenseName: string;
		expenseAmount: string;
	}>({
		type: '',
		name: '',
		memberCount: 0,
		expenseName: '',
		expenseAmount: ''
	});
	
	// Map group type values to icons
	const typeToIcon: Record<string, string> = {
		'type_apartment': '🏠',
		'type_family': '👨‍👩‍👧',
		'type_sports': '⚽',
		'type_trip': '✈️',
		'type_friends': '👥'
	};
	
	// Map group type values to display names
	const typeToName: Record<string, string> = {
		'type_apartment': 'Shared apartment',
		'type_family': 'Family',
		'type_sports': 'Sports team',
		'type_trip': 'Trip/event',
		'type_friends': 'Friends'
	};
	let messagesContainer: HTMLDivElement;
	
	// Track typing and card rendering states per message
	let messageTypingStates = $state<Record<string, boolean>>({});
	let messageCardStates = $state<Record<string, boolean>>({});
	
	// Track selected replies
	let selectedReplyIds = $state<Record<string, string>>({});
	
	// Current quick replies (from the last AI message)
	let currentQuickReplies = $derived(() => {
		const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai' && m.ui_elements?.quick_replies);
		return lastAiMessage?.ui_elements?.quick_replies || [];
	});
	
	// Check if we're waiting for typed input (no quick replies on last AI message)
	let waitingForTypedInput = $derived(() => {
		const lastMessage = messages[messages.length - 1];
		return lastMessage?.sender === 'ai' && !lastMessage.ui_elements?.quick_replies;
	});
	
	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (messages && messagesContainer) {
			scrollToBottom();
		}
	});
	
	// Scroll to bottom helper - call this whenever we need to scroll
	function scrollToBottom() {
		if (messagesContainer) {
			// Use requestAnimationFrame for smoother scrolling
			requestAnimationFrame(() => {
				messagesContainer.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: 'smooth'
				});
			});
		}
	}
	
	// Keep scrolling while AI is typing (content is growing)
	$effect(() => {
		// Check if any message is currently typing
		const isAnyTyping = Object.values(messageTypingStates).some(v => v);
		if (isAnyTyping && messagesContainer) {
			// Set up interval to keep scrolling while typing
			const scrollInterval = setInterval(scrollToBottom, 200);
			return () => clearInterval(scrollInterval);
		}
	});
	
	// Initialize with first message (only if store is empty)
	onMount(() => {
		// Check if messages already exist in store (component remounted)
		const existingMessages = getOnboardingMessages();
		if (existingMessages.length > 0) {
			// Messages already exist - don't restart conversation
			return;
		}
		
		// Load first AI message from scenario
		const firstMessage = onboardingScenario.messages[0];
		if (firstMessage) {
			addMessageWithDelay(firstMessage);
		}
	});
	
	// Add a message with typing indicator delay
	async function addMessageWithDelay(message: Message, delay: number = 1000) {
		if (message.sender === 'ai') {
			showTypingIndicator();
			await new Promise(resolve => setTimeout(resolve, delay));
			startTypingIndicatorExit();
			await new Promise(resolve => setTimeout(resolve, 400));
			hideTypingIndicator();
		}
		addOnboardingMessage(message);
	}
	
	// Get next scenario message by ID pattern
	function getNextScenarioMessage(afterId: string): Message | undefined {
		const currentIndex = onboardingScenario.messages.findIndex(m => m.id === afterId);
		if (currentIndex >= 0 && currentIndex < onboardingScenario.messages.length - 1) {
			return onboardingScenario.messages[currentIndex + 1];
		}
		return undefined;
	}
	
	// Handle quick reply selection
	async function handleQuickReply(value: string, label: string) {
		// Find the last AI message with quick replies
		const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai' && m.ui_elements?.quick_replies);
		if (lastAiMessage) {
			// Store selection state AFTER animation completes (600ms animation duration)
			setTimeout(() => {
				selectedReplyIds = { ...selectedReplyIds, [lastAiMessage.id]: value };
			}, 650);
			
			// Capture group data based on which question was answered
			if (lastAiMessage.id === 'onboard-3') {
				// Group type selection
				collectedGroupData.type = value;
			} else if (lastAiMessage.id === 'onboard-7') {
				// Member count selection
				const countMap: Record<string, number> = {
					'count_2': 2,
					'count_3': 3,
					'count_4': 4,
					'count_5plus': 5,
					'count_unsure': 0
				};
				collectedGroupData.memberCount = countMap[value] || 0;
			}
		}
		
		// Don't add a separate user message - the MorphReplyButtons handles the visual
		// The morphed bubble becomes the user message
		
		// Find and add the next AI message from the scenario
		// We'll look for the next message after the user reply that matches
		await progressScenario(value);
	}
	
	// Handle typed input
	async function handleSendMessage(content: string) {
		// Find the last AI message to determine what we're responding to
		const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
		
		// Capture data based on which question was answered
		if (lastAiMessage?.id === 'onboard-5') {
			// Group name
			collectedGroupData.name = content;
		} else if (lastAiMessage?.id === 'onboard-13') {
			// Expense name (e.g., "Rent")
			collectedGroupData.expenseName = content;
		} else if (lastAiMessage?.id === 'onboard-15') {
			// Expense amount (e.g., "$2,550")
			collectedGroupData.expenseAmount = content;
		}
		
		// Add user message
		const userMessage: Message = {
			id: `user-${Date.now()}`,
			sender: 'user',
			content,
			timestamp: new Date().toISOString()
		};
		addOnboardingMessage(userMessage);
		
		// Progress the scenario based on current step
		await progressScenario(content);
	}
	
	// Progress through the scenario
	async function progressScenario(userInput: string) {
		// Find current position in scenario
		const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
		if (!lastAiMessage) return;
		
		// Get the next message(s) from scenario based on the current message ID
		const currentIndex = onboardingScenario.messages.findIndex(m => m.id === lastAiMessage.id);
		if (currentIndex < 0) return;
		
		// Skip to next AI message (skip user messages in the scenario)
		let nextIndex = currentIndex + 1;
		
		// Skip past the predefined user message in scenario
		while (nextIndex < onboardingScenario.messages.length) {
			const nextMsg = onboardingScenario.messages[nextIndex];
			if (nextMsg.sender === 'user') {
				nextIndex++;
			} else {
				break;
			}
		}
		
		// Add the next AI message if available
		if (nextIndex < onboardingScenario.messages.length) {
			const nextAiMessage = onboardingScenario.messages[nextIndex];
			await addMessageWithDelay(nextAiMessage, 1200);
			
			// Check if onboarding is complete (group created)
			if (nextAiMessage.id === 'onboard-21') {
				// Calculate split amount if we have expense data
				let splitAmount = '';
				if (collectedGroupData.expenseAmount && collectedGroupData.memberCount > 0) {
					// Parse amount (remove $ and commas)
					const amountNum = parseFloat(collectedGroupData.expenseAmount.replace(/[$,]/g, ''));
					if (!isNaN(amountNum)) {
						const perPerson = Math.round(amountNum / collectedGroupData.memberCount);
						splitAmount = `$${perPerson.toLocaleString()}`;
					}
				}
				
				// Create the onboarding group from collected data
				const onboardingGroup: OnboardingGroup = {
					name: collectedGroupData.name || 'My Group',
					type: typeToName[collectedGroupData.type] || 'Group',
					icon: typeToIcon[collectedGroupData.type] || '👥',
					memberCount: collectedGroupData.memberCount || 1,
					firstExpense: collectedGroupData.expenseName ? {
						name: collectedGroupData.expenseName,
						amount: collectedGroupData.expenseAmount,
						splitAmount
					} : undefined
				};
				
				// Delay before showing tabs (group is now created)
				setTimeout(() => {
					setOnboardingGroup(onboardingGroup);
					setOnboardingGroupCreated(true);
				}, 1500);
			}
		}
	}
</script>

<div class="onboarding-chat">
	<!-- Messages Area -->
	<div class="messages-area custom-scrollbar" bind:this={messagesContainer}>
		<div class="messages-container">
			{#each messages as message, index (message.id)}
				{#if message.sender === 'ai'}
					{@const nextMessage = messages[index + 1]}
					{@const isLastBeforeUser = nextMessage?.sender === 'user' || !nextMessage}
					{@const hasCard = 
						message.ui_elements?.card_schema !== undefined || 
						(message.ui_elements?.card_schemas !== undefined && message.ui_elements.card_schemas.length > 0)
					}
					{@const showTimestamp = isLastBeforeUser}
					
					<MessageBubble 
						{message}
						{showTimestamp}
						onTypingChange={(isTyping) => {
							messageTypingStates[message.id] = isTyping;
						}}
						onCardRendered={() => {
							messageCardStates[message.id] = true;
						}}
					/>

					{#if message.ui_elements?.quick_replies}
						{@const hasUserMessageAfter = messages
							.slice(index + 1)
							.some((m) => m.sender === 'user')}
						{@const savedSelection = selectedReplyIds[message.id]}
						{@const isTyping = messageTypingStates[message.id] ?? false}
						{@const hasCardOnMsg = 
							message.ui_elements?.card_schema !== undefined || 
							(message.ui_elements?.card_schemas !== undefined && message.ui_elements.card_schemas.length > 0)
						}
						{@const cardRendered = messageCardStates[message.id] ?? false}
						{@const canShowButtons = !isTyping && (!hasCardOnMsg || cardRendered)}
						{#if savedSelection && canShowButtons}
							<!-- Always show saved selection as bubble -->
							{@const selectedOption =
								message.ui_elements.quick_replies.find(
									(qr) => qr.value === savedSelection,
								)}
							<MessageBubble
								message={{
									id: `reply-${message.id}`,
									sender: 'user',
									content: selectedOption?.label || '',
									timestamp: new Date().toISOString(),
								}}
							/>
						{:else if !hasUserMessageAfter && canShowButtons}
							<!-- Show morphing buttons only if no user message after and not yet selected -->
							<MorphReplyButtons
								options={message.ui_elements.quick_replies.map(
									(qr) => ({
										id: qr.value,
										label: qr.label,
									}),
								)}
								onSelect={(id, label) => handleQuickReply(id, label)}
							/>
						{/if}
					{/if}
				{:else}
					{@const nextMessage = messages[index + 1]}
					{@const isLastBeforeAI = nextMessage?.sender === 'ai' || !nextMessage}
					{@const showTimestamp = isLastBeforeAI}
					
					<MessageBubble {message} {showTimestamp} />
				{/if}
			{/each}

			{#if typingVisible}
				<TypingIndicator />
			{/if}
		</div>
	</div>

	<!-- Chat Input -->
	<ChatInput 
		onSend={handleSendMessage}
		onChecklistToggle={() => checklistOpen = !checklistOpen}
		isChecklistOpen={checklistOpen}
		placeholder={checklistOpen ? "Add todos, tasks, schedules..." : "Type your response..."}
	/>
	
	<!-- Checklist Bottom Sheet -->
	<ChecklistSheet isOpen={checklistOpen} onClose={() => checklistOpen = false} />
</div>

<style>
	.onboarding-chat {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		background: rgb(var(--m3-scheme-background));
		overflow: hidden;
	}
	
	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-5);
		scroll-behavior: smooth;
		min-height: 0; /* Required for flex overflow to work */
		overflow-anchor: auto; /* Layout stability: anchor scroll position */
	}
	
	.messages-container {
		max-width: 600px;
		margin: 0 auto;
		padding-bottom: 1rem;
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
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.messages-area {
			padding: var(--space-4);
		}
	}
</style>

