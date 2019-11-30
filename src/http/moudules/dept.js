import axios from '../axios'

/* 
 * 机构管理模块
 */

// 添加
export const save = (data) => {
    return axios({
        url: '/dept/add',
        method: 'post',
        data
    })
}
// 编辑
export const edit = (data) => {
    return axios({
        url: '/dept/edit',
        method: 'post',
        data
    })
}
// 删除
export const deleteDept = (data) => {
    return axios({
        url: '/dept/delete',
        method: 'post',
        data
    })
}
// 查询机构树
export const findDeptTree = (data) => {
    return axios({
        url: '/dept/queryDepts',
        method: 'post',
        data
    })
}