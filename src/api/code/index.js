/*
 * @Description: 微信第三方平台代码管理
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2022-07-19 03:15:11
 * @LastEditors: gumingchen
 * @LastEditTime: 2022-07-19 03:15:11
 */
import service from '@/utils/request'

/**
 * @description: 草稿箱列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function draftListApi(params) {
  return service({
    url: `/backstage/code/draft/list/${ params }`,
    method: 'get'
  })
}

/**
 * @description: 添加草稿到模板库
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function addDraftToTemplateApi(params) {
  return service({
    url: `/backstage/code/draft/add`,
    method: 'post',
    data: params
  })
}

/**
 * @description: 草稿箱列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function templateListApi(params) {
  return service({
    url: `/backstage/code/template/list`,
    method: 'get',
    params: params
  })
}

/**
 * @description: 删除模板
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function deleteTemplateApi(params) {
  return service({
    url: `/backstage/code/template/delete`,
    method: 'post',
    data: params
  })
}

