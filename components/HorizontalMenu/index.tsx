import { Menu } from 'antd';
import React from 'react';
import { menuList } from '../../common/constant';
import Router from 'next/router';

const { SubMenu } = Menu;

const handleClickMenuItem = (path: string) => {
    Router.push(path);
};

export default function HorizontalMenu() {
    // TODO:主动展开当前菜单
    // const [defaultSelectedKey, setDefaultSelectedKey] = useState('');
    // const [defaultOpenKey, setDefaultOpenKey] = useState('');

    // useEffect(() => {
    //     setDefaultSelectedKey(Router.route);

    //     for (let i = 0; i < menuList.length; i++) {
    //         const { title, children } = menuList[i];

    //         for (let j = 0; j < children.length; j++) {
    //             if (children[j].path === Router.route) {
    //                 setDefaultOpenKey(title);
    //                 return;
    //             }
    //         }
    //     }
    // }, []);

    return (
        <Menu
            // style={{ width: 150 }}
            // defaultSelectedKeys={[defaultSelectedKey]}
            // defaultOpenKeys={[defaultOpenKey]}
            mode="horizontal"
        >
            {menuList.map((menu) => {
                const { Icon, title, children } = menu;

                return (
                    <SubMenu
                        key={title}
                        title={
                            <span>
                                <Icon />
                                <span>{title}</span>
                            </span>
                        }
                    >
                        {children.map((child) => {
                            const { title, path } = child;
                            return (
                                <Menu.Item
                                    key={path}
                                    onClick={() => {
                                        handleClickMenuItem(path);
                                    }}
                                >
                                    {title}
                                </Menu.Item>
                            );
                        })}
                    </SubMenu>
                );
            })}
        </Menu>
    );
}
