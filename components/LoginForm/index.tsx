import css from './index.module.scss';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../api/auth';
import Router from 'next/router';
import { menuList } from '../../common/constant';

export default function LoginForm() {
    const onFinish = async (value: ILoginData) => {
        const { name, password } = value;
        console.log(name, password);
        await login({ name, password });
        Router.replace(menuList[0].children[0].path);
    };

    return (
        <div className={css['login-form']}>
            <div className={css['login-form-main']}>
                <div className={css['login-form-logo']}>
                    <img src="http://static.xhxly.cn//getheadimg.jpg" />
                </div>
                <div className={css['login-form-content']}>
                    <div className={css['account-slogon']}>
                        <p>前端轻松学后台管理页面</p>
                    </div>
                    <div className={css['account-login']}>
                        <Form onFinish={onFinish}>
                            <Form.Item name="name" rules={[{ required: true, message: '请输入账号' }]}>
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={css['login-form-button']}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
