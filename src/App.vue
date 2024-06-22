<script setup lang="ts">
import { RouterView } from 'vue-router'
// import HeaderItem from './components/HeaderItem.vue'
const appVersion = import.meta.env.PACKAGE_VERSION
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <!--<template #prepend>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" /> </template
      >-->
      <v-img class="me-sm-8" src="favicon.ico" max-width="50" />
      <!--<v-app-bar-nav-icon />-->
      <v-app-bar-title v-if="$vuetify.display.smAndDown">GPST</v-app-bar-title>
      <v-app-bar-title v-if="$vuetify.display.mdAndUp"
        >GPST – Generator Piekielnie Szybkich Thumbnailsów</v-app-bar-title
      >
      <v-btn stacked prepend-icon="person" to="/">Runnerzy</v-btn>
      <v-btn stacked prepend-icon="photo_camera" to="/photo">Zdjęcia</v-btn>
      <v-btn stacked prepend-icon="play_circle" to="/youtube">Youtube</v-btn>
    </v-app-bar>

    <!--<v-navigation-drawer> </v-navigation-drawer>-->

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="d-flex flex-column">
      By Halamix2 &#9874; 2024 - {{ new Date().getFullYear() }}, wersja {{ appVersion }}. Halamix
      nie potrafi we frontend, a jednak to zrobił; what's your excuse?
    </v-footer>
  </v-app>
</template>
