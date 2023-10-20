//定义懒加载插件,使得main.js中只需负责注册插件即可
import { useIntersectionObserver } from '@vueuse/core'
export const lazyPlugin = {
    install(app) {
        //懒加载指令逻辑
        app.directive('img-lazy', {
            mounted(el, binding) {
                //el:指令绑定的元素
                //binding:binding.value 指令等于号后面绑定的表达式的值 (此处为图片的URL)
                console.log(el, binding.value);
                const {stop} = useIntersectionObserver(
                   el,
                    ([{ isIntersecting }]) => {
                      console.log(isIntersecting);
                        if (isIntersecting) {
                            //进入视口区域
                            el.src = binding.value
                            stop()
                      }
                    },
                  )
              
            }
        })
    }
}