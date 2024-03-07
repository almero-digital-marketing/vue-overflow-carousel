<template>
    <div class="deck" ref="component">
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
                    <div class="cards" ref="card">
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
                }" v-drag-click="() => onClick(index)"></div>
            </slide>
        </carousel>
    </div>
</template>
<script setup>
import { ref, toRefs, onMounted, provide, onBeforeUnmount, nextTick } from 'vue'
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
	overlay: {
      type: Boolean,
      default: false,
    },
    items: {
        type: Array,
        default: []
    }
})

const { duration } = toRefs(props)
const component = ref(null)
const overflowCarousel = ref(null)
const card = ref(null)
const info = ref([])
const minHeight = ref(0)

provide('info', info)
defineExpose({ 
    goTo(index, force) {
        overflowCarousel.value.goTo(index, force)
    }
})

function onClick(index) {
    const segments = component.value.getElementsByClassName('segment')
    segments[index].click()
}

function onProgress(progress) {
    if (!component.value) return
    
    const segments = Array.from(component.value.getElementsByClassName('segment'))
    const inOutAnimations = []
    for (let index = 0; index < segments.length; index++) {
        let cardProggress = 0
        inOutAnimations[index] = inOutAnimations[index] || {
            '--progress-card-in': 1,
            overwrite: true
        }

        if (progress > info.value[index].start && progress <= info.value[index].end || 
            progress < 0 && index == 0 ||
            progress > 1 && index == segments.length.length - 1) {
            cardProggress = (progress - info.value[index].start) / (info.value[index].end - info.value[index].start)
        } else if ( progress > info.value[index].end) {
            cardProggress = 1
        }

        info.value[index].outProgress = cardProggress
        inOutAnimations[index]['--progress-card-out'] = cardProggress
        if (index == 0) {
            info.value[index].inProgress = 1
        }
        if (index < segments.length - 1) {
            info.value[index + 1].inProgress = cardProggress
            inOutAnimations[index + 1] = {
                overwrite: true,
                '--progress-card-in': cardProggress
            }
        }
    }
    for (let index = 0; index < segments.length; index++) {
        gsap.to(segments[index], inOutAnimations[index])
    }
}

function updateLayout() {
    if (!component.value) return

    minHeight.value = 0
    const segments = Array.from(component.value.getElementsByClassName('segment'))

    let segmentsWidth = 0
    for (let index = 0; index < segments.length; index++) {
        info.value[index] = {
            width: segments[index].offsetWidth,
            height: segments[index].offsetHeight,
        }
        if (index == 0 || index == segments.length - 1) {
            segmentsWidth += segments[index].offsetWidth / 2
        } else {
            segmentsWidth += segments[index].offsetWidth
        }
        minHeight.value = Math.max(minHeight.value, segments[index].offsetHeight)
        segments[index].style.zIndex = segments.length + 1 - index
        segments[index].setAttribute('ready', '')
    }

    let stickiness = 0
    for (let index = 0; index < segments.length - 1; index++) {
        const stick = (segments[index].offsetWidth / 2 + segments[index + 1].offsetWidth / 2) / segmentsWidth
        info.value[index].start = stickiness
        info.value[index].end = stickiness + stick
        stickiness += stick
    }
    info.value[segments.length - 1].start = 1
    info.value[segments.length - 1].end = 1 + segments[segments.length - 1].offsetWidth / segmentsWidth

}

let mutationObserver = new MutationObserver(debounce(updateLayout, 100))
onMounted(() => {
    nextTick(() => {
        updateLayout()
        mutationObserver.observe(card.value, {
            childList: true
        })
    })
})

onBeforeUnmount(() => {
    mutationObserver.disconnect()
})

</script>
<style lang="less" scoped>
.deck {
    overflow: hidden;

    .carousel {
        height: calc(v-bind(minHeight) * 1px);
    }

    .view {
        width: 100%;
        height: 100%;
    }

    .cards {
        width: 100%;
        height: 100%;
        position: relative;

        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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