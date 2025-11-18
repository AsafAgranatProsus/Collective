<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Filler,
		Tooltip,
		Legend
	} from 'chart.js';

	// Register Chart.js components
	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Filler,
		Tooltip,
		Legend
	);

	let {
		data = [],
		labels = [],
		height = 200,
		gradientColor = 'primary',
		showPoints = true,
		tension = 0.4,
		showGrid = true,
		showLegend = false
	} = $props<{
		data: number[];
		labels: string[];
		height?: number;
		gradientColor?: 'primary' | 'secondary' | 'tertiary';
		showPoints?: boolean;
		tension?: number;
		showGrid?: boolean;
		showLegend?: boolean;
	}>();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	// Get M3 color from CSS variable
	function getM3Color(colorName: string): string {
		const rgb = getComputedStyle(document.documentElement)
			.getPropertyValue(`--m3-scheme-${colorName}`)
			.trim();
		return rgb;
	}

	function createGradient(ctx: CanvasRenderingContext2D, height: number, colorName: string) {
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		const rgb = getM3Color(colorName);
		
		// Convert space-separated RGB to comma-separated for rgba()
		const rgbComma = rgb.replace(/\s+/g, ', ');
		
		gradient.addColorStop(0, `rgba(${rgbComma}, 0.8)`);
		gradient.addColorStop(0.5, `rgba(${rgbComma}, 0.4)`);
		gradient.addColorStop(1, `rgba(${rgbComma}, 0.05)`);
		
		return gradient;
	}

	function initChart() {
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Destroy existing chart
		if (chart) {
			chart.destroy();
		}

		const gradient = createGradient(ctx, height, gradientColor);
		const borderColor = `rgb(${getM3Color(gradientColor)})`;
		const gridColor = `rgba(${getM3Color('outline')}, 0.1)`;
		const textColor = `rgb(${getM3Color('on-surface-variant')})`;

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						data,
						borderColor,
						backgroundColor: gradient,
						borderWidth: 2,
						fill: true,
						tension,
						pointRadius: showPoints ? 4 : 0,
						pointHoverRadius: showPoints ? 6 : 0,
						pointBackgroundColor: borderColor,
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
						pointHoverBackgroundColor: borderColor,
						pointHoverBorderColor: '#fff',
						pointHoverBorderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: showLegend
					},
					tooltip: {
						enabled: true,
						backgroundColor: `rgba(${getM3Color('surface-container-highest')}, 0.95)`,
						titleColor: `rgb(${getM3Color('on-surface')})`,
						bodyColor: `rgb(${getM3Color('on-surface')})`,
						borderColor: `rgba(${getM3Color('outline')}, 0.2)`,
						borderWidth: 1,
						padding: 12,
						displayColors: false,
						callbacks: {
							label: function (context) {
								return `${Math.round(context.parsed.y * 100)}%`;
							}
						}
					}
				},
				scales: {
					x: {
						display: showGrid,
						grid: {
							display: false
						},
						ticks: {
							color: textColor,
							font: {
								size: 11,
								family: 'var(--font-sans)'
							}
						}
					},
					y: {
						display: showGrid,
						beginAtZero: true,
						max: 1,
						grid: {
							color: gridColor,
							drawBorder: false
						},
						ticks: {
							color: textColor,
							font: {
								size: 11,
								family: 'var(--font-sans)'
							},
							callback: function (value) {
								return `${Math.round(Number(value) * 100)}%`;
							}
						}
					}
				},
				animation: {
					duration: 750,
					easing: 'easeInOutQuart'
				},
				interaction: {
					intersect: false,
					mode: 'index'
				}
			}
		});
	}

	onMount(() => {
		initChart();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	// Reinitialize chart when data changes
	$effect(() => {
		if (data && labels && canvas) {
			initChart();
		}
	});
</script>

<div class="chart-container" style="height: {height}px;">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
	}
</style>

