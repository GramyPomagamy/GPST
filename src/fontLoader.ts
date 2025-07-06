const fontURLs = {
  BarlowCondensed:
    'url(https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;500;600&display=swap)',
  SairaCondensed:
    'url(https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700;800&display=swap)',
  PTSansNarrow: 'url(https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@700&display=swap)'
}

const fontBarlowCondensedLight = new FontFace('Barlow Condensed', fontURLs.BarlowCondensed, {
  style: 'normal',
  weight: '300'
})

const fontBarlowCondensedMedium = new FontFace('Barlow Condensed', fontURLs.BarlowCondensed, {
  style: 'normal',
  weight: '500'
})

const fontBarlowCondensedSemibold = new FontFace('Barlow Condensed', fontURLs.BarlowCondensed, {
  style: 'normal',
  weight: '600'
})

const fontSairaCondensedSemibold = new FontFace('Saira Condensed', fontURLs.SairaCondensed, {
  style: 'normal',
  weight: '600'
})

const fontSairaCondensedBold = new FontFace('Saira Condensed', fontURLs.SairaCondensed, {
  style: 'normal',
  weight: '700'
})

const fontSairaCondensedExtrabold = new FontFace('Saira Condensed', fontURLs.SairaCondensed, {
  style: 'normal',
  weight: '800'
})

const fontPTSansNarrowBold = new FontFace('Saira Condensed', fontURLs.SairaCondensed, {
  style: 'normal',
  weight: '700'
})

export const fonts = {
  install() {
    Promise.all([
      fontBarlowCondensedLight.load(),
      fontBarlowCondensedMedium.load(),
      fontBarlowCondensedSemibold.load(),
      fontSairaCondensedSemibold.load(),
      fontSairaCondensedBold.load(),
      fontSairaCondensedExtrabold.load(),
      fontPTSansNarrowBold.load()
    ]).then(() => {
      document.fonts.add(fontBarlowCondensedLight)
      document.fonts.add(fontBarlowCondensedMedium)
      document.fonts.add(fontBarlowCondensedSemibold)
      document.fonts.add(fontSairaCondensedSemibold)
      document.fonts.add(fontSairaCondensedBold)
      document.fonts.add(fontSairaCondensedExtrabold)
      document.fonts.add(fontPTSansNarrowBold)
    })
  }
}
