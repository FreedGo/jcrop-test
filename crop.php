<?php
header("Content-type: text/html; charset=utf-8");
	$crop = $_POST['crop'];
	if($crop) {
		$targ_w = $targ_h = 200;
		$src = $crop['path'];
		$pathinfo = pathinfo($src);
		$filename = 'upload/small_'.$pathinfo['basename'];

		$img_r = imagecreatefromjpeg($src); //从url新建一图像
		$dst_r = imagecreatetruecolor($targ_w, $targ_h); //创建一个真色彩的图片源 
		imagecopyresampled($dst_r, $img_r, 0, 0, $crop['x'], $crop['y'], $targ_w, $targ_h, $crop['w'], $crop['h']);
		imagejpeg($dst_r, $filename, 90);

		$data["url"]=$filename;
		echo json_encode($data);
		exit();

	}

/**
* 裁剪不同图像的类
*/
class cutImages
{
	private $filename;  //原文件全路径
	private $x; //横坐标
	private $y; //纵坐标
	private $x1; //源图宽
	private $y1; //源图高
	private $ext; //文件后缀
	private $width=200; //宽
	private $height=200; //高
	private $jpeg_quality=90; //图片生成的保真度  范围0（质量最差）-100（质量最好）


	function __construct()
	{
		
	}

	public function initialize($filename, $x, $y, $x1, $y1) {
		if(file_exists($filename)) {
			$this->filename = $filename;
			$pathinfo = pathinfo($filename);
			$this->ext = strtolower($pathinfo['extension']); //将扩展名转换为小写
		}else {
			$err = new Exception ('文件不存在！', 1050);
			throw $err;
		}

		$this->x = $x;
		$this->y = $y;
		$this->x1 = $x1;
		$this->y1 = $y1;
	}

	/**
	 * 生成截图
	 * 根据不同的图片格式生成不同的截图
	*/
	public function generateShot() {
		switch ($this->ext) {
			case 'jpg':
				$this-> generateJpg();
				break;
			case 'png':
				$this-> generatePng();
				break;
			case 'gif':
				$this-> generateGif();
				break;
			default:
				return false;
		}
	}

	/**
	 * 获取生成的小图文件
	 *
	*/
	public function getShotName() {
		$pathinfo = pathinfo($this->filename);
		$fileinfo = explode('.', $pathinfo['basename']);
		$cutfilename = $fileinfo[0].'_small'.$this->ext;
		return $pathinfo['dirname'].'/'.$cutfilename;
	}

	/**
	 *生成jpg格式图片
	*/
	public function generateJpg() {
		$shotname = $this->getShotName();
		$img_r = imagecreatefromjpeg($this->filename);
		$dst_r = imagecreatetruecolor($this->width, $this->height);
		imagecopyresampled($dst_r, $img_r, 0, 0, $this->x, $this->y, $this->width, $this->height, $this->x1, $this->y1);
		imagejpeg($dst_r, $shotname, $this->jpeg_quality);
		return $shotname;
	}

	/**
	 *生成png格式图片
	*/
//	public function generatePng() {
//		$shotname = $this->getShotName();
//		$img_r = imagecreatefrompng($this->filename);
//		$dst_r = imagecreatetruecolor($this->width, $this->height);
//		imagecopyresampled($dst_r, $img_r, 0, 0, $this->x, $this->y, $this->width, $this->height, $this->x1, $this->y1);
//		imagepng($dst_r, $shotname, $this->jpeg_quality);
//		return $shotname;
//	}

	/**
	 *生成gif格式图片
	*/
//	public function generateGif() {
//		$shotname = $this->getShotName();
//		$img_r = imagecreatefromgif($this->filename);
//		$dst_r = imagecreatetruecolor($this->width, $this->height);
//		imagecopyresampled($dst_r, $img_r, 0, 0, $this->x, $this->y, $this->width, $this->height, $this->x1, $this->y1);
//		imagegif($dst_r, $shotname, $this->jpeg_quality);
//		return $shotname;
//	}
}

?>