<template>
  <v-app>
    <v-toolbar class="toolbar" app>
      <v-icon color="foreground">album</v-icon>
      <v-toolbar-title>
        <span class="headline">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="this.$session.has('uname')">
        <v-menu left offset-y max-height="230">
          <v-btn icon flat class="toolbar" slot="activator">
            <v-icon>notifications</v-icon>
          </v-btn>
          <v-list two-line>
            <v-list-tile v-for="status in statuslist" :key="status.modelname">
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-medium">{{ status.modelname }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ status.detail }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu left offset-y>
          <v-btn icon flat class="toolbar" slot="activator">
            <v-icon>account_circle</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile>
              <span class="font-weight-bold">{{ this.$session.get('uname') }}</span>
            </v-list-tile>
            <v-list-tile @click="showHelp">
              <v-icon class="pr-3" color="foreground" left>help</v-icon>
              <span>Help</span>
            </v-list-tile>
            <v-list-tile @click="showSettings">
              <v-icon class="pr-3" color="foreground" left>settings</v-icon>
              <span>Settings</span>
            </v-list-tile>
            <v-list-tile @click="logout">
              <v-icon class="pr-3" color="foreground" left>cancel</v-icon>
              <span>Logout</span>
            </v-list-tile>
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
  export default {
    name: 'App',
    created() {
      if(this.$session.has('uname')) {
        this.$post('/checkStatus', { username: this.$session.get('uname'), password: this.$session.get('passw') }).then(data => {
          console.log(data);
          this.statuslist = data.statuslist;
        });
      }
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
