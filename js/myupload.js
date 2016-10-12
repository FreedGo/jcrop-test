$(function(){

	$("#fileUpload").uploadify({
		'auto'          : true, //选择图片后是否自动上传
		'multi'         : false, //是否允许同时选择多个(false一次只允许选中一张图片) 
		'method'		: 'post',
		'swf'           : 'images/uploadify.swf?v=' + ( parseInt(Math.random()*1000) ),
		'uploader'      : 'imgReceive.php', //上传的接收者
		'folder'        : 'upload', //上传图片的存放地址
		'fileObjName'	: 'fileUpload',
		'queueSizeLimit': 1, //最多能选择加入的文件数量 
		'height'        : '120px',
		'width'         : '120px',
		'fileSizeLimit'	: '2MB',
		'progressData'  : 'percentage',
		'fileTypeExts'	: '*.jpg; *.jpeg; *.png; *.gif;',
		'overrideEvents': ['onSelectError','onDialogClose','onQueueComplete'],
		'onSelectError' : function(file) {
			alert('请将图片的大小限制在2MB以下!');
		},
		'onUploadSuccess': function(file, data, response){
			$("body").append('<div class="mask"></div>');
			$("#previewWrapper").show();
			var rst = JSON.parse(data);
			if( rst.status == 0){
				var $errorTip = $("<div id='errorMsg'>上传失败："+ rst.info +"</div>");
				$("#previewBox").append($errorTip);
			}else{
				var imageData = rst.data;
				var imageUrl = imageData.path //图片地址
				var $image = $("<img />");
				var previewBox = $("#previewBox");
				previewBox.append( $image );
				previewBox.children('img').attr('src', imageUrl +'?t='+ Math.random());
				$("#img_url").val(imageUrl);
				$image.attr('id', 'previewImg');
				var $previewImg = $("#previewImg");
				var img = new Image();
				img.src = imageUrl +'?t='+ Math.random();
				img.onload = function() {
					var img_width = 0,
						img_height = 0,
						real_width = img.width,
						real_height = img.height;
					if (real_width > real_height && real_width > 400) {
						var ratio = real_width / 400;
						real_width = 400;
						real_height = real_height / ratio;
					}else if(real_height > real_width && real_height > 400) {
						var ratio = real_height / 400;
						real_height = 400;
						real_width = real_width /ratio;
					}
					if(real_height < 400) {
						img_height = (400 - real_height)/2;
					}
					if (real_width < 400) {
						img_width = (400- real_width)/2;
					}
					previewBox.css({
						width: (400 - img_width) + 'px', 
						height: (400 - img_height) + 'px',
						paddingTop: (400 - real_height)/2
					});
				}
				$("#previewImg").Jcrop({
					bgFade : true,
					aspectRatio : 1,
					bgOpacity : .3,
					minSize : [120, 120],
					boxWidth : 400,
					boxHeight : 400,
					allowSelect: false, //是否可以选区，
                    allowResize: true, //是否可以调整选区大小
					onChange : showPreview, //选框改变时的事件
                    onSelect: showPreview,  //选框选定时的事件
					setSelect : [0, 0, 400, 400]
				});
			}
		}
	});

	//提交裁剪好的图片
	var CutJson = {};

	function showPreview(coords) {
		var img_width = $("#previewImg").width();
		var img_height = $("#previewImg").height();
		var img_url = $("#img_url").val();
		CutJson = {
			'path': img_url,
			'x': Math.floor(coords.x),
			'y': Math.floor(coords.y),
			'w': Math.floor(coords.w),
			'h': Math.floor(coords.h)
		};
	}

	//取消操作
	$("#cancel").click(function() {
		$("#previewBox").find('*').remove();
		$("#previewWrapper").hide();
		$(".mask").remove();
	});

	//确认裁剪
	$("#confirm").click(function() {
		$.ajax({
			url: 'crop.php',
			type: 'POST',
			dataType: 'json',
			data: {'crop': CutJson},
			success: function(data, status, xhr) {
				// console.log(data);
				$("#avatar").attr("src",data.url);
				$("#previewBox").find('*').remove();
				$("#previewWrapper").hide();
				$(".mask").remove();
			}
		});	
	})
	
})