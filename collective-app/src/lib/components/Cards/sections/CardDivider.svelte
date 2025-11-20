<script lang="ts">
	import type { CardDividerSection } from '$lib/types/card-schema';
	
	let { section } = $props<{ section: CardDividerSection }>();
</script>

<div class="card-divider" class:small={section.spacing === 'small'} class:large={section.spacing === 'large'}></div>

