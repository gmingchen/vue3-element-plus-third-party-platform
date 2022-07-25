/*
 * @Description: 管理员
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-05-20 15:47:56
 */
import service from '@/utils/request'

/**
 * @description: 获取当前管理员
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function selfInfoApi() {
  return service({
    url: '/backstage/administrator/self/info',
    method: 'get'
  })
}

/**
 * @description: 编辑基础信息
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function editBasicApi(params) {
  return service({
    url: `/backstage/administrator/update/basic`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 编辑密码
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function editPasswordApi(params) {
  return service({
    url: `/backstage/administrator/update/password`,
    method: 'post',
    data: params
  })
}
