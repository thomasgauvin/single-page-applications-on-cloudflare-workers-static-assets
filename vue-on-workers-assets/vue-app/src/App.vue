<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
	<header>
		<div class="wrapper">
			<nav>
				<RouterLink to="/">Homepage</RouterLink>
				<RouterLink to="/page">Page</RouterLink>
			</nav>
		</div>
	</header>

	<RouterView />
</template>
