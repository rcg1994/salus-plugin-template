import Vue from "vue";
import printJS from "print-js";
import _ from "lodash";
import fecha from "fecha";
import { fetchCreate } from "../services/fetch";
import { Message, MessageBox, Notification } from "element-ui";
import API from "@/services/api";
import Helper from "@/libs/helper";
import Func from "./func";
import SdkPlugin from "./sdk-plugin";

const Salus = {
  _,
  fecha,
  plugins: {},
  service: {
    fetchCreate,
    PREFIX: API.PREFIX,
  },
  message: Message,
  alert: MessageBox.alert,
  confirm: MessageBox.confirm,
  prompt: MessageBox.prompt,
  notify: Notification,
  print: printJS,
  helper: Helper,
  func: Func,
  sdk: SdkPlugin,
};

window.salus = Salus;

export default {
  install: () => {
    Vue.prototype.$salus = Salus;
  },
};
