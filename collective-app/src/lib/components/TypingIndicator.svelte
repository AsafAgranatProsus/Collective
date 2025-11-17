<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="typing-indicator" in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
	<div class="typing-bubble">
		<span class="dot" style="animation-delay: 0ms"></span>
		<span class="dot" style="animation-delay: 150ms"></span>
		<span class="dot" style="animation-delay: 300ms"></span>
	</div>
</div>

<style>
	.typing-indicator {
		display: flex;
		align-items: flex-start;
		margin-bottom: var(--space-4);
	}
	
	.typing-bubble {
		background-color: var(--chat-bubble-ai-bg);
		border: 1px solid var(--chat-bubble-ai-border);
		border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm);
		padding: var(--space-3) var(--space-4);
		display: flex;
		gap: var(--space-1);
		align-items: center;
	}
	
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--text-tertiary);
		animation: typingBounce 1.4s ease-in-out infinite;
	}
	
	@keyframes typingBounce {
		0%, 60%, 100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-8px);
		}
	}
</style>

