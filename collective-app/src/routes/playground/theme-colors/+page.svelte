<script lang="ts">
	import { Button, Icon } from 'm3-svelte';
	import iconArrowBack from '@ktibow/iconset-material-symbols/arrow-back';
	import { goto } from '$app/navigation';
	import GlassHeader from '$lib/components/GlassHeader.svelte';

	// Define all M3 color scheme variables grouped by category
	const colorGroups = [
		{
			name: 'Primary Colors',
			colors: [
				{ name: 'primary', var: '--m3-scheme-primary' },
				{ name: 'primary-dim', var: '--m3-scheme-primary-dim' },
				{ name: 'on-primary', var: '--m3-scheme-on-primary' },
				{ name: 'primary-container', var: '--m3-scheme-primary-container' },
				{ name: 'on-primary-container', var: '--m3-scheme-on-primary-container' },
				{ name: 'primary-fixed', var: '--m3-scheme-primary-fixed' },
				{ name: 'primary-fixed-dim', var: '--m3-scheme-primary-fixed-dim' },
				{ name: 'on-primary-fixed', var: '--m3-scheme-on-primary-fixed' },
				{ name: 'on-primary-fixed-variant', var: '--m3-scheme-on-primary-fixed-variant' }
			]
		},
		{
			name: 'Secondary Colors',
			colors: [
				{ name: 'secondary', var: '--m3-scheme-secondary' },
				{ name: 'secondary-dim', var: '--m3-scheme-secondary-dim' },
				{ name: 'on-secondary', var: '--m3-scheme-on-secondary' },
				{ name: 'secondary-container', var: '--m3-scheme-secondary-container' },
				{ name: 'on-secondary-container', var: '--m3-scheme-on-secondary-container' },
				{ name: 'secondary-fixed', var: '--m3-scheme-secondary-fixed' },
				{ name: 'secondary-fixed-dim', var: '--m3-scheme-secondary-fixed-dim' },
				{ name: 'on-secondary-fixed', var: '--m3-scheme-on-secondary-fixed' },
				{ name: 'on-secondary-fixed-variant', var: '--m3-scheme-on-secondary-fixed-variant' }
			]
		},
		{
			name: 'Tertiary Colors',
			colors: [
				{ name: 'tertiary', var: '--m3-scheme-tertiary' },
				{ name: 'tertiary-dim', var: '--m3-scheme-tertiary-dim' },
				{ name: 'on-tertiary', var: '--m3-scheme-on-tertiary' },
				{ name: 'tertiary-container', var: '--m3-scheme-tertiary-container' },
				{ name: 'on-tertiary-container', var: '--m3-scheme-on-tertiary-container' },
				{ name: 'tertiary-fixed', var: '--m3-scheme-tertiary-fixed' },
				{ name: 'tertiary-fixed-dim', var: '--m3-scheme-tertiary-fixed-dim' },
				{ name: 'on-tertiary-fixed', var: '--m3-scheme-on-tertiary-fixed' },
				{ name: 'on-tertiary-fixed-variant', var: '--m3-scheme-on-tertiary-fixed-variant' }
			]
		},
		{
			name: 'Error Colors',
			colors: [
				{ name: 'error', var: '--m3-scheme-error' },
				{ name: 'on-error', var: '--m3-scheme-on-error' },
				{ name: 'error-container', var: '--m3-scheme-error-container' },
				{ name: 'on-error-container', var: '--m3-scheme-on-error-container' }
			]
		},
		{
			name: 'Surface Colors',
			colors: [
				{ name: 'surface', var: '--m3-scheme-surface' },
				{ name: 'surface-dim', var: '--m3-scheme-surface-dim' },
				{ name: 'surface-bright', var: '--m3-scheme-surface-bright' },
				{ name: 'surface-container-lowest', var: '--m3-scheme-surface-container-lowest' },
				{ name: 'surface-container-low', var: '--m3-scheme-surface-container-low' },
				{ name: 'surface-container', var: '--m3-scheme-surface-container' },
				{ name: 'surface-container-high', var: '--m3-scheme-surface-container-high' },
				{ name: 'surface-container-highest', var: '--m3-scheme-surface-container-highest' },
				{ name: 'on-surface', var: '--m3-scheme-on-surface' },
				{ name: 'on-surface-variant', var: '--m3-scheme-on-surface-variant' }
			]
		},
		{
			name: 'Background Colors',
			colors: [
				{ name: 'background', var: '--m3-scheme-background' },
				{ name: 'on-background', var: '--m3-scheme-on-background' }
			]
		},
		{
			name: 'Outline Colors',
			colors: [
				{ name: 'outline', var: '--m3-scheme-outline' },
				{ name: 'outline-variant', var: '--m3-scheme-outline-variant' }
			]
		},
		{
			name: 'Inverse Colors',
			colors: [
				{ name: 'inverse-surface', var: '--m3-scheme-inverse-surface' },
				{ name: 'inverse-on-surface', var: '--m3-scheme-inverse-on-surface' },
				{ name: 'inverse-primary', var: '--m3-scheme-inverse-primary' }
			]
		},
		{
			name: 'Scrim & Shadow',
			colors: [
				{ name: 'scrim', var: '--m3-scheme-scrim' },
				{ name: 'shadow', var: '--m3-scheme-shadow' }
			]
		}
	];

	function handleBack() {
		goto('/playground');
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<div class="theme-colors-page">
	<!-- Header -->
	<GlassHeader
		title="Material 3 Theme Colors"
		titleClass="m3-font-headline-medium"
	>
		{#snippet leading()}
			<Button variant="text" iconType="full" onclick={handleBack} aria-label="Back to playground">
				<Icon icon={iconArrowBack} />
			</Button>
		{/snippet}
	</GlassHeader>

	<!-- Color Groups -->
	<div class="content-area">
		<div class="colors-container">
			{#each colorGroups as group}
				<section class="color-group">
					<h2 class="group-title m3-font-title-large">{group.name}</h2>
					<div class="color-grid">
						{#each group.colors as color}
							<button
								class="color-card"
								onclick={() => copyToClipboard(color.var)}
								title="Click to copy variable name"
							>
								<div
									class="color-swatch"
									style="background-color: rgb(var({color.var}));"
								></div>
								<div class="color-info">
									<span class="color-name m3-font-label-medium">{color.name}</span>
									<span class="color-var m3-font-label-small">{color.var}</span>
								</div>
							</button>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</div>
</div>

<style>
	.theme-colors-page {
		width: 100%;
		min-height: 100vh;
		background-color: rgb(var(--m3-scheme-background));
		display: flex;
		flex-direction: column;
	}

	.content-area {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
	}

	.colors-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.color-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.group-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid rgb(var(--m3-scheme-primary));
		font-family: var(--font-sans) !important;
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.color-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: rgb(var(--m3-scheme-surface-container));
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
		border-radius: var(--m3-util-rounding-large);
		cursor: pointer;
		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
		text-align: left;
	}

	.color-card:hover {
		background-color: rgb(var(--m3-scheme-surface-container-high));
		border-color: rgb(var(--m3-scheme-outline));
		transform: translateY(-2px);
		box-shadow: var(--m3-util-elevation-2);
	}

	.color-card:active {
		transform: translateY(0);
		box-shadow: var(--m3-util-elevation-1);
	}

	.color-swatch {
		width: 64px;
		height: 64px;
		border-radius: var(--m3-util-rounding-medium);
		flex-shrink: 0;
		border: 1px solid rgba(var(--m3-scheme-outline), 0.3);
		box-shadow: var(--m3-util-elevation-1);
	}

	.color-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.color-name {
		color: rgb(var(--m3-scheme-on-surface));
		font-weight: 600;
		font-family: var(--font-sans);
		word-break: break-word;
	}

	.color-var {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-mono);
		font-size: 0.75rem;
		word-break: break-all;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.content-area {
			padding: 1rem;
		}

		.colors-container {
			gap: 2rem;
		}

		.color-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Tablet adjustments */
	@media (min-width: 641px) and (max-width: 1024px) {
		.color-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		}
	}
</style>

