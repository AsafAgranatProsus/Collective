/**
 * Fonts Store - Manages font selection and dynamic loading
 * Uses Svelte 5 runes for reactivity
 */

import { 
	SANS_SERIF_FONTS, 
	SERIF_FONTS, 
	MONO_FONT,
	applyFont,
	type FontOption 
} from '$lib/utils/fontLoader';

interface FontState {
	sansSerif: FontOption;
	serif: FontOption;
	mono: FontOption;
}

// Create reactive state using Svelte 5 runes
let fontState = $state<FontState>({
	sansSerif: SANS_SERIF_FONTS[0], // Inter (default)
	serif: SERIF_FONTS[0], // Playfair Display (default)
	mono: MONO_FONT // JetBrains Mono (fixed)
});

/**
 * Initialize fonts from localStorage or defaults
 */
export function initFonts(): void {
	if (typeof window === 'undefined') return;
	
	// Load saved fonts from localStorage
	const savedSans = localStorage.getItem('collective-font-sans');
	const savedSerif = localStorage.getItem('collective-font-serif');
	
	if (savedSans) {
		const font = SANS_SERIF_FONTS.find(f => f.family === savedSans);
		if (font) {
			fontState.sansSerif = font;
			applyFont('sans', font);
		}
	} else {
		// Apply default sans-serif font
		applyFont('sans', fontState.sansSerif);
	}
	
	if (savedSerif) {
		const font = SERIF_FONTS.find(f => f.family === savedSerif);
		if (font) {
			fontState.serif = font;
			applyFont('serif', font);
		}
	} else {
		// Apply default serif font
		applyFont('serif', fontState.serif);
	}
	
	// Always apply mono font
	applyFont('mono', fontState.mono);
}

/**
 * Set sans-serif font
 */
export function setSansSerifFont(font: FontOption): void {
	fontState.sansSerif = font;
	applyFont('sans', font);
	localStorage.setItem('collective-font-sans', font.family);
}

/**
 * Set serif font
 */
export function setSerifFont(font: FontOption): void {
	fontState.serif = font;
	applyFont('serif', font);
	localStorage.setItem('collective-font-serif', font.family);
}

/**
 * Get available sans-serif fonts
 */
export function getSansSerifFonts(): FontOption[] {
	return SANS_SERIF_FONTS;
}

/**
 * Get available serif fonts
 */
export function getSerifFonts(): FontOption[] {
	return SERIF_FONTS;
}

/**
 * Get current font state
 */
export function getFontState(): FontState {
	return fontState;
}

/**
 * Get current sans-serif font
 */
export function getCurrentSansSerif(): FontOption {
	return fontState.sansSerif;
}

/**
 * Get current serif font
 */
export function getCurrentSerif(): FontOption {
	return fontState.serif;
}

/**
 * Get mono font (fixed)
 */
export function getMonoFont(): FontOption {
	return fontState.mono;
}

