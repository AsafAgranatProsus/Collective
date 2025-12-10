<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Icon } from 'm3-svelte';
	import iconAi from '@ktibow/iconset-material-symbols/smart-toy';
	import iconPerson from '@ktibow/iconset-material-symbols/person';

	interface ReferenceOption {
		id: string;
		name: string;
		avatar: string;
		type: 'ai' | 'member';
	}

	let {
		visible = false,
		query = '',
		onSelect,
		members = []
	} = $props<{
		visible: boolean;
		query: string;
		onSelect: (option: ReferenceOption) => void;
		members: Array<{ id: string; name: string; avatar: string }>;
	}>();

	// Build complete reference options list
	const allOptions = $derived<ReferenceOption[]>([
		{
			id: 'collective',
			name: 'Collective',
			avatar: '🤖',
			type: 'ai'
		},
		...members.map(m => ({
			id: m.id,
			name: m.name,
			avatar: m.avatar,
			type: 'member' as const
		}))
	]);

	// Filter options based on query
	const filteredOptions = $derived(
		query.trim() === ''
			? allOptions
			: allOptions.filter(opt =>
					opt.name.toLowerCase().includes(query.toLowerCase())
			  )
	);

	function handleSelect(option: ReferenceOption) {
		onSelect(option);
	}

	function handleKeydown(e: KeyboardEvent, option: ReferenceOption) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleSelect(option);
		}
	}
	
	function handleClick(e: MouseEvent, option: ReferenceOption) {
		e.preventDefault();
		e.stopPropagation();
		handleSelect(option);
	}
</script>

{#if visible && filteredOptions.length > 0}
	<div class="reference-popup" transition:fade={{ duration: 150 }}>
		<div class="popup-header">
			<span class="header-text m3-font-label-small">Reference</span>
		</div>
		<div class="options-list">
			{#each filteredOptions as option (option.id)}
				<button
					class="option-item"
					type="button"
					onclick={(e) => handleClick(e, option)}
					onkeydown={(e) => handleKeydown(e, option)}
					transition:scale={{ duration: 100, start: 0.95 }}
				>
					<span class="option-avatar">{option.avatar}</span>
					<span class="option-name m3-font-body-medium">
						@{option.name}
					</span>
					{#if option.type === 'ai'}
						<span class="option-badge m3-font-label-small">AI</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.reference-popup {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		background: rgb(var(--m3-scheme-surface-container-high));
		border-radius: var(--m3-util-rounding-large);
		box-shadow: var(--m3-util-elevation-3);
		overflow: hidden;
		max-height: 16rem;
		display: flex;
		flex-direction: column;
		z-index: var(--z-popover);
	}

	.popup-header {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
		background: rgb(var(--m3-scheme-surface-container));
	}

	.header-text {
		color: rgb(var(--m3-scheme-on-surface-variant));
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.options-list {
		overflow-y: auto;
		padding: 0.25rem;
	}

	.option-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		border-radius: var(--m3-util-rounding-medium);
		cursor: pointer;
		transition: background-color 0.2s ease;
		text-align: left;
	}

	.option-item:hover {
		background: rgb(var(--m3-scheme-secondary-container) / 0.5);
	}

	.option-item:focus-visible {
		outline: 2px solid rgb(var(--m3-scheme-primary));
		outline-offset: -2px;
	}

	.option-avatar {
		font-size: 1.5rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.option-name {
		flex: 1;
		color: rgb(var(--m3-scheme-on-surface));
	}

	.option-badge {
		padding: 0.125rem 0.5rem;
		background: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
		border-radius: var(--m3-util-rounding-small);
		font-weight: 500;
	}

	/* Custom scrollbar for options list */
	.options-list::-webkit-scrollbar {
		width: 0.5rem;
	}

	.options-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.options-list::-webkit-scrollbar-thumb {
		background: rgb(var(--m3-scheme-outline-variant));
		border-radius: var(--m3-util-rounding-full);
	}

	.options-list::-webkit-scrollbar-thumb:hover {
		background: rgb(var(--m3-scheme-outline));
	}
</style>

