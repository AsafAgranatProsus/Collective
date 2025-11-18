<script lang="ts">
	import type { QuickReply } from '$lib/data/scenarios';
	import { fly, scale } from 'svelte/transition';
	import { Button } from 'm3-svelte';
	
	let { 
		buttons, 
		onSelect 
	} = $props<{ 
		buttons: QuickReply[]; 
		onSelect: (value: string, label: string) => void;
	}>();
	
	function handleClick(button: QuickReply) {
		onSelect(button.value, button.label);
	}
</script>

<div 
	class="quick-replies"
	in:fly={{ y: 20, duration: 200 }}
	out:scale={{ duration: 150, start: 0.95, opacity: 0 }}
>
	{#each buttons as button, index (button.value)}
		<div
			in:fly={{ y: 20, duration: 200, delay: index * 50 }}
			out:scale={{ duration: 150, start: 0.95, opacity: 0 }}
		>
			<Button
				variant="outlined"
				onclick={() => handleClick(button)}
			>
				{button.label}
			</Button>
		</div>
	{/each}
</div>

<style>
	.quick-replies {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
		margin-bottom: 1rem;
	}
</style>

