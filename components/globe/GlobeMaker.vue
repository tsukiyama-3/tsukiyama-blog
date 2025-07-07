<script setup lang="ts">
import { Scene, PerspectiveCamera, AmbientLight, WebGLRenderer, SphereGeometry, MeshPhongMaterial, Mesh, TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!container.value) return

  const scene = new Scene()
  scene.background = null
  const camera = new PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 2

  const texture = new TextureLoader().load('/8k_earth_daymap.jpg')

  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  const geometry = new SphereGeometry(1, 64, 64)
  const material = new MeshPhongMaterial({
    map: texture,
    specular: 0xdddddd,
    shininess: 30,
  })
  const sphere = new Mesh(geometry, material)
  scene.add(sphere)

  const ambient = new AmbientLight(0xffffff, 1) // 明るさは1で充分
  scene.add(ambient)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false

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
