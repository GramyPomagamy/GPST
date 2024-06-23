export function renderShadowText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth?: number
) {
  ctx.strokeText(text, x, y, maxWidth)
  ctx.fillText(text, x, y, maxWidth)
}
