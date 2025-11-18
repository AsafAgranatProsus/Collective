<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
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
		// Keyboard shortcut listener
		function handleKeyPress(e: KeyboardEvent) {
			if (e.altKey && e.key === '/') {
				e.preventDefault();
				setDemoMenuOpen(!demoMenuState.isOpen);
			}
			// User shortcuts
			if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
				e.preventDefault();
				const userIds = ['sarah', 'mike', 'jessica', 'bob'];
				handleUserSwitch(userIds[parseInt(e.key) - 1]);
			}
		}
		
		window.addEventListener('keydown', handleKeyPress);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
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
			<h2 class="menu-title">⚙️ Prototype Settings</h2>
			<button class="close-btn" onclick={handleClose} aria-label="Close menu">
				✕
			</button>
		</div>
		
		<div class="menu-content">
			<!-- Fonts Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('fonts')}>
					<span>🔤 Fonts</span>
					<span class="chevron" class:expanded={expandedSection === 'fonts'}>▼</span>
				</button>
				{#if expandedSection === 'fonts'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="font-selector">
							<label for="logo-font">Logo:</label>
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
						
						<div class="font-selector">
							<label for="sans-font">Sans-Serif:</label>
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
						
						<div class="font-selector">
							<label for="serif-font">Serif:</label>
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
				{/if}
			</div>
			
			<!-- Theme Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('theme')}>
					<span>🎨 Theme & Mode</span>
					<span class="chevron" class:expanded={expandedSection === 'theme'}>▼</span>
				</button>
				{#if expandedSection === 'theme'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="theme-selector">
							<span class="selector-label">Color Theme:</span>
							<div class="theme-grid">
								{#each availableThemes as theme}
									<button 
										class="theme-btn" 
										class:active={currentTheme === theme.id}
										onclick={() => setTheme(theme.id)}
									>
										<span class="theme-name">{theme.name}</span>
										<span class="theme-desc">{theme.description}</span>
									</button>
								{/each}
							</div>
						</div>
						
						<div class="mode-selector">
							<span class="selector-label">Appearance:</span>
							<div class="button-group">
								<button 
									class="mode-btn" 
									class:active={currentMode === 'light'}
									onclick={() => setMode('light')}
								>
									☀️ Light
								</button>
								<button 
									class="mode-btn" 
									class:active={currentMode === 'dark'}
									onclick={() => setMode('dark')}
								>
									🌙 Dark
								</button>
								<button 
									class="mode-btn" 
									class:active={currentMode === 'system'}
									onclick={() => setMode('system')}
								>
									💻 Auto
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- User Switcher Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('users')}>
					<span>👥 Users</span>
					<span class="chevron" class:expanded={expandedSection === 'users'}>▼</span>
				</button>
				{#if expandedSection === 'users'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="user-grid">
							{#each members as member}
								<button 
									class="user-btn" 
									class:active={currentUser === member.id}
									onclick={() => handleUserSwitch(member.id)}
								>
									<span class="user-avatar">{member.avatar}</span>
									<span class="user-name">{member.name}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Scenarios Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('scenarios')}>
					<span>📋 Scenarios</span>
					<span class="chevron" class:expanded={expandedSection === 'scenarios'}>▼</span>
				</button>
				{#if expandedSection === 'scenarios'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="scenario-list">
							{#each scenarios as scenario}
								<button 
									class="scenario-btn"
									onclick={() => handleScenarioJump(scenario.id)}
								>
									<span class="scenario-title">{scenario.title}</span>
									<span class="scenario-desc">{scenario.description}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Demo Controls Section -->
			<div class="menu-section">
				<button class="section-header" onclick={() => toggleSection('controls')}>
					<span>🎮 Controls</span>
					<span class="chevron" class:expanded={expandedSection === 'controls'}>▼</span>
				</button>
				{#if expandedSection === 'controls'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<button class="control-btn" onclick={toggleAnimations}>
							{animationsEnabled ? '⏸ Disable' : '▶️ Enable'} Animations
						</button>
						<button class="control-btn danger" onclick={handleReset}>
							🔄 Reset Demo
						</button>
					</div>
				{/if}
			</div>
		</div>
		
		<div class="menu-footer">
			<small>Alt + / to toggle | Alt + 1-4 for users</small>
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
	}
	
	.meta-menu {
		position: fixed;
		width: min(400px, calc(100vw - 40px));
		max-height: calc(100vh - 40px);
		background: rgba(var(--m3-scheme-surface-container), 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
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
	}
	
	.menu-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
	}
	
	.close-btn {
		width: 40px;
		height: 40px;
		border-radius: var(--m3-util-rounding-full);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgb(var(--m3-scheme-on-surface-variant));
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		font-size: 1.25rem;
		border: none;
		background: transparent;
		cursor: pointer;
	}
	
	.close-btn:hover {
		background-color: rgba(var(--m3-scheme-on-surface), 0.08);
	}
	
	.close-btn:active {
		background-color: rgba(var(--m3-scheme-on-surface), 0.12);
	}
	
	.menu-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}
	
	.menu-section {
		margin-bottom: 0.75rem;
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
		border-radius: var(--m3-util-rounding-large);
		overflow: hidden;
		background: rgb(var(--m3-scheme-surface));
	}
	
	.section-header {
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: rgb(var(--m3-scheme-surface-container-low));
		color: rgb(var(--m3-scheme-on-surface));
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		cursor: pointer;
		border: none;
		text-align: left;
	}
	
	.section-header:hover {
		background-color: rgb(var(--m3-scheme-surface-container));
	}
	
	.chevron {
		transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.chevron.expanded {
		transform: rotate(180deg);
	}
	
	.section-content {
		padding: 1rem;
		background-color: rgb(var(--m3-scheme-surface));
	}
	
	.font-selector {
		margin-bottom: 1rem;
	}
	
	.font-selector:last-child {
		margin-bottom: 0;
	}
	
	.font-selector label {
		display: block;
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 0.5rem;
	}
	
	.font-selector select {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: var(--m3-util-rounding-medium);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface-container-high));
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 0.875rem;
		cursor: pointer;
	}
	
	.font-selector select:focus {
		outline: 2px solid rgb(var(--m3-scheme-primary));
		outline-offset: 2px;
	}
	
	.theme-selector {
		margin-bottom: 1rem;
	}
	
	.theme-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}
	
	.theme-btn {
		padding: 1rem;
		border-radius: var(--m3-util-rounding-large);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface-container-low));
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		cursor: pointer;
		text-align: left;
	}
	
	.theme-btn:hover {
		background-color: rgb(var(--m3-scheme-surface-container));
		box-shadow: var(--m3-util-elevation-1);
	}
	
	.theme-btn.active {
		background-color: rgb(var(--m3-scheme-primary-container));
		border-color: rgb(var(--m3-scheme-primary));
		box-shadow: var(--m3-util-elevation-2);
	}
	
	.theme-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.theme-btn.active .theme-name {
		color: rgb(var(--m3-scheme-on-primary-container));
	}
	
	.theme-desc {
		font-size: 0.75rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.theme-btn.active .theme-desc {
		color: rgb(var(--m3-scheme-on-primary-container));
		opacity: 0.8;
	}
	
	.mode-selector {
		margin-bottom: 0;
	}
	
	.selector-label {
		display: block;
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 0.75rem;
	}
	
	.button-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	
	.mode-btn {
		padding: 0.625rem 1rem;
		border-radius: var(--m3-util-rounding-full);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface-container-low));
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 0.875rem;
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		cursor: pointer;
		flex: 1;
		min-width: 80px;
	}
	
	.mode-btn:hover {
		background-color: rgb(var(--m3-scheme-surface-container));
		box-shadow: var(--m3-util-elevation-1);
	}
	
	.mode-btn.active {
		background-color: rgb(var(--m3-scheme-secondary-container));
		color: rgb(var(--m3-scheme-on-secondary-container));
		border-color: rgb(var(--m3-scheme-secondary-container));
		box-shadow: var(--m3-util-elevation-1);
	}
	
	.user-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}
	
	.user-btn {
		padding: 1rem;
		border-radius: var(--m3-util-rounding-large);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface-container-low));
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		cursor: pointer;
	}
	
	.user-btn:hover {
		background-color: rgb(var(--m3-scheme-surface-container));
		box-shadow: var(--m3-util-elevation-1);
		transform: translateY(-2px);
	}
	
	.user-btn.active {
		background-color: rgb(var(--m3-scheme-primary-container));
		border-color: rgb(var(--m3-scheme-primary));
		box-shadow: var(--m3-util-elevation-2);
	}
	
	.user-avatar {
		font-size: 2rem;
	}
	
	.user-name {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.user-btn.active .user-name {
		color: rgb(var(--m3-scheme-on-primary-container));
		font-weight: 500;
	}
	
	.scenario-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.scenario-btn {
		padding: 1rem;
		border-radius: var(--m3-util-rounding-large);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface-container-low));
		text-align: left;
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.scenario-btn:hover {
		background-color: rgb(var(--m3-scheme-surface-container));
		box-shadow: var(--m3-util-elevation-1);
		transform: translateY(-1px);
	}
	
	.scenario-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.scenario-desc {
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.control-btn {
		width: 100%;
		padding: 1rem;
		border-radius: var(--m3-util-rounding-large);
		border: 1px solid rgb(var(--m3-scheme-outline));
		background-color: rgb(var(--m3-scheme-surface-container-low));
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 0.875rem;
		transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
		cursor: pointer;
		margin-bottom: 0.5rem;
	}
	
	.control-btn:hover {
		background-color: rgb(var(--m3-scheme-surface-container));
		box-shadow: var(--m3-util-elevation-1);
	}
	
	.control-btn.danger {
		background-color: rgb(var(--m3-scheme-error-container));
		color: rgb(var(--m3-scheme-on-error-container));
		border-color: rgb(var(--m3-scheme-error));
	}
	
	.control-btn.danger:hover {
		opacity: 0.9;
		box-shadow: var(--m3-util-elevation-2);
	}
	
	.menu-footer {
		padding: 1rem;
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
		text-align: center;
		background: rgb(var(--m3-scheme-surface-container-low));
	}
	
	.menu-footer small {
		font-size: 0.75rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-mono);
	}
</style>

