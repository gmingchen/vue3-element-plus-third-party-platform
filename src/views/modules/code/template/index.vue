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
          <el-select v-model="form.type">
            <el-option label="全部" value="" />
            <el-option
              v-for="item in dictionaryList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="reacquireHandle()" :disabled="!active">搜索</el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()" :disabled="!active">重置</el-button>
          <el-button
            v-permission="'code:template:delete'"
            type="danger"
            @click="deleteHandle()"
            :disabled="!active || selection.length <= 0">批量删除</el-button>
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
          prop="template_id"
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
          label="添加到模板库的时间"
          prop="create_time"
          width="160" />
        <el-table-column
          align="center"
          label="操作"
          width="80"
          fixed="right">
          <template v-slot="{ row }">
            <el-button
              v-permission="'code:template:delete'"
              type="danger"
              link
              @click="deleteHandle(row.template_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </ContainerSidebar>
</template>

<script >
import { defineComponent, reactive, ref, toRefs, nextTick, onBeforeMount } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import ContainerSidebar from '@/components/container-sidebar'
import PlatformSidebar from '@/components/platform-sidebar'

import useDictionary from '@/mixins/dictionary'
import { clearJson, parseDate2Str } from '@/utils'

import { templateListApi, deleteTemplateApi } from '@/api/code'

export default defineComponent({
  components: { ContainerSidebar, PlatformSidebar },
  setup() {
    const refContainerSidebar = ref()
    const refForm = ref()
    const refTable = ref()

    const { dictionaryList, dictionaryMap, getDictionary } = useDictionary()
    const data = reactive({
      active: '',
      loading: false,
      visible: false,
      form: {
        keyword: '',
        type: ''
      },
      list: [],
      selection: []
    })

    const getList = () => {
      if (data.active) {
        data.loading = true
        const params = {
          id: data.active,
          type: data.form.type
        }
        templateListApi(params).then(r => {
          if (r) {
            const list = r.data.sort((a, b) => {
              return b.create_time - a.create_time
            })
            if (data.form.keyword) {
              const reg = new RegExp(data.form.keyword)
              data.list = list.filter(item => {
                return item.user_version.match(reg) || item.source_miniprogram_appid.match(reg) || item.source_miniprogram.match(reg)
              })
            } else {
              data.list = list
            }
            data.list = data.list.map(item => {
              return {
                ...item,
                create_time: parseDate2Str(new Date(item.create_time * 1000))
              }
            })
          }
          nextTick(() => { data.loading = false })
        })
      }
    }

    const reacquireHandle = () => {
      getList()
    }

    const deleteHandle = (id) => {
      const ids = id ? [id] : data.selection.map(item => item.template_id)
      ElMessageBox.confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          platform_id: data.active,
          template_ids: ids
        }
        deleteTemplateApi(params).then(r => {
          if (r) {
            ElMessage({
              message: '操作成功!',
              type: 'success'
            })
            getList()
          }
        })
      }).catch(() => {
        // to do something on canceled
      })
    }

    const selectionHandle = (val) => {
      data.selection = val
    }

    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop()
      getList()
    }

    onBeforeMount(() => {
      getDictionary('WX-TemplateType')
    })

    return {
      refContainerSidebar,
      refForm,
      refTable,
      dictionaryList,
      dictionaryMap,
      ...toRefs(data),
      getList,
      reacquireHandle,
      deleteHandle,
      selectionHandle,
      changeHandle,
      clearJson
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
