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
  scr.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js';
  h.appendChild(scr);
})();

//////////////////////
//////////////////////


String.prototype.insert = function(index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  return string + this;
};


function htmlEditor(html, className, value){
  let index = html.search(className) + className.length + 2;
  return html.insert(index, value);
}


function addTooltip(step, tip_html, steps_len) {
  tip_html = htmlEditor(tip_html, "stepCount", step.action.stepOrdinal);
  tip_html = htmlEditor(tip_html, "stepsCount", steps_len);
  tip_html = htmlEditor(tip_html, "popover-content", step.action.contents['#content']);
  // console.log(tip_html);
  $(step.action.selector)
    .attr({
      title: 'overrided',
    })
    .tooltip({
      content: tip_html,
      tooltipClass: step.action.classes,
      customClass: step.action.classes,
      position: {
        my: "center bottom-40",
        at: "center " + step.action.placement,
        of: step.action.selector
      }
    });
}


function addCSS(css){
  let style = `<style>`+ css + `</style>`;
document.head.insertAdjacentHTML("beforeend", style);
}

//load the json guide
$.ajax({
  dataType: 'jsonp',
  url:
    'https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867',
  success: function (json) {
    addCSS(json.data.css);
    let steps = json.data.structure.steps;
    let steps_len = steps.length;
    steps.forEach((step) => {
      switch (step.action.type) {
        case 'tip':
          return addTooltip(step, json.data.tiplates.tip, steps_len);
        case 'closeScenario':
          $(".ui-helper-hidden-accessible").remove();
          return console.log('closeScenario');
        default:
          return;
      }
    });
  },
});
