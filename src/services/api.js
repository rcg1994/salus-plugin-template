const PREFIX = process.env.VUE_APP_API;

console.log("API ON:", PREFIX);
export default class API {
  static PREFIX = PREFIX;
  /* replace api */
  static API_FAKE = PREFIX + "/api/fake";
  static IMAGE_CODE = PREFIX + "/image_code";
  static AUTH_OAUTH_TOKEN = PREFIX + "/auth/oauth/token";
  static AUTH_OAUTH_CHECK_TOKEN = PREFIX + "/auth/oauth/check_token";
  static ACCOUNT_MENU = PREFIX + "/bo/account/menu_tree";
  static OSS_ACCOUNT = PREFIX + "/bo/upload/account";
  static BO_DIC_LIST_BY_CODE = PREFIX + '/bo/dictionary/list_by_code';
  static PLUGIN_HOS_PLUGIN_LIST = PREFIX + "/core/plugin/rel/list";
  static CORE_VISIT_LIST = PREFIX + "/core/visit/todayDoctorList";
  static CORE_VISIT_LIST_WITH_CHILD =
  PREFIX + "/core/visit/todayListWithChildren";
  static CORE_VISIT_DETAIL = PREFIX + '/core/visit/detail';
  /* end replace */
}
