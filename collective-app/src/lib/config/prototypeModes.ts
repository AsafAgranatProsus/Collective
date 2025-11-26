/**
 * Prototype Modes Configuration
 * 
 * Centralized configuration for different UX flows to demo to stakeholders.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for conventions
 * 
 * ## Prototype Modes
 * 
 * - `ai-first`: AI chat is primary view, group chat secondary
 * - `group-chat-first`: Group chat is primary, AI is assistant
 * 
 * ## Presentation Mode
 * 
 * When demoing to users/stakeholders, use presentation scenarios.
 * These are curated, tested flows that work reliably.
 * 
 * @see PRESENTATION_SCENARIOS below
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

// =============================================================================
// PRESENTATION MODE
// =============================================================================

/**
 * Curated list of scenarios that are polished and demo-ready.
 * Add scenarios here only after verification with the checklist in PROTOTYPING_GUIDE.md.
 * 
 * Checklist before adding:
 * - [ ] All messages display correctly
 * - [ ] Cards render without errors
 * - [ ] Quick replies have working handlers
 * - [ ] Flow has clear beginning and end
 * - [ ] No console errors during flow
 */
export const PRESENTATION_SCENARIOS: string[] = [
	'scenario-1',      // View My Tasks - core demo flow
	'onboarding',      // New user onboarding - cold boot experience
	// Add more as they are verified
];

/**
 * Check if a scenario is marked as presentation-ready
 */
export function isPresentationReady(scenarioId: string): boolean {
	return PRESENTATION_SCENARIOS.includes(scenarioId);
}

/**
 * Get all presentation-ready scenario IDs
 */
export function getPresentationScenarios(): string[] {
	return [...PRESENTATION_SCENARIOS];
}

