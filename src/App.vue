<template>
  <v-app>
    <v-toolbar v-if="!this.$session.has('uid') && !($vuetify.breakpoint.name == 'xs' || $vuetify.breakpoint.name == 'sm')" flat></v-toolbar>
    <v-toolbar v-if="this.$session.has('uid')" class="darky" app dark flat>
      <v-icon>album</v-icon>
      <v-toolbar-title>
        <span class="headline">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="this.$session.has('uid')">
        <span v-if="notifications.length != 0">{{ notifications.length }}</span>
        <v-menu left offset-y max-height="232" :close-on-content-click="false">
          <v-btn icon flat dark slot="activator">
            <v-icon>notifications</v-icon>
          </v-btn>
          <v-list two-line>
            <span class="px-3 py-2" v-if="notifications.length == 0">You don't have any notification.</span>
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
            <v-list-tile @click="dialogs[0].show = true">Help</v-list-tile>
            <v-dialog v-model="dialogs[0].show" max-width="600px">
              <v-card>
                <v-card-title class="help white--text">
                  <v-icon color="white" class="mr-3">help</v-icon>
                  <span class="title font-weight-light">Help</span>
                </v-card-title>
                <v-card-text>
                  <div class="mb-3" v-for="content in helpContent" :key="content.title">
                    <span class="subheading font-weight-medium">{{ content.title }}</span>
                    <v-divider></v-divider>
                    <span>{{ content.text }}</span>
                  </div>
                  <span></span>
                </v-card-text>
                <v-layout justify-end class="pr-2 pb-2">
                  <v-btn class="help white--text" @click="dialogs[0].show = false">Close</v-btn>
                </v-layout>
              </v-card>
            </v-dialog>
            <v-list-tile @click="getUserInfo">Settings</v-list-tile>
            <v-dialog v-model="dialogs[1].show" max-width="600px" persistent>
              <v-card>
                <v-card-title class="settings white--text">
                  <v-icon color="white" class="mr-3">settings</v-icon>
                  <span class="title font-weight-light">Settings</span>
                </v-card-title>
                <v-card-text>
                  <span class="subheading font-weight-medium">User Plan</span>
                  <v-divider></v-divider>
                  <p class="mt-3">You can upload <b>{{ userInfo.columnsInfos }}</b> more datasets, send <b>{{ userInfo.train }}</b> more requests for training and make <b>{{ userInfo.predict }}</b> prediction requests.</p>
                  <span>You can change your user plan here.</span>
                  <v-radio-group v-model="userInfo.usertype">
                    <v-radio label="Beginner" value="Beginner" color="settings"></v-radio>
                    <v-radio label="Hobbyist" value="Hobbyist" color="settings"></v-radio>
                    <v-radio label="Professional" value="Professional" color="settings"></v-radio>
                  </v-radio-group>
                </v-card-text>
                <v-layout justify-end class="pr-2 pb-2">
                  <v-btn class="mr-0" flat @click="cancelUserPlan">Cancel</v-btn>
                  <v-btn class="settings white--text" @click="saveUserPlan">Save</v-btn>
                </v-layout>
              </v-card>
            </v-dialog>
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
  import { auth } from './plugins/fb';
  import db from './plugins/fb';

  export default {
    name: 'App',
    created() {
      if (this.$session.has("uid")) {
        this.checkStatus();
      }
      // eslint-disable-next-line
      EventBus.$on('refreshStatus', num => {
        this.checkStatus();
      });
    },
    data:() => ({
      userInfo: {
        usertype: 'Beginner',
        columnsInfos: 0,
        train: 0,
        predict: 0
      },
      beingRemoved: '',
      loaders: {
        remove: false
      },
      notifications: [],
      dialogs: [{ name: 'help', show: false }, { name: 'settings', show: false }],
      helpContent: [
        { title: 'Why am I waiting too much sometimes after sending a request ?', text: "That's because our server goes to sleep if it's not used in the last 30 minutes. It will be wake up 10-15 seconds after your request is received." },
        { title: 'Can I use Churnify from a mobile device or tablet ?', text: 'We have a responsive interface. As long as you have a dataset in your device, you can even use it from a 4K TV.' }
      ]
    }),
    methods: {
      checkStatus() {
        db.collection('trainstatus').where('uid', '==', this.$session.get('uid')).onSnapshot(snapshot => {
          let changes = snapshot.docChanges();
          changes.forEach(change => {
            if (change.type == 'added') {
              let n = change.doc.data();
              n.id = change.doc.id;
              this.notifications.push(n);
            } else if (change.type == 'removed') {
              this.notifications.splice(this.notifications.findIndex(e => e.id === change.doc.id), 1);
            }
          });
        }, error => {
          console.log(error);
        });
      },
      getUserInfo() {
        this.dialogs[1].show = true;
        let userRef = db.collection('users').doc(this.$session.get('uid'));
        userRef.get().then(doc => {
          this.userInfo = doc.data();
        });
      },
      removeNotification(notification) {
        this.loaders.remove = true;
        this.beingRemoved = notification.modelname;
        db.collection('trainstatus').doc(notification.id).delete().then(() => {
          this.loaders.remove = false;
          this.beingRemoved = '';
        });
      },
      cancelUserPlan() {
        this.dialogs[1].show = false;
      },
      saveUserPlan() {
        this.dialogs[1].show = false;
      },
      logout() {
        auth.signOut().then(() => {
          this.$router.push('/');
          this.$session.remove("uname");
          this.$session.remove("uid");
        });
      }
    }
  }
</script>