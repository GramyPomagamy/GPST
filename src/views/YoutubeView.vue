<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import InputItem from '../components/InputItem.vue'
import { useRoute } from 'vue-router'

import { loadImage } from '../utils/loadImage'
import { renderShadowText } from '@/utils/renderText'
import { drawBackground } from '@/utils/misc'

import { useGenericStore } from '@/stores/generic'

const store = useGenericStore(),
  routeQuery = useRoute().query,
  canvasWidth = ref(1280),
  canvasHeight = ref(720),
  backgroundImage: Ref<HTMLImageElement> = ref(new Image()),
  mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
  photo = ref(''),
  photoRotation = ref(0),
  photoLoaded = ref(false),
  imageGradient: Ref<HTMLImageElement | null> = ref(null),
  imageLogoGSPS: Ref<HTMLImageElement | null> = ref(null),
  imageBanner: Ref<HTMLImageElement | null> = ref(null),
  redrawThumbnail = function () {
    // TODO: add a check to see if the canvas is already loaded
    if (mainCanvas.value === null) {
      console.error('canvas not found,doing ugly retry in 0.1s')
      setTimeout(redrawThumbnail, 100)
      return
    }
    const ctx = mainCanvas.value.getContext('2d')!,
      categoryPosition = 241,
      runnerPosition = 456,
      timePosition = 285,
      rightSide = canvasWidth.value - 3,
      subtitlePosition = 130

    if (imageGradient.value) {
      ctx.drawImage(imageGradient.value, 0, 0)
    }

    drawBackground(ctx, backgroundImage.value, store.photoScale, store.photoLeft, store.photoTop)

    if (imageGradient.value) {
      ctx.globalAlpha = 0.12
      ctx.drawImage(imageGradient.value, 0, 0)
    }
    ctx.globalAlpha = 1
    if (imageBanner.value) {
      ctx.drawImage(imageBanner.value, 0, 0)
    }

    ctx.imageSmoothingQuality = 'high'
    ctx.imageSmoothingEnabled = true
    if (imageLogoGSPS.value) {
      ctx.drawImage(
        imageLogoGSPS.value,
        30,
        590,
        404,
        404 * (imageLogoGSPS.value.height / imageLogoGSPS.value.width)
      )
    }

    ctx.fillStyle = '#e1e1e1'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 8
    ctx.font = 'normal normal 700 99px PT Sans Narrow'
    ctx.textAlign = 'right'

    let titlePosition = 31,
      titleSize = 150
    if (store.subtitle) {
      titlePosition = 0
      titleSize = 114
    }

    // Runner 83 PT Sans Narrow Bold Condensed
    ctx.font = 'normal normal 700 70px PT Sans Narrow'
    renderShadowText(ctx, store.runner, rightSide, runnerPosition + 70, canvasWidth.value)

    // Title,  PT Sans Narrow Bold Condensed
    ctx.font = `normal normal 700 ${titleSize.toString()}px PT Sans Narrow`
    renderShadowText(ctx, store.title, rightSide, titlePosition + titleSize, canvasWidth.value)

    if (store.subtitle) {
      // Podtytuł 77 PT Sans Narrow Bold Condensed
      ctx.font = 'normal normal 700 77px PT Sans Narrow'
      renderShadowText(ctx, store.subtitle, rightSide, subtitlePosition + 77, canvasWidth.value)
    }

    // Kategoria 62 Saira Condensed, Semi-Bold Condensed
    ctx.font = 'normal normal 600 62px Saira Condensed'
    renderShadowText(ctx, store.category, rightSide, categoryPosition + 62, canvasWidth.value)

    // Time 158 Saira Condensed, Ultra-Bold Condensed
    ctx.font = 'normal normal 800 158px Saira Condensed'
    ctx.fillStyle = '#ffbd16'
    ctx.strokeText(store.time, rightSide, timePosition + 158, canvasWidth.value)
    ctx.fillText(store.time, rightSide, timePosition + 158, canvasWidth.value)
  }

backgroundImage.value.onload = () => {
  photoLoaded.value = true
  // Set default scale to fill the image
  let scaleX = canvasWidth.value / backgroundImage.value.width
  const scaleY = canvasHeight.value / backgroundImage.value.height
  if (scaleX < scaleY) {
    scaleX = scaleY
  }
  store.photoScale = Math.round(scaleX * 100) / 100
  redrawThumbnail()
}

watch(photo, (newPhoto: string) => {
  store.photoLeft = 0
  store.photoTop = 0
  store.photoScale = 1.0
  photoRotation.value = 0
  photoLoaded.value = false

  backgroundImage.value.src = newPhoto
})
document.fonts.onloadingdone = redrawThumbnail

// Rotate image once before using it
watch(photoRotation, async () => {
  // Skip on image load
  if (photoLoaded.value === false) {
    return
  }

  const tmpCanvas = document.createElement('canvas'),
    ctx = tmpCanvas.getContext('2d')!
  tmpCanvas.width = backgroundImage.value.height
  tmpCanvas.height = backgroundImage.value.width
  ctx.translate(tmpCanvas.width / 2, tmpCanvas.height / 2)
  ctx.rotate((90 * Math.PI) / 180)

  ctx.drawImage(backgroundImage.value, -tmpCanvas.height / 2, -tmpCanvas.width / 2)

  photoLoaded.value = false
  backgroundImage.value.src = tmpCanvas.toDataURL('image/png')
})

if (routeQuery.runner && typeof routeQuery.runner === 'string') {
  store.runner = routeQuery.runner
}
if (routeQuery.title && typeof routeQuery.title === 'string') {
  store.title = routeQuery.title
}
if (routeQuery.subtitle && typeof routeQuery.subtitle === 'string') {
  store.subtitle = routeQuery.subtitle
}
if (routeQuery.category && typeof routeQuery.category === 'string') {
  store.category = routeQuery.category
}

if (routeQuery.time && typeof routeQuery.time === 'string') {
  store.time = routeQuery.time
}

onMounted(async () => {
  imageGradient.value = await loadImage(`${import.meta.env.VITE_IMAGES_GRADIENT}`)
  imageGradient.value.onload = redrawThumbnail
  imageLogoGSPS.value = await loadImage(`${import.meta.env.VITE_LOGO_MA}`)
  imageLogoGSPS.value.onload = redrawThumbnail
  imageBanner.value = await loadImage(`${import.meta.env.VITE_IMAGES_BANNER_YOUTUBE}`)
  imageBanner.value.onload = redrawThumbnail

  store.$subscribe((mutation, state) => {
    // TODO: maybe limti scope here? Do we want to redraw on ANY change in the store?
    // console.log('store updated:', mutation, state)
    redrawThumbnail()
  })
  redrawThumbnail()
})
</script>

<template>
  <v-container fluid class="main bg-surface">
    <!--<v-row>
      <v-col>
        <h1>Miniaturka runnera na Twittera</h1>
      </v-col>
    </v-row>-->
    <v-row>
      <v-col>
        <CanvasItem
          :canvasWidth="canvasWidth"
          :canvasHeight="canvasHeight"
          @canvasElement="(can: HTMLCanvasElement) => (mainCanvas = can)"
          @updateBackground="(b: string) => (photo = b)"
          @updateRotation="(r: number) => (photoRotation = (photoRotation + r) % 360)"
        />
      </v-col>
      <v-col cols="12" md="4">
        <InputItem
          @updateBackground="(b: string) => (photo = b)"
          :enable-time="true"
          :canvasModel="mainCanvas"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
