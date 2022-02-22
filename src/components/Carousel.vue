<template>
	<div class="carousel" 
		:class="{ grabbing, mouse, center, enabled }" 
		ref="component"
		v-drag-scroll="mouse && enabled" 
		@scroll.passive="scroll"
		@mousewheel="wheel" 
		@mousedown="grab(true)" 
		@mouseup="grab(false)" 
		@mouseleave="grab(false)">
		<div class="track" ref="track">
			<slot :scroller="component"></slot>
		</div>
	</div>
</template>
<script setup>
import { ref, onUpdated, onMounted, onUnmounted, toRefs, watch } from 'vue'
import vDragScroll from "vue-dragscroll/src/directive-next"
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

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
let scrollDirection = 0

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

let moveTimeout

function goTo(index, force) {
	index = Math.min(Math.max(index, 0), total)
	if (!component.value) return

	const elements = component.value.querySelectorAll('.slide')
	const element = elements[index]
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
			const elementInsideStart = elementStart + (elementEnd - elementStart) * .25
			const elementInsideEnd = elementStart + (elementEnd - elementStart) * .75

			if (center.value) {
				const next = Math.max(0, Math.min(index + scrollDirection, elements.length - 1))
				const nextElement = elements[next]
				const nextElementStart = nextElement.getBoundingClientRect().x - component.value.getBoundingClientRect().x
				const nextElementEnd = nextElementStart + nextElement.offsetWidth
				const nextInsideStart = nextElementStart + (nextElementEnd - nextElementStart) * .25
				const nextInsideEnd = nextElementStart + (nextElementEnd - nextElementStart) * .75

				if (viewportCenter > elementInsideStart && viewportCenter < elementInsideEnd) {
					initialStep = index
					break
				}
				if (scrollDirection > 0 && viewportCenter > elementInsideEnd && viewportCenter < nextInsideStart) {
					initialStep = next
					break
				}
				if (scrollDirection < 0 && viewportCenter < elementInsideStart && viewportCenter > nextInsideEnd) {
					initialStep = next
					break
				}
			} else {
				if (scrollDirection > 0 && elementStart >= 0) {
					initialStep = index
					break
				}
				if (scrollDirection < 0 && elementEnd >= 0) {
					initialStep = index
					break
				}
			}
		}
	} else {
		initialStep = 0
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

let wheelTimeout
function wheel(e) {
	if (!captureScroll.value || !enabled.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

	mouse.value = true

    if (moveTimeout) e.preventDefault()
    if (e.deltaY > 0 && component.value.scrollWidth - component.value.scrollLeft - 1 > component.value.offsetWidth) e.preventDefault()
    if (e.deltaY < 0 && component.value.scrollLeft > 0) e.preventDefault()
	if (semaphor) move(Math.sign(e.deltaY))
	
	clearTimeout(wheelTimeout)
	wheelTimeout = setTimeout(() => {
		mouse.value = !!!('ontouchstart' in window)
	}, 200)
}

watch(active, () => {
	const current = getActive()
	if (current != active.value) {
		goTo(active.value)
	}
})

function grab(value) {
	if (enabled.value && mouse.value) {
		grabbing.value = value
		if (!value) {
			const current = getActive()
			console.log('FUCK', current)
			goTo(current)
		}
	}
}

let lastScrollLeft = 0
function scroll(e) {
	if (component.value.scrollLeft > lastScrollLeft) {
		scrollDirection = 1
	} else {
		scrollDirection = -1
	}
	lastScrollLeft = component.value.scrollLeft
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
		&::before, 
		&::after {
			content: "";
			width: 80px;
			height: 1px;
			flex-shrink: 0;
			flex-grow: 0;
			display: block;
		}
		.slide {
			scroll-snap-align: start;
			.center & {
				scroll-snap-align: center;
			}
			&:first-child {
				scroll-snap-align: start;
			}
			&:last-child {
				scroll-snap-align: end;
			}
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
		&:first-child {
			scroll-snap-align: start;
			padding-left: v-bind(gap);
		}
		&:last-child {
			scroll-snap-align: end;
			padding-right: v-bind(gap);
		}
	}

	&.center {
		.track {
			gap: v-bind(gap);
		}
		::v-deep(.slide:not(:first-child):not(:last-child)) {
			scroll-snap-align: center;
		}
		::v-deep(.slide:not(:first-child)) {
			padding-left: unset;
		}
	}
}
</style>