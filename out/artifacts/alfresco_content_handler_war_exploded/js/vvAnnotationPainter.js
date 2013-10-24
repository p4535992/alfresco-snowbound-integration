var myPainter=new AnnotationPainter();function AnnotationPainter(){AnnotationPainter.prototype.resetLayers=function(R){};AnnotationPainter.prototype.getCurrentLayer=function(){var S=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var U=S.getLayerNames();if(!S.getCurrentLayer()){if(U.length===0){this.createDefaultLayer(S)}else{var R=S.getLayersForPage(myFlexSnap.getPageNumber());if(!R){return undefined}var T=R.Default;if(T){S.setCurrentLayer(T)}else{S.setCurrentLayer(R[U[0]]);if(!S.getCurrentLayer()){this.createDefaultLayer(S)}}}}return S.getCurrentLayer()};AnnotationPainter.prototype.parseLayer=function(Y,S){var T=document.getElementById("vvAnnotationCanvas");var b=Y.getElementsByTagName("pageMeta")[0];var U=Y.getElementsByTagName("annObject");var f=fixBooleanString(getValue(Y,"isFilenet"));var e=fixBooleanString(getValue(Y,"isDaeja"));var c=fixBooleanString(getValue(Y,"isIDM"));if(b){var Z={};Z.layerName=getValue(Y,"annLayerID");Z.pageNumber=parseInt(getValue(b,"pageNumber"),10);Z.pageWidth=parseInt(getValue(b,"pageWidth"),10);Z.pageHeight=parseInt(getValue(b,"pageHeight"),10);Z.doubleByte=fixBooleanString(getValue(Y,"doubleByte"));Z.visibility=true;Z.docDPI=parseInt(getValue(Y,"docDPI"),10);Z.isFilenet=f;Z.isDaeja=e;Z.isIDM=c;if(c){Z.docDPI=200}if(f){}else{if(e){if((Z.pageWidth===0)&&(Z.pageHeight===0)){Z.pageWidth=myFlexSnap.getOriginalWidth();Z.pageHeight=myFlexSnap.getOriginalHeight()}}}Z.anns=[];for(var W=0;W<U.length;W++){Z.anns[W]=new Annotation(U[W],Z.pageWidth,Z.pageHeight,Z.layerName,Z.doubleByte,W,Z.docDPI,f,e,c)}if(Z.layerName==="Default"){S.setCurrentLayer(Z)}var X=myFlexSnap.getDocumentModel();if(!X){return }var V=X.model.layerManager.layers.length;for(var d=0;d<V;d++){var a=X.model.layerManager.layers[d];var R=unescape(a.annotationId);if(R===Z.layerName){Z.isRedaction=a.isRedaction;Z.isDeletable=a.isDeletable;Z.permissionLevel=a.permissionLevel;break}}S.addLayerToPage(S.getPageNumber(),Z)}};var P=function(U,V){var T=document.getElementById("layerManagerActiveLayerSelect");var S=U.layerName;var W=document.createElement("option");var Y=document.createTextNode(S);W.id="annLayer"+S;W.value=S;W.appendChild(Y);if(S==="Default"){W.selected="selected"}else{if(myPainter.getCurrentLayer()&&(S===myPainter.getCurrentLayer().layerName)){W.selected="selected"}}$(T).change(function(b){if(!b){b=window.event}var c=V.getLayerNames();var a=V.getPageNumber();var Z=V.getLayerFromPage(a,c[b.target.selectedIndex]);V.setCurrentLayer(Z)});T.appendChild(W);var R=document.getElementById("layerManagerVisibilityControl");W=document.createElement("input");Y=document.createTextNode(S);var X=document.createElement("br");W.id="visLayer"+S;W.type="checkbox";W.name="visLayer"+S;W.value=S;R.appendChild(W);R.appendChild(Y);R.appendChild(X);W.onclick=K;if(U.visibility===true){W.checked="checked"}else{W.checked=null}};AnnotationPainter.prototype.fillLayerDialog=function(){if(vvConfig.oneLayerPerAnnotation!==true){var U=document.getElementById("layerManagerActiveLayerSelect");var T=document.getElementById("layerManagerVisibilityControl");var V=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var W=V.getLayerNames();while(U.firstChild){U.removeChild(U.firstChild)}while(T.firstChild){T.removeChild(T.firstChild)}for(var R=0;R<W.length;R+=1){var S=V.getLayerFromPage(V.getPageNumber(),W[R]);if((S!==undefined)&&(S.permissionLevel>vvDefines.permissionLevels.PERM_HIDDEN)){P(S,V)}}if(this.getCurrentLayer()&&(this.getCurrentLayer().isRedaction===true)){document.getElementById("layerManagerRedactLayerButton").style.borderStyle="inset"}else{document.getElementById("layerManagerRedactLayerButton").style.borderStyle="outset"}}};AnnotationPainter.prototype.checkLayerPermission=function(R,S){if(R){if(R.permissionLevel<S){return false}else{return true}}else{return true}};var K=function(T){if(!T){T=window.event}var R=this.value;var U=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var S=U.getLayerFromPage(U.getPageNumber(),R);S.visibility=this.checked;myPainter.paintAnnotations()};AnnotationPainter.prototype.createLayer=function(S){var U=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var W=U.getLayerNames();var T=myPainter.createAnnotationLayer(S);U.setCurrentLayer(T);W.push(S);U.addLayerToPage(U.getPageNumber(),T);var R=U.getDocumentModel();var V={newLayer:true,annotationId:S,isDeletable:true,isRedaction:false,permissionLevel:80,visible:true};R.model.layerManager.layers.push(V);myPainter.addLayerToPageHash(S,U.getPageNumber());myPainter.fillLayerDialog()};AnnotationPainter.prototype.addLayerToPageHash=function(U,R){var W=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var T=W.getDocumentModel();var V=T.model.pageData[R];if(!V.annotationHash){V.annotationHash={}}var S=V.annotationHash[U];if(S){S.annExists=true}else{var X={annExists:true,documentId:W.getDocumentId(),layerAnnotationId:U,layersToMerge:[],pageIndex:R,rotateAngle:rotateAngle};V.annotationHash[U]=X}};AnnotationPainter.prototype.createDefaultLayer=function(S){var R="Default";var U=S.getLayerNames();var T=S.getLayersForPage(S.getPageNumber());if((U.length===0)&&((!T)||(!T[R]))){this.createLayer(R)}};AnnotationPainter.prototype.createAnnotationLayer=function(S){var R=document.getElementById("vvAnnotationCanvas");var U={};var V=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var T=V.getDPIForPage(V.getPageNumber());U.layerName=S;U.pageNumber=myFlexSnap.getPageNumber();U.pageWidth=myFlexSnap.getOriginalWidth();U.pageHeight=myFlexSnap.getOriginalHeight();U.docDPI=T;if(vvConfig.createIDMAnnotations){U.pageWidth=10000;U.pageHeight=10000;U.docDPI=200;U.isIDM=true}if(vvConfig.base64EncodeAnnotations){U.doubleByte=true}else{U.doubleByte=false}U.visibility=true;U.isRedaction=false;U.isDeletable=true;U.permissionLevel=vvDefines.permissionLevels.PERM_DELETE;U.anns=[];return U};var I=function(R){var S=myFlexSnap.getDocumentId();if(!S){return null}var T=vvConfig.servletPath;T+="?action=deleteAnnotationLayer";T+="&documentId="+S;T+="&clientInstanceId="+myFlexSnap.getClientInstanceId();T+="&layerName="+R;T+="&pageCount="+myFlexSnap.getPageCount();if(vvDefines.cacheBuster===true){T+="&cacheBuster="+Math.random()}ajax(T,"",G)};var M=function(U,T){var R=myFlexSnap.getDocumentId();if(!R){return null}var S=vvConfig.servletPath;S+="?action=renameAnnotationLayer";S+="&documentId="+R;S+="&clientInstanceId="+myFlexSnap.getClientInstanceId();S+="&oldLayerName="+U;S+="&newLayerName="+T;S+="&pageCount="+myFlexSnap.getPageCount();if(vvDefines.cacheBuster===true){S+="&cacheBuster="+Math.random()}ajax(S,"",N)};var G=function(S){var R=JSON.parse(S);if(myFlexSnap.checkServerException(R)===true){return }};var N=function(S,R){};AnnotationPainter.prototype.deleteCurrentLayer=function(){var V=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var W=V.getLayerNames();var S=this.getCurrentLayer();I(S.layerName);var U=[];for(var R=0;R<W.length;R+=1){var T=W[R];if(T!==S.layerName){U.push(T)}}V.setLayerNames(U);V.deleteLayer(S.layerName);V.setCurrentLayer(undefined);this.getCurrentLayer();this.paintAnnotations()};AnnotationPainter.prototype.renameCurrentLayer=function(S){if(this.getCurrentLayer()){var T=this.getCurrentLayer().layerName;M(T,S);var R=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());R.renameLayer(T,S);myFlexSnap.getDocumentModel().renameLayer(T,S);this.fillLayerDialog()}};AnnotationPainter.prototype.markCurrentLayerDirty=function(){var R=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());R.getDocumentModel().markLayerDirty(this.getCurrentLayer())};AnnotationPainter.prototype.markLayerWithAnnDirty=function(V){var U=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var W=U.getLayersForPage(U.getPageNumber());var X=U.getLayerNames();for(var R=0;R<X.length;R++){var S=W[X[R]];for(var T=0;T<S.anns.length;T++){if(S.anns[T]===V){U.getDocumentModel().markLayerDirty(S);break}}}};AnnotationPainter.prototype.getAnnotationAtPoint=function(d,Z){var U=document.getElementById("innerDiv");var T=document.getElementById("vvAnnotationCanvas");var S=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var X=S.getLayersForPage(S.getPageNumber());var b=S.getLayerNames();var a=null;for(var c=0;c<b.length;c++){var V=X[b[c]];if(V){if(V.visibility){for(var W=0;W<V.anns.length;W++){var R=V.anns[W];var Y=R.getBoundingBox();if(V.anns[W].getDelete()===false){if(Y.contains(d,R.getWidthRatio(),R.getHeightRatio())){if(a){if(Y.getWidth()<a.getBoundingBox().getWidth()){a=R;if(Z){break}}}else{a=R;if(Z){break}}}}}}}}return a};AnnotationPainter.prototype.isAnnotationAtPoint=function(R){var S=this.getAnnotationAtPoint(R,true);if(S){return true}else{return false}};AnnotationPainter.prototype.getAnnotationAtIndex=function(R){return this.getCurrentLayer().anns[R]};AnnotationPainter.prototype.getAnnotationCount=function(){return this.getCurrentLayer().anns.length};AnnotationPainter.prototype.paintAnnotations=function(){var R=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var W=R.getLayersForPage(R.getPageNumber());var Y=R.getLayerNames();if(!W||!Y){return }myPainter.clearAnnotations();var S=document.getElementById("vvAnnotationCanvas");var a=S.getContext("2d");var X=Y.length;var U=degreesToRadians(rotateAngle);a.save();for(var Z=0;Z<X;Z++){var T=W[Y[Z]];if((T!==undefined)&&(T.permissionLevel>vvDefines.permissionLevels.PERM_HIDDEN)){if(T.visibility===true){for(var V=0;V<T.anns.length;V++){if(T.anns[V].getDelete()!==true){myPainter.paintAnnotation(S,T.anns[V])}}}}}a.restore()};AnnotationPainter.prototype.addAnnotation=function(R){var S=myFlexSnap.getStateForDocumentId(myFlexSnap.getDocumentId());var W=S.getLayersForPage(S.getPageNumber());var Z=S.getLayerNames();var T=document.getElementById("vvAnnotationCanvas");var Y=Z.length;if(!L(R)){return }if(R.getType()===vvDefines.annotationTypes.SANN_POSTIT){R.setFillColor(vvConfig.annotationDefaults.stickyFillColor);R.setLineColor(null)}if(Y===0){this.createDefaultLayer(S);Y=Z.length}else{if(!this.getCurrentLayer()){for(var a=0;a<Y;a+=1){var b=this.checkLayerPermission(W[Z[a]],vvDefines.permissionLevels.PERM_CREATE);if(b===true){S.setCurrentLayer(W[Z[a]]);break}}if(!this.getCurrentLayer()){this.createDefaultLayer(S)}}}var U=this.getCurrentLayer();if(myPainter.checkLayerPermission(this.getCurrentLayer(),vvDefines.permissionLevels.PERM_CREATE)===false){alert(getLocalizedValue("errors.createAnnOnLayerPermission","You do not have permission to create annotations on this layer."));return }var X=-1;if(U.pageWidth===0){U.pageWidth=myFlexSnap.getOriginalWidth()}if(U.pageHeight===0){U.pageHeight=myFlexSnap.getOriginalHeight()}R.setLayerName(U.layerName);R.setPageWidth(U.pageWidth);R.setPageHeight(U.pageHeight);R.fixCoordinates();for(var V=0;V<U.anns.length;V++){if(U.anns[V].getOrdinal()>X){X=U.anns[V].getOrdinal()}}R.setOrdinal(X+1);R.setIndex(U.anns.length);U.anns.push(R);myPainter.addLayerToPageHash(U.layerName,S.getPageNumber());S.getDocumentModel().markLayerDirty(U)};AnnotationPainter.prototype.clearAnnotations=function(){var S=document.getElementById("vvAnnotationCanvas");$(".snowbound-text-annotation").remove();$(".vvTextAnnEditOkButton").remove();$(".vvTextAnnEditCancelButton").remove();if(S){var R=S.getContext("2d");R.clearRect(0,0,S.width,S.height)}};AnnotationPainter.prototype.paintAnnotation=function(U,S){var W=S.getType();var V=S.getBoundingBox();var R=V.getX1()*S.getWidthRatio();var X=V.getY1()*S.getHeightRatio();var T=V.getWidth()*S.getWidthRatio();var Y=V.getHeight()*S.getHeightRatio();if((rotateAngle===90)||(rotateAngle===270)){X=V.getX1()*S.getWidthRatio();R=V.getY1()*S.getHeightRatio();Y=V.getWidth()*S.getWidthRatio();T=V.getHeight()*S.getHeightRatio()}if((W===vvDefines.annotationTypes.SANN_FILLED_RECT)||(W===vvDefines.annotationTypes.SANN_HIGHLIGHT_RECT)||(W===vvDefines.annotationTypes.SANN_RECTANGLE)){if(V.getY2()<V.getY1()){X=V.getY2()*S.getHeightRatio();Y*=-1}if(V.getX2()<V.getX1()){R=V.getX2()*S.getWidthRatio();T*=-1}}var Z=U.getContext("2d");Z.lineWidth=S.getLineWidth();if(S.getLineColor()){Z.strokeStyle=S.getLineColor()}if(S.getFillColor()){Z.fillStyle=S.getFillColor()}if(W===vvDefines.annotationTypes.SANN_RECTANGLE){if(S.getFillColor()){D(Z,S,true)}else{if(S.getLineColor()){D(Z,S,false)}}}else{if(W===vvDefines.annotationTypes.SANN_LINE){A(Z,S,false,false)}else{if(W===vvDefines.annotationTypes.SANN_ELLIPSE){O(Z,S)}else{if(W===vvDefines.annotationTypes.SANN_BITMAP){}else{if(W===vvDefines.annotationTypes.SANN_POSTIT){C(Z,S)}else{if(W===vvDefines.annotationTypes.SANN_POLYGON){A(Z,S,false,true)}else{if(W===vvDefines.annotationTypes.SANN_ARROW){A(Z,S,true,false)}else{if(W===vvDefines.annotationTypes.SANN_EDIT){H(Z,S)}else{if(W===vvDefines.annotationTypes.SANN_TRANSPARENT_BITMAP){}else{if(W===vvDefines.annotationTypes.SANN_BUBBLE){E(Z,S)}else{if(W===vvDefines.annotationTypes.SANN_CLOUD_EDIT){F(Z,S)}else{if(W===vvDefines.annotationTypes.SANN_CUSTOM_STAMP){}else{if(W===vvDefines.annotationTypes.SANN_CIRCLE){O(Z,S)}}}}}}}}}}}}}};var D=function(R,U,V){var T=U.getBoundingBox();var S=[];S[0]=new Point(T.getX1(),T.getY1());S[1]=new Point(T.getX2(),T.getY1());S[2]=new Point(T.getX2(),T.getY2());S[3]=new Point(T.getX1(),T.getY2());S[4]=new Point(T.getX1(),T.getY1());U.setPointArray(S);A(R,U,false,V);U.setPointArray(null)};var E=function(R,T){var S=T.getBoundingBox();H(R,T)};var F=function(R,T){var S=T.getBoundingBox();O(R,T);H(R,T);var V="vvTextAnnotation-"+T.getLayerName().replace(" ","_")+T.getOrdinal();var U=document.getElementById(V);U.style.textAlign="center"};var L=function(S){var W=S.getBoundingBox();var R=W.getX1();var X=W.getY1();var T=W.getWidth();var Y=W.getHeight();if(isNaN(R)||isNaN(X)||isNaN(T)||isNaN(Y)){return false}if((S.getType()===vvDefines.annotationTypes.SANN_EDIT)||(S.getType()===vvDefines.annotationTypes.SANN_CLOUD_EDIT)){if((T<vvDefines.minTextAnnDrawSize)||(Y<vvDefines.minTextAnnDrawSize)){return false}}if(S.getType()===vvDefines.annotationTypes.SANN_POSTIT){var U=W.getWidth();var Z=5;var V=vvConfig.annotationDefaults.stickyMargin+1;if((U-Z-V)<vvDefines.minTextAnnDrawSize){return false}}return true};var C=function(Z,R){var V=R.getBoundingBox();var Y=5;var X=5;if(!L(R)){return }H(Z,R);var S="vvTextAnnotation-"+R.getLayerName().replace(" ","_")+R.getOrdinal();var W=document.getElementById(S);$(W).addClass("vvStickyNote");var U=vvConfig.annotationDefaults.stickyMargin+1;var T=(vvConfig.polygonNubSize)/2;W.style.backgroundColor="#"+R.getFillColorRGB();W.style.width=stripPx(W.style.width)-Y-U-T+"px";W.style.height=stripPx(W.style.height)-X-U-T+"px";W.style.maxWidth=W.style.width;W.style.maxHeight=W.style.height;$(W).children("span").css("left",U+"px");$(W).children("span").css("right",U+"px");$(W).children("span").css("top",U+"px");$(W).children("span").css("bottom",U+"px");$(W).children("span").css("overflow","hidden");$(W).children("span").css("width","");$(W).children("span").css("height","")};var H=function(g,S){var Z=S.getBoundingBox();var X=document.getElementById("innerDiv");var W=document.getElementById("vvAnnotationCanvas");var U="vvTextAnnotation-"+S.getLayerName().replace(" ","_")+S.getOrdinal();var a=document.getElementById(U);if(!a){a=document.createElement("div");X.appendChild(a)}var R=Z.getX1()*S.getWidthRatio();var b=Z.getY1()*S.getHeightRatio();var T=Z.getWidth()*S.getWidthRatio();var f=Z.getHeight()*S.getHeightRatio();if(!L(S)){return }a.id=U;a.style.position="absolute";a.style.top=b+"px";a.style.left=R+"px";a.style.width=T+"px";a.style.height=f+"px";a.style.maxWidth=a.style.width;a.style.maxHeight=a.style.height;a.style.overflow="hidden";a.style.zIndex=99;a.style.color="#"+S.getFontColor();a.style.fontFamily=S.getFontName();if(S.isIDM){if(BrowserDetect.browser==="Explorer"){if(S.getFontName()==="TIMES ROMAN"){a.style.fontFamily="Times New Roman"}}}var e=null;if(S.getPageWidth()>S.getPageHeight()){e=S.getPageWidth()}else{e=S.getPageHeight()}var V=null;V=S.getFontSize(true)*S.getHeightRatio();if(isNaN(V)){return }a.style.fontSize=parseInt(V,10)+"px";if(S.getFontBold()===true){a.style.fontWeight="bold"}if(S.getFontItalic()===true){a.style.fontStyle="italic"}if(S.getFontStrike()===true){a.style.textDecoration="line-through"}if(S.getFontUnderline()===true){a.style.textDecoration="underline"}$(a).addClass("snowbound-text-annotation");var i=document.createElement("span");i.innerHTML=S.getTextString();i.style.position="absolute";i.style.height="100%";i.style.width="100%";a.appendChild(i);if(vvConfig.rotateTextAnnotations===true){$(a).css("-moz-transform","rotate("+rotateAngle+"deg)");$(a).css("-webkit-transform","rotate("+rotateAngle+"deg)");$(a).css("ms-transform","rotate("+rotateAngle+"deg)");$(a).css("transform","rotate("+rotateAngle+"deg)");if((rotateAngle===90)||(rotateAngle===270)){var d=a.style.width;var Y=a.style.height;a.style.width=Y;a.style.height=d;a.style.maxWidth=Y;a.style.maxHeight=d}if((BrowserDetect.browser==="Explorer")&&(BrowserDetect.version<9)){if(BrowserDetect.version<9){switch(rotateAngle){case 0:a.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";break;case 90:a.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";break;case 180:a.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";break;case 270:a.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";break}}}}$(a).bind("contextmenu",myFlexSnap.annPopUpHandler)};var O=function(c,R){var Z=R.getBoundingBox();var V=Z.getX1()*R.getWidthRatio();var b=Z.getY1()*R.getHeightRatio();var T=Z.getX2()*R.getWidthRatio();var a=Z.getY2()*R.getHeightRatio();var W=4*((Math.sqrt(2)-1)/3);var U=(T-V)/2;var S=(a-b)/2;var Y=V+U;var X=b+S;c.save();c.beginPath();c.moveTo(Y,X-S);c.bezierCurveTo(Y+(W*U),X-S,Y+U,X-(W*S),Y+U,X);c.bezierCurveTo(Y+U,X+(W*S),Y+(W*U),X+S,Y,X+S);c.bezierCurveTo(Y-(W*U),X+S,Y-U,X+(W*S),Y-U,X);c.bezierCurveTo(Y-U,X-(W*S),Y-(W*U),X-S,Y,X-S);if(R.getFillColor()){c.strokeStyle=R.getFillColor();if(R.isIDM){c.globalAlpha=0.5}c.fill()}c.closePath();c.stroke();c.restore()};var A=function(f,R,V,Y){var b=R.getLineColor();var U=R.getFillColor();var e=R.getPointArray();if(e){f.beginPath();f.moveTo(e[0].getX()*R.getWidthRatio(),e[0].getY()*R.getHeightRatio());for(var c=1;c<e.length;c+=1){f.lineTo(e[c].getX()*R.getWidthRatio(),e[c].getY()*R.getHeightRatio())}if(U){f.strokeStyle=U;f.fill()}if(Y&&(R.getPreview()!==true)){f.closePath()}f.stroke();if((R.getPreview()===true)&&(R.getType()===vvDefines.annotationTypes.SANN_POLYGON)){f.fillStyle=vvConfig.polygonNubFillColor;f.fillRect(e[0].getX()-(vvConfig.polygonNubSize/2),e[0].getY()-(vvConfig.polygonNubSize/2),vvConfig.polygonNubSize,vvConfig.polygonNubSize)}}if(V===true){var a=e[0].getX()*R.getWidthRatio();var g=e[0].getY()*R.getHeightRatio();var S=e[1].getX()*R.getWidthRatio();var d=e[1].getY()*R.getHeightRatio();var X=J(a,g,S,d);var W=B(a,g,S,d);var Z=W*0.11;if(Z<8){Z=8}if(Z>25){Z=25}var T=30;f.save();f.moveTo(S,d);f.translate(S,d);f.rotate(X);f.rotate(degreesToRadians(T));f.moveTo(0,Z);f.lineTo(0,0);f.moveTo(S,d);f.rotate(degreesToRadians((T*2)*-1));f.moveTo(0,Z);f.lineTo(0,0);f.stroke();f.restore()}};var B=function(U,S,R,T){return Math.sqrt(Math.pow((R-U),2)+(Math.pow((T-S),2)))};var Q=function(U,S,R,T){return(T-S)/(R-U)};var J=function(T,c,S,a){var R=T;var Y=c;var d=T;var X=a;var W=Q(T,c,S,a);var Z=((S-T)*(d-R))+((a-c)*(X-Y));var V=Math.sqrt(Math.pow((S-T),2)+Math.pow((a-c),2));var b=Math.sqrt(Math.pow((d-R),2)+Math.pow((X-Y),2));var U=Math.acos(Z/(V*b));if(isNaN(U)===true){U=90}else{U=radiansToDegrees(U)}if(W>0){U=90-U}if(S>T){if(W>0){U+=90}}else{if(S===T){if(W<0){U=0}else{U=180}}else{if(W>0){U+=270}else{U+=180}}}return degreesToRadians(U)}};