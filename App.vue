<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>Churn</span>
        <span class="font-weight-light"> | Building the Environment</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="false" @click="test">Test {{ val }}</v-btn>
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
        <span>Welcome <b>{{ this.$session.get('user') }}</b></span>
        <v-btn @click="logout">Logout</v-btn>
      </div>
    </v-toolbar>

    <v-content>
      <router-view style="padding-bottom: 80px"></router-view>
    </v-content>

  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data:() => ({
      val: '',
      email: null,
      dialog: false
    }),
    methods: {
      test() {
        /*this.$get('/').then(data => {
          this.val = data['message'];
        })*/
      },
      logout() {
        this.email = null;
        this.$session.remove("user");
        this.$router.push('/');
      }
    } 
  }
</script>