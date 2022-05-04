// ���_�V�F�[�_

struct OutVS
{
	float4 Pos : POSITION;
};

//�Ƃ肠����6�����_�܂�
#define VPBUF_WIDTH  256
#define VPBUF_HEIGHT 256

//���_���W�o�b�t�@�T�C�Y
static float2 VPBufSize = float2(VPBUF_WIDTH, VPBUF_HEIGHT);

static float2 VPBufOffset = float2(0.5 / VPBUF_WIDTH, 0.5 / VPBUF_HEIGHT);

OutVS NoMask_VS(float4 Pos : POSITION, int index: _INDEX)
{
	OutVS Out;
    float2 tpos = 0;
    tpos.x = modf((float)index / VPBUF_WIDTH, tpos.y);
    tpos.y /= VPBUF_HEIGHT;
    
    //�o�b�t�@�o��
    Out.Pos.xy = (tpos * 2 - 1) * float2(1,-1); //�e�N�X�`�����W�����_���W�ϊ�
    Out.Pos.zw = 1;
        
    return Out;
}

// �s�N�Z���V�F�[�_
float4 NoMask_PS(OutVS IN) : COLOR
{
    return float4(0,0,0,1);
}

// �I�u�W�F�N�g�`��p�e�N�j�b�N
technique MainPass  < string MMDPass = "object"; > {
    pass DrawObject < string Script = "Draw=Geometry;";>{
	    DestBlend = InvSrcAlpha; SrcBlend = SrcAlpha; //���Z�����̃L�����Z��
	    FillMode = POINT;
	    CullMode = NONE;
	    ZEnable = false;
	    ZWriteEnable = false;
	    AlphaBlendEnable = false;
	    AlphaTestEnable = false;
        VertexShader = compile vs_2_0 NoMask_VS();
        PixelShader  = compile ps_2_0 NoMask_PS();
    }
}
technique MainPass_SS  < string MMDPass = "object_ss"; > {
    pass DrawObject < string Script = "Draw=Geometry;";>{
	    DestBlend = InvSrcAlpha; SrcBlend = SrcAlpha; //���Z�����̃L�����Z��
	    FillMode = POINT;
	    CullMode = NONE;
	    ZEnable = false;
	    ZWriteEnable = false;
	    AlphaBlendEnable = false;
	    AlphaTestEnable = false;
        VertexShader = compile vs_2_0 NoMask_VS();
        PixelShader  = compile ps_2_0 NoMask_PS();
    }
}
// �֊s�`��p�e�N�j�b�N
technique EdgeTec < string MMDPass = "edge"; > {}
// �e�`��p�e�N�j�b�N
technique ShadowTec < string MMDPass = "shadow"; > {}
// Z�l�v���b�g�p�e�N�j�b�N
technique ZplotTec < string MMDPass = "zplot"; > {}
