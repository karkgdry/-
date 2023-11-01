//axios基础的封装
import axios from "axios";
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import { useUserStore } from "@/stores/user";
import router from "@/router";

const httpInstance=axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout:5000
})
//拦截器

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  //从Pinia获取token数据
  const userStore = useUserStore()
  const token=userStore.userInfo.token
  //按照后端要求拼接token数据
  if (token) {
    config.headers.Authorization=`Bearer ${token}`
  }
    return config
  }, e => Promise.reject(e))
  
  // axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
  const userStore = useUserStore()
    //统一错误提示
    ElMessage({
      type: 'warning',
      message:e.response.data.message
    })
    //401token失效处理
    //1.清除本地用户数据
    //2.跳转登录页
    if (e.response.status === 401) {
      userStore.clearUseInfo()
      router.replace('/login')
    }
    return Promise.reject(e)
    
  })
  
export default httpInstance