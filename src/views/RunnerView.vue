<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import RunnerItem from '../components/RunnerItem.vue'

import imageBannerData from '../assets/banner.png'
import imageGradientData from '../assets/gradient.png'
import imageLogoGSPSData from '../assets/logo_gsps/dzieciom2024.png'
import imageLogoFoundationData from '../assets/logo_fundacja/na_ratunek.png'

const canvasWidth = ref(1500)
const canvasHeight = ref(1000)
const backgroundImage: Ref<HTMLImageElement> = ref(new Image())

const mainCanvas: Ref<HTMLCanvasElement | null> = ref(null)
const photo = ref('')
const photoScale = ref(1.0)
const photoLeft = ref(0)
const photoTop = ref(0)
const photoRotation = ref(0)

const runner = ref('')
const title = ref('')
const subtitle = ref('')
const category = ref('')

var imageBanner = new Image()
imageBanner.onload = () => redrawThumbnail()
imageBanner.src = imageBannerData

var imageGradient = new Image()
imageGradient.onload = () => redrawThumbnail()
imageGradient.src = imageGradientData

var imageLogoGSPS = new Image()
imageLogoGSPS.onload = () => redrawThumbnail()
imageLogoGSPS.src = imageLogoGSPSData

var imageLogoFoundation = new Image()
imageLogoFoundation.onload = () => redrawThumbnail()
imageLogoFoundation.src = imageLogoFoundationData

function redrawThumbnail() {
  const ctx = mainCanvas.value?.getContext('2d')!
  // ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  // ctx.fillStyle = 'rgb(54,25,127)'
  // ctx.rect(0, 0, canvasWidth.value, canvasHeight.value)
  // ctx.fill()
  ctx.drawImage(imageGradient, 0, 0)

  // TODO enhance image drawing
  ctx.save()
  ctx.translate(canvasWidth.value / 2, canvasHeight.value / 2)
  ctx.rotate((photoRotation.value * Math.PI) / 180)

  let posX = photoLeft.value
  let posY = photoTop.value
  if (photoRotation.value == 90) {
    posX = photoTop.value
    posY = -photoLeft.value
  } else if (photoRotation.value == 180) {
    posX = -photoLeft.value
    posY = -photoTop.value
  } else if (photoRotation.value == 270) {
    posX = -photoTop.value
    posY = photoLeft.value
  }
  ctx.drawImage(
    backgroundImage.value,
    (-backgroundImage.value.width * photoScale.value) / 2 + posX,
    (-backgroundImage.value.height * photoScale.value) / 2 + posY,
    backgroundImage.value.width * photoScale.value,
    backgroundImage.value.height * photoScale.value
  )
  ctx.restore()

  ctx.globalAlpha = 0.12
  ctx.drawImage(imageGradient, 0, 0)
  ctx.globalAlpha = 1
  ctx.drawImage(imageBanner, 0, 0)

  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 8
  ctx.font = 'normal normal 500 99px Barlow Condensed'
  ctx.textAlign = 'center'
  let jzc = 'Już za chwilę...'
  // 1500 - ((1500 - 912) / 2)
  ctx.strokeText(jzc, 1206, 99, canvasWidth.value - 912)
  ctx.fillText(jzc, 1206, 99, canvasWidth.value - 912)

  var runnerPosition = 648 + 83
  var titlePosition = 740 + 113
  if (subtitle.value) {
    runnerPosition = 587 + 83
    titlePosition = 668 + 113
  }

  // runner 83medium
  ctx.font = 'normal normal 500 83px Barlow Condensed'
  ctx.strokeText(runner.value, canvasWidth.value / 2, runnerPosition, canvasWidth.value)
  ctx.fillText(runner.value, canvasWidth.value / 2, runnerPosition, canvasWidth.value)

  // title, 113 semi-bold
  ctx.font = 'normal normal 600 113px Barlow Condensed'
  ctx.strokeText(title.value, canvasWidth.value / 2, titlePosition, canvasWidth.value)
  ctx.fillText(title.value, canvasWidth.value / 2, titlePosition, canvasWidth.value)

  if (subtitle.value) {
    // podtytuł 90 semi-bld
    ctx.font = 'normal normal 600 90px Barlow Condensed'

    ctx.strokeText(subtitle.value, canvasWidth.value / 2, 786 + 90, canvasWidth.value)
    ctx.fillText(subtitle.value, canvasWidth.value / 2, 786 + 90, canvasWidth.value)
  }

  // kategoria 42 light
  ctx.lineWidth = 5
  ctx.font = 'normal normal 300 42px Barlow Condensed'
  ctx.strokeText(category.value, canvasWidth.value / 2, 887 + 42, canvasWidth.value)
  ctx.fillText(category.value, canvasWidth.value / 2, 887 + 42, canvasWidth.value)

  ctx.drawImage(imageLogoGSPS, 16, 17)

  ctx.drawImage(imageLogoFoundation, 6, 734)
}

function getFullTitle(): string {
  if (!title.value && !subtitle.value) {
    return 'Stunt GP'
  }

  var fullTitle = title.value
  if (subtitle.value) {
    fullTitle += ' ' + subtitle.value
  }
  return fullTitle
}

watch(photo, (photo: string) => {
  photoLeft.value = 0
  photoTop.value = 0
  photoScale.value = 1.0
  photoRotation.value = 0

  backgroundImage.value.src = photo
  backgroundImage.value.onload = () => {
    redrawThumbnail()
  }
})
document.fonts.onloadingdone = redrawThumbnail
watch(runner, redrawThumbnail)
watch(title, redrawThumbnail)
watch(subtitle, redrawThumbnail)
watch(category, redrawThumbnail)
watch(photoLeft, redrawThumbnail)
watch(photoTop, redrawThumbnail)
watch(photoRotation, redrawThumbnail)
watch(photoScale, redrawThumbnail)

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
