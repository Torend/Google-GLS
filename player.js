const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.head.append(script);
  });
};

loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js')
  .then(() =>
    loadScript(
      'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js'
    )
  )
  .then(() => {
    main();
  })
  .catch(() => console.error('Something went wrong.'));

//////////////////////
//////////////////////

String.prototype.insert = function (index, string) {
  if (index > 0)
    return (
      this.substring(0, index) + string + this.substring(index, this.length)
    );
  return string + this;
};

function htmlEditor(html, className, value) {
  let index = html.search(className) + className.length + 2;
  return html.insert(index, value);
}

function pressClose(tooltip) {
  $(tooltip).tooltip('close');
}

function pressNext(next, curr) {
  $('[title=id-' + next + ']').tooltip('open');
  $(curr).tooltip('close');
}

function pressBack(back, curr) {
  // not working for all (step.id numbers are not following)
  $('[title=id-' + back + ']').tooltip('open');
  $(curr).tooltip('close');
}

function addTooltip(step, tip_html, numbersOfSteps) {
  tip_html = htmlEditor(tip_html, 'stepCount', step.action.stepOrdinal);
  tip_html = htmlEditor(tip_html, 'stepsCount', numbersOfSteps);
  tip_html = htmlEditor(
    tip_html,
    'popover-content',
    step.action.contents['#content']
  );
  let fixedSelector = step.action.selector.replaceAll('"', '');
  if (fixedSelector.length > 5 && fixedSelector.substring(0, 5) === 'input') {
    fixedSelector = step.action.selector.replaceAll('"', "\\'");
  }
  tip_html = htmlEditor(
    tip_html,
    'Close',
    ' onClick="pressClose(\'' + fixedSelector + '\')" '
  );
  tip_html = htmlEditor(
    tip_html,
    'Next',
    'onClick="pressNext(\'' +
      step.followers[0].next +
      "', '" +
      fixedSelector +
      '\')" '
  );
  tip_html = htmlEditor(
    tip_html,
    'prevB',
    ' onClick="pressBack(\'' + (step.id - 1) + "', '" + fixedSelector + '\')" '
  );
  // console.log(tip_html);
  $(step.action.selector)
    .attr({
      title: 'id-' + step.id,
    })
    .tooltip({
      id: step.uid,
      content: tip_html,
      tooltipClass: step.action.classes,
      position: {
        // my: step.action.placement,
        at: step.action.placement,
        of: step.action.selector,
        collision: 'fit',
      },
      hide: { delay: step.action.warningTimeout, effect: 'slide' },
    });
}

function addCSS(css) {
  $('<link/>', {
    rel: 'stylesheet',
    type: 'text/css',
    href: '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
  }).appendTo('head');
  let style = `<style>` + css + `</style>`;
  document.head.insertAdjacentHTML('beforeend', style);
}

function main() {
  $.ajax({
    dataType: 'jsonp',
    url:
      'https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867',
    success: function (json) {
      addCSS(json.data.css);
      let steps = json.data.structure.steps;
      let numbersOfSteps = steps.length - 1;
      steps.forEach((step) => {
        switch (step.action.type) {
          case 'tip':
            return addTooltip(step, json.data.tiplates.tip, numbersOfSteps);
          case 'closeScenario':
            // $('.ui-helper-hidden-accessible').remove();
            $('[title=id-1]').tooltip('open');
            return;
          default:
            return;
        }
      });
    },
  });
}
