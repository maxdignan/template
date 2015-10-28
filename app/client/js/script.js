(function() {


    var nav = document.getElementById('nav');
    document.getElementById('openButton').addEventListener('click', function(e) {
        nav.classList.add('open');
    });

    document.getElementById('closeButton').addEventListener('click', function(e) {
        nav.classList.remove('open');
    });

})();
