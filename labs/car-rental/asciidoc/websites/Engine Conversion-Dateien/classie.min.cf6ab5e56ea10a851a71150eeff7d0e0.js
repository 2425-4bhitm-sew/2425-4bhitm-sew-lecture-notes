/*
 classie - class helper functions
 from bonzo https://github.com/ded/bonzo

 classie.has( elem, 'my-class' ) -> true/false
 classie.add( elem, 'my-new-class' )
 classie.remove( elem, 'my-unwanted-class' )
 classie.toggle( elem, 'my-class' )
*/
(function(h){function f(a,b){(c(a,b)?d:e)(a,b)}if("classList"in document.documentElement){var c=function(a,b){return a.classList.contains(b)};var e=function(a,b){a.classList.add(b)};var d=function(a,b){a.classList.remove(b)}}else c=function(a,b){return(new RegExp("(^|\\s+)"+b+"(\\s+|$)")).test(a.className)},e=function(a,b){c(a,b)||(a.className=a.className+" "+b)},d=function(a,b){a.className=a.className.replace(new RegExp("(^|\\s+)"+b+"(\\s+|$)")," ")};var g={hasClass:c,addClass:e,removeClass:d,toggleClass:f,
has:c,add:e,remove:d,toggle:f};"function"===typeof define&&define.amd?define(g):h.classie=g})(window);