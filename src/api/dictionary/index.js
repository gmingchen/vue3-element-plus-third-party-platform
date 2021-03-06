/*
 * @Description: 数据字典
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-05-20 15:47:56
 */
import service from '@/utils/request'

/**
 * @description: 列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function subSelectListApi(params) {
  return service({
    url: `/backstage/dictionary/sub/select/list/${ params }`,
    method: 'get'
  })
}
