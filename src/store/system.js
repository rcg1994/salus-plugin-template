export default {
  namespaced: true,
  state: {
    // 是否已获取信息
    isChecked: false,
    // 当前登录的医院
    hospital: {},
    // 当前登录的科室
    department: {},
    // 当前登录的人员
    account: {},
    // 当前科室和角色
    role: {},
    // 当前用户所在科室列表
    roleList: {},
  },
  mutations: {
    setHospital(state, hospital) {
      state.hospital = hospital;
    },
    setDepartment(state, department) {
      state.department = department;
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
    setRoleList(state, roleList) {
      state.roleList = roleList;
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
    updateRoleList({ commit }, payload) {
      let currentRoleId = Number(localStorage.getItem("SALUS_DEFUALT_ROLE"));
      let currentRole = payload.find(item => item.tRoleId === currentRoleId);
      commit("setDepartment", {
        id: currentRole.tDepartmentId,
        name: currentRole.depName,
      });
      commit("setRoleList", payload);
    },
  },
  getters: {
    hospital: state => state.hospital,
    department: state => state.department,
    account: state => state.account,
    isChecked: state => state.isChecked,
    role: state => state.role,
    roleList: state => state.roleList,
  },
};
