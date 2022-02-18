<template>
  <el-container class="layout-container">
    <el-header height="50px" class="header-container">
      <Header />
    </el-header>

    <el-container class="content-main">
      <el-aside class="sidebar-container">
        <Sidebar />
      </el-aside>

      <el-container class="tags-container">
        <el-row class="tags-row">
          <Tags />
        </el-row>

        <el-main class="views-main">
          <router-view v-slot="{ Component }">
            <transition name="move" mode="out-in">
              <keep-alive :include="tagsList">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
  import { defineAsyncComponent } from 'vue'

  const Header = defineAsyncComponent(() => import( /* webpackChunkName: "Header" */ "./components/Header.vue"))
  const Sidebar = defineAsyncComponent(() => import( /* webpackChunkName: "Sidebar" */ "./components/Sidebar.vue"))
  const Tags = defineAsyncComponent(() => import( /* webpackChunkName: "Tags" */ "./components/Tags.vue"))

</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
}
</style>