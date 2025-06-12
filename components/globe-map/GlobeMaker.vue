<script setup lang="ts">
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  AdditiveBlending,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)
const positions: number[] = []

function latLngToVector3(lat: number, lng: number, radius = 2): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new Vector3(x, y, z)
}

function addDot(lat: number, lng: number) {
  const pos = latLngToVector3(lat, lng)
  positions.push(pos.x, pos.y, pos.z)
}

onMounted(() => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const img = new Image()
  img.src = '/img/world.oceanmask.5400x2700.png'

  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    context?.drawImage(img, 0, 0)
    const imageData = context!.getImageData(0, 0, img.width, img.height).data

    for (let i = 0; i < 20000; i++) {
      const x = Math.floor(Math.random() * img.width)
      const y = Math.floor(Math.random() * img.height)
      const r = imageData[(y * img.width + x) * 4]
      if (r > 200) {
        const lat = 90 - (180 * y) / img.height
        const lng = (360 * x) / img.width - 180
        if (Math.abs(lat) < 85) addDot(lat, lng)
      }
    }

    const scene = new Scene()

    const camera = new PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.z = 8

    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 1)

    if (container.value) {
      const width = container.value.clientWidth
      const height = container.value.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      container.value.appendChild(renderer.domElement)

      // 地球本体
      const earthGeometry = new SphereGeometry(2, 64, 64)
      const earthMaterial = new MeshPhongMaterial({
        color: 0x220044,
        shininess: 60,
        specular: 0x5555ff,
      })
      const earthMesh = new Mesh(earthGeometry, earthMaterial)
      scene.add(earthMesh)

      // 点
      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
      const material = new PointsMaterial({
        color: 0x99ccff,
        size: 0.035,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: AdditiveBlending,
      })

      const points = new Points(geometry, material)
      scene.add(points)

      // ライト
      scene.add(new AmbientLight(0xffffff, 0.2))
      const light = new DirectionalLight(0x88aaff, 1.2)
      light.position.set(-2, 1.5, 4)
      scene.add(light)

      // アニメーション
      renderer.setAnimationLoop(() => {
        earthMesh.rotation.y += 0.001
        points.rotation.y += 0.001
        renderer.render(scene, camera)
      })
    }
  }
})
</script>

<template>
  <div
    ref="container"
    class="globe-container"
  />
</template>

<style scoped>
.globe-container {
  background: radial-gradient(ellipse at center, #050d1a 0%, #000000 100%);
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
  position: relative;
}
</style>
