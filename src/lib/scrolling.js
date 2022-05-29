function waitForScrollEnd (scroller) {
    let lastChangedFrame = 0
    let lastX = scroller.scrollX
    let lastY = scroller.scrollY

    return new Promise( resolve => {
        function tick(frames) {
            // We requestAnimationFrame either for 500 frames or until 20 frames with
            // no change have been observed.
            if (frames >= 500 || frames - lastChangedFrame > 20) {
                resolve()
            } else {
                if (scroller.scrollX != lastX || scroller.scrollY != lastY) {
	               	lastChangedFrame = frames
                    lastX = scroller.scrollX
                    lastY = scroller.scrollY
                }
                requestAnimationFrame(tick.bind(null, frames + 1))
            }
        }
        tick(0)
    })
}

export {
    waitForScrollEnd
}