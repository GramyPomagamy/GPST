<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
    canvasWidth: number
    canvasHeight: number
    title: string
  }>(),
  emit = defineEmits<{
    canvasContext: [canvas: HTMLCanvasElement]
    updateBackground: [file: string]
    updateScale: [scale: number]
    updatePos: [left: number, top: number]
    updateRotation: [rotation: number]
  }>(),
  canvasDragged = ref(false),
  canvasModel: Ref<HTMLCanvasElement | null> = ref(null),
  canvasDrop = function (e: DragEvent) {
    if (e.dataTransfer!.items && e.dataTransfer!.items.length === 1) {
      //Emit('string', e.dataTransfer!.items[0])
      const reader = new FileReader()
      reader.onloadend = function () {
        emit('updateBackground', reader.result as string)
      }
      reader.readAsDataURL(e.dataTransfer!.items[0].getAsFile()!)
    }
  },
  canvasWheel = function (e: WheelEvent) {
    if (e.deltaY > 0) {
      emit('updateScale', -0.02)
    } else {
      emit('updateScale', 0.02)
    }
  },
  canvasMouseDown = function (e: MouseEvent) {
    if ((e.buttons & 1) === 1) {
      canvasDragged.value = true
      canvasModel.value!.classList.add('cursor-grabbing')
      canvasModel.value!.classList.remove('cursor-grab')
    }
    // Wheel button
    if (((e.buttons >> 2) & 1) === 1) {
      emit('updateRotation', 90)
    }
  },
  windowMouseUp = function (e: MouseEvent) {
    if (canvasModel.value !== null && (e.buttons & 1) === 0) {
      canvasDragged.value = false
      canvasModel.value!.classList.remove('cursor-grabbing')
      canvasModel.value!.classList.add('cursor-grab')
    }
  },
  windowMouseMove = function (e: MouseEvent) {
    if (canvasDragged.value) {
      emit('updatePos', e.movementX, e.movementY)
    }
  },
  savePNG = function () {
    const data = canvasModel.value!.toDataURL('image/png'),
      a = document.createElement('a')
    a.download = `${props.title}.png`
    a.href = data
    a.click()
    console.info(`Zapis do pliku${props.title}.png`)
  }

onMounted(() => {
  window.addEventListener('mousemove', windowMouseMove)
  window.addEventListener('mouseup', windowMouseUp)
  emit('canvasContext', canvasModel.value!)
})
</script>
<template>
  <div>
    <canvas
      :class="`cursor-grab`"
      @drop.prevent="canvasDrop"
      @wheel.prevent="canvasWheel"
      @mousedown.prevent="canvasMouseDown"
      ref="canvasModel"
      id="mainCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
    >
      Nie pójdzie bez JS. Co jest zadziwiające jak w ogóle byłeś w stanie zobaczyć tę wiadomość?
    </canvas>
    <v-btn variant="tonal" prepend-icon="download" @click.prevent="savePNG">Zapisz PNG</v-btn>
  </div>
</template>

<!-- <style scoped>
#mainCanvas {
  max-width: 75vw;
  max-height: 70vh;
  border: 1px solid black;
}
</style> -->
