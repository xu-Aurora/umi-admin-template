import { useState } from 'react'

export interface ITabs {
  curTab: any[]
  currentTab?: string | undefined
  status?: 'idle' | 'loading'
  reloadPath: string // 需要刷新的tab路径
}

export default () => {

  const [tabs, setTabs] = useState<ITabs>({
    curTab: ['/home'],
    reloadPath: 'null' // 需要刷新的tab路径
  })

  return { 
    tabs, 
    setTabs
  }
}
