<template>
	<div class="carousel" 
		:class="{ grabbing, mouse, center, enabled }" 
		ref="component"
		v-drag-scroll="mouse && enabled" 
		@mousewheel="wheel" 
		@mousedown="grab(true)" 
		@mouseup="grab(false)" 
		@mouseleave="grab(false)"
		@scroll.passive="scroll">
		<div class="track" ref="track">
			<slot></slot>
		</div>
	</div>
</template>
<script setup>
import { ref, onUpdated, onMounted, onUnmounted, toRefs, watch } from 'vue'
import vDragScroll from "vue-dragscroll/src/directive-next"
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

const emit = defineEmits(['update:active'])

const props = defineProps({
    captureScroll: {
      type: Boolean,
      default: true,
    },
	active: {
      type: Number,
      default: 0,
    },
    center: {
      type: Boolean,
      default: true,
    },
	gap: {
      type: String,
      default: '0px',
    },
	enabled: {
      type: Boolean,
      default: true,
    },
	duration: {
      type: Number,
      default: .6,
    },
})

const { captureScroll, active, center, enabled, duration, gap } = toRefs(props)

const component = ref(null)
const track = ref(null)
const grabbing = ref(false)
const mouse = ref(!!!('ontouchstart' in window))

let step = -1
let total = 0
let semaphor = true

let semaphorTimeout
function toggleSemaphor() {
    semaphor = false
    clearTimeout(semaphorTimeout)
    semaphorTimeout = setTimeout(() => semaphor = true, 200)
}
window.addEventListener('scroll', toggleSemaphor, { passive: true })
onUnmounted(() => window.removeEventListener('scroll', toggleSemaphor))

function setTotal() {
    total = component.value.querySelectorAll('.slide').length
}
onMounted(setTotal)
onUpdated(setTotal)

let moveTimeout, scrollTimeout

function goTo(index, force) {
	index = Math.min(Math.max(index, 0), total)
	if (!component.value) return

	const elements = component.value.querySelectorAll('.slide')
	const element = elements[index]
	const style = window.getComputedStyle(track.value)

	if (index == 0) {
		gsap.to(component.value, { 
			scrollTo: {
				autoKill: true,  
				x: 0 
			}, 
			duration: force ? 0 : duration.value 
		})
	} else if (index == elements.length - 1) {
		gsap.to(component.value, { 
			scrollTo: { 
				autoKill: true, 
				x: 'max' 
			}, 
			duration: force ? 0 : duration.value
		})
	} else {
		gsap.to(component.value, { 
			scrollTo: { 
				x: element, 
				autoKill: true, 
				offsetX: center.value ? (component.value.clientWidth - element?.clientWidth) / 2 : 0
			}, 
			duration: force ? 0 : duration.value
		})
	}
}

function getActive() {
	const viewportCenter = component.value.offsetWidth / 2
	let initialStep = step
	if (component.value.scrollLeft) {
		const elements = component.value.querySelectorAll('.slide')
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index]
			const elementStart = element.getBoundingClientRect().x - component.value.getBoundingClientRect().x
			const elementEnd = elementStart + element.offsetWidth

			if (center.value) {
				if (viewportCenter > elementStart && viewportCenter < elementEnd) {
					initialStep = index
					break
				}
			} else {
				if (elementStart >= 0) {
					initialStep = index
					break
				}
			}
		}
	}
	return initialStep
}

function move(direction) {
    if (!moveTimeout) {
        step = Math.max(Math.min(getActive() + direction, total), 0)
        moveTimeout = setTimeout(() => {
            moveTimeout = null
        }, 100)
		goTo(step)
    }
}

function wheel(e) {
	mouse.value = true
	if (!captureScroll.value || !enabled.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

    if (moveTimeout) e.preventDefault()
    if (e.deltaY > 0 && component.value.scrollWidth - component.value.scrollLeft - 1 > component.value.offsetWidth) e.preventDefault()
    if (e.deltaY < 0 && component.value.scrollLeft > 0) e.preventDefault()
    if (!semaphor) return

	move(Math.sign(e.deltaY))
}

function scroll() {
	clearTimeout(scrollTimeout)
	scrollTimeout = setTimeout(() => {
		let current = getActive()
		if (current != active.value) {
			emit('update:active', current)
		}
	}, 50)
}

watch(active, () => {
	let current = getActive()
	if (active.value < 0) return emit('update:active', 0)
	if (active.value >= total) return emit('update:active', total - 1)
	if (current != active.value) {
		goTo(active.value)
	}
})

function grab(value) {
	if (enabled.value) {
		grabbing.value = value
	}
}

</script>
<style lang="less" scoped>
.carousel {
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	cursor: grab;
	pointer-events: none;

	&.enabled {
		pointer-events: unset;
	}

	&.grabbing {
		cursor: grabbing;
	}

	&::-webkit-scrollbar {    
		display: none;
	}
	.track {
		display: flex;
		.center & {
			gap: v-bind(gap);
		}
		&::before, 
		&::after {
			content: "";
			width: 80px;
			height: 1px;
			flex-shrink: 0;
			flex-grow: 0;
			display: block;
		}
	}
	&.mouse {
		scroll-snap-type: none;
		.track {
			&::before, 
			&::after {
				display: none;
			}

		}
	}
	::v-deep(.slide) {
		scroll-snap-align: start;
		padding-left: v-bind(gap);
		.center & {
			scroll-snap-align: center;
			padding-left: unset;
		}
		&:first-child {
			scroll-snap-align: start;
			padding-left: v-bind(gap);
		}
		&:last-child {
			scroll-snap-align: end;
			padding-right: v-bind(gap);
		}
	}
}
</style>