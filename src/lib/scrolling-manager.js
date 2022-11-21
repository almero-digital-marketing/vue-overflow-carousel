import { onMounted, onBeforeUnmount, ref } from 'vue' 

function useScrollingManager(scroller) {

    const snapping = ref(false)
    const grabbing = ref(false)
    const mouseScrolling = ref(false)
    
    let pressTimeout
    let grabState = { x:0, y:0 }
    
    function onScrollEnd(snap) {
        let scrollInterval

        function onScroll() {
            clearInterval(scrollInterval)
            if (mouseScrolling.value) {
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
        }

        onMounted(() => {
            scroller.value.addEventListener('scroll', onScroll)
        })
        
        onBeforeUnmount(() => {
            scroller.value.removeEventListener('scroll', onScroll)
        })
    }

    function onPress() {
        grabbing.value = true
    }

    function onRelease() {
        grabbing.value = false
        clearTimeout(pressTimeout)
    }

    function onTouchStart() {
        mouseScrolling.value = false
        onPress()
    }

    function onMouseDown(e) {
        mouseScrolling.value = true
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

    function onMouseWheel() {
        mouseScrolling.value = true
    }

    onMounted(() => {
        scroller.value.addEventListener('touchstart', onTouchStart)
        scroller.value.addEventListener('touchend', onRelease)
        scroller.value.addEventListener('mousedown', onMouseDown)
        scroller.value.addEventListener('mouseup', onRelease)
        scroller.value.addEventListener('mouseleave', onRelease)
        scroller.value.addEventListener('mouseenter', onRelease)
        scroller.value.addEventListener('mousemove', onMouseMove)
        scroller.value.addEventListener('mousewheel', onMouseWheel)
    })

    onUnmounted(() => {
        scroller.value.removeEventListener('touchstart', onTouchStart)
        scroller.value.removeEventListener('touchend', onRelease)
        scroller.value.removeEventListener('mousedown', onMouseDown)
        scroller.value.removeEventListener('mouseup', onRelease)
        scroller.value.removeEventListener('mouseenter', onRelease)
        scroller.value.removeEventListener('mousemove', onMouseMove)
        scroller.value.removeEventListener('mousewheel', onMouseWheel)
    })
    
    return {
        onScrollEnd,
        grabbing,
        snapping,
        mouseScrolling
    }
}

export {
    useScrollingManager
}