var au = {};

window.addEventListener('load', init, false);
function init() {

        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        au.context = new AudioContext();

    var g = au.context.createGain();
    g.gain.value = 0;
    var o = au.context.createOscillator();
    var shaperArray = new Float32Array(1,1,1);
    var w = au.context.createWaveShaper({'curve':'shaperArray'});


    $("#osc1-freq").change(function () {

        var osc1Freq = this.value;
        var osc1FreqLog = Math.pow(osc1Freq, 2);
        o.frequency.value = osc1FreqLog;
        $("#osc1-freqValue").text(osc1FreqLog);
    });

    $("#osc1-vol").change(function(){

        var volume = this.value;
          var fraction = parseInt(this.value) / parseInt(this.max);
          // Let's use an x*x curve (x-squared) since simple linear (x) does not
          // sound as good.
        g.gain.value = fraction * fraction;
        $("#osc1-volValue").text(this.value);


    });

    $("input[name='osc1-radio']").click(function(){
        o.type = this.value;

    });

    $("#waveShaper1").change(function(){
        shaperArray[0] = this.value;
        w.curve = shaperArray;

    });

    $("#waveShaper2").change(function(){
       shaperArray[1] = this.value;
        w.curve = shaperArray;

    });

    $("#waveShaper3").change(function(){
           shaperArray[2] = this.value;
            w.curve = shaperArray;

        });



    o.frequency.value = 440;
    o.type = "sine";
    o.connect(w);
    w.connect(g);
    g.connect(au.context.destination);
    o.start(0);


}






