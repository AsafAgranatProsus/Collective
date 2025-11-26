<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Tabs, FAB, Icon } from 'm3-svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import iconAdd from '@ktibow/iconset-material-symbols/add';
	import GroupCard from '$lib/components/GroupCard.svelte';
	import FeedView from '$lib/components/FeedView.svelte';
	import OnboardingChat from '$lib/components/OnboardingChat.svelte';
	import GlassHeader from '$lib/components/GlassHeader.svelte';
	import { getAllGroups } from '$lib/data/groups';
	import { setDemoMenuOpen, setNavigationDirection, getOnboardingMode, getOnboardingGroupCreated, getOnboardingGroup } from '$lib/stores/app.svelte';
	import type { Group } from '$lib/data/groups';
	import { getAppTabsPosition, getLastActiveTab, setLastActiveTab } from '$lib/stores/features.svelte';
	import { getNavigationPath } from '$lib/utils/modeHelpers';
	import { sharedAxisTransition } from 'm3-svelte';
	
	const groups = getAllGroups();
	const appTabsPosition = $derived(getAppTabsPosition());
	
	// Onboarding mode - hides Groups tab and shows only Feed
	const isOnboarding = $derived(getOnboardingMode());
	
	// Track when onboarding group is created (triggers tabs to appear)
	const onboardingGroupCreated = $derived(getOnboardingGroupCreated());
	
	// Show tabs when: not onboarding, OR onboarding but group is created
	const showTabs = $derived(!isOnboarding || onboardingGroupCreated);
	
	// Show badge on groups tab during onboarding after group is created
	const showGroupsBadge = $derived(isOnboarding && onboardingGroupCreated);
	
	// Get onboarding group data (if available)
	const onboardingGroup = $derived(getOnboardingGroup());
	
	// Convert onboarding group to Group format for display
	const onboardingGroupAsGroup = $derived<Group | null>(
		onboardingGroup ? {
			id: 'onboarding-group',
			name: onboardingGroup.name,
			icon: onboardingGroup.icon,
			type: 'household' as const,
			member_count: onboardingGroup.memberCount,
			is_active: true
		} : null
	);
	
	// Tab state - initialize from last active tab
	let activeTab = $state<string>('groups');
	
	// Restore last active tab on mount
	onMount(() => {
		activeTab = getLastActiveTab();
	});
	
	// Force feed tab when onboarding is active
	$effect(() => {
		if (isOnboarding) {
			activeTab = 'feed';
		}
	});
	
	// Save active tab whenever it changes (only when not onboarding)
	$effect(() => {
		if (!isOnboarding) {
		setLastActiveTab(activeTab as 'groups' | 'feed');
		}
	});
	
	// Tab items for M3 Tabs component
	const tabItems = [
		{ name: 'Groups', value: 'groups' },
		{ name: 'Feed', value: 'feed' }
	];
	
	let tapCount = 0;
	let tapTimeout: ReturnType<typeof setTimeout>;
	
	function handleGroupClick(groupId: string) {
		// Save current tab state before navigating
		setLastActiveTab(activeTab as 'groups' | 'feed');
		setNavigationDirection('forward');
		
		// Use mode-aware navigation path
		const path = getNavigationPath('groupCardClick', groupId);
		goto(path);
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

<div class="groups-page" class:has-bottom-tabs={appTabsPosition === 'bottom' && showTabs}>
	<!-- Background -->
	<div class="background-gradient"></div>
	
	<!-- Header -->
	<GlassHeader class="groups-header">
		{#snippet leading()}
			<button class="logo" onclick={handleLogoTap} aria-label="Open menu">
				<span class="logo-text">collective</span>
			</button>
		{/snippet}
		
		{#snippet trailing()}
			{#if appTabsPosition === 'top' && showTabs}
				<div class="header-tabs" in:scale={{ start: 0.8, duration: 400, delay: 100 }}>
					<div class="tabs-with-badge">
						<Tabs bind:tab={activeTab} items={tabItems} />
						{#if showGroupsBadge}
							<span class="groups-badge" in:fly={{ y: -10, duration: 300, delay: 300 }}>1</span>
						{/if}
					</div>
				</div>
			{/if}
		{/snippet}
	</GlassHeader>
	
	<!-- Main Content -->
	<div class="page-content">
		{#if isOnboarding && !onboardingGroupCreated}
			<!-- Onboarding Chat View (before group is created) -->
			<OnboardingChat />
		{:else if isOnboarding && onboardingGroupCreated && activeTab === 'feed'}
			<!-- Onboarding Chat View (after group is created, feed tab active) -->
			<OnboardingChat />
		{:else if activeTab === 'groups'}
			<!-- Groups List -->
			<div class="groups-container">
				<div class="groups-list">
					{#if isOnboarding && onboardingGroupCreated && onboardingGroupAsGroup}
						<!-- During onboarding: show only the newly created group (minimal card) -->
						<div in:fly={{ y: 20, duration: 300 }}>
							<GroupCard 
								group={onboardingGroupAsGroup}
								minimal={true}
								onboardingInfo={{
									firstExpense: onboardingGroup?.firstExpense,
									awaitingMembers: onboardingGroup ? onboardingGroup.memberCount - 1 : 0
								}}
								onClick={() => handleGroupClick('onboarding-group')}
							/>
						</div>
					{:else}
						<!-- Normal mode: show all groups -->
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
					{/if}
				</div>
			</div>
		{:else}
			<!-- Feed View -->
			<FeedView />
		{/if}
	</div>
	
	<!-- Bottom Tabs (if enabled and showTabs) -->
	{#if appTabsPosition === 'bottom' && showTabs}
		<div class="tabs-container bottom-tabs" in:fly={{ y: 50, duration: 400 }}>
			<div class="tabs-with-badge">
			<Tabs bind:tab={activeTab} items={tabItems} />
				{#if showGroupsBadge}
					<span class="groups-badge bottom" in:fly={{ y: -10, duration: 300, delay: 300 }}>1</span>
				{/if}
			</div>
		</div>
	{/if}
	
	<!-- Floating Action Button (groups view only, hidden during onboarding) -->
	{#if !isOnboarding && activeTab === 'groups'}
		<div class="fab-container">
	<FAB 
		color="primary"
		icon={iconAdd}
		onclick={() => {}}
		aria-label="Create new group"
	/>
		</div>
	{/if}
</div>

<style>
	.groups-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	
	.groups-page.has-bottom-tabs {
		padding-bottom: 80px; /* Space for bottom tabs */
	}
	
	.background-gradient {
		position: fixed;
		inset: 0;
		background: rgb(var(--m3-scheme-background));
		z-index: -1;
	}
	
	/* GlassHeader customization for groups page */
	:global(.groups-header) {
		z-index: 200 !important;
	}
	
	.header-tabs {
		flex: 1;
		max-width: 280px;
		min-width: 0;
	}
	
	/* Make tabs fit in compact space */
	.header-tabs :global(.m3-container) {
		min-height: unset;
	}
	
	/* Tabs with badge wrapper */
	.tabs-with-badge {
		position: relative;
		width: 100%;
	}
	
	/* Badge on groups tab */
	.groups-badge {
		position: absolute;
		top:1rem;
		left: calc(50% - 1.5rem); /* Position over first tab (Groups) */
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.35rem;
		background-color: rgb(var(--m3-scheme-error));
		color: rgb(var(--m3-scheme-on-error));
		border-radius: 0.625rem;
		font-size: 0.75rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		pointer-events: none;
	}
	
	/* Bottom tabs badge positioning */
	.groups-badge.bottom {
		top: 0.5rem;
		left: calc(25% + 1rem);
	}
	
	.tabs-container {
		background: rgb(var(--m3-scheme-surface));
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
		z-index: 150;
	}
	
	.bottom-tabs {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
		border-bottom: none;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
		z-index: 200;
	}
	
	.page-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative; /* For OnboardingChat absolute positioning */
	}
	
	.logo {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
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
		overflow-y: auto;
	}
	
	.groups-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}
	
	/* Floating Action Button */
	.fab-container {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 300;
	}
	
	/* Adjust FAB position when bottom tabs are enabled */
	.groups-page.has-bottom-tabs .fab-container {
		bottom: calc(80px + 1rem); /* Above the bottom tabs */
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.groups-container {
			padding: 1.5rem 1rem;
		}
	}
</style>

