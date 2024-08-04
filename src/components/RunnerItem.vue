<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

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
  <div>
    <div>
      <v-file-input
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
    </div>
    <div>
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
    </div>
    <div>
      <v-text-field
        clearable
        v-model="inputTitle"
        type="text"
        name="title"
        id="title"
        label="Tytuł"
        size="42"
        required
        prepend-inner-icon="uppercase"
      />
    </div>
    <div>
      <v-text-field
        clearable
        v-model="inputSubtitle"
        type="text"
        name="subtitle"
        id="subtitle"
        size="42"
        label="Podtytuł (opcjonalne)"
        prepend-inner-icon="lowercase"
      />
    </div>
    <div>
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
    </div>

    <div v-if="enableTime">
      <v-text-field
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
    </div>
    <div v-if="enableMoney">
      <v-number-input
        clearable
        v-model="inputMoney"
        type="number"
        name="money"
        label="Uzbierano"
        id="money"
        placeholder="0"
        size="10"
        required
        prepend-inner-icon="paid"
      />
      <!-- TODO update from the internet -->
      <v-btn @click.prevent="updateMoney">Aktualizuj</v-btn>
    </div>
  </div>
</template>
