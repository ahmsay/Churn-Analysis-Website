<template>
  <div>
    <v-parallax :src="require('@/assets/hero1.jpeg')" :height="parallaxHeight">
      <v-layout>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md4 order-md2 order-sm2>
              <v-card>
                <v-card-title class="title font-weight-light signin white--text">
                  <v-icon color="white" class="mr-3">exit_to_app</v-icon>
                  <span>Sign in to Churnify</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field @keydown.enter="login(unameL, passwL)" prepend-icon="person" v-model="unameL" label="Username"></v-text-field>
                  <v-text-field @keydown.enter="login(unameL, passwL)" prepend-icon="lock" v-model="passwL" label="Password" type="password"></v-text-field>
                  <span class="error--text" v-if="errors.login.show">{{ errors.login.msg }}</span>
                  <v-layout row wrap>
                    <v-flex xs12 sm6 md6 class="pb-0">
                      <v-btn class="mb-0 signin white--text" :loading="loaders.login" :disabled="loaders.login" block @click="login(unameL, passwL)">Sign In</v-btn>
                    </v-flex>
                    <v-flex xs12 sm6 md6 class="pb-0">
                      <v-btn class="mb-0 signin white--text" block @click.stop="dialog = true">Register</v-btn>
                    </v-flex>
                  </v-layout>
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <v-card class="pa-0">
                      <v-card-title class="register white--text">
                        <v-icon color="white" class="mr-3">person_add</v-icon>
                        <span class="title font-weight-light">Register</span>
                      </v-card-title>
                      <v-card-text>
                        <v-form ref="form" v-model="valid">
                          <v-text-field prepend-icon="person" v-model="uname" :rules="unameRules" label="Username" required></v-text-field>
                          <v-text-field prepend-icon="lock" v-model="passw" :rules="passwRules" label="Password" required type="password"></v-text-field>
                          <v-text-field prepend-icon="email" v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                        </v-form>
                        <span class="error--text" v-if="errors.register.show">{{ errors.register.msg }}</span>
                      </v-card-text>
                      <v-layout justify-end class="pr-2 pb-2">
                        <v-btn class="register white--text mr-0" @click.native="closeform">Close</v-btn>
                        <v-btn class="register white--text" :loading="loaders.register" :disabled="!valid || loaders.register" @click="register(uname, passw, email)">Sign Up</v-btn>
                      </v-layout>
                    </v-card>
                  </v-dialog>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 md8 order-md1 order-sm1>
              <v-card class="transparent" flat>
                <v-card-title class="display-2 font-weight-medium transparent white--text">Churnify</v-card-title>
                <v-card-text>
                  <span class="title font-weight-light white--text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-parallax>

    <v-layout column wrap class="my-5" align-center>
      <v-flex xs12 sm4 class="my-3">
        <div class="text-xs-center">
          <h2 class="headline">The best way to make churn analysis</h2>
          <span class="subheading">With generative model selector</span>
        </div>
      </v-flex>
      <v-flex xs12>
        <v-container grid-list-xl>
          <v-layout row wrap align-center>
            <v-flex xs12 md4 v-for="content in contents" :key="content.icon">
              <v-card class="transparent" flat>
                <v-card-text class="text-xs-center">
                  <v-icon x-large color="loremipsum">{{ content.icon }}</v-icon>
                </v-card-text>
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline text-xs-center">{{ content.title }}</div>
                </v-card-title>
                <v-card-text class="text-xs-center">{{ content.text }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>

    <v-parallax :src="require('@/assets/section1.jpg')" height="380">
      <v-layout column align-center justify-center>
        <div class="headline white--text mb-3 text-xs-center">Churn analysis has never been easier</div>
        <v-btn class="loremipsum mt-5" dark @click.stop="dialog = true">Get Started</v-btn>
      </v-layout>
    </v-parallax>

    <v-container grid-list-xl>
      <v-layout row wrap justify-center class="my-5">
        <v-flex xs12 sm4>
          <v-card class="transparent" flat>
            <v-card-title primary-title class="layout justify-center">
              <div class="headline">About us</div>
            </v-card-title>
            <v-card-text class="text-xs-center">Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 offset-sm1>
          <v-card class="transparent" flat>
            <v-card-title primary-title class="layout justify-center">
              <div class="headline">Contact us</div>
            </v-card-title>
            <v-card-text class="text-xs-center">
              Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
            </v-card-text>
            <v-list class="transparent">
              <v-list-tile v-for="contact in contacts" :key="contact.icon">
                <v-list-tile-action>
                  <v-icon color="loremipsum">{{ contact.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ contact.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import { EventBus } from "../plugins/event-bus.js";

  export default {
    created() {
      if (this.$session.has("uname"))
        this.$router.push('/home');
    },
    computed: {
      parallaxHeight() {
        if (this.$vuetify.breakpoint.name == 'xs')
          return 750
        else
          return 600
      }
    },
    data:() => ({
      errors: {
        register: { show: false, msg: '' },
        login: { show: false, msg: '' }
      },
      loaders: {
        register: false,
        login: false
      },
      dialog: false,
      unameL: '',
      passwL: '',
      valid: false,
      uname: '',
      passw: '',
      email: '',
      unameRules: [
        v => !!v || 'Username is required',
        v => v != null && v.length <= 25 && v.length >= 4 || 'Username must be between than 4 and 25 characters'
      ],
      passwRules: [
        v => !!v || 'Password is required',
        v => v != null && v.length <= 30 && v.length >= 6 || 'Password must be between than 6 and 30 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => v != null && v.length <= 50 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      contents: [
        { icon: 'color_lens', title: 'What is Churnify ?', text: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.' },
        { icon: 'flash_on', title: 'What do we do ?', text: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.' },
        { icon: 'build', title: 'How do we do it ?', text: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.' }
      ],
      contacts: [
        { icon: 'phone', text: '777-867-5309' },
        { icon: 'place', text: 'Chicago, US' },
        { icon: 'email', text: 'john@vuetifyjs.com' }
      ]
    }),
    methods: {
      login (uname, passw) {
        if (uname != '' && passw != '') {
          this.loaders.login = true;
          this.$post('/login', { username: uname, password: passw }).then(data => {
            this.loaders.login = false;
            if (data.info == 1) {
              this.errors.login.show = false;
              this.errors.login.msg = '';
              this.$session.set("uname", uname);
              this.$session.set("passw", passw);
              EventBus.$emit('refreshStatus', 0);
              this.$router.push('/home');
            } else if (data.info == 0) {
              this.errors.login.msg = 'Username and password do not match.';
              this.errors.login.show = true;
            } else if (data.info == -1) {
              this.errors.login.msg = 'Server error.';
              this.errors.login.show = true;
            }
          });
        }
      },
      register(uname, passw, email) {
        this.loaders.register = true;
        this.$post('/register', { username: uname, password: passw, email: email }).then(data => {
          this.loaders.register = false;
          if (data.info == 1) {
            this.errors.register.show = false;
            this.errors.register.msg = '';
            this.closeform();
            this.uname = '';
            this.passw = '';
            this.email = '';
            this.$session.set("uname", uname);
            this.$session.set("passw", passw);
            this.$router.push('/home');
          } else if (data.info == 0) {
            this.errors.register.msg = 'Username "' + uname + '" already exists.';
            this.errors.register.show = true;
          } else if (data.info == -1) {
            this.errors.register.msg = 'Server error.';
            this.errors.register.show = true;
          }
        });
      },
      closeform() {
        this.$refs.form.reset();
        this.dialog = false;
      }
    }
  }
</script>
