<template>
	<div class="carousel focus-manager">
		<div 
			class="scroller" 
			:style="{
				'--margin-first': marginFirst + 'px',
				'--margin-last': marginLast + 'px',
			}"
			:class="{ 
				disabled,
				grabbing, 
				center,
				'auto-width': autoWidth,
				'auto-height': autoHeight,
				'center-first': _centerFirst, 
				'center-last': _centerLast, 
				'offset-last': _offsetLast, 
				'direction-none': scrollDirection == 0, 
				'direction-forward': scrollDirection == 1, 
				'direction-backward': scrollDirection == -1,
				'has-prev': hasPrev,
				'has-next': hasNext,
			}" 
			ref="scroller"
			@scroll="onScroll"
			@mousewheel="onMouseWheel" 
		>
			<div 
				class="track" 
				ref="track"
			>
				<slot 
					:scroller="scroller" 
					:active="active" 
					:progress="progress" 
					:scrollDirection="scrollDirection"
				></slot>
			</div>
		</div>
		<div class="overlay" v-if="overlay">
			<slot name="overlay" 
				:scroller="scroller" 
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
import { ref, onMounted, toRefs, watch, onBeforeUnmount, provide, computed, nextTick } from 'vue'
import debounce from 'debounce'
import { useScrollingManager } from '../lib/scrolling-manager'
import { useFocusManager } from '../lib/focus-manager'
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
	autoWidth: {
		type: [String, Number],
		default: 0
	},
	autoHeight: {
		type: Boolean,
		default: false
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

const scroller = ref(null)
const { modelValue, captureScroll, center, gap, slideGap, trackGap, centerFirst, centerLast, offsetLast, snap, debug } = toRefs(props)
const { hasFocus } = useFocusManager()
const { onScrollEnd, grabbing } = useScrollingManager(scroller)

const track = ref(null)
const width = ref(0)
const height = ref(0)
const disabled = ref(false)

const marginFirst = ref(0)
const marginLast = ref(0)
const active = ref(0)
const progress = ref(0)
const scrollDirection = ref(0)

const hasPrev = ref(false)
const hasNext = ref(true)

function next(count, force) {
	const step = active.value + (count || 1)
	return goTo(step, force)
}

function prev(count, force) {
	const step = Math.max(active.value - (count || 1), 0)
	return goTo(step, force)
}

defineExpose({ 
	goTo(index, force) {
		goTo(index, force)
	},
	next,
	prev,
	hasPrev,
	hasNext
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
let lastScroll = 0
let duration = .4

function updateLayout() {
	if (!scroller.value) return

	width.value = scroller.value.offsetWidth
	height.value = scroller.value.offsetHeight

	let elements = scroller.value.querySelectorAll('.placeholder')
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

	debug.value && console.log('Layout:', track.value.childNodes.length, scroller.value.offsetWidth, scroller.value.scrollWidth, scroller.value.offsetWidth - scroller.value.scrollWidth - 200)
	disabled.value = scroller.value.offsetWidth >= scroller.value.scrollWidth - 200
	if (disabled.value) {
		marginLast.value = 0
	}

	emit('layout', !disabled.value)
}

const onResize = () => {	
	updateLayout()

	if (modelValue.value != null) {
		goTo(modelValue.value || 0, true)
	} else {
		goTo(0, true)
	}
}

let resizeObserver = new ResizeObserver(debounce(onResize, 200))
onMounted(() => {
	nextTick(() => {
		resizeObserver.observe(scroller.value)
		resizeObserver.observe(track.value)
		updateLayout()
	})
})

onBeforeUnmount(() => {
	resizeObserver.disconnect()
})

let lastActive
function goTo(index, force) {
	return new Promise(resolve => {
		if (!scroller.value || disabled.value) return resolve()
		debug.value && console.log('Go to:', index, force, disabled.value)
	
		const elements = scroller.value.querySelectorAll('.track .placeholder')
		if (!elements.length) return resolve()
	
		index = Math.min(Math.max(index, 0), elements.length - 1)
		const element = elements[index]
		const slide = element.querySelector('.slide')
	
		const trackOffset = elements[0].querySelector('.slide').offsetLeft

		let offsetX = 0
		let x = slide
		let endOffset = scroller.value.scrollWidth - 200 - element.offsetLeft - element.offsetWidth
		let minOffset = 0
		if (center.value) {
			let minOffset = (scroller.value.offsetWidth - slide.clientWidth) / 2
			offsetX = minOffset
			if (!_centerFirst.value && index == 0) {
				offsetX = trackOffset - 100
			} else if (!_centerLast.value) {
				minOffset = scroller.value.offsetWidth / 2 - slide.offsetWidth
			}
		} else {
			if (!_offsetLast.value) {
				minOffset = scroller.value.offsetWidth - element.offsetWidth
			}
			if (_trackGap.value) {
				offsetX = trackOffset - 100
			}
		}

		if (endOffset < minOffset && !_offsetLast.value && !_centerLast.value) {
			if (active.value > index) {
				return goTo(index - 1, force).then(resolve)
			}
			x = 'max'
			offsetX = 100
			hasNext.value = false
		}

		const tween = gsap.to(scroller.value, { 
			scrollTo: {
				autoKill: true,  
				x,
				offsetX
			}, 
			ease: "power2",
			duration: force ? 0 : duration,
		})

		const complete = (wait) => {
			setTimeout(() => {
				if (!tween.isActive()) {
					resolve()
				} else {
					complete(100)
				}
			}, force ? 0 : wait)
		}
		complete(100 + duration * 1000)

	})
}

function getActive() {
	if (!scroller.value) return

	const viewportCenter = width.value / 2
	let initialStep = step
	const elements = scroller.value.querySelectorAll('.track .placeholder .slide')
	if (!elements.length) return
	const firstElement = elements[0]
	const lastElement = elements[elements.length - 1]

	if (scroller.value.scrollLeft <= 100 + firstElement.offsetWidth * .1) {
		initialStep = 0
	} else if (scroller.value.scrollWidth - scroller.value.scrollLeft - scroller.value.offsetWidth <= 100 + lastElement.offsetWidth * .1) {
		initialStep = elements.length - 1
	} else {
		const firstElementStart = firstElement.getBoundingClientRect().x - scroller.value.getBoundingClientRect().x
		let trackOffset = 0

		for (let index = 0; index < elements.length; index++) {
			const element = elements[index]
			const elementStart = element.getBoundingClientRect().x - scroller.value.getBoundingClientRect().x
			const elementEnd = elementStart + element.offsetWidth
			const elementInsideStart = elementStart + (elementEnd - elementStart) * .25
			const elementInsideEnd = elementStart + (elementEnd - elementStart) * .75

			if (center.value) {
				const next = Math.max(0, Math.min(index + scrollDirection.value, elements.length - 1))
				const nextElement = elements[next]
				const nextElementStart = nextElement.getBoundingClientRect().x - scroller.value.getBoundingClientRect().x
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
				if (_trackGap.value) {
					trackOffset = elements[0].offsetLeft - 100
				}

				if (scrollDirection.value > 0 && elementStart >= 0) {
					initialStep = index
					break
				}
				if (scrollDirection.value < 0 && elementEnd > trackOffset) {
					initialStep = index
					break
				}
				if (scrollDirection.value > 0 && index == elements.length - 1) {
					initialStep = index
					break
				}
			}
		}

		if (initialStep == -1) {
			if (firstElementStart > trackOffset) {
				initialStep = 0
			} else {
				initialStep = elements.length - 1
			}
		}
	}
	
	hasPrev.value = initialStep > 0
	hasNext.value = initialStep < elements.length - 1

	return initialStep
}

function onScroll() {
	if (!scroller.value) return

	if (scroller.value.scrollLeft > lastScroll) {
		scrollDirection.value = 1
	} else if (scroller.value.scrollLeft < lastScroll) {
		scrollDirection.value = -1
	} else {
		scrollDirection.value = 0
	}
	lastScroll = scroller.value.scrollLeft

	active.value = getActive()
	progress.value = (scroller.value.scrollLeft - 100) / (scroller.value.scrollWidth - scroller.value.offsetWidth - 200)
	
	emit('progress', progress.value)

	if (lastActive != active.value) {
		lastActive = active.value
		emit('change', active.value)
		if (hasFocus()) {
			emit('update:modelValue', active.value)
		}
	}
}

if(snap.value) {
	onScrollEnd(async () => {
		debug.value && console.log('Scroll end')
		if (!disabled.value && hasFocus()) {
			const index = getActive()	
			await goTo(index)
		}
	})
}

let spinning
function onMouseWheel(e) {
	if (!scroller.value || disabled.value) return
	
	if (!captureScroll.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

	const current = getActive()
    if (spinning) {
		debug.value && console.log('Spinning:', spinning, total, current)
		return e.preventDefault()
	} 
	if (hasFocus()) {
		if (e.deltaY > 0 && current < total - 1 ||
			e.deltaY < 0 && current > 0) {
			spinning = true
			setTimeout(() => {
				spinning = false
				debug.value && console.log('Spinning:', spinning)
			}, 300)
			e.preventDefault()

			let step = current + Math.sign(e.deltaY)
			debug.value && console.log('Spin:', step)
			goTo(step)
		}
	}
}

watch(modelValue, () => {
	if (!hasFocus()) {
		if (modelValue.value < 0) {
			emit("update:modelValue", 0)
    	} else if (modelValue.value > total - 1){
			emit("update:modelValue", total - 1)
		} else if (modelValue.value != getActive()){
			goTo(modelValue.value)
		} 
	}
})

</script>
<style lang="less" scoped>
.carousel {
	--carousel-width: calc(1px * v-bind(width));
	--carousel-height: calc(1px * v-bind(height));

	position: relative;
	flex-shrink: 1;
	flex-grow: 1;
	display: flex;
}
.scroller {
	--slide-gap: v-bind(_slideGap);
	--track-gap: v-bind(_trackGap);
	--auto-width: v-bind(autoWidth);

	overflow-x: scroll;
	overflow-y: hidden;
	cursor: grab;
	display: flex;
	height: 100%;
	width: 100%;
	scroll-padding: var(--track-gap);

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