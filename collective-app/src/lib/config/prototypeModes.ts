/**
 * Prototype Modes Configuration
 * Centralized configuration for different UX flows to demo to stakeholders
 */

export type PrototypeModeId = 'ai-first' | 'group-chat-first';
export type ViewType = 'ai-chat' | 'group-chat';
export type SecondaryAccessType = 'toggle-button' | 'tab' | 'hidden';

export interface PrototypeMode {
	id: PrototypeModeId;
	name: string;
	description: string;
	
	// Group page behavior
	groupPage: {
		primaryView: ViewType;
		secondaryView: ViewType | null;
		secondaryViewAccess: SecondaryAccessType;
	};
	
	// Navigation behavior
	navigation: {
		groupCardClick: string; // Path template: '/group/[id]' will have ID substituted
		feedMessageClick: string;
	};
	
	// Feature visibility
	features: {
		showAIInHeader: boolean;
		showGroupChatBadge: boolean;
		showQuickAIPrompts: boolean;
	};
	
	// UI labels/strings
	labels: {
		primaryActionButton: string;
		secondaryToggleLabel: string;
	};
}

export const PROTOTYPE_MODES: Record<PrototypeModeId, PrototypeMode> = {
	'ai-first': {
		id: 'ai-first',
		name: 'AI-First',
		description: 'AI chat is primary, group chat secondary',
		groupPage: {
			primaryView: 'ai-chat',
			secondaryView: 'group-chat',
			secondaryViewAccess: 'toggle-button'
		},
		navigation: {
			groupCardClick: '/group/[id]',
			feedMessageClick: '/group/[id]'
		},
		features: {
			showAIInHeader: true,
			showGroupChatBadge: true,
			showQuickAIPrompts: true
		},
		labels: {
			primaryActionButton: 'Ask AI',
			secondaryToggleLabel: 'Group Chat'
		}
	},
	
	'group-chat-first': {
		id: 'group-chat-first',
		name: 'Group Chat First',
		description: 'Group chat is primary, AI is assistant',
		groupPage: {
			primaryView: 'group-chat',
			secondaryView: 'ai-chat',
			secondaryViewAccess: 'toggle-button'
		},
		navigation: {
			groupCardClick: '/group/[id]',
			feedMessageClick: '/group/[id]'
		},
		features: {
			showAIInHeader: false,
			showGroupChatBadge: false,
			showQuickAIPrompts: false
		},
		labels: {
			primaryActionButton: 'Send Message',
			secondaryToggleLabel: 'AI Assistant'
		}
	}
};

/**
 * Get all available prototype modes
 */
export function getAllPrototypeModes(): PrototypeMode[] {
	return Object.values(PROTOTYPE_MODES);
}

/**
 * Get a specific mode by ID
 */
export function getPrototypeModeById(id: PrototypeModeId): PrototypeMode {
	return PROTOTYPE_MODES[id];
}

