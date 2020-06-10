import css from './index.module.scss';
// import { useState, useEffect } from 'react';
// import { getCurUserInfo } from '../../api/user';
// import { logout } from '../../api/auth';
// import Router from 'next/router';
import HorizontalMenu from '../HorizontalMenu';

// const handleLogout = async () => {
//     await logout();
//     Router.push('/login');
// };

export default function HeaderBar() {
    // const [userInfo, setUserInfo] = useState<IUserInfo>({ authorities: {}, avatar: '', nickname: '' });

    // useEffect(() => {
    //     (async () => {
    //         const userInfo = await getCurUserInfo();
    //         setUserInfo(userInfo);
    //     })();
    //     return;
    // }, []);

    // const userInfoPopover = (
    //     <div style={{ cursor: 'pointer' }}>
    //         <div onClick={handleLogout}>退出登录</div>
    //     </div>
    // );

    return (
        <div className={css['header-bar']}>
            {/* <h3 className={css['header-bar-title']}>前端轻松学后台管理</h3> */}
            <HorizontalMenu />
            {/* <Popover content={userInfoPopover} placement="leftTop">
                <div className={css['header-bar-avatar']}>
                    <img src={userInfo.avatar} />
                    <DownOutlined style={{ color: 'white' }} />
                </div>
            </Popover> */}
        </div>
    );
}
