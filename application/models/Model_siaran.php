<?php
class Model_siaran extends CI_Model {

    var $table = 'pangan';
    var $column = array('nama','tgl','jenisPangan'); //set column field database for datatable searchable just firstname , lastname , address are searchable
    var $column_search = array('nama','tgl','jenisPangan');
    var $order = array('id' => 'desc'); // default order

    function __construct(){
        parent::__construct();
    }


    // server side

    private function _get_datatables_query()
    {
        $kat = $this->session->userdata('kategori');
        $nama = $this->session->userdata('username');
        $id = $this->db->escape_str($nama);
        if ($kat == 'superAdmin') {
            $this->db->from('pangan');
        }else{
            $this->db->from('pangan');
            $this->db->where('created_by',$nama);
        }


        $i = 0;

        foreach ($this->column as $item) // loop column
    {
         if($_POST['search']['value']) // if datatable send POST for search
         {

            if($i===0) // first loop
            {
               $this->db->group_start(); // open bracket. query Where with OR clause better with bracket. because maybe can combine with other WHERE with AND.
               $this->db->like($item, $_POST['search']['value']);
            }
            else
            {
               $this->db->or_like($item, $_POST['search']['value']);
            }

            if(count($this->column) - 1 == $i) //last loop
               $this->db->group_end(); //close bracket
         }
         $column[$i] = $item; // set column array variable to order processing
         $i++;
    }

        if(isset($_POST['order'])) // here order processing
        {
            $this->db->order_by($column[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        }
        else if(isset($this->order))
        {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables()
    {
        $this->_get_datatables_query();
        if($_POST['length'] != -1)
        $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered()
    {
        $this->_get_datatables_query();
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }


    public function listDataSiaran($param)
    {

        $nama = $this->session->userdata('username');
        $kategori = $this->session->userdata('kategori');
        $role = $this->session->userdata('role');
        $id = $this->db->escape_str($nama);
        if ($role == '10') {
            $query = $this->db->query("select * from mperizinan where jenisLP like '%".$param."%' order by id desc")->result();
        }else if ($role == '30'){
          $query = $this->db->query("select * from mperizinan where kota = '$param' order by id desc")->result();
        }else{
            $query = $this->db->query("select * from mperizinan where kota = '$param' order by id desc")->result();
        }
        return $query;
    }


    public function save($params = NULL)
    {
        $valid = false;

            $this->db->set("nama", $params->nama);
            $this->db->set("tgl", $params->tgl);
            $this->db->set("jenisPangan", $params->jenisPangan);
            $this->db->set("created_by", $this->session->userdata('username'));
            $this->db->set("created_at", date("Y-m-d H:i:s"));
            $valid = $this->db->insert('pangan');

        return $valid;

    }

    public function update($params = NULL)
    {
        $valid = false;

            $this->db->set("nama", $params->nama);
            $this->db->set("tgl", $params->tgl);
            $this->db->set("jenisPangan", $params->jenisPangan);
            $this->db->set("updated_by", $this->session->userdata('username'));
            $this->db->set("updated_at", date("Y-m-d H:i:s"));
            $this->db->where('id', $params->id);
            $valid = $this->db->update('pangan');

        return $valid;

    }

    public function delete($id)
    {
        $ids = $this->db->escape_str($id);
        $this->db->where('id', $ids);
        $this->db->delete('pangan');
    }

    public function dataDetail($no = NULL)
    {
        $query = $this->db->query("select * from pangan where id = '".$this->db->escape_str($no)."' ")->row();

        return $query;
    }

    public function cek($kd)
    {
        $query = $this->db->query("select * FROM pangan WHERE id = '".$this->db->escape_like_str($kd)."' ");

        return $query;
    }

    public function loadsiaran($param)
    {
        $query = $this->db->query("select * from mperizinan where id = '".$param."'")->result();
        return $query;
    }

    public function loadkota($param)
    {
        $query = $this->db->query("select * from kota order by id desc")->result();
        return $query;
    }

    public function loadLP($param)
    {
        $query = $this->db->query("select * from jenis_lp order by id desc")->result();
        return $query;
    }

    public function saveLembaga($params = NULL)
    {
        $valid = true;
        // $pass = $params->password;
        // $query = $this->db->query("select password, id from muser where id = '".$params->id."' ")->row();
        //
        // if ($pass != $query->password) {
        //     $this->db->set("password", md5($params->password));
        // }
        $this->db->set("kode", $params->kode);
        $this->db->set("jenisLP", $params->jenisLP);
        $this->db->set("namaBadanHukum", $params->namaBadanHukum);
        $this->db->set("noIPP", $params->noIPP);
        $this->db->set("sebutanDiUdara", $params->sebutanDiUdara);
        $this->db->set("pimpinan", $params->pimpinan);
        $this->db->set("alamat", $params->alamat);
        $this->db->set("kota", $params->kota);
        $this->db->set("tlp", $params->tlp);
        $this->db->set("fax", $params->fax);
        $this->db->set("email", $params->email);
        $this->db->set("kontak", $params->kontak);
        $this->db->set("frekuensi", $params->frekuensi);
        $this->db->set("wilayahLayanan", $params->wilayahLayanan);
        $this->db->set("koor", $params->koor);
        $this->db->set("website", $params->website);
        $this->db->set("streaming", $params->streaming);
        $this->db->set("instagram", $params->instagram);
        $this->db->set("twitter", $params->twitter);
        $this->db->set("updated_by", $this->session->userdata('username'));
        $this->db->set("updated_at", date("Y-m-d H:i:s"));
        if($params->logo){
          $this->db->set("logo", $params->logo);
        }

        if($params->foto){
          $this->db->set("foto", $params->foto);
        }
        $valid = $this->db->insert('mperizinan');
        
        return $valid;

    }

    public function updateLembaga($params = NULL)
    {
        $valid = true;
        // $pass = $params->password;
        // $query = $this->db->query("select password, id from muser where id = '".$params->id."' ")->row();
        //
        // if ($pass != $query->password) {
        //     $this->db->set("password", md5($params->password));
        // }
        $this->db->set("kode", $params->kode);
        $this->db->set("jenisLP", $params->jenisLP);
        $this->db->set("namaBadanHukum", $params->namaBadanHukum);
        $this->db->set("noIPP", $params->noIPP);
        $this->db->set("sebutanDiUdara", $params->sebutanDiUdara);
        $this->db->set("pimpinan", $params->pimpinan);
        $this->db->set("alamat", $params->alamat);
        $this->db->set("kota", $params->kota);
        $this->db->set("tlp", $params->tlp);
        $this->db->set("fax", $params->fax);
        $this->db->set("email", $params->email);
        $this->db->set("kontak", $params->kontak);
        $this->db->set("frekuensi", $params->frekuensi);
        $this->db->set("wilayahLayanan", $params->wilayahLayanan);
        $this->db->set("koor", $params->koor);
        $this->db->set("website", $params->website);
        $this->db->set("streaming", $params->streaming);
        $this->db->set("instagram", $params->instagram);
        $this->db->set("twitter", $params->twitter);
        $this->db->set("updated_by", $this->session->userdata('username'));
        $this->db->set("updated_at", date("Y-m-d H:i:s"));
        if($params->logo){
          $this->db->set("logo", $params->logo);
        }

        if($params->foto){
          $this->db->set("foto", $params->foto);
        }
        $this->db->where('id', $params->id);
        $valid = $this->db->update('mperizinan');

        return $valid;

    }


}
