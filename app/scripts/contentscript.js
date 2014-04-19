'use strict';

(function($, window, document, undefined) {
  var repoAuthor = $('.author').text(),
      repoName   = $('.js-repo-home-link').text(),
      $ghtButton,
      $ghtFileView,
      $fileNavigation,
      $filesBubble,
      $filesTable,
      $readme,
      $detailsContainer,
      $jsDirectoryLinks;

  function insertPjaxResponse(pjaxResponse) {
    var tmpFileNav = $(pjaxResponse).find('.file-navigation');

    // Swap out the file navigation section
    $fileNavigation.replaceWith(tmpFileNav);
    $fileNavigation = $('.file-navigation');

    // Replace our file view w/ the given pjax response and remove the
    // file-history-tease section for cleanliness.
    $ghtFileView.html(pjaxResponse.innerHTML);
    $('.file-history-tease').remove();
  }

  function openFile(link) {
    // https://github.com/emberjs/ember.js/blob/master/packages/loader/package.json?_pjax=%23js-repo-pjax-container
    var $link = $(link),
        pjaxUrl = "https://github.com" + $link.attr('href') +
          "?_pjax=" + window.encodeURIComponent('#ght-tree');

    console.log("pjaxUrl: ", pjaxUrl);

    $.ajax({
      url: pjaxUrl,
      type: 'GET',
      headers: { 'X-PJAX': true, 'X-PJAX-Container': '#ght-tree' },
      success: function(data, textStatus, jqXHR) {
        var pjaxResponse = $(data)[2];
        insertPjaxResponse(pjaxResponse);
      }
    });
  }

  function openDirectory(link) {
    console.log('openDirectory! - link: ', link);
  }

  function treeClick(e) {
    var $this = $(this);

    if (isLinkDirectory($this)) {
      openDirectory(this);
    } else {
      openFile(this);
    }

    $readme.remove();

    // Stop propagation as GH has their own click handler delegate to do
    // pjax stuffs. preventDefault to stop the fall back anchor tag.
    e.stopPropagation();
    e.preventDefault();
  }

  function isLinkDirectory(link) {
    var $icon = $(link).closest('.content').siblings('.icon');
    return $icon.find('.octicon-file-directory').length > 0;
  }

  function openTreeView() {
    // Setup our tree section
    $filesBubble.addClass('ght-files-bubble');
    $detailsContainer.html('<h3>' + repoName + ' GH Tree </h3>');
    $filesTable.find('.message, .age').remove();

    // Bind our treeClick event
    $jsDirectoryLinks.on('click', treeClick);

    // Insert our ghtFileView and the filesBubble, fileView, and README in our
    // container view for styling.
    $filesBubble.after($ghtFileView);
    $($filesBubble.selector + ', #ght-file-view, #readme').wrapAll('<div class="ght-container"></div>');

    // Move the README to the file view
    $readme.addClass('ght-readme');

    // Cleanup fileNavigation section
    // - Remove GH Tree && pull request buttons 
    // - Remove file-naviagtion top margin via removing .in-mid-page class
    // - Swap new-file-link w/ README title
    $('.ght-button').remove();
    $('.new-file-link').replaceWith('<strong>README.md</strong>');
    $fileNavigation.find('.minibutton.compact').remove();
    $fileNavigation.removeClass('in-mid-page');

    // Remove the unneeded headers && shrink the sidebar. Love that GH has this
    // setup with a simple class! Made this super easy on me.
    $('.repository-meta.js-details-container').remove();
    $('.overall-summary ~ .tooltipped').remove();
    $('.overall-summary').remove();
    $('.repository-with-sidebar').removeClass('with-full-navigation');
  }


  function initSelectors() {
    // GHT DOM Elements
    $ghtButton = $('<a>GH Tree</a>').addClass('minibutton ght-button');
    $ghtButton.on('click', openTreeView);
    $ghtFileView = $('<div></div>').attr('id', 'ght-file-view');

    // GitHub DOM Elements
    $readme = $('#readme');
    $fileNavigation = $('.file-navigation.in-mid-page');
    $filesTable = $('table.files');
    $filesBubble = $('.bubble.files-bubble');
    $detailsContainer = $('.files-bubble .js-details-container');
    $jsDirectoryLinks = $('.js-directory-link');
  }

  function init() {
    initSelectors();
    $fileNavigation.prepend($ghtButton);
  }


  if (repoAuthor && repoName) {
    init();
  }
})(window.jQuery, window, document);
