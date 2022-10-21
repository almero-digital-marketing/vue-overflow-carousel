<template>
    <div class="segment" ref="component" :class="{ active }">
        <slot :active="active"></slot>
    </div>
</template>
<script setup>
import { inject, onMounted, ref, watch } from 'vue'

const activeIndex = inject('active')
const component = ref(null)
const active = ref(false)

function toggleActive() {
    const index = [...component.value.parentNode.getElementsByClassName('segment')].indexOf(component.value)
    active.value = index == activeIndex.value
}

watch(activeIndex, toggleActive)
onMounted(toggleActive)
</script>