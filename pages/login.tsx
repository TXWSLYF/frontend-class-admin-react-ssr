import LoginForm from '../components/LoginForm';

export default function Login() {
    return (
        <div className="login">
            <LoginForm></LoginForm>
            <style jsx>{`
                .login {
                    height: 100vh;
                }
            `}</style>
        </div>
    );
}
