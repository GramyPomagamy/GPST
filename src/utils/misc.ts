import { FabricImage, filters } from 'fabric'

const getFullTitle = function (title: string, ...subtitle: string[]): string {
    if (
      title.length === 0 &&
      subtitle.every((e) => {
        return e.length === 0
      })
    ) {
      return 'Stunt GP'
    }

    let fullTitle = title
    for (const subtitlePart of subtitle) {
      if (subtitlePart) {
        fullTitle += ` ${subtitlePart}`
      }
    }
    return fullTitle
  },
  newLanczos = function (image: FabricImage): filters.Resize {
    const scale = image.scaleX
    return new filters.Resize({
      scaleX: scale,
      scaleY: scale,
      resizeType: 'lanczos',
      lanczosLobes: 3
    })
  }

export { getFullTitle, newLanczos }
