~(function() {
    var noop = function() {};
    var emptyObj = {};
    var detailData = undefined; //编辑和查看的数据

    //所有组件对象需要调用该函数，否则 this 指向错误
    var BindThisInMethodsHooks = function(obj) {
        var methods = Object.keys(obj.methods);
        var hooks = Object.keys(obj.hooks);
        var i = 0;
        while (i < methods.length) {
            var methodName = methods[i];
            obj.methods[methodName] = obj.methods[methodName].bind(obj);
            proxyMethod(methodName, obj);
            i++;
        }
        i = 0;
        while (i < hooks.length) {
            var hookName = hooks[i];
            obj.hooks[hookName] = obj.hooks[hookName].bind(obj);
            i++;
        }

        //标记以及Bind 过 this
        Object.defineProperty(obj, "_bind", {
            configurable: false,
            get: function() {
                return true;
            }
        });
    };

    var proxyMethod = function(methodName, obj) {
        Object.defineProperty(obj, methodName, {
            get: function() {
                return obj.methods[methodName];
            }
        });
    };

    /**
     * WARNING: 所有组件对象需要按照此结构
     */
    var Base = {
        el: "",
        template: "",
        instance: undefined, // Component 实例
        state: emptyObj,
        props: emptyObj,
        methods: emptyObj,
        hooks: {
            beforeCreate: noop, //调用 http 初始化数据的地方
            created: noop, //根据数据渲染 template 的地方, 此处需要将 template 渲染完成
            mounted: noop, //组件已挂载， 此处用来监听事件
            beforeUpdate: noop, //组件更新前， 用于 state 改变之后， template 中结构发生变化， 卸载 mounted 中监听的事件
            updated: noop, // 组件state UI 已经更新， 用于 template 结构变化后， 重新监听事件
            beforeDestory: noop, //卸载之前, 此处用来卸载事件
            destoryed: noop //组件已卸载
        }
    };

    /**
     *  初次加载： beforeCreate -> created -> mounted
     *  更新： created -> beforeUpdate -> updated
     *  卸载： beforeDestory -> destoryed
     */

    // 获取 airline 信息
    function getAirlineInfos() {
        return $.ajax({
            url: "/lines.json",
            // url: "/airlineInfoManage/getAllAirlineInfo?rand=" + Math.random(),
            type: "GET"
        });
    }

    function Component(obj) {
        if (!obj._bind) {
            BindThisInMethodsHooks(obj);
        }
        this.fiber = obj;
        this.fiber.initState = Object.assign({}, this.fiber.state);
        this.fiber.instance = this;
        var deferred = this.fiber.hooks.beforeCreate();
        var _this = this;

        if (deferred) {
            deferred
                .then(function() {
                    _this.render();
                    _this.fiber.hooks.mounted();
                })
                .fail(err => {
                console.log(err);
        });
        } else {
            _this.render();
            _this.fiber.hooks.mounted();
        }
        return this;
    }

    Component.prototype.render = function() {
        this.fiber.hooks.created();
        console.log("=========render=========");
        var $el = $(this.fiber.el);
        $el.html(this.fiber.template);
    };

    Component.prototype.rerender = function() {
        console.log("=========rerender=========");
        this.fiber.template = this.fiber.initTemplate;
        this.fiber.hooks.created();
        this.fiber.hooks.beforeUpdate();
        var $el = $(this.fiber.el);
        $el.html(this.fiber.template);
        this.fiber.hooks.updated();
    };

    Component.prototype.destory = function() {
        this.fiber.hooks.beforeDestory();
        $(this.fiber.el).html("");
        this.fiber.hooks.destoryed();
        this.fiber.state = this.fiber.initState;
        this.fiber.template = this.fiber.initTemplate;
        delete this.fiber.initState;
    };

    function priceFormat(value) {
        var temp = '<p class="price">{{content}}</p>';
        var str = "";
        for (var i = 0; i < value.length; i++) {
            str += temp.replace("{{content}}", value[i] ? value[i] : "- -");
        }
        return str ? str : "- -";
    }

    // 根据 id 获取查看编辑数据
    var getDetailDataByIDAndCb = function(id, cb) {
        //TODO: 替换
        axios
            // .get('/query.json')
            .post("/upGradeBaseSet/query", {
                id: id
            })
            .then(function(resp) {
                var renderData = resp.data.rows;
                detailData = renderData[0];
                cb();
                // //renderByData 数据渲染
                // if ("update" == target) {
                //   formModal.renderByData(renderData[0]);
                // }
                // if ("show" == target) {
                //   detailModal.renderByData(renderData[0]);
                // }
            });
    };

    // 列表初始化
    function initTable() {
        $table = $("#table")
            .bootstrapTable("destroy")
            .bootstrapTable({
                url: '/upGradeBaseSet/query',
                method: 'post',
                // url: "/query.json",
                // method: "get",
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
                        field: "upCabinName",
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
                        title: "原价",
                        formatter: function(value,row){
                            if(row.upgfType === '3'){
                                return priceFormat(row.feeDetails)
                            }
                            return priceFormat(row.basePrice)
                        }
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
                    param.upgfType = $(".upgType").val();
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
                            upCabinName:"",
                            upgfType: "",
                            segments: [],
                            currencyName: [],
                            basePrice: [],
                            lowPrice: [],
                            highPrice: [],
                            feeDetails:[]
                        };
                        for (var i = 0; i < res.rows.length; i++) {
                            var row = res.rows[i];
                            var obj = {
                                id: row.id || "",
                                airlinePriceBaseSetName: row.airlinePriceBaseSetName || "",
                                upCabinName: (row.cabinType && row.cabinType.upCabinName) || "",
                                upgfType: row.cabinType.upgfType  || "",
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
                                highPriceArr = [],
                                feeDetails=[];
                            try {
                                for (var j = 0; j < row.priceInfos.length; j++) {
                                    var name =
                                        row.priceInfos[j].currencyName +
                                        "(" +
                                        row.priceInfos[j].currencyUnit +
                                        ")";
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
                            if(obj.upgfType==='3'){
                                for(var k=0;k<row.feeDetails.length;k++){
                                    var str = '';
                                    row.feeDetails[k].feeInfoList.forEach(function(item){
                                        switch (item.passengerType){
                                            case 'ADT':
                                                str += item.fee + '(成)/';
                                                break;
                                            case 'CHD':
                                                str += item.fee + '(童)/' ;
                                                break;
                                            case 'INFANT':
                                                str += item.fee + '(婴)';
                                                break;
                                        }
                                    })
                                    feeDetails.push(str)
                                }
                            }
                            arr.push(
                                Object.assign({}, defaultRow, obj, {
                                    currencyName: nameArr,
                                    basePrice: basePriceArr,
                                    lowPrice: lowPriceArr,
                                    highPrice: highPriceArr,
                                    feeDetails:feeDetails
                                })
                            );
                        }
                    }
                    console.log(arr)
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
                        //TODO: 编辑数据获取
                        getDetailDataByIDAndCb(id, function() {
                            $("#exampleModal").modal("show");
                        });
                    });
                    $(".showa").click(function() {
                        var id = $(this).attr("data-id");
                        $("#modalUpdate").hide();
                        $("#modalSave").hide();
                        //数据回显
                        getDetailDataByIDAndCb(id, function() {
                            $("#exampleModal2").modal("show");
                        });
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

    $(function() {
        var labelObj = {
            "0-1000": "航距小于等于1000KM",
            "1000-1500": "航距1000KM-1500KM",
            "1500-2000": "航距1500KM-2000KM",
            "2000-99999": "航距大于2000KM"
        };
        var typeMap = ["inland", "nation"];
        var typeLabel = { inland: "国内航线", nation: "国际航线" };
        var $seatTable, $priceTable;

        //TAG: 编辑新增相关
        // render 航线信息表格 type：form or detail
        function renderAirlineTable(fragment, data) {
            var tabTempObj = generateAirTab(data);
            var tabContentTempObj = generateAirTabContent(data);
            fragment = fragment
                .replace(/\{\{inlandTabList\}\}/g, tabTempObj.inland)
                .replace(/\{\{nationTabList\}\}/g, tabTempObj.nation)
                .replace(/\{\{inlandTabContent\}\}/g, tabContentTempObj.inland)
                .replace(/\{\{nationTabContent\}\}/g, tabContentTempObj.nation);
            return fragment;
        }

        // render 航线tab
        function generateAirTab(airlines) {
            var inland = generateTabTemp(airlines.inland);
            var nation = generateTabTemp(airlines.nation, "nation");
            return { inland: inland, nation: nation };
        }

        // render 航线tab content
        function generateAirTabContent(airlines, isDetail) {
            var inland, nation;
            if (!isDetail) {
                inland = generateTabContentTemp(
                    airlines.inland,
                    generateFormTabContentTemp
                );
                nation = generateTabContentTemp(
                    airlines.nation,
                    generateFormTabContentTemp,
                    "nation"
                );
            } else {
                inland = generateTabContentTemp(
                    airlines.inland,
                    generateDetailTabContentTemp
                );
                nation = generateTabContentTemp(
                    airlines.nation,
                    generateDetailTabContentTemp,
                    "nation"
                );
            }
            return {
                inland: inland,
                nation: nation
            };
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
                        .replace("{{distance}}", arr[i].countryName||arr[i].classifyValue)
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
                        arr[i].countryName||arr[i].classifyValue,
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

        function initSeatTable() {
            $seatTable = $(".J-seat-table")
                .bootstrapTable("destroy")
                .bootstrapTable({

                    search: false,
                    columns: [
                        {
                            field: "planeTypeName",
                            title: "机型"
                        },
                        {
                            field: "holdBackBusinessNum",
                            title: "活动提前关闭时座位数",
                            formatter: function(value, row) {
                                var temp;
                                if (null == value) {
                                    temp =
                                        '<input type="text" class="form-control" name="{{name}}" id="businessClassSeatNum" value="" oninput = "value=value.replace(/[^\\d]/g,\'\')">';
                                } else {
                                    temp =
                                        '<input type="text" class="form-control" name="{{name}}" id="businessClassSeatNum" value="{{value}}" oninput = "value=value.replace(/[^\\d]/g,\'\')">';
                                }
                                return temp
                                    .replace(/\{\{name\}\}/, row.planeTypeName || "")
                                    .replace(/\{\{value\}\}/, value);
                            }
                        },
                        {
                            field: "businessClassSeatNum",
                            title: "公务舱座位总数",
                            formatter: function(value, row) {
                                var temp =
                                    '<input type="text" class="form-control" name="{{name}}" id="businessClassSeatNum" value="{{value}}" readonly>';
                                return temp
                                    .replace(/\{\{name\}\}/, row.planeTypeName || "")
                                    .replace(/\{\{value\}\}/, value);
                            }
                        }
                    ],
                    queryParams: function queryParams(params) {},
                    responseHandler: function(res) {
                        return res;
                    }
                });
        }

        function initPriceTable1() {
            console.log("initPriceTable");
            //TODO: nation 如何兼容
            $priceTable = $(".J-price-table")
                .bootstrapTable("destroy")
                .bootstrapTable({
                    // url: "/upGradeBaseSet/queryCurrency?rand=" + Math.random(),
                    // method: "get",
                    data: [{ currencyName: "人民币", basePrice: "0" }],
                    search: false,
                    columns: [
                        {
                            field: "currencyName",
                            title: "币种"
                        },
                        {
                            field: "basePrice",
                            title: "原价（元）",
                            formatter: function(value) {
                                return (
                                    '<input type="text" class="form-control" name="CNY" id="basePrice" value="' +
                                    (value ? value : "") +
                                    '" oninput = "value=value.replace(/[^\\d]/g,\'\')">'
                                );
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

        function initPriceTable2() {
            $priceTable = $(".J-price-table")
                .bootstrapTable("destroy")
                .bootstrapTable({
                    // url: "/upGradeBaseSet/queryCurrency?rand=" + Math.random(),
                    // method: "get",
                    data: [
                        {
                            currencyName: "人民币",
                            feeInfoList: [
                                { fee: 0, passengerType: "ADT" },
                                { fee: 0, passengerType: "CHD" },
                                { fee: 0, passengerType: "INFANT" }
                            ]
                        }
                    ],
                    search: false,
                    columns: [
                        {
                            field: "currencyName",
                            title: "币种",
                            width: 120
                        },
                        {
                            field: "feeInfoList",
                            title: "原价（元）",
                            formatter: function(value) {
                                var temp = $("#J-priceInfo").html();
                                var adult = 0,
                                    child = 0,
                                    baby = 0;
                                value.forEach(function(item) {
                                    if (item.passengerType === "ADT") {
                                        adult = item.fee;
                                    } else if (item.passengerType === "CHD") {
                                        child = item.fee;
                                    } else if (item.passengerType === "INFANT") {
                                        baby = item.fee;
                                    }
                                });
                                temp = temp
                                    .replace(/\{\{adult\}\}/g, adult)
                                    .replace(/\{\{child\}\}/g, child)
                                    .replace(/\{\{baby\}\}/g, baby);
                                return temp;
                            }
                        }
                    ]
                });
        }

        var renderMethodObj = {
            render1: {
                renderAirlineTypeSelect: function() {
                    this.template = this.template.replace(
                        /\{\{airlineTypeSelect\}\}/g,
                        ""
                    );
                },
                renderAirTable: function() {
                    console.log(this.state.airlines);
                    var airTemplate = $("#J-airline-temp1").html();
                    airTemplate = renderAirlineTable(airTemplate, this.state.airlines);
                    this.template = this.template.replace(
                        /\{\{airlineTemplate\}\}/g,
                        airTemplate
                    );
                },
                renderSeat: function() {
                    var seatLabel = "座位信息";
                    this.template = this.template.replace(
                        /\{\{seatLabel\}\}/g,
                        seatLabel
                    );
                },
                renderPrice: function() {},
                renderCabinSeat: function() {
                    console.log("renderCabinSeat", this);
                    this.template = this.template.replace(
                        /\{\{cabinSeatTemplate\}\}/g,
                        ""
                    );
                }
            },
            render2: {
                renderAirlineTypeSelect: function() {
                    console.log("renderAirlineTypeSelect");
                    var airlineSelectTemp = $("#J-airlineTypeTemp").html();
                    this.template = this.template.replace(
                        /\{\{airlineTypeSelect\}\}/g,
                        airlineSelectTemp
                    );
                },
                renderAirTable: function() {
                    //TODO:
                    var airTemplate = $("#J-airline-temp2").html();
                    var airHeaderTemplate = $("#J-air-table-header-temp").html();
                    var label = typeLabel[this.state.airlineType];
                    var type = this.state.airlineType;
                    airHeaderTemplate = airHeaderTemplate
                        .replace(/\{\{airType\}\}/g, type)
                        .replace(/\{\{airTypeLabel\}\}/g, label);
                    airTemplate = airTemplate.replace(
                        /\{\{airHeader\}\}/g,
                        airHeaderTemplate
                    );
                    airTemplate = renderAirlineTable(airTemplate, this.state.airlines);
                    this.template = this.template.replace(
                        /\{\{airlineTemplate\}\}/g,
                        airTemplate
                    );
                },
                renderSeat: function() {
                    this.template = this.template.replace(/\{\{seatLabel\}\}/g, "");
                },
                renderPrice: function() {},
                renderCabinSeat: function() {
                    var cabinSeatTemplate = $("#J-cabinSeat").html();
                    this.template = this.template.replace(
                        /\{\{cabinSeatTemplate\}\}/g,
                        cabinSeatTemplate
                    );
                }
            }
        };

        var airTableInlandCb = function(e) {
            var $parent = $(this).closest(".air-table");
            if ($parent.find(".J-inland-tab").css("display") === "none") {
                $parent.find(".J-inland-tab").show();
            }
            $parent.find(".J-nation-tab").hide();
        };

        var airTableNationCb = function(e) {
            console.log("click nation");
            var $parent = $(this).closest(".air-table");
            if ($parent.find(".J-nation-tab").css("display") === "none") {
                $parent.find(".J-nation-tab").css("display", "flex");
            }
            $parent.find(".J-inland-tab").hide();
        };

        var airlineTypeChangeCb = function(e) {
            console.log("------------airlineTypeChangeCb");
            var value = e.target.value;
            if (value === "1") {
                $(".J-nation-tab").removeClass("hide");
                $(".J-inland-tab").addClass("hide");
            } else {
                $(".J-nation-tab").addClass("hide");
                $(".J-inland-tab").removeClass("hide");
            }
        };

        var selectAllCb = function(e) {
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
        };

        var selectAllInlandCb = function(e) {
            if ($(e.target).prop("checked")) {
                $(".J-inland-tab-content")
                    .find("input[type=checkbox]")
                    .prop("checked", true);
            } else {
                $(".J-inland-tab-content")
                    .find("input[type=checkbox]")
                    .prop("checked", false);
            }
        };

        var selectAllNationCb = function(e) {
            if ($(e.target).prop("checked")) {
                $(".J-nation-tab-content")
                    .find("input[type=checkbox]")
                    .prop("checked", true);
            } else {
                $(".J-nation-tab-content")
                    .find("input[type=checkbox]")
                    .prop("checked", false);
            }
        };

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

        var EvtMethodObj = {
            init1: {
                airTableEvt: function() {
                    console.log("init1 airTableEvt");
                    //国际 国内航线 table 内容切换
                    $(document).on("click", ".J-air-table-inland", airTableInlandCb);
                    $(document).on("click", ".J-air-table-nation", airTableNationCb);

                    // 点击全选/全不选
                    $(document).on("change", ".J-all", selectAllCb);
                    // 国内全选
                    $(document).on("change", "input[name=inland]", selectAllInlandCb);
                    // 国际全选
                    $(document).on("change", "input[name=nation]", selectAllNationCb);
                    // 全选联动（所有都被选了时，勾住全选）
                    $(document).on(
                        "change",
                        ".J-modal-content input:checkbox",
                        observeSelectAll
                    );

                    //TODO: 编辑时的数据回显 & 搜索重置
                }
            },
            off1: {
                airTableEvt: function() {
                    console.log("-------off1 airTableEvt");
                    $(document).off("click", ".J-air-table-inland", airTableInlandCb);
                    $(document).off("click", ".J-air-table-nation", airTableNationCb);
                    $(document).off("change", ".J-all", selectAllCb);
                    $(document).off("change", "input[name=inland]", selectAllInlandCb);
                    $(document).off("change", "input[name=nation]", selectAllNationCb);
                    $(document).off(
                        "change",
                        ".J-modal-content input:checkbox",
                        observeSelectAll
                    );
                }
            },
            init2: {
                airTableEvt: function() {
                    console.log("init2 airTableEvt");
                    //国际 国内航线 table 内容切换
                    $(document).on("change", "#airlineType", airlineTypeChangeCb);

                    // 点击全选/全不选
                    $(document).on("change", ".J-all", selectAllCb);
                    // 国内全选
                    $(document).on("change", "input[name=inland]", selectAllInlandCb);
                    // 国际全选
                    $(document).on("change", "input[name=nation]", selectAllNationCb);
                    // 全选联动（所有都被选了时，勾住全选）
                    $(document).on(
                        "change",
                        ".J-modal-content input:checkbox",
                        observeSelectAll
                    );
                    //TODO: 编辑时的数据回显
                }
            },
            off2: {
                airTableEvt: function() {
                    console.log("off2 airtableEvt");
                    $(document).off("change", "#airlineType", airlineTypeChangeCb);
                    $(document).off("change", ".J-all", selectAllCb);
                    $(document).off("change", "input[name=inland]", selectAllInlandCb);
                    $(document).off("change", "input[name=nation]", selectAllNationCb);
                    $(document).off(
                        "change",
                        ".J-modal-content input:checkbox",
                        observeSelectAll
                    );
                }
            }
        };

        function getCommonSubmitData() {
            //新增参数及修改通用数据获取
            var upgfType = $("[name=upgfType]").val();
            var inland = $(".J-inland-form").serializeArray();
            var nation = $(".J-nation-form").serializeArray();
            var adult = $(".J-price-table [name=adult]").val();
            var child = $(".J-price-table [name=child]").val();
            var baby = $(".J-price-table [name=baby]").val();

            var weighCabin = $("[name=weighCabin]").val();
            var differDiscount = $("[name=differDiscount]").val();
            var airlinePriceBaseSetName = $("[name=airlinePriceBaseSetName]").val();
            var airlineType = typeMap[$("#airlineType").val()];
            var airInfos = [],
                inlandObj = {},
                nationObj = {};
            for (i = 0; i < inland.length; i++) {
                var obj = inland[i];
                if (obj.value === "all" || /search-/.test(obj.name)) continue;
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
                if (obj.value === "all" || /search-/.test(obj.name)) continue;
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

            if (airlineType === "inland") {
                for (var key in inlandObj) {
                    airInfos.push(inlandObj[key]);
                }
            } else {
                for (var key in nationObj) {
                    airInfos.push(nationObj[key]);
                }
            }

            console.log(airInfos);
            return {
                upgfType: upgfType,
                airlinePriceBaseSetName: airlinePriceBaseSetName,
                airlineInfos: airInfos,
                weighCabin: weighCabin,
                differDiscount: differDiscount,
                feeDetails: [
                    {
                        currency: "CNY",
                        passengerType: "ADT",
                        fee: adult
                    },
                    {
                        currency: "CNY",
                        passengerType: "CHD",
                        fee: child
                    },
                    {
                        currency: "CNY",
                        passengerType: "INFANT",
                        fee: baby
                    }
                ]
            };
        }

        var componentMethodObj = {
            method1: {
                addSubmit: function() {
                    return 
                    var flag = true;
                    var upgfType = $("[name=upgfType]").val();
                    var inland = $(".J-inland-form").serializeArray();
                    var nation = $(".J-nation-form").serializeArray();
                    var seat = $(".J-seat-form").serializeArray();
                    var price = $("[name=CNY]").val().trim();

                    var airlinePriceBaseSetName = $(
                        "[name=airlinePriceBaseSetName]"
                    ).val();
                    var seatArr = [],
                        inlandObj = {},
                        nationObj = {};
                    for (var i = 0; i < seat.length; i += 2) {
                        seatArr.push({
                            planeTypeName: seat[i].name,
                            holdBackBusinessNum: seat[i].value.trim(),
                            businessClassSeatNum: seat[i + 1].value.trim()
                        });
                    }
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
                    var airInfos = [];
                    for (var key in inlandObj) {
                        airInfos.push(inlandObj[key]);
                    }
                    for (key in nationObj) {
                        airInfos.push(nationObj[key]);
                    }
                    if (!upgfType) {
                        alert("升舱类型未选择，无法保存！");
                        flag = false;
                    } else if (!airlinePriceBaseSetName) {
                        alert("参数名称未填写，无法保存！");
                        flag = false;
                    } else if (airInfos.length == 0) {
                        alert("航线信息未填写，无法保存！");
                        flag = false;
                    } else if (seatArr.length == 0) {
                        alert("座位信息未填写，无法保存！");

                        flag = false;
                    } else if (price.length == 0) {
                        alert("价格信息未填写，无法保存！");
                        flag = false;
                    }
                    for (var i = 0; i < seatArr.length; i++) {
                        if (
                            parseInt(seatArr[i].holdBackBusinessNum) >
                            parseInt(seatArr[i].businessClassSeatNum)
                        ) {
                            alert(
                                seatArr[i].planeTypeName +
                                "活动提前关闭时座位数请小于公务舱总座位数"
                            );
                            flag = false;
                        }
                        if (!seatArr[i].holdBackBusinessNum) {
                            alert(seatArr[i].planeTypeName + "活动提前关闭时座位数不能为空!");
                            flag = false;
                        }
                    }

                    if (flag) {
                        var res = {
                            upgfType: upgfType,
                            airlinePriceBaseSetName: airlinePriceBaseSetName,
                            airlineInfos: airInfos,
                            seatInfos: seatArr,
                            priceInfo: {
                                currency: "CNY",
                                basePrice: price
                            }
                        };
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
                },
                editSubmit: function() {
                  return 
                    var flag = true;
                    var id = $("#id").val();
                    var upgfType = $("[name=upgfType]").val();
                    var inland = $(".J-inland-form").serializeArray();
                    var nation = $(".J-nation-form").serializeArray();
                    var seat = $(".J-seat-form").serializeArray();
                    var price = $("[name=CNY]")
                        .val()
                        .trim();
                    var airlinePriceBaseSetName = $(
                        "[name=airlinePriceBaseSetName]"
                    ).val();
                    var seatArr = [],
                        inlandObj = {},
                        nationObj = {};
                    for (var i = 0; i < seat.length; i += 2) {
                        seatArr.push({
                            planeTypeName: seat[i].name,
                            holdBackBusinessNum: seat[i].value.trim(),
                            businessClassSeatNum: seat[i + 1].value.trim()
                        });
                    }
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
                    var airInfos = [];
                    for (var key in inlandObj) {
                        airInfos.push(inlandObj[key]);
                    }
                    for (key in nationObj) {
                        airInfos.push(nationObj[key]);
                    }
                    if (!airlinePriceBaseSetName) {
                        alert("参数名称未填写，无法保存！");
                        flag = false;
                    } else if (airInfos.length == 0) {
                        alert("航线信息未填写，无法保存！");
                        flag = false;
                    } else if (seatArr.length == 0) {
                        alert("座位信息未填写，无法保存！");
                        flag = false;
                    } else if (price.length == 0) {
                        alert("价格信息未填写，无法保存！");
                        flag = false;
                    }
                    for (var i = 0; i < seatArr.length; i++) {
                        if (
                            parseInt(seatArr[i].holdBackBusinessNum) >
                            parseInt(seatArr[i].businessClassSeatNum)
                        ) {
                            alert(
                                seatArr[i].planeTypeName +
                                "活动提前关闭时座位数请小于公务舱总座位数"
                            );
                            flag = false;
                        }
                        if (!seatArr[i].holdBackBusinessNum) {
                            alert(seatArr[i].planeTypeName + "活动提前关闭时座位数不能为空!");
                            flag = false;
                        }
                    }
                    if (flag) {
                        var res = {
                            id: id,
                            upgfType: upgfType,
                            airlinePriceBaseSetName: airlinePriceBaseSetName,
                            airlineInfos: airInfos,
                            seatInfos: seatArr,
                            priceInfo: {
                                currency: "CNY",
                                basePrice: price
                            }
                        };
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
                }
            },
            method2: {
                addSubmit: function() {
                  return 
                    var flag = true;
                    var param = getCommonSubmitData.call(this);
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
                    console.log("method2 addSubmit", param);
                    if (flag) {
                        var res = Object.assign({}, param);
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
                },
                editSubmit: function() {
                  return
                    console.log('edit Submit')
                    var flag = true;
                    var id = $("#id").val();
                    var param = getCommonSubmitData();
                    if (!param.airlinePriceBaseSetName) {
                        alert("参数名称未填写，无法保存！");
                        flag = false;
                    } else if (param.airlineInfos.length == 0) {
                        alert("航线信息未填写，无法保存！");
                        flag = false;
                    }
                    if (flag) {
                        var res = Object.assign({ id: id }, param);
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
                }
            }
        };

        var initTemplate = $("#J-initFormModal").html();
        var cachedAirlineInfos;
        var observeUpgfTypeCb = function(e) {
            var value = e.target.value;
            console.log("observeUpgfTypeCb", value);
            formModal.state.upgfType = value;
        };
        var observeAirlineTypeCb = function(e) {
            var value = e.target.value;
            console.log("observeAirlineTypeCb", value);
            formModal.state.airlineType = typeMap[value];
        };

        function initSearch(){
            $(document).on('click', '.J-search', function (e) {
                e.preventDefault();
                var $list = $(this).closest('.J-checkbox-list');
                var search_text = $list.find('input[type=text]').val().toUpperCase();
                var $checkbox = $list.find('input[type=checkbox]');
                var showCount = 0;
                $checkbox.each(function (idx, item) {
                    var value = $(item).val().toUpperCase();
                    if (value === 'ALL') {
                        search_text && search_text.length ? $(item).parent().addClass('hide') : $(item).parent().removeClass('hide')
                    } else if (value.indexOf(search_text) > -1) {
                        $(item).parent().removeClass('hide');
                        showCount++;
                    } else {
                        $(item).parent().addClass('hide');
                    }
                })
                showCount ? $list.find('.J-no-result').hide() : $list.find('.J-no-result').show();

            });
            //绑定搜索重置按钮
            $(document).on('click', '.J-reset', function (e) {
                $(this).parent().prev().find("input").val("");
            });
        }
        /**
         * formModal 相关
         */
        var formModal = {
            el: ".J-modal-content",
            initTemplate: initTemplate,
            template: initTemplate,
            state: {
                upgfType: "1", //1 登机口升舱; 2 竞价升舱; 3 机上升舱;
                airlineType: "inland", //inland 国内; nation 国际;
                airlines: { inland: [], nation: [] }, // {inland:[],nation:[]}
                isEdit: false //是否在编辑
            },
            methods: {
                getAirlines: function() {
                    var deferred = $.Deferred();
                    var res;
                    var _this = this;
                    if (cachedAirlineInfos) {
                        res = cachedAirlineInfos;
                        this.state.airlines.inland = res.cnAirlineInfos || [];
                        this.state.airlines.nation = res.areaAirlineInfos || [];
                    } else {
                        res = getAirlineInfos();
                        res
                            .then(function(res) {
                                _this.state.airlines.inland = res.cnAirlineInfos || [];
                                _this.state.airlines.nation = res.areaAirlineInfos || [];
                                deferred.resolve();
                            })
                            .fail(function(err) {
                                deferred.reject(err);
                                console.log(err);
                            });
                    }
                    return deferred;
                },
                renderAirlineTypeSelect: function() {
                    if (this.state.upgfType === "3") {
                        //this 指向 formModal
                        renderMethodObj.render2.renderAirlineTypeSelect.call(this);
                    } else {
                        renderMethodObj.render1.renderAirlineTypeSelect.call(this);
                    }
                },
                renderAirTable: function() {
                    console.log(this);
                    if (this.state.upgfType === "3") {
                        //this 指向 formModal
                        renderMethodObj.render2.renderAirTable.call(this);
                    } else {
                        renderMethodObj.render1.renderAirTable.call(this);
                    }
                },
                renderSeat: function() {
                    var seatLabel = this.state.upgfType === "3" ? "" : "座位信息";
                    console.log("renderSeat", seatLabel);

                    this.template = this.template.replace(
                        /\{\{seatLabel\}\}/g,
                        seatLabel
                    );
                },
                renderPrice: function() {},
                renderCabinSeat: function() {
                    if (this.state.upgfType === "3"&& this.state.airlineType ==='inland') {
                        renderMethodObj.render2.renderCabinSeat.call(this);
                    } else {
                        renderMethodObj.render1.renderCabinSeat.call(this);
                    }
                },
                initAirTableEvt: function() {
                    if (this.state.upgfType === "3") {
                        EvtMethodObj.init2.airTableEvt.call(this);
                    } else {
                        EvtMethodObj.init1.airTableEvt.call(this);
                    }
                },
                offAirTableEvt: function() {
                    //TAG: state 更新之后才执行此函数， 导致判断错误， 执行了错误的 off
                    // if (this.state.upgfType === "3") {
                    EvtMethodObj.off2.airTableEvt.call(this);
                    // } else {
                    EvtMethodObj.off1.airTableEvt.call(this);
                    // }
                },
                initSeatEvt: function() {
                    if (this.state.upgfType !== "3") {
                        initSeatTable();
                    }
                },
                offSeatEvt: function() {
                    $seatTable !== undefined && $seatTable.bootstrapTable("destroy");
                },
                initPriceEvt: function() {
                    if (this.state.upgfType !== "3") {
                        initPriceTable1();
                    } else {
                        initPriceTable2();
                    }
                },
                offPriceEvt: function() {
                    $priceTable !== undefined && $priceTable.bootstrapTable("destroy");
                },
                updateUpgfType: function() {
                    try {
                        $("#modalUpgfType").val(this.state.upgfType);
                    } catch (err) {
                        console.log(err);
                    }
                },
                updateAirlineType: function() {
                    if (this.state.upgfType === "3") {
                        try {
                            $("#airlineType").val(
                                this.state.airlineType === "inland" ? "0" : "1"
                            );
                            //TODO: tabcontent 更新
                            if (this.state.airlineType === "inland") {
                                $(".J-inland-tab").show();
                                $(".J-nation-tab").hide();
                            } else {
                                $(".J-inland-tab").hide();
                                $(".J-nation-tab").show();
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                },
                addSubmit: function() {
                  debugger
                  $("#exampleModal").modal("hide");
                  console.log('submit111')
                  return 
                    if (this.state.upgfType === "3") {
                        componentMethodObj.method2.addSubmit.call(this);
                    } else {
                        componentMethodObj.method1.addSubmit.call(this);
                    }
                },
                editSubmit: function() {
                  debugger
                  $("#exampleModal").modal("hide");
                  console.log('edit1111')
                  return
                    if (this.state.upgfType === "3") {
                        componentMethodObj.method2.editSubmit.call(this);
                    } else {
                        componentMethodObj.method1.editSubmit.call(this);
                    }
                },
                renderEditData: function(data) {
                    //TAG: state 变量先赋值， 否则 update 会覆盖之前已经赋值的其他变量
                    var upgfType = data.cabinType.upgfType || "1";
                    this.state.upgfType = upgfType;
                    // $('#modalUpgfType').val(upgfType);

                    var airlineType,
                        segments = [];
                    if (upgfType === "3") {
                        airlineType = data.upgAirlineBaseSets[0].intFlag === "I" ? "nation" : "inland";
                        this.state.airlineType = airlineType;

                        //价格信息
                        var feeDetails = data.feeDetails.filter(function(item) {
                            return item.currencyCode === "CNY";
                        });
                        console.log(feeDetails)
                        $priceTable.bootstrapTable("load", feeDetails);

                        //
                        $("[name=weighCabin]").val(data.weighCabin);
                        $("[name=differDiscount]").val(data.differDiscount);

                    } else {
                        //TODO:
                        /*$seatTable.bootstrapTable("refreshOptions",{
                            url:'',
                            data:data.planeSeatInfos
                        })*/
                        $seatTable.bootstrapTable("load",data.planeSeatInfos)
                        $priceTable.bootstrapTable("load", data.priceInfos.filter(function(item){return item.currencyCode==='CNY'}));
                        // $seatTable.bootstrapTable("load",data.planeSeatInfos)
                    }

                    $("#modalAirlinePriceBaseSetName").val(
                        data.airlinePriceBaseSetName
                    );
                    //航线选择
                    for (var i = 0; i < data.upgAirlineBaseSets.length; i++) {
                        var itemSegments = data.upgAirlineBaseSets[i].segments.split(",");
                        segments = segments.concat(itemSegments);
                    }
                    for (var i = 0; i < segments.length; i++) {
                        $("input[value=" + segments[i] + "]").prop("checked", true);
                    }

                    var id = data.id || "";
                    $(".J-id")
                        .find("input")
                        .val(id);
                }
            },
            hooks: {
                beforeCreate: function() {
                    //TAG: 对于异步操作需要使用 deferred 对象， 从而在 Component 中正确执行hooks 顺序。
                    console.log("=======beforeCreate=======");
                    var deferred = this.getAirlines();
                    return deferred;
                },
                created: function() {
                    console.log("=======created=======");
                    this.renderAirlineTypeSelect();
                    this.renderAirTable();
                    this.renderSeat();
                    this.renderPrice();
                    this.renderCabinSeat();
                },
                mounted: function() {
                    //此 hook 只执行一次
                    console.log("=======mounted=======");
                    $("#modalSave").on("click", this.addSubmit);
                    $(document).on("click",'.J-update',this.editSubmit);

                    // upgfType UI更新
                    this.updateUpgfType();
                    // airlineType Select UI更新
                    this.updateAirlineType();
                    //TODO:事件监听
                    $(document).on("change", "#modalUpgfType", observeUpgfTypeCb);
                    $(document).on("change", "#airlineType", observeAirlineTypeCb);
                    this.initAirTableEvt();
                    this.initSeatEvt();
                    this.initPriceEvt();

                    //TODO:数据渲染
                    if (this.state.isEdit && detailData) {
                        this.renderEditData(detailData);
                        $("#modalUpgfType").prop('disabled',true)
                        $("#modalAirlinePriceBaseSetName").prop('disabled',true)
                    }
                    if(!this.state.isEdit){
                        $seatTable.bootstrapTable('refreshOptions',{url: "/seatInfoManage/getPlaneSeatInfo?rand=" + Math.random(),
                            method: "get",})
                        $("#modalUpdate").hide();
                        $("#modalSave").show();
                    }
                    $(document).on('submit','.J-nation-form',function(e){
                        e.preventDefault();
                    })
                    $(document).on('submit','.J-inland-form',function(e){
                        e.preventDefault();
                    })
                    initSearch()
                },
                beforeUpdate: function() {
                    console.log("=======beforeUpdate=======");
                    $(document).off("change", "#modalUpgfType", observeUpgfTypeCb);
                    $(document).off("change", "#airlineType", observeAirlineTypeCb);
                    this.offAirTableEvt();
                    this.offSeatEvt();
                    this.offPriceEvt();
                },
                updated: function() {
                    console.log("=======updated=======");
                    //TAG: update 与 on 顺序
                    this.updateUpgfType();
                    this.updateAirlineType();

                    $(document).on("change", "#modalUpgfType", observeUpgfTypeCb);
                    $(document).on("change", "#airlineType", observeAirlineTypeCb);
                    this.initAirTableEvt();
                    this.initSeatEvt();
                    this.initPriceEvt();
                    if(!this.state.isEdit&&this.state.upgfType!=="3"){
                        $seatTable.bootstrapTable('refreshOptions',{
                            url:"/seatInfoManage/getPlaneSeatInfo?rand="+Math.random(),
                            method:"get"
                        })
                    }
                    if(this.isEdit){
                        this.renderData(detailData)
                    }
                },
                beforeDestory: function() {
                    console.log("=======beforeDestory=======");
                    $(document).on("change", "#modalUpgfType", observeUpgfTypeCb);
                    $(document).on("change", "#airlineType", observeAirlineTypeCb);
                    this.offAirTableEvt();
                    this.offSeatEvt();
                    this.offPriceEvt();
                    $("#modalSave").off("click",this.addSubmit);
                    $(document).off("click",'.J-update',this.editSubmit);
                },
                destoryed: function() {
                    console.log("=======destoryed=======");
                    detailData = undefined;
                }
            }
        };

        var editModal;
        $("#exampleModal").on("shown.bs.modal", function(e) {
            console.log("relatedTarget", e.relatedTarget);
            if (e.relatedTarget === undefined) {
                formModal.state.isEdit = true;
            }else{
                formModal.state.isEdit = false;
            }
            editModal = new Component(formModal);
            var state = editModal.fiber.state;
            var upgfType = state.upgfType;
            var airlineType = state.airlineType;
            Object.defineProperties(state, {
                upgfType: {
                    get: function() {
                        return upgfType;
                    },
                    set: function(newVal) {
                        upgfType = newVal;
                        editModal.rerender();
                    }
                },
                airlineType: {
                    get: function() {
                        return airlineType;
                    },
                    set: function(newV) {
                        airlineType = newV;
                        if (state.upgfType === "3") {
                            editModal.rerender();
                        }
                    }
                }
            });
        });
        $("#exampleModal").on("hidden.bs.modal", function() {
            editModal.destory();
        });

        /**
         * detailModal 相关
         */
        var detailModal, $detailPriceTable, $detailSeatTable;

        function formatAirlines(data) {
            var airlineInfos = data.upgAirlineBaseSets;
            var airlines = { inland: [], nation: [] };
            for (var i = 0; i < airlineInfos.length; i++) {
                //TODO: label 展示字段
                if (airlineInfos[i].intFlag === "I") {
                    airlines.nation.push({
                        segments: airlineInfos[i].segments.split(","),
                        label:
                            airlineInfos[i].classifyValue ||
                            airlineInfos[i].countryName ||
                            "",
                        countryName:airlineInfos[i].countryName,
                        classifyValue:airlineInfos[i].classifyValue,
                        type: "nation"
                    });
                } else {
                    airlines.inland.push({
                        segments: airlineInfos[i].segments.split(","),
                        label:
                            airlineInfos[i].classifyValue ||
                            airlineInfos[i].countryName ||
                            "",
                        classifyValue:airlineInfos[i].classifyValue,
                        type: "inland"
                    });
                }
            }
            return airlines;
        }

        function initDetailPriceTable1() {
            $detailPriceTable = $(".J-detail-price-table")
                .bootstrapTable("destroy")
                .bootstrapTable({
                    search: false,
                    columns: [
                        {
                            field: "currencyName",
                            title: "币种"
                        },
                        {
                            field: "basePrice",
                            title: "原价",
                            formatter: function(value, row) {
                                return value + "(" + (row.currencyUnit || "") + ")";
                            }
                        }
                    ],
                    // queryParams: function queryParams(params) {},
                    responseHandler: function(res) {
                        return res;
                    }
                });
        }
        function initDetailPriceTable2() {
            console.log('initDetailPrice 2')
            $detailPriceTable = $(".J-detail-price-table")
                .bootstrapTable("destroy")
                .bootstrapTable({
                    search: false,
                    columns: [
                        {
                            field: "currencyName",
                            title: "币种",
                            formatter: function(value,row){
                                return value + '(' + row.currencyUnit + ')'
                            }
                        },
                        {
                            field: "feeInfoList",
                            title: "原价",
                            formatter: function(value, row) {
                                var temp = "{{adult}} (成)/ {{child}} (童)/ {{baby}} (婴)"
                                var adult = 0,
                                    child = 0,
                                    baby = 0;
                                value.forEach(function(item) {
                                    if (item.passengerType === "ADT") {
                                        adult = item.fee;
                                    } else if (item.passengerType === "CHD") {
                                        child = item.fee;
                                    } else if (item.passengerType === "INFANT") {
                                        baby = item.fee;
                                    }
                                });
                                temp = temp
                                    .replace(/\{\{adult\}\}/g, adult)
                                    .replace(/\{\{child\}\}/g, child)
                                    .replace(/\{\{baby\}\}/g, baby);
                                return temp;
                            }
                        }
                    ]
                });
        }

        function initDetailSeatTable() {
            $detailSeatTable = $(".J-detail-seat-table")
                .bootstrapTable("destroy")
                .bootstrapTable({
                    data:[],
                    search: false,
                    columns: [
                        {
                            field: "planeTypeName",
                            title: "机型"
                        },
                        {
                            field: "holdBackBusinessNum",
                            title: "活动提前关闭时座位数",
                            formatter: function(value, row) {
                                return value ? value : "--";
                            }
                        },
                        {
                            field: "businessClassSeatNum",
                            title: "公务舱座位总数",
                            formatter: function(value, row) {
                                return value ? value : "--";
                            }
                        }
                    ],
                    queryParams: function queryParams(params) {},
                    responseHandler: function(res) {
                        return res;
                    }
                });
        }
        detailMethodObj = {
            render1: {
                renderAirTable() {
                    //header
                    var headerTemp = $("#J-detail-airTable-header").html();
                    var tableTemp = $("#J-detail-airTable-temp").html();
                    tableTemp = tableTemp.replace(/\{\{headerTemp\}\}/g, headerTemp);
                    var airlines = formatAirlines(this.state.data);
                    var tabContentObj = generateAirTabContent(airlines, true);
                    var tabObj = generateAirTab(airlines);

                    tableTemp = tableTemp
                        .replace(/\{\{inlandTabContent\}\}/g, tabContentObj.inland)
                        .replace(/\{\{inlandTabList\}\}/g, tabObj.inland)
                        .replace(/\{\{nationTabList\}\}/g, tabObj.nation)
                        .replace(/\{\{nationTabContent\}\}/g, tabContentObj.nation);

                    this.template = this.template.replace(
                        /\{\{airlineTemplate\}\}/g,
                        tableTemp
                    );
                }
            },
            render2: {
                renderAirTable() {
                    //header
                    var headerTemp =
                        '<div class="air-table-header ">{{airTypeLabel}}</div>';
                    var airTypeLabel = typeLabel[this.state.airlineType];
                    headerTemp = headerTemp.replace(
                        /\{\{airTypeLabel\}\}/g,
                        airTypeLabel
                    );
                    var tableTemp = $("#J-detail-airTable-temp").html();
                    tableTemp = tableTemp.replace(/\{\{headerTemp\}\}/g, headerTemp);

                    var airlines = formatAirlines(this.state.data);

                    var tabContentObj = generateAirTabContent(airlines, true);
                    var tabObj = generateAirTab(airlines);

                    tableTemp = tableTemp
                        .replace(/\{\{inlandTabContent\}\}/g, tabContentObj.inland)
                        .replace(/\{\{inlandTabList\}\}/g, tabObj.inland)
                        .replace(/\{\{nationTabList\}\}/g, tabObj.nation)
                        .replace(/\{\{nationTabContent\}\}/g, tabContentObj.nation);

                    this.template = this.template.replace(
                        /\{\{airlineTemplate\}\}/g,
                        tableTemp
                    );
                }
            },
            init1: {
                airTableEvt() {
                    $(document).on("click", ".J-air-table-inland", airTableInlandCb);
                    $(document).on("click", ".J-air-table-nation", airTableNationCb);
                }
            },
            init2: {
                airTableEvt() {}
            }
        };

        var detailTemp = $("#J-detail-temp").html();
        var detailModal = {
            el: ".J-detail-modal-content",
            template: detailTemp,
            initTemplate:detailTemp,
            instance: undefined, // Component 实例
            state: {
                upgfType: "1", //1 登机口升舱; 2 竞价升舱; 3 机上升舱;
                airlineType: "inland", //inland 国内; nation 国际;
                data: undefined
            },
            props: emptyObj,
            methods: {
                renderOthers() {
                    //id, upgfTypeLabel, airlinePriceBaseSetName, priceLabel
                    var id = this.state.data.id;
                    var upgfTypeLabel = this.state.data.cabinType.upCabinName;
                    var airlinePriceBaseSetName = this.state.data.airlinePriceBaseSetName;
                    this.template = this.template
                        .replace(/\{\{id\}\}/g, id)
                        .replace(/\{\{upgfTypeLabel\}\}/g, upgfTypeLabel)
                        .replace(
                            /\{\{airlinePriceBaseSetName\}\}/g,
                            airlinePriceBaseSetName
                        )
                        .replace(
                            /\{\{seatLabel\}\}/g,
                            this.state.upgfType === "3" ? "" : "座位信息"
                        );
                },
                renderAirlineType() {
                    var temp = "";
                    if (this.state.upgfType === "3") {
                        temp = $("#J-detail-airlineType-temp").html();
                        temp = temp.replace(
                            /\{\{airlineTypeLabel\}\}/g,
                            typeLabel[this.state.airlineType]
                        );
                    }
                    this.template = this.template.replace(
                        /\{\{airlineTypeTemp\}\}/g,
                        temp
                    );
                },
                renderAirTable() {
                    if (this.state.upgfType === "3") {
                        detailMethodObj.render2.renderAirTable.call(this);
                    } else {
                        detailMethodObj.render1.renderAirTable.call(this);
                    }
                },
                renderSeat() {},
                renderPrice() {},
                renderCabinSeat() {
                    var temp = "";
                    if (this.state.upgfType === "3" && this.state.airlineType ==='inland') {
                        temp = $("#J-detail-cabinSeat-temp").html();
                        temp = temp
                            .replace(/\{\{weighCabin\}\}/g, this.state.data.weighCabin)
                            .replace(
                                /\{\{differDiscount\}\}/g,
                                this.state.data.differDiscount
                            );
                    }
                    this.template = this.template.replace(
                        /\{\{cabinSeatTemplate\}\}/g,
                        temp
                    );
                }
            },
            hooks: {
                beforeCreate: function() {
                    //调用 http 初始化数据的地方
                    this.state.data = detailData;
                    this.state.upgfType = detailData.cabinType.upgfType;
                    this.state.airlineType =
                        detailData.upgAirlineBaseSets[0].intFlag === "I" ? "nation" : "inland";
                },
                created: function() {
                    //根据数据渲染 template 的地方, 此处需要将 template 渲染完成
                    this.renderOthers();
                    this.renderAirlineType();
                    this.renderAirTable();
                    this.renderSeat();
                    this.renderPrice();
                    this.renderCabinSeat();
                },
                mounted: function() {
                    //组件已挂载， 此处用来监听事件
                    var data = [];
                    if (this.state.upgfType === "3") {
                        initDetailPriceTable2();
                        var feeDetails = this.state.data.feeDetails;
                        $detailPriceTable.bootstrapTable("load", feeDetails);
                    } else {
                        initDetailPriceTable1();
                        initDetailSeatTable()
                        $detailPriceTable.bootstrapTable(
                            "load",
                            this.state.data.priceInfos
                        );
                    }


                    $detailSeatTable.bootstrapTable('load',this.state.data.planeSeatInfos)
                },
                beforeUpdate: noop, //组件更新前， 用于 state 改变之后， template 中结构发生变化， 卸载 mounted 中监听的事件
                updated: noop, // 组件state UI 已经更新， 用于 template 结构变化后， 重新监听事件
                beforeDestory: noop, //卸载之前, 此处用来卸载事件
                destoryed: noop //组件已卸载
            }
        };

        var detailCom;
        $("#exampleModal2").on("shown.bs.modal", function() {
            detailCom = new Component(detailModal);
        });
        $("#exampleModal2").on("hidden.bs.modal", function() {
            detailCom.destory();
        });
        initTable();
        $("#search").click(function () {
            $("#table").bootstrapTable('refresh')
        });
        $("#reset").click(function () {
            $("#form input").each(function () {
                $(this).val("");
            })
        });

    });
})();
