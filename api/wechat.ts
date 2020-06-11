import fetch from '../util/fetch';

export const WECHAT_LOGIN_URL = '/api/wechat/login';
export const WECHAT_UNIFIEDORDER_URL = '/wechat/unifiedorder';

/**
 * @description 微信下单接口
 */
export const wechatUnifiedorder = (data: { goodId: any; adChannel?: any }) => fetch.post(WECHAT_UNIFIEDORDER_URL, data);

export default null;
