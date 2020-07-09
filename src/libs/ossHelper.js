import { fetchOssAccount } from '../services';
import _ from 'lodash';
import { getImageSize } from 'image-file-size';
import Helper from './helper';
import imageConversion from './image-conversion';

const OSS = require('ali-oss');

export default class OSSHelper {
  static client = null;
  static ossInfo = {};
  static lastTime = 0;
  static currentType = 1;
  static createClient (obj) {
    OSSHelper.client = new OSS({
      region: 'oss-cn-hangzhou',
      accessKeyId: obj.ossAccountInfo.accessKeyId,
      accessKeySecret: obj.ossAccountInfo.accessKeySecret,
      stsToken: obj.ossAccountInfo.securityToken,
      endpoint: obj.endpoint,
      bucket: obj.bucketName
    });
  }
  static async getAccount (type) {
    OSSHelper.currentType = type || OSSHelper.currentType;
    return fetchOssAccount({
      type: OSSHelper.currentType
    }).then(d => {
      if (d !== 'fail') {
        console.log('getAccount', d);
        OSSHelper.ossInfo = d;
        OSSHelper.createClient(d);
        OSSHelper.lastTime = new Date().getTime();
      }
    });
  }
  static updateOssInfo = _.throttle(OSSHelper.getAccount, 5000, {
    leading: true,
    trailing: false
  });
  static getUrlSync = (url, h) => {
    OSSHelper.updateOssInfo();
    if (url && OSSHelper.client) {
      url = url.replace('https://salus.oss-cn-hangzhou.aliyuncs.com/', '');
      return OSSHelper.client.signatureUrl(
        url,
        h
          ? {
            process: `image/resize,h_${h}`
          }
          : {}
      );
    } else {
      return url;
    }
  };
  static upload = fileObj => {
    return new Promise(async (resolve, reject) => {
      let f = fileObj.files[0];
      let file = await getImageSize(f).then(sizeObj => {
        // 计算最终宽高
        let size = OSSHelper.getSize(sizeObj);
        return imageConversion.compress(f, {
          quality: 0.9,
          type: f.type,
          width: size.width,
          height: size.height
        });
      });
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = event => {
        OSSHelper.getAccount().then(() => {
          let fileName = fileObj.value;
          let suArr = fileName.split('.');
          let suffix = suArr.length > 0 ? '.' + suArr[suArr.length - 1] : '';
          let fileRemotePath =
            OSSHelper.ossInfo.path + Helper.getUUID() + suffix;
          const buffer = new OSS.Buffer(event.target.result);
          OSSHelper.client
            .put(fileRemotePath, buffer)
            .then(function (result) {
              if (result.etag) {
                if (
                  result.res &&
                  result.res.requestUrls &&
                  result.res.requestUrls.length > 0
                ) {
                  let name = result.res.requestUrls[0];
                  let lastIndex = name.lastIndexOf('?');
                  result.url = result.res.requestUrls[0].slice(0, lastIndex);
                }
              }
              fileObj.value = '';
              resolve(result);
            })
            .catch(() => {
              fileObj.value = '';
              resolve('fail');
            });
        });
      };
    });
  };
  static getSize = (sizeObj, maxSize = 2000) => {
    let isHBig = sizeObj.height >= sizeObj.width;
    let max = isHBig ? sizeObj.height : sizeObj.width;
    let min = isHBig ? sizeObj.width : sizeObj.height;
    let fmin = min;
    let fmax = max;
    if (max > maxSize) {
      fmax = maxSize;
      fmin = (min * maxSize) / max;
    }
    let re = { width: isHBig ? fmin : fmax, height: isHBig ? fmax : fmin };
    return re;
  };
}
