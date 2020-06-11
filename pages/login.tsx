import LoginForm from '../components/LoginForm';
import Head from 'next/head';

export default function Login() {
    return (
        <div className="login">
            <Head>
                <link href="//cdn.jsdelivr.net/npm/antd@4.3.2/dist/antd.min.css" rel="stylesheet"></link>
            </Head>
            <LoginForm></LoginForm>
            <style jsx>{`
                .login {
                    height: 100vh;
                }
            `}</style>
        </div>
    );
}
