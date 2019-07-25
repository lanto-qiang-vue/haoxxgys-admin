<template>
<div id="app">
	<router-view/>

</div>
</template>

<script>

export default {
	name: "app-body",
	computed:{

	}
}
</script>

<style scoped lang="less">
#app{
	min-width: 800px;
	>*:not(.footer){
		min-height: 100vh;
	}

}

</style>
