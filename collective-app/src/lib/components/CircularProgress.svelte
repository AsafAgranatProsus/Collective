<script lang="ts">
	import { fade } from 'svelte/transition';
	
	let {
		value = 0,
		size = 'medium',
		color,
		showLabel = true,
		label
	} = $props<{
		value: number; // 0-100
		size?: 'small' | 'medium' | 'large';
		color?: string;
		showLabel?: boolean;
		label?: string;
	}>();
	
	// Size configurations
	const sizeConfig = {
		small: { diameter: 48, strokeWidth: 4, fontSize: '0.75rem' },
		medium: { diameter: 80, strokeWidth: 6, fontSize: '1rem' },
		large: { diameter: 120, strokeWidth: 8, fontSize: '1.5rem' }
	};
	
	const config = $derived(sizeConfig[size as keyof typeof sizeConfig]);
	const radius = $derived(config.diameter / 2 - config.strokeWidth);
	const circumference = $derived(2 * Math.PI * radius);
	const progress = $derived(circumference - (value / 100) * circumference);
	
	// Default color uses M3 primary token
	const strokeColor = $derived(color || 'rgb(var(--m3-scheme-primary))');
	const trackColor = $derived('rgb(var(--m3-scheme-surface-container-highest))');
	
	// Display label (either custom label or percentage)
	const displayLabel = $derived(label || `${Math.round(value)}%`);
</script>

<div 
	class="circular-progress" 
	class:small={size === 'small'} 
	class:medium={size === 'medium'}
	class:large={size === 'large'}
	style="--diameter: {config.diameter}px;"
>
	<svg
		width={config.diameter}
		height={config.diameter}
		viewBox="0 0 {config.diameter} {config.diameter}"
	>
		<!-- Background circle (track) -->
		<circle
			cx={config.diameter / 2}
			cy={config.diameter / 2}
			r={radius}
			fill="none"
			stroke={trackColor}
			stroke-width={config.strokeWidth}
		/>
		
		<!-- Progress circle -->
		<circle
			cx={config.diameter / 2}
			cy={config.diameter / 2}
			r={radius}
			fill="none"
			stroke={strokeColor}
			stroke-width={config.strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={progress}
			transform="rotate(-90 {config.diameter / 2} {config.diameter / 2})"
			class="progress-circle"
		/>
	</svg>
	
	{#if showLabel}
		<div 
			class="label" 
			style="font-size: {config.fontSize};"
			transition:fade={{ duration: 200 }}
		>
			{displayLabel}
		</div>
	{/if}
</div>

<style>
	.circular-progress {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--diameter);
		height: var(--diameter);
	}
	
	.progress-circle {
		transition: stroke-dashoffset 400ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: var(--font-sans);
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface));
		text-align: center;
		line-height: 1;
	}
	
	/* Size variants */
	.small .label {
		font-size: 0.75rem;
	}
	
	.medium .label {
		font-size: 1rem;
	}
	
	.large .label {
		font-size: 1.5rem;
	}
</style>

