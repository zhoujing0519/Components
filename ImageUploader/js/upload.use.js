var uploadSwitch = document.getElementById('uploadSwitch'),
	uploadContainer = uploadSwitch.nextElementSibling;

var upload = new Upload({
	container: uploadContainer
});

uploadSwitch.onclick = function(e){
	e = e || window.event;
	e.stopPropagation();

	if(hasClass(uploadContainer, 'open')){
		removeClass(uploadContainer, 'open');
	}else{
		addClass(uploadContainer, 'open');
	}

	upload.clear();
	upload.render();
};
