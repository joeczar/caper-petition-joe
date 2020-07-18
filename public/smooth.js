(function () {
    // smooth scroll on home slides
    $(document).ready(function () {
        // Add smooth scrolling to all links
        $('a').on('click', function (event) {
            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== '') {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                $('html, body').animate(
                    {
                        scrollTop: $(hash).offset().top,
                    },
                    800,
                    function () {
                        window.location.hash = hash;
                    }
                );
            }
        });
    });
    /////////////  LOGOUT HANDLER  ///////////////////
    $('#logoutLink').on('click', () => {
        $('#logoutDropdown').animate(
            {
                top: '0px',
            },
            500
        );
        $('#cancelSignOut').on('click', (e) => {
            e.preventDefault();

            $('#logoutDropdown').animate(
                {
                    top: '-200px',
                },
                500
            );
        });
        $('#logoutBtn').on('click', () => {
            console.log('Logout');
        });
    });

    /////////////////  DELETE SIGNATURE HANDLER //////////////////
    $('#deleteSigBtn').on('click', (e) => {
        e.preventDefault();
        const result = window.confirm(
            'Are you sure you want to delete your signature?'
        );
        if (result) {
            $('#deleteSig').submit();
        }
    });
})();
