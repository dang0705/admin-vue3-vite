export const useDialogVisibility = () => {
	const isInDialog = inject('in-dialog', null);
	const isDialogShow = inject('dialog-show', null);
	return { isInDialog, isDialogShow };
};
