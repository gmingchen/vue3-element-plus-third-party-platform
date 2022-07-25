/*
 * @Description: 微信第三方平台业务标签
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
    url: '/backstage/business/tag/page',
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
    url: `/backstage/business/tag/info/${ params }`,
    method: 'get'
  })
}

/**
 * @description: 新增
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function addApi(params) {
  return service({
    url: '/backstage/business/tag/create',
    method: 'post',
    data: params
  })
}

/**
 * @description: 编辑
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function editApi(params) {
  return service({
    url: '/backstage/business/tag/update',
    method: 'post',
    data: params
  })
}

/**
 * @description: 删除
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function delApi(params) {
  return service({
    url: '/backstage/business/tag/delete',
    method: 'post',
    data: params
  })
}

/**
 * @description: 所有业务标签
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function selectListApi() {
  return service({
    url: '/backstage/business/tag/select/list',
    method: 'get'
  })
}
