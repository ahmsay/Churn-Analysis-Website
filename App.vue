<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>
        <span class="headline font-weight-bold">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-if="false" persistent v-model="dialog" width="500">
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
      <div v-if="this.$session.has('user')">
        <v-menu offset-y>
          <v-btn slot="activator">{{ this.$session.get('user') }}</v-btn>
          <v-list>
            <v-list-tile @click="showSettings">
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="showHelp">
              <v-list-tile-title>Help</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="logout">
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data:() => ({
      email: null,
      dialog: false
    }),
    methods: {
      showSettings() {

      },
      showHelp() {

      },
      logout() {
        this.email = null;
        this.$session.remove("user");
        this.$router.push('/');
      }
    } 
  }
</script>