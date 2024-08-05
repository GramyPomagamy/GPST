<script setup lang="ts">
import { RouterView } from 'vue-router'
// Import HeaderItem from './components/HeaderItem.vue'
const appVersion = import.meta.env.PACKAGE_VERSION
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2" density="default">
      <!--<template #prepend>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" /> </template
      >-->
      <v-img class="mx-6" src="favicon.ico" max-width="50" />
      <!--<v-app-bar-nav-icon />-->

      <v-btn class="px-8" size="x-large" height="100%" prepend-icon="person" to="/"
        ><template v-if="$vuetify.display.mdAndUp">Runnerzy</template></v-btn
      >
      <v-btn class="px-8" size="x-large" height="100%" prepend-icon="photo_camera" to="/photo">
        <template v-if="$vuetify.display.mdAndUp"> Zdjęcia podczas wydarzenia </template>
      </v-btn>
      <v-btn class="px-8" size="x-large" height="100%" prepend-icon="mdi:mdi-youtube" to="/youtube"
        ><template v-if="$vuetify.display.mdAndUp">Youtube</template></v-btn
      >

      <template v-slot:append>
        <v-btn
          class="px-8"
          size="x-large"
          height="100%"
          prepend-icon="mdi:mdi-github"
          href="https://github.com/gramyPomagamy/GPST"
          ><template v-if="$vuetify.display.mdAndUp">Github</template></v-btn
        >
      </template>

      <!--
      <v-app-bar-title v-if="$vuetify.display.smAndDown && !$vuetify.display.xs"
        >GPST</v-app-bar-title
      >-->
      <!--<v-app-bar-title v-if="$vuetify.display.lgAndUp"
        >GPST – Generator Piekielnie Szybkich Thumbnailsów</v-app-bar-title
      >-->
    </v-app-bar>

    <!--<v-navigation-drawer> </v-navigation-drawer>-->

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="d-flex flex-column bg-surface-variant">
      By Halamix2 &#9874; 2024 - {{ new Date().getFullYear() }}, wersja {{ appVersion }}. Halamix
      nie potrafi we frontend, a jednak to zrobił; what's your excuse?
    </v-footer>
  </v-app>
</template>
