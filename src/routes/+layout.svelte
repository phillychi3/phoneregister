<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="touch-manipulation">
	{@render children()}
</div>
