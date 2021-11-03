$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);
  $('.select2').select2();
  loadsiaran(0);
  loadvideo();
  // loadaduan();
  loadkota();
  loadbanner();
  loadsetting();

  $('#kirim-laporan').on('click', function(){
    var name = $('#name').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var message = $('#message').val();
    kirimlaporan(name,email,subject,message)
  });

  $('#logout-btn').on('click', function(){
    localStorage.clear();
  });

  if($('#user_id').val()){
    var isuser = localStorage.getItem('isuser');
    if (isuser == null) {
      localStorage.setItem('isuser', 1);
        Swal.fire({
          icon  : 'success',
          title : 'Login Berhasil',
          text  : 'Selamat Datang',
          confirmButtonText: '<i class="fas fa-check"></i>'
        }).then((result) => {
          if (result.isConfirmed) {
            // localStorage.setItem('isuser', null);
          }
        });
      }
    }

    $('#kota_front').on('change', function(){
      loadsiaran(this.value);
    });

});

function kirimlaporan(name,email,subject,message){
$.ajax({
    type: 'post',
    dataType: 'json',
    url: 'saveAduan',
    data : {
            name      : name,
            email      : email,
            subject      : subject,
            message      : message,
     },
    success: function(result){

      window.location.href = $('#baseurl').val()+"dashboard";

    }
  });
}

function loadsiaran(param){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'listDataSiaran',
        data : {
                param      : param,
         },
        success: function(result){
                var dt = $('#data-siaran').DataTable({
                    "bDestroy": true,
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": false,
                    "autoWidth": false,
                    "responsive": true,
                    "pageLength": 5,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "autoWidth": true,
                    aaData: result,
                    aoColumns: [
                        { 'mDataProp': 'id'},
                        { 'mDataProp': 'logo'},
                        { 'mDataProp': 'sebutanDiUdara'},
                        { 'mDataProp': 'website'},
                        { 'mDataProp': 'website'},
                        { 'mDataProp': 'alamat'},
                        { 'mDataProp': 'alamat'},

                    ],
                    order: [[0, 'ASC']],
                    aoColumnDefs:[
                      {
                          "mRender": function ( data, type, row ) {
                            var el =
                            `<div class="media-left">
    														<div class=""><b class="text-default text-semibold">`+row.sebutanDiUdara+`</b></div>
    														<div class="text-muted text-size-small">
    															<span class="status-mark border-blue position-left"></span>
    															`+row.frekuensi+`
    														</div>
    													</div>`;
                              return el;
                          },
                          "aTargets": [ 2 ]
                      },
                      {
                          "mRender": function ( data, type, row ) {
                            var el = '<b>-</b>';
                            if(row.website){
                                el = `<a href="`+row.website+`" target="_blank">`+row.website+`</a>`;
                            }
                              return el;
                          },
                          "aTargets": [ 4 ]
                      },
                      {
                          "mRender": function ( data, type, row ) {
                            var el =
                            `<div class="media-left media-middle">
  														<a href="#!"><img src="`+row.logo+`" class="img-circle img-xs" alt=""></a>
  													</div>`;
                              return el;
                          },
                          "aTargets": [ 1 ]
                      },
                      {
                          "mRender": function ( data, type, row ) {

                            var myJSON = JSON.stringify(row);
                            var el =
                            `<button onclick='lihatdetail(`+myJSON+`)' type="button" class="btn btn-block btn-outline-info btn-xs">Lihat</button>`;
                              return el;
                          },
                          "aTargets": [ 6 ]
                      },
                      {
                          "mRender": function ( data, type, row ) {
                            var tw = '', ig = '';
                            if(row.twitter){
                              tw = row.twitter.replace("@", "");
                            }

                            if(row.instagram){
                              ig = row.instagram.replace("@", "");

                            }

                            var el =
                            `<div class="row">
                              <div class="col-md-3">
                                <a target="_blank" href="https://twitter.com/`+tw+`"><img class="sosmed" src="assets/img/logo/tw.png"></img></a>
                              </div>

                              <div class="col-md-3">
                                <a target="_blank" href="https://www.instagram.com/`+ig+`"><img class="sosmed" src="assets/img/logo/ig.png"></img></a>
                              </div>

                            </div>`
                            ;
                              return el;
                          },
                          "aTargets": [ 3 ]
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

function loadaduan(){

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'listDataAduanGlobal',
        data : {
                param      : 'all',
         },
        success: function(result){

                var dt = $('#data-aduan').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": false,
                    "autoWidth": false,
                    "responsive": true,
                    "pageLength": 3,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "autoWidth": true,
                    aaData: result,
                    aoColumns: [
                        { 'mDataProp': 'id'},
                        { 'mDataProp': 'id_user'},

                    ],
                    order: [[0, 'ASC']],
                    aoColumnDefs:[
                      {
                          "mRender": function ( data, type, row ) {
                            var el =
                            `<div class="direct-chat-msg">
                                <div class="direct-chat-infos clearfix">
                                  <span class="direct-chat-name float-left">`+row.name+`</span>
                                  <span class="direct-chat-timestamp float-right">`+row.create_date+`</span>
                                </div>
                                <!-- /.direct-chat-infos -->
                                <img class="direct-chat-img" src="assets/lte/dist/img/user1-128x128.jpg" alt="message user image">
                                <!-- /.direct-chat-img -->
                                <div class="direct-chat-text">
                                  `+row.isi+`
                                </div>
                                <!-- /.direct-chat-text -->
                              </div>`;
                              return el;
                          },
                          "aTargets": [ 1 ]
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

var current_page = 1;
var records_per_page = 6;
var data = [];

var objJson = [
    { adName: "AdName 1"},
    { adName: "AdName 2"},
    { adName: "AdName 3"},
    { adName: "AdName 4"},
    { adName: "AdName 5"},
    { adName: "AdName 6"},
    { adName: "AdName 7"},
    { adName: "AdName 8"},
    { adName: "AdName 9"},
    { adName: "AdName 10"},
]; // Can be obtained from another source, such as your objJson variable

function loadvideo(){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'listDataVideo',
        data : {
                param      : 'all',
         },
        success: function(result){
          data = result;
          changePage(1);
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
            "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
          ];

          var content = '';
          // for (var i = 0; i < result.length; i++) {
          //   var url = result[i].url.split("?v=")[1];
          //   const d = new Date(result[i].update_date);
          //   content +=
          //   `<div class="col-md-4">
          //     <div class="blog-grid">
          //       <div class="blog-img">
          //         <div class="date">
          //         <span>`+d.getDate()+`</span>
          //         <label>`+monthNames[d.getMonth()]+`</label>
          //         </div>
          //         <a href="#">
          //         <iframe class="tutor" src="//www.youtube.com/embed/`+url+`"></iframe>
          //         </a>
          //         </div>
          //         <div class="blog-info">
          //         <h5><a href="#">`+result[i].judul+`</a></h5>
          //         <p>`+result[i].desc+`.</p>
          //         <div class="btn-bar">
          //         <a href="`+result[i].url+`" class="px-btn-arrow" target="_blank">
          //         <span>Tonton Video</span>
          //         <i class="arrow"></i>
          //         </a>
          //         </div>
          //       </div>
          //     </div>
          //   </div>`;
          // }
          content +=
          `<div class="col-12">
              <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                      <a class="page-link" href="javascript:prevPage()" id="btn_prev"><i class="fas fa-chevron-left"></i></a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1 <span class="sr-only">(current)</span></a></li>
                  <li class="page-item">
                      <a class="page-link" href="#">2</a>
                  </li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                      <a class="page-link" href="javascript:nextPage()" id="btn_next" ><i class="fas fa-chevron-right"></i></a>
                  </li>
              </ul>
          </div>`;



          // $('#video-grid').append(content);

        }
      });
    };

    function changePage(page)
    {

    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    // var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    // listing_table.innerHTML = "";

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    var content = "";
    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < data.length; i++) {
        var url = data[i].url.split("?v=")[1];
        const d = new Date(data[i].update_date);
        var part = data[i].url.substring(
          data[i].url.lastIndexOf("?v=") + 3,
          data[i].url.lastIndexOf("&")
        );
        content +=
          `<div class="col-md-4">
            <div class="blog-grid">
              <div class="blog-img">
                <div class="date">
                <span>`+d.getDate()+`</span>
                <label>`+monthNames[d.getMonth()]+`</label>
                </div>
                <a href="#">
                <iframe class="tutor" src="https://www.youtube.com/embed/`+part+`"></iframe>
                </a>
                </div>
                <div class="blog-info">
                <h5><a href="#">`+data[i].judul+`</a></h5>
                <p>`+data[i].desc+`.</p>
                <div class="btn-bar">
                <a href="`+data[i].url+`" class="px-btn-arrow" target="_blank">
                <span>Tonton Video</span>
                <i class="arrow"></i>
                </a>
                </div>
              </div>
            </div>
          </div>`;
    }
    page_span.innerHTML = page;
    $('#video-grid').html(content);

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
  }

    function prevPage()
    {
        if (current_page > 1) {
            current_page--;
            changePage(current_page);
        }
    }

    function nextPage()
    {

        if (current_page < numPages()) {

            current_page++;
            changePage(current_page);
        }
    }

    function numPages()
    {
        return Math.ceil(data.length / records_per_page);
    }

function loadkota(){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'loadkota_lembaga',
        data : {
            param: 'a'
         },
        success: function(result){
          $('#kota_front').empty();
          var option ='<option value="0">-Pilih-</option>';
          for (var i = 0; i < result.length; i++) {
            option += '<option value="'+result[i].name+'">'+result[i].desc+'</option>';
          }
          $('#kota_front').append(option);

        }
      });
    }

    function loadbanner(){
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'listdatabanneruser',
            data : {
                    param      : '',
             },
            success: function(result){
              console.log(result)
              var banner = '';
              for (var i = 0; i < result.length; i++) {
                banner +=
                  `<div class="carousel-item" style="background-image: url('`+result[i].foto+`');">
                    <div class="carousel-container">
                      <div class="carousel-content container">
                        <h2 class="animate__animated animate__fadeInDown">`+result[i].judul+`</h2>
                        <p class="animate__animated animate__fadeInUp">`+result[i].deskripsi+`</p>
                        <a href="#about" class="btn-get-started animate__animated animate__fadeInUp scrollto">Read More</a>
                      </div>
                    </div>
                  </div>`;
              }

              $('#banner').append(banner);
              $('#banner > .carousel-item:first').addClass('active');

            }
          });
        }

    function loadsetting(){
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'loadsetting',
            data : {
                    param      : '',
             },
            success: function(result){
              console.log(result);
              $('[name="set-alamat"]').html(result[0].alamat);
              $('[name="set-email"]').html(result[0].email);
              $('[name="set-notelp"]').html(result[0].notlp);
              $('[name="set-twitter"]').attr('href', 'https://twitter.com/'+result[0].twitter);
              $('[name="set-instagram"]').attr('href', 'https://instagram.com/'+result[0].instagram.replace('@', ''));
              $('[name="set-facebook"]').attr('href', 'https://facebook.com/'+result[0].facebook);

            }
          });
        }

        function lihatdetail(row){

          $('#modal-default').modal({
            show: true
          });

          $('#pimpinan').val(row.pimpinan);
          $('#email').val(row.email);
          $('#frekuensi').val(row.frekuensi);
          $('#koor').val(row.koor);
          $('#alamat').val(row.alamat);
          $('#kontak').val(row.kontak);
          $('#maps').html(`<iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
            src = "https://maps.google.com/maps?q=`+row.koor+`&hl=es;z=14&amp;output=embed"></iframe>`
          );


        }
