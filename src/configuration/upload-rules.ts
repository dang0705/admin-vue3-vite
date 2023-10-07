// 上传图片支持的类型
export const IMAGE_TYPES = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'];

// 上传文件支持的类型
export const FILE_TYPES = ['.ppt', '.doc', '.pdf'];

// 压缩文件支持的类型
export const COMPRESSION = ['.zip', '.rar', '.7z'];

// 文件大小限制
export const LIMIT = {
	image: 10,
	excel: 50,
	file: 50, // files but except excel
	compression: 200,
};
