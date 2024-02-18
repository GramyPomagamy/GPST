<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const inputBackground: Ref<HTMLInputElement | null> = ref(null)
const inputRunner = ref('')
const inputTitle = ref('')
const inputSubtitle = ref('')
const inputCategory = ref('')
const inputMoney = ref(0)

const props = defineProps<{
  runner: string
  title: string
  subtitle: string
  category: string
  money: number
}>()

const emit = defineEmits<{
  updateBackground: [b: string]
  updateRunner: [r: string]
  updateTitle: [t: string]
  updateSubtitle: [s: string]
  updateCategory: [c: string]
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
if (props.money) {
  inputMoney.value = props.money
  emit('updateMoney', props.money)
}

function onNewBackground() {
  console.log(inputBackground.value!.files![0])
  let reader = new FileReader()
  reader.onloadend = function () {
    emit('updateBackground', reader.result as string)
  }
  reader.readAsDataURL(inputBackground.value!.files![0])
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
watch(inputMoney, () => {
  emit('updateMoney', inputMoney.value)
})
</script>

<template>
  <div>
    <div>
      <label for="background">Tło:</label>
      <input
        ref="inputBackground"
        @change="onNewBackground"
        type="file"
        name="background"
        id="background"
        accept="image/png, image/jpeg, image/bmp"
      />
    </div>
    <div>
      <label for="runner">Runner:</label>
      <input
        v-model="inputRunner"
        type="text"
        name="runner"
        id="runner"
        placeholder="Runner"
        required
      />
    </div>
    <div>
      <label for="title">Tytuł:</label>
      <input
        v-model="inputTitle"
        type="text"
        name="title"
        id="title"
        placeholder="Tytuł"
        required
      />
    </div>
    <div>
      <label for="subtitle">Podtytuł:</label>
      <input
        v-model="inputSubtitle"
        type="text"
        name="subtitle"
        id="subtitle"
        placeholder="Podtytuł (opcjonalne)"
      />
    </div>
    <div>
      <label for="category">Kategoria:</label>
      <input
        v-model="inputCategory"
        type="text"
        name="category"
        id="category"
        placeholder="Kategoria"
        required
      />
    </div>
    <div>
      <label for="money">Uzbierano:</label>
      <input
        v-model="inputCategory"
        type="number"
        name="money"
        id="money"
        placeholder="0"
        required
      />
      <!-- TODO update from the internet -->
    </div>
  </div>
</template>
