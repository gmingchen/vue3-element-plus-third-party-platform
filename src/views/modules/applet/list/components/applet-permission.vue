<template>
  <el-tag
    class="margin_r-5 margin_b-5"
    type="success"
    v-for="(item, index) in data"
    :key="index">{{dictionaryMap[item.funcscope_category.id] || '-'}}</el-tag>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'

import useDictionary from '@/mixins/dictionary'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { dictionaryMap, getDictionary } = useDictionary()

    onBeforeMount(() => {
      getDictionary('WX-AppletPermission')
    })

    return {
      dictionaryMap
    }
  }
})
</script>
