~(function() {
  var typeMap = ['inland','nation'];
  var typeLabel = {inland:'国内航线',nation:'国际航线'};
  $(function() {
    $("#search").click(function() {
      table.init();
    });
    $("#reset").click(function() {
      $("#form input").each(function() {
        $(this).val("");
      });
    });
    //modal消失事件
    $("#exampleModal").on("hidden.bs.modal", function() {
      console.log('hideen')
      //location.reload();
      //参数id清空
      $("#id").val("");
      $("#modalAirlinePriceBaseSetName").val("");
      $("#modalAirlinePriceBaseSetName").prop("readonly", false);
      $("#modalUpdate").hide();
      $("#modalSave").show();
      formModal.init();
      detailModal.init();
    });

    function getCommonSubmitData(){
      //新增参数及修改通用数据获取
      var upgfType = $("[name=upgfType]").val();
      var inland = $(".J-inland-form").serializeArray();
      var nation = $(".J-nation-form").serializeArray();
      var adult = $(".J-price-table [name=adult]").val();
      var child = $(".J-price-table [name=child]").val();
      var baby = $(".J-price-table [name=baby]").val();
      var weighCabin = $('[name=weighCabin]').val();
      var differDiscount = $('[name=differDiscount]').val();
      var airlinePriceBaseSetName = $("[name=airlinePriceBaseSetName]").val();
      var airlineType = typeMap[$('#airlineType').val()];
      var airInfos=[],inlandObj={},nationObj={};
      for (i = 0; i < inland.length; i++) {
        var obj = inland[i];
        if (obj.value === "all" || /^search-/.test(obj.name)) continue;
        if (obj.name in inlandObj) {
          inlandObj[obj.name].segments += "," + obj.value;
        } else {
          inlandObj[obj.name] = {
            airlineName: "国内航线",
            intFlag: "D",
            classifyType: "distance",
            classifyValue: obj.name,
            segments: obj.value
          };
        }
      }
      for (i = 0; i < nation.length; i++) {
        obj = nation[i];
        if (obj.value === "all" || /^search-/.test(obj.name)) continue;
        if (obj.name in nationObj) {
          nationObj[obj.name].segments += "," + obj.value;
        } else {
          nationObj[obj.name] = {
            airlineName: "国际/地区航线",
            intFlag: "I",
            classifyType: "area",
            classifyValue: obj.name,
            segments: obj.value
          };
        }
      }
      airInfos=airlineType==='inland'?inland:nation;
      console.log(airInfos)
      return {
        upgfType: upgfType,
        airlinePriceBaseSetName: airlinePriceBaseSetName,
        airlineInfos: airInfos,
        weighCabin:weighCabin,
        differDiscount: differDiscount,
        priceInfo: [
          {
            currency: "CNY",
            passengerType:'ADT',
            fee:adult
          },{
            currency: "CNY",
            passengerType:'CHD',
            fee:child
          },{
            currency: "CNY",
            passengerType:'INFANT',
            fee:baby
          }
        ]
      };
    }

    //修改表单提交
    $("#modalUpdate").on("click", function(e) {
      var flag = true;
      var id = $("#id").val();
      var param = getCommonSubmitData()

      
      // var airInfos = [];
      // for (var key in inlandObj) {
      //   airInfos.push(inlandObj[key]);
      // }
      // for (key in nationObj) {
      //   airInfos.push(nationObj[key]);
      // }
      if (!param.airlinePriceBaseSetName) {
        alert("参数名称未填写，无法保存！");
        flag = false;
      } else if (param.airlineInfos.length == 0) {
        alert("航线信息未填写，无法保存！");
        flag = false;
      }
      if (flag) {
        var res = Object.assign({id:id},param);
        var req = JSON.stringify(res);
        layer.confirm(
          "修改此参数可能会对现有活动造成影响，是否确定继续进行修改？",
          {
            //按钮
            btn: ["确定", "取消"]
          },
          function(index) {
            //新增提交
            $.ajax({
              type: "POST",
              dataType: "json",
              contentType: "application/json;charset=UTF-8",
              url: "/upGradeBaseSet/addAndUpdate?rand=" + Math.random(),
              data: req,
              success: function(resp) {
                //data回调信息
                layer.close(index);
                if (resp.status == 200) {
                  //成功
                  $("#exampleModal").modal("hide");
                  toastr["success"]("更新成功！", "状态");
                  initTable();
                } else if (resp.status == 500) {
                  toastr["error"]("更新失败！", resp.message);
                }
              }
            });
          }
        );
      }
    });
    //新增表单提交
    $("#modalSave").on("click", function(e) {
      var flag = true;
      // var upgfType = $("[name=upgfType]").val();
      // var inland = $(".J-inland-form").serializeArray();
      // var nation = $(".J-nation-form").serializeArray();
      // var adult = $(".J-price-table [name=adult]").val();
      // var child = $(".J-price-table [name=child]").val();
      // var baby = $(".J-price-table [name=baby]").val();
      // var weighCabin = $('[name=weighCabin]').val();
      // var differDiscount = $('[name=differDiscount]').val();

      // var airlinePriceBaseSetName = $("[name=airlinePriceBaseSetName]").val();
      // var inlandObj = {},
      //   nationObj = {};

      // for (i = 0; i < inland.length; i++) {
      //   var obj = inland[i];
      //   if (obj.value === "all" || /^search-/.test(obj.name)) continue;
      //   if (obj.name in inlandObj) {
      //     inlandObj[obj.name].segments += "," + obj.value;
      //   } else {
      //     inlandObj[obj.name] = {
      //       airlineName: "国内航线",
      //       intFlag: "D",
      //       classifyType: "distance",
      //       classifyValue: obj.name,
      //       segments: obj.value
      //     };
      //   }
      // }
      // for (i = 0; i < nation.length; i++) {
      //   obj = nation[i];
      //   if (obj.value === "all" || /^search-/.test(obj.name)) continue;
      //   if (obj.name in nationObj) {
      //     nationObj[obj.name].segments += "," + obj.value;
      //   } else {
      //     nationObj[obj.name] = {
      //       airlineName: "国际/地区航线",
      //       intFlag: "I",
      //       classifyType: "area",
      //       classifyValue: obj.name,
      //       segments: obj.value
      //     };
      //   }
      // }
      // var airInfos = [];
      // for (var key in inlandObj) {
      //   airInfos.push(inlandObj[key]);
      // }
      // for (key in nationObj) {
      //   airInfos.push(nationObj[key]);
      // }
      var param = getCommonSubmitData()
      if (!param.upgfType) {
        alert("升舱类型未选择，无法保存！");
        flag = false;
      } else if (!param.airlinePriceBaseSetName) {
        alert("参数名称未填写，无法保存！");
        flag = false;
      } else if (param.airlineInfos.length == 0) {
        alert("航线信息未填写，无法保存！");
        flag = false;
      }


      if (flag) {
        var res = Object.assign({},param)
        var req = JSON.stringify(res);
        //新增提交
        $.ajax({
          type: "POST",
          dataType: "json",
          contentType: "application/json;charset=UTF-8",
          url: "/upGradeBaseSet/addAndUpdate?rand=" + Math.random(),
          data: req,
          success: function(resp) {
            //data回调信息
            if (resp.status == 200) {
              //成功
              $("#exampleModal").modal("hide");
              toastr["success"]("添加成功！", "状态");
              initTable();
            } else if (resp.status == 500) {
              toastr["error"]("添加失败！", resp.message);
            }
          }
        });
      }
    });
  });

  var airlines = {
    inland: [],
    nation: []
  };
  var labelObj = {
    "0-1000": "航距小于等于1000KM",
    "1000-1500": "航距1000KM-1500KM",
    "1500-2000": "航距1500KM-2000KM",
    "2000-99999": "航距大于2000KM"
  };
  var $priceTable, $table;
  var $detailSeatTable, $detailPriceTable;

  function priceFormat(value) {
    var temp = '<p class="price">{{content}}</p>';
    var str = "";
    for (var i = 0; i < value.length; i++) {
      str += temp.replace("{{content}}", value[i] ? value[i] : "- -");
    }
    return str ? str : "- -";
  }

  var table = {
    init: function() {
      initTable();
    }
  };
  // 列表初始化
  function initTable() {
    $table = $("#table")
      .bootstrapTable("destroy")
      .bootstrapTable({
        url: "/query.json",
        // url: "/upGradeBaseSet/query",
        method: "get",
        // method: "post",
        pagination: true, //是否显示分页（*）
        striped: true, //隔行换色
        sidePagination: "client", //分页方式
        pageNumber: 1, //初始化table时显示的页码
        pageSize: 5, //每页条目
        pageList: [5, 10, 20, 50],
        locale: "zh-CN",
        sortable: true, //排序
        showColumns: false, //是否显示 内容列下拉框
        clickToSelect: false, //点击选中checkbox
        singleSelect: true, //启用单行选中
        showExport: false, //是否显示导出
        exportDataType: "all", //basic', 'all', 'selected'.
        queryParamsType: "", //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        search: false,
        columns: [
          {
            field: "number",
            title: "序号",
            formatter: function(value, row, index) {
              var pageSize = $("#table").bootstrapTable("getOptions").pageSize;
              var pageNumber = $("#table").bootstrapTable("getOptions")
                .pageNumber;
              return index + 1;
            }
          },
          {
            field: "id",
            title: "参数ID"
          },
          {
            field: "airlinePriceBaseSetName",
            title: "参数名称"
          },
          {
            field: "upgfType",
            title: "升舱类型"
          },
          {
            field: "segments",
            title: "航线名称",
            formatter: function(value) {
              var html = "";
              var temp = "<div>{{segment}}</div>";
              var arr = [];
              value.forEach(function(item) {
                for (var j = 0; j < item.length; j++) {
                  item[j] && arr.push(item[j]);
                }
              });
              for (var i = 0; i < arr.length && i < 5; i++) {
                //html += temp.replace('{{segment}}', arr[i] + ',');
                html += temp.replace("{{segment}}", arr[i] + "");
              }
              return arr.length > 5 ? html + "..." : html;
            }
          },
          {
            field: "currencyName",
            title: "币种",
            formatter: priceFormat
          },
          {
            field: "basePrice",
            title: "原价",
            formatter: priceFormat
          },
          {
            field: "lowPrice",
            title: "底价",
            formatter: priceFormat
          },
          {
            field: "highPrice",
            title: "最高价",
            formatter: priceFormat
          },
          {
            field: "operation",
            title: "操作",
            align: "center",
            formatter: function(value, row) {
              if ("F" == row.status) {
                //禁用状态展示启用
                return (
                  '<button type="button" class="btn btn-outline-secondary showa" style="margin: 0px 2px;font-size: inherit;" id="show" data-id="' +
                  row.id +
                  '" >查看</button>' +
                  '<button type="button" class="btn btn-outline-primary update" style="margin: 0px 2px;font-size: inherit;" id="update" data-id="' +
                  row.id +
                  '" >修改</button>' +
                  '<button type="button" class="btn  btn-danger enable" style="margin: 0px 2px;font-size: inherit;" id="enableById" data-id="' +
                  row.id +
                  '" >未启用</button>' +
                  '<button type="button" class="btn btn-outline-danger delete" style="margin: 0px 2px;font-size: inherit;" id="deleteById" data-id="' +
                  row.id +
                  '">删除</button>'
                );
              } else if ("T" == row.status) {
                //启用状态展示禁用
                return (
                  '<button type="button" class="btn btn-outline-secondary showa" style="margin: 0px 2px;font-size: inherit;" id="show" data-id="' +
                  row.id +
                  '" >查看</button>' +
                  '<button type="button" class="btn btn-outline-primary update" style="margin: 0px 2px;font-size: inherit;" id="update" data-id="' +
                  row.id +
                  '" >修改</button>' +
                  '<button type="button" class="btn btn-success forbid" style="margin: 0px 2px;font-size: inherit;" id="forbidById" data-id="' +
                  row.id +
                  '" >已启用</button>' +
                  '<button type="button" class="btn btn-outline-danger delete" style="margin: 0px 2px;font-size: inherit;" id="deleteById" data-id="' +
                  row.id +
                  '">删除</button>'
                );
              }
            }
          }
        ],
        queryParams: function queryParams(params) {
          //设置查询参数
          var param = {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize
          };
          if ($("#paramId").val().length > 0) {
            param.id = $("#paramId").val();
          }
          if ($("#airlinePriceBaseSetName").val().length > 0) {
            param.airlinePriceBaseSetName = $("#airlinePriceBaseSetName").val();
          }
          if ($("#depCode").val().length > 0) {
            param.depCode = $("#depCode").val();
          }
          if ($("#arrCode").val().length > 0) {
            param.arrCode = $("#arrCode").val();
          }
          return param;
        },
        responseHandler: function(res) {
          /*console.log(res);
                  testData = res.rows[1];*/
          var arr = [];
          if (res.rows.length > 0) {
            var defaultRow = {
              id: "",
              airlinePriceBaseSetName: "",
              upgfType: "",
              segments: [],
              currencyName: [],
              basePrice: [],
              lowPrice: [],
              highPrice: []
            };
            for (var i = 0; i < res.rows.length; i++) {
              var row = res.rows[i];
              var obj = {
                id: row.id || "",
                airlinePriceBaseSetName: row.airlinePriceBaseSetName || "",
                upgfType: (row.cabinType && row.cabinType.upCabinName) || "",
                segments:
                  (row.upgAirlineBaseSets &&
                    row.upgAirlineBaseSets.map(function(item) {
                      return item.segments ? item.segments.split(",") : [];
                    })) ||
                  [],
                status: row.status || ""
              };
              var nameArr = [],
                basePriceArr = [],
                lowPriceArr = [],
                highPriceArr = [];
              try {
                for (var j = 0; j < row.priceInfos.length; j++) {
                  var name =
                    row.priceInfos[j].currencyName +
                    "（" +
                    row.priceInfos[j].currencyUnit +
                    "）";
                  var basePrice = '';
                  row.priceInfos[j].feeDetailList.forEach(function(item){
                    basePrice += item.fee + '/ (' + item.passengerTypeDesc +') '
                  })
                  var lowPrice = row.priceInfos[j].lowPrice;
                  var highPrice = row.priceInfos[j].highPrice;
                  nameArr.push(name);
                  basePriceArr.push(basePrice);
                  lowPriceArr.push(lowPrice);
                  highPriceArr.push(highPrice);
                }
              } catch (err) {
                console.warn(err);
              }
              arr.push(
                Object.assign({}, defaultRow, obj, {
                  currencyName: nameArr,
                  basePrice: basePriceArr,
                  lowPrice: lowPriceArr,
                  highPrice: highPriceArr
                })
              );
            }
          }
          return {
            total: res.total, //总页数
            rows: arr //数据
          };
        },
        onPostBody: function(data) {
          //绑定操作编辑按钮
          $(".update").click(function() {
            $("#modalUpdate").show();
            $("#modalSave").hide();
            var id = $(this).attr("data-id");
            //数据回显  拿到id重新查再回显
            modalWriteBack(id, "update");
            $("#exampleModal").modal("show");
          });
          $(".showa").click(function() {
            var id = $(this).attr("data-id");
            $("#modalUpdate").hide();
            $("#modalSave").hide();
            //数据回显
            modalWriteBack(id, "show");
            $("#exampleModal2").modal("show");
          });
          //绑定操作删除按钮
          $(".delete").click(function() {
            var id = $(this).attr("data-id");
            var res = {
              id: id
            };
            var req = JSON.stringify(res);
            layer.confirm(
              "确定要删除？",
              {
                btn: ["确定", "取消"] //按钮
              },
              function(index) {
                //删除时间
                $.ajax({
                  type: "post",
                  url: "/upGradeBaseSet/deleteById/",
                  dataType: "json",
                  data: req,
                  contentType: "application/json",
                  success: function(data) {
                    layer.close(index);
                    if (data.success) {
                      toastr["success"]("删除成功！", "状态");
                      $("#table").bootstrapTable("refresh");
                    } else {
                      toastr["error"]("删除失败！", data.msg);
                    }
                  },
                  error: function() {
                    layer.close(index);
                    toastr["error"]("删除失败！", "状态");
                  }
                });
              }
            );
          });
          //禁用操作
          $(".forbid").click(function() {
            var id = $(this).attr("data-id");
            var res = {
              id: id
            };
            var req = JSON.stringify(res);
            layer.confirm(
              "确定要禁用？",
              {
                btn: ["确定", "取消"] //按钮
              },
              function(index) {
                $.ajax({
                  type: "post",
                  url: "/upGradeBaseSet/forbidById/",
                  dataType: "json",
                  data: req,
                  contentType: "application/json",
                  success: function(data) {
                    layer.close(index);
                    if (data.success) {
                      toastr["success"]("禁用成功！", "状态");
                      $("#table").bootstrapTable("refresh");
                    } else {
                      toastr["error"]("禁用失败！", data.msg);
                    }
                  },
                  error: function() {
                    layer.close(index);
                    toastr["error"]("禁用失败！", "状态");
                  }
                });
              }
            );
          });
          //启用操作
          $(".enable").click(function() {
            var id = $(this).attr("data-id");
            var res = {
              id: id
            };
            var req = JSON.stringify(res);
            layer.confirm(
              "确定要启用？",
              {
                btn: ["确定", "取消"] //按钮
              },
              function(index) {
                $.ajax({
                  type: "post",
                  url: "/upGradeBaseSet/enableById/",
                  dataType: "json",
                  data: req,
                  contentType: "application/json",
                  success: function(data) {
                    layer.close(index);
                    if (data.success) {
                      toastr["success"]("启用成功！", "状态");
                      $("#table").bootstrapTable("refresh");
                    } else {
                      toastr["error"]("启用失败！", data.msg);
                    }
                  },
                  error: function() {
                    layer.close(index);
                    toastr["error"]("启用失败！", "状态");
                  }
                });
              }
            );
          });
        }
      });
  }

  // 获取 airline 信息
  function getAirlineInfos() {
    return $.ajax({
      url: '/lines.json',
      // url: "/airlineInfoManage/getAllAirlineInfo?rand=" + Math.random(),
      type: "GET"
    });
  }

  // render 航线信息表格 type：form or detail
  function renderAirlineTable(data, type) {
    renderAirTab(
      ".J-form-modal .J-inland-tablist",
      ".J-form-modal .J-nation-tablist",
      data
    );
    renderAirTabContent(
      ".J-form-modal .J-inland-tab-content",
      ".J-form-modal .J-nation-tab-content",
      data
    );
  }

  // render 航线tab
  function renderAirTab(inlandSelector, nationSelector, airlines) {
    var inland = generateTabTemp(airlines.inland);
    $(inlandSelector).html(inland);
    var nation = generateTabTemp(airlines.nation, "nation");
    $(nationSelector).html(nation);
  }

  // render 航线tab content
  function renderAirTabContent(inlandSelector, nationSelector, airlines) {
    var inland = generateTabContentTemp(
      airlines.inland,
      generateFormTabContentTemp
    );
    $(inlandSelector).html(inland);
    var nation = generateTabContentTemp(
      airlines.nation,
      generateFormTabContentTemp,
      "nation"
    );
    $(nationSelector).html(nation);
  }

  function renderDetailAirTabContent(inlandSelector, nationSelector, airlines) {
    var inland = generateTabContentTemp(
      airlines.inland,
      generateDetailTabContentTemp
    );
    $(inlandSelector).html(inland);
    var nation = generateTabContentTemp(
      airlines.nation,
      generateDetailTabContentTemp,
      "nation"
    );
    $(nationSelector).html(nation);
  }

  /**
   *
   * @param {*} arr
   * @param {*} type nation 国际航线
   */
  function generateTabTemp(arr, type) {
    var temp =
      '<a class="list-group-item list-group-item-action {{active}}" id="list-home-list" data-toggle="list" href="#{{id}}" role="tab" >{{distance}}</a>';
    var labelTemp = "";
    for (var i = 0; i < arr.length; i++) {
      var labelKey = arr[i].classifyValue || "";

      if (type === "nation") {
        labelTemp += temp
          .replace("{{distance}}", arr[i].airlineDesc)
          .replace("{{active}}", i === 0 ? "active" : "")
          .replace(
            "{{id}}",
            arr[i].type ? "detail" + arr[i].airlineDesc : arr[i].airlineDesc
          );
      } else {
        labelTemp += temp
          .replace("{{distance}}", labelObj[labelKey])
          .replace("{{active}}", i === 0 ? "active" : "")
          .replace(
            "{{id}}",
            arr[i].type ? "detail" + labelObj[labelKey] : labelObj[labelKey]
          );
      }
    }
    return labelTemp;
  }

  function generateTabContentTemp(arr, cb, type) {
    var groupTemp = "";

    for (var i = 0; i < arr.length; i++) {
      var labelKey = arr[i].classifyValue || "";
      var segments;
      if (typeof arr[i].segments === "string") {
        segments = (arr[i].segments && arr[i].segments.split(",")) || [];
      } else {
        segments = arr[i].segments;
      }
      if (type === "nation") {
        groupTemp += cb(
          segments,
          arr[i].airlineDesc,
          labelKey,
          i === 0 ? true : false
        );
      } else {
        groupTemp += cb(
          segments,
          labelObj[labelKey],
          labelKey,
          i === 0 ? true : false
        );
      }
    }

    return groupTemp;
  }

  function generateDetailTabContentTemp(arr, tabId, name, active) {
    var container =
      '<div class="tab-pane J-tab fade show {{active}}" id="detail{{tabId}}" role="tabpanel"><div class="checkbox-list J-checkbox-list" data-type="">{{content}}</div></div>';
    var airTemp =
      '<div class="form-check form-check-inline"><label class="form-check-label">{{label}}</label></div>';
    var res = "";
    for (var i = 0; i < arr.length; i++) {
      var temp = airTemp.replace(/\{\{label\}\}/g, arr[i]);
      res += temp;
    }
    return container
      .replace(/\{\{tabId\}\}/g, tabId)
      .replace("{{content}}", res)
      .replace("{{active}}", active ? "active" : "");
  }

  function generateFormTabContentTemp(arr, tabId, name, active) {
    var container =
      '<div class="tab-pane J-tab fade show {{active}}" id="{{tabId}}" role="tabpanel"><div class="checkbox-list J-checkbox-list" data-type=""><div class="form-row" style="padding:10px 0"><div class="col-6"><input type="text" class="form-control" style="margin-right:8px;font-size: 12px" name="search-' +
      name +
      '"></div><div class="col"><button class="btn btn-primary J-search" style="font-size: 12px">搜索</button><div class="btn btn-primary J-reset" style="font-size: 12px">重置</div></div></div>{{content}}<p class="no-result J-no-result">抱歉，未查询到相关航线</p></div></div>';
    var checkTemp =
      '<div class="form-check form-check-inline"><input type="checkbox" name="{{name}}" value="{{label}}" class="form-check-input" id="{{label}}"><label class="form-check-label" for="{{label}}">{{label}}</label></div>';
    var res = "";
    for (var i = 0; i < arr.length; i++) {
      var temp = checkTemp
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{label\}\}/g, arr[i]);
      res += temp;
    }
    res =
      '<div class="form-check form-check-inline"><input type="checkbox" name="' +
      name +
      '" class="form-check-input J-all" id="' +
      "all-" +
      name +
      '" value="all"><label class="form-check-label" for="' +
      "all-" +
      name +
      '">' +
      "全部" +
      "</label></div>" +
      res;
    return container
      .replace(/\{\{tabId\}\}/g, tabId)
      .replace("{{content}}", res)
      .replace("{{active}}", active ? "active" : "");
  }

  function formatData(data) {
    // var currency = [];
    // for (var i = 0; i < data.priceInfos.length; i++) {
    //   var cur = data.priceInfos[i];
    //   currency.push({
    //     name: cur.currencyName,
    //     code: cur.currencyCode,
    //     //exchangeRate: cur.basePrice
    //     basePrice: cur.basePrice || ""
    //   });
    // }
    var segments = [];
    for (i = 0; i < data.upgAirlineBaseSets.length; i++) {
      segments.push({
        segments: data.upgAirlineBaseSets[i].segments.split(","),
        label: data.upgAirlineBaseSets[i].classifyValue,
        classifyValue: data.upgAirlineBaseSets[i].classifyValue,
        airlineDesc:
          data.upgAirlineBaseSets[i].intFlag === "I"
            ? data.upgAirlineBaseSets[i].airlineDesc || ""
            : "",
        type: data.upgAirlineBaseSets[i].intFlag === "I" ? "nation" : "inland"
      });
    }

    return {
      upgfType: {
        label: data.cabinType.upCabinName,
        value: data.cabinType.upgfType
      },
      segments: segments,
      seats: data.planeSeatInfos,
      currency: data.priceInfos,
      paramId: data.airlinePriceBaseSetName,
      id: data.id
    };
  }

  // function initSeatTable() {
  //   $seatTable = $(".J-seat-table")
  //     .bootstrapTable("destroy")
  //     .bootstrapTable({
  //       url: "/seatInfoManage/getPlaneSeatInfo?rand=" + Math.random(),
  //       method: "get",
  //       search: false,
  //       columns: [
  //         {
  //           field: "planeTypeName",
  //           title: "机型"
  //         },
  //         {
  //           field: "holdBackBusinessNum",
  //           title: "活动提前关闭时座位数",
  //           formatter: function(value, row) {
  //             var temp;
  //             if (null == value) {
  //               temp =
  //                 '<input type="text" class="form-control" name="{{name}}" id="businessClassSeatNum" value="" oninput = "value=value.replace(/[^\\d]/g,\'\')">';
  //             } else {
  //               temp =
  //                 '<input type="text" class="form-control" name="{{name}}" id="businessClassSeatNum" value="{{value}}" oninput = "value=value.replace(/[^\\d]/g,\'\')">';
  //             }
  //             return temp
  //               .replace(/\{\{name\}\}/, row.planeTypeName || "")
  //               .replace(/\{\{value\}\}/, value);
  //           }
  //         },
  //         {
  //           field: "businessClassSeatNum",
  //           title: "公务舱座位总数",
  //           formatter: function(value, row) {
  //             var temp =
  //               '<input type="text" class="form-control" name="{{name}}" id="businessClassSeatNum" value="{{value}}" readonly>';
  //             return temp
  //               .replace(/\{\{name\}\}/, row.planeTypeName || "")
  //               .replace(/\{\{value\}\}/, value);
  //           }
  //         }
  //       ],
  //       queryParams: function queryParams(params) {},
  //       responseHandler: function(res) {
  //         return res;
  //       }
  //     });
  // }

  function initPriceTable() {
    $priceTable = $(".J-price-table")
      .bootstrapTable("destroy")
      .bootstrapTable({
        // url: "/upGradeBaseSet/queryCurrency?rand=" + Math.random(),
        // method: "get",
        data: [{name:'CNY',feeDetailList:[
          {fee:201,passengerType:'ADT'},
          {fee:101,passengerType:'CHD'},
          {fee:1,passengerType:'INFANT'},
        ]}],
        search: false,
        columns: [
          {
            field: "name",
            title: "币种",
            width: 120
          },
          {
            field: "feeDetailList",
            title: "原价（元）",
            formatter: function(value) {
              var temp = $('#J-priceInfo').html();
              var adult = 0, child=0, baby = 0;
              value.forEach(function(item){
                if(item.passengerType === 'ADT'){
                  adult = item.fee
                }else if(item.passengerType === 'CHD'){
                  child = item.fee
                }else if(item.passengerType === 'INFANT'){
                  baby = item.fee
                }
              })
              temp = temp.replace(/\{\{adult\}\}/g,adult).replace(/\{\{child\}\}/g,child).replace(/\{\{baby\}\}/g,baby)
              return temp
              // return (
              //   '<input type="text" class="form-control" name="CNY" id="basePrice" value="' +
              //   (value ? value : "") +
              //   '" oninput = "value=value.replace(/[^\\d]/g,\'\')">'
              // );
            }
          }
        ],
        responseHandler: function(res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].code === "CNY") {
              return [res[i]];
            }
          }
          return [];
        }
      });
  }

  function toggleInlandAndNation(showVal) {
    //国际 国内航线 tab 内容切换
    if(showVal==='1'){
      $(".J-nation-tab").removeClass('hide');
      $(".J-inland-tab").addClass('hide');
    }else{
      $(".J-nation-tab").addClass('hide');
      $(".J-inland-tab").removeClass('hide');
    }
  }

  function initAirlineTypeEvt(){
    var temp = $('#J-air-table-header-temp').html();
    var val = $('#airlineType').val();
    renderHeaderByType('.J-air-table-header',val);
    toggleInlandAndNation(val)
    
    
    $(document).on('change','#airlineType',function(e){
      var value = e.target.value;
      renderHeaderByType('.J-air-table-header',value);
      toggleInlandAndNation(value)
    })

    function renderHeaderByType(el,val){
      var type = typeMap[val]
      var label = typeLabel[type];
      var template = temp.replace(/\{\{airType\}\}/g,type).replace(/\{\{airTypeLabel\}\}/g,label);
      $(el).html(template)
    }
  }

  function initSelectAll() {
    //点击 全选/全不选
    $(document).on("change", ".J-all", function(e) {
      if ($(e.target).prop("checked")) {
        var $list = $(e.target)
          .closest(".J-checkbox-list")
          .find("input[type=checkbox]");
        $list.prop("checked", true);
      } else {
        $(this)
          .closest(".J-checkbox-list")
          .find("input[type=checkbox]")
          .prop("checked", false);
      }
    });
    $(document).on("change", "input[name=inland]", function(e) {
      if ($(e.target).prop("checked")) {
        $(".J-inland-tab-content")
          .find("input[type=checkbox]")
          .prop("checked", true);
      } else {
        $(".J-inland-tab-content")
          .find("input[type=checkbox]")
          .prop("checked", false);
      }
    });
    $(document).on("change", "input[name=nation]", function(e) {
      if ($(e.target).prop("checked")) {
        $(".J-nation-tab-content")
          .find("input[type=checkbox]")
          .prop("checked", true);
      } else {
        $(".J-nation-tab-content")
          .find("input[type=checkbox]")
          .prop("checked", false);
      }
    });
    $(document).on("change", ".J-form-modal input:checkbox", observeSelectAll);
  }

  function observeSelectAll() {
    //全选回显
    $(".J-checkbox-list").each(function(idx, list) {
      var $list = $(list);
      var $checkbox = $list.find("[type=checkbox]:not(.J-all)");
      var all_selected = true;
      $checkbox.each(function(idx2, checkbox) {
        if (!$(checkbox).prop("checked")) {
          all_selected = false;
        }
      });
      $list.find(".J-all").prop("checked", all_selected);
    });
    var $inland_all = $(".J-inland-tab-content").find(".J-all");
    var all_selected = true;
    $inland_all.each(function(idx, item) {
      if (!$(item).prop("checked")) all_selected = false;
    });
    $(".J-inland-all").prop("checked", all_selected);
    var $nation_all = $(".J-nation-tab-content").find(".J-all");
    all_selected = true;
    $nation_all.each(function(idx, item) {
      if (!$(item).prop("checked")) all_selected = false;
    });
    $(".J-nation-all").prop("checked", all_selected);
  }

  // function initDetailSeatTable() {
  //   $detailSeatTable = $(".J-detail-seat-table")
  //     .bootstrapTable("destroy")
  //     .bootstrapTable({
  //       url: "/seatInfoManage/getPlaneSeatInfo?rand=" + Math.random(),
  //       method: "get",
  //       search: false,
  //       columns: [
  //         {
  //           field: "planeTypeName",
  //           title: "机型"
  //         },
  //         {
  //           field: "holdBackBusinessNum",
  //           title: "活动提前关闭时座位数",
  //           formatter: function(value, row) {
  //             return value ? value : "--";
  //           }
  //         },
  //         {
  //           field: "businessClassSeatNum",
  //           title: "公务舱座位总数",
  //           formatter: function(value, row) {
  //             return value ? value : "--";
  //           }
  //         }
  //       ],
  //       queryParams: function queryParams(params) {},
  //       responseHandler: function(res) {
  //         return res;
  //       }
  //     });
  // }

  function initDetailPriceTable() {
    $detailPriceTable = $(".J-detail-price-table")
      .bootstrapTable("destroy")
      .bootstrapTable({
        // url: "/upGradeBaseSet/queryCurrency?rand=" + Math.random(),
        // method: "get",
        data: [{name:'CNY',feeDetailList:[
          {fee:201,passengerType:'ADT'},
          {fee:101,passengerType:'CHD'},
          {fee:1,passengerType:'INFANT'},
        ]}],
        search: false,
        columns: [
          {
            field: "name",
            title: "币种"
          },
          {
            field: "feeDetailList",
            title: "原价（元）",
            formatter: function(value) {
              var temp = $('#J-detail-priceInfo').html();
              var adult = 0, child=0, baby = 0;
              value.forEach(function(item){
                if(item.passengerType === 'ADT'){
                  adult = item.fee
                }else if(item.passengerType === 'CHD'){
                  child = item.fee
                }else if(item.passengerType === 'INFANT'){
                  baby = item.fee
                }
              })
              temp = temp.replace(/\{\{adult\}\}/g,adult).replace(/\{\{child\}\}/g,child).replace(/\{\{baby\}\}/g,baby)
              return temp
            }
          }
        ],
        // queryParams: function queryParams(params) {},
        responseHandler: function(res) {
          return res;
        }
      });
  }

  function initSearch() {
    $(document).on("click", ".J-search", function(e) {
      e.preventDefault();
      var $list = $(this).closest(".J-checkbox-list");
      var search_text = $list
        .find("input[type=text]")
        .val()
        .toUpperCase();
      var $checkbox = $list.find("input[type=checkbox]");
      var showCount = 0;
      $checkbox.each(function(idx, item) {
        var value = $(item)
          .val()
          .toUpperCase();
        if (value === "ALL") {
          search_text && search_text.length
            ? $(item)
                .parent()
                .addClass("hide")
            : $(item)
                .parent()
                .removeClass("hide");
        } else if (value.indexOf(search_text) > -1) {
          $(item)
            .parent()
            .removeClass("hide");
          showCount++;
        } else {
          $(item)
            .parent()
            .addClass("hide");
        }
      });
      showCount
        ? $list.find(".J-no-result").hide()
        : $list.find(".J-no-result").show();
    });
    //绑定搜索重置按钮
    $(document).on("click", ".J-reset", function(e) {
      $(this)
        .parent()
        .prev()
        .find("input")
        .val("");
    });
  }

  //modal数据
  var formModal = {
    getAirlineInfos: function(cb) {
      // 获取航线信息
      var res = getAirlineInfos();
      res
        .then(function(res) {
          airlines.inland = res.cnAirlineInfos || [];
          airlines.nation = res.areaAirlineInfos || [];
          cb && cb(airlines);
        })
        .fail(function(err) {
          console.log(err);
        });
    },

    renderAirTable: function() {
      if (airlines.inland.length || airlines.nation.length) {
        //render航线信息表格
        renderAirlineTable(airlines);
      } else {
        this.getAirlineInfos(renderAirlineTable);
      }
    },
    initAirTable: function() {
      //表头
      initAirlineTypeEvt();
      this.renderAirTable();
      //国际 国内航线切换
      // toggleInlandAndNation();
      //点击 全选/全不选
      initSelectAll();
    },
    initOtherTable: function() {
      //初始化座位信息
      // initSeatTable();
      //初始化价格信息
      initPriceTable();
    },
    init: function() {
      this.initAirTable();
      this.initOtherTable();
    },
    //数据渲染
    renderByData: function(data) {
      //type form 表单元素, detail 查看元素
      var defaultData = {
        upgfType: { value: "1" },
        segments: [],
        seats: [],
        currency: [],
        paramId: "",
        id: ""
      };
      if (data) {
        //id显示
        $(".J-id")
          .show()
          .find("input")
          .val(data.id);
        //名称显示
        $("#modalAirlinePriceBaseSetName").prop("readonly", true);
        
        data = formatData(data);
        var arr = [];
        for (var i = 0; i < data.segments.length; i++) {
          arr = arr.concat(data.segments[i].segments);
        }
        data.segments = arr;

      } else {
        $(".J-id").hide();
        $("#modalAirlinePriceBaseSetName").prop("readonly", false);
        data = defaultData;
      }
      $("#modalUpgfType").val(data.upgfType.value);
      $(".air-table [type=checkbox]").prop("checked", false);
      debugger
      console.log(data)
      for (var i = 0; i < data.segments.length; i++) {
        $("input[value=" + data.segments[i] + "]").prop("checked", true);
      }
      //全选回显
      observeSelectAll();
      // $seatTable.bootstrapTable("load", data.seats);
      $priceTable.bootstrapTable(
        "load",
        data.priceInfos.filter(function(cur) {
          return cur.currencyCode === "CNY";
        })
      );
      $("#modalAirlinePriceBaseSetName").val(data.airlinePriceBaseSetName);
    }
  };

  var detailModal = {
    renderAirTable: function() {},
    init: function() {
      this.renderAirTable();
      // initDetailSeatTable();
      initDetailPriceTable();
    },
    renderByData: function(data) {
      data = formatData(data);
      //TODO: type 确定
      var type = 'nation';
      var airlines = { inland: [], nation: [] };
      for (var i = 0; i < data.segments.length; i++) {
        if (data.segments[i].type === "nation") {
          airlines.nation.push(data.segments[i]);
        } else {
          airlines.inland.push(data.segments[i]);
        }
      }
      $(".J-detail-paramId").text(data.id);
      $(".J-detail-upgfType").text(data.upgfType.label);
      $(".J-detail-paramName").text(data.paramId);
      $('.J-detail-airType').text(typeLabel[type]) 
      $('.J-weighCabin').text(data.weighCabin)
      $('.J-differDiscount').text(data.differDiscount)
      if(type==='nation'){
        $('.J-air-table-header-inland').addClass('hide')
        $('.J-air-table-header-nation').removeClass('hide')
      }else{
        $('.J-air-table-header-inland').removeClass('hide')
        $('.J-air-table-header-nation').addClass('hide')
      }
      
       

      renderAirTab(
        ".J-detail-modal .J-inland-tablist",
        ".J-detail-modal .J-nation-tablist",
        airlines
      );
      renderDetailAirTabContent(
        ".J-detail-modal .J-inland-tab-content",
        ".J-detail-modal .J-nation-tab-content",
        airlines
      );
      // $detailSeatTable.bootstrapTable("load", data.seats);
      $detailPriceTable.bootstrapTable("load", data.priceInfos);
    }
  };

  function modalWriteBack(id, target) {
    //根据id查询数据
    // axios
    //   .post("/upGradeBaseSet/query", {
    //     id: id
    //   })
    //   .then(function(resp) {
    //     var renderData = resp.data.rows;
    //     //renderByData 数据渲染
    //     if ("update" == target) {
    //       formModal.renderByData(renderData[0]);
    //     }
    //     if ("show" == target) {
    //       detailModal.renderByData(renderData[0]);
    //     }
    //   });
    axios
      .get("/query.json", {
        id: id
      })
      .then(function(resp) {
        var renderData = resp.data.rows;
        //renderByData 数据渲染
        if ("update" == target) {
          formModal.renderByData(renderData[0]);
        }
        if ("show" == target) {
          detailModal.renderByData(renderData[0]);
        }
      });
  }
  $(window).on("DOMContentLoaded", function() {
    table.init();
    formModal.init();
    detailModal.init();
    initSearch();
  });
})();

