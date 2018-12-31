<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>Churn</span>
        <span class="font-weight-light"> | General Kenobi</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="test">Test {{ val }}</v-btn>
      <v-dialog persistent v-model="dialog" width="500">
        <v-btn slot="activator">Click Me</v-btn>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Info</v-card-title>
          <v-card-text>You are awesome now.</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">I accept</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-if="loggedIn">
        <span>Welcome <b>{{ email }}</b></span>
        <v-btn @click="logout">Logout</v-btn>
      </div>
    </v-toolbar>

    <v-content>
      <router-view style="padding-bottom: 80px"></router-view>
    </v-content>

  </v-app>
</template>

<script>
import {EventBus} from "./plugins/event-bus.js";

  export default {
    name: 'App',
    created() {
      EventBus.$on('logged', email => {
        this.email = email;
        this.loggedIn = true;
      });
    },
    data:() => ({
      val: '',
      email: null,
      loggedIn: false,
      dialog: false
    }),
    methods: {
      test() {
        /*this.$get('/').then(data => {
          this.val = data['message'];
        })*/
      },
      logout() {
        this.loggedIn = false;
        this.email = null;
        this.$router.push('/');
      }
    } 
  }
</script>