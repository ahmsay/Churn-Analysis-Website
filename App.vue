<template>
  <v-app>
    <v-toolbar class="primary" app dark>
      <v-toolbar-title>
        <span class="headline font-weight-bold">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="this.$session.has('user')">
        <v-menu offset-y>
          <v-btn class="primary" light slot="activator">{{ this.$session.get('user') }}</v-btn>
          <v-list class="secondary">
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