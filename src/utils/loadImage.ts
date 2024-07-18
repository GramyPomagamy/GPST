export const loadImage = function (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = reject
    console.log('based', window.location.origin, import.meta.env.BASE_URL, url)
    image.src = new URL(url, window.location.origin + import.meta.env.BASE_URL).href
    resolve(image)
  })
}
