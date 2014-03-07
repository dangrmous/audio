var au = {};
au.curve = new Float32Array();
window.addEventListener('load', init, false);
function init() {

        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        au.context = new AudioContext();

    var gain1 = au.context.createGain();
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


    });

    $("#filterQ1").change(function(){


    });




    osc1.frequency.value = 440;
    o.type = "sine";
    o.connect(w);
    w.connect(g);
    g.connect(au.context.destination);
    o.start(0);


}







