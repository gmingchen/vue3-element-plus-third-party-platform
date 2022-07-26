<template>
  <el-tag type="success">{{dictionaryMap[data]}}</el-tag>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'

import useDictionary from '@/mixins/dictionary'

export default defineComponent({
  props: {
    data: {
      type: Number,
      required: true
    },
    dictionary: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { dictionaryMap, getDictionary } = useDictionary()

    onBeforeMount(() => {
      getDictionary(props.dictionary)
    })

    return {
      dictionaryMap
    }
  }
})
</script>
