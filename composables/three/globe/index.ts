import { createApp, h } from 'vue'
import { Color, type MeshPhongMaterial } from 'three'
import countries from '~/public/json/globe-data-min.json'
import GlobeAvatar from '~/components/globe/GlobeAvatar.vue'

export const useGlobe = async () => {
  if (!import.meta.client) {
    return { globe: undefined }
  }

  const { default: ThreeGlobe } = await import('three-globe')

  const gData = [
    {
      lat: 35.6895,
      lng: 139.6917,
    },
  ]

  const globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  }).hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.3)
    .showAtmosphere(true)
    .atmosphereColor('#7868e6')
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e: any) => {
      if (
        ['USA', 'ESP', 'JPN', 'CAN', 'FRA', 'RUS', 'CAF', 'MEX', 'LBY', 'EGY', 'DZA', 'MAR', 'AGO', 'TCD', 'AUS', 'RWA', 'COG', 'COD', 'NAM', 'ZAF', 'VEN', 'PER', 'BOL', 'HND', 'CRI', 'BLZ', 'SLV', 'CHL', 'GTM', 'NIC', 'PAN', 'COL', 'ARG'].includes(
          e.properties.ISO_A3,
        )
      ) {
        return 'rgba(5, 223, 114, 1)'
      }
      else return 'rgba(255, 255, 255, 0.5)'
    })
    .htmlElementsData(gData)
    .htmlElement((d) => {
      const el = document.createElement('div')
      const app = createApp({
        render: () => h(GlobeAvatar, { src: 'https://res.cloudinary.com/dyoyv8djx/image/upload/v1742465735/tsukiyama-bg-white_evpsok.png' }),
      })
      app.mount(el)
      el.style.transition = 'opacity 250ms'
      return el
    })
    .htmlElementVisibilityModifier((el, isVisible) => el.style.opacity = isVisible ? '1' : '0')

  const globeMaterial = globe.globeMaterial() as MeshPhongMaterial
  globeMaterial.color = new Color(0x4b6aff) // 4b6aff
  globeMaterial.emissive = new Color(0xa16ae8) // a16ae8
  globeMaterial.emissiveIntensity = 0.1
  globeMaterial.shininess = 0.7
  globeMaterial.map = null

  return { globe }
}
