<script lang="ts">
	import { goto } from '$app/navigation';
	import GroupCard from '$lib/components/GroupCard.svelte';
	import { getAllGroups } from '$lib/data/groups';
	import { setDemoMenuOpen, setNavigationDirection } from '$lib/stores/app.svelte';
	import { sharedAxisTransition } from 'm3-svelte';
	
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
		in:sharedAxisTransition={{ direction: 'Y', rightSeam: true }}
	>
		<button class="logo" onclick={handleLogoTap} aria-label="Open menu">
			<span class="logo-text">collective</span>
		</button>
	</header>
	
	<!-- Groups List -->
	<div class="groups-container">
		<div class="groups-list">
			{#each groups as group, index (group.id)}
				<div
					in:sharedAxisTransition={{ 
						direction: 'Y', 
						rightSeam: true 
					}}
					style="transition-delay: {index * 50}ms;"
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
			in:sharedAxisTransition={{ 
				direction: 'Y', 
				rightSeam: true 
			}}
			style="transition-delay: {groups.length * 50}ms;"
		>
			<span class="plus-icon">+</span>
			<span>Create New Group</span>
		</button>
	</div>
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
		background: rgb(var(--m3-scheme-background));
		z-index: -1;
	}
	
	.page-header {
		position: sticky;
		top: 0;
		z-index: 200;
		padding: 1rem 1.5rem;
		background-color: rgba(var(--m3-scheme-surface), 0.8);
		/* border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant)); */
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.logo {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}
	
	.logo-text {
		font-family: var(--font-logo);
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		
		/* Gradient from left to right using theme colors */
		background: linear-gradient(
			to right,
			rgb(var(--m3-scheme-primary)),
			rgb(var(--m3-scheme-secondary)),
			rgb(var(--m3-scheme-tertiary))
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
	}
	
	.groups-container {
		flex: 1;
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
	}
	
	.groups-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}
	
	.create-group-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: 2px dashed rgb(var(--m3-scheme-outline-variant));
		border-radius: var(--m3-util-rounding-large);
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.9375rem;
		cursor: not-allowed;
		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0.6;
		width: 100%;
		max-width: 500px;
		justify-content: center;
	}
	
	.plus-icon {
		font-size: 1.25rem;
		font-weight: 700;
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.groups-container {
			padding: 1.5rem 1rem;
		}
	}
</style>

