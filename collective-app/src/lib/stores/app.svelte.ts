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

interface AppState {
	currentUser: UserId;
	currentGroup: GroupId;
	// Conversations scoped by group, then by user
	conversations: Record<GroupId, Record<UserId, Message[]>>;
	activeScenario: string | null;
	demoMenu: DemoMenuState;
	animationsEnabled: boolean;
	typingIndicatorVisible: boolean;
	navigationDirection: 'forward' | 'back' | null;
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
	activeScenario: null,
	demoMenu: {
		isOpen: false,
		position: { x: 20, y: 20 }
	},
	animationsEnabled: true,
	typingIndicatorVisible: false,
	navigationDirection: null
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
}

/**
 * Hide typing indicator
 */
export function hideTypingIndicator(): void {
	appState.typingIndicatorVisible = false;
}

/**
 * Get typing indicator state
 */
export function getTypingIndicatorVisible(): boolean {
	return appState.typingIndicatorVisible;
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
	
	// Wait for typing animation (800-1500ms)
	await new Promise(resolve => setTimeout(resolve, 1000));
	
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

