import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";

const LoginPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
