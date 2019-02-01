<template>
  <v-app>
    <v-toolbar class="background" app>
      <v-icon color="foreground">album</v-icon>
      <v-toolbar-title>
        <span class="headline font-weight-bold foreground--text">Churnify</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="this.$session.has('uname')">
        <v-menu offset-y>
          <v-btn flat class="background mr-0" light slot="activator">
            <v-icon left color="foreground">account_box</v-icon>
            <span>{{ this.$session.get('uname') }}</span>
            <v-icon color="foreground">arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
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

    <v-content class="background image">
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  export default {//https://malydziennik.pl/wp-content/uploads/2018/12/wave-1913559_960_720.jpg
    name: 'App',
    data:() => ({
      email: null,
      dialog: false
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

<style>
  .image {
    background-image: url('https://www.infoquestconsulting.com/images/grey-geometric-background.png');
    background-size: cover;
  }
</style>