$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);
  $('.select2').select2();
  var st = true;
  window.img = '';

  $("input[data-bootstrap-switch]").each(function(){
    // $(this).bootstrapSwitch('state', $(this).prop('checked'));
    $(this).bootstrapSwitch({
      onSwitchChange: function(e, state) {
        st = state;
      }
    });
  });

  $('#input_2, #input_3').height($('#input_1').height() + 'px');
  // $('#input_3').height($('#input_2').height() + 'px');

  $('.bootstrap-switch-handle-on').html('Aktif');
  $('.bootstrap-switch-handle-off').html('Tidak');

  $('#registrasi > a').attr('class','nav-link active');


  $('#submit-pengajuan').on('click', function(){
    var formData = new FormData();
        formData.append('nama', $('#nama').val());
        formData.append('instansi', $('#instansi').val());
        formData.append('alamat', $('#alamat').val());
        formData.append('notelp', $('#notelp').val());
        formData.append('nama_sample', $('#nama_sample').val());
        formData.append('pemerian', $('#pemerian').val());
        formData.append('kandungan', $('#kandungan').val());
        formData.append('jumlah', $('#jumlah').val());
        formData.append('kemasan', $('#kemasan').val());
        formData.append('transportasi', $('#transportasi').val());
        formData.append('penyimpanan', $('#penyimpanan').val());

        save(formData);
        
  });

  $('[name="ruanglingkup"]').on('change', function(){
    if(this.id == 'ruanglingkup'){
      $('#ruanglingkup_desc').prop('disabled', false);
      $('#nonruanglingkup_file').prop('disabled', true);
    }else{
      $('#ruanglingkup_desc').prop('disabled', true);
      $('#nonruanglingkup_file').prop('disabled', false);
    }
  })

});

$('#input_2, #input_3').height($('#input_1').height() + 'px');

function save(formData){

  $.ajax({
      type: 'post',
      processData: false,
      contentType: false,
      url: 'savepengajuan',
      data : formData,
      success: function(result){
        Swal.fire({
          title: 'Sukses!',
          text: "Pengajuan Berhasil",
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: '<i class="fas fa-check"></i>'
        }).then((result) => {
        if (result.isConfirmed) {
            location.href = 'listpengajuan';
          }
        });
      }
    });
  };