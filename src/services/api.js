const PREFIX = window.salus.service.PREFIX

export default class API {
  static PREFIX = PREFIX;
  static CHARGE_INVO_UPDATE = PREFIX + '/his/csm/recInvo/invoUpdate';
  static CHARGE_HISTORY_DETAIL = PREFIX + '/his/csm/bill/billDetailCharge';
}