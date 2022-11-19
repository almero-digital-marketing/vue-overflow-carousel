import { onMounted, onUnmounted, getCurrentInstance } from 'vue' 

class FocusManager {
    static focusId = 0
    static counter = 0
    static {
        const toggleFocus = ({ target }) => {
            if (FocusManager.focusId != 0 && !target.classList.contains('focus-manager') && !target.closest('.focus-manager')) {
                FocusManager.focusId = 0
            }
        }
        
        window.addEventListener('touchstart', toggleFocus)
        window.addEventListener('mousedown', toggleFocus)
    }
}

function useFocusManager() {
    const { vnode } = getCurrentInstance()
    const focusId = ++FocusManager.counter

    function hasFocus() {
        return focusId == FocusManager.focusId
    }
    function toggleFocus() {
        FocusManager.focusId = focusId
    }

    onMounted(() => {
        vnode.el.addEventListener('touchstart', toggleFocus)
        vnode.el.addEventListener('mousewheel', toggleFocus)
        vnode.el.addEventListener('mousemove', toggleFocus)
    })
    onUnmounted(() => {
        vnode.el.removeEventListener('touchstart', toggleFocus)
        vnode.el.removeEventListener('mousewheel', toggleFocus)
        vnode.el.removeEventListener('mousemove', toggleFocus)
    })

    return {
        hasFocus,
        toggleFocus
    }
}

export {
    useFocusManager
}