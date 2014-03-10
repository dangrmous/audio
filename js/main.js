//Browser test for audio support

var testContext;
window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        testContext = new AudioContext();
    }
    catch(e) {
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

$("#osc1-dist").click(function(){

    if ($("#osc1-dist").prop("checked")){
    shaper1.curve = baseCurve;
    }
    else shaper1.curve = null;
    $("#osc1-distValue").text(this.value);

});

$("input[name='osc1-radio']").click(function () {

    osc1.type = this.value;

});


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



baseCurve = new Float32Array(44100);
for (i = 0; i < 44100; i++) {
    baseCurve[i] = ((Math.random() * 2) - 1);
}



//shaper1.curve = curve;

gain2.gain.value = 0;
shaper1.oversample = "4x";
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









