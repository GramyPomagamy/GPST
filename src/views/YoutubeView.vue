<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import InputItem from '../components/InputItem.vue'
import { useRoute } from 'vue-router'

import { loadImage } from '../utils/loadImage'
import { renderShadowText } from '@/utils/renderText'
import { getFullTitle, drawBackground } from '@/utils/misc'

const routeQuery = useRoute().query,
  canvasWidth = ref(1280),
  canvasHeight = ref(720),
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
  time = ref(''),
  initialRunner = ref(''),
  initialTitle = ref(''),
  initialSubtitle = ref(''),
  initialCategory = ref(''),
  initialTime = ref(''),
  imageBanner = await loadImage(`${import.meta.env.VITE_IMAGES_BANNER_YOUTUBE}`),
  imageGradient = await loadImage(`${import.meta.env.VITE_IMAGES_GRADIENT}`),
  imageLogoGSPS = await loadImage(`${import.meta.env.VITE_LOGO_FIRST}`),
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

    ctx.drawImage(imageGradient, 0, 0)

    drawBackground(ctx, backgroundImage.value, photoScale.value, photoLeft.value, photoTop.value)

    ctx.globalAlpha = 0.12
    ctx.drawImage(imageGradient, 0, 0)
    ctx.globalAlpha = 1
    ctx.drawImage(imageBanner, 0, 0)

    ctx.imageSmoothingQuality = 'high'
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(imageLogoGSPS, 0, 570, 404, 404 * (imageLogoGSPS.height / imageLogoGSPS.width))

    ctx.fillStyle = '#e1e1e1'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 8
    ctx.font = 'normal normal 700 99px PT Sans Narrow'
    ctx.textAlign = 'right'

    let titlePosition = 31,
      titleSize = 150
    if (subtitle.value) {
      titlePosition = 0
      titleSize = 114
    }

    // Runner 83 PT Sans Narrow Bold Condensed
    ctx.font = 'normal normal 700 70px PT Sans Narrow'
    renderShadowText(ctx, runner.value, rightSide, runnerPosition + 70, canvasWidth.value)

    // Title,  PT Sans Narrow Bold Condensed
    ctx.font = `normal normal 700 ${titleSize.toString()}px PT Sans Narrow`
    renderShadowText(ctx, title.value, rightSide, titlePosition + titleSize, canvasWidth.value)

    if (subtitle.value) {
      // Podtytuł 77 PT Sans Narrow Bold Condensed
      ctx.font = 'normal normal 700 77px PT Sans Narrow'
      renderShadowText(ctx, subtitle.value, rightSide, subtitlePosition + 77, canvasWidth.value)
    }

    // Kategoria 62 Saira Condensed, Semi-Bold Condensed
    ctx.font = 'normal normal 600 62px Saira Condensed'
    renderShadowText(ctx, category.value, rightSide, categoryPosition + 62, canvasWidth.value)

    // Time 158 Saira Condensed, Ultra-Bold Condensed
    ctx.font = 'normal normal 800 158px Saira Condensed'
    ctx.fillStyle = '#ffbd16'
    ctx.strokeText(time.value, rightSide, timePosition + 158, canvasWidth.value)
    ctx.fillText(time.value, rightSide, timePosition + 158, canvasWidth.value)
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
watch(time, redrawThumbnail)

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

if (routeQuery.time && typeof routeQuery.time === 'string') {
  initialTime.value = routeQuery.time
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
    <InputItem
      @updateBackground="(b) => (photo = b)"
      @updateRunner="(r) => (runner = r)"
      @updateTitle="(t) => (title = t)"
      @updateSubtitle="(s) => (subtitle = s)"
      @updateCategory="(c) => (category = c)"
      @updateTime="(t) => (time = t)"
      :runner="initialRunner"
      :title="initialTitle"
      :subtitle="initialSubtitle"
      :category="initialCategory"
      :enable-time="true"
      :time="initialTime"
      :canvasModel="mainCanvas"
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
