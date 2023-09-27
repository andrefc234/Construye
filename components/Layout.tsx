import React, { ReactNode } from 'react'
import SideBar from './SideBar'
import NavBar from './NavBar'
import {Box} from '@chakra-ui/react'
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      <SideBar><Box p={4}>{children}</Box></SideBar>
    </>
  );
};

export default Layout;