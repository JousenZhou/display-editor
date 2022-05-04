// 座法変換行列
float4x4 WorldViewProjMatrix      : WORLDVIEWPROJECTION;
float4x4 WorldMatrix              : WORLD;
float4x4 WorldViewMatrix          : WORLDVIEW;
float4x4 ProjectionMatrix         : PROJECTION;

// スクリーンサイズ
float2 ViewportSize : VIEWPORTPIXELSIZE;
static float ViewportAspect = ViewportSize.x / ViewportSize.y;

//とりあえず6万頂点まで
#define VPBUF_WIDTH  256
#define VPBUF_HEIGHT 256

//頂点座標バッファサイズ
static float2 VPBufSize = float2(VPBUF_WIDTH, VPBUF_HEIGHT);

static float2 VPBufOffset = float2(0.5 / VPBUF_WIDTH, 0.5 / VPBUF_HEIGHT);


//頂点ごとのワールド座標を記録
texture DepthBuffer : RenderDepthStencilTarget <
   int Width=VPBUF_WIDTH;
   int Height=VPBUF_HEIGHT;
    string Format = "D24S8";
>;
texture VertexPosBufTex : RenderColorTarget
<
    int Width=VPBUF_WIDTH;
    int Height=VPBUF_HEIGHT;
    bool AntiAlias = false;
    int Miplevels = 1;
    string Format="A32B32G32R32F";
>;
sampler VertexPosBuf = sampler_state
{
   Texture = (VertexPosBufTex);
   ADDRESSU = Clamp;
   ADDRESSV = Clamp;
   MAGFILTER = Point;
   MINFILTER = Point;
   MIPFILTER = None;
};
shared texture VertexPosBufTex2 : RenderColorTarget
<
    int Width=VPBUF_WIDTH;
    int Height=VPBUF_HEIGHT;
    bool AntiAlias = false;
    int Miplevels = 1;
    string Format="A32B32G32R32F";
>;
sampler VertexPosBuf2 = sampler_state
{
   Texture = (VertexPosBufTex2);
   ADDRESSU = Clamp;
   ADDRESSV = Clamp;
   MAGFILTER = Point;
   MINFILTER = Point;
   MIPFILTER = None;
};
//頂点数
int VertexCount;

/////////////////////////////////////////////////////////////////////////////////////
//頂点座標バッファの作成

struct VS_OUTPUT3 {
    float4 Pos: POSITION;
    float4 BasePos: COLOR0;
};

VS_OUTPUT3 DrawVertexBuf_VS(float4 Pos : POSITION, int index: _INDEX)
{
    VS_OUTPUT3 Out;
    
    float2 tpos = 0;
    tpos.x = modf((float)index / VPBUF_WIDTH, tpos.y);
    tpos.y /= VPBUF_HEIGHT;
    
    //バッファ出力
    Out.Pos.xy = (tpos * 2 - 1) * float2(1,-1); //テクスチャ座標→頂点座標変換
    Out.Pos.zw = 1;
    
    //座標を色として出力
    Out.BasePos = mul(Pos,WorldMatrix);
    
    return Out;
}

float4 DrawVertexBuf_PS( VS_OUTPUT3 IN ) : COLOR0
{
    return float4(IN.BasePos.xyz,VertexCount);
}

/////////////////////////////////////////////////////////////////////////////////////
//頂点座標バッファのコピー

struct VS_OUTPUT2 {
    float4 Pos: POSITION;
    float2 texCoord: TEXCOORD0;
};

VS_OUTPUT2 CopyVertexBuf_VS(float4 Pos: POSITION, float2 Tex: TEXCOORD) {
   VS_OUTPUT2 Out;
  
   Out.Pos = Pos;
   Out.texCoord = Tex + VPBufOffset;
   return Out;
}

float4 CopyVertexBuf_PS(float2 texCoord: TEXCOORD0) : COLOR {
   return tex2Dlod(VertexPosBuf, float4(texCoord, 0, 0));
}


/////////////////////////////////////////////////////////////////////////////////////


float4 ClearColor = {0,0,0,1};
float ClearDepth  = 1.0;


// オブジェクト描画用テクニック
stateblock makeVertexBufState = stateblock_state
{
    DestBlend = InvSrcAlpha; SrcBlend = SrcAlpha; //加算合成のキャンセル
    FillMode = POINT;
    CullMode = NONE;
    ZEnable = false;
    ZWriteEnable = false;
    AlphaBlendEnable = false;
    AlphaTestEnable = false;
    
    VertexShader = compile vs_3_0 DrawVertexBuf_VS();
    PixelShader  = compile ps_3_0 DrawVertexBuf_PS();
};

stateblock copyVertexBufState = stateblock_state
{
    AlphaBlendEnable = false;
    AlphaTestEnable = false;
    VertexShader = compile vs_3_0 CopyVertexBuf_VS();
    PixelShader  = compile ps_3_0 CopyVertexBuf_PS();
};

////////////////////////////////////////////////////////////////////////////////////////////////

technique MainTec0_0 < 
    string MMDPass = "object";
    string Subset = "0"; 
    string Script =
        
        "RenderColorTarget=;"
        "RenderDepthStencilTarget=;"
        "Pass=CopyVertexBuf;"
        
        "RenderColorTarget=VertexPosBufTex;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "Pass=DrawVertexBuf;"
        
    ;
> {
    pass DrawVertexBuf < string Script = "Draw=Geometry;";> { StateBlock = (makeVertexBufState); }
    pass CopyVertexBuf < string Script = "Draw=Buffer;";>   { StateBlock = (copyVertexBufState); }
    
}


technique MainTec0_1 < 
    string MMDPass = "object";
    string Script =
        
        "RenderColorTarget=VertexPosBufTex;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "Pass=DrawVertexBuf;"
        
    ;
> {
    pass DrawVertexBuf < string Script = "Draw=Geometry;";> { StateBlock = (makeVertexBufState); }
    
}

////////////////////////////////////////////////////////////////////////////////////////////////

technique MainTec0_0SS < 
    string MMDPass = "object_ss";
    string Subset = "0"; 
    string Script =
        
        "RenderColorTarget=;"
        "RenderDepthStencilTarget=;"
        "Pass=CopyVertexBuf;"
        
        "RenderColorTarget=VertexPosBufTex;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "Pass=DrawVertexBuf;"
        
    ;
> {
    pass DrawVertexBuf < string Script = "Draw=Geometry;";> { StateBlock = (makeVertexBufState); }
    pass CopyVertexBuf < string Script = "Draw=Buffer;";>   { StateBlock = (copyVertexBufState); }
    
}


technique MainTec0_1SS < 
    string MMDPass = "object_ss";
    string Script =        
        "RenderColorTarget=VertexPosBufTex;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "Pass=DrawVertexBuf;"
        
    ;
> {
    pass DrawVertexBuf < string Script = "Draw=Geometry;";> { StateBlock = (makeVertexBufState); }
    
}

////////////////////////////////////////////////////////////////////////////////////////////////
// 輪郭描画

technique EdgeTec < string MMDPass = "edge"; > {
    
}

///////////////////////////////////////////////////////////////////////////////////////////////
// 影（非セルフシャドウ）描画

// 影なし
technique ShadowTec < string MMDPass = "shadow"; > {
    
}

///////////////////////////////////////////////////////////////////////////////////////////////
// セルフシャドウ用Z値プロット

// Z値プロット用テクニック
technique ZplotTec < string MMDPass = "zplot"; > {
    
}

///////////////////////////////////////////////////////////////////////////////////////////////
