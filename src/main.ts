import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { focusDirective } from './directives/focus'
import { clearLegacyServiceWorker } from './utils/clearLegacyServiceWorker'
import './style.css'

clearLegacyServiceWorker()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('focus', focusDirective)
app.mount('#app')
