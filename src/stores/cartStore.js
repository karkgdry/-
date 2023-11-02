//定义购物车模块
import { defineStore }  from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './user.js'
import { insertCartAPI,findNewCartListAPI,delCartAPI,mergeCartAPI } from '@/apis/cart'


export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    //根据isLogin是否有值来判断
    const isLogin = computed(() => userStore.userInfo.token)
    //定义state---cartList
    const cartList = ref([])
    //定义action ---addCart
    const addCart = async (goods) => {
        // console.log(goods);
        const { skuId, count } = goods
        if (isLogin.value) {
            //登录之后的加入购物车逻辑
            await insertCartAPI({ skuId, count })
            updateNewList()
        } else {
            //本地购物车逻辑
            //添加购物车操作
        //已经添加过 ---count
        //未添加过 --- push
        //思路:通过匹配传递过来的商品对象中的skuid能不能在cartList中找到,找到了就是已经添加过了
        const item = cartList.value.find((item) => goods.skuId === item.skuId)
        if (item) {
            item.count++
        } else {
            cartList.value.push(goods)
        }
        }
    }

    //删除购物车
    const delCart =async (skuId) => {
        if (isLogin.value) {
            //调用删除接口
            await delCartAPI([skuId])
            updateNewList()
        } else {
             //思路:1.找到要删除项的下标值 ---splice
             //     2.使用数组的过滤方法 --- filter
        const idx = cartList.value.findIndex((item) => skuId === item.skuId)
        cartList.value.splice(idx,1)
        }
    }

    //获取最新购物车列表action
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value=res.result
    }

    //清除购物车
    const clearCart = () => {
        cartList.value=[]
    }

    //单选功能
    const singleCheck = (skuId,selected) => {
        //通过skuId找到要修改的那一项,然后把它的selected状态改为传过来的selected
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected=selected
    }

    //全选功能
    const allCheck = (selected) => {
        //把cartList中的每一项的selected都设置为当前的全选框状态
        cartList.value.forEach(item=>item.selected=selected)
    }

    //计算属性
    //1.总的数量
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    //2.总价
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
    
    //3.是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected))
    
    //4.选中的数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))

    //5.选中的价格之和
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))
    return {
        cartList,
        addCart,
        delCart,
        allCount,
        allPrice,
        singleCheck,
        allCheck,
        isAll,
        selectedCount,
        selectedPrice,
        clearCart,
        updateNewList
    }
},
    {
        persist:true
    })