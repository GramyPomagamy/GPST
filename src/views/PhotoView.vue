<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import CanvasItem from '../components/CanvasItem.vue'
import RunnerItem from '../components/RunnerItem.vue'
import { useRoute } from 'vue-router'

import { loadImage } from '../utils/loadImage'

const route = useRoute()
const canvasWidth = ref(1500)
const canvasHeight = ref(1000)
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
const money = ref(0)

const initialRunner = ref('')
const initialTitle = ref('')
const initialSubtitle = ref('')
const initialCategory = ref('')
const initialMoney = ref(0)

var imageBanner = await loadImage(
  new URL('../' + import.meta.env.VITE_IMAGES_BANNER_MILESTONE, import.meta.url),
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

  // runner 83medium
  let runnerPosition = 208 + 101
  ctx.font = 'normal normal 600 101px Saira Condensed'
  ctx.strokeText(runner.value, canvasWidth.value / 2, runnerPosition, canvasWidth.value)
  ctx.fillText(runner.value, canvasWidth.value / 2, runnerPosition, canvasWidth.value)

  // fdbc16
  let titleFontSize = 340
  let fullTitle = title.value + ' ' + subtitle.value
  ctx.font = 'normal normal 600 ' + titleFontSize.toString() + 'px Saira Condensed'

  // make it fit around the same size as in GIMP
  while (ctx.measureText(fullTitle).width > 1374) {
    titleFontSize -= 1
    ctx.font = 'normal normal 600 ' + titleFontSize.toString() + 'px Saira Condensed'
  }

  let titleLength = ctx.measureText(title.value).width
  let subtitleLength = ctx.measureText(subtitle.value).width

  let titlesDiff = Math.abs(titleLength - subtitleLength)
  let titleMiddle = canvasWidth.value / 2

  let titlePosition = titleMiddle - titleLength / 2 + titlesDiff / 2
  let subtitlePosition = titleMiddle + subtitleLength / 2 + titlesDiff / 2

  if (titleLength < subtitleLength) {
    titlePosition = titleMiddle - titleLength / 2 - titlesDiff / 2
    subtitlePosition = titleMiddle + subtitleLength / 2 - titlesDiff / 2
  }

  let titleHeight = 442 + titleFontSize / 2

  // title
  //var titlePosition = 100

  // ctx.font = 'normal normal 600 113px Barlow Condensed'
  ctx.strokeText(title.value + ' ', titlePosition, titleHeight, canvasWidth.value)
  ctx.fillText(title.value + ' ', titlePosition, titleHeight, canvasWidth.value)

  if (subtitle.value) {
    // // podtytuł 90 semi-bld
    // ctx.font = 'normal normal 600 90px Barlow Condensed'
    ctx.fillStyle = '#ffbd16'

    ctx.strokeText(subtitle.value, subtitlePosition, titleHeight, canvasWidth.value)
    ctx.fillText(subtitle.value, subtitlePosition, titleHeight, canvasWidth.value)
  }

  // kategoria 42 light
  ctx.lineWidth = 5
  ctx.font = 'normal normal 300 42px Barlow Condensed'
  ctx.strokeText(category.value, canvasWidth.value / 2, 887 + 42, canvasWidth.value)
  ctx.fillText(category.value, canvasWidth.value / 2, 887 + 42, canvasWidth.value)

  if (money.value > 0) {
    // we collected 24 bold
    let weCollected = 'zebraliśmy już'
    ctx.lineWidth = 5
    ctx.font = 'normal normal 600 24px Saira Condensed'
    ctx.fillStyle = 'white'
    ctx.strokeText(weCollected, 203, 185 + 24 + 5, canvasWidth.value)
    ctx.fillText(weCollected, 203, 185 + 24 + 5, canvasWidth.value)

    let moneyText = money.value.toLocaleString('pl-PL') + ' PLN'
    // money 42 ultra bold
    ctx.lineWidth = 5
    ctx.font = 'normal normal 800 77px Saira Condensed'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffbd16'
    ctx.strokeText(moneyText, 160 + 43, 200 + 77 + 10, canvasWidth.value)
    ctx.fillText(moneyText, 160 + 43, 200 + 77 + 10, canvasWidth.value)
  }
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
watch(money, redrawThumbnail)

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
