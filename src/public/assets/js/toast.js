function showToast(data) {
    if (data.type == `success`) {
        $.toast({
            text: `${data.msg}`,
            heading: 'Success!',
            icon: 'success',
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 2000,
            stack: 5,
            position: 'top-right',
        });
    } else if (data.type == `error`) {
        $.toast({
            text: `${data.msg}`,
            heading: 'Failed!',
            icon: 'error',
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 2000,
            stack: 5,
            position: 'top-right',
        });
    }
}