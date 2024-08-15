import request from '../utils/request';

/**
 * 添加、修改用户帖子点赞 add,modify
 * @param data 用户帖子点赞
 * @returns {*} 结果
 */
export const saveUserPostLike = (data) => {
    return request({
        url: '/userPostLike', method: 'POST', data: data
    })
}

/**
 * 删除用户帖子点赞    delete
 * @param ids ID列表
 * @returns {*} 结果
 */
export const removeUserPostLikeBatchByIds = (ids) => {
    return request({
        url: `/userPostLike/${ids}`, method: 'DELETE'
    })
}

/**
 * 查询用户帖子点赞列表  search list
 * @param params 用户帖子点赞
 * @returns {*} 结果
 */
export const getUserPostLikeList = (params) => {
    return request({
        url: '/userPostLike/list', method: 'GET', params: params
    })
}

/**
 * 查询用户帖子点赞分页 search page user post like
 * @param params 用户帖子点赞
 * @returns {*} 结果
 */
export const getUserPostLikePage = (params) => {
    return request({
        url: '/userPostLike/page', method: 'GET', params: params
    })
}

/**
 * 查询用户帖子点赞 search user post like
 * @param params 用户帖子点赞
 * @returns {*} 结果
 */
export const getUserPostLikeOne = (params) => {
    return request({
        url: '/userPostLike', method: 'GET', params: params
    })
}
