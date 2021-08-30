export default {
    stats: [
        {
            label: '显示',
            type: 'switch',
            mapping: 'display'
        }
    ],
    scene: [
        {
            label: '雾化',
            type: 'select',
            mapping: 'enabled',
            options: [
                { label: '关闭', value: false },
                { label: '雾[距离]', value: 'fog' },
                { label: '雾[浓度]', value: 'fogExp2' }
            ]
        },
        {
            label: '雾[距离]',
            type: 'array',
            if: 'enabled=fog',
            children: [
                {
                    label: '颜色',
                    type: 'color',
                    mapping: 'fog.color'
                },
                {
                    label: '近',
                    type: 'input',
                    mapping: 'fog.near'
                },
                {
                    label: '远',
                    type: 'input',
                    mapping: 'fog.far'
                }
            ]
        },
        {
            label: '雾[浓度]',
            type: 'array',
            if: 'enabled=fogExp2',
            children: [
                {
                    label: '颜色',
                    type: 'color',
                    mapping: 'fogExp2.color'
                },
                {
                    label: '浓度',
                    type: 'input',
                    mapping: 'fogExp2.concentration'
                }
            ]
        }
    ],
    renderer: [
        {
            label: '透明度',
            type: 'switch',
            mapping: 'alpha'
        },
        {
            label: '抗锯齿',
            type: 'switch',
            mapping: 'antialias'
        },
        {
            label: '全局阴影',
            type: 'switch',
            mapping: 'shadowMapEnabled'
        },
        {
            label: '背景颜色',
            type: 'color',
            mapping: 'backgroundColor'
        }
    ],
    camera: [
        {
            label: '位置',
            type: 'array',
            children: [
                {
                    label: 'x',
                    type: 'input',
                    mapping: 'position.x'
                },
                {
                    label: 'y',
                    type: 'input',
                    mapping: 'position.y'
                },
                {
                    label: 'z',
                    type: 'input',
                    mapping: 'position.z'
                }
            ]
        },
        {
            label: '旋转',
            type: 'array',
            children: [
                {
                    label: 'x',
                    type: 'input',
                    mapping: 'rotation._x'
                },
                {
                    label: 'y',
                    type: 'input',
                    mapping: 'rotation._y'
                },
                {
                    label: 'z',
                    type: 'input',
                    mapping: 'rotation._z'
                }
            ]
        },
        {
            label: '朝向',
            type: 'array',
            children: [
                {
                    label: 'x',
                    type: 'input',
                    mapping: 'lookAt.x'
                },
                {
                    label: 'y',
                    type: 'input',
                    mapping: 'lookAt.y'
                },
                {
                    label: 'z',
                    type: 'input',
                    mapping: 'lookAt.z'
                }
            ]
        },
        {
            label: '网格辅助',
            type: 'switch',
            mapping: 'helperVisible'
        },
        {
            label: '近',
            type: 'input',
            mapping: 'near'
        },
        {
            label: '远',
            type: 'input',
            mapping: 'far'
        }
    ]
};
