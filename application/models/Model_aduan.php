<?php
class Model_aduan extends CI_Model {

    var $table = 'aduan';
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


    public function listDataAduan($param)
    {
        $nama = $this->session->userdata('id');
        $kategori = $this->session->userdata('kategori');
        $kotakab = $this->session->userdata('kotaKab');
        $role = $this->session->userdata('role');
        $id = $this->db->escape_str($nama);

        if ($role == '10') {

            if($param == 0){
              $query = $this->db->query("select a.*, m.name as nama_pelapor, k.nama as nama_kota from aduan a
                                      inner join muser m on m.id = a.id_user
                                      inner join kabupaten_kota k on k.id = a.id_kota
                                      where a.status = ".$param." order by a.id desc")->result();
            }else if($param == '4'){
              $query = $this->db->query("select a.*, m.name as nama_pelapor, k.nama as nama_kota from aduan a
                                      inner join muser m on m.id = a.id_user
                                      inner join kabupaten_kota k on k.id = a.id_kota
                                      where a.status = '4' order by a.id desc")->result();
            }else{
              $query = $this->db->query("select a.*, m.name as nama_pelapor, k.nama as nama_kota from aduan a
                                      inner join muser m on m.id = a.id_user
                                      inner join kabupaten_kota k on k.id = a.id_kota
                                      where a.status in ('1','2', '3') order by a.id desc")->result();
            }
        }else if ($role == '20'){
            $query = $this->db->query("select a.*, m.name as nama_pelapor, k.nama as nama_kota from aduan a
                                      inner join muser m on m.id = a.id_user
                                      inner join kabupaten_kota k on k.id = a.id_kota
                                      where a.id_kota = ".$kotakab." order by a.id desc")->result();
        }else if ($role == '30'){
          if($param == 4){
            $query = $this->db->query("select a.*, m.name as nama_pelapor, k.nama as nama_kota from aduan a
                                      inner join muser m on m.id = a.id_user
                                      inner join kabupaten_kota k on k.id = a.id_kota
                                      where id_user = '".$id."' and a.status in ('4') order by a.id desc")->result();
          }else{
            $query = $this->db->query("select a.*, m.name as nama_pelapor, k.nama as nama_kota from aduan a
                                      inner join muser m on m.id = a.id_user
                                      inner join kabupaten_kota k on k.id = a.id_kota
                                      where id_user = '".$id."' and a.status in (".$param.", '1', '2', '3') order by a.id desc")->result();

          }
        }

        return $query;
    }

    public function listDataAduanGlobal()
    {
        $query = $this->db->query("select a.*, m.name from aduan a
                                   inner join muser m on m.id = a.id_user order by a.id desc")->result();

        return $query;
    }

    public function cekBalasan($id)
    {
      // var_dump((int)$id);die;
        $query = $this->db->query("select b.*, mu.name as nama_pelapor, ma.name as nama_admin from balasan b
                                    inner join muser mu on b.id_user = mu.id
                                    inner join muser ma on b.id_admin = ma.id
                                    where id_parent = ".$id." order by b.id asc")->result();
        return $query;
    }

    public function cekLampiran($id)
    {
      // var_dump((int)$id);die;
        $query = $this->db->query("select a.id, l.id as id_lampiran, l.filename, l.url, l.size from aduan a
                                  inner join lampiran l on l.id_aduan = a.id
                                  where a.id = ".$id)->result();
        return $query;
    }


    public function save($params = NULL)
    {
        $valid = true;
        $nama = $this->session->userdata('id');
        $kotakab = $this->session->userdata('kotaKab');
        $id = $this->db->escape_str($nama);

            $this->db->set("id_user", $id);
            $this->db->set("judul", $params->subject);
            $this->db->set("isi", $params->message);
            $this->db->set("create_date", date("Y-m-d H:i:s"));
            $this->db->set("update_date", date("Y-m-d H:i:s"));
            $this->db->set("status", '0');
            $this->db->set("id_kota", $kotakab);
            $valid = $this->db->insert('aduan');
            $insert_id = $this->db->insert_id();

        return $insert_id;

    }

    public function save_lampiran($params = NULL)
    {
        $valid = true;
        $nama = $this->session->userdata('id');
        $kotakab = $this->session->userdata('kotaKab');
        $id = $this->db->escape_str($nama);
            $this->db->set("id_aduan", $params->lastid);
            $this->db->set("url", $params->url);
            $this->db->set("size", $params->size);
            $this->db->set("filename", $params->filename);
            $this->db->set("create_date", date("Y-m-d H:i:s"));
            $this->db->set("update_date", date("Y-m-d H:i:s"));
            $valid = $this->db->insert('lampiran');
            $insert_id = $this->db->insert_id();

        return $insert_id;

    }

    public function saveBalasan($params = NULL)
    {
        $valid = true;
        $nama = $this->session->userdata('id');
        $kotakab = $this->session->userdata('kotaKab');
        $id = $this->db->escape_str($nama);

            $this->db->set("id_parent", $params->id_parent);
            $this->db->set("id_user", $params->id_user);
            $this->db->set("id_admin", $params->id_admin);
            $this->db->set("rep_admin", $params->rep_admin);
            $this->db->set("rep_user", $params->rep_user);
            $this->db->set("create_date", date("Y-m-d H:i:s"));
            $this->db->set("status", '0');
            $this->db->set("isi", $params->isi);
            $valid = $this->db->insert('balasan');

        return $valid;

    }

    public function updateAduan($params = NULL)
    {
        $valid = false;
        $nama = $this->session->userdata('id');
        $id = $this->db->escape_str($nama);
            $this->db->set("id_admin", $id);
            $this->db->set("status", $params->status);
            $this->db->set("update_date", date("Y-m-d H:i:s"));
            $this->db->where('id', $params->id_parent);
            $valid = $this->db->update('aduan');

        return $valid;

    }

    public function closeAduan($params = NULL)
    {
        $valid = true;
        $this->db->set("status", '4');
        $this->db->set("update_date", date("Y-m-d H:i:s"));
        $this->db->where('id', $params->id);
        $valid = $this->db->update('aduan');

        return $valid;

    }

    public function delete($id)
    {
        $ids = $this->db->escape_str($id);
        $this->db->where('id', $ids);
        $this->db->delete('videotutorial');
    }

    public function dataDetail($no = NULL)
    {
        $query = $this->db->query("select * from pangan where id = '".$this->db->escape_str($no)."' ")->row();

        return $query;
    }

    public function hitungStatus_user($id)
    {
        $query = array();
        $query[0] = $this->db->query("select count(*) as total from aduan where id_user = ".$id." and status = 0")->row();
        $query[1] = $this->db->query("select count(*) as total from aduan where id_user = ".$id." and status = 1")->row();
        $query[2] = null;
        $query[3] = $this->db->query("select count(*) as total from aduan where id_user = ".$id." and status = 3")->row();
        return $query;
    }

    public function hitungStatus_admin($id)
    {
        $query = array();
        $query[0] = $this->db->query("select count(*) as total from aduan where status = 0")->row();
        $query[1] = $this->db->query("select count(*) as total from aduan where id_admin = ".$id." and status = 1")->row();
        $query[2] = $this->db->query("select count(*) as total from aduan where id_admin = ".$id." and status = 2")->row();
        $query[3] = $this->db->query("select count(*) as total from aduan where id_admin = ".$id." and status = 3")->row();


        return $query;
    }


}
