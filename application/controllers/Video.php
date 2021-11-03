<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video extends CI_Controller {

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
		$this->load->model('Model_video');
		$this->logs = $this->session->all_userdata();
		$this->logged = $this->session->userdata('userLogged');
		$this->kategori = $this->session->userdata('kategori');
		$this->username = $this->session->userdata('username');
		$this->kotaKab = $this->session->userdata('kotaKab');
		$this->role = $this->session->userdata('role');
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

	public function listvideo()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){

				$this->twig->display('admin/listvideo.html', $this->content);
			}
		}else{
			redirect("dashboard");
		}
	}

	public function listDataVideo()
	{
		if ($this->logged)
		{
			if($this->role == '10' || $this->role == '20' || $this->role == '30'){
				$params = $columns = $totalRecords = $data = array();
				$params = $_REQUEST;
				$postData = $this->input->post('param');

				$query = $this->Model_video->listDataVideo($postData);
				$x = 0;
				$i=0;
				foreach ($query as $proses) {
					$x++;
					$row = array();
					$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
					$row['judul'] = (!empty($proses->judul) ? $proses->judul : "NULL");
					$row['url'] = (!empty($proses->url) ? $proses->url : "NULL");
					$row['path'] = (!empty($proses->path) ? $proses->path : "NULL");
					$row['desc'] = (!empty($proses->desc) ? $proses->desc : "NULL");
					$row['create_by'] = (!empty($proses->create_by) ? $proses->create_by : "NULL");
					$row['create_date'] = (!empty($proses->create_date) ? $proses->create_date : "NULL");
					$row['update_date'] = (!empty($proses->update_date) ? $proses->update_date : "NULL");

					$data[] = $row;
				}

				header('Content-Type: application/json');
				echo json_encode($data);
			}
		}else{
			$params = $columns = $totalRecords = $data = array();
			$params = $_REQUEST;
			$postData = $this->input->post('param');

			$query = $this->Model_video->listDataVideo($postData);
			$x = 0;
			$i=0;
			foreach ($query as $proses) {
				$x++;
				$row = array();
				$row['id'] = (!empty($proses->id) ? $proses->id : "NULL");
				$row['judul'] = (!empty($proses->judul) ? $proses->judul : "NULL");
				$row['url'] = (!empty($proses->url) ? $proses->url : "NULL");
				$row['path'] = (!empty($proses->path) ? $proses->path : "NULL");
				$row['desc'] = (!empty($proses->desc) ? $proses->desc : "NULL");
				$row['create_by'] = (!empty($proses->create_by) ? $proses->create_by : "NULL");
				$row['create_date'] = (!empty($proses->create_date) ? $proses->create_date : "NULL");
				$row['update_date'] = (!empty($proses->update_date) ? $proses->update_date : "NULL");

				$data[] = $row;
			}

			header('Content-Type: application/json');
			echo json_encode($data);
		}


	}

	public function addvideo()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){
			$params = (object)$this->input->post();
 	        $data = $this->Model_video->save($params);
					header('Content-Type: application/json');
					echo json_encode(array("status" => TRUE));
				}
		}
		else
		{
			redirect("listvideo");
		}
	}


	public function updatevideo()
	{
		if ( $this->logged)
		{
			if($this->role == '10' || $this->role == '20'){
			$params = (object)$this->input->post();
		 	$data = $this->Model_video->update($params);
			header('Content-Type: application/json');
		 	echo json_encode(array("status" => TRUE));
		}
		}
		else
		{
			redirect("dashboard");
		}
	}

	public function deletevideo($id = NULL)
	{
		$postData = $this->input->post('param');

		$this->Model_video->delete($postData);
		header('Content-Type: application/json');
		echo json_encode(array("status" => TRUE));
	}

}
