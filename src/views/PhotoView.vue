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
  canvasWidth = ref(1500),
  canvasHeight = ref(1000),
  backgroundImage: Ref<HTMLImageElement> = ref(new Image()),
  mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
  photo = ref(''),
  photoRotation = ref(0),
  photoLoaded = ref(false),
  imageBanner = await loadImage(`${import.meta.env.VITE_IMAGES_BANNER_MILESTONE}`),
  // ImageBanner.src = imageBannerData

  imageGradient = await loadImage(`${import.meta.env.VITE_IMAGES_GRADIENT}`),
  imageLogoGSPS = await loadImage(`${import.meta.env.VITE_LOGO_FIRST}`),
  imageLogoFoundation = await loadImage(`${import.meta.env.VITE_LOGO_SECOND}`),
  redrawThumbnail = function () {
    // TODO: add a check to see if the canvas is already loaded
    if (mainCanvas.value === null) {
      console.error('canvas not found,doing ugly retry in 0.1s')
      setTimeout(redrawThumbnail, 100)
      return
    }
    const ctx = mainCanvas.value.getContext('2d')!,
      runnerPosition = 208 + 101,
      fullTitle = `${store.title} ${store.subtitle}`

    ctx.drawImage(imageGradient, 0, 0)

    drawBackground(ctx, backgroundImage.value, store.photoScale, store.photoLeft, store.photoTop)

    ctx.globalAlpha = 0.12
    ctx.drawImage(imageGradient, 0, 0)
    ctx.globalAlpha = 1
    ctx.drawImage(imageBanner, 0, 0)

    ctx.imageSmoothingQuality = 'high'
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(imageLogoGSPS, 1110, 849, 360, 360 * (imageLogoGSPS.height / imageLogoGSPS.width))

    ctx.drawImage(
      imageLogoFoundation,
      0,
      0,
      350,
      350 * (imageLogoFoundation.height / imageLogoFoundation.width)
    )

    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 8
    ctx.textAlign = 'center'

    // Runner 83medium
    ctx.font = 'normal normal 600 101px Saira Condensed'
    renderShadowText(ctx, store.runner, canvasWidth.value / 2, runnerPosition, canvasWidth.value)

    // Fdbc16
    let titleFontSize = 340

    ctx.font = `normal normal 600 ${titleFontSize.toString()}px Saira Condensed`

    // Make it fit around the same size as in GIMP
    while (ctx.measureText(fullTitle).width > 1374) {
      titleFontSize -= 1
      ctx.font = `normal normal 600 ${titleFontSize.toString()}px Saira Condensed`
    }

    const titleHeight = 442 + titleFontSize / 2,
      titleLength = ctx.measureText(store.title).width,
      subtitleLength = ctx.measureText(store.subtitle).width,
      titlesDiff = Math.abs(titleLength - subtitleLength),
      titleMiddle = canvasWidth.value / 2

    let titlePosition = titleMiddle - titleLength / 2 + titlesDiff / 2,
      subtitlePosition = titleMiddle + subtitleLength / 2 + titlesDiff / 2

    if (titleLength < subtitleLength) {
      titlePosition = titleMiddle - titleLength / 2 - titlesDiff / 2
      subtitlePosition = titleMiddle + subtitleLength / 2 - titlesDiff / 2
    }

    // Ctx.font = 'normal normal 600 113px Barlow Condensed'
    renderShadowText(ctx, `${store.title} `, titlePosition, titleHeight, canvasWidth.value)

    if (store.subtitle) {
      // // podtytuł 90 semi-bld
      ctx.fillStyle = '#ffbd16'
      renderShadowText(ctx, store.subtitle, subtitlePosition, titleHeight, canvasWidth.value)
    }

    // Kategoria 42 light
    ctx.lineWidth = 5
    ctx.fillStyle = 'white'
    ctx.font = 'normal normal 300 42px Barlow Condensed'
    renderShadowText(ctx, store.category, canvasWidth.value / 2, 887 + 42, canvasWidth.value)

    if (store.money > 0) {
      // We collected 24 bold
      ctx.lineWidth = 5
      ctx.font = 'normal normal 600 24px Saira Condensed'
      ctx.fillStyle = 'white'
      renderShadowText(ctx, 'zebraliśmy już', 203, 185 + 24 + 5, canvasWidth.value)

      // Money 42 ultra bold
      ctx.lineWidth = 5
      ctx.font = 'normal normal 800 77px Saira Condensed'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffbd16'
      renderShadowText(
        ctx,
        `${Math.round(store.money).toLocaleString('pl-PL')} PLN`,
        160 + 43,
        200 + 77 + 10,
        canvasWidth.value
      )
    }
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

imageGradient.onload = redrawThumbnail
imageLogoGSPS.onload = redrawThumbnail
imageLogoFoundation.onload = redrawThumbnail
imageBanner.onload = redrawThumbnail

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

if (routeQuery.money && typeof routeQuery.money === 'string') {
  store.money = Number(routeQuery.money)
}

onMounted(() => {
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
    <!---<v-row>
      <v-col>
        <h1>Miniaturka runnera na Twittera</h1>
      </v-col>
    </v-row>-->
    <v-row>
      <v-col>
        <CanvasItem
          :canvasWidth="canvasWidth"
          :canvasHeight="canvasHeight"
          @canvasElement="(can: HTMLElement) => (mainCanvas = can)"
          @updateBackground="(b: string) => (photo = b)"
          @updateRotation="(r: number) => (photoRotation = (photoRotation + r) % 360)"
        />
      </v-col>
      <v-col cols="12" md="4">
        <InputItem
          @updateBackground="(b: string) => (photo = b)"
          :enable-money="true"
          :canvasModel="mainCanvas"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
