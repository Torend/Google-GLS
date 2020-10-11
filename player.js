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

// get html as a string and insert the value to specific class
function htmlEditor(html, className, value) {
  let index = html.search(className) + className.length + 2;
  return html.insert(index, value);
}

function pressClose(helement) {
  $(helement).last().tooltip('close');
}

function pressNext(next, curr) {
  $('[title=id-' + next + ']').tooltip('open');
  $(curr).last().tooltip('close');
}

function pressBack(back, curr) {
  // not working for all (step.id numbers are not following)
  $('[title=id-' + back + ']').tooltip('open');
  $(curr).last().tooltip('close');
}

function pressRemindMeLater(helement, inteval) {
  $(helement).last().tooltip('close');
  return window.setTimeout(function () {
    $(helement).last().tooltip('open');
  }, parseInt(inteval));
}

function addTooltip(step, tip_html, numbersOfSteps) {
  // chagne the given html (tiplates.tip)
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
  tip_html = htmlEditor(
    tip_html,
    'laterB',
    ' onClick="pressRemindMeLater(\'' +
      fixedSelector +
      "', '" +
      step.action.warningTimeout +
      '\')" '
  );

  if (Object.keys(step.action.roleTexts).length > 0) {
    for (key in step.action.roleTexts) {
      let index = tip_html.search('data-iridize-role=' + '"' + key + '"'); //assumed roleTexts is a data-iridize-role
      let sub = tip_html.substring(index);
      start = sub.search('>') + index + 1;
      end = sub.search('<') + index;
      tip_html =
        tip_html.substring(0, start) +
        step.action.roleTexts[key] +
        tip_html.substring(end);
    }
  }

  //add the the tooltip for the specfic helement
  const helement = $(step.action.selector).last();
  helement
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
        of: helement,
        collision: 'fit',
      },
      hide: { delay: step.action.wdInterval * 2, effect: 'slide' },
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
            window.setTimeout(function () {
              $('[title=id-1]').tooltip('open');
            }, 1000);
            return;
          default:
            return;
        }
      });
    },
  });
}
