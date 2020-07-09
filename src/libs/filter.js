import Vue from "vue";
import Helper from "./helper";
import fecha from "fecha";

Vue.filter("debug", v => {
  if (!v) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return v;
});

Vue.filter("fromDic", (v, key, initForm) => {
  if (!v) return "";
  return Helper.valueFromDic(v, key, initForm);
});

Vue.filter("dateParse", (v, format = "YYYY-MM-DD") => {
  if (!v || !Number(v)) return "-";
  if (v.length === 10) v = Number(v) * 1000;
  return fecha.format(v, format);
});
