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
    renderer: [],
    camera: []
};
