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
  drawBackground = function (
    ctx: CanvasRenderingContext2D,
    backgroundImage: HTMLImageElement,
    scale: number,
    left: number,
    top: number
  ): void {
    const halfWidth = ctx.canvas.width / 2,
      halfHeight = ctx.canvas.height / 2,
      imageWidth = backgroundImage.width,
      imageHeight = backgroundImage.height
    ctx.drawImage(
      backgroundImage,
      halfWidth - (imageWidth / 2) * scale + left,
      halfHeight - (imageHeight / 2) * scale + top,
      imageWidth * scale,
      imageHeight * scale
    )
  }

export { getFullTitle, drawBackground }
