/**
 * Smart Scroll Utility for Chat Interfaces
 * 
 * Smoothly scrolls the chat container to show new content
 */

/**
 * Smart scroll for incoming AI messages
 * Simply scrolls to the bottom to show new messages
 * 
 * @param container - The scrollable container element
 */
export function smartScrollForNewMessage(container: HTMLElement | undefined) {
	if (!container) return;
	// Skip if running on server (no document/window)
	if (typeof window === 'undefined') return;
	
	// Wait a frame for content to render
	requestAnimationFrame(() => {
		if (!container) return;
		
		// Simple scroll to bottom
		container.scrollTo({
			top: container.scrollHeight,
			behavior: 'smooth'
		});
	});
}

