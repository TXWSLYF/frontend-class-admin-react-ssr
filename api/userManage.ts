import fetch from '../util/fetch';

/**
 * @description 获取所有课程列表
 */
export const getWholeCourseList = () => fetch.get<Array<ICourseItem>>('/wholeCourseList');

/**
 * @description 获取学员信息
 */
export const getUserInfo = (data: IViewUserInfoReqData) =>
    fetch.post<IViewUserInfoResData>('/admin/viewUserInfo', data);

/**
 * @description 修改学员信息
 */
export const editUserInfo = (data: { name: string; nickname?: string; remark?: string }) =>
    fetch.post('/admin/user', data);
