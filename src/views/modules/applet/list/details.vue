<template>
  <container v-loading="loading">
    <el-tabs v-model="active" v-if="info">
      <el-tab-pane label="基本信息" name="basic">
        <Basic :data="info" />
      </el-tab-pane>
      <el-tab-pane label="域名配置" name="domain">
        <Domain :data="info" />
      </el-tab-pane>
    </el-tabs>
  </container>
</template>

<script>
import { defineComponent, nextTick, onBeforeMount, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'

import Basic from './components/basic'
import Domain from './components/domain'

import { infoApi } from '@/api/applet'

export default defineComponent({
  components: { Basic, Domain },
  setup() {
    const route = useRoute()

    const data = reactive({
      loading: false,
      active: 'basic',
      info: null
    })

    const getInfo = () => {
      data.loading = true
      infoApi(route.query.id).then(r => {
        if (r) {
          data.info = r.data
        }
        nextTick(() => { data.loading = false })
      })
    }

    onBeforeMount(() => {
      getInfo()
    })
    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
