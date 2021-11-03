$( document ).ready(function() {
  console.log('You are running jQuery version: ' + $.fn.jquery);
    
	    var tabel;        
          tabel = $('#dataTables').DataTable({
            "processing": true, //Feature control the processing indicator.
            "serverSide": true, //Feature control DataTables' server-side processing mode.
            "order": [], //Initial no order.
            // Load data for the table's content from an Ajax source
            "ajax": {
                "url": "listDataPangan" ,
                "type": "POST"
            },
            //Set column definition initialisation properties.
                 "columnDefs": [
            { 
                "targets": [ -1 ], //last column
                "orderable": false, //set not orderable
            },
               ],
              "responsive": true,
              "pageLength": 50,
              "language": {
                      "emptyTable":     "Tidak ada data.."
                  }
            });

    function deleteData(id)
    {
        if(confirm('Are you sure delete this data?'))
        {
            // ajax delete data to database
            
            $.ajax({
                url : "{{ base_url }}deletePangan/" + id,
                type: "POST",
                dataType: "JSON",
                success: function(data)
                {
                    window.location = "{{ base_url }}listPangan";
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    alert('Error deleting data');
                }
            });

        }
    }

    function view(no){
        $('#modal_detail').modal('show'); // show bootstrap modal when complete loaPangan
        $('.modal-title').text('Detail'); // Set title to Bootstrap modal title

        jQuery('.itemRow').remove();
        $.ajax({
            url : "{{ base_url }}dataDetailPangan",
            type: "POST",
            data:{no:no},
            dataType: "JSON",
            success: function(data)
            {   
               
                        $('#dataDetail').append($('<table width="100%" class=" itemRow table2 table-striped table-bordered table-hover"><tr><td width="100px">NIP</td><td width="150px"><input type="text" value="'+data.NIP+'" readonly></td></tr><tr><td width="100px">Anggaran</td><td width="150px"><input type="text" value="'+data.anggaranPDM+'" readonly></td></tr><tr><td width="100px">Nilai Kontrak</td><td width="150px"><input type="text" value="'+data.nilaiKontrak+'" readonly></td></tr><tr><td width="100px">Bulan</td><td width="150px"><input type="text" value="'+data.bulan+'" readonly></td></tr><tr><td width="100px">Progres Bulan Lalu</td><td width="150px"><input type="text" value="'+data.progresBulanLalu+'" readonly></td></tr><tr><td width="100px">Progres Pangan Minggu Per</td><td width="150px"><input type="text" value="'+data.progresMinggu+'" readonly></td></tr><tr><td width="100px">Total Progres</td><td width="150px"><input type="text" value="'+data.totalProgres+'" readonly></td></tr><tr><td width="100px">Konversi Pangan</td><td width="150px"><input type="text" value="'+data.konversiPangan+'" readonly></td></tr></table>'));
                       
                       
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                notif('danger', 'GAGAL! Error get data from ajax');
            }
        });
    }
});