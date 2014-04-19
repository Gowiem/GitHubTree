'use strict';

(function($, window, document, undefined) {
  var repoAuthor = $('.author').text(),
      repoName   = $('.js-repo-home-link').text(),
      $ghtButton,
      $ghtFileView,
      $fileNavigation,
      $filesBubble,
      $filesTable,
      $detailsContainer,
      $jsDirectoryLinks;

  function initSelectors() {
    // GHT DOM Elements
    $ghtButton = $('<a>GH Tree</a>').addClass('minibutton ght-button');
    $ghtButton.on('click', openTreeView);
    $ghtFileView = $('<div></div>').attr('id', 'ght-file-view');

    // GitHub DOM Elements
    $fileNavigation = $('.file-navigation.in-mid-page');
    $filesTable = $('table.files');
    $filesBubble = $('.bubble.files-bubble');
    $detailsContainer = $('.files-bubble .js-details-container');
    $jsDirectoryLinks = $('.js-directory-link');
  }

  function insertPjaxResponse(pjaxResponse) {
    var tmpFileNav = $(pjaxResponse).find('.file-navigation');

    // Swap out the file navigation section
    $fileNavigation.replaceWith(tmpFileNav);
    $fileNavigation = $('.file-navigation');
    $fileNavigation.addClass('in-mid-page');
    $fileNavigation.prepend($ghtButton);

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
    $filesBubble.addClass('ght-files-bubble ght-clearfix');
    $detailsContainer.html('<h3>' + repoName + ' GH Tree </h3>');
    $filesTable.find('.message, .age').remove();
    $jsDirectoryLinks.unbind('click');
    $jsDirectoryLinks.on('click', treeClick);

    $filesBubble.after($ghtFileView);
    $($filesBubble.selector + ', #ght-file-view').wrapAll('<div class="ght-container"></div>');

    $('#readme').remove();
  }

  function init() {
    initSelectors();
    $fileNavigation.prepend($ghtButton);
  }


  if (repoAuthor && repoName) {
    init();
  }
})(window.jQuery, window, document);
