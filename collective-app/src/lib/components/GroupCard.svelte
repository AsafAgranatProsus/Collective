<script lang="ts">
	import type { Group } from '$lib/data/groups';
	
	let { 
		group,
		onClick
	} = $props<{ 
		group: Group;
		onClick?: () => void;
	}>();
	
	function handleClick() {
		if (group.is_active && onClick) {
			onClick();
		}
	}
</script>

<button
	class="group-card"
	class:active={group.is_active}
	class:inactive={!group.is_active}
	onclick={handleClick}
	disabled={!group.is_active}
	aria-label={group.is_active ? `Open ${group.name}` : `${group.name} - Coming soon`}
>
	<div class="icon">{group.icon}</div>
	
	<div class="content">
		<h3 class="group-name">{group.name}</h3>
		<p class="group-meta">
			{group.member_count} {group.member_count === 1 ? 'member' : 'members'}
			{#if group.is_active && group.pending_count}
				<span class="separator">•</span>
				<span class="pending">{group.pending_count} pending {group.pending_count === 1 ? 'task' : 'tasks'}</span>
			{:else if !group.is_active}
				<span class="separator">•</span>
				<span class="coming-soon">Coming soon</span>
			{/if}
		</p>
	</div>
	
	{#if group.is_active}
		<div class="chevron">›</div>
	{/if}
</button>

<style>
	.group-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		width: 100%;
		max-width: 500px;
		height: 80px;
		padding: var(--space-4);
		background-color: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-base);
		text-align: left;
		position: relative;
	}
	
	.group-card.active {
		box-shadow: var(--card-shadow);
	}
	
	.group-card.active:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15);
	}
	
	.group-card.active:active {
		transform: scale(0.98);
	}
	
	.group-card.inactive {
		opacity: 0.5;
		cursor: not-allowed;
		box-shadow: none;
	}
	
	.icon {
		font-size: 36px;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0; /* Allow text truncation */
	}
	
	.group-name {
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: var(--font-sans);
	}
	
	.group-meta {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-sans);
	}
	
	.separator {
		color: var(--text-tertiary);
	}
	
	.pending {
		color: var(--chat-bubble-user-bg);
		font-weight: var(--weight-medium);
	}
	
	.coming-soon {
		color: var(--text-tertiary);
		font-style: italic;
	}
	
	.chevron {
		font-size: 24px;
		color: var(--text-tertiary);
		flex-shrink: 0;
		transition: transform var(--transition-base);
	}
	
	.group-card.active:hover .chevron {
		transform: translateX(4px);
	}
	
	/* Focus styles */
	.group-card:focus-visible {
		outline: 2px solid var(--chat-bubble-user-bg);
		outline-offset: 2px;
	}
</style>

