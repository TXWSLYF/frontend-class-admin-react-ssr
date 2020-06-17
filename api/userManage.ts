import fetch from '../util/fetch';

/**
 * @description 获取所有课程列表
 */
export const GET_WHOLE_COURSE_LIST_URL = '/wholeCourseList';
export const getWholeCourseList = () => fetch.get<Array<ICourseItem>>(GET_WHOLE_COURSE_LIST_URL);

/**
 * @description 获取学员信息
 */
export const VIEW_USERINFO_URL = '/admin/viewUserInfo';
export const getUserInfo = (data: IViewUserInfoReqData) => fetch.post<IViewUserInfoResData>(VIEW_USERINFO_URL, data);

/**
 * @description 修改学员信息
 */
export const editUserInfo = (data: { name: string; nickname?: string; remark?: string }) =>
    fetch.post('/admin/user', data);
