export default {
    created(el) {
        el.state = {
            onClick(e) {
                if (el.state.down) {
                    const dx = Math.abs(e.pageX - el.state.down.pageX)
                    const dy = Math.abs(e.pageY - el.state.down.pageY)
    
                    // console.log('Drag click', dx, dy)
    
                    if (dx > 1 || dy > 1) {
                        e.preventDefault()
                    }
                    delete el.state.down
                }
            },
            onMouseDown(e) {
                el.state.down = {
                    pageX: e.pageX, 
                    pageY: e.pageY
                }
            },
        }
        el.addEventListener('click', el.state.onClick)
        el.addEventListener('mousedown', el.state.onMouseDown)
    },
    mounted(el) {
    },
    unmounted(el) {
        if (el.state) {
            el.removeEventListener('click', el.state.onClick)
            el.removeEventListener('mousedown', el.state.onClick)
            delete el.state
        }
    }
}