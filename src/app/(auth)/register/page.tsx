import RegisterForm from "@/components/RegisterForm";
import Layout from "@/components/Layout";

const RegisterPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
