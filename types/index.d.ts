interface Window {
    WeixinJSBridge: any;
}

interface ILoginData {
    name: string;
    password: string;
}

interface IUserInfo {
    authorities: { readonly [key: string]: string };
    avatar: string;
    nickname: string;
    name: string;
}

interface ICourseItem {
    name: string;
    hash: string;
}

// 查询用户信息接口请求数据
interface IViewUserInfoReqData {
    currentPage: number;
    pageSize: number;
    nickname: string;
    remark: string;
    courseHashs?: string[];
    startTime?: number;
    endTime?: number;
}

interface IViewUserInfoResDataItem {
    avatar: string;
    createdAt: string;
    id: number;
    name: string;
    nickname: string;
    remark: string;
    userClasses: {
        progress: number;
        createdAt: string;
        classInfo: {
            type: number;
            name: string;
            chapterInfo: {
                name: string;
            };
        };
    }[];
    userCourses: {
        startAt: null | string;
        createdAt: string;
        courseInfo: {
            name: string;
        };
    }[];
    userCoupons: {
        id: number;
        status: number;
        couponInfo: {
            title: string;
        };
    }[];
}

// 查询用户信息接口返回数据
interface IViewUserInfoResData {
    count: number;
    currentPage: number;
    pageSize: number;
    rows: IViewUserInfoResDataItem[];
}

// 分页数据接口
interface IPaginationData {
    // 数据总条数
    total: number;
    // 分页大小
    pageSize: number;
    // 当前页码
    currentPage: number;
}

// 优惠券
interface ICouponInfo {
    id: number;
    title: string;
    denomination: number;
    goodId: number;
}

interface IGoodInfo {
    name: string;
    price: number;
    detail: string;
    pcPoster: string;
    h5Poster: string;
    originPrice: number;
}
