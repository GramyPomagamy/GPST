const fontURLs = {
  BarlowCondensed300: 'url(fonts/barlow-condensed-v12-latin_latin-ext-300.woff2)',
  BarlowCondensed500: 'url(fonts/barlow-condensed-v12-latin_latin-ext-500.woff2)',
  BarlowCondensed600: 'url(fonts/barlow-condensed-v12-latin_latin-ext-600.woff2)',
  SairaCondensed600: 'url(fonts/saira-condensed-v11-latin_latin-ext-600.woff2)',
  SairaCondensed700: 'url(fonts/saira-condensed-v11-latin_latin-ext-700.woff2)',
  SairaCondensed800: 'url(fonts/saira-condensed-v11-latin_latin-ext-800.woff2)',
  PTSansNarrow700: 'url(fonts/pt-sans-narrow-v18-latin_latin-ext-700.woff2)'
}

const fontBarlowCondensedLight = new FontFace('Barlow Condensed', fontURLs.BarlowCondensed300, {
  style: 'normal',
  weight: '300'
})

const fontBarlowCondensedMedium = new FontFace('Barlow Condensed', fontURLs.BarlowCondensed500, {
  style: 'normal',
  weight: '500'
})

const fontBarlowCondensedSemibold = new FontFace('Barlow Condensed', fontURLs.BarlowCondensed600, {
  style: 'normal',
  weight: '600'
})

const fontSairaCondensedSemibold = new FontFace('Saira Condensed', fontURLs.SairaCondensed600, {
  style: 'normal',
  weight: '600'
})

const fontSairaCondensedBold = new FontFace('Saira Condensed', fontURLs.SairaCondensed700, {
  style: 'normal',
  weight: '700'
})

const fontSairaCondensedExtrabold = new FontFace('Saira Condensed', fontURLs.SairaCondensed800, {
  style: 'normal',
  weight: '800'
})

const fontPTSansNarrowBold = new FontFace('Saira Condensed', fontURLs.PTSansNarrow700, {
  style: 'normal',
  weight: '700'
})

export const fonts = {
  async install() {
    await Promise.all([
      fontBarlowCondensedLight.load(),
      fontBarlowCondensedMedium.load(),
      fontBarlowCondensedSemibold.load(),
      fontSairaCondensedSemibold.load(),
      fontSairaCondensedBold.load(),
      fontSairaCondensedExtrabold.load(),
      fontPTSansNarrowBold.load()
    ])

    document.fonts.add(fontBarlowCondensedLight)
    document.fonts.add(fontBarlowCondensedMedium)
    document.fonts.add(fontBarlowCondensedSemibold)
    document.fonts.add(fontSairaCondensedSemibold)
    document.fonts.add(fontSairaCondensedBold)
    document.fonts.add(fontSairaCondensedExtrabold)
    document.fonts.add(fontPTSansNarrowBold)
  }
}
