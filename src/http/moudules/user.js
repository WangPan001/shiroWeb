import axios from '../axios'

/* 
 * 用户管理模块
 */

// 添加
export const save = (data) => {
    return axios({
        url: '/user/add',
        method: 'post',
        data
    })
}
// 修改
export const edit = (data) => {
    return axios({
        url: '/user/edit',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/user/findList',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (data) => {
    return axios({
        url: '/menu/findNavTree',
        method: 'post',
        data
    })
}