<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Aduan extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function __construct()
	{
		parent::__construct();
		$this->load->model('Model_aduan');
		$this->logs = $this->session->all_userdata();
		$this->logged = $this->session->userdata('userLogged');
		$this->kategori = $this->session->userdata('kategori');
		$this->username = $this->session->userdata('username');
		$this->kotaKab = $this->session->userdata('kotaKab');
		$this->name = $this->session->userdata('name');
		$this->role = $this->session->userdata('role');
		$this->foto = $this->session->userdata('foto');
		$this->id = $this->session->userdata('id');
		$this->notelp = $this->session->userdata('notelp');
		$this->email = $this->session->userdata('email');
		$this->content = array(
			"base_url" => base_url(),
			"logs" => $this->session->all_userdata(),
			"username" => $this->username,
			"role" => $this->role,
			"name" => $this->name,
			"id" => $this->id,
			"foto" => $this->foto,
			"notelp" => $this->notelp,
			"email" => $this->email
		);

	}

	public function listaduan()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20' ){
				$this->content['status_aduan'] = $this->input->get('par');
				$this->twig->display('admin/listaduan.html', $this->content);
			}
		}else{
			redirect("Dashboard");
		}
	}

	public function new()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20' ){

				$this->twig->display('admin/aduannew.html', $this->content);

			}else if($this->role = '30'){

				$this->twig->display('admin/aduan.html', $this->content);
			}
		}else{
			redirect("Dashboard");
		}
	}

	public function reply()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20' || $this->role = '30'){

				$this->twig->display('admin/aduanreply.html', $this->content);
			}
		}else{
			redirect("Dashboard");
		}
	}

	public function close()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20' || $this->role = '30'){

				$this->twig->display('admin/aduanclose.html', $this->content);
			}
		}else{
			redirect("Dashboard");
		}
	}

	public function saveAduan()
	{
		if ( $this->logged){
			if($this->role == '30'){
				$params = (object)$this->input->post();

				$lastid = $this->Model_aduan->save($params);

				foreach ($params->lampiran as $key => $value) {
					$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $value['src']));
					$filepath = "assets/dokumen/lampiran/".$value['filename']; // or image.jpg
					chmod($filepath,0777);
					file_put_contents($filepath,$data);
					$params->url = $filepath;
					$params->lastid = $lastid;
					$params->filename = $value['filename'];
					$params->size = '0';

					$lampiran = $this->Model_aduan->save_lampiran($params);
				}


				header('Content-Type: application/json');
				echo json_encode(array("status" => TRUE));
			}
		} else {
			redirect("logout");
		}
	}

	public function hitungStatus()
	{

			if($this->role == '30'){
				$data = $this->Model_aduan->hitungStatus_user($this->session->userdata('id'));

			}else{
				$data = $this->Model_aduan->hitungStatus_admin($this->session->userdata('id'));
			}


				header('Content-Type: application/json');
				echo json_encode($data);
	}

	public function listDataAduanGlobal()	{

			$params = $columns = $totalRecords = $data = array();
			$params = $_REQUEST;
			$postData = $this->input->post('param');

			$query = $this->Model_aduan->listDataAduanGlobal($postData);
			$x = 0;
			$i=0;
			foreach ($query as $proses) {
				$x++;
				$row = array();
				$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
				$row['name'] = (!empty($proses->name) ? $proses->name : "NULL");
				$row['id_user'] = (!empty($proses->id_user) ? $proses->id_user : "NULL");
				$row['judul'] = (!empty($proses->judul) ? $proses->judul : "NULL");
				$row['isi'] = (!empty($proses->isi) ? $proses->isi : "NULL");
				$row['create_date'] = (!empty($proses->create_date) ? $proses->create_date : "NULL");

				$data[] = $row;

			}
	header('Content-Type: application/json');
	echo json_encode($data);
}

public function listDataAduan()	{
	if ($this->logged){

		$params = $columns = $totalRecords = $data = array();
		$params = $_REQUEST;
		$postData = $this->input->post('param');

		$query = $this->Model_aduan->listDataAduan($postData);
		$x = 0;
		$i=0;
		foreach ($query as $proses) {
			$x++;
			$row = array();
			$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
			$row['nama_pelapor'] = (!empty($proses->nama_pelapor) ? $proses->nama_pelapor : "NULL");
			$row['id_user'] = (!empty($proses->id_user) ? $proses->id_user : "NULL");
			$row['id_admin'] = (!empty($proses->id_admin) ? $proses->id_admin : "NULL");
			$row['judul'] = (!empty($proses->judul) ? $proses->judul : "NULL");
			$row['isi'] = (!empty($proses->isi) ? $proses->isi : "NULL");
			$row['create_date'] = (!empty($proses->create_date) ? $proses->create_date : "NULL");
			$row['nama_kota'] = (!empty($proses->nama_kota) ? $proses->nama_kota : "NULL");
			$row['status'] = (!empty($proses->status) ? $proses->status : "NULL");

			$data[] = $row;
		}
		header('Content-Type: application/json');
		echo json_encode($data);
	}
}

public function cekBalasan()	{
	if ($this->logged){

		$params = $columns = $totalRecords = $data = array();
		$params = $_REQUEST;
		$postData = $this->input->post('id');

		$query = $this->Model_aduan->cekBalasan($postData);

		$x = 0;
		$i=0;
		$data = [];
		$lampiran = [];
		foreach ($query as $proses) {
			$x++;
			$row = array();
			$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
			$row['id_parent'] = (!empty($proses->id_parent) ? $proses->id_parent : "NULL");
			$row['id_user'] = (!empty($proses->id_user) ? $proses->id_user : "NULL");
			$row['id_admin'] = (!empty($proses->id_admin) ? $proses->id_admin : "NULL");
			$row['rep_user'] = (!empty($proses->rep_user) ? $proses->rep_user : "NULL");
			$row['rep_admin'] = (!empty($proses->rep_admin) ? $proses->rep_admin : "NULL");
			$row['create_date'] = (!empty($proses->create_date) ? $proses->create_date : "NULL");
			$row['isi'] = (!empty($proses->isi) ? $proses->isi : "NULL");
			$row['nama_pelapor'] = (!empty($proses->nama_pelapor) ? $proses->nama_pelapor : "NULL");
			$row['nama_admin'] = (!empty($proses->nama_admin) ? $proses->nama_admin : "NULL");

			array_push($data, $row);

		}

		// if(!$data){
		// 	if($this->role == '10'){
		// 		$params['id_parent'] = $this->input->post('id');
		// 		$params['status'] = '3';
		// 		$update = $this->Model_aduan->updateAduan((object)$params);
		// 	}
		// }

		$query2 = $this->Model_aduan->cekLampiran($postData);
		foreach ($query2 as $key => $value) {
			$filex = array();
			$filex['id_lampiran'] = $value->id_lampira;
			$filex['filename'] = $value->filename;
			$filex['filename'] = $value->filename;
			$filex['url'] = $value->url;
			$filex['size'] = $value->size;
			array_push($lampiran, $filex);

		}

		$result = array();
		$result['data'] = $data;
		$result['lampiran'] = $lampiran;

		header('Content-Type: application/json');
		echo json_encode($result);
	}
}

public function saveBalasan()
{
	if ( $this->logged){
			$params = $this->input->post();
			if($this->session->userdata('role') == '10'){
				$params['id_admin'] = $this->session->userdata('id');
				$params['rep_admin'] = '1';
				$params['rep_user'] = '0';
			}else if ($this->session->userdata('role') == '30'){
				$params['id_user'] = $this->session->userdata('id');
				$params['rep_admin'] = '0';
				$params['rep_user'] = '1';
			}

			$data = $this->Model_aduan->saveBalasan((object)$params);
			if($data){
				if($this->role == 30){
					$params['status'] = '2';
				}else{
					$params['status'] = '1';
				}
				$update = $this->Model_aduan->updateAduan((object)$params);
			}
			header('Content-Type: application/json');
			echo json_encode(array("status" => TRUE));
	} else {
		redirect("logout");
	}
}

public function closeAduan(){
	$params = $this->input->post();
	$update = $this->Model_aduan->closeAduan((object)$params);
	header('Content-Type: application/json');
	echo json_encode(array("status" => TRUE));
}

}
