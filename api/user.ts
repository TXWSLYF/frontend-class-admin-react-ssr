import fetch from '../util/fetch';
import { AxiosRequestConfig } from 'axios';

/**
 * @description 获取当前登录用户的用户信息
 */
export const getCurUserInfo = (config: AxiosRequestConfig) => fetch.get<IUserInfo>('/admin/user', config);

export default null;
