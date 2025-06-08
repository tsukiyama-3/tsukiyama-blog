import { TextureLoader } from 'three'

export const useEarthTexture = () => {
  const loader = new TextureLoader()
  const texture = loader.load('/img/earth_texture.jpg')

  return { texture }
}
