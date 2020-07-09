const NODE_ENV = process.env.NODE_ENV;
const envMap = {
  dev: "dev",
  demo: "demo",
  production: "link",
  pre: "pre-link",
};
// 本地开发环境
const isDev = NODE_ENV === "development";

// 三环境
const env = isDev ? "demo" : envMap[NODE_ENV] || "link";

const ThirdUrlConfig = [
  {
    path: "/thirdParty/yzzl_prev",
    url: `https://${env}.isalus.cn/cgt/#/yzzl_old`,
    title: "结石症智能诊疗",
  },
  {
    path: "/thirdParty/yzzl_yz_prev",
    url: `https://${env}.isalus.cn/cgt/#/yzzl_yz_old`,
    title: "预诊",
  },
  {
    path: "/thirdParty/medicalRecord",
    url: `https://${env}.isalus.cn/cgt/#/record`,
    title: "既往就诊记录",
  },
  {
    path: "/thirdParty/yzzl",
    url: `https://${env}.isalus.cn/cgt/#/yzzl`,
    title: "结石症智能诊疗(新)",
  },
  {
    path: "/thirdParty/yzzl_yz",
    url: `https://${env}.isalus.cn/cgt/#/yzzl_yz`,
    title: "预诊(新)",
  },
  {
    path: "/thirdParty/medicalRecordArchive",
    url: `https://${env}.isalus.cn/cgt/#/medicalrecord`,
    title: "病历管理",
  },
  // {
  //   path: '/thirdParty/dev',
  //   url: `http://localhost:8081/#/yzzl`,
  //   title: '测试'
  // }
];

// 医生诊疗页面 tab下内嵌iframe
export const docorReocrdUrl = `https://${env}.isalus.cn/cgt/#/doctorMedicalRecord`;

export default ThirdUrlConfig;
