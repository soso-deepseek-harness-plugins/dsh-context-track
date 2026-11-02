/** Panel width, not the browser window, picks the arrangement. */
export const WIDE_MIN_PX = 720

export function layoutForWidth(width: number): 'wide' | 'narrow' {
  return width >= WIDE_MIN_PX ? 'wide' : 'narrow'
}
