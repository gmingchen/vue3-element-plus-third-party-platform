<template>
  <div class="enterprise-sidebar-container height-full width-300 flex-box flex_d-column">
    <el-input class="margin_b-10" v-model="form.name" @keyup.enter="reacquireHandle()">
      <template #suffix>
        <Iconfont name="search" />
      </template>
    </el-input>
    <el-scrollbar class="flex-item_f-1" v-loading="loading">
      <ul>
        <li
          class="flex-box flex_a_i-center cursor-pointer"
          :class="{ 'is-active': item.id === value }"
          v-for="item in list"
          :key="item.id"
          @click="clickHandle(item)">
          <el-avatar
            :size="36"
            :src="item.icon"
            v-if="item.icon"
            class="margin_r-10" />
          <div class="flex-item_f-1 font-size-14">
            <div class="ellipse-1">{{item.name}}</div>
            <div class="ellipse-1">{{item.app_id}}</div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent, nextTick, onBeforeMount, reactive, toRefs } from 'vue'

import useModel from '@/mixins/model'
import { UPDATE_MODEL_EVENT } from '@/utils/constant'

import { selectListApi } from '@/api/platform'

export default defineComponent({
  emits: ['change', UPDATE_MODEL_EVENT],
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    }
  },
  setup(props, { emit }) {
    const value = useModel(props)

    const data = reactive({
      loading: false,
      form: {
        name: ''
      },
      all: [],
      list: []
    })

    const getList = async () => {
      data.loading = true
      await selectListApi().then(r => {
        if (r) {
          data.all = r.data
          data.list = r.data
        }
        nextTick(() => { data.loading = false })
      })
    }

    const reacquireHandle = () => {
      if (data.form.name) {
        const reg = new RegExp(data.form.name)
        data.list = data.all.filter(item => {
          return item.name.match(reg)
        })
      } else {
        data.list = data.all
      }
    }

    const clickHandle = (row) => {
      value.value = row.id
      emit('change', row)
    }

    onBeforeMount(async () => {
      await getList()
      if (data.all.length) {
        clickHandle(data.all[0])
      }
    })

    return {
      value,
      ...toRefs(data),
      reacquireHandle,
      clickHandle
    }
  }
})
</script>

<style lang="scss" scoped>
.enterprise-sidebar-container {
  ul {
    li + li {
      margin-top: 10px;
    }
    li {

      &:hover {
        color: var(--el-color-primary)
      }
    }
    .is-active {
      color: var(--el-color-primary)
    }
  }
}
</style>
