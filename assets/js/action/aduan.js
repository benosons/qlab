$( document ).ready(function() {
  $('#aduan').attr('class','menu-open nav-item');
  $('#aduan > a').attr('class','nav-link active');
  $('#new-msg-user').attr('class','nav-link active');
  $('#new-msg-user > i').attr('class','far fa-circle nav-icon text-danger');

  $('#kirim-aduan').on('click', function(){
      var name = $('#name').val();
      var email = $('#email').val();
      var notlp = $('#no-tlp').val();
      var judul = $('#judul').val();
      var isi = $('#isi-aduan').val();

      kirimlaporan(name, email, judul, isi, notlp, email);
  });

  $("#lampiran-aduan").change(function() {
    readURL(this);
  });

});

function kirimlaporan(name,email,subject,message, telepon, email){
  var lampiran = $('[name="file-lampiran"]');
  var filename = $('[name="file-name"]');
  var upload = {};
  for (var i = 0; i < lampiran.length; i++) {
    var xfile = [];
    xfile = {
              src : lampiran[i].src,
              filename : filename[i].getAttribute("filename")
            }

    upload[i] = xfile;

  }

$.ajax({
    type: 'post',
    dataType: 'json',
    url: 'saveAduan',
    data : {
            name        : name,
            email       : email,
            subject     : subject,
            message     : message,
            telepon     : telepon,
            email       : email,
            lampiran    : upload
     },
    success: function(result){
        Swal.fire({
          title: 'Sukses!',
          text: "Berhasil Kirim Pengaduan",
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
}

function readURL(input) {

  if (input.files && input.files[0]) {

    for (var i = 0; i < input.files.length; i++) {

      var reader = new FileReader();
      var size = bytesToSize(input.files[i].size);
      var type = input.files[i].type;
      var name = input.files[i].name;
      reader.onload = function(e) {

          li =
            `<li onclick="myremove(this)">
              <button type="button" class="close" aria-label="delete" style="padding-right: 5px;">
                <span aria-hidden="true" >×</span>
              </button>
            <span class="mailbox-attachment-icon has-img"><img name="file-lampiran" src="`+e.target.result+`" alt="Attachment"></span>

            <div class="mailbox-attachment-info">
            <a href="#" class="mailbox-attachment-name"><i class="fas fa-paperclip"></i><span name="file-name" filename="`+name+`"> `+name+`</span></a>
            <span class="mailbox-attachment-size clearfix mt-1">
            <span>`+size+`</span>
            </span>
            </div>
            </li>`;
        // $('#blah1').val('src', e.target.result);
        $('#attach-file').append(li);


      }
      reader.readAsDataURL(input.files[i]); // convert to base64 string
    }


  }

  function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }

}

function myremove(el){
  var element = el;
  element.remove();
}
