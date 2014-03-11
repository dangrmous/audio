//Browser test for audio support

var testContext;
window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        testContext = new AudioContext();
    }
    catch (e) {
        alert('Web Audio API is not supported in this browser');
    }
}
var au = {};


// Fix up for prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
au.context = new AudioContext();

var gain1 = au.context.createGain();
var gain2 = au.context.createGain();
var filter1 = au.context.createBiquadFilter();
filter1.frequency.value = 7056;
var shaper1 = au.context.createWaveShaper();
var osc1 = au.context.createOscillator();
var delay1 = au.context.createDelay();
var comp1 = au.context.createDynamicsCompressor();


gain1.gain.value = 0;

$("#osc1-freq").change(function () {

    var osc1Freq = this.value;
    var osc1FreqLog = Math.pow(osc1Freq, 2);
    osc1.frequency.value = osc1FreqLog;
    $("#osc1-freqValue").text(osc1FreqLog);
});

$("#osc1-vol").change(function () {


    var fraction = parseInt(this.value) / parseInt(this.max);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    gain1.gain.value = fraction * fraction;
    $("#osc1-volValue").text(this.value);


});

$("#osc1-dist").click(function () {

    updateShaper();
});

$("#osc1-distAmt").change(function () {

    updateDistressCurve();
    updateShaper();
});

function updateDistressCurve(){

            for (i = 0; i < 1000; i++) {
                var amt = $("#osc1-distAmt").val();
                var point = Math.tan(i * amt) * amt;
                if (point > 1) point = 1;
                if (point < -1) point = -1;
                au.distressCurve[i] = point;

            }

}

$("input[name='osc1-distType']").click(function () {
    if ($("#distress").prop("checked")) {
        curve = au.distressCurve;
        updateShaper();

    }
    if ($("#destroy").prop("checked")) {
        curve = destroyCurve;
        updateShaper();
    }

})

$("input[name='osc1-radio']").click(function () {

    osc1.type = this.value;

});

function updateShaper() {
    if ($("#osc1-dist").prop("checked")) {
        if($("#destroy").prop("checked")){
        shaper1.curve = destroyCurve;
        }
        else shaper1.curve = au.distressCurve;
    }

    else shaper1.curve = null;

}


$("#filter1").change(function () {

    $("#filter1Value").text(this.value * this.value);
    filter1.frequency.value = (this.value * this.value);

});

$("#filterQ1").change(function () {
    filter1.Q.value = (this.value / 10000);
    $("#filterQ1Value").text(this.value / 100000);


});


$("#delay1").change(function () {
    delay1.delayTime.value = this.value;
    $("#delay1Value").text(this.value);

});

$("#delay1fb").change(function () {


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

au.distressCurve = new Float32Array(1000);
for (i = 0; i < 1000; i++) {
    if ((i % 2) == 0) {
        au.distressCurve[i] = 1;
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
comp1.connect(au.context.destination);
osc1.start(0);









