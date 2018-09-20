export const shuffle=function(array){
    let temparr = [];
    let indexes = [];
    while(true){
        const number = Math.floor(Math.random()*array.length);
        if(indexes.indexOf(number)==-1){
            indexes.push(number);
            temparr.push(array[number])
        }

        if(indexes.length>=array.length)
            break;
    }
    //console.log(temparr);

    return temparr;
}

export const getCookie =(name)=> {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }