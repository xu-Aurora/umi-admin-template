import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HeartOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout from '@ant-design/pro-layout';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { Avatar, ConfigProvider } from 'antd';
import { useState, useEffect, useRef, Component } from 'react';
import { history, useLocation, withRouter } from 'umi';
import Menus from '@/components/menus';
import TabView from '@/components/TabView';
import defaultSetting from './defaultSetting';
import { getKeyName } from '@/assets/utils';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';

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


interface PanesItemProps {
  title: string;
  content: Component;
  key: string;
  closable: boolean;
  path: string;
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const noNewTab = ['/login', '/403'] // 不需要新建 tab的页面

const BaseLayout = () => {

  const { pathname, search } = useLocation()

  const [tabActiveKey, setTabActiveKey] = useState<string>('home')
  const [panesItem, setPanesItem] = useState<PanesItemProps>({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: ''
  })
  const pathRef: RefType = useRef<string>('')
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const { tabKey, title, component: Content } = getKeyName(pathname)
    // 新tab已存在或不需要新建tab，return
    if (pathname === pathRef.current || noNewTab.includes(pathname)) {
      setTabActiveKey(tabKey)
      return
    }

    // 记录新的路径，用于下次更新比较
    const newPath = search ? pathname + search : pathname
    pathRef.current = newPath

    setPanesItem({
      title,
      content: Content,
      key: tabKey,
      closable: tabKey !== 'home',
      path: newPath
    })
    setTabActiveKey(tabKey)
  }, [pathname, search])

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
          <TabView
            defaultActiveKey="home"
            panesItem={panesItem}
            tabActiveKey={tabActiveKey}
          />
        </ConfigProvider>
      </ProLayout>
    </div>
  );
};


export default withRouter(BaseLayout);