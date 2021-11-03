$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);
  $('#aduan').attr('class','menu-open nav-item');
  $('#aduan > a').attr('class','nav-link active');
  const status_aduan = $("#status_aduan").val();

  if(status_aduan == '0'){
    $('#new-msg').attr('class','nav-link active');
    $('#new-msg > i').attr('class','far fa-circle nav-icon text-danger');
  }else if(status_aduan == '2'){
    $('#reply-msg').attr('class','nav-link active');
    $('#reply-msg > i').attr('class','far fa-circle nav-icon text-danger');
  }else if(status_aduan == '4'){
    $('#close-msg').attr('class','nav-link active');
    $('#close-msg > i').attr('class','far fa-circle nav-icon text-danger');
  }

  loadaduan(status_aduan);

  $('#kirim-balasan').on('click', function(){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'saveBalasan',
        data : {
                id_parent     : $('#id-parent').val(),
                id_admin      : $('#id-admin').val(),
                id_user       : $('#id-pelapor').val(),
                isi           : $('#pesan-balasan').val(),
                status        : $('#status-laporan').val(),
         },
        success: function(result){
            var id_parent = $('#id-parent').val();
            var nama_pelapor = $('#nama-pelapor').val();
            var id_pelapor = $('#id-pelapor').val();
            var id_admin = $('#id-admin').val();
            var isi = $('#isi-laporan').val();
            var date = $('#date-laporan').val();
            var status = $('#status-laporan').val();
            replylaporan(id_parent, nama_pelapor, id_pelapor, isi, date, id_admin, status);
        }

        });
  });
});

function loadaduan(param){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'listDataAduan',
        data : {
                param      : param,
         },
        success: function(result){
                var dt = $('#list-aduan-'+param).DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": false,
                    "autoWidth": false,
                    "responsive": true,
                    "pageLength": 10,
                    "autoWidth": true,
                    aaData: result,
                    aoColumns: [
                        { 'mDataProp': 'id'},
                        { 'mDataProp': 'status'},
                        { 'mDataProp': 'nama_pelapor'},
                        { 'mDataProp': 'judul'},
                        { 'mDataProp': 'nama_kota'},
                        { 'mDataProp': 'create_date'},
                        { 'mDataProp': 'create_date'},

                    ],
                    order: [[0, 'ASC']],
                    aoColumnDefs:[
                      {
                          "mRender": function ( data, type, row ) {
                            var el =
                            `<div class="icheck-primary">
                              <input type="checkbox" value="`+row.id+`" name="aduan" id="check-`+row.id+`">
                              <label for="check-`+row.id+`"></label>
                            </div>`;
                              return el;
                          },
                          "aTargets": [ 0 ]
                      },
                      {
                          "mRender": function ( data, type, row ) {
                            var el = '';
                            if($('#role').val() == '30'){
                              if(row.status == "NULL"){
                                el ='<span class="badge badge-default">terkirim</span>';
                              }else if (row.status == "1"){
                                el = '<span class="badge badge-success">dibalas admin</span>';
                              }else if (row.status == "3"){
                                el = '<span class="badge badge-default">terkirim</span>';
                              }else if (row.status == "4"){
                                el = '<span class="badge badge-danger">close</span>';
                              }else if (row.status == "2"){
                                el = '<span class="badge badge-default">terkirim</span>';
                              }
                            }else{
                              if(row.status == "NULL"){
                                el ='<span class="badge badge-info">pesan baru</span>';
                              }else if (row.status == "4"){
                                el = '<span class="badge badge-danger">close</span>';
                              }else if (row.status == "2"){
                                el = '<span class="badge badge-success">dibalas user</span>';
                              }else if(row.status == "3"){
                                el = '<span class="badge badge-default">terkirim</span>';
                              }else if(row.status == "1"){
                                el = '<span class="badge badge-default">terkirim</span>';
                              }
                            }

                              return el;
                          },
                          "aTargets": [ 1 ]
                      },
                      {
                          "mRender": function ( data, type, row ) {
                            var el = `
                                      <div class="row">
                                        <div class="col-md-4">
                                          <button onclick="replylaporan(`+row.id+`,'`+row.nama_pelapor+`','`+row.id_user+`','`+row.isi+`','`+row.create_date+`','`+row.id_admin+`','1')" type="button" class="btn btn-block btn-success btn-sm"><i class="fas fa-reply"></i></button>
                                        </div>
                                        <div class="col-md-4">
                                          <button onclick="closelaporan(`+row.id+`)" type="button" class="btn btn-block btn-danger btn-sm"><i class="fas fa-ban"></i></button>
                                        </div>
                                      </div>
                                        `;
                              if(row.status == "4"){
                                el = `<div class="row">
                                        <div class="col-md-12">
                                          <button onclick="replylaporan(`+row.id+`,'`+row.nama_pelapor+`','`+row.id_user+`','`+row.isi+`','`+row.create_date+`','`+row.id_admin+`','4')" type="button" class="btn btn-block btn-success btn-sm"><i class="fas fa-eye"></i></button>
                                        </div>
                                      </div>`;
                              }else{
                                el = el;
                              }

                              return el;
                          },
                          "aTargets": [ 6 ]
                      },
                    ],

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
}

function replylaporan(id, nama_pelapor, id_pelapor, isi, date, id_admin, status){

  $('#modal-default').modal({
    show: true
  });

  var tanggal = getdate(date)[0];
  var jam     = getdate(date)[1];
  $('#pesan-balasan').val("");
  $('#id-parent').val(id);
  $('#id-pelapor').val(id_pelapor);
  $('#id-admin').val(id_admin);
  $('#nama-pelapor').val(nama_pelapor);
  $('#date-laporan').val(date);
  $('#isi-laporan').val(isi);
  $('#status-laporan').val(status);
  $('#percakapan').empty();
  $.ajax({
      type: 'post',
      dataType: 'json',
      url: 'cekBalasan',
      data : {
              id      : id,
       },
      success: function(response){
        var result = response.data;
        var lampiran = response.lampiran;

        var attch = '';
        if(lampiran.length != 0){
            attch += `<div>
                          <i class="fas fa-paperclip bg-warning"></i>

                          <div class="timeline-item">
                            <h3 class="timeline-header"> Lampiran</h3>

                            <div class="timeline-body">
                              <ul class="mailbox-attachments d-flex align-items-stretch clearfix">

                            `;
          for (var i = 0; i < lampiran.length; i++) {
            // attch += `<img src="`+lampiran[i].url+`" alt="..." style="width: 30%;">`;
            attch += `<li>
                        <div class="mailbox-attachment-info" style="background: #ffffff;">
                          <a href="#" class="mailbox-attachment-name" style="font-size: 12px;"><i class="fas fa-paperclip"></i> `+lampiran[i].filename+`</a>
                              <span class="mailbox-attachment-size clearfix mt-1">
                                <span>1,245 KB</span>
                                <a href="`+lampiran[i].url+`" download="`+lampiran[i].filename+`" class="btn btn-default btn-sm float-right"><i class="fas fa-download"></i></a>

                              </span>
                        </div>
                      </li>`;
          }

          attch += `</ul>
                    </div>
                  </div>
                </div>`;
        }
        $('#timeline').empty();
        var timeline = `<div class="time-label">
                          <span class="bg-danger">
                            `+tanggal+`
                          </span>
                        </div>`;
            timeline += `<div>
                          <i class="fas fa-envelope bg-warning"></i>

                          <div class="timeline-item">
                            <span class="time"><i class="far fa-clock"></i> `+jam+`</span>

                            <h3 class="timeline-header"><a href="#">`+nama_pelapor+`</a></h3>

                            <div class="timeline-body">
                              `+isi+`
                            </div>

                          </div>
                        </div>`;
                        timeline += attch;
        var bg = '', name = '', alltgl = [];
        for (var i = 0; i < result.length; i++) {

          if(result[i].rep_admin  == '1'){
            bg = 'bg-info';
            name = result[i].nama_admin;
          }else if(result[i].rep_user  == '1'){
            bg = 'bg-warning';
            name = result[i].nama_pelapor;
          }

            if(getdate(result[i].create_date)[0] != tanggal){

              timeline += `<div class="time-label">
                                <span class="bg-danger">
                                  `+getdate(result[i].create_date)[0]+`
                                </span>
                              </div>`;
            }

            timeline += `<div>
                        <i class="fas fa-envelope `+bg+`"></i>

                        <div class="timeline-item">
                          <span class="time"><i class="far fa-clock"></i> `+getdate(result[i].create_date)[1]+`</span>

                          <h3 class="timeline-header"><a href="#">`+name+`</a></h3>

                          <div class="timeline-body">
                            `+result[i].isi+`
                          </div>

                        </div>
                      </div>`;

        }

          if(status == '4'){
            timeline += `<div>
                          <i class="fas fa-ban bg-danger"></i>
                        </div>`;

              $('.direct-chat').hide();
          }else{
            timeline += `<div>
                          <i class="far fa-clock bg-gray"></i>
                        </div>`;
            $('.direct-chat').show();
          }
          $('#timeline').append(timeline);

        // $('#pesan-balasan').val("");
        // var cakap = "";
        // cakap +=
        //   `<div class="direct-chat-msg">
        //     <div class="direct-chat-infos clearfix">
        //       <span class="direct-chat-name float-left">`+nama_pelapor+`</span>
        //       <span class="direct-chat-timestamp float-right">`+date+`</span>
        //     </div>
        //     <!-- /.direct-chat-infos -->
        //     <img class="direct-chat-img" src="assets/lte/dist/img/user1-128x128.jpg" alt="message user image">
        //     <!-- /.direct-chat-img -->
        //     <div class="direct-chat-text">
        //       `+isi+`
        //     </div>
        //     <!-- /.direct-chat-text -->
        //   </div>`;
        //
        //   for (var i = 0; i < result.length; i++) {
        //
        //     if(result[i].rep_admin  == '1'){
        //       var adm = "right";
        //       var ids = result[i].id_admin;
        //       var float_name = 'float-right';
        //       var float_date = 'float-left';
        //       var nama = result[i].nama_admin;
        //     }else{
        //       var adm = "";
        //       var ids = result[i].id_user;
        //       var float_name = 'float-left';
        //       var float_date = 'float-right';
        //       var nama = result[i].nama_pelapor;
        //     }
        //
        //     cakap +=
        //     `<div class="direct-chat-msg `+adm+`">
        //       <div class="direct-chat-infos clearfix">
        //         <span class="direct-chat-name `+float_name+`">`+nama+`</span>
        //         <span class="direct-chat-timestamp `+float_date+`">`+result[i].create_date+`</span>
        //       </div>
        //       <img class="direct-chat-img" src="assets/lte/dist/img/user3-128x128.jpg" alt="message user image">
        //       <div class="direct-chat-text">
        //         `+result[i].isi+`
        //       </div>
        //     </div>`;
        //
        //   }
        //
        //
        //   $('#percakapan').append(cakap);

      }
    });

}

function closelaporan(id){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Aduan ini sudah selesai?',
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
          url: 'closeAduan',
          data : {
                  id      : id,
           },
          success: function(result){
            Swal.fire({
              icon  : 'success',
              title : 'Pengaduan Selesai',
              text  : '',
              confirmButtonText: '<i class="fas fa-check"></i>'
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        });
    }
  });


}

function kirimlaporan(name,email,subject,message){
$.ajax({
    type: 'post',
    dataType: 'json',
    url: 'saveAduan',
    data : {
            name        : name,
            email       : email,
            subject      : subject,
            message      : message,
     },
    success: function(result){

      window.location.href = $('#baseurl').val()+"dashboard";

    }
  });
}

function getdate(tgl){
  var date = new Date(tgl);
  var tahun = date.getFullYear();
  var bulan = date.getMonth();
  var tanggal = date.getDate();
  var hari = date.getDay();
  var jam = date.getHours();
  var menit = date.getMinutes();
  var detik = date.getSeconds();

  switch(hari) {
   case 0: hari = "Minggu"; break;
   case 1: hari = "Senin"; break;
   case 2: hari = "Selasa"; break;
   case 3: hari = "Rabu"; break;
   case 4: hari = "Kamis"; break;
   case 5: hari = "Jum'at"; break;
   case 6: hari = "Sabtu"; break;
  }
  switch(bulan) {
   case 0: bulan = "Januari"; break;
   case 1: bulan = "Februari"; break;
   case 2: bulan = "Maret"; break;
   case 3: bulan = "April"; break;
   case 4: bulan = "Mei"; break;
   case 5: bulan = "Juni"; break;
   case 6: bulan = "Juli"; break;
   case 7: bulan = "Agustus"; break;
   case 8: bulan = "September"; break;
   case 9: bulan = "Oktober"; break;
   case 10: bulan = "November"; break;
   case 11: bulan = "Desember"; break;
  }
  var tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;
  var tampilWaktu = jam + ":" + menit + ":" + detik;

  // console.log(tampilTanggal);
  // console.log(tampilWaktu);
  var date_arr = [];
  date_arr.push(tampilTanggal);
  date_arr.push(tampilWaktu);
return date_arr;
}
