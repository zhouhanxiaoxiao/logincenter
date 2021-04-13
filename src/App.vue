<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import light from "@/assets/light.jpg"
export default {
  name: 'App',
  components: {
  },
  beforeMount() {
    this.$("body").css("background",`url(${light}) center no-repeat`);
    this.$("body").css("background-size","cover");
    this.$store.commit("saveUser", this.$cookies.get("user"));
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.login-container{
  position: fixed;
  right: 10%;
  top: 10%;
  min-height: 50%;
  width: 400px;
  background-color: white;
  border-radius: 5px;
  font-size: 16px;
}
</style>
