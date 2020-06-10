import fetch from '../util/fetch';

/**
 * @description 获取优惠券列表
 */
export const getCouponList = () => fetch.get<Array<ICouponItem>>('/admin/couponList');

/**
 * @description 用户添加优惠券
 */

export const userAddCoupon = (data: { userName: string; couponId: number }) => fetch.post('/admin/userCoupon', data);

export default null;
