$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);

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

  $('#add-lembaga').on('click', function(){
    window.location.href='lembaga';
  });

  loadsiaran();
  function loadsiaran(){

      $.ajax({
          type: 'post',
          dataType: 'json',
          url: 'listDataSiaran',
          data : {
                  param      : param,
           },
          success: function(result){
                  var dt = $('#listsiaran').DataTable({
                      responsive: true,
                      bDestroy: true,
                      processing: true,
                      autoWidth : true,
                      pageLength: 10,
                      lengthChange: true,
                      aaData: result,
                      aoColumns: [
                          { 'mDataProp': 'id'},
                          { 'mDataProp': 'namaBadanHukum'},
                          { 'mDataProp': 'sebutanDiUdara'},
                          { 'mDataProp': 'wilayahLayanan'},
                          { 'mDataProp': 'alamat'},
                          { 'mDataProp': 'pimpinan'},
                          { 'mDataProp': 'email'},
                          { 'mDataProp': 'frekuensi'},
                          { 'mDataProp': 'noIPP'},
                          { 'mDataProp': 'kontak'},
                          { 'mDataProp': 'koor'},
                      ],
                      order: [[0, 'ASC']],
                      aoColumnDefs:[
                          {
                              "targets": [ 5,6,7,8,9,10 ],
                              "visible": false
                          },
                          {
                              mRender: function (data, type, row){
                                  var $rowData = '';
                                      $rowData += `
                                                <div class="row">
                                                  <div class="col-md-4">
                                                    <button onclick="modaldetail('`+row.namaBadanHukum+`','`+row.pimpinan+`','`+row.alamat+`','`+row.email+`','`+row.frekuensi+`','`+row.wilayahLayanan+`','`+row.kontak+`','`+row.koor+`')" type="button" class="btn btn-block btn-success btn-sm"><i class="far fa-eye"></i></button>
                                                  </div>
                                                  <div class="col-md-4">
                                                    <button onclick="editlembaga(`+row.id+`,'`+param+`')" type="button" class="btn btn-block btn-warning btn-sm"><i class="far fa-edit"></i></button>
                                                  </div>
                                                  <div class="col-md-4">
                                                    <button type="button" class="btn btn-block btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
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
      //
	    // var tabel;
      //     tabel = $('#listsiaran').DataTable({
      //       "ajax": {
      //           "url": "listDataSiaran" ,
      //           "type": "POST",
      //           "data":{
      //             "param"        : param,
      //           }
      //       },
      //          "processing": true, //Feature control the processing indicator.
      //          "serverSide": true, //Feature control DataTables' server-side processing mode.
      //          "order": [], //Initial no order.
      //          // Load data for the table's content from an Ajax source
      //         "responsive": true,
      //         "pageLength": 10,
      //         "language": {
      //                 "emptyTable":     "Tidak ada data.."
      //             }
      //       });


            function deleteData(id)
            {
                if(confirm('Are you sure delete this data?'))
                {
                    // ajax delete data to database

                    $.ajax({
                        url : "{{ base_url }}deleteUser/" + id,
                        type: "POST",
                        dataType: "JSON",
                        success: function(data)
                        {
                            window.location = "{{ base_url }}listUser";
                        },
                        error: function (jqXHR, textStatus, errorThrown)
                        {
                            alert('Error deleting data');
                        }
                    });

                }
            }

            function view(no){
                $('#modal_detail').modal('show'); // show bootstrap modal when complete loaAirMinum
                $('.modal-title').text('Detail'); // Set title to Bootstrap modal title

                jQuery('.itemRow').remove();
                $.ajax({
                    url : "{{ base_url }}dataDetailUser",
                    type: "POST",
                    data:{no:no},
                    dataType: "JSON",
                    success: function(data)
                    {
                        var x = 1;
                        var nf = new Intl.NumberFormat();
                            for(i in data)
                            {
                                $('#dataDetail').append($('<table width="100%" class=" itemRow table2 table-striped table-bordered table-hover"><tr><td width="100px">Jiwa</td><td width="150px"><input type="text" value="'+data[i].jiwa+'" readonly></td></tr><tr><td width="100px">KK</td><td width="150px"><input type="text" value="'+data[i].kk+'" readonly></td></tr><tr><td width="100px">Rumah</td><td width="150px"><input type="text" value="'+data[i].rumah+'" readonly></td></tr><tr><td width="100px">PDAM</td><td width="150px"><input type="text" value="'+data[i].pdam+'" readonly></td></tr><tr><td width="100px">PAM Desa</td><td width="150px"><input type="text" value="'+data[i].pamDesa+'" readonly></td></tr><tr><td width="100px">Sumur Bor</td><td width="150px"><input type="text" value="'+data[i].sumurB+'" readonly></td></tr><tr><td width="100px">Sumur Terlindungi</td><td width="150px"><input type="text" value="'+data[i].sumurT+'" readonly></td></tr><tr><td width="100px">Sumur Tak Terlindungi</td><td width="150px"><input type="text" value="'+data[i].sumurTT+'" readonly></td></tr><tr><td width="100px">Mata Air Terlindungi</td><td width="150px"><input type="text" value="'+data[i].mataAirT+'" readonly></td></tr><tr><td width="100px">Mata Air Tak Terlindungi</td><td width="150px"><input type="text" value="'+data[i].mataAirTT+'" readonly></td></tr><tr><td width="100px">Sungai/Danau/Kolam</td><td width="150px"><input type="text" value="'+data[i].sungai+'" readonly></td></tr><tr><td width="100px">Air Hujan</td><td width="150px"><input type="text" value="'+data[i].airHujan+'" readonly></td></tr><tr><td width="100px">Tangki/Mobil/Grobak</td><td width="150px"><input type="text" value="'+data[i].tangki+'" readonly></td></tr><tr><td width="100px">Galon</td><td width="150px"><input type="text" value="'+data[i].galon+'" readonly></td></tr><tr><td width="100px">Lain-lain</td><td width="150px"><input type="text" value="'+data[i].lain+'" readonly></td></tr></table>'));

                                x++;
                            }
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        notif('danger', 'GAGAL! Error get data from ajax');
                    }
                });
            }

});

function modaldetail(nama, pimpinan, alamat, email, frekuensi, wilayah, kontak, koor){

    $('#modal-default').modal({
      show: true
    });

    $('.modal-title').html('<b>'+nama+'</b>');
    $('#pimpinan').val(pimpinan);
    $('#koor').val(koor);
    $('#email').val(email);
    $('#frekuensi').val(frekuensi);
    $('#alamat').val(alamat);
    $('#kontak').val(kontak);
    $('#maps').html(`<iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
      src = "https://maps.google.com/maps?q=`+koor+`&hl=es;z=14&amp;output=embed"></iframe>`
    );

}

function editlembaga(id, param){
  window.location.href='editlembaga?ids='+id+'&par='+param;
}
