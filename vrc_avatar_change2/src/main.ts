import { createApp } from "vue";
import App from "./App.vue";
// @ts-ignore
import vuetify from "./plugins/vuetify.js"; 

createApp(App).use(vuetify).mount("#app");
