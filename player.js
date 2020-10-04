// javascript: (function() {

//   var url = prompt('file:///C:/Users/Public/Pictures/player.js');

//   if (url) {

//       console.log('Script inject request URL:', url);

//       var script = document.createElement('script');
//       script.src = url;
//       document.getElementsByTagName('head')[0].appendChild(script);

//       console.log('Injected script: ', script);
//   }

// })();

//need to be added before load player.js
(function () {
  var h = document.head;
  var scr = document.createElement('script');
  scr.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';
  h.appendChild(scr);
})();

(function () {
  var h = document.head;
  var scr = document.createElement('script');
  scr.src =
    'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js';
  h.appendChild(scr);
})();

/////////
/////////

function addTooltip(tooltip) {
  $(tooltip.selector)
    .attr({
      title: 'overrided',
    })
    .tooltip({
      content: tooltip.contents['#content'],
      tooltipClass: tooltip.classes,
    });
}

//load the json guide
$.ajax({
  dataType: 'jsonp',
  url:
    'https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867',
  success: function (data) {
    let steps = data.data.structure.steps;
    steps.forEach((step) => {
      switch (step.action.type) {
        case 'tip':
          return addTooltip(step.action);
        case 'closeScenario':
          return console.log('closeScenario');
        default:
          return;
      }
    });
  },
});
