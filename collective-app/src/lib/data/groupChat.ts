/**
 * Group Chat Messages - Peer-to-peer chat within groups
 * AI observes these messages passively
 */

export interface GroupChatMessage {
	id: string;
	sender: string; // member ID or 'system' for system messages
	sender_name: string;
	avatar: string; // emoji
	content: string;
	timestamp: string; // ISO date
	type?: 'message' | 'system' | 'typing'; // default is 'message'
}

/**
 * Mock group chat messages per group
 * For demo: only Brooklyn Apt has messages
 */
export const groupChatMessages: Record<string, GroupChatMessage[]> = {
	'brooklyn-apt': [
		{
			id: 'gc-001',
			sender: 'bob',
			sender_name: 'Bob Kim',
			avatar: '👨🏻‍🎨',
			content: 'Anyone else think we need to clean the bathroom more often? Getting kinda gross',
			timestamp: '2024-11-17T14:23:00Z'
		},
		{
			id: 'gc-002',
			sender: 'jessica',
			sender_name: 'Jessica Taylor',
			avatar: '👩🏼‍💼',
			content: 'Yeah agree',
			timestamp: '2024-11-17T14:25:00Z'
		},
		{
			id: 'gc-003',
			sender: 'sarah',
			sender_name: 'You',
			avatar: '👩🏻‍💼',
			content: "I'm down for weekly instead of bi-weekly",
			timestamp: '2024-11-17T14:26:00Z'
		},
		{
			id: 'gc-004',
			sender: 'mike',
			sender_name: 'Mike Rodriguez',
			avatar: '👨🏽‍💻',
			content: 'Same',
			timestamp: '2024-11-17T14:27:00Z'
		},
		{
			id: 'gc-005',
			sender: 'mike',
			sender_name: 'Mike Rodriguez',
			avatar: '👨🏽‍💻',
			content: "Also FYI I'm traveling next week",
			timestamp: '2024-11-17T16:30:00Z'
		},
		{
			id: 'gc-006',
			sender: 'sarah',
			sender_name: 'You',
			avatar: '👩🏻‍💼',
			content: 'No worries! Have fun',
			timestamp: '2024-11-17T16:32:00Z'
		},
		{
			id: 'gc-007',
			sender: 'jessica',
			sender_name: 'Jessica Taylor',
			avatar: '👩🏼‍💼',
			content: 'Pizza tonight?',
			timestamp: '2024-11-17T18:15:00Z'
		},
		{
			id: 'gc-008',
			sender: 'bob',
			sender_name: 'Bob Kim',
			avatar: '👨🏻‍🎨',
			content: "I'm in!",
			timestamp: '2024-11-17T18:16:00Z'
		}
	]
};

/**
 * Get group chat messages for a specific group
 */
export function getGroupChatMessages(groupId: string): GroupChatMessage[] {
	return groupChatMessages[groupId] || [];
}

/**
 * Add a message to group chat (for demo interactivity)
 */
export function addGroupChatMessage(groupId: string, message: GroupChatMessage): void {
	if (!groupChatMessages[groupId]) {
		groupChatMessages[groupId] = [];
	}
	groupChatMessages[groupId].push(message);
}

/**
 * Clear all messages for a specific group chat
 */
export function clearGroupChatMessages(groupId: string): void {
	groupChatMessages[groupId] = [];
}

/**
 * Remove a specific message by ID
 */
export function removeGroupChatMessage(groupId: string, messageId: string): void {
	if (groupChatMessages[groupId]) {
		groupChatMessages[groupId] = groupChatMessages[groupId].filter(m => m.id !== messageId);
	}
}

