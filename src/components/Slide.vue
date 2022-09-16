<template>
    <div class="placeholder" ref="placeholder" :class="{ active }">
        <div class="slide">
            <slot :active="active"></slot>
        </div>
    </div>
</template>
<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const activeIndex = inject('active')
const placeholder = ref(null)
const active = ref(false)

function toggleActive() {
    const index = [...placeholder.value.parentNode.getElementsByClassName('placeholder')].indexOf(placeholder.value)
    active.value = index == activeIndex.value
}

watch(activeIndex, toggleActive)
onMounted(toggleActive)
</script>
<style lang="less" scoped>
.placeholder {
    padding-left: var(--track-gap);
    flex-shrink: 0;
    flex-grow: 0;

    .snap & {
        scroll-snap-align: start;
    }

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

    .center & {
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

    .center-first & {
        &:first-child {
            scroll-snap-align: center;
            padding-left: unset;
            margin-left: calc(var(--margin-first) - var(--slide-gap));
        }
	}

    .center-last & {
        &:last-child {
            scroll-snap-align: center;
            margin-right: calc(var(--margin-last) - var(--slide-gap));
            padding-right: unset;
        }
    }

    .offset-last & {
        &:last-child {
            scroll-snap-align: start;
            margin-right: var(--margin-last);
            padding-right: unset;
        }
    }

    .auto-width & {
        .slide {
            width: calc((var(--carousel-width) - 2 * var(--track-gap) - (var(--slides-per-page) - 1) * var(--slide-gap)) / var(--slides-per-page));
        }
    }
}
</style>