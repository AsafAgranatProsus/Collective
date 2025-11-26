<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';
	
	let { 
		isOpen = false, 
		onClose,
		title = '',
		children 
	} = $props<{
		isOpen: boolean;
		onClose: () => void;
		title?: string;
		children?: any;
	}>();
	
	let sheetElement = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);
	let dragStartY = $state(0);
	let currentTranslateY = $state(0);
	let sheetHeight = $state(0);
	
	// Custom slide transition for the sheet
	function slideUp(node: HTMLElement, { duration = 300, easing = cubicOut }) {
		return {
			duration,
			easing,
			css: (t: number) => `transform: translateY(${(1 - t) * 100}%)`
		};
	}
	
	function slideDown(node: HTMLElement, { duration = 250, easing = cubicIn }) {
		return {
			duration,
			easing,
			css: (t: number) => `transform: translateY(${(1 - t) * 100}%)`
		};
	}
	
	function handleScrimClick() {
		onClose();
	}
	
	function handleDragStart(e: TouchEvent | MouseEvent) {
		isDragging = true;
		dragStartY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		currentTranslateY = 0;
		
		if (sheetElement) {
			sheetHeight = sheetElement.offsetHeight;
		}
	}
	
	function handleDragMove(e: TouchEvent | MouseEvent) {
		if (!isDragging) return;
		
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		const deltaY = clientY - dragStartY;
		
		// Only allow dragging down
		if (deltaY > 0) {
			currentTranslateY = deltaY;
			if (sheetElement) {
				sheetElement.style.transform = `translateY(${deltaY}px)`;
			}
		}
	}
	
	function handleDragEnd() {
		if (!isDragging) return;
		isDragging = false;
		
		// If dragged more than 30% of sheet height, close it
		if (currentTranslateY > sheetHeight * 0.3) {
			onClose();
		} else {
			// Snap back
			if (sheetElement) {
				sheetElement.style.transform = 'translateY(0)';
			}
		}
		currentTranslateY = 0;
	}
	
	// Handle escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}
	
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if isOpen}
	<!-- Scrim (backdrop) -->
	<button 
		class="scrim" 
		onclick={handleScrimClick}
		transition:fade={{ duration: 200 }}
		aria-label="Close sheet"
	></button>
	
	<!-- Bottom Sheet -->
	<div
		bind:this={sheetElement}
		class="bottom-sheet"
		class:dragging={isDragging}
		in:slideUp={{ duration: 300 }}
		out:slideDown={{ duration: 250 }}
		role="dialog"
		aria-modal="true"
		aria-label={title || "Bottom sheet"}
	>
		<!-- Drag handle -->
		<div 
			class="drag-handle-area"
			onmousedown={handleDragStart}
			ontouchstart={handleDragStart}
			onmousemove={handleDragMove}
			ontouchmove={handleDragMove}
			onmouseup={handleDragEnd}
			ontouchend={handleDragEnd}
			onmouseleave={handleDragEnd}
			role="button"
			aria-label="Drag to close"
			tabindex="0"
		>
			<div class="drag-handle"></div>
		</div>
		
		<!-- Header -->
		{#if title}
			<div class="sheet-header">
				<h2 class="sheet-title m3-font-title-large">{title}</h2>
			</div>
		{/if}
		
		<!-- Content -->
		<div class="sheet-content">
			{@render children?.()}
		</div>
	</div>
{/if}

<svelte:window 
	onmousemove={handleDragMove}
	onmouseup={handleDragEnd}
	ontouchmove={handleDragMove}
	ontouchend={handleDragEnd}
/>

<style>
	.scrim {
		position: fixed;
		inset: 0;
		background-color: rgb(var(--m3-scheme-scrim) / 0.32);
		z-index: var(--z-modal-backdrop, 1000);
		border: none;
		cursor: pointer;
	}
	
	.bottom-sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		max-height: 90vh;
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: 1.75rem 1.75rem 0 0;
		z-index: var(--z-drawer, 1001);
		display: flex;
		flex-direction: column;
		box-shadow: var(--m3-util-elevation-1);
		will-change: transform;
		touch-action: none;
	}
	
	.bottom-sheet.dragging {
		transition: none;
	}
	
	.drag-handle-area {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0 0.5rem;
		cursor: grab;
		touch-action: none;
	}
	
	.drag-handle-area:active {
		cursor: grabbing;
	}
	
	.drag-handle {
		width: 32px;
		height: 4px;
		background-color: rgb(var(--m3-scheme-on-surface-variant) / 0.4);
		border-radius: 2px;
	}
	
	.sheet-header {
		padding: 0 1.5rem 1rem;
	}
	
	.sheet-title {
		margin: 0;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
	}
	
	.sheet-content {
		flex: 1;
		overflow-y: auto;
		padding: 0 1.5rem 1.5rem;
		overscroll-behavior: contain;
	}
	
	/* Safe area padding for mobile */
	@supports (padding-bottom: env(safe-area-inset-bottom)) {
		.sheet-content {
			padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
		}
	}
</style>

