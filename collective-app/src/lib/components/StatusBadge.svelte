<script lang="ts">
	import { Icon } from 'm3-svelte';
	import iconCheckCircle from '@ktibow/iconset-material-symbols/check-circle';
	import iconSchedule from '@ktibow/iconset-material-symbols/schedule';
	import iconError from '@ktibow/iconset-material-symbols/error';
	import iconInfo from '@ktibow/iconset-material-symbols/info';
	
	let {
		type = 'info',
		icon,
		count,
		size = 'medium'
	} = $props<{
		type?: 'success' | 'warning' | 'error' | 'info';
		icon?: any; // Material Symbols icon
		count?: number;
		size?: 'small' | 'medium' | 'large';
	}>();
	
	// Default icons based on type
	const defaultIcons = {
		success: iconCheckCircle,
		warning: iconSchedule,
		error: iconError,
		info: iconInfo
	};
	
	const displayIcon = $derived(icon || defaultIcons[type as keyof typeof defaultIcons]);
	
	// Size configurations
	const sizeConfig = {
		small: { diameter: 20, fontSize: '0.75rem' },
		medium: { diameter: 24, fontSize: '0.875rem' },
		large: { diameter: 32, fontSize: '1rem' }
	};
	
	const config = $derived(sizeConfig[size as keyof typeof sizeConfig]);
</script>

<div 
	class="status-badge"
	class:success={type === 'success'}
	class:warning={type === 'warning'}
	class:error={type === 'error'}
	class:info={type === 'info'}
	class:has-count={count !== undefined}
	style="--badge-size: {config.diameter}px; --badge-font-size: {config.fontSize};"
>
	<div class="badge-icon">
		<Icon icon={displayIcon} />
	</div>
	
	{#if count !== undefined}
		<div class="badge-count">
			{count}
		</div>
	{/if}
</div>

<style>
	.status-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: var(--badge-size);
		height: var(--badge-size);
		border-radius: 50%;
		flex-shrink: 0;
	}
	
	.badge-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	
	/* Type variants */
	.status-badge.success {
		color: rgb(var(--m3-scheme-tertiary));
		background-color: rgba(var(--m3-scheme-tertiary), 0.12);
	}
	
	.status-badge.warning {
		color: rgb(var(--m3-scheme-error));
		background-color: rgba(var(--m3-scheme-error), 0.12);
	}
	
	.status-badge.error {
		color: rgb(var(--m3-scheme-error));
		background-color: rgba(var(--m3-scheme-error), 0.16);
	}
	
	.status-badge.info {
		color: rgb(var(--m3-scheme-primary));
		background-color: rgba(var(--m3-scheme-primary), 0.12);
	}
	
	/* Count badge */
	.badge-count {
		position: absolute;
		top: -4px;
		right: -4px;
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgb(var(--m3-scheme-error));
		color: rgb(var(--m3-scheme-on-error));
		border-radius: 8px;
		font-size: 0.625rem;
		font-weight: 600;
		font-family: var(--font-sans);
		line-height: 1;
	}
	
	.has-count {
		margin-right: 6px;
	}
</style>

