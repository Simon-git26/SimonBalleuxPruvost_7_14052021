import 'bootstrap/scss/bootstrap.scss'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Notifications from 'vue-notification'
import Bus from './bus'

Vue.config.productionTip = false
Vue.use(Notifications)

new Vue({
  data() {
    return {
      user: null,
    }
  },

  mounted() {
    Bus.$on('connected', user => {
      console.log(user);
      this.user = user;
    })
    
    Bus.$on('disconnected', () => {
      localStorage.removeItem("token");
    })
  },

  router,
  render: h => h(App)
}).$mount('#app')
