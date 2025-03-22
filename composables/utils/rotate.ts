export const useRotate = (element: Ref<HTMLElement | null>) => {
  const handleScroll = () => {
    if (!element.value) return

    // スクロール量に応じて角度を変える
    const rotation = window.scrollY * 2 // 0.2 は回転の速さ
    element.value.style.transform = `rotate(${rotation}deg)`
  }

  return { handleScroll }
}
