<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { Button, Icon } from 'm3-svelte';
	import iconClose from '@ktibow/iconset-material-symbols/close';
	import iconExpandMore from '@ktibow/iconset-material-symbols/expand-more';
	import { 
		getDemoMenuState, 
		setDemoMenuOpen, 
		switchUser, 
		resetDemo, 
		toggleAnimations, 
		getAnimationsEnabled, 
		getCurrentUser,
		getAllMembers,
		loadScenario
	} from '$lib/stores/app.svelte';
	import { 
		getSansSerifFonts, 
		getSerifFonts,
		getLogoFonts,
		setSansSerifFont, 
		setSerifFont,
		setLogoFont,
		getCurrentSansSerif,
		getCurrentSerif,
		getCurrentLogo
	} from '$lib/stores/fonts.svelte';
	import { 
		setTheme, 
		setMode, 
		getCurrentTheme, 
		getCurrentMode,
		getAvailableThemes 
	} from '$lib/stores/theme.svelte';
	import { scenarios } from '$lib/data/scenarios';
	
	let demoMenuState = $derived(getDemoMenuState());
	let currentUser = $derived(getCurrentUser());
	let animationsEnabled = $derived(getAnimationsEnabled());
	let currentSansSerif = $derived(getCurrentSansSerif());
	let currentSerif = $derived(getCurrentSerif());
	let currentLogo = $derived(getCurrentLogo());
	let currentTheme = $derived(getCurrentTheme());
	let currentMode = $derived(getCurrentMode());
	
	const sansSerifFonts = getSansSerifFonts();
	const serifFonts = getSerifFonts();
	const logoFonts = getLogoFonts();
	const members = getAllMembers();
	const availableThemes = getAvailableThemes();
	
	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let menuElement: HTMLDivElement = $state() as any;
	
	let expandedSection = $state<string | null>('fonts');
	
	function toggleSection(section: string) {
		expandedSection = expandedSection === section ? null : section;
	}
	
	function handleClose() {
		setDemoMenuOpen(false);
	}
	
	function handleUserSwitch(userId: string) {
		switchUser(userId as any);
	}
	
	function handleReset() {
		if (confirm('Reset the demo? This will clear all conversations.')) {
			resetDemo();
		}
	}
	
	function handleScenarioJump(scenarioId: string) {
		const scenario = scenarios.find(s => s.id === scenarioId);
		if (scenario) {
			// Switch to the scenario's initial user if needed
			if (scenario.initial_user && scenario.initial_user !== currentUser) {
				switchUser(scenario.initial_user as any);
			}
			// Load scenario with its messages
			loadScenario(scenario.id, scenario.messages, scenario.initial_user as any);
			setDemoMenuOpen(false);
		}
	}
	
	// Dragging functionality
	function handleMouseDown(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('.menu-header')) {
			isDragging = true;
			const rect = menuElement.getBoundingClientRect();
			dragOffset = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		}
	}
	
	function handleMouseMove(e: MouseEvent) {
		if (isDragging && menuElement) {
			const x = e.clientX - dragOffset.x;
			const y = e.clientY - dragOffset.y;
			
			menuElement.style.left = `${x}px`;
			menuElement.style.top = `${y}px`;
		}
	}
	
	function handleMouseUp() {
		isDragging = false;
	}
	
	onMount(() => {
		console.log('MetaMenu mounted');
		
		// Ensure menu starts closed to avoid blocking UI
		setDemoMenuOpen(false);

		// Dragging event listeners
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	});
</script>

{#if demoMenuState.isOpen}
	<button 
		class="meta-menu-overlay" 
		onclick={handleClose}
		transition:fade={{ duration: 200 }}
		aria-label="Close menu"
	></button>
	
	<div 
		bind:this={menuElement}
		class="meta-menu"
		class:dragging={isDragging}
		style="left: {demoMenuState.position.x}px; top: {demoMenuState.position.y}px;"
		onmousedown={handleMouseDown}
		transition:scale={{ duration: 200, start: 0.95 }}
		role="dialog"
		aria-label="Prototype settings menu"
		tabindex="-1"
	>
		<div class="menu-header">
			<h2 class="menu-title m3-font-title-large">⚙️ Prototype Settings</h2>
			<Button variant="text" iconType="full" onclick={handleClose}>
				<Icon icon={iconClose} />
			</Button>
		</div>
		
		<div class="menu-content">
			<!-- Fonts Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('fonts')}>
					<span class="m3-font-title-medium">🔤 Fonts</span>
					<span class="chevron" class:expanded={expandedSection === 'fonts'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'fonts'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="font-selector">
							<label for="logo-font" class="m3-font-label-medium">Logo:</label>
							<div class="select-wrapper">
								<select 
									id="logo-font" 
									value={currentLogo.family}
									onchange={(e) => {
										const font = logoFonts.find(f => f.family === e.currentTarget.value);
										if (font) setLogoFont(font);
									}}
								>
									{#each logoFonts as font}
										<option value={font.family}>{font.name}</option>
									{/each}
								</select>
							</div>
						</div>
						
						<div class="font-selector">
							<label for="sans-font" class="m3-font-label-medium">Sans-Serif:</label>
							<div class="select-wrapper">
								<select 
									id="sans-font" 
									value={currentSansSerif.family}
									onchange={(e) => {
										const font = sansSerifFonts.find(f => f.family === e.currentTarget.value);
										if (font) setSansSerifFont(font);
									}}
								>
									{#each sansSerifFonts as font}
										<option value={font.family}>{font.name}</option>
									{/each}
								</select>
							</div>
						</div>
						
						<div class="font-selector">
							<label for="serif-font" class="m3-font-label-medium">Serif:</label>
							<div class="select-wrapper">
								<select 
									id="serif-font"
									value={currentSerif.family}
									onchange={(e) => {
										const font = serifFonts.find(f => f.family === e.currentTarget.value);
										if (font) setSerifFont(font);
									}}
								>
									{#each serifFonts as font}
										<option value={font.family}>{font.name}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Theme Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('theme')}>
					<span class="m3-font-title-medium">🎨 Theme & Mode</span>
					<span class="chevron" class:expanded={expandedSection === 'theme'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'theme'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="theme-selector">
							<span class="selector-label m3-font-label-medium">Color Theme:</span>
							<div class="theme-grid">
								{#each availableThemes as theme}
									<button 
										class="custom-option-btn" 
										class:active={currentTheme === theme.id}
										onclick={() => setTheme(theme.id)}
									>
										<span class="theme-name m3-font-title-small">{theme.name}</span>
										<span class="theme-desc m3-font-body-small">{theme.description}</span>
									</button>
								{/each}
							</div>
						</div>
						
						<div class="mode-selector">
							<span class="selector-label m3-font-label-medium">Appearance:</span>
							<div class="button-group">
								<Button 
									variant={currentMode === 'light' ? 'filled' : 'outlined'}
									onclick={() => setMode('light')}
								>
									☀️ Light
								</Button>
								<Button 
									variant={currentMode === 'dark' ? 'filled' : 'outlined'}
									onclick={() => setMode('dark')}
								>
									🌙 Dark
								</Button>
								<Button 
									variant={currentMode === 'system' ? 'filled' : 'outlined'}
									onclick={() => setMode('system')}
								>
									💻 Auto
								</Button>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- User Switcher Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('users')}>
					<span class="m3-font-title-medium">👥 Users</span>
					<span class="chevron" class:expanded={expandedSection === 'users'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'users'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="user-grid">
							{#each members as member}
								<button 
									class="custom-option-btn user-option" 
									class:active={currentUser === member.id}
									onclick={() => handleUserSwitch(member.id)}
								>
									<span class="user-avatar">{member.avatar}</span>
									<span class="user-name m3-font-label-large">{member.name}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Scenarios Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('scenarios')}>
					<span class="m3-font-title-medium">📋 Scenarios</span>
					<span class="chevron" class:expanded={expandedSection === 'scenarios'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'scenarios'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="scenario-list">
							{#each scenarios as scenario}
								<button 
									class="custom-option-btn scenario-option"
									onclick={() => handleScenarioJump(scenario.id)}
								>
									<span class="scenario-title m3-font-title-small">{scenario.title}</span>
									<span class="scenario-desc m3-font-body-small">{scenario.description}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Demo Controls Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('controls')}>
					<span class="m3-font-title-medium">🎮 Controls</span>
					<span class="chevron" class:expanded={expandedSection === 'controls'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'controls'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="controls-list">
							<Button 
								variant="tonal" 
								onclick={toggleAnimations}
							>
								{animationsEnabled ? '⏸ Disable' : '▶️ Enable'} Animations
							</Button>
							<Button 
								variant="filled" 
								onclick={handleReset}
								style="background-color: rgb(var(--m3-scheme-error)); color: rgb(var(--m3-scheme-on-error));"
							>
								🔄 Reset Demo
							</Button>
						</div>
					</div>
				{/if}
			</div>
		</div>
		
		<div class="menu-footer">
			<small class="m3-font-body-small">Alt + / to toggle | Alt + 1-4 for users</small>
		</div>
	</div>
{/if}

<style>
	.meta-menu-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: var(--z-modal-backdrop);
		backdrop-filter: blur(2px);
		border: none;
		cursor: pointer;
	}
	
	.meta-menu {
		position: fixed;
		width: min(400px, calc(100vw - 40px));
		max-height: calc(100vh - 40px);
		background: rgb(var(--m3-scheme-surface));
		border-radius: var(--m3-util-rounding-extra-large);
		box-shadow: var(--m3-util-elevation-3);
		z-index: var(--z-modal);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.meta-menu.dragging {
		cursor: move;
	}
	
	.menu-header {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: move;
		user-select: none;
		background: rgb(var(--m3-scheme-surface));
	}
	
	.menu-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.menu-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		background: rgb(var(--m3-scheme-surface-container-low));
	}
	
	.menu-section {
		margin-bottom: 0.75rem;
		border-radius: var(--m3-util-rounding-large);
		overflow: hidden;
		background: rgb(var(--m3-scheme-surface-container));
	}
	
	.section-header {
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgb(var(--m3-scheme-surface-container-high));
		color: rgb(var(--m3-scheme-on-surface));
		transition: background-color 0.2s;
		cursor: pointer;
		border: none;
		text-align: left;
	}
	
	.section-header:hover {
		background-color: rgb(var(--m3-scheme-surface-container-highest));
	}
	
	.chevron {
		transition: transform 0.2s;
		color: rgb(var(--m3-scheme-on-surface-variant));
		display: flex;
		align-items: center;
	}
	
	.chevron.expanded {
		transform: rotate(180deg);
	}
	
	.section-content {
		padding: 1rem;
		background-color: rgb(var(--m3-scheme-surface-container));
	}
	
	/* Form Elements */
	.font-selector {
		margin-bottom: 1rem;
	}
	
	.font-selector label {
		display: block;
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 0.5rem;
	}
	
	.select-wrapper {
		position: relative;
	}
	
	.font-selector select {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: var(--m3-util-rounding-small);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface));
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 0.875rem;
		cursor: pointer;
		appearance: none;
	}
	
	.font-selector select:focus {
		outline: 2px solid rgb(var(--m3-scheme-primary));
		border-color: transparent;
	}
	
	/* Custom Option Buttons (Theme, User, Scenario) */
	.custom-option-btn {
		padding: 1rem;
		border-radius: var(--m3-util-rounding-medium);
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
		background-color: rgb(var(--m3-scheme-surface));
		color: rgb(var(--m3-scheme-on-surface));
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		transition: all 0.2s;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}
	
	.custom-option-btn:hover {
		background-color: rgb(var(--m3-scheme-surface-container-high));
		border-color: rgb(var(--m3-scheme-outline));
	}
	
	.custom-option-btn.active {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
		border-color: rgb(var(--m3-scheme-primary));
	}
	
	.custom-option-btn .theme-name,
	.custom-option-btn .scenario-title {
		font-weight: 500;
	}
	
	.custom-option-btn .theme-desc,
	.custom-option-btn .scenario-desc {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.custom-option-btn.active .theme-desc,
	.custom-option-btn.active .scenario-desc {
		color: rgb(var(--m3-scheme-on-primary-container));
		opacity: 0.8;
	}
	
	/* Grids */
	.theme-grid, .user-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.5rem;
	}
	
	.user-option {
		align-items: center;
		text-align: center;
	}
	
	.user-avatar {
		font-size: 2rem;
		margin-bottom: 0.25rem;
	}
	
	.scenario-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	/* Controls */
	.controls-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.button-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	
	.menu-footer {
		padding: 1rem;
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
		text-align: center;
		background: rgb(var(--m3-scheme-surface));
	}
	
	.menu-footer small {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-mono);
	}
	
	.selector-label {
		display: block;
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 0.75rem;
	}
	
	.theme-selector {
		margin-bottom: 1.5rem;
	}
</style>

