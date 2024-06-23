<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import RunnerItem from '../components/RunnerItem.vue'
import { useRoute } from 'vue-router'

import { loadImage } from '../utils/loadImage'
import { renderShadowText } from '@/utils/renderText'

const route = useRoute(),
  canvasWidth = ref(1500),
  canvasHeight = ref(1000),
  backgroundImage: Ref<HTMLImageElement> = ref(new Image())
backgroundImage.value.onload = () => {
  photoLoaded.value = true
  // Set default scale to fill the image
  let scaleX = canvasWidth.value / backgroundImage.value.width,
    scaleY = canvasHeight.value / backgroundImage.value.height
  if (scaleX < scaleY) {
    scaleX = scaleY
  }
  photoScale.value = Math.round(scaleX * 100) / 100
  redrawThumbnail()
}

const mainCanvas: Ref<HTMLCanvasElement | null> = ref(null),
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
  imageBanner = await loadImage(
    new URL(`../${import.meta.env.VITE_IMAGES_BANNER_RUNNER}`, import.meta.url),
    redrawThumbnail
  ),
  // ImageBanner.src = imageBannerData

  imageGradient = await loadImage(
    new URL(`../${import.meta.env.VITE_IMAGES_GRADIENT}`, import.meta.url),
    redrawThumbnail
  ),
  imageLogoGSPS = await loadImage(
    new URL(`../${import.meta.env.VITE_LOGO_FIRST}`, import.meta.url),
    redrawThumbnail
  ),
  imageLogoFoundation = await loadImage(
    new URL(`../${import.meta.env.VITE_LOGO_SECOND}`, import.meta.url),
    redrawThumbnail
  )

function redrawThumbnail() {
  // TODO: add a check to see if the canvas is already loaded
  if (mainCanvas.value === null) {
    console.error('canvas not found,doing ugly retry in 0.1s')
    setTimeout(redrawThumbnail, 100)
    return
  }
  const ctx = mainCanvas.value.getContext('2d')!
  /*
   * Ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
   * ctx.fillStyle = 'rgb(54,25,127)'
   * ctx.rect(0, 0, canvasWidth.value, canvasHeight.value)
   * ctx.fill()
   */
  ctx.drawImage(imageGradient, 0, 0)

  ctx.drawImage(
    backgroundImage.value,
    canvasWidth.value / 2 - (backgroundImage.value.width / 2) * photoScale.value + photoLeft.value,
    canvasHeight.value / 2 - (backgroundImage.value.height / 2) * photoScale.value + photoTop.value,
    backgroundImage.value.width * photoScale.value,
    backgroundImage.value.height * photoScale.value
  )

  ctx.globalAlpha = 0.12
  ctx.drawImage(imageGradient, 0, 0)
  ctx.globalAlpha = 1
  ctx.drawImage(imageBanner, 0, 0)

  ctx.imageSmoothingQuality = 'high'
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(imageLogoGSPS, 16, 15, 316, 316 * (imageLogoGSPS.height / imageLogoGSPS.width))

  ctx.drawImage(
    imageLogoFoundation,
    320,
    0,
    323,
    323 * (imageLogoFoundation.height / imageLogoFoundation.width)
  )

  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 8
  ctx.font = 'normal normal 500 99px Barlow Condensed'
  ctx.textAlign = 'center'
  const jzc = 'Już za chwilę...'
  // 1500 - ((1500 - 912) / 2)
  renderShadowText(ctx, jzc, 1206, 99, canvasWidth.value - 912)

  let runnerPosition = 648 + 83,
    titlePosition = 740 + 113
  if (subtitle.value) {
    runnerPosition = 587 + 83
    titlePosition = 668 + 113
  }

  // Runner 83medium
  ctx.font = 'normal normal 500 83px Barlow Condensed'
  renderShadowText(ctx, runner.value, canvasWidth.value / 2, runnerPosition, canvasWidth.value)

  // Title, 113 semi-bold
  ctx.font = 'normal normal 600 113px Barlow Condensed'
  renderShadowText(ctx, title.value, canvasWidth.value / 2, titlePosition, canvasWidth.value)

  if (subtitle.value) {
    // Podtytuł 90 semi-bld
    ctx.font = 'normal normal 600 90px Barlow Condensed'

    renderShadowText(ctx, subtitle.value, canvasWidth.value / 2, 786 + 90, canvasWidth.value)
  }

  // Kategoria 42 light
  ctx.lineWidth = 5
  ctx.font = 'normal normal 300 42px Barlow Condensed'
  renderShadowText(ctx, category.value, canvasWidth.value / 2, 887 + 42, canvasWidth.value)

  if (money.value > 0) {
    // We collected 24 bold
    const weCollected = 'zebraliśmy już'
    ctx.lineWidth = 5
    ctx.font = 'normal normal 600 24px Saira Condensed'
    renderShadowText(ctx, weCollected, 175, 170, canvasWidth.value)

    const moneyText = `${money.value.toLocaleString('pl-PL')} PLN`
    // Money 42 ultra bold
    ctx.lineWidth = 5
    ctx.font = 'normal normal 800 77px Saira Condensed'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffbd16'
    ctx.strokeText(moneyText, (368 - 16) / 2, 242, canvasWidth.value)
    ctx.fillText(moneyText, (368 - 16) / 2, 242, canvasWidth.value)
  }
}

function getFullTitle(): string {
  if (!title.value && !subtitle.value) {
    return 'Stunt GP'
  }

  let fullTitle = title.value
  if (subtitle.value) {
    fullTitle += ` ${subtitle.value}`
  }
  return fullTitle
}

watch(photo, (photo: string) => {
  photoLeft.value = 0
  photoTop.value = 0
  photoScale.value = 1.0
  photoRotation.value = 0
  photoLoaded.value = false

  backgroundImage.value.src = photo
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

  const tmpCanvas = document.createElement('canvas')
  tmpCanvas.width = backgroundImage.value.height
  tmpCanvas.height = backgroundImage.value.width
  // The image is on its side
  const ctx = tmpCanvas.getContext('2d')!
  ctx.translate(tmpCanvas.width / 2, tmpCanvas.height / 2)
  ctx.rotate((90 * Math.PI) / 180)

  ctx.drawImage(backgroundImage.value, -tmpCanvas.height / 2, -tmpCanvas.width / 2)

  const data = tmpCanvas.toDataURL('image/png')
  photoLoaded.value = false
  backgroundImage.value.src = data
})
watch(photoScale, redrawThumbnail)

if (route.query.runner && typeof route.query.runner === 'string') {
  initialRunner.value = route.query.runner
}
if (route.query.title && typeof route.query.title === 'string') {
  initialTitle.value = route.query.title
}
if (route.query.subtitle && typeof route.query.subtitle === 'string') {
  initialSubtitle.value = route.query.subtitle
}
if (route.query.category && typeof route.query.category === 'string') {
  initialCategory.value = route.query.category
}

if (route.query.money && typeof route.query.money === 'string') {
  initialMoney.value = Number(route.query.money)
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
      :title="getFullTitle()"
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
