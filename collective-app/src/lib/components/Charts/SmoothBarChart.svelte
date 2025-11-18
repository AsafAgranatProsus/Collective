<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		LinearScale,
		CategoryScale,
		Tooltip,
		Legend
	} from 'chart.js';

	// Register Chart.js components
	Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

	let {
		data = [],
		labels = [],
		height = 200,
		gradientColor = 'primary',
		horizontal = false,
		showGrid = true,
		showLegend = false,
		max
	} = $props<{
		data: number[];
		labels: string[];
		height?: number;
		gradientColor?: 'primary' | 'secondary' | 'tertiary';
		horizontal?: boolean;
		showGrid?: boolean;
		showLegend?: boolean;
		max?: number;
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

	function createGradient(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		colorName: string,
		horizontal: boolean
	) {
		const gradient = horizontal
			? ctx.createLinearGradient(0, 0, width, 0)
			: ctx.createLinearGradient(0, 0, 0, height);
		const rgb = getM3Color(colorName);

		// Convert space-separated RGB to comma-separated for rgba()
		const rgbComma = rgb.replace(/\s+/g, ', ');

		gradient.addColorStop(0, `rgba(${rgbComma}, 0.9)`);
		gradient.addColorStop(1, `rgba(${rgbComma}, 0.6)`);

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

		const gradient = createGradient(ctx, canvas.width, canvas.height, gradientColor, horizontal);
		const borderColor = `rgb(${getM3Color(gradientColor)})`;
		const gridColor = `rgba(${getM3Color('outline')}, 0.1)`;
		const textColor = `rgb(${getM3Color('on-surface-variant')})`;

		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						data,
						backgroundColor: gradient,
						borderColor,
						borderWidth: 0,
						borderRadius: horizontal ? { topRight: 8, bottomRight: 8 } : { topLeft: 8, topRight: 8 },
						borderSkipped: false
					}
				]
			},
			options: {
				indexAxis: horizontal ? 'y' : 'x',
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
								const value = context.parsed.y || context.parsed.x;
								if (max && max <= 1) {
									return `${Math.round(value * 100)}%`;
								}
								return value.toString();
							}
						}
					}
				},
				scales: {
					x: {
						display: showGrid,
						grid: {
							display: horizontal ? true : false,
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
								if (!horizontal && max && max <= 1) {
									return `${Math.round(Number(value) * 100)}%`;
								}
								return value;
							}
						},
						beginAtZero: true,
						max: horizontal ? max : undefined
					},
					y: {
						display: showGrid,
						grid: {
							display: horizontal ? false : true,
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
								if (horizontal || !max || max > 1) {
									return value;
								}
								return `${Math.round(Number(value) * 100)}%`;
							}
						},
						beginAtZero: true,
						max: horizontal ? undefined : max
					}
				},
				animation: {
					duration: 750,
					easing: 'easeInOutQuart'
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

