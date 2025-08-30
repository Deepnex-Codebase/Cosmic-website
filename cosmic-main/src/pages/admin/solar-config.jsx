import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import SolarConfigCMS from '../../components/admin/SolarConfigCMS';

const SolarConfigPage = () => {
  return (
    <AdminLayout>
      <SolarConfigCMS />
    </AdminLayout>
  );
};

export default SolarConfigPage;