<script lang="ts">
    import { containerTransform } from "m3-svelte";
    import { Button, Icon } from "m3-svelte";
    import { expoOut } from "svelte/easing";
    import MorphReplyButtons from "$lib/components/MorphReplyButtons.svelte";
    import gsap from "gsap";
    import { Flip } from "gsap/Flip";
    import { onMount, tick } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import iconPalette from "@ktibow/iconset-material-symbols/palette";

    // Register GSAP plugins
    onMount(() => {
        gsap.registerPlugin(Flip);
    });

    let expanded = $state(false);
    const [send, receive] = containerTransform({ duration: 2000 });

    // Experiment 2: Reply button to chat bubble
    let buttonClicked = $state(false);
    const [sendChat, receiveChat] = containerTransform({ duration: 2600 });

    // Animation parameters
    const MORPH_DURATION = 600;
    const MORPH_EASING = expoOut; // Smooth exponential deceleration

    // Multiple buttons - DRY approach
    const replyButtons = [
        { id: "btn1", label: "What's on my plate?" },
        { id: "btn2", label: "Am I doing enough?" },
        { id: "btn3", label: "Can I trade a chore?" },
        { id: "btn4", label: "my moeny?" },
        { id: "btn5", label: "nevermind" },
    ];

    function handleReplyClick(buttonId: string, label: string) {
        console.log("Reply clicked:", buttonId, label);
    }

    function handleReplyReset() {
        console.log("Reset triggered");
    }

    // Experiment 4: GSAP Flip Animation
    const gsapButtons = [
        { id: "gsap1", label: "GSAP: What's my status?" },
        { id: "gsap2", label: "GSAP: Quick update?" },
        { id: "gsap3", label: "GSAP: Help needed" },
        { id: "gsap4", label: "GSAP: My money?" },
        { id: "gsap5", label: "GSAP: Nevermind" },
    ];

    let selectedGsapButton = $state<string | null>(null);

    function handleGsapButtonClick(event: MouseEvent, buttonId: string) {
        const buttonEl = event.currentTarget as HTMLElement;
        const container = buttonEl.closest(".gsap-container") as HTMLElement;
        if (!container) return;

        // Get button's current position
        const buttonRect = buttonEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate final position (top-right of container)
        const finalX = containerRect.right - containerRect.left - 2 * 16; // 2rem padding
        const finalY = 2 * 16; // 2rem from top

        // Calculate the movement needed
        const currentX = buttonRect.left - containerRect.left;
        const currentY = buttonRect.top - containerRect.top;
        const deltaX = finalX - currentX - buttonRect.width;
        const deltaY = finalY - currentY;

        // Clone the button to animate
        const clone = buttonEl.cloneNode(true) as HTMLElement;
        clone.style.position = "absolute";
        clone.style.left = `${currentX}px`;
        clone.style.top = `${currentY}px`;
        clone.style.margin = "0";
        clone.style.zIndex = "100";
        container.appendChild(clone);

        // Hide original button immediately
        buttonEl.style.opacity = "0";

        // Fade out sibling buttons
        const siblings = container.querySelectorAll(".gsap-button");
        siblings.forEach((btn) => {
            if (btn !== buttonEl) {
                gsap.to(btn, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.4,
                    ease: "power2.out",
                });
            }
        });

        // Create animation timeline
        const tl = gsap.timeline({
            onComplete: () => {
                // Remove clone and show actual bubble
                clone.remove();
                selectedGsapButton = buttonId;
            },
        });

        // Morph button into bubble with movement
        tl.to(clone, {
            x: deltaX,
            y: deltaY,
            width: "auto",
            minWidth: "200px",
            backgroundColor: "rgb(var(--m3-scheme-tertiary-container))",
            color: "rgb(var(--m3-scheme-on-tertiary-container))",
            borderRadius: "var(--m3-util-rounding-large) var(--m3-util-rounding-large) var(--m3-util-rounding-small) var(--m3-util-rounding-large)",
            borderColor: "transparent",
            duration: 0.8,
            ease: "expo.out",
        });
    }

    function resetGsapButtons() {
        const container = document.querySelector(".gsap-container") as HTMLElement;
        if (!container) return;

        // Fade siblings back in
        const allButtons = container.querySelectorAll(".gsap-button");
        gsap.to(allButtons, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.05,
        });

        selectedGsapButton = null;
    }

    // Experiment 5: Best Available (GSAP Flip + Svelte)
    const exp5Buttons = [
        { id: "ex5-1", label: "Reply: Sounds good!" },
        { id: "ex5-2", label: "Reply: Can't make it" },
        { id: "ex5-3", label: "Reply: Let me check" },
        { id: "ex5-4", label: "Reply: running late" },
        { id: "ex5-5", label: "Reply: call me" },
    ];

    function handleExp5Select(id: string, label: string) {
        console.log("Selected:", id, label);
    }
</script>

<div class="playground">
    <div class="playground-header">
        <div>
            <h1 class="m3-font-headline-large">UI Transitions Playground</h1>
            <p class="m3-font-body-medium">
                Experimenting with m3-svelte containerTransform
            </p>
        </div>
        <Button 
            variant="outlined" 
            onclick={() => goto('/playground/theme-colors')}
        >
            <Icon icon={iconPalette} />
            View Theme Colors
        </Button>
    </div>

    <div class="experiment">
        <h2 class="m3-font-title-large">Experiment 1: Button to Container</h2>

        <article class="demo-area">
            {#if expanded}
                <div
                    class="expanded"
                    in:receive={{ key: "container" }}
                    out:send={{ key: "container" }}
                >
                    <p>More info now!</p>
                    <button onclick={() => (expanded = false)}>Close</button>
                </div>
            {:else}
                <button
                    class="btn m3-font-label-large"
                    onclick={() => (expanded = true)}
                    in:receive={{ key: "container" }}
                    out:send={{ key: "container" }}
                >
                    Click
                </button>
            {/if}
        </article>
    </div>

    <div class="experiment">
        <h2 class="m3-font-title-large">
            Experiment 2: Reply Button to Chat Bubble
        </h2>

        <article class="chat-demo-area">
            {#if buttonClicked}
                <div
                    class="message-container"
                    in:receiveChat={{ key: "chat" }}
                    out:sendChat={{ key: "chat" }}
                >
                    <div class="message-bubble user-bubble">
                        <p class="message-content">What's on my plate?</p>
                    </div>
                    <!-- <span class="message-timestamp m3-font-body-small">3:45 PM</span> -->
                </div>
            {:else}
                <button
                    class="reply-button m3-font-label-large"
                    onclick={() => (buttonClicked = true)}
                    in:receiveChat={{ key: "chat" }}
                    out:sendChat={{ key: "chat" }}
                >
                    What's on my plate?
                </button>
            {/if}

            <div class="reset-controls">
                <button
                    class="reset-btn m3-font-label-small"
                    onclick={() => (buttonClicked = false)}
                >
                    Reset
                </button>
            </div>
        </article>
    </div>

    <div class="experiment">
        <h2 class="m3-font-title-large">
            Experiment 3: Multiple Reply Buttons (Component)
        </h2>
        <article class="chat-demo-area">
        <p class="m3-font-body-medium">
            This experiment has been replaced by Experiment 5.
        </p>
        </article>
    </div>

    <div class="experiment">
        <h2 class="m3-font-title-large">
            Experiment 4: GSAP Flip Animation
        </h2>
        <p class="m3-font-body-medium">
            Single-stage morph + travel using GSAP Flip plugin
        </p>

        <div class="gsap-container">
            <!-- Final bubble position -->
            {#if selectedGsapButton}
                {@const selectedBtn = gsapButtons.find(
                    (b) => b.id === selectedGsapButton,
                )}
                <div class="gsap-bubble">
                    <p class="bubble-text">{selectedBtn?.label}</p>
                </div>
            {/if}

            <!-- Buttons area -->
            <div class="gsap-buttons-area">
                {#each gsapButtons as button (button.id)}
                    {@const isSelected = selectedGsapButton === button.id}
                    {#if !isSelected}
                        <button
                            class="gsap-button m3-font-label-large"
                            onclick={(e) =>
                                handleGsapButtonClick(e, button.id)}
                        >
                            {button.label}
                        </button>
                    {/if}
                {/each}
            </div>

            {#if selectedGsapButton}
                <div class="gsap-controls">
                    <button
                        class="reset-btn m3-font-label-small"
                        onclick={resetGsapButtons}
                    >
                        Reset GSAP
                    </button>
                </div>
            {/if}
        </div>
    </div>

    <div class="experiment">
        <h2 class="m3-font-title-large">
            Experiment 5: Best Available (GSAP Flip + Svelte)
        </h2>
        <p class="m3-font-body-medium">
            Advanced morphing with layout projection. Click a button to morph it into a chat bubble at the top-right.
        </p>

        <div class="exp5-container">
            <MorphReplyButtons
                options={exp5Buttons}
                onSelect={handleExp5Select}
            />
        </div>
    </div>
</div>

<style>
    .playground {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .playground-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        margin-bottom: 1rem;
    }

    @media (max-width: 640px) {
        .playground-header {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .experiment {
        margin-top: 2rem;
        padding: 2rem;
        background-color: rgb(var(--m3-scheme-surface-container-low));
        border-radius: var(--m3-util-rounding-large);
    }

    .demo-area {
        display: grid;
        height: 10rem;
        margin-top: 1rem;
        background-color: rgb(var(--m3-scheme-surface));
        border-radius: var(--m3-util-rounding-medium);
        padding: 2rem;
    }

    .demo-area > * {
        grid-column: 1;
        grid-row: 1;
    }

    .btn {
        display: flex;
        align-items: center;
        place-self: center;
        background-color: rgb(var(--m3-scheme-primary));
        color: rgb(var(--m3-scheme-on-primary));
        border: none;
        height: 2.5rem;
        border-radius: 1.25rem;
        padding: 0 1rem;
        cursor: pointer;
    }

    .expanded {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-radius: 0.5rem;
        background-image: linear-gradient(
            to bottom right,
            rgb(var(--m3-scheme-primary-container)),
            rgb(var(--m3-scheme-tertiary-container))
        );
    }

    .expanded > p {
        margin: 0;
    }

    .expanded > button {
        background-color: unset;
        border: none;
        padding: 0;
        margin: 0;
        font: unset;
        font-weight: bold;
        text-align: start;
        cursor: pointer;
    }

    /* Experiment 2: Chat demo */
    .chat-demo-area {
        display: grid;
        height: 12rem;
        margin-top: 1rem;
        background-color: rgb(var(--m3-scheme-surface));
        border-radius: var(--m3-util-rounding-medium);
        padding: 2rem;
        align-items: flex-start;
        justify-items: end;
    }

    .chat-demo-area > :not(.reset-controls) {
        grid-column: 1;
        grid-row: 1;
    }

    .reply-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(var(--m3-scheme-surface-container-highest));
        color: rgb(var(--m3-scheme-primary));
        border: 1px solid rgb(var(--m3-scheme-outline));
        height: 2.5rem;
        border-radius: var(--m3-util-rounding-full);
        padding: 0 1.5rem;
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        font-family: inherit;
        visibility: hidden; /* Hide ghost button */
        animation: revealButton 0s 0.05s forwards;
    }

    @keyframes revealButton {
        to {
            visibility: visible;
        }
    }

    .reply-button:hover {
        background-color: rgba(var(--m3-scheme-primary), 0.08);
    }

    .message-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .message-bubble {
        /* max-width: 80%; */
        padding: 0.75rem 1rem;
        border-radius: var(--m3-util-rounding-large);
        word-wrap: break-word;
    }

    .user-bubble {
        background-color: rgb(var(--m3-scheme-secondary-container));
        color: rgb(var(--m3-scheme-on-secondary-container));
        border-radius: var(--m3-util-rounding-large)
            var(--m3-util-rounding-large) var(--m3-util-rounding-extra)
            var(--m3-util-rounding-large);
    }

    .message-content {
        margin: 0;
        line-height: 1.5;
        white-space: pre-wrap;
    }

    .message-timestamp {
        font-family: var(--font-mono);
        color: rgb(var(--m3-scheme-outline));
        margin-top: 0.25rem;
        padding: 0 0.5rem;
    }

    .reset-controls {
        grid-column: 1;
        grid-row: 2;
        margin-top: 1rem;
    }

    .reset-btn {
        background-color: rgb(var(--m3-scheme-secondary-container));
        color: rgb(var(--m3-scheme-on-secondary-container));
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--m3-util-rounding-medium);
        cursor: pointer;
        font-family: inherit;
    }

    /* Experiment 4: GSAP */
    .gsap-container {
        position: relative;
        margin-top: 1rem;
        padding: 2rem;
        background-color: rgb(var(--m3-scheme-surface));
        border-radius: var(--m3-util-rounding-medium);
        min-height: 12rem;
    }

    .gsap-bubble {
        position: absolute;
        top: 2rem;
        right: 2rem;
        padding: 0.75rem 1rem;
        background-color: rgb(var(--m3-scheme-tertiary-container));
        color: rgb(var(--m3-scheme-on-tertiary-container));
        border-radius: var(--m3-util-rounding-large)
            var(--m3-util-rounding-large) var(--m3-util-rounding-small)
            var(--m3-util-rounding-large);
        max-width: 80%;
    }

    .gsap-buttons-area {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: flex-start;
    }

    .gsap-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(var(--m3-scheme-surface-container-highest));
        color: rgb(var(--m3-scheme-tertiary));
        border: 1px solid rgb(var(--m3-scheme-outline));
        height: 2.5rem;
        border-radius: var(--m3-util-rounding-full);
        padding: 0 1.5rem;
        cursor: pointer;
        font-family: inherit;
        white-space: nowrap;
        transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gsap-button:hover {
        background-color: rgba(var(--m3-scheme-tertiary), 0.08);
    }

    .gsap-controls {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
    }

    /* Experiment 5 Styles */
    .exp5-container {
        position: relative;
        margin-top: 1rem;
        padding: 2rem;
        background-color: rgb(var(--m3-scheme-surface));
        border-radius: var(--m3-util-rounding-medium);
        min-height: 12rem;
        overflow: visible;
    }
</style>
