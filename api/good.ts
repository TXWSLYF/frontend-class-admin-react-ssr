import fetch from '../util/fetch';

export const GOOD_INFO_URL = '/admin/good';
export const IS_PURCHASED_GOOD_URL = '/admin/isPurchasedGood';

/**
 * @description 获取当前登录用户的用户信息
 */
export const checkIsPurchasedGood = (goodId: any) => fetch.post<boolean>(IS_PURCHASED_GOOD_URL, { goodId });
