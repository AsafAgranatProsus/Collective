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
		setSansSerifFont, 
		setSerifFont,
		getCurrentSansSerif,
		getCurrentSerif
	} from '$lib/stores/fonts.svelte';
	import { 
		setTheme, 
		setMode, 
		getCurrentTheme, 
		getCurrentMode 
	} from '$lib/stores/theme.svelte';
	import { scenarios } from '$lib/data/scenarios';
	
	let demoMenuState = $derived(getDemoMenuState());
	let currentUser = $derived(getCurrentUser());
	let animationsEnabled = $derived(getAnimationsEnabled());
	let currentSansSerif = $derived(getCurrentSansSerif());
	let currentSerif = $derived(getCurrentSerif());
	let currentTheme = $derived(getCurrentTheme());
	let currentMode = $derived(getCurrentMode());
	
	const sansSerifFonts = getSansSerifFonts();
	const serifFonts = getSerifFonts();
	const members = getAllMembers();
	
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
					<span>🎨 Theme</span>
					<span class="chevron" class:expanded={expandedSection === 'theme'}>▼</span>
				</button>
				{#if expandedSection === 'theme'}
					<div class="section-content" transition:fade={{ duration: 150 }}>
						<div class="theme-selector">
							<span class="selector-label">Color Scheme:</span>
							<div class="button-group">
								<button 
									class="theme-btn" 
									class:active={currentTheme === 'midnight-coral'}
									onclick={() => setTheme('midnight-coral')}
								>
									Midnight Coral
								</button>
								<button 
									class="theme-btn" 
									class:active={currentTheme === 'purple-electric'}
									onclick={() => setTheme('purple-electric')}
								>
									Purple Electric
								</button>
							</div>
						</div>
						
						<div class="mode-selector">
							<span class="selector-label">Mode:</span>
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
									💻 System
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
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-xl);
		z-index: var(--z-modal);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	:global(html[data-mode='dark']) .meta-menu {
		background: rgba(26, 26, 26, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.meta-menu.dragging {
		cursor: move;
	}
	
	.menu-header {
		padding: var(--space-4);
		border-bottom: 1px solid var(--border-primary);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: move;
		user-select: none;
	}
	
	.menu-title {
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		margin: 0;
		font-family: var(--font-sans);
	}
	
	.close-btn {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
		transition: all var(--transition-base);
		font-size: var(--text-lg);
	}
	
	.close-btn:hover {
		background-color: var(--bg-tertiary);
		color: var(--text-primary);
	}
	
	.menu-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-3);
	}
	
	.menu-section {
		margin-bottom: var(--space-3);
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	
	.section-header {
		width: 100%;
		padding: var(--space-3);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		font-weight: var(--weight-medium);
		font-family: var(--font-sans);
		transition: all var(--transition-base);
		cursor: pointer;
	}
	
	.section-header:hover {
		background-color: var(--bg-tertiary);
	}
	
	.chevron {
		transition: transform var(--transition-base);
		font-size: var(--text-xs);
	}
	
	.chevron.expanded {
		transform: rotate(180deg);
	}
	
	.section-content {
		padding: var(--space-3);
		background-color: var(--bg-primary);
	}
	
	.font-selector {
		margin-bottom: var(--space-3);
	}
	
	.font-selector label {
		display: block;
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin-bottom: var(--space-1);
		font-family: var(--font-sans);
	}
	
	.font-selector select {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-primary);
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		font-size: var(--text-sm);
		font-family: var(--font-sans);
	}
	
	.theme-selector, .mode-selector {
		margin-bottom: var(--space-3);
	}
	
	.selector-label {
		display: block;
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin-bottom: var(--space-2);
		font-family: var(--font-sans);
	}
	
	.button-group {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	
	.theme-btn, .mode-btn {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-primary);
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		font-size: var(--text-sm);
		font-family: var(--font-sans);
		transition: all var(--transition-base);
		cursor: pointer;
		flex: 1;
	}
	
	.theme-btn:hover, .mode-btn:hover {
		background-color: var(--bg-tertiary);
	}
	
	.theme-btn.active, .mode-btn.active {
		background-color: var(--accent);
		color: var(--text-on-accent);
		border-color: var(--accent);
	}
	
	.user-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}
	
	.user-btn {
		padding: var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-primary);
		background-color: var(--bg-secondary);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		transition: all var(--transition-base);
		cursor: pointer;
	}
	
	.user-btn:hover {
		background-color: var(--bg-tertiary);
		transform: translateY(-2px);
	}
	
	.user-btn.active {
		background-color: var(--accent);
		border-color: var(--accent);
	}
	
	.user-avatar {
		font-size: var(--text-2xl);
	}
	
	.user-name {
		font-size: var(--text-sm);
		color: var(--text-primary);
		font-family: var(--font-sans);
	}
	
	.user-btn.active .user-name {
		color: var(--text-on-accent);
	}
	
	.scenario-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	
	.scenario-btn {
		padding: var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-primary);
		background-color: var(--bg-secondary);
		text-align: left;
		transition: all var(--transition-base);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	
	.scenario-btn:hover {
		background-color: var(--bg-tertiary);
		transform: translateY(-1px);
	}
	
	.scenario-title {
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--text-primary);
		font-family: var(--font-sans);
	}
	
	.scenario-desc {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		font-family: var(--font-sans);
	}
	
	.control-btn {
		width: 100%;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-primary);
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		font-size: var(--text-sm);
		font-family: var(--font-sans);
		transition: all var(--transition-base);
		cursor: pointer;
		margin-bottom: var(--space-2);
	}
	
	.control-btn:hover {
		background-color: var(--bg-tertiary);
	}
	
	.control-btn.danger {
		background-color: var(--status-overdue-bg);
		color: var(--status-overdue-text);
		border-color: var(--status-overdue-bg);
	}
	
	.control-btn.danger:hover {
		opacity: 0.9;
	}
	
	.menu-footer {
		padding: var(--space-3);
		border-top: 1px solid var(--border-primary);
		text-align: center;
	}
	
	.menu-footer small {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
		font-family: var(--font-mono);
	}
</style>

