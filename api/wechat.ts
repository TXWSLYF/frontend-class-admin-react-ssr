import fetch from '../util/fetch';

export const WECHAT_LOGIN_URL = '/api/wechat/login';

/**
 * @description 微信下单接口
 * @param {String} goodId 商品id
 */
export const wechatUnifiedorder = (goodId: string) => fetch.post('/wechat/unifiedorder', { goodId });

export default null;
