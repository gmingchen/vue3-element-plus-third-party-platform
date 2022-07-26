<template>
  <ContainerSidebar ref="refContainerSidebar" :scroll="false">
    <template #sidebar>
      <PlatformSidebar v-model="active" @change="changeHandle" />
    </template>
    <template #header>
      <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
        <el-form-item>
          <el-input v-model="form.name" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.appId" placeholder="AppId" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.version" placeholder="版本号" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status" placeholder="授权状态" clearable>
            <el-option
              v-for="item in dictionaryList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.enterpriseName" placeholder="企业名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="-"
            start-placeholder="授权开始日期"
            end-placeholder="授权结束日期"
            clearable />
        </el-form-item>
        <el-form-item>
          <el-button v-repeat @click="reacquireHandle()" :disabled="!active">搜索</el-button>
          <el-button v-repeat @click="clearJson(form), reacquireHandle()" :disabled="!active">重置</el-button>
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
          prop="id"
          width="80" />
        <el-table-column
          align="center"
          label="小程序码"
          prop="avatar"
          width="90">
          <template v-slot="{ row }">
            <el-image
              class="width-50 height-50"
              v-if="row.qrcode"
              :src="row.qrcode"
              :preview-src-list="[row.qrcode]"
              preview-teleported />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="头像"
          prop="avatar"
          width="80">
          <template v-slot="{ row }">
            <el-avatar :size="50" :src="row.avatar" v-if="row.avatar" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="名称"
          prop="name"
          show-overflow-tooltip />
        <el-table-column
          align="center"
          label="AppId"
          prop="app_id"
          show-overflow-tooltip />
        <el-table-column
          align="center"
          label="版本号"
          prop="version"
          width="90"
          show-overflow-tooltip />
        <el-table-column
          align="center"
          label="企业"
          prop="enterprise_name"
          show-overflow-tooltip />
        <el-table-column
          align="center"
          label="授权状态"
          prop="status"
          width="110">
          <template v-slot="{ row }">
            <el-tag type="success">{{dictionaryMap[row.status]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="授权时间"
          prop="created_at"
          width="160" />
        <el-table-column
          align="center"
          label="授权变更时间"
          prop="updated_at"
          width="160" />
        <el-table-column
          align="center"
          label="操作"
          width="80"
          fixed="right">
          <template v-slot="{ row }">
            <el-button
              v-permission="'applet:info'"
              type="primary"
              link
              @click="detailsHandle(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </ContainerSidebar>
</template>

<script >
import { defineComponent, reactive, ref, toRefs, nextTick, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import ContainerSidebar from '@/components/container-sidebar'
import PlatformSidebar from '@/components/platform-sidebar'

import usePage from '@/mixins/page'
import useDictionary from '@/mixins/dictionary'
import { clearJson, parseDate2Str } from '@/utils'

import { pageApi } from '@/api/applet'

export default defineComponent({
  components: { ContainerSidebar, PlatformSidebar },
  setup() {
    const router = useRouter()

    const refContainerSidebar = ref()
    const refForm = ref()
    const refTable = ref()

    const { dictionaryList, dictionaryMap, getDictionary } = useDictionary()
    const { page } = usePage()
    const data = reactive({
      active: '',
      loading: false,
      visible: false,
      form: {
        name: '',
        appId: '',
        version: '',
        status: '',
        enterpriseName: '',
        date: []
      },
      list: [],
      selection: []
    })

    const getList = () => {
      if (data.active) {
        const params = {
          id: data.active,
          ...data.form,
          start: data.form.date && data.form.date.length > 0 ? parseDate2Str(data.form.date[0]) : '',
          end: data.form.date && data.form.date.length > 1 ? parseDate2Str(data.form.date[1]) : ''
        }
        delete params.date
        data.loading = true
        pageApi(params).then(r => {
          if (r) {
            data.list = r.data.list
            page.total = r.data.total
          }
          nextTick(() => { data.loading = false })
        })
      }
    }

    const reacquireHandle = () => {
      page.current = 1
      getList()
    }

    const detailsHandle = (row) => {
      const customTabs = `小程序-${ row.name }`
      router.push({
        name: 'applet-details',
        query: {
          id: row.id,
          customTabs
        }
      })
    }

    const selectionHandle = (val) => {
      data.selection = val
    }

    const pageChangeHandle = (argPage) => {
      page.current = argPage.current
      page.size = argPage.size
      getList()
    }

    const changeHandle = (_row) => {
      refContainerSidebar.value.setScrollTop()
      getList()
    }

    onBeforeMount(() => {
      getDictionary('WX-AuthorizationStatus')
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
      detailsHandle,
      selectionHandle,
      pageChangeHandle,
      changeHandle,
      clearJson
    }
  }
})
</script>
