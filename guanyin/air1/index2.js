~(function() {
  var noop = function() {};

  var observe = function(obj, key, value, callback) {
    Object.defineProperty(obj, key, {
      get: function() {
        return value;
      },
      set: function(newVal) {
        if (value === newVal) return;
        value = newVal;
        callback && callback(value);
      }
    });
  };

  var formModal = {
    upgType: "", //1 登机口升舱; 2 竞价升舱; 3 机上升舱;
    airlineType: "", //inland 国内; nation 国际;
    init: noop, //初始化 Modal 结构， upgType 归 '';
    airlines: null, // {inland:[],nation:[]}
    getAirlines: noop, // 获取 inland & nation 航线信息
    contentEl: "", // initTemplate 挂载点，J-modal-content,
    airlineTemplate: "", //{{airlineTemplate}} 模板
    hooks: {
      beforeCreate: noop,
      created: noop,
      beforeMount: noop,
      mounted: noop,
      beforeDestory: noop,
      destroyed: noop
    },
    methods: {
      renderAirlineTemplate: noop, //根据 upgType 生成对应的 airlineTemplate 模板（暂不挂载）;
      submit: noop,
      init: function() {
        formModal.upgType = "1";
        formModal.airlineType = "inland";
      }
    }
  };

  // upgType 变动相关 callbacks
  var upgTypeChangeCallbacks;
  var initUpgTypeCbs = function(value) {
    upgTypeChangeCallbacks = $.Callbacks();
    var temp1 = $("#J-airline-temp1").html();
    var temp2 = $("#J-airline-temp2").html();

    //根据 upgType 给 formModal 赋值不同的方法和 hooks
    formModal.airlineTemplate = value === '3' ? temp2 : temp1

    upgTypeChangeCallbacks.add(function(value) {
      formModal.airlineTemplate =
        value === "1" || value === "2" ? temp1 : temp2;
      formModal.methods.renderAirlineTemplate();
    });
    upgTypeChangeCallbacks.add(function(value) {
      console.log("upgType", value);
    });
  };

  var observeUpgTypeInModal = function() {
    observe(formModal, "upgType", formModal.upgType, function(value) {
      // upgTypeChangeCallbacks.fire(value);
    });
  };

  var observeairlineTypeInModal = function() {
    observe(formModal, "airlineType", formModal.airlineType, function() {
      if (formModal.upgType === "3") {
        //TODO: temp2 tab 切换
      } else {
        //TODO: temp1 tab 切换
      }
      // var airlineTypeChangeCallbacks = $.Callbacks();
      // airlineTypeChangeCallbacks.fire("a");
    });
  };

  observeUpgTypeInModal();
  observeairlineTypeInModal();

  /**
   * 新增编辑模块
   */

  var initTemplate = $("#J-initFormModal").html();
  initFormModal = {
    template: initTemplate,
    hooks: {
      beforeCreate: function() {
        this.airlines ? null : this.getAirlines;
      }.bind(formModal),
      created: function() {
        //获取 upgTyep 并初始化
        this.upgType = $(this.template)
          .find("#modalUpgfType")
          .val();

        //获取 airlineType 并初始化
        // this.airlineType = $(this.template).find('')
      }.bind(formModal)
    }
  };

  /**
   *
   * @param {*} arr
   * @param {*} type nation 国际航线
   * @description 生成 tab 左边切换的模板
   */
  function generateTabTemp(arr, type) {
    var temp =
      '<a class="list-group-item list-group-item-action {{active}}" id="list-home-list" data-toggle="list" href="#{{id}}" role="tab" >{{distance}}</a>';
    var labelTemp = "";
    for (var i = 0; i < arr.length; i++) {
      var labelKey = arr[i].classifyValue || "";

      if (type === "nation") {
        labelTemp += temp
          .replace("{{distance}}", arr[i].countryName)
          .replace("{{active}}", i === 0 ? "active" : "")
          .replace(
            "{{id}}",
            arr[i].type ? "detail" + arr[i].countryName : arr[i].countryName
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

  //点击 全选/全不选
  function initSelectAll() {
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

  //全选回显
  function observeSelectAll() {
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

  var airTemp1 = {
    renderAirTable: function(inlandSelector, nationSelector, airlines) {
      var inland = generateTabTemp(airlines.inland);
      $(inlandSelector).html(inland);
      var nation = generateTabTemp(airlines.nation, "nation");
      $(nationSelector).html(nation);
    },
    renderTableHeader: noop,
    initTableEvt: function() {
      //table header 切换事件
      $(document).on("click", ".J-air-table-inland", function(e) {
        this.airlineType = "inland";
      });
      $(document).on("click", ".J-air-table-nation", function(e) {
        this.airlineType = "nation";
      });
      //全选事件
      initSelectAll();
    },
    airlineTypeChangeEvt: function() {
      if (this.airlineType === "nation") {
        $(".J-nation-tab").css("display", "flex");
        $(".J-inland-tab").hide();
      } else {
        $(".J-inland-tab").show();
        $(".J-nation-tab").hide();
      }
    }.bind(formModal),

    toggleInlandAndNation: function() {
      //国际 国内航线切换
      $(document).on("click", ".J-air-table-inland", function(e) {
        this.airlineType = "inland";
        var $parent = $(this).closest(".air-table");
        if ($parent.find(".J-inland-tab").css("display") === "none") {
          $parent.find(".J-inland-tab").show();
        }
        $parent.find(".J-nation-tab").hide();
      });
      $(document).on("click", ".J-air-table-nation", function(e) {
        this.airlineType = "nation";
        var $parent = $(this).closest(".air-table");
        if ($parent.find(".J-nation-tab").css("display") === "none") {
          $parent.find(".J-nation-tab").css("display", "flex");
        }
        $parent.find(".J-inland-tab").hide();
      });
    }.bind(formModal)
  };

  var typeMap = ["inland", "nation"];
  var typeLabel = { inland: "国内航线", nation: "国际航线" };

  function renderHeaderByType(el, val, temp) {
    var type = typeMap[val];
    var label = typeLabel[type];
    var template = temp
      .replace(/\{\{airType\}\}/g, type)
      .replace(/\{\{airTypeLabel\}\}/g, label);
    $(el).html(template);
  }

  /**
   *        table header
   *    tab       tabContent
   */
  var airTemp2 = {
    renderAirTable: function() {},
    renderTableHeader: function() {
      var headerTemp = $("#J-air-table-header-temp").html();
      renderHeaderByType(
        ".J-air-table-header",
        formModal.airlineType,
        headerTemp
      );
      toggleInlandAndNation(formModal.airlineType);
    },
    airlineTypeChangeEvt: function() {
      var headerTemp = $("#J-air-table-header-temp").html();
      //TODO: add to observeairlineTypeInModal callback
      renderHeaderByType(
        ".J-air-table-header",
        formModal.airlineType,
        headerTemp
      );
      toggleInlandAndNation(formModal.airlineType);
    },
    toggleInlandAndNation: function(showVal) {
      //国际 国内航线 tab 内容切换
      if (showVal === "1") {
        $(".J-nation-tab").removeClass("hide");
        $(".J-inland-tab").addClass("hide");
      } else {
        $(".J-nation-tab").addClass("hide");
        $(".J-inland-tab").removeClass("hide");
      }
    }
  };

  $("#exampleModal").on("shown.bs.modal", function() {
    console.log('show')
    formModal.hooks.mounted &&
      formModal.hooks.mounted != noop &&
      formModal.hooks.mounted();
  });
  $("#exampleModal").on("hidden.bs.modal", function() {
    console.log('hide')
    formModal.hooks.destroyed &&
      formModal.hooks.destroyed != noop &&
      formModal.hooks.destroyed();
  });

  formModal.methods.init();

  /**
   * 列表页相关
   */
  var $table;

  function priceFormat(value) {
    var temp = '<p class="price">{{content}}</p>';
    var str = "";
    for (var i = 0; i < value.length; i++) {
      str += temp.replace("{{content}}", value[i] ? value[i] : "- -");
    }
    return str ? str : "- -";
  }
  // 列表初始化
  function initTable() {
    $table = $("#table")
      .bootstrapTable("destroy")
      .bootstrapTable({
        url: "/query.json",
        method: "get",
        // url: "/upGradeBaseSet/query",
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
                  var basePrice = row.priceInfos[j].basePrice;
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

  $(window).on("DOMContentLoaded", function() {
    initTable();
    // table.init();
    // formModal.init();
    // detailModal.init();
    // initSearch();
  });
})();
