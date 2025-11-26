<script lang="ts">
	import type { Group } from "$lib/data/groups";
	import { Icon, Card } from "m3-svelte";
	import iconChevronRight from "@ktibow/iconset-material-symbols/chevron-right";
	import Badge from "./Badge.svelte";
	import GradientLineChart from "./Charts/GradientLineChart.svelte";

	interface OnboardingInfo {
		firstExpense?: {
			name: string;
			amount: string;
			splitAmount: string;
		};
		awaitingMembers?: number; // How many others to join
	}

	let { group, onClick, minimal = false, onboardingInfo } = $props<{
		group: Group;
		onClick?: () => void;
		minimal?: boolean;
		onboardingInfo?: OnboardingInfo;
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
				<!-- <div class="header-left">
					<div class="icon">{group.icon}</div>
				</div> -->

				<div class="title-section">
					<h3 class="group-name m3-font-headline-small">
						<span class="icon">{group.icon}</span>
						{group.name}
					</h3>
					<div class="group-meta m3-font-body-medium">
						{#if minimal}
							<!-- Minimal mode: show member status with awaiting info -->
							{@const awaitingCount = onboardingInfo?.awaitingMembers ?? (group.member_count - 1)}
							<span class="member-count">
								{#if awaitingCount > 0}
									1 member • Awaiting {awaitingCount} {awaitingCount === 1 ? 'other' : 'others'} to join
								{:else}
									{group.member_count} {group.member_count === 1 ? 'member' : 'members'}
								{/if}
							</span>
						{:else}
							<!-- Full mode: show avatars and status -->
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
							{#if group.is_active && group.pending_count}
								<!-- Tasks pending -->
							{:else if !group.is_active}
								<span class="separator">•</span>
								<span class="coming-soon">Coming soon</span>
							{/if}
						{/if}
					</div>
				</div>

				<!-- {#if group.is_active}
					<div class="chevron">
						<Icon icon={iconChevronRight} />
					</div>
				{/if} -->
			</div>

			<!-- Info Cards Section -->
			{#if group.is_active && !minimal}
				<div class="info-cards">
					<!-- Next Action -->
					{#if group.next_action}
						<Card
							variant="filled"
							class="info-card-wrapper next-action"
						>
							<div class="info-card-content">
								<div class="info-label">
									<span>Tasks</span>
									<Badge count={group.pending_count} />
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

									<!-- {#if group.pending_count}
										<span class="separator">•</span>
										<span class="pending">
											{group.pending_count} pending
											{group.next_action.pending === 1
												? "task"
												: "tasks"}
										</span>
									{/if} -->
								</div>
							</div>
						</Card>
					{/if}

					<!-- Money Info -->
					{#if group.money_info}
						<Card variant="filled" class="info-card-wrapper money">
							<div class="info-card-content">
								<div class="info-label">MONEY</div>
								<div class="info-content m3-font-body-medium">
									<span>{group.money_info.text}</span>
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
								<div class="info-label">RECENT</div>
								<div class="info-content m3-font-body-medium">
									<span>{group.recent_activity.text}</span>
									<span class="time-ago"
										>({group.recent_activity
											.time_ago})</span
									>
								</div>
							</div>
						</Card>
					{/if}

					<!-- Group Activity Chart -->
					{#if group.activity_data}
						<Card
							variant="filled"
							class="info-card-wrapper activity-chart"
						>
							<div class="info-card-content chart-content">
								<div class="info-label">ACTIVITY</div>
								<div class="chart-wrapper">
									<GradientLineChart
										data={group.activity_data}
										labels={group.activity_data.map(
											() => "",
										)}
										height={40}
										showPoints={false}
										showGrid={false}
										gradientColor="primary"
										tension={0.5}
									/>
								</div>
							</div>
						</Card>
					{/if}
				</div>
			{/if}

			<!-- Minimal/Onboarding mode info cards - same design as populated cards -->
			{#if minimal && onboardingInfo?.firstExpense}
				<div class="info-cards">
					<Card
						variant="filled"
						class="info-card-wrapper money"
					>
						<div class="info-card-content">
							<div class="info-label">MONEY</div>
							<div class="info-content m3-font-body-medium">
								<span>{onboardingInfo.firstExpense.name}</span>
								<span class="amount">{onboardingInfo.firstExpense.amount}</span>
								{#if onboardingInfo.firstExpense.splitAmount}
									<span class="due">({onboardingInfo.firstExpense.splitAmount} each)</span>
								{/if}
							</div>
						</div>
					</Card>
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
		--m3-card-shape: 2rem;
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
		gap: 0.5rem;
	}

	/* Avatars Row */
	.avatars-row {
		display: flex;
		align-items: center;
		padding-bottom: 0.5rem;
		position: absolute;
		top: -0.75rem;
		right: 0;
		background-color: var(--m3-util-background);
		border-radius: 1.5rem 1.5rem 0 0;
		padding: 0.5rem;
	}

	.avatar {
		width: 7vw;
		height: 7vw;
		border-radius: 50%;
		border: 3px solid var(--m3-util-background);
		object-fit: cover;
		flex-shrink: 0;
		box-sizing: content-box;
		max-width: 36px;
		max-height: 36px;
	}

	.avatar:not(:first-child) {
		margin-left: -17px;
	}

	/* Header Section */
	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.icon {
		/* font-size: 24px; */
		/* width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0; */
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
		padding-top: .75rem;
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

	.member-count {
		color: rgb(var(--m3-scheme-on-surface-variant));
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
		/* display: grid; */
		/* Use auto-fit with minmax to ensure cards take ~50% of width and wrap */
		/* grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); */
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		row-gap: 0.25rem;
		padding-top: 0.5rem;
	}

	.info-cards :global(.card) {
		padding: 0.75rem !important;
		min-height: 64px;
	}

	.info-card-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		align-items: flex-start;
		height: 100%;
	}

	.info-label {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-family: var(--font-sans) !important;
		font-weight: 600;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
		font-size: 0.9rem;
	}

	.info-content {
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans) !important;
		line-height: 1.4;
		/* display: flex;
		flex-wrap: wrap; */
		/* flex-direction: column; */
		/* gap: 0.25rem; */
		/* height: 100%;
		align-items: center;
		width: 100%;
		justify-content: space-between; */
	}

	.amount {
		color: rgb(var(--m3-scheme-primary));
		font-weight: 600;
	}

	.due {
		color: rgb(var(--m3-scheme-primary));
		font-weight: 500;
		font-size: 0.9em;
	}

	.time-ago {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.9em;
	}

	.info-cards :global(.info-card-wrapper) {
		/* background-color: rgb(var(--m3-scheme-surface-container-high)); */
		padding: 0.75rem 1rem;
		/* border-radius: var(--m3-util-rounding-large); */
		border-radius: 1.5rem;
		flex: 1 1 140px;
	}

	.info-cards :global(.info-card-wrapper.next-action .card) {
		border-left: 3px solid rgb(var(--m3-scheme-primary));
	}

	.info-cards :global(.info-card-wrapper.money .card) {
		border-left: 3px solid rgb(var(--m3-scheme-tertiary));
	}

	.info-cards :global(.info-card-wrapper.recent .card) {
		border-left: 3px solid rgb(var(--m3-scheme-secondary));
	}

	/* Activity Chart Card Styles */
	.info-cards :global(.info-card-wrapper.activity-chart) {
		padding: 0 !important;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.info-cards :global(.info-card-wrapper.activity-chart .card) {
		border-left: 3px solid rgb(var(--m3-scheme-primary));
		padding: 0 !important;
		height: 100%;
	}

	.chart-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;

		.info-label {
			padding: 0.75rem 1rem 0 1rem;
			z-index: 1;
		}

		.chart {
		}
	}

	.activity-chart .info-label {
		padding: 0.75rem 1rem 0 1rem;
		z-index: 1;
	}

	.chart-wrapper {
		/* margin-top: auto; */
		width: 100%;
		/* height: 60px; */
		/* Negative margin to pull chart down and remove potential canvas padding */
		/* margin-bottom: -5px; */
	}

	/* Focus styles */
	.group-card-wrapper:focus-visible {
		outline: 2px solid rgb(var(--m3-scheme-primary));
		outline-offset: 2px;
		border-radius: var(--m3-util-rounding-large);
	}

	/* Responsive: stack info cards on smaller screens */
	/* @media (max-width: 768px) {
		.info-cards {
			grid-template-columns: 1fr;
		}
	} */
</style>
