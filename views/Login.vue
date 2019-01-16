<template>
  <div class="container">
    <h2>Sign In</h2>
    <v-text-field v-model="emailL" label="E-mail"></v-text-field>
    <v-text-field v-model="passwL" label="Password" type="password"></v-text-field>
    <v-btn @click="login(emailL, passwL)">Login</v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-btn slot="activator">Create an Account</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Create an Account</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="email" :rules="unameRules" :counter="30" label="E-mail" required></v-text-field>
              <v-text-field v-model="passw" :rules="passwRules" type="password" label="Password" required></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeform">Close</v-btn>
          <v-btn :disabled="!valid" @click="register(email, passw)">Sign Up</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    created() {
      if (this.$session.has("user"))
        this.$router.push('/home');
    },
    data:() => ({
      dialog: false,
      emailL: '',
      passwL: '',
      valid: false,
      email: '',
      passw: '',
      unameRules: [
        v => !!v || 'E-mail is required',
        v => v != null && v.length <= 30 && v.length >= 3 || 'E-mail must be between than 3 and 30 characters'
      ],
      passwRules: [
        v => !!v || 'Password is required'
      ]
    }),
    methods: {
      login (email, passw) {
        email = 'zorkov';
        passw = 'asdzxc';
        console.log("logged in: " + email + ", " + passw);
        this.$session.set("user", email);
        this.$router.push('/home');
      },
      register(email, passw) {
        this.closeform();
        this.email = '';
        this.passw = '';
        console.log("registered: " + email + ", " + passw);
      },
      closeform() {
        this.$refs.form.reset();
        this.dialog = false;
      }
    }
  }
</script>