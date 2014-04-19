'use strict';

(function($, window, document, undefined) {
  var repoAuthor = $('.author').text(),
      repoName   = $('.js-repo-home-link').text(),
      $ghtButton,
      $ghtFileView,
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
    $filesTable = $('table.files');
    $filesBubble = $('.bubble.files-bubble');
    $detailsContainer = $('.files-bubble .js-details-container');
    $jsDirectoryLinks = $('.js-directory-link');
  }

  function openFile(link) {
    // https://github.com/emberjs/ember.js/blob/master/packages/loader/package.json?_pjax=%23js-repo-pjax-container
    var $link = $(link),
        pjaxUrl = "https://github.com" + $link.attr('href') + "?_pjax=" + window.encodeURIComponent('#ght-tree');

    console.log("pjaxUrl: ", pjaxUrl);

    $.ajax({
      url: pjaxUrl,
      type: 'GET',
      headers: { 'X-PJAX': true, 'X-PJAX-Container': '#ght-tree' },
      success: function(data, textStatus, jqXHR) {
        var pjaxResponse = $(data)[2];
        $ghtFileView.html(pjaxResponse.innerHTML);
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
    $('.file-navigation.in-mid-page').prepend($ghtButton);
  }


  if (repoAuthor && repoName) {
    init();
  }
})(window.jQuery, window, document);
