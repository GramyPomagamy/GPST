<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import InputItem from '../components/InputItem.vue'
import { useRoute } from 'vue-router'

import { getFullTitle, newLanczos } from '@/utils/misc'

import { useGenericStore } from '@/stores/generic'

import { StaticCanvas, FabricText, FabricImage, Point } from 'fabric'
import type { StaticCanvasEvents } from 'fabric'

const store = useGenericStore(),
  routeQuery = useRoute().query,
  canvasWidth = ref(1280),
  canvasHeight = ref(720),
  canvas: StaticCanvas<StaticCanvasEvents> = new StaticCanvas('', {
    width: canvasWidth.value,
    height: canvasHeight.value
  }),
  imageGradientBackground: Ref<FabricImage | null> = ref(null),
  backgroundImage: Ref<FabricImage | null> = ref(null),
  mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
  photo = ref(''),
  photoRotation = ref(0),
  imageGradient: Ref<FabricImage | null> = ref(null),
  imageLogoGSPS: Ref<FabricImage | null> = ref(null),
  imageBanner: Ref<FabricImage | null> = ref(null),
  runnerText: FabricText = new FabricText('', {
    fontFamily: 'PT Sans Narrow',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 70,
    fill: '#e1e1e1',
    top: 460,
    left: canvasWidth.value,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke',
    originX: 'right'
  }),
  titleText: FabricText = new FabricText('', {
    fontFamily: 'PT Sans Narrow',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 150,
    fill: '#e1e1e1',
    top: 0,
    left: canvasWidth.value,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke',
    originX: 'right'
  }),
  subtitleText: FabricText = new FabricText('', {
    fontFamily: 'PT Sans Narrow',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 77,
    fill: '#e1e1e1',
    textAlign: 'center',
    top: 134,
    left: canvasWidth.value,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke',
    originX: 'right'
  }),
  categoryText: FabricText = new FabricText('', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 62,
    fill: '#e1e1e1',
    textAlign: 'right',
    top: 246,
    left: canvasWidth.value,
    stroke: 'black',
    strokeWidth: 5,
    paintFirst: 'stroke',
    originX: 'right'
  }),
  timeText: FabricText = new FabricText('', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 158,
    fill: '#ffbd16',
    textAlign: 'center',
    top: 302,
    left: canvasWidth.value,
    stroke: 'black',
    strokeWidth: 5,
    paintFirst: 'stroke',
    originX: 'right'
  }),
  redrawThumbnail = function (filter: boolean = false) {
    canvas.clear()
    if (imageGradientBackground.value) {
      canvas.add(imageGradientBackground.value)
    }

    if (backgroundImage.value) {
      backgroundImage.value.scale(store.photoScale)
      backgroundImage.value.set({
        left: store.photoLeft,
        top: store.photoTop
      })

      backgroundImage.value.angle = photoRotation.value

      // TOOD: slow - use only for final render!
      if (filter) {
        const lanczos = newLanczos(backgroundImage.value)
        backgroundImage.value.applyFilters([lanczos])
      }

      canvas.add(backgroundImage.value)
    }
    if (imageGradient.value) {
      canvas.add(imageGradient.value)
    }

    if (imageBanner.value) {
      canvas.add(imageBanner.value)
    }

    if (imageLogoGSPS.value) {
      canvas.add(imageLogoGSPS.value)
    }

    if (store.subtitle != '') {
      titleText.set({ fontSize: 114, top: 10 })
    } else {
      titleText.set({ fontSize: 150, top: 40 })
    }

    titleText.set({ text: store.title })
    canvas.add(titleText)

    if (store.subtitle) {
      subtitleText.set({ text: store.subtitle })
      canvas.add(subtitleText)
    }

    categoryText.set({ text: store.category })
    canvas.add(categoryText)
    // // Time 158 Saira Condensed, Ultra-Bold Condensed
    // ctx.font = 'normal normal 800 158px Saira Condensed'
    // ctx.fillStyle = '#ffbd16'
    // ctx.strokeText(store.time, rightSide, timePosition + 158, canvasWidth.value)
    // ctx.fillText(store.time, rightSide, timePosition + 158, canvasWidth.value)
    timeText.set({ text: store.time })
    canvas.add(timeText)

    runnerText.set({ text: store.runner })
    canvas.add(runnerText)

    canvas.renderAll()
  },
  redrawCanvas = function () {
    redrawThumbnail(false)
    if (mainCanvas.value !== null && canvas !== null) {
      const dstCtx = mainCanvas.value.getContext('2d')!
      dstCtx.drawImage(canvas.toCanvasElement(), 0, 0)
    }
  },
  savePNG = function () {
    redrawThumbnail(true)
    if (canvas !== null) {
      const data = canvas.toDataURL({
          multiplier: 1.0,
          format: 'png'
        }),
        a = document.createElement('a')
      a.download = `${getFullTitle(store.title, store.subtitle)}.png`
      a.href = data
      a.click()
      console.info(`Zapis do pliku ${getFullTitle(store.title, store.subtitle)}.png`)
    }
  }

watch(photo, async (newPhoto: string) => {
  photoRotation.value = 0
  backgroundImage.value = await FabricImage.fromURL(
    newPhoto,
    {},
    {
      originX: 'center',
      originY: 'center'
    }
  )
  let scaleX = canvasWidth.value / backgroundImage.value.width
  const scaleY = canvasHeight.value / backgroundImage.value.height
  if (scaleX < scaleY) {
    scaleX = scaleY
  }
  store.photoScale = Math.round(scaleX * 100) / 100
  // TODO: fix position
  store.photoLeft = canvasWidth.value / 2
  store.photoTop = canvasHeight.value / 2

  redrawCanvas()
})
document.fonts.onloadingdone = redrawCanvas

// Rotate image once before using it
watch(photoRotation, async () => {
  redrawCanvas()
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
  imageGradientBackground.value = await FabricImage.fromURL(
    `${import.meta.env.VITE_IMAGES_GRADIENT}`
  )

  imageGradient.value = await imageGradientBackground.value.clone()
  imageGradient.value.opacity = 0.12

  imageBanner.value = await FabricImage.fromURL(`${import.meta.env.VITE_IMAGES_BANNER_YOUTUBE}`)

  imageLogoGSPS.value = await FabricImage.fromURL(`${import.meta.env.VITE_LOGO_FIRST}`)
  {
    imageLogoGSPS.value.setXY(new Point(30, 570))
    imageLogoGSPS.value.scaleToWidth(404)
    // const lanczos = newLanczos(imageLogoGSPS.value)
    // imageLogoGSPS.value.applyFilters([lanczos])
  }

  store.$subscribe(() => {
    // TODO: maybe limti scope here? Do we want to redraw on ANY change in the store?
    // console.log('store updated:', mutation, state)
    redrawCanvas()
  })
  redrawCanvas()
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
          @save-p-n-g="
            () => {
              savePNG()
            }
          "
          :enable-time="true"
          :canvasModel="mainCanvas"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
