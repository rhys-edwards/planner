// Detect URL pasted into search
// Get the value and send it to the server
$(function(){
  $('#search').on('paste', function(){
    console.log('key up');
    setTimeout(function () {

      var linkURL =  $('#search').val();
      console.log(linkURL)
      var self = this;
      // EVERYTHING BREAKS HERE
      var parameters = { search: $('#search').val() };
      console.log('p: ', parameters)
      $.get( '/searching',parameters, function(data) {
        $('.title').val(data);
        console.log('where are you' + ' ' + data);
      });
    }, 100);

  });
});

// Only allow one checkbox to be selected for the Date
$('input[type="checkbox"]').on('change', function() {
    $('input[type="' + this.type  + '"]').not(this).prop('checked', false);
});

// LOAD THE DATE PICKER
$(function () {
  $('.datepicker').datepicker();
});

// ONLY DISPLAY THE DATE PICKER IF THE 'DATE' CHECKBOX IS SELECTED
$('#date').on('change', function() {
  if(this.checked) {
    $('.datepicker').show();
  } else {
    $('.datepicker').hide();
  }
});
