<template>
	<div class="carousel" 
		:style="{
			['--margin-first']: marginFirst + 'px',
			['--margin-last']: marginLast + 'px',
		}"
		:class="{ 
			grabbing, 
			mouse, 
			center, 
			['center-first']: centerFirst, 
			['center-last']: centerLast, 
			['direction-none']: scrollDirection == 0, 
			['direction-forward']: scrollDirection == 1, 
			['direction-backward']: scrollDirection == -1 
		}" 
		ref="component"
		v-drag-scroll.x="mouse" 
		@scroll="onScroll"
		@mousewheel="onMouseWheel" 
		@mousedown="onMouseDown" 
		@mouseup="onMouseUp" 
		@mousemove="onMouseMove"
		@mouseleave="onMouseLeave"
		@touchstart="onTouchStart">
		<div class="navigation" v-if="overlay">
			<div class="overlay">
				<slot name="overlay" :scroller="component" :active="active" :progress="progress" :scrollDirection="scrollDirection"></slot>
			</div>
		</div>
		<div class="track" ref="track">
			<slot :scroller="component" :active="active" :progress="progress" :scrollDirection="scrollDirection"></slot>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, toRefs, watch, onBeforeUnmount, provide, computed } from 'vue'
import vDragScroll from 'vue-dragscroll/src/directive-next'
import debounce from 'debounce'
import { waitForScrollEnd } from '../lib/scrolling'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

const emit = defineEmits(['update:modelValue', 'progress', 'layout', 'change'])
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
    },
	slideGap: {
      type: String,
      default: '0px',
    },
	trackGap: {
      type: String,
      default: '0px',
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

const { modelValue, captureScroll, center, duration, gap, slideGap, trackGap, centerFirst, centerLast } = toRefs(props)

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
const scrollDirection = ref(0)

function normalizeUnits(value) {
    if (!value) return '0px'
    else if (typeof value == 'string') return value
    return value + 'px'
}

const _slideGap = computed(() => normalizeUnits(gap.value || slideGap.value))
const _trackGap = computed(() => normalizeUnits(gap.value || trackGap.value))

provide('active', active)

let step = -1
let total = 0
let semaphor = true

let lastScrollLeft = 0

let semaphorTimeout
function toggleSemaphor() {
    semaphor = false
    clearTimeout(semaphorTimeout)
    semaphorTimeout = setTimeout(() => semaphor = true, 200)
}
window.addEventListener('scroll', toggleSemaphor, { passive: true })
onUnmounted(() => window.removeEventListener('scroll', toggleSemaphor))

function toggleFocus({ target } = {}) {
	if (target) {
		if (window.scrollCarouselId != 0 && !target.classList.contains('craousel') && !target.closest('.carousel')) {
			window.scrollCarouselId = 0
		}
	} else {
		window.scrollCarouselId = componentId
	}
}

window.addEventListener('touchstart', toggleFocus)
onUnmounted(() => window.removeEventListener('touchstart', toggleFocus))

window.addEventListener('mousedown', toggleFocus)
onUnmounted(() => window.removeEventListener('mousedown', toggleFocus))

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
	
	if (centerFirst.value) {
		marginFirst.value = (width.value - elements[0].offsetWidth) / 2
	}

	if (centerLast.value) {
		marginLast.value = (width.value - elements[elements.length - 1].offsetWidth) / 2
	}
	emit('layout')

	calcProgress()
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

function toggleSnap(snap) {
	if (snap) {
		component.value.style['scroll-snap-type'] = 'x mandatory'
	} else {
		component.value.style['scroll-snap-type'] = 'none'
	}
}

let goToIndex
function goTo(index, force) {
	if (!component.value) return

	const elements = component.value.getElementsByClassName('slide')
	if (!elements.length) return

	index = Math.min(Math.max(index, 0), total - 1)
	const element = elements[index]
	if (goToIndex == index) return
	goToIndex = index

	const syncModel = () => {
		if (modelValue.value != null && modelValue.value != goToIndex) {
			goTo(modelValue.value)
		}
	}

	if (center.value || (centerFirst.value && index == 0) || (centerLast.value || index == total - 1)) {
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
	} else {
		gsap.to(component.value, { 
			scrollTo: {
				autoKill: true,  
				x: element,
			}, 
			ease: "power2",
			duration: force ? 0 : duration.value ,
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
				const next = Math.max(0, Math.min(index + scrollDirection.value, elements.length - 1))
				const nextElement = elements[next]
				const nextElementStart = nextElement.getBoundingClientRect().x - component.value.getBoundingClientRect().x
				const nextElementEnd = nextElementStart + nextElement.offsetWidth
				const nextInsideStart = nextElementStart + (nextElementEnd - nextElementStart) * .25
				const nextInsideEnd = nextElementStart + (nextElementEnd - nextElementStart) * .75

				if (viewportCenter >= elementInsideStart && viewportCenter <= elementInsideEnd) {
					initialStep = index
					break
				}
				if (scrollDirection.value > 0 && viewportCenter > elementInsideEnd && viewportCenter < nextInsideStart) {
					initialStep = next
					break
				}
				if (scrollDirection.value < 0 && viewportCenter < elementInsideStart && viewportCenter > nextInsideEnd) {
					initialStep = next
					break
				}
			} else {
				if (scrollDirection.value > 0 && elementStart >= 0) {
					initialStep = index
					break
				}
				if (scrollDirection.value < 0 && elementEnd > 0) {
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
	if (!captureScroll.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

	mouse.value = true

    if (moving) e.preventDefault()
    if (e.deltaY > 0 && component.value.scrollWidth - component.value.scrollLeft - width.value > 100 ||
		e.deltaY < 0 && component.value.scrollLeft > 100) {
		e.preventDefault()
	}
	if (semaphor) move(Math.sign(e.deltaY))
	
	clearTimeout(spinning)
	spinning = setTimeout(() => {
		enforceBounds()
		mouse.value = !!!('ontouchstart' in window)
	}, 200)
}

function onMouseMove() {
	toggleFocus()
}

function onMouseDown() {
	toggleSnap(false)
	toggleGrab(true)
}

function onMouseUp() {
	toggleGrab(false)
}

function onMouseLeave() {
	toggleGrab(false)
}

function onTouchStart() {
	toggleSnap(true)
	toggleFocus()
}

function toggleGrab(value) {
	if (grabbing.value == value) return
	if (mouse.value) {
		grabbing.value = value
		if (!grabbing.value) {
			goToIndex = -1
			const current = getActive()
			goTo(current)
			enforceBounds()
		}
	}
}

function calcProgress() {
	progress.value = (component.value.scrollLeft - 100) / (component.value.scrollWidth - width.value - 200)
	emit('progress', progress.value)
}

function enforceBounds() {
	if (!mouse.value) return
	if (progress.value > 1) {
		gsap.to(component.value, {
			scrollTo: { 
				x: 'max', 
				autoKill: true, 
				offsetX: 100,
			}, 
			ease: "power2",
			duration: .2,
		})
	} 
	else if (progress.value < 0) {
		gsap.to(component.value, {
			scrollTo: { 
				x: 100, 
				autoKill: true, 
			}, 
			ease: "power2",
			duration: .2,
		})
	} 
}

let scrolling = false
function onScroll() {
	if (!component.value) return

	if (component.value.scrollLeft > lastScrollLeft) {
		scrollDirection.value = 1
	} else {
		scrollDirection.value = -1
	}
	lastScrollLeft = component.value.scrollLeft

	calcProgress()

	if (!scrolling) {
		scrolling = waitForScrollEnd(component.value).then(() => {
			active.value = getActive()
			if (window.scrollCarouselId == componentId) {
				emit('change', active.value)
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
	display: flex;

	--slide-gap: v-bind(_slideGap);
	--track-gap: v-bind(_trackGap);

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
			z-index: 10;
			height: 100%;
			width: 100px;
		}
	}

	::v-deep(.slide) {
		scroll-snap-align: start;
		padding-left: var(--track-gap);
		flex-shrink: 0;
		flex-grow: 0;
		&:first-child {
			scroll-snap-align: start;
			padding-left: var(--track-gap);
		}
		&:last-child {
			scroll-snap-align: end;
			margin-right: 0;
			padding-right: calc(var(--track-gap));
		}
		&:not(:first-child) {
			padding-left: var(--slide-gap);
		}
	}

	&.center {
		.track {
			gap: var(--slide-gap);
			&::after {
				margin-left: calc(-1 * var(--slide-gap));
			}

		}
		::v-deep(.slide) {
			&:first-child {
				margin-left: calc(-1 * var(--slide-gap));
			}
			&:last-child {
				padding-right: calc(1 * var(--track-gap));
				margin-right: 0;
			}
			&:not(:first-child):not(:last-child) {
				padding-left: 0;
				margin-left: 0;
				scroll-snap-align: center;
			}
			&:not(:first-child) {
				padding-left: unset;
			}
		}
	}

	&.center-first {
		::v-deep(.slide) {
			&:first-child {
				scroll-snap-align: center;
				padding-left: unset;
				margin-left: calc(var(--margin-first) - var(--slide-gap));
			}
		}
	}

	&.center-last {
		.track {
			&::after {
				margin-left: 0;
			}
		}
		::v-deep(.slide) {
			&:last-child {
				scroll-snap-align: center;
				margin-right: calc(var(--margin-last) - var(--slide-gap));
				padding-right: unset;
			}
		}
	}
	
	.navigation {
		position: sticky;
		left: 0;
		height: 0;
		width: 0;
		top: 0;
		z-index: 2;
		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: calc(1px * v-bind(width));
			height: calc(1px * v-bind(height));
			pointer-events: none;
		}
	}
}
</style>