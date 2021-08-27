/**
 * @Description: 资源加载工具类
 * @author JousenZhou
 * @date 2021/8/17 20:18
 */

/** js脚本加载回调*/
export const scriptHook = function (url) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
    });
};
/** js库脚本同步加载*/
export const scriptLibraryHook = function (scriptLibrary) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        let scriptStatus = [];
        for (const file of scriptLibrary) {
            await scriptHook(file).then((res) => {
                if (res === true) {
                    scriptStatus.push(res);
                    if (scriptStatus.length === scriptLibrary.length) {
                        console.warn('依赖库资源加载成功');
                        resolve();
                    }
                } else {
                    reject(`${file}资源加载失败`);
                }
            });
        }
    });
};
