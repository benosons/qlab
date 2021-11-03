$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);
  $('.select2').select2();
  window.logo = '';
  window.type_logo = '';
  window.foto = '';
  window.type_foto = '';
  loadkota();
  loadLP();
  $('#siar').attr('class','menu-open nav-item');
  $('#siar > a').attr('class','nav-link active');
  const param = $("#param").val();
  if(param == 'Televisi'){
    $('#tv').attr('class','nav-link active');
    $('#tv > i').attr('class','far fa-circle nav-icon text-danger');
  }else if(param == 'Radio'){
    $('#radio').attr('class','nav-link active');
    $('#radio > i').attr('class','far fa-circle nav-icon text-danger');
  }
  if($('#lembaga_id').val()){
    // loadsiaran($('#lembaga_id').val());
  }

  $("#logo-lembaga").change(function() {
    readURL1(this);
  });

  $("#foto-lembaga").change(function() {
    readURL2(this);
  });

  $('#simpan-lembaga-btn').on('click', function(){
      saveLembaga();
  });

});

function loadsiaran(id){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'loadsiaran',
        data : {
                id      : id,
         },
        success: function(result){
          console.log(result[0].jenisLP)
          $('#kode').val(result[0].kode);
          $('#jenisLP').val(result[0].jenisLP).trigger('change');
          $('#nama-badan').val(result[0].namaBadanHukum);
          $('#no-ipp').val(result[0].noIPP);
          $('#nama-udara').val(result[0].sebutanDiUdara);
          $('#pimpinan').val(result[0].pimpinan);
          $('#alamat').val(result[0].alamat);
          $('#kota').val(result[0].kota).trigger('change');
          $('#no-tlp').val(result[0].tlp);
          $('#fax').val(result[0].fax);
          $('#email').val(result[0].email);
          $('#kontak').val(result[0].kontak);
          $('#frekuensi').val(result[0].frekuensi);
          $('#wilayah').val(result[0].wilayahLayanan);
          $('#koordinat').val(result[0].koor);
          $('#foto').val(result[0].foto);
          $('#logo').val(result[0].logo);
          $('#website').val(result[0].website);
          $('#stream').val(result[0].streaming);
          $('#instagram').val(result[0].instagram);
          $('#twitter').val(result[0].twitter);
          $('#blah1').attr('src', result[0].logo);
          $('#blah2').attr('src', result[0].foto);

        }
      });
    }

    function readURL1(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $('#blah1').attr('src', e.target.result);
          window.logo = e.target.result;
          window.type_logo = input.files[0].type;
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    }

    function readURL2(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $('#blah2').attr('src', e.target.result);
          window.foto = e.target.result;
          window.type_foto = input.files[0].type;
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    }

    function saveLembaga(){
      var logo = window.logo;
      var type_logo = window.type_logo;
      var foto = window.foto;
      var type_foto = window.type_foto;

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'saveLembaga',
            data : {
              id              : $('#lembaga_id').val(),
              kode            : $('#kode').val(),
              jenisLP         : $("#jenisLP option:selected").val(),
              namaBadanHukum  : $('#nama-badan').val(),
              noIPP           : $('#no-ipp').val(),
              sebutanDiUdara  : $('#nama-udara').val(),
              pimpinan        : $('#pimpinan').val(),
              alamat          : $('#alamat').val(),
              kota            : $("#kota option:selected").val(),
              tlp             : $('#no-tlp').val(),
              fax             : $('#fax').val(),
              email           : $('#email').val(),
              kontak          : $('#kontak').val(),
              frekuensi       : $('#frekuensi').val(),
              wilayahLayanan  : $('#wilayah').val(),
              koor            : $('#koordinat').val(),
              foto            : foto,
              type_foto       : type_foto,
              logo            : logo,
              type_logo       : type_logo,
              website         : $('#website').val(),
              streaming       : $('#stream').val(),
              instagram       : $('#instagram').val(),
              twitter         : $('#twitter').val(),
             },
            success: function(result){
              Swal.fire({
                title: 'Sukses!',
                text: "Berhasil Tambah Lembaga",
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: '<i class="fas fa-check"></i>'
              }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
                }
              });

            }
          });
        };

        function loadkota(){
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: 'loadkota_lembaga',
                data : {
                        param      : '',
                 },
                success: function(result){
                  $('#kota').empty();
                  var option ='<option value="0">-Pilih-</option>';
                  for (var i = 0; i < result.length; i++) {
                    option += '<option value="'+result[i].name+'">'+result[i].desc+'</option>';
                  }
                  $('#kota').append(option);
                }
              });
            };

            function loadLP(){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: 'loadLP',
                    data : {
                            param      : '',
                     },
                    success: function(result){
                      $('#jenisLP').empty();
                      var option ='<option value="0">-Pilih-</option>';
                      for (var i = 0; i < result.length; i++) {
                        option += '<option value="'+result[i].name+'">'+result[i].name+'</option>';
                      }
                      $('#jenisLP').append(option);
                    }
                  });
                };
