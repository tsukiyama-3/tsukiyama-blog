import { WebGLRenderer } from 'three'

type Option = {
  color: number
  alpha: number
  width: number
  height: number
}

export const useRenderer = (option: Partial<Option> = {}) => {
  const mergedOption: Option = {
    color: 0x000000,
    alpha: 0,
    width: 1168,
    height: 657,
    ...option,
  }

  const renderer = new WebGLRenderer()

  renderer.setClearColor(mergedOption.color, mergedOption.alpha)
  renderer.setSize(mergedOption.width, mergedOption.height)

  return { renderer }
}
