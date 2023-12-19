<template>
  <iframe
    ref="myRef"
    id="iframe"
    style="min-height: calc(100vh - 100px)"
    :src="path"
    @load="onLoad"
    frameborder="0"></iframe>
</template>

<script setup lang="ts">
import { Session } from '@utils/storage'
const router = useRouter()
const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})
const path = ref('')
const myRef = ref()
const messageHandler = (e: any) => {
  console.log('子=====e', e.data)
  // 通过origin对消息进行过滤，避免遭到XSS攻击 e.origin对应父窗口的地址
  if (typeof e.data !== 'string' && e.data.path) {
    // iframe.contentWindow.myQuery = e.data
    nextTick(() => {
      console.log('xxxxx-e.data', e.data)
      console.log('e.data-11111', e.data)
      let str = ''
      if (e.data.query) {
        let obj = e.data.query
        for (const k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const v = obj[k]
            if (!str) {
              str = '?' + k + '=' + v
            } else {
              str = str + '&' + k + '=' + v
            }
          }
        }
      }
      if (location.hostname !== 'localhost') {
        path.value = env.VITE_BPMN_IFRAME_PATH + '/#' + e.data.path + str
      } else {
        path.value = 'http://localhost:8889' + '/#' + e.data.path + str
      }
      console.log('path.value', path.value)
      router.push(e.data)
    })
  }
}

const onLoad = () => {
  let iframe = document.getElementById('iframe')
  console.log('xxxxx-window.location', window.location)
  console.log('xxxxx-iframe.contentWindow', iframe.contentWindow)

  // setTimeout(() => {
  iframe.contentWindow.postMessage(
    {
      hash: window.location.hash
    },
    '*'
  )
  // }, 500)
}

watch(
  () => props.url,
  () => {
    let p = ''
    console.log('props.url', props.url)
    console.log('env.VITE_BPMN_IFRAME_PATH', env.VITE_BPMN_IFRAME_PATH)

    if (location.hostname !== 'localhost') {
      p = env.VITE_BPMN_IFRAME_PATH + '/#/' + props.url
    } else {
      p = 'http://localhost:8889' + '/#/' + props.url
    }
    console.log('p', p)
    path.value = p
    // console.log('path.value', path.value)
  },
  {
    immediate: true
  }
)

onMounted(() => {
  window.addEventListener('message', messageHandler)
})
onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})
</script>

<style scoped></style>
