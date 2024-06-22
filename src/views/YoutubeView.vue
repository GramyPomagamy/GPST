<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import RunnerItem from '../components/RunnerItem.vue'
import { useRoute } from 'vue-router'

import { loadImage } from '../utils/loadImage'

const route = useRoute()
const canvasWidth = ref(1280)
const canvasHeight = ref(720)
const backgroundImage: Ref<HTMLImageElement> = ref(new Image())
backgroundImage.value.onload = () => {
  photoLoaded.value = true
  // set default scale to fill the image
  let scaleX = canvasWidth.value / backgroundImage.value.width
  let scaleY = canvasHeight.value / backgroundImage.value.height
  if (scaleX < scaleY) {
    scaleX = scaleY
  }
  photoScale.value = Math.round(scaleX * 100) / 100
  redrawThumbnail()
}

const mainCanvas: Ref<HTMLCanvasElement | null> = ref(null)
const photo = ref('')
const photoScale = ref(1.0)
const photoLeft = ref(0)
const photoTop = ref(0)
const photoRotation = ref(0)
const photoLoaded = ref(false)

const runner = ref('')
const title = ref('')
const subtitle = ref('')
const category = ref('')
const time = ref('')

const initialRunner = ref('')
const initialTitle = ref('')
const initialSubtitle = ref('')
const initialCategory = ref('')
const initialTime = ref('')

var imageBanner = await loadImage(
  new URL('../' + import.meta.env.VITE_IMAGES_BANNER_YOUTUBE, import.meta.url),
  redrawThumbnail
)

// imageBanner.src = imageBannerData

var imageGradient = await loadImage(
  new URL('../' + import.meta.env.VITE_IMAGES_GRADIENT, import.meta.url),
  redrawThumbnail
)

var imageLogoGSPS = await loadImage(
  new URL('../' + import.meta.env.VITE_LOGO_FIRST, import.meta.url),
  redrawThumbnail
)

var imageLogoFoundation = await loadImage(
  new URL('../' + import.meta.env.VITE_LOGO_SECOND, import.meta.url),
  redrawThumbnail
)

function redrawThumbnail() {
  // TODO: add a check to see if the canvas is already loaded
  if (mainCanvas.value == null) {
    console.error('canvas not found,doing ugly retry in 0.1s')
    setTimeout(redrawThumbnail, 100)
    return
  }
  const ctx = mainCanvas.value.getContext('2d')!
  // ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  // ctx.fillStyle = 'rgb(54,25,127)'
  // ctx.rect(0, 0, canvasWidth.value, canvasHeight.value)
  // ctx.fill()
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

  ctx.fillStyle = '#e1e1e1'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 8
  ctx.font = 'normal normal 700 99px PT Sans Narrow'
  ctx.textAlign = 'right'

  let runnerPosition = 456
  let timePosition = 285
  let categoryPosition = 241
  let titlePosition = 31
  let subtitlePosition = 130
  let titleSize = 150
  if (subtitle.value) {
    titlePosition = 0
    titleSize = 114
  }

  let rightSide = canvasWidth.value - 3

  // runner 83 PT Sans Narrow Bold Condensed
  ctx.font = 'normal normal 700 70px PT Sans Narrow'
  ctx.strokeText(runner.value, rightSide, runnerPosition + 70, canvasWidth.value)
  ctx.fillText(runner.value, rightSide, runnerPosition + 70, canvasWidth.value)

  // title,  PT Sans Narrow Bold Condensed
  ctx.font = 'normal normal 700 ' + titleSize.toString() + 'px PT Sans Narrow'
  ctx.strokeText(title.value, rightSide, titlePosition + titleSize, canvasWidth.value)
  ctx.fillText(title.value, rightSide, titlePosition + titleSize, canvasWidth.value)

  if (subtitle.value) {
    // podtytuł 77 PT Sans Narrow Bold Condensed
    ctx.font = 'normal normal 700 77px PT Sans Narrow'

    ctx.strokeText(subtitle.value, rightSide, subtitlePosition + 77, canvasWidth.value)
    ctx.fillText(subtitle.value, rightSide, subtitlePosition + 77, canvasWidth.value)
  }

  // kategoria 62 Saira Condensed, Semi-Bold Condensed
  ctx.font = 'normal normal 600 62px Saira Condensed'
  ctx.strokeText(category.value, rightSide, categoryPosition + 62, canvasWidth.value)
  ctx.fillText(category.value, rightSide, categoryPosition + 62, canvasWidth.value)

  ctx.drawImage(imageLogoGSPS, 16, 17)

  ctx.drawImage(imageLogoFoundation, 16, 734 - 17)

  // time 158 Saira Condensed, Ultra-Bold Condensed
  ctx.font = 'normal normal 800 158px Saira Condensed'
  ctx.fillStyle = '#ffbd16'
  ctx.strokeText(time.value, rightSide, timePosition + 158, canvasWidth.value)
  ctx.fillText(time.value, rightSide, timePosition + 158, canvasWidth.value)
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
watch(time, redrawThumbnail)

// rotate image once before using it
watch(photoRotation, async () => {
  // skip on image load
  if (photoLoaded.value === false) {
    return
  }

  let tmpCanvas = document.createElement('canvas')
  tmpCanvas.width = backgroundImage.value.height
  tmpCanvas.height = backgroundImage.value.width
  // the image is on its side
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

if (route.query.time && typeof route.query.time === 'string') {
  initialTime.value = route.query.time
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
      @updateTime="(t) => (time = t)"
      :runner="initialRunner"
      :title="initialTitle"
      :subtitle="initialSubtitle"
      :category="initialCategory"
      :enable-time="true"
      :time="initialTime"
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
