<script lang="ts">
	/**
	 * M3 Badge Component
	 * https://m3.material.io/components/badges/overview
	 * 
	 * Badges are used to notify the user.
	 * - Small badge: A small dot to indicate new content.
	 * - Large badge: Contains a number to indicate quantity.
	 */

	let {
		count = undefined,
		max = 999,
		showZero = false,
		dot = false,
		color = 'error',
		children
	} = $props<{
		count?: number;
		max?: number;
		showZero?: boolean;
		dot?: boolean;
		color?: 'error' | 'primary' | 'secondary' | 'tertiary';
		children?: import('svelte').Snippet;
	}>();

	// Determine if we should show a dot or a number
	// If count is undefined, we default to dot mode unless explicitly told otherwise?
	// M3: "Small badge: Use for a notification without a count."
	// So if count is undefined, it's a dot.
	// If dot prop is true, it forces dot even if count exists.
	const isDot = $derived(dot || count === undefined);

	// Determine visibility
	// If dot: always visible (unless conditional logic in parent).
	// If number: visible if count > 0 or showZero is true.
	// Note: If count is undefined and dot is false (default), isDot becomes true.
	const isVisible = $derived(
		isDot ? true : (count !== undefined && (count > 0 || showZero))
	);

	// Format the count content
	const content = $derived(
		count !== undefined && count > max ? `${max}+` : count
	);
</script>

<div class="badge-container">
	{@render children?.()}
	
	{#if isVisible}
		<span 
			class="badge {isDot ? 'badge-small' : 'badge-large'} "
			class:is-dot={isDot}
			style="--badge-color: var(--m3-scheme-{color}); --badge-on-color: var(--m3-scheme-on-{color});"
		>
			{#if !isDot}
				{content}
			{/if}
		</span>
	{/if}
</div>

<style>
	.badge-container {
		position: relative;
		display: inline-flex;
		width: fit-content;
		vertical-align: middle;
	}

	.badge {
		/* position: absolute; */
		/* M3 specs: Top end corner.
		   Usually centered on the corner. 
		   We'll use top: 0, right: 0 and translate. */
		top: 0;
		right: 0;
		/* transform: translate(40%, -40%); */
		
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		
		background-color: rgb(var(--badge-color));
		color: rgb(var(--badge-on-color));
		border-radius: 100px; /* Fully rounded */
		z-index: 1;
		
		/* Transitions for smooth appearance */
		transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s;
	}

	/* Small Badge (Dot) */
	.badge-small {
		width: 6px;
		height: 6px;
		/* M3: Small badges are 6dp diameter */
	}
    
    /* Adjust position for small badge to be slightly closer/cleaner */
    .badge-small {
         /* transform: translate(25%, -25%); */
    }

	/* Large Badge (Number) */
	.badge-large {
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		/* M3: Large badge height 16dp */
		
		/* Typography overrides to ensure it fits */
		font-size: 1rem;
		line-height: 16px;
		font-weight: 500;
		font-weight: 700;

	}

    /* If the badge contains single digit, ensure it's round */
    /* Since min-width is 16px and height is 16px, padding handles expansion */
</style>

