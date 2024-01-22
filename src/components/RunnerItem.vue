<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const inputBackground: Ref<HTMLInputElement | null> = ref(null)
const inputRunner = ref('')
const inputTitle = ref('')
const inputSubtitle = ref('')
const inputCategory = ref('')

const emit = defineEmits<{
  updateBackground: [b: string]
  updateRunner: [r: string]
  updateTitle: [t: string]
  updateSubtitle: [s: string]
  updateCategory: [c: string]
}>()

function onNewBackground() {
  console.log(inputBackground.value!.files![0])
  let reader = new FileReader()
  reader.onloadend = function () {
    console.log(reader.result)
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
  </div>
</template>
