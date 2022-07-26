<template>
  <Container>
    <template v-if="havePermission('platform:create|platform:delete', '|')" #header>
      <el-form ref="refForm" :inline="true">
        <el-form-item>
          <el-button
            v-permission="'platform:create'"
            type="primary"
            @click="addEditHandle()">新增</el-button>
          <el-button
            v-permission="'platform:delete'"
            type="danger"
            @click="deleteHandle()"
            :disabled="selection.length <= 0">批量删除</el-button>
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
        <el-table-column type="expand">
          <template #default="{row}">
            <div class="padding-n-8">
              <el-descriptions :column="3" border>
                <el-descriptions-item label-class-name="width-110" label="名称">{{row.name}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="类型"><el-tag type="success">{{dictionaryMap[row.type]}}</el-tag></el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="官网">{{row.website}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="AppID">{{row.app_id}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="AppSecret">{{row.app_secret}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="校验Token">{{row.token}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="验证票据" :span="2">{{row.ticket || '-'}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="票据过期时间">{{row.ticket_expired_at || '-'}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="接口调用凭据" :span="2">{{row.access_token || '-'}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="凭据过期时间">{{row.access_token_expired_at || '-'}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="加解密Key">{{row.decrypt_key}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="简介" :span="2">{{row.introduction}}</el-descriptions-item>
                <el-descriptions-item label-class-name="width-110" label="业务标签">
                  <el-tag
                    type="success"
                    class="margin_r-5 margin_b-5"
                    v-for="item in row.business_tags"
                    :key="item.id">{{item.name}}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column
          align="center"
          label="ID"
          prop="id"
          width="80"
          :show-overflow-tooltip="true" />
        <el-table-column
          align="center"
          label="图标"
          prop="icon"
          width="80">
          <template v-slot="{ row }">
            <el-avatar :size="50" :src="row.icon" v-if="row.icon" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="AppID"
          prop="app_id"
          :show-overflow-tooltip="true" />
        <el-table-column
          align="center"
          label="名称"
          prop="name"
          :show-overflow-tooltip="true" />
        <el-table-column
          align="center"
          label="官网"
          prop="website"
          :show-overflow-tooltip="true" />
        <el-table-column
          align="center"
          label="类型"
          prop="type">
          <template v-slot="{ row }">
            <el-tag type="success">{{dictionaryMap[row.type]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="created_at"
          width="160" />
        <el-table-column
          align="center"
          label="更新时间"
          prop="updated_at"
          width="160" />
        <el-table-column
          align="center"
          label="操作"
          width="110"
          fixed="right">
          <template v-slot="{ row }">
            <el-button
              v-permission="'platform:update'"
              type="primary"
              link
              @click="addEditHandle(row.id)">编辑</el-button>
            <el-button
              v-permission="'platform:delete'"
              type="danger"
              link
              @click="deleteHandle(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <AddEdit ref="refAddEdit" v-if="visible" @refresh="getList" />
    </template>
  </Container>
</template>

<script>
import { defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import AddEdit from './components/add-edit.vue'

import useDictionary from '@/mixins/dictionary'
import { havePermission } from '@/utils'

import { listApi, delApi } from '@/api/platform'

export default defineComponent({
  components: { AddEdit },
  setup() {
    const refForm = ref()
    const refTable = ref()
    const refAddEdit = ref()

    const { dictionaryMap, getDictionary } = useDictionary()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
      },
      list: [],
      selection: []
    })

    /**
     * @description: 获取列表
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const getList = () => {
      data.loading = true
      listApi().then(r => {
        if (r) {
          data.list = r.data
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }

    /**
     * @description: 新增/编辑弹窗
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const addEditHandle = id => {
      data.visible = true
      nextTick(() => {
        refAddEdit.value.init(id)
      })
    }

    /**
     * @description: 删除
     * @param {number} id
     * @return {*}
     * @author: gumingchen
     */
    const deleteHandle = id => {
      const ids = id ? [id] : data.selection.map(item => item.id)
      ElMessageBox.confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApi({ keys: ids }).then(r => {
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

    /**
     * @description: table多选事件
     * @param {*} val
     * @return {*}
     * @author: gumingchen
     */
    const selectionHandle = val => {
      data.selection = val
    }

    onBeforeMount(() => {
      getDictionary('WX-PlatformType')
      getList()
    })

    return {
      refForm,
      refTable,
      refAddEdit,
      dictionaryMap,
      ...toRefs(data),
      getList,
      addEditHandle,
      deleteHandle,
      selectionHandle,
      havePermission
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.el-descriptions__content) {
  word-break: break-all;
}
</style>
