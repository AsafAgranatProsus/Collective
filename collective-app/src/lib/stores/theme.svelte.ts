/**
 * Theme Store - Manages theme and mode (light/dark/system)
 * Uses Svelte 5 runes for reactivity
 */

export type ThemeName = 'midnight-coral' | 'purple-electric';
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
	theme: ThemeName;
	mode: ThemeMode;
}

// Create reactive state using Svelte 5 runes
let themeState = $state<ThemeState>({
	theme: 'midnight-coral',
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
 */
function applyThemeToDOM(): void {
	if (typeof document === 'undefined') return;
	
	const htmlElement = document.documentElement;
	
	// Set theme attribute
	htmlElement.setAttribute('data-theme', themeState.theme);
	
	// Set mode attribute
	htmlElement.setAttribute('data-mode', themeState.mode);
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
 * Derived getter for current mode
 */
export function getCurrentMode(): ThemeMode {
	return themeState.mode;
}

