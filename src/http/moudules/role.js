import axios from '../axios'

/* 
 * 角色管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/role/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/role/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/role/queryRoles',
        method: 'post',
        data
    })
}
// 查询全部
export const findAll = (data) => {
    return axios({
        url: '/role/queryRoles',
        method: 'post',
        data
    })
}
// 查询角色菜单集合
export const findRoleMenus = (data) => {
    return axios({
        url: '/role/queryMenuByRoleId',
        method: 'post',
        data
    })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
    return axios({
        url: '/role/saveRoleMenus',
        method: 'post',
        data
    })
}