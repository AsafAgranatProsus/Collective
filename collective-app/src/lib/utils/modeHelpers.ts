/**
 * Mode Helpers - Utility functions for working with prototype modes
 */

import { getCurrentPrototypeMode } from '$lib/stores/features.svelte';
import { getPrototypeModeById } from '$lib/config/prototypeModes';
import type { PrototypeMode } from '$lib/config/prototypeModes';

/**
 * Get the current mode's full configuration
 */
export function getModeConfig(): PrototypeMode {
	const currentModeId = getCurrentPrototypeMode();
	return getPrototypeModeById(currentModeId);
}

/**
 * Check if a feature should be shown based on current mode
 */
export function shouldShowFeature(featureName: keyof PrototypeMode['features']): boolean {
	const config = getModeConfig();
	return config.features[featureName];
}

/**
 * Get the navigation path for a specific action
 * Replaces [id] placeholder with actual group ID
 */
export function getNavigationPath(action: keyof PrototypeMode['navigation'], groupId?: string): string {
	const config = getModeConfig();
	let path = config.navigation[action];
	
	// Replace [id] placeholder if groupId is provided
	if (groupId) {
		path = path.replace('[id]', groupId);
	}
	
	return path;
}

/**
 * Get a mode-specific label
 */
export function getModeLabel(labelKey: keyof PrototypeMode['labels']): string {
	const config = getModeConfig();
	return config.labels[labelKey];
}

/**
 * Get the primary view type for the group page
 */
export function getPrimaryView(): PrototypeMode['groupPage']['primaryView'] {
	const config = getModeConfig();
	return config.groupPage.primaryView;
}

/**
 * Get the secondary view type for the group page
 */
export function getSecondaryView(): PrototypeMode['groupPage']['secondaryView'] {
	const config = getModeConfig();
	return config.groupPage.secondaryView;
}

/**
 * Get how the secondary view should be accessed
 */
export function getSecondaryViewAccess(): PrototypeMode['groupPage']['secondaryViewAccess'] {
	const config = getModeConfig();
	return config.groupPage.secondaryViewAccess;
}

