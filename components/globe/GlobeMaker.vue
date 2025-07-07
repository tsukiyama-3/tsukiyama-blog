<script setup lang="ts">
import {
  PerspectiveCamera,
  AmbientLight,
  Fog,
  PointLight,
  DirectionalLight,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { useGlobe } from '~/composables/three/globe'
import { useScene } from '~/composables/three/scene'

const container = ref<HTMLDivElement | null>(null)

let renderer: WebGLRenderer
let cssRenderer: CSS2DRenderer
let controls: OrbitControls

const resizeHandler = () => {
  if (!container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

let camera: PerspectiveCamera

onMounted(async () => {
  if (!container.value) return

  const { scene } = useScene('globe')

  scene.add(new AmbientLight(0xbbbbbb, 0.3))
  scene.background = null

  camera = new PerspectiveCamera()
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

  camera.position.set(0, 0, 300)
  scene.add(camera)

  scene.fog = new Fog(0x535ef3, 400, 2000)

  const { globe } = await useGlobe()
  if (!globe) return

  const radius = 300
  const lat = 35.6895
  const lng = 139.6917

  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  camera.position.set(x, y, z)
  camera.lookAt(0, 0, 0)
  globe.setPointOfView(camera)
  scene.add(globe)

  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  cssRenderer = new CSS2DRenderer()

  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  cssRenderer.setSize(container.value.clientWidth, container.value.clientHeight)
  cssRenderer.domElement.style.position = 'absolute'
  cssRenderer.domElement.style.top = '0px'
  cssRenderer.domElement.style.pointerEvents = 'none'

  container.value.appendChild(renderer.domElement)
  container.value.appendChild(cssRenderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.enablePan = false

  controls.minPolarAngle = Math.PI / 3.5
  controls.maxPolarAngle = Math.PI - Math.PI / 3

  controls.addEventListener('change', () => {
    globe.setPointOfView(camera)
  })

  window.addEventListener('resize', resizeHandler)

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
    cssRenderer.render(scene, camera)
  }

  animate()
})

onUnmounted(() => {
  if (container.value) {
    container.value.removeChild(renderer.domElement)
    container.value.removeChild(cssRenderer.domElement)
  }

  renderer.dispose()
  controls.dispose()
  // cssRenderer.dispose() は不要（存在しない）
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div
    ref="container"
    class="w-full aspect-square relative"
  />
</template>
