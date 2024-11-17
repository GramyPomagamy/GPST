<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { getFullTitle } from '@/utils/misc'

import { useGenericStore } from '@/stores/generic'

const store = useGenericStore(),
  inputBackground: Ref<HTMLInputElement | null> = ref(null),
  props = defineProps<{
    enableTime?: boolean
    enableMoney?: boolean
    canvasModel: HTMLCanvasElement | null
  }>(),
  emit = defineEmits<{
    updateBackground: [b: string]
  }>()
const onNewBackground = function () {
    console.log(inputBackground.value!.files![0])
    const reader = new FileReader()
    reader.onloadend = function () {
      emit('updateBackground', reader.result as string)
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
    const data = props.canvasModel!.toDataURL('image/png'),
      a = document.createElement('a')
    a.download = `${getFullTitle(store.title, store.subtitle)}.png`
    a.href = data
    a.click()
    console.info(`Zapis do pliku ${getFullTitle(store.title, store.subtitle)}.png`)
  },
  chooseBackground = function () {
    if (inputBackground.value) {
      inputBackground.value.click()
    }
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
    <v-number-input
      v-if="enableMoney"
      clearable
      v-model="store.money"
      hint="Ta sekcja jest pisana dla pieniędzy! (pzdr fani republiki)"
      type="number"
      name="money"
      label="Uzbierano"
      id="money"
      placeholder="0"
      size="10"
      required
      prepend-inner-icon="paid"
    />
    <v-container fluid>
      <v-row>
        <v-col v-if="enableMoney">
          <v-btn
            class="bg-secondary w-100"
            prepend-icon="currency_exchange"
            @click.prevent="updateMoney"
            >Aktualizuj kwotę</v-btn
          >
        </v-col>
        <v-col v-if="!enableMoney"> </v-col>
        <v-col>
          <v-btn
            class="bg-primary w-100"
            variant="tonal"
            prepend-icon="download"
            @click.prevent="savePNG"
            >Pobierz .PNG</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
