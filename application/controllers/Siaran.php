<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Siaran extends CI_Controller {

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
		$this->load->model('Model_siaran');
		$this->logs = $this->session->all_userdata();
		$this->logged = $this->session->userdata('userLogged');
		$this->kategori = $this->session->userdata('kategori');
		$this->username = $this->session->userdata('username');
		$this->role = $this->session->userdata('role');
		$this->kotaKab = $this->session->userdata('kotaKab');
		$this->name = $this->session->userdata('name');
		$this->foto = $this->session->userdata('foto');
		$this->content = array(
			"base_url" => base_url(),
			"logs" => $this->session->all_userdata(),
			"username" => $this->username,
			"role" => $this->role,
			"name" => $this->name,
			"foto" => $this->foto
		);

	}

	public function lembaga()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){
				$this->content['lembaga_id'] = $this->input->get('ids');
				$this->content['lembaga_type'] = $this->input->get('par');
				$this->twig->display('admin/newlembaga.html', $this->content);

			}
		}else{
			redirect("dashboard");
		}
	}

	public function editlembaga()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){
				$this->content['lembaga_id'] = $this->input->get('ids');
				$this->content['lembaga_type'] = $this->input->get('par');
				$this->twig->display('admin/editlembaga.html', $this->content);

			}
		}else{
			redirect("dashboard");
		}
	}

	public function listtelevisi()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){
				$this->twig->display('admin/listtelevisi.html', $this->content);

			}
		}else{
			redirect("dashboard");
		}
	}

	public function listradio()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){

				$this->twig->display('admin/listradio.html', $this->content);
			}
		}else{
			redirect("dashboard");
		}
	}


	public function listDataSiaran()
	{


		if ($this->logged){
			if($this->role == '10' || $this->role == '20' || $this->role == '30'){
				$params = $columns = $totalRecords = $data = array();
				$params = $_REQUEST;
				$postData = $this->input->post('param');

				$query = $this->Model_siaran->listDataSiaran($postData);
				$x = 0;
				$i=0;
				foreach ($query as $proses) {
					$x++;
					$row = array();
					$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
					$row['namaBadanHukum'] = (!empty($proses->namaBadanHukum) ? $proses->namaBadanHukum : "NULL");
					$row['noIPP'] = (!empty($proses->noIPP) ? $proses->noIPP : "NULL");
					$row['sebutanDiUdara'] = (!empty($proses->sebutanDiUdara) ? $proses->sebutanDiUdara : "NULL");
					$row['pimpinan'] = (!empty($proses->pimpinan) ? $proses->pimpinan : "NULL");
					$row['alamat'] = (!empty($proses->alamat) ? $proses->alamat : "NULL");
					$row['email'] = (!empty($proses->email) ? $proses->email : "NULL");
					$row['frekuensi'] = (!empty($proses->frekuensi) ? $proses->frekuensi : "NULL");
					$row['wilayahLayanan'] = (!empty($proses->wilayahLayanan) ? $proses->wilayahLayanan : "NULL");
					$row['kontak'] = (!empty($proses->kontak) ? $proses->kontak : "NULL");
					$row['koor'] = (!empty($proses->koor) ? $proses->koor : "NULL");
					$row['logo'] = (!empty($proses->logo) ? $proses->logo : "assets/dokumen/user/default.jpg");
					$row['twitter'] = (!empty($proses->twitter) ? $proses->twitter : "NULL");
					$row['instagram'] = (!empty($proses->instagram) ? $proses->instagram : "NULL");
					$row['website'] = (!empty($proses->website) ? $proses->website : "NULL");
					$row['streaming'] = (!empty($proses->streaming) ? $proses->streaming : "NULL");

					$data[] = $row;
				}

				header('Content-Type: application/json');
				echo json_encode($data);
			}
		}else{
			$params = $columns = $totalRecords = $data = array();
			$params = $_REQUEST;
			$postData = $this->input->post('param');

			$query = $this->Model_siaran->listDataSiaran($postData);
			$x = 0;
			$i=0;
			foreach ($query as $proses) {
				$x++;
				$row = array();
				$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
				$row['sebutanDiUdara'] = (!empty($proses->sebutanDiUdara) ? $proses->sebutanDiUdara : "NULL");
				$row['pimpinan'] = (!empty($proses->pimpinan) ? $proses->pimpinan : "NULL");
				$row['alamat'] = (!empty($proses->alamat) ? $proses->alamat : "NULL");
				$row['email'] = (!empty($proses->email) ? $proses->email : "NULL");
				$row['frekuensi'] = (!empty($proses->frekuensi) ? $proses->frekuensi : "NULL");
				$row['wilayahLayanan'] = (!empty($proses->wilayahLayanan) ? $proses->wilayahLayanan : "NULL");
				$row['kontak'] = (!empty($proses->kontak) ? $proses->kontak : "NULL");
				$row['koor'] = (!empty($proses->koor) ? $proses->koor : "NULL");
				$row['logo'] = (!empty($proses->logo) ? $proses->logo : "assets/dokumen/user/default.jpg");
				$row['twitter'] = (!empty($proses->logo) ? $proses->twitter : "NULL");
				$row['instagram'] = (!empty($proses->logo) ? $proses->instagram : "NULL");
				$row['website'] = (!empty($proses->logo) ? $proses->website : "NULL");
				$row['streaming'] = (!empty($proses->streaming) ? $proses->streaming : "NULL");

				$data[] = $row;
			}


			header('Content-Type: application/json');
			echo json_encode($data);
		}
	}

	public function loadsiaran()
	{
		$params = $columns = $totalRecords = $data = array();
		$params = $_REQUEST;
		$postData = $this->input->post('id');
		$query = $this->Model_siaran->loadsiaran($postData);

		$x = 0;
		$i=0;
		foreach ($query as $proses) {
			$x++;
			$row = array();
			$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
			$row['kode'] = (!empty($proses->kode) ? $proses->kode : "NULL");
			$row['jenisLP'] = (!empty($proses->jenisLP) ? $proses->jenisLP : "NULL");
			$row['namaBadanHukum'] = (!empty($proses->namaBadanHukum) ? $proses->namaBadanHukum : "NULL");
			$row['noIPP'] = (!empty($proses->noIPP) ? $proses->noIPP : "NULL");
			$row['sebutanDiUdara'] = (!empty($proses->sebutanDiUdara) ? $proses->sebutanDiUdara : "NULL");
			$row['pimpinan'] = (!empty($proses->pimpinan) ? $proses->pimpinan : "NULL");
			$row['alamat'] = (!empty($proses->alamat) ? $proses->alamat : "NULL");
			$row['kota'] = (!empty($proses->kota) ? $proses->kota : "NULL");
			$row['tlp'] = (!empty($proses->tlp) ? $proses->tlp : "NULL");
			$row['fax'] = (!empty($proses->fax) ? $proses->fax : "NULL");
			$row['email'] = (!empty($proses->email) ? $proses->email : "NULL");
			$row['frekuensi'] = (!empty($proses->frekuensi) ? $proses->frekuensi : "NULL");
			$row['wilayahLayanan'] = (!empty($proses->wilayahLayanan) ? $proses->wilayahLayanan : "NULL");
			$row['kontak'] = (!empty($proses->kontak) ? $proses->kontak : "NULL");
			$row['koor'] = (!empty($proses->koor) ? $proses->koor : "NULL");
			$row['logo'] = (!empty($proses->logo) ? $proses->logo : "assets/dokumen/gambar/user/default.jpg");
			$row['foto'] = (!empty($proses->foto) ? $proses->foto : "assets/dokumen/gambar/user/default.jpg");
			$row['website'] = (!empty($proses->website) ? $proses->website : "NULL");
			$row['streaming'] = (!empty($proses->streaming) ? $proses->streaming : "NULL");
			$row['instagram'] = (!empty($proses->instagram) ? $proses->instagram : "NULL");
			$row['twitter'] = (!empty($proses->twitter) ? $proses->twitter : "NULL");

			$data[] = $row;
		}
		header('Content-Type: application/json');
		echo json_encode($data);
	}

	public function loadkota_lembaga(){

			$params = $columns = $totalRecords = $data = array();
			$params = $_REQUEST;
			$postData = $this->input->post('param');

			$query = $this->Model_siaran->loadkota($postData);
			$x = 0;
			$i=0;
			foreach ($query as $proses) {
				$x++;
				$row = array();
				$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
				$row['name'] = (!empty($proses->name) ? $proses->name : "NULL");
				$row['desc'] = (!empty($proses->desc) ? $proses->desc : "NULL");

				$data[] = $row;
			}
			header('Content-Type: application/json');
			echo json_encode($data);
	}

	public function loadLP(){

			$params = $columns = $totalRecords = $data = array();
			$params = $_REQUEST;
			$postData = $this->input->post('param');

			$query = $this->Model_siaran->loadLP($postData);
			$x = 0;
			$i=0;
			foreach ($query as $proses) {
				$x++;
				$row = array();
				$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
				$row['name'] = (!empty($proses->name) ? $proses->name : "NULL");

				$data[] = $row;
			}
			header('Content-Type: application/json');
			echo json_encode($data);
	}

	public function saveLembaga()
	{
		$params = (object)$this->input->post();
		// remove the part that we don't need from the provided image and decode it
		if($params->logo){

			switch ($params->type_logo) {
				case 'image/png':
					$ext = 'png';
					break;
				case 'image/jpeg':
					$ext = 'jpg';
					break;
			}

			$data_logo = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $params->logo));
			$filepath = "assets/dokumen/gambar/lembaga/logo/".$params->id.".".$ext; // or image.jpg
			chmod($filepath,0777);
			file_put_contents($filepath,$data_logo);
			$params->logo = $filepath;
		}

		if($params->foto){

			switch ($params->type_foto) {
				case 'image/png':
					$ext = 'png';
					break;
				case 'image/jpeg':
					$ext = 'jpg';
					break;
			}
			$data_foto = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $params->foto));
			$filepath = "assets/dokumen/gambar/lembaga/foto/".$params->id.".".$ext; // or image.jpg
			chmod($filepath,0777);
			file_put_contents($filepath,$data_foto);
			$params->foto = $filepath;
		}

		$data = $this->Model_siaran->saveLembaga($params);
		header('Content-Type: application/json');
		echo json_encode(array("status" => TRUE));

	}

	public function updateLembaga()
	{
		$params = (object)$this->input->post();
		// remove the part that we don't need from the provided image and decode it
		if($params->logo){

			switch ($params->type_logo) {
				case 'image/png':
					$ext = 'png';
					break;
				case 'image/jpeg':
					$ext = 'jpg';
					break;
			}

			$data_logo = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $params->logo));
			$filepath = "assets/dokumen/gambar/lembaga/logo/".$params->id.".".$ext; // or image.jpg
			chmod($filepath,0777);
			file_put_contents($filepath,$data_logo);
			$params->logo = $filepath;
		}

		if($params->foto){

			switch ($params->type_foto) {
				case 'image/png':
					$ext = 'png';
					break;
				case 'image/jpeg':
					$ext = 'jpg';
					break;
			}
			$data_foto = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $params->foto));
			$filepath = "assets/dokumen/gambar/lembaga/foto/".$params->id.".".$ext; // or image.jpg
			chmod($filepath,0777);
			file_put_contents($filepath,$data_foto);
			$params->foto = $filepath;
		}

		$data = $this->Model_siaran->updateLembaga($params);
		header('Content-Type: application/json');
		echo json_encode(array("status" => TRUE));

	}

}
