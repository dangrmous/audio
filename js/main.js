var au = {};
window.addEventListener('load', init, false);
function init() {

        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        au.context = new AudioContext();

    var gain1 = au.context.createGain();
    var filter1 = au.context.createBiquadFilter();
    filter1.type = "lowpass";
    gain1.gain.value = 0;
    var osc1 = au.context.createOscillator();


    $("#osc1-freq").change(function () {

        var osc1Freq = this.value;
        var osc1FreqLog = Math.pow(osc1Freq, 2);
        osc1.frequency.value = osc1FreqLog;
        $("#osc1-freqValue").text(osc1FreqLog);
    });

    $("#osc1-vol").change(function(){

        var volume = this.value;
          var fraction = parseInt(this.value) / parseInt(this.max);
          // Let's use an x*x curve (x-squared) since simple linear (x) does not
          // sound as good.
        gain1.gain.value = fraction * fraction;
        $("#osc1-volValue").text(this.value);


    });

    $("input[name='osc1-radio']").click(function(){

        osc1.type = this.value;

    });


    $("#filter1").change(function(){

        $("#filter1Value").text(this.value * this.value);
        filter1.frequency = (this.value * this.value);
        console.log(filter1.getFrequencyResponse());
    });

    $("#filterQ1").change(function(){
        filter1.Q = (this.value / 10000);
        $("#filterQ1Value").text(this.value / 100000);
        

    });




    osc1.frequency.value = 440;
    osc1.type = "sine";
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(au.context.destination);
    osc1.start(0);


}







