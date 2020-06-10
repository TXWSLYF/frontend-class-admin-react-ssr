import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';

// 菜单列表
export const menuList = [
    {
        title: '管理',
        Icon: AppstoreOutlined,
        children: [
            {
                title: '用户管理',
                path: '/userManage',
            },
            {
                title: '项目权限管理',
                path: '/authorityManage',
            },
            {
                title: '角色管理',
                path: '/roleManage',
            },
        ],
    },
    {
        title: '数据分析',
        Icon: MailOutlined,
        children: [
            {
                title: '课程评价',
                path: '/courseEvaluation',
            },
        ],
    },
];

// 用户优惠券状态
export const USER_COUPON_STATUSES = {
    UN_USED: {
        name: '未使用',
        value: 0,
    },
    USED: {
        name: '已使用',
        value: 1,
    },
    EXPIRED: {
        name: '已过期',
        value: -1,
    },
};

// 获取优惠券状态名称
export function getCouponStatusName(status: number): string {
    const keys = Object.keys(USER_COUPON_STATUSES);

    for (let i = 0; i < keys.length; i += 1) {
        if (USER_COUPON_STATUSES[keys[i]].value === status) {
            return USER_COUPON_STATUSES[keys[i]].name;
        }
    }
}
