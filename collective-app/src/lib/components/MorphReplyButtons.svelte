<script lang="ts">
    import gsap from "gsap";
    import { Flip } from "gsap/Flip";
    import { onMount, tick } from "svelte";
    import { fade } from "svelte/transition";
    import { Button } from "m3-svelte";

    interface ReplyOption {
        id: string;
        label: string;
    }

    interface Props {
        options: ReplyOption[];
        onSelect?: (id: string, label: string) => void;
        onReset?: () => void;
        resetButton?: boolean;
    }

    let {
        options,
        onSelect,
        onReset,
        resetButton = false,
    }: Props = $props();

    let selectedId = $state<string | null>(null);
    let containerRef: HTMLElement;

    onMount(() => {
        gsap.registerPlugin(Flip);
    });

    // Custom transition to avoid hero duplication during FLIP
    function smartFade(node: HTMLElement, { duration = 300 }) {
        if (node.dataset.flipId === "hero") {
            return { duration: 0 }; // Instant remove for the hero so Flip takes over
        }
        return fade(node, { duration });
    }

    async function handleClick(id: string, label: string) {
        if (!containerRef) return;

        const clickedWrapper = containerRef.querySelector(
            `[data-id="${id}"]`,
        ) as HTMLElement;
        if (!clickedWrapper) return;

        // Find the actual button inside the wrapper
        const clickedBtn = clickedWrapper.querySelector("button") as HTMLElement;
        if (!clickedBtn) return;

        // 1. Prepare for FLIP - capture button's computed styles
        clickedBtn.dataset.flipId = "hero";
        const computedStyle = window.getComputedStyle(clickedBtn);

        // Capture state including styles for morphing
        const state = Flip.getState(clickedBtn, {
            props: "backgroundColor,color,borderRadius,fontSize,padding,borderWidth,borderColor",
        });

        // 2. Change State
        selectedId = id;
        if (onSelect) onSelect(id, label);
        await tick(); 

        // 3. Animate (only if button exists - meaning this is a real click, not a restoration)
        const bubble = containerRef.querySelector(".morph-bubble");
        if (bubble) {
            // Apply the button's border-radius to the bubble before animating
            gsap.set(bubble, { 
                borderRadius: computedStyle.borderRadius 
            });

            Flip.from(state, {
                targets: ".morph-bubble",
                duration: 0.5,
                ease: "power3.out",
                absolute: true,
                scale: true,
                nested: true,
                simple: true,
                onComplete: () => {
                    // Remove inline styles after animation
                    gsap.set(bubble, { clearProps: "borderRadius" });
                },
            });
        }
    }

    export async function reset() {
        if (!selectedId || !containerRef) return;

        const bubble = containerRef.querySelector(".morph-bubble");
        if (!bubble) return;

        // 1. Capture bubble state
        bubble.setAttribute("data-flip-id", "hero");
        const state = Flip.getState(bubble, {
            props: "backgroundColor,color,borderRadius,fontSize,padding,borderWidth,borderColor",
        });

        // 2. Change State
        const idToRestore = selectedId;
        selectedId = null;
        if (onReset) onReset();
        await tick();

        // 3. Restore
        const restoredWrapper = containerRef.querySelector(
            `[data-id="${idToRestore}"]`,
        ) as HTMLElement;
        
        if (restoredWrapper) {
            const restoredBtn = restoredWrapper.querySelector("button") as HTMLElement;
            
            if (restoredBtn) {
                restoredBtn.dataset.flipId = "hero";

                Flip.from(state, {
                    targets: restoredBtn,
                    duration: 0.5,
                    ease: "power3.inOut",
                    absolute: true,
                    scale: true,
                    clearProps: "all",
                    onComplete: () => {
                        restoredBtn.removeAttribute("data-flip-id");
                    },
                });
            }
        }
    }
</script>

<div class="reply-container" bind:this={containerRef}>
    {#if selectedId}
        {@const selectedOption = options.find((o) => o.id === selectedId)}
        <div class="bubble-wrapper">
            <div class="morph-bubble" data-flip-id="hero">
                <p class="bubble-text">{selectedOption?.label}</p>
            </div>
            {#if resetButton}
                <div class="controls" in:fade={{ duration: 300, delay: 300 }}>
                    <Button variant="tonal" onclick={reset}>
                        Reset
                    </Button>
                </div>
            {/if}
        </div>
    {:else}
        <div class="options-area">
            {#each options as option (option.id)}
                <div
                    class="reply-chip"
                    data-id={option.id}
                    out:smartFade={{ duration: 200 }}
                    in:fade={{ duration: 300, delay: 100 }}
                >
                    <Button
                        variant="outlined"
                        onclick={() => handleClick(option.id, option.label)}
                    >
                        {option.label}
                    </Button>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .reply-container {
        position: relative;
        width: 100%;
        /* Ensure container has enough height or layout stability if needed, 
           but allow it to be flexible based on parent */
    }

    .options-area {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: flex-start;
        align-content: flex-start;
        justify-content: flex-end;
    }

    .reply-chip {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: fit-content;
    }

    .reply-chip :global(button) {
        border-radius: var(--m3-util-rounding-full);
        white-space: nowrap;
    }

    .bubble-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1rem;
        width: 100%;
    }

    .morph-bubble {
        display: inline-flex;
        padding: 0.75rem 1rem;
        background-color: rgb(var(--m3-scheme-secondary-container));
        color: rgb(var(--m3-scheme-on-secondary-container));
        border-radius: var(--m3-util-rounding-large)
            var(--m3-util-rounding-large) var(--m3-util-rounding-extra-small)
            var(--m3-util-rounding-large);
        max-width: 80%;
        
        /* Match properties for morph */
        border-width: 0px;
        border-color: transparent;
        
        /* FLIP helper */
        transform-origin: top right;
    }

    .bubble-text {
        margin: 0;
        line-height: 1.5;
        white-space: pre-wrap;
        min-width: max-content; /* Keep text from wrapping during transition */
    }

    .controls {
        display: flex;
        justify-content: flex-end;
    }
</style>

