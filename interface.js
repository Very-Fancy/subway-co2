    function initVals(){
        global:
            devs_N = 0,
            devs = [],// channel ids
            graphs = [],//CO2 vals
            g = new Gauss(),
            altText = undefined,
            heatmapInstance = new Object(),
            heatmapInstance.data = []
    }

    function initStyle(){
        $('.set_firstpart').css("position","absolute");
	    $('.set_firstpart').css("display","none");
        $('.set_firstpart').css("width","100%");
        $('.set_firstpart').css("max-height",window.innerHeight - 40);
    }

    function initEvents(){
         $('.htmap').mousedown(function(e){
             heatmapClick(e,this);
         });

         $('.AddDevice').click(function(event) {
             $('.togSet').animate({width: 57});
             addDeviceBut(event,this);
         });

         $('.DeleteDynamicExtraField').click(function(event) {
             delDeviceBut(event,this);
         });

         setInterval(function(){
             if (heatmapInstance.data.length>0) {
                 heatmapInstance = update_vals();
             }}, 5000);

         $('.htmap').bind('contextmenu', function (e) {
             return false;
         });

         $('#addDynamicExtraFieldButton').click(function(event) {
             addDynamicExtraField();
             return false;
         });

         initElems();
         $('.holder').toggle('slow');
    }

    function elems(newImg){
        var inf_width = 80;
        var height = Math.min(window.innerHeight, newImg.height);
        var width = Math.min(window.innerWidth-150,newImg.width);
        var im = $('.imdiv');

        im[0].innerHTML = " <img class = 'backimg' src = " + newImg.src + " ></img>";// ='width: 1334 px '
        $('.backimg').css('min-width',width);
        $('.backimg').css('min-height',height);
        $('.imdiv').css('min-width',width);
        $('.imdiv').css('min-height',height);
        $(".par_id").css("width", inf_width);
        $(".par_id").css("position", "relative");
        $(".par_id").css("display", "inline-block");
        $('.mapsDiv').css('min-width',width+80);
        $(".holder").css("height",height);//window.innerHeight - 10);
        $(".holder").css('text-align','right');
        $(".htmap").css('max-width' ,width);
        $(".htmap").css('max-height' ,window.innerHeight);
        $(".htmap").css("position", "relative");

        $('.map_holder').css("text-align",'left');
        $('.map_holder').css("padding-right",0);

        $('.togSet').css('max-height', "100%");
        $('.max_val').css("width", "100%");
        $('.max_val').css("text-align", "center");
        $('.min_val').css("text-align", "center");
        $('.min_val').css("width", "100%");

        $(".htmap").css("position", "relative");
        $(".htmap").css("display", "inline-block");
        $(".htmap").css("right", 0);

        $('.map_holder').css("position", "relative");
        $('.map_holder').css("display", "inline-block");

        $(".canvdiv").css("position", "absolute");
        $(".canvdiv").css("top", 0);
        $(".canvdiv").css("right", "0 px");

        $("#myCanvas").css("width",$('.backimg').width());
        $("#myCanvas").css("height",  $('.backimg').height());
        $("#myCanvas").css("position", "relative");
        $("#myCanvas").css("top", 0);
        $("#myCanvas").css("right", 0);

        canvas = document.getElementById('myCanvas');
        canvas.width = parseInt($("#myCanvas").css('width'));
        canvas.height = parseInt($("#myCanvas").css('height'));
        context = canvas.getContext('2d');

       $('.canvdiv').unbind('mousemove');

        $('.canvdiv').mousemove(function(ev){
            showDegree(ev);
        });

        $(".par_id").css("height", height);
        $(".par_id").css("float", 'left');
        $(".par_id").css("position", 'relative');
	    $(".par_id").css("display", 'inline-block');
	    
        $(".info_map").css("height",$('.par_id').height() - 60);
        $(".info_map").css("width", "100%");
        $(".info_map").css("position", "relative");

        $('.max_val').css("height", 40);
        $('.min_val').css("height", 20);
        $('.min_val').innerHTML = "0 ppm";
        $('.max_val').innerHTML = "C02 1200 ppm"; //= "C02 1200 ppm";

        var inf_config = {
            container: document.querySelector('.info_map'),
            opacity: .6,
            blur: .95,
            gradient: {
                '1': '#ff2837',
                '.75': '#FFFF00',
                '.5': '#00FF33',
                '.25': '#0099FF',
            }
        };

        $(".info_map").get(0).innerHTML = '';

        var point = {
            x: $(".info_map").width() / 2,
            y: 0,
            radius: $(".info_map").height(),
            value: 20,
        };

        var points = [];
        points.push(point);

        var data = {
            min: 0,
            max: 20,
            data: points,
        };

        var heatmapInfo = h337.create(inf_config);
        heatmapInfo.setData(data);
        heatmapInfo.repaint();
    }

    function heatmapClick(e,param){
        if (e.button == 0) {
            var coords = getXY(e, $('.canvdiv').offset());

            for (var i = 0; i < heatmapInstance.data.length; i++) {
                if (Math.pow((coords.x - heatmapInstance.data[i].x), 2) + Math.pow((coords.y - heatmapInstance.data[i].y), 2) <= Math.pow(heatmapInstance.data[i].radius, 2)) {
                    $('.canvdiv').mousemove({e, i}, function (ev) {
                    $('.htmap').unbind('mousemove');
                        $('.htmap').unbind('click');
                       // $('.canvdiv').unbind('mousemove');
                        altText = undefined;
                        var coords = getXY(ev,  $('.canvdiv').offset());
                        var tmppoint = heatmapInstance.data[i];

                        tmppoint.x = coords.x;
                        tmppoint.y = coords.y;
                        heatmapInstance.data[i] = tmppoint;
                        showMap(heatmapInstance);

                        $('.canvdiv').unbind('click');
                        $('.canvdiv').click(heatmapInstance, function (e) {
                            $('.canvdiv').unbind('mousemove');
                            $('.canvdiv').mousemove(function(e){
                                showDegree(e);
                            });

                        });
                    });
                    null;
                    break;
                }
            }
        }
    }

    function getXY(evt, offset) {
        var relativeX = (evt.pageX - offset.left);
        var relativeY = (evt.pageY - offset.top);
        return {x:Math.round(relativeX), y:Math.round(relativeY)};
    }

    function get_col(degree){
        var gradientColorsYR = [];
        var gradientColorsGY = [];
        var gradientColorsBG = [];
        var color;
        var opacityVal = (degree)/(1200)+ 0.15;

        var startColor = "#00FF33", endColor = "#0099FF";
        var start = xolor(startColor);
        for(var n=0; n<5; n++) {
            gradientColorsBG.push(start.gradient(endColor, n/5))
        }

        startColor = "#FFFF00";
        endColor = "#00FF33";
        start = xolor(startColor);
        for(var n=0; n<4; n++) {
            gradientColorsGY.push(start.gradient(endColor, n/4))
        }

        startColor = "#ff2837";
        endColor = "#FFFF00";
        start = xolor(startColor);
        for(var n=0; n<4; n++) {
            gradientColorsYR.push(start.gradient(endColor, n/4))
        }

        if (degree < 200){
            color = "#0099FF";
        }

        if (degree >= 200 && degree <=400){
            color = gradientColorsBG[Math.floor((degree - 200)/80)].hex;
        }

        if (degree < 700 && degree > 400){
            color = "#00FF33";
        }

        if (degree >= 700 && degree <=900){
            color = gradientColorsGY[Math.floor((degree - 700)/80)].hex;
        }

        if (degree > 900 && degree < 1000){
            color = "#FFFF00";
        }

        if (degree >= 900 && degree <=1000){
            color = gradientColorsYR[Math.floor((degree - 900)/20)].hex;
        }

        if (degree > 1000){
            color = "#ff2837";
        }

        return {color:color, opacityVal:opacityVal};
    }

    function update_vals(){
        for (var i = 0; i < heatmapInstance.data.length; i++){
	        var init = get_val(devs[i],graphs[i],heatmapInstance.data[i].value);
            heatmapInstance.data[i].value = parseFloat(init.val);
            var tmp = get_col(heatmapInstance.data[i].value);
            heatmapInstance.data[i].color = tmp.color;
            heatmapInstance.data[i].opacityVal = tmp.opacityVal;
        }

        if (altText != undefined) {
            altText.text =  heatmapInstance.data[altText.i].value.toFixed(1) + " ppm";
        }
        showMap(heatmapInstance);
        return heatmapInstance;
    }

    function showMap(heatmapInstance){
        var canvas = document.getElementById('myCanvas');
        canvas.width = parseInt($("#myCanvas").css('width'));
        canvas.height = parseInt($("#myCanvas").css('height'));
        var context = canvas.getContext('2d');

        for (var i = 0; i < heatmapInstance.data.length; i++) {
            context.globalAlpha = heatmapInstance.data[i].opacityVal;
            context.beginPath();
            context.arc(heatmapInstance.data[i].x, heatmapInstance.data[i].y, heatmapInstance.data[i].radius, 0, 2 * Math.PI, false);
            context.fillStyle = heatmapInstance.data[i].color;
            context.fill();
        }

        if (altText != undefined) {
            context.globalAlpha = 1;
            context.fillStyle = "black";
            context.font = "15pt status-bar";
            context.fillText(altText.text, altText.x, altText.y);
            var textWidth = context.measureText(altText.text).width;

            context.fillStyle = 'white';
            context.fillRect(altText.x, altText.y+4,textWidth, -24);

            context.fillStyle = "black";
            context.font = "15pt status-bar";
            context.fillText(altText.text, altText.x, altText.y);

            var textWidth = context.measureText(altText.text).width;

            context.strokeStyle = 'black';
            context.lineWidth = 0.5;
            context.strokeRect(altText.x, altText.y+4,textWidth, -24);
            context.beginPath();

            if (altText.x < heatmapInstance.data[altText.i].x) {
                context.moveTo(altText.x + textWidth, altText.y);
                context.lineTo(heatmapInstance.data[altText.i].x, heatmapInstance.data[altText.i].y);
                context.stroke();
            } else {
                context.moveTo(altText.x, altText.y);
                context.lineTo(heatmapInstance.data[altText.i].x, heatmapInstance.data[altText.i].y);
                context.stroke();
            }
            return true;
        }
    }

    function showDegree(e){
        var coords = getXY(e, $('.canvdiv').offset());

        for (var i = 0; i < heatmapInstance.data.length; i++) {
            if (Math.pow((coords.x - heatmapInstance.data[i].x), 2) + Math.pow((coords.y - heatmapInstance.data[i].y), 2) <= Math.pow(heatmapInstance.data[i].radius, 2)) {
                var canvas = document.getElementById('myCanvas');
                canvas.width = parseInt($("#myCanvas").css('width'));
                canvas.height = parseInt($("#myCanvas").css('height'));

                var context = canvas.getContext('2d');

                if (coords.x < heatmapInstance.data[i].x){
                    coords.x = coords.x - 60;
                }
                else{
                    coords.x = coords.x ;
                }

                if (coords.y < heatmapInstance.data[i].y){
                    coords.y = coords.y ;
                }
                else{
                    coords.y = coords.y + 30;
                }

                altText = {
                    text: heatmapInstance.data[i].value.toFixed(1) + " ppm",
                    x: coords.x,
                    y:coords.y,
                    i:i,
                }
                showMap(heatmapInstance);
                return true;
            }
        }
        if (altText!= undefined){
            altText = undefined;
            showMap(heatmapInstance);
        }
    }

    function initElems () {
        $('.map_holder').css("width",window.innerWidth - 60);
        heatmapInstance.data = [];
        showMap(heatmapInstance);
        $('.AddDevice').show();
	    
        var img = new Image();
        img.src = 'kart.jpg';
	    $('#hidSet').css('height', 30);

        $('.togSet').css('max-height', "100%");
        $('.togSet').css('width', 57);

        $('.htmap').css('float', 'left');
        $('.htmap').css('overflow', 'scroll');

        $('.set_firstpart').css('position', "relative");
        $('.set_firstpart').css('width', "100%");
        $('.set_firstpart').css('display','none');
        
	    img.onload = function() {
            elems(img);

            $('#DynamicExtraFieldsContainer').css('display', 'block');
            $('#DynamicExtraFieldsContainer').css('width', '100%');
            $('#DynamicExtraFieldsContainer').css('max-height', '90%');

            $(".put_together").css("width", "95%");
            $(".put_together").css("max-height", "96%");

            $('#hidSet').css('min-width', 57);
            $('#hidSet').show();
            $('#hidBut').css('z-index', 1);
            $('#hidBut').unbind('click');

            $('#hidBut').click(function (e) {
                if ($('.set_firstpart').css('display') != 'none') {
                    $('.set_firstpart').animate({
                        width: 'toggle'
                    });

                    $('.map_holder').animate({
                        width:  window.innerWidth - 60,
                    });

                    $('.togSet').animate({width:57});
                    $('.htmap').css('max-width','100%');
                }
                else {
                     $('.map_holder').animate({
                             width: '79%'
                     }, function () {
                         $('.htmap').css('max-width', '79%');
                     });

                     $('.set_firstpart').show();
                     $('.togSet').animate({width: '20%'});
                }
            });
        }
    }

    function delDeviceBut(event,param){
        for (var i = 0; i < devs.length; i++){
            if (devs[i]==$(param).parent().parent().children().children().children().children().get(1).value){
                if (graphs[i] == $(param).parent().parent().children().children().children().children().get(3).value){
                    devs.splice(i,1);
                    graphs.splice(i,1);
                    heatmapInstance.data.splice(i,1);
                    showMap(heatmapInstance);
                    break;
                }
            }
        }

        $(param).parent().parent().get(0).remove();
	    devs_N--;

        if ($('.set_firstpart').height() < $('.put_together').height()){
            $('#DynamicExtraFieldsContainer').css('height', $('.set_firstpart').height() );
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }
        else{
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }
        return false;
    }

    function addDeviceBut(event,param){
        $('.set_firstpart').animate({
            width: 'toggle'
        });
        $('.htmap').css('max-width','100%');
        $('.map_holder').animate({
            width: window.innerWidth - 60,
        });

        var childval = ($(param).parent().parent().children().children().children().children());

        if ( childval.get(1).value == '' || childval.get(3).value == ''){
            $('.hint-text').get(1).innerHTML = 'Both fields must be filled in';
            var RealHint =  $(param).data('hint');
            $(RealHint).css('left',event.pageX - 15);
            $(RealHint).css('top',event.pageY - 15);
            $(RealHint).toggle('fast');
            $(document).unbind('click');

            setTimeout(function(){
                $(document).click(function (e){
                    if ($(e.target).hasClass('real-hint')==false) {
                    $('.real-hint').hide('fast');
                    return;}
                });
                setTimeout(function (){
                    $('.real-hint').hide('slow');
                },4000);
             },1000);
            return;
        }
	
        $(param).hide();
        childval[1].setAttribute('readonly','');
        childval[3].setAttribute('readonly','');

        devs.push((childval.get(1).value));
        graphs.push(childval.get(3).value);
        devs_N++;
        $('.htmap').unbind('mousemove');
        $('.htmap').mousemove(function (ev) {
            altText = undefined;
            var coords = getXY(ev, $('.canvdiv').offset());
            var new_point = getXY(ev, $('.canvdiv').offset());
            new_point.radius = 20;
            heatmapInstance.data.push(new_point);
            showMap(heatmapInstance);
            heatmapInstance.data.pop();
        });

        $('.htmap').unbind('click');
        $('.htmap').click( function (e) {
            $('.htmap').unbind('mousemove');
            $('.htmap').unbind('click');
            $('.set_firstpart').show();
            $('.togSet').animate({
                width:'20%'
            });

           $('.map_holder').animate({
               width: '79%',
           });
            $('.htmap').css('max-width','79%');
            $('.canvdiv').mousemove(function(ev){
                showDegree(ev);
            });

            altText = undefined;
            var new_point = getXY(e,  $('.canvdiv').offset());
            var response = get_val(devs[devs_N - 1],graphs[devs_N-1]);
            new_point.value = parseFloat(response.val);//

            $('.hint-text').get(0).innerHTML = '';
            setTimeout(function(){
                $('.hint-text').get(0).innerHTML = response.mes;},500);

            var RealHint =  $('.htmap').data('hint');
            if (new_point.y - 104 >0){
                $(RealHint).css('top',new_point.y - 104);
            } else{
                $(RealHint).css('top',new_point.y + 104);
            }
            $(RealHint).css('left',e.pageX);
            $(RealHint).toggle('fast');

            $(document).unbind('click');
            setTimeout(function(){
                $(document).click(function (e){
                    if ($(e.target).hasClass('real-hint')==false) {
                        $('.real-hint').hide('fast');
                    return;}
            });

            setTimeout(function (){
                $('.real-hint').hide('slow');
                },4000);
            },1000);

            $('.htmap').unbind('click');
            $('.htmap').click(function(e){
                heatmapClick(e,this);
            });
            new_point.radius = 20;
            heatmapInstance.data.push(new_point);
            showMap(heatmapInstance);
        });
    }

    function addDynamicExtraField() {
        var div = $('<div/>', {
            'class': 'DynamicExtraField'
        }).appendTo($('#DynamicExtraFieldsContainer'));

        var	first_subdiv = $('<div/>', {
            'class': 'dev-nam'
        }).appendTo($('.DynamicExtraField'));

        var sec_subdiv = $('<div/>', {
            'class': 'graph-nam'
        }).appendTo($('.DynamicExtraField'));

        var third_subdiv = $('<div/>', {
            'class': 'del_but'
        }).appendTo($('.DynamicExtraField'));

        var add_num = $('.dev-nam').get().length - 1;

        $('.dev-nam').get(add_num).innerHTML = ''+
            '<div class = "lab_tex">'+
            '	<div class = "lab">'+
            '		<label>Channel id</label>'+
            '	</div>'+
            '	<div class = "tex">'+
            '		<input type="textfield" name="DynamicDev[]" cols="50" value = "Random id"></input>'+
            '	</div>'+
            '</div>';

        $('.graph-nam').get(add_num).innerHTML = ''+
            '<div class = "lab_tex">'+
            '	<div class = "lab">'+
            '		<label>Field</label>'+
            '	</div>'+
            '	<div class = "tex">'+
            '		<input type="textfield" name="DynamicGraph[]" cols="50" value = "Random field name"></input>'+
            '	</div>'
        '</div>';

        $('.del_but').get(add_num).innerHTML = ''+
            '<input value="Place" type="button" data-hint="#real-hint-2" class="button-like AddDevice"/>'+
            '<input value="Delete" type="button" class="button-like DeleteDynamicExtraField">';

        if ($('.set_firstpart').height() < $('.put_together').height()){
            $('#DynamicExtraFieldsContainer').css('height', $('#DynamicExtraFieldsContainer').css('max-height'));
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }
        else{
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }

        $('.AddDevice').unbind('click');
        $('.AddDevice').click(function(event) {
            $('.togSet').animate({width: 57});
            addDeviceBut(event,this);
        });

	    $('.DeleteDynamicExtraField').unbind('click');
        $('.DeleteDynamicExtraField').click(function(event) {
            delDeviceBut(event,this);
        });
    }

    function Gauss() {
        var ready = false;
        var second = 0.0;

        this.next = function(mean, dev) {
            mean = mean == undefined ? 0.0 : mean;
            dev = dev == undefined ? 0.1 : dev;//1.0 : dev;

            if (this.ready) {
                this.ready = false;
                return this.second * dev + mean;
            }
            else {
                var u, v, s;
                do {
                    u = 2.0 * Math.random() - 1.0;
                    v = 2.0 * Math.random() - 1.0;
                    s = u * u + v * v;
                } while (s > 1.0 || s == 0.0);

                var r = Math.sqrt(-2.0 * Math.log(s) / s);
                this.second = r * u;
                this.ready = true;
                return r * v * dev + mean;
            }
        };
    }

    function start() {
        initVals();
        initStyle();
        initEvents();
    }
