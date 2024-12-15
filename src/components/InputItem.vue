<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'

import { useGenericStore } from '@/stores/generic'

const store = useGenericStore(),
  route = useRoute(),
  inputBackground: Ref<HTMLInputElement | null> = ref(null),
  linkSnackbar = ref(false),
  snackbarText = ref(''),
  props = defineProps<{
    enableTime?: boolean
    enableMoney?: boolean
    canvasModel: HTMLCanvasElement | null
  }>(),
  emit = defineEmits<{
    updateBackground: [b: string]
    savePNG: []
  }>()
const onNewBackground = function () {
    console.log(inputBackground.value!.files![0])
    const reader = new FileReader()
    reader.onloadend = function () {
      emit('updateBackground', reader.result as string)
      // store.replacePhoto(reader.result as string)
    }
    reader.readAsDataURL(inputBackground.value!.files![0])
  },
  updateMoney = function () {
    fetch(
      `${import.meta.env.VITE_DONATION_TRACKER_BASE_URL + import.meta.env.VITE_DONATION_TRACKER_SLUG}?json=gpst`
    )
      .then((response) => response.json())
      .then((resp) => {
        store.money = Number(resp.agg.amount)
      })
  },
  savePNG = function () {
    emit('savePNG')
    // const data = props.canvasModel!.toDataURL('image/png'),
    //   a = document.createElement('a')
    // a.download = `${getFullTitle(store.title, store.subtitle)}.png`
    // a.href = data
    // a.click()
    // console.info(`Zapis do pliku ${getFullTitle(store.title, store.subtitle)}.png`)
  },
  chooseBackground = function () {
    if (inputBackground.value) {
      inputBackground.value.click()
    }
  },
  generateLink = async function () {
    const generatedLink = new URL(
      window.location.origin + (import.meta.env.BASE_URL + route.path).replace('//', '/')
    )
    if (store.runner) {
      generatedLink.searchParams.append('runner', store.runner)
    }
    if (store.title) {
      generatedLink.searchParams.append('title', store.title)
    }
    if (store.subtitle) {
      generatedLink.searchParams.append('subtitle', store.subtitle)
    }
    if (store.category) {
      generatedLink.searchParams.append('category', store.category)
    }
    if (store.time) {
      generatedLink.searchParams.append('time', store.time)
    }

    await navigator.clipboard.writeText(generatedLink.toString())
    snackbarText.value = 'Skopiowano link do schowka'
    linkSnackbar.value = true
  }
</script>

<template>
  <div class="d-flex flex-column justify-center">
    <v-file-input
      class="d-none"
      ref="inputBackground"
      @change="onNewBackground"
      label="Tło"
      type="file"
      name="background"
      id="background"
      accept="image/*"
      prepend-inner-icon="photo_camera"
      prepend-icon=""
    />
    <v-btn class="bg-secondary" prepend-icon="photo_camera" @click.prevent="chooseBackground">
      Dodaj zdjęcie
    </v-btn>

    <!-- TODO clearable is broken -->
    <v-text-field
      clearable
      v-model="store.runner"
      type="text"
      name="runner"
      id="runner"
      label="Runner"
      size="42"
      required
      prepend-inner-icon="person"
    />
    <v-text-field
      clearable
      v-model="store.title"
      type="text"
      name="title"
      id="title"
      label="Tytuł"
      size="42"
      required
      prepend-inner-icon="uppercase"
    />
    <v-text-field
      clearable
      v-model="store.subtitle"
      type="text"
      name="subtitle"
      id="subtitle"
      size="42"
      label="Podtytuł (opcjonalne)"
      prepend-inner-icon="lowercase"
    />
    <v-text-field
      clearable
      v-model="store.category"
      type="text"
      name="category"
      id="category"
      label="Kategoria"
      size="42"
      required
      prepend-inner-icon="category"
    />

    <v-text-field
      v-if="enableTime"
      clearable
      v-model="store.time"
      type="text"
      name="time"
      label="Czas"
      id="time"
      placeholder="12:34"
      size="12"
      required
      prepend-inner-icon="schedule"
    />
    <v-container fluid v-if="enableMoney">
      <v-row>
        <v-col>
          <v-number-input
            clearable
            v-model="store.money"
            hint="Ta sekcja jest pisana dla pieniędzy! (pzdr fani republiki)"
            type="number"
            name="money"
            controlVariant="stacked"
            label="Uzbierano"
            id="money"
            placeholder="0"
            size="10"
            required
            prepend-inner-icon="paid"
          />
        </v-col>
        <v-col cols="1">
          <v-btn
            class="bg-secondary w-100"
            icon="currency_exchange"
            @click.prevent="updateMoney"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-btn class="bg-secondary w-100" prepend-icon="link" @click.prevent="generateLink"
            >Kopiuj stały link</v-btn
          >
        </v-col>
        <v-snackbar v-model="linkSnackbar">
          {{ snackbarText }}
          <template v-slot:actions>
            <v-btn variant="text" @click="linkSnackbar = false"> Zamknij </v-btn>
          </template>
        </v-snackbar>
        <v-col>
          <v-btn
            class="bg-primary w-100"
            variant="tonal"
            prepend-icon="download"
            @click.prevent="savePNG"
            >Pobierz .png</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
