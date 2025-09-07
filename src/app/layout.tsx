'use client';

import { useState, type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const AntdRegistry = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(() => createCache());

  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
