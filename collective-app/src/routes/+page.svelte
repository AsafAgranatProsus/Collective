<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	// Redirect to groups list on mount
	onMount(() => {
		goto('/groups');
	});
</script>

<div class="loading-container">
	<p>Loading...</p>
</div>

<style>
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		color: var(--text-primary);
		font-family: var(--font-sans);
	}
</style>
