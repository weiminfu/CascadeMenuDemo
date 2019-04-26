$(function () {
    let cascadeRender = (function () {
        let $province=$('#province');
        let $city=$('#city');
        let $county=$('#county');

        let regionData=null;

        //=>获取数据
        let queryData=function () {
            return new Promise(resolve => {
                $.ajax({
                    url:'json/regionData.json',
                    method:'get',
                    dataType:'json',
                    cache:false,
                    success:resolve
                })
            })
        };

        //=>解析数据
        // level:级别(0-省 1-市 2-县)
        // value:如果level=1,value传递的是选中省的内容...
        let formatData=function formatData(level,value) {
            let result=[];
            let data=null;

            if (level===0){
                $(regionData).each((index,item)=>{
                    result.push(item.name);
                })
            }

            if (level===1){
                $(regionData).filter((index,item)=>{
                    if (item.name===value){
                        data=item;
                        return false;
                    }
                });
                if (data){
                    $(data['city']).each((index,item)=>{
                        result.push(item.name);
                    });
                }
            }

            if (level===2){
                $(regionData).filter((index,item)=>{
                    $(item['city']).filter((ind,ite)=>{
                        if (ite.name===value){
                            data=ite;
                            return false;
                        }
                    });
                    return false;
                });
                if (data){
                    $(data['area']).each((index,item)=>{
                        result.push(item)
                    });
                }
            }

            return result;
        };

        //=>绑定数据
        let bindData=function bindData(data) {
            let str=``;
            $.each(data,(index,item)=>{
                str+=`<option value="${item}">${item}</option>`;
            });
            return str;
        };

        //=>清除下拉框数据：
        // flag：标识（0-清空省，1-清空市，2-清空县，不传-都清空）
        let clearData=function clearData(flag) {
            let clearStr=`<option value="">请选择</option>`;
            switch (flag) {
                case 0:
                    $province.html(clearStr);
                    break;
                case 1:
                    $city.html(clearStr);
                    break;
                case 2:
                    $county.html(clearStr);
                    break;
                default:
                    $province.html(clearStr);
                    $city.html(clearStr);
                    $county.html(clearStr);
            }
        };

        return {
            init: function init() {
                let promise=queryData();
                promise.then(result=>{
                    //获取数据
                    regionData=result;
                    return regionData
                }).then((regionData)=>{
                    //解析数据
                    let data=formatData(0);
                    return data;
                }).then((data)=>{
                    //绑定省的数据
                    let provinceResult=bindData(data);
                    $province.append(provinceResult);

                    //省切换的时候绑定市的数据
                    $province.change(function(){
                        clearData(1);
                        clearData(2);
                        let value=$(this).val();
                        let cityResult=bindData(formatData(1,value));
                        $city.append(cityResult);
                    });

                    //市切换的时候绑定县的数据
                    $city.change(function(){
                        clearData(2);
                        let value=$(this).val();
                        let countyResult=bindData(formatData(2,value));
                        $county.append(countyResult);
                    });
                })
            }
        }
    })();
    cascadeRender.init();
});