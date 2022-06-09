import type { ProSettings } from '@ant-design/pro-layout';

const headerHeight: number = 40;

export default <ProSettings> {
  layout: 'side',
  navTheme: 'dark',
  primaryColor: '#1890ff',
  fixSiderbar: true,
  fixedHeader: true,
  title: 'umi-template',
  contentWidth: 'Fluid',
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  headerHeight,
  collapsedButtonRender: false,
  contentStyle: {
    height: `calc(100vh - ${headerHeight}px)`,
    margin: '0px',
    overflowY: 'auto',
    padding: '10px'
  }
}