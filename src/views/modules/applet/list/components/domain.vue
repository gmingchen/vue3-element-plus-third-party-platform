<template>
  <el-button type="primary" class="margin_b-10" v-permission="'applet:setDomain'">设置域名</el-button>
  <el-descriptions :column="1" border>
    <el-descriptions-item label-class-name="width-170" label="request合法域名">
      <el-tag
        class="margin_r-5 margin_b-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.network.requestDomain"
        :key="index">{{item}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-170" label="socket合法域名">
      <el-tag
        class="margin_r-5 margin_b-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.network.wsRequestDomain"
        :key="index">{{item}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-170" label="uploadFile合法域名">
      <el-tag
        class="margin_r-5 margin_b-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.network.uploadDomain"
        :key="index">{{item}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-170" label="downloadFile合法域名">
      <el-tag
        class="margin_r-5 margin_b-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.network.downloadDomain"
        :key="index">{{item}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-170" label="udp合法域名">
      <el-tag
        class="margin_r-5 margin_b-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.network.udpdomain"
        :key="index">{{item}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label-class-name="width-170" label="tcp合法域名">
      <el-tag
        class="margin_r-5 margin_b-5"
        type="success"
        v-for="(item, index) in data.authorizer_info.miniProgramInfo.network.tcpdomain"
        :key="index">{{item}}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>

</style>
