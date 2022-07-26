<template>
  <el-descriptions :column="4" border direction="vertical">
    <el-descriptions-item label-class-name="width-110" label="AppId">{{data.app_id || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="名称">{{data.authorizer_info.nick_name || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="头像">
      <el-avatar :size="50" :src="data.authorizer_info.head_img" v-if="data.authorizer_info.head_img" />
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="小程序码">
      <el-image
        class="width-50 height-50"
        v-if="data.authorizer_info.qrcode_url"
        :src="data.authorizer_info.qrcode_url"
        :preview-src-list="[data.authorizer_info.qrcode_url]"
        preview-teleported />
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="原始ID">{{data.authorizer_info.user_name || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="授权状态">
      <AppletTag :data="data.status" dictionary="WX-AuthorizationStatus" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="授权时间">{{data.created_at || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="授权变更时间">{{data.updated_at || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="主体名称">{{data.authorizer_info.principal_name || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="当前版本">{{data.version || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="企业名称">{{data.enterprise_name || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="平台名称">{{data.platform_name || '-'}}</el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="类型">
      <AppletTag :data="data.authorizer_info.service_type_info.id" dictionary="WX-AppletType" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="认证类型">
      <AppletTag :data="data.authorizer_info.verify_type_info.id" dictionary="WX-AppletVerifyType" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="注册类型">
      <AppletTag :data="data.authorizer_info.register_type" dictionary="WX-AppletRegisterType" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="帐号状态">
      <AppletTag :data="data.authorizer_info.account_status" dictionary="WX-AppletAccountStatus" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="刷新令牌">
      {{ data.refresh_token || '-' }}
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="接口调用令牌">
      {{ data.access_token || '-' }}
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-110" label="过期时间">
      {{ data.access_token_expired_at || '-' }}
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="支付功能">
      <el-tag type="success">{{dictionaryMap[data.authorizer_info.business_info.open_pay]}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="摇一摇功能">
      <el-tag type="success">{{dictionaryMap[data.authorizer_info.business_info.open_shake]}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="扫商品功能">
      <el-tag type="success">{{dictionaryMap[data.authorizer_info.business_info.open_scan]}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="卡券功能">
      <el-tag type="success">{{dictionaryMap[data.authorizer_info.business_info.open_card]}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="门店功能">
      <el-tag type="success">{{dictionaryMap[data.authorizer_info.business_info.open_store]}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="手机号">
      <AppletTag :data="data.authorizer_info.basic_config.is_phone_configured ? 1 : 0" dictionary="WX-AppletBindingStatus" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="邮箱">
      <AppletTag :data="data.authorizer_info.basic_config.is_email_configured ? 1 : 0" dictionary="WX-AppletBindingStatus" />
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="类目" :span="2">
      <el-tag
        class="margin_r-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.categories"
        :key="index">
        {{item.first}}-{{item.second}}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-150" label="权限集" span="4">
      <AppletPermission :data="data.authorization_info.func_info" />
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'

import AppletTag from './applet-tag'
import AppletPermission from './applet-permission'

import useDictionary from '@/mixins/dictionary'

export default defineComponent({
  components: { AppletTag, AppletPermission },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { dictionaryMap, getDictionary } = useDictionary()

    onBeforeMount(() => {
      getDictionary('WX-AppletOpeningStatus')
    })

    return {
      dictionaryMap
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.el-descriptions__content) {
  word-break: break-all;
}
</style>
