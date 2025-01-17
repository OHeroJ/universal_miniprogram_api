import {
  createSourceFile,
  forEachChild,
  ScriptTarget,
  Node,
  isModuleBlock,
  ModuleBlock,
  isInterfaceDeclaration,
  InterfaceDeclaration,
  Identifier,
  SyntaxKind,
  isTypeAliasDeclaration,
  TypeAliasDeclaration,
} from "typescript";
import { readFileSync, writeFileSync } from "fs";

const dartTypeMapping: { [key: string]: string } = {
  string: "String",
  boolean: "bool",
  number: "num",
  IAnyObject: "dynamic",
  dynamic: "dynamic",
};

let wxExportInterfaces = [
  "SystemInfo",
  "Host",
  "SafeArea",
  "Rect",
  "ImageFile",
  "MediaSource",
  "AnimationOption",
  "ChooseFile",
  "GeneralCallbackResult",
  "LaunchOptionsApp",
  "ForwardMaterials",
  "ReferrerInfo",
  "SwitchTabOption",
  "ReLaunchOption",
  "RedirectToOption",
  "NavigateToOption",
  "NavigateBackOption",
  "NavigateToMiniProgramOption",
  "NavigateBackMiniProgramOption",
  "GetBatteryInfoSyncResult",
  "ShowToastOption",
  "ShowModalOption",
  "ShowModalSuccessCallbackResult",
  "ShowLoadingOption",
  "ShowActionSheetOption",
  "ShowActionSheetSuccessCallbackResult",
  "EnableAlertBeforeUnloadOption",
  "OnCheckForUpdateCallbackResult",
  "UpdateShareMenuOption",
  "ShowShareMenuOption",
  "ShowShareImageMenuOption",
  "ShareVideoMessageOption",
  "ShareFileMessageOption",
  "HideShareMenuOption",
  "SetNavigationBarTitleOption",
  "SetNavigationBarColorOption",
  "SetTopBarTextOption",
  "RequestPaymentOption",
  "RequestOrderPaymentOption",
  "SaveImageToPhotosAlbumOption",
  "PreviewMediaOption",
  "PreviewImageOption",
  "GetImageInfoOption",
  "CompressImageOption",
  "ChooseMessageFileOption",
  "ChooseImageOption",
  "ChooseImageSuccessCallbackResult",
  "ChooseMessageFileSuccessCallbackResult",
  "CompressImageSuccessCallbackResult",
  "GetImageInfoSuccessCallbackResult",
  "OpenLocationOption",
  "OnLocationChangeCallbackResult",
  "GetLocationOption",
  "ChoosePoiOption",
  "ChooseLocationOption",
  "ChooseLocationSuccessCallbackResult",
  "ChoosePoiSuccessCallbackResult",
  "GetLocationSuccessCallbackResult",
  "LoginOption",
  "CheckSessionOption",
  "AccountInfo",
  "GetUserProfileOption",
  "UserInfo",
  "AuthorizeForMiniProgramOption",
  "AuthorizeOption",
  "MiniProgram",
  "Plugin",
  "GetUserProfileSuccessCallbackResult",
  "LoginSuccessCallbackResult",
  "OpenSettingOption",
  "GetSettingOption",
  "GetSettingSuccessCallbackResult",
  "AuthSetting",
  "SubscriptionsSetting",
  "ChooseAddressOption",
  "ChooseAddressSuccessCallbackResult",
  "RequestSubscribeMessageOption",
  "OpenSettingSuccessCallbackResult",
  "RequestSubscribeMessageFailCallbackResult",
  "RequestSubscribeMessageSuccessCallbackResult",
  "AddPhoneRepeatCalendarOption",
  "AddPhoneCalendarOption",
  "SearchContactsOption",
  "SearchContactsSuccessCallbackResult",
  "ChooseContactOption",
  "ChooseContactSuccessCallbackResult",
  "AddPhoneContactOption",
  "CheckIsOpenAccessibilityOption",
  "CheckIsOpenAccessibilitySuccessCallbackResult",
  "GetBatteryInfoOption",
  "GetBatteryInfoSuccessCallbackResult",
  "SetClipboardDataOption",
  "GetClipboardDataOption",
  "GetClipboardDataSuccessCallbackResult",
  "GetNetworkTypeOption",
  "GetNetworkTypeSuccessCallbackResult",
  "SetScreenBrightnessOption",
  "SetKeepScreenOnOption",
  "GetScreenBrightnessOption",
  "MakePhoneCallOption",
  "ScanCodeOption",
  "VibrateShortOption",
  "VibrateLongOption",
  "SearchContactsResult",
  "GetScreenBrightnessSuccessCallbackResult",
  "ScanCodeSuccessCallbackResult",
  "DownloadFileOption",
  "DownloadFileSuccessCallbackResult",
  "DownloadProfile",
  "UploadFileOption",
  "UploadFileSuccessCallbackResult",
  "AddCustomLayerOption",
  "AddGroundOverlayOption",
  "AddMarkersOption",
  "FromScreenLocationOption",
  "GetCenterLocationOption",
  "GetRegionOption",
  "GetRotateOption",
  "GetScaleOption",
  "GetSkewOption",
  "IncludePointsOption",
  "InitMarkerClusterOption",
  "MoveAlongOption",
  "MoveToLocationOption",
  "OpenMapAppOption",
  "RemoveCustomLayerOption",
  "RemoveGroundOverlayOption",
  "RemoveMarkersOption",
  "SetCenterOffsetOption",
  "SetLocMarkerIconOption",
  "ToScreenLocationOption",
  "TranslateMarkerOption",
  "UpdateGroundOverlayOption",
  "DestinationOption",
  "MapBounds",
  "MapPostion",
  "GetCenterLocationSuccessCallbackResult",
  "GetRegionSuccessCallbackResult",
  "GetRotateSuccessCallbackResult",
  "GetScaleSuccessCallbackResult",
  "GetSkewSuccessCallbackResult",
  "ToScreenLocationSuccessCallbackResult",
];
let wxExportTypeAlias = [
  "ShowToastCompleteCallback",
  "ShowToastFailCallback",
  "ShowToastSuccessCallback",
  "ShowModalCompleteCallback",
  "ShowModalFailCallback",
  "ShowModalSuccessCallback",
  "ShowLoadingCompleteCallback",
  "ShowLoadingFailCallback",
  "ShowLoadingSuccessCallback",
  "ShowActionSheetCompleteCallback",
  "ShowActionSheetFailCallback",
  "ShowActionSheetSuccessCallback",
  "EnableAlertBeforeUnloadCompleteCallback",
  "EnableAlertBeforeUnloadFailCallback",
  "EnableAlertBeforeUnloadSuccessCallback",
  "SwitchTabCompleteCallback",
  "SwitchTabFailCallback",
  "SwitchTabSuccessCallback",
  "ReLaunchCompleteCallback",
  "ReLaunchFailCallback",
  "ReLaunchSuccessCallback",
  "RedirectToCompleteCallback",
  "RedirectToFailCallback",
  "RedirectToSuccessCallback",
  "NavigateToCompleteCallback",
  "NavigateToFailCallback",
  "NavigateToSuccessCallback",
  "NavigateBackCompleteCallback",
  "NavigateBackFailCallback",
  "NavigateBackSuccessCallback",
  "NavigateToMiniProgramCompleteCallback",
  "NavigateToMiniProgramFailCallback",
  "NavigateToMiniProgramSuccessCallback",
  "NavigateBackMiniProgramCompleteCallback",
  "NavigateBackMiniProgramFailCallback",
  "NavigateBackMiniProgramSuccessCallback",
  "UpdateShareMenuCompleteCallback",
  "UpdateShareMenuFailCallback",
  "UpdateShareMenuSuccessCallback",
  "ShowShareMenuCompleteCallback",
  "ShowShareMenuFailCallback",
  "ShowShareMenuSuccessCallback",
  "ShowShareImageMenuCompleteCallback",
  "ShowShareImageMenuFailCallback",
  "ShowShareImageMenuSuccessCallback",
  "ShareVideoMessageCompleteCallback",
  "ShareVideoMessageFailCallback",
  "ShareVideoMessageSuccessCallback",
  "ShareFileMessageCompleteCallback",
  "ShareFileMessageFailCallback",
  "ShareFileMessageSuccessCallback",
  "HideShareMenuCompleteCallback",
  "HideShareMenuFailCallback",
  "HideShareMenuSuccessCallback",
  "SetNavigationBarTitleCompleteCallback",
  "SetNavigationBarTitleFailCallback",
  "SetNavigationBarTitleSuccessCallback",
  "SetNavigationBarColorCompleteCallback",
  "SetNavigationBarColorFailCallback",
  "SetNavigationBarColorSuccessCallback",
  "SetTopBarTextCompleteCallback",
  "SetTopBarTextFailCallback",
  "SetTopBarTextSuccessCallback",
  "RequestPaymentCompleteCallback",
  "RequestPaymentFailCallback",
  "RequestPaymentSuccessCallback",
  "RequestOrderPaymentCompleteCallback",
  "RequestOrderPaymentFailCallback",
  "RequestOrderPaymentSuccessCallback",
  "SaveImageToPhotosAlbumCompleteCallback",
  "SaveImageToPhotosAlbumFailCallback",
  "SaveImageToPhotosAlbumSuccessCallback",
  "PreviewMediaCompleteCallback",
  "PreviewMediaFailCallback",
  "PreviewMediaSuccessCallback",
  "PreviewImageCompleteCallback",
  "PreviewImageFailCallback",
  "PreviewImageSuccessCallback",
  "GetImageInfoCompleteCallback",
  "GetImageInfoFailCallback",
  "GetImageInfoSuccessCallback",
  "CompressImageCompleteCallback",
  "CompressImageFailCallback",
  "CompressImageSuccessCallback",
  "ChooseMessageFileCompleteCallback",
  "ChooseMessageFileFailCallback",
  "ChooseMessageFileSuccessCallback",
  "ChooseImageCompleteCallback",
  "ChooseImageFailCallback",
  "ChooseImageSuccessCallback",
  "OpenLocationCompleteCallback",
  "OpenLocationFailCallback",
  "OpenLocationSuccessCallback",
  "OnLocationChangeCallback",
  "GetLocationCompleteCallback",
  "GetLocationFailCallback",
  "GetLocationSuccessCallback",
  "ChoosePoiCompleteCallback",
  "ChoosePoiFailCallback",
  "ChoosePoiSuccessCallback",
  "ChooseLocationCompleteCallback",
  "ChooseLocationFailCallback",
  "ChooseLocationSuccessCallback",
  "LoginCompleteCallback",
  "LoginFailCallback",
  "LoginSuccessCallback",
  "CheckSessionCompleteCallback",
  "CheckSessionFailCallback",
  "CheckSessionSuccessCallback",
  "GetUserProfileCompleteCallback",
  "GetUserProfileFailCallback",
  "GetUserProfileSuccessCallback",
  "AuthorizeForMiniProgramCompleteCallback",
  "AuthorizeForMiniProgramFailCallback",
  "AuthorizeForMiniProgramSuccessCallback",
  "AuthorizeCompleteCallback",
  "AuthorizeFailCallback",
  "AuthorizeSuccessCallback",
  "OpenSettingCompleteCallback",
  "OpenSettingFailCallback",
  "OpenSettingSuccessCallback",
  "GetSettingCompleteCallback",
  "GetSettingFailCallback",
  "GetSettingSuccessCallback",
  "ChooseAddressCompleteCallback",
  "ChooseAddressFailCallback",
  "ChooseAddressSuccessCallback",
  "RequestSubscribeMessageCompleteCallback",
  "RequestSubscribeMessageFailCallback",
  "RequestSubscribeMessageSuccessCallback",
  "wrapRequestSubscribeMessageSuccessCallback",
  "AddPhoneRepeatCalendarCompleteCallback",
  "AddPhoneRepeatCalendarFailCallback",
  "AddPhoneRepeatCalendarSuccessCallback",
  "AddPhoneCalendarCompleteCallback",
  "AddPhoneCalendarFailCallback",
  "AddPhoneCalendarSuccessCallback",
  "SearchContactsCompleteCallback",
  "SearchContactsFailCallback",
  "SearchContactsSuccessCallback",
  "ChooseContactCompleteCallback",
  "ChooseContactFailCallback",
  "ChooseContactSuccessCallback",
  "AddPhoneContactCompleteCallback",
  "AddPhoneContactFailCallback",
  "AddPhoneContactSuccessCallback",
  "CheckIsOpenAccessibilityCompleteCallback",
  "CheckIsOpenAccessibilityFailCallback",
  "CheckIsOpenAccessibilitySuccessCallback",
  "GetBatteryInfoCompleteCallback",
  "GetBatteryInfoFailCallback",
  "GetBatteryInfoSuccessCallback",
  "SetClipboardDataCompleteCallback",
  "SetClipboardDataFailCallback",
  "SetClipboardDataSuccessCallback",
  "GetClipboardDataCompleteCallback",
  "GetClipboardDataFailCallback",
  "GetClipboardDataSuccessCallback",
  "GetNetworkTypeCompleteCallback",
  "GetNetworkTypeFailCallback",
  "GetNetworkTypeSuccessCallback",
  "SetScreenBrightnessCompleteCallback",
  "SetScreenBrightnessFailCallback",
  "SetScreenBrightnessSuccessCallback",
  "SetKeepScreenOnCompleteCallback",
  "SetKeepScreenOnFailCallback",
  "SetKeepScreenOnSuccessCallback",
  "GetScreenBrightnessCompleteCallback",
  "GetScreenBrightnessFailCallback",
  "GetScreenBrightnessSuccessCallback",
  "MakePhoneCallCompleteCallback",
  "MakePhoneCallFailCallback",
  "MakePhoneCallSuccessCallback",
  "ScanCodeCompleteCallback",
  "ScanCodeFailCallback",
  "ScanCodeSuccessCallback",
  "VibrateShortCompleteCallback",
  "VibrateShortFailCallback",
  "VibrateShortSuccessCallback",
  "VibrateLongCompleteCallback",
  "VibrateLongFailCallback",
  "VibrateLongSuccessCallback",
  "DownloadFileCompleteCallback",
  "DownloadFileFailCallback",
  "DownloadFileSuccessCallback",
  "UploadFileCompleteCallback",
  "UploadFileFailCallback",
  "UploadFileSuccessCallback",
  "AddCustomLayerCompleteCallback",
  "AddCustomLayerFailCallback",
  "AddCustomLayerSuccessCallback",
  "AddGroundOverlayCompleteCallback",
  "AddGroundOverlayFailCallback",
  "AddGroundOverlaySuccessCallback",
  "AddMarkersCompleteCallback",
  "AddMarkersFailCallback",
  "AddMarkersSuccessCallback",
  "FromScreenLocationCompleteCallback",
  "FromScreenLocationFailCallback",
  "FromScreenLocationSuccessCallback",
  "GetRegionCompleteCallback",
  "GetRegionFailCallback",
  "GetRegionSuccessCallback",
  "GetRotateCompleteCallback",
  "GetRotateFailCallback",
  "GetRotateSuccessCallback",
  "GetScaleCompleteCallback",
  "GetScaleFailCallback",
  "GetScaleSuccessCallback",
  "GetSkewCompleteCallback",
  "GetSkewFailCallback",
  "GetSkewSuccessCallback",
  "IncludePointsCompleteCallback",
  "IncludePointsFailCallback",
  "IncludePointsSuccessCallback",
  "InitMarkerClusterCompleteCallback",
  "InitMarkerClusterFailCallback",
  "InitMarkerClusterSuccessCallback",
  "MoveAlongCompleteCallback",
  "MoveAlongFailCallback",
  "MoveAlongSuccessCallback",
  "MoveToLocationCompleteCallback",
  "MoveToLocationFailCallback",
  "MoveToLocationSuccessCallback",
  "OpenMapAppCompleteCallback",
  "OpenMapAppFailCallback",
  "OpenMapAppSuccessCallback",
  "RemoveCustomLayerCompleteCallback",
  "RemoveCustomLayerFailCallback",
  "RemoveCustomLayerSuccessCallback",
  "RemoveMarkersCompleteCallback",
  "RemoveMarkersFailCallback",
  "RemoveMarkersSuccessCallback",
  "SetCenterOffsetCompleteCallback",
  "SetCenterOffsetFailCallback",
  "SetCenterOffsetSuccessCallback",
  "SetLocMarkerIconCompleteCallback",
  "SetLocMarkerIconFailCallback",
  "SetLocMarkerIconSuccessCallback",
  "ToScreenLocationCompleteCallback",
  "ToScreenLocationFailCallback",
  "ToScreenLocationSuccessCallback",
  "TranslateMarkerCompleteCallback",
  "TranslateMarkerFailCallback",
  "TranslateMarkerSuccessCallback",
  "UpdateGroundOverlayCompleteCallback",
  "UpdateGroundOverlayFailCallback",
  "UpdateGroundOverlaySuccessCallback",
  "GetCenterLocationCompleteCallback",
  "GetCenterLocationFailCallback",
  "GetCenterLocationSuccessCallback",
  "RemoveGroundOverlayCompleteCallback",
  "RemoveGroundOverlayFailCallback",
  "RemoveGroundOverlaySuccessCallback",
];
let wxWrapCallbacks: any = [
  "wrapShowModalSuccessCallback",
  "wrapShowActionSheetSuccessCallback",
  "wrapChooseImageSuccessCallback",
  "wrapChooseMessageFileSuccessCallback",
  "wrapChooseMessageFileSuccessCallback",
  "wrapCompressImageSuccessCallback",
  "wrapGetImageInfoSuccessCallback",
  "wrapChooseLocationSuccessCallback",
  "wrapChoosePoiSuccessCallback",
  "wrapGetLocationSuccessCallback",
  "wrapGetUserProfileSuccessCallback",
  "wrapLoginSuccessCallback",
  "wrapOpenSettingSuccessCallback",
  "wrapRequestSubscribeMessageFailCallback",
  "wrapRequestSubscribeMessageSuccessCallback",
  "wrapGetSettingSuccessCallback",
  "wrapChooseAddressSuccessCallback",
  "wrapGetScreenBrightnessSuccessCallback",
  "wrapScanCodeSuccessCallback",
  "wrapCheckIsOpenAccessibilitySuccessCallback",
  "wrapChooseContactSuccessCallback",
  "wrapGetBatteryInfoSuccessCallback",
  "wrapGetClipboardDataSuccessCallback",
  "wrapGetNetworkTypeSuccessCallback",
  "wrapSearchContactsSuccessCallback",
  "wrapDownloadFileSuccessCallback",
  "wrapUploadFileSuccessCallback",
  "wrapGetCenterLocationSuccessCallback",
  "wrapGetRegionSuccessCallback",
  "wrapGetRotateSuccessCallback",
  "wrapGetScaleSuccessCallback",
  "wrapGetSkewSuccessCallback",
  "wrapToScreenLocationSuccessCallback",
  "wrapFromScreenLocationSuccessCallback",
];
let typeRewrite: any = {
  "SystemInfo.deviceOrientation": "string",
  "SystemInfo.theme": "string",
  "LaunchOptionsApp.forwardMaterials": "dynamic",
  "LaunchOptionsApp.chatType": "number",
  "UpdateShareMenuOption.templateInfo": "dynamic",
  "ShowShareMenuOption.menus": "List<String>",
  "HideShareMenuOption.menus": "List<String>",
  "NavigateToMiniProgramOption.envVersion": "string",
  "ShowToastOption.icon": "string",
  "ShowActionSheetOption.itemList": "List<String>",
  "AnimationOption.timingFunc": "string",
  "RequestPaymentOption.signType": "string",
  "RequestOrderPaymentOption.signType": "string",
  "PreviewMediaOption.sources": "List<MediaSource>",
  "ChooseMessageFileOption.extension": "List<String>",
  "ChooseMessageFileOption.type": "string",
  "ChooseImageOption.sizeType": "List<String>",
  "ChooseImageOption.sourceType": "List<String>",
  "MediaSource.type": "string",
  "PreviewImageOption.urls": "List<String>",
  "ChooseImageSuccessCallbackResult.tempFilePaths": "List<String>",
  "ChooseImageSuccessCallbackResult.tempFiles": "List<ImageFile>",
  "ChooseMessageFileSuccessCallbackResult.tempFiles": "List<ChooseFile>",
  "ChooseFile.type": "string",
  "GetImageInfoSuccessCallbackResult.orientation": "string",
  "GetUserProfileOption.lang": "string",
  "MiniProgram.envVersion": "string",
  "AuthorizeForMiniProgramOption.scope": "string",
  "UserInfo.gender": "number",
  "UserInfo.language": "string",
  "RequestSubscribeMessageOption.tmplIds": "List<String>",
  "ScanCodeOption.scanType": "List<String>",
  "ScanCodeSuccessCallbackResult.scanType": "string",
  "GetNetworkTypeSuccessCallbackResult.networkType": "string",
  "IncludePointsOption.padding": "List<double>",
  "MoveAlongOption.path": "List<Map>",
  "RemoveMarkersOption.markerIds": "List<dynamic>",
  "SetCenterOffsetOption.offset": "List<num>",
  "TranslateMarkerOption.animationEnd": "dynamic",
  "AddMarkersOption.markers": "List<WechatMiniProgramMapMarker>",
};

let requestObjects = ["MediaSource"];

const main = () => {
  const sourceFile = createSourceFile(
    "lib.wx.api.d.ts",
    readFileSync("typing/lib.wx.api.d.ts", { encoding: "utf-8" }),
    ScriptTarget.ES2015
  );
  let moduleBlock = Parser.fetchKind(sourceFile, isModuleBlock) as ModuleBlock;
  if (!moduleBlock) return;
  let interfaceDeclarations = moduleBlock.statements.filter(
    (it) =>
      isInterfaceDeclaration(it) &&
      wxExportInterfaces.indexOf(it.name.escapedText as string) >= 0
  ) as InterfaceDeclaration[];
  let typeDeclarations = moduleBlock.statements.filter(
    (it) =>
      isTypeAliasDeclaration(it) &&
      wxExportTypeAlias.indexOf(it.name.escapedText as string) >= 0
  ) as TypeAliasDeclaration[];

  // Interface code begin
  let interfaceCode = "part of 'universal_miniprogram_api.dart';\n\n";

  interfaceDeclarations.forEach((interfaceDeclaration) => {
    const className = (interfaceDeclaration.name as Identifier).escapedText;
    if (!className) return;
    if (
      className.endsWith("Option") ||
      requestObjects.indexOf(className) >= 0
    ) {
      let membersInitCode = "";
      let membersFieldCode = "";
      let memberstoJSONCode = "";
      interfaceDeclaration.members.forEach((member) => {
        if (!member.name) return;
        const memberName = (member.name as Identifier).escapedText;
        if (!memberName) return;
        let memberTypeName = "";
        if ((member as any)?.type?.kind === SyntaxKind.StringKeyword) {
          memberTypeName = "string";
        } else if ((member as any)?.type?.kind === SyntaxKind.BooleanKeyword) {
          memberTypeName = "boolean";
        } else if ((member as any)?.type?.kind === SyntaxKind.NumberKeyword) {
          memberTypeName = "number";
        } else if (typeRewrite[`${className}.${memberName}`] !== undefined) {
          memberTypeName = typeRewrite[`${className}.${memberName}`];
        } else {
          memberTypeName =
            (member as any)?.type?.typeName?.escapedText ??
            (member as any)?.type?.elementType?.typeName?.escapedText;
        }
        const isOptional = member.questionToken !== undefined;
        membersInitCode += `${
          isOptional ? "" : "required "
        } this.${memberName},`;
        membersFieldCode += `${transformType(memberTypeName)}${
          isOptional ? "?" : ""
        } ${memberName};\n`;
        if (memberTypeName && memberTypeName.endsWith("Callback")) {
          if (wxWrapCallbacks.indexOf(`wrap${memberTypeName}`) >= 0) {
            memberstoJSONCode += `'${memberName}': wrap${memberTypeName}(${memberName}),`;
          } else {
            memberstoJSONCode += `'${memberName}': wrapGeneralCallbackResult(${memberName}),`;
          }
        } else {
          memberstoJSONCode += `'${memberName}': ${memberName},`;
        }
      });
      interfaceCode += `
    class ${className} extends WechatRequestObject {
        ${className}({${membersInitCode}}) : super();

        ${membersFieldCode}

        Map toJson() {
            return {
                ${memberstoJSONCode}
            }..removeWhere((key, value) => value == null);
        }

    }\n`;
    } else {
      let membersCode = "";
      interfaceDeclaration.members.forEach((member) => {
        if (!member.name) return;
        const memberName =
          (member.name as Identifier).escapedText ??
          (member.name as Identifier).text;
        let memberTypeName = "";
        if ((member as any)?.type?.kind === SyntaxKind.StringKeyword) {
          memberTypeName = "string";
        } else if ((member as any)?.type?.kind === SyntaxKind.BooleanKeyword) {
          memberTypeName = "boolean";
        } else if ((member as any)?.type?.kind === SyntaxKind.NumberKeyword) {
          memberTypeName = "number";
        } else if (typeRewrite[`${className}.${memberName}`] !== undefined) {
          memberTypeName = typeRewrite[`${className}.${memberName}`];
        } else {
          memberTypeName =
            (member as any)?.type?.typeName?.escapedText ??
            (member as any)?.type?.elementType?.typeName?.escapedText;
        }
        if (transformType(memberTypeName).startsWith("List<")) {
          let tMemberTypeName = transformType(memberTypeName);
          if (
            tMemberTypeName === "List<String>" ||
            tMemberTypeName === "List<num>"
          ) {
            membersCode += `Future<${tMemberTypeName}> get ${memberName.replace(
              /\./g,
              "_"
            )} => getValue<${tMemberTypeName}>('${memberName}');\n`;
          } else {
            membersCode += `Future<${tMemberTypeName}> get ${memberName.replace(
              /\./g,
              "_"
            )} async {
              return (await getValue<List<mpjs.JsObject>>('${memberName.replace(
                /\./g,
                "_"
              )}'))
                  .map((e) => ${tMemberTypeName
                    .replace("List<", "")
                    .replace(">", "")}(e))
                  .toList();
            }\n`;
          }
        } else if (dartTypeMapping[memberTypeName] === undefined) {
          membersCode += `Future<${transformType(
            memberTypeName
          )}> get ${memberName.replace(/\./g, "_")} async {
            return ${transformType(
              memberTypeName
            )}(await getValue<mpjs.JsObject>('${memberName.replace(
            /\./g,
            "_"
          )}'));
          }\n`;
        } else {
          membersCode += `Future<${transformType(
            memberTypeName
          )}> get ${memberName.replace(/\./g, "_")} => getValue<${transformType(
            memberTypeName
          )}>('${memberName}');\n`;
        }
      });
      interfaceCode += `
    class ${className} extends WechatResponseObject {
        ${className}(mpjs.JsObject context) : super(context);
        ${membersCode}
    }\n`;
    }
  });
  // Interface code end

  // Types code begin
  let typeCode = "";
  typeDeclarations.forEach((typeDeclaration) => {
    const name = typeDeclaration.name.escapedText;
    let paramCodes: string[] = [];
    if ((typeDeclaration.type as any)?.parameters) {
      (typeDeclaration.type as any).parameters.forEach((typeParam: any) => {
        if (!typeParam.type.typeName) return;
        const paramName = typeParam.name.escapedText;
        const paramType = typeParam.type.typeName.escapedText;
        paramCodes.push(`${transformType(paramType)} ${paramName}`);
      });
    }
    typeCode += `typedef ${name} = void Function(${paramCodes.join(",")});\n`;
  });

  writeFileSync(
    "lib/universal_miniprogram_api_interface.dart",
    `
    ${interfaceCode}
    ${typeCode}
    `
  );
};

const transformType = (value: string): string => {
  return dartTypeMapping[value] ?? value;
};

class Parser {
  static fetchKind(
    node: Node,
    comparator: (node: Node) => boolean
  ): Node | undefined {
    let result: any;
    forEachChild(node, (childNode) => {
      if (result) return;
      if (comparator(childNode)) {
        result = childNode;
      } else {
        result = this.fetchKind(childNode, comparator);
      }
    });
    return result;
  }
}

main();
