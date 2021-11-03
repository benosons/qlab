$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);

  $('#video-tutor > a').attr('class','nav-link active');
  $('#add-video').on('click', function(){
    $('#modal-add-video').modal({
      show: true
    });
    $('.modal-title').html('Tambah Video Tutorial');
    $("[name='video-input']").val('');
    $('#iframe-video-add').empty();
  });


  $('#btn-simpan-video').on('click', function(){
    simpanvideo();
  });

  $('#close-view-video').on('click', function(){
    $('#iframe-video').empty();
    $('#videoModal').is(':visible');
  });

  $('#close-tambah-video').on('click', function(){
    $('#iframe-video-add').empty();
    $('#videoModal').is(':visible');
  });

  $('#tutup-view').on('click', function(){
    $('#iframe-video').empty();
    $('#videoModal').is(':visible');
  });

    loadvideo();

    $('#btn-play-vid').on('click', function(){
      if($('#url').val()){
        playvideo($('#url').val());
      }
    });

    $('#btn-clear-iframe').on('click', function(){
      $('#iframe-video-add').empty();
    })
  });

  function simpanvideo(){

    if($('#id').val()){
      var act = 'updatevideo';
      var msg = 'Update Video';
    }else{
      var act = 'addvideo';
      var msg = 'Tambah Video';
    }

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: act,
        data : {
                id        : $('#id').val(),
                judul     : $('#judul').val(),
                url       : $('#url').val(),
                desc      : $('#desc').val(),
         },
        success: function(result){
          Swal.fire({
            title: 'Sukses!',
            text: msg,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          $("[name='video-input']").val('');
          loadvideo();
        }
      });
  }

    function loadvideo(){
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'listDataVideo',
            data : {
                    param      : '',
             },
            success: function(result){
                    var dt = $('#list-video').DataTable({
                        responsive: true,
                        bDestroy: true,
                        processing: true,
                        autoWidth : true,
                        pageLength: 10,
                        lengthChange: true,
                        aaData: result,
                        aoColumns: [
                            { 'mDataProp': 'id'},
                            { 'mDataProp': 'judul'},
                            { 'mDataProp': 'url'},
                            { 'mDataProp': 'desc'},
                            { 'mDataProp': 'path'},
                        ],
                        order: [[0, 'ASC']],
                        aoColumnDefs:[
                            {
                                mRender: function (data, type, row){
                                    var $rowData = '';
                                        $rowData += `
                                                  <div class="row">
                                                    <div class="col-md-4">
                                                      <button onclick="autoPlayYouTubeModal('`+row.url+`')" type="button" class="btn btn-block btn-success btn-sm"><i class="far fa-eye"></i></button>
                                                    </div>
                                                    <div class="col-md-4">
                                                      <button onclick="editvideo(`+row.id+`,'`+row.judul+`','`+row.url+`','`+row.desc+`')" type="button" class="btn btn-block btn-warning btn-sm"><i class="far fa-edit"></i></button>
                                                    </div>
                                                    <div class="col-md-4">
                                                      <button onclick="deletevideo(`+row.id+`)" type="button" class="btn btn-block btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                                                    </div>
                                                  </div>
                                                    `;

                                    return $rowData;
                                },
                                aTargets: [4]
                            },
                        ],

                        fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull){
                            var index = iDisplayIndexFull + 1;
                            $('td:eq(0)', nRow).html(' '+index);
                            return  ;
                        },

                        fnInitComplete: function () {
                            var that = this;
                            var td ;
                            var tr ;

                            this.$('td').click( function () {
                                td = this;
                            });
                            this.$('tr').click( function () {
                                tr = this;
                            });


                            $('#listproj_filter input').bind('keyup', function (e) {
                                return this.value;
                            });

                        }
                    });

                }
        });
    }

  function deletevideo(id){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Anda yakin, hapus video ini?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-check"></i> Ya',
      cancelButtonText: '<i class="fas fa-times"></i> Tidak',
      reverseButtons: true
    }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
          type: 'post',
          dataType: 'json',
          url: 'deletevideo',
          data : {
                  param      : id,
           },
          success: function(result){
            Swal.fire({
              title: 'Sukses!',
              text: 'Hapus Video',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });

            loadvideo();
          }
        });
      };
    });
  }

  function editvideo(id, judul, url, desc){
    $('#add-video').trigger('click');
    $('.modal-title').html('Edit Video Tutorial');
    $('#id').val(id);
    $('#judul').val(judul);
    $('#url').val(url);
    $('#desc').val(desc);

  }

//FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
function autoPlayYouTubeModal(url) {
  $('.modal-title').html('Preview Video Tutorial');
  $('#videoModal').modal({
    show: true
  });
  var part = url.substring(
    url.lastIndexOf("?v=") + 3,
    url.lastIndexOf("&")
  );
  // $('#iframe-video').attr('src', 'http://www.youtube.com/embed/'+url.split('?v=')[1]+'?autoplay=1');
  $('#iframe-video').html('<iframe id="iframe-video" width="100%" height="350" src="https://www.youtube.com/embed/'+part+'?autoplay=0"></iframe>');
}

function playvideo(url) {
  var part = url.substring(
    url.lastIndexOf("?v=") + 3,
    url.lastIndexOf("&")
  );

  // $('#iframe-video').attr('src', 'http://www.youtube.com/embed/'+url.split('?v=')[1]+'?autoplay=1');
  $('#iframe-video-add').html('<iframe id="iframe-video" width="100%" height="350" src="https://www.youtube.com/embed/'+part+'?autoplay=0"></iframe>');
}
