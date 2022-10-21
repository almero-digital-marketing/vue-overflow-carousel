<template>
	<div class="carousel">
		<div class="scroller" 
			:style="{
				['--margin-first']: marginFirst + 'px',
				['--margin-last']: marginLast + 'px',
			}"
			:class="{ 
				disabled,
				grabbing, 
				mouse, 
				center,
				snap, 
				['center-first']: _centerFirst, 
				['center-last']: _centerLast, 
				['offset-last']: _offsetLast, 
				['direction-none']: scrollDirection == 0, 
				['direction-forward']: scrollDirection == 1, 
				['direction-backward']: scrollDirection == -1,
				['auto-width']: slidesPerPage > -1,
				['has-prev']: hasPrev,
				['has-next']: hasNext,
			}" 
			ref="component"
			@scroll="onScroll"
			@mousewheel="onMouseWheel" 
			@mousedown="onMouseDown" 
			@mouseup="onMouseUp" 
			@mousemove="onMouseMove"
			@mouseleave="onMouseLeave"
			@mouseenter="onMouseEnter"
			@touchstart="onTouchStart">
			<div class="track" ref="track">
				<slot :scroller="component" :active="active" :progress="progress" :scrollDirection="scrollDirection"></slot>
			</div>
		</div>
		<div class="overlay" v-if="overlay">
			<slot name="overlay" 
				:scroller="component" 
				:active="active" 
				:progress="progress" 
				:scrollDirection="scrollDirection" 
				:next="next" 
				:prev="prev" 
				:hasPrev="hasPrev"
				:hasNext="hasNext"
			></slot>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, toRefs, watch, onBeforeUnmount, provide, computed, nextTick } from 'vue'
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
      default: undefined,
    },
    centerLast: {
      type: Boolean,
      default: undefined,
    },
    offsetLast: {
      type: Boolean,
      default: undefined,
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
	slidesPerPage: {
		type: Number,
		default: -1
	},
	overlay: {
      type: Boolean,
      default: false,
    },
	snap: {
		type: Boolean,
		default: true
	},
	debug: {
		type: Boolean,
		default: false
	}
})

const componentId = Date.now()

const { modelValue, captureScroll, center, duration, gap, slideGap, trackGap, centerFirst, centerLast, snap, offsetLast, debug } = toRefs(props)

const component = ref(null)
const track = ref(null)
const grabbing = ref(false)
const grabState = ref({
	x: 0,
	y: 0
})
const mouse = ref(!!!('ontouchstart' in window))
const width = ref(0)
const height = ref(0)
const disabled = ref(false)

const marginFirst = ref(0)
const marginLast = ref(0)
const active = ref(0)
const progress = ref(0)
const scrollDirection = ref(0)

const hasPrev = ref(false)
const hasNext = ref(false)

function next(count, force) {
	toggleSnap(false)
	return goTo(active.value + (count || 1), force)
}

function prev(count, force) {
	toggleSnap(false)
	return goTo(active.value - (count || 1), force)
}

defineExpose({ 
	goTo,
	next,
	prev,
})

function normalizeUnits(value) {
    if (!value) return '0px'
    else if (typeof value == 'string') return value
    return value + 'px'
}

const _slideGap = computed(() => normalizeUnits(gap.value || slideGap.value))
const _trackGap = computed(() => normalizeUnits(gap.value || trackGap.value))
const _offsetLast = computed(() => offsetLast.value === undefined ? modelValue.value != null && !center.value : offsetLast.value)
const _centerLast = computed(() => centerLast.value === undefined ? modelValue.value != null && center.value : centerLast.value)
const _centerFirst = computed(() => centerFirst.value === undefined ? modelValue.value != null && center.value : centerFirst.value)

provide('active', active)

let step = -1
let total = 0
let semaphor = true
let lastScrollLeft = 0
let semaphorTimeout

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

	let elements = component.value.querySelectorAll('.placeholder')
    total = elements.length
	if (!elements.length) {
		marginFirst.value = 0
		marginLast.value = 0
		return
	}
	
	if (_centerFirst.value) {
		marginFirst.value = (width.value - elements[0].offsetWidth) / 2
	}

	if (_centerLast.value) {
		marginLast.value = (width.value - elements[elements.length - 1].offsetWidth) / 2
	}

	if (_offsetLast.value) {
		marginLast.value = width.value - elements[elements.length - 1].offsetWidth
	}

	debug.value && console.log('Disabled:', track.value.childNodes.length, component.value.offsetWidth, component.value.scrollWidth, component.value.offsetWidth - component.value.scrollWidth - 200)
	disabled.value = component.value.offsetWidth >= component.value.scrollWidth - 200
	if (disabled.value) {
		marginLast.value = 0
	}

	updateNavigation()

	emit('layout', !disabled.value)

	calcProgress()
}

function updateNavigation() {
	if (component.value) {
		hasNext.value = component.value.scrollWidth - component.value.scrollLeft - width.value > 100
		hasPrev.value = component.value.scrollLeft > 100
	}
}

let resizeObserver = new ResizeObserver(debounce(() => {
	updateLayout()
	if (modelValue.value != null) {
		goTo(modelValue.value || 0, true)
	}
}, 100))
onMounted(() => {
	resizeObserver.observe(component.value)
	resizeObserver.observe(track.value)
	nextTick(updateLayout)
})
onBeforeUnmount(() => {
	resizeObserver.disconnect()
})

function toggleSnap(active) {
	if (active) {
		component.value.style['scroll-snap-type'] = snap.value ? 'x mandatory' : 'x proximity'
	} else {
		component.value.style['scroll-snap-type'] = 'none'
	}
}

let goToIndex
function goTo(index, force) {		
	return new Promise(resolve => {
		debug.value && console.log('Go to:', index, force, disabled.value)
		if (disabled.value) return
		if (!component.value) {
			goToIndex = index
			return
		}
	
		const elements = component.value.querySelectorAll('.track .placeholder')
		if (!elements.length) return
	
		index = Math.min(Math.max(index, 0), total - 1)
		const element = elements[index]
		if (goToIndex == index) return
	
		hasPrev.value = index > 0
		hasNext.value = index < elements.length - 1

		let offsetX = 0
		let x = element
		let endOffset = component.value.scrollWidth - 200 - element.offsetLeft - element.offsetWidth
		let minOffset = 0
		if (center.value) {
			let minOffset = (component.value.offsetWidth - element?.clientWidth) / 2
			offsetX = minOffset
			if (!_centerFirst.value && index == 0) offsetX = 0
			else if (!_centerLast.value) {
				minOffset = component.value.offsetWidth / 2 - element.offsetWidth
			}
		} else {
			if (!_offsetLast.value) {
				minOffset = component.value.offsetWidth - element.offsetWidth
			}
		}

		if (endOffset < minOffset && !_offsetLast.value && !_centerLast.value) {
			if (active.value > index) {
				return goTo(index - 1, force).then(resolve)
			}
			x = 'max'
			offsetX = 100
			hasNext.value = false
			goToIndex = -1
		} else {
			goToIndex = index
		}
		
		gsap.to(component.value, { 
			scrollTo: {
				autoKill: true,  
				x,
				offsetX
			}, 
			ease: "power2",
			duration: force ? 0 : duration.value,
			onComplete: async () => {
				updateNavigation()
				if (modelValue.value != null && modelValue.value != active.value) {
					await goTo(modelValue.value, force)
				}
				enforceBounds(force)
				resolve()
			}
		})
	})
}

onMounted(() => {
	nextTick(() => {
		if (goToIndex != undefined && modelValue.value == null) {
			const initalIndex = goToIndex
			goToIndex = undefined
			goTo(initalIndex)
		}
	})
})

function getActive() {
	if (!component.value) return

	const viewportCenter = width.value / 2
	let initialStep = step
	if (component.value.scrollLeft) {
		const elements = component.value.querySelectorAll('.track .placeholder')
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
        step = Math.max(Math.min(getActive() + direction, total - 1), 0)
        moving = setTimeout(() => {
            moving = null
        }, 100)
		return goTo(step)
    }
	return Promise.resolve()
}

let spinning
let wheelMoving
function onMouseWheel(e) {
	if (!component.value || disabled.value) return
	window.scrollCarouselId = componentId
	if (!captureScroll.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

	mouse.value = true

    if (moving) e.preventDefault()
	if (semaphor) {
		if (e.deltaY > 0 && component.value.scrollWidth - component.value.scrollLeft - component.value.offsetWidth > 101 ||
			e.deltaY < 0 && component.value.scrollLeft > 101) {
			if (!spinning) {
				move(Math.sign(e.deltaY))
			}
			e.preventDefault()
		}
	}
	
	clearTimeout(spinning)
	spinning = setTimeout(() => {
		spinning = undefined
		mouse.value = !!!('ontouchstart' in window)
	}, 80)
}

function onMouseMove(e) {
	toggleFocus()

	let deltaX = grabState.value.x - e.screenX
	if (grabbing.value) {
		if (deltaX != 0) {
			grabState.value.x = e.screenX
			component.value.scrollBy(deltaX, 0)
		}
	}
}

function onMouseEnter() {
	if (grabbing.value) {
		grabbing.value = false
		toggleGrab()
	}

    semaphorTimeout = setTimeout(() => semaphor = true, 200)
}

let grabbingTimeout
function onMouseDown({ screenX, screenY }) {
	if (disabled.value) return
	grabbingTimeout = setTimeout(() => {
		grabbing.value = true
	}, 50)

	toggleSnap(false)

	grabState.value = {
		x: screenX,
		y: screenY
	}
}

function onMouseUp() {
	clearTimeout(grabbingTimeout)
	grabbing.value = false
	if (disabled.value) return
	grabState.value = {}

	toggleGrab()
}

function onMouseLeave() {
	grabbing.value = false
	clearTimeout(grabbingTimeout)
	if (disabled.value) return
	toggleGrab()

    clearTimeout(semaphorTimeout)
	semaphor = false
}

function onTouchStart() {
	if (disabled.value) return

	toggleSnap(true)
	toggleFocus()
}

function toggleGrab() {
	if (mouse.value) {
		if (!grabbing.value) {
			goToIndex = -1
			const current = getActive()
			goTo(current)
		}
	}
}

function calcProgress() {
	progress.value = (component.value.scrollLeft - 100) / (component.value.scrollWidth - component.value.offsetWidth - 200)
	emit('progress', progress.value)
}

function enforceBounds(force) {
	debug.value && console.log('Enforce bounds:', progress.value)

	if (!mouse.value) return
	if (progress.value > 1) {
		gsap.to(component.value, {
			scrollTo: { 
				x: 'max', 
				autoKill: true, 
				offsetX: 100,
			}, 
			ease: "power2",
			duration: force ? 0 : .4,
		})
	} 
	else if (progress.value < 0) {
		gsap.to(component.value, {
			scrollTo: { 
				x: 100, 
				autoKill: true, 
			}, 
			ease: "power2",
			duration: force ? 0 : .4,
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

	active.value = getActive()
	if (!scrolling) {
		scrolling = waitForScrollEnd(component.value).then(() => {
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
	--carousel-width: calc(1px * v-bind(width));
	--carousel-height: calc(1px * v-bind(height));

	position: relative;
}
.scroller {
	--slide-gap: v-bind(_slideGap);
	--track-gap: v-bind(_trackGap);

	overflow-x: scroll;
	overflow-y: hidden;
	cursor: grab;
	display: flex;
	scroll-snap-type: x proximity;
	height: 100%;
	width: 100%;

	&.snap {
		scroll-snap-type: x mandatory;
	}

	&.auto-width {
		--slides-per-page: v-bind(slidesPerPage);
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
			z-index: 10;
			height: 100%;
			width: 100px;
		}
	}
	&.disabled {
		overflow: hidden;
		cursor: unset;

		.track {
			&::before, 
			&::after {
				display: none;
			}
		}
	}

	&.center {
		.track {
			gap: var(--slide-gap);
			&::after {
				margin-left: calc(-1 * var(--slide-gap));
			}

		}
	}

	&.center-last {
		.track {
			&::after {
				margin-left: 0;
			}
		}
	}
	
}
.overlay {
	z-index: 20;
	position: absolute;
	top: 0;
	left: 0;
	width: var(--carousel-width);
	height: var(--carousel-height);
	pointer-events: none;
}
::v-deep(.overlay) {
	button {
		pointer-events: all;
	}
}
</style>