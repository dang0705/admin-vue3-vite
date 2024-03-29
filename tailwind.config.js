/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './apps/**/*.{vue,js,ts,jsx,tsx}', './shared/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['PingFang SC', 'Arial', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
			},
			boxShadow: {
				DEFAULT: 'var(--el-box-shadow)',
				light: 'var(--el-box-shadow-light)',
				lighter: 'var(--el-box-shadow-lighter)',
				dark: 'var(--el-box-shadow-dark)',
			},
			svg: {
				display: 'inline',
				'vertical-align': 'baseline',
			},
			fontSize: {
				default: 'var( --el-font-size-base)',
				lg: 'var( --el-font-size-medium)',
			},
			spacing: {
				px: '1px',
				0: '0px',
				0.5: '2px',
				1: '4px',
				1.5: '6px',
				2: '8px',
				2.5: '10px',
				3: '12px',
				3.5: '14px',
				4: '16px',
				5: '20px',
				6: '24px',
				7: '28px',
				8: '32px',
				9: '36px',
				10: '40px',
				11: '44px',
				12: '48px',
				14: '56px',
				16: '64px',
				20: '80px',
				24: '96px',
				28: '112px',
				32: '128px',
				36: '144px',
				40: '160px',
				44: '176px',
				48: '192px',
				52: '208px',
				56: '224px',
				60: '240px',
				64: '256px',
				72: '288px',
				80: '320px',
				96: '384px',
			},
			lineHeight: {
				none: '1',
				tight: '1.25',
				snug: '1.375',
				normal: '1.5',
				relaxed: '1.625',
				loose: '2',
				3: '12px',
				4: '16px',
				5: '20px',
				6: '24px',
				7: '28px',
				8: '32px',
				9: '36px',
				10: '40px',
			},
			borderRadius: {
				normal: '10px',
				small: '3px',
			},
			colors: {
				white: '#fff',
				grey: '#F2F3F5',
				'grey-bg': '#F6F6F8',
				primary: {
					DEFAULT: 'var(--el-color-primary)',
					'light-3': 'var(--el-color-primary-light-3)',
					'light-5': 'var(--el-color-primary-light-5)',
					'light-7': 'var(--el-color-primary-light-7)',
					'light-8': 'var(--el-color-primary-light-8)',
					'light-9': 'var(--el-color-primary-light-9)',
					'dark-2': 'var(--el-color-primary-dark-2)',
				},
				success: 'var(--el-color-success)',
				warning: 'var(--el-color-warning)',
				danger: 'var(--el-color-danger)',
				error: 'var(--el-color-error)',
				info: 'var(--el-color-info)',
				body: 'var(--el-bg-color)',
				page: 'var(--el-bg-color-page)',
				'tx-primary': 'var(--el-text-color-primary)',
				'tx-regular': 'var(--el-text-color-regular)',
				'tx-secondary': 'var(--el-text-color-secondary)',
				'tx-placeholder': 'var(--el-text-color-placeholder)',
				'tx-disabled': 'var(--el-text-color-disabled)',
				br: 'var(--el-border-color)',
				'br-light': 'var(--el-border-color-light)',
				'br-extra-light': 'var(--el-border-color-extra-light)',
				'br-dark': 'var( --el-border-color-dark)',
				fill: 'var(--el-fill-color)',
				'fill-light': 'var(--el-fill-color-light)',
				'fill-lighter': 'var(--el-fill-color-lighter)',
				mask: 'var(--el-mask-color)',
			},
		},
		screens: {
			'xs': 0, // min 0    max:424
			'sm': '425px', // min 425  max 767
			'md': '768px', // min 768  max 1023
			'lg': '1024px', // min 1024 max 1439
			'xl': '1440px', // min 1440+,
			'2xl': '1980px',
		},
	},
};
