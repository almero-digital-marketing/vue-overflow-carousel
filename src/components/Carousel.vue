<template>
	<div class="carousel" 
		:style="{
			['--margin-first']: marginFirst + 'px',
			['--margin-last']: marginLast + 'px',
		}"
		:class="{ grabbing, mouse, center, enabled, ['center-first']: centerFirst, ['center-last']: centerFirst }" 
		ref="component"
		v-drag-scroll.x="mouse && enabled" 
		@scroll="onScroll"
		@mousewheel="onMouseWheel" 
		@mousedown="onMouseDown" 
		@mouseup="onMouseUp" 
		@mousemove="onMouseMove"
		@mouseleave="onMouseLeave"
		@touchstart="onTouchStart">
		<div class="pin" v-if="overlay">
			<div class="overlay">
				<slot name="overlay" :scroller="component" :active="active" :progress="progress"></slot>
			</div>
		</div>
		<div class="track" ref="track">
			<slot :scroller="component" :active="active" :progress="progress"></slot>
		</div>
	</div>
</template>
<script setup>
import { ref, onUpdated, onMounted, onUnmounted, toRefs, watch, onBeforeUnmount, provide } from 'vue'
import vDragScroll from 'vue-dragscroll/src/directive-next'
import debounce from 'debounce'
import { waitForScrollEnd } from '../lib/scrolling'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

const emit = defineEmits(['update:modelValue', 'progress', 'layout'])
const props = defineProps({
    captureScroll: {
      type: Boolean,
      default: true,
    },
	modelValue: {
      type: Number,
      default: null,
    },
    center: {
      type: Boolean,
      default: false,
    },
    centerFirst: {
      type: Boolean,
      default: false,
    },
    centerLast: {
      type: Boolean,
      default: false,
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
	overlay: {
      type: Boolean,
      default: false,
    },
})
defineExpose({ goTo })

const componentId = Date.now()

const { modelValue, captureScroll, center, enabled, duration, gap } = toRefs(props)

const component = ref(null)
const track = ref(null)
const grabbing = ref(false)
const mouse = ref(!!!('ontouchstart' in window))
const width = ref(0)
const height = ref(0)

const marginFirst = ref(0)
const marginLast = ref(0)
const active = ref(0)
const progress = ref(0)

provide('active', active)

let step = -1
let total = 0
let semaphor = true
let scrollDirection = 0

let lastScrollLeft = 0

let semaphorTimeout
function toggleSemaphor() {
    semaphor = false
    clearTimeout(semaphorTimeout)
    semaphorTimeout = setTimeout(() => semaphor = true, 200)
}
window.addEventListener('scroll', toggleSemaphor, { passive: true })
onUnmounted(() => window.removeEventListener('scroll', toggleSemaphor))

function toggleCarousel({ target }) {
	if (!target.classList.contains('craousel') && !target.closest('.carousel')) {
		window.scrollCarouselId = 0
	}
}

window.addEventListener('touchstart', toggleCarousel)
onUnmounted(() => window.removeEventListener('touchstart', toggleCarousel))

function updateLayout() {
	if (!component.value) return

	width.value = component.value.offsetWidth
	height.value = component.value.offsetHeight

	let elements = component.value.querySelectorAll('.slide')
    total = elements.length
	if (!elements.length) {
		marginFirst.value = 0
		marginLast.value = 0
		return
	}
	
	if (props.center && props.centerFirst) {
		marginFirst.value = (width.value - elements[0].offsetWidth) / 2
	}

	if (props.center && props.centerLast) {
		marginLast.value = (width.value - elements[elements.length - 1].offsetWidth) / 2
	}
	emit('layout')
}

let resizeObserver = new ResizeObserver(debounce(updateLayout, 100))
onMounted(() => {
	resizeObserver.observe(component.value)
	resizeObserver.observe(track.value)
	updateLayout()
})
onBeforeUnmount(() => {
	resizeObserver.disconnect()
})

let lastIndex
function goTo(index, force) {
	if (!component.value) return

	const elements = component.value.getElementsByClassName('slide')
	if (!elements.length) return

	index = Math.min(Math.max(index, 0), total - 1)
	const element = elements[index]
	if (lastIndex == index) return
	lastIndex = index

	const syncModel = () => {
		if (modelValue.value != null && modelValue.value != lastIndex) {
			goTo(modelValue.value)
		}
		component.value.style['scroll-snap-type'] = 'x mandatory'
	}

	if (!center.value) {
		gsap.to(component.value, { 
			scrollTo: {
				autoKill: true,  
				x: element,
			}, 
			ease: "power2",
			duration: force ? 0 : duration.value ,
			onComplete: syncModel
		})
	} else {
		let offsetX = (component.value.clientWidth - element?.clientWidth) / 2
		if (!props.centerFirst && index == 0) offsetX = 0
		gsap.to(component.value, {
			scrollTo: { 
				x: element, 
				autoKill: true, 
				offsetX,
			}, 
			ease: "power2",
			duration: force ? 0 : duration.value,
			onComplete: syncModel
		})
	}
}

function getActive() {
	if (!component.value) return

	const viewportCenter = width.value / 2
	let initialStep = step
	if (component.value.scrollLeft) {
		const elements = component.value.querySelectorAll('.slide')
		if (!elements.length) return

		const firstElement = elements[0]
		const firstElementStart = firstElement.getBoundingClientRect().x - component.value.getBoundingClientRect().x

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

				if (viewportCenter >= elementInsideStart && viewportCenter <= elementInsideEnd) {
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
				if (scrollDirection < 0 && elementEnd > 0) {
					initialStep = index
					break
				}
			}
		}

		if (initialStep == -1) {
			if (firstElementStart > 0) {
				initialStep = 0
			} else {
				initialStep = elements.length - 1
			}
		}
	} else {
		initialStep = 0
	}
	return initialStep
}

let moving
function move(direction) {
    if (!moving) {
        step = Math.max(Math.min(getActive() + direction, total), 0)
        moving = setTimeout(() => {
            moving = null
        }, 100)
		goTo(step)
    }
}

let spinning
function onMouseWheel(e) {
	if (!component.value) return
	window.scrollCarouselId = componentId
	if (!captureScroll.value || !enabled.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

	mouse.value = true

    if (moving) e.preventDefault()
    if (e.deltaY > 0 && component.value.scrollWidth - component.value.scrollLeft - 1 > width.value) e.preventDefault()
    if (e.deltaY < 0 && component.value.scrollLeft > 0) {
		e.preventDefault()
	}
	if (semaphor) move(Math.sign(e.deltaY))
	
	clearTimeout(spinning)
	spinning = setTimeout(() => {
		mouse.value = !!!('ontouchstart' in window)
	}, 200)
}

function onMouseMove() {
	window.scrollCarouselId = componentId
}

function onMouseDown() {
	component.value.style['scroll-snap-type'] = 'none'
	grab(true)
}

function onMouseUp() {
	component.value.style['scroll-snap-type'] = 'x mandatory'
	grab(false)
}

function onMouseLeave() {
	grab(false)
}

function onTouchStart() {
	window.scrollCarouselId = componentId
}

function grab(value) {
	if (grabbing.value == value) return
	if (enabled.value && mouse.value) {
		grabbing.value = value
		if (!grabbing.value) {
			const current = getActive()
			goTo(current)
		}
	}
}

function calcProgress() {
	progress.value = component.value.scrollLeft / (component.value.scrollWidth - width.value)
	emit('progress', progress.value)
}

let scrolling = false
function onScroll() {
	if (!component.value) return

	if (component.value.scrollLeft > lastScrollLeft) {
		scrollDirection = 1
	} else {
		scrollDirection = -1
	}
	lastScrollLeft = component.value.scrollLeft

	calcProgress()

	if (!scrolling) {
		scrolling = waitForScrollEnd(component.value).then(() => {
			active.value = getActive()
			if (window.scrollCarouselId == componentId) {
				emit('update:modelValue', active.value)
			}
			scrolling = false
		})
	}
}

watch(modelValue, () => {
	if (window.scrollCarouselId != componentId || !scrolling) {
		if (modelValue.value < 0) {
        	emit("update:modelValue", 0)
    	} else if (modelValue.value > total - 1){
			emit("update:modelValue", total - 1)
		} else {
			if (modelValue.value != getActive()) {
				goTo(modelValue.value)
			}
		} 
	}
})

</script>
<style lang="less" scoped>
.carousel {
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	cursor: grab;
	pointer-events: none;
	display: flex;

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
		display: inline-flex;

		&::before, 
		&::after {
			content: "";
			height: 1px;
			flex-shrink: 0;
			flex-grow: 0;
			display: block;
			width: 80px;
		}
	}

	&.mouse {
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
		flex-shrink: 0;
		&:first-child {
			margin-left: var(--margin-first);
			scroll-snap-align: start;
			padding-left: v-bind(gap);
		}
		&:last-child {
			margin-right: var(--margin-last);
			scroll-snap-align: end;
			padding-left: v-bind(gap);
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

	&.center.center-first {
		::v-deep(.slide:not(:last-child)) {
			scroll-snap-align: center;
		}		
	}

	&.center.center-last {
		::v-deep(.slide:not(:first-child)) {
			scroll-snap-align: center;
		}
	}
	.pin {
		position: sticky;
		left: 0;
		height: 0;
		width: 0;
		top: 0;
		z-index: 2;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: calc(1px * v-bind(width));
		height: calc(1px * v-bind(height));
		pointer-events: none;
	}
}
</style>