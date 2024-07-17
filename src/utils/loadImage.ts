export const loadImage = function (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = reject
    image.src = new URL(url, import.meta.url + import.meta.env.BASE_URL).href
    resolve(image)
  })
}
