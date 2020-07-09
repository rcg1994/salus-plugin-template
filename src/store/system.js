export default {
  namespaced: true,
  state: {
    // 是否已获取信息
    isChecked: false,
    // 当前登录的医院
    hospital: {},
    // 当前登录的人员
    account: {},
    // 当前科室和角色
    role: {},
  },
  mutations: {
    setHospital(state, hospital) {
      state.hospital = hospital;
    },
    setRole(state, role) {
      state.role = role;
    },
    setAccount(state, hospital) {
      state.account = hospital;
    },
    setIsCheck(state, isChecked) {
      state.isChecked = isChecked;
    },
  },
  actions: {
    updateHospital({ commit }, payload) {
      commit("setHospital", payload);
    },
    updateAccount({ commit }, payload) {
      commit("setAccount", payload);
    },
    updateIsCheck({ commit }, payload) {
      commit("setIsCheck", payload);
    },
    updateRole({ commit }, payload) {
      commit("setRole", payload);
    },
  },
  getters: {
    hospital: state => state.hospital,
    account: state => state.account,
    isChecked: state => state.isChecked,
    role: state => state.role,
  },
};
