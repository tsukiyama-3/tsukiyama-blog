<script setup lang="ts">
import type { MeshPhongMaterial } from 'three'
import { Scene, PerspectiveCamera, AmbientLight, Fog, PointLight, DirectionalLight, WebGLRenderer, Color } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { createApp, h } from 'vue'
import countries from '~/public/json/globe-data-min.json'
import GlobeAvatar from '~/components/globe/GlobeAvatar.vue'

const container = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  const { default: ThreeGlobe } = await import('three-globe')
  if (!container.value) return

  const scene = new Scene()
  scene.add(new AmbientLight(0xbbbbbb, 0.3))
  scene.background = null
  const camera = new PerspectiveCamera()
  camera.updateProjectionMatrix()

  const dLight = new DirectionalLight(0xffffff, 0.8)
  dLight.position.set(-600, 1600, 400)
  camera.add(dLight)

  const dLight1 = new DirectionalLight(0x7982f6, 1)
  dLight1.position.set(-150, 400, 150)
  camera.add(dLight1)

  const dLight2 = new PointLight(0x8566cc, 0.8)
  dLight2.position.set(-150, 400, 150)
  camera.add(dLight2)

  camera.position.z = 300
  camera.position.x = 0
  camera.position.y = 0

  scene.add(camera)

  scene.fog = new Fog(0x535ef3, 400, 2000)

  const N = 30
  const gData = [
    {
      lat: 35.6895,
      lng: 139.6917,
    },
  ]

  const Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.3)
    .showAtmosphere(true)
    .atmosphereColor('#7868e6')
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e: any) => {
      if (
        ['USA'].includes(
          e.properties.ISO_A3,
        )
      ) {
        return 'rgba(255,255,255, 1)'
      }
      else return 'rgba(255,255,255, 0.5)'
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

  const globeMaterial = Globe.globeMaterial() as MeshPhongMaterial
  globeMaterial.color = new Color(0x4b6aff) // 4b6aff
  globeMaterial.emissive = new Color(0xa16ae8) // a16ae8
  globeMaterial.emissiveIntensity = 0.1
  globeMaterial.shininess = 0.7
  globeMaterial.map = null

  scene.add(Globe)

  Globe.setPointOfView(camera)

  const renderers = [new WebGLRenderer({ antialias: true, alpha: true }), new CSS2DRenderer()]

  renderers.forEach((r, idx) => {
    r.setSize(container.value!.clientWidth, container.value!.clientHeight)
    if (idx > 0) {
    // WebGL の上に重ねる
      r.domElement.style.position = 'absolute'
      r.domElement.style.top = '0px'
      r.domElement.style.pointerEvents = 'none'
    }
    container.value!.appendChild(r.domElement)
  })

  const controls = new OrbitControls(camera, renderers[0].domElement)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.enablePan = false

  controls.addEventListener('change', () => {
    Globe.setPointOfView(camera)
  })

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderers.forEach(r => r.render(scene, camera))
  }

  animate()

  // ウィンドウリサイズ対応
  window.addEventListener('resize', () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderers[0].setSize(container.value.clientWidth, container.value.clientHeight)
  })
})
</script>

<template>
  <div
    ref="container"
    class="w-full aspect-square relative"
  />
</template>
