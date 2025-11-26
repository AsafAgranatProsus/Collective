/**
 * Feature Flags Store - Controls experimental and optional features
 * Uses Svelte 5 runes for reactivity
 * Persists to localStorage
 */

import type { PrototypeModeId } from '$lib/config/prototypeModes';

export type AppTabsPosition = 'off' | 'top' | 'bottom';
export type GroupsViewTab = 'groups' | 'feed';

interface FeatureFlags {
	appTabs: AppTabsPosition;
	lastActiveTab: GroupsViewTab;
	prototypeMode: PrototypeModeId;
}

// Create reactive state using Svelte 5 runes
let featureFlags = $state<FeatureFlags>({
	appTabs: 'off',
	lastActiveTab: 'groups',
	prototypeMode: 'ai-first' // Default to current behavior
});

/**
 * Initialize feature flags from localStorage or defaults
 */
export function initFeatures(): void {
	if (typeof window === 'undefined') return;
	
	// Load from localStorage
	const savedAppTabs = localStorage.getItem('collective-feature-appTabs') as AppTabsPosition | null;
	const savedLastTab = localStorage.getItem('collective-last-active-tab') as GroupsViewTab | null;
	const savedMode = localStorage.getItem('collective-prototype-mode') as PrototypeModeId | null;
	
	if (savedAppTabs && ['off', 'top', 'bottom'].includes(savedAppTabs)) {
		featureFlags.appTabs = savedAppTabs;
	}
	
	if (savedLastTab && ['groups', 'feed'].includes(savedLastTab)) {
		featureFlags.lastActiveTab = savedLastTab;
	}
	
	if (savedMode && ['ai-first', 'group-chat-first'].includes(savedMode)) {
		featureFlags.prototypeMode = savedMode;
	}
	
	console.log('Feature flags initialized:', featureFlags);
}

/**
 * Get current app tabs position
 */
export function getAppTabsPosition(): AppTabsPosition {
	return featureFlags.appTabs;
}

/**
 * Set app tabs position
 */
export function setAppTabsPosition(position: AppTabsPosition): void {
	featureFlags.appTabs = position;
	
	// Persist to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('collective-feature-appTabs', position);
	}
	
	console.log(`App tabs position set to: ${position}`);
}

/**
 * Get last active tab
 */
export function getLastActiveTab(): GroupsViewTab {
	return featureFlags.lastActiveTab;
}

/**
 * Set last active tab
 */
export function setLastActiveTab(tab: GroupsViewTab): void {
	featureFlags.lastActiveTab = tab;
	
	// Persist to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('collective-last-active-tab', tab);
	}
}

/**
 * Get current prototype mode
 */
export function getCurrentPrototypeMode(): PrototypeModeId {
	return featureFlags.prototypeMode;
}

/**
 * Set prototype mode
 */
export function setPrototypeMode(mode: PrototypeModeId): void {
	featureFlags.prototypeMode = mode;
	
	// Persist to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('collective-prototype-mode', mode);
	}
	
	console.log(`Prototype mode set to: ${mode}`);
}

/**
 * Get all feature flags
 */
export function getFeatureFlags(): FeatureFlags {
	return featureFlags;
}

