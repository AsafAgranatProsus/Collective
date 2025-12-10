<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { getAllGroups, addDynamicGroup, type Group } from '$lib/data/groups.svelte';
	import { 
		getCurrentUser, 
		getConversationReadOnly, 
		getAllMembers, 
		setNavigationDirection,
		getActiveScenario,
		getTripPlanningMessages,
		addTripPlanningMessage,
		getTripGroup,
		setTripGroup,
		getTripPlanningStep,
		setTripPlanningStep,
		showTypingIndicator,
		hideTypingIndicator,
		startTypingIndicatorExit,
		getTypingIndicatorVisible,
		setTypingIndicatorContextTexts,
		showTypingIndicatorWithContext,
		markTripPlanningMessageAsRendered,
		TRIP_THINKING_TEXTS,
		type TripGroup
	} from '$lib/stores/app.svelte';
	import { setLastActiveTab } from '$lib/stores/features.svelte';
	import { getNavigationPath } from '$lib/utils/modeHelpers';
	import type { Message } from '$lib/data/scenarios';
	import { tripPlanningScenario } from '$lib/data/scenarios';
	import MessageBubble from './MessageBubble.svelte';
	import MorphReplyButtons from './MorphReplyButtons.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	import ChatInput from './ChatInput.svelte';
	import ChecklistSheet from './ChecklistSheet.svelte';
	import GroupCard from './GroupCard.svelte';
	import FilterChips from './FilterChips.svelte';
	import { smartScrollForNewMessage } from '$lib/utils/chatScroll';
	
	// Checklist bottom sheet state
	let checklistOpen = $state(false);
	
	// Reactive groups list that updates when dynamic groups are added
	const groups = $derived(getAllGroups());
	const members = getAllMembers();
	const currentUser = $derived(getCurrentUser());
	const activeScenario = $derived(getActiveScenario());
	const isTripPlanningMode = $derived(activeScenario === 'trip-planning');
	
	// Trip planning state
	const tripMessages = $derived(getTripPlanningMessages());
	const tripGroup = $derived(getTripGroup());
	const tripStep = $derived(getTripPlanningStep());
	const typingVisible = $derived(getTypingIndicatorVisible());
	
	// Track collected trip data during setup
	let collectedTripData = $state<{
		name: string;
		memberCount: number;
		timing: string;
		duration: string;
	}>({
		name: '',
		memberCount: 0,
		timing: '',
		duration: ''
	});
	
	// Track typing and card rendering states per message
	let messageTypingStates = $state<Record<string, boolean>>({});
	let messageCardStates = $state<Record<string, boolean>>({});
	
	// Track selected replies
	let selectedReplyIds = $state<Record<string, string>>({});
	
	// Messages container ref for scrolling
	let messagesContainer = $state<HTMLDivElement>();
	
	// State for selected filter (normal feed mode)
	let selectedFilter = $state<string>('all');
	
	// Build filter options from groups
	let filterOptions = $derived.by(() => {
		const baseFilters = [{ id: 'all', label: 'All' }];
		const groupFilters = groups.map(g => ({
			id: g.id,
			label: g.name,
			icon: g.icon
		}));
		return [...baseFilters, ...groupFilters];
	});
	
	// Derived data: all AI messages from all groups (normal feed mode)
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
	
	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (tripMessages && messagesContainer) {
			scrollToBottom();
		}
	});
	
	// Smart scroll when typing indicator appears
	$effect(() => {
		if (typingVisible && messagesContainer) {
			smartScrollForNewMessage(messagesContainer);
		}
	});
	
	// Scroll to bottom helper
	function scrollToBottom() {
		if (messagesContainer) {
			requestAnimationFrame(() => {
				messagesContainer?.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: 'smooth'
				});
			});
		}
	}
	
	// Keep scrolling while AI is typing (actual text animation, not indicator)
	$effect(() => {
		const isAnyTyping = Object.values(messageTypingStates).some(v => v);
		// Only scroll during text typing, not when typing indicator is showing
		if (isAnyTyping && !typingVisible && messagesContainer) {
			const scrollInterval = setInterval(scrollToBottom, 200);
			return () => clearInterval(scrollInterval);
		}
	});
	
	// Track if we've initialized the scenario (to prevent double-loading)
	let tripScenarioInitialized = $state(false);
	
	// Initialize trip planning scenario when mode becomes active
	$effect(() => {
		if (isTripPlanningMode && tripMessages.length === 0 && !tripScenarioInitialized) {
			tripScenarioInitialized = true;
			// Load first AI message from scenario
			const firstMessage = tripPlanningScenario.messages[0];
			if (firstMessage) {
				addMessageWithDelay(firstMessage);
			}
		}
	});
	
	// Add a message with typing indicator delay
	async function addMessageWithDelay(message: Message, delay: number = 1000, useContextTexts: boolean = false) {
		if (message.sender === 'ai') {
			if (useContextTexts) {
				showTypingIndicatorWithContext(TRIP_THINKING_TEXTS);
			} else {
				showTypingIndicator();
			}
			await new Promise(resolve => setTimeout(resolve, delay));
			startTypingIndicatorExit();
			await new Promise(resolve => setTimeout(resolve, 400));
			hideTypingIndicator();
		}
		addTripPlanningMessage(message);
	}
	
	// Fuzzy match for trip planning intent
	function matchesTripPlanningIntent(input: string): boolean {
		const lower = input.toLowerCase();
		const tripKeywords = ['trip', 'travel', 'vacation', 'holiday', 'flight', 'flights'];
		const planKeywords = ['plan', 'planning', 'want to', 'going to', 'let\'s'];
		const destinationKeywords = ['barcelona', 'to', 'visit'];
		
		const hasTripWord = tripKeywords.some(k => lower.includes(k));
		const hasPlanWord = planKeywords.some(k => lower.includes(k));
		
		// Match patterns like "I want to plan a trip" or "planning a trip to Barcelona"
		return (hasTripWord && hasPlanWord) || 
			   (hasTripWord && lower.includes('barcelona')) ||
			   (lower.includes('barcelona') && lower.includes('friends'));
	}
	
	// Handle user typed input
	async function handleSendMessage(content: string) {
		if (!isTripPlanningMode) {
			console.log('Feed message:', content);
			return;
		}
		
		// Find the last AI message to determine context
		const lastAiMessage = [...tripMessages].reverse().find(m => m.sender === 'ai');
		
		// If we're at the greeting stage and user types trip planning intent
		if (lastAiMessage?.id === 'trip-1' && matchesTripPlanningIntent(content)) {
			// Add user message
			const userMessage: Message = {
				id: `user-${Date.now()}`,
				sender: 'user',
				content,
				timestamp: new Date().toISOString()
			};
			addTripPlanningMessage(userMessage);
			
			// Progress to AI suggestion
			const aiSuggestion = tripPlanningScenario.messages.find(m => m.id === 'trip-3');
			if (aiSuggestion) {
				await addMessageWithDelay(aiSuggestion, 1500);
			}
			return;
		}
		
		// Default: add user message and let quick reply flow handle progression
		const userMessage: Message = {
			id: `user-${Date.now()}`,
			sender: 'user',
			content,
			timestamp: new Date().toISOString()
		};
		addTripPlanningMessage(userMessage);
	}
	
	// Handle quick reply selection
	async function handleQuickReply(value: string, label: string) {
		// Find the last AI message with quick replies - store selection immediately
		const lastAiMessage = [...tripMessages].reverse().find(m => m.sender === 'ai' && m.ui_elements?.quick_replies);
		if (lastAiMessage) {
			selectedReplyIds = { ...selectedReplyIds, [lastAiMessage.id]: value };
		}
		
		// Handle based on value and progress scenario
		await progressTripScenario(value, label);
	}
	
	// Progress through the trip planning scenario
	async function progressTripScenario(value: string, label: string) {
		// Map quick reply values to scenario progression
		switch (value) {
			case 'create_trip_group':
				// User wants to create a trip group - ask for name
				const nameQuestion = tripPlanningScenario.messages.find(m => m.id === 'trip-5');
				if (nameQuestion) {
					await addMessageWithDelay(nameQuestion, 1200);
				}
				break;
				
			case 'just_tips':
				// User just wants tips - provide some and offer again
				const tipsMessage: Message = {
					id: `tips-${Date.now()}`,
					sender: 'ai',
					content: "Sure! Here are some quick tips for Barcelona in March:\n\n• Book flights 2-3 months ahead for best prices\n• Mid-March has pleasant weather (18-22°C)\n• Consider staying in Gothic Quarter or El Born\n\nWant me to create a group to help coordinate with your friends?",
					timestamp: new Date().toISOString(),
					ui_elements: {
						quick_replies: [
							{ label: 'Yes, create trip group', value: 'create_trip_group' },
							{ label: 'That\'s helpful, thanks!', value: 'thanks_tips' }
						]
					}
				};
				await addMessageWithDelay(tipsMessage, 1500);
				break;
				
			case 'name_barcelona_march':
			case 'name_barcelona_trip':
			case 'name_friends_barcelona':
				// User selected a name - store it and ask for people count
				const nameMap: Record<string, string> = {
					'name_barcelona_march': 'Barcelona March 2025',
					'name_barcelona_trip': 'Barcelona Trip',
					'name_friends_barcelona': 'Friends Barcelona'
				};
				collectedTripData.name = nameMap[value] || label;
				
				const countQuestion = tripPlanningScenario.messages.find(m => m.id === 'trip-7');
				if (countQuestion) {
					// Customize the message with the chosen name
					const customizedMsg = {
						...countQuestion,
						content: `Great! ${collectedTripData.name}\n\nHow many people are going?\n(Including you)`
					};
					await addMessageWithDelay(customizedMsg, 1000);
				}
				break;
				
			case 'count_2':
			case 'count_3':
			case 'count_4':
			case 'count_5':
			case 'count_6plus':
				// User selected people count
				const countMap: Record<string, number> = {
					'count_2': 2,
					'count_3': 3,
					'count_4': 4,
					'count_5': 5,
					'count_6plus': 6
				};
				collectedTripData.memberCount = countMap[value] || 4;
				
				const timingQuestion = tripPlanningScenario.messages.find(m => m.id === 'trip-9');
				if (timingQuestion) {
					const customizedMsg = {
						...timingQuestion,
						content: `${collectedTripData.memberCount} people - perfect group size!\n\nWhen are you thinking of going?`
					};
					await addMessageWithDelay(customizedMsg, 1000);
				}
				break;
				
			case 'timing_early':
			case 'timing_mid':
			case 'timing_late':
			case 'timing_unsure':
				// User selected timing
				const timingMap: Record<string, string> = {
					'timing_early': 'Early March',
					'timing_mid': 'Mid March',
					'timing_late': 'Late March',
					'timing_unsure': 'March (flexible)'
				};
				collectedTripData.timing = timingMap[value] || 'Mid March';
				
				const durationQuestion = tripPlanningScenario.messages.find(m => m.id === 'trip-11');
				if (durationQuestion) {
					const weatherNote = value === 'timing_mid' ? 'great timing! Weather should be nice.' : 'good choice!';
					const customizedMsg = {
						...durationQuestion,
						content: `${collectedTripData.timing} in Barcelona - ${weatherNote}\n\nHow many nights?`
					};
					await addMessageWithDelay(customizedMsg, 1000);
				}
				break;
				
			case 'duration_weekend':
			case 'duration_long':
			case 'duration_week':
			case 'duration_unsure':
				// User selected duration - now create the group!
				const durationMap: Record<string, string> = {
					'duration_weekend': '2-3 nights',
					'duration_long': '4-5 nights',
					'duration_week': '6-7 nights',
					'duration_unsure': 'Flexible'
				};
				collectedTripData.duration = durationMap[value] || '4-5 nights';
				
				// Show thinking with rotating trip-specific text
				const thinkingMsg: Message = {
					id: 'trip-thinking',
					sender: 'ai',
					content: 'Got it! Let me set this up...',
					timestamp: new Date().toISOString()
				};
				await addMessageWithDelay(thinkingMsg, 500);
				
				// Extended thinking with rotating context texts
				showTypingIndicatorWithContext(TRIP_THINKING_TEXTS);
				await new Promise(resolve => setTimeout(resolve, 3000)); // Longer thinking for "research"
				startTypingIndicatorExit();
				await new Promise(resolve => setTimeout(resolve, 400));
				hideTypingIndicator();
				
				// Create the trip group
				const newTripGroup: TripGroup = {
					id: 'barcelona-march-2025',
					name: collectedTripData.name || 'Barcelona March 2025',
					icon: '✈️',
					destination: 'Barcelona',
					timing: collectedTripData.timing,
					duration: collectedTripData.duration,
					memberCount: collectedTripData.memberCount,
					currentMembers: ['Nishi'],
					status: 'setup'
				};
				setTripGroup(newTripGroup);
				
				// Add trip group to the groups list (appears at top)
				addDynamicGroup({
					id: newTripGroup.id,
					name: newTripGroup.name,
					icon: newTripGroup.icon,
					type: 'trip',
					member_count: newTripGroup.memberCount,
					is_active: true,
					members: newTripGroup.currentMembers,
					next_action: {
						text: 'Finding flights',
						due: 'In progress'
					}
				});
				
				// Show insights card
				const insightsMsg = tripPlanningScenario.messages.find(m => m.id === 'trip-14');
				if (insightsMsg) {
					addTripPlanningMessage(insightsMsg);
				}
				
				// After short delay, show "Ready to dive in?" with group card
				await new Promise(resolve => setTimeout(resolve, 800));
				const readyMsg = tripPlanningScenario.messages.find(m => m.id === 'trip-15');
				if (readyMsg) {
					await addMessageWithDelay(readyMsg, 1000);
				}
				setTripPlanningStep('group_created');
				break;
				
			case 'start_planning':
				// Navigate to the trip group
				handleTripGroupClick();
				break;
				
			case 'invite_first':
				// Show invite flow then navigate
				handleTripGroupClick();
				break;
				
			case 'thanks_tips':
				const thanksMsg: Message = {
					id: `thanks-${Date.now()}`,
					sender: 'ai',
					content: "You're welcome! Have an amazing trip to Barcelona! 🇪🇸\n\nFeel free to come back anytime if you want help planning.",
					timestamp: new Date().toISOString()
				};
				await addMessageWithDelay(thanksMsg, 1000);
				break;
		}
	}
	
	// Handle click on trip group card
	function handleTripGroupClick() {
		setLastActiveTab('feed');
		setNavigationDirection('forward');
		goto('/group/barcelona-march-2025');
	}
	
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
	
	// Create a Group object from TripGroup for GroupCard
	function tripGroupToGroup(trip: TripGroup): Group {
		return {
			id: trip.id,
			name: trip.name,
			icon: trip.icon,
			type: 'trip',
			member_count: trip.memberCount,
			is_active: true,
			pending_count: 0,
			members: trip.currentMembers,
			next_action: {
				text: 'Finding flights',
				due: 'In progress'
			}
		};
	}
</script>

<div class="feed-view">
	<!-- Filter Chips - Always visible for both modes -->
	<FilterChips 
		filters={filterOptions}
		selectedFilter={selectedFilter}
		onFilterSelect={handleFilterSelect}
		background="rgb(var(--m3-scheme-surface))"
	/>
	
	{#if isTripPlanningMode}
		<!-- Trip Planning Conversation Mode -->
		<div class="messages-feed trip-planning-mode custom-scrollbar" bind:this={messagesContainer}>
			<div class="messages-container">
				{#each tripMessages as message, index (message.id)}
					{#if message.sender === 'ai'}
						{@const nextMessage = tripMessages[index + 1]}
						{@const hasSavedReply = !!selectedReplyIds[message.id]}
						{@const isLastBeforeUser = nextMessage?.sender === 'user' || !nextMessage || hasSavedReply}
						{@const hasCard = 
							message.ui_elements?.card_schema !== undefined || 
							(message.ui_elements?.card_schemas !== undefined && message.ui_elements.card_schemas.length > 0)
						}
						{@const showTimestamp = isLastBeforeUser && !message.ui_elements?.quick_replies}
						
						<MessageBubble 
							{message}
							{showTimestamp}
							context="trip-planning"
							onTypingChange={(isTyping) => {
								messageTypingStates[message.id] = isTyping;
							}}
							onCardRendered={() => {
								messageCardStates[message.id] = true;
							}}
						/>
						
						<!-- Show GroupCard after "Ready to dive in?" message -->
						{#if message.ui_elements?.show_group_card && tripGroup}
							<div class="trip-group-card" in:fly={{ y: 20, duration: 300, delay: 200 }}>
								<GroupCard 
									group={tripGroupToGroup(tripGroup)}
									minimal={true}
									onboardingInfo={{
										awaitingMembers: tripGroup.memberCount - 1
									}}
									onClick={handleTripGroupClick}
								/>
							</div>
						{/if}

						{#if message.ui_elements?.quick_replies}
							{@const hasUserMessageAfter = tripMessages
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
							
							{#if !hasUserMessageAfter && canShowButtons}
								{@const selectedOption = savedSelection 
									? message.ui_elements.quick_replies.find((qr) => qr.value === savedSelection)
									: null}
								<!-- Grid wrapper to stack both elements in same position -->
								<div class="reply-stack">
									<!-- Static bubble (visible when selected) -->
									<div class="reply-stack-item" class:visible={!!savedSelection}>
										{#if selectedOption}
											<MessageBubble
												context="trip-planning"
												message={{
													id: `reply-${message.id}`,
													sender: 'user',
													content: selectedOption.label || '',
													timestamp: new Date().toISOString(),
												}}
											/>
										{/if}
									</div>
									<!-- Morphing buttons (visible when not selected) -->
									<div class="reply-stack-item" class:visible={!savedSelection}>
										<MorphReplyButtons
											options={message.ui_elements.quick_replies.map(
												(qr) => ({
													id: qr.value,
													label: qr.label,
												}),
											)}
											onMorphComplete={(id, label) => handleQuickReply(id, label)}
										/>
									</div>
								</div>
							{/if}
						{/if}
					{:else}
						{@const nextMessage = tripMessages[index + 1]}
						{@const isLastBeforeAI = nextMessage?.sender === 'ai' || !nextMessage}
						{@const showTimestamp = isLastBeforeAI}
						
						<MessageBubble {message} {showTimestamp} context="trip-planning" />
					{/if}
				{/each}

				{#if typingVisible}
					<TypingIndicator />
				{/if}
			</div>
		</div>
		
		<!-- Chat Input for Trip Planning -->
		<ChatInput 
			onSend={handleSendMessage}
			onChecklistToggle={() => checklistOpen = !checklistOpen}
			isChecklistOpen={checklistOpen}
			placeholder={checklistOpen ? "Add todos, tasks, schedules..." : "Type a message..."}
		/>
	{:else}
		<!-- Normal Feed Mode -->
		<!-- Messages Feed -->
		<div class="messages-feed custom-scrollbar">
			{#if filteredMessages.length === 0}
				<div class="empty-state">
					<img src="/matisse.png" alt="Empty state illustration" class="empty-image" />
					<img src="/matisse.png" alt="Empty state illustration" class="empty-image" />

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
		
		<!-- Chat Input -->
		<ChatInput 
			onSend={(msg) => console.log('Feed message:', msg)}
			onChecklistToggle={() => checklistOpen = !checklistOpen}
			isChecklistOpen={checklistOpen}
			placeholder={checklistOpen ? "Add todos, tasks, schedules..." : "Type a message..."}
		/>
	{/if}
	
	<!-- Checklist Bottom Sheet -->
	<ChecklistSheet isOpen={checklistOpen} onClose={() => checklistOpen = false} />
</div>

<style>
	.feed-view {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		background: rgb(var(--m3-scheme-background));
		overflow: hidden;
	}
	
	.messages-feed {
		flex: 1;
		min-height: 0; /* Required for flex overflow to work */
		overflow-y: scroll;
		padding: 1rem 0rem 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	/* Trip planning mode specific styles */
	.messages-feed.trip-planning-mode {
		gap: 0;
		padding: var(--space-5);
		padding-right: 0;
		scroll-behavior: smooth;
	}
	
	.messages-container {
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	
	.trip-group-card {
		margin: 1rem 0;
		max-width: 100%;
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
		display: grid;
		place-items: center;
	}
	
	.empty-state > * {
		grid-area: 1 / 1;
	}
	
	.empty-image {
		width: 100%;
		height: auto;
		opacity: 0.85;
		filter: saturate(0.4);
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.messages-feed {
			padding: 1rem;
			padding-right: .5rem;
		}
		
		.messages-feed.trip-planning-mode {
			padding: var(--space-4);
			padding-right: .5rem;
		}
	}

	/* Grid stack for seamless reply transition */
	.reply-stack {
		display: grid;
		width: 100%;
	}

	.reply-stack-item {
		grid-area: 1 / 1;
		opacity: 0;
		pointer-events: none;
	}

	.reply-stack-item.visible {
		opacity: 1;
		pointer-events: auto;
		/* Instant show */
		transition: none;
	}

	.reply-stack-item:not(.visible) {
		/* Delayed hide - wait for other to be visible first */
		transition: opacity 0ms 150ms;
	}
</style>
