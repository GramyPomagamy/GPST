<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

import { useGenericStore } from '@/stores/generic'

const store = useGenericStore(),
  props = defineProps<{
    canvasWidth: number
    canvasHeight: number
  }>(),
  emit = defineEmits<{
    canvasElement: [canvas: HTMLCanvasElement]
    updateBackground: [file: string]
    updateRotation: [rotation: number]
  }>(),
  canvasDragged = ref(false),
  canvasElement: Ref<HTMLCanvasElement | null> = ref(null),
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
      store.photoScale -= 0.02
    } else {
      store.photoScale += 0.02
    }
  },
  canvasMouseDown = function (e: MouseEvent) {
    if ((e.buttons & 1) === 1) {
      canvasDragged.value = true
      canvasElement.value!.classList.add('cursor-grabbing')
      canvasElement.value!.classList.remove('cursor-grab')
    }
    // Wheel button
    if (((e.buttons >> 2) & 1) === 1) {
      emit('updateRotation', 90)
    }
  },
  windowMouseUp = function (e: MouseEvent) {
    if (canvasElement.value !== null && (e.buttons & 1) === 0) {
      canvasDragged.value = false
      canvasElement.value!.classList.remove('cursor-grabbing')
      canvasElement.value!.classList.add('cursor-grab')
    }
  },
  windowMouseMove = function (e: MouseEvent) {
    if (canvasDragged.value) {
      store.photoLeft += e.movementX
      store.photoTop += e.movementY
    }
  }

onMounted(() => {
  window.addEventListener('mousemove', windowMouseMove)
  window.addEventListener('mouseup', windowMouseUp)
  emit('canvasElement', canvasElement.value!)
})
</script>
<template>
  <div>
    <canvas
      :class="`cursor-grab h-100 w-100`"
      @drop.prevent="canvasDrop"
      @wheel.prevent="canvasWheel"
      @mousedown.prevent="canvasMouseDown"
      ref="canvasElement"
      id="mainCanvas"
      :width="props.canvasWidth"
      :height="props.canvasHeight"
    >
      Nie pójdzie bez JS. Co jest zadziwiające jak w ogóle byłeś w stanie zobaczyć tę wiadomość?
    </canvas>
  </div>
</template>
