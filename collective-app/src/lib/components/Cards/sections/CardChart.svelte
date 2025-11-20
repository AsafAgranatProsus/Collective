<script lang="ts">
	import type { CardChartSection } from '$lib/types/card-schema';
	import GradientLineChart from '$lib/components/Charts/GradientLineChart.svelte';
	import GradientAreaChart from '$lib/components/Charts/GradientAreaChart.svelte';
	import SmoothBarChart from '$lib/components/Charts/SmoothBarChart.svelte';
	
	let { section } = $props<{ section: CardChartSection }>();
</script>

<div class="card-section">
	{#if section.title}
		<h4 class="card-chart-title">{section.title}</h4>
	{/if}
	
	<div class="card-chart-container">
		{#if section.chartType === 'line'}
			<GradientLineChart 
				data={section.data}
				labels={section.labels}
				height={section.height || 160}
				gradientColor={section.color || 'primary'}
				showPoints={section.showPoints ?? true}
				showGrid={section.showGrid ?? false}
			/>
		{:else if section.chartType === 'area'}
			<GradientAreaChart 
				datasets={[{ data: section.data, label: '', color: section.color || 'primary' }]}
				labels={section.labels}
				height={section.height || 160}
				showPoints={section.showPoints ?? false}
				showGrid={section.showGrid ?? true}
				showLegend={false}
			/>
		{:else if section.chartType === 'bar'}
			<SmoothBarChart 
				data={section.data}
				labels={section.labels}
				height={section.height || 200}
				gradientColor={section.color || 'primary'}
				showGrid={section.showGrid ?? true}
			/>
		{/if}
	</div>
</div>

