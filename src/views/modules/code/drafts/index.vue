<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <PlatformSidebar v-model="active" @change="changeHandle" />
    </template>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input v-model="form.keyword" placeholder="版本号 / AppId / 名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="reacquireHandle()" :disabled="!active">搜索</el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()" :disabled="!active">重置</el-button>
          <el-button
            v-permission="'code:draft:add'"
            type="primary"
            @click="addHandle()"
            :disabled="!active || selection.length <= 0">批量添加到模板库</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #default>
      <el-table
        ref="refTable"
        v-loading="loading"
        :data="list"
        @selection-change="selectionHandle"
        border>
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column
          align="center"
          label="ID"
          prop="draft_id"
          width="80" />
        <el-table-column
          align="center"
          label="版本号"
          prop="user_version" />
        <el-table-column
          align="center"
          label="描述"
          prop="user_desc" />
        <el-table-column
          align="center"
          label="上传者"
          prop="developer" />
        <el-table-column
          align="center"
          label="代开发小程序"
          prop="source_miniprogram" />
        <el-table-column
          align="center"
          label="代开发小程序AppId"
          prop="source_miniprogram_appid" />
        <el-table-column
          align="center"
          label="上传时间"
          prop="create_time"
          width="160" />
        <el-table-column
          align="center"
          label="操作"
          width="120"
          fixed="right">
          <template v-slot="{ row }">
            <el-button
              v-permission="'code:draft:list'"
              type="primary"
              link
              @click="addHandle(row.draft_id)">添加到模板库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Add ref="refAdd" v-if="visible" />
    </template>
  </ContainerSidebar>
</template>

<script >
import { defineComponent, reactive, ref, toRefs, nextTick } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import ContainerSidebar from '@/components/container-sidebar'
import PlatformSidebar from '@/components/platform-sidebar'
import Add from './components/add'

import { clearJson, parseDate2Str } from '@/utils'

import { draftListApi } from '@/api/code'

export default defineComponent({
  components: { ContainerSidebar, PlatformSidebar, Add },
  setup() {
    const refContainerSidebar = ref()
    const refForm = ref()
    const refTable = ref()
    const refAdd = ref()

    const data = reactive({
      active: '',
      loading: false,
      visible: false,
      form: {
        keyword: ''
      },
      all: [],
      list: [],
      selection: []
    })

    const getList = () => {
      if (data.active) {
        data.loading = true
        draftListApi(data.active).then(r => {
          if (r) {
            data.all = r.data.sort((a, b) => {
              return b.create_time - a.create_time
            })
            data.all = data.all.map(item => {
              return {
                ...item,
                create_time: parseDate2Str(new Date(item.create_time * 1000))
              }
            })
            data.list = data.all
          }
          nextTick(() => { data.loading = false })
        })
      }
    }

    const reacquireHandle = () => {
      if (data.form.keyword) {
        const reg = new RegExp(data.form.keyword)
        data.list = data.all.filter(item => {
          return item.user_version.match(reg) || item.source_miniprogram_appid.match(reg) || item.source_miniprogram.match(reg)
        })
      } else {
        data.list = data.all
      }
    }

    const addHandle = (id) => {
      data.visible = true
      nextTick(() => {
        const ids = id ? [id] : data.selection.map(item => item.draft_id)
        refAdd.value.init(data.active, ids)
      })
    }

    const selectionHandle = (val) => {
      data.selection = val
    }

    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop()
      getList()
    }

    return {
      refContainerSidebar,
      refForm,
      refTable,
      refAdd,
      ...toRefs(data),
      getList,
      reacquireHandle,
      addHandle,
      selectionHandle,
      changeHandle,
      clearJson
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
