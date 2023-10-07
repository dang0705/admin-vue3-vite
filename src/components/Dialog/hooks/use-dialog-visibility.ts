export const useDialogVisibility = () => {
	const isInDialog = inject('in-dialog');
	const isDialogShow = inject('dialog-show');
	return { isInDialog, isDialogShow };
};
