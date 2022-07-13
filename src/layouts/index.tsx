import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HeartOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout from '@ant-design/pro-layout';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { Avatar, ConfigProvider } from 'antd';
import { useState } from 'react';
import { history, useLocation, withRouter } from 'umi';
import Menus from '@/components/menus';
import defaultSetting from './defaultSetting';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';

import { TabLayout } from '@/components/PageTab';


moment.locale('en');

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />
};

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ icon, routes, ...item }) => ({
    ...item,
    icon: icon && IconMap[icon as string],
    routes: routes && loopMenuItem(routes),
  }));



const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


const BaseLayout = (props) => {

  const { pathname } = useLocation()

  const [collapsed, setCollapsed] = useState(true);


  const pagePush = (path: string) => {
    history.push(path);
  }


  return (
    <div id="pro-layout">
      <ProLayout
        { ...defaultSetting }
        location={{
          pathname
        }}
        menu={{
          request: async () => {
            await waitTime(2000);
            return loopMenuItem(Menus);
          }
        }}
        onMenuHeaderClick={() => pagePush('/home')}
        menuItemRender={(item, dom) => (
          <a onClick={() => pagePush(item.path)}>
            { dom }
          </a>
        )}
        rightContentRender={() => (
          <div>
            <Avatar shape="square" size="small" icon={<UserOutlined />} />
          </div>
        )}
        // 解决浏览器title动态动态渲染问题
        pageTitleRender={() => {
          return 'umi-template'
        }}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        headerContentRender={() => {
          return (
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              { collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
            </div>
          );
        }}
      >
        <ConfigProvider locale={zhCN}>
          <TabLayout {...props} />
        </ConfigProvider>
      </ProLayout>
    </div>
  );
};


export default withRouter(BaseLayout);