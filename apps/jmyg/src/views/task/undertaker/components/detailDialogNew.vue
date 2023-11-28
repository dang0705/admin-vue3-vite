<template>
  <el-dialog
    ref="dialog"
    title="承接记录详情"
    v-model="visible"
    draggable
    width="900px">
    <el-form
      class="form-view"
      :model="form"
      formDialogRef
      label-width="160px"
      v-loading="loading">
      <div :gutter="24">
        <!-- <div class="title_box"></div> -->
        <div class="info_box">
          <div class="info_item">
            <div class="info_label">承接人：</div>
            <div class="info_value">{{ form.undertakerName }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">身份证号码：</div>
            <div class="info_value">{{ form.undertakerCard }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">手机号码：</div>
            <div class="info_value">{{ form.undertakerPhone }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">任务名称：</div>
            <div class="info_value">{{ form.taskName }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">起始时间：</div>
            <div class="info_value">{{ form.createTime }}</div>
          </div>
        </div>
      </div>
      <div :gutter="24">
        <div class="title_box">个人承接</div>
        <div class="info_box">
          <div class="info_item">
            <div class="info_label">接单时间：</div>
            <div class="info_value">{{ form.orderReceivingTime }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">开始时间：</div>
            <div class="info_value">{{ form.startTime }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">完成时间：</div>
            <div class="info_value">{{ form.doneTime }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">确认任务量：</div>
            <div class="info_value">{{ form.workload }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">承接人确认金额：</div>
            <div class="info_value">
              {{
                form.undertakerConfirmAmount
                  ? form.undertakerConfirmAmount + '元'
                  : '-'
              }}
            </div>
          </div>
          <div class="info_row">
            <div class="info_label">开始打卡图片：</div>
            <div class="info_value">
              <div v-for="item in form.startImages" :key="item">
                <UploadFile :modelValue="[item]" :disabled="true" />
              </div>
              <div v-if="!form.startImages?.length">
                <UploadFile :modelValue="[]" :disabled="true" />
              </div>
            </div>
          </div>
          <div class="info_row">
            <div class="info_label">结束打卡图片：</div>
            <div class="info_value">
              <div v-for="item in form.doneImages" :key="item">
                <UploadFile :modelValue="[item]" :disabled="true" />
              </div>
              <div v-if="!form.doneImages?.length">
                <UploadFile :modelValue="[]" :disabled="true" />
              </div>
            </div>
          </div>
          <div class="info_row">
            <div class="info_label">任务成果：</div>
            <div class="info_value">
              <div v-for="item in form.doneFiles" :key="item">
                <UploadFile
                  fileType="file"
                  :modelValue="[item]"
                  :disabled="true" />
              </div>
              <div v-if="!form.doneFiles?.length">
                <UploadFile :modelValue="[]" :disabled="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :gutter="24">
        <div class="title_box">企业验收</div>
        <div class="info_box">
          <div class="info_item">
            <div class="info_label">企业验收时间：</div>
            <div class="info_value">{{ form.enterpriseAcceptanceTime }}</div>
          </div>
          <!-- <div class="info_item">
            <div class="info_label">企业验收任务量：</div>
            <div class="info_value">
              {{ form.enterpriseAcceptanceWorkload }}
            </div>
          </div> -->
          <div class="info_item">
            <div class="info_label">企业验收金额：</div>
            <div class="info_value">
              {{
                form.enterpriseAcceptanceMoney
                  ? form.enterpriseAcceptanceMoney + '元'
                  : '-'
              }}
            </div>
          </div>
          <!-- <div class="info_row">
            <div class="info_label">验收上传图片：</div>
            <div class="info_value">
              <div v-for="item in form.enterpriseAcceptanceImages" :key="item">
                <UploadFile :modelValue="[item]" :disabled="true" />
              </div>
              <div v-if="!form.enterpriseAcceptanceImages?.length">
                <UploadFile :modelValue="[]" :disabled="true" />
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </el-form>
    <span class="flex justify-end items-center footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import { getObj } from '@jmyg/api/core/undertakerTask'
defineOptions({ name: 'UndertakerInfoDialog' })
const visible = ref(false)
const loading = ref(false)
const dialog = ref()
// 提交表单数据
const form = reactive({
  id: '',
  undertakerName: '',
  undertakerCard: '',
  undertakerPhone: '',
  undertakerSex: '',
  undertakerAddress: '',
  undertakerClan: '',
  undertakerClanName: '',
  undertakerEducation: '',
  workTime: '',
  undertakerPortrait: [],
  undertakerNationalEmblem: [],
  isAuthentication: '',
  bankNumber: '',
  bankName: '',
  bankAddress: '',
  isBankFourEssentialFactor: ''
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''
  // 获取undertakerInfo信息
  // dialog.value.scrollTo({ top: 0 })
  if (id) {
    form.id = id
    getundertakerInfoData(id)
  }
}

// 初始化表单数据
const getundertakerInfoData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id)
    .then((res: any) => {
      Object.assign(form, res.data)
    })
    .finally(() => {
      loading.value = false
    })
}

// 暴露变量
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.user_wrapper {
  background: #ff68260d;
  border: 1px solid #ff682659;
  border-radius: 6px;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .name {
    display: flex;
    line-height: 22px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.8);
  }
  .u_row {
    display: flex;
    align-items: center;
    margin-top: 15px;
    .u_col {
      margin-right: 32px;
      line-height: 20px;
    }
  }
  .card_row {
    display: flex;
    align-items: center;
    margin-left: 75px;
    .card_col {
      margin-right: 23px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .card_pic {
    // height: 60px;
    width: 120px;
  }
}
.title_box {
  height: 40px;
  background: #f1f1f1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: var(--el-font-size-medium);
  color: #000000;
  margin: 13px 0 18px;
}
.info_box {
  display: flex;
  flex-wrap: wrap;
}
.info_row {
  display: flex;
  width: 100%;
  margin-bottom: 16px;
}
.info_item {
  display: flex;
  align-items: center;
  width: 50%;
}
.info_label {
  min-width: 140px;
  opacity: 0.4;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: var(--el-font-size-medium);
  color: #000000;
  text-align: right;
  line-height: 42px;
  white-space: nowrap;
}
.info_value {
  flex: 1;
  opacity: 0.8;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: var(--el-font-size-medium);
  color: #000000;
  line-height: 42px;
}
.footer {
  border-top: 1px solid #e8e8e8;
  margin-top: 23px;
  padding-top: 17px;
}
</style>
