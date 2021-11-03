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
  $('.bootstrap-switch-handle-on').html('Aktif');
  $('.bootstrap-switch-handle-off').html('Tidak');

  $('#users > a').attr('class','nav-link active');
  $('#add-users').on('click', function(){
    $('#modal-default').modal({
      show: true
    });
    $('#id').val('');
    $('.modal-title').html('Tambah User');
    $('#username').attr('disabled', false);
    $('#password').attr('disabled', false);
    $("[name='user-input']").val('');
    // $("#kota-kab").select2('data', {}).trigger('change');
    $('#kota-kab').val(0).trigger('change');
    $('#blah').attr('src', 'assets/dokumen/gambar/user/default.jpg');
    $('label[for="foto-user"]').text('Pilih Foto');
  });

  $('#save-user').on('click', function(){
    if(!$('#name').val()){
      $('#name').attr('class', 'form-control is-invalid');
    }else if(!$('#username').val()){
      $('#username').attr('class', 'form-control is-invalid');
    }else if(!$('#password').val()){
      $('#password').attr('class', 'form-control is-invalid');
    }else{
      saveUser(st);
    }
  });

  $('#name').keyup(function(){$(this).attr('class', 'form-control')});
  $('#username').keyup(function(){$(this).attr('class', 'form-control')});
  $('#password').keyup(function(){$(this).attr('class', 'form-control')});


  loadkota();
  loaddatauser();

  $( "#btn-view-pass" ).mousedown(function(e) {
      $('#password').prop('type', 'text');
      $('#btn-view-pass > i').attr('class','far fa-eye-slash');
  });

  $( "#btn-view-pass" ).mouseup(function(e) {
      $('#password').prop('type', 'password');
      $('#btn-view-pass > i').attr('class','far fa-eye');
  });

  $("#foto-user").change(function() {
    readURL(this);
  });

  $('#username').keyup(function(){
    $('#username').attr('class', 'form-control');
    $('#warning').attr('style', 'color: #f9b2b2;display:none;');
    $('#lbl-unm').attr('style', 'display:block;');

    $('#save-user').attr('disabled', false);

    if($(this).val().length >= 4){
      cekusername($(this).val());
    }
  });

});

function loadkota(){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'loadkota',
        data : {
                param      : '',
         },
        success: function(result){
          $('#kota-kab').empty();
          var option ='<option value="0">-Pilih-</option>';
          for (var i = 0; i < result.length; i++) {
            option += '<option value="'+result[i].id+'">'+result[i].nama+'</option>';
          }
          $('#kota-kab').append(option);
        }
      });
    };

    function loaddatauser(){

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'listDataUser',
            data : {
                    param      : '',
             },
            success: function(result){
                    var dt = $('#listuser').DataTable({
                        responsive: true,
                        bDestroy: true,
                        processing: true,
                        autoWidth : true,
                        pageLength: 10,
                        lengthChange: true,
                        aaData: result,
                        aoColumns: [
                            { 'mDataProp': 'id'},
                            { 'mDataProp': 'foto'},
                            { 'mDataProp': 'username'},
                            { 'mDataProp': 'role_desc'},
                            { 'mDataProp': 'nama_kotakab'},
                            { 'mDataProp': 'status'},
                            { 'mDataProp': 'islogin'},
                            { 'mDataProp': 'kotaKab'},
                            // { 'mDataProp': 'role'},
                        ],
                        order: [[0, 'ASC']],
                        aoColumnDefs:[
                          // {
                          //   targets: [7],
                          //   visible: false
                          // },
                            {
                                mRender: function (data, type, row){
                                    var $rowData = '';
                                        $rowData += `
                                                  <div class="row">
                                                    <div class="col-md-4">
                                                      <button onclick="modaldetail('`+row.id+`','`+row.username+`','`+row.role_desc+`','`+row.kotaKab+`','`+row.status+`','`+row.name+`','`+row.foto+`','`+row.nama_kotakab+`')" type="button" class="btn btn-block btn-success btn-sm"><i class="far fa-eye"></i></button>
                                                    </div>
                                                    <div class="col-md-4">
                                                      <button onclick="edituser('`+row.id+`','`+row.username+`','`+row.password+`','`+row.kotaKab+`','`+row.status+`','`+row.role+`','`+row.name+`','`+row.foto+`')" type="button" class="btn btn-block btn-warning btn-sm"><i class="far fa-edit"></i></button>
                                                    </div>
                                                    <div class="col-md-4">
                                                      <button onclick="deleteData(`+row.id+`)" type="button" class="btn btn-block btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                                                    </div>
                                                  </div>
                                                    `;

                                    return $rowData;
                                },
                                aTargets: [7]
                            },
                            {
                                mRender: function (data, type, row){
                                  var $rowData = '';
                                  if(row.islogin == 1){
                                        $rowData +=`<span class="badge badge-success right">Online</span>`;
                                      }else{
                                        $rowData +=`<span class="badge badge-default right">Offline</span>`;
                                      }

                                    return $rowData;
                                },
                                aTargets: [6]
                            },
                            {
                                mRender: function (data, type, row){
                                  var $rowData = '';
                                  if(row.status == 1){
                                        $rowData +=`<span class="badge badge-primary right">Aktif</span>`;
                                      }else{
                                        $rowData +=`<span class="badge badge-warning right">Non Aktif</span>`;
                                      }

                                    return $rowData;
                                },
                                aTargets: [5]
                            },
                            {
                                mRender: function (data, type, row){
                                  var $rowData = '<img src="'+row.foto+'" style="width: 35px;"></img>';
                                    return $rowData;
                                },
                                aTargets: [1]
                            }
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

    function saveUser(st){
      var img = window.img;
      var stat;
        switch (st) {
          case false:
              stat = '0';
            break;
          default:
              stat = '1'
        }

        if($('#id').val()){
          var baseurl = 'updateUser';
          var msg = 'Update User';

        }else{
          var baseurl = 'saveUser';
          var msg = 'Tambah User';
        }

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: baseurl,
            data : {
                    id            : $('#id').val(),
                    name          : $('#name').val(),
                    username      : $('#username').val(),
                    password      : $('#password').val(),
                    status        : stat,
                    kotaKab       : $("#kota-kab option:selected").val(),
                    role          : $("input[name='role']:checked").val(),
                    img           : img,
             },
            success: function(result){
              Swal.fire({
                title: 'Sukses!',
                text: msg,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });

              $('#modal-default').modal('hide');
              loaddatauser();
            }
          });
        };

function edituser(id, username, password, kotakab, status, role, name, foto){
  $('#add-users').trigger('click');
  $('.modal-title').html('Edit User');
  $('#id').val(id);
  $('#name').val(name);
  $('#username').val(username);
  $('#username').attr('disabled', true);
  $('#password').val(password);
  $('#password').attr('disabled', true);
  $('#kota-kab').val(kotakab).trigger('change');
  let fot = foto.split("/");
  $('label[for="foto-user"]').text(fot[fot.length - 1]);
  $('#blah').attr('src', foto);
  $("#stat").bootstrapSwitch('state', status == '1' ? true : false);

  if(role == '10'){
    $("#super-admin").attr('checked', true).trigger('click');
  }else{
    $("#admin").attr('checked', true).trigger('click');
  }
}

function deleteData(id)
{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Anda Yakin, hapus user ini?',
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
      url: 'deleteUser',
      data : {
              id    : id,
            },
      success: function(data)
      {
        Swal.fire({
          title: 'Sukses!',
          text: 'Hapus User',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        loaddatauser();
      }
    });
  }
})

}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#blah').attr('src', e.target.result);
      window.img = e.target.result;
    }
    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}

function modaldetail(id,username,role,kotaKab,status,name,foto, nama_kotakab){
    $('#modal-detail').modal({
      show: true
    });

    $('.modal-title').html('Detail');

    var stt = '';
    if(status == 1){
      stt +=`<span class="badge badge-primary right">Aktif</span>`;
    }else{
      stt +=`<span class="badge badge-warning right">Non Aktif</span>`;
    }

    $('#detail-foto').attr('src', foto);
    $('#detail-name').text(name);
    $('#detail-username').html('username: <i>'+username+'</i>');
    $('#detail-kotakab').text(nama_kotakab);
    $('#detail-status').html(stt);
    $('#detail-role').text(role);
}

function cekusername(uname){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'cekusername',
        data : {
                username      : uname,
         },
        success: function(result){
            console.log(result);
            if(result){
              $('#username').attr('class', 'form-control is-invalid');
              $('#warning').attr('style', 'color: #f9b2b2;display:block;');
              $('#lbl-unm').attr('style', 'display:none;');
              $('#save-user').attr('disabled', true);

            }
        }
      });
    };
