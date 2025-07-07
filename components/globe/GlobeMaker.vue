<script setup lang="ts">
import type { MeshPhongMaterial } from 'three'
import { Scene, PerspectiveCamera, AmbientLight, Fog, PointLight, DirectionalLight, WebGLRenderer, Color } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import countries from '~/public/json/globe-data-min.json'

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

  const globeMaterial = Globe.globeMaterial() as MeshPhongMaterial
  globeMaterial.color = new Color(0x4b6aff) // 4b6aff
  globeMaterial.emissive = new Color(0xa16ae8) // a16ae8
  globeMaterial.emissiveIntensity = 0.1
  globeMaterial.shininess = 0.7
  globeMaterial.map = null

  scene.add(Globe)

  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.enablePan = false

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  // ウィンドウリサイズ対応
  window.addEventListener('resize', () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  })
})
</script>

<template>
  <div
    ref="container"
    class="w-full aspect-square"
  />
</template>
