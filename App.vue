<template>
  <v-app>
    <v-toolbar class="primary" app dark>
      <v-icon>album</v-icon>
      <v-toolbar-title>
        <span class="headline font-weight-bold">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="this.$session.has('uname')">
        <v-menu offset-y>
          <v-btn class="primary" light slot="activator">
            <v-icon left>account_box</v-icon>
            <span>{{ this.$session.get('uname') }}</span>
          </v-btn>
          <v-list class="secondary">
            <v-list-tile @click="showSettings">
                <v-icon class="pr-3" left>build</v-icon>
                <span>Settings</span>
            </v-list-tile>
            <v-list-tile @click="showHelp">
                <v-icon class="pr-3" left>help</v-icon>
                <span>Help</span>
            </v-list-tile>
            <v-list-tile @click="logout">
                <v-icon class="pr-3" left>backspace</v-icon>
                <span>Logout</span>
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
        this.$session.remove("uname");
        this.$session.remove("passw");
        this.$router.push('/');
      }
    } 
  }
</script>