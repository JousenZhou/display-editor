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
        },
        {
            label: '动作数据',
            type: 'select',
            mapping: 'animation',
            options: [{ label: '测试2', value: 'http://127.0.0.1:3000/mmdCamera/camera2.vmd' }]
        }
    ],
    directionalLight: [
        {
            label: '网格辅助',
            type: 'switch',
            mapping: 'helperVisible'
        },
        {
            label: '光强',
            type: 'input',
            mapping: 'intensity'
        },
        {
            label: '颜色',
            type: 'color',
            mapping: 'color'
        },
        {
            label: '光照阴影',
            type: 'switch',
            mapping: 'castShadow'
        },
        {
            label: '光距',
            type: 'input',
            mapping: 'distance'
        },
        {
            label: '显示',
            type: 'switch',
            mapping: 'visible'
        }
    ],
    mmdHelper: [
        {
            label: '物理碰撞',
            type: 'switch',
            mapping: 'physics'
        }
    ],
    mmdMesh: [
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
            label: '骨骼辅助',
            type: 'switch',
            mapping: 'ikHelper'
        },
        {
            label: '物理刚体辅助',
            type: 'switch',
            mapping: 'physicsHelper'
        },
        {
            label: '阴影',
            type: 'switch',
            mapping: 'castShadow'
        },
        {
            label: '动作数据',
            type: 'select',
            mapping: 'animation',
            options: [{ label: '测试', value: 'http://127.0.0.1:3000/mmdAnimation/action3.vmd' }]
        }
    ],
    mmdScene: [
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
            label: '阴影',
            type: 'switch',
            mapping: 'castShadow'
        }
    ],
    ambientLight: [
        {
            label: '光强',
            type: 'input',
            mapping: 'intensity'
        },
        {
            label: '颜色',
            type: 'color',
            mapping: 'color'
        },
        {
            label: '光照阴影',
            type: 'switch',
            mapping: 'castShadow'
        },
        {
            label: '显示',
            type: 'switch',
            mapping: 'visible'
        }
    ],
    pointLight: [
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
            label: '网格辅助',
            type: 'switch',
            mapping: 'helperVisible'
        },
        {
            label: '光强',
            type: 'input',
            mapping: 'intensity'
        },
        {
            label: '颜色',
            type: 'color',
            mapping: 'color'
        },
        {
            label: '光照阴影',
            type: 'switch',
            mapping: 'castShadow'
        },
        {
            label: '光距',
            type: 'input',
            mapping: 'distance'
        },
        {
            label: '显示',
            type: 'switch',
            mapping: 'visible'
        }
    ],
    spotLight: [
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
            label: '网格辅助',
            type: 'switch',
            mapping: 'helperVisible'
        },
        {
            label: '光强',
            type: 'input',
            mapping: 'intensity'
        },
        {
            label: '颜色',
            type: 'color',
            mapping: 'color'
        },
        {
            label: '光照阴影',
            type: 'switch',
            mapping: 'castShadow'
        },
        {
            label: '光距',
            type: 'input',
            mapping: 'distance'
        },
        {
            label: '角度',
            type: 'input',
            mapping: 'angle'
        },
        {
            label: '聚焦',
            type: 'input',
            mapping: 'focus'
        },
        {
            label: '阴影模糊',
            type: 'input',
            mapping: 'penumbra'
        },
        {
            label: '光线衰弱',
            type: 'input',
            mapping: 'decay'
        },
        {
            label: '显示',
            type: 'switch',
            mapping: 'visible'
        }
    ]
};
