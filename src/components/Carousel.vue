<template>
	<div class="carousel" 
		:style="{
			['--margin-first']: marginFirst + 'px',
			['--margin-last']: marginLast + 'px',
		}"
		:class="{ grabbing, mouse, center, enabled, ['center-first']: centerFirst, ['center-last']: centerFirst }" 
		ref="component"
		v-drag-scroll.x="mouse && enabled" 
		@scroll.passive="scroll"
		@mousewheel="wheel" 
		@mousedown="mousedown" 
		@mouseup="grab(false)" 
		@mouseleave="mouseleave"
		@touchstart="touchstart"
		@touchend="touchend">
		<div class="track" ref="track">
			<slot :scroller="component" :active="active"></slot>
		</div>
	</div>
</template>
<script setup>
import { ref, onUpdated, onMounted, onUnmounted, toRefs, watch } from 'vue'
import vDragScroll from "vue-dragscroll/src/directive-next"
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    captureScroll: {
      type: Boolean,
      default: true,
    },
	modelValue: {
      type: Number,
      default: 0,
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
})
defineExpose({ goTo })

const componentId = Date.now()

const { modelValue, captureScroll, center, enabled, duration, gap } = toRefs(props)

const component = ref(null)
const track = ref(null)
const grabbing = ref(false)
const mouse = ref(!!!('ontouchstart' in window))

const marginFirst = ref(0)
const marginLast = ref(0)

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
	let slideElements = component.value.querySelectorAll('.slide')
    total = slideElements.length
	
	if (props.center && props.centerFirst) {
		marginFirst.value = (component.value.offsetWidth - slideElements[0].offsetWidth)/2
	}

	if (props.center && props.centerLast) {
		marginLast.value = (component.value.offsetWidth - slideElements[slideElements.length - 1].offsetWidth)/2
	}
}
onMounted(setTotal)
onUpdated(setTotal)

let moveTimeout
function goTo(index, force) {
	index = Math.min(Math.max(index, 0), total)
	if (!component.value) return

	const elements = component.value.querySelectorAll('.slide')
	const element = elements[index]
	gsap.set(component.value, {
		scrollSnapType: 'none'
	})
	if (!center.value) {
		gsap.to(component.value, { 
			scrollTo: {
				autoKill: true,  
				x: element,
			}, 
			ease: "power2",
			duration: force ? 0 : duration.value ,
			onComplete() {
				gsap.set(component.value, {
					scrollSnapType: 'revert'
				})
			}
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
			onComplete() {
				gsap.set(component.value, {
					scrollSnapType: 'revert'
				})
			}
		})
	}
}

function getActive() {
	if (!component.value) return

	const viewportCenter = component.value.offsetWidth / 2
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
	window.scrollCarouselId = componentId
	if (!captureScroll.value || !enabled.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

	mouse.value = true

    if (moveTimeout) e.preventDefault()
    if (e.deltaY > 0 && component.value.scrollWidth - component.value.scrollLeft - 1 > component.value.offsetWidth) e.preventDefault()
    if (e.deltaY < 0 && component.value.scrollLeft > 0) {
		e.preventDefault()
	}
	if (semaphor) move(Math.sign(e.deltaY))
	
	clearTimeout(wheelTimeout)
	wheelTimeout = setTimeout(() => {
		mouse.value = !!!('ontouchstart' in window)
	}, 200)
}

function mousedown() {
	window.scrollCarouselId = componentId
	grab(true)
}

function mouseleave() {
	window.scrollCarouselId = 0
	grab(false)
}

function touchstart() {
	window.scrollCarouselId = componentId
}

function touchend() {
	window.scrollCarouselId = 0
}

const active = ref(props.modelValue)
function toggleActive(current) {
	const elements = component.value.querySelectorAll('.slide')
	if (elements[current]?.classList.contains('active')) return
	for (let index = 0; index < elements.length; index++) {
		if (index != current) {
			elements[index].classList.remove('active')
		} else {
			elements[index].classList.add('active')
		}
	}
	active.value = current
}
onMounted(() => toggleActive(props.modelValue))

watch(modelValue, () => {
	const current = getActive()
	if (window.scrollCarouselId != componentId && current != modelValue.value) {
		// console.log(modelValue.value)
		goTo(modelValue.value)
	}
})

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

let lastScrollLeft = 0
function scroll(e) {
	if (!component.value) return

	if (component.value.scrollLeft > lastScrollLeft) {
		scrollDirection = 1
	} else {
		scrollDirection = -1
	}
	lastScrollLeft = component.value.scrollLeft

	const current = getActive()
	if (current != modelValue.value && window.scrollCarouselId == componentId) {
		emit('update:modelValue', current)
	}
	toggleActive(current)
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
			height: 1px;
			flex-shrink: 0;
			flex-grow: 0;
			display: block;
			width: 80px;
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
		flex-shrink: 0;
		&:first-child {
			margin-left: var(--margin-first);
			scroll-snap-align: start;
			padding-left: v-bind(gap);
		}
		&:last-child {
			margin-left: var(--margin-last);
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
}
</style>