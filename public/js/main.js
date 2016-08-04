$(document).ready(function(){
  
  $('#uploadForm').on('submit', function(e){
    e.preventDefault();
    // $('.msg').remove();
    var formData = new FormData($('#uploadForm')[0]);
    console.log(formData)
    $.ajax({
      type: "POST",
      processData: false,
      contentType: false,
      url: "./upload",
      data:  formData 
      })
      .done(function(data ) {
        $('#form').trigger('reset');
        $('.msg').text('Добавлено');    
      });
  });



  $('#blogPost').on('submit', function(e){
    e.preventDefault();
    var data   = $(this).serialize();
    console.log($(this).serialize())
    $.post( "./addblogpost", data );
  });


  $('#login').on('click', function(e){
    e.preventDefault();

    var name = $('#name').val();
    var password = $('#password').val();
    var isHuman = $('#isHuman').prop('checked')
    var radio = $('#radio1').prop('checked');


    if(name && password && isHuman && radio) {

      var form = $('.auth_form');
      $('.error').hide();
      var defObj = _ajaxForm(form, './login');
      if (defObj) {
        defObj.done(function(ans) {
          $('#loginForm').trigger('reset');
          var mes = ans.mes,
              status = ans.status;
          console.log(status)
          if (status === 'OK'){
            window.location.href = '/admin';
          }
        });
        defObj.fail(function(ans){
          console.log(ans)
          // $('.error').show().text(ans.responseJSON.message);
          $('#password').css({
            'border': '1px solid red'
          })
        })
      }
    }

  });

   $('.button').on('click', function(e){
      e.preventDefault();
      $('#form').trigger('reset');
      defObj = $.ajax({
        type : "POST",
        url : './del'
      }).fail(function(){
        console.log('Проблемы на стороне сервера');
      })
   });

     $('.logout-link').on('click', function(e){
      e.preventDefault();
      defObj = $.ajax({
        type : "POST",
        url : './logout'
      }).fail(function(){
        console.log('Проблемы на стороне сервера');
      }).complete(function(){
        window.location.href = '/';  
      })
   });

  function postDiagramValues() {
    // e.preventDefault();

    var elements = $('.tabs__list_block-elem'),
      text = $('.tabs__list-text'),
      value = $('.tabs__list-input'),
      diagramValues = {};

    elements.each(function() {
      var $this = $(this),
        name = $this.find(text).text().toLowerCase().replace('.', '');

      diagramValues[name] = $this.find(value).val();
    });

    // Send the data using post
    var posting = $.post( "/diagram", diagramValues);

    posting.done(function(data) {
      console.log(data);
    });
  }

  $('#saveDiagram').on('click', postDiagramValues);


    function _ajaxForm(form, url){
      var data = form.serialize();
      var defObj = $.ajax({
          type : "POST",
          url : url,
          data: data
        })

      return defObj;
    };
});