$('#addReview').submit(
  function(e){
    console.log(( (!$('select#rating').val()) && $('select#rating').val()!=0 ));
    $('.alert.alert-danger').hide();
    console.log((!$('input#name').val()));
    console.log((!$('textarea#review').val()));

    if( !$('input#name').val() || 
    ( (!$('select#rating').val()) && $('select#rating').val()!=0 ) ||
     !$('textarea#review').val() )
    {
      if ($('.alert.alert-danger').length) 
        $('.alert.alert-danger').show();
      else 
        $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
      return false;
    }
  }
);