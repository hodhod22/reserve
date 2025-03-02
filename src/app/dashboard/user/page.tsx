import Layout from "@/components/Layout";
import LiveExchange from "@/components/LiveExchange";
import ExchangeForm from "@/components/ExchangeForm";
import SendCurrency from "@/components/SendCurrency";
const UserDashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
       
          <ExchangeForm />
          <SendCurrency/>
      
        <LiveExchange />
      </div>
    </Layout>
  );
};

export default UserDashboard;
