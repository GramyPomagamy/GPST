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
  mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
  canvasWidth = ref(1500),
  canvasHeight = ref(1000),
  backgroundImage: Ref<HTMLImageElement> = ref(new Image()),
  photoRotation = ref(0),
  imageGradient: Ref<HTMLImageElement | null> = ref(null),
  imageLogoGSPS: Ref<HTMLImageElement | null> = ref(null),
  imageLogoFoundation: Ref<HTMLImageElement | null> = ref(null),
  imageBanner: Ref<HTMLImageElement | null> = ref(null),
  photo = ref(''),
  photoLoaded = ref(false),
  redrawThumbnail = function () {
    // TODO: add a check to see if the canvas is already loaded
    if (mainCanvas.value === null) {
      console.error('canvas not found,doing ugly retry in 0.1s')
      // setTimeout(redrawThumbnail, 100)
      return
    }
    const ctx = mainCanvas.value.getContext('2d')!

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
        16,
        15,
        316,
        316 * (imageLogoGSPS.value.height / imageLogoGSPS.value.width)
      )
    }

    if (imageLogoFoundation.value) {
      ctx.drawImage(
        imageLogoFoundation.value,
        320,
        0,
        323,
        323 * (imageLogoFoundation.value.height / imageLogoFoundation.value.width)
      )
    }

    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 8
    ctx.font = 'normal normal 500 99px Barlow Condensed'
    ctx.textAlign = 'center'
    // 1500 - ((1500 - 912) / 2)
    renderShadowText(ctx, 'Już za chwilę...', 1206, 99, canvasWidth.value - 912)

    let runnerPosition = 648 + 83,
      titlePosition = 740 + 113
    if (store.subtitle) {
      runnerPosition = 587 + 83
      titlePosition = 668 + 113
    }

    // Runner 83medium
    ctx.font = 'normal normal 500 83px Barlow Condensed'
    renderShadowText(ctx, store.runner, canvasWidth.value / 2, runnerPosition, canvasWidth.value)

    // Title, 113 semi-bold
    ctx.font = 'normal normal 600 113px Barlow Condensed'
    renderShadowText(ctx, store.title, canvasWidth.value / 2, titlePosition, canvasWidth.value)

    if (store.subtitle) {
      // Podtytuł 90 semi-bld
      ctx.font = 'normal normal 600 90px Barlow Condensed'

      renderShadowText(ctx, store.subtitle, canvasWidth.value / 2, 786 + 90, canvasWidth.value)
    }

    // Kategoria 42 light
    ctx.lineWidth = 5
    ctx.font = 'normal normal 300 42px Barlow Condensed'
    renderShadowText(ctx, store.category, canvasWidth.value / 2, 887 + 42, canvasWidth.value)

    if (store.money > 0) {
      // We collected 24 bold
      ctx.lineWidth = 5
      ctx.font = 'normal normal 600 24px Saira Condensed'
      renderShadowText(ctx, 'zebraliśmy już', 175, 170, canvasWidth.value)

      // Money 42 ultra bold
      ctx.lineWidth = 5
      ctx.font = 'normal normal 800 77px Saira Condensed'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffbd16'
      renderShadowText(
        ctx,
        `${Math.round(store.money).toLocaleString('pl-PL')} PLN`,
        (368 - 16) / 2,
        242,
        canvasWidth.value
      )
    }
  },
  routeQuery = useRoute().query

// ImageBanner.src = imageBannerData

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

watch(mainCanvas, redrawThumbnail)

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

onMounted(async () => {
  imageGradient.value = await loadImage(`${import.meta.env.VITE_IMAGES_GRADIENT}`)
  imageGradient.value.onload = redrawThumbnail
  imageLogoGSPS.value = await loadImage(`${import.meta.env.VITE_LOGO_FIRST}`)
  imageLogoGSPS.value.onload = redrawThumbnail
  imageLogoFoundation.value = await loadImage(`${import.meta.env.VITE_LOGO_SECOND}`)
  imageLogoFoundation.value.onload = redrawThumbnail
  imageBanner.value = await loadImage(`${import.meta.env.VITE_IMAGES_BANNER_RUNNER}`)
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
    <v-row>
      <v-col>
        <CanvasItem
          :class="`h-auto w-auto`"
          :canvasWidth="canvasWidth"
          :canvasHeight="canvasHeight"
          @canvasElement="(can: HTMLCanvasElement) => (mainCanvas = can)"
          @updateBackground="(b: string) => (photo = b)"
          @updateRotation="(r: number) => (photoRotation = (photoRotation + r) % 360)"
        />
        <v-row>
          <v-col>
            <p class="text-center">
              Hej! Brak pewności czy Twoja miniaturka wygląda dobrze?
              <a
                class="font-weight-medium text-white"
                href="https://twitter.com/search?q=from%3A%40GramyPomagamy+%23gspsdzieciom24&f=live"
                >Spójrz tu</a
              >
              na inne przykłady.
            </p>
          </v-col>
        </v-row>
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
