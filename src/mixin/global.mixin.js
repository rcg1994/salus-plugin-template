import { mapGetters } from "vuex";
import { fetchBoDic } from "../services";

let DIC_TEMP = {};

const mixin = {
  data() {
    return {
      _dic: {},
    };
  },
  computed: {
    ...mapGetters({
      global_account: "system/account",
      global_hospital: "system/hospital",
      global_role: "system/role",
    }),
  },
  mounted() {
    this.dic && this._getDic();
  },
  methods: {
    _getDic() {
      let dicKeyArr = this.dic ? this.dic.filter(key => !DIC_TEMP[key]) : [];
      if (dicKeyArr && dicKeyArr.length > 0) {
        return fetchBoDic(dicKeyArr).then(d => {
          if (d !== "fail") {
            let _dic = d || {};
            DIC_TEMP = {
              ...DIC_TEMP,
              ..._dic,
            };
            console.log("DIC_TEMP", DIC_TEMP);
          }
        });
      }
    },
    getDic(dic) {
      return DIC_TEMP ? DIC_TEMP[dic] || {} : {};
    },
    getDicArr(dic) {
      let v = this.getDic(dic);
      let re = [];
      for (let key in v) {
        if (v.hasOwnProperty(key)) {
          re.push({
            key,
            value: v[key],
          });
        }
      }
      return re;
    },
    getDicValue(dic, key, d = "-") {
      return key && DIC_TEMP && DIC_TEMP[dic] ? DIC_TEMP[dic][key] : d || "";
    },
  },
};

export default mixin;
