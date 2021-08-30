// 模块抽离插件
export default function (context, type, ignore = []) {
    const map = {};
    for (const key of context.keys()) {
        if (
            ignore.reduce((x, y) => {
                return x && !~key.indexOf(y);
            }, true)
        ) {
            let keyArr = key.split('/');
            switch (type) {
                case 'component':
                    keyArr.pop();
                    keyArr.shift();
                    keyArr = keyArr.join('.');
                    break;
                case 'script':
                    keyArr.shift();
                    keyArr = keyArr.join('.');
                    keyArr = keyArr.replace(/\.js$/g, '');
                    break;
                default:
                    break;
            }
            map[keyArr] = context(key).default;
        }
    }
    return map;
}
