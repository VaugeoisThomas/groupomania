<template>
  <div>
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
#app {
  background-color: rgb(255, 255, 255);
}
</style>
