const makeRoute = routeConfig => ({
  path: routeConfig[1],
  meta: {
    title: routeConfig[0],
  },
  component: () => import(`../pages/${routeConfig[2]}.vue`),
});

const pages = [
  /* push route*/
  ["首页", "/home", "home"],
  ["插件开发", "/plugin", "plugin"],
  /* end push */
];
let routes = pages.map(makeRoute);

export const InfoManagePages = pages;

export default routes;
