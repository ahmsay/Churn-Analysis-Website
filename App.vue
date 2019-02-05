<template>
  <v-app>
    <v-toolbar v-if="!this.$session.has('uname')" flat></v-toolbar>
    <v-toolbar v-if="this.$session.has('uname')" class="darky" app dark flat>
      <v-icon>album</v-icon>
      <v-toolbar-title>
        <span class="headline">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="this.$session.has('uname')">
        <v-menu left offset-y max-height="230">
          <v-btn icon flat dark slot="activator">
            <v-icon>notifications</v-icon>
          </v-btn>
          <v-list two-line>
            <v-list-tile v-if="statuslist.length == 0">
              <span>You don't have any notification.</span>
            </v-list-tile>
            <v-list-tile v-for="status in statuslist" :key="status.modelname">
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-medium">{{ status.modelname }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ status.detail }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu left offset-y min-width="175">
          <v-btn icon flat dark slot="activator">
            <v-icon>account_circle</v-icon>
          </v-btn>
          <v-list class="py-0">
            <v-list-tile>
              <span class="font-weight-bold">{{ this.$session.get('uname') }}</span>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile @click="showHelp">Help</v-list-tile>
            <v-list-tile @click="showSettings">Settings</v-list-tile>
            <v-list-tile @click="logout">Logout</v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>

    <v-content class="background">
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  import { EventBus } from "./plugins/event-bus.js";

  export default {
    name: 'App',
    created() {
      if (this.$session.has("uname")) {
        this.$post('/checkStatus', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          this.statuslist = data.statuslist;
        });
      }
      // eslint-disable-next-line
      EventBus.$once('refreshStatus', num => {
        this.$post('/checkStatus', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          this.statuslist = data.statuslist;
        });
      });
    },
    data:() => ({
      email: null,
      dialog: false,
      statuslist: []
    }),
    methods: {
      showHelp() {

      },
      showSettings() {

      },
      logout() {
        this.email = null;
        this.$session.remove("uname");
        this.$session.remove("passw");
        this.$router.push('/');
      }
    }
  }
</script>
