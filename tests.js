var steps;

$.ajax({
  dataType: 'jsonp',
  url:
    'https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867',
  success: function (json) {
    steps = json.data.structure.steps;
  },
});

function showAll() {
  steps.forEach((step) => {
    $('[title=id-' + step.id + ']').tooltip('open');
  });
}

function hideAll() {
  steps.forEach((step) => {
    $(step.action.selector).last().tooltip('close');
  });
}

function showById(id) {
  $('[title=id-' + id + ']').tooltip('open');
}

function getPositions() {
  steps.forEach((step) => {
    if (step.action.type === 'tip') {
      let tooltip = $(step.action.selector)
        .last()
        .tooltip('option', 'position');
      let helment = $(step.action.selector).last().offset();
      console.log('tooltip id: ', step.id, ' position: ', tooltip);
      console.log('helment position: ', helment);
    }
  });
}

console.log(`showAll() - show all tooltips
hideAll() - hide all tooltips
showById(id) - show specific tooltip (by id)
getPositions() - print positions of the tooltips and the elements that belong to them"
`);
