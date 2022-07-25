<template>
  <el-dialog
    width="500px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable>
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="名称"
          maxlength="20"
          show-word-limit />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="item.value" v-for="item in dictionaryList" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" prop="describe">
        <el-input
          v-model="form.describe"
          placeholder="描述"
          type="textarea"
          rows="3"
          maxlength="100"
          show-word-limit />
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

import { infoApi, addApi, editApi } from '@/api/business-tag'

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref()

    const { dictionaryList, getDictionary } = useDictionary()
    const data = reactive({
      visible: false,
      loading: false,
      form: {
        id: null,
        name: '',
        type: 1,
        describe: ''
      }
    })

    const rules = reactive(function() {
      return {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      }
    }())

    const init = async (id) => {
      data.visible = true
      data.loading = true
      data.form.id = id
      if (id) {
        const r = await infoApi(data.form.id)
        if (r) {
          data.form.name = r.data.name
          data.form.describe = r.data.describe
          data.form.type = r.data.type
        }
      }
      nextTick(() => { data.loading = false })
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
          const params = { ...data.form }
          const r = data.form.id ? await editApi(params) : await addApi(params)
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
      getDictionary('WX-BusinessTag')
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
