// 頂点シェーダ

struct OutVS
{
	float4 Pos : POSITION;
};

//とりあえず6万頂点まで
#define VPBUF_WIDTH  256
#define VPBUF_HEIGHT 256

//頂点座標バッファサイズ
static float2 VPBufSize = float2(VPBUF_WIDTH, VPBUF_HEIGHT);

static float2 VPBufOffset = float2(0.5 / VPBUF_WIDTH, 0.5 / VPBUF_HEIGHT);

OutVS NoMask_VS(float4 Pos : POSITION, int index: _INDEX)
{
	OutVS Out;
    float2 tpos = 0;
    tpos.x = modf((float)index / VPBUF_WIDTH, tpos.y);
    tpos.y /= VPBUF_HEIGHT;
    
    //バッファ出力
    Out.Pos.xy = (tpos * 2 - 1) * float2(1,-1); //テクスチャ座標→頂点座標変換
    Out.Pos.zw = 1;
        
    return Out;
}

// ピクセルシェーダ
float4 NoMask_PS(OutVS IN) : COLOR
{
    return float4(0,0,0,1);
}

// オブジェクト描画用テクニック
technique MainPass  < string MMDPass = "object"; > {
    pass DrawObject < string Script = "Draw=Geometry;";>{
	    DestBlend = InvSrcAlpha; SrcBlend = SrcAlpha; //加算合成のキャンセル
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
	    DestBlend = InvSrcAlpha; SrcBlend = SrcAlpha; //加算合成のキャンセル
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
// 輪郭描画用テクニック
technique EdgeTec < string MMDPass = "edge"; > {}
// 影描画用テクニック
technique ShadowTec < string MMDPass = "shadow"; > {}
// Z値プロット用テクニック
technique ZplotTec < string MMDPass = "zplot"; > {}
