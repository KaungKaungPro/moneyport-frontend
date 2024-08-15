import request from '../utils/request';

/**
 * 添加、修改帖子 add,modify
 * @param data 帖子
 * @returns {*} 结果
 */
export const savePost = (data) => {
    return request({
        url: '/post', method: 'POST', data: data
    })
}

/**
 * 删除帖子     delete
 * @param ids ID列表
 * @returns {*} 结果
 */
export const removePostBatchByIds = (ids) => {
    return request({
        url: `/post/${ids}`, method: 'DELETE'
    })
}

/**
 * 查询帖子列表   search list
 * @param params 帖子
 * @returns {*} 结果
 */
export const getPostList = (params) => {
    return request({
        url: '/post/list', method: 'GET', params: params
    })
}

/**
 * 查询帖子分页 search page
 * @param params 帖子
 * @returns {*} 结果
 */
export const getPostPage = (params) => {
    return request({
        url: '/post/page', method: 'GET', params: params
    })
}

/**
 * 查询帖子 search
 * @param params 帖子
 * @returns {*} 结果
 */
export const getPostOne = (params) => {
    return request({
        url: '/post', method: 'GET', params: params
    })
}
