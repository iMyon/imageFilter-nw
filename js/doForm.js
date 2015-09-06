var filter = require("./node/lib/filter.js");

function	submit() {
	$("#sub_filter").removeAttr('disabled');
	// $("#sub_filter").attr("disabled", "disabled");
	var filter_form = document.querySelector("#fm_filter");
	var form = {};
	form.path = filter_form.file.value;
	form.width = filter_form.width.value;
	form.height = filter_form.height.value;
	form.w_cmp_type = filter_form.w_cmp_type.value;
	form.h_cmp_type = filter_form.h_cmp_type.value;
	form.opt_ratio = filter_form.opt_ratio.checked;
	form.ratio_width = filter_form.ratio_width.value;
	form.ratio_height = filter_form.ratio_height.value;
	form.ratio_float = filter_form.ratio_float.value;
	filter.init(form);
	document.querySelector("#match_count").innerHTML = filter.getCount();
	filter.run(form.path, form, function(file, count) {
		document.querySelector("#match_count").innerHTML = count;
	});
	// $("#sub_filter").removeAttr('disabled');
}

$(document).ready(function() {
		$('#fm_filter').bootstrapValidator({
			message: 'This value is not valid',
			submitHandler: submit,
			feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
	    },
			fields: {
				// file: {
				// 	message: 'The Folder is not valid',
				// 	validators: {
				// 		notEmpty: {
				// 			message: 'The Folder is required and cannot be empty'
				// 		}
				// 	}
				// },
				width: {
					validators: {
						notEmpty: {
							message: 'The Width is required and cannot be empty'
						},
						digits: {
							message: 'The Width requires digits'
						}
					}
				},
				height: {
					validators: {
						notEmpty: {
							message: 'The height is required and cannot be empty'
						},
						digits: {
							message: 'The height requires digits'
						}
					}
				},
				ratio_float: {
					validators: {
						numeric: {
							message: 'The Float requires numeric'
						}
					}
				},
				ratio_width: {
					validators: {
						digits: {
							message: 'The Ratio Width requires digits'
						}
					}
				},
				ratio_height: {
					validators: {
						digits: {
							message: 'The ratio height requires digits'
						}
					}
				}
			}
		});
		//change input-file text
		// $('#choose_folder').inputFileText( { text: 'Choose Images\' Folder' } );
		$("#span-files").click(function(){
			$('#choose_folder').click();
		});
		$('#choose_folder').change(function(){
			$("#drag_folder")[0].value = this.value;
	  	$("#span-files").html(this.value);
	  	$("#span-files").addClass('filled');
		});

		//handle grag
		window.ondragover = function(e) { e.preventDefault(); return false };
		window.ondrop = function(e) { e.preventDefault(); return false };

		var holder = document.body;
		holder.ondrop = function (e) {
		  e.preventDefault();

		  for (var i = 0; i < e.dataTransfer.files.length; ++i) {
		  	$("#drag_folder").attr("value", e.dataTransfer.files[i].path);
		  	$("#span-files").html(e.dataTransfer.files[i].path);
		  	$("#span-files").addClass('filled');
		    // console.log(e.dataTransfer.files[i].path);
		  }
		  return false;
		};
});