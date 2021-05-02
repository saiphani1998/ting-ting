export default class CallUtility {
  constructor() {
    this.isNullOrEmpty = (item) => {
      return !item || item === "" || item.match(/^\s+$/);
    };
  }
}
