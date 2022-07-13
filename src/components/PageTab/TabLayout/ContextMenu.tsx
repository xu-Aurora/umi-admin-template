import React, { useContext } from 'react';
import { context, provider } from '../context';
import { Tab, CONTEXT_ACTIONS, Position, ContextMenuLabels } from '../interface';
import { getTabKeyFromLocation, isTabActive } from '../utils';

import styles from './index.less';

interface ContextMenuProps {
  tab: Tab | undefined;
  position: Position | undefined;
  history: any,
  handleTabClose: Function,
  menuLabels?: ContextMenuLabels,
  activeKey: any
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const { tab, position, history, handleTabClose, menuLabels, activeKey } = props;
  const store = useContext(context);
  const { tabs, dispatch } = store;

  const updateTabs = (newTabs: Tab[]) => {
    dispatch({
      type: CONTEXT_ACTIONS.UPDATE_TABS,
      payload: newTabs
    });
  }

  const closeTab = () => {
    if (!tab) return;
    handleTabClose(getTabKeyFromLocation(tab.location), 'remove');
  }

  const closeRightTabs = () => {
    if (!tab) return;
    const index = tabs.indexOf(tab);
    if (index < 0) return;
    if(!isTabActive(activeKey, tab.location)){
      const {pathname, query, hash} = tab.location;
      history.push({pathname, query, hash});
    }
    
    updateTabs(tabs.slice(0, index + 1));
  }


  const closeAllTabs = () => {
    history.push('/home');
    updateTabs(tabs.filter(tab => tab.route.name === '首页'));
  }

  return (
    <ul
      className={`${styles.contextMenu} ${tab && styles.show}`}
      style={{ left: position?.x, top: position?.y }}
    >
      <li onClick={closeTab}>{menuLabels?.closeTab || '关闭标签'}</li>
      <li onClick={closeRightTabs}>{menuLabels?.closeRightTabs || '关闭右侧标签'}</li>
      <li onClick={closeAllTabs}>{menuLabels?.closeAllTabs || '关闭所有标签'}</li>
    </ul>
  )
}

export default ContextMenu;