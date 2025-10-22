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
    enableMoney?: boolean
    enableTime?: boolean
  }>(),
  emit = defineEmits<{
    savePNG: []
    updateBackground: [b: string]
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
    void fetch(
      `${import.meta.env.VITE_DONATION_TRACKER_BASE_URL + import.meta.env.VITE_DONATION_TRACKER_SLUG}?json=gpst`
    )
      .then((response) => response.json())
      .then((resp) => {
        store.money = Math.round(Number(resp.agg.total_amount))
      })
  },
  savePNG = function () {
    emit('savePNG')
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
      id="background"
      ref="inputBackground"
      class="d-none"
      label="Tło"
      type="file"
      name="background"
      accept="image/*"
      prepend-inner-icon="photo_camera"
      prepend-icon=""
      @change="onNewBackground"
    />
    <v-btn class="bg-secondary" prepend-icon="photo_camera" @click.prevent="chooseBackground">
      Dodaj zdjęcie
    </v-btn>

    <!-- TODO clearable is broken -->
    <v-text-field
      id="runner"
      v-model="store.runner"
      clearable
      type="text"
      name="runner"
      label="Runner"
      size="42"
      required
      prepend-inner-icon="person"
    />
    <v-text-field
      id="title"
      v-model="store.title"
      clearable
      type="text"
      name="title"
      label="Tytuł"
      size="42"
      required
      prepend-inner-icon="uppercase"
    />
    <v-text-field
      id="subtitle"
      v-model="store.subtitle"
      clearable
      type="text"
      name="subtitle"
      size="42"
      label="Podtytuł (opcjonalne)"
      prepend-inner-icon="lowercase"
    />
    <v-text-field
      id="category"
      v-model="store.category"
      clearable
      type="text"
      name="category"
      label="Kategoria"
      size="42"
      required
      prepend-inner-icon="category"
    />

    <v-text-field
      v-if="props.enableTime"
      id="time"
      v-model="store.time"
      clearable
      type="text"
      name="time"
      label="Czas"
      placeholder="12:34"
      size="12"
      required
      prepend-inner-icon="schedule"
    />
    <v-container v-if="props.enableMoney" fluid>
      <v-row>
        <v-col>
          <v-number-input
            id="money"
            v-model="store.money"
            clearable
            hint="Ta sekcja jest pisana dla pieniędzy! (pzdr fani republiki)"
            type="number"
            name="money"
            control-variant="stacked"
            label="Uzbierano"
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
          <template #actions>
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
