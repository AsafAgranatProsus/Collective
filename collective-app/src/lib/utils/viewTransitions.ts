/**
 * View Transitions - Organic content-level animations
 * Implements parallax, stagger, and directional transitions
 */

import { cubicOut } from 'svelte/easing';

// Custom steep bezier for exceptional sleek motion
const steepBezier = (t: number) => {
	// Approximates cubic-bezier(0.34, 1.56, 0.64, 1) - overshoot effect
	const c = 1.70158;
	return 1 + c * Math.pow(t - 1, 3) + Math.pow(t - 1, 2);
};

export interface ViewTransitionParams {
	delay?: number;
	duration?: number;
	parallaxFactor?: number;
	direction?: 'forward' | 'back';
}

/**
 * Slide and fade transition for content elements
 * Creates organic motion with parallax effect
 */
export function slideContent(
	node: HTMLElement,
	{ delay = 0, duration = 400, parallaxFactor = 1, direction = 'forward' }: ViewTransitionParams = {}
) {
	// Forward: content slides in from right, exits to left
	// Back: content slides in from left, exits to right
	const distance = 60 * parallaxFactor; // Base distance with parallax
	const xStart = direction === 'forward' ? distance : -distance;

	return {
		delay,
		duration,
		easing: steepBezier,
		css: (t: number) => {
			const eased = steepBezier(t);
			const x = xStart * (1 - eased);
			const opacity = eased;
			
			return `
				transform: translateX(${x}px);
				opacity: ${opacity};
			`;
		}
	};
}

/**
 * Get staggered delay for content elements
 * Creates cascading entrance effect
 */
export function getStaggerDelay(index: number, baseDelay = 0, staggerAmount = 50): number {
	return baseDelay + (index * staggerAmount);
}

/**
 * Parallax factors for different content layers
 * Higher number = moves more (appears closer)
 * Lower number = moves less (appears farther)
 */
export const PARALLAX = {
	HEADER: 0.6,      // Slowest - background layer
	CONTENT: 1,       // Normal speed - main content
	CARDS: 1.2,       // Slightly faster - foreground
	FLOATING: 1.4     // Fastest - floating elements
};

/**
 * Standard durations for consistency
 */
export const DURATIONS = {
	FAST: 300,
	NORMAL: 400,
	SLOW: 500
};

