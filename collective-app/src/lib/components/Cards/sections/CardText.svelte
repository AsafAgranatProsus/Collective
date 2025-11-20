<script lang="ts">
	import type { CardTextSection } from '$lib/types/card-schema';
	
	let { section } = $props<{ section: CardTextSection }>();
</script>

<div class="card-section">
	<p 
		class="card-text" 
		class:small={section.size === 'small'}
		class:large={section.size === 'large'}
		class:muted={section.color === 'muted'}
		class:primary={section.color === 'primary'}
		class:center={section.align === 'center'}
		class:right={section.align === 'right'}
	>
		{section.content}
	</p>
</div>

