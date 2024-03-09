<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
  canvasWidth: number
  canvasHeight: number
  title: string
}>()

const emit = defineEmits<{
  canvasContext: [canvas: HTMLCanvasElement]
  updateBackground: [file: string]
  updateScale: [scale: number]
  updatePos: [left: number, top: number]
  updateRotation: [rotation: number]
}>()

const canvasDragged = ref(false)
const canvasModel: Ref<HTMLCanvasElement | null> = ref(null)

// TODO remove after testing
const sumX = ref(0)
const sumY = ref(0)

function canvasDrop(e: DragEvent) {
  if (e.dataTransfer!.items && e.dataTransfer!.items.length == 1) {
    //emit('string', e.dataTransfer!.items[0])
    let reader = new FileReader()
    reader.onloadend = function () {
      emit('updateBackground', reader.result as string)
    }
    reader.readAsDataURL(e.dataTransfer!.items[0].getAsFile()!)
  }
}

function canvasWheel(e: WheelEvent) {
  if (e.deltaY > 0) {
    emit('updateScale', -0.02)
  } else {
    emit('updateScale', 0.02)
  }
}

function canvasMouseDown(e: MouseEvent) {
  if ((e.buttons & 1) == 1) {
    canvasDragged.value = true
  }
  // wheel button
  if (((e.buttons >> 2) & 1) == 1) {
    emit('updateRotation', 90)
  }
}

function windowMouseUp(e: MouseEvent) {
  if ((e.buttons & 1) == 0) {
    canvasDragged.value = false
    sumX.value = 0
    sumY.value = 0
  }
}

function windowMouseMove(e: MouseEvent) {
  if (canvasDragged.value) {
    sumX.value += e.movementX
    sumY.value += e.movementY
    emit('updatePos', e.movementX, e.movementY)
  }
}

function savePNG() {
  const data = canvasModel.value!.toDataURL('image/png')
  let a = document.createElement('a')
  a.download = props.title + '.png'
  a.href = data
  a.click()
  console.info('Zapis do pliku' + props.title + '.png')
}

// TODO this might break if the button is lifted outside of a browser window, oh well
onMounted(() => {
  window.addEventListener('mousemove', windowMouseMove)
  window.addEventListener('mouseup', windowMouseUp)
  emit('canvasContext', canvasModel.value!)
})
</script>
<template>
  <div>
    <canvas
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
    <button @click.prevent="savePNG">Zapisz PNG</button>
  </div>
</template>

<!-- <style scoped>
#mainCanvas {
  max-width: 75vw;
  max-height: 70vh;
  border: 1px solid black;
}
</style> -->
