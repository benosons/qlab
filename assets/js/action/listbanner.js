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
  $('.imageBox').bind("mousewheel", function() {
      return false;
  });

  $('.bootstrap-switch-handle-on').html('Aktif');
  $('.bootstrap-switch-handle-off').html('Tidak');

  $('#setting').attr('class','menu-open nav-item');
  $('#setting > a').attr('class','nav-link active');
  $('#data-info').attr('class','nav-link active');
  $('#data-info > i').attr('class','far fa-circle nav-icon text-danger');

  $('#add-banner').on('click', function(){
    $('#modal-default').modal({
      show: true
    });
    $('#id').val('');
    $('.modal-title').html('Tambah Banner');
    $("#stat").bootstrapSwitch('state', true);
    $("[name='banner-input']").val('');
    $('#blah').attr('src', 'assets/dokumen/gambar/user/default.jpg');
    // $('label[for="foto-user"]').text('Pilih Foto');
    $('label[for="file"]').text('Pilih Foto');
    $('.cropped').empty();
    $('.imageBox').removeAttr('style');
    window.img = '';
  });

  $('#save-banner').on('click', function(){
    $(this).attr('disabled');
      savebanner();
  });

  loadbanner();
  loadsetting();

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

  $("#simpan-perubahan").on('click', function(){
    rubahsetting();
  });

  /**
 * Created by ezgoing on 14/9/2014.
 */
'use strict';
var cropbox = function(options){
    var el = document.querySelector(options.imageBox),
    obj =
    {
        state : {},
        ratio : 1,
        options : options,
        imageBox : el,
        thumbBox : el.querySelector(options.thumbBox),
        spinner : el.querySelector(options.spinner),
        image : new Image(),
        getDataURL: function ()
        {
            var width = this.thumbBox.clientWidth,
                height = this.thumbBox.clientHeight,
                canvas = document.createElement("canvas"),
                dim = el.style.backgroundPosition.split(' '),
                size = el.style.backgroundSize.split(' '),
                dx = parseInt(dim[0]) - el.clientWidth/2 + width/2,
                dy = parseInt(dim[1]) - el.clientHeight/2 + height/2,
                dw = parseInt(size[0]),
                dh = parseInt(size[1]),
                sh = parseInt(this.image.height),
                sw = parseInt(this.image.width);

            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext("2d");
            context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
            var imageData = canvas.toDataURL('image/png');
            return imageData;
        },
        getBlob: function()
        {
            var imageData = this.getDataURL();
            var b64 = imageData.replace('data:image/png;base64,','');
            var binary = atob(b64);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return  new Blob([new Uint8Array(array)], {type: 'image/png'});
        },
        zoomIn: function ()
        {
            this.ratio*=1.1;
            setBackground();
        },
        zoomOut: function ()
        {
            this.ratio*=0.9;
            setBackground();
        }
    },
    attachEvent = function(node, event, cb)
    {
        if (node.attachEvent)
            node.attachEvent('on'+event, cb);
        else if (node.addEventListener)
            node.addEventListener(event, cb);
    },
    detachEvent = function(node, event, cb)
    {
        if(node.detachEvent) {
            node.detachEvent('on'+event, cb);
        }
        else if(node.removeEventListener) {
            node.removeEventListener(event, render);
        }
    },
    stopEvent = function (e) {
        if(window.event) e.cancelBubble = true;
        else e.stopImmediatePropagation();
    },
    setBackground = function()
    {
        var w =  parseInt(obj.image.width)*obj.ratio;
        var h =  parseInt(obj.image.height)*obj.ratio;

        var pw = (el.clientWidth - w) / 2;
        var ph = (el.clientHeight - h) / 2;

        el.setAttribute('style',
                'background-image: url(' + obj.image.src + '); ' +
                'background-size: ' + w +'px ' + h + 'px; ' +
                'background-position: ' + pw + 'px ' + ph + 'px; ' +
                'background-repeat: no-repeat');
    },
    imgMouseDown = function(e)
    {
        stopEvent(e);

        obj.state.dragable = true;
        obj.state.mouseX = e.clientX;
        obj.state.mouseY = e.clientY;
    },
    imgMouseMove = function(e)
    {
        stopEvent(e);

        if (obj.state.dragable)
        {
            var x = e.clientX - obj.state.mouseX;
            var y = e.clientY - obj.state.mouseY;

            var bg = el.style.backgroundPosition.split(' ');

            var bgX = x + parseInt(bg[0]);
            var bgY = y + parseInt(bg[1]);

            el.style.backgroundPosition = bgX +'px ' + bgY + 'px';

            obj.state.mouseX = e.clientX;
            obj.state.mouseY = e.clientY;
        }
    },
    imgMouseUp = function(e)
    {
        stopEvent(e);
        obj.state.dragable = false;
    },
    zoomImage = function(e)
    {
        var evt=window.event || e;
        var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
        delta > -120 ? obj.ratio*=1.1 : obj.ratio*=0.9;
        setBackground();
    }

    obj.spinner.style.display = 'block';
    obj.image.onload = function() {
        obj.spinner.style.display = 'none';
        setBackground();

        attachEvent(el, 'mousedown', imgMouseDown);
        attachEvent(el, 'mousemove', imgMouseMove);
        attachEvent(document.body, 'mouseup', imgMouseUp);
        var mousewheel = (/Firefox/i.test(navigator.userAgent))? 'DOMMouseScroll' : 'mousewheel';
        attachEvent(el, mousewheel, zoomImage);
    };
    obj.image.src = options.imgSrc;
    attachEvent(el, 'DOMNodeRemoved', function(){detachEvent(document.body, 'DOMNodeRemoved', imgMouseUp)});

    return obj;
};


    var options =
    {
        imageBox: '.imageBox',
        thumbBox: '.thumbBox',
        spinner: '.spinner',
        imgSrc: 'avatar.png'
    }
    var cropper;
    document.querySelector('#file').addEventListener('change', function(){
        var reader = new FileReader();
        reader.onload = function(e) {
            options.imgSrc = e.target.result;
            cropper = new cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        this.files = [];
    })
    document.querySelector('#btnCrop').addEventListener('click', function(){
        var img = cropper.getDataURL()
        window.img = img;
        $('.cropped').empty();
        document.querySelector('.cropped').innerHTML += '<img style="border:1px solid" name="cropped" src="'+img+'">';
        $('#save-banner').removeAttr('disabled');
    })
    document.querySelector('#btnZoomIn').addEventListener('click', function(){
        cropper.zoomIn();
    })
    document.querySelector('#btnZoomOut').addEventListener('click', function(){
        cropper.zoomOut();
    })

});

    function loadbanner(){

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'listdatabanner',
            data : {
                    param      : '',
             },
            success: function(result){
                    var dt = $('#listbanner').DataTable({
                        responsive: true,
                        bDestroy: true,
                        processing: true,
                        autoWidth : false,
                        pageLength: 10,
                        lengthChange: true,
                        aaData: result,
                        aoColumns: [
                            { 'mDataProp': 'id'},
                            { 'mDataProp': 'foto'},
                            { 'mDataProp': 'judul'},
                            { 'mDataProp': 'deskripsi'},
                            { 'mDataProp': 'status'},
                            { 'mDataProp': 'status'},
                            // { 'mDataProp': 'role'},
                        ],
                        order: [[0, 'ASC']],
                        aoColumnDefs:[
                            { "width": "30%", "targets": 3 },
                            { "width": "20%", "targets": 2 },
                            { "width": "10%", "targets": 2 },
                            {
                                mRender: function (data, type, row){
                                    var $rowData = '';
                                        $rowData += `
                                                  <div class="row">
                                                    <div class="col-md-4">
                                                      <button onclick="editbanner(`+row.id+`,'`+row.judul+`','`+row.deskripsi+`','`+row.status+`','`+row.foto+`')" type="button" class="btn btn-block btn-warning btn-sm"><i class="far fa-edit"></i></button>
                                                    </div>
                                                    <div class="col-md-4">
                                                      <button onclick="deleteData(`+row.id+`,'`+row.foto+`')" type="button" class="btn btn-block btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                                                    </div>
                                                  </div>
                                                    `;

                                    return $rowData;
                                },
                                aTargets: [5]
                            },
                            {
                                mRender: function (data, type, row){
                                  var $rowData = '';
                                  if(row.status == 1){
                                        $rowData +=`<span class="badge badge-primary right">Aktif</span>`;
                                      }else{
                                        $rowData +=`<span class="badge badge-default right">Tidak</span>`;
                                      }

                                    return $rowData;
                                },
                                aTargets: [4]
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

    function loadsetting(){
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: 'loadsetting',
            data : {
                    param      : '',
             },
            success: function(result){
              $('#set-id').val(result[0].id);
              $('#set-nama').val(result[0].nama);
              $('#set-deskripsi').val(result[0].deskripsi);
              $('#set-alamat').val(result[0].alamat);
              $('#set-email').val(result[0].email);
              $('#set-notelp').val(result[0].notlp);
              $('#set-ig').val(result[0].instagram);
              $('#set-twit').val(result[0].twitter);
              $('#set-fb').val(result[0].facebook);

            }
          });
        }

    function savebanner(){
      var img = window.img;
        if($('#id').val()){
          var url = 'updatebanner';
          var msg = 'Update';
        }else{
          var url = 'savebanner';
          var msg = 'Tambah';
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data : {
                    id            : $('#id').val(),
                    judul         : $('#judul').val(),
                    deskripsi     : $('#deskripsi').val(),
                    status        : ($("#stat").bootstrapSwitch('state') === true ? '1' : '0'),
                    img           : img,
             },
            success: function(result){
              Swal.fire({
                title: 'Sukses!',
                text: msg + ' Banner',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });

              $('#modal-default').modal('hide');
              loadbanner();
            }
          });
        };

function editbanner(id, judul, deskripsi, status, foto){
  $('#add-banner').trigger('click');
  $('.modal-title').html('Edit Banner');
  $('#id').val(id);
  $('#judul').val(judul);
  $('#deskripsi').val(deskripsi);
  let fot = foto.split("/");
  $('label[for="foto-user"]').text(fot[fot.length - 1]);
  $('#blah').attr('src', foto);
  $("#stat").bootstrapSwitch('state', status == '1' ? true : false);

}

function deleteData(id,path)
{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Anda Yakin, hapus Banner?',
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
      url: 'deletebanner',
      data : {
              id    : id,
              path : path
            },
      success: function(data)
      {
        Swal.fire({
          title: 'Sukses!',
          text: 'Hapus Banner',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        loadbanner();
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

    function rubahsetting(){
      $.ajax({
          type: 'post',
          dataType: 'json',
          url: 'simpansetting',
          data : {
                  id : $('#set-id').val(),
                  nama : $('#set-nama').val(),
                  deskripsi : $('#set-deskripsi').val(),
                  alamat : $('#set-alamat').val(),
                  email : $('#set-email').val(),
                  notlp : $('#set-notelp').val(),
                  ig : $('#set-ig').val(),
                  twit : $('#set-twit').val(),
                  fb : $('#set-fb').val()
           },
          success: function(result){
            Swal.fire({
              title: 'Sukses!',
              text: 'Informasi diperbaharui',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            });

            setTimeout(function(){ window.location.href = $('#baseurl').val()+"infodata"; }, 2500);

          }
    });
  };
