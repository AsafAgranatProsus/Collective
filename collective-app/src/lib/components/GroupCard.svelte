<script lang="ts">
	import type { Group } from "$lib/data/groups";
	import { Icon, Card } from "m3-svelte";
	import iconChevronRight from "@ktibow/iconset-material-symbols/chevron-right";

	let { group, onClick } = $props<{
		group: Group;
		onClick?: () => void;
	}>();

	function handleClick() {
		if (group.is_active && onClick) {
			onClick();
		}
	}
</script>

<div
	class="group-card-wrapper"
	class:active={group.is_active}
	class:inactive={!group.is_active}
	role="button"
	tabindex={group.is_active ? 0 : -1}
	onclick={group.is_active ? handleClick : undefined}
	onkeydown={(e) => {
		if (group.is_active && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			handleClick();
		}
	}}
	aria-label={group.is_active
		? `Open ${group.name}`
		: `${group.name} - Coming soon`}
>
	<Card variant="filled">
		<div class="card-inner">
			<!-- Header Section -->
			<div class="header">
				<div class="header-left">
					<div class="icon">{group.icon}</div>
					<!-- Avatars Row -->
					{#if group.avatars && group.avatars.length > 0}
						<div class="avatars-row">
							{#each group.avatars as avatar, index}
								<img
									src={avatar}
									alt="Member {index + 1}"
									class="avatar"
									style="z-index: {group.avatars.length -
										index}"
								/>
							{/each}
						</div>
					{/if}
				</div>

				<div class="title-section">
					<h3 class="group-name m3-font-headline-small">
						{group.name}
					</h3>
					<p class="group-meta m3-font-body-medium">
						{group.member_count}
						{group.member_count === 1 ? "member" : "members"}
						{#if group.is_active && group.pending_count}
							<span class="separator">•</span>
							<span class="pending"
								>{group.pending_count} pending {group.pending_count ===
								1
									? "task"
									: "tasks"}</span
							>
						{:else if !group.is_active}
							<span class="separator">•</span>
							<span class="coming-soon">Coming soon</span>
						{/if}
					</p>
				</div>

				{#if group.is_active}
					<div class="chevron">
						<Icon icon={iconChevronRight} />
					</div>
				{/if}
			</div>

			<!-- Info Cards Section -->
			{#if group.is_active}
				<div class="info-cards">
					<!-- Next Action -->
					{#if group.next_action}
						<Card
							variant="filled"
							class="info-card-wrapper next-action"
						>
							<div class="info-card-content">
								<div class="info-label m3-font-label-small">
									NEXT
								</div>
								<div class="info-content m3-font-body-medium">
									{group.next_action.text}
									{#if group.next_action.amount}
										<span class="amount"
											>{group.next_action.amount}</span
										>
									{/if}
									{#if group.next_action.due}
										<span class="due"
											>({group.next_action.due})</span
										>
									{/if}
								</div>
							</div>
						</Card>
					{/if}

					<!-- Money Info -->
					{#if group.money_info}
						<Card variant="filled" class="info-card-wrapper money">
							<div class="info-card-content">
								<div class="info-label m3-font-label-small">
									MONEY
								</div>
								<div class="info-content m3-font-body-medium">
									{group.money_info.text}
									{#if group.money_info.amount}
										<span class="amount"
											>{group.money_info.amount}</span
										>
									{/if}
								</div>
							</div>
						</Card>
					{/if}

					<!-- Recent Activity -->
					{#if group.recent_activity}
						<Card variant="filled" class="info-card-wrapper recent">
							<div class="info-card-content">
								<div class="info-label m3-font-label-small">
									RECENT
								</div>
								<div class="info-content m3-font-body-medium">
									{group.recent_activity.text}
									<span class="time-ago"
										>({group.recent_activity
											.time_ago})</span
									>
								</div>
							</div>
						</Card>
					{/if}
				</div>
			{/if}
		</div>
	</Card>
</div>

<style>
	.group-card-wrapper {
		width: 100%;
		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
	}

	.group-card-wrapper.inactive {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.group-card-wrapper.active:hover {
		transform: translateY(-2px);
	}

	.group-card-wrapper.active:active {
		transform: scale(0.98);
	}

	.group-card-wrapper :global(.card) {
		padding: 0 !important;
	}

	.card-inner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Avatars Row */
	.avatars-row {
		display: flex;
		align-items: center;
		padding-bottom: 0.5rem;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 2px solid rgb(var(--m3-scheme-surface));
		object-fit: cover;
		flex-shrink: 0;
	}

	.avatar:not(:first-child) {
		margin-left: -10px;
	}

	/* Header Section */
	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.icon {
		font-size: 40px;
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.title-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0; /* Allow text truncation */
	}

	.group-name {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: var(--font-sans) !important;
		font-weight: 500;
	}

	.group-meta {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-sans) !important;
	}

	.separator {
		color: rgb(var(--m3-scheme-outline));
	}

	.pending {
		color: rgb(var(--m3-scheme-primary));
		font-weight: 500;
	}

	.coming-soon {
		color: rgb(var(--m3-scheme-outline));
		font-style: italic;
	}

	.chevron {
		color: rgb(var(--m3-scheme-on-surface-variant));
		flex-shrink: 0;
		transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.group-card-wrapper.active:hover .chevron {
		transform: translateX(4px);
	}

	/* Info Cards Grid */
	.info-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.25rem;
		padding-top: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--m3-util-rounding-large);
		/* background-color: rgb(var(--m3-scheme-surface-container-high)); */
	}

	.info-cards :global(.card) {
		padding: 0.75rem !important;
		min-height: 64px;
	}

	.info-card-content {
		display: flex;
		/* flex-direction: column; */
		gap: 0.5rem;
		align-items: center;
	}

	.info-label {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans) !important;
		font-weight: 600;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}

	.info-content {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans) !important;
		line-height: 1.4;
		display: flex;
		/* flex-direction: column; */
		gap: 0.25rem;
	}

	.amount {
		color: rgb(var(--m3-scheme-primary));
		font-weight: 600;
	}

	.due {
		color: rgb(var(--m3-scheme-error));
		font-weight: 500;
		font-size: 0.9em;
	}

	.time-ago {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.9em;
	}

	/* Specific info card styles - colored left borders */
	.info-cards :global(.info-card-wrapper.next-action .card) {
		border-left: 3px solid rgb(var(--m3-scheme-primary));
	}

	.info-cards :global(.info-card-wrapper.money .card) {
		border-left: 3px solid rgb(var(--m3-scheme-tertiary));
	}

	.info-cards :global(.info-card-wrapper.recent .card) {
		border-left: 3px solid rgb(var(--m3-scheme-secondary));
	}

	/* Focus styles */
	.group-card-wrapper:focus-visible {
		outline: 2px solid rgb(var(--m3-scheme-primary));
		outline-offset: 2px;
		border-radius: var(--m3-util-rounding-large);
	}

	/* Responsive: stack info cards on smaller screens */
	@media (max-width: 768px) {
		.info-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
