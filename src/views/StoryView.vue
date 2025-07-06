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
  canvasWidth = ref(1080),
  canvasHeight = ref(1920),
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
  imageLogoFoundation: Ref<FabricImage | null> = ref(null),
  imageBanner: Ref<FabricImage | null> = ref(null),
  runnerText: FabricText = new FabricText('', {
    fontFamily: 'Barlow Condensed',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 83,
    fill: 'white',
    textAlign: 'center',
    top: 648,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke'
  }),
  titleText: FabricText = new FabricText('', {
    fontFamily: 'Barlow Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 113,
    fill: 'white',
    textAlign: 'center',
    top: 0,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke'
  }),
  subtitleText: FabricText = new FabricText('', {
    fontFamily: 'Barlow Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 90,
    fill: 'white',
    textAlign: 'center',
    top: 1650,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke'
  }),
  categoryText: FabricText = new FabricText('', {
    fontFamily: 'Barlow Condensed',
    fontStyle: 'normal',
    fontWeight: 500, // TODO: change?
    fontSize: 60,
    fill: 'white',
    textAlign: 'center',
    top: 1790,
    stroke: 'black',
    strokeWidth: 5,
    paintFirst: 'stroke'
  }),
  weCollected: FabricText = new FabricText('zebraliśmy już', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 50,
    fill: 'white',
    textAlign: 'center',
    top: 30,
    left: 750,
    stroke: 'black',
    strokeWidth: 5,
    paintFirst: 'stroke'
  }),
  moneyText: FabricText = new FabricText('', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 77,
    fill: '#ffbd16',
    textAlign: 'center',
    top: 120,
    left: 750,
    stroke: 'black',
    strokeWidth: 5,
    paintFirst: 'stroke'
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

    if (imageLogoFoundation.value) {
      canvas.add(imageLogoFoundation.value)
    }

    let runnerPosition = 1530,
      titlePosition = 1630
    if (store.subtitle) {
      runnerPosition = 1430
      titlePosition = 1530
    }

    runnerText.set({ text: store.runner, top: runnerPosition })
    canvas.add(runnerText)
    canvas.centerObjectH(runnerText)

    titleText.set({ text: store.title, top: titlePosition })
    canvas.add(titleText)
    canvas.centerObjectH(titleText)

    if (store.subtitle) {
      subtitleText.set({ text: store.subtitle })
      canvas.add(subtitleText)
      canvas.centerObjectH(subtitleText)
    }

    categoryText.set({ text: store.category })
    canvas.add(categoryText)
    canvas.centerObjectH(categoryText)

    if (store.money > 0) {
      canvas.add(weCollected)

      moneyText.set({
        text: `${Math.round(store.money).toLocaleString('pl-PL')} PLN`
      })
      moneyText.set({ left: 900 - moneyText.getScaledWidth() / 2 })
      canvas.add(moneyText)
    }

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

if (routeQuery.money && typeof routeQuery.money === 'string') {
  store.money = Number(routeQuery.money)
}

onMounted(async () => {
  imageGradientBackground.value = await FabricImage.fromURL(
    `${import.meta.env.VITE_IMAGES_GRADIENT_STORY}`
  )

  imageGradient.value = await imageGradientBackground.value.clone()
  imageGradient.value.opacity = 0.12

  imageBanner.value = await FabricImage.fromURL(`${import.meta.env.VITE_IMAGES_BANNER_STORY}`)

  imageLogoGSPS.value = await FabricImage.fromURL(`${import.meta.env.VITE_LOGO_FIRST}`)
  {
    imageLogoGSPS.value.setXY(new Point(40, 30))
    imageLogoGSPS.value.scaleToWidth(380)
    // const lanczos = newLanczos(imageLogoGSPS.value)
    // imageLogoGSPS.value.applyFilters([lanczos])
  }

  imageLogoFoundation.value = await FabricImage.fromURL(`${import.meta.env.VITE_LOGO_SECOND_STORY}`)
  {
    imageLogoFoundation.value.setXY(new Point(20, 200))
    imageLogoFoundation.value.scaleToWidth(400)
    // const lanczos = newLanczos(imageLogoFoundation.value)
    // imageLogoFoundation.value.applyFilters([lanczos])
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
  <v-container fluid class="main bg-surface h-100">
    <!--<v-row>
      <v-col>
        <h1>Miniaturka runnera na Instagrama</h1>
      </v-col>
    </v-row>-->
    <v-row class="h-100">
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
          :enable-money="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
