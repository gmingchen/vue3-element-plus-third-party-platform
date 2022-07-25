<template>
  <el-dialog
    width="800px"
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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="item.value" v-for="item in dictionaryList" :key="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="名称"
              maxlength="20"
              show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="AppID" prop="app_id">
            <el-input v-model="form.app_id" placeholder="AppID" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="AppSecret" prop="app_secret">
            <el-input v-model="form.app_secret" placeholder="AppSecret" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消息校验Token" prop="token">
            <el-input v-model="form.token" placeholder="消息校验Token" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消息加解密Key" prop="decrypt_key">
            <el-input v-model="form.decrypt_key" placeholder="消息加解密Key" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="官网" prop="website">
            <el-input v-model="form.website" placeholder="官网" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="图标" prop="icon">
            <ImageUploadSingle v-model="form.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="简介" prop="introduction">
            <el-input
              v-model="form.introduction"
              placeholder="简介"
              type="textarea"
              rows="4"
              maxlength="80"
              show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="业务标签" prop="business_tag_ids">
            <el-divider>行业标签</el-divider>
            <el-check-tag
              class="margin_r-5 margin_b-5"
              :checked="form.business_tag_ids.includes(item.id)"
              @change="(val) => tagClickHandle(item.id, val)"
              v-for="item in industryTags"
              :key="item.id">{{item.name}}</el-check-tag>
            <el-divider>功能标签</el-divider>
            <el-check-tag
              class="margin_r-5 margin_b-5"
              :checked="form.business_tag_ids.includes(item.id)"
              @change="(val) => tagClickHandle(item.id, val)"
              v-for="item in functionTags"
              :key="item.id">{{item.name}}</el-check-tag>
          </el-form-item>
        </el-col>
      </el-row>
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
import ImageUploadSingle from '@/components/image-upload-single'

import useDictionary from '@/mixins/dictionary'

import { infoApi, addApi, editApi } from '@/api/platform'
import { selectListApi } from '@/api/business-tag'

export default defineComponent({
  emits: ['refresh'],
  components: { ImageUploadSingle },
  setup(_props, { emit }) {
    const refForm = ref()

    const { dictionaryList, getDictionary } = useDictionary()
    const data = reactive({
      visible: false,
      loading: false,
      businessTags: [], // 业务标签
      industryTags: [], // 行业标签
      functionTags: [], // 功能标签
      form: {
        id: null,
        app_id: '',
        app_secret: '',
        token: '',
        decrypt_key: '',
        name: '',
        introduction: '',
        website: '',
        icon: '',
        type: 1,
        business_tag_ids: []
      }
    })
    const rules = reactive(function() {
      return {
        app_id: [{ required: true, message: '请输入AppID', trigger: 'blur' }],
        app_secret: [{ required: true, message: '请输入AppSecret', trigger: 'blur' }],
        token: [{ required: true, message: '请输入消息校验Token', trigger: 'blur' }],
        decrypt_key: [{ required: true, message: '请输入消息加解密Key', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        website: [{ required: true, message: '请输入官网', trigger: 'blur' }],
        icon: [{ required: true, message: '请上传图标', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        business_tag_ids: [{ type: 'array', required: true, message: '请选择业务标签', trigger: 'change' }]
      }
    }())

    const getBusinessTag = async () => {
      const r = await selectListApi()
      if (r) {
        data.businessTags = r.data
        data.industryTags = []
        data.functionTags = []
        data.businessTags.forEach(item => {
          if (item.type === 1) {
            data.industryTags.push(item)
          } else if (item.type === 2) {
            data.functionTags.push(item)
          }
        })
      }
    }

    const init = async (id) => {
      data.visible = true
      data.loading = true
      data.form.id = id
      await getBusinessTag()
      if (id) {
        const r = await infoApi(data.form.id)
        if (r) {
          data.form.id = r.data.id
          data.form.app_id = r.data.app_id
          data.form.app_secret = r.data.app_secret
          data.form.token = r.data.token
          data.form.decrypt_key = r.data.decrypt_key
          data.form.name = r.data.name
          data.form.introduction = r.data.introduction
          data.form.website = r.data.website
          data.form.icon = r.data.icon
          data.form.type = r.data.type
          data.form.business_tag_ids = r.data.business_tags.map(item => item.id)
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

    const tagClickHandle = (id, val) => {
      if (val) {
        data.form.business_tag_ids.push(id)
      } else {
        data.form.business_tag_ids.splice(data.form.business_tag_ids.indexOf(val), 1)
      }
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
      getDictionary('WX-PlatformType')
    })

    return {
      refForm,
      dictionaryList,
      ...toRefs(data),
      rules,
      init,
      submit,
      tagClickHandle,
      dialogClosedHandle
    }
  }
})
</script>
