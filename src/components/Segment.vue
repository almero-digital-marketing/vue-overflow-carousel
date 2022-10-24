<template>
    <div class="segment" ref="component" :class="{ 
        active,
        'segment-in': segmentInfo.inProgress > 0,
        'segment-out': segmentInfo.outProgress > 0,
    }">
        <slot :active="active" :info="segmentInfo"></slot>
    </div>
</template>
<script setup>
import { inject, onMounted, ref, watch, computed } from 'vue'

const activeIndex = inject('active')
const component = ref(null)
const active = ref(false)
const info = inject("info")

const index = computed(() => {
    if (component.value) {
        const index = [...component.value.parentNode.getElementsByClassName('segment')].indexOf(component.value)
        return index
    }
})

const segmentInfo = computed(() => info.value[index.value] || {})

function toggleActive() {
    active.value = index.value == activeIndex.value
}

watch(activeIndex, toggleActive)
onMounted(toggleActive)
</script>