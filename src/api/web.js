import request from "../utils/request";

/**
 * PC端登录
 * @param data PC端登录请求体
 * @returns {*} 结果
 */
export const login = (data) => {
    return request({
        url: '/web/login', method: 'POST', data: data
    })
}

/**
 * 注册用户
 * @param data 用户信息
 * @returns {*} 结果
 */
export const register = (data) => {
    return request({
        url: '/web/register', method: 'POST', data: data
    })
}
