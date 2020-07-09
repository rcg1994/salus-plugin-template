const GPatientInfo = {
  name: 'GPatientInfo',
  props: {
    info: Object,
    inHos: {
      type: Boolean,
      default: false
    }},
  render () {
    let currentUser = this.info || {};
    return [
      <div class="g-patient-info">
        <span>MRN：<b>{currentUser.mrn || '-'}</b></span>
        <span>姓名：<b>{currentUser.name || '-'}</b></span>
        <span>性别：<b>{currentUser.sexDictionary || '-'}</b></span>
        <span>出生日期：<b>{currentUser.birthday ? currentUser.birthday.substr(0, 10) : '-'}</b></span>
        <span>电话：<b>{currentUser.phoneNum || '-'}</b></span>
        {this.inHos
          ? <span>费别：<b>{currentUser.bxName ? currentUser.bxName : '-'}</b></span> : ''
        }
      </div>
    ];
  }
};

export default GPatientInfo;
