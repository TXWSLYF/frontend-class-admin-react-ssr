import fetch from '../util/fetch';

/**
 * @description 获取优惠券列表
 */
export const getCouponList = () => fetch.get<Array<ICouponInfo>>('/admin/couponList');

/**
 * @description 用户添加优惠券
 */

export const userAddCoupon = (data: { userName: string; couponId: number }) => fetch.post('/admin/userCoupon', data);

export const USER_COUPON_INFO_URL = '/userCoupon';

export default null;
