<script lang="ts">
	let { 
		onSend,
		placeholder = 'Type a message...'
	} = $props<{ 
		onSend: (message: string) => void;
		placeholder?: string;
	}>();
	
	let inputValue = $state('');
	let inputElement: HTMLInputElement;
	
	function handleSubmit(e: Event) {
		e.preventDefault();
		
		const trimmed = inputValue.trim();
		if (trimmed) {
			onSend(trimmed);
			inputValue = '';
			
			// Refocus input
			setTimeout(() => {
				inputElement?.focus();
			}, 100);
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}
</script>

<form class="chat-input-container" onsubmit={handleSubmit}>
	<input
		bind:this={inputElement}
		bind:value={inputValue}
		onkeydown={handleKeydown}
		type="text"
		class="chat-input"
		placeholder={placeholder}
		autocomplete="off"
	/>
	<button 
		type="submit" 
		class="send-button"
		disabled={!inputValue.trim()}
		aria-label="Send message"
	>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M2 10L18 2L10 18L9 11L2 10Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
		</svg>
	</button>
</form>

<style>
	.chat-input-container {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-4);
		background-color: transparent;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		position: sticky;
		bottom: 0;
		z-index: var(--z-sticky);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	:global(html[data-mode='dark']) .chat-input-container {
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.chat-input {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(255, 255, 255, 0.2);
		background-color: rgba(255, 255, 255, 0.1);
		color: var(--text-primary);
		font-size: var(--text-base);
		font-family: var(--font-serif);
		transition: all var(--transition-base);
		outline: none;
	}
	
	:global(html[data-mode='dark']) .chat-input {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background-color: rgba(0, 0, 0, 0.2);
	}
	
	.chat-input:focus {
		border-color: var(--chat-bubble-user-bg);
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
	}
	
	.chat-input::placeholder {
		color: var(--text-tertiary);
	}
	
	.send-button {
		padding: var(--space-3);
		border-radius: var(--radius-lg);
		background-color: var(--chat-bubble-user-bg);
		color: var(--chat-bubble-user-text);
		border: none;
		cursor: pointer;
		transition: all var(--transition-base);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
	}
	
	.send-button:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		filter: brightness(1.1);
	}
	
	.send-button:active:not(:disabled) {
		transform: scale(0.95);
	}
	
	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.send-button:focus-visible {
		outline: 2px solid var(--chat-bubble-user-bg);
		outline-offset: 2px;
	}
	
	/* Mobile adjustments */
	@media (max-width: 640px) {
		.chat-input-container {
			padding: var(--space-3);
		}
	}
</style>

