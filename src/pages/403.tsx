import { Result, Button } from 'antd'
import { history } from 'umi'

const Page403 = () => {

  const backHome = () => {
    history.replace('/home')
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问此页面，如有疑问请联系管理员！"
      extra={
        <Button type="primary" onClick={backHome}>返回主页</Button>
      }
    />
  )
  
}

export default Page403
