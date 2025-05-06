import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import WolfProLinkBanner from '@/components/WolfProLinkBanner';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <WolfProLinkBanner variant="compact" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard cards and widgets */}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
