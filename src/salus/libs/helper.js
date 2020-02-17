export default class Helper {
  static UUID = 1
  static getUUID = () => {
    Helper.UUID = Helper.UUID + 1;
    return Helper.UUID;
  }
}
