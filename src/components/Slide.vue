<template>
    <div 
        class="placeholder" 
        ref="placeholder" 
        :class="{ 
            active, 
            'auto-size': autoSize 
        }"
    >
        <div class="slide">
            <slot :active="active"></slot>
        </div>
    </div>
</template>
<script setup>
import { inject, onMounted, ref, watch, nextTick } from 'vue'

const activeIndex = inject('active')
const placeholder = ref(null)
const active = ref(false)

const props = defineProps({
	autoSize: {
		type: Boolean,
		default: false
	},
})

function toggleActive() {
    const index = [...placeholder.value?.parentNode.getElementsByClassName('placeholder')].indexOf(placeholder.value)
    active.value = index == activeIndex.value
}

watch(activeIndex, toggleActive)
onMounted(() => nextTick(toggleActive))
</script>
<style lang="less" scoped>

.placeholder {
    padding-left: var(--track-gap);
    flex-shrink: 0;
    flex-grow: 0;
    user-select: none;

    &:first-child {
        padding-left: var(--track-gap);
    }
    &:last-child {
        margin-right: 0;
        padding-right: var(--track-gap);
    }
    &:not(:first-child) {
        padding-left: var(--slide-gap);
    }

    .center & {
        &:first-child {
            margin-left: calc(-1 * var(--slide-gap));
            .slide {
                scroll-snap-align: start;
            }
        }
        &:last-child {
            padding-right: calc(1 * var(--track-gap));
            margin-right: 0;
            .slide {
                scroll-snap-align: end;
            }

        }
        &:not(:first-child):not(:last-child) {
            padding-left: 0;
            margin-left: 0;
        }
        &:not(:first-child) {
            padding-left: unset;
        }
    }

    .center-first & {
        &:first-child {
            padding-left: unset;
            margin-left: calc(var(--margin-first) - var(--slide-gap));
            .slide {
                scroll-snap-align: center;
            }

        }
	}

    .center-last & {
        &:last-child {
            margin-right: calc(var(--margin-last) - var(--slide-gap));
            padding-right: unset;
            .slide {
                scroll-snap-align: center;
            }

        }
    }

    .offset-last & {
        &:last-child {
            margin-right: calc(var(--margin-last) + var(--slide-gap));
            padding-right: unset;
            .slide {
                scroll-snap-align: start;
            }
        }
    }

    .auto-width & {
        .slide {
			width: calc((var(--carousel-width) - 2 * var(--track-gap) - (var(--auto-width) - 1) * var(--slide-gap)) / var(--auto-width));
        }
    }
    .auto-height & {
        .slide {
            height: 100%;
        }
    }
}
.slide {
    scroll-snap-align: start;
    .center & {
        scroll-snap-align: center;
    }

    :deep(img, video) {
        pointer-events: none;
    }
}
</style>