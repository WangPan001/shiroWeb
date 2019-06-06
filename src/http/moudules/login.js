import axios from '../axios'

/* 
 * 系统登录模块
 */

// 登录
export const login = data => {
    return axios({
        url: 'admin/login',
        method: 'post',
        data
    })
}

// 登出
export const logout = () => {
    return axios({
        url: 'admin/logout',
        method: 'get',
    })
}

// 验证验证码
export const checkImageCode = data => {
    return axios({
        url: 'checkImageCode',
        method: 'post',
        data
    })
}
