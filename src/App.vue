<script setup lang="ts">
import { RouterView } from 'vue-router'
// import HeaderItem from './components/HeaderItem.vue'
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <!--<v-app-bar-nav-icon />-->
      <v-app-bar-title>GPST – Generator Piekielnie Szybkich Thumbnailsów</v-app-bar-title>
      <v-btn stacked prepend-icon="person" to="/">Runnerzy</v-btn>
      <v-btn stacked prepend-icon="photo_camera" to="/photo">Zdjęcia</v-btn>
      <v-btn stacked prepend-icon="play_circle" to="/youtube">Youtube</v-btn>
    </v-app-bar>

    <!--<v-navigation-drawer> </v-navigation-drawer>-->

    <RouterView />

    <v-footer class="d-flex flex-column">
      By Halamix2 &#9874; 2024 - {{ new Date().getFullYear() }}. Halamix nie potrafi we frontend, a
      jednak to zrobił; what's your excuse?
    </v-footer>
  </v-app>
</template>
