import Helper from '@/libs/helper';
import ACTION from './sdk-action';

export default class SdkPlugin {
  static resolveArr = []
  static rejcetArr = []
  static callback (index, data, isReject = false) {
    if (isReject) {
      SdkPlugin.rejcetArr[index] && SdkPlugin.rejcetArr[index](data);
    } else {
      SdkPlugin.resolveArr[index] && SdkPlugin.resolveArr[index](data);
    }
  }
  static selectPatient (data) {
    return SdkPlugin.create(ACTION.SELECT_PATIENT, data);
  }
  static async showReportDetail (data) {
    return SdkPlugin.create(ACTION.DETAIL_REPORT, data);
  }
  static async showReportPymolDetail (data) {
    return SdkPlugin.create(ACTION.DETAIL_REPORT_PYMOL, data);
  }
  static create (action, data) {
    return new Promise((resolve, reject) => {
      SdkPlugin.resolveArr.push(resolve);
      SdkPlugin.rejcetArr.push(reject);
      Helper.eventManage.emit('salus/sdk', {
        action,
        key: SdkPlugin.resolveArr.length - 1,
        data
      });
    });
  }
}
