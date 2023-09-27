import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { SessionProvider, useSession, getSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout'

import React, { useEffect, useState } from 'react';
import { NextComponentType, NextPageContext } from 'next';
import Head from 'next/head';

import Login from '@/components/Login'
type MyAppProps = AppProps & {
  Component: NextComponentType<NextPageContext, any, any>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps & { pageProps: { session: any } }) {
  const { data: sessionData, status } = useSession();

  const { colorMode } = useColorMode();
  const isColorModeLoaded = colorMode === undefined;
  const router = useRouter();
const [sessionact, setsessionact] = useState(false)
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
     
     if (!session) {
       return <><Login/></>
      }
    };

    if (status === 'loading') {
      return;
    }

    checkSession();
  }, [status, router]);

  if (status === 'loading' && isColorModeLoaded) {
    return <>loading</>;
  }

  return (
    <ChakraProvider>
       <Head>
        <title>Construye</title>
        <meta name="description" content="no pierdas el tiempo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
   <Layout>
        <Component {...pageProps} />
        </Layout>
    </ChakraProvider>
  );
}

export default function App({ Component, pageProps,router }: MyAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <MyApp Component={Component} pageProps={pageProps} router={router}  />
    </SessionProvider>
  );
}
