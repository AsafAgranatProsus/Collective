<script lang="ts">
	import type { CardActionsSection } from '$lib/types/card-schema';
	import { Button } from 'm3-svelte';
	
	let { section, onAction } = $props<{ 
		section: CardActionsSection;
		onAction?: (value: string) => void;
	}>();
	
	function handleClick(value: string) {
		if (onAction) {
			onAction(value);
		}
	}
</script>

<div class="card-actions" class:row={section.layout === 'row'} class:column={section.layout === 'column'}>
	{#each section.buttons as button}
		<Button
			variant={button.variant || (button.primary ? 'filled' : 'outlined')}
			onclick={() => handleClick(button.value)}
		>
			{button.label}
		</Button>
	{/each}
</div>

