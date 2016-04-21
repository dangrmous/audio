var context = new AudioContext();

var gain1 = context.createGain();
var gain2 = context.createGain();
var filter1 = context.createBiquadFilter();
filter1.frequency.value = 7056;
var shaper1 = context.createWaveShaper();
var osc1 = context.createOscillator();
var delay1 = context.createDelay();
var comp1 = context.createDynamicsCompressor();

gain1.gain.value = 0;

var slider = $("#osc1-freq");
console.dir(slider);

$("#osc1-freq").on("input", function () {
    var osc1Freq = this.value;
    var osc1FreqLog = Math.pow(osc1Freq, 2);
    osc1.frequency.value = osc1FreqLog;
    $("#osc1-freqValue").text(osc1FreqLog);
});

$("#osc1-vol").on("input", function () {
    var fraction = parseInt(this.value) / parseInt(this.max);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    gain1.gain.value = fraction * fraction;
    $("#osc1-volValue").text(this.value);
});

$("#osc1-dist").on("click", function () {
    updateShaper();
});

$("#osc1-distAmt").on("input", function () {
    updateDistressCurve();
    updateShaper();
});

function updateDistressCurve() {
    for (i = 0; i < 1000; i++) {
        var amt = $("#osc1-distAmt").val();
        var point = Math.tan(i * amt) * amt;
        if (point > 1) point = 1;
        if (point < -1) point = -1;
        distressCurve[i] = point;
    }
}

$("input[name='osc1-distType']").on("click", function () {
    if ($("#distress").prop("checked")) {
        curve = distressCurve;
        updateShaper();
    }
    if ($("#destroy").prop("checked")) {
        curve = destroyCurve;
        updateShaper();
    }
})

$("input[name='osc1-radio']").on("click", function () {
    osc1.type = this.value;
});

function updateShaper() {
    if ($("#osc1-dist").prop("checked")) {
        if ($("#destroy").prop("checked")) {
            shaper1.curve = destroyCurve;
        }
        else shaper1.curve = distressCurve;
    }
    else shaper1.curve = null;
}

$("#filter1").on("input", function () {
    $("#filter1Value").text(this.value * this.value);
    filter1.frequency.value = (this.value * this.value);
});

$("#filterQ1").on("input", function () {
    filter1.Q.value = (this.value / 10000);
    $("#filterQ1Value").text(this.value / 100000);
});

$("#delay1").on("input", function () {
    delay1.delayTime.value = this.value;
    $("#delay1Value").text(this.value);

});

$("#delay1fb").on("input", function () {
    var fraction1 = parseInt(this.value) / parseInt(this.max);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    gain2.gain.value = fraction1 * fraction1;
    $("#delay1fbValue").text(this.value);
});

destroyCurve = new Float32Array(10000);
for (i = 0; i < 10000; i++) {
    destroyCurve[i] = Math.random(2) - 1;
}

var curve = new Float32Array();
curve = destroyCurve;

distressCurve = new Float32Array(1000);
for (i = 0; i < 1000; i++) {
    if ((i % 2) == 0) {
        distressCurve[i] = 1;
    }
}

gain2.gain.value = 0;
osc1.frequency.value = 440;
osc1.type = "sine";
osc1.connect(shaper1);
shaper1.connect(filter1);
filter1.connect(delay1);
filter1.connect(gain1);
delay1.connect(gain1);
delay1.connect(gain2);
gain2.connect(delay1);
gain1.connect(comp1);
comp1.connect(context.destination);
osc1.start(0);









