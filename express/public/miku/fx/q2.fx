/* ------------------------------------------------------------
 * AlternativeFull
 * ------------------------------------------------------------ */
/* created by AlternativeFullFrontend. */
#define TEXTURE_THRESHOLD "shading_hint.png"
#define USE_MATERIAL_TEXTURE
#define USE_NORMALMAP
#define TEXTURE_NORMALMAP "q2.png"
float NormalMapResolution = 1;
#define USE_SELFSHADOW_MODE
#define USE_NONE_SELFSHADOW_MODE
#define USE_SOFT_SHADOW
float SoftShadowParam = 2;
float SelfShadowPower = 1;
#define USE_MATERIAL_SPECULAR
#define USE_MATERIAL_SPHERE
float3 DefaultModeShadowColor = {1,1,1};
#define MAX_ANISOTROPY 16

#include "AlternativeFull.fxsub"
