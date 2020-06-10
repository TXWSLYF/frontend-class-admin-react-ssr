import css from './index.module.scss';
import AdminPage from '../../components/AdminPage';
import { Form, Input, Button, DatePicker, Select, Table, Tag, Pagination } from 'antd';
import { useState, useEffect } from 'react';
import { getWholeCourseList, getUserInfo } from '../../api/userManage';
import { USER_COUPON_STATUSES, getCouponStatusName } from '../../common/constant';
import { GetServerSidePropsContext } from 'next';
import Axios from 'axios';

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

export default function UserManage() {
    const [form] = Form.useForm();

    const [courseList, setCourseList] = useState<Array<ICourseItem>>([]);
    const [userInfoData, setUserInfoData] = useState<Array<IViewUserInfoResDataItem>>([]);
    const [paginationData, setPaginationData] = useState<IPaginationData>({ total: 0, currentPage: 1, pageSize: 20 });

    const USER_COUPON_STATUS_COLOR = {
        [USER_COUPON_STATUSES.USED.value]: 'red',
        [USER_COUPON_STATUSES.UN_USED.value]: 'green',
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
            render: (userCourses: IViewUserInfoResDataItem['userCourses']) => {
                return userCourses.map((userCourse) => {
                    return (
                        <Tag key={userCourse.courseInfo.name} color="geekblue" style={{ textAlign: 'center' }}>
                            {userCourse.courseInfo.name}
                            <br />
                            {new Date(userCourse.createdAt).toLocaleString()}
                        </Tag>
                    );
                });
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
                            {title}：{getCouponStatusName(status)}
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
            render: () => (
                <div>
                    <Button type="link">编辑</Button>
                    <Button type="link">优惠券</Button>
                </div>
            ),
        },
    ];

    // 表单提交回调
    const onFinish = async (values: searchFormData) => {
        const { nickname = '', date, remark = '', courseHashs } = values;
        const { currentPage, pageSize } = paginationData;
        console.log(paginationData);

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

    useEffect(() => {
        (async () => {
            const courseList = await getWholeCourseList();
            setCourseList(courseList);
            form.submit();
        })();
    }, []);

    const { currentPage, total, pageSize } = paginationData;

    return (
        <AdminPage>
            <div className={css['user-manage']}>
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
        const currentUserInfo = await Axios.get('http://127.0.0.1:7001/admin/user', {
            headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
        });

        const { errorCode, msg } = currentUserInfo.data;
        if (errorCode !== 0) {
            throw new Error(msg);
        }
    } catch (error) {
        context.res.statusCode = 302;
        context.res.setHeader('location', '/login');
    }
    return {
        props: {},
    };
}
