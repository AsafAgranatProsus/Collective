<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Title text to display in the header */
		title?: string;
		/** Typography class for the title (e.g., 'm3-font-title-large') */
		titleClass?: string;
		/** Whether to use sticky positioning */
		sticky?: boolean;
		/** Whether to enable glass (blur) effect */
		glass?: boolean;
        /** Whether to show a border at the bottom of the header */ 
        borderBottom?: boolean;
        /** Whether to use absolute positioning */
        absolute?: boolean;
		/** Background color CSS variable (default: --m3-scheme-surface) */
		backgroundColor?: string;
		/** Background opacity (0-1, default: 0.95) */
		backgroundOpacity?: number;
		/** Z-index for the header */
		zIndex?: number;
		/** Additional CSS classes */
		class?: string;
		/** Snippet for leading content (typically back button) */
		leading?: Snippet;
		/** Snippet for title content (overrides title prop) */
		titleContent?: Snippet;
		/** Snippet for trailing content (typically action buttons) */
		trailing?: Snippet;
	}

	let {
		title,
		titleClass = 'm3-font-title-large',
		sticky = true,
		glass = true,
        borderBottom = false,
        absolute = false,
		backgroundColor = '--m3-scheme-surface',
		backgroundOpacity = 0.95,
		zIndex = 100,
		class: className = '',
		leading,
		titleContent,
		trailing
	}: Props = $props();

	// Generate background color with opacity
	const bgColor = $derived(`rgba(var(${backgroundColor}), ${backgroundOpacity})`);
</script>

<header 
	class="glass-header {className}"
	class:sticky
	class:glass
    class:absolute
    class:border-bottom={borderBottom}
	style:background-color={bgColor}
	style:z-index={zIndex}
>
	{#if leading}
		<div class="header-leading">
			{@render leading()}
		</div>
	{/if}

	<div class="header-title-container">
		{#if titleContent}
			{@render titleContent()}
		{:else if title}
			<h1 class="header-title {titleClass}">{title}</h1>
		{/if}
	</div>

	{#if trailing}
		<div class="header-trailing">
			{@render trailing()}
		</div>
	{/if}
</header>

<style>
	.glass-header {
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
		position: relative;
	}

    .glass-header.absolute {
        position: absolute;
        top: 0;
        width: 100%;
    }

	.glass-header.sticky {
		position: sticky;
		top: 0;
	}

	.glass-header.glass {
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
	}

    .glass-header.border-bottom {
        border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
    }

	.header-leading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-title-container {
		flex: 1;
		display: flex;
		/* align-items: center; */
		justify-content: flex-start;
		min-width: 0;
	}

	.header-title {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
		font-family: var(--font-sans) !important;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}

	.header-trailing {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.glass-header {
			padding: 0.75rem 1rem;
		}

		.header-title {
			font-size: var(--text-base);
		}
	}
</style>

