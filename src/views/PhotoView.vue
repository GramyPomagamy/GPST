<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import InputItem from '../components/InputItem.vue'
import { useRoute } from 'vue-router'

import { getFullTitle, newLanczos } from '@/utils/misc'

import { useGenericStore } from '@/stores/generic'

import { StaticCanvas, FabricText, FabricImage, Point, Group } from 'fabric'
import type { StaticCanvasEvents } from 'fabric'

const store = useGenericStore(),
  routeQuery = useRoute().query,
  canvasWidth = ref(1500),
  canvasHeight = ref(1000),
  canvas: StaticCanvas<StaticCanvasEvents> = new StaticCanvas('', {
    width: canvasWidth.value,
    height: canvasHeight.value
  }),
  mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
  backgroundImage: Ref<FabricImage | null> = ref(null),
  photo = ref(''),
  photoRotation = ref(0),
  imageGradientBackground: Ref<FabricImage | null> = ref(null),
  imageGradient: Ref<FabricImage | null> = ref(null),
  imageLogoGSPS: Ref<FabricImage | null> = ref(null),
  imageLogoFoundation: Ref<FabricImage | null> = ref(null),
  imageBanner: Ref<FabricImage | null> = ref(null),
  runnerText: FabricText = new FabricText('', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 101,
    fill: 'white',
    textAlign: 'center',
    top: 216,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke'
  }),
  titleText: FabricText = new FabricText('', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 340,
    fill: 'white',
    textAlign: 'center',
    top: 0, //309,
    left: 0,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke',
    objectCaching: false
  }),
  subtitleText: FabricText = new FabricText('', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 340,
    fill: '#ffbd16',
    textAlign: 'center',
    top: 0, //309,
    left: 0, //742,
    stroke: 'black',
    strokeWidth: 8,
    paintFirst: 'stroke',
    objectCaching: false
  }),
  titleGroup = new Group([titleText, subtitleText], {
    top: 309, //505,
    objectCaching: false,
    originX: 'center'
  }),
  categoryText: FabricText = new FabricText('', {
    fontFamily: 'Barlow Condensed',
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: 42,
    fill: 'white',
    textAlign: 'center',
    top: 887 + 3,
    stroke: 'black',
    strokeWidth: 5,
    paintFirst: 'stroke'
  }),
  weCollected: FabricText = new FabricText('zebraliśmy już', {
    fontFamily: 'Saira Condensed',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 24,
    fill: 'white',
    textAlign: 'center',
    top: 190,
    left: 139,
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
    top: 217,
    left: 0,
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

    runnerText.set({ text: store.runner })
    canvas.add(runnerText)
    canvas.centerObjectH(runnerText)

    let titleFontSize = 340
    titleText.set({ fontSize: titleFontSize })
    subtitleText.set({ fontSize: titleFontSize })

    // Make it fit around the same size as in GIMP
    const textWidth = titleText.getScaledWidth() + subtitleText.getScaledWidth()
    if (textWidth > 1374) {
      titleFontSize = Math.round(titleFontSize * (1374 / (textWidth + 1)))
      console.log('rescaling:', textWidth, titleFontSize)
      titleText.set({ fontSize: titleFontSize })
      subtitleText.set({ fontSize: titleFontSize })
    }

    // // Ctx.font = 'normal normal 600 113px Barlow Condensed'
    // renderShadowText(ctx, `${store.title} `, titlePosition, titleHeight, canvasWidth.value)

    titleText.set({ text: store.title })
    subtitleText.set({ text: store.subtitle })
    subtitleText.set({
      left: titleText.getScaledWidth()
    })

    // uglu hack, centerObjectH is broken
    titleGroup.set({
      top: 309 + titleFontSize / 2,
      left: canvasWidth.value / 2 - (titleText.getScaledWidth() + subtitleText.getScaledWidth()) / 2
    })

    canvas.add(titleGroup)

    categoryText.set({ text: store.category })
    canvas.add(categoryText)
    canvas.centerObjectH(categoryText)

    if (store.money > 0) {
      canvas.add(weCollected)

      moneyText.set({
        text: `${Math.round(store.money).toLocaleString('pl-PL')} PLN`
      })
      moneyText.set({ left: 204 - moneyText.getScaledWidth() / 2 })
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

if (routeQuery.money && typeof routeQuery.money === 'string') {
  store.money = Number(routeQuery.money)
}

onMounted(async () => {
  imageGradientBackground.value = await FabricImage.fromURL(
    `${import.meta.env.VITE_IMAGES_GRADIENT}`
  )

  imageGradient.value = await imageGradientBackground.value.clone()
  imageGradient.value.opacity = 0.12

  imageBanner.value = await FabricImage.fromURL(`${import.meta.env.VITE_IMAGES_BANNER_MILESTONE}`)

  imageLogoGSPS.value = await FabricImage.fromURL(`${import.meta.env.VITE_LOGO_FIRST}`)
  {
    imageLogoGSPS.value.setXY(new Point(1110, 849))
    imageLogoGSPS.value.scaleToWidth(360)
    // const lanczos = newLanczos(imageLogoGSPS.value)
    // imageLogoGSPS.value.applyFilters([lanczos])
  }

  imageLogoFoundation.value = await FabricImage.fromURL(`${import.meta.env.VITE_LOGO_SECOND}`)
  {
    imageLogoFoundation.value.scaleToWidth(350)
    // const lanczos = newLanczos(imageLogoFoundation.value)
    // imageLogoFoundation.value.applyFilters([lanczos])
  }

  store.$subscribe(() => {
    // TODO: maybe limit scope here? Do we want to redraw on ANY change in the store?
    // console.log('store updated:', mutation, state)
    redrawCanvas()
  })
  redrawCanvas()
})
</script>

<template>
  <v-container fluid class="main bg-surface">
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
          :enable-money="true"
          :canvasModel="mainCanvas"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
