<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input v-model='con' v-on:keydown.enter='addItem'/>
    <ul>
      <li v-for='item in items' v-bind:class="{finish: item.isFinished}" v-on:click='toggleState(item)'>
        {{ item.label }}
        <button v-on:click="removeItem($index)">移除</button>
      </li>
    </ul>
  </div>
</template>

<script>
import Store from '../store'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      items: Store.fetch(),
      con: '',
      msg: ''
    }
  },
  methods:{
    addItem: function(){
      this.msg = '';
      var con = this.con.trim();
      if(con && con !== ''){
        this.items.push({
          label: con,
          isFinished: false
        });
      }else{
        this.msg = 'todo不能为空';
      }
      this.con = '';
    },
    removeItem: function(index){
      //Array.indexOf(array, item, start);
      this.items.splice(index, 1);
    },
    toggleState: function(item){
      item.isFinished = !item.isFinished;
    }
  },
  watch:{
    'items': {
      handler:function(val, oldVal){
        Store.save(val);
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.finish{
  text-decoration: line-through;
}
</style>
