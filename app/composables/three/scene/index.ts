import { Scene } from 'three'
import type { InjectionKey } from 'vue'

const DEFAULT_KEY: InjectionKey<Scene> = Symbol()

export const useScene = (InjectionKey: string | InjectionKey<Scene> = DEFAULT_KEY) => {
  const scene = inject(
    InjectionKey,
    () => {
      const scene = new Scene()
      provide(InjectionKey, scene)
      return scene
    },
    true,
  )

  return { scene }
}
