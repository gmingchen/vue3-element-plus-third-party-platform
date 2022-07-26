/*
 * @Description: 微信第三方平台授权小程序
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2022-07-14 04:41:40
 * @LastEditors: gumingchen
 * @LastEditTime: 2022-07-14 04:41:40
 */
import service from '@/utils/request'

/**
 * @description: 分页列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function pageApi(params) {
  return service({
    url: '/backstage/applet/page',
    method: 'get',
    params: params
  })
}

/**
 * @description: 信息
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function infoApi(params) {
  return service({
    url: `/backstage/applet/info/${ params }`,
    method: 'get'
  })
}

/**
 * @description: 设置服务器域名
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function setDomainApi(params) {
  return service({
    url: `/backstage/applet/set/domain`,
    method: 'post',
    data: params
  })
}
