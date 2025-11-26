<script lang="ts">
	import { Button, TextField, TextFieldOutlined } from "m3-svelte";
	import { Icon } from "m3-svelte";
	import iconSend from "@ktibow/iconset-material-symbols/send";
	import iconChecklist from "@ktibow/iconset-material-symbols/checklist";

	let { onSend, onChecklistToggle, isChecklistOpen = false, placeholder = "Type a message..." } = $props<{
		onSend: (message: string) => void;
		onChecklistToggle?: () => void;
		isChecklistOpen?: boolean;
		placeholder?: string;
	}>();

	let inputValue = $state("");

	function handleSubmit(e: Event) {
		e.preventDefault();

		const trimmed = inputValue.trim();
		if (trimmed) {
			onSend(trimmed);
			inputValue = "";
		}
	}

	function handleKeydown(e: KeyboardEvent) {
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
	<div class="text-field-wrapper">
		<TextFieldOutlined
			bind:value={inputValue}
			{placeholder}
			type="text"
			label=""
			error={false}
			onkeydown={handleKeydown}
		/>
	</div>
	<div class="send-button-container">
		<Button
			variant="filled"
			iconType="full"
			disabled={!inputValue.trim()}
			onclick={handleSubmit}
			aria-label="Send message"
		>
			<Icon icon={iconSend} />
		</Button>
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
		z-index: 200;
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
