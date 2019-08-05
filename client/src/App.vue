<template lang="pug">
  #app
    router-view
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    margin-top: 60px;
    margin-bottom: 40px;
  }
  h1 {
      text-align: center;
  }
  .page-header {
      margin-top: 0;
  }
  abbr[title], abbr[data-original-title] {
      border-bottom: none;
  }
  textarea {
      resize: vertical
  }
  .color-toggle {
      cursor: pointer;
      &:hover {
          background-color: #d3e6cf;
      }
  }
  .btn-group_fixed {
      position: sticky;
      left: 0;
      bottom: 0;
      z-index: 999;
      margin-top: 30px;
      /*.btn-lg, .btn {*/
          /*border-radius: 0;*/
      /*}*/
  }
  .form.form-horizontal {
      padding-bottom: 26px; // 4 .btn-group_fixed
  }
  .panel-heading, .panel-footer, .table {
      text-align: center;
  }
</style>
