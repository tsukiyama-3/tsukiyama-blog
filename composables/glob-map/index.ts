import { AmbientLight, DirectionalLight, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, SphereGeometry } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { useScene, useRenderer, useEarthTexture } from '~/composables/three'

export const useGlobMap = (container: Ref<HTMLElement>) => {
  if (!import.meta.client) {
    return { render: () => {} }
  }

  const { scene } = useScene()
  const { renderer } = useRenderer({ width: container.value.clientWidth, height: container.value.clientHeight })
  const camera = new PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 6
  const { texture } = useEarthTexture()
  const geometory = new SphereGeometry(2, 32, 32)
  const material = new MeshPhongMaterial({
    map: texture,
    specular: 0x888888,
    shininess: 30,
  })
  const earth = new Mesh(geometory, material)
  scene.add(earth)
  const ambientLight = new AmbientLight(0xcccccc, 1.0)
  scene.add(ambientLight)
  const directionalLight = new DirectionalLight(0xffffff, 1.2)
  directionalLight.position.set(5, 3, 5)
  scene.add(directionalLight)
  const hemiLight = new HemisphereLight(0xffffff, 0x444444, 1.2)
  scene.add(hemiLight)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false

  const render = () => {
    requestAnimationFrame(render)
    controls.update()
    renderer.render(scene, camera)
  }

  return { render, renderer }
}
