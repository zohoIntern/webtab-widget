const CONNECTION_LINK_NAME = "customer_full_access";
const KEY = "auto_fill";

// mixins
// import modalMixin from "./mixins/modalMixin.js";

const app = Vue.createApp({
  mounted() {
    ZFAPPS.extension.init().then(async (App) => {
      console.log(App);
      console.log(this.retrieveMeta());
    });
  },
  computed: {},
  data() {
    return {
      options: {},
      supportedField: {
        reference_number: true,
        payment_terms: true,
        payment_terms_label: true,
        payment_options: true,
        customer_id: true,
        contact_persons: true,
        custom_fields: true,
        date: true,
        due_date: true,
        discount: true,
        discount_type: true,
        notes: true,
        terms: true,
        adjustment: true,
        adjustment_description: true,
        salesperson_id: true,
        subject_content: true,
        shipping_charge: true,
        template_id: true,
        documents: true, // array
        mail_attachments: true,
      },
    };
  },
  watch: {},
  methods: {
    toggle(key) {
      this.options[key] = !this.options[key];
    },
    async storeMeta(value) {
      return await ZFAPPS.store(KEY, {
        value: this.getObject(value),
      }).then((meta) => {
        console.log(meta);
      });
    },
    async saveMeta() {
      await this.storeMeta(this.options);
    },
    async initMeta() {
      await this.storeMeta(this.supportedField);
    },
    getObject(proxy) {
      console.log(JSON.parse(JSON.stringify(proxy)));
      return JSON.parse(JSON.stringify(proxy));
    },
    async retrieveMeta() {
      return await ZFAPPS.retrieve(KEY)
        .then((meta) => {
          console.log("Meta : ", meta);
          this.options = meta[KEY];
        })
        .catch((err) => {
          console.log(err);
          if (err.code === -1) {
            console.log("NO META");
            this.initMeta();
          }
        });
    },
  },
});

// app.component("tab-me-done", todoItem);

app.mount("#app");
