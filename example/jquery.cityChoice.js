/**
 * 实现编辑订单信息功能的API
 * @author xiongwilee
 * @time 2014-06-26
 * @method render(renderid,sid) 获取实例化单品的颜色及尺码信息，并渲到renderid的节点中
 * @method switchTo(sid) 切换到sid当前实例化单品
 */

(function($){
  $.fn.extend({
    cityChoice:function(options){

      var params = $.extend({
        cityData:[],
        hasFooter:true,//是否需要底部的确定取消按钮
        hasLabelText:true//是否需要文字第二级选中数目提示
      },options)

      function cityChoice(target,options){
        this.opts = options;
        this.opts.ele = target;
        return this;
      }

      cityChoice.prototype = {
        on: function(type, handler) {
            if (!$.isFunction(handler)) {
                return this;
            }

            var list, t = this._listeners_;
            !t && (t = this._listeners_ = {});

            type.indexOf("on") && (type = "on" + type);

            !$.isArray(list = t[type]) && (list = t[type] = []);
            t[type].unshift( {handler: handler} );

            return this;
        },
        fire:function(event,options){
            var baseEvent = function(type, target){
                this.type = type;
                this.returnValue = true;
                this.target = target || null;
                this.currentTarget = null;
                this.preventDefault = function() {this.returnValue = false;};
            }

            event && (event = new baseEvent(event));

            var i, n, list, item
                , t=this._listeners_
                , type=event.type
                // 20121023 mz 修正事件派发多参数时，参数的正确性验证
                , argu=[event].concat( Array.prototype.slice.call(arguments, 1) );
            !t && (t = this._listeners_ = {});

            // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
            $.extend(event, options || {});

            event.target = event.target || this;
            event.currentTarget = this;

            type.indexOf("on") && (type = "on" + type);

            $.isFunction(this[type]) && this[type].apply(this, argu);
            (i=this._options) && $.isFunction(i[type]) && i[type].apply(this, argu);

            if ($.isArray(list = t[type])) {
                for ( i=list.length-1; i>-1; i-- ) {
                    item = list[i];
                    item && item.handler.apply( this, argu );
                    item && item.once && list.splice( i, 1 );
                }
            }

            return event.returnValue;
        },
        init:function(){
          if(this.opts.ele){
            this.render();
          }
        },
        render:function(ele){
          var curEle = ele || this.opts.ele;
          var template = this.getTemplate();
          $(curEle).append(template);
          this.bindEvent();
        },
        getTemplate:function(){
            var template = '<div class="choiceCity">'+
                                '<div class="choiceCity_body">';
            this.cityData = this.opts.cityData;

            for(var i = 0; i<this.cityData.length; i++){
                template +='<dl class="choiceCity_dl choiceCity_dl_'+i+'" id="choiceCity_dl_'+i+'">'+
                                '<dt class="choiceCity_dt choiceCity_dt_'+i+'">'+
                                    '<input class="choiceCity_input_checkbox choiceCity_input_checkbox_par mls-input-checkbox" type="checkbox" id="choiceCity_input_checkbox_dt_'+i+'" data-pid="'+i+'">'+
                                    '<label class="choiceCity_label choiceCity_label_par mls-input-checkbox-label" for="choiceCity_input_checkbox_dt_'+i+'" id="choiceCity_label_par_'+i+'" >'+this.cityData[i].name+'</label>'+
                                '</dt>';
                this.cityData[i].value = +this.cityData[i].value;
                if(this.cityData[i].content.length>0){ 
                    for(var j = 0; j<this.cityData[i].content.length;j++){
                        template +='<dd class="choiceCity_dd choiceCity_dd_'+i+'" id="choiceCity_dd_'+i+'_'+j+'">'+
                                        '<input class="choiceCity_input_checkbox choiceCity_input_checkbox_cur mls-input-checkbox" type="checkbox" id="choiceCity_checkbox_'+i+'_'+j+'" data-pid="'+i+'" data-cid="'+j+'">'+
                                        '<label class="choiceCity_label choiceCity_label_cur mls-input-checkbox-label" for="choiceCity_checkbox_'+i+'_'+j+'" id="choiceCity_label_cur_'+i+'_'+j+'" >'+'<i class="choiceCity_label_text red_f"></i>'+this.cityData[i].content[j].name+'</label>'+
                                        '<span class="cityInfo red_f"></span>';
                        this.cityData[i].content[j].value = +this.cityData[i].content[j].value;
                        if(this.cityData[i].content[j].content.length>0){
                            template += '<span class="arrow_down"></span>'+
                                        '<span class="float_line"></span>'+
                                        '<dl class="choiceCity_sub_dl choiceCity_sub_dl_'+i+'_'+j+'">';
                            for(var k=0;k<this.cityData[i].content[j].content.length;k++){
                                template += '<dd class="choiceCity_sub_dd choiceCity_sub_dd_'+i+'_'+j+'" id="choiceCity_sub_dd_'+i+'_'+j+'_'+k+'">'+
                                                '<input class="choiceCity_input_checkbox choiceCity_input_checkbox_sub choiceCity_input_checkbox mls-input-checkbox" type="checkbox" id="choiceCity_sub_checkbox_'+i+'_'+j+'_'+k+'" data-pid="'+i+'" data-cid="'+j+'" data-sid="'+k+'">'+
                                                '<label class="choiceCity_label choiceCity_label_sub mls-input-checkbox-label" for="choiceCity_sub_checkbox_'+i+'_'+j+'_'+k+'" id="choiceCity_label_sub_'+i+'_'+j+'_'+k+'">'+this.cityData[i].content[j].content[k].name+'</label>'+
                                            '</dd>'
                                this.cityData[i].content[j].content[k].value = +this.cityData[i].content[j].content[k].value; 
                            }
                            template +=  '<dd class="choiceCity_sub_footer">'+
                                            '<button class="choiceCity_sub_btn choiceCity_sub_btn_colse btn grey">保存</button>'+
                                         '</dd>'+
                                        '</dl>'
                        }
                        template += '</dd>';
                    }
                }
                template +='</dl>'
            }
                template += '</div>';

            if(this.opts.hasFooter){
                template +='<div class="choiceCity_footer">'+
                                '<button class="choiceCity_btn choiceCity_btn_sure btn">确定</button>'+
                                '<button class="choiceCity_btn choiceCity_btn_cancel btn grey">取消</button>'+
                            '</div>'
            }

            template += '</div>';

            this.ele = $(template)

            return this.ele;
        },
        getSelectedLen:function(id,subid){
            var eles,selectLength=0;
            if(subid != undefined){
                eles = $('.choiceCity_sub_dl_'+id+'_'+subid+' input[type=checkbox]');
            }else{
                eles = $('.choiceCity_dd_'+id+' input[type=checkbox]');
            }
            for(var i=0;i<eles.length;i++){
                if(eles[i].checked){
                    selectLength++
                } 
            }
            return selectLength
        },
        setClabelText:function(id,subid){
            if(this.opts.hasLabelText){
                var cLabelTextEle = $('#choiceCity_dd_'+id+'_'+subid+' .choiceCity_label_text'),
                    cLabelWrapper = $('#choiceCity_dd_'+id+'_'+subid),
                    cSelectedLen = this.getSelectedLen(id,subid),
                    cTotalLen;
                if(cSelectedLen>0){
                    cTotalLen = this.cityData[id].content[subid].content.length;
                    cLabelTextEle.html('('+cSelectedLen+')');
                    if(cSelectedLen == cTotalLen){
                        cLabelWrapper.addClass('choiceCity_dd_all');
                        cLabelWrapper.removeClass('choiceCity_dd_half');
                    }else{
                        cLabelWrapper.addClass('choiceCity_dd_half');
                        cLabelWrapper.removeClass('choiceCity_dd_all');
                    }
                }else{
                    cLabelTextEle.html('')
                    cLabelWrapper.removeClass('choiceCity_dd_half');
                    cLabelWrapper.removeClass('choiceCity_dd_all');
                }
            }
        },
        ifSelectAll:function(id,subid){
            var eles,selectLength=0;
            if(subid != undefined){
                eles = $('.choiceCity_sub_dl_'+id+'_'+subid+' input[type=checkbox]');
            }else{
                eles = $('.choiceCity_dd_'+id+' input[type=checkbox]');
            }

            for(var i=0;i<eles.length;i++){
                if(eles[i].checked){
                    selectLength++
                } 
            }
            if(selectLength == 0){
                return 0;//一个都没有选中
            }else if(selectLength == eles.length){
                return 2;//都选中了
            }else{
                return 1;//有一些选中了
            }
        },
        setSubChange:function(id,subid,allselect){
            var eles,label;
            if(subid != undefined){
                eles = $('.choiceCity_sub_dl_'+id+'_'+subid+' input[type=checkbox]');
                label = $('#choiceCity_label_cur_'+id+'_'+subid);
            }else{
                eles = $('.choiceCity_dd_'+id+' input[type=checkbox]');
                label = $('#choiceCity_label_par_'+id);
            }
            if(!label.hasClass('choiceCity_label_useless')){
                if(allselect){
                    for(var i=0;i<eles.length;i++){
                        if(!$(eles[i]).attr('disabled')){//如果不是已经被禁用 则选中
                            eles[i].checked = true;
                        }
                    }
                }else{
                    for(var i=0;i<eles.length;i++){
                        if(!$(eles[i]).attr('disabled')){
                            eles[i].checked = false;
                        }
                    }
                }
            }
        },
        formToIndex:function(formData){
            var cityData = this.cityData,
                pCache = [],cCache = [],sCache = [],
                indexData = [],
                pValueCache = [],cValueCache = [],sValueCache = [],
                selectNames = [],
                pVal,cVal,sVal;

            if(formData.length<1 || (formData.length==1 && formData[0]=='')){
                return indexData
            }

            $.each(formData, function(index, item){
                formData[index] = +item
            });

            for(var i=0;i<cityData.length;i++){
                if(cityData[i].content && cityData[i].content.length>0){
                    cCache = [];
                    cValueCache = [];
                    for(var j=0;j<cityData[i].content.length;j++){
                        cVal = cityData[i].content[j].value;
                        if(cityData[i].content[j].content && cityData[i].content[j].content.length>0){
                            sCache = [];
                            sValueCache = [];
                            for(var k=0;k<cityData[i].content[j].content.length;k++){
                                sVal = cityData[i].content[j].content[k].value;
                                if($.inArray(sVal,formData)>-1){
                                    sCache.push([i,j,k]);
                                    sValueCache.push(cityData[i].content[j].content[k].name)
                                }
                            }
                            if(sCache.length == cityData[i].content[j].content.length){
                                cCache.push([i,j])
                                cValueCache.push( cityData[i].content[j].name )
                            }else if(sCache.length>0){
                                indexData = indexData.concat(sCache)
                                selectNames = selectNames.concat(sValueCache)
                            }
                        }
                    }
                    if(cCache.length == cityData[i].content.length){
                        indexData.push([i])
                        selectNames = selectNames.concat(cityData[i].name)
                    }else if(cCache.length>0){
                        indexData = indexData.concat(cCache)
                        selectNames = selectNames.concat(cValueCache)
                    }
                }
            }
            var uniqueNames = {}, uniqueNamesArr = [], name;
            for(i = 0; i < selectNames.length; i++){
                name = selectNames[i];
                if(!uniqueNames[name]){
                    uniqueNamesArr.push(name);
                    uniqueNames[name] = true;
                }
            }
            return {
                indexData : indexData,
                selectNames : uniqueNamesArr
            }
        },
        getSelected : function(){
            var pEles = this.ele.find('.choiceCity_dt .choiceCity_input_checkbox_par'),
                cEles,sEles,
                thisData = this.cityData,
                selectData = [],
                selectNames = [],
                selectValue = [],
                selectIndex = [];

            for(var i=0;i<pEles.length;i++){
                if(pEles[i].checked){
                    selectData[i] = {
                        isChecked : true,
                        value : thisData[i].value,
                        name : thisData[i].name
                    }

                    selectNames.push(thisData[i].name);
                    selectValue.push(thisData[i].value);
                    selectIndex.push([i])

                }else if(thisData[i].content && thisData[i].content.length>0){
                    cEles = this.ele.find('.choiceCity_dd_'+i+' .choiceCity_input_checkbox_cur');
                    selectData[i] = {
                        content : []
                    }
                    for(var j=0;j<cEles.length;j++){
                        if(cEles[j].checked){
                            selectData[i].content[j]={
                                isChecked : true,
                                value : thisData[i].content[j].value,
                                name : thisData[i].content[j].name
                            }

                            selectNames.push(thisData[i].content[j].name);
                            selectValue.push(thisData[i].content[j].value);
                            selectIndex.push([i,j])

                        }else if(thisData[i].content[j].content && thisData[i].content[j].content.length>0){
                            sEles = this.ele.find('.choiceCity_sub_dl_'+i+'_'+j+' .choiceCity_input_checkbox_sub');
                            selectData[i].content[j] = {
                                content : []
                            };
                            for(var k=0;k<sEles.length;k++){
                                if(sEles[k].checked){
                                    selectData[i].content[j].content[k] = {
                                        isChecked : true,
                                        value : thisData[i].content[j].content[k].value,
                                        name : thisData[i].content[j].content[k].name
                                    }
                                    selectNames.push(thisData[i].content[j].content[k].name);
                                    selectValue.push(thisData[i].content[j].content[k].value);
                                    selectIndex.push([i,j,k])
                                }
                            }
                        }
                    }
                }
            }
            return {
                selectData:selectData,
                selectValue:selectValue,
                selectNames:selectNames,
                selectIndex:selectIndex
            };
        },
        getFormData : function(){
            var sEles = this.ele.find('.choiceCity_input_checkbox_sub'),
                formData = [],thisPid,thisCid,thisSid;
            for(var i=0;i<sEles.length;i++){
                if(sEles[i].checked){
                    thisPid = $(sEles[i]).data('pid');
                    thisCid = $(sEles[i]).data('cid');
                    thisSid = $(sEles[i]).data('sid');
                    formData.push(this.cityData[thisPid].content[thisCid].content[thisSid].value)
                }
            }
            return formData;
        },
        bindEvent:function(){
            var me = this;

            this.ele.on('click',function(evt){
                evt.stopPropagation();
            })

            this.ele.delegate('.choiceCity_dd','click',function(evt){
                evt.stopPropagation();
                if($(this).hasClass('choiceCity_checkbox_useless')){
                    return
                }

                if($(this).hasClass('choiceCity_dd_active')){
                    $(this).removeClass('choiceCity_dd_active')
                }else{
                    me.ele.find('.choiceCity_dd_active').removeClass('choiceCity_dd_active')
                    $(this).addClass('choiceCity_dd_active')
                }
            })

            this.ele.find('.choiceCity_sub_btn_colse').on('click',function(evt){
                evt.preventDefault();
                evt.stopPropagation();
                me.ele.find('.choiceCity_dd_active').removeClass('choiceCity_dd_active');
            })

            this.ele.on('click',function(){
                me.ele.find('.choiceCity_dd_active').removeClass('choiceCity_dd_active')
            })

            this.ele.find('.choiceCity_sub_dl').on('click',function(evt){
                evt.stopPropagation();
            })

            this.ele.find('.choiceCity_label_cur').on('click',function(evt){
                evt.stopPropagation();
            })

            this.ele.find('.choiceCity_input_checkbox_cur').on('click',function(evt){
                evt.stopPropagation();
            })

            this.ele.delegate('input[type=checkbox]','change',function(evt){

                if($(this).hasClass('choiceCity_input_checkbox_par')){
                    me.changeAction('par')(this)
                }else if($(this).hasClass('choiceCity_input_checkbox_cur')){
                    me.changeAction('cur')(this)
                }else if($(this).hasClass('choiceCity_input_checkbox_sub')){
                    me.changeAction('sub')(this)
                }

                //触发修改事件
                var returnValue = me.fire('change',{
                    currData:me.getSelected(),
                    formData:me.getFormData()
                })
                if(!returnValue){
                    return;
                }
            })

            this.ele.find('.choiceCity_btn_sure').on('click',function(evt){
                evt.preventDefault();
                //触发点击确定事件
                var returnValue = me.fire('sure',{
                    currData:me.getSelected(),
                    formData:me.getFormData()
                })
                if(!returnValue){
                    return;
                }
            })
            this.ele.find('.choiceCity_btn_cancel').on('click',function(evt){
                evt.preventDefault();
                //触发点击取消事件
                var returnValue = me.fire('cancel',{
                    currData:me.getSelected(),
                    formData:me.getFormData()
                })
                if(!returnValue){
                    return;
                }
            })
        },
        changeAction:function(type){
            var me = this;
            return {
                par:function(ele){
                    var thisPid = $(ele).data('pid'),
                        thisCid = $(ele).data('cid');
                    if(thisPid != undefined){
                        me.setSubChange(thisPid,thisCid,$(ele).get(0).checked)
                    } 
                },
                cur:function(ele){
                    var thisPid = $(ele).data('pid'),
                        thisCid = $(ele).data('cid'),
                        isCchecked = $(ele).get(0).checked;

                    if(thisPid != undefined && thisCid != undefined){
                        me.setSubChange(thisPid,thisCid,isCchecked)
                    }

                    me.setClabelText(thisPid,thisCid)

                    var selectAll = me.ifSelectAll(thisPid),
                        thisPele= $('#choiceCity_input_checkbox_dt_'+thisPid);
                    if(selectAll == 2){
                        thisPele.get(0).checked = true;
                    }else{
                        thisPele.get(0).checked = false;
                    }
                },
                sub:function(ele){
                    var thisPid = $(ele).data('pid'),
                        thisCid = $(ele).data('cid'),
                        selectAll,
                        thisCele,
                        thisPele;

                    if(thisPid != undefined && thisCid != undefined){
                        selectAll = me.ifSelectAll(thisPid,thisCid);
                        thisCele = $('#choiceCity_checkbox_'+thisPid+'_'+thisCid)
                        thisPele = $('#choiceCity_input_checkbox_dt_'+thisPid)

                        if(selectAll == 2){
                            thisCele.get(0).checked = true;
                            thisCele.change();
                        }else{
                            thisCele.get(0).checked = false;
                            thisPele.get(0).checked = false;
                        }

                        me.setClabelText(thisPid,thisCid)
                    }

                }
            }[type]
        },
        clearChecked:function(){
            var pEle,cEle,sEle;
            for(var i=0;i<this.cityData.length;i++){
                pEle = $('#choiceCity_input_checkbox_dt_'+i);
                pEle.removeAttr('disabled').get(0).checked = false;
                if(this.cityData[i].content && this.cityData[i].content.length>0){
                    for(var j=0;j<this.cityData[i].content.length;j++){
                        cEle = $('#choiceCity_checkbox_'+i+'_'+j);
                        cEle.removeAttr('disabled').get(0).checked = false;
                        if(this.cityData[i].content[j].content && this.cityData[i].content[j].content.length>0){
                            for(var k = 0;k<this.cityData[i].content[j].content.length;k++){
                                sEle = $('#choiceCity_sub_checkbox_'+i+'_'+j+'_'+k);
                                sEle.removeAttr('disabled').get(0).checked = false;
                            }
                        }
                    }
                }
            }
            $(this.ele).find('.choiceCity_label_text').html('')
            $(this.ele).find('.choiceCity_checkbox_useless').removeClass('choiceCity_checkbox_useless')
            $(this.ele).find('.choiceCity_label_useless').removeClass('choiceCity_label_useless')
        },
        setUseless:function(uselessData){
            //console.log(JSON.stringify(uselessData))
            var me = this,
                uselessEle;

            if(uselessData && uselessData.length>0){
                uselessData = me.formToIndex(uselessData).indexData;

                for(var i=0;i<uselessData.length;i++){
                    if(uselessData[i][2] != undefined){
                        uselessEle = $('#choiceCity_sub_dd_'+uselessData[i][0]+'_'+uselessData[i][1]+'_'+uselessData[i][2])
                        $('#choiceCity_label_cur_'+uselessData[i][0]+'_'+uselessData[i][1]).addClass('choiceCity_label_useless')
                        $('#choiceCity_checkbox_'+uselessData[i][0]+'_'+uselessData[i][1]).attr({'disabled':'disabled'})

                        $('#choiceCity_label_par_'+uselessData[i][0]).addClass('choiceCity_label_useless')
                        $('#choiceCity_input_checkbox_dt_'+uselessData[i][0]).attr({'disabled':'disabled'})
                    }else if(uselessData[i][1] != undefined){
                        uselessEle = $('#choiceCity_dd_'+uselessData[i][0]+'_'+uselessData[i][1])
                        $('#choiceCity_label_par_'+uselessData[i][0]).addClass('choiceCity_label_useless')
                        $('#choiceCity_input_checkbox_dt_'+uselessData[i][0]).attr({'disabled':'disabled'})
                    }else{
                        uselessEle = $('#choiceCity_dl_'+uselessData[i][0])
                        $(uselessEle).find('.choiceCity_dd').addClass('choiceCity_checkbox_useless');
                    }
                    $(uselessEle).addClass('choiceCity_checkbox_useless');
                    $(uselessEle).find('input[type=checkbox]').attr({'disabled':'disabled'});
                }
            }
        },
        setDefault:function(defaultData){
            var me = this,
                pEle,cEle,sEle,wrapperEle;

            me.clearChecked();

            if(defaultData){
                for(var i=0;i<defaultData.length;i++){
                    if(defaultData[i][2] != undefined){
                        sEle = $('#choiceCity_sub_checkbox_'+defaultData[i][0]+'_'+defaultData[i][1]+'_'+defaultData[i][2])
                        wrapperEle = $('#choiceCity_sub_dd_'+defaultData[i][0]+'_'+defaultData[i][1]+'_'+defaultData[i][2])
                        $(sEle).get(0).checked = true;
                        me.changeAction('sub')(sEle)

                        me.setClabelText(defaultData[i][0],defaultData[i][1])
                    }else if(defaultData[i][1] != undefined){
                        cEle = $('#choiceCity_checkbox_'+defaultData[i][0]+'_'+defaultData[i][1])
                        wrapperEle = $('#choiceCity_dd_'+defaultData[i][0]+'_'+defaultData[i][1]);
                        $(cEle).get(0).checked = true;
                        me.changeAction('cur')(cEle)

                        me.setClabelText(defaultData[i][0],defaultData[i][1])
                    }else{
                        pEle = $('#choiceCity_input_checkbox_dt_'+defaultData[i][0])
                        wrapperEle = $('#choiceCity_dl_'+defaultData[i][0]);
                        $(pEle).get(0).checked = true;
                        me.changeAction('par')(pEle)
                    }
                }
            }
        }
      }
      
      var CityChoice = []
      this.each(function() {

        var $target = $(this),

            CityChoiceItem = new cityChoice($target,params);
        
        CityChoiceItem.init();

        CityChoice.push(CityChoiceItem)
      })

      return (CityChoice.length==1?CityChoice[0]:CityChoice);
    }
  });
})(jQuery);
