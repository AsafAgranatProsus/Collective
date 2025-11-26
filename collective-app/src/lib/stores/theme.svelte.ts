/**
 * Theme Store - Manages M3 theme and mode (light/dark/system)
 * Uses Svelte 5 runes for reactivity
 * 
 * With M3, we have a single theme with light/dark variants controlled by
 * the @media (prefers-color-scheme) in m3-theme.css
 */

export type ThemeName = 'm3-cyan-yellow' | 'm3-neutral-purple' | 'm3-blue' | 'm3-green' | 'm3-red'; // M3 themes
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
	theme: ThemeName;
	mode: ThemeMode;
}

// Create reactive state using Svelte 5 runes
let themeState = $state<ThemeState>({
	theme: 'm3-cyan-yellow',
	mode: 'system'
});

/**
 * Initialize theme from localStorage or defaults
 */
export function initTheme(): void {
	if (typeof window === 'undefined') return;
	
	// Load from localStorage
	const savedTheme = localStorage.getItem('collective-theme') as ThemeName | null;
	const savedMode = localStorage.getItem('collective-mode') as ThemeMode | null;
	
	if (savedTheme) {
		themeState.theme = savedTheme;
	}
	
	if (savedMode) {
		themeState.mode = savedMode;
	}
	
	// Apply theme to HTML element
	applyThemeToDOM();
	
	// Listen for system preference changes
	if (themeState.mode === 'system') {
		watchSystemPreference();
	}
}

/**
 * Set theme
 */
export function setTheme(theme: ThemeName): void {
	themeState.theme = theme;
	localStorage.setItem('collective-theme', theme);
	applyThemeToDOM();
}

/**
 * Set mode (light/dark/system)
 */
export function setMode(mode: ThemeMode): void {
	themeState.mode = mode;
	localStorage.setItem('collective-mode', mode);
	applyThemeToDOM();
	
	if (mode === 'system') {
		watchSystemPreference();
	}
}

/**
 * Toggle between light and dark mode
 */
export function toggleMode(): void {
	const newMode = themeState.mode === 'dark' ? 'light' : 'dark';
	setMode(newMode);
}

/**
 * Apply theme and mode to DOM
 * For M3, we need to set the color-scheme property which triggers
 * the @media (prefers-color-scheme) rules in m3-theme.css
 */
function applyThemeToDOM(): void {
	if (typeof document === 'undefined') return;
	
	const htmlElement = document.documentElement;
	
	// Set theme attribute (for potential future multi-theme support)
	htmlElement.setAttribute('data-theme', themeState.theme);
	
	// Get effective mode (resolve 'system' to 'light' or 'dark')
	const effectiveMode = getEffectiveMode();
	
	// Set mode attribute to the EFFECTIVE mode (not 'system')
	// This ensures CSS selectors like :root[data-mode='light'] work correctly
	htmlElement.setAttribute('data-mode', effectiveMode);
	
	// Set color-scheme CSS property - this is what M3 uses
	// This triggers the @media (prefers-color-scheme) rules
	htmlElement.style.colorScheme = effectiveMode;
	
	// Also set the meta theme-color for mobile browsers
	updateMetaThemeColor(effectiveMode);
}

/**
 * Get current effective mode (resolves 'system' to 'light' or 'dark')
 */
export function getEffectiveMode(): 'light' | 'dark' {
	if (themeState.mode !== 'system') {
		return themeState.mode;
	}
	
	if (typeof window === 'undefined') return 'light';
	
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Update meta theme-color for mobile browsers
 */
function updateMetaThemeColor(mode: 'light' | 'dark'): void {
	if (typeof document === 'undefined') return;
	
	let metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (!metaThemeColor) {
		metaThemeColor = document.createElement('meta');
		metaThemeColor.setAttribute('name', 'theme-color');
		document.head.appendChild(metaThemeColor);
	}
	
	// Set theme color based on M3 scheme and current theme
	const theme = themeState.theme;
	let color: string;
	
	if (theme === 'm3-cyan-yellow') {
		color = mode === 'light' ? '#EFFCFF' : '#001115';
	} else if (theme === 'm3-neutral-purple') {
		color = mode === 'light' ? '#FDF8F9' : '#0F0E0F';
	} else if (theme === 'm3-blue') {
		color = mode === 'light' ? '#FAF9FF' : '#1A1B20';
	} else if (theme === 'm3-green') {
		color = mode === 'light' ? '#F8FBF6' : '#191C19';
	} else if (theme === 'm3-red') {
		color = mode === 'light' ? '#FFF8F7' : '#201A19';
	} else {
		color = mode === 'light' ? '#EFFCFF' : '#001115';
	}
	
	metaThemeColor.setAttribute('content', color);
}

/**
 * Watch for system preference changes
 */
function watchSystemPreference(): void {
	if (typeof window === 'undefined') return;
	
	const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
	
	// Update on change
	darkModeQuery.addEventListener('change', (e) => {
		if (themeState.mode === 'system') {
			applyThemeToDOM();
		}
	});
}

/**
 * Export reactive state
 */
export function getThemeState() {
	return themeState;
}

/**
 * Derived getter for current theme
 */
export function getCurrentTheme(): ThemeName {
	return themeState.theme;
}

/**
 * Get all available themes
 */
export function getAvailableThemes(): Array<{ id: ThemeName; name: string; description: string }> {
	return [
		{ id: 'm3-cyan-yellow', name: 'Cyan & Yellow', description: 'Vibrant cyan and yellow accents' },
		{ id: 'm3-neutral-purple', name: 'Neutral Purple', description: 'Subtle grayscale with purple hints' },
		{ id: 'm3-blue', name: 'Blue (Tonal Spot)', description: 'Home Assistant default theme' },
		{ id: 'm3-green', name: 'Green (Nature)', description: 'Nature-inspired green palette' },
		{ id: 'm3-red', name: 'Red (Vibrant)', description: 'Energetic red theme' }
	];
}

/**
 * Derived getter for current mode
 */
export function getCurrentMode(): ThemeMode {
	return themeState.mode;
}

