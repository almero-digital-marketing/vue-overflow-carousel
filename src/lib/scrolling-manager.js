import { onMounted, onUnmounted, ref } from 'vue' 

function useScrollingManager(scroller) {

    const snapping = ref(false)
    const grabbing = ref(false)
    
    let pressTimeout
    let grabState = { x:0, y:0 }
    
    function onScrollEnd(snap) {
        let scrollInterval
        function onScroll() {
            clearInterval(scrollInterval)
            scrollInterval = setInterval(() => {
                if (!grabbing.value && !snapping.value) {
                    clearInterval(scrollInterval)
                    snapping.value = true
                    snap()
                    .then(() => {
                        snapping.value = false
                        clearInterval(scrollInterval)
                    })
                }
            }, 200)
        }
        function onPress() {
            grabbing.value = true
        }
        function onRelease() {
            grabbing.value = false
            clearTimeout(pressTimeout)
        }
        function onMouseDown(e) {
            clearTimeout(pressTimeout)
            pressTimeout = setTimeout(onPress, 50)
            grabState = {
                x: e.screenX,
                y: e.screenY
            }
        }
        function onMouseMove(e) {
            let deltaX = grabState.x - e.screenX
            if (grabbing.value) {
                if (deltaX != 0) {
                    grabState.x = e.screenX
                    scroller.value.scrollBy(deltaX, 0)
                }
            }
        }
        onMounted(() => {
            scroller.value.addEventListener('scroll', onScroll)
            scroller.value.addEventListener('touchstart', onPress)
            scroller.value.addEventListener('touchend', onRelease)
            scroller.value.addEventListener('mousedown', onMouseDown)
            scroller.value.addEventListener('mouseup', onRelease)
            scroller.value.addEventListener('mouseleave', onRelease)
            scroller.value.addEventListener('mouseenter', onRelease)
            scroller.value.addEventListener('mousemove', onMouseMove)
        })
        onUnmounted(() => {
            scroller.value.removeEventListener('scroll', onScroll)
            scroller.value.removeEventListener('touchstart', onPress)
            scroller.value.removeEventListener('touchend', onRelease)
            scroller.value.removeEventListener('mousedown', onMouseDown)
            scroller.value.removeEventListener('mouseup', onRelease)
            scroller.value.removeEventListener('mouseenter', onRelease)
            scroller.value.removeEventListener('mousemove', onMouseMove)
        })
    }
    
    return {
        onScrollEnd,
        grabbing,
        snapping
    }
}

export {
    useScrollingManager
}