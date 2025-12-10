<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { Button, Icon, Select, Card, ListItem } from 'm3-svelte';
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
		loadScenario,
		setOnboardingMode,
		setOnboardingGroupCreated,
		setOnboardingGroup,
		setPostOnboardingChatStarted,
		setGroupChatBadgeCount,
		clearConversation,
		setActiveScenario,
		clearTripPlanningMessages,
		setTripGroup,
		setTripPlanningStep,
		setTripGroupChatStarted,
		type OnboardingGroup
	} from '$lib/stores/app.svelte';
	import { goto } from '$app/navigation';
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
	import { 
		getAppTabsPosition, 
		setAppTabsPosition,
		getCurrentPrototypeMode,
		setPrototypeMode,
		type AppTabsPosition 
	} from '$lib/stores/features.svelte';
	import { getAllPrototypeModes } from '$lib/config/prototypeModes';
	import { scenarios, getVisibleScenarios } from '$lib/data/scenarios';
	import { clearGroupChatMessages } from '$lib/data/groupChat';
	import { clearDynamicGroups, addDynamicGroup } from '$lib/data/groups.svelte';
	
	let demoMenuState = $derived(getDemoMenuState());
	let currentUser = $derived(getCurrentUser());
	let animationsEnabled = $derived(getAnimationsEnabled());
	let currentSansSerif = $derived(getCurrentSansSerif());
	let currentSerif = $derived(getCurrentSerif());
	let currentLogo = $derived(getCurrentLogo());
	let currentTheme = $derived(getCurrentTheme());
	let currentMode = $derived(getCurrentMode());
	let currentAppTabsPosition = $derived(getAppTabsPosition());
	let currentPrototypeMode = $derived(getCurrentPrototypeMode());
	
	const sansSerifFonts = getSansSerifFonts();
	const serifFonts = getSerifFonts();
	const logoFonts = getLogoFonts();
	const members = getAllMembers();
	const availableThemes = getAvailableThemes();
	const prototypeModes = getAllPrototypeModes();
	const visibleScenarios = getVisibleScenarios();
	
	// Convert fonts to M3 Select format
	const logoFontOptions = logoFonts.map(f => ({ text: f.name, value: f.family }));
	const sansFontOptions = sansSerifFonts.map(f => ({ text: f.name, value: f.family }));
	const serifFontOptions = serifFonts.map(f => ({ text: f.name, value: f.family }));
	
	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let menuElement: HTMLDivElement = $state() as any;
	
	let expandedSection = $state<string | null>('scenarios');
	
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
			// Special handling for onboarding scenario
			if (scenario.id === 'onboarding') {
				setOnboardingMode(true);
				setDemoMenuOpen(false);
				goto('/groups');
				return;
			}
			
			// Special handling for post-onboarding scenario
			// Shows the groups list with the newly created minimal group card
			if (scenario.id === 'post-onboarding-group') {
				// Set up the onboarding completed state
				setOnboardingMode(true);
				setOnboardingGroupCreated(true);
				setPostOnboardingChatStarted(false); // Reset so chat starts fresh
				setGroupChatBadgeCount(0); // Reset badge count
				
				// Set up the onboarding group data
				const onboardingGroup: OnboardingGroup = {
					name: 'Home Sweet Home',
					type: 'Shared apartment',
					icon: '🏠',
					memberCount: 3,
					firstExpense: {
						name: 'Rent',
						amount: '$2,550',
						splitAmount: '$850'
					},
					awaitingMembers: 2
				};
				setOnboardingGroup(onboardingGroup);
				
				// Clear any existing conversation for the onboarding group
				clearConversation('onboarding-group');
				// Also clear group chat messages
				clearGroupChatMessages('onboarding-group');
				
				setDemoMenuOpen(false);
				goto('/groups');
				return;
			}
			
			// Special handling for trip planning scenario
			if (scenario.id === 'trip-planning') {
				// Reset trip planning state
				clearTripPlanningMessages();
				setTripGroup(null);
				setTripPlanningStep('');
				setTripGroupChatStarted(false);
				clearDynamicGroups(); // Clear any previously created trip groups
				
				// Set active scenario to trip-planning
				setActiveScenario('trip-planning');
				
				// Navigate to groups page (feed tab will show trip planning mode)
				setDemoMenuOpen(false);
				goto('/groups');
				return;
			}
			
			// Special handling for trip planning group scenario (for testing group-level)
			// Pre-populates all state from "trip-planning" scenario completion
			if (scenario.id === 'trip-planning-group') {
				// Reset any existing trip state
				clearTripPlanningMessages();
				clearDynamicGroups();
				
				// Set up the trip group as if "trip-planning" was completed
				const tripGroupData = {
					id: 'barcelona-march-2025',
					name: 'Barcelona March 2025',
					icon: '✈️',
					destination: 'Barcelona',
					timing: 'Mid March',
					duration: '4-5 nights',
					memberCount: 4,
					currentMembers: ['Nishi'],
					status: 'planning' as const
				};
				setTripGroup(tripGroupData);
				
				// Add to groups list (appears at top)
				addDynamicGroup({
					id: tripGroupData.id,
					name: tripGroupData.name,
					icon: tripGroupData.icon,
					type: 'trip',
					member_count: tripGroupData.memberCount,
					is_active: true,
					members: tripGroupData.currentMembers,
					next_action: {
						text: 'Finding flights',
						due: 'In progress'
					}
				});
				
				setActiveScenario('trip-planning-group');
				setTripGroupChatStarted(false);
				setDemoMenuOpen(false);
				goto('/group/barcelona-march-2025');
				return;
			}
			
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
		class="meta-menu-wrapper"
		class:dragging={isDragging}
		style="left: {demoMenuState.position.x}px; top: {demoMenuState.position.y}px;"
		onmousedown={handleMouseDown}
		transition:scale={{ duration: 200, start: 0.95 }}
		role="dialog"
		aria-label="Prototype settings menu"
		tabindex="-1"
	>
		<Card 
			type="elevated"
			class="meta-menu-card"
		>
		<div class="meta-menu">
		<div class="menu-header">
			<h2 class="menu-title m3-font-title-large">⚙️ Prototype Settings</h2>
			<Button variant="text" iconType="full" onclick={handleClose}>
				<Icon icon={iconClose} />
			</Button>
		</div>
		
		<div class="menu-content custom-scrollbar">
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
							{#each visibleScenarios as scenario}
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
							<Select
								label="Logo Font"
								options={logoFontOptions}
								bind:value={currentLogo.family}
								onchange={(e) => {
									const font = logoFonts.find(f => f.family === e.currentTarget.value);
									if (font) setLogoFont(font);
								}}
							/>
						</div>
						
						<div class="font-selector">
							<Select
								label="Sans-Serif Font"
								options={sansFontOptions}
								bind:value={currentSansSerif.family}
								onchange={(e) => {
									const font = sansSerifFonts.find(f => f.family === e.currentTarget.value);
									if (font) setSansSerifFont(font);
								}}
							/>
						</div>
						
						<div class="font-selector">
							<Select
								label="Serif Font"
								options={serifFontOptions}
								bind:value={currentSerif.family}
								onchange={(e) => {
									const font = serifFonts.find(f => f.family === e.currentTarget.value);
									if (font) setSerifFont(font);
								}}
							/>
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
			
			<!-- Features Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('features')}>
					<span class="m3-font-title-medium">✨ Features</span>
					<span class="chevron" class:expanded={expandedSection === 'features'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'features'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="feature-group">
							<span class="selector-label m3-font-label-medium">App Tabs:</span>
							<div class="button-group">
								<Button 
									variant={currentAppTabsPosition === 'off' ? 'filled' : 'outlined'}
									onclick={() => setAppTabsPosition('off')}
								>
									Off
								</Button>
								<Button 
									variant={currentAppTabsPosition === 'top' ? 'filled' : 'outlined'}
									onclick={() => setAppTabsPosition('top')}
								>
									Top
								</Button>
								<Button 
									variant={currentAppTabsPosition === 'bottom' ? 'filled' : 'outlined'}
									onclick={() => setAppTabsPosition('bottom')}
								>
									Bottom
								</Button>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Prototype Mode Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('prototype-mode')}>
					<span class="m3-font-title-medium">🎭 Prototype Mode</span>
					<span class="chevron" class:expanded={expandedSection === 'prototype-mode'}>
						<Icon icon={iconExpandMore} />
					</span>
				</button>
				{#if expandedSection === 'prototype-mode'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="mode-selector">
							<span class="selector-label m3-font-label-medium">UX Flow:</span>
							<div class="mode-grid">
								{#each prototypeModes as mode}
									<button 
										class="custom-option-btn" 
										class:active={currentPrototypeMode === mode.id}
										onclick={() => setPrototypeMode(mode.id)}
									>
										<span class="mode-name m3-font-title-small">{mode.name}</span>
										<span class="mode-desc m3-font-body-small">{mode.description}</span>
									</button>
								{/each}
							</div>
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
		</Card>
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
	
	.meta-menu-wrapper {
		position: fixed;
		width: min(420px, calc(100vw - 40px));
		max-height: calc(100vh - 40px);
		z-index: var(--z-modal);
		display: flex;
		flex-direction: column;
	}
	
	.meta-menu-wrapper.dragging {
		cursor: move;
	}
	
	:global(.meta-menu-card) {
		width: 100%;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.meta-menu {
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 80px);
		overflow: hidden;
	}
	
	.meta-menu.dragging {
		cursor: move;
	}
	
	.menu-header {
		padding: 1.5rem;
		padding-bottom: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: move;
		user-select: none;
		background: rgb(var(--m3-scheme-surface-container-low));
		flex-shrink: 0;
	}
	
	.menu-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.menu-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem 1rem 1rem;
		background: rgb(var(--m3-scheme-surface-container-low));
		min-height: 0; /* Required for flex overflow to work */
	}
	
	.menu-section {
		margin-bottom: 0.5rem;
		border-radius: var(--m3-util-rounding-large);
		overflow: hidden;
		background: rgb(var(--m3-scheme-surface-container));
		box-shadow: var(--m3-util-elevation-1);
	}
	
	.section-header {
		position: relative;
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
		overflow: hidden;
	}
	
	.section-header::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgb(var(--m3-scheme-on-surface));
		opacity: 0;
		transition: opacity 0.2s;
	}
	
	.section-header:hover::before {
		opacity: 0.08;
	}
	
	.section-header:active::before {
		opacity: 0.12;
	}
	
	.section-header > span {
		position: relative;
		z-index: 1;
	}
	
	.chevron {
		position: relative;
		z-index: 1;
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
	
	.font-selector:last-child {
		margin-bottom: 0;
	}
	
	/* Custom Option Buttons (Theme, User, Scenario) */
	.custom-option-btn {
		position: relative;
		padding: 1rem;
		border-radius: var(--m3-util-rounding-medium);
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
		background-color: rgb(var(--m3-scheme-surface-container-highest));
		color: rgb(var(--m3-scheme-on-surface));
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
		cursor: pointer;
		text-align: left;
		width: 100%;
		overflow: hidden;
	}
	
	.custom-option-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgb(var(--m3-scheme-on-surface));
		opacity: 0;
		transition: opacity 0.2s;
	}
	
	.custom-option-btn:hover::before {
		opacity: 0.08;
	}
	
	.custom-option-btn:active::before {
		opacity: 0.12;
	}
	
	.custom-option-btn.active {
		background-color: rgb(var(--m3-scheme-secondary-container));
		color: rgb(var(--m3-scheme-on-secondary-container));
		border-color: rgb(var(--m3-scheme-secondary));
		box-shadow: var(--m3-util-elevation-1);
	}
	
	.custom-option-btn.active::before {
		background: rgb(var(--m3-scheme-on-secondary-container));
	}
	
	.custom-option-btn .theme-name,
	.custom-option-btn .scenario-title,
	.custom-option-btn .mode-name {
		font-weight: 500;
		position: relative;
		z-index: 1;
	}
	
	.custom-option-btn .theme-desc,
	.custom-option-btn .scenario-desc,
	.custom-option-btn .mode-desc {
		color: rgb(var(--m3-scheme-on-surface-variant));
		position: relative;
		z-index: 1;
	}
	
	.custom-option-btn.active .theme-desc,
	.custom-option-btn.active .scenario-desc,
	.custom-option-btn.active .mode-desc {
		color: rgb(var(--m3-scheme-on-secondary-container));
		opacity: 0.9;
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
		padding: 0.75rem;
	}
	
	.user-avatar {
		font-size: 2.5rem;
		margin-bottom: 0.25rem;
		position: relative;
		z-index: 1;
	}
	
	.user-name {
		position: relative;
		z-index: 1;
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
	
	.button-group :global(.m3-button) {
		flex: 1;
		min-width: fit-content;
	}
	
	.menu-footer {
		padding: 0.75rem 1.5rem;
		text-align: center;
		background: rgb(var(--m3-scheme-surface-container-low));
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant) / 0.5);
		flex-shrink: 0;
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
	
	.mode-selector {
		margin-bottom: 1rem;
	}
	
	.mode-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.5rem;
	}
	
	
	.feature-group {
		margin-bottom: 1rem;
	}
	
	.feature-group:last-child {
		margin-bottom: 0;
	}
</style>

