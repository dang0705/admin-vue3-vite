export default (title: string) => (
  <div class="flex items-center my-[10px]">
    <span class={['flex-shrink-0', 'text-lg', 'mr-[10px]', 'font-bold']}>
      {title}
    </span>
    <el-divider class={['flex-grow', 'h-[1px]']} />
  </div>
)
