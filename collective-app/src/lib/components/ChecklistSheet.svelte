<script lang="ts">
	import { Icon, Button } from 'm3-svelte';
	import iconCheck from '@ktibow/iconset-material-symbols/check';
	import iconAdd from '@ktibow/iconset-material-symbols/add';
	import iconSchedule from '@ktibow/iconset-material-symbols/schedule';
	import iconAttachMoney from '@ktibow/iconset-material-symbols/attach-money';
	import BottomSheet from './BottomSheet.svelte';
	
	let { 
		isOpen = false, 
		onClose,
		groupId = null,
		groupName = ''
	} = $props<{
		isOpen: boolean;
		onClose: () => void;
		groupId?: string | null;
		groupName?: string;
	}>();
	
	// Context mode - group level or feed level (all groups)
	let isFeedLevel = $derived(!groupId);
	
	// Filter chips for feed level
	let activeFilter = $state<string>('all');
	const filters = [
		{ id: 'all', label: 'All' },
		{ id: 'tasks', label: 'Tasks' },
		{ id: 'money', label: 'Money' },
		{ id: 'schedule', label: 'Schedule' }
	];
	
	// Mock data - in real app this would come from stores
	interface TodoItem {
		id: string;
		text: string;
		done: boolean;
		groupId?: string;
		groupName?: string;
		dueDate?: string;
	}
	
	interface ScheduleItem {
		id: string;
		text: string;
		date: string;
		groupId?: string;
		groupName?: string;
	}
	
	interface MoneyItem {
		id: string;
		text: string;
		amount: string;
		type: 'owe' | 'owed';
		groupId?: string;
		groupName?: string;
	}
	
	let todos = $state<TodoItem[]>([
		{ id: 't1', text: 'Kitchen cleanup', done: false, groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt', dueDate: 'Wed evening' },
		{ id: 't2', text: 'Take out trash', done: false, groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt', dueDate: 'Saturday' },
		{ id: 't3', text: 'Buy toilet paper', done: true, groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt' },
	]);
	
	let schedules = $state<ScheduleItem[]>([
		{ id: 's1', text: 'Rent due', date: 'Dec 1', groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt' },
		{ id: 's2', text: 'Utilities payment', date: 'Dec 15', groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt' },
	]);
	
	let moneyItems = $state<MoneyItem[]>([
		{ id: 'm1', text: 'Groceries (Mike)', amount: '$23.50', type: 'owe', groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt' },
		{ id: 'm2', text: 'Utilities split', amount: '$42', type: 'owe', groupId: 'brooklyn-apt', groupName: 'Brooklyn Apt' },
	]);
	
	// Filtered items based on groupId and active filter
	let filteredTodos = $derived(
		todos.filter(t => !groupId || t.groupId === groupId)
	);
	
	let filteredSchedules = $derived(
		schedules.filter(s => !groupId || s.groupId === groupId)
	);
	
	let filteredMoney = $derived(
		moneyItems.filter(m => !groupId || m.groupId === groupId)
	);
	
	// Should show section based on filter
	function showSection(section: 'tasks' | 'money' | 'schedule'): boolean {
		if (activeFilter === 'all') return true;
		return activeFilter === section;
	}
	
	function toggleTodo(id: string) {
		const todo = todos.find(t => t.id === id);
		if (todo) {
			todo.done = !todo.done;
		}
	}
	
	function handleAddItem() {
		// For now just a placeholder
		console.log('Add new item');
	}
</script>

<BottomSheet {isOpen} {onClose} title={isFeedLevel ? 'My Memory' : groupName || 'Checklist'}>
	<div class="checklist-content">
		<!-- Filter chips (feed level only) -->
		{#if isFeedLevel}
			<div class="filter-chips">
				{#each filters as filter}
					<button 
						class="filter-chip"
						class:active={activeFilter === filter.id}
						onclick={() => activeFilter = filter.id}
					>
						{filter.label}
					</button>
				{/each}
			</div>
		{/if}
		
		<!-- Tasks Section -->
		{#if showSection('tasks') && filteredTodos.length > 0}
			<section class="checklist-section">
				<h3 class="section-title m3-font-title-small">
					<span class="section-icon">✓</span>
					Tasks
				</h3>
				<ul class="item-list">
					{#each filteredTodos as todo (todo.id)}
						<li class="item-row" class:done={todo.done}>
							<button 
								class="checkbox"
								class:checked={todo.done}
								onclick={() => toggleTodo(todo.id)}
								aria-label={todo.done ? 'Mark as incomplete' : 'Mark as complete'}
							>
								{#if todo.done}
									<Icon icon={iconCheck} />
								{/if}
							</button>
							<div class="item-content">
								<span class="item-text">{todo.text}</span>
								{#if todo.dueDate}
									<span class="item-meta">{todo.dueDate}</span>
								{/if}
								{#if isFeedLevel && todo.groupName}
									<span class="item-group">{todo.groupName}</span>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
		
		<!-- Schedule Section -->
		{#if showSection('schedule') && filteredSchedules.length > 0}
			<section class="checklist-section">
				<h3 class="section-title m3-font-title-small">
					<span class="section-icon">📅</span>
					Upcoming
				</h3>
				<ul class="item-list">
					{#each filteredSchedules as schedule (schedule.id)}
						<li class="item-row schedule-item">
							<div class="schedule-date">
								<Icon icon={iconSchedule} />
							</div>
							<div class="item-content">
								<span class="item-text">{schedule.text}</span>
								<span class="item-meta">{schedule.date}</span>
								{#if isFeedLevel && schedule.groupName}
									<span class="item-group">{schedule.groupName}</span>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
		
		<!-- Money Section -->
		{#if showSection('money') && filteredMoney.length > 0}
			<section class="checklist-section">
				<h3 class="section-title m3-font-title-small">
					<span class="section-icon">💰</span>
					Money
				</h3>
				<ul class="item-list">
					{#each filteredMoney as money (money.id)}
						<li class="item-row money-item">
							<div class="money-icon" class:owe={money.type === 'owe'} class:owed={money.type === 'owed'}>
								<Icon icon={iconAttachMoney} />
							</div>
							<div class="item-content">
								<span class="item-text">{money.text}</span>
								<span class="money-amount" class:negative={money.type === 'owe'}>
									{money.type === 'owe' ? '-' : '+'}{money.amount}
								</span>
								{#if isFeedLevel && money.groupName}
									<span class="item-group">{money.groupName}</span>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
		
		<!-- Empty state -->
		{#if filteredTodos.length === 0 && filteredSchedules.length === 0 && filteredMoney.length === 0}
			<div class="empty-state">
				<p class="m3-font-body-large">Nothing here yet</p>
				<p class="m3-font-body-medium">Items you add will appear here</p>
			</div>
		{/if}
		
		<!-- Quick Add FAB -->
		<button class="quick-add-fab" onclick={handleAddItem} aria-label="Add new item">
			<Icon icon={iconAdd} />
		</button>
	</div>
</BottomSheet>

<style>
	.checklist-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-height: 300px;
		position: relative;
		padding-bottom: 4rem;
	}
	
	/* Filter Chips */
	.filter-chips {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant) / 0.3);
	}
	
	.filter-chip {
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		border: 1px solid rgb(var(--m3-scheme-outline));
		background: transparent;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 150ms ease;
	}
	
	.filter-chip:hover {
		background: rgb(var(--m3-scheme-surface-container-high));
	}
	
	.filter-chip.active {
		background: rgb(var(--m3-scheme-secondary-container));
		color: rgb(var(--m3-scheme-on-secondary-container));
		border-color: transparent;
	}
	
	/* Sections */
	.checklist-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.section-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		color: rgb(var(--m3-scheme-on-surface));
		font-family: var(--font-sans);
		font-weight: 600;
	}
	
	.section-icon {
		font-size: 1rem;
	}
	
	/* Item List */
	.item-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.item-row {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 0.75rem;
		background: rgb(var(--m3-scheme-surface-container));
		transition: background 150ms ease;
	}
	
	.item-row:hover {
		background: rgb(var(--m3-scheme-surface-container-high));
	}
	
	.item-row.done {
		opacity: 0.6;
	}
	
	.item-row.done .item-text {
		text-decoration: line-through;
	}
	
	/* Checkbox */
	.checkbox {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		border: 2px solid rgb(var(--m3-scheme-outline));
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 150ms ease;
		color: rgb(var(--m3-scheme-on-primary));
	}
	
	.checkbox:hover {
		border-color: rgb(var(--m3-scheme-primary));
	}
	
	.checkbox.checked {
		background: rgb(var(--m3-scheme-primary));
		border-color: rgb(var(--m3-scheme-primary));
	}
	
	/* Schedule & Money Icons */
	.schedule-date,
	.money-icon {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.money-icon.owe {
		color: rgb(var(--m3-scheme-error));
	}
	
	.money-icon.owed {
		color: rgb(var(--m3-scheme-tertiary));
	}
	
	/* Item Content */
	.item-content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		flex: 1;
		min-width: 0;
	}
	
	.item-text {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: rgb(var(--m3-scheme-on-surface));
	}
	
	.item-meta {
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.item-group {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: rgb(var(--m3-scheme-primary));
		font-weight: 500;
	}
	
	.money-amount {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-tertiary));
	}
	
	.money-amount.negative {
		color: rgb(var(--m3-scheme-error));
	}
	
	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
	
	.empty-state p {
		margin: 0;
		font-family: var(--font-sans);
	}
	
	/* Quick Add FAB */
	.quick-add-fab {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 56px;
		height: 56px;
		border-radius: 16px;
		border: none;
		background: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--m3-util-elevation-3);
		transition: all 150ms ease;
	}
	
	.quick-add-fab:hover {
		box-shadow: var(--m3-util-elevation-4);
		background: rgb(var(--m3-scheme-primary-container) / 0.9);
	}
	
	.quick-add-fab:active {
		transform: scale(0.95);
	}
</style>

