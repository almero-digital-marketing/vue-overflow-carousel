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
    const focusId = ++FocusManager.counter

    return {
        hasFocus() {
            return focusId == FocusManager.focusId
        },
        toggleFocus() {
            FocusManager.focusId = focusId
        }
    }
}

export {
    useFocusManager
}