<template>
    <div class="wheel" ref="component">
        <carousel 
            ref="overflowCarousel"
            :capture-scroll="captureScroll" 
            :center="true" 
            :center-first="true"
            :center-last="true"
            :overlay="true"
            :duration="duration"
            @progress="onProgress"
        >
            <template #overlay="navigation">
                <div class="view">
                    <div class="circle" ref="circle">
                        <slot 
                            :scroller="navigation.scroller" 
                            :active="navigation.active" 
                            :progress="navigation.progress" 
                            :scrollDirection="navigation.scrollDirection"
                        ></slot>
                    </div>
                </div>
                <div class="controls" v-if="overlay">
                    <slot 
                        name="overlay" 
                        :scroller="navigation.scroller" 
                        :active="navigation.active" 
                        :progress="navigation.progress" 
                        :scrollDirection="navigation.scrollDirection" 
                        :next="navigation.next" 
                        :prev="navigation.prev" 
                        :hasPrev="navigation.hasPrev"
                        :hasNext="navigation.hasNext"
                    ></slot>
                </div>
            </template>
            <slide v-for="(item, index) in info" :key="index">
                <div class="item" :style="{
                    '--item-width': item.width,
                    '--item-height': item.height
                }"></div>
            </slide>
        </carousel>
    </div>
</template>
<script setup>
import { ref, toRefs, onMounted, watch, provide, onBeforeUnmount } from 'vue'
import Carousel from './Carousel.vue'
import Slide from './Slide.vue'
import Segment from './Segment.vue'
import { gsap } from 'gsap'
import debounce from 'debounce'

const props = defineProps({
    captureScroll: {
      type: Boolean,
      default: true,
    },
	duration: {
      type: Number,
      default: .2,
    },
    radius: {
        type: Number,
        default: 3000
    },
	overlay: {
      type: Boolean,
      default: false,
    },
    items: {
        type: Array,
        default: []
    }
})

const { radius, duration } = toRefs(props)
const component = ref(null)
const overflowCarousel = ref(null)
const circle = ref(null)
const info = ref([])
const minHeight = ref(0)
const bottomGap = ref(0)

provide('info', info)
defineExpose({ 
    goTo(index, force) {
        overflowCarousel.value.goTo(index, force)
    }
})

function onProgress(progress) {
    const minRotation = info.value[0].rotation
    const maxRotation = info.value[info.value.length - 1].rotation

    gsap.to(circle.value, { 
        ease: "power2",
        duration: duration.value,
        rotation: -1 * (maxRotation - minRotation) * progress,
        overwrite: true
    })
}

function updateLayout() {
    if (!component.value) return

    minHeight.value = 0
    const segments = component.value.getElementsByClassName('segment')
    let index = 0
    let rotation = 0
   
    for (const segment of segments) {
        const angle = 180 * segment.offsetWidth / (Math.PI * (radius.value - segment.offsetHeight))
        const halfAngle = angle / 2
        if (index == 0) {
            rotation -= halfAngle
        }
        rotation += halfAngle
        info.value[index] = {
            rotation,
            start: rotation - halfAngle,
            end: rotation + halfAngle,
            width: Math.sin(halfAngle * Math.PI / 180) * 2 * radius.value,
            height: segment.offsetHeight,
            translation: radius.value - Math.sqrt(Math.pow(radius.value, 2) - Math.pow(segment.offsetWidth / 2, 2))
        }
        segment.style.setProperty('--rotation', info.value[index].rotation + 'deg')
        segment.style.setProperty('--translation', info.value[index].translation + 'px')
        rotation += halfAngle

        const currentHeight = segment.offsetHeight + info.value[index].translation * 2
        if (currentHeight > minHeight.value) {
            minHeight.value = currentHeight
        }
        index++

        segment.setAttribute('ready', '')
    }
    const internalRadius = radius.value - minHeight.value
    bottomGap.value = (internalRadius - Math.sqrt(Math.pow(internalRadius, 2) - Math.pow(component.value.offsetWidth / 2, 2)))
}

let mutationObserver = new MutationObserver(debounce(updateLayout, 100))
onMounted(() => {
    updateLayout()
    mutationObserver.observe(circle.value, {
        childList: true
    })
})
watch(radius, updateLayout)

onBeforeUnmount(() => {
    mutationObserver.disconnect()
})

</script>
<style lang="less" scoped>
.wheel {
    --radius: calc(v-bind(radius) * 1px);
    --diameter: calc(v-bind(radius) * 2px);
    
    padding-bottom: calc(v-bind(bottomGap) * 1px);
    overflow: hidden;

    .carousel {
        min-height: calc(v-bind(minHeight) * 1px);;
    }

    .view {
        width: 100%;
        height: 100%;
    }

    .circle {
        width: var(--diameter);
        height: var(--diameter);
        position: relative;

        left: 50%;
        transform: translateX(-50%);
        will-change: transform;

        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }

        ::v-deep(.segment) {
            position: absolute;
            top: 0;
            left: calc(50%);
            transform-origin: center var(--radius);
            transform: translateX(-50%) rotate(var(--rotation)) translateY(var(--translation));
            visibility: hidden;
            &[ready] {
                visibility: visible;
            }
        }
    }

    .item {
        width: calc(var(--item-width) * 1px);
        height: calc(var(--item-height) * 1px);
    }
}
</style>