import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import is from 'is_js';
import { toast, ToastContainer } from 'react-toastify';
import 'assets/css/custom.css';
import 'assets/css/responsive.css';

import MainLayout from './MainLayout';
import HomeLayout from './HomeLayout';
import Home from 'components/Home';
import Error500 from 'components/errors/Error500';

import CardLogin from 'components/authentication/card/Login';
import CardForgetPassword from 'components/authentication/card/ForgetPassword';
import CardConfirmMail from 'components/authentication/card/ConfirmMail';
import CardPasswordReset from 'components/authentication/card/PasswordReset';
import Logout from 'components/authentication/card/Logout';

import Spinners from 'components/doc-components/Spinners';
import Dashboard from 'components/dashboards/default/dashboard';
import Clients from 'components/Clients/clients';
import CompanyMaster from 'components/Company/CompanyMaster';
import User from 'components/User/User';
import Product from 'components/Product/Product';
import Farmers from 'components/Farmers/Farmers';
import CollectionCentre from 'components/CollectionCentre/CollectionCentre';
import DistributionCentre from 'components/DistributionCentre/DistributionCentre';
import ProductLine from 'components/ProductLine/ProductLine';
import MenuDetails from 'components/MenuDetails/MenuDetails';

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;

  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
  }, [HTMLClassList]);

  return (
    <>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/error" element={<Error500 />} />
        </Route>
        <Route path="/login" element={<CardLogin />} />
        <Route path="/forgot-password" element={<CardForgetPassword />} />
        <Route path="/confirm-mail" element={<CardConfirmMail />} />
        <Route path="/reset-password/:id" element={<CardPasswordReset />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/spinners" element={<Spinners />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/clients" element={<Clients />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/companies" element={<CompanyMaster />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/users" element={<User />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/products" element={<Product />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/farmers" element={<Farmers />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/collection-centres" element={<CollectionCentre />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/distribution-centres" element={<DistributionCentre />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/product-lines" element={<ProductLine />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/add-menu" element={<MenuDetails />} />
        </Route>
      </Routes>
      <ToastContainer icon={false} position={toast.POSITION.TOP_RIGHT} />
    </>
  );
};

export default Layout;