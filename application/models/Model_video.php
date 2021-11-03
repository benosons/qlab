<?php
class Model_video extends CI_Model {

    var $table = 'videotutorial';
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


    public function listDataVideo()
    {
        $nama = $this->session->userdata('id');
        $kategori = $this->session->userdata('kategori');
        $role = $this->session->userdata('role');
        $id = $this->db->escape_str($nama);
        if ($role == '10') {
            $query = $this->db->query("select * from videotutorial order by id desc")->result();
        }else if ($role == '20'){
            $query = $this->db->query("select * from videotutorial where create_by = '".$id."' order by id desc")->result();
        }else{
            $query = $this->db->query("select * from videotutorial order by id desc")->result();
        }

        return $query;
    }


    public function save($params = NULL)
    {
        $valid = false;
            $this->db->set("judul", $params->judul);
            $this->db->set("desc", $params->desc);
            $this->db->set("url", $params->url);
            $this->db->set("create_by", $this->session->userdata('id'));
            $this->db->set("create_date", date("Y-m-d H:i:s"));
            $this->db->set("update_date", date("Y-m-d H:i:s"));
            $valid = $this->db->insert('videotutorial');

        return $valid;

    }

    public function update($params = NULL)
    {
        $valid = false;

            $this->db->set("judul", $params->judul);
            $this->db->set("url", $params->url);
            $this->db->set("desc", $params->desc);
            $this->db->set("create_by", $this->session->userdata('id'));
            $this->db->set("update_date", date("Y-m-d H:i:s"));
            $this->db->where('id', $params->id);
            $valid = $this->db->update('videotutorial');

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

    public function cek($kd)
    {
        $query = $this->db->query("select * FROM pangan WHERE id = '".$this->db->escape_like_str($kd)."' ");

        return $query;
    }


}
