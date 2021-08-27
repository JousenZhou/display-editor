// 模块抽离插件
export default function (context, type) {
    const map = {};
    for (const key of context.keys()) {
        const keyArr = key.split('/');
        switch (type) {
            case 'component':
                keyArr.pop();
                break;
            case 'script':
                keyArr.pop();
                break;
            default:
                break;
        }
        keyArr.shift(); // 移除.
        map[keyArr.join('.').replace(/\.js$/g, '')] = context(key).default;
    }
    return map;
}
