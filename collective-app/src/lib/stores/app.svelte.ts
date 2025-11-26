/**
 * App State Store - Main application state
 * Uses Svelte 5 runes for reactivity
 */

import type { Message } from '$lib/data/scenarios';
import { members } from '$lib/data/household';

export type UserId = 'sarah' | 'mike' | 'jessica' | 'bob';
export type GroupId = string;

interface Conversation {
	userId: UserId;
	messages: Message[];
}

interface DemoMenuState {
	isOpen: boolean;
	position: { x: number; y: number };
}

// Partial group data captured during onboarding
export interface OnboardingGroup {
	name: string;
	type: string;
	icon: string;
	memberCount: number;
	// First expense logged during onboarding
	firstExpense?: {
		name: string;
		amount: string;
		splitAmount: string;
	};
}

interface AppState {
	currentUser: UserId;
	currentGroup: GroupId;
	// Conversations scoped by group, then by user
	conversations: Record<GroupId, Record<UserId, Message[]>>;
	// Track selected reply IDs per group/user/message
	selectedReplyIds: Record<GroupId, Record<UserId, Record<string, string>>>;
	activeScenario: string | null;
	demoMenu: DemoMenuState;
	animationsEnabled: boolean;
	typingIndicatorVisible: boolean;
	typingIndicatorExiting: boolean;
	navigationDirection: 'forward' | 'back' | null;
	// Onboarding state - when true, Groups tab is hidden
	isOnboarding: boolean;
	// Tracks when onboarding group is created - triggers tabs to appear
	onboardingGroupCreated: boolean;
	// Partial group data created during onboarding
	onboardingGroup: OnboardingGroup | null;
	// Messages from the onboarding conversation (persisted across component remounts)
	onboardingMessages: Message[];
}

/**
 * Initialize empty conversations for a group
 */
function initGroupConversations(): Record<UserId, Message[]> {
	return {
		sarah: [],
		mike: [],
		jessica: [],
		bob: []
	};
}

// Create reactive state using Svelte 5 runes
let appState = $state<AppState>({
	currentUser: 'sarah',
	currentGroup: 'brooklyn-apt',
	conversations: {
		'brooklyn-apt': initGroupConversations()
	},
	selectedReplyIds: {},
	activeScenario: null,
	demoMenu: {
		isOpen: false,
		position: { x: 20, y: 20 }
	},
	animationsEnabled: true,
	typingIndicatorVisible: false,
	typingIndicatorExiting: false,
	navigationDirection: null,
	isOnboarding: false,
	onboardingGroupCreated: false,
	onboardingGroup: null,
	onboardingMessages: []
});

/**
 * Get current user
 */
export function getCurrentUser(): UserId {
	return appState.currentUser;
}

/**
 * Get current group
 */
export function getCurrentGroup(): GroupId {
	return appState.currentGroup;
}

/**
 * Set current group
 */
export function setCurrentGroup(groupId: GroupId): void {
	appState.currentGroup = groupId;
	
	// Initialize conversations for this group if they don't exist
	if (!appState.conversations[groupId]) {
		appState.conversations[groupId] = initGroupConversations();
	}
	
	console.log(`Switched to group: ${groupId}`);
}

/**
 * Switch to a different user
 */
export function switchUser(userId: UserId): void {
	appState.currentUser = userId;
	console.log(`Switched to user: ${userId}`);
}

/**
 * Get current conversation (for current group and user)
 */
export function getCurrentConversation(): Message[] {
	const groupId = appState.currentGroup;
	const userId = appState.currentUser;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[groupId]) {
		appState.conversations[groupId] = initGroupConversations();
	}
	
	return appState.conversations[groupId][userId];
}

/**
 * Get conversation for specific user in current group
 */
export function getConversation(userId: UserId, groupId?: GroupId): Message[] {
	const targetGroup = groupId || appState.currentGroup;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[targetGroup]) {
		appState.conversations[targetGroup] = initGroupConversations();
	}
	
	return appState.conversations[targetGroup][userId];
}

/**
 * Get conversation for specific user in specific group (read-only, safe for derived)
 * Returns empty array if conversation doesn't exist
 */
export function getConversationReadOnly(userId: UserId, groupId: GroupId): Message[] {
	// Don't initialize - just return what exists or empty array
	if (!appState.conversations[groupId]) {
		return [];
	}
	
	return appState.conversations[groupId][userId] || [];
}

/**
 * Add message to current user's conversation in current group
 */
export function addMessage(message: Message, groupId?: GroupId): void {
	const targetGroup = groupId || appState.currentGroup;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[targetGroup]) {
		appState.conversations[targetGroup] = initGroupConversations();
	}
	
	appState.conversations[targetGroup][appState.currentUser].push(message);
}

/**
 * Add message to specific user's conversation in specific/current group
 */
export function addMessageToUser(userId: UserId, message: Message, groupId?: GroupId): void {
	const targetGroup = groupId || appState.currentGroup;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[targetGroup]) {
		appState.conversations[targetGroup] = initGroupConversations();
	}
	
	appState.conversations[targetGroup][userId].push(message);
}

/**
 * Mark a message as fully rendered (used to prevent re-animation on reload)
 * Checks both group conversations and onboarding messages
 */
export function markMessageAsRendered(messageId: string, userId?: UserId, groupId?: GroupId): void {
	const targetUser = userId || appState.currentUser;
	const targetGroup = groupId || appState.currentGroup;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[targetGroup]) {
		appState.conversations[targetGroup] = initGroupConversations();
	}
	
	// Find and update the message in group conversations
	const conversation = appState.conversations[targetGroup][targetUser];
	const message = conversation.find(m => m.id === messageId);
	
	if (message) {
		message.is_rendered = true;
		return;
	}
	
	// Also check onboarding messages
	const onboardingMessage = appState.onboardingMessages.find(m => m.id === messageId);
	if (onboardingMessage) {
		onboardingMessage.is_rendered = true;
	}
}

/**
 * Clear conversation for current user in current group
 */
export function clearCurrentConversation(groupId?: GroupId): void {
	const targetGroup = groupId || appState.currentGroup;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[targetGroup]) {
		appState.conversations[targetGroup] = initGroupConversations();
	}
	
	appState.conversations[targetGroup][appState.currentUser] = [];
}

/**
 * Clear all conversations for all groups
 */
export function clearAllConversations(): void {
	appState.conversations = {
		'brooklyn-apt': initGroupConversations()
	};
}

/**
 * Set active scenario
 */
export function setActiveScenario(scenarioId: string | null): void {
	appState.activeScenario = scenarioId;
}

/**
 * Get active scenario
 */
export function getActiveScenario(): string | null {
	return appState.activeScenario;
}

/**
 * Load scenario into conversation for specific group
 */
export function loadScenario(scenarioId: string, initialMessages: Message[], userId: UserId, groupId?: GroupId): void {
	const targetGroup = groupId || appState.currentGroup;
	
	// Initialize group if doesn't exist
	if (!appState.conversations[targetGroup]) {
		appState.conversations[targetGroup] = initGroupConversations();
	}
	
	// Clear current conversation for this user in this group
	appState.conversations[targetGroup][userId] = [];
	
	// Set active scenario
	appState.activeScenario = scenarioId;
	
	// Switch to the user
	appState.currentUser = userId;
	
	// Add initial messages
	initialMessages.forEach(msg => {
		appState.conversations[targetGroup][userId].push(msg);
	});
	
	console.log(`Loaded scenario: ${scenarioId} for user: ${userId} in group: ${targetGroup}`);
}

/**
 * Demo Menu: Toggle open/close
 */
export function toggleDemoMenu(): void {
	appState.demoMenu.isOpen = !appState.demoMenu.isOpen;
}

/**
 * Demo Menu: Set open state
 */
export function setDemoMenuOpen(isOpen: boolean): void {
	appState.demoMenu.isOpen = isOpen;
}

/**
 * Demo Menu: Get state
 */
export function getDemoMenuState(): DemoMenuState {
	return appState.demoMenu;
}

/**
 * Demo Menu: Set position
 */
export function setDemoMenuPosition(x: number, y: number): void {
	appState.demoMenu.position = { x, y };
}

/**
 * Toggle animations
 */
export function toggleAnimations(): void {
	appState.animationsEnabled = !appState.animationsEnabled;
}

/**
 * Get animations enabled state
 */
export function getAnimationsEnabled(): boolean {
	return appState.animationsEnabled;
}

/**
 * Show typing indicator
 */
export function showTypingIndicator(): void {
	appState.typingIndicatorVisible = true;
	appState.typingIndicatorExiting = false;
}

/**
 * Start typing indicator exit animation
 */
export function startTypingIndicatorExit(): void {
	appState.typingIndicatorExiting = true;
}

/**
 * Hide typing indicator
 */
export function hideTypingIndicator(): void {
	appState.typingIndicatorVisible = false;
	appState.typingIndicatorExiting = false;
}

/**
 * Get typing indicator state
 */
export function getTypingIndicatorVisible(): boolean {
	return appState.typingIndicatorVisible;
}

/**
 * Get typing indicator exiting state
 */
export function getTypingIndicatorExiting(): boolean {
	return appState.typingIndicatorExiting;
}

/**
 * Reset demo to initial state
 */
export function resetDemo(): void {
	appState.currentUser = 'sarah';
	appState.currentGroup = 'brooklyn-apt';
	appState.conversations = {
		'brooklyn-apt': initGroupConversations()
	};
	appState.activeScenario = null;
	appState.animationsEnabled = true;
	appState.typingIndicatorVisible = false;
	appState.isOnboarding = false;
	appState.onboardingGroupCreated = false;
	appState.onboardingGroup = null;
	appState.onboardingMessages = [];
	console.log('Demo reset');
}

/**
 * Get full app state (for reactivity)
 */
export function getAppState() {
	return appState;
}

/**
 * Send a message (helper that handles both user and AI responses)
 */
export async function sendMessage(content: string, userId?: UserId, groupId?: GroupId): Promise<void> {
	const targetUser = userId || appState.currentUser;
	const targetGroup = groupId || appState.currentGroup;
	
	// Create user message
	const userMessage: Message = {
		id: `msg-${Date.now()}`,
		sender: 'user',
		content,
		timestamp: new Date().toISOString()
	};
	
	// Add to conversation
	addMessageToUser(targetUser, userMessage, targetGroup);
	
	// Note: AI response would be triggered by scenario logic or other handlers
	// This is just a helper for manual message sending
}

/**
 * Simulate AI response with typing indicator
 */
export async function sendAIResponse(
	content: string, 
	ui_elements?: Message['ui_elements'],
	userId?: UserId,
	groupId?: GroupId
): Promise<void> {
	const targetUser = userId || appState.currentUser;
	const targetGroup = groupId || appState.currentGroup;
	
	// Show typing indicator
	showTypingIndicator();
	
	// Wait for thinking animation (random 1000-3000ms)
	const thinkingDuration = Math.floor(Math.random() * 2000) + 1000;
	await new Promise(resolve => setTimeout(resolve, thinkingDuration));
	
	// Start exit animation
	startTypingIndicatorExit();
	
	// Wait for exit animation to complete (~600ms)
	await new Promise(resolve => setTimeout(resolve, 600));
	
	// Hide typing indicator
	hideTypingIndicator();
	
	// Create AI message
	const aiMessage: Message = {
		id: `msg-${Date.now()}`,
		sender: 'ai',
		content,
		timestamp: new Date().toISOString(),
		ui_elements
	};
	
	// Add to conversation
	addMessageToUser(targetUser, aiMessage, targetGroup);
}

/**
 * Get member info by ID
 */
export function getMemberInfo(userId: UserId) {
	return members.find(m => m.id === userId);
}

/**
 * Get all members
 */
export function getAllMembers() {
	return members;
}

/**
 * Set navigation direction
 */
export function setNavigationDirection(direction: 'forward' | 'back' | null): void {
	appState.navigationDirection = direction;
}

/**
 * Get navigation direction
 */
export function getNavigationDirection(): 'forward' | 'back' | null {
	return appState.navigationDirection;
}

/**
 * Set onboarding mode (hides Groups tab when true)
 */
export function setOnboardingMode(active: boolean): void {
	appState.isOnboarding = active;
	console.log(`Onboarding mode: ${active ? 'enabled' : 'disabled'}`);
}

/**
 * Get onboarding mode state
 */
export function getOnboardingMode(): boolean {
	return appState.isOnboarding;
}

/**
 * Set onboarding group created flag (triggers tabs to appear)
 */
export function setOnboardingGroupCreated(created: boolean): void {
	appState.onboardingGroupCreated = created;
	console.log(`Onboarding group created: ${created}`);
}

/**
 * Get onboarding group created state
 */
export function getOnboardingGroupCreated(): boolean {
	return appState.onboardingGroupCreated;
}

/**
 * Set onboarding group data
 */
export function setOnboardingGroup(group: OnboardingGroup | null): void {
	appState.onboardingGroup = group;
	console.log(`Onboarding group set:`, group);
}

/**
 * Get onboarding group data
 */
export function getOnboardingGroup(): OnboardingGroup | null {
	return appState.onboardingGroup;
}

/**
 * Get onboarding messages
 */
export function getOnboardingMessages(): Message[] {
	return appState.onboardingMessages;
}

/**
 * Add a message to onboarding conversation
 */
export function addOnboardingMessage(message: Message): void {
	appState.onboardingMessages = [...appState.onboardingMessages, message];
}

/**
 * Clear onboarding messages
 */
export function clearOnboardingMessages(): void {
	appState.onboardingMessages = [];
}

/**
 * Mark an onboarding message as rendered (prevents re-animation)
 */
export function markOnboardingMessageAsRendered(messageId: string): void {
	const message = appState.onboardingMessages.find(m => m.id === messageId);
	if (message) {
		message.is_rendered = true;
	}
}

/**
 * Get selected reply IDs for current group and user
 */
export function getSelectedReplyIds(): Record<string, string> {
	const groupId = appState.currentGroup;
	const userId = appState.currentUser;
	
	// Return existing or empty object (don't mutate during read)
	return appState.selectedReplyIds[groupId]?.[userId] ?? {};
}

/**
 * Set selected reply ID for a message
 */
export function setSelectedReplyId(messageId: string, replyId: string): void {
	const groupId = appState.currentGroup;
	const userId = appState.currentUser;
	
	// Initialize if doesn't exist
	if (!appState.selectedReplyIds[groupId]) {
		appState.selectedReplyIds[groupId] = {};
	}
	if (!appState.selectedReplyIds[groupId][userId]) {
		appState.selectedReplyIds[groupId][userId] = {};
	}
	
	appState.selectedReplyIds[groupId][userId][messageId] = replyId;
}

