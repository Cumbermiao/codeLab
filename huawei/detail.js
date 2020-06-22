ec.pkg("ec.product");
ec.load("ajax");
ec.load("ec.box", {
    loadType: "lazy"
});
ec.load("ec.index");
ec.load("cloud-zoom", function() {
    setTimeout(function() {
        $("#product-img").CloudZoom()
    }, 200)
});
ec.load("ec.product.gift");
ec.load("ec.product.coupon");
ec.load("rush");
ec.load("deposit");
ec.load("jquery.fixed", function() {
    $(function() {
        $("#pro-tab-all").fixed()
    })
});
ec.ui.countdown2 = function(selector, options) {
    var obj = $(selector), timer = obj.data("countdown"), timeIndex = 0, preTarget, diff, diffMs = options.now.getTime() - (new Date).getTime(), diffSecs = 0, getNext = function() {
        if (timeIndex >= options.times.length)
            return false;
        preTarget = options.times[timeIndex];
        timeIndex++;
        return true
    }, getDiffSec = function() {
        diffSecs = Math.round((ec.util.parseDate(preTarget).getTime() - (new Date).getTime() - diffMs) / 1e3);
        diffSecs = diffSecs <= 0 ? 0 : diffSecs;
        return diffSecs
    }, render = function() {
        diffSecs--;
        if (diffSecs <= 0) {
            diffSecs = 0
        }
        diff = {
            day: Math.floor(diffSecs / (24 * 60 * 60)),
            hour: options.html.indexOf("{#day}") >= 0 ? Math.floor(diffSecs / 60 / 60) % 24 : Math.floor(diffSecs / 60 / 60),
            minute: Math.floor(diffSecs / 60) % 60,
            second: diffSecs % 60
        };
        var html = options.html.replace(/{#day}/g, diff.day > 9 ? diff.day : "0" + diff.day).replace(/{#hours}/g, diff.hour > 9 ? diff.hour : "0" + diff.hour).replace(/{#minutes}/g, diff.minute > 9 ? diff.minute : "0" + diff.minute).replace(/{#seconds}/g, diff.second > 9 ? diff.second : "0" + diff.second);
        obj.html(html);
        return diffSecs <= 0 ? false : true
    };
    if (!options.times) {
        options.times = [options.endTime]
    }
    clearInterval(timer);
    while (getNext()) {
        if (getDiffSec() <= 0)
            continue;
        break
    }
    if (!render()) {
        return
    }
    timer = setInterval(function() {
        if (!render()) {
            if (options.callback) {
                options.callback(options)
            }
            if (!getNext()) {
                clearInterval(timer)
            } else {
                getDiffSec()
            }
        }
    }, 1e3);
    obj.data("countdown", timer)
}
;
var detailContentHeigh = 0;
var productParameterHeight = 0;
var packageServiceHeight = 0;
var customerServiceHeight = 0;
var tit1 = 0;
var tit2 = 0;
var tit3 = 0;
var tit4 = 0;
var oTop = 0;
var clickFlag = false;
var packFlag = false;
var commentFlag = false;
var glaSysTagId = "";
var defaultExtraType = "";
var sysTagLists = [];
var scollFlag = false;
var upDownButton = "";
var finished = true;
ec.product.packageList = {};
ec.product.warranty = {};
var playerArray = [];
$(function() {
    $("#myConsultation").click(function() {
        $("#myConsultation").hide();
        $("#upUserAdvisory").removeClass("hide").addClass("show");
        $("#stopConsultationId").show();
        ec.dapClick(300021501, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            type: 1,
            click: 1
        })
    });
    oTop = $(".product-tab").offset().top;
    $("#pro-tab-feature").click(function() {
        if (!clickFlag) {
            tit1 = $(".tit1").offset().top - 150;
            if (scollFlag) {
                tit1 = $(".tit1").offset().top - 50
            }
            clickFlag = true
        }
        $("#pro-tab-feature").addClass("selected").siblings().removeClass("selected");
        $("body,html").animate({
            scrollTop: tit1 + 75
        }, 0)
    });
    $("#pro-tab-parameter").click(function() {
        if (!clickFlag) {
            tit1 = $(".tit1").offset().top - 150;
            if (scollFlag) {
                tit1 = $(".tit1").offset().top - 50
            }
            clickFlag = true
        }
        $("#pro-tab-parameter").addClass("selected").siblings().removeClass("selected");
        tit2 = tit1 + $("#pro-tab-feature-content").height() + $("#hr60Detail").height();
        $("body,html").animate({
            scrollTop: tit2
        }, 0)
    });
    $("#pro-tab-package-service").click(function() {
        if (!clickFlag) {
            tit1 = $(".tit1").offset().top - 150;
            if (scollFlag) {
                tit1 = $(".tit1").offset().top - 50
            }
            clickFlag = true
        }
        $("#pro-tab-package-service").addClass("selected").siblings().removeClass("selected");
        tit3 = tit1 + $("#pro-tab-feature-content").height() + $("#hr60Detail").height() + $("#productParameter").height() + $("#hr60Detail").height();
        $("body,html").animate({
            scrollTop: tit3
        }, 0)
    });
    $("#pro-tab-evaluate").click(function() {
        if (!clickFlag) {
            tit1 = $(".tit1").offset().top - 150;
            if (scollFlag) {
                tit1 = $(".tit1").offset().top - 50
            }
            clickFlag = true
        }
        $("#pro-tab-evaluate").addClass("selected").siblings().removeClass("selected");
        tit4 = tit1 + $("#pro-tab-feature-content").height() + $("#hr60Detail").height() + $("#productParameter").height() + $("#hr60Detail").height() + $("#packagId").height() + $("#customerServiceLocation").height() + $("#productDetailstips").height();
        $("body,html").animate({
            scrollTop: tit4
        }, 0)
    });
    $(window).scroll(function() {
        var top = $(this).scrollTop() + 1;
        detailContentHeight = $("#pro-tab-feature-content").height() + $("#hr60Detail").height();
        productParameterHeight = $("#productParameter").height() + $("#hr60Detail").height();
        packageServiceHeight = $("#packagId").height();
        customerServiceHeight = $("#customerServiceLocation").height() + $("#productDetailstips").height();
        if (top > oTop) {
            $(".product-tab").addClass("product-tab-top").css({
                position: "fixed",
                top: "0",
                background: "#fff",
                width: "100%",
                "z-index": "100"
            });
            $(".product-tab-btn").css({
                display: "block"
            });
            if (!clickFlag) {
                tit1 = $(".tit1").offset().top - 50
            }
            scollFlag = true
        } else {
            $(".product-tab").css({
                position: "static"
            });
            $(".product-tab-btn").css({
                display: "none"
            });
            $(".product-tab").removeClass("product-tab-top");
            if (!clickFlag) {
                tit1 = $(".tit1").offset().top - 150
            }
            scollFlag = false
        }
        if (top >= tit1 + 75 && top < tit1 + detailContentHeight) {
            $("#pro-tab-feature").addClass("selected").siblings().removeClass("selected")
        }
        if (packFlag == true) {
            if (top >= tit1 + detailContentHeight && top < tit1 + detailContentHeight + productParameterHeight + $("#productDetailstips").height()) {
                $("#pro-tab-parameter").addClass("selected").siblings().removeClass("selected")
            }
        } else {
            if (top >= tit1 + detailContentHeight && top < tit1 + detailContentHeight + productParameterHeight) {
                $("#pro-tab-parameter").addClass("selected").siblings().removeClass("selected")
            }
        }
        if (packFlag == false) {
            if (top >= tit1 + detailContentHeight + productParameterHeight && top < tit1 + detailContentHeight + productParameterHeight + packageServiceHeight + customerServiceHeight) {
                $("#pro-tab-package-service").addClass("selected").siblings().removeClass("selected")
            }
        }
        if (top >= tit1 + detailContentHeight + productParameterHeight + packageServiceHeight + customerServiceHeight) {
            $("#pro-tab-evaluate").addClass("selected").siblings().removeClass("selected")
        }
    });
    function dapProtectShow(type) {
        var dapSecSKUCode = [];
        $("#" + type + " .product-service-listcon").each(function() {
            dapSecSKUCode.push($(this).attr("data-scode"))
        });
        ec.dapClick(300022301, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            index: {
                ucareProtected: 1,
                accidentProtected: 2,
                extendProtected: 3
            }[type],
            secSKUCode: dapSecSKUCode,
            exposure: 1
        })
    }
    $("#j-ucare").mouseenter(function() {
        dapProtectShow("ucareProtected")
    });
    $("#accidentSelect").parent().mouseenter(function() {
        dapProtectShow("accidentProtected")
    });
    $("#extendSelect").parent().mouseenter(function() {
        dapProtectShow("extendProtected")
    })
});
ec.ui.proNumer = function(selector, options) {
    var defaultOpt = {
        max: null,
        min: null,
        showButton: true,
        minusBtn: '<a id="pro-quantity-minus" href="javascript:;">&minus;</a>',
        plusBtn: '<a id="pro-quantity-plus" href="javascript:;">&#43;</a>'
    }
      , thix = $(selector)
      , options = $.extend(defaultOpt, options)
      , checkNumber = function(e) {
        var currentKey = e.which
          , val = parseInt(this.value, 10)
          , thisVal = val < 1 ? 1 : val;
        if ((currentKey < 37 || currentKey > 40) && currentKey != 8 && currentKey != 46) {
            if (thisVal > options.max || thisVal < options.min) {
                e.preventDefault();
                return false
            } else {
                if ((currentKey < 48 || currentKey > 57) && (currentKey < 96 || currentKey > 105) && currentKey != 9) {
                    e.preventDefault();
                    return false
                }
            }
        }
    };
    thix.each(function() {
        var opt = $.extend({}, options)
          , inputObj = $(this).css("ime-mode", "disabled");
        var tmp = inputObj.attr("max");
        if (tmp) {
            options.max = opt.max = parseInt(tmp, 10) || opt.max
        }
        tmp = inputObj.attr("min");
        if (tmp) {
            options.min = opt.min = parseInt(tmp, 10) || opt.min
        }
        if (opt.showButton) {
            var minusBtn = $(opt.minusBtn).click(function() {
                var val = inputObj.val() || 0
                  , thisVal = parseInt(val, 10) - 1;
                if (typeof opt.min == "number" && thisVal < opt.min) {
                    return
                }
                inputObj.valS(thisVal).trigger("blur");
                ec.dapClick(300022201, {
                    productId: ec.product.id,
                    SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                    type: 0,
                    number: 1,
                    click: 1
                })
            })
              , plusBtn = $(opt.plusBtn).click(function() {
                var val = inputObj.val() || 0
                  , thisVal = parseInt(val, 10) + 1;
                if (typeof opt.max == "number" && thisVal > opt.max) {
                    return
                }
                inputObj.valS(thisVal).trigger("blur");
                ec.dapClick(300022201, {
                    productId: ec.product.id,
                    SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                    type: 1,
                    number: 1,
                    click: 1
                })
            });
            if (inputObj.parent().find("p.product-stock-btn").length < 1) {
                var temp = $('<p class="product-stock-btn"></p>').append(plusBtn).append(minusBtn);
                inputObj.after(temp)
            }
            if (this.value <= 1) {
                $("#pro-quantity-minus").removeClass().addClass("disabled")
            } else {
                $("#pro-quantity-minus").removeClass()
            }
        }
        inputObj.data("ovalue", inputObj.val() || 0).keydown(checkNumber).keyup(function() {
            var thisVal = parseInt(this.value || 0);
            if (typeof opt.min == "number" && thisVal < opt.min) {
                this.value = opt.min;
                return
            } else if (typeof opt.max == "number" && thisVal > opt.max) {
                this.value = opt.max;
                return
            }
        }).blur(function() {
            if (this.value <= 1) {
                $("#pro-quantity-minus").removeClass().addClass("disabled")
            } else {
                $("#pro-quantity-minus").removeClass()
            }
            if (typeof opt.onchange === "function") {
                var oldVal = inputObj.data("ovalue")
                  , newVal = this.value || 0
                  , diff = parseInt(newVal, 10) - parseInt(oldVal, 10);
                if (diff == 0)
                    return;
                inputObj.data("ovalue", newVal);
                opt.onchange.call(this, newVal, diff)
            }
        })
    })
}
;
ec.product.prefix = "/product";
ec.product.email = ec.autoEncodeAttr(ec.account.email);
ec.product.mobile = ec.autoEncodeAttr(ec.account.mobile);
var _skuForGetFeature = {};
var _giftBuyItemId = new Array;
(function() {
    var _preSku = null, isFirstIn = true, _skuForGetParement = {}, _skuMap = {}, _skuShowType = {}, _skuAttrId2SkuMap = {}, _skuAttrTypeID = [], _skuAttrName = [], _skuAttrVallue = {}, _skuAttrType2ValueIds = {}, _selectAttrMap = {}, _attrValue2SkuId = {}, _timer, _skuPriority = {}, _skuPointWeigth = {}, _skuPointWeigthDetail = {};
    ec.product.getSkuPointWeight = function(skuCode) {
        return _skuPointWeigth[skuCode]
    }
    ;
    ec.product.setSkuPointWeight = function(skuCode, promotion) {
        _skuPointWeigth[skuCode] = promotion
    }
    ;
    ec.product.getSkuPointWeightDetail = function(skuCode) {
        return _skuPointWeigthDetail[skuCode]
    }
    ;
    ec.product.setSkuPointWeightDetail = function(skuCode, promotion) {
        _skuPointWeigthDetail[skuCode] = promotion
    }
    ;
    _proGallerysMouseOver = function() {
        var thix = $(this);
        thix.parent().parent().addClass("current").siblings().removeClass("current");
        clearTimeout(_timer);
        _timer = setTimeout(function() {
            var img = thix.attr("src");
            $("#product-img").attr("href", img.replace("78_78", "800_800")).find("img").attr("src", img.replace("78_78", "428_428"));
            $("#product-img").CloudZoom()
        }, 150)
    }
    ,
    _updateSelect = function() {
        var selectPara = "";
        $("#pro-skus").find(".selected").each(function() {
            if (!$(this).parents("#giftPackageList").length > 0 && !$(this).parents("#packageList").length > 0) {
                selectPara += $(this).children().children("a").attr("title") + " / "
            }
        });
        selectPara = selectPara.substring(0, selectPara.length - 2);
        selectPara = ec.autoEncodeAttr(selectPara);
        if ($("#packageSelect").length > 0) {
            $("#packageSelect ul li").each(function() {
                if ($(this).hasClass("selected")) {
                    var tempPackage = ec.autoEncodeAttr($(this).attr("data-attrname"));
                    selectPara += '<div id="package-selected" class="inline">&nbsp;/&nbsp;' + tempPackage + "</div>"
                }
            })
        }
        if ($("#giftBuy_dl").length > 0) {
            $("#giftBuy_dl ul li").each(function() {
                if ($(this).hasClass("selected")) {
                    var tempGiftBuy = ec.autoEncodeAttr($(this).find("a").attr("title"));
                    selectPara += '<div id="giftBuy-selected" class="inline">&nbsp;/&nbsp;' + tempGiftBuy + "</div>"
                }
            })
        }
        selectPara += "";
        $("#pro-select-sku").html(selectPara);
        $("#pro-select-sku").parent().show()
    }
    ;
    _upadteSkuPrice = function(sku) {
        if (sku.priceMode != 2) {
            sku.price = parseFloat(sku.price).toFixed(2)
        }
        if (parseFloat(sku.originPrice) != parseFloat(sku.price) && sku.priceMode != 2) {
            $("#pro-price-label").html("抢购价");
            $("#pro-price-label").removeClass("f24").addClass("type");
            $("#pro-price").html("<em>&yen;</em>" + sku.price);
            $("#pro-price-old").html("&yen;&nbsp;" + parseFloat(sku.originPrice).toFixed(2));
            $("#pro-price-label").show();
            $("#pro-price").show();
            $("#pro-price-old").show();
            if (ec.product.productType == 4 || parseInt(sku.buttonMode) == 22 || parseInt(sku.buttonMode) == 25) {
                $("#pro-price-hide").valS(sku.price)
            }
        } else {
            $("#pro-price-old").hide();
            $("#pro-price-label").hide();
            $("#pro-price-old").html("");
            $("#pro-price-label").html("");
            if (sku.price > 0) {
                if (ec.product.productType == 4 || parseInt(sku.buttonMode) == 22 || parseInt(sku.buttonMode) == 25) {
                    $("#pro-price-hide").valS(sku.price);
                    $("#pro-price").html("<em>&yen;</em>" + sku.price);
                    $("#pro-price").show();
                    $("#pro-price-label-deposit").hide();
                    $("#pro-price-deposit").hide();
                    $("#pro-price-label-amount").hide();
                    $("#pro-price-amount").hide();
                    $("#buyProcessIDD").hide();
                    $("#goAddressId").hide()
                } else {
                    $("#pro-price").html("<em>&yen;</em>" + sku.price);
                    $("#pro-price").show()
                }
            } else {
                $("#pro-price").html("");
                $("#pro-price").hide();
                $("#pro-price-label").html("暂无报价");
                if ($("#pro-price-label").hasClass("type")) {
                    $("#pro-price-label").removeClass("type").addClass("f24")
                }
                $("#pro-price-label").show()
            }
        }
        if (sku.priceMode == 2 || sku.price <= 0) {
            $("#pro-price").hide();
            $("#pro-price-old").hide();
            $("#pro-price-label").html("暂无报价");
            $("#pro-price-label").show()
        }
    }
    ;
    _updateSkuInfo = function() {
        var sku = ec.product.getSku(), timerPromWord;
        if (!sku || _preSku == sku) {
            return
        } else {
            ec.product.videoHide();
            if ($("#extendSelect").next().is("a")) {
                $("#extendSelect").next().remove()
            }
            $("#extendSelect").parent().removeClass("selected");
            if ($("#accidentSelect").next().is("a")) {
                $("#accidentSelect").next().remove()
            }
            $("#accidentSelect").parent().removeClass("selected");
            if ($("#ucareSelect").next().is("a")) {
                $("#ucareSelect").next().remove()
            }
            $("#ucareSelect").parent().removeClass("selected")
        }
        $("#package_dl").remove();
        $("#packageList").html("");
        $("#packageCode").val("");
        $("#giftPackageList").html("");
        ec.product.gift.packageGiftMap[sku] == [];
        ec.product.setSkuId = _preSku = sku;
        $("#product-tips").hide();
        $("#pro-quantity-area").show();
        $("#pro-operation").css("visibility", "visible");
        $("#pro-quantity-area").show();
        $("#pro-quantity-area-nochange").hide();
        $("#product-operation").hide();
        ec.diypkg.init();
        if (ec.product.remark.getGbomCode()) {
            glaSysTagId = "";
            ec.product.remark.loadEvaluateScore();
            ec.product.remark.loadEvaluate({
                pageNumber: 1,
                type: 0,
                extraType: defaultExtraType
            }, true);
            $("#j-gbomcode4comments").prop("checked", false)
        }
        sku = _skuMap[sku];
        ec.product.setType(sku.type);
        _upadteSkuPrice(sku);
        var html = [];
        html.push('<a href="javascript:;" class="product-slogan-btn"></a>');
        if ($.trim(sku.timerPromWord).length > 0) {
            if ($.trim(sku.timerPromLink4PC).length > 0) {
                timerPromWord = '<a href="' + sku.timerPromLink4PC + '" target="_blank" class="product-slogan-link">' + sku.timerPromWord + "</a>"
            }
            var _now = ec.product.getSysDate();
            var start = sku.timerPromStarttime;
            var startTime = new Date;
            startTime.setTime(ec.util.parseDate(start));
            var end = sku.timerPromEndtime;
            var endTime = new Date;
            endTime.setTime(ec.util.parseDate(end));
            if (_now - startTime >= 0 && endTime - _now >= 0) {
                html.push(timerPromWord || '<span class="product-slogan-link">' + sku.timerPromWord + "</span>")
            }
        }
        if ($.trim(sku.skuPromWord).length > 0) {
            html.push("<span>" + sku.skuPromWord + "</span>")
        }
        if (0 < html.length) {
            $("#skuPromWord").html(html.join(" "));
            $("#skuPromWord").css("display", "block");
            $(".product-slogan-btn").hide();
            $("#skuPromWord").attr("class", "product-slogan");
            var nowHeight = $("#skuPromWord").height();
            if (nowHeight > 40) {
                $("#skuPromWord").attr("class", "product-slogan product-slogan-hide");
                $(".product-slogan-btn").show();
                $(".product-slogan-btn").mouseenter(function() {
                    if ($("#skuPromWord").hasClass("product-slogan-show")) {
                        $("#skuPromWord").attr("class", "product-slogan product-slogan-hide")
                    } else {
                        $("#skuPromWord").attr("class", "product-slogan product-slogan-show")
                    }
                    ec.product.refreshStyle()
                });
                $("#skuPromWord").mouseleave(function() {
                    if ($("#skuPromWord").hasClass("product-slogan-show")) {
                        $("#skuPromWord").attr("class", "product-slogan product-slogan-hide");
                        ec.product.refreshStyle()
                    }
                })
            }
        } else {
            $("#skuPromWord").html("");
            $("#skuPromWord").hide()
        }
        if (!$.trim(sku.skuPromWord).length > 0 && !$.trim(sku.timerPromWord).length > 0) {
            $("#skuPromWord").hide()
        }
        $("#pro-sku-code").valS(sku.code);
        $("#pro-sku-code2").textS(sku.code);
        $("#pro-name").html(sku.name);
        $("#bread-pro-name").html(sku.name);
        ec.product.inventory.wait(function() {
            ec.product.execute("renderInventory", [ec.product.inventory.haveInventory(sku.id)]);
            ec.product.refreshStyle()
        });
        ec.product.showPosters();
        html = [];
        if (ec.gift2019.choosed && ec.gift2019.choosed[sku.id] && ec.gift2019.choosed[sku.id].length > 0) {
            isShowGifts = true
        } else if (!sku.giftList || sku.giftList.length == 0) {
            isShowGifts = false
        } else {
            isShowGifts = false;
            for (var i = 0; i < sku.giftList.length; i++) {
                if (sku.giftList[i].displayType == 1) {
                    isShowGifts = true;
                    break
                }
            }
        }
        if (isShowGifts) {
            $("#product-info-list-new").show();
            $("#pro-match-gift").show();
            $("#pro-gift-list-select").html(ec.product.gift.ftl(ec.product.getSku()))
        } else {
            if ($("#product-prom-all").find("product-prom-item").length = 1) {
                if ($("#product-prom-all").find("product-prom-item").attr("id") == "pro-match-gift") {
                    $("#product-info-list-new").hide()
                }
            }
            $("#pro-match-gift").hide()
        }
        html = [],
        htmldetail = [];
        if (!sku.promotionLst || sku.promotionLst.length == 0) {
            $(".product-prom-item").eq(0).siblings().remove();
            if ($("#pro-gift-list-select").children().length < 0 || (!sku.giftList || sku.giftList.length < 1) && !ec.gift2019.hasNewGift()) {
                $("#product-info-list-new").hide()
            }
            if ($("#product-prom-all .product-prom-item:visible").length < 1) {
                $("#product-info-list-new").hide()
            }
        } else {
            if ($(".product-prom").parent().hasClass("hide") || $(".product-prom").parent().css("display") == "none") {
                $(".product-prom").parent().removeClass("hide");
                $(".product-prom").parent().css("display", "")
            }
            $(".product-prom-item").eq(0).siblings().remove();
            htmldetail.push(' <div class="product-prom-item clearfix relative hide" id="promBtn">');
            htmldetail.push('<p class="fl">');
            for (var i = 0; i < sku.promotionLst.length; i++) {
                htmldetail.push('<em class="tag">' + sku.promotionLst[i].promoLabel + "</em>");
                html.push('<div class="product-prom-item clearfix" >');
                html.push('<em class="tag">' + sku.promotionLst[i].promoLabel + "</em>");
                html.push('<div class="product-prom-con" title="' + sku.promotionLst[i].ruleDescription + '">');
                html.push(' <span class="product-prom-word">');
                html.push(sku.promotionLst[i].ruleDescription);
                html.push(" </span>");
                if (sku.promotionLst[i].isRealNameAuth == "1") {
                    html.push('<a href="/authmember/accesstoken" target="_blank"  class="product-prom-link">限实名用户参加 ></a>')
                }
                html.push("</div>");
                html.push("</div>")
            }
            htmldetail.push('</p><div class="product-prom-btn" id="show-all-prom"  >展开促销</div></div>');
            $(".product-prom").append(html.join(""));
            $(".product-prom .product-prom-item").hide();
            if ($("#pro-gift-list-select").find("a").length > 0 && isShowGifts) {
                if ($("#product-prom-all").children().length > 4) {
                    for (var i = 0; i < 3; i++) {
                        $(".product-prom-item").eq(i).show()
                    }
                    $(".product-prom").append(htmldetail.join(""));
                    $("#promBtn").show();
                    for (var i = 0; i < 2; i++) {
                        $("#promBtn em").eq(i).hide()
                    }
                } else {
                    $(".product-prom .product-prom-item").show();
                    $(".product-prom").append(htmldetail.join(""))
                }
            } else {
                if ($("#product-prom-all").children().length > 5) {
                    for (var i = 1; i < 4; i++) {
                        $(".product-prom-item").eq(i).show()
                    }
                    $(".product-prom").append(htmldetail.join(""));
                    $("#promBtn").show();
                    for (var i = 0; i < 3; i++) {
                        $("#promBtn em").eq(i).hide()
                    }
                } else {
                    $(".product-prom .product-prom-item").show();
                    $(".product-prom").append(htmldetail.join(""))
                }
            }
            if (!$("#pro-gift-list-select").find("a").length > 0 || !isShowGifts) {
                $("#pro-match-gift").hide()
            }
            if ($("#product-prom-all .product-prom-item:visible").length < 1) {
                $("#product-info-list-new").hide()
            }
        }
        html = [];
        if (ec.product.seCode != ec.product.productSeCode) {
            html.push("<p>已包邮<em></em>由" + ec.product.productshopName + "发货，并提供售后服务</p>")
        } else {
            if (parseFloat(ec.product.deliveryModeValueFreeBase) > 0 && ec.product.productType == 0) {
                if (sku.priceMode != 2) {
                    if (parseFloat(sku.price) >= parseFloat(ec.product.deliveryModeValueFreeBase)) {
                        html.push("<p>已满" + ec.product.deliveryModeValueFreeBase + "元已免运费<em></em>")
                    } else {
                        html.push("<p>满" + ec.product.deliveryModeValueFreeBase + "元即免运费，快去凑单吧<em></em>")
                    }
                }
            } else {
                html.push("<p>")
            }
            html.push("由华为商城负责发货，并提111供售后服务</p>")
        }
        if ($("#pro-select-gift-service") != undefined) {
            $("#pro-select-gift-service").remove();
            _giftBuyItemId = []
        }
        if ($("#giftBuy_dl") != undefined) {
            $("#giftBuy_dl").remove()
        }
        var hasSelectCustomize = false;
        if (sku.buttonMode == "11") {
            hasSelectCustomize = true
        }
        var isPriority = $("#isPriority").val();
        $("#package_dl").remove();
        $("#packageList").html("");
        $("#packageCode").val("");
        ec.product.inventory.wait(function() {
            if (sku.pro_sbomList != null && sku.pro_sbomList != "" && sku.pro_sbomList.length > 0 && ec.product.inventory.haveInventory(sku.id)) {
                var newpackageListHtml = [];
                var pro_sbomList = sku.pro_sbomList;
                for (var s = 0; s < pro_sbomList.length; s++) {
                    if (sku.code == pro_sbomList[s].sbomCode) {
                        var new_packageList = pro_sbomList[s].sbomPackageList;
                        if (new_packageList != null && new_packageList != "" && new_packageList.length > 0) {
                            ec.product.hidebundleView();
                            newpackageListHtml.push('<dl class="product-choose clearfix" id="package_dl"><label>选择套餐</label><div class="product-choose-detail relative" id = "packageSelect"><ul>');
                            newpackageListHtml.push('<li class="selected" data-attrname="单品">');
                            newpackageListHtml.push('<div class="sku">');
                            newpackageListHtml.push('<a href="javascript:;" title="单品" onclick="ec.product.newpackageView(this,null,\'' + ec.encodeForJS(sku.code) + "')\"><p><span>单品</span></p></a></div></li>");
                            for (var p = 0; p < new_packageList.length; p++) {
                                var packageList = new_packageList[p].packageList;
                                newpackageListHtml.push('<li class="" data-attrname="' + new_packageList[p].name + '">');
                                newpackageListHtml.push('<div class="sku"><a href="javascript:;" attr-package=' + new_packageList[p].packageCode + ' title="' + new_packageList[p].name + '" onclick="ec.product.newpackageView(this,\'' + ec.encodeForJS(new_packageList[p].packageCode) + "','" + ec.encodeForJS(sku.code) + "')\"><p><span attr-package=" + new_packageList[p].packageCode + ">" + new_packageList[p].name + "</span></p></a></div></li>")
                            }
                            newpackageListHtml.push('</ul><div id="packageList"></div></dl>')
                        } else {
                            $("#bundlePackage").removeClass("hide")
                        }
                    }
                }
                if ($("#bundlePackage").length > 0) {
                    $("#bundlePackage").after(newpackageListHtml.join(""))
                } else {
                    $("#pro-skus").after(newpackageListHtml.join(""))
                }
            } else {
                $("#packageList").html("")
            }
        });
        if (sku.giftBuyLstX.length > 0) {
            var giftBuyHtml = [];
            giftBuyHtml.push('<dl class="product-choose clearfix" id="giftBuy_dl"><label>增值业务</label><div class="product-choose-detail"><ul>');
            giftBuyHtml.push('<li class="selected" data-attrname="无增值服务">');
            giftBuyHtml.push('<a href="javascript:;" title="无增值服务"><p><span>无增值服务</span></p></a></li>');
            for (var o = 0; o < sku.giftBuyLstX.length; o++) {
                var giftSku = sku.giftBuyLstX[o];
                giftBuyHtml.push('<li class="' + (giftSku.hasInv == "false" || hasSelectCustomize ? "disabled" : "") + '" data-skuid="' + giftSku.id + '">');
                giftBuyHtml.push('<a href="javascript:;" title="' + giftSku.name + '" data-code="' + giftSku.sbomCode + '"interest-price="' + giftSku.price + '" data-pid="' + giftSku.productId + '"><p><span>' + giftSku.name + "</span></p></a></li>")
            }
            giftBuyHtml.push('<a href="javascript:;" target="_blank" class="btn-product-more hidden" id="gift-service-detail-link"><span>了解详情</span>&gt;</a>');
            giftBuyHtml.push("</ul></div></dl>");
            if ($("#conRelItemList").length > 0) {
                $("#conRelItemList").after(giftBuyHtml.join(""))
            } else {
                $("#contractLst").after(giftBuyHtml.join(""))
            }
            var proSelectGiftService = [];
            proSelectGiftService.push('<div id="giftBuy-selected" class="inline">&nbsp;/&nbsp;无增值服务</div>');
            var originVal = $("#pro-select-sku").html();
            $("#pro-select-sku").html(originVal + proSelectGiftService.join(""));
            ec.product.hasRemovedCartButton = false;
            $("#giftBuy_dl li").find("a").each(function(idx) {
                if ($(this).parent().hasClass("disabled")) {
                    return
                }
                $(this).click(function() {
                    $(this).parent().addClass("selected").siblings().removeClass("selected");
                    var giftBuySbomCode = $(this).attr("data-code");
                    if ($("#pro-select-gift-service") != undefined) {
                        $("#pro-select-gift-service").remove()
                    }
                    if (giftBuySbomCode != undefined && giftBuySbomCode.length > 0) {
                        ec.diypkg.hide();
                        _giftBuyItemId = [];
                        _giftBuyItemId.push(giftBuySbomCode);
                        $("#gift-service-detail-link").attr("href", "/product/" + $(this).attr("data-pid") + ".html");
                        $("#gift-service-detail-link").show();
                        $("#giftBuy-selected").remove();
                        var proSelectGiftService = [];
                        proSelectGiftService.push('<div id="giftBuy-selected" class="inline">&nbsp;/&nbsp;' + ec.autoEncodeAttr($(this).attr("title")) + "</div>");
                        var originVal = $("#pro-select-sku").html();
                        $("#pro-select-sku").html(originVal + proSelectGiftService.join(""));
                        if ($("#pro-operation").find("a").length == 2 && $("#pro-operation").find("a").first().find("span").html() == "加入购物车" && !$("#pro-operation").find("a").first().hasClass("disabled")) {
                            $("#pro-operation").find("a").first().remove();
                            $("#pro-operation").attr("data-gift", 2);
                            ec.product.hasRemovedCartButton = true
                        }
                    } else {
                        ec.product.inventory.wait(function() {
                            ec.diypkg.render()
                        });
                        _giftBuyItemId = [];
                        $("#gift-service-detail-link").attr("href", "");
                        $("#gift-service-detail-link").hide();
                        $("#pro-operation").attr("data-gift", 0);
                        if ($("#pro-operation").find("a").length == 1 && !$("#pro-operation").find("a").hasClass("disabled") && ec.product.hasRemovedCartButton) {
                            $("#pro-operation").find("a").before('<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01"><span>加入购物车</span></a>');
                            ec.product.hasRemovedCartButton = false
                        }
                        if ($("#pro-select-gift-service") != undefined) {
                            $("#pro-select-gift-service").remove()
                        }
                        $("#giftBuy-selected").remove();
                        var proSelectGiftService = [];
                        proSelectGiftService.push('<div id="giftBuy-selected" class="inline">&nbsp;/&nbsp;无增值服务' + "</div>");
                        var originVal = $("#pro-select-sku").html();
                        $("#pro-select-sku").html(originVal + proSelectGiftService.join(""))
                    }
                    ec.product.interest.queryFreeDetail();
                    ec.dapClick(300022001, {
                        productId: ec.product.id,
                        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                        line: 1,
                        index: idx + 1,
                        name: $(this).attr("title"),
                        colSKU: $(this).closest("li").attr("data-skuid") || "",
                        click: 1
                    })
                })
            })
        } else {
            if ($("#giftBuy_dl") != undefined) {
                $("#giftBuy_dl").remove()
            }
        }
        if (sku.prolongLst.length > 0) {
            var lst;
            html = [];
            var ExtendedProtectProductId = [];
            var accidentProtectProductId = [];
            var ExtendedProtectName = []
              , ExtendedProtectBrifeName = [];
            var ExtendedProtectId = [];
            var ExtendedProtectNum = 0;
            var ExtendedOption;
            var accidentProtectName = []
              , accidentProtectBrifeName = [];
            var accidentProtectId = [];
            var exetendedPrice = []
              , accidentPrice = []
              , exetendedOrderPrice = []
              , accidentOrderPrice = [];
            var accidentProtectsNum = 0;
            var uCareList = [];
            var extendedProtectCode = [];
            var accidentProtectCode = [];
            for (var i = 0; i < sku.prolongLst.length; i += 1) {
                lst = sku.prolongLst[i];
                if (lst.serviceType == 1) {
                    ExtendedProtectName[ExtendedProtectNum] = lst.name;
                    ExtendedProtectId[ExtendedProtectNum] = lst.id;
                    extendedProtectCode[ExtendedProtectNum] = lst.sbomCode;
                    ExtendedProtectProductId[ExtendedProtectNum] = lst.productId;
                    ExtendedProtectBrifeName[ExtendedProtectNum] = lst.brifeName;
                    exetendedPrice[ExtendedProtectNum] = lst.price;
                    exetendedOrderPrice[ExtendedProtectNum] = lst.orderPrice;
                    ExtendedProtectNum += 1
                }
                if (lst.serviceType == 2) {
                    accidentProtectName[accidentProtectsNum] = lst.name;
                    accidentProtectId[accidentProtectsNum] = lst.id;
                    accidentProtectCode[accidentProtectsNum] = lst.sbomCode;
                    accidentProtectProductId[accidentProtectsNum] = lst.productId;
                    accidentProtectBrifeName[accidentProtectsNum] = lst.brifeName;
                    accidentPrice[accidentProtectsNum] = lst.price;
                    accidentOrderPrice[accidentProtectsNum] = lst.orderPrice;
                    accidentProtectsNum += 1
                }
                if (lst.serviceType == 0) {
                    uCareList.push(lst)
                }
            }
            $("#extendProtected").find("ul").html("");
            $("#accidentProtected").find("ul").html("");
            $("#pro-service").hide();
            $("#extendSelect").attr("skuid", "");
            $("#extendSelect").attr("data-scode", "");
            $("#extendSelect").attr("interest-price", "");
            $("#accidentSelect").attr("skuid", "");
            $("#accidentSelect").attr("data-scode", "");
            $("#accidentSelect").attr("interest-price", "");
            $("#extendSelect").html("");
            $("#accidentSelect").html("");
            $(".product-operation-main").css("min-height", "49px");
            if (ExtendedProtectNum > 0 || accidentProtectsNum > 0 || uCareList.length > 0) {
                $("#pro-service").show()
            } else {
                $("#pro-service").hide()
            }
            if (ExtendedProtectNum > 0) {
                $("#extendProtected").parent().parent().show();
                for (var i = 0; i < ExtendedProtectNum; i++) {
                    if (exetendedPrice[i] < exetendedOrderPrice[i]) {
                        var tempEShow = '&nbsp;<s class="fl">￥' + exetendedOrderPrice[i] + "</s>";
                        var tempEShow1 = '<em class="product-service-icon">优惠</em>'
                    } else {
                        var tempEShow = "";
                        var tempEShow1 = ""
                    }
                    ExtendedOption = $('<li><div id="extendProtected_' + ExtendedProtectId[i] + '" class="fl" onclick="checkedThis(this,\'' + ec.encodeForJS(extendedProtectCode[i]) + "','extendedName','extendProtected');\"><input type=\"checkbox\" name=\"extendedName\">" + '<div id="' + extendedProtectCode[i] + '" class="product-service-listcon" title="' + ec.autoEncodeAttr(ExtendedProtectBrifeName[i]) + '"  skuID="' + ExtendedProtectId[i] + '"data-scode="' + extendedProtectCode[i] + '"data-price="' + exetendedPrice[i] + '">' + tempEShow1 + '<span class="fl max-w">' + ec.autoEncodeAttr(ExtendedProtectBrifeName[i]) + '</span><p class="f1"><span class="fl">&nbsp;￥' + exetendedPrice[i] + "</span>" + tempEShow + '<a target="_blank" onclick="dapProtectedSkuLink(this)" href="/product/' + ExtendedProtectProductId[i] + '.html">详情&nbsp;&gt;</a></p></div>' + "</div></li>");
                    ExtendedOption.appendTo($("#extendProtected").find("ul"))
                }
                var selectExtendName = '<span class="fl max-w">' + ec.autoEncodeAttr(ExtendedProtectBrifeName[0]) + '</span><span class="fl">&nbsp;￥' + exetendedPrice[0] + "</span>";
                $("#extendProtected").parent().before('<a href="javascript:;"  onclick="ec.product.click_function(this)"  class="product-service-btn">' + selectExtendName + "</a>");
                if (ec.util.cookie.get("rushprd_" + ec.product.id) != null) {
                    var skuCodeInCookie = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[0];
                    if (skuCodeInCookie == ec.product.getSkuInfo(ec.product.getSku()).code) {
                        var temp = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[1];
                        if (temp != "") {
                            temp = temp.split(",");
                            for (var i = 0; i < sku.prolongLst.length; i++) {
                                for (var j = 0; j < temp.length; j++) {
                                    if (temp[j] == sku.prolongLst[i].sbomCode) {
                                        if (sku.prolongLst[i].serviceType == 1) {
                                            servicePrdRes[ec.product.getSku()] = servicePrdRes[ec.product.getSku()] || {};
                                            servicePrdRes[ec.product.getSku()]["extendSelect"] = temp[j]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (JSON.stringify(servicePrdRes) != "{}") {
                    if (servicePrdRes[ec.product.getSku()] != undefined) {
                        if (servicePrdRes[ec.product.getSku()].extendSelect != undefined && servicePrdRes[ec.product.getSku()].extendSelect) {
                            for (var m = 0; m < extendedProtectCode.length; m++) {
                                if (servicePrdRes[ec.product.getSku()].extendSelect == extendedProtectCode[m]) {
                                    checkedThis($("#extendProtected_" + ExtendedProtectId[m]), extendedProtectCode[m], "extendedName", "extendProtected")
                                }
                            }
                        }
                    }
                }
            } else {
                $("#extendProtected").parent().parent().hide()
            }
            if (accidentProtectsNum > 0) {
                $("#accidentProtected").parent().parent().show();
                for (var i = 0; i < accidentProtectsNum; i++) {
                    if (accidentPrice[i] < accidentOrderPrice[i]) {
                        var tempAShow = '&nbsp;<s class="fl">￥' + accidentOrderPrice[i] + "</s>";
                        var tempAShow1 = '<em class="product-service-icon">优惠</em>'
                    } else {
                        var tempAShow = "";
                        var tempAShow1 = ""
                    }
                    var accidentOption = $('<li><div id="accidentProtected_' + accidentProtectId[i] + '" class="fl" onclick="checkedThis(this,\'' + ec.encodeForJS(accidentProtectCode[i]) + "','accidentName','accidentProtected');\"><input type=\"checkbox\" name=\"accidentName\" >" + '<div id="' + accidentProtectCode[i] + '" class="product-service-listcon" title="' + ec.autoEncodeAttr(accidentProtectBrifeName[i]) + '"  skuID="' + accidentProtectId[i] + '" data-scode="' + accidentProtectCode[i] + '"data-price="' + accidentPrice[i] + '">' + tempAShow1 + '<span class="fl max-w">' + ec.autoEncodeAttr(accidentProtectBrifeName[i]) + '</span><p class="fl"><span class="fl">&nbsp;￥' + accidentPrice[i] + "</span>" + tempAShow + '<a onclick="dapProtectedSkuLink(this)" target="_blank" href="/product/' + accidentProtectProductId[i] + '.html">详情&nbsp;&gt;</a></p></div>' + "</div></li>");
                    accidentOption.appendTo($("#accidentProtected").find("ul"))
                }
                var selectAccidentName = '<span class="fl max-w">' + ec.autoEncodeAttr(accidentProtectBrifeName[0]) + '</span><span class="fl">&nbsp;￥' + accidentPrice[0] + "</span>";
                $("#accidentProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + selectAccidentName + "</a>");
                if (ec.util.cookie.get("rushprd_" + ec.product.id) != null) {
                    var skuCodeInCookie = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[0];
                    if (skuCodeInCookie == ec.product.getSkuInfo(ec.product.getSku()).code) {
                        var temp = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[1];
                        if (temp != "") {
                            temp = temp.split(",");
                            for (var i = 0; i < sku.prolongLst.length; i++) {
                                for (var j = 0; j < temp.length; j++) {
                                    if (temp[j] == sku.prolongLst[i].sbomCode) {
                                        if (sku.prolongLst[i].serviceType == 2) {
                                            servicePrdRes[ec.product.getSku()] = servicePrdRes[ec.product.getSku()] || {};
                                            servicePrdRes[ec.product.getSku()]["accidentSelect"] = temp[j]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (JSON.stringify(servicePrdRes) != "{}") {
                    if (servicePrdRes[ec.product.getSku()] != undefined) {
                        if (servicePrdRes[ec.product.getSku()].accidentSelect != undefined && servicePrdRes[ec.product.getSku()].accidentSelect) {
                            for (var m = 0; m < accidentProtectCode.length; m++) {
                                if (servicePrdRes[ec.product.getSku()].accidentSelect == accidentProtectCode[m]) {
                                    checkedThis($("#accidentProtected_" + accidentProtectId[m]), accidentProtectCode[m], "accidentName", "accidentProtected")
                                }
                            }
                        }
                    }
                }
            } else {
                $("#accidentProtected").parent().parent().hide()
            }
            if (uCareList.length > 0) {
                $("#ucareProtected").find("ul").html("");
                $("#j-ucare").show();
                for (var i = 0; i < uCareList.length; i++) {
                    if (uCareList[i].price < uCareList[i].orderPrice) {
                        var tempAShow = '&nbsp;<s class="fl">￥' + uCareList[i].orderPrice + "</s>";
                        var tempAShow1 = '<em class="product-service-icon">优惠</em>'
                    } else {
                        var tempAShow = "";
                        var tempAShow1 = ""
                    }
                    var accidentOption = $('<li><div id="ucareProtected_' + uCareList[i].id + '" class="fl" onclick="checkedThis(this,\'' + ec.encodeForJS(uCareList[i].sbomCode) + "','ucareName','ucareProtected');\"><input type=\"checkbox\" name=\"ucareName\" >" + '<div id="' + uCareList[i].sbomCode + '" class="product-service-listcon" title="' + ec.autoEncodeAttr(uCareList[i].brifeName) + '"  skuID="' + uCareList[i].id + '" data-scode="' + uCareList[i].sbomCode + '"data-price="' + uCareList[i].price + '">' + tempAShow1 + '<span class="fl max-w">' + ec.autoEncodeAttr(uCareList[i].brifeName) + '</span><p class="fl"><span class="fl">&nbsp;￥' + uCareList[i].price + "</span>" + tempAShow + '<a target="_blank" onclick="dapProtectedSkuLink(this)" href="/product/' + uCareList[i].productId + '.html">详情&nbsp;&gt;</a></p></div>' + "</div></li>");
                    accidentOption.appendTo($("#ucareProtected").find("ul"))
                }
                var selectAccidentName = '<span class="fl max-w">' + ec.autoEncodeAttr(uCareList[0].brifeName) + '</span><span class="fl">&nbsp;￥' + uCareList[0].price + "</span>";
                $("#ucareProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + selectAccidentName + "</a>");
                $("#j-ucare").mouseover(function() {
                    $("#j-ucare").addClass("hover")
                }).mouseout(function() {
                    $("#j-ucare").removeClass("hover")
                });
                if (ec.util.cookie.get("rushprd_" + ec.product.id) != null) {
                    var skuCodeInCookie = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[0];
                    if (skuCodeInCookie == ec.product.getSkuInfo(ec.product.getSku()).code) {
                        var temp = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[1];
                        if (temp != "") {
                            temp = temp.split(",");
                            for (var i = 0; i < sku.prolongLst.length; i++) {
                                for (var j = 0; j < temp.length; j++) {
                                    if (temp[j] == sku.prolongLst[i].sbomCode) {
                                        if (sku.prolongLst[i].serviceType == 0) {
                                            servicePrdRes[ec.product.getSku()] = servicePrdRes[ec.product.getSku()] || {};
                                            servicePrdRes[ec.product.getSku()]["ucareSelect"] = temp[j]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (JSON.stringify(servicePrdRes) != "{}") {
                    if (servicePrdRes[ec.product.getSku()] != undefined) {
                        if (servicePrdRes[ec.product.getSku()].ucareSelect != undefined && servicePrdRes[ec.product.getSku()].ucareSelect) {
                            for (var m = 0; m < uCareList.length; m++) {
                                if (servicePrdRes[ec.product.getSku()].ucareSelect == uCareList[m].sbomCode) {
                                    checkedThis($("#ucareProtected_" + uCareList[m].id), uCareList[m].sbomCode, "ucareName", "ucareProtected")
                                }
                            }
                        }
                    }
                }
            } else {
                $("#j-ucare").hide()
            }
        } else {
            $("#pro-service").hide();
            $("#extendSelect").attr("skuid", "");
            $("#extendSelect").attr("data-scode", "");
            $("#extendSelect").attr("interest-price", "");
            $("#accidentSelect").attr("skuid", "");
            $("#accidentSelect").attr("data-scode", "");
            $("#accidentSelect").attr("interest-price", "");
            $("#extendSelect").html("");
            $("#accidentSelect").html("");
            $("#extendProtected ul").each(function(index) {
                $(this).html("")
            });
            $("#accidentProtected ul").each(function(index) {
                $(this).html("")
            })
        }
        if (ec.util.cookie.get("rushprd_" + ec.product.id)) {
            var recordSkuCode = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[0];
            setTimeout(function() {
                if (ec.util.cookie.get("rushprd_" + ec.product.id) && recordSkuCode == ec.product.getSkuInfo(ec.product.getSku()).code) {
                    ec.util.cookie.set("rushprd_" + ec.product.id, null, {
                        expires: -1,
                        domain: "vmall.com"
                    })
                }
            }, 200)
        }
        ec.product.showSbomInterest(sku);
        _updateSelect();
        $("#integral").html(sku.integral);
        ec.product.renderGroup(_preSku);
        var sku = ec.product.getSkuInfo(ec.product.getSku());
        if (ec.product.productType == 4 && parseInt(sku.buttonMode) != 22 && parseInt(sku.buttonMode) != 25) {
            ec.product.depositActivity(ec.product.getSku())
        } else if (parseInt(sku.buttonMode) == 22) {
            ec.product.depositNewActivity(ec.product.getSku())
        } else if (parseInt(sku.buttonMode) == 25) {
            ec.product.depositNewActivity(ec.product.getSku())
        } else {
            $("#goAddressId").hide();
            $("#buyProcessIDD").hide();
            ec.product.depositInfoNew = {};
            ec.product.depositInfo = {};
            if ($("#product-deposit-agreement-area")) {
                $("#product-deposit-agreement-area").hide()
            }
            $("#buyProcessIDD").hide();
            $("#pro-price-label-deposit").html("");
            $("#pro-price-label-deposit").show();
            $("#pro-price-deposit").html("");
            $("#pro-price-deposit").show();
            $("#pro-price-label-amount").hide();
            $("#pro-price-amount").hide();
            if ($("#pro-global-parameter").attr("data-skulist-rushbuy")) {
                ec.product.rushbuyActivity()
            }
        }
        packFlag = false;
        upDownButton = "";
        ec.product.getFeature(sku.id);
        ec.product.getParameter(sku.id, sku.code);
        ec.product.getPackageAndService(sku.id);
        ec.product.switchSku();
        $(".product-tab-btn").css({
            display: "none"
        });
        if ($("#packageCode").val() != "") {
            ec.product.hiddenTips()
        } else {
            ec.product.processSupportDisplayDilieryTime(sku)
        }
        ec.product.queryPointWeight(ec.product.setSkuId || ec.product.defaultSku);
        var couponList = ec.product.coupon.sbomCouponList[sku.code];
        if (couponList || couponList == "") {
            $("#couponBtn").show();
            $("#couponTag").html("");
            if (couponList != "") {
                var couponTagHtml = [];
                if (couponList.length > 3) {
                    for (var i = 0; i < couponList.length; i++) {
                        if (i < 3) {
                            if (couponList[i].couponTag != null) {
                                couponTagHtml.push("<span onclick=\"ec.product.coupon.clickBtn('" + ec.encodeForJS(sku.code) + '\')" class="product-ticket">' + couponList[i].couponTag + "</span>")
                            }
                        }
                        if (i >= 3) {
                            break
                        }
                    }
                } else {
                    for (var i = 0; i < couponList.length; i++) {
                        if (couponList[i].couponTag != null) {
                            couponTagHtml.push("<span onclick=\"ec.product.coupon.clickBtn('" + ec.encodeForJS(sku.code) + '\')" class="product-ticket">' + couponList[i].couponTag + "</span>")
                        }
                    }
                }
                couponTagHtml.push(' <a href="javascript:;" id="immediatelyReceiveID" class="product-ticket-link" onclick="ec.product.coupon.clickBtn(\'' + ec.encodeForJS(sku.code) + "')\">立即领取&nbsp;&gt;</a>");
                $("#couponTag").html(couponTagHtml.join(" "))
            } else {
                $("#couponBtn").hide()
            }
        } else {
            ec.product.coupon.loadCoupon(sku.code)
        }
        $("#product-prom-all").on("mouseenter", function() {
            $(".product-prom").addClass("show");
            $("#promBtn").css("display", "none");
            $(".product-prom-item").hide();
            $(".product-prom-item").show();
            if (!isShowGifts) {
                $("#pro-match-gift").hide()
            }
            $("#promBtn").hide()
        }).on("mouseleave", function() {
            if (isShowGifts) {
                if ($("#product-prom-all").children().length < 5) {
                    return
                }
            } else {
                if ($("#product-prom-all").children().length < 6) {
                    return
                }
            }
            $(".product-prom").removeClass("show");
            $("#promBtn").css("display", "block");
            $(".product-prom .product-prom-item").hide();
            if (isShowGifts) {
                for (var i = 0; i < 3; i++) {
                    $(".product-prom-item").eq(i).show()
                }
                $("#promBtn").show();
                for (var i = 0; i < 2; i++) {
                    $("#promBtn em").eq(i).hide()
                }
            } else {
                for (var i = 1; i < 4; i++) {
                    $(".product-prom-item").eq(i).show()
                }
                $("#promBtn").show();
                for (var i = 0; i < 3; i++) {
                    $("#promBtn em").eq(i).hide()
                }
            }
        })
    }
    ;
    ec.product.tabSkuInfo = function(skuId) {
        $("#pro-tab-feature-content-" + skuId + ", #pro-tab-feature-content2-" + skuId + ", #pro-tab-parameter-content-" + skuId + ", #pro-tab-package-content-" + skuId + ", #pro-tab-service-content-" + skuId).show().siblings().hide();
        var sku = ec.product.getSkuInfo(skuId);
        var price = parseFloat(sku.price);
        $("#combList-list-" + skuId).show().siblings().hide();
        if (!$("#combList-list-" + skuId).children().eq(0).hasClass("current")) {
            $("#combList-list-" + skuId).children().eq(0).addClass("current").siblings().removeClass("current")
        }
    }
    ;
    ec.product.addSkuAttr = function(skuId, attrTypeId, attrName, attrId, attrValue) {
        var sku = _skuMap[skuId];
        if (!sku) {
            _skuMap[skuId] = {
                attrIds: [attrId]
            }
        } else {
            sku.attrIds.push(attrId)
        }
        _skuAttrId2SkuMap[attrId] = skuId;
        var attrV = _skuAttrVallue[attrName];
        if (!attrV) {
            _skuAttrName.push(attrName);
            _skuAttrTypeID.push(attrTypeId);
            _skuAttrVallue[attrName] = [attrValue]
        } else if (attrV.indexOf(attrValue) == -1) {
            attrV.push(attrValue)
        }
        var ids = _skuAttrType2ValueIds[attrTypeId + "-" + attrValue];
        if (!ids) {
            _skuAttrType2ValueIds[attrTypeId + "-" + attrValue] = [attrId]
        } else {
            ids.push(attrId)
        }
        if (!_attrValue2SkuId[attrValue]) {
            _attrValue2SkuId[attrValue] = []
        }
        _attrValue2SkuId[attrValue].push(skuId)
    }
    ;
    ec.product.setSku = function(skuId, options) {
        options = options || {};
        options.id = skuId;
        $.extend(_skuMap[skuId] || (_skuMap[skuId] = {}), options)
    }
    ;
    ec.product.getAllSku = function() {
        return _skuMap
    }
    ;
    ec.product.getSku = function() {
        var sku;
        $.each(_selectAttrMap, function() {
            if (!sku) {
                sku = this;
                return
            }
            var _t = this
              , newSku = [];
            for (var i = 0; i < sku.length; i++) {
                for (var j = 0; j < _t.length; j++) {
                    if (sku[i] == _t[j]) {
                        newSku.push(sku[i])
                    }
                }
            }
            sku = newSku
        });
        if (!sku || sku.length != 1) {
            return _preSku || ec.product.defaultSku
        }
        return sku[0]
    }
    ;
    ec.product.getSkuInfo = function(skuId) {
        return _skuMap[skuId]
    }
    ;
    ec.product.setSkuForParement = function(skuId) {
        _skuForGetParement[skuId] = skuId
    }
    ;
    ec.product.getSkuForParement = function(skuId) {
        return _skuForGetParement[skuId]
    }
    ;
    ec.product.setSkuForFeature = function(skuId) {
        _skuForGetFeature[skuId] = skuId
    }
    ;
    ec.product.getSkuForFeature = function(skuId) {
        return _skuForGetFeature[skuId]
    }
    ;
    ec.product.setSkuShowType = function(attrTypeId, showType) {
        _skuShowType[attrTypeId] = showType
    }
    ;
    ec.product.setSkuPriority = function(skuId) {
        _skuPriority[skuId] = true
    }
    ;
    ec.product.getSkuPriority = function(skuId) {
        return _skuPriority[skuId]
    }
    ;
    ec.product.selectBySku = function(skuId) {
        var sku = _skuMap[skuId];
        if (!sku || !sku.attrIds) {
            _upadteSkuPrice(sku);
            if (ec.product.productType == 4) {
                ec.product.depositActivity(skuId)
            } else {
                $("#goAddressId").hide();
                if ($("#pro-global-parameter").attr("data-skulist-rushbuy")) {
                    ec.product.rushbuyActivity()
                }
            }
            ec.product.showPosters();
            ec.product.refreshStyle();
            return
        }
        $("#pro-skus").find(".attr" + sku.attrIds.join(",.attr")).children(".sku").trigger("click")
    }
    ;
    ec.product.queryPointWeight = function(skuId) {
        var sku = _skuMap[skuId];
        if (sku || sku.code) {
            if (ec.product.productType == 1 || ec.product.productType == 2 || ec.product.productType == 5 || ec.product.productType == 6) {
                return
            }
            if (ec.product.seCode != "VMALL-HUAWEIDEVICE") {
                return
            }
            if (ec.product.getSkuPointWeight(sku.code) != undefined) {
                $("#promBtn p").append(ec.product.getSkuPointWeightDetail(sku.code));
                var htmlproBtn = [];
                htmlproBtn.push('<div class="product-prom-item clearfix relative" id="promBtn">');
                htmlproBtn.push($("#promBtn").html());
                htmlproBtn.push("</div>");
                $("#promBtn").remove();
                $(".product-prom").append(ec.product.getSkuPointWeight(sku.code));
                $(".product-prom .product-prom-item").hide();
                if ($("#pro-gift-list-select").find("a").length > 0 && isShowGifts) {
                    if ($("#product-prom-all").children().length > 4) {
                        for (var i = 0; i < 3; i++) {
                            $(".product-prom-item").eq(i).show()
                        }
                        $(".product-prom").append(htmlproBtn.join(""));
                        $("#promBtn").show();
                        for (var i = 0; i < 2; i++) {
                            $("#promBtn em").eq(i).hide()
                        }
                    } else {
                        $(".product-prom .product-prom-item").show()
                    }
                } else {
                    if ($("#product-prom-all").children().length > 5) {
                        for (var i = 1; i < 4; i++) {
                            $(".product-prom-item").eq(i).show()
                        }
                        $(".product-prom").append(htmlproBtn.join(""));
                        $("#promBtn").show();
                        for (var i = 0; i < 3; i++) {
                            $("#promBtn em").eq(i).hide()
                        }
                    } else {
                        $(".product-prom .product-prom-item").show()
                    }
                }
                if ($(".product-prom").parent().hasClass("hide") || $(".product-prom").parent().css("display") == "none") {
                    $(".product-prom").parent().removeClass("hide");
                    $(".product-prom").parent().css("display", "")
                }
                if (!$("#pro-gift-list-select").find("a").length > 0 || !isShowGifts) {
                    $("#pro-match-gift").hide()
                }
                if ($("#pro-promotions-list").parent().parent().hasClass("hide")) {
                    $("#pro-promotions-list").parent().parent().removeClass("hide")
                }
                ec.product.refreshStyle()
            } else {
                $.ajax({
                    url: openApiDomain + "/point/queryPointWeight.json?skuCodes=[" + sku.code + "]",
                    dataType: "json",
                    timeout: 1e4,
                    success: function(json) {
                        var pointWeight = 1;
                        if (json.resultCode == "200000") {
                            json.pointWeightMap = json.data;
                            if (json.pointWeightMap != null) {
                                for (var k in json.pointWeightMap) {
                                    if (json.pointWeightMap[k] != null) {
                                        pointWeight = json.pointWeightMap[k]
                                    }
                                }
                            }
                        }
                        var html = []
                          , htmldetail = [];
                        if (pointWeight == 0) {
                            return
                        } else if (pointWeight == 1) {
                            htmldetail.push('<em class="tag">赠送积分</em>');
                            html.push('<div class="product-prom-item clearfix" >');
                            html.push('<em class="tag">赠送积分</em>');
                            html.push('<div class="product-prom-con">');
                            html.push("购买即赠商城积分，积分可抵现~");
                            html.push("</div>");
                            html.push("</div>")
                        } else if (pointWeight > 1) {
                            htmldetail.push('<em class="tag">积分翻倍</em>');
                            html.push('<div class="product-prom-item clearfix" >');
                            html.push('<em class="tag">积分翻倍</em>');
                            html.push('<div class="product-prom-con">');
                            html.push("活动赠送翻倍积分，积分可抵现~");
                            html.push("</div>");
                            html.push("</div>")
                        }
                        $("#promBtn p").append(htmldetail.join(""));
                        var htmlproBtn = [];
                        htmlproBtn.push('<div class="product-prom-item clearfix relative" id="promBtn">');
                        htmlproBtn.push($("#promBtn").html());
                        htmlproBtn.push("</div>");
                        $("#promBtn").remove();
                        $(".product-prom").append(html.join(""));
                        $(".product-prom .product-prom-item").hide();
                        if ($("#pro-gift-list-select").find("a").length > 0 && isShowGifts) {
                            if ($("#product-prom-all").children().length > 4) {
                                for (var i = 0; i < 3; i++) {
                                    $(".product-prom-item").eq(i).show()
                                }
                                $(".product-prom").append(htmlproBtn.join(""));
                                $("#promBtn").show();
                                for (var i = 0; i < 2; i++) {
                                    $("#promBtn em").eq(i).hide()
                                }
                            } else {
                                $(".product-prom .product-prom-item").show()
                            }
                        } else {
                            if ($("#product-prom-all").children().length > 5) {
                                for (var i = 1; i < 4; i++) {
                                    $(".product-prom-item").eq(i).show()
                                }
                                $(".product-prom").append(htmlproBtn.join(""));
                                $("#promBtn").show();
                                for (var i = 0; i < 3; i++) {
                                    $("#promBtn em").eq(i).hide()
                                }
                            } else {
                                $(".product-prom .product-prom-item").show()
                            }
                        }
                        if ($(".product-prom").parent().hasClass("hide") || $(".product-prom").parent().css("display") == "none") {
                            $(".product-prom").parent().removeClass("hide");
                            $(".product-prom").parent().css("display", "")
                        }
                        if (!$("#pro-gift-list-select").find("a").length > 0 || !isShowGifts) {
                            $("#pro-match-gift").hide()
                        }
                        ec.product.setSkuPointWeight(sku.code, html.join(" "));
                        ec.product.setSkuPointWeightDetail(sku.code, htmldetail.join(" "));
                        ec.product.refreshStyle()
                    }
                })
            }
        }
    }
    ;
    ec.product.refreshStyle = function() {
        ec.product.gift.updateOperationBtns();
        var buyBox = $(".product-operation-main");
        var buyBoxHeight = buyBox.height();
        $(".product-property").css("min-height", 536 - buyBoxHeight + "px").css("height", "auto").css("padding-bottom", buyBoxHeight + 30 + "px");
        $(".product-operation-main").removeClass("product-operation-location").addClass("product-operation-location");
        function runRefreshStyle() {
            ec.product.refreshStyle()
        }
        $(".product-choose li").unbind("click").click(runRefreshStyle);
        $(".product-service-detail input").unbind("change").change(runRefreshStyle)
    }
    ;
    ec.ready(function() {
        ec.product.hiddenTips();
        $(".product-tab-btn").css({
            display: "none"
        });
        var html = [], attrTypeId, attrName, attrValueIds, showText;
        for (var i = 0; i < _skuAttrName.length; i++) {
            attrTypeId = _skuAttrTypeID[i];
            showText = _skuShowType[attrTypeId] == "2";
            attrName = _skuAttrName[i];
            var hml = '<dl class="product-choose clearfix ';
            if (showText) {
                if (attrName.transHtmlAttribute() == "套餐" || attrName.transHtmlAttribute() == "类型") {
                    hml += '" id = "bundlePackage" >'
                } else {
                    hml += '">'
                }
            } else {
                if (attrName.transHtmlAttribute() == "套餐" || attrName.transHtmlAttribute() == "类型") {
                    hml += ' product-choosepic" id = "bundlePackage" >'
                } else {
                    hml += ' product-choosepic">'
                }
            }
            hml += "<label>选择" + attrName + '</label><div class="product-choose-detail ';
            if (attrName.transHtmlAttribute() == "套餐" || attrName.transHtmlAttribute() == "类型") {
                hml += ' relative" id = "bundlePackageSelect" >'
            } else {
                hml += '">'
            }
            hml += "<ul>";
            html.push(hml);
            var values = _skuAttrVallue[attrName];
            for (var j = 0; j < values.length; j++) {
                attrValueIds = _skuAttrType2ValueIds[attrTypeId + "-" + values[j]];
                html.push('<li class=" attr' + attrValueIds.join(" attr") + '" data-attrName="' + attrName + '" data-attrCode="' + attrTypeId + '" data-attrId="' + attrValueIds.join(",") + '" data-skuId="' + _attrValue2SkuId[values[j]].join(",") + '"><div class="sku"><a  href="javascript:;" title="' + values[j] + '">');
                if (showText) {
                    html.push("<p><span>");
                    html.push(values[j]);
                    html.push("</span></p></a>")
                } else {
                    var sku = _skuMap[_skuAttrId2SkuMap[attrValueIds[0]]];
                    html.push('<img src="' + ec.mediaPath + sku.photoPath + "40_40_" + sku.photoName + '" alt="' + values[j] + '"/>');
                    html.push("<p><span>" + values[j] + "</span></p></a>")
                }
            }
            html.push("</ol></dd></dl>")
        }
        var skuObj = $(html.join(""));
        var _checkDisabledSkuAttrValue = function(prevPrdSkuIds, nextAttrSkuDom) {
            var _strPrdSkuIds = nextAttrSkuDom.attr("data-skuId");
            if (nextAttrSkuDom.parents("#packageSelect").length > 0) {
                return true
            }
            if (nextAttrSkuDom.parents("#giftPackageList").length > 0) {
                return true
            }
            var result = false;
            for (var i = 0, length = prevPrdSkuIds.length; i < length; i++) {
                if (_strPrdSkuIds.indexOf(prevPrdSkuIds[i] + "") > -1) {
                    result = true;
                    break
                }
            }
            return result
        };
        var _listenerAttrSkuTrigger = function(skuObj) {
            var _interSectionPrdList = [];
            var _first = true;
            var _skuId = null;
            $.each(skuObj.find("li.selected").not($("#package_dl").find("li.selected")), function() {
                var $li = $(this);
                var key = $li.find("a").attr("title");
                var skey = ec.autoEncodeAttr(key);
                var nextAttrSkuDom;
                if ($li.closest("dl").next().attr("id") == "package_dl") {
                    nextAttrSkuDom = $li.closest("dl").next().next().find("li").not($("#giftPackageList").find("li"))
                } else {
                    nextAttrSkuDom = $li.closest("dl").next().find("li").not($("#giftPackageList").find("li"))
                }
                if (_first) {
                    _interSectionPrdList = _attrValue2SkuId[key] || _attrValue2SkuId[skey];
                    $.each(nextAttrSkuDom, function() {
                        var current = $(this);
                        if (!_checkDisabledSkuAttrValue(_interSectionPrdList, current)) {
                            current.addClass("disabled").removeClass("selected")
                        } else {
                            current.removeClass("disabled")
                        }
                    });
                    _first = false;
                    _skuId = _preSku || ec.product.defaultSku;
                    return
                }
                var _arrTempSkuIds = [];
                var _tempList = _attrValue2SkuId[key] || _attrValue2SkuId[skey];
                for (var i = 0; i < _interSectionPrdList.length; i++) {
                    for (var j = 0; j < _tempList.length; j++) {
                        if (_interSectionPrdList[i] == _tempList[j]) {
                            _arrTempSkuIds.push(_interSectionPrdList[i])
                        }
                    }
                }
                _interSectionPrdList = _arrTempSkuIds;
                if (_interSectionPrdList.length != 1) {
                    _skuId = _preSku || ec.product.defaultSku;
                    if (_interSectionPrdList.length > 1) {
                        $.each(nextAttrSkuDom, function() {
                            var current = $(this);
                            if (!_checkDisabledSkuAttrValue(_interSectionPrdList, current)) {
                                current.addClass("disabled").removeClass("selected")
                            } else {
                                current.removeClass("disabled")
                            }
                        })
                    }
                } else {
                    $.each(nextAttrSkuDom, function() {
                        var current = $(this);
                        if (!_checkDisabledSkuAttrValue(_interSectionPrdList, current)) {
                            current.addClass("disabled").removeClass("selected")
                        } else {
                            current.removeClass("disabled")
                        }
                    });
                    _skuId = _interSectionPrdList[0]
                }
            });
            return _skuId
        };
        skuObj.find(".sku").click(function() {
            var thix = $(this).parent();
            if (thix.hasClass("disabled"))
                return false;
            var attrIds = thix.attr("data-attrId").split(",")
              , attrName = thix.attr("data-attrName")
              , skuIds = [];
            for (var i = 0; i < attrIds.length; i++) {
                skuIds.push(_skuAttrId2SkuMap[attrIds[i]])
            }
            _selectAttrMap[attrName] = skuIds;
            thix.addClass("selected").siblings().removeClass("selected");
            $("#layoutRelative p a").each(function() {
                var tab = $(this).css("display");
                if (tab != "none") {
                    $(this).addClass("selected").siblings().removeClass("selected");
                    return false
                }
            });
            var _skuId = _listenerAttrSkuTrigger(skuObj);
            var firstLi = null;
            var interestAllow = "";
            var flag = true;
            $.each(skuObj.find("ul"), function() {
                var $ol = $(this);
                if ($ol.parents("#giftPackageList").length > 0) {
                    return true
                }
                if ($ol.parents("#packageList").length > 0) {
                    return true
                }
                if (1 != $ol.find("li.selected").length) {
                    firstLi = $ol.find("li").not($ol.find("li.disabled")).first();
                    if (firstLi.length >= 1) {
                        flag = false;
                        return false
                    }
                }
                if ($ol.parents("#giftBuy_dl").text() == "增值业务") {
                    ec.product.interest.queryFreeDetail()
                }
            });
            if (flag) {
                sku = _skuMap[_skuId];
                _updateSkuInfo();
                _updateSelect();
                isFirstIn = false;
                ec.product.refreshStyle();
                ec.product.gift.showGiftPackageView($("#bundlePackageSelect").find("li.selected").find("a"), true)
            } else if (firstLi) {
                if (!isFirstIn) {
                    $(firstLi).find(".sku").trigger("click")
                }
            }
        });
        if ($(".hot-area").find("li").size() == 0) {
            $(".hot-area").hide();
            $("#pro-seg-hot").hide()
        }
        $("#pro-skus").html(skuObj);
        var giftShowHtml = [];
        giftShowHtml.push('<div id="giftPackageList" class="hide"></div>');
        $("#bundlePackageSelect").append(giftShowHtml.join(""));
        html = [],
        skuId = ec.product.getSku();
        sku = ec.product.getSkuInfo(skuId);
        if (ec.product.seCode != ec.product.productSeCode) {
            html.push("已包邮<em></em>" + ec.product.productshopName + "发货，并提供售后服务")
        } else {
            if (parseFloat(ec.product.deliveryModeValueFreeBase) > 0 && ec.product.productType == 0) {
                if (sku.priceMode != 2) {
                    if (parseFloat(sku.price) >= parseFloat(ec.product.deliveryModeValueFreeBase)) {
                        html.push("已满" + ec.product.deliveryModeValueFreeBase + "元已免运费<em></em>")
                    } else {
                        html.push("满" + ec.product.deliveryModeValueFreeBase + "元即免运费，快去凑单吧<em></em>")
                    }
                }
            }
            html.push("由华为商城负责发货，并提供售后服务")
        }
        $("#service-description").html(html.join(" "));
        if (skuObj.find(".sku").length == 0) {
            var sku = ec.product.getSku();
            packFlag = false;
            sku = ec.product.getSkuInfo(sku);
            upDownButton = "";
            ec.product.getFeature(sku.id);
            ec.product.getParameter(sku.id, sku.code);
            ec.product.getPackageAndService(sku.id);
            ec.product.processSupportDisplayDilieryTime(sku)
        }
        ec.product.selectBySku(ec.product.setSkuId || ec.product.defaultSku);
        var skuIdForGift = ec.product.setSkuId || ec.product.defaultSku, skuForPromotion, showPromotion = false, showGifts = false;
        skuForPromotion = ec.product.getSkuInfo(skuIdForGift);
        if (!skuForPromotion.promotionLst || skuForPromotion.promotionLst.length == 0) {
            showPromotion = false
        } else {
            showPromotion = true
        }
        if (!skuForPromotion.giftList || skuForPromotion.giftList.length == 0) {
            showGifts = false
        } else {
            isShowGifts = false;
            for (var i = 0; i < skuForPromotion.giftList.length; i++) {
                if (skuForPromotion.giftList[i].displayType == 1) {
                    isShowGifts = true;
                    break
                }
            }
        }
        if (!showPromotion) {
            $("#pro-promotions-list").html("");
            $("#pro-promotions-list").hide()
        }
        if (showGifts) {
            $("#product-info-list-new").show();
            $("#pro-match-gift").show();
            $("#pro-gift-list-select").html(ec.product.gift.ftl(ec.product.getSku()))
        } else {
            if ($("#product-prom-all").find("product-prom-item").length = 1) {
                if ($("#product-prom-all").find("product-prom-item").attr("id") == "pro-match-gift") {
                    $("#product-info-list-new").hide()
                }
            }
            $("#pro-gift").hide()
        }
        $("#pro-gallerys").find("img").mouseover(_proGallerysMouseOver);
        $("#pro-gallerys li").each(function(idx, obj) {
            $(obj).on("click", function() {
                ec.dapClick(300021101, {
                    productId: ec.product.id,
                    SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                    type: 1,
                    location: idx + 1,
                    click: 1
                })
            })
        });
        var paras = getUrlParaMap4CartBinding();
        var isSuccess = paras["isSuccess"];
        if (null != isSuccess && "0" == isSuccess) {
            bindCartResult("ec-binding-phone")
        }
        $("#address").hover(function() {
            var sku = ec.product.getSku();
            sku = ec.product.getSkuInfo(sku);
            ec.product.processAddress(sku)
        }, function() {});
        ec.product.gift.showGiftPackageView($("#bundlePackageSelect").find("li.selected").find("a"), false);
        setTimeout(function() {
            ec.diypkg.init()
        }, 500)
    })
}
)();
ec.product.disableAddCartButtons = function() {
    $("#pro-operation a.product-button01").each(function() {
        $(this).removeClass("product-button01").addClass("product-button01 disabled");
        this.backup = this.onclick;
        this.onclick = ""
    });
    $("#pro-operation a.product-button02").each(function() {
        $(this).removeClass("product-button02").addClass("product-button02 disabled");
        this.backup = this.onclick;
        this.onclick = ""
    });
    $("#pro-operation a.button-book-2").each(function() {
        $(this).removeClass("pro-button01 button-style-2").addClass("pro-button01 button-style-disabled-2");
        this.backup = this.onclick;
        this.onclick = ""
    });
    $("a.button-add-cart-2, a.button-add-cart-3").each(function() {
        $(this).removeClass("pro-button01 button-style-1").addClass("pro-button01 button-style-disabled-2");
        this.backup = this.onclick;
        this.onclick = ""
    })
}
;
ec.product.enableAddCartButtons = function() {
    $("#pro-operation a.product-button01").each(function() {
        $(this).removeClass("product-button01 disabled").addClass("product-button01").css("background-position-y", "8px");
        this.onclick = this.backup;
        this.backup = ""
    });
    $("#pro-operation a.product-button02").each(function() {
        $(this).removeClass("product-button02 disabled").addClass("product-button02").css("background-position-y", "8px");
        this.onclick = this.backup;
        this.backup = ""
    });
    $("#pro-operation a.button-book-2").each(function() {
        $(this).removeClass("pro-button01 button-style-disabled-2").addClass("pro-button01 button-style-2");
        this.onclick = this.backup;
        this.backup = ""
    });
    $("a.button-add-cart-2, a.button-add-cart-3").each(function() {
        $(this).removeClass("pro-button01 button-style-disabled-2").addClass("pro-button01 button-style-1");
        this.onclick = this.backup;
        this.backup = ""
    })
}
;
ec.product.addCart = function() {
    var buyNumber = parseInt($("#pro-quantity").val() || 1)
      , cartNUmber = parseInt($("#header-cart-total").html());
    ec.minicart.setNum(cartNUmber + buyNumber);
    var skusListArr = $("#pro-skus").find("dl").not($("#giftPackageList").find("dl")).not($("#packageList").find("dl"));
    for (p = 0; p < skusListArr.length; p++) {
        var flag = false;
        var skuInfoArr = skusListArr.get(p);
        $(skuInfoArr).children(".product-choose-detail").children("ul").find("li").each(function(index) {
            if ($(this).parents("#giftPackageList").length > 0 || $(this).parents("#packageList").length > 0) {
                return true
            }
            if ($(this).hasClass("selected")) {
                flag = true;
                return
            }
        });
        if (!flag) {
            alert("请选择需要购买的类型");
            return false
        }
    }
    ec.product.disableAddCartButtons();
    var temp = ec.product.finalGift();
    var paras = {
        salePortal: 1,
        saleChannel: 1001,
        needResultset: 0,
        cartjson: temp.cartjson
    };
    ec.cart.add(paras, {
        successFunction: function(json) {
            if (json.resultCode == 2e5) {
                var cartText = $("#pro-name").text() + "成功加入购物车!";
                var computeRes = ec.product.compute($("#pro-add-success-mask"), cartText);
                if (computeRes.h > 27) {
                    $("#cart-tips").find("p").parent().removeClass("box-right-1").addClass("box-right-2")
                } else {
                    $("#cart-tips").find("p").parent().removeClass("box-right-2").addClass("box-right-1")
                }
                $("#cart-tips").find("p").textS(cartText);
                $(".pro-add-success-total").hide();
                ec.minicart.setNum(json.cartNumber);
                var box = new ec.box($("#cart-tips").html(),{
                    boxclass: "ol_box_4",
                    showButton: false
                }).open()
            }
            ec.product.enableAddCartButtons()
        },
        errorFunction: function(json) {
            var box = new ec.box('<div class="box-errors-1"><span>' + json.msg + "</span></div>",{
                boxclass: "ol_box_4",
                showButton: true
            }).open();
            ec.product.enableAddCartButtons()
        }
    });
    ec.product.clickHide = function(id) {
        $(document).click(function() {
            $("#" + id).hide()
        });
        $("#" + id).click(function(event) {
            event.stopPropagation()
        })
    }
    ;
    ec.product.clickHide("cart-tips")
}
;
ec.product.compute = function(dom, val) {
    dom.textS(val);
    return {
        w: dom[0].offsetWidth,
        h: dom[0].offsetHeight
    }
}
;
ec.product.finalGift = function(style) {
    ec.product.packageGetSkuCode();
    var temp = "";
    var cartjson = "";
    var skuId = ec.product.getSku();
    var type;
    var skuCode = $("#pro-sku-code").val();
    var buyNum = parseInt($("#pro-quantity").val() || 1);
    var extendServiceSkuID = $("#extendSelect").attr("data-scode");
    var accidentServiceSkuID = $("#accidentSelect").attr("data-scode");
    var ucareServiceSkuID = $("#ucareSelect").attr("data-scode");
    var finalGift = ec.product.gift.finalMainSbomGiftMap[skuId];
    var otherPrdList = [];
    var attrs = "";
    if ($("#packageCode").val() != "") {
        type = "P";
        attrs = {
            package_code: $("#packageCode").val()
        };
        var packagelist = $("#packageListCode").val().split(",");
        for (var i = 0; i < packagelist.length; i++) {
            cartTemp = {
                itemCode: packagelist[i],
                itemType: "P",
                qty: buyNum
            };
            otherPrdList.push(cartTemp)
        }
    } else {
        type = "S0"
    }
    if (finalGift) {
        for (var key in finalGift) {
            cartTemp = {
                itemCode: finalGift[key].giftSkuCode,
                itemType: "G",
                qty: buyNum * (finalGift[key].qty || 1)
            };
            if (finalGift[key].group) {
                cartTemp.attrs = {
                    g_group: finalGift[key].group
                }
            }
            otherPrdList.push(cartTemp)
        }
        if (ec.product.gift.packageGiftMap[skuId]) {
            for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuId].length; giftKey++) {
                cartTemp = {
                    itemCode: ec.product.gift.packageGiftMap[skuId][giftKey],
                    itemType: "G",
                    qty: buyNum
                };
                otherPrdList.push(cartTemp)
            }
        }
        if (extendServiceSkuID.length > 0 && accidentServiceSkuID.length > 0) {
            otherPrdList.push({
                itemCode: extendServiceSkuID,
                itemType: "S1",
                qty: buyNum
            });
            otherPrdList.push({
                itemCode: accidentServiceSkuID,
                itemType: "S6",
                qty: buyNum
            });
            cartjson = JSON.stringify({
                itemCode: skuCode,
                itemType: type,
                qty: buyNum,
                subs: otherPrdList,
                attrs: attrs
            })
        } else {
            if (extendServiceSkuID.length > 0) {
                otherPrdList.push({
                    itemCode: extendServiceSkuID,
                    itemType: "S1",
                    qty: buyNum
                });
                cartjson = JSON.stringify({
                    itemCode: skuCode,
                    itemType: type,
                    qty: buyNum,
                    subs: otherPrdList,
                    attrs: attrs
                })
            } else if (accidentServiceSkuID.length > 0) {
                otherPrdList.push({
                    itemCode: accidentServiceSkuID,
                    itemType: "S6",
                    qty: buyNum
                });
                cartjson = JSON.stringify({
                    itemCode: skuCode,
                    itemType: type,
                    qty: buyNum,
                    subs: otherPrdList,
                    attrs: attrs
                })
            } else {
                cartjson = JSON.stringify({
                    itemCode: skuCode,
                    itemType: type,
                    qty: buyNum,
                    subs: otherPrdList,
                    attrs: attrs
                })
            }
        }
    } else {
        if (ec.product.gift.packageGiftMap[skuId]) {
            for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuId].length; giftKey++) {
                cartTemp = {
                    itemCode: ec.product.gift.packageGiftMap[skuId][giftKey],
                    itemType: "G",
                    qty: buyNum
                };
                otherPrdList.push(cartTemp)
            }
        }
        if (extendServiceSkuID.length > 0 && accidentServiceSkuID.length > 0) {
            otherPrdList.push({
                itemCode: extendServiceSkuID,
                itemType: "S1",
                qty: buyNum
            });
            otherPrdList.push({
                itemCode: accidentServiceSkuID,
                itemType: "S6",
                qty: buyNum
            });
            cartjson = JSON.stringify({
                itemCode: skuCode,
                itemType: type,
                qty: buyNum,
                subs: otherPrdList,
                attrs: attrs
            })
        } else {
            if (extendServiceSkuID.length > 0) {
                otherPrdList.push({
                    itemCode: extendServiceSkuID,
                    itemType: "S1",
                    qty: buyNum
                });
                cartjson = JSON.stringify({
                    itemCode: skuCode,
                    itemType: type,
                    qty: buyNum,
                    subs: otherPrdList,
                    attrs: attrs
                })
            } else if (accidentServiceSkuID.length > 0) {
                otherPrdList.push({
                    itemCode: accidentServiceSkuID,
                    itemType: "S6",
                    qty: buyNum
                });
                cartjson = JSON.stringify({
                    itemCode: skuCode,
                    itemType: type,
                    qty: buyNum,
                    subs: otherPrdList,
                    attrs: attrs
                })
            } else {
                cartjson0 = {
                    itemCode: skuCode,
                    itemType: type,
                    qty: buyNum,
                    attrs: attrs,
                    subs: otherPrdList
                };
                cartjson = JSON.stringify(cartjson0)
            }
        }
    }
    if (ucareServiceSkuID.length > 0) {
        cartjson = JSON.parse(cartjson);
        cartjson.subs.push({
            itemCode: ucareServiceSkuID,
            itemType: "S15",
            qty: buyNum
        });
        cartjson = JSON.stringify(cartjson)
    }
    temp = {
        cartjson: cartjson
    };
    return temp
}
;
ec.product.orderEasyBuy = function() {
    var skusListArr = $("#pro-skus").find("dl").not($("#giftPackageList").find("dl")).not($("#packageList").find("dl"));
    for (p = 0; p < skusListArr.length; p++) {
        var flag = false;
        var skuInfoArr = skusListArr.get(p);
        $(skuInfoArr).children(".product-choose-detail").children("ul").find("li").each(function(index) {
            if ($(this).parents("#giftPackageList").length > 0 || $(this).parents("#packageList").length > 0) {
                return true
            }
            if ($(this).hasClass("selected")) {
                flag = true;
                return
            }
        });
        if (!flag) {
            alert("请选择需要购买的类型");
            return false
        }
    }
    var skuId = ec.product.getSku();
    var skuInfo = ec.product.getSkuInfo(skuId);
    if (skuInfo.easyBuyPcUrl != "") {
        ec.dapClick(300021801, {
            productId: ec.product.id,
            buttonName: $("#pro-operation .product-button-priority span").text(),
            SKUCode: $("#pro-sku-code").val(),
            click: 1
        });
        ec.redirectTo(skuInfo.easyBuyPcUrl)
    }
}
;
ec.product.isEasyBuy = function() {
    var skuInfo = ec.product.getSkuInfo(ec.product.getSku());
    var isPriority = $("#isPriority").val();
    var isPrioritySku = ec.product.getSkuPriority(ec.product.getSku());
    if (isPriority == 1 && isPrioritySku == true) {
        return false
    }
    if (skuInfo && skuInfo.showEasyBuy == "1") {
        var easyBuyStartTime = skuInfo.easyBuyStartTime;
        var easyBuyEndTime = skuInfo.easyBuyEndTime;
        if (easyBuyStartTime != "" && easyBuyEndTime != "") {
            var nowTime = ec.product.getSysDate();
            var eBuyStartTime = new Date;
            eBuyStartTime.setTime(ec.util.parseDate(easyBuyStartTime));
            var eBuyEndTime = new Date;
            eBuyEndTime.setTime(ec.util.parseDate(easyBuyEndTime));
            if (nowTime - eBuyStartTime > 0 && nowTime - eBuyEndTime < 0) {
                if (skuInfo.webEnabled == "1") {
                    return true
                }
            }
        } else if (easyBuyStartTime != "") {
            var nowTime = ec.product.getSysDate();
            var eBuyStartTime = new Date;
            eBuyStartTime.setTime(ec.util.parseDate(easyBuyStartTime));
            if (nowTime - eBuyStartTime > 0) {
                if (skuInfo.webEnabled == "1") {
                    return true
                }
            }
        }
    }
    return false
}
;
ec.product.renderVisitorButton = function(appendSelector) {
    var isValCas = ec.util.cookie.get("isValCas")
      , casLogin = ec.util.cookie.get("CASLOGIN")
      , uid = ec.util.cookie.get("uid")
      , displayName = ec.util.cookie.get("displayName");
    if (ec.account.isLogin() || isValCas != null || casLogin != null || uid != null || displayName != null) {
        return
    }
    var skuInfo = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
    skuId = skuInfo.id;
    if (ec.product.isSupportVisitorMode != "1" || ec.product.productType == 4 || rush.sbom.isRushProduct() || rush.sbom.isRushSbom(skuId)) {
        return
    }
    $("#product-deposit-agreement-area").next().remove()
}
;
ec.product.orderNowByVisitor = function(giftBuyTemp) {
    var skusListArr = $("#pro-skus").find("dl").not($("#giftPackageList").find("dl")).not($("#packageList").find("dl"));
    for (p = 0; p < skusListArr.length; p++) {
        var flag = false;
        var skuInfoArr = skusListArr.get(p);
        $(skuInfoArr).children(".product-choose-detail").children("ul").find("li").each(function(index) {
            if ($(this).parents("#giftPackageList").length > 0 || $(this).parents("#packageList").length > 0) {
                return true
            }
            if ($(this).hasClass("selected")) {
                flag = true;
                return
            }
        });
        if (!flag) {
            alert("请选择需要购买的类型");
            return false
        }
    }
    ec.product.disableAddCartButtons();
    var orderItemReqArgList = [];
    var orderitem = {};
    orderitem.itemId = $("#pro-sku-code").val();
    orderitem.qty = $("#pro-quantity").val() || 1;
    orderitem.itemType = "S0";
    if (ec.product.productType == 9) {
        orderitem.itemType = "S9"
    }
    var finalGift = ec.product.gift.finalMainSbomGiftMap[ec.product.getSku()];
    var skuIds = ec.product.getSku();
    var gifts2Order = [];
    if (finalGift) {
        for (var key in finalGift) {
            var aGift = {
                sbomCode: finalGift[key].giftSkuCode
            };
            if (finalGift[key].group) {
                aGift.group = finalGift[key].group
            }
            gifts2Order.push(aGift)
        }
    }
    if (ec.product.gift.packageGiftMap[skuIds]) {
        for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuIds].length; giftKey++) {
            var pGift = {
                sbomCode: ec.product.gift.packageGiftMap[skuIds][giftKey]
            };
            gifts2Order.push(pGift)
        }
    }
    orderitem.gifts = gifts2Order;
    orderitem.subOrderItemReqArgs = [];
    var packageCode = $("#packageCode").val();
    if (packageCode != "") {
        orderitem.itemType = "P";
        var packageCodeList = {
            package_code: packageCode
        };
        orderitem.itemProp = packageCodeList
    }
    var packageSkuCode = $("#packageListCode").val();
    if (packageSkuCode != "") {
        $.each(packageSkuCode.split(","), function(index, value) {
            var apack = {
                itemId: value,
                qty: Number($("#pro-quantity").val() || 1),
                itemType: "P"
            };
            orderitem.subOrderItemReqArgs.push(apack)
        })
    }
    var giftBuyItem = {};
    if (giftBuyTemp == 2 && _giftBuyItemId.length > 0) {
        giftBuyItem.itemId = _giftBuyItemId[0];
        giftBuyItem.qty = $("#pro-quantity").val() || 1;
        giftBuyItem.itemType = "S10";
        giftBuyItem.mainSkuCode = $("#pro-sku-code").val();
        orderitem.subOrderItemReqArgs.push(giftBuyItem)
    }
    orderitem.subOrderItemReqArgs = ec.product.subServices(orderitem.subOrderItemReqArgs);
    orderItemReqArgList.push(orderitem);
    var jsonReqArg = ec.lang.json.stringify(orderItemReqArgList);
    var input = "";
    input += '<input name="orderReqJson" type="text" value=\'' + jsonReqArg + "'>";
    input += '<input name="state" type="text" value="0">';
    if (giftBuyTemp == 2 && _giftBuyItemId.length > 0) {
        input += '<input name="routingTag" type="hidden" value="30">'
    }
    var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
    if (ec.product.productType == 9) {
        if (parseInt(getSku.buttonMode) == 18) {
            input += '<input name="routingTag" type="text" value="36">'
        } else {
            input += '<input name="routingTag" type="text" value="28">'
        }
    }
    var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
    if (ec.product.isSupportVisitorMode == "1") {
        $("#order-confirm-form").attr("action", "/visitor/vistorConfirm")
    }
    var form = $("#order-confirm-form").append(input);
    form.submit()
}
;
ec.product.orderNow = function(giftBuyTemp, orderFrom) {
    giftBuyTemp = giftBuyTemp || $("#pro-operation").attr("data-gift");
    ec.product.isGift = giftBuyTemp;
    ec.product.isCover = false;
    ec.product.isComb = false;
    ec.account.afterLogin(function() {
        var skusListArr = $("#pro-skus").find("dl").not($("#giftPackageList").find("dl")).not($("#packageList").find("dl"));
        for (p = 0; p < skusListArr.length; p++) {
            var flag = false;
            var skuInfoArr = skusListArr.get(p);
            $(skuInfoArr).children(".product-choose-detail").children("ul").find("li").each(function(index) {
                if ($(this).parents("#giftPackageList").length > 0 || $(this).parents("#packageList").length > 0) {
                    return true
                }
                if ($(this).hasClass("selected")) {
                    flag = true;
                    return
                }
            });
            if (!flag) {
                alert("请选择需要购买的类型");
                return false
            }
        }
        ec.product.disableAddCartButtons();
        var orderItemReqArgList = [];
        var orderitem = {};
        orderitem.itemId = $("#pro-sku-code").val();
        orderitem.qty = $("#pro-quantity").val() || 1;
        orderitem.itemType = "S0";
        if (ec.product.productType == 9) {
            orderitem.itemType = "S9"
        }
        var finalGift = ec.product.gift.finalMainSbomGiftMap[ec.product.getSku()];
        var skuIds = ec.product.getSku();
        var gifts2Order = [];
        if (finalGift) {
            for (var key in finalGift) {
                var aGift = {
                    sbomCode: finalGift[key].giftSkuCode
                };
                if (finalGift[key].group) {
                    aGift.group = finalGift[key].group
                }
                gifts2Order.push(aGift)
            }
        }
        if (ec.product.gift.packageGiftMap[skuIds]) {
            for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuIds].length; giftKey++) {
                var pGift = {
                    sbomCode: ec.product.gift.packageGiftMap[skuIds][giftKey]
                };
                gifts2Order.push(pGift)
            }
        }
        orderitem.gifts = gifts2Order;
        orderitem.subOrderItemReqArgs = [];
        var packageCode = $("#packageCode").val();
        if (packageCode != "") {
            orderitem.itemType = "P";
            var packageCodeList = {
                package_code: packageCode
            };
            orderitem.itemProp = packageCodeList
        }
        var packageSkuCode = $("#packageListCode").val();
        if (packageSkuCode != "") {
            $.each(packageSkuCode.split(","), function(index, value) {
                var apack = {
                    itemId: value,
                    qty: Number($("#pro-quantity").val() || 1),
                    itemType: "P"
                };
                orderitem.subOrderItemReqArgs.push(apack)
            })
        }
        var giftBuyItem = {};
        if (giftBuyTemp == 2 && _giftBuyItemId.length > 0) {
            giftBuyItem.itemId = _giftBuyItemId[0];
            giftBuyItem.qty = $("#pro-quantity").val() || 1;
            giftBuyItem.itemType = "S10";
            giftBuyItem.mainSkuCode = $("#pro-sku-code").val();
            orderitem.subOrderItemReqArgs.push(giftBuyItem)
        }
        orderitem.subOrderItemReqArgs = ec.product.subServices(orderitem.subOrderItemReqArgs);
        orderItemReqArgList.push(orderitem);
        var jsonReqArg = ec.lang.json.stringify(orderItemReqArgList);
        var input = '<input name="orderReqJson" type="text" value=\'' + jsonReqArg + "'>";
        input += '<input name="state" type="text" value="0">';
        if (giftBuyTemp == 2 && _giftBuyItemId.length > 0) {
            input += '<input name="routingTag" type="hidden" value="30">'
        }
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        if (ec.product.productType == 9) {
            if (parseInt(getSku.buttonMode) == 18) {
                input += '<input name="routingTag" type="text" value="36">'
            } else {
                input += '<input name="routingTag" type="text" value="28">'
            }
        }
        if (orderFrom === "HB") {
            var o = $("#hbDetail .product-stages-main li.selected a");
            if (o.length > 0) {
                input += '<input name="interest" type="text" value="' + ec.autoEncodeAttr(o.attr("interest-info")) + '">'
            }
        } else if (orderFrom === "HL") {
            var o = $("#hlDetail .product-stages-main li.selected a");
            if (o.length > 0) {
                input += '<input name="interest" type="text" value="' + ec.autoEncodeAttr(o.attr("interest-info")) + '">'
            }
        }
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        var form = $("#order-confirm-form").append(input);
        ec.binding.isBindedMobileOrEnterpriseUser(function() {
            setTimeout(function() {
                form.submit()
            }, 500)
        })
    }, "visitorInfo")
}
;
ec.product.addCartWithLogin = function() {
    ec.account.afterLogin(ec.product.addCart)
}
;
ec.product.buyBundle = function(bundleCode, dom) {
    ec.product.disableAddCartButtons();
    var temp = ec.product.finalGift(bundleCode);
    paras = {
        cartjson: temp.cartjson
    };
    ec.cart.dap(300020402, $(dom).text(), temp.cartjson);
    ec.cart.add(paras, {
        successFunction: function(json) {
            ec.product.enableAddCartButtons();
            document.location.href = "/cart2"
        },
        errorFunction: function(json) {
            ec.product.enableAddCartButtons();
            alertS(json.msg)
        }
    })
}
;
ec.product.addComb = function(thix) {
    var dataIndex = $(thix).attr("data-index");
    var orderItemReqArgList = [];
    var id = ec.product.getSku()
      , skuIds = [id]
      , quantity = [1]
      , type = [1]
      , isPriority = $("#isPriority").val();
    skuCode = $("#pro-sku-code").val();
    var mainItem = {};
    mainItem.itemCode = $("#pro-sku-code").val();
    mainItem.qty = 1;
    mainItem.itemType = "S0";
    orderItemReqArgList.push(mainItem);
    var comboToCart = [];
    var mainProduct = {
        itemCode: skuCode,
        itemType: "S0",
        qty: 1
    };
    comboToCart.push(mainProduct);
    $('[id="comb-pro-' + id + "-" + dataIndex + '"]').find("input[name=skuId]:checked").each(function() {
        skuIds.push(this.value);
        quantity.push(1);
        type.push(1);
        var orderitem = {};
        orderitem.itemId = this.value;
        orderitem.qty = 1;
        orderitem.itemType = "S0";
        orderItemReqArgList.push(orderitem);
        var combo = {
            itemType: "S0",
            qty: 1,
            itemCode: $(this).attr("data-scode")
        };
        comboToCart.push(combo)
    });
    var paras = {
        number: 1,
        cartjson: JSON.stringify(comboToCart)
    };
    if (isPriority == 1) {
        if (ec.product.getSkuPriority(id) == true) {
            return ec.product.buy("sku", skuIds)
        }
    }
    $("#order-confirm-form").attr({
        action: "/order/nowConfirmcart",
        method: "post"
    });
    ec.product.disableAddCartButtons();
    var jsonReqArg = ec.lang.json.stringify(orderItemReqArgList);
    ec.cart.add(paras, {
        successFunction: function(json) {
            ec.product.enableAddCartButtons();
            document.location.href = "/cart2"
        },
        errorFunction: function(json) {
            ec.product.enableAddCartButtons();
            alertS(json.msg)
        }
    })
}
;
ec.product.orderComb = function(thix) {
    ec.product.isComb = true;
    ec.account.afterLogin(function() {
        var skusListArr = $("#pro-skus").find("dl").not($("#giftPackageList").find("dl")).not($("#packageList").find("dl"));
        for (p = 0; p < skusListArr.length; p++) {
            var flag = false;
            var skuInfoArr = skusListArr.get(p);
            $(skuInfoArr).children(".product-choose-detail").children("ul").find("li").each(function(index) {
                if ($(this).parents("#giftPackageList").length > 0 || $(this).parents("#packageList").length > 0) {
                    return true
                }
                if ($(this).hasClass("selected")) {
                    flag = true;
                    return
                }
            });
            if (!flag) {
                alert("请选择需要购买的类型");
                return false
            }
        }
        ec.product.disableAddCartButtons();
        var dataIndex = $(thix).attr("data-index");
        var orderItemReqArgList = [];
        var orderitem = {};
        $('[id="comb-pro-' + ec.product.getSku() + "-" + dataIndex + '"]').find("input[name=skuId]:checked").each(function() {
            var orderitem = {};
            orderitem.itemId = $(this).attr("data-scode");
            orderitem.qty = 1;
            orderitem.itemType = "S0";
            orderItemReqArgList.push(orderitem)
        });
        orderitem.itemId = $("#pro-sku-code").val();
        orderitem.qty = $("#pro-quantity").val() || 1;
        orderitem.itemType = "S0";
        if (ec.product.productType == 9) {
            orderitem.itemType = "S9"
        }
        var finalGift = ec.product.gift.finalMainSbomGiftMap[ec.product.getSku()];
        var skuIds = ec.product.getSku();
        var gifts2Order = [];
        if (finalGift) {
            for (var key in finalGift) {
                var aGift = {
                    sbomCode: finalGift[key].giftSkuCode
                };
                if (finalGift[key].group) {
                    aGift.group = finalGift[key].group
                }
                gifts2Order.push(aGift)
            }
        }
        if (ec.product.gift.packageGiftMap[skuIds]) {
            for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuIds].length; giftKey++) {
                var pGift = {
                    sbomCode: ec.product.gift.packageGiftMap[skuIds][giftKey]
                };
                gifts2Order.push(pGift)
            }
        }
        orderitem.gifts = gifts2Order;
        orderItemReqArgList.push(orderitem);
        var jsonReqArg = ec.lang.json.stringify(orderItemReqArgList);
        var input = "";
        input += '<input name="orderReqJson" type="text" value=\'' + jsonReqArg + "'>";
        input += '<input name="state" type="text" value="0">';
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        if (ec.product.productType == 9) {
            if (parseInt(getSku.buttonMode) == 18) {
                input += '<input name="routingTag" type="text" value="36">'
            } else {
                input += '<input name="routingTag" type="text" value="28">'
            }
        }
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        var form = $("#order-confirm-form").append(input);
        ec.binding.isBindedMobileOrEnterpriseUser(function() {
            setTimeout(function() {
                form.submit()
            }, 500)
        })
    })
}
;
ec.product.buy = function(type, id) {
    ec.account.afterLogin(function() {
        var input = "";
        if (type == "sku") {
            var orderItemReqArgList = [];
            var orderitem = {};
            orderitem.itemId = $("#pro-sku-code").val();
            orderitem.qty = 1;
            orderitem.itemType = "S0";
            var finalGift = ec.product.gift.finalMainSbomGiftMap[ec.product.getSku()];
            var skuIds = ec.product.getSku();
            var gifts2Order = [];
            if (finalGift) {
                for (var key in finalGift) {
                    var aGift = {
                        sbomCode: finalGift[key].giftSkuCode
                    };
                    if (finalGift[key].group) {
                        aGift.group = finalGift[key].group
                    }
                    gifts2Order.push(aGift)
                }
            }
            if (ec.product.gift.packageGiftMap[skuIds]) {
                for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuIds].length; giftKey++) {
                    var pGift = {
                        sbomCode: ec.product.gift.packageGiftMap[skuIds][giftKey]
                    };
                    gifts2Order.push(pGift)
                }
            }
            orderitem.gifts = gifts2Order;
            orderitem.subOrderItemReqArgs = [];
            orderitem.subOrderItemReqArgs = ec.product.subServices(orderitem.subOrderItemReqArgs);
            orderItemReqArgList.push(orderitem);
            var jsonReqArg = ec.lang.json.stringify(orderItemReqArgList);
            input = '<input name="orderReqJson" type="text" value=\'' + jsonReqArg + "'>"
        }
        var form = $("#order-confirm-form").append(input);
        ec.binding.isBindedMobileOrEnterpriseUser(function() {
            setTimeout(function() {
                form.submit()
            }, 500)
        })
    })
}
;
ec.product.subServices = function(subOrderItemReqArgs) {
    subOrderItemReqArgs = subOrderItemReqArgs || [];
    var extendSbomCode = $("#extendSelect").attr("data-scode");
    var accidentSbomCode = $("#accidentSelect").attr("data-scode");
    var ucareSbomCode = $("#ucareSelect").attr("data-scode");
    if (extendSbomCode.length > 0) {
        var subItem = {};
        subItem.itemId = extendSbomCode;
        subItem.qty = $("#pro-quantity").val() || 1;
        subItem.itemType = "S1";
        subItem.mainSkuCode = $("#pro-sku-code").val();
        subOrderItemReqArgs.push(subItem)
    }
    if (accidentSbomCode.length > 0) {
        var subItem = {};
        subItem.itemId = accidentSbomCode;
        subItem.qty = $("#pro-quantity").val() || 1;
        subItem.itemType = "S6";
        subItem.mainSkuCode = $("#pro-sku-code").val();
        subOrderItemReqArgs.push(subItem)
    }
    if (ucareSbomCode.length > 0) {
        var subItem = {};
        subItem.itemId = ucareSbomCode;
        subItem.qty = $("#pro-quantity").val() || 1;
        subItem.itemType = "S15";
        subItem.mainSkuCode = $("#pro-sku-code").val();
        subOrderItemReqArgs.push(subItem)
    }
    return subOrderItemReqArgs
}
;
ec.product.timingBuy = function() {
    ec.product.inventory.wait(function() {
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        var _now = ec.product.getSysDate();
        var start = getSku.startTime;
        var startTime = new Date;
        startTime.setTime(ec.util.parseDate(start));
        var startArray = [];
        startArray.push(start);
        var countdownLength = getSku.countDown;
        $("#pro-operation").css("visibility", "visible");
        $("#product-operation").show();
        if (_now - startTime >= 0) {
            var end = getSku.endTime;
            var endTime = new Date;
            if (null == end || "" == end) {
                endTime = new Date(2999,1,1,0,0,0)
            } else {
                endTime.setTime(ec.util.parseDate(end))
            }
            if (_now - endTime < 0) {
                var haveQuantity = ec.product.inventory.haveInventory(getSku.id);
                if (haveQuantity) {
                    var content = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>' + '<span class="product-button-tips">限时抢购进行中</span>';
                    ec.product.renderVisitorButton($("#pro-operation"));
                    $("#pro-operation").html(content);
                    $("#product-operation").show()
                } else {
                    $("#pro-quantity-area").hide();
                    $("#pro-operation").html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                    $("#product-operation").show();
                    ec.diypkg.hideAll()
                }
            } else {
                $("#pro-operation").html('<a href="javascript:;" class="product-button02 disabled">活动已结束</a>');
                $("#pro-operation").css("visibility", "visible");
                $("#product-operation").show();
                ec.diypkg.hideAll()
            }
        } else if (!ec.util.isEmpty(getSku.gotoUrl) && (startTime - _now) / (1e3 * 3600) > countdownLength) {
            if (1 == getSku.isShowReminder) {
                $("#pro-operation").html('<a target="_blank" href="' + getSku.gotoUrl + '" class="product-button02" ><span>开售提醒</span></a>');
                $("#product-operation").show()
            } else if (0 == getSku.isShowReminder) {
                var content = '<a href="javascript:;" class="product-button01 disabled" ><span>加入购物车</span></a>' + '<a href="javascript:;"  class="product-button02 disabled" ><span>立即下单</span></a><div class="product-time"></div>';
                $("#pro-operation").html(content);
                $("#product-operation").show();
                ec.ui.countdown2($(".product-time"), {
                    html: "<p>离抢购开始还有：</p><ul><li><span>{#day}</span></li><li><em>天</em></li><li><span>{#hours}</span></li><li><em>:</em></li><li><span>{#minutes}</span></li><li><em>:</em></li><li><span>{#seconds}</span></li>",
                    now: _now,
                    times: startArray,
                    callback: function(json) {
                        var content = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                        $("#pro-operation").html(content);
                        $("#product-operation").show();
                        ec.product.gift.updateOperationBtns()
                    }
                })
            }
        } else {
            var content = '<a href="javascript:;" class="product-button01 disabled" ><span>加入购物车</span></a>' + '<a href="javascript:;"  class="product-button02 disabled" ><span>立即下单</span></a><div class="product-time"></div>';
            $("#pro-operation").html(content);
            $("#product-operation").show();
            ec.ui.countdown2($(".product-time"), {
                html: "<p>离抢购开始还有：</p><ul><li><span>{#day}</span></li><li><em>天</em></li><li><span>{#hours}</span></li><li><em>:</em></li><li><span>{#minutes}</span></li><li><em>:</em></li><li><span>{#seconds}</span></li>",
                now: _now,
                times: startArray,
                callback: function(json) {
                    var content = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                    $("#pro-operation").html(content);
                    $("#product-operation").show();
                    ec.product.showSbomInterest(ec.product.getSkuInfo(ec.product.getSku()));
                    ec.product.gift.updateOperationBtns()
                }
            })
        }
    })
}
;
ec.product.arrival = function() {
    ec.account.afterLogin(function() {
        ec.product.syncCustomSession();
        var email = ec.product.email;
        var mobile = ec.product.mobile;
        var noticeType = "";
        var box = new ec.box($("#product-arrival-html").val(),{
            boxid: "product-arriva-box",
            boxclass: "ol_box_4",
            title: "到货通知",
            width: 700,
            showButton: false,
            onopen: function(box) {
                if (ec.util.isEmpty(email)) {
                    $("#arrival-email").css({
                        cursor: "pointer"
                    });
                    $("#arrival-email").click(function() {
                        ec.openWindow("/member/account");
                        ec.product.bind()
                    });
                    $("#arrival-email").attr("class", "disabled");
                    $("#account-email").html('未绑定安全邮箱&nbsp;<a href="javascript:;" target="_blank">去绑定</a>')
                } else {
                    $("#arrival-email").bind("click", function() {
                        noticeType = ec.product.chooseNoticeType("email")
                    });
                    $("#account-email").html(email)
                }
                if (ec.util.isEmpty(mobile)) {
                    $("#arrival-mobile").css({
                        cursor: "pointer"
                    });
                    $("#arrival-mobile").click(function() {
                        ec.openWindow("/member/account");
                        ec.product.bind()
                    });
                    $("#arrival-mobile").attr("class", "disabled");
                    $("#account-mobile").html('未绑定安全手机&nbsp;<a href="javascript:;" target="_blank">去绑定</a>')
                } else {
                    $("#arrival-mobile").bind("click", function() {
                        noticeType = ec.product.chooseNoticeType("mobile")
                    });
                    $("#account-mobile").html(ec.product.splitMobile(mobile))
                }
            },
            onok: function(box) {
                if (noticeType.length == 0) {
                    $("#arrival-error span").html("请选择一种通知方式！");
                    $("#arrival-error").removeClass("hide");
                    return
                }
                var type = "1";
                var informWay = email;
                if (noticeType == "mobile") {
                    type = "3";
                    informWay = mobile
                }
                ec.ui.loading.show();
                $.ajax({
                    url: "/product/arrivalMail.json",
                    dataType: "json",
                    type: "post",
                    data: {
                        informWay: informWay,
                        type: type,
                        skuId: ec.product.getSku(),
                        skuCode: $("#pro-sku-code2").html()
                    },
                    timeout: 1e4,
                    error: function() {
                        ec.ui.loading.hide();
                        $("#arrival-error span").html("操作超时，请重试！");
                        $("#arrival-error").removeClass("hide")
                    },
                    success: function(json) {
                        ec.ui.loading.hide();
                        if (!json.success) {
                            $("#arrival-error span").html(json.msg);
                            $("#arrival-error").removeClass("hide");
                            return
                        }
                        alert("设置成功！");
                        $("#arrival-error").addClass("hide");
                        box.close();
                        $(".ol_box_mask").remove()
                    }
                })
            },
            onclose: function(box) {
                $(".ol_box_mask").remove()
            }
        });
        box.open();
        ec.product.bind = function() {
            box.close();
            $(".ol_box_mask").remove()
        }
    })
}
;
ec.product.chooseNoticeType = function(type) {
    $("#arrival-email").removeClass("selected");
    $("#arrival-mobile").removeClass("selected");
    $("#arrival-" + type).attr("class", "selected");
    return type
}
;
ec.product.attention = function() {
    var box = new ec.box($("#product-attention-html").val(),{
        boxid: "product-attention-box",
        title: "关注商品",
        width: 580,
        focus: "input[name=email]",
        showButton: false,
        onok: function(box) {
            var email = box.find("input[name=email]").val()
              , mobile = box.find("input[name=mobile]").val()
              , regMobile = /^0?(13|14|15|17|18)[0-9]{9}$/;
            if (!email) {
                alert("请输入email！");
                return
            }
            if (!ec.util.isEmail(email)) {
                alert("请输入正确的email！");
                return
            }
            if (!mobile) {
                alert("请输入手机号码！");
                return
            }
            if (!regMobile.test(mobile)) {
                alert("请输入正确的手机号码！");
                return
            }
            (new ec.ajax).submit({
                url: "/product/saveAttention.json",
                data: {
                    email: email,
                    phone: mobile,
                    skuId: ec.product.getSku()
                },
                timeout: 1e4,
                timeoutFunction: function() {
                    alert(timeOutInfo)
                },
                beforeSendFunction: ec.ui.loading.show,
                afterSendFunction: ec.ui.loading.hide,
                successFunction: function(json) {
                    if (!json.success) {
                        ec.showError(json);
                        return
                    }
                    alert("设置成功！");
                    box.close()
                }
            })
        }
    });
    box.open();
    box.find("input[name=email]").focus()
}
;
ec.product.jmptoRemark = function() {
    $("#pro-tab-evaluate").click();
    ec.ui.scrollTo("#pro-tab-evaluate")
}
;
(function() {
    var _index = 0, _length;
    ec.ready(function() {
        _length = $("#pro-gallerys").css("left", "0").children().length
    });
    ec.product.imgSlider = {
        prev: function() {
            if (_index == 0)
                return;
            _index--;
            $("#pro-gallerys").animate({
                left: _index * -74
            }, 100)
        },
        next: function() {
            if (_index + 5 >= _length)
                return;
            _index++;
            $("#pro-gallerys").animate({
                left: _index * -74
            }, 100)
        },
        reset: function() {
            _length = $("#pro-gallerys").css("left", "0").children().length;
            _index = 0
        }
    }
}
)();
(function(_ep) {
    _ep.renderGroup = function(skuId) {
        var _showId = []
          , bundle = $("#bundle-list-" + skuId);
        if (bundle.length > 0) {
            _showId.push("#tab-bundle");
            bundle.show().siblings().hide();
            _ep.renderBundle(skuId)
        }
        var buttonMode = parseInt(ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku).buttonMode);
        if (buttonMode < 1 || buttonMode > 13 && buttonMode !== 22) {
            ec.diypkg.hideAll()
        } else {
            ec.diypkg.init()
        }
        $("#tab-bundle,#tab-comb").hide();
        if (_showId.length == 0) {
            $("#group-area").hide();
            return
        }
        if (_showId.length > 1) {
            _showId.push("#tab-split")
        }
        _showId.push("#group-area");
        $(_showId.join(",")).show()
    }
    ;
    _ep.renderBundle = function(skuId) {
        var bundleList = $("#bundle-list-" + skuId);
        this.showBundle(bundleList.children("li.current").attr("data-id"))
    }
    ;
    _ep.showBundle = function(bundleId) {
        $("#bundle-pro-" + bundleId + ",#bundle-price-" + bundleId).show().siblings().hide();
        _bundleId = bundleId;
        var bundle = $("#bundle-pro-" + bundleId)
    }
}
)(ec.product);
(function() {
    var _type;
    _options = {};
    _options["default"] = {};
    _options["normal"] = {
        renderInventory: function(haveQuantity) {
            var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku)
              , $proMsg = $("#pro-msg")
              , $buyBtns = $("#pro-quantity-area,#pro-operation")
              , $buyBtnMod = $("#pro-operation")
              , isPriority = $("#isPriority").val();
            if (ec.product.productType == 4 || getSku.buttonMode == 22 || getSku.buttonMode == 25) {
                return false
            }
            $("#tab-addcart-button").hide();
            $("#tab-notice-button").hide();
            $("#product-tips").html("");
            $("#product-tips").hide();
            if (ec.product.status == 3) {
                $proMsg.show();
                $("#pro-msg-title").html("温馨提示：该商品已下架");
                $buyBtnMod.css("visibility", "hidden");
                $(".product-operation-main").hide();
                $("#package_dl").remove()
            }
            if (ec.product.status == 5) {
                $proMsg.show();
                $("#pro-msg-title").html("温馨提示：该商品不在此销售前端销售");
                $buyBtnMod.css("visibility", "hidden");
                $("#product-tips").html("温馨提示：该商品不在此销售前端销售");
                $("#product-tips").show();
                $("#product-operation").hide();
                return
            }
            if (getSku.tipsContent.length > 1) {
                $proMsg.show();
                $("#pro-msg-title").html("温馨提示：" + getSku.tipsContent);
                $("#product-tips").html("温馨提示：" + getSku.tipsContent);
                $("#product-tips").show()
            } else {
                $proMsg.hide();
                $("#product-tips").hide()
            }
            if (getSku.priceMode == 2) {
                $("#pro-price-label").html("暂无报价");
                $("#pro-price-label").show();
                $("#pro-price").hide();
                $("#pro-price-old").hide();
                $("#pro-price").html("");
                $("#pro-price-old").hide()
            }
            if (isPriority == 1) {
                if (ec.product.getSkuPriority(getSku.id) == true) {
                    $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.buy(\'sku\');return false;"><span>立即购买</span></a>');
                    $("#pro-quantity-area").hide();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    $("#order-confirm-form").attr({
                        action: "/order/priorityConfirm",
                        method: "post"
                    });
                    return
                }
            }
            $("#order-confirm-form").attr({
                action: "/order/nowConfirmcart",
                method: "post"
            });
            $("#product-deposit-agreement-area").next().remove();
            switch (parseInt(getSku.buttonMode, 10)) {
            case 5:
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                return;
            case 4:
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                return;
            case 2:
                $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.buy(\'sku\');return false;"><span>立即购买</span></a>');
                $("#pro-quantity-area").show();
                $buyBtnMod.css("visibility", "visible");
                $("#product-operation").show();
                return;
            case 7:
                if (ec.product.isEasyBuy()) {
                    $("#pro-quantity-area").hide();
                    $("#pro-quantity-area-nochange").show();
                    $buyBtnMod.html('<a onclick="ec.product.orderEasyBuy()" class="product-button-priority" ><span>' + getSku.easyBuyName + "</span></a>" + '<a target="_blank" href="' + getSku.gotoUrl + '" class="product-button02" ><span>' + getSku.buttonText + "</span></a>")
                } else {
                    $buyBtnMod.html('<a target="_blank" href="' + getSku.gotoUrl + '" class="product-button02" ><span>' + getSku.buttonText + "</span></a>")
                }
                $buyBtnMod.css("visibility", "visible");
                $("#product-operation").show();
                return;
            case 8:
                return;
            case 9:
                if (ec.product.isEasyBuy()) {
                    $("#pro-quantity-area").hide();
                    $("#pro-quantity-area-nochange").show();
                    $buyBtnMod.html('<a onclick="ec.product.orderEasyBuy()" class="product-button-priority" ><span>' + getSku.easyBuyName + "</span></a>" + '<a target="_blank" href="' + getSku.gotoUrl + '" class="product-button02" ><span>开售提醒</span></a>')
                } else {
                    $buyBtnMod.html('<a target="_blank" href="' + getSku.gotoUrl + '" class="product-button02" ><span>开售提醒</span></a>')
                }
                $buyBtnMod.css("visibility", "visible");
                $("#product-operation").show();
                return;
            case 10:
                ec.product.timingBuy();
                return;
            case 12:
                if (ec.product.productType == 9) {
                    if (haveQuantity) {
                        $("#pro-quantity-area").show();
                        $buyBtnMod.css("visibility", "visible");
                        $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.orderNow()"><span>立即下单</span></a>');
                        $("#product-operation").show()
                    } else {
                        $("#pro-quantity-area").hide();
                        $buyBtnMod.css("visibility", "visible");
                        $("#product-operation").show();
                        $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                        $("#tab-notice-button").show()
                    }
                    return
                }
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                return;
            case 18:
                if (ec.product.productType == 9) {
                    if (haveQuantity) {
                        $("#pro-quantity-area").show();
                        $buyBtnMod.css("visibility", "visible");
                        $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.orderNow()"><span>立即下单</span></a>');
                        $("#product-operation").show()
                    } else {
                        $("#pro-quantity-area").hide();
                        $buyBtnMod.css("visibility", "visible");
                        $("#product-operation").show();
                        $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                        $("#tab-notice-button").show()
                    }
                    return
                }
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                return;
            case 15:
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                $("#product-operation").hide();
                if (getSku.tipsContent.length > 1) {
                    $("#pro-msg-title").html("温馨提示：" + getSku.tipsContent)
                } else {
                    $("#product-tips").html("温馨提示：该商品暂不售卖")
                }
                $("#product-tips").show();
                return;
            case 3:
            case 1:
                if (haveQuantity) {
                    $("#pro-quantity-area").show();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    if (getSku.groupType == "1") {
                        $buyBtnMod.html('<a href="javascript:;" onclick="ec.product.addCart()" class="product-button02" ><span>立即团购</span></a>')
                    } else {
                        var html = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                        ec.product.renderVisitorButton($buyBtnMod);
                        $buyBtnMod.html(html);
                        $("#tab-addcart-button").show()
                    }
                } else {
                    $("#pro-quantity-area").hide();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    if (ec.product.isEasyBuy()) {
                        $("#pro-quantity-area").hide();
                        $("#pro-quantity-area-nochange").show();
                        $buyBtnMod.html('<a onclick="ec.product.orderEasyBuy()" class="product-button-priority" ><span>' + getSku.easyBuyName + "</span></a>" + '<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>')
                    } else {
                        $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                        $("#tab-notice-button").show();
                        ec.diypkg.hideAll()
                    }
                }
                return;
            case 19:
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                $("#product-operation").hide();
                if (getSku.tipsContent.length > 1) {
                    $("#pro-msg-title").html("温馨提示：" + getSku.tipsContent)
                } else {
                    $("#product-tips").html("温馨提示：该商品暂不售卖")
                }
                $("#product-tips").show();
                return;
            case 22:
                if (haveQuantity) {
                    $("#pro-quantity-area").show();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    var html = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                    $buyBtnMod.html(html);
                    $("#tab-addcart-button").show()
                } else {
                    $("#pro-quantity-area").hide();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                    $("#tab-notice-button").show();
                    ec.diypkg.hideAll()
                }
                return;
            case 25:
                if (haveQuantity) {
                    $("#pro-quantity-area").show();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    var html = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                    $buyBtnMod.html(html);
                    $("#tab-addcart-button").show()
                } else {
                    $("#pro-quantity-area").hide();
                    $buyBtnMod.css("visibility", "visible");
                    $("#product-operation").show();
                    $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                    $("#tab-notice-button").show();
                    ec.diypkg.hideAll()
                }
                return;
            case 23:
                var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
                var _now = ec.product.getSysDate();
                var start = getSku.startTime;
                var startTime = new Date;
                startTime.setTime(ec.util.parseDate(start));
                var startArray = [];
                startArray.push(start);
                var countdownLength = getSku.countDown;
                $("#pro-operation").css("visibility", "visible");
                $("#product-operation").show();
                if (_now - startTime >= 0) {
                    if (haveQuantity) {
                        $("#pro-quantity-area").show();
                        $buyBtnMod.css("visibility", "visible");
                        $("#product-operation").show();
                        var html = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                        $buyBtnMod.html(html);
                        $("#tab-addcart-button").show()
                    } else {
                        $("#pro-quantity-area").hide();
                        $buyBtnMod.css("visibility", "visible");
                        $("#product-operation").show();
                        $buyBtnMod.html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                        $("#tab-notice-button").show();
                        ec.diypkg.hideAll()
                    }
                } else {
                    var content = '<a href="javascript:;"  class="product-button02 disabled" ><span>即将开售</span></a><div class="product-time"></div>';
                    $("#pro-operation").html(content);
                    $("#product-operation").show();
                    ec.ui.countdown2($(".product-time"), {
                        html: "<p>距离开售还有：</p><ul><li><span>{#day}</span></li><li><em>天</em></li><li><span>{#hours}</span></li><li><em>:</em></li><li><span>{#minutes}</span></li><li><em>:</em></li><li><span>{#seconds}</span></li>",
                        now: _now,
                        times: startArray,
                        callback: function(json) {
                            var content = '<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01" ><span>加入购物车</span></a>' + '<a href="javascript:;" onclick="ec.product.orderNow()" class="product-button02" ><span>立即下单</span></a>';
                            $("#pro-operation").html(content);
                            $("#product-operation").show();
                            ec.product.showSbomInterest(ec.product.getSkuInfo(ec.product.getSku()));
                            ec.product.gift.updateOperationBtns()
                        }
                    })
                }
                return;
            default:
                $buyBtnMod.css("visibility", "hidden");
                $("#pro-quantity-area").hide();
                $("#product-tips").html("温馨提示：该商品暂未售卖");
                $("#product-tips").show();
                $("#product-operation").hide()
            }
        }
    };
    _options["reservation"] = {
        renderInventory: function(haveQuantity) {
            $("#pro-msg").hide();
            if (haveQuantity) {
                $("#pro-quantity-area").show();
                $("#pro-operation").html('<a href="javascript:;"  onclick="ec.product.addCartWithLogin()" class="product-button02" ><span>预约购买</span></a>');
                $("#product-operation").show()
            } else {
                $("#pro-quantity-area").hide();
                $("#pro-operation").html('<a href="javascript:;" class="product-button02" onclick="ec.product.arrival()"><span>到货通知</span></a>');
                $("#product-operation").show()
            }
        }
    };
    _options["queue"] = {
        renderInventory: function(haveQuantity) {
            if (haveQuantity) {
                $("#sale-buy-btn").show();
                $("#sale-sell-out").hide()
            } else {
                $("#sale-buy-btn").hide();
                $("#sale-sell-out").show()
            }
        }
    };
    _options["seckill"] = {
        renderInventory: function(haveQuantity) {
            if (haveQuantity) {
                $("#sale-buy-btn").show();
                $("#sale-sell-out").hide()
            } else {
                $("#sale-buy-btn").hide();
                $("#sale-sell-out").show()
            }
        }
    };
    ec.product.execute = function(command, args) {
        var opt = _options[_type]
          , fun = opt[command] || _options["default"][command];
        if (fun)
            fun.apply(ec.product, args)
    }
    ;
    ec.product.setType = function(type) {
        _type = type;
        switch (type) {
        case "normal":
        case "reservation":
            ec.product.isSale = false;
            break;
        default:
            ec.product.isSale = true
        }
        ec.product.prefix = ec.product.isSale ? "/sale" : "/product"
    }
}
)();
ec.ready(function() {
    $(function() {
        var fix = $(".product-gallery");
        var end = $(".gallery-scroll-bottom");
        var fixTop = fix.offset().top
          , fixHeight = fix.height();
        var endTop, miss;
        $(window).scroll(function() {
            var docTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            if (end.length > 0) {
                endTop = $(".header").height() + $(".hr-10").height() * 4 + $(".g").height() + $(".product").height();
                miss = endTop - docTop - fixHeight
            }
            if (fixTop < docTop) {
                fix.addClass("positionFixed");
                fix.removeClass("positionStatic");
                if (end.length > 0 && endTop < docTop + fixHeight) {
                    fix.css({
                        top: miss
                    })
                } else {
                    fix.css({
                        top: 0
                    })
                }
            } else {
                fix.addClass("positionStatic");
                fix.removeClass("positionFixed")
            }
        })
    });
    var product = ec.product;
    ec.ui.proNumer("#pro-quantity", {
        max: 999,
        min: 1
    });
    ec.product.tabSkuInfo(ec.product.setSkuId || ec.product.defaultSku);
    var loadParameter = false;
    var _loadEvaluateSorce = function() {
        if (loadEvaluate)
            return;
        ec.product.remark.loadEvaluateScore();
        $("#pro-tab-evaluate-content").show();
        ec.product.remark.loadEvaluate({
            pageNumber: 1,
            type: 0,
            extraType: defaultExtraType
        }, true);
        ec.product.remark.bindEvent()
    };
    _loadEvaluateSorce();
    var product = ec.product;
    _bindEvent();
    $("#pro-tab-feature , #pro-tab-parameter , #pro-tab-package-service , #pro-tab-evaluate").click(function() {
        var thix = $(this)
          , id = this.id
    });
    ec.product.history.add(ec.product.id);
    $(window).scroll(function() {
        var hisScroll = $(this).scrollTop()
          , winHeight = $(window).height()
          , scrollTop = $("#product-history-area").offset().top;
        if (finished && hisScroll >= scrollTop - winHeight) {
            finished = false;
            product.history.load(function(list) {
                if (list.length == 0) {
                    $("#product-history-area").hide();
                    return
                }
                var html = [], p;
                for (var i = 0; i < list.length; i++) {
                    p = list[i];
                    p.price = p.priceMode == 2 ? '<em  class="disabled">暂无报价</em>' : "<em>&yen;" + p.price + "</em>";
                    html.push('<li class="swiper-slide">');
                    html.push('<a href="/product/' + p.id + '.html"  title="' + p.name + '"  onclick="pushProHistoryMsg(\'' + ec.encodeForJS(p.code) + '\')" target="_blank">');
                    html.push('<img src="' + ec.mediaPath + p.photoPath + "142_142_" + p.photoName + '" alt="' + p.name + '"/>');
                    html.push('<div class="product-link-detail">');
                    html.push("<p><span>" + p.name + "</span></p>");
                    html.push("" + p.price + "");
                    html.push("</div>");
                    html.push("</a>");
                    html.push("</li>")
                }
                $("#product-history-list").html("");
                $("#product-history-list").html(html.join(" "));
                $("#product-history-area").show();
                ec.product.scroll("product-history-scroll", 5)
            }, null, ec.product.isSale ? null : ec.product.id)
        }
    });
    product.renderGroup(product.setSkuId || product.defaultSku);
    var comb_timer;
    product.renderBundle(product.setSkuId || product.defaultSku);
    var sku = ec.product.getSku();
    sku = ec.product.getSkuInfo(sku);
    ec.form.input.label("#extend-text", "输入IMEI/SN/MEID信息");
    $("#extendProtected").parent().parent().mouseover(function() {
        var a = $("#extendProtected").parent().parent().data("flag");
        if (a == 1) {
            $("#extendProtected").parent().parent().data("flag", "")
        } else {
            $("#extendProtected").parent().parent().addClass("hover")
        }
    });
    $("#extendProtected").parent().parent().mouseout(function() {
        $("#extendProtected").parent().parent().data("flag", "");
        $("#extendProtected").parent().parent().removeClass("hover")
    });
    $("#accidentProtected").parent().parent().mouseover(function() {
        var a = $("#accidentProtected").parent().parent().data("flag");
        if (a == 1) {
            $("#accidentProtected").parent().parent().data("flag", "")
        } else {
            $("#accidentProtected").parent().parent().addClass("hover")
        }
    });
    $("#accidentProtected").parent().parent().mouseout(function() {
        $("#accidentProtected").parent().parent().data("flag", "");
        $("#accidentProtected").parent().parent().removeClass("hover")
    })
});
ec.product.divchange = function(data) {
    var dapType = [0, 1, 3, 4, 5, 6, 2][data];
    ec.dapClick(300021502, {
        productId: ec.product.id,
        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
        type: dapType,
        name: ["", "全部咨询", "常见问题", "商品", "支付", "配送", "售后"][dapType],
        click: 1
    });
    if (data == 1) {
        $("#prddetail_counsel_all").show();
        $("#prddetail_counsel_prd").hide();
        $("#prddetail_counsel_pay").hide();
        $("#prddetail_counsel_trans").hide();
        $("#prddetail_counsel_service").hide();
        $("#prddetail_counsel_ques").hide();
        $("#prd_detail_counsel_2").removeAttr("class");
        $("#prd_detail_counsel_3").removeAttr("class");
        $("#prd_detail_counsel_4").removeAttr("class");
        $("#prd_detail_counsel_5").removeAttr("class");
        $("#prd_detail_counsel_6").removeAttr("class");
        $("#prd_detail_counsel_1").attr("class", "selected")
    } else if (data == 2) {
        $("#prddetail_counsel_all").hide();
        $("#prddetail_counsel_prd").show();
        $("#prddetail_counsel_pay").hide();
        $("#prddetail_counsel_trans").hide();
        $("#prddetail_counsel_service").hide();
        $("#prddetail_counsel_ques").hide();
        $("#prd_detail_counsel_1").removeAttr("class");
        $("#prd_detail_counsel_3").removeAttr("class");
        $("#prd_detail_counsel_4").removeAttr("class");
        $("#prd_detail_counsel_5").removeAttr("class");
        $("#prd_detail_counsel_6").removeAttr("class");
        $("#prd_detail_counsel_2").attr("class", "selected");
        ec.product.counselloadprd({
            pageNumber: 1
        })
    } else if (data == 3) {
        $("#prddetail_counsel_all").hide();
        $("#prddetail_counsel_prd").hide();
        $("#prddetail_counsel_pay").show();
        $("#prddetail_counsel_trans").hide();
        $("#prddetail_counsel_service").hide();
        $("#prddetail_counsel_ques").hide();
        $("#prd_detail_counsel_1").removeAttr("class");
        $("#prd_detail_counsel_2").removeAttr("class");
        $("#prd_detail_counsel_4").removeAttr("class");
        $("#prd_detail_counsel_5").removeAttr("class");
        $("#prd_detail_counsel_6").removeAttr("class");
        $("#prd_detail_counsel_3").attr("class", "selected");
        ec.product.paycounselload({
            pageNumber: 1
        })
    } else if (data == 4) {
        $("#prddetail_counsel_all").hide();
        $("#prddetail_counsel_prd").hide();
        $("#prddetail_counsel_pay").hide();
        $("#prddetail_counsel_trans").show();
        $("#prddetail_counsel_service").hide();
        $("#prddetail_counsel_ques").hide();
        $("#prd_detail_counsel_2").removeAttr("class");
        $("#prd_detail_counsel_3").removeAttr("class");
        $("#prd_detail_counsel_1").removeAttr("class");
        $("#prd_detail_counsel_5").removeAttr("class");
        $("#prd_detail_counsel_6").removeAttr("class");
        $("#prd_detail_counsel_4").attr("class", "selected");
        ec.product.transcounselload({
            pageNumber: 1
        })
    } else if (data == 5) {
        $("#prddetail_counsel_all").hide();
        $("#prddetail_counsel_prd").hide();
        $("#prddetail_counsel_pay").hide();
        $("#prddetail_counsel_trans").hide();
        $("#prddetail_counsel_service").show();
        $("#prddetail_counsel_ques").hide();
        $("#prd_detail_counsel_1").removeAttr("class");
        $("#prd_detail_counsel_3").removeAttr("class");
        $("#prd_detail_counsel_4").removeAttr("class");
        $("#prd_detail_counsel_2").removeAttr("class");
        $("#prd_detail_counsel_6").removeAttr("class");
        $("#prd_detail_counsel_5").attr("class", "selected");
        ec.product.sercounselload({
            pageNumber: 1
        })
    } else {
        $("#prddetail_counsel_all").hide();
        $("#prddetail_counsel_prd").hide();
        $("#prddetail_counsel_pay").hide();
        $("#prddetail_counsel_trans").hide();
        $("#prddetail_counsel_service").hide();
        $("#prddetail_counsel_ques").show();
        $("#prd_detail_counsel_1").removeAttr("class");
        $("#prd_detail_counsel_3").removeAttr("class");
        $("#prd_detail_counsel_4").removeAttr("class");
        $("#prd_detail_counsel_5").removeAttr("class");
        $("#prd_detail_counsel_2").removeAttr("class");
        $("#prd_detail_counsel_6").attr("class", "selected")
    }
}
;
ec.product.counselloadall = function(page) {
    (new ec.ajax).submit({
        url: "/product/query/consultation/" + ec.product.id + ".json",
        data: {
            prdId: ec.product.id,
            dataType: 0,
            pageNumber: page.pageNumber,
            pageSize: 3
        },
        timeout: 1e4,
        timeoutFunction: function() {
            alert(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.showError(json);
                return
            }
            var html = [];
            html = ec.product.createcounselhtml(json);
            $("#all_prd_counsel_content").html(html.join(""));
            ec.product.allrenderPage(json.page)
        }
    })
}
;
ec.product.allrenderPage = function(page) {
    $("#all_prd_counsel").show();
    $("#all_prd_counsel").pager({
        pageNumber: page.pageNumber,
        pageCount: page.totalPage,
        pageSize: 3,
        text: {
            first: "|&lt;",
            pre: "&lt",
            next: "&gt;",
            last: "&gt;|"
        },
        item: ["first", "pre", "qpage", "next", "last", "quickPager"],
        callBack: ec.product.counselloadall
    });
    ec.product.pagerScroll("all_prd_counsel")
}
;
ec.product.counselloadprd = function(page) {
    (new ec.ajax).submit({
        url: "/product/query/consultation/" + ec.product.id + ".json",
        data: {
            prdId: ec.product.id,
            dataType: 1,
            pageNumber: page.pageNumber,
            pageSize: 3
        },
        timeout: 1e4,
        dataType: "json",
        timeoutFunction: function() {
            alert(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.showError(json);
                return
            }
            var html = [];
            html = ec.product.createcounselhtml(json);
            $("#prd_prd_counsel_content").html(html.join(""));
            if (json.page.totalRow > 0) {
                $("#prddetail_counsel_prd_total > div:first-child").html("共" + json.page.totalRow + "条")
            } else {
                $("#prddetail_counsel_prd_total").hide()
            }
            ec.product.prdrenderPage(json.page)
        }
    })
}
;
ec.product.prdrenderPage = function(page) {
    $("#prd_prd_counsel").show();
    $("#prd_prd_counsel").pager({
        pageNumber: page.pageNumber,
        pageCount: page.totalPage,
        pageSize: 3,
        text: {
            first: "|&lt;",
            pre: "&lt",
            next: "&gt;",
            last: "&gt;|"
        },
        item: ["first", "pre", "qpage", "next", "last", "quickPager"],
        callBack: ec.product.counselloadprd
    });
    ec.product.pagerScroll("prd_prd_counsel")
}
;
ec.product.paycounselload = function(page) {
    (new ec.ajax).submit({
        url: "/product/query/consultation/" + ec.product.id + ".json",
        data: {
            prdId: ec.product.id,
            dataType: 2,
            pageNumber: page.pageNumber,
            pageSize: 3
        },
        dataType: "json",
        timeout: 1e4,
        timeoutFunction: function() {
            alert(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.showError(json);
                return
            }
            var html = [];
            html = ec.product.createcounselhtml(json);
            $("#pay_prd_counsel_content").html(html.join(""));
            if (json.page.totalRow > 0) {
                $("#prddetail_counsel_pay_total > div:first-child").html("共" + json.page.totalRow + "条")
            } else {
                $("#prddetail_counsel_pay_total").hide()
            }
            ec.product.payrenderPage(json.page)
        }
    })
}
;
ec.product.payrenderPage = function(page) {
    $("#pay_prd_counsel_page").show();
    $("#pay_prd_counsel_page").pager({
        pageNumber: page.pageNumber,
        pageCount: page.totalPage,
        pageSize: 3,
        text: {
            first: "|&lt;",
            pre: "&lt",
            next: "&gt;",
            last: "&gt;|"
        },
        item: ["first", "pre", "qpage", "next", "last", "quickPager"],
        callBack: ec.product.paycounselload
    });
    ec.product.pagerScroll("pay_prd_counsel_page")
}
;
ec.product.transcounselload = function(page) {
    (new ec.ajax).submit({
        url: "/product/query/consultation/" + ec.product.id + ".json",
        data: {
            prdId: ec.product.id,
            dataType: 3,
            pageNumber: page.pageNumber,
            pageSize: 3
        },
        timeout: 1e4,
        dataType: "json",
        timeoutFunction: function() {
            alert(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.showError(json);
                return
            }
            var html = [];
            html = ec.product.createcounselhtml(json);
            $("#trans_prd_counsel_content").html(html.join(""));
            if (json.page.totalRow > 0) {
                $("#prddetail_counsel_trans_total > div:first-child").html("共" + json.page.totalRow + "条")
            } else {
                $("#prddetail_counsel_trans_total").hide()
            }
            ec.product.transrenderPage(json.page)
        }
    })
}
;
ec.product.transrenderPage = function(page) {
    $("#trans_prd_counsel_page").show();
    $("#trans_prd_counsel_page").pager({
        pageNumber: page.pageNumber,
        pageCount: page.totalPage,
        pageSize: 3,
        text: {
            first: "|&lt;",
            pre: "&lt",
            next: "&gt;",
            last: "&gt;|"
        },
        item: ["first", "pre", "qpage", "next", "last", "quickPager"],
        callBack: ec.product.transcounselload
    });
    ec.product.pagerScroll("trans_prd_counsel_page")
}
;
ec.product.sercounselload = function(page) {
    (new ec.ajax).submit({
        url: "/product/query/consultation/" + ec.product.id + ".json",
        data: {
            prdId: ec.product.id,
            dataType: 4,
            pageNumber: page.pageNumber,
            pageSize: 3
        },
        dataType: "json",
        timeout: 1e4,
        timeoutFunction: function() {
            alert(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.showError(json);
                return
            }
            var html = [];
            html = ec.product.createcounselhtml(json);
            $("#ser_prd_counsel_content").html(html.join(""));
            if (json.page.totalRow > 0) {
                $("#prddetail_counsel_serv_total > div:first-child").html("共" + json.page.totalRow + "条")
            } else {
                $("#prddetail_counsel_serv_total").hide()
            }
            ec.product.serrenderPage(json.page)
        }
    })
}
;
ec.product.serrenderPage = function(page) {
    $("#ser_prd_counsel_page").show();
    $("#ser_prd_counsel_page").pager({
        pageNumber: page.pageNumber,
        pageCount: page.totalPage,
        pageSize: 3,
        text: {
            first: "|&lt;",
            pre: "&lt",
            next: "&gt;",
            last: "&gt;|"
        },
        item: ["first", "pre", "qpage", "next", "last", "quickPager"],
        callBack: ec.product.sercounselload
    });
    ec.product.pagerScroll("ser_prd_counsel_page")
}
;
ec.product.quescounselload = function(page) {
    (new ec.ajax).submit({
        url: "/product/query/frequentyQuestions/" + ec.product.id + ".json",
        data: {
            prdId: ec.product.id,
            pageNumber: page.pageNumber,
            pageSize: 10
        },
        timeout: 1e4,
        timeoutFunction: function() {
            alert(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.showError(json);
                return
            }
            var html = [];
            if (json.page.totalRow > 0) {
                for (var i = 0; i < json.prdFrequentyQuestionsList.length; i++) {
                    var p = json.prdFrequentyQuestionsList[i];
                    html.push("<li>");
                    html.push("<h2>" + ((page.pageNumber - 1) * 10 + i + 1) + "、" + p.question + "</h2>");
                    html.push("<p>" + p.reply + "</p>");
                    html.push("</li>")
                }
            } else {
                html.push('<div class="product-inquire-list"><div class="product-inquire-no">暂无相关内容</div></div>')
            }
            $("#ques_prd_counsel_content").html(html.join(""));
            if (json.page.totalRow > 0) {
                $("#prddetail_counsel_ques_total div:first-child").html("共" + json.page.totalRow + "条")
            } else {
                $("#prddetail_counsel_ques_total").hide()
            }
            ec.product.quesrenderPage(json.page)
        }
    })
}
;
ec.product.quesrenderPage = function(page) {
    $("#ques_prd_counsel_page").show();
    $("#ques_prd_counsel_page").pager({
        pageNumber: page.pageNumber,
        pageCount: page.totalPage,
        pageSize: 10,
        text: {
            first: "|&lt;",
            pre: "&lt",
            next: "&gt;",
            last: "&gt;|"
        },
        item: ["first", "pre", "qpage", "next", "last", "quickPager"],
        callBack: ec.product.quescounselload
    });
    ec.product.pagerScroll("ques_prd_counsel_page")
}
;
ec.product.createcounselhtml = function(json) {
    var html = [];
    if (json.page.totalRow > 0) {
        html.push('<ul class="product-inquire-list">');
        for (var i = 0; i < json.prdConsultationList.length; i++) {
            p = json.prdConsultationList[i];
            var username = p.userName;
            var gradecode = p.gradeCode;
            var date = ec.util.parseDate(p.createTime);
            var answerdate = ec.util.parseDate(p.answerTime);
            html.push('<li> <div class="product-inquire-user">网友');
            html.push("<span>" + ec.autoEncodeAttr(username) + "</span>");
            html.push("<em>" + date.format("yyyy-MM-dd HH:mm:ss") + "</em></div>");
            html.push('<div class="product-inquire-question">');
            html.push("<label>咨询内容：</label><span>" + ec.autoEncodeAttr(p.question) + "</span></div>");
            html.push('<div class="product-inquire-answer">');
            html.push("<p><label>回复：</label>" + ec.autoEncodeAttr(p.answer) + "</p>");
            html.push("<em>" + answerdate.format("yyyy-MM-dd HH:mm:ss") + "</em>");
            html.push("</div></li>")
        }
        html.push("</ul>")
    } else {
        html.push('<div class="product-inquire-list"><div class="product-inquire-no">暂无相关内容</div></div>')
    }
    return html
}
;
ec.product.loginCheckBefCoun = function() {
    ec.account.afterLogin(function() {
        $("#counseltextid").focus();
        $("#error-span").hide()
    })
}
;
ec.product.submitCounsel = function() {
    var temptext = $("#counseltextid").val();
    var typeValue = $('input[name="type"]').val();
    var text = ec.product.optCompany(temptext);
    if (text == null || text.length < 1) {
        $("#error-span").show();
        $("#error-span").html("提交内容为空");
        return
    } else {
        var reg = new RegExp(addressFrontRegex);
        var textCopy = text.split("").filter(function(r) {
            return reg.test(r)
        }).join("");
        if (textCopy != text) {
            $("#error-span").show();
            $("#error-span").html("您提交的内容含有非法字符");
            return
        }
    }
    if (text.length > 100) {
        $("#error-span").show();
        $("#error-span").html("输入的文字长度不能超过100个字,请重新输入");
        return
    }
    if (ec.product.name != null) {
        ec.product.name = ec.product.name.transHtmlAttribute()
    }
    var safeEmail = "";
    if ($("#safeEmail").attr("checked")) {
        safeEmail = "1"
    }
    ec.dapClick(300021503, {
        productId: ec.product.id,
        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
        type: Number(typeValue) + 2,
        name: ["", "商品咨询", "支付", "配送", "售后"][typeValue],
        click: 1
    });
    (new ec.ajax).post({
        url: domainMain + "/member/addUserRemarkView.json?t=" + (new Date).getTime(),
        dataType: "json",
        data: {
            orderCode: "comments"
        },
        timeout: 1e4,
        timeoutFunction: function() {
            alert(timeOutInfo);
            return false
        },
        successFunction: function(json) {
            if (!json.success) {
                ec.product.syncCustomSession()
            }
            $.ajax({
                url: "/product/save/consultation.json",
                type: "POST",
                dataType: "json",
                data: {
                    productId: ec.product.id,
                    productName: ec.product.name,
                    question: temptext,
                    type: typeValue,
                    email: safeEmail,
                    carrierCode: ec.product.seCode,
                    carrierName: $("#shopName").val()
                },
                success: function(json) {
                    if (!json.success) {
                        if (json.msg == "notRealName") {
                            ec.product.commentsTip()
                        } else {
                            $("#error-span").show();
                            $("#error-span").html(json.msg)
                        }
                    } else {
                        if ($("#safeEmail").attr("checked")) {
                            ec.product.counselSuccess(json.changeEmailUrl)
                        } else {
                            new ec.box('<div class="box-content" style="height: auto;"><div class="box-prompt01-success"><div class="h"><i></i></div><div class="b"><p class="f18" style="color: #3a3a3a; font-size:18px;">提交成功，我们将尽快为您解答～</p></div></div><div class="box-button"><a href="javascript:;" class="box-ok"><span>知道了</span></a></div></div>',{
                                boxid: "jb-uni-" + (new Date).getTime(),
                                boxclass: "ol_box_4",
                                width: 460,
                                showButton: false
                            }).open()
                        }
                        $("#counsel_content_form")[0].reset();
                        $("#error-span").hide();
                        return
                    }
                }
            })
        }
    })
}
;
ec.product.commentsTip = function() {
    new ec.box($("#realNameComment").val(),{
        boxclass: "ol_box_4",
        title: "",
        width: 540,
        showButton: false,
        autoHeight: false,
        onok: function() {}
    }).open()
}
;
ec.product.optCompany = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}
;
ec.product.counselSuccess = function(url) {
    ec.account.afterLogin(function() {
        ec.product.syncCustomSession();
        var email = ec.product.email;
        var txt = ""
          , btn = "";
        if (ec.util.isEmpty(email)) {
            txt = "提交成功，我们将尽快为您解答。<br>回复将发送到您的邮箱，您还未绑定，请先绑定安全邮箱。";
            btn = '<a href="' + url + '" class="box-sure" target="_blank" onclick="ec.product.secEmailOper()"><span>去绑定</span></a>'
        } else {
            txt = "客服回复将发送到您的安全邮箱：" + email + "，可点击修改安全邮箱。";
            btn = '<a href="' + url + '" class="box-sure" target="_blank" onclick="ec.product.secEmailOper()"><span>修改安全邮箱</span></a>'
        }
        var box = new ec.box('<div class="box-content" style="height: auto;">            <div class="box-prompt01-success">                <div class="h">                    <i></i>                </div>                <div class="b">                    <p class="f18" style="color:#3a3a3a; line-height:24px; font-size:18px;">' + txt + '</p>                </div>            </div>            <div class="box-button">' + btn + "</div>        </div>",{
            boxid: "jb-uni-" + (new Date).getTime(),
            boxclass: "ol_box_4",
            width: 460,
            showButton: false
        });
        box.open();
        ec.product.secEmailOper = function() {
            box.close();
            $(".ol_box_mask").remove()
        }
    })
}
;
ec.product.combChange = function(data) {
    var currentLi = $(data).parent();
    currentLi.addClass("current");
    currentLi.siblings().not(currentLi).removeClass("current");
    var ulId = currentLi.parent().attr("id");
    var skuId = ulId.substring(14, ulId.length);
    var index = currentLi.index();
    var cuttentDivs = $("#comb-pro-" + ec.product.getSku() + "-" + index);
    var cuttentDiv = cuttentDivs.eq(index);
    cuttentDivs.show();
    cuttentDivs.siblings(".product-recommend-con").hide()
}
;
ec.product.syncCustomSession = function() {
    ec.account.syncCustomSession(function(json) {
        if (!ec.util.isEmpty(json.customerInfo)) {
            ec.product.email = json.customerInfo.email;
            ec.product.mobile = json.customerInfo.mobile
        }
    })
}
;
ec.product.giftshow = function() {
    if (ec.gift2019.hasNewGift()) {
        return ec.gift2019.showChooser()
    }
    var box = new ec.box($("#pro-gift-box").html(),{
        boxclass: "ol_box_4",
        title: "选择赠品颜色",
        showButton: false,
        autoHeight: false
    });
    box.open();
    var dapData = {
        productId: ec.product.id,
        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
        giftSKUCode: [],
        click: 1
    };
    var dapFinalGift = ec.product.gift.finalMainSbomGiftMap[ec.product.getSku()] || {};
    for (var k in dapFinalGift) {
        dapData.giftSKUCode.push(dapFinalGift[k].giftSkuCode);
        $("#ol_box #gift-detail-name" + k).parent().find("span.num").text("x" + Number($("#pro-quantity").val() || 1) * dapFinalGift[k].qty)
    }
    ec.dapClick(300021701, dapData);
    $(".box-content").find("#pro-gift-list-detail").parent().siblings().show().html('<a href="javascript:;" class="box-cancel" onclick="ec.product.boxCancle()"><span>取消</span></a><a href="javascript:;" class="box-sure" id="box-sures" ><span>确认</span></a>');
    $("div[id^='pro-gift-list-detail'] li a").on("click", function(event) {
        if ($(this).parent().hasClass("selected")) {
            $(this).parent().parent().find("li").removeClass("new");
            $(this).parent().addClass("new");
            return
        }
        $(this).parent().parent().find("li").removeClass("selected");
        $(this).parent().addClass("selected");
        $(this).parent().parent().find("li").removeClass("new");
        $(this).parent().addClass("new");
        var mainSku = ec.product.getSku();
        var multiGiftVO = ec.product.gift.mainSkuGiftMap[mainSku];
        var finalGift = ec.product.gift.finalMainSbomGiftMap[mainSku];
        var choseGiftKey = $(this).attr("key");
        var gift = multiGiftVO[choseGiftKey];
        var defaultGiftKey = $(this).attr("defaultGiftKey");
        finalGift[defaultGiftKey] = gift;
        $("#ol_box").find("#gift-detail-" + defaultGiftKey).find("img").attrS("src", ec.mediaPath + gift.photoPath + ec.product.gift.middleImgSize + gift.photoName);
        $("#ol_box").find("#gift-detail-" + defaultGiftKey).attr("href", "/product/" + gift.giftId + ".html#" + gift.giftSkuId);
        $("#ol_box").find("#gift-detail-name" + defaultGiftKey).html(gift.giftName);
        $("#ol_box").find("#gift-detail-name" + defaultGiftKey).parent().find("span.num").text("x" + Number($("#pro-quantity").val() || 1) * gift.qty);
        ec.dapClick(300021702, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            giftSKUCode: gift.giftSkuCode,
            click: 1
        })
    });
    $("#box-sures").bind("click", function(event) {
        var dapGiftSKUCode = [];
        $("div[id^='ol_box'] li.selected").each(function() {
            var mainSku = ec.product.getSku();
            var multiGiftVO = ec.product.gift.mainSkuGiftMap[mainSku];
            var finalGift = ec.product.gift.finalMainSbomGiftMap[mainSku];
            var choseGiftKey = $(this).children("a").attr("key");
            var gift = multiGiftVO[choseGiftKey];
            var defaultGiftKey = $(this).children("a").attr("defaultGiftKey");
            finalGift[defaultGiftKey] = gift;
            dapGiftSKUCode.push(gift.giftSkuCode);
            $("#ol_box").find("#gift-detail-" + defaultGiftKey).find("img").attrS("src", ec.mediaPath + gift.photoPath + ec.product.gift.middleImgSize + gift.photoName);
            $("#ol_box").find("#gift-detail-" + defaultGiftKey).attr("href", "/product/" + gift.giftId + ".html#" + gift.giftSkuId);
            $("#ol_box").find("#gift-detail-name" + defaultGiftKey).html(gift.giftName);
            $("#ol_box").find("#gift-detail-name" + defaultGiftKey).parent().find("span.num").text("x" + Number($("#pro-quantity").val() || 1) * gift.qty);
            $("#gift-" + defaultGiftKey).attr("href", "/product/" + gift.giftId + ".html#" + gift.giftSkuId);
            $("#gift-" + defaultGiftKey).attrS("title", "" + gift.giftName);
            $("#gift-" + defaultGiftKey).attr("key", choseGiftKey);
            $("#gift-" + defaultGiftKey).find("img").attrS("src", ec.mediaPath + gift.photoPath + ec.product.gift.middleImgSize + gift.photoName);
            $("#gift-" + defaultGiftKey).find("img").attrS("alt", "" + gift.giftName)
        });
        var html = $("#ol_box").find("#pro-gift-list-detail").html();
        $("#pro-gift-list-detail").html("");
        $("#pro-gift-list-detail").append(html);
        $(".ol_box_mask").remove();
        $("#ol_box").hide();
        ec.dapClick(300021703, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            giftSKUCode: dapGiftSKUCode,
            click: 1
        })
    })
}
;
ec.product.boxCancle = function() {
    $(".ol_box_mask").remove();
    $("#ol_box").remove()
}
;
ec.product.splitMobile = function(mobile) {
    var result = "";
    for (var i = 0; i < mobile.length; i++) {
        if ((mobile.length - i) % 4 == 0) {}
        result += mobile.substring(i, i + 1)
    }
    return result
}
;
ec.product.getPackageAndService = function(skuId) {
    var packageContent = ec.product.packageList[skuId];
    var serviceContent = ec.product.warranty[skuId];
    var hasPackage = packageContent ? true : false;
    var hasService = serviceContent ? true : false;
    var hasBoth = hasPackage && hasService;
    packFlag = !hasPackage && !hasService;
    $("#pro-tab-package-service-content").empty();
    $("#pro-tab-service-content").empty();
    $("#pro-tab-package-service-content").hide();
    $("#packagTitleId").hide();
    $("#customerServiceTitle").hide();
    $("#customerServiceDiv").hide();
    $("#pro-tab-package-service").hide();
    if (hasPackage) {
        $("#pro-tab-package-service-content").html(packageContent);
        $("#pro-tab-package-service-content").show();
        $("#packagTitleId").show();
        $("#pro-tab-package-service").show()
    }
    if (hasService) {
        $("#pro-tab-service-content").html(serviceContent);
        $("#customerServiceTitle").show();
        $("#customerServiceDiv").show();
        $("#pro-tab-package-service").show()
    }
}
;
ec.product.getFeature = function(skuId) {
    if (ec.product.getSkuForFeature(skuId) != undefined || $("#pro-detail-content-" + skuId).length > 0) {
        $("#pro-tab-parameter").removeClass("selected");
        $("#pro-tab-feature").addClass("selected").show();
        $("#pro-detail-contents").show();
        $("#pro-detail-content-" + (ec.product.setSkuId || skuId)).show().siblings().hide();
        ec.product.payVideo();
        return
    }
    (new ec.ajax).get({
        url: "/product/querySkuDetailFeature/" + ec.product.getSku() + ".json",
        timeout: 1e4,
        timeoutFunction: function() {
            $("#pro-detail-contents > div:first-child").html(timeOutInfo)
        },
        successFunction: function(json) {
            if (!json.success) {
                $("#pro-tab-feature").removeClass("selected").hide();
                $("#pro-tab-parameter").addClass("selected");
                $("#pro-detail-contents").hide();
                return
            }
            if (json.length == 0) {
                $("#pro-tab-feature").removeClass("selected").hide();
                $("#pro-tab-parameter").addClass("selected");
                $("#pro-tab-feature").hide();
                $("#pro-detail-contents").hide();
                return
            }
            $("#pro-tab-parameter").removeClass("selected");
            $("#pro-tab-feature").addClass("selected");
            $("#pro-tab-feature").show();
            $("#pro-detail-contents").show();
            ec.product.setSkuForFeature(skuId);
            var content = [];
            content.push('<div id="pro-detail-content-' + json.id + '" class="pro-detail-see">');
            content.push('<div id="kindPicture-' + json.id + '">');
            content.push(json.detail);
            content.push("</div>");
            content.push('<div id="detail-content-button-' + json.id + '" class="product-shade hide"><p>');
            content.push('<a id="pro-detail-down-btn-' + json.id + '" class="product-detail-btn">');
            content.push("查看全部产品详情</a></p></div>");
            content.push('<a href="javascript:;" id="pro-detail-up-btn-' + json.id + '" class="product-detail-btnup hide">收起全部产品详情</a>');
            content.push("</div>");
            var feature = $("#pro-tab-feature-content > div:first-child");
            feature.prepend(content.join(""));
            if (masterPlayer) {
                setTimeout(function() {
                    masterPlayer.dispose()
                }, 300)
            }
            ec.product.payVideo();
            $("#pro-detail-content-" + (ec.product.setSkuId || skuId)).show().siblings().hide();
            var imgHeight = 0;
            $("#pro-detail-content-" + (ec.product.setSkuId || skuId) + " img").each(function(index) {
                $(this).load(function() {
                    imgHeight = imgHeight + $(this).height();
                    if (imgHeight >= 2e3) {
                        $("#pro-detail-content-" + json.id).height("2000");
                        $("#detail-content-button-" + json.id).show();
                        $("#pro-detail-down-btn-" + json.id).click(function() {
                            $("#pro-detail-content-" + json.id).height($("#kindPicture-" + json.id).height() + $("#pro-detail-up-btn-" + json.id).height() + 40);
                            $("#detail-content-button-" + json.id).hide();
                            $("#pro-detail-up-btn-" + json.id).css("display", "block");
                            upDownButton = "true";
                            ec.dapClick(300021301, {
                                productId: ec.product.id,
                                SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                                type: 1,
                                click: 1
                            })
                        });
                        $("#pro-detail-up-btn-" + json.id).click(function() {
                            $("#pro-detail-content-" + json.id).height("2000");
                            $("#detail-content-button-" + json.id).show();
                            $("#pro-detail-up-btn-" + json.id).css("display", "none");
                            upDownButton = "false";
                            ec.dapClick(300021301, {
                                productId: ec.product.id,
                                SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                                type: 2,
                                click: 1
                            });
                            $("body,html").animate({
                                scrollTop: tit1 + 1575
                            }, 0)
                        });
                        return false
                    }
                })
            });
            if (imgHeight < 2e3) {
                $("#detail-content-button-" + json.id).hide()
            }
            ec.diypkg.init()
        },
        errorFunction: function() {
            $("#pro-tab-feature").removeClass("selected").hide();
            $("#pro-tab-parameter").addClass("selected");
            $("#pro-detail-contents").hide()
        },
        timeoutFunction: function() {
            $("#pro-tab-feature").removeClass("selected").hide();
            $("#pro-tab-parameter").addClass("selected");
            $("#pro-detail-contents").hide()
        }
    })
}
;
var masterPlayer;
ec.product.payVideo = function() {
    var skuId = ec.product.getSku();
    var video = $("#pro-detail-content-" + skuId).find(".J_videoTrigger");
    $("#player-container-id").remove();
    if (video) {
        if (!$("#pro-detail-content-" + skuId).find("video") || $("#pro-detail-content-" + skuId).find("video").length == 0) {
            var videoUrl = video.attr("data-video");
            if (videoUrl && videoUrl != "") {
                video.find("span.video-btn").remove();
                video.append("<span class='video-btn'></span>");
                var playerContainerId = "player-container-id-" + skuId;
                video.unbind("click");
                video.click(function() {
                    videoUrl = $(this).attr("data-video");
                    var videoHtml = '<video id="' + playerContainerId + '" preload="auto"  playsinline webkit-playinline x5-playinline src="' + ec.autoEncodeAttr(videoUrl) + '"></video>';
                    var videoBox = new ec.box(videoHtml,{
                        boxid: "video-box",
                        boxclass: "ol_box_4 video-detail",
                        width: 800,
                        height: 450,
                        draggable: false,
                        showButton: false,
                        zIndex: 1001,
                        onclose: function(dom) {
                            masterPlayer.dispose()
                        }
                    }).open();
                    masterPlayer = TCPlayer(playerContainerId, {
                        autoplay: true
                    })
                })
            }
        }
    }
}
;
ec.product.rushbuyActivity = function(countTemp) {
    rush.business.doIfSbomChanged(countTemp)
}
;
ec.product.switched = function(value, thix) {
    $("input[name='type']").valS(value);
    $(thix).addClass("selected").siblings().removeClass("selected")
}
;
ec.product.getParameter = function(skuIds, skuCodes) {
    $("#parameterDetailTips").hide();
    if (ec.product.getSkuForParement(skuIds) != undefined) {
        $("#main-parameter-content-" + (ec.product.setSkuId || skuId)).show().siblings().hide();
        $("#content-" + (ec.product.setSkuId || skuId)).show().siblings().hide();
        $("#productParameterId").show();
        return
    }
    var skuList = skuIds.split(",");
    var skuCodeList = skuCodes.split(",");
    var reqParam = "";
    for (var i = 0; i < skuCodeList.length; i += 1) {
        reqParam += skuCodeList[i];
        if (i == 0) {
            break
        }
    }
    $.ajax({
        url: domainMain + "/product/querySpecificationMulti/" + reqParam + ".json?",
        dataType: "json",
        timeout: 2e4,
        success: function(json) {
            if (!json.success) {
                $("#parameterDetailTips").show();
                return
            }
            $("#parameterDetailTips").hide();
            ec.product.setSkuForParement(skuIds);
            for (var n = 0; n < skuList.length; n += 1) {
                var skuId = skuList[n];
                var sbomCode = skuCodeList[n];
                var attrs = null;
                var mainAttrs = null;
                for (var m = 0; m < json.info.length; m += 1) {
                    var specificationInfo = json.info[m];
                    if (sbomCode == specificationInfo.sbomCode) {
                        attrs = specificationInfo.specificationList;
                        mainAttrs = specificationInfo.majorSpecificationList;
                        break
                    }
                }
                var mainHtml = [];
                if (mainAttrs != null && mainAttrs.length > 0) {
                    var mainP;
                    mainHtml.push("<h2>主要参数</h2>");
                    mainHtml.push("<ul>");
                    for (var j = 0; j < mainAttrs.length; j++) {
                        mainP = mainAttrs[j];
                        if (mainP.attrValue != null && mainP.attrValue != "" && mainP.attrValue != undefined) {
                            mainHtml.push("<li><label>" + mainP.attrName + "</label><span>" + mainP.attrValue + "</span>");
                            if (mainP.attrRemark && mainP.attrRemark != "") {
                                mainHtml.push('<div class="parameter-detail">备注：' + mainP.attrRemark + "</div>")
                            }
                            mainHtml.push("</li>")
                        }
                    }
                    mainHtml.push("</ul>")
                }
                $("#product-parameter-main").append('<div id="main-parameter-content-' + skuId + '" class="product-parameter-main clearfix hide">' + mainHtml.join("") + "</div>");
                $("#main-parameter-content-" + (ec.product.setSkuId || skuId)).show().siblings().hide();
                var html = [];
                if (attrs) {
                    var p;
                    var html0 = [];
                    for (var i = 0; i < attrs.length; i++) {
                        p = attrs[i];
                        var html1 = [];
                        if ("0" == p.parentAttrCode) {
                            html1.push('<div class="product-parameter-list clearfix">');
                            html1.push("<h2>" + p.attrName + "</h2>");
                            var code = p.attrCode;
                            var html2 = [];
                            html2.push("<ul>");
                            for (var j = 0; j < attrs.length; j++) {
                                var p2 = attrs[j];
                                if (p2.parentAttrCode != "0" && p2.parentAttrCode == code) {
                                    html2.push("<li><label>" + p2.attrName + "</label><span>" + ec.autoEncodeAttr(p2.attrValue) + "</span>");
                                    if (p2.attrRemark && p2.attrRemark != "") {
                                        html2.push('<div class="parameter-detail">备注：' + p2.attrRemark + "</div>")
                                    }
                                    html2.push("</li>")
                                }
                            }
                            html2.push("</ul>");
                            if (html2.length > 2) {
                                html0.push(html1.join(""));
                                html0.push(html2.join(""));
                                html0.push("</div>")
                            }
                        }
                    }
                    html0.push('<div class="product-parameter-list product-parameter-code clearfix">');
                    html0.push("<h2>商品编码</h2>");
                    html0.push("<ul><li><label>" + sbomCode + "</label><span></span></li></ul></div>");
                    if (html0.length > 0) {
                        html.push('<div id="content-' + skuId + '" >');
                        html.push('<div id="parameterContentButton-' + skuId + '" class="product-shade hide">');
                        html.push('<p><a id="parameterDownButton-' + skuId + '"  href="javascript:;"  class="product-detail-btn">查看全部参数</a></p>');
                        html.push("</div>");
                        html.push('<div id="pro-tab-parameter-content-' + skuId + '" class="layout">');
                        html.push('<div id="parameter-content-' + skuId + '">');
                        html.push(html0.join(""));
                        html.push("</div>");
                        html.push("</div>");
                        html.push('<a id="parameterUpButton-' + skuId + '" href="javascript:;" class="product-detail-btnup hide">收起参数详情</a>');
                        html.push("</div>")
                    }
                }
                $("#productDetailParameter").prepend(html.join(""));
                $("#content-" + (ec.product.setSkuId || skuId)).show().siblings().hide()
            }
            $("#productParameterId").show();
            var sku = ec.product.getSku();
            sku = ec.product.getSkuInfo(sku);
            var detailHeight = $("#parameter-content-" + sku.id).height();
            if (detailHeight <= 540 && detailHeight > 0) {
                $("#parameterContentButton-" + sku.id).removeClass("show").addClass("hide")
            } else {
                $("#parameterContentButton-" + sku.id).removeClass("hide").addClass("show");
                $("#pro-tab-parameter-content-" + sku.id).css({
                    height: "540",
                    overflow: "hidden"
                });
                $("#parameterDownButton-" + sku.id).click(function() {
                    $("#pro-tab-parameter-content-" + sku.id).height($("#parameter-content-" + sku.id).height());
                    $("#parameterContentButton-" + sku.id).removeClass("show").addClass("hide");
                    $("#parameterUpButton-" + sku.id).removeClass("hide").addClass("show");
                    ec.dapClick(300021301, {
                        productId: ec.product.id,
                        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                        type: 1,
                        click: 1
                    })
                });
                $("#parameterUpButton-" + sku.id).click(function() {
                    $("#parameterContentButton-" + sku.id).removeClass("hide").addClass("show");
                    $("#parameterUpButton-" + sku.id).removeClass("show").addClass("hide");
                    $("#pro-tab-parameter-content-" + sku.id).height("540");
                    $("body,html").animate({
                        scrollTop: tit1 + $("#pro-tab-feature-content").height() + $("#hr60Detail").height() + 270
                    }, 0);
                    ec.dapClick(300021301, {
                        productId: ec.product.id,
                        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                        type: 2,
                        click: 1
                    })
                })
            }
        },
        error: function() {
            $("#parameterDetailTips").show()
        }
    })
}
;
function stopConsultation() {
    $("#stopConsultationId").hide();
    $("#myConsultation").show();
    $("#upUserAdvisory").removeClass("show").addClass("hide");
    ec.dapClick(300021501, {
        productId: ec.product.id,
        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
        type: 2,
        click: 1
    })
}
ec.product.switchSku = function() {
    oTop = $(".product-tab").offset().top;
    clickFlag = false
}
;
ec.product.pagerScroll = function(id) {
    $("#" + id + " li.link").click(function() {
        $("html, body").animate({
            scrollTop: $("#productAsk").offset().top - $("#product-tab").height()
        })
    })
}
;
ec.product.serverCommodity = function(id) {
    var num = $("#" + id + " ul li").length
      , lineNum = Math.ceil((num - 1) / 2);
    liHeight = $("#" + id + " ul li").height();
    $("#" + id + " ul li").eq(0).css({
        height: lineNum * 24 - 6
    })
}
;
ec.product.scroll = function(id, num) {
    var $div = $("#" + id).parent().parent();
    var len = $div.find(".swiper-slide").length;
    if (len <= num) {
        $div.find(".swiper-button-prev").addClass("disabled");
        $div.find(".swiper-button-next").addClass("disabled")
    } else {
        $div.find(".swiper-button-next").removeClass("disabled")
    }
    var mySwiper = new Swiper("#" + id,{
        slidesPerView: num,
        slidesPerGroup: num
    });
    $div.find(".swiper-button-prev").click(function() {
        mySwiper.swipePrev()
    });
    $div.find(".swiper-button-next").click(function() {
        mySwiper.swipeNext()
    })
}
;
$(document).ready(function() {
    var c = $(".swiper-container")
      , a = [];
    c.each(function(f, g) {
        var xid = $(this).attr("id");
        if (!("" + xid).startsWith("omb-pro-")) {
            a.push(xid)
        }
    });
    $.each(a, function(f, g) {
        var totalLen = $("#" + g).find(".swiper-slide").length;
        if (totalLen <= 5) {
            $("#" + g).parent().find(".swiper-button-prev").hide();
            $("#" + g).parent().find(".swiper-button-next").hide()
        } else {
            $("#" + g).find(".swiper-button-next").show()
        }
        var mySwiper = new Swiper("#" + g,{
            slidesPerView: 2,
            slidesPerGroup: 2
        });
        $("#" + g).parent().find(".btn-prev").click(function() {
            mySwiper.swipePrev()
        });
        $("#" + g).parent().find(".btn-next").click(function() {
            mySwiper.swipeNext()
        })
    });
    $("#pro-relation-scroll").find("li").mousedown(function() {
        return false
    })
});
function pushProHistoryMsg(productId) {
    ec.dapClick(300020801, {
        productId: ec.product.id,
        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
        linkSKUCode: productId,
        click: "1"
    })
}
function dapProtectedSkuLink(obj) {
    ec.dapClick(300022302, {
        productId: ec.product.id,
        SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
        index: {
            ucareProtected: 1,
            accidentProtected: 2,
            extendProtected: 3
        }[$(obj).closest(".product-service-list").attr("id")],
        secSKUCode: $(obj).closest(".product-service-listcon").attr("data-scode"),
        click: 1
    })
}
var servicePrdRes = {};
function checkedThis(obj, id, cname, idName) {
    var boxArray = document.getElementsByName(cname);
    var checkBoxObj = $(obj).children("input:first-child")[0];
    if ($("#" + id).hasClass("red")) {
        checkBoxObj.checked = false;
        $("#" + idName).parent().parent().removeClass("hover")
    } else {
        for (var i = 0; i <= boxArray.length - 1; i++) {
            if (boxArray[i] == checkBoxObj) {
                boxArray[i].checked = true;
                if (idName == "extendProtected" || idName == "accidentProtected") {
                    $('#ucareProtected input[type="checkbox"]').removeAttr("checked");
                    $("#ucareProtected .product-service-listcon.red").removeClass("red");
                    $("#ucareProtected").parent().parent().removeClass("selected");
                    $("#ucareSelect").attr("data-scode", "");
                    $("#ucareSelect").attr("skuid", "");
                    $("#ucare-selected").remove()
                }
                if (idName == "ucareProtected") {
                    $('#extendProtected input[type="checkbox"]').removeAttr("checked");
                    $("#extendProtected .product-service-listcon.red").removeClass("red");
                    $("#extendProtected").parent().parent().removeClass("selected");
                    $('#accidentProtected input[type="checkbox"]').removeAttr("checked");
                    $("#accidentProtected .product-service-listcon.red").removeClass("red");
                    $("#accidentProtected").parent().parent().removeClass("selected");
                    $("#extendSelect").attr("data-scode", "");
                    $("#accidentSelect").attr("data-scode", "");
                    $("#extendSelect").attr("skuid", "");
                    $("#accidentSelect").attr("skuid", "");
                    $("#extend-selected").remove();
                    $("#accident-selected").remove()
                }
            } else {
                boxArray[i].checked = false
            }
            $("#extendProtected").parent().parent().removeClass("hover");
            $("#accidentProtected").parent().parent().removeClass("hover");
            $("#ucareProtected").parent().parent().removeClass("hover")
        }
    }
    if ($("input[name=" + cname + "]:checked").length == 0) {
        $("#" + id).removeClass("red");
        $("#" + idName).parent().parent().removeClass("selected");
        var selectNo = $("#" + idName).parent().parent().find("span").eq(0).attr("id");
        $("#" + selectNo).html("");
        $("#" + selectNo).attr("skuid", "");
        $("#" + selectNo).attr("data-scode", "");
        if (idName == "extendProtected") {
            $("#extend-selected").remove();
            servicePrdRes[ec.product.getSku()]["extendSelect"] = false
        }
        if (idName == "accidentProtected") {
            $("#accident-selected").remove();
            servicePrdRes[ec.product.getSku()]["accidentSelect"] = false
        }
        if (idName == "ucareProtected") {
            $("#ucare-selected").remove();
            servicePrdRes[ec.product.getSku()]["ucareSelect"] = false
        }
    } else {
        var attrSelectService = [];
        if ($("#" + id).hasClass("red")) {
            $("#" + id).removeClass("red")
        }
        if (idName == "extendProtected") {
            $("#extendProtected").parent().parent().find("a").eq(0).remove();
            var productId = $("#" + id).attr("id")
              , name = $("#" + id).attr("title");
            name = ec.autoEncodeAttr(name);
            $("#extendSelect").textS(name);
            $("#extendSelect").attr("skuid", $("#" + id).attr("skuID"));
            $("#extendSelect").attr("data-scode", $("#" + id).attr("data-scode"));
            $("#extendSelect").attr("interest-price", $("#" + id).attr("data-price"));
            var textName = '<span class="fl max-w">' + name + '</span><span class="fl">&nbsp;￥' + $("#" + id).attr("data-price") + "</span>";
            $("#extendProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + textName + "</a>");
            $("#extendProtected").parent().parent().addClass("selected");
            $("#" + id).addClass("red");
            $("#extendProtected ul li .product-service-listcon").not("#" + id).removeClass("red");
            $("#extend-selected").remove();
            var temp1 = $("#extendSelect").text();
            temp1 = ec.autoEncodeAttr(temp1);
            if (temp1 != "") {
                attrSelectService.push('<div id="extend-selected" class="inline">&nbsp;/&nbsp;' + temp1 + "</div>");
                var selected_attributes = $("#pro-select-sku").html();
                $("#pro-select-sku").html(selected_attributes + attrSelectService.join(""))
            }
            servicePrdRes[ec.product.getSku()] = servicePrdRes[ec.product.getSku()] || {};
            servicePrdRes[ec.product.getSku()]["extendSelect"] = $("#" + id).attr("data-scode");
            servicePrdRes[ec.product.getSku()]["ucareSelect"] = false
        }
        if (idName == "accidentProtected") {
            $("#accidentProtected").parent().parent().find("a").eq(0).remove();
            var productId = $("#" + id).attr("id")
              , name = $("#" + id).attr("title");
            name = ec.autoEncodeAttr(name);
            $("#accidentSelect").textS(name);
            $("#accidentSelect").attr("skuid", $("#" + id).attr("skuID"));
            $("#accidentSelect").attr("data-scode", $("#" + id).attr("data-scode"));
            $("#accidentSelect").attr("interest-price", $("#" + id).attr("data-price"));
            var textName = '<span class="fl max-w">' + name + '</span><span class="fl">&nbsp;￥' + $("#" + id).attr("data-price") + "</span>";
            $("#accidentProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + textName + "</a>");
            $("#accidentProtected").parent().parent().addClass("selected");
            $("#" + id).addClass("red");
            $("#accidentProtected ul li .product-service-listcon").not("#" + id).removeClass("red");
            $("#accident-selected").remove();
            var temp2 = $("#accidentSelect").text();
            temp2 = ec.autoEncodeAttr(temp2);
            if (temp2 != "") {
                attrSelectService.push('<div id="accident-selected" class="inline">&nbsp;/&nbsp;' + temp2 + "</div>");
                var selected_attributes = $("#pro-select-sku").html();
                $("#pro-select-sku").html(selected_attributes + attrSelectService.join(""))
            }
            servicePrdRes[ec.product.getSku()] = servicePrdRes[ec.product.getSku()] || {};
            servicePrdRes[ec.product.getSku()]["accidentSelect"] = $("#" + id).attr("data-scode");
            servicePrdRes[ec.product.getSku()]["ucareSelect"] = false
        }
        if (idName == "ucareProtected") {
            $("#ucareProtected").parent().parent().find("a").eq(0).remove();
            var productId = $("#" + id).attr("id")
              , name = $("#" + id).attr("title");
            name = ec.autoEncodeAttr(name);
            $("#ucareSelect").textS(name);
            $("#ucareSelect").attr("skuid", $("#" + id).attr("skuID"));
            $("#ucareSelect").attr("data-scode", $("#" + id).attr("data-scode"));
            $("#ucareSelect").attr("interest-price", $("#" + id).attr("data-price"));
            var textName = '<span class="fl max-w">' + name + '</span><span class="fl">&nbsp;￥' + $("#" + id).attr("data-price") + "</span>";
            $("#ucareProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + textName + "</a>");
            $("#ucareProtected").parent().parent().addClass("selected");
            $("#" + id).addClass("red");
            $("#ucareProtected ul li .product-service-listcon").not("#" + id).removeClass("red");
            $("#ucare-selected").remove();
            var temp2 = $("#ucareSelect").text();
            temp2 = ec.autoEncodeAttr(temp2);
            if (temp2 != "") {
                attrSelectService.push('<div id="ucare-selected" class="inline">&nbsp;/&nbsp;' + temp2 + "</div>");
                var selected_attributes = $("#pro-select-sku").html();
                $("#pro-select-sku").html(selected_attributes + attrSelectService.join(""))
            }
            servicePrdRes[ec.product.getSku()] = servicePrdRes[ec.product.getSku()] || {};
            servicePrdRes[ec.product.getSku()]["ucareSelect"] = $("#" + id).attr("data-scode");
            servicePrdRes[ec.product.getSku()]["extendSelect"] = false;
            servicePrdRes[ec.product.getSku()]["accidentSelect"] = false
        }
    }
    var $g = $(obj).closest(".product-service");
    if ($g.hasClass("selected")) {
        ec.dapClick(300022303, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            secSKUCode: $g.children().eq(0).attr("data-scode") || "",
            click: 1
        })
    }
    ec.product.interest.queryFreeDetail();
    ec.product.refreshStyle()
}
ec.product.click_function = function(dom) {
    var domIdName = $(dom).parent().find(".product-service-list").attr("id");
    $(dom).parent().data("flag", "1");
    $("#" + domIdName).parent().parent().removeClass("hover");
    if ($(dom).parent().hasClass("selected")) {
        $(dom).parent().removeClass("selected");
        $(dom).parent().find("p").removeClass("red");
        var select_no = $(dom).parent().find("span").eq(0).attr("id");
        $("#" + select_no).attr("skuid", "");
        $("#" + select_no).attr("data-scode", "");
        $("#" + select_no).attr("interest-price", "");
        if (domIdName == "extendProtected") {
            $("#extendProtected").parent().parent().find("a").eq(0).remove();
            $("#extendProtected ul").find("li").find("input").prop("checked", false);
            $("#extendProtected ul").find("li").find(".product-service-listcon").removeClass("red");
            $("#extend-selected").remove();
            var tempE = $("#extendProtected ul").find("li").eq(0).find(".product-service-listcon");
            var extend_name = '<span class="fl max-w">' + ec.autoEncodeAttr(tempE.attr("title")) + '</span><span class="fl">&nbsp;￥' + tempE.attr("data-price") + "</span>";
            $("#extendProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + extend_name + "</a>")
        }
        if (domIdName == "accidentProtected") {
            $("#accidentProtected").parent().parent().find("a").eq(0).remove();
            $("#accidentProtected ul").find("li").find("input").prop("checked", false);
            $("#accidentProtected ul").find("li").find(".product-service-listcon").removeClass("red");
            $("#accident-selected").remove();
            var tempA = $("#accidentProtected ul").find("li").eq(0).find(".product-service-listcon");
            var accident_name = '<span class="fl max-w">' + ec.autoEncodeAttr(tempA.attr("title")) + '</span><span class="fl">&nbsp;￥' + tempA.attr("data-price") + "</span>";
            $("#accidentProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + accident_name + "</a>")
        }
        if (domIdName == "ucareProtected") {
            $("#ucareProtected").parent().parent().find("a").eq(0).remove();
            $("#ucareProtected ul").find("li").find("input").prop("checked", false);
            $("#ucareProtected ul").find("li").find(".product-service-listcon").removeClass("red");
            $("#ucare-selected").remove();
            var tempA = $("#ucareProtected ul").find("li").eq(0).find(".product-service-listcon");
            var ucare_name = '<span class="fl max-w">' + ec.autoEncodeAttr(tempA.attr("title")) + '</span><span class="fl">&nbsp;￥' + tempA.attr("data-price") + "</span>";
            $("#ucareProtected").parent().before('<a href="javascript:;" onclick="ec.product.click_function(this)" class="product-service-btn">' + ucare_name + "</a>")
        }
        ec.product.interest.queryFreeDetail()
    }
}
;
ec.product.newpackageView = function(dom, packageCode, skuCode) {
    var proPriceHtml = [];
    var sku = ec.product.getSku();
    var skuInfo = ec.product.getSkuInfo(sku);
    ec.product.packageViewChange(dom, packageCode);
    $("#packageCode").valS(packageCode);
    $("#packageList").html("");
    _giftBuyItemId = [];
    if (packageCode == null) {
        if ($("#giftBuy_dl").length > 0) {
            if ($("#giftBuy_dl").hasClass("hide")) {
                $("#giftBuy_dl").removeClass("hide")
            }
            $.each($("#giftBuy_dl").find("li"), function() {
                if ($(this).attr("data-attrname") && $(this).attr("data-attrname").transHtmlAttribute() == "无增值服务") {
                    $(this).addClass("selected");
                    $("#giftBuy-selected").html("/ 无增值服务")
                }
            });
            if ($("#pro-operation").find("a").length == 2 && $("#pro-operation").find("a").first().find("span").html() == "加入购物车") {
                $("#pro-operation").find("a").first().attr("onclick", "").click(function() {
                    ec.product.addCart()
                })
            }
            if ($("#pro-operation").find("a").length == 1 && $("#pro-operation").find("a").first().find("span").html() == "立即下单") {
                $("#pro-operation").attr("data-gift", 0);
                $("#pro-operation").find("a").before('<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01"><span>加入购物车</span></a>')
            }
        }
        if (skuInfo.price != skuInfo.originPrice) {
            $("#pro-price-label").html("抢购价");
            $("#pro-price-label").removeClass("f24").addClass("type");
            $("#pro-price").html("<em>&yen;</em>" + parseFloat(skuInfo.price).toFixed(2));
            $("#pro-price-old").html("&yen;&nbsp;" + parseFloat(skuInfo.originPrice).toFixed(2));
            $("#pro-price-label").show();
            $("#pro-price").show();
            $("#pro-price-old").show()
        } else {
            $("#pro-price-label").hide();
            $("#pro-price").html("<em>¥</em>" + parseFloat(skuInfo.originPrice).toFixed(2) + "")
        }
        if (Number(skuInfo.price) > 0) {
            $("#pro-price").show()
        } else {
            $("#pro-price-label").text("暂无报价");
            $("#pro-price").hide()
        }
        ec.product.showTips();
        ec.product.processSupportDisplayDilieryTime(skuInfo);
        ec.product.interest.queryFreeDetail();
        ec.diypkg.init();
        return
    } else {
        ec.diypkg.hide()
    }
    ec.product.hiddenTips();
    if ($("#giftBuy_dl").length > 0) {
        if (!$("#giftBuy_dl").hasClass("hide")) {
            $("#giftBuy_dl").addClass("hide")
        }
        $("#giftBuy_dl").find("li").removeClass("selected");
        $("#giftBuy-selected").html("");
        if ($("#pro-operation").find("a").length == 2 && $("#pro-operation").find("a").first().find("span").html() == "加入购物车") {
            $("#pro-operation").find("a").first().attr("onclick", "").click(function() {
                ec.product.addCart()
            })
        }
        if ($("#pro-operation").find("a").length == 1 && $("#pro-operation").find("a").first().find("span").html() == "立即下单") {
            $("#pro-operation").attr("data-gift", 0);
            $("#pro-operation").find("a").before('<a href="javascript:;" onclick="ec.product.addCart()" class="product-button01"><span>加入购物车</span></a>')
        }
    }
    var pro_sbomList = skuInfo.pro_sbomList;
    var new_package = "";
    var newpackage = "";
    for (var i = 0; i < pro_sbomList.length; i++) {
        if (skuCode == pro_sbomList[i].sbomCode) {
            new_package = pro_sbomList[i].sbomPackageList;
            break
        }
    }
    if (new_package != "" && new_package.length > 0) {
        for (var o = 0; o < new_package.length; o++) {
            if (packageCode == new_package[o].packageCode) {
                newpackage = new_package[o];
                break
            }
        }
    }
    var newpackageListHtml = [];
    var prdId = $("#product_productId").val();
    if (newpackage != "" && newpackage != null) {
        newpackageListHtml.push('<div class="product-recommend product-package-mini">');
        newpackageListHtml.push('<div class="product-recommend-con clearfix">');
        newpackageListHtml.push('<div class="product-recommend-main">');
        newpackageListHtml.push('<div class="product-recommend-thumbs">');
        newpackageListHtml.push('<ul class="clearfix">');
        newpackageListHtml.push('<li> <a> <img src="' + ec.mediaPath + skuInfo.photoPath + "100_100_" + skuInfo.photoName + '">');
        newpackageListHtml.push('<p title="' + skuInfo.name + '">' + skuInfo.name + "</p>");
        newpackageListHtml.push("</a></li></ul></div></div>");
        var sbomPackageInfo = newpackage.packageList;
        if (sbomPackageInfo != "" && sbomPackageInfo.length > 0) {
            newpackageListHtml.push('<div class="goods-rolling product-recommend-detail">');
            newpackageListHtml.push('<div id="btn-prev" class="grid-btn btn-prev disabled">');
            newpackageListHtml.push("<span></span></div>");
            newpackageListHtml.push('<div id="btn-next" class="grid-btn btn-next"><span></span></div>');
            newpackageListHtml.push('<div id="goodsRecommend-recommend" class="swiper-container product-recommend-thumbs">');
            newpackageListHtml.push('<ul class=" swiper-wrapper clearfix" style="width: 1000px;">');
            for (var j = 0; j < sbomPackageInfo.length; j++) {
                newpackageListHtml.push('<li class="swiper-slide" attr-packageSkuCode="' + sbomPackageInfo[j].sbomCode + '"><a href="/product/' + sbomPackageInfo[j].disPrdId + '.html" target="_blank"><img src="' + ec.mediaPath + sbomPackageInfo[j].photoPath + "100_100_" + sbomPackageInfo[j].photoName + '">');
                newpackageListHtml.push('<p title="' + sbomPackageInfo[j].sbomName + '">' + sbomPackageInfo[j].sbomName + "</p></a>");
                var GbomAttr = sbomPackageInfo[j].gbomAttrList;
                if (GbomAttr != "" && GbomAttr.length > 0) {
                    newpackageListHtml.push('<dl class="color clearfix">');
                    for (var p = 0; p < GbomAttr.length; p++) {
                        if (p == 0) {
                            newpackageListHtml.push('<dd class="selected"><a href="javascript:;" onclick="ec.product.packageChangeColor(this)" attr-name="' + sbomPackageInfo[j].sbomName + '" attr-imgSrc="' + ec.mediaPath + sbomPackageInfo[j].photoPath + "100_100_" + sbomPackageInfo[j].photoName + '" attr-prdId="' + sbomPackageInfo[j].disPrdId + '" attr-packageSkuCode="' + sbomPackageInfo[j].sbomCode + '">' + GbomAttr[p].attrValue + "</a></dd>")
                        } else {
                            newpackageListHtml.push('<dd><a href="javascript:;" onclick="ec.product.packageChangeColor(this)" attr-name="' + sbomPackageInfo[j].sbomName + '" attr-imgSrc="' + ec.mediaPath + sbomPackageInfo[j].photoPath + "100_100_" + sbomPackageInfo[j].photoName + '" attr-prdId="' + sbomPackageInfo[j].disPrdId + '" attr-packageSkuCode="' + sbomPackageInfo[j].sbomCode + '">' + GbomAttr[p].attrValue + "</a></dd>")
                        }
                        if (j != sbomPackageInfo.length - 1) {
                            var k = j;
                            for (var t = 1; t < sbomPackageInfo.length - k; t++) {
                                if (sbomPackageInfo[k].disPrdId == sbomPackageInfo[k + t].disPrdId) {
                                    GbomAttr = sbomPackageInfo[k + t].gbomAttrList;
                                    newpackageListHtml.push('<dd><a href="javascript:;" onclick="ec.product.packageChangeColor(this)" attr-name="' + sbomPackageInfo[k + t].sbomName + '" attr-imgSrc="' + ec.mediaPath + sbomPackageInfo[k + t].photoPath + "100_100_" + sbomPackageInfo[k + t].photoName + '" attr-prdId="' + sbomPackageInfo[k + t].disPrdId + '" attr-packageSkuCode="' + sbomPackageInfo[k + t].sbomCode + '">' + GbomAttr[0].attrValue + "</a></dd>");
                                    j = k + t
                                }
                            }
                        }
                    }
                    newpackageListHtml.push("</dl></li>")
                }
            }
            newpackageListHtml.push("</ul></div></div></div>")
        }
        var savingPrice = (newpackage.totalPrice - newpackage.packageTotalPrice).toFixed(2);
        newpackageListHtml.push('<div class="product-package-mini-tool clearfix">');
        newpackageListHtml.push('<p><span class="f14">套餐价：</span><strong class="red">￥' + newpackage.packageTotalPrice + '</strong><span class="save"> <strong>省</strong><em>￥' + savingPrice + "</em> </span></p>");
        newpackageListHtml.push('<div class="fr"><a href="#" class="product-package-mini-btn product-button02" onclick="ec.product.buyBundle(1,this)">加入购物车</a></div>');
        newpackageListHtml.push("</div></div>")
    }
    $("#packageList").html(newpackageListHtml.join(""));
    ec.product.packageGetSkuCode();
    $("#pro-price-label").html("套餐价");
    $("#pro-price-label").removeClass("f24").addClass("type");
    $("#pro-price-label").show();
    $("#pro-price").html("<em>&yen;</em>" + newpackage.packageTotalPrice).show();
    $("#pro-price-old").hide();
    ec.product.newPackageSwiper();
    ec.product.interest.queryFreeDetail()
}
;
ec.product.packageViewChange = function(dom, packageCode, type) {
    if ($(dom).parent().parent().hasClass("selected")) {
        if ($(dom).parent().parent().hasClass("click")) {
            $(dom).parent().parent().removeClass("click");
            if (type == "gift") {
                $("#giftPackageList").addClass("hide")
            } else
                $("#packageList").addClass("hide")
        } else {
            if (type == "gift") {
                $(dom).parent().parent().parent().find("li").removeClass("click");
                $(dom).parent().parent().addClass("click");
                $("#giftPackageList").removeClass("hide")
            } else {
                if (packageCode == null) {
                    $("#packageList").html("");
                    return
                } else {
                    $(dom).parent().parent().addClass("click");
                    $("#packageList").removeClass("hide")
                }
            }
        }
    } else {
        $(dom).parent().parent().parent().find("li").removeClass("selected click");
        if (type == "gift") {
            $(dom).parent().parent().addClass("selected click");
            $("#giftPackageList").removeClass("hide")
        } else {
            if (packageCode == null) {
                $(dom).parent().parent().addClass("selected");
                $("#packageList").html("");
                $("#packageCode").val("");
                $("#packageListCode").val("")
            } else {
                $(dom).parent().parent().addClass("selected click");
                $("#packageList").removeClass("hide")
            }
            $("#package-selected").html();
            $("#package-selected").textS("&nbsp;/&nbsp;" + $(dom).parent().parent().attr("data-attrname"))
        }
    }
}
;
$(document).on("click", function(e) {
    if ($(e.target).closest("div.sku").length > 0) {
        return
    }
    if (!($("#package_dl").length > 0) && !$("#bundlePackage").length > 0) {
        return
    }
    if (!$("#packageList").hasClass("hide")) {
        if ($(e.target).parents("#packageList").length > 0 || $(e.target).parents("#packageSelect").length > 0) {
            return
        } else {
            if ($("#packageList").hasClass("hide")) {
                return
            }
            $("#packageSelect").find(".click").removeClass("click");
            $("#packageList").addClass("hide");
            ec.product.packageGetSkuCode()
        }
    }
    if (!$("#giftPackageList").hasClass("hide")) {
        if ($(e.target).parents("#giftPackageList").length > 0 || $(e.target).parents("#bundlePackageSelect").length > 0) {
            return
        } else {
            if ($("#giftPackageList").hasClass("hide")) {
                return
            }
            $("#bundlePackageSelect").find(".click").removeClass("click");
            $("#giftPackageList").addClass("hide");
            ec.product.packageGetSkuCode("gift")
        }
    }
});
ec.product.packageChangeColor = function(dom, type) {
    if ($(dom).parent().hasClass("selected")) {
        return
    } else {
        $(dom).parent().parent().find("dd").removeClass("selected");
        $(dom).parent().addClass("selected");
        ec.product.packageGetSkuCode(type)
    }
}
;
ec.product.packageGetSkuCode = function(type) {
    var packageListCode = [];
    var giftPackageListCode = [];
    if (type == "gift") {
        $("#bundlePackageSelect").find("ul").find("dl").find(".selected").find("a").each(function() {
            if ($(this).attr("attr-packageskucode") != "") {
                $(this).parent().parent().parent().attr("attr-packageskucode", $(this).attr("attr-packageskucode"));
                $(this).parent().parent().parent().find("img").attr("src", $(this).attr("attr-imgSrc"));
                $(this).parent().parent().parent().find("p").attr("title", $(this).attr("attr-name"));
                $(this).parent().parent().parent().find("p").text($(this).attr("attr-name"))
            }
        });
        $("#goodsRecommend-recommend-gift").find("li").each(function() {
            giftPackageListCode.push($(this).attr("attr-packageskucode"))
        });
        var skuId = $("#bundlePackageSelect").find(".product-recommend-main").find("a").attr("sku-id");
        ec.product.gift.packageGiftMap[skuId] = giftPackageListCode
    } else {
        $("#packageSelect").find("ul").find("dl").find(".selected").find("a").each(function() {
            if ($(this).attr("attr-packageskucode") != "") {
                $(this).parent().parent().parent().attr("attr-packageskucode", $(this).attr("attr-packageskucode"));
                $(this).parent().parent().parent().find("img").attr("src", $(this).attr("attr-imgSrc"));
                $(this).parent().parent().parent().find("p").attr("title", $(this).attr("attr-name"));
                $(this).parent().parent().parent().find("p").text($(this).attr("attr-name"))
            }
        });
        $("#goodsRecommend-recommend").find("li").each(function() {
            packageListCode.push($(this).attr("attr-packageskucode"))
        });
        $("#packageListCode").valS(packageListCode)
    }
}
;
ec.product.newPackageSwiper = function(id) {
    if (id == null || typeof id == "undefined") {
        id = ""
    }
    var totalLen = $("#goodsRecommend-recommend" + id).find(".swiper-slide").length;
    if (totalLen <= 2) {
        $("#btn-prev" + id).addClass("disabled");
        $("#btn-next" + id).addClass("disabled")
    } else {
        $("#btn-next" + id).removeClass("disabled")
    }
    var mySwiper = new Swiper("#goodsRecommend-recommend" + id,{
        slidesPerView: 2,
        slidesPerGroup: 2
    });
    $("#btn-prev" + id).click(function() {
        mySwiper.swipePrev();
        ec.product.showSwiper(id)
    });
    $("#btn-next" + id).click(function() {
        mySwiper.swipeNext();
        ec.product.showSwiper(id)
    })
}
;
ec.product.showSwiper = function(id) {
    var slideLen = $("#goodsRecommend-recommend" + id).find("li").length;
    $.each($("#goodsRecommend-recommend" + id).find("li"), function(index, obj) {
        if (index == 0 && $(obj).hasClass("swiper-slide-visible")) {
            $("#btn-prev" + id).addClass("disabled")
        } else if (index == 0 && !$(obj).hasClass("swiper-slide-visible")) {
            $("#btn-prev" + id).removeClass("disabled")
        }
        if (index == slideLen - 1 && $(obj).hasClass("swiper-slide-visible")) {
            $("#btn-next" + id).addClass("disabled")
        } else if (index == slideLen - 1 && !$(obj).hasClass("swiper-slide-visible")) {
            $("#btn-next" + id).removeClass("disabled")
        }
    })
}
;
ec.product.hidebundleView = function() {
    if ($("#bundlePackage").length > 0 && $("#bundlePackage").find("li").length > 1) {
        return
    } else if ($("#bundlePackage").find("li").length == 1) {
        $("#bundlePackage").addClass("hide")
    }
}
;
ec.product.showCmbSelector = function(list, hbList) {
    $("#hbShow").css("float", "left").css("margin-right", "10px");
    $("#hlShow").css("margin-right", "10px");
    if (list.length > 0) {
        var sku = ec.product.getSkuInfo(ec.product.getSku());
        if (hbList && hbList.length > 0) {
            var promotionTxt = "";
            if (sku.promotionLst && sku.promotionLst.length > 0) {
                sku.promotionLst.forEach(function(v) {
                    if ("&#x5206;&#x671f;&#x514d;&#x606f;" === v.promoLabel || "分期免息" === v.promoLabel) {
                        promotionTxt = v.ruleDescription
                    }
                })
            }
            promotionTxt = promotionTxt.transHtmlAttribute();
            if (promotionTxt && promotionTxt.indexOf("花呗") > promotionTxt.indexOf("掌上")) {
                $("#hbShow").css("float", "right").css("margin-right", "0");
                $("#hlShow").css("margin-right", "0");
                $("#hbShow").parent().css("width", $("#hbShow").width() + $("#hlShow").width() + 10 + "px")
            }
        }
        $("#hlShow").show();
        var defSelect = 0;
        for (var i = 0; i < list.length; i++) {
            if ("undefined" === typeof list[i].flag) {
                list[i].flag = list[i].installmentFlag
            }
            if (list[i].flag > 0 && list[i].num > defSelect) {
                defSelect = list[i].num
            }
        }
        var htmlHLShow = [];
        for (var i = 0; i < list.length; i++) {
            if (defSelect === list[i].num) {
                $("#interestPayHLNow").removeClass("disabled");
                htmlHLShow.push('<li class="selected">')
            } else {
                htmlHLShow.push("<li>")
            }
            htmlHLShow.push('<a href="javascript:;" onclick="ec.product.interest.checkOne(this);" interest-info="2:' + list[i].num + '">');
            htmlHLShow.push('<p class="price">&yen;&nbsp;' + list[i].amount + "<em>x</em>" + list[i].num + "期</p>");
            if (list[i].flag == 0) {
                htmlHLShow.push("<p>手续费&yen;" + list[i].fee + "/期</p></a></li>")
            } else {
                htmlHLShow.push('<p class="red">免息，0手续费</p></a></li>')
            }
        }
        $("#hlDetail").find("ul").html(htmlHLShow.join(""));
        $("#hlShow").find(".sku").unbind("mouseover");
        $("#hlShow").unbind("mouseleave");
        $("#hlShow").find(".sku").mouseover(function() {
            if (!$("#hlShow").hasClass("click")) {
                $("#hlDetail").show();
                $("#hlShow").addClass("click")
            }
        });
        $("#hlShow").mouseleave(function(e) {
            if (!e.relatedTarget) {
                return
            }
            $("#hlDetail").hide();
            $("#hlShow").removeClass("click")
        })
    } else {
        $("#hlShow").hide();
        $("#hlDeatil").hide()
    }
}
;
ec.product.showSbomInterest = function(sku) {
    ec.product.inventory.wait(function() {
        var showCart = true;
        if ($("#pro-operation").css("visibility") == "hidden") {
            showCart = false
        }
        $("#interestOrderNow").val("");
        $("#interestOrderNow2").val("");
        if (showCart && (sku.buttonMode == "1" || sku.buttonMode == "3" || sku.buttonMode == "10") && $("#pro-operation a:first-child").text() == "加入购物车" && !$("#pro-operation a:first-child").hasClass("disabled") || ec.product.productType == "9" && (sku.buttonMode == "12" || sku.buttonMode == "18") || $("#pro-operation").find("span.product-button-tips").text() == "限时抢购进行中") {
            $("#prd-noInterset").attr("interest-allow", "1");
            var buttonNowInterest = $("#pro-operation a:first-child").text();
            if (buttonNowInterest != "加入购物车") {
                $("#prd-noInterset").attr("interest-button", "0");
                if (ec.product.productType == "9" && (sku.buttonMode == "12" || sku.buttonMode == "18") && buttonNowInterest == "立即下单") {
                    $("#prd-noInterset").attr("interest-button", "1")
                }
            }
            $("#hbShow").removeClass("selected click");
            $("#hlShow").removeClass("selected click");
            if (!$("#interestHBPayNow").hasClass("disabled")) {
                $("#interestHBPayNow").addClass("disabled")
            }
            if (!$("#interestPayHLNow").hasClass("disabled")) {
                $("#interestPayHLNow").addClass("disabled")
            }
            if (sku.hbInterestLst.length > 0 || sku.hlInterestLst.length > 0) {
                var hbList = [];
                var handLifeList = [];
                $("#prd-noInterset").removeClass("hide");
                $("#hbDetail").hide();
                $("#hlDetail").hide();
                $("#hbShow").hide();
                $("#hlShow").hide();
                if (sku.hbInterestLst.length > 0) {
                    $("#hbShow").show();
                    var htmlHBShow = [];
                    for (var i = 0; i < sku.hbInterestLst.length; i++) {
                        htmlHBShow.push('<li><a href="javascript:;" onclick="ec.product.interest.checkOne(this);" interest-info="1:' + sku.hbInterestLst[i].num + '">');
                        htmlHBShow.push('<p class="price">&yen;&nbsp;' + sku.hbInterestLst[i].amount + "<em>x</em>" + sku.hbInterestLst[i].num + "期</p>");
                        if (sku.hbInterestLst[i].flag == 0) {
                            htmlHBShow.push("<p>手续费&yen;" + sku.hbInterestLst[i].fee + "/期</p></a></li>")
                        } else {
                            htmlHBShow.push('<p class="red">免息，0手续费</p></a></li>')
                        }
                    }
                    $("#hbDetail").find("ul").html(htmlHBShow.join(""));
                    $("#hbShow").find(".sku").unbind("mouseover");
                    $("#hbShow").unbind("mouseleave");
                    $("#hbShow").find(".sku").mouseover(function() {
                        $("#hbDetail").show();
                        $("#hbShow").addClass("click")
                    });
                    $("#hbShow").mouseleave(function(e) {
                        if (!e.relatedTarget) {
                            return
                        }
                        $("#hbDetail").hide();
                        $("#hbShow").removeClass("click")
                    })
                } else {
                    $("#hbShow").hide();
                    $("#hbDetail").hide()
                }
                ec.product.showCmbSelector(sku.hlInterestLst, sku.hbInterestLst);
                if ($("#prd-noInterset").attr("interest-button") == "0") {
                    $("#interestHBPayNow").each(function() {
                        $(this).addClass("disabled");
                        this.backup = this.onclick;
                        this.onclick = ""
                    });
                    $("#interestPayHLNow").each(function() {
                        $(this).addClass("disabled");
                        this.backup = this.onclick;
                        this.onclick = ""
                    })
                }
            } else {
                if (!$("#prd-noInterset").hasClass("hide")) {
                    $("#prd-noInterset").addClass("hide")
                }
                $("#hbDetail").find("ul").html("");
                $("#hlDetail").find("ul").html("")
            }
        } else {
            $("#prd-noInterset").attr("interest-allow", "0");
            $("#hbDetail").find("ul").html("");
            $("#hlDetail").find("ul").html("");
            if (!$("#prd-noInterset").hasClass("hide")) {
                $("#prd-noInterset").addClass("hide")
            }
        }
    })
}
;
ec.pkg("ec.diypkg");
ec.load({
    url: scriptPath + "/common/base/lodash.min.js",
    type: "js"
});
ec.diypkg.valid = function() {
    ec.diypkg.selected = [];
    ec.diypkg.data.groupList.forEach(function(g, idx) {
        var gc = {
            groupId: g.groupId,
            groupName: g.groupName,
            minQuantiry: g.minQuantiry,
            maxQuantity: g.maxQuantity,
            chked: 0,
            data: []
        };
        g.packageList.forEach(function(v) {
            var sCode = ec.diypkg.res.chked[g.groupId + "_" + v.disPrdId];
            if (sCode && v.sbomCode == sCode) {
                gc.chked++;
                gc.data.push(v.sbomCode)
            }
        });
        ec.diypkg.selected.push(gc)
    });
    return true
}
;
ec.diypkg.addCart = function(thix) {
    if (!ec.diypkg.valid())
        return false;
    var temp = ec.product.finalGift();
    paras = {
        salePortal: 1,
        saleChannel: 1001,
        needResultset: 0,
        cartjson: temp.cartjson
    };
    paras.cartjson = JSON.parse(paras.cartjson);
    paras.cartjson.itemType = "DP";
    paras.cartjson.attrs = paras.cartjson.attrs || {};
    paras.cartjson.attrs.dp_package_code = ec.diypkg.data.packageCode;
    ec.diypkg.selected.forEach(function(g) {
        g.data.forEach(function(itemCode) {
            paras.cartjson.subs.push({
                itemCode: itemCode,
                itemType: "DP",
                qty: paras.cartjson.qty,
                attrs: {
                    dp_group: g.groupId
                }
            })
        })
    });
    ec.cart.dap(300020404, $(thix).text(), paras.cartjson);
    ec.product.disableAddCartButtons();
    var buyNumber = parseInt($("#pro-quantity").val() || 1)
      , cartNUmber = parseInt($("#header-cart-total").html());
    ec.minicart.setNum(cartNUmber + buyNumber);
    ec.cart.add(paras, {
        successFunction: function(json) {
            if (json.resultCode == 2e5) {
                var cartText = "自选套餐已成功加入购物车!";
                var computeRes = ec.product.compute($("#pro-add-success-mask"), cartText);
                if (computeRes.h > 27) {
                    $("#cart-tips").find("p").parent().removeClass("box-right-1").addClass("box-right-2")
                } else {
                    $("#cart-tips").find("p").parent().removeClass("box-right-2").addClass("box-right-1")
                }
                $("#cart-tips").find("p").textS(cartText);
                $(".pro-add-success-total").hide();
                ec.minicart.setNum(json.cartNumber);
                var box = new ec.box($("#cart-tips").html(),{
                    boxclass: "ol_box_4",
                    showButton: false
                }).open()
            }
            ec.product.enableAddCartButtons()
        },
        errorFunction: function(json) {
            var box = new ec.box('<div class="box-errors-1"><span>' + json.msg + "</span></div>",{
                boxclass: "ol_box_4",
                showButton: true
            }).open();
            ec.product.enableAddCartButtons()
        }
    })
}
;
ec.diypkg.order = function(thix) {
    if (!ec.diypkg.valid())
        return false;
    ec.account.afterLogin(function() {
        var skusListArr = $("#pro-skus").find("dl").not($("#giftPackageList").find("dl")).not($("#packageList").find("dl"));
        for (p = 0; p < skusListArr.length; p++) {
            var flag = false;
            var skuInfoArr = skusListArr.get(p);
            $(skuInfoArr).children(".product-choose-detail").children("ul").find("li").each(function(index) {
                if ($(this).parents("#giftPackageList").length > 0 || $(this).parents("#packageList").length > 0) {
                    return true
                }
                if ($(this).hasClass("selected")) {
                    flag = true;
                    return
                }
            });
            if (!flag) {
                alert("请选择需要购买的类型");
                return false
            }
        }
        ec.product.disableAddCartButtons();
        var orderItemReqArgList = [];
        var orderitem = {};
        orderitem.itemId = $("#pro-sku-code").val();
        orderitem.qty = $("#pro-quantity").val() || 1;
        orderitem.itemType = "S0";
        if (ec.product.productType == 9) {
            orderitem.itemType = "S9"
        }
        var finalGift = ec.product.gift.finalMainSbomGiftMap[ec.product.getSku()];
        var skuIds = ec.product.getSku();
        var gifts2Order = [];
        if (finalGift) {
            for (var key in finalGift) {
                var aGift = {
                    sbomCode: finalGift[key].giftSkuCode
                };
                if (finalGift[key].group) {
                    aGift.group = finalGift[key].group
                }
                gifts2Order.push(aGift)
            }
        }
        if (ec.product.gift.packageGiftMap[skuIds]) {
            for (var giftKey = 0; giftKey < ec.product.gift.packageGiftMap[skuIds].length; giftKey++) {
                var pGift = {
                    sbomCode: ec.product.gift.packageGiftMap[skuIds][giftKey]
                };
                gifts2Order.push(pGift)
            }
        }
        orderitem.gifts = gifts2Order;
        orderitem.subOrderItemReqArgs = [];
        orderitem.subOrderItemReqArgs = ec.product.subServices(orderitem.subOrderItemReqArgs);
        orderitem.itemType = "DP";
        orderitem.itemProp = orderitem.itemProp || {};
        orderitem.itemProp.dp_package_code = ec.diypkg.data.packageCode;
        ec.diypkg.selected.forEach(function(g) {
            g.data.forEach(function(itemCode) {
                orderitem.subOrderItemReqArgs.push({
                    itemId: itemCode,
                    itemType: "DP",
                    qty: orderitem.qty,
                    itemProp: {
                        dp_group: g.groupId
                    }
                })
            })
        });
        var cartData = (ec.product.finalGift() || {}).cartjson;
        if ("string" === typeof cartData) {
            cartData = parseJSON(cartData) || {}
        }
        cartData.itemType = "DP";
        cartData.attrs = cartData.attrs || {};
        cartData.attrs.dp_package_code = ec.diypkg.data.packageCode;
        ec.diypkg.selected.forEach(function(g) {
            g.data.forEach(function(itemCode) {
                cartData.subs.push({
                    itemCode: itemCode,
                    itemType: "DP",
                    qty: cartData.qty,
                    attrs: {
                        dp_group: g.groupId
                    }
                })
            })
        });
        ec.cart.dap(300020502, $(thix).text(), cartData);
        orderItemReqArgList.push(orderitem);
        var jsonReqArg = ec.lang.json.stringify(orderItemReqArgList);
        var input = '<input name="orderReqJson" type="text" value=\'' + jsonReqArg + "'>";
        input += '<input name="state" type="text" value="0">';
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        if (ec.product.productType == 9) {
            if (parseInt(getSku.buttonMode) == 18) {
                input += '<input name="routingTag" type="text" value="36">'
            } else {
                input += '<input name="routingTag" type="text" value="28">'
            }
        }
        var getSku = ec.product.getSkuInfo(ec.product.getSku() || ec.product.defaultSku);
        var form = $("#order-confirm-form").append(input);
        ec.binding.isBindedMobileOrEnterpriseUser(function() {
            setTimeout(function() {
                form.submit()
            }, 500)
        })
    })
}
;
ec.diypkg.render = function() {
    if (!ec.diypkg.pkgs) {
        ec.diypkg.hide();
        return false
    }
    var sku = ec.product.getSkuInfo(ec.product.getSku());
    if (!sku || !sku.code) {
        ec.diypkg.hide();
        return false
    }
    if (sku.priceMode != 1) {
        ec.diypkg.hide();
        return false
    }
    if (sku.buttonMode != 1 && sku.buttonMode != 3 && sku.buttonMode != 10 && sku.buttonMode != 8) {
        ec.diypkg.hide();
        return false
    }
    if (sku.buttonMode == 10) {
        if (sku.startTime && ec.util.parseDate(sku.startTime) > new Date) {
            ec.diypkg.hide();
            return false
        }
        if (sku.endTime && ec.util.parseDate(sku.endTime) < new Date) {
            ec.diypkg.hide();
            return false
        }
    }
    sku.originPrice = parseFloat(sku.originPrice);
    sku.price = parseFloat(sku.price);
    var data = ec.diypkg.pkgs[sku.code];
    ec.diypkg.data = data;
    if (!data || !data.groupList || !data.groupList[0] || !data.groupList[0].packageList || !data.groupList[0].packageList.length) {
        ec.diypkg.hide();
        return false
    }
    if (!$("#pro-global-parameter").attr("data-skulist-rushbuy")) {
        if (!ec.product.inventory.haveInventory(sku.id)) {
            ec.diypkg.hide();
            return false
        }
    }
    data.price = sku.price;
    if (!data.res) {
        data.res = {
            tab: 0,
            num: 0,
            price: data.price,
            chked: {}
        }
    }
    var res = data.res;
    ec.diypkg.res = res;
    if (!data.groupList[0].packageListGrouped) {
        data.groupList.forEach(function(group, gidx) {
            var tmpGrped = _.groupBy(group.packageList, "disPrdId");
            var tmpSort = [];
            data.groupList[gidx].packageListGrouped = [];
            group.packageList.forEach(function(sbom) {
                if (tmpSort.indexOf(sbom.disPrdId) < 0) {
                    tmpSort.push(sbom.disPrdId);
                    data.groupList[gidx].packageListGrouped.push(tmpGrped[sbom.disPrdId])
                }
            })
        })
    }
    var h = '<ul data-size="" class="product-package-tab clearfix">';
    data.groupList.forEach(function(group, idx) {
        var cssShow = "";
        if (idx == res.tab) {
            cssShow = ' class="current"'
        }
        h += "<li" + cssShow + ' data-min="' + group.minQuantiry + '" data-max="' + group.maxQuantity + '" data-idx="' + idx + '">';
        h += '<a href="javascript:;" onclick="ec.diypkg.showTab(this)">' + group.groupName + "</a>";
        h += "</li>"
    });
    h += "</ul>";
    h += '<div class="product-recommend-con clearfix">';
    h += '<div class="product-recommend-main">';
    h += '<div class="product-recommend-thumbs">';
    h += '<ul class="clearfix">';
    h += "<li>";
    h += '<a href="javascript:;">';
    h += '<img src="' + ec.mediaPath + sku.photoPath + "100_100_" + sku.photoName + '" alt="">';
    h += "<p>" + sku.name + "</p>";
    h += "</a>";
    h += '<div class="price">';
    h += '<span class="red" data-price="' + data.price + '">&yen;' + data.price + "</span>";
    if (sku.originPrice != data.price) {
        h += "<s>¥" + sku.originPrice + "</s>"
    }
    h += "</div>";
    h += "</li>";
    h += "</ul>";
    h += "</div>";
    h += "</div>";
    data.groupList.forEach(function(group, idx) {
        var cssRolling = "";
        if (group.packageListGrouped.length > 5) {
            cssRolling = " goods-rolling"
        }
        var cssShow = "";
        if (idx != res.tab) {
            cssShow = ' style="display: none;"'
        }
        h += '<div class="product-recommend-detail' + cssRolling + '"' + cssShow + ">";
        h += '<div class="product-recommend-thumbs swiper-container" id="j-swiper-' + idx + '">';
        h += '<div class="grid-btn btn-prev swiper-button-prev j-prd-prev disabled"><span></span></div>';
        h += '<div class="grid-btn btn-next swiper-button-next j-prd-next"><span></span></div>';
        h += '<ul class="clearfix swiper-wrapper j-grp" data-gid="' + idx + '">';
        group.packageListGrouped.forEach(function(pkg, pid) {
            var cpkg = {};
            pkg.forEach(function(b) {
                if (res.chked[group.groupId + "_" + b.disPrdId] && res.chked[group.groupId + "_" + b.disPrdId] == b.sbomCode) {
                    cpkg = b
                }
            });
            if (!cpkg.sbomCode)
                cpkg = pkg[0];
            h += '<li class="swiper-slide j-prd" data-pid="' + pid + '">';
            h += '<a href="/product/' + cpkg.disPrdId + '.html" target="_blank" class="j-pimg">';
            h += '<img src="' + ec.mediaPath + cpkg.photoPath + "100_100_" + cpkg.photoName + '">';
            h += '<p id="numb-time" title="' + cpkg.sbomName + '">' + cpkg.sbomName + "</p>";
            h += "</a>";
            var cssCRolling = "";
            if (pkg.length > 3) {
                cssCRolling = " j-color-rolling"
            }
            h += '<div class="color-rolling' + cssCRolling + '">';
            h += '<div class="color-rolling-detail" id="color-rolling-' + group.groupId + "-" + cpkg.disPrdId + '">';
            h += '<div class="grid-btn swiper-button-prev btn-prev j-cbtn-prev disabled"><span></span></div>';
            h += '<div class="grid-btn swiper-button-next btn-next j-cbtn-next disabled"><span></span></div>';
            h += '<ul class="clearfix swiper-wrapper" style="width: 600px;">';
            pkg.forEach(function(b) {
                var cssSelect = "";
                if (cpkg.sbomCode == b.sbomCode)
                    cssSelect = " selected";
                h += '<li class="swiper-slide' + cssSelect + '" data-code="' + b.sbomCode + '"><a href="javascript:;" onclick="ec.diypkg.attr(this);"><img src="' + ec.mediaPath + b.photoPath + "100_100_" + b.photoName + '"></a></li>'
            });
            h += "</ul>";
            h += "</div>";
            h += "</div>";
            h += '<div class="price">';
            var chked = "";
            if (ec.util.cookie.get("rushprd_" + ec.product.id) != null) {
                var skuCodeInCookie = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[0];
                if (skuCodeInCookie == ec.product.getSkuInfo(ec.product.getSku()).code) {
                    var temp = ec.util.cookie.get("rushprd_" + ec.product.id).split("-")[2];
                    if (temp != "") {
                        var groupIdWithSbomCode = temp.split("&");
                        var groupIds = [];
                        var diyPrdSbomCodes = new Map;
                        for (var i = 0; i < groupIdWithSbomCode.length; i++) {
                            groupIds.push(groupIdWithSbomCode[i].split("_")[0]);
                            diyPrdSbomCodes.set(groupIdWithSbomCode[i].split("_")[0], groupIdWithSbomCode[i].split("_")[1].split(","))
                        }
                        ec.diypkg.res.price = data.price;
                        ec.diypkg.res.num = 0;
                        for (var j = 0; j < ec.diypkg.data.groupList.length; j++) {
                            if (groupIds.contains(ec.diypkg.data.groupList[j].groupId)) {
                                for (var m = 0; m < ec.diypkg.data.groupList[j].packageList.length; m++) {
                                    if (diyPrdSbomCodes.get(ec.diypkg.data.groupList[j].groupId).contains(ec.diypkg.data.groupList[j].packageList[m].sbomCode)) {
                                        ec.diypkg.res.chked[ec.diypkg.data.groupList[j].groupId + "_" + ec.diypkg.data.groupList[j].packageList[m].disPrdId] = ec.diypkg.data.groupList[j].packageList[m].sbomCode;
                                        ec.diypkg.res.price += parseFloat(ec.diypkg.data.groupList[j].packageList[m].packagePrice);
                                        ec.diypkg.res.num++;
                                        ec.diypkg.res.price = parseFloat(ec.diypkg.res.price.toFixed(2))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (res.chked[group.groupId + "_" + cpkg.disPrdId])
                chked = ' checked="checked"';
            h += '<input class="j-input" type="checkbox" name="skuId[]" value="1" data-id="' + group.groupId + "_" + cpkg.disPrdId + '" data-code="' + cpkg.sbomCode + '" autocomplete="off" data-price="' + cpkg.packagePrice + '"' + chked + ">";
            h += '<span class="red">&yen;' + cpkg.packagePrice + "</span>";
            var attrOriPrice = "";
            if (cpkg.price == cpkg.packagePrice) {
                attrOriPrice = ' style="display: none;"'
            }
            h += "<s" + attrOriPrice + ">&yen;" + cpkg.price + "</s>";
            h += "</div>";
            h += "</li>"
        });
        h += "</ul>";
        h += "</div>";
        h += "</div>"
    });
    h += '<ul class="product-recommend-operation">';
    h += '<li class="chk-num">每个套餐搭配<em>' + res.num + "</em>件</li>";
    h += '<li class="product-recommend-price chk-price">组合价：<span>&yen;' + res.price + "</span></li>";
    if ($("#pro-operation a:first-child").text() == "加入购物车" && $("#pro-operation a:odd").children().text() == "立即下单") {
        h += '<li><a href="javascript:;" class="product-button01" title="加入购物车" onclick="ec.diypkg.addCart(this);">加入购物车</a></li>';
        h += '<li><a href="javascript:;" class="product-button02" title="立即下单" onclick="ec.diypkg.order(this);">立即下单</a></li>'
    } else {
        if ($("#pro-operation a:first-child").text() == "暂时缺货" || $("#pro-operation a:first-child").text() == "已售完") {
            ec.diypkg.hide();
            return false
        }
        if ($("#pro-operation a:odd").children().text() == "暂时缺货" || $("#pro-operation a:odd").children().text() == "已售完") {
            ec.diypkg.hide();
            return false
        }
        if ($("#pro-operation a:first-child").text() == "提前登录") {
            h += '<li><a href="javascript:;" class="product-button02" title="' + $("#pro-operation a:first-child").text() + '" onclick="rush.business.clickBtn()">' + $("#pro-operation a:first-child").text() + "</a></li>"
        }
        if ($("#pro-operation a:odd").children().text() == "提前登录") {
            h += '<li><a href="javascript:;" class="product-button02" title="' + $("#pro-operation a:odd").children().text() + '" onclick="rush.business.clickBtn()">' + $("#pro-operation a:odd").children().text() + "</a></li>"
        }
        if ($("#pro-operation a:first-child").text() == "立即申购" && $("#pro-operation a:first-child").hasClass("disabled")) {
            h += '<li><a class="product-button02 disabled" title="' + $("#pro-operation a:first-child").text() + '">' + $("#pro-operation a:first-child").text() + "</a></li>"
        } else if ($("#pro-operation a:first-child").text() == "立即申购") {
            h += '<li><a href="javascript:;" class="product-button02" title="' + $("#pro-operation a:first-child").text() + '" onclick="rush.business.clickBtn(2)">' + $("#pro-operation a:first-child").text() + "</a></li>"
        }
        if ($("#pro-operation a:odd").text() == "立即申购" && $("#pro-operation a:odd").hasClass("disabled")) {
            h += '<li><a class="product-button02 disabled" title="' + $("#pro-operation a:odd").text() + '">' + $("#pro-operation a:odd").text() + "</a></li>"
        } else if ($("#pro-operation a:odd").children().text() == "立即申购") {
            h += '<li><a href="javascript:;" class="product-button02" title="' + $("#pro-operation a:odd").children().text() + '" onclick="rush.business.clickBtn(2)">' + $("#pro-operation a:odd").children().text() + "</a></li>"
        }
        if ($("#pro-operation a:first-child").text() == "立即登录") {
            h += '<li><a href="javascript:;" class="product-button02" title="' + $("#pro-operation a:first-child").text() + '" onclick="rush.business.clickBtn()">' + $("#pro-operation a:first-child").text() + "</a></li>"
        }
        if ($("#pro-operation a:odd").children().text() == "立即登录") {
            h += '<li><a href="javascript:;" class="product-button02" title="' + $("#pro-operation a:odd").children().text() + '" onclick="rush.business.clickBtn()">' + $("#pro-operation a:odd").children().text() + "</a></li>"
        }
    }
    h += "</ul>";
    h += "</div>";
    $("#product-recommend-all").html(h).show();
    $('#product-recommend-all input[name="skuId[]"]').bind("change", function() {
        var itkey = $(this).attr("data-id");
        if ($(this).attr("checked")) {
            ec.diypkg.res.chked[itkey] = $(this).attr("data-code");
            ec.diypkg.res.num++;
            ec.diypkg.res.price += parseFloat($(this).attr("data-price"));
            ec.diypkg.res.price = parseFloat(ec.diypkg.res.price.toFixed(2))
        } else {
            ec.diypkg.res.chked[itkey] = false;
            ec.diypkg.res.num--;
            ec.diypkg.res.price -= parseFloat($(this).attr("data-price"));
            ec.diypkg.res.price = parseFloat(ec.diypkg.res.price.toFixed(2))
        }
        $("#product-recommend-all .product-recommend-operation .chk-num em").textS(ec.diypkg.res.num);
        $("#product-recommend-all .product-recommend-operation .chk-price span").textS("&yen;" + ec.diypkg.res.price)
    });
    $(".goods-rolling:visible").each(function() {
        $(this).closest(".product-recommend-con").addClass("product-recommend-rolling")
    });
    $(".goods-rolling .swiper-container").each(function() {
        ec.diypkg.initSwiper("#" + $(this).attr("id"), 5, "j-prd")
    });
    $(".j-color-rolling .color-rolling-detail").each(function() {
        ec.diypkg.initSwiper("#" + $(this).attr("id"), 3, "j-cbtn")
    });
    return true
}
;
ec.diypkg.initSwiper = function(xpath, num, btnPrefix) {
    var jobj = $(xpath);
    var liNum = jobj.find(".swiper-slide").length;
    if (liNum > num) {
        jobj.find("." + btnPrefix + "-next").removeClass("disabled")
    } else {
        jobj.find("." + btnPrefix + "-prev").addClass("disabled");
        jobj.find("." + btnPrefix + "-next").addClass("disabled")
    }
    var mySwiper = new Swiper(xpath,{
        slidesPerView: num,
        slidesPerGroup: num,
        btnPrefix: btnPrefix
    });
    jobj.find("." + btnPrefix + "-prev").click(function() {
        mySwiper.swipePrev()
    });
    jobj.find("." + btnPrefix + "-next").click(function() {
        mySwiper.swipeNext()
    })
}
;
ec.diypkg.showTab = function(thix) {
    ec.diypkg.res.tab = parseInt($(thix).closest("li").attr("data-idx"));
    ec.product.inventory.wait(function() {
        ec.diypkg.render()
    })
}
;
ec.diypkg.attr = function(thix) {
    var jli = $(thix).closest("li");
    var sCode = jli.attr("data-code");
    var gid = jli.closest("ul.j-grp").attr("data-gid");
    var jprd = jli.closest("li.j-prd");
    var pid = jprd.attr("data-pid");
    var cpkg = {};
    ec.diypkg.data.groupList[gid].packageListGrouped[pid].forEach(function(pkg) {
        if (pkg.sbomCode == sCode)
            cpkg = pkg
    });
    if (!cpkg.sbomCode)
        return false;
    jli.siblings().removeClass("selected");
    jli.addClass("selected");
    var jpimg = jprd.find("a.j-pimg");
    jpimg.find("img").attrS("src", ec.mediaPath + cpkg.photoPath + "100_100_" + cpkg.photoName);
    jpimg.find("p").textS(cpkg.sbomName).attrS("title", cpkg.sbomName);
    var jprice = jprd.find("div.price");
    jprice.find("span").textS("&yen;" + cpkg.packagePrice);
    jprice.find("s").textS("&yen;" + cpkg.price);
    if (cpkg.packagePrice == cpkg.price) {
        jprice.find("s").hide()
    } else {
        jprice.find("s").show()
    }
    var jinput = jprice.find("input.j-input");
    var oriPrice = parseFloat(jinput.attr("data-price"));
    jinput.attr("data-code", sCode).attr("data-price", cpkg.packagePrice);
    var itkey = jinput.attr("data-id");
    if (ec.diypkg.res.chked[itkey]) {
        ec.diypkg.res.chked[itkey] = sCode;
        ec.diypkg.res.price = ec.diypkg.res.price - oriPrice + cpkg.packagePrice;
        ec.diypkg.res.price = parseFloat(ec.diypkg.res.price.toFixed(2));
        $("#product-recommend-all .product-recommend-operation .chk-price span").textS("&yen;" + ec.diypkg.res.price)
    }
}
;
ec.diypkg.hide = function() {
    $("#product-recommend-all").html("").hide()
}
;
ec.diypkg.init = function() {
    ec.diypkg.hideAll();
    ec.product.inventory.wait(function() {
        if (!ec.diypkg.render()) {
            ec.multiComb.init()
        }
    })
}
;
ec.diypkg.hideAll = function() {
    $("#product-recommend-all").html("").hide();
    $("#product-recommend-all2").closest(".layout").hide()
}
;
ec.pkg("ec.multiComb");
ec.multiComb.init = function() {
    var sku = ec.product.getSku();
    var layout = $("#product-recommend-all2").closest(".layout");
    var combList = $("#comb-list-" + sku);
    if (combList && combList.length > 0 && ec.product.productType != 4) {
        $("#product-recommend-all2 .product-package-tab").hide();
        $("#product-recommend-all2 .product-recommend-con").hide();
        $("#comb-list-" + sku).show();
        $("div[id^='comb-pro-" + sku + "-0'] ").show();
        layout.show();
        $(".goods-rolling .swiper-container").each(function() {
            ec.diypkg.initSwiper("#" + $(this).attr("id"), 5, "swiper-button")
        })
    } else {
        layout.hide()
    }
    var flag = 0;
    $("div[id^='comb-list-'] input").unbind("click");
    $("div[id^='comb-list-" + sku + "-'] input").bind("click", function() {
        $(this).attr("disabled", "disabled");
        if (flag != 0) {
            return
        }
        if ($(this).hasClass("protect") == false) {
            $(this).addClass("protect");
            $(this).attr("checked", "checked")
        } else {
            $(this).removeClass("protect");
            $(this).removeAttr("checked")
        }
        var dataIndex = $(this).attr("data-index");
        var productNum = $("#comb-count-" + sku + "-" + dataIndex).html();
        var totalPrice = parseFloat($("#comb-price-" + sku + "-" + dataIndex).html());
        flag = 1;
        if ($(this).attr("checked")) {
            price = totalPrice + parseFloat($(this).attr("data-price"));
            productNum++
        } else {
            price = totalPrice - parseFloat($(this).attr("data-price"));
            productNum--
        }
        $("#comb-price-" + sku + "-" + dataIndex).html(price.toFixed(2));
        $("#comb-count-" + sku + "-" + dataIndex).html(productNum);
        flag = 0;
        $(this).removeAttr("disabled")
    })
}
;
$(function() {
    $("#Recommend").on("click", "ul li a", function() {
        ec.dapClick(300022701, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            recProductId: (($(this).attr("href") || "").match(/^\/product\/(\d+)\.html/) || [])[1],
            click: 1
        })
    });
    $(".product-button-oldnew").on("click", function() {
        ec.dapClick(300022801, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            click: 1
        })
    })
});
ec.product.showPosters = function() {
    var sku = ec.product.getSkuInfo(ec.product.getSku());
    var timeIn = function(start, end, now) {
        now = now ? ec.util.parseDate(now) : new Date;
        start = start ? ec.util.parseDate(start) : new Date(now.getTime() + 1e8);
        end = end ? ec.util.parseDate(end) : new Date(now.getTime() - 1e8);
        return start <= now && end > now
    };
    var html = [];
    if ("undefined" === typeof prdPosters)
        prdPosters = {
            prd: [],
            sbom: []
        };
    var poster = _.find(prdPosters.sbom, function(o) {
        return o.sbomCode === sku.code && timeIn(o.startDate, o.endDate)
    });
    if (!poster) {
        poster = _.find(prdPosters.prd, function(o) {
            return timeIn(o.startDate, o.endDate)
        })
    }
    if (poster) {
        html.push('<li><a href="javascript:;"><img src="' + ec.mediaPath + poster.path + "78_78_" + poster.name + '" alt="' + sku.name + '"/></a></li>')
    }
    html.push('<li><a href="javascript:;"><img src="' + ec.mediaPath + sku.photoPath + "78_78_" + sku.photoName + '" alt="' + sku.name + '"/></a></li>');
    if (sku.groupPhotoList) {
        for (var i = 0; i < sku.groupPhotoList.length; i++) {
            var c = sku.groupPhotoList[i];
            html.push('<li><a href="javascript:;"><img src="' + ec.mediaPath + c.path + "/78_78_" + c.name + '"  alt="' + sku.name + '"/></a></li>')
        }
    }
    html = $(html.join(""));
    html.find("img").mouseover(_proGallerysMouseOver);
    $("#pro-gallerys").empty().html(html);
    $("#pro-gallerys li:first").addClass("current");
    var cimg = $("#pro-gallerys li:first img").attr("src");
    $("#product-img").attr("href", cimg.replace("78_78", "800_800")).find("img").attr("src", cimg.replace("78_78", "428_428"));
    $("#product-img").CloudZoom();
    setTimeout(function() {
        var imgLoader = new Image;
        imgLoader.onload = function() {
            $("#pic-container .cloud-zoom-loading").remove()
        }
        ;
        imgLoader.src = cimg.replace("78_78", "800_800")
    }, 1e3);
    ec.product.imgSlider.reset()
}
;
ec.product.showPrice = function(depositObject) {
    var sku = ec.product.getSkuInfo(ec.product.getSku());
    var price = parseFloat(sku.price);
    var originPrice = parseFloat(sku.originPrice);
    if (depositObject) {
        if (depositObject.isSurePrice < 1) {
            price = 0
        }
    }
    $("#pro-price-label").removeClass("type").addClass("f24");
    $("#pro-price-label-deposit").hide();
    $("#pro-price-deposit").text("").hide();
    $("#pro-price-label-amount").hide();
    $("#pro-price-amount").text("").hide();
    $("#pro-price-hide").valS(price);
    $("#pro-price-old").text("").hide();
    if (price < .01 || sku.priceMode == 2) {
        $("#pro-price-label").text("暂无报价").show();
        $("#pro-price").text("").hide()
    } else {
        $("#pro-price-label").hide();
        $("#pro-price").html("<em>&yen;</em>" + price.toFixed(2)).show();
        if (originPrice != price) {
            $("#pro-price-old").html("<em>&yen;</em>" + originPrice.toFixed(2)).show();
            $("#pro-price-label").removeClass("f24").addClass("type").text("抢购价").show()
        }
    }
    if (depositObject) {
        if (depositObject.depositPrice) {
            $("#pro-price-old").hide();
            $("#pro-price-label-deposit").show();
            $("#pro-price-deposit").html("<em>&yen;</em>" + parseFloat(depositObject.depositPrice).toFixed(2)).show()
        }
        if (depositObject.amountPrice) {
            $("#pro-price-label-amount").text("可抵").show();
            $("#pro-price-amount").html("<em>&yen;</em>" + parseFloat(depositObject.amountPrice).toFixed(2)).show()
        }
    } else {
        $("#buyProcessIDD").hide()
    }
    ec.product.refreshStyle()
}
;
$(function() {
    $("body").on("click", "#pro-operation a.product-button01", function() {
        ec.cart.dap(300020401, $(this).find("span").text() || $(this).text())
    });
    $("body").on("click", "#pro-operation a.product-button02", function() {
        ec.cart.dap(300020501, $(this).find("span").text() || $(this).text())
    });
    $("#layoutRelative").on("click", "a.product-button02", function() {
        ec.cart.dap(300020403, $(this).text())
    });
    var names = {
        "pro-tab-feature": "详情",
        "pro-tab-parameter": "参数",
        "pro-tab-package-service": "包装",
        "pro-tab-evaluate": "评价"
    };
    $("#layoutRelative p a:visible").each(function(idx, self) {
        $(self).click(function() {
            ec.dapClick("300021201", {
                productId: ec.product.id,
                SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
                index: idx,
                name: names[$(self).attr("id")],
                click: 1
            })
        })
    });
    $("a.product-slogan-link").on("click", function() {
        ec.dapClick(300021601, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            name: $(this).text(),
            URL: $(this).attr("href"),
            click: 1
        })
    });
    $("#pro-skus").on("click", "dl.product-choose ul li", function() {
        ec.dapClick(300021901, {
            productId: ec.product.id,
            SKUCode: (ec.product.getSkuInfo(ec.product.getSku()) || {}).code,
            line: $(this).closest("dl.product-choose").index(),
            titleId: "",
            title: $(this).find(".sku a").attr("title"),
            index: $(this).index(),
            type: {
                "制式": 1,
                "地区": 2,
                "型号": 3,
                "套餐": 4,
                "容量": 5,
                "版本": 6,
                "类型": 7,
                "颜色": 8,
                "定制": 9,
                "其他": 10
            }[$(this).attr("data-attrname")] || 0,
            content: $(this).find(".sku a").attr("title"),
            click: 1
        })
    })
});
$(function() {
    if (ec.product.seCode && ec.product.seCode !== "VMALL-HUAWEIDEVICE") {
        var carrierCode = ec.product.seCode;
        $.ajax({
            url: "/queryCarrierCert.json",
            type: "post",
            data: {
                jsonParamString: JSON.stringify([carrierCode])
            },
            dataType: "json",
            success: function(r) {
                if (r && r.carrierCertList && r.carrierCertList.length > 0) {
                    var timeIn = function(start, end, now) {
                        now = now ? ec.util.parseDate(now) : new Date;
                        start = start ? ec.util.parseDate(start) : new Date(0);
                        end = end ? ec.util.parseDate(end) : new Date(now.getTime() + 1e8);
                        return start <= now && end > now
                    };
                    var certs = _.filter(r.carrierCertList, function(v) {
                        return v.certStatus && timeIn(v.startTime, v.endTime)
                    });
                    certs = _.sortBy(certs, "orderNum");
                    if (certs.length > 0) {
                        ec.Cache.set("carrierCert." + carrierCode, certs);
                        $("#j-carrierCertBtn").show()
                    }
                }
            }
        })
    }
});
ec.product.showCarrierCert = function(carrierCode) {
    carrierCode = carrierCode || ec.product.seCode;
    var certs = ec.Cache.contains("carrierCert." + carrierCode);
    if (certs) {
        var html = "";
        certs.forEach(function(v) {
            html += '<p><img width="100%" src="' + ec.mediaPath + v.certFilePath + '" name="' + v.certName + '"></p>'
        });
        html = '<div style="padding-right:7px; text-align: center; height: 412px; overflow: auto; margin-top: 8px;">' + html + "</div>";
        new ec.box(html,{
            boxid: "jb-showCarrierCert",
            boxclass: "ol_box_4",
            title: "商家资质证照",
            width: 700,
            height: 432,
            remember: false,
            showButton: false
        }).open()
    } else {
        alert("暂无数据")
    }
}
;
