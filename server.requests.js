function get_json(id){
    var r = {val:{},toString:function(){return this.val}};

    var jso = $.ajax ({
        url: 'https://api.thingspeak.com/channels/' + id.toString() +'/feeds.json',
        type: "GET",
        async: false,
        dataType: "json",
        contentType:"application/json"
    }).done(function( res) {
        return res;
    }).responseJSON;
    return jso;
}

function get_val(id,field, prev_val = undefined){
    var value;
    var mes;
    var res = get_json(id);
    if (res.feeds == undefined){
        if (prev_val == undefined){
            value = Math.random()*1000;
            mes = 'Channel ' + String(id.toString()) + ' not found. Random values initialized';
        }
        else{
            if (Math.random() > 0.5){
                value = prev_val + Math.random() * 10;
            }
            else{
                value = prev_val - Math.random() * 10;
            }
        }
    }
    else{
        if (!res.feeds[99][field]){
            value = Math.random()*1000;
            mes = 'Field ' + field.toString() + ' not found. Random values initialized';
        }
        else {
            value = res.feeds[99][field];
            mes = 'Getting data from Channel ' + id.toString();
        }
    }
    return {val: value, mes: mes}
}
