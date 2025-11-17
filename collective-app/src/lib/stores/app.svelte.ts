/**
 * App State Store - Main application state
 * Uses Svelte 5 runes for reactivity
 */

import type { Message } from '$lib/data/scenarios';
import { members } from '$lib/data/household';

export type UserId = 'sarah' | 'mike' | 'jessica' | 'bob';

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
	conversations: Record<UserId, Message[]>;
	activeScenario: string | null;
	demoMenu: DemoMenuState;
	animationsEnabled: boolean;
	typingIndicatorVisible: boolean;
}

// Create reactive state using Svelte 5 runes
let appState = $state<AppState>({
	currentUser: 'sarah',
	conversations: {
		sarah: [],
		mike: [],
		jessica: [],
		bob: []
	},
	activeScenario: null,
	demoMenu: {
		isOpen: false,
		position: { x: 20, y: 20 }
	},
	animationsEnabled: true,
	typingIndicatorVisible: false
});

/**
 * Get current user
 */
export function getCurrentUser(): UserId {
	return appState.currentUser;
}

/**
 * Switch to a different user
 */
export function switchUser(userId: UserId): void {
	appState.currentUser = userId;
	console.log(`Switched to user: ${userId}`);
}

/**
 * Get current conversation
 */
export function getCurrentConversation(): Message[] {
	return appState.conversations[appState.currentUser];
}

/**
 * Get conversation for specific user
 */
export function getConversation(userId: UserId): Message[] {
	return appState.conversations[userId];
}

/**
 * Add message to current user's conversation
 */
export function addMessage(message: Message): void {
	appState.conversations[appState.currentUser].push(message);
}

/**
 * Add message to specific user's conversation
 */
export function addMessageToUser(userId: UserId, message: Message): void {
	appState.conversations[userId].push(message);
}

/**
 * Clear conversation for current user
 */
export function clearCurrentConversation(): void {
	appState.conversations[appState.currentUser] = [];
}

/**
 * Clear all conversations
 */
export function clearAllConversations(): void {
	appState.conversations = {
		sarah: [],
		mike: [],
		jessica: [],
		bob: []
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
 * Load scenario into conversation
 */
export function loadScenario(scenarioId: string, initialMessages: Message[], userId: UserId): void {
	// Clear current conversation
	appState.conversations[userId] = [];
	
	// Set active scenario
	appState.activeScenario = scenarioId;
	
	// Switch to the user
	appState.currentUser = userId;
	
	// Add initial messages
	initialMessages.forEach(msg => {
		appState.conversations[userId].push(msg);
	});
	
	console.log(`Loaded scenario: ${scenarioId} for user: ${userId}`);
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
	appState.conversations = {
		sarah: [],
		mike: [],
		jessica: [],
		bob: []
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
export async function sendMessage(content: string, userId?: UserId): Promise<void> {
	const targetUser = userId || appState.currentUser;
	
	// Create user message
	const userMessage: Message = {
		id: `msg-${Date.now()}`,
		sender: 'user',
		content,
		timestamp: new Date().toISOString()
	};
	
	// Add to conversation
	addMessageToUser(targetUser, userMessage);
	
	// Note: AI response would be triggered by scenario logic or other handlers
	// This is just a helper for manual message sending
}

/**
 * Simulate AI response with typing indicator
 */
export async function sendAIResponse(
	content: string, 
	ui_elements?: Message['ui_elements'],
	userId?: UserId
): Promise<void> {
	const targetUser = userId || appState.currentUser;
	
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
	addMessageToUser(targetUser, aiMessage);
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

