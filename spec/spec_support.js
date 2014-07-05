(function() {

  if (/^2\./.test(jQuery.fn.jquery)) {
    // jQuery 2 leaks globals, but mocha.globals slows down testing
    mocha.globals([ 'jQuery*' ]);
  }

}());
