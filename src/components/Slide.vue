<template>
    <div class="slide">
        <slot></slot>
    </div>
</template>
<style lang="less" scoped>
.slide {
    scroll-snap-align: start;
    .center & {
        scroll-snap-align: center;
    }
    &:first-child {
        scroll-snap-align: start;
    }
    &:last-child {
        scroll-snap-align: end;
    }
}
</style>