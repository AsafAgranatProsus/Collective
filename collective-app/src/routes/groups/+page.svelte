<script lang="ts">
	import { goto } from '$app/navigation';
	import GroupCard from '$lib/components/GroupCard.svelte';
	import MetaMenu from '$lib/components/MetaMenu.svelte';
	import { getAllGroups } from '$lib/data/groups';
	import { setDemoMenuOpen, setNavigationDirection } from '$lib/stores/app.svelte';
	import { slideContent, getStaggerDelay, PARALLAX, DURATIONS } from '$lib/utils/viewTransitions';
	
	const groups = getAllGroups();
	
	let tapCount = 0;
	let tapTimeout: ReturnType<typeof setTimeout>;
	
	function handleGroupClick(groupId: string) {
		setNavigationDirection('forward');
		goto(`/group/${groupId}`);
	}
	
	// Triple-tap logo to open meta menu
	function handleLogoTap() {
		tapCount++;
		clearTimeout(tapTimeout);
		
		if (tapCount === 3) {
			setDemoMenuOpen(true);
			tapCount = 0;
		} else {
			tapTimeout = setTimeout(() => {
				tapCount = 0;
			}, 500);
		}
	}
</script>

<div class="groups-page">
	<!-- Background -->
	<div class="background-gradient"></div>
	
	<!-- Header -->
	<header 
		class="page-header"
		in:slideContent={{ duration: DURATIONS.FAST, parallaxFactor: PARALLAX.HEADER }}
	>
		<button class="logo" onclick={handleLogoTap} aria-label="Open menu">
			<span class="logo-text">collective</span>
		</button>
	</header>
	
	<!-- Groups List -->
	<div class="groups-container">
		<!-- <h1 
			class="page-title"
			in:slideContent={{ delay: 50, duration: DURATIONS.NORMAL, parallaxFactor: PARALLAX.CONTENT }}
		>
			My Groups
		</h1> -->
		
		<div class="groups-list">
			{#each groups as group, index (group.id)}
				<div
					in:slideContent={{ 
						delay: getStaggerDelay(index, 100), 
						duration: DURATIONS.NORMAL, 
						parallaxFactor: PARALLAX.CARDS 
					}}
				>
					<GroupCard 
						{group}
						onClick={() => handleGroupClick(group.id)}
					/>
				</div>
			{/each}
		</div>
		
		<button 
			class="create-group-btn" 
			disabled 
			aria-label="Create new group"
			in:slideContent={{ 
				delay: getStaggerDelay(groups.length, 100), 
				duration: DURATIONS.NORMAL, 
				parallaxFactor: PARALLAX.FLOATING 
			}}
		>
			<span class="plus-icon">+</span>
			<span>Create New Group</span>
		</button>
	</div>
	
	<!-- Meta Menu (Prototype Settings) -->
	<MetaMenu />
</div>

<style>
	.groups-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	
	.background-gradient {
		position: fixed;
		inset: 0;
		background: var(--gradient-mesh);
		z-index: -1;
	}
	
	.page-header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		padding: var(--space-4) var(--space-5);
		background-color: transparent;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	:global(html[data-mode='dark']) .page-header {
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.logo {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}
	
	.logo-text {
		font-family: var(--font-logo);
		font-size: var(--text-2xl);
		font-weight: var(--weight-bold);
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}
	
	.groups-container {
		flex: 1;
		padding: var(--space-6) var(--space-5);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-5);
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
	}
	
	.page-title {
		font-size: var(--text-2xl);
		font-weight: var(--weight-bold);
		color: var(--text-primary);
		margin: 0;
		align-self: flex-start;
		font-family: var(--font-sans);
	}
	
	.groups-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		width: 100%;
	}
	
	.create-group-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: 2px dashed rgba(255, 255, 255, 0.3);
		border-radius: var(--radius-lg);
		color: var(--text-secondary);
		font-size: var(--text-base);
		font-family: var(--font-sans);
		cursor: not-allowed;
		transition: all var(--transition-base);
		opacity: 0.6;
		width: 100%;
		max-width: 500px;
		justify-content: center;
	}
	
	:global(html[data-mode='dark']) .create-group-btn {
		border-color: rgba(255, 255, 255, 0.2);
	}
	
	.plus-icon {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.groups-container {
			padding: var(--space-5) var(--space-4);
		}
		
		.page-title {
			font-size: var(--text-xl);
		}
	}
</style>

