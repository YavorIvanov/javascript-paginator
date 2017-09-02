'use strict';

document.addEventListener('DOMContentLoaded', function () {

  var formFields = document.querySelectorAll('input, select');
  loadExample(formFields);

  for (var i in formFields) {
    if (formFields.hasOwnProperty(i)) {
      formFields[i].addEventListener('input', function () {
        loadExample(formFields);
      });
    }
  }
});

function loadExample(formFields) {

  var formParams = {
    options: {},
    labels: {},
    features: {}
  };

  for (var key in formFields) {
    if (formFields.hasOwnProperty(key)) {
      var name = formFields[key].name;
      var value = formFields[key].value;
      if (value === '') {
        value = null;
      }

      switch (true) {
        case name.indexOf('options_') !== -1:
          name = name.replace(/options_/, '');
          formParams.options[name] = value;
          break;
        case name.indexOf('labels_') !== -1:
          name = name.replace(/labels_/, '');
          formParams.labels[name] = value;
          break;
        case name.indexOf('features_') !== -1:
          name = name.replace(/features_/, '');
          formParams.features[name] = Boolean(value);
          break;
        default:
          formParams[name] = value;
          break;
      }
    }
  }

  function yourCallback() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    //console.info(args);
    paginator.currentPage = args.page;
    paginator.update('#pagination');
    return args;
  }

  var options = {
    callback: yourCallback,
    totalItems: Math.round(formParams.totalItems),
    itemsPerPage: Math.round(formParams.itemsPerPage),
    currentPage: Math.round(formParams.currentPage),
    options: {
      outerPagesCount: Math.round(formParams.options.outerPagesCount),
      innerPagesCount: Math.round(formParams.options.innerPagesCount)
    },
    labels: {
      currentPage: formParams.labels.currentPage,
      previousPage: formParams.labels.previousPage,
      nextPage: formParams.labels.nextPage,
      firstPage: formParams.labels.firstPage,
      lastPage: formParams.labels.lastPage,
      gapPage: formParams.labels.gapPage
    },
    features: {
      autoHide: formParams.features.autoHide,
      hideGaps: formParams.features.hideGaps,
      hideAdjacent: formParams.features.hideAdjacent,
      hideDisabled: formParams.features.hideDisabled,
      hidePages: formParams.features.hidePages
    }
  };

  var paginator = new Paginator(options);
  paginator.update('#pagination');

  // show code sample
  var codeSampleField = document.querySelectorAll('#generated-code');
  var codeSample = JSON.stringify(options, null, '\t');
  codeSample = 'options = ' + codeSample + '\n' + 'var paginator = new Paginator(options);' + '\n' + 'paginator.update("#pagination");';
  codeSampleField[0].value = codeSample;
}