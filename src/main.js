import { createApp } from 'vue'
import App from './App.vue'
import DragClick from './lib/drag-click'

createApp(App)
.directive('drag-click', DragClick)
.mount('#app')
