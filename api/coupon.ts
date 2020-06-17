import fetch from '../util/fetch';

/**
 * @description 获取优惠券列表
 */
export const GET_COUPON_LIST_URL = '/admin/couponList';
export const getCouponList = () => fetch.get<Array<ICouponInfo>>(GET_COUPON_LIST_URL);

/**
 * @description 用户添加优惠券
 */

export const userAddCoupon = (data: { userName: string; couponId: number }) =>
    fetch.post<IUserCoupon>('/admin/userCoupon', data);

export const USER_COUPON_INFO_URL = '/userCoupon';

export default null;
