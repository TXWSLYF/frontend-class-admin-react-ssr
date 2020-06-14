import fetch from '../util/fetch';

/**
 * @description 用户添加课程
 */
export const addUserCourse = (data: { userNames: string[]; courseHashs: string[]; status: number; startAt?: number }) =>
    fetch.post('/admin/userCourse', data);

/**
 * @description 用户修改课程
 */
export const editUserCourse = (data: {
    userNames: string[];
    courseHashs: string[];
    status: number;
    startAt?: number;
}) => fetch.patch('/admin/userCourse', data);

export default null;
