$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);
  $('.select2').select2();
  var st = true;
  window.isRole = $('#role-user').val();
  window.baseUrl = $('#baseurl').val();
  window.img = '';

  $('#list-pengajuan').DataTable();
  
  $("input[data-bootstrap-switch]").each(function(){
    // $(this).bootstrapSwitch('state', $(this).prop('checked'));
    $(this).bootstrapSwitch({
      onSwitchChange: function(e, state) {
        st = state;
      }
    });
  });

  $('#input_1').height($('#input_2').height() + 'px');
  $('#input_3').height($('#input_2').height() + 'px');

  $('.bootstrap-switch-handle-on').html('Aktif');
  $('.bootstrap-switch-handle-off').html('Tidak');

  $('#pengajuan > a').attr('class','nav-link active');

  loadujilab();

});

function loadujilab(){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'loadujilab',
        data : {
                param      : '',
         },
        success: function(result){
          let data = result.data;
          var dt = $('#list-pengajuan').DataTable({
            destroy: true,
            paging: true,
            lengthChange: false,
            searching: true,
            ordering: true,
            info: true,
            autoWidth: false,
            responsive: false,
            pageLength: 10,
            aaData: data,
            aoColumns: [
                { 'mDataProp': 'id', 'width':'10px'},
                { 'mDataProp': 'nama'},
                { 'mDataProp': 'nama'},
                { 'mDataProp': 'create_date'},
                { 'mDataProp': 'jumlah', 'width':'100px'},
                { 'mDataProp': 'status', 'width':'100px'},
                { 'mDataProp': 'jumlah', 'className':'align-middle'},
            ],
            order: [[0, 'ASC']],
            fixedColumns: true,
            aoColumnDefs:[
              { width: 50, targets: 0 },
              {
                  mRender: function ( data, type, row ) {

                    var el = `<a href="https://bios-studio.com/qlab-admin/upload/example.pdf" target="_blank" data-color="#265ed7" class="text-small" download="" style="color: rgb(38, 94, 215);">
                                <ion-icon name="download-outline"></ion-icon> Filename
                              </a>`;

                      return el;
                  },
                  aTargets: [1]
              },
              {
                mRender: function ( data, type, row ) {

                  var el = `-`;

                    return el;
                },
                aTargets: [4]
              },
              {
                mRender: function ( data, type, row ) {

                  var el = `-`;

                    return el;
                },
                aTargets: [5]
              },
              {
                  mRender: function ( data, type, row ) {
                    var el = `<div class="btn-group btn-group-sm">
                                <a href="#" class="btn btn-success" onclick="$('#modal-detail').modal('show');"><i class="fas fa-eye"></i></a>`;
                                if(window.isRole == 30){
                                    el += `<a href="#" class="btn btn-primary"><i class="fas fa-edit"></i></a>`;
                                    el +=`<a href="#" class="btn btn-danger"><i class="fas fa-trash"></i></a>`;
                                }
                        el += `</div>`;

                      return el;
                  },
                  aTargets: [6]
              },
            ],
            fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull){
                var index = iDisplayIndexFull + 1;
                $('td:eq(0)', nRow).html('#'+index);
                return  index;
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
            }
        });
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
                    var dt = $('#list-pengajuan').DataTable({
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
