import API from "./api";
import { fetchCreate } from "./fetch";

const postParams = {
  method: "post",
};

/* replace services */
// fake api
export const fetchApiFake = fetchCreate(API.API_FAKE, {
  IS_FAKE: true,
});
export const fetchImageCode = fetchCreate(API.IMAGE_CODE, {});
export const fetchAuthToken = fetchCreate(API.AUTH_OAUTH_TOKEN, {
  customToken: process.env.VUE_APP_LOGIN_TOKEN,
});
export const fetchBoDic = fetchCreate(API.BO_DIC_LIST_BY_CODE, postParams);
export const fetchAuthInfo = fetchCreate(API.AUTH_OAUTH_CHECK_TOKEN, {});
export const fetchAccountMenu = fetchCreate(API.ACCOUNT_MENU, {});
export const fetchOssAccount = fetchCreate(API.OSS_ACCOUNT, postParams);
export const fetchHosPluginInfo = fetchCreate(API.PLUGIN_HOS_PLUGIN_LIST, {
  isIdOnly: true,
});
export const fetchCoreVisitList = fetchCreate(API.CORE_VISIT_LIST, postParams);
export const fetchCoreVisitListWithChild = fetchCreate(
  API.CORE_VISIT_LIST_WITH_CHILD,
  postParams
);
export const fetchCoreVisitDetail = fetchCreate(
  API.CORE_VISIT_DETAIL,
  postParams
);
/* end replace */
