<template>
	<div :class="['upload-box', 'flex', { 'flex-col': multiple }]">
		<div>
			<el-upload
				action="#"
				drag
				:id="uuid"
				:limit="limit"
				:class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
				:multiple="multiple"
				:disabled="self_disabled"
				:show-file-list="false"
				:http-request="handleHttpUpload"
				:before-upload="beforeUpload"
				:on-success="uploadSuccess"
				:on-error="uploadError"
				:accept="fileType.join(',')"
			>
				<!--				如果返回的是OSS 地址则不需要增加 baseURL-->
				<template v-if="realImages.length && !multiple">
					<img :src="realImages[0]" class="upload-image" />
					<div class="upload-handle" @click.stop>
						<div class="handle-icon" @click="editImg" v-if="!self_disabled">
							<el-icon :size="iconSize">
								<Edit />
							</el-icon>
							<span v-if="!iconSize">编辑</span>
						</div>
						<div class="handle-icon" @click="imgViewVisible = true">
							<el-icon :size="iconSize">
								<ZoomIn />
							</el-icon>
							<span v-if="!iconSize">查看</span>
						</div>
						<div class="handle-icon" @click="deleteImg" v-if="!self_disabled">
							<el-icon :size="iconSize">
								<Delete />
							</el-icon>
							<span v-if="!iconSize">删除</span>
						</div>
					</div>
				</template>
				<div class="upload-empty" v-else-if="!realImages.length || multiple">
					<slot name="empty">
						<el-icon>
							<Plus />
						</el-icon>
						<span>单击上传<br />或拖拽到此处</span>
					</slot>
				</div>
				<template #tip>
					<span class="text-[#999] text-[14px]">支持{{ fileType.join(',').replace(/image\//g, '') }}文件</span>
				</template>
			</el-upload>
			<div class="el-upload__tip">
				<slot name="tip"></slot>
			</div>
		</div>
		<ul class="flex flex-warp" v-if="multiple">
			<li v-for="(image, index) in realImages" :key="image">
				<el-image :style="{ height, width }" :src="image" :initial-index="index" :zoom-rate="1.2" :preview-src-list="realImages" fit="cover" />
				<div class="handle-icon cursor-pointer flex items-center" @click="deleteImg(index)" v-if="!self_disabled">
					<el-icon :size="iconSize" class="ml-auto">
						<Delete />
					</el-icon>
					<span v-if="!iconSize">删除</span>
				</div>
			</li>
		</ul>
		<el-image-viewer :teleported="true" v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="realImages" />
	</div>
</template>

<script setup lang="ts" name="UploadImg">
import { ElNotification, formContextKey, formItemContextKey } from 'element-plus';
import type { UploadProps, UploadRequestOptions } from 'element-plus';
import { generateUUID } from '/@/utils/other';
import request from '/@/utils/request';

// 接受父组件参数
const props = defineProps({
	modelValue: {
		type: Array,
		required: true,
		default: () => [],
	},
	uploadFileUrl: {
		type: String,
		default: '/docs/sys-file/upload',
	},
	getPreviewUrl: {
		type: String,
		default: '/docs/sys-file/gmyg',
	},
	drag: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	fileSize: {
		type: [Number, String],
		default: 5,
	},
	limit: {
		type: [Number, String],
		default: 0,
	},
	fileType: {
		type: Array,
		default: () => ['image/jpeg', 'image/png', 'image/gif'],
	},
	height: {
		type: String,
		default: '120px',
	},
	width: {
		type: String,
		default: '120px',
	},
	borderRadius: {
		type: String,
		default: '3px',
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	iconSize: {
		type: [String, Number],
		default: 20,
	},
	type: {
		type: String,
		default: '',
	},
});
const { proxy } = getCurrentInstance();

// 生成组件唯一id
const uuid = ref('id-' + generateUUID());

// 查看图片
const imgViewVisible = ref(false);
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => props.disabled || formContext?.disabled);

/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
interface UploadEmits {
	(e: 'update:modelValue', value: string[]): void;
}

const emit = defineEmits<UploadEmits>();
const upload = async (options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('businessType', props.type);
	try {
		const { data } = await request({
			url: props.uploadFileUrl,
			method: 'post',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data: formData,
		});
		// 调用 el-form 内部的校验方法（可自动校验）
		return Promise.resolve(data.url);
	} catch (error) {
		options.onError(error as any);
	}
};

const images = ref<string[]>(props.modelValue as []);
const realImages = computed(() => images.value.map((image) => `${proxy.baseURL}/${image}`));
const handleHttpUpload = async (options: UploadRequestOptions) => {
	const image = await upload(options);
	props.multiple ? images.value.push(image) : (images.value = [image]);
	emit('update:modelValue', images.value);
	await nextTick();
	formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
};

/**
 * @description 删除图片
 * */
const deleteImg = (index: number) => {
	(images.value as []).splice(index, 1);
	emit('update:modelValue', images.value);
};

/**
 * @description 编辑图片
 * */
const editImg = () => {
	const dom = document.querySelector(`#${uuid.value} .el-upload__input`);
	dom && dom.dispatchEvent(new MouseEvent('click'));
};

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
	const imgType = props.fileType.includes(rawFile.type as File.ImageMimeType);
	if (!imgType)
		ElNotification({
			title: '温馨提示',
			message: '上传图片不符合所需的格式！',
			type: 'warning',
		});
	if (!imgSize)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 ${props.fileSize}M！`,
				type: 'warning',
			});
		}, 0);
	return imgType && imgSize;
};

/**
 * @description 图片上传成功
 * */
const uploadSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
};

/**
 * @description 图片上传错误
 * */
const uploadError = (err: any) => {
	ElNotification({
		title: '温馨提示',
		message: err || '图片上传失败，请您重新上传！',
		type: 'error',
	});
};
</script>
<style scoped lang="scss">
.is-error {
	.upload {
		:deep(.el-upload),
		:deep(.el-upload-dragger) {
			border: 1px dashed var(--el-color-danger) !important;

			&:hover {
				border-color: var(--el-color-primary) !important;
			}
		}
	}
}

:deep(.disabled) {
	.el-upload,
	.el-upload-dragger {
		cursor: not-allowed !important;
		background: var(--el-disabled-bg-color);
		border: 1px dashed var(--el-border-color-darker) !important;

		&:hover {
			border: 1px dashed var(--el-border-color-darker) !important;
		}
	}
}

.upload-box {
	.no-border {
		:deep(.el-upload) {
			border: none !important;
		}
	}

	:deep(.upload) {
		.el-upload {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: v-bind(width);
			height: v-bind(height);
			overflow: hidden;
			border: 1px dashed var(--el-border-color-darker);
			border-radius: v-bind(borderRadius);
			transition: var(--el-transition-duration-fast);

			&:hover {
				border-color: var(--el-color-primary);

				.upload-handle {
					opacity: 1;
				}
			}

			.el-upload-dragger {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				padding: 0;
				overflow: hidden;
				background-color: transparent;
				border: 1px dashed var(--el-border-color-darker);
				border-radius: v-bind(borderRadius);
				@apply bg-[#F3F3F3];

				&:hover {
					border: 1px dashed var(--el-color-primary);
				}
			}

			.el-upload-dragger.is-dragover {
				background-color: var(--el-color-primary-light-9);
				border: 2px dashed var(--el-color-primary) !important;
			}

			.upload-image {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}

			.upload-empty {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				line-height: 30px;
				color: var(--el-color-info);

				.el-icon {
					font-size: 28px;
					color: var(--el-text-color-secondary);
				}
			}

			.upload-handle {
				position: absolute;
				top: 0;
				right: 0;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				cursor: pointer;
				background: rgb(0 0 0 / 60%);
				opacity: 0;
				transition: var(--el-transition-duration-fast);

				.handle-icon {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 0 6%;
					color: aliceblue;

					.el-icon {
						margin-bottom: 40%;
						font-size: 130%;
						line-height: 130%;
					}

					span {
						font-size: 85%;
						line-height: 85%;
					}
				}
			}
		}
	}

	.el-upload__tip {
		line-height: 18px;
		text-align: center;
	}
}
</style>
