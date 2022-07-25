<template>
  <el-dialog
    width="400px"
    title="添加到模板库"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable>
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top">
      <el-form-item label="模版类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="item.value" v-for="item in dictionaryList" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          v-repeat
          type="primary"
          @click="submit()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, nextTick, reactive, ref, toRefs, onBeforeMount } from 'vue'

import { ElMessage } from 'element-plus'

import useDictionary from '@/mixins/dictionary'

import { addDraftToTemplateApi } from '@/api/code'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref()

    const { dictionaryList, getDictionary } = useDictionary()
    const data = reactive({
      visible: false,
      form: {
        platform_id: '', // 平台ID
        draft_ids: [], // 草稿ID数组
        type: 1 // 模版类型
      }
    })
    const rules = reactive(function() {
      return {
        type: [{ required: true, message: '请选择模版类型', trigger: 'change' }]
      }
    }())

    const init = (id, ids) => {
      data.visible = true
      data.form.platform_id = id
      data.form.draft_ids = ids
    }

    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const submit = () => {
      refForm.value.validate(async valid => {
        if (valid) {
          const r = await addDraftToTemplateApi(data.form)
          if (r) {
            data.visible = false
            ElMessage({
              message: '操作成功!',
              type: 'success'
            })
            emit('refresh')
          }
        }
      })
    }

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const dialogClosedHandle = () => {
      refForm.value.resetFields()
    }

    onBeforeMount(() => {
      getDictionary('WX-TemplateType')
    })

    return {
      refForm,
      dictionaryList,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle
    }
  }
})
</script>
