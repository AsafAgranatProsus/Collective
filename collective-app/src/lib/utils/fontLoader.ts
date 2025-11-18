/**
 * Dynamic Font Loader for Google Fonts
 * Allows hot-swapping fonts without page reload
 */

export interface FontOption {
	name: string;
	family: string;
	weights?: string;
}

export const SANS_SERIF_FONTS: FontOption[] = [
	{ name: 'Figtree', family: 'Figtree', weights: '400,500,600,700' },
	{ name: 'Roboto', family: 'Roboto', weights: '400,500,700' },
	{ name: 'Inter', family: 'Inter', weights: '400,500,600,700' },
	{ name: 'DM Sans', family: 'DM Sans', weights: '400,500,600,700' },
	{ name: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', weights: '400,500,600,700' },
	{ name: 'Poppins', family: 'Poppins', weights: '400,500,600,700' },
	{ name: 'Work Sans', family: 'Work Sans', weights: '400,500,600,700' },
	{ name: 'Manrope', family: 'Manrope', weights: '400,500,600,700' },
	{ name: 'Outfit', family: 'Outfit', weights: '400,500,600,700' },
	{ name: 'Space Grotesk', family: 'Space Grotesk', weights: '400,500,600,700' },
	{ name: 'Public Sans', family: 'Public Sans', weights: '400,500,600,700' },
	{ name: 'Sora', family: 'Sora', weights: '400,500,600,700' }
];

export const SERIF_FONTS: FontOption[] = [
	{ name: 'Playfair Display', family: 'Playfair Display', weights: '400,500,600,700' },
	{ name: 'Lora', family: 'Lora', weights: '400,500,600,700' },
	{ name: 'Merriweather', family: 'Merriweather', weights: '400,700' },
	{ name: 'Crimson Pro', family: 'Crimson Pro', weights: '400,500,600,700' },
	{ name: 'Source Serif Pro', family: 'Source Serif Pro', weights: '400,600,700' },
	{ name: 'Libre Baskerville', family: 'Libre Baskerville', weights: '400,700' },
	{ name: 'Spectral', family: 'Spectral', weights: '400,500,600,700' },
	{ name: 'Cormorant', family: 'Cormorant', weights: '400,500,600,700' },
	{ name: 'Newsreader', family: 'Newsreader', weights: '400,500,600,700' },
	{ name: 'Fraunces', family: 'Fraunces', weights: '400,500,600,700' }
];

export const MONO_FONT: FontOption = {
	name: 'JetBrains Mono',
	family: 'JetBrains Mono',
	weights: '400,500'
};

export const LOGO_FONTS: FontOption[] = [
	{ name: 'Beth Ellen', family: 'Beth Ellen', weights: '' }, // No weights
	{ name: 'Miniver', family: 'Miniver', weights: '' }, // No weights
	{ name: 'Playwrite South Africa', family: 'Playwrite ZA', weights: '100..400' },
	{ name: 'Molle', family: 'Molle', weights: '' } // No weights
];

/**
 * Font loading is now handled by <svelte:head> in +layout.svelte
 * This function is kept for compatibility but does nothing
 */
export function loadGoogleFont(font: FontOption): void {
	// No-op: Fonts are loaded via <svelte:head> reactively
}

/**
 * Update CSS variable for font family
 */
export function updateFontVariable(variable: '--font-sans' | '--font-serif' | '--font-mono' | '--font-logo', fontFamily: string): void {
	// Quote font names that contain spaces
	const quotedFamily = fontFamily.includes(' ') ? `"${fontFamily}"` : fontFamily;
	const value = `${quotedFamily}, ${getFallbackStack(variable)}`;
	document.documentElement.style.setProperty(variable, value);
}

/**
 * Get appropriate fallback font stack
 */
function getFallbackStack(variable: string): string {
	switch (variable) {
		case '--font-sans':
			return 'system-ui, -apple-system, sans-serif';
		case '--font-serif':
			return 'Georgia, serif';
		case '--font-mono':
			return 'monospace';
		case '--font-logo':
			return 'cursive, fantasy';
		default:
			return 'sans-serif';
	}
}

/**
 * Load and apply a font in one step
 */
export function applyFont(
	type: 'sans' | 'serif' | 'mono' | 'logo',
	font: FontOption
): void {
	loadGoogleFont(font);
	
	const variable = type === 'sans' ? '--font-sans' 
		: type === 'serif' ? '--font-serif'
		: type === 'mono' ? '--font-mono'
		: '--font-logo';
	
	updateFontVariable(variable as any, font.family);
}

/**
 * Preload default fonts
 * No longer needed - fonts are loaded via <svelte:head> in +layout.svelte
 */
export function preloadDefaultFonts(): void {
	// No-op: Fonts are loaded via <svelte:head> reactively
}
