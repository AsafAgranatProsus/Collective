<script lang="ts">
	import '../styles/global.css';
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/stores/theme.svelte';
	import { initFonts, getCurrentSansSerif, getCurrentSerif, getCurrentLogo, getMonoFont } from '$lib/stores/fonts.svelte';
	import { initFeatures } from '$lib/stores/features.svelte';
	import { getDemoMenuState, setDemoMenuOpen, switchUser } from '$lib/stores/app.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import MetaMenu from '$lib/components/MetaMenu.svelte';

	let { children } = $props();

	// Get reactive font state
	let sansFont = $derived(getCurrentSansSerif());
	let serifFont = $derived(getCurrentSerif());
	let logoFont = $derived(getCurrentLogo());
	let monoFont = $derived(getMonoFont());

	// Generate Google Fonts URLs (weights must be semicolon-separated for Google Fonts API)
	let sansFontUrl = $derived(`https://fonts.googleapis.com/css2?family=${sansFont.family.replace(/\s+/g, '+')}:wght@${sansFont.weights?.replace(/,/g, ';')}&display=swap`);
	let serifFontUrl = $derived(`https://fonts.googleapis.com/css2?family=${serifFont.family.replace(/\s+/g, '+')}:wght@${serifFont.weights?.replace(/,/g, ';')}&display=swap`);
	let logoFontUrl = $derived(() => {
		const family = logoFont.family.replace(/\s+/g, '+');
		// Handle fonts with no weights (like Molle)
		if (!logoFont.weights || logoFont.weights === '') {
			return `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
		}
		return `https://fonts.googleapis.com/css2?family=${family}:wght@${logoFont.weights?.replace(/,/g, ';')}&display=swap`;
	});
	let monoFontUrl = $derived(`https://fonts.googleapis.com/css2?family=${monoFont.family.replace(/\s+/g, '+')}:wght@${monoFont.weights?.replace(/,/g, ';')}&display=swap`);

	// Initialize theme, fonts, and features on mount
	onMount(() => {
		initTheme();
		initFonts();
		initFeatures();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Collective - AI Group Coordination</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
	<!-- Dynamically load Google Fonts based on selected fonts -->
	<link rel="stylesheet" href={sansFontUrl} />
	<link rel="stylesheet" href={serifFontUrl} />
	<link rel="stylesheet" href={logoFontUrl()} />
	<link rel="stylesheet" href={monoFontUrl} />
</svelte:head>

<svelte:window onkeydown={(e) => {
	// Don't trigger if user is typing in an input
	const target = e.target as HTMLElement;
	if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
		return;
	}

	// Support Alt+/ (original) and Ctrl+Space (alternative)
	if ((e.altKey && e.key === '/') || (e.ctrlKey && e.key === ' ')) {
		e.preventDefault();
		const currentState = getDemoMenuState();
		setDemoMenuOpen(!currentState.isOpen);
	}

	// User shortcuts
	if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
		e.preventDefault();
		const userIds = ['sarah', 'mike', 'jessica', 'bob'];
		switchUser(userIds[parseInt(e.key) - 1] as any);
	}
}} />

{@render children()}
<MetaMenu />
