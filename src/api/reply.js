import request from '../utils/request';

/**
 * 添加、修改回复 add,modify reply
 * @param data 回复
 * @returns {*} 结果
 */
export const saveReply = (data) => {
    return request({
        url: '/reply/save', method: 'POST', data: data
    })
}

export const sendReplyNotification = (data) => {
    return request({
        url: '/reply/sendnotification',
        method: 'POST',
        data: data
    });
}

/**
 * 删除回复    delete reply
 * @param ids ID列表
 * @returns {*} 结果
 */
export const removeReplyBatchByIds = (ids) => {
    return request({
        url: `/reply/${ids}`, method: 'DELETE'
    })
}

/**
 * 查询回复列表   search list reply
 * @param params 回复
 * @returns {*} 结果
 */
export const getReplyList = (params) => {
    return request({
        url: '/reply/list', method: 'GET', params: params
    })
}

/**
 * 查询回复分页   search page reply
 * @param params 回复
 * @returns {*} 结果
 */
export const getReplyPage = (params) => {
    return request({
        url: '/reply/page', method: 'GET', params: params
    })
}

/**
 * 查询回复     search reply
 * @param params 回复
 * @returns {*} 结果
 */
export const getReplyOne = (params) => {
    return request({
        url: '/reply', method: 'GET', params: params
    })
}
