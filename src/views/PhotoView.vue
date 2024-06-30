<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import RunnerItem from '../components/RunnerItem.vue'
import { useRoute } from 'vue-router'

import { loadImage } from '../utils/loadImage'
import { renderShadowText } from '@/utils/renderText'
import { getFullTitle, drawBackground } from '@/utils/misc'

const routeQuery = useRoute().query,
  canvasWidth = ref(1500),
  canvasHeight = ref(1000),
  backgroundImage: Ref<HTMLImageElement> = ref(new Image()),
  mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
  photo = ref(''),
  photoScale = ref(1.0),
  photoLeft = ref(0),
  photoTop = ref(0),
  photoRotation = ref(0),
  photoLoaded = ref(false),
  runner = ref(''),
  title = ref(''),
  subtitle = ref(''),
  category = ref(''),
  money = ref(0),
  initialRunner = ref(''),
  initialTitle = ref(''),
  initialSubtitle = ref(''),
  initialCategory = ref(''),
  initialMoney = ref(0),
  imageBanner = await loadImage(`../${import.meta.env.VITE_IMAGES_BANNER_MILESTONE}`),
  // ImageBanner.src = imageBannerData

  imageGradient = await loadImage(`../${import.meta.env.VITE_IMAGES_GRADIENT}`),
  imageLogoGSPS = await loadImage(`../${import.meta.env.VITE_LOGO_FIRST}`),
  imageLogoFoundation = await loadImage(`../${import.meta.env.VITE_LOGO_SECOND}`),
  redrawThumbnail = function () {
    // TODO: add a check to see if the canvas is already loaded
    if (mainCanvas.value === null) {
      console.error('canvas not found,doing ugly retry in 0.1s')
      setTimeout(redrawThumbnail, 100)
      return
    }
    const ctx = mainCanvas.value.getContext('2d')!,
      runnerPosition = 208 + 101,
      titleLength = ctx.measureText(title.value).width,
      subtitleLength = ctx.measureText(subtitle.value).width,
      titlesDiff = Math.abs(titleLength - subtitleLength),
      titleMiddle = canvasWidth.value / 2,
      fullTitle = `${title.value} ${subtitle.value}`

    ctx.drawImage(imageGradient, 0, 0)

    drawBackground(ctx, backgroundImage.value, photoScale.value, photoLeft.value, photoTop.value)

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
    renderShadowText(ctx, runner.value, canvasWidth.value / 2, runnerPosition, canvasWidth.value)

    // Fdbc16
    let titleFontSize = 340

    ctx.font = `normal normal 600 ${titleFontSize.toString()}px Saira Condensed`

    // Make it fit around the same size as in GIMP
    while (ctx.measureText(fullTitle).width > 1374) {
      titleFontSize -= 1
      ctx.font = `normal normal 600 ${titleFontSize.toString()}px Saira Condensed`
    }

    const titleHeight = 442 + titleFontSize / 2

    let titlePosition = titleMiddle - titleLength / 2 + titlesDiff / 2,
      subtitlePosition = titleMiddle + subtitleLength / 2 + titlesDiff / 2

    if (titleLength < subtitleLength) {
      titlePosition = titleMiddle - titleLength / 2 - titlesDiff / 2
      subtitlePosition = titleMiddle + subtitleLength / 2 - titlesDiff / 2
    }

    // Ctx.font = 'normal normal 600 113px Barlow Condensed'
    renderShadowText(ctx, `${title.value} `, titlePosition, titleHeight, canvasWidth.value)

    if (subtitle.value) {
      // // podtytuł 90 semi-bld
      ctx.fillStyle = '#ffbd16'
      renderShadowText(ctx, subtitle.value, subtitlePosition, titleHeight, canvasWidth.value)
    }

    // Kategoria 42 light
    ctx.lineWidth = 5
    ctx.fillStyle = 'white'
    ctx.font = 'normal normal 300 42px Barlow Condensed'
    renderShadowText(ctx, category.value, canvasWidth.value / 2, 887 + 42, canvasWidth.value)

    if (money.value > 0) {
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
        `${money.value.toLocaleString('pl-PL')} PLN`,
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
  photoScale.value = Math.round(scaleX * 100) / 100
  redrawThumbnail()
}

imageGradient.onload = redrawThumbnail
imageLogoGSPS.onload = redrawThumbnail
imageLogoFoundation.onload = redrawThumbnail
imageBanner.onload = redrawThumbnail

watch(photo, (newPhoto: string) => {
  photoLeft.value = 0
  photoTop.value = 0
  photoScale.value = 1.0
  photoRotation.value = 0
  photoLoaded.value = false

  backgroundImage.value.src = newPhoto
})
document.fonts.onloadingdone = redrawThumbnail
watch(runner, redrawThumbnail)
watch(title, redrawThumbnail)
watch(subtitle, redrawThumbnail)
watch(category, redrawThumbnail)
watch(photoLeft, redrawThumbnail)
watch(photoTop, redrawThumbnail)
watch(money, redrawThumbnail)

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
watch(photoScale, redrawThumbnail)

if (routeQuery.runner && typeof routeQuery.runner === 'string') {
  initialRunner.value = routeQuery.runner
}
if (routeQuery.title && typeof routeQuery.title === 'string') {
  initialTitle.value = routeQuery.title
}
if (routeQuery.subtitle && typeof routeQuery.subtitle === 'string') {
  initialSubtitle.value = routeQuery.subtitle
}
if (routeQuery.category && typeof routeQuery.category === 'string') {
  initialCategory.value = routeQuery.category
}

if (routeQuery.money && typeof routeQuery.money === 'string') {
  initialMoney.value = Number(routeQuery.money)
}

onMounted(() => {
  redrawThumbnail()
})
</script>

<template>
  <div class="main">
    <h1>Miniaturka runnera na Twittera</h1>
    <CanvasItem
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeight"
      :title="getFullTitle(title, subtitle)"
      @canvasContext="(can) => (mainCanvas = can)"
      @updateBackground="(b) => (photo = b)"
      @updateScale="
        (s) => {
          photoScale += s
          photoScale = Math.max(photoScale, 0.01)
        }
      "
      @updatePos="
        (l, t) => {
          photoLeft += l
          photoTop += t
        }
      "
      @updateRotation="(r) => (photoRotation = (photoRotation + r) % 360)"
    />
    <RunnerItem
      @updateBackground="(b) => (photo = b)"
      @updateRunner="(r) => (runner = r)"
      @updateTitle="(t) => (title = t)"
      @updateSubtitle="(s) => (subtitle = s)"
      @updateCategory="(c) => (category = c)"
      @updateMoney="(m) => (money = m)"
      :runner="initialRunner"
      :title="initialTitle"
      :subtitle="initialSubtitle"
      :category="initialCategory"
      :enable-money="true"
      :money="initialMoney"
    />
  </div>
</template>

<!-- <style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style> -->
