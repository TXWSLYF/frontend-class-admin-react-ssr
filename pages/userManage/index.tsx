import css from './index.module.scss';
import AdminPage from '../../components/AdminPage';
import { Form, Input, Button, DatePicker, Select, Table, Tag, Pagination, Modal, Radio, message } from 'antd';
import { useState } from 'react';
import { getUserInfo, editUserInfo, VIEW_USERINFO_URL, GET_WHOLE_COURSE_LIST_URL } from '../../api/userManage';
import {
    USER_COUPON_STATUSES,
    getuserCouponStatusName,
    USER_COURSE_STATUSES,
    getuserCourseStatusName,
} from '../../common/constant';
import { GetServerSidePropsContext } from 'next';
import { userAddCoupon, GET_COUPON_LIST_URL } from '../../api/coupon';
import fetchServer from '../../util/fetchServer';
import Head from 'next/head';
import { addUserCourse, editUserCourse } from '../../api/userCourse';
import moment from 'moment';

const { Option } = Select;

type searchFormData = {
    // 昵称
    nickname: string;
    // 报名时间
    date: Array<unknown>;
    // 备注
    remark: string;
    // 报名课程
    courseHashs: Array<string>;
};

export default function UserManage({
    initUserInfoRes,
    courseList,
    couponList,
}: {
    initUserInfoRes: IViewUserInfoResData;
    courseList: Array<ICourseItem>;
    couponList: Array<ICouponInfo>;
}) {
    const [form] = Form.useForm();
    const [couponForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [userCourseForm] = Form.useForm();

    const [userInfoData, setUserInfoData] = useState<Array<IViewUserInfoResDataItem>>(initUserInfoRes.rows);
    const [paginationData, setPaginationData] = useState<IPaginationData>({
        total: initUserInfoRes.count,
        currentPage: 1,
        pageSize: 20,
    });
    const [couponModalVisible, setCouponModalVisible] = useState(false);
    const [selectedUserInfo, setSelectedUserInfo] = useState<IViewUserInfoResDataItem>();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [userCourseFormData, setUserCourseFormData] = useState<{ type: 'EDIT' | 'ADD'; modalVisible: boolean }>({
        type: 'EDIT',
        modalVisible: false,
    });

    const USER_COUPON_STATUS_COLOR = {
        [USER_COUPON_STATUSES.USED.value]: 'red',
        [USER_COUPON_STATUSES.UN_USED.value]: 'green',
    };

    const USER_COURSE_STATUS_COLOR = {
        [USER_COURSE_STATUSES.UN_ACTIVE.value]: 'red',
        [USER_COURSE_STATUSES.ACTIVE.value]: 'green',
    };

    // 表单结构
    const columns = [
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            // eslint-disable-next-line react/display-name
            render: (avatar: string) => {
                return <img src={avatar} style={{ width: '100px', height: '100px' }} />;
            },
        },
        {
            title: '报名情况',
            dataIndex: 'userCourses',
            key: 'userCourses',
            // eslint-disable-next-line react/display-name
            render: (userCourses: IViewUserInfoResDataItem['userCourses'], record) => {
                return (
                    <div>
                        {userCourses.map((userCourse) => {
                            const {
                                courseInfo: { name, hash },
                                status,
                                createdAt,
                                startAt,
                            } = userCourse;
                            return (
                                <Tag
                                    key={name}
                                    color={USER_COURSE_STATUS_COLOR[status]}
                                    style={{ textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedUserInfo(record);
                                        setUserCourseFormData({ modalVisible: true, type: 'EDIT' });
                                        userCourseForm.setFieldsValue({
                                            courseHashs: [hash],
                                            status,
                                            startAt: startAt ? moment(startAt) : undefined,
                                        });
                                    }}
                                >
                                    {name}：{getuserCourseStatusName(status)}
                                    <br />
                                    报名时间：{new Date(createdAt).toLocaleString()}
                                    <br />
                                    开课时间：
                                    {startAt ? new Date(startAt).toLocaleString() : '无'}
                                </Tag>
                            );
                        })}
                        <Button
                            type="link"
                            onClick={() => {
                                setUserCourseFormData({ modalVisible: true, type: 'ADD' });
                                setSelectedUserInfo(record);
                            }}
                        >
                            添加课程
                        </Button>
                    </div>
                );
            },
        },
        {
            title: '当前上课进度',
            dataIndex: 'userClasses',
            key: 'currentClassProgress',
            render: (userClasses: IViewUserInfoResDataItem['userClasses']) => {
                const classItem = userClasses.find((el) => el.classInfo.type === 1);
                if (classItem) {
                    const {
                        classInfo: { name },
                        progress,
                    } = classItem;
                    return <div>{`${name}：${progress}%`}</div>;
                } else {
                    return <div>暂无：0%</div>;
                }
            },
        },
        {
            title: '当前作业进度',
            dataIndex: 'userClasses',
            key: 'currentPraticeProgress',
            render: (userClasses: IViewUserInfoResDataItem['userClasses']) => {
                const classItem = userClasses.find((el) => el.classInfo.type === 2);
                if (classItem) {
                    const {
                        classInfo: { name },
                        progress,
                    } = classItem;
                    return <div>{`${name}：${progress}%`}</div>;
                } else {
                    return <div>暂无：0%</div>;
                }
            },
        },
        {
            title: '优惠券',
            dataIndex: 'userCoupons',
            key: 'userCoupons',
            render: (userCoupons: IViewUserInfoResDataItem['userCoupons']) => {
                return userCoupons.map((coupon) => {
                    const {
                        status,
                        couponInfo: { title },
                        id,
                    } = coupon;
                    return (
                        <Tag key={id} color={USER_COUPON_STATUS_COLOR[status]}>
                            {title}：{getuserCouponStatusName(status)}
                        </Tag>
                    );
                });
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            // eslint-disable-next-line react/display-name
            render: (remark) => {
                return <div style={{ minWidth: '100px' }}>{remark}</div>;
            },
        },
        {
            title: '操作',
            key: 'action',
            // eslint-disable-next-line react/display-name
            render: (record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => {
                            setEditModalVisible(true);
                            setSelectedUserInfo(record);
                            editForm.setFieldsValue(record);
                        }}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        onClick={() => {
                            setCouponModalVisible(true);
                            setSelectedUserInfo(record);
                        }}
                    >
                        优惠券
                    </Button>
                </div>
            ),
        },
    ];

    // 表单提交回调
    const onFinish = async (values: searchFormData) => {
        const { nickname = '', date, remark = '', courseHashs } = values;
        const { currentPage, pageSize } = paginationData;

        const viewUserInfoReqData: IViewUserInfoReqData = {
            nickname,
            remark,
            currentPage,
            pageSize,
        };

        if (date) {
            const [startDate, endDate] = date;
            viewUserInfoReqData.startTime = new Date(startDate.toString()).getTime();
            viewUserInfoReqData.endTime = new Date(endDate.toString()).getTime();
        }

        if (courseHashs && courseHashs.length) {
            viewUserInfoReqData.courseHashs = courseHashs;
        }

        const userInfoRes = await getUserInfo(viewUserInfoReqData);
        const { rows, count } = userInfoRes;

        setPaginationData(Object.assign(paginationData, { total: count }));
        setUserInfoData(rows);
    };

    // 表单清空
    const onReset = () => {
        form.resetFields();
        setPaginationData({ total: 0, currentPage: 1, pageSize: 20 });
    };

    // 表单选项改变回调
    const handleChange = () => {
        setPaginationData({ total: 0, currentPage: 1, pageSize: 20 });
        form.submit();
    };

    // 分页当前页数改变回调
    const handleCurrentPageChange = (page) => {
        setPaginationData(Object.assign(paginationData, { currentPage: page }));
        form.submit();
    };

    const { currentPage, total, pageSize } = paginationData;

    return (
        <AdminPage>
            <div className={css['user-manage']}>
                <Head>
                    <link href="//cdn.jsdelivr.net/npm/antd@4.3.2/dist/antd.min.css" rel="stylesheet"></link>
                </Head>
                <Modal
                    closable={false}
                    visible={editModalVisible}
                    maskClosable
                    onOk={() => {
                        editForm.submit();
                    }}
                    onCancel={() => {
                        setEditModalVisible(false);
                    }}
                >
                    <Form
                        form={editForm}
                        onFinish={async (data) => {
                            const { name } = selectedUserInfo;
                            await editUserInfo({ ...data, name });

                            const index = userInfoData.findIndex((i) => i.name === name);
                            userInfoData[index].nickname = data.nickname;
                            userInfoData[index].remark = data.remark;

                            setUserInfoData([...userInfoData]);
                            message.success('修改成功');
                            setEditModalVisible(false);
                        }}
                    >
                        <Form.Item name="remark" label="备注" className={css['ant-form-item']}>
                            <Input placeholder="请输入备注" />
                        </Form.Item>
                        <Form.Item name="nickname" label="昵称" className={css['ant-form-item']}>
                            <Input placeholder="请输入昵称" />
                        </Form.Item>
                        <Form.Item name="name" label="账号" className={css['ant-form-item']}>
                            <Input disabled />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    closable={false}
                    visible={couponModalVisible}
                    maskClosable
                    onOk={() => {
                        couponForm.submit();
                    }}
                    onCancel={() => {
                        couponForm.resetFields();
                        setCouponModalVisible(false);
                    }}
                >
                    <Form
                        form={couponForm}
                        onFinish={async (data) => {
                            const { couponId } = data;
                            const { name } = selectedUserInfo;
                            const userCoupon = await userAddCoupon({ userName: name, couponId });

                            const index = userInfoData.findIndex((userInfo) => userInfo.name === name);
                            userInfoData[index].userCoupons.push({
                                id: userCoupon.id,
                                status: userCoupon.status,
                                couponInfo: {
                                    title: couponList.find((coupon) => coupon.id === couponId).title,
                                },
                            });

                            setUserInfoData([...userInfoData]);
                            message.success('添加优惠券成功');
                            setCouponModalVisible(false);
                            couponForm.resetFields();
                        }}
                    >
                        <Form.Item
                            name="couponId"
                            label="优惠券"
                            className={css['ant-form-item']}
                            rules={[{ required: true, message: '请选择优惠券' }]}
                        >
                            <Select style={{ width: '300px' }}>
                                {couponList.map((coupon) => {
                                    return (
                                        <Option key={coupon.id} value={coupon.id}>
                                            {coupon.title}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    closable={false}
                    visible={userCourseFormData.modalVisible}
                    maskClosable
                    onOk={() => {
                        userCourseForm.submit();
                    }}
                    onCancel={() => {
                        userCourseForm.resetFields();
                        setUserCourseFormData({ ...userCourseFormData, modalVisible: false });
                    }}
                >
                    <Form
                        form={userCourseForm}
                        onFinish={async (data) => {
                            const { courseHashs, status, startAt } = data;
                            const { type } = userCourseFormData;
                            const { name } = selectedUserInfo;

                            if (type === 'ADD') {
                                await addUserCourse({
                                    courseHashs,
                                    status,
                                    userNames: [name],
                                    startAt: startAt ? new Date(startAt.format()).getTime() : null,
                                });

                                const index = userInfoData.findIndex((userInfo) => userInfo.name === name);
                                userInfoData[index].userCourses.push(
                                    ...courseHashs.map((hash) => {
                                        return {
                                            startAt: startAt ? startAt.format() : null,
                                            status,
                                            createdAt: new Date().toString(),
                                            courseInfo: {
                                                name: courseList.find((course) => course.hash === hash).name,
                                            },
                                        };
                                    }),
                                );
                                setUserInfoData([...userInfoData]);
                                message.success('开通成功');
                            } else if (type === 'EDIT') {
                                await editUserCourse({
                                    courseHashs,
                                    status,
                                    userNames: [name],
                                    startAt: startAt ? new Date(startAt.format()).getTime() : null,
                                });

                                const index = userInfoData.findIndex((userInfo) => userInfo.name === name);
                                const selectedUserCourse = userInfoData[index].userCourses.find(
                                    (userCourse) => userCourse.courseInfo.hash === courseHashs[0],
                                );
                                selectedUserCourse.status = status;
                                selectedUserCourse.startAt = startAt ? startAt.format() : null;
                                setUserInfoData([...userInfoData]);
                                message.success('修改成功');
                            }

                            userCourseForm.resetFields();
                            setUserCourseFormData({ ...userCourseFormData, modalVisible: false });
                        }}
                    >
                        <Form.Item
                            name="courseHashs"
                            label="开通课程"
                            rules={[{ required: true, message: '请选择要开通的课程' }]}
                        >
                            <Select
                                placeholder="请选择要开通课程"
                                mode="multiple"
                                disabled={userCourseFormData.type === 'EDIT'}
                            >
                                {courseList.map((course) => {
                                    return (
                                        <Option key={course.hash} value={course.hash}>
                                            {course.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="激活状态"
                            rules={[{ required: true, message: '请选择激活状态' }]}
                        >
                            <Radio.Group>
                                {Object.keys(USER_COURSE_STATUSES).map((key) => {
                                    return (
                                        <Radio
                                            key={USER_COURSE_STATUSES[key].value}
                                            value={USER_COURSE_STATUSES[key].value}
                                        >
                                            {USER_COURSE_STATUSES[key].name}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="startAt" label="开课日期">
                            <DatePicker showTime placeholder="请选择开课日期"></DatePicker>
                        </Form.Item>
                    </Form>
                </Modal>
                <Form layout="inline" form={form} onFinish={onFinish}>
                    <Form.Item name="nickname" label="昵称" className={css['ant-form-item']}>
                        <Input placeholder="请输入昵称" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item name="remark" label="备注" className={css['ant-form-item']}>
                        <Input placeholder="请输入备注" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item name="date" label="报名时间" className={css['ant-form-item']}>
                        <DatePicker.RangePicker
                            placeholder={['起始时间', '终止时间']}
                            onChange={handleChange}
                        ></DatePicker.RangePicker>
                    </Form.Item>
                    <Form.Item name="courseHashs" label="报名情况" className={css['ant-form-item']}>
                        <Select
                            placeholder="请选择报名情况"
                            mode="multiple"
                            style={{ width: '200px' }}
                            onChange={handleChange}
                        >
                            {courseList.map((course) => {
                                return (
                                    <Option key={course.hash} value={course.hash}>
                                        {course.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item className={css['ant-form-item']}>
                        <Button type="primary" htmlType="submit">
                            查找
                        </Button>
                        <Button htmlType="button" onClick={onReset} style={{ marginLeft: '8px' }}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
                <Table columns={columns} dataSource={userInfoData} pagination={false} rowKey="id" />
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}
                    onChange={handleCurrentPageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `总条数：${total}`}
                ></Pagination>
            </div>
        </AdminPage>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        await fetchServer.get('/admin/user', {
            headers: context.req.headers,
        });
        const [initUserInfoRes, courseList, couponList] = await Promise.all([
            fetchServer.post(
                VIEW_USERINFO_URL,
                {
                    nickname: '',
                    remark: '',
                    currentPage: 1,
                    pageSize: 20,
                },
                {
                    headers: context.req.headers,
                },
            ),
            fetchServer.get(GET_WHOLE_COURSE_LIST_URL, {
                headers: context.req.headers,
            }),
            fetchServer.get(GET_COUPON_LIST_URL, {
                headers: context.req.headers,
            }),
        ]);

        const props = { initUserInfoRes, courseList, couponList };

        return {
            props,
        };
    } catch (error) {
        context.res.statusCode = 302;
        context.res.setHeader('location', '/login');
        return { props: {} };
    }
}
