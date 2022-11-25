import { onMounted, onBeforeUnmount, ref } from 'vue' 

function useScrollingManager({scroller, active, goTo, scrollCount}) {

    const grabbing = ref(false)
    const mouseScrolling = ref(false)
    
    let grabState = { x:0, y:0 }

    function onRelease() {
        grabbing.value = false
    }

    function onTouchStart() {
        mouseScrolling.value = false
        grabbing.value = true
    }

    function onMouseDown(e) {
        mouseScrolling.value = true
        grabbing.value = true
        grabState = {
            startX: e.screenX,            
            x: e.screenX,
            active: active.value
        }
    }

    function onMouseUp(e) {
        if (grabbing.value) {
            grabbing.value = false
            if (Math.abs(grabState.startX - e.screenX) > 60 && Math.abs(active.value - grabState.active) < scrollCount.value) {
                goTo(active.value + Math.sign(grabState.startX - e.screenX) * scrollCount.value, .6)
            } else {
                goTo(active.value, .6)
            }
        }
    }

    function onMouseMove(e) {
        let deltaX = grabState.x - e.screenX
        if (grabbing.value) {
            grabState.x = e.screenX
            scroller.value.scrollBy(deltaX, 0)
        }
    }

    function onMouseWheel() {
        mouseScrolling.value = true
    }

    onMounted(() => {
        scroller.value.addEventListener('touchstart', onTouchStart)
        scroller.value.addEventListener('touchend', onRelease)
        scroller.value.addEventListener('mousedown', onMouseDown)
        scroller.value.addEventListener('mouseup', onMouseUp)
        scroller.value.addEventListener('mouseleave', onRelease)
        scroller.value.addEventListener('mouseenter', onRelease)
        scroller.value.addEventListener('mousemove', onMouseMove)
        scroller.value.addEventListener('mousewheel', onMouseWheel)
    })

    onBeforeUnmount(() => {
        scroller.value.removeEventListener('touchstart', onTouchStart)
        scroller.value.removeEventListener('touchend', onRelease)
        scroller.value.removeEventListener('mousedown', onMouseDown)
        scroller.value.removeEventListener('mouseup', onMouseUp)
        scroller.value.removeEventListener('mouseenter', onRelease)
        scroller.value.removeEventListener('mousemove', onMouseMove)
        scroller.value.removeEventListener('mousewheel', onMouseWheel)
    })
    
    return {
        grabbing,
        mouseScrolling,
    }
}

export {
    useScrollingManager
}