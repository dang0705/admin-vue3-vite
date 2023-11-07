export default (componentName: string) => $bus.emit('close-tag', componentName);
