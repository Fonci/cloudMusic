<template>
  <header class="header">
    Feng's Music
    <img class="logo" src="../assets/logo2.png" alt />
  </header>
</template>
<script>
export default {
  data() {
    return {
      searchInput: "",
    };
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 70px;
  line-height: 70px;
  color: white;
  background-color: #8991f7;
  font-weight: bold;
  font-size: 28px;
}
.logo {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
</style>