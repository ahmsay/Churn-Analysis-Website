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
        <span v-if="notifications.length != 0">{{ notifications.length }}</span>
        <v-menu left offset-y max-height="232" :close-on-content-click="false">
          <v-btn icon flat dark slot="activator">
            <v-icon>notifications</v-icon>
          </v-btn>
          <v-list two-line>
            <v-list-tile v-if="notifications.length == 0">
              <span>You don't have any notification.</span>
            </v-list-tile>
            <v-list-tile v-for="(notification, idx) in notifications" :key="notification.modelname" @mouseover="showDeleteBtn = idx" @mouseout="showDeleteBtn = -1">
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-medium">{{ notification.modelname }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ notification.status == -1 ? 'Training failed.' : 'Training ongoing...' }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-btn v-if="notification.status == -1" :loading="loaders.remove && beingRemoved == notification.modelname" :disabled="loaders.remove && beingRemoved == notification.modelname" @click="removeNotification(notification)" icon small>
                <v-icon small color="darky">close</v-icon>
              </v-btn>
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
        this.checkStatus();
      }
      // eslint-disable-next-line
      EventBus.$once('refreshStatus', num => {
        this.checkStatus();
      });
    },
    data:() => ({
      beingRemoved: '',
      loaders: {
        remove: false
      },
      email: null,
      dialog: false,
      notifications: []
    }),
    methods: {
      checkStatus() {
        this.$post('/checkStatus', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          if (data.info == 0)
            this.notifications = [];
          else if (data.info == 1)
            this.notifications = data.statuslist;
        });
      },
      removeNotification(notification) {
        this.loaders.remove = true;
        this.beingRemoved = notification.modelname;
        this.$post('/removeModel', { username: this.$session.get('uname'), password: this.$session.get('passw'), modelname: notification.modelname }).then(data => {
          this.loaders.remove = false;
          this.beingRemoved = '';
          if (data.info == 1) {
            this.notifications.splice(this.notifications.indexOf(notification), 1);
          }
        });
      },
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
