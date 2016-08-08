<template>
  <div id="app">
    <h1>TodoList</h1>
    <hello></hello>
    <p v-on:click='postToChild'>from child: {{ childWords }}</p>
    <com-a from-father='I am your father.'></com-a>

  </div>
</template>

<script>
import Hello from './components/Hello'
import ComA from './components/comA'
export default {
  data: function(){
    return {
      childWords: '',
      fuck: 'fuck you'
    }
  },
  events:{
    'child-say': function(msg){
      this.childWords = msg;
    }
  },
  methods: {
    //v-on:child-say='childSay'
    childSay: function(msg){
      console.log(msg);
      this.childWords = msg;
    },
    postToChild: function(){
      this.$broadcast('to-child', this.fuck); 
    }
  },
  components: {
    Hello, ComA
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
