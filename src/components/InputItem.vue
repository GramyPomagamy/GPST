<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { getFullTitle } from '@/utils/misc'

const inputBackground: Ref<HTMLInputElement | null> = ref(null),
  inputRunner = ref(''),
  inputTitle = ref(''),
  inputSubtitle = ref(''),
  inputCategory = ref(''),
  inputTime = ref(''),
  inputMoney = ref(0),
  props = defineProps<{
    runner: string
    title: string
    subtitle: string
    category: string
    enableTime?: boolean
    time?: string
    enableMoney?: boolean
    money?: number
    canvasModel: HTMLCanvasElement | null
  }>(),
  emit = defineEmits<{
    updateBackground: [b: string]
    updateRunner: [r: string]
    updateTitle: [t: string]
    updateSubtitle: [s: string]
    updateCategory: [c: string]
    updateTime: [t: string]
    updateMoney: [m: number]
  }>()

if (props.runner) {
  inputRunner.value = props.runner
  emit('updateRunner', props.runner)
}
if (props.title) {
  inputTitle.value = props.title
  emit('updateTitle', inputTitle.value)
}
if (props.subtitle) {
  inputSubtitle.value = props.subtitle
  emit('updateSubtitle', props.subtitle)
}
if (props.category) {
  inputCategory.value = props.category
  emit('updateCategory', props.category)
}
if (props.time) {
  inputTime.value = props.time
  emit('updateTime', props.time)
}
if (props.money) {
  inputMoney.value = props.money
  emit('updateMoney', Math.round(props.money))
}

/*
 * If (inputMoney.value <= 0) {
 *   updateMoney()
 * }
 */

var onNewBackground = function () {
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
        inputMoney.value = Number(resp.agg.amount)
      })
  },
  savePNG = function () {
    const data = props.canvasModel!.toDataURL('image/png'),
      a = document.createElement('a')
    a.download = `${getFullTitle(inputTitle.value, inputSubtitle.value)}.png`
    a.href = data
    a.click()
    console.info(`Zapis do pliku ${getFullTitle(inputTitle.value, inputSubtitle.value)}.png`)
  },
  chooseBackground = function () {
    if (inputBackground.value) {
      inputBackground.value.click()
    }
  }

watch(inputRunner, () => {
  emit('updateRunner', inputRunner.value.trim())
})
watch(inputTitle, () => {
  emit('updateTitle', inputTitle.value.trim())
})
watch(inputSubtitle, () => {
  emit('updateSubtitle', inputSubtitle.value.trim())
})
watch(inputCategory, () => {
  emit('updateCategory', inputCategory.value.trim())
})
watch(inputTime, () => {
  emit('updateTime', inputTime.value.trim())
})
watch(inputMoney, () => {
  emit('updateMoney', Math.round(inputMoney.value))
})
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
      v-model="inputRunner"
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
      v-model="inputTitle"
      type="text"
      name="title"
      id="title"
      label="Tytuł"
      size="42"
      required
      prepend-inner-icon="mdso:uppercase"
    />
    <v-text-field
      clearable
      v-model="inputSubtitle"
      type="text"
      name="subtitle"
      id="subtitle"
      size="42"
      label="Podtytuł (opcjonalne)"
      prepend-inner-icon="mdso:lowercase"
    />
    <v-text-field
      clearable
      v-model="inputCategory"
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
      v-model="inputTime"
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
      v-model="inputMoney"
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
