<script lang="ts">
	import '../styles/global.css';
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/stores/theme.svelte';
	import { initFonts, getCurrentSansSerif, getCurrentSerif, getCurrentLogo, getMonoFont } from '$lib/stores/fonts.svelte';
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

	// Initialize theme and fonts on mount
	onMount(() => {
		initTheme();
		initFonts();
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

{@render children()}
<MetaMenu />
