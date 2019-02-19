
function D3ToStr(y,m,d){
    m++;
    if(m < 10)m = '0' + m;
        if(d < 10)d = '0' + d;
            return y + '-' + m + '-' + d;
}
function D3ToDate(y,m,d){
    return new Date(y,m,d,0,0,0,0);
}
function DateToD3(date){
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    return {y:y,m:m,d:d};
}
function DateToStr(date){
    let d3 = DateToD3(date);
    return D3ToStr(d3.y,d3.m,d3.d);
}
function DaysInMonth(year,month){
    return new Date(year, month, 0).getDate();
}
function StrToDate(s){
    let y = parseInt(s.substring(0,4),10);
    let m = parseInt(s.substring(5,7),10);
    let d = parseInt(s.substring(8,10),10);
    return D3ToDate(y,m - 1,d);
}

(function($){
    $.fn.jsRapCalendar = function(options){

    return this.each(function(){
        let d = new Date();
        this.opt = $.extend({
            enabled:true,
            showCaption:true,
            showYear:true,
            showArrows:true,
            week:0,
            minDate:DateToStr(d),
            date:d,
            selectdate:true,
            daysName:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            monthsNames:['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июлю', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            onClick:null
        },options);
        let base = this;
        d3 = DateToD3(this.opt.date);
        this.curYear = d3.y;
        this.curMonth = d3.m;
        this.curDay = d3.d;
        let curWeek = this.opt.date.getDay();
        this.selY = this.curYear;
        this.selM = this.curMonth;
        this.selD = this.curDay;
        $(this).addClass('rapCalendar');
        let table = $('<table>').appendTo($(this));
        if(this.opt.showCaption){
            this.caption = $('<caption>').appendTo(table);
            this.cap = $('<span>').appendTo(this.caption);
            if(this.opt.showArrows){
                this.larr = $('<div>').addClass('larr').appendTo(this.caption);
                this.rarr = $('<div>').addClass('rarr').appendTo(this.caption);
            }
        }else
            this.caption = false;
        let head = $('<thead>').appendTo(table);
        let dayNames = $('<tr>').appendTo(head);
        for(let n = 0;n < 7;n++)
            $('<th>').text(this.opt.daysName[(n + 7 - this.opt.week) % 7]).appendTo(dayNames);
        let tbody = $('<tbody>').appendTo(table);

        $(this.larr).bind({
            click:function(e){
                base.ShowMonth(base.curYear,base.curMonth,-1);
            }
        });

        $(this.rarr).bind({
            click:function(e){
                base.ShowMonth(base.curYear,base.curMonth,1);
            }
        });

        this.ShowMonth = function(year,month,del){
            this.curYear = year;
            this.curMonth = month + del;
            if(this.curMonth < 0){
                this.curMonth = 11;
                this.curYear--;
            }
            if(this.curMonth > 11){
                this.curMonth = 0;
                this.curYear++;
            }
            if(this.caption){
                let s = this.opt.monthsNames[this.curMonth];
                if(this.opt.showYear)
                    s += ' ' + this.curYear;
                $(this.cap).text(s);
            }
            $(tbody).empty();
            let dim = DaysInMonth(this.curYear,this.curMonth + 1);
            let tr = $('<tr>').appendTo(tbody);
            let td = null;
            let fd =  (new Date(this.curYear,this.curMonth,1).getDay()  + this.opt.week) % 7;
            for(var n = 0;n < fd;n++)
                td = $('<td>').appendTo(tr);
            for(var n = 1;n <= dim;n++){
                if($(tr).children().length > 6)
                    tr = $('<tr>').appendTo(tbody);
                let d = $('<td>').text(n).appendTo(tr);
                if(D3ToStr(this.curYear,this.curMonth,n) < this.opt.minDate)
                    d.addClass('calDisable');
                else if(this.opt.enabled)
                    d.addClass('calSelectable');
                if((this.selY == this.curYear) && (this.selM == this.curMonth) && (this.selD == n && this.opt.selectdate))
                    $(d).addClass('calSelected');
            }
            $('.calSelectable',this).bind({
                click:function(e){
                    $('td',base).removeClass('calSelected');
                    $(this).addClass('calSelected');
                    base.selY = base.curYear;
                    base.selM = base.curMonth;
                    base.selD = $(this).text();
                    if(base.opt.onClick)
                        base.opt.onClick.call(this,base.selY,base.selM,base.selD);
                }
            });
        }

        this.ShowMonth(this.curYear,this.curMonth,0);
    });
}})(jQuery);
