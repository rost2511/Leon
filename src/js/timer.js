var fsTimer = function (elementId, options) { //конструктор
    var element = document.getElementById(elementId);
    if (element == null) {
        throw "Element id='" + elementId + "' not found";
    }

    var now = new Date();
    this.Element = element;
    this.separatorMin = '';
    this.separatorSec = '';
    options = options || {};

    this.Options = {
        showDays: true,
        showHours: true,
        now: now,
        endDate: new Date(now.getTime() + (24 * 60 * 60 * 1000)),
        timer: null,
        onComplete: function () {
            alert('Time is out!');
        },
    };

    for (var attrName in options) {
        this.Options[attrName] = options[attrName];
    }

    var timerData = this.CalculateTimer(this.Options.now, this.Options.endDate);
    element.innerHTML =
        "<span id='" + elementId + "-fsTimerNumberDays' class='fsTimerNumber fsTimerNumberDays'>" + this.addingZeros(timerData.days) + "</span>" +
        "<span id='" + elementId + "-fsTimerNumberHours' class='fsTimerNumber fsTimerNumberHours'>" + this.addingZeros(timerData.hours) + "</span>" +
        "<span id='" + elementId + "-fsTimerNumberMinutes' class='fsTimerNumber fsTimerNumberMinutes'>" + this.addingZeros(timerData.minutes) + "</span>" +
        "<span id='" + elementId + "-fsTimerNumberSeconds' class='fsTimerNumber fsTimerNumberSeconds'>" + this.addingZeros(timerData.seconds) + "</span>"
    // "<div style='clear:both;'></div>"
    ;

    var instance = this;
    this.Interval = setInterval(function () {
        instance.Tick(instance);
    }, 980);
};

fsTimer.prototype.CalculateTimer = function (dateFrom, dateTill) {
    var d = 0, h = 0, m = 0, s = 0;
    var different = dateTill.getTime() - dateFrom.getTime();
    d = Math.floor(different / (24 * 60 * 60 * 1000));
    different = different % (24 * 60 * 60 * 1000);
    h = Math.floor(different / (60 * 60 * 1000));
    different = different % (60 * 60 * 1000);
    m = Math.floor(different / (60 * 1000));
    different = different % (60 * 1000);
    s = Math.floor(different / 1000);
    return {days: d, hours: h, minutes: m, seconds: s};
};

fsTimer.prototype.Tick = function (instance) {
    var d = document.getElementById(instance.Element.getAttribute('id') + "-fsTimerNumberDays"),
        h = document.getElementById(instance.Element.getAttribute('id') + "-fsTimerNumberHours"),
        m = document.getElementById(instance.Element.getAttribute('id') + "-fsTimerNumberMinutes"),
        s = document.getElementById(instance.Element.getAttribute('id') + "-fsTimerNumberSeconds");
    var intD = d == null ? 0 : parseInt(d.innerHTML), intH = h == null ? 0 : parseInt(h.innerHTML),
        intM = parseInt(m.innerHTML), intS = parseInt(s.innerHTML);
    --intS;
    if (intS < 0) {
        intS = 59;
        --intM;
    }
    if (intM < 0) {
        intM = 59;
        --intH;
    }
    if (intH < 0) {
        if (intD > 0) {
            intH = 23;
            --intD;
        } else {
            throw "Ошибка вычислений";
        }
    }
    intD = this.addingZeros(intD);
    intH = this.addingZeros(intH);
    intM = this.addingZeros(intM);
    intS = this.addingZeros(intS);
    if (d != null) {
        d.innerHTML = intD + "";
    }
    if (h != null) {
        h.innerHTML = intH + "";
    }
    m.innerHTML = intM + this.separatorMin;
    s.innerHTML = intS + this.separatorSec;

    if (intD == 0 && intH == 0 && intM == 0 && intS == 0) {
        if (typeof (this.Options.onComplete) == 'function') {
            instance.Options.onComplete();
        }
        clearInterval(instance.Interval);
        return;
    } else {
        if (typeof (this.Options.onProcess) == 'function') {
            instance.Options.onProcess();
        }
    }
};


fsTimer.prototype.addingZeros = function (value) {
    if (value.toString().length < 2) value = '0' + value;
    return value;
};