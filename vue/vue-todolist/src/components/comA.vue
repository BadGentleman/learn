<template>
	<div class="comA">
		<h1>{{ msg }},{{ fromFather }}</h1>
		<h1>{{ fuck }}</h1>
		<button v-on:click="exchangeData">exchange</button>
	</div>
</template>

<script type="text/javascript">
export default {
	data: function(){
		return {
			msg: 'in the Child'
		};
	},
	events: {
		'to-child': function(msg){
			this.fuck = msg;
		}
	},
	props: ['fromFather', 'fuck'],
	methods: {
		exchangeData: function(){
			//this.$emit('child-say', this.msg);
			this.$dispatch('child-say', this.msg);
		}
	}
}
</script>

<style type="text/css" scoped="scoped">
	h1{
		color: #c8ff11;
	}
</style>