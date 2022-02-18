import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from '@/router/index'
import { showMessageBox } from '@/utils/index'

import '@/assets/common.scss'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)
app.config.globalProperties.showMessageBox = showMessageBox 

app
  .use(ElementPlus)
  .use(router)
  .mount('#app')
