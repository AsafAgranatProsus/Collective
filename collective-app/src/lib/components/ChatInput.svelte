<script lang="ts">
	import { Button, TextField, TextFieldOutlined } from "m3-svelte";
	import { Icon } from "m3-svelte";
	import iconSend from "@ktibow/iconset-material-symbols/send";
	import iconMic from "@ktibow/iconset-material-symbols/mic";
	import iconChecklist from "@ktibow/iconset-material-symbols/checklist";
	import ReferencePopup from "./ReferencePopup.svelte";

	let { 
		onSend, 
		onChecklistToggle, 
		isChecklistOpen = false, 
		placeholder = "Type a message...",
		members = [],
		enableReferences = false
	} = $props<{
		onSend: (message: string) => void;
		onChecklistToggle?: () => void;
		isChecklistOpen?: boolean;
		placeholder?: string;
		members?: Array<{ id: string; name: string; avatar: string }>;
		enableReferences?: boolean;
	}>();

	let inputValue = $state("");
	let hasContent = $derived(inputValue.trim().length > 0);
	let textFieldWrapper: HTMLDivElement | undefined = $state();
	
	// Reference popup state
	let showReferencePopup = $state(false);
	let referenceQuery = $state("");
	let atSymbolPosition = $state(-1);
	
	// Watch for changes in inputValue and detect @ symbol
	$effect(() => {
		if (enableReferences && inputValue) {
			detectAtSymbol();
		} else if (!inputValue) {
			showReferencePopup = false;
		}
	});

	// Detect @ symbol and show reference popup
	function detectAtSymbol() {
		if (!enableReferences) return;
		
		// Try to get the actual input element from the wrapper
		const inputElement = textFieldWrapper?.querySelector('input');
		if (!inputElement) return;
		
		const cursorPos = inputElement.selectionStart || 0;
		const textBeforeCursor = inputValue.substring(0, cursorPos);
		
		// Find last @ symbol before cursor
		const lastAtIndex = textBeforeCursor.lastIndexOf('@');
		
		if (lastAtIndex !== -1) {
			// Check if there's whitespace or start of string before @
			const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' ';
			if (charBeforeAt === ' ' || lastAtIndex === 0) {
				// Extract query after @
				const queryAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
				// Only show popup if query doesn't contain spaces
				if (!queryAfterAt.includes(' ')) {
					showReferencePopup = true;
					referenceQuery = queryAfterAt;
					atSymbolPosition = lastAtIndex;
					return;
				}
			}
		}
		
		// Hide popup if conditions not met
		showReferencePopup = false;
		referenceQuery = "";
		atSymbolPosition = -1;
	}

	// Handle input changes
	function handleInput() {
		detectAtSymbol();
	}

	// Handle reference selection
	function handleReferenceSelect(option: { id: string; name: string; avatar: string; type: 'ai' | 'member' }) {
		if (atSymbolPosition === -1) return;
		
		// Replace @query with @Name and add a space after
		const beforeAt = inputValue.substring(0, atSymbolPosition);
		const afterQuery = inputValue.substring(atSymbolPosition + 1 + referenceQuery.length);
		inputValue = `${beforeAt}@${option.name} ${afterQuery}`;
		
		// Hide popup
		showReferencePopup = false;
		referenceQuery = "";
		atSymbolPosition = -1;
		
		// Focus back on input and set cursor after the space
		const inputElement = textFieldWrapper?.querySelector('input');
		if (inputElement) {
			inputElement.focus();
			// Set cursor after the inserted reference and space
			const newCursorPos = beforeAt.length + option.name.length + 2; // +2 for @ and space
			inputElement.setSelectionRange(newCursorPos, newCursorPos);
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		const trimmed = inputValue.trim();
		if (trimmed) {
			onSend(trimmed);
			inputValue = "";
			showReferencePopup = false;
			referenceQuery = "";
			atSymbolPosition = -1;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		// Close reference popup on Escape
		if (e.key === "Escape" && showReferencePopup) {
			e.preventDefault();
			showReferencePopup = false;
			referenceQuery = "";
			atSymbolPosition = -1;
			return;
		}
		
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}
</script>

<form class="chat-input-container" onsubmit={handleSubmit}>
	{#if onChecklistToggle}
		<div class="checklist-button" class:active={isChecklistOpen}>
			<Button
				variant="text"
				iconType="full"
				onclick={onChecklistToggle}
				aria-label={isChecklistOpen ? "Close checklist" : "Open checklist"}
			>
				<Icon icon={iconChecklist} />
			</Button>
		</div>
	{/if}
	<div class="text-field-wrapper" bind:this={textFieldWrapper}>
		{#if enableReferences}
			<ReferencePopup
				visible={showReferencePopup}
				query={referenceQuery}
				onSelect={handleReferenceSelect}
				{members}
			/>
		{/if}
		<TextFieldOutlined
			bind:value={inputValue}
			{placeholder}
			type="text"
			label=""
			error={false}
			onkeydown={handleKeydown}
			oninput={handleInput}
			onchange={handleInput}
		/>
	</div>
	<div class="send-button-container">
		{#if hasContent}
			<Button
				variant="filled"
				iconType="full"
				onclick={handleSubmit}
				aria-label="Send message"
			>
				<Icon icon={iconSend} />
			</Button>
		{:else}
			<Button
				variant="text"
				iconType="full"
				onclick={() => {/* Voice input - placeholder */}}
				aria-label="Voice input"
			>
				<Icon icon={iconMic} />
			</Button>
		{/if}
	</div>
</form>

<style>
	.chat-input-container {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
		padding: 1rem;
		background-color: rgba(var(--m3-scheme-surface), 0.8);
		/* border-top: 1px solid rgb(var(--m3-scheme-outline-variant)); */
		position: sticky;
		bottom: 0;
		z-index: var(--z-chat-input);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: var(--m3-util-rounding-extra-large) !important;
	}

	.checklist-button {
		flex-shrink: 0;
		color: rgb(var(--m3-scheme-on-surface-variant));
		transition: color 150ms ease;
	}
	
	.checklist-button.active {
		color: rgb(var(--m3-scheme-primary));
	}

	.send-button-container {
		position: absolute;
		right: 1.5rem;
		:global(button .m3-container) {
			border-radius: var(--m3-util-rounding-extra-large) !important;
		}
	}

	.text-field-wrapper {
		flex: 1;
		display: flex;
		border-radius: var(--m3-util-rounding-extra-large) !important;
		position: relative;
	}

	:global {
		.m3-container,
		input,
		.layer {
			border-radius: var(--m3-util-rounding-extra-large) !important;
		}

		.m3-container {
			width: 100%;
		}

	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.chat-input-container {
			padding: 0.75rem;
			gap: 0.5rem;
		}
	}
</style>
