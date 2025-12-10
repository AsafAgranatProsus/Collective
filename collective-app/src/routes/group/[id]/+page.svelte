<script lang="ts">
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import MessageBubble from "$lib/components/MessageBubble.svelte";
	import MorphReplyButtons from "$lib/components/MorphReplyButtons.svelte";
	import TypingIndicator from "$lib/components/TypingIndicator.svelte";
	import ChatInput from "$lib/components/ChatInput.svelte";
	import TaskCard from "$lib/components/TaskCard.svelte";
	import ExpenseCard from "$lib/components/ExpenseCard.svelte";
	import ShoppingCard from "$lib/components/ShoppingCard.svelte";
	import AnalyticsSummaryCardCarousel from "$lib/components/Cards/AnalyticsSummaryCardCarousel.svelte";
	import AnalyticsDetailCardCarousel from "$lib/components/Cards/AnalyticsDetailCardCarousel.svelte";
	import GroupChat from "$lib/components/GroupChat.svelte";
	import GlassHeader from "$lib/components/GlassHeader.svelte";
	import ChecklistSheet from "$lib/components/ChecklistSheet.svelte";
	import { Icon, Button } from "m3-svelte";
	import iconArrowBack from "@ktibow/iconset-material-symbols/arrow-back";
	import iconChat from "@ktibow/iconset-material-symbols/chat";
	import iconPersonAdd from "@ktibow/iconset-material-symbols/person-add";
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
		getOnboardingGroup,
		getOnboardingGroupCreated,
		getPostOnboardingChatStarted,
		setPostOnboardingChatStarted,
		getGroupChatBadgeCount,
		setGroupChatBadgeCount,
		// Trip planning imports
		getTripGroup,
		getTripGroupChatStarted,
		setTripGroupChatStarted,
		updateTripGroup,
		isTripPlanningActive,
		showTypingIndicatorWithContext,
		hideTypingIndicator,
		startTypingIndicatorExit,
		TRIP_THINKING_TEXTS,
	} from "$lib/stores/app.svelte";
	import { viewMyTasksScenario, postOnboardingGroupScenario, tripPlanningGroupScenario } from "$lib/data/scenarios";
	import type { Message, QuickReply } from "$lib/data/scenarios";
	import { getItemsByUser, type CoordinatedItem } from "$lib/data/items";
	import { smartScrollForNewMessage } from "$lib/utils/chatScroll";
	import {
		getAllUsersAnalytics,
		getGroupWeekAnalytics,
		getGroupMonthAnalytics,
	} from "$lib/data/analytics";
	import { getGroupById } from "$lib/data/groups.svelte";
	import { addGroupChatMessage, removeGroupChatMessage, type GroupChatMessage as GroupChatMessageType } from "$lib/data/groupChat";
	import { getPrimaryView, getModeLabel } from "$lib/utils/modeHelpers";

	// Get group ID from route params
	let groupId = $derived($page.params.id || "brooklyn-apt");
	
	// Check if this is the onboarding group
	let isOnboardingGroup = $derived(groupId === 'onboarding-group');
	let onboardingGroupData = $derived(getOnboardingGroup());
	let onboardingGroupCreated = $derived(getOnboardingGroupCreated());
	let postOnboardingChatStarted = $derived(getPostOnboardingChatStarted());
	
	// Check if this is a trip planning group
	let isTripGroup = $derived(groupId === 'barcelona-march-2025' || groupId.startsWith('trip-'));
	let tripGroupData = $derived(getTripGroup());
	let tripGroupChatStarted = $derived(getTripGroupChatStarted());
	let isTripPlanningMode = $derived(isTripPlanningActive());
	
	// Get group - either from real groups or construct from onboarding/trip data
	let group = $derived(
		isOnboardingGroup && onboardingGroupData
			? {
				id: 'onboarding-group',
				name: onboardingGroupData.name,
				icon: onboardingGroupData.icon,
				type: 'household' as const,
				member_count: onboardingGroupData.memberCount,
				is_active: true,
				avatars: [],
				pending_count: 0
			}
			: isTripGroup && tripGroupData
			? {
				id: tripGroupData.id,
				name: tripGroupData.name,
				icon: tripGroupData.icon,
				type: 'trip' as const,
				member_count: tripGroupData.memberCount,
				is_active: true,
				avatars: [],
				pending_count: 0
			}
			: getGroupById(groupId)
	);

	let currentUser = $derived(getCurrentUser());
	let conversation = $derived(getCurrentConversation());
	let memberInfo = $derived(getMemberInfo(currentUser));
	let typingVisible = $derived(getTypingIndicatorVisible());
	let navDirection = $derived(getNavigationDirection());
	let selectedReplyIds = $derived(getSelectedReplyIds());
	let groupChatBadgeCount = $derived(getGroupChatBadgeCount());

	let messagesContainer: HTMLDivElement;
	
	// Initialize view based on prototype mode
	// If mode's primary view is 'group-chat', start with group chat open
	let groupChatOpen = $state(getPrimaryView() === 'group-chat');
	let checklistOpen = $state(false);
	
	// Track typing and card rendering states per message
	let messageTypingStates = $state<Record<string, boolean>>({});
	let messageCardStates = $state<Record<string, boolean>>({});

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (conversation && messagesContainer) {
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
				messagesContainer.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: "smooth",
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
			// Check if message contains @Collective reference
			if (trimmed.includes('@Collective')) {
				// Add user message to group chat first
				const newMessage: GroupChatMessageType = {
					id: `gc-${Date.now()}`,
					sender: currentUser,
					sender_name: memberInfo.name,
					avatar: memberInfo.avatar,
					content: trimmed,
					timestamp: new Date().toISOString()
				};
				addGroupChatMessage(groupId, newMessage);
				
				// Route to AI handler for accommodation flow
				handleCollectiveReference(trimmed);
				return;
			}
			
			// Regular group chat message
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
	
	// Handle @Collective references in group chat
	function handleCollectiveReference(content: string) {
		const lowerContent = content.toLowerCase();
		
		// Detect accommodation request
		if (lowerContent.includes('places to stay') || 
		    lowerContent.includes('accommodation') || 
		    lowerContent.includes('hotel') ||
		    lowerContent.includes('where to stay')) {
			// Start accommodation flow in group chat
			startAccommodationFlow();
		}
	}
	
	// Start accommodation question flow in group chat
	async function startAccommodationFlow() {
		// Show typing indicator
		const typingId = `gc-typing-accom-${Date.now()}`;
		const typingMessage: GroupChatMessageType = {
			id: typingId,
			sender: 'system',
			sender_name: 'Collective',
			avatar: '🤖',
			content: '',
			timestamp: new Date().toISOString(),
			type: 'typing'
		};
		addGroupChatMessage(groupId, typingMessage);
		
		// Wait a bit, then show first question
		setTimeout(() => {
			removeGroupChatMessage(groupId, typingId);
			
			// Get accommodation questions from scenario
			const accomQuestion1 = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-accom-1');
			if (accomQuestion1) {
				const aiMessage: GroupChatMessageType = {
					id: `gc-ai-accom1-${Date.now()}`,
					sender: 'system',
					sender_name: 'Collective',
					avatar: '🤖',
					content: accomQuestion1.content,
					timestamp: new Date().toISOString(),
					ui_elements: accomQuestion1.ui_elements
				};
				addGroupChatMessage(groupId, aiMessage);
			}
		}, 1500);
	}

	// Handle quick reply selection
	function handleQuickReply(
		value: string,
		label: string,
		messageToAdd?: Message,
	) {
		// Store selection state immediately when morph completes
		// We find the latest AI message that has these quick replies
		const lastAiMessage = conversation
			.filter((m) => m.sender === "ai" && m.ui_elements?.quick_replies)
			.pop();
		if (lastAiMessage) {
			setSelectedReplyId(lastAiMessage.id, value);
		}

		// If message is provided (after morph completes), add it
		if (messageToAdd) {
			addMessage(messageToAdd);
		}

		// Handle based on value
		if (value === "show_tasks" || value === "tasks") {
			setTimeout(() => {
				sendAIResponse("Here's what's on your plate:", {
					card_schemas: [
						{
							sections: [
								{
									type: 'header',
									title: 'Chores'
								},
								{
									type: 'list',
									items: [
										{
											title: 'Kitchen cleanup',
											subtitle: 'Wed evening',
											icon: 'checklist'
										},
										{
											title: 'Trash out',
											subtitle: 'Saturday morning',
											icon: 'checklist'
										}
									],
									style: 'default'
								}
							],
							maxWidth: 420
						},
						{
							sections: [
								{
									type: 'header',
									title: 'Money'
								},
								{
									type: 'list',
									items: [
										{
											title: 'You owe Mike $23.50 for groceries',
											icon: 'money'
										},
										{
											title: 'Jessica paid utilities - your share is $42',
											icon: 'money'
										}
									],
									style: 'default'
								}
							],
							maxWidth: 420
						},
						{
							sections: [
								{
									type: 'header',
									title: 'Shopping'
								},
								{
									type: 'list',
									items: [
										{
											title: 'Bob needs milk - you pass the bodega, mind grabbing it today?',
											icon: 'shopping'
										}
									],
									style: 'default'
								}
							],
							maxWidth: 420
						}
					],
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
		// Post-onboarding scenario handlers
		else if (value === "rent_1st" || value === "rent_15th" || value === "rent_end") {
			const dateLabel = value === "rent_1st" ? "1st" : value === "rent_15th" ? "15th" : "end of the month";
			setTimeout(() => {
				sendAIResponse(
					`Got it—rent due on the ${dateLabel}.\n\nWant me to remind you a few days before? I'll also ping your roommates once they join.`,
					{
						quick_replies: [
							{ label: "Yes, remind me", value: "remind_yes" },
							{ label: "No thanks", value: "remind_no" }
						]
					}
				);
			}, 1000);
		} else if (value === "rent_varies") {
			setTimeout(() => {
				sendAIResponse(
					"No problem—I'll let you log rent manually each month.\n\nAnything else you want to set up?",
					{
						quick_replies: [
							{ label: "Add recurring chores", value: "add_chores" },
							{ label: "Set up utilities", value: "add_utilities" },
							{ label: "I'm good for now", value: "done_setup" }
						]
					}
				);
			}, 1000);
		} else if (value === "remind_yes") {
			setTimeout(() => {
				sendAIResponse(
					"Perfect! I'll nudge everyone 3 days before rent is due. 📅\n\nAnything else you want to set up while we're at it?",
					{
						quick_replies: [
							{ label: "Add recurring chores", value: "add_chores" },
							{ label: "Set up utilities", value: "add_utilities" },
							{ label: "I'm good for now", value: "done_setup" }
						]
					}
				);
			}, 1000);
		} else if (value === "remind_no") {
			setTimeout(() => {
				sendAIResponse(
					"Got it, no reminders for now. You can always turn them on later.\n\nAnything else you want to set up?",
					{
						quick_replies: [
							{ label: "Add recurring chores", value: "add_chores" },
							{ label: "Set up utilities", value: "add_utilities" },
							{ label: "I'm good for now", value: "done_setup" }
						]
					}
				);
			}, 1000);
		} else if (value === "add_chores") {
			setTimeout(() => {
				sendAIResponse(
					"What chores do you want to track? I can help rotate them fairly.",
					{
						quick_replies: [
							{ label: "Kitchen cleanup", value: "chore_kitchen" },
							{ label: "Trash duty", value: "chore_trash" },
							{ label: "Bathroom cleaning", value: "chore_bathroom" },
							{ label: "Something else", value: "chore_other" }
						]
					}
				);
			}, 1000);
		} else if (value === "add_utilities") {
			setTimeout(() => {
				sendAIResponse(
					"Which utilities do you want to split?",
					{
						quick_replies: [
							{ label: "Electric", value: "utility_electric" },
							{ label: "Internet", value: "utility_internet" },
							{ label: "Gas", value: "utility_gas" },
							{ label: "All of the above", value: "utility_all" }
						]
					}
				);
			}, 1000);
		} else if (value === "chore_kitchen" || value === "chore_trash" || value === "chore_bathroom" || value === "chore_other" || value === "utility_electric" || value === "utility_internet" || value === "utility_gas" || value === "utility_all") {
			setTimeout(() => {
				sendAIResponse(
					"Sounds good! You can always come back here to:\n\n• Log expenses & settle up\n• Track who owes what\n• Assign chores & tasks\n• Ask me anything about the group\n\nI'm here whenever you need me. 🙌",
					{
						quick_replies: [
							{ label: "What's on my plate?", value: "show_tasks" },
							{ label: "How does fairness work?", value: "fairness_explain" },
							{ label: "Thanks!", value: "thanks" }
						]
					}
				);
			}, 1000);
		} else if (value === "done_setup") {
			// Special flow: Susan joins the group!
			setTimeout(() => {
				// First, show the "someone joined" notification
				sendAIResponse(
					"🎉 Susan just joined the group!",
					{
						quick_replies: [
							{ label: "Say formal hello 👋", value: "greet_formal" },
							{ label: "Say a warm hi", value: "greet_warm" }
						]
					}
				);
				// Set badge on chat icon
				setGroupChatBadgeCount(1);
			}, 2000); // Slight delay for dramatic effect
		} else if (value === "fairness_explain") {
			setTimeout(() => {
				sendAIResponse(
					"I track everything—chores done, money spent, tasks completed.\n\nOver time, I make sure everyone pulls their weight. If someone's slacking, I'll gently nudge them (or let you know).\n\nFair sharing without the awkward conversations. 🤝",
					{
						quick_replies: [
							{ label: "That's smart!", value: "thanks" },
							{ label: "Show me an example", value: "show_summary" }
						]
					}
				);
			}, 1000);
		} else if (value === "greet_formal" || value === "greet_warm") {
			// Clear the badge
			setGroupChatBadgeCount(0);
			
			// Add system message and user greeting to group chat
			const systemMessage: GroupChatMessageType = {
				id: `gc-system-${Date.now()}`,
				sender: 'system',
				sender_name: 'System',
				avatar: '',
				content: 'Susan joined the group',
				timestamp: new Date().toISOString(),
				type: 'system'
			};
			
			const greetingText = value === "greet_formal" 
				? "Hey Susan! Welcome to the group. Looking forward to coordinating with you! 👋"
				: "Hey Susan! We're both new to this space. Still exploring. Let's give it a run for its money!";
			
			const userGreeting: GroupChatMessageType = {
				id: `gc-user-${Date.now()}`,
				sender: currentUser,
				sender_name: memberInfo?.name || 'You',
				avatar: memberInfo?.avatar || '👤',
				content: greetingText,
				timestamp: new Date().toISOString()
			};
			
			// Add messages to group chat
			addGroupChatMessage(groupId, systemMessage);
			
			// Small delay before user message appears
			setTimeout(() => {
				addGroupChatMessage(groupId, userGreeting);
				
				// Show typing indicator after user message
				const typingIndicatorId = `gc-typing-${Date.now()}`;
				setTimeout(() => {
					const typingMessage: GroupChatMessageType = {
						id: typingIndicatorId,
						sender: 'susan',
						sender_name: 'Susan',
						avatar: '👩🏼',
						content: '',
						timestamp: new Date().toISOString(),
						type: 'typing'
					};
					addGroupChatMessage(groupId, typingMessage);
					
					// After a few seconds, remove typing indicator and add Susan's response
					setTimeout(() => {
						removeGroupChatMessage(groupId, typingIndicatorId);
						
						const susanResponse: GroupChatMessageType = {
							id: `gc-susan-${Date.now()}`,
							sender: 'susan',
							sender_name: 'Susan',
							avatar: '👩🏼',
							content: "Right, so what do we do here?",
							timestamp: new Date().toISOString()
						};
						addGroupChatMessage(groupId, susanResponse);
					}, 2500); // Susan types for 2.5 seconds
				}, 1000); // Start typing 1 second after user message
			}, 300);
			
			// Open group chat view
			groupChatOpen = true;
		}
		// ========== TRIP PLANNING HANDLERS ==========
		else if (value === "invite_friends" || value === "keep_planning") {
			// Show flight options after a brief search
			setTimeout(async () => {
				showTypingIndicatorWithContext(TRIP_THINKING_TEXTS);
				await new Promise(resolve => setTimeout(resolve, 2500));
				startTypingIndicatorExit();
				await new Promise(resolve => setTimeout(resolve, 400));
				hideTypingIndicator();
				
				// Add flight options message
				const flightMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-3');
				if (flightMsg) {
					addMessage(flightMsg);
				}
				
				// Add recommendation after brief delay
				setTimeout(() => {
					const recMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-4');
					if (recMsg) {
						sendAIResponse(recMsg.content, recMsg.ui_elements);
					}
				}, 1500);
			}, 500);
		} else if (value === "show_flights_again") {
			// Re-show flight options
			const flightMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-3');
			if (flightMsg) {
				addMessage(flightMsg);
			}
		} else if (value === "share_options" || value === "vote_option1" || value === "vote_option2" || value === "vote_option3") {
			// Show share/invite flow
			setTimeout(() => {
				const shareMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-5');
				if (shareMsg) {
					sendAIResponse(shareMsg.content, shareMsg.ui_elements);
				}
			}, 1000);
		} else if (value === "copy_link" || value === "share_text" || value === "share_whatsapp" || value === "send_invite") {
			// Confirm invite sent and start friend joining simulation
			setTimeout(() => {
				const confirmMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-6');
				if (confirmMsg) {
					sendAIResponse(confirmMsg.content, confirmMsg.ui_elements);
				}
				
				// Simulate Jerone joining after 3 seconds
				setTimeout(() => {
					simulateJeroneJoining();
				}, 3000);
			}, 1000);
		} else if (value === "find_hotels" || value === "wait_for_group") {
			if (value === "find_hotels") {
				// Start hotel search
				setTimeout(async () => {
					showTypingIndicatorWithContext(['Searching hotels...', 'Checking availability...', 'Comparing prices...', 'Finding best locations...']);
					await new Promise(resolve => setTimeout(resolve, 3000));
					startTypingIndicatorExit();
					await new Promise(resolve => setTimeout(resolve, 400));
					hideTypingIndicator();
					
					const progressMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-10');
					if (progressMsg) {
						sendAIResponse(progressMsg.content, progressMsg.ui_elements);
					}
				}, 500);
			} else {
				setTimeout(() => {
					sendAIResponse(
						"No problem! I'll wait for everyone to join before we continue.\n\nIn the meantime, feel free to share the invite link with your friends.",
						{
							quick_replies: [
								{ label: "Copy invite link", value: "copy_link" },
								{ label: "I'll share later", value: "share_later" }
							]
						}
					);
				}, 1000);
			}
		} else if (value === "vote_option1_confirm" || value === "vote_option2_confirm") {
			// User votes after Jerone
			const option = value === "vote_option1_confirm" ? "Option 1" : "Option 2";
			setTimeout(() => {
				const consensusMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-9');
				if (consensusMsg) {
					sendAIResponse(consensusMsg.content, consensusMsg.ui_elements);
				}
			}, 1000);
		} else if (value === "find_hotels_after_vote" || value === "wait_for_everyone") {
			if (value === "find_hotels_after_vote") {
				setTimeout(async () => {
					showTypingIndicatorWithContext(['Searching hotels...', 'Checking availability...', 'Comparing prices...', 'Finding best locations...']);
					await new Promise(resolve => setTimeout(resolve, 3000));
					startTypingIndicatorExit();
					await new Promise(resolve => setTimeout(resolve, 400));
					hideTypingIndicator();
					
					const progressMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-10');
					if (progressMsg) {
						sendAIResponse(progressMsg.content, progressMsg.ui_elements);
					}
				}, 500);
			} else {
				setTimeout(() => {
					sendAIResponse(
						"Got it! I'll wait for the other 2 members to join and vote.\n\nYou can always come back here to check the status.",
						{
							quick_replies: [
								{ label: "Back to Feed", value: "back_to_feed" }
							]
						}
					);
				}, 1000);
			}
		} else if (value === "back_to_feed" || value === "view_group" || value === "share_later") {
			if (value === "back_to_feed") {
				goto("/groups");
			}
			// view_group and share_later just keep the user on the page
		} else if (value === "review_hotels") {
			setTimeout(() => {
				sendAIResponse(
					"Here are 4 great hotel options in Gothic Quarter:\n\n🏨 Hotel 1 - Best Value\nHotel Barcelona Center\n$89/night • 4.3★\n\n🏨 Hotel 2 - Best Location\nH10 Montcada\n$125/night • 4.6★\n\n🏨 Hotel 3 - Best for Groups\nAparthotel Mariano Cubi\n$156/night (2 rooms) • 4.4★\n\n🏨 Hotel 4 - Luxury Pick\nMercer Hotel Barcelona\n$215/night • 4.8★",
					{
						quick_replies: [
							{ label: "Vote for Hotel 1", value: "vote_hotel1" },
							{ label: "Vote for Hotel 2", value: "vote_hotel2" },
							{ label: "See more options", value: "more_hotels" }
						]
					}
				);
			}, 1000);
		}
		// ========== JERONE GREETING HANDLERS ==========
		else if (value === "greet_jerone_hi" || value === "greet_jerone_share") {
			// Switch to group chat immediately
			groupChatOpen = true;
			
			// Add system message about Jerone joining
			const systemMessage: GroupChatMessageType = {
				id: `gc-system-${Date.now()}`,
				sender: 'system',
				sender_name: 'System',
				avatar: '',
				content: 'Jerone joined the group',
				timestamp: new Date().toISOString(),
				type: 'system'
			};
			addGroupChatMessage(groupId, systemMessage);
			
			// Small delay before user message appears
			setTimeout(() => {
				// Add Nishi's greeting
				const userGreeting: GroupChatMessageType = {
					id: `gc-user-${Date.now()}`,
					sender: currentUser,
					sender_name: memberInfo?.name || 'Nishi',
					avatar: memberInfo?.avatar || '👤',
					content: value === "greet_jerone_hi"
						? "Hey Jerone! Welcome aboard! 👋"
						: "Hey Jerone! Welcome to the trip planning! 🎉 Check out these flight options I found:",
					timestamp: new Date().toISOString()
				};
				addGroupChatMessage(groupId, userGreeting);
				
				// If sharing findings, add flight cards after the greeting
				if (value === "greet_jerone_share") {
					setTimeout(() => {
						// Get the flight cards from the scenario
						const flightMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-3');
						
						// Add flight options as a message with cards (from Nishi)
						const flightCardsMessage: GroupChatMessageType = {
							id: `gc-flights-${Date.now()}`,
							sender: currentUser,
							sender_name: memberInfo?.name || 'Nishi',
							avatar: memberInfo?.avatar || '👤',
							content: '',
							timestamp: new Date().toISOString(),
							ui_elements: flightMsg?.ui_elements
						};
						addGroupChatMessage(groupId, flightCardsMessage);
					}, 400);
				}
				
				// Show Jerone typing after user message
				const typingIndicatorId = `gc-typing-${Date.now()}`;
				setTimeout(() => {
					const typingMessage: GroupChatMessageType = {
						id: typingIndicatorId,
						sender: 'jerone',
						sender_name: 'Jerone',
						avatar: '👨🏾',
						content: '',
						timestamp: new Date().toISOString(),
						type: 'typing'
					};
					addGroupChatMessage(groupId, typingMessage);
					
					// After typing, Jerone responds
					setTimeout(() => {
						removeGroupChatMessage(groupId, typingIndicatorId);
						
						const jeroneResponse: GroupChatMessageType = {
							id: `gc-jerone-${Date.now()}`,
							sender: 'jerone',
							sender_name: 'Jerone',
							avatar: '👨🏾',
							content: value === "greet_jerone_hi" 
								? "Thanks! Excited for Barcelona! 🇪🇸 What have you found so far?"
								: "Nice! Let me check these out... 👀",
							timestamp: new Date().toISOString()
						};
						addGroupChatMessage(groupId, jeroneResponse);
						
						// If user shared findings, Jerone votes (shown in group chat)
						if (value === "greet_jerone_share") {
							// AI injects vote card after a brief delay (from scenario)
							setTimeout(() => {
								const voteCardMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-vote-card');
								if (voteCardMsg) {
									const voteCard: GroupChatMessageType = {
										id: `gc-vote-card-${Date.now()}`,
										sender: 'system',
										sender_name: 'AI',
										avatar: '🤖',
										content: voteCardMsg.content,
										timestamp: new Date().toISOString(),
										ui_elements: voteCardMsg.ui_elements
									};
									addGroupChatMessage(groupId, voteCard);
								}
								
								// Jerone types after vote card
								const typingId2 = `gc-typing2-${Date.now()}`;
								setTimeout(() => {
									const typingMsg2: GroupChatMessageType = {
										id: typingId2,
										sender: 'jerone',
										sender_name: 'Jerone',
										avatar: '👨🏾',
										content: '',
										timestamp: new Date().toISOString(),
										type: 'typing'
									};
									addGroupChatMessage(groupId, typingMsg2);
									
									// Then Jerone's comment
									setTimeout(() => {
										removeGroupChatMessage(groupId, typingId2);
										const jeroneComment: GroupChatMessageType = {
											id: `gc-jerone-comment-${Date.now()}`,
											sender: 'jerone',
											sender_name: 'Jerone',
											avatar: '👨🏾',
											content: "$458 per person and direct - can't beat that combo 💪",
											timestamp: new Date().toISOString()
										};
										addGroupChatMessage(groupId, jeroneComment);
									}, 1500);
								}, 800);
							}, 1500);
						}
					}, 2000); // Jerone types for 2 seconds
				}, value === "greet_jerone_share" ? 1800 : 800); // Delay more if showing cards
			}, 300);
		}
		// ========== ACCOMMODATION HANDLERS ==========
		else if (value.startsWith('accom_style_')) {
			// User selected accommodation style, show location question in group chat
			const typingId = `gc-typing-accom2-${Date.now()}`;
			setTimeout(() => {
				const typingMessage: GroupChatMessageType = {
					id: typingId,
					sender: 'system',
					sender_name: 'Collective',
					avatar: '🤖',
					content: '',
					timestamp: new Date().toISOString(),
					type: 'typing'
				};
				addGroupChatMessage(groupId, typingMessage);
				
				setTimeout(() => {
					removeGroupChatMessage(groupId, typingId);
					
					const accomQuestion2 = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-accom-2');
					if (accomQuestion2) {
						const aiMessage: GroupChatMessageType = {
							id: `gc-ai-accom2-${Date.now()}`,
							sender: 'system',
							sender_name: 'Collective',
							avatar: '🤖',
							content: accomQuestion2.content,
							timestamp: new Date().toISOString(),
							ui_elements: accomQuestion2.ui_elements
						};
						addGroupChatMessage(groupId, aiMessage);
					}
				}, 1200);
			}, 500);
		}
		else if (value.startsWith('accom_location_')) {
			// User selected location, show price question in group chat
			const typingId = `gc-typing-accom3-${Date.now()}`;
			setTimeout(() => {
				const typingMessage: GroupChatMessageType = {
					id: typingId,
					sender: 'system',
					sender_name: 'Collective',
					avatar: '🤖',
					content: '',
					timestamp: new Date().toISOString(),
					type: 'typing'
				};
				addGroupChatMessage(groupId, typingMessage);
				
				setTimeout(() => {
					removeGroupChatMessage(groupId, typingId);
					
					const accomQuestion3 = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-accom-3');
					if (accomQuestion3) {
						const aiMessage: GroupChatMessageType = {
							id: `gc-ai-accom3-${Date.now()}`,
							sender: 'system',
							sender_name: 'Collective',
							avatar: '🤖',
							content: accomQuestion3.content,
							timestamp: new Date().toISOString(),
							ui_elements: accomQuestion3.ui_elements
						};
						addGroupChatMessage(groupId, aiMessage);
					}
				}, 1200);
			}, 500);
		}
		else if (value.startsWith('accom_price_')) {
			// User selected price range, show accommodation options in group chat
			const typingId = `gc-typing-accom4-${Date.now()}`;
			setTimeout(() => {
				const typingMessage: GroupChatMessageType = {
					id: typingId,
					sender: 'system',
					sender_name: 'Collective',
					avatar: '🤖',
					content: '',
					timestamp: new Date().toISOString(),
					type: 'typing'
				};
				addGroupChatMessage(groupId, typingMessage);
				
				setTimeout(() => {
					removeGroupChatMessage(groupId, typingId);
					
					const accomOptions = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-accom-4');
					if (accomOptions) {
						const aiMessage: GroupChatMessageType = {
							id: `gc-ai-accom4-${Date.now()}`,
							sender: 'system',
							sender_name: 'Collective',
							avatar: '🤖',
							content: accomOptions.content,
							timestamp: new Date().toISOString(),
							ui_elements: accomOptions.ui_elements
						};
						addGroupChatMessage(groupId, aiMessage);
					}
				}, 2500); // Longer delay to simulate searching
			}, 500);
		}
		else if (value.startsWith('vote_accom')) {
			// User voted for an accommodation option
			const optionNum = value.replace('vote_accom', '');
			const optionNames = ['Hotel Neri', 'El Born Loft', 'Beach Hostel'];
			const optionName = optionNames[parseInt(optionNum) - 1] || 'an option';
			
			// Show confirmation in group chat
			const typingId = `gc-typing-vote-${Date.now()}`;
			setTimeout(() => {
				const typingMessage: GroupChatMessageType = {
					id: typingId,
					sender: 'system',
					sender_name: 'Collective',
					avatar: '🤖',
					content: '',
					timestamp: new Date().toISOString(),
					type: 'typing'
				};
				addGroupChatMessage(groupId, typingMessage);
				
				setTimeout(() => {
					removeGroupChatMessage(groupId, typingId);
					
					const confirmMessage: GroupChatMessageType = {
						id: `gc-vote-confirm-${Date.now()}`,
						sender: 'system',
						sender_name: 'Collective',
						avatar: '🤖',
						content: `✓ Vote recorded for ${optionName}!\n\nWaiting for Jerone to vote on accommodation.`,
						timestamp: new Date().toISOString()
					};
					addGroupChatMessage(groupId, confirmMessage);
				}, 1000);
			}, 500);
		}
		else if (value.startsWith('details_accom')) {
			// Show more details about an accommodation option
			const optionNum = value.replace('details_accom', '');
			const optionNames = ['Hotel Neri', 'El Born Loft', 'Beach Hostel'];
			const optionName = optionNames[parseInt(optionNum) - 1] || 'this option';
			
			// Simple acknowledgment
			const detailsMessage: GroupChatMessageType = {
				id: `gc-details-${Date.now()}`,
				sender: 'system',
				sender_name: 'Collective',
				avatar: '🤖',
				content: `Here are more details about ${optionName}:\n\n(Details would be shown in a full implementation)`,
				timestamp: new Date().toISOString()
			};
			addGroupChatMessage(groupId, detailsMessage);
		}
	}
	
	// Simulate Jerone joining the group
	async function simulateJeroneJoining() {
		// Update trip group data
		if (tripGroupData) {
			updateTripGroup({
				currentMembers: [...tripGroupData.currentMembers, 'Jerone']
			});
		}
		
		// Show Jerone joined message with greeting options (pauses here for user choice)
		const joinMsg = tripPlanningGroupScenario.messages.find(m => m.id === 'trip-group-7');
		if (joinMsg) {
			await sendAIResponse(joinMsg.content, joinMsg.ui_elements);
		}
		// Note: Flow continues when user selects greeting option (greet_jerone_hi or greet_jerone_share)
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
	onMount(async () => {
		// Special handling for trip planning group - allow even if group doesn't exist yet
		if (isTripGroup && tripGroupData) {
			setCurrentGroup(groupId);
			
			// Start trip group chat if not started and conversation is empty
			if (!tripGroupChatStarted && conversation.length === 0) {
				setTripGroupChatStarted(true);
				
				// Show brief thinking indicator
				showTypingIndicatorWithContext(TRIP_THINKING_TEXTS);
				await new Promise(resolve => setTimeout(resolve, 2000));
				startTypingIndicatorExit();
				await new Promise(resolve => setTimeout(resolve, 400));
				hideTypingIndicator();
				
				// Load the first messages from trip planning group scenario
				const initialMessages = tripPlanningGroupScenario.messages.slice(0, 2);
				initialMessages.forEach((msg) => addMessage(msg));
			}
			return;
		}
		
		// Validate group exists and is active
		if (!group || !group.is_active) {
			goto("/groups");
			return;
		}

		// Set current group in app state
		setCurrentGroup(groupId);

		// Load the appropriate scenario based on context
		if (conversation.length === 0) {
			// Check if this is the onboarding group and we haven't started post-onboarding chat
			if (isOnboardingGroup && onboardingGroupCreated && !postOnboardingChatStarted) {
				// Load post-onboarding scenario
				const initialMessages = postOnboardingGroupScenario.messages.slice(0, 1);
				initialMessages.forEach((msg) => addMessage(msg));
				setPostOnboardingChatStarted(true);
			} else {
				// Load default scenario
				const initialMessages = viewMyTasksScenario.messages.slice(0, 1);
				initialMessages.forEach((msg) => addMessage(msg));
			}
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
				<div class="header-actions">
					<Button
						variant="text"
						iconType="full"
						onclick={() => {}}
						aria-label="Invite user"
					>
						<Icon icon={iconPersonAdd} />
					</Button>
					<div class="chat-button-wrapper">
						<Button
							variant="text"
							iconType="full"
							onclick={handleGroupChatToggle}
							aria-label={getModeLabel('secondaryToggleLabel')}
						>
							<Icon icon={iconChat} />
						</Button>
						{#if groupChatBadgeCount > 0}
							<span class="chat-badge" in:fly={{ y: -5, duration: 200 }}>{groupChatBadgeCount}</span>
						{/if}
					</div>
				</div>
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
					{@const nextMessage = conversation[index + 1]}
					{@const hasSavedReply = !!selectedReplyIds[message.id]}
					{@const isLastBeforeUser = nextMessage?.sender === "user" || !nextMessage || hasSavedReply}
					{@const hasCard = 
						message.ui_elements?.card_schema !== undefined || 
						(message.ui_elements?.card_schemas !== undefined && message.ui_elements.card_schemas.length > 0)
					}
					{@const showTimestamp = isLastBeforeUser}
					
					<MessageBubble 
						{message}
						{showTimestamp}
						context="group-chat"
						onTypingChange={(isTyping) => {
							messageTypingStates[message.id] = isTyping;
						}}
						onCardRendered={() => {
							messageCardStates[message.id] = true;
						}}
					/>

					{#if message.ui_elements?.quick_replies}
						{@const hasUserMessageAfter = conversation
							.slice(index + 1)
							.some((m) => m.sender === "user")}
						{@const savedSelection = selectedReplyIds[message.id]}
						{@const isTyping = messageTypingStates[message.id] ?? false}
						{@const hasCard = 
							message.ui_elements?.card_schema !== undefined || 
							(message.ui_elements?.card_schemas !== undefined && message.ui_elements.card_schemas.length > 0)
						}
						{@const cardRendered = messageCardStates[message.id] ?? false}
						{@const canShowButtons = !isTyping && (!hasCard || cardRendered)}
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
											context="group-chat"
											message={{
												id: `reply-${message.id}`,
												sender: "user",
												content: selectedOption.label || "",
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
										onMorphComplete={(id, label) =>
											handleQuickReply(id, label)}
									/>
								</div>
							</div>
						{/if}
					{/if}
				{:else}
					{@const nextMessage = conversation[index + 1]}
					{@const isLastBeforeAI = nextMessage?.sender === "ai" || !nextMessage}
					{@const showTimestamp = isLastBeforeAI}
					
					<MessageBubble {message} {showTimestamp} context="group-chat" />
				{/if}

				{#if message.ui_elements?.cards}
					<div class="cards-carousel-wrapper">
						<div class="cards-carousel">
							{#each message.ui_elements.cards as item}
								<div class="carousel-card-item">
									{#if item.item_type === "chore"}
										<TaskCard {item} />
									{:else if item.item_type === "expense"}
										<ExpenseCard {item} />
									{:else if item.item_type === "shopping_item"}
										<ShoppingCard {item} />
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if message.ui_elements?.analytics_summary}
					{@const allUsers = getAllUsersAnalytics()}
					{@const groupData = getGroupWeekAnalytics()}
					{@const userData = allUsers[currentUser].week}
					<AnalyticsSummaryCardCarousel
						userId={currentUser}
						{userData}
						{groupData}
						{allUsers}
					/>
				{/if}

				{#if message.ui_elements?.analytics_detail}
					{@const allUsers = getAllUsersAnalytics()}
					{@const groupData = getGroupMonthAnalytics()}
					{@const userData = allUsers[currentUser].month}
					<AnalyticsDetailCardCarousel
						userId={currentUser}
						{userData}
						{groupData}
					/>
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
		placeholder={checklistOpen ? "Add todos, tasks, schedules..." : (groupChatOpen ? "Message group..." : "Type a message...")}
		enableReferences={groupChatOpen}
		members={groupChatOpen ? [
			{ id: currentUser, name: 'You', avatar: memberInfo?.avatar || '👤' },
			{ id: 'jerone', name: 'Jerone', avatar: '👨🏾' }
		] : []}
	/>

	<!-- Checklist Bottom Sheet -->
	<ChecklistSheet 
		isOpen={checklistOpen}
		onClose={() => checklistOpen = false}
		groupId={groupId}
		groupName={group?.name || 'Group'}
	/>

	<!-- Group Chat Overlay -->
	<GroupChat
		{groupId}
		isOpen={groupChatOpen}
		onClose={() => (groupChatOpen = false)}
		onSendMessage={handleSendMessage}
		onQuickReply={handleQuickReply}
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


	/* Header action buttons */
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	/* Chat button with badge */
	.chat-button-wrapper {
		position: relative;
		display: inline-flex;
	}

	.chat-badge {
		position: absolute;
		top: 2px;
		right: 2px;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		font-size: 11px;
		font-weight: 600;
		font-family: var(--font-sans);
		color: rgb(var(--m3-scheme-on-primary));
		background-color: rgb(var(--m3-scheme-primary));
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
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
		overflow-anchor: auto; /* Layout stability: anchor scroll position */
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

	/* Horizontal carousel for task/expense/shopping cards */
	.cards-carousel-wrapper {
		margin: var(--space-3) 0;
		width: 100%;
	}

	.cards-carousel {
		display: flex;
		gap: var(--space-3);
		overflow-x: auto;
		overflow-y: visible;
		padding: var(--space-2) 0;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		
		/* Hide scrollbar but keep functionality */
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.cards-carousel::-webkit-scrollbar {
		display: none;
	}

	.carousel-card-item {
		flex-shrink: 0;
		width: 280px;
	}

	.carousel-card-item :global(.card-wrapper),
	.carousel-card-item :global(.task-card),
	.carousel-card-item :global(.expense-card),
	.carousel-card-item :global(.shopping-card) {
		width: 100%;
		max-width: none;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.messages-area {
			padding: var(--space-4);
			padding-right: var(--space-2);
		padding-top: 5rem;
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
